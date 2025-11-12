from sme.models import BusinessProfile, CACDocument, BusinessVideo
from users.models import User
from django.conf import settings
import google.genai as genai
from mimetypes import guess_type
import logging

# Configure logger
logger = logging.getLogger(__name__)

class PulseEngine:
    """
    The Core "Pulse Engine" AI Service.
    Implements real AI analysis for CAC and Video.
    Implements real bank name comparison from Mono.
    """
    def __init__(self, user: User, bank_account_name: str):
        self.user = user
        self.bank_account_name = bank_account_name # Store the name
        self.score = 0
        self.fail_reasons = []
        self.client = genai.Client(api_key=settings.GOOGLE_AI_API_KEY)
        self.generation_config = {
            "temperature": 0.2,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 256,
        }
        self.safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]


    def run_verification(self) -> (int, str):
        # 1. Fetch "Stated Truth"
        try:
            self.profile = BusinessProfile.objects.get(user=self.user)
        except BusinessProfile.DoesNotExist:
            self.fail_reasons.append("Business Profile (Stated Truth) is missing.")
            return 0, "Business Profile is missing."

        # 2. Run AI Analysis & Cross-Referencing
        self.verify_cac_vs_stated()       # REAL AI
        self.verify_bank_vs_stated()      # REAL COMPARISON
        self.verify_video_vs_stated()     # REAL AI

        final_score = max(0, min(100, self.score))
        fail_reason_str = "; ".join(self.fail_reasons) if self.fail_reasons else None
        
        return final_score, fail_reason_str

    def verify_cac_vs_stated(self):
        """
        Performs REAL OCR on CAC and compares to Stated Truth
        """
        try:
            cac_doc = CACDocument.objects.get(user=self.user)
        except CACDocument.DoesNotExist:
            self.score -= 40
            self.fail_reasons.append("CAC document missing.")
            return

        try:
            # Read file from storage
            cac_file = cac_doc.cac_file
            cac_file.open(mode='rb')
            file_content = cac_file.read()
            cac_file.close()

            mime_type = guess_type(cac_file.name)[0]
            
            prompt = """
            You are an expert Nigerian CAC document analyst.
            Analyze this image of a Certificate of Incorporation or Business Name Registration.
            Extract *only* the registered business name, exactly as it appears.
            Do not add any other text, just the name.
            Example: "MY BUSINESS NIGERIA LTD"
            """
            
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=[
                    prompt,
                    {"mime_type": mime_type, "data": file_content}
                ],
                config=genai.types.GenerateContentConfig(
                    temperature=0.2,
                    top_p=1,
                    top_k=1,
                    max_output_tokens=256,
                    safety_settings=self.safety_settings
                )
            )
            
            extracted_name = response.text.strip().replace('"', '')
            cac_doc.extracted_name = extracted_name # Save for our records
            
            # Use 'in' for a more flexible match
            if self.profile.business_name.lower() in extracted_name.lower():
                self.score += 40 # Heavy weight for matching names
                cac_doc.verified = True
            else:
                self.score -= 40
                self.fail_reasons.append(f"CAC name ({extracted_name}) does not match profile name ({self.profile.business_name}).")
            
            cac_doc.save()
        
        except Exception as e:
            logger.error(f"CAC verification failed for {self.user.email}: {e}")
            self.score -= 40
            self.fail_reasons.append("AI analysis of CAC document failed.")

    def verify_bank_vs_stated(self):
        """
        Compares REAL Mono bank account name to Stated Truth.
        The name is fetched by the view and passed in.
        """
        if not self.bank_account_name:
            self.score -= 40
            self.fail_reasons.append("Bank account name could not be retrieved from Mono.")
            return

        # Real comparison. Use 'in' for flexibility (e.g., "My Biz LTD" vs "My Biz")
        if self.profile.business_name.lower() in self.bank_account_name.lower():
            self.score += 40 # Heavy weight for matching names
        else:
            self.score -= 40
            self.fail_reasons.append(f"Bank account name ({self.bank_account_name}) does not match profile name ({self.profile.business_name}).")

    def verify_video_vs_stated(self):
        """
        Performs REAL AI video analysis and compares to Stated Truth
        """
        try:
            video_doc = BusinessVideo.objects.get(user=self.user)
        except BusinessVideo.DoesNotExist:
            self.score -= 20
            self.fail_reasons.append("Business Video missing.")
            return

        try:
            # Read file from storage
            video_file_path = video_doc.video_file.path
            mime_type = guess_type(video_file_path)[0]
            
            # Upload file to Gemini File API first (good for large files)
            uploaded_file = self.client.files.upload(
                file=video_file_path,
                display_name=f"video_{self.user.id}"
            )
            # Wait for file to be processed
            while uploaded_file.state.name == "PROCESSING":
                pass # This is blocking, but fine for a hackathon

            if uploaded_file.state.name == "FAILED":
                raise Exception("Gemini file upload failed.")

            prompt = f"""
            Analyze this live video recording of a small business.
            The business owner states their industry is: '{self.profile.industry}'.
            The business name is '{self.profile.business_name}'.

            Analyze the video for visual cues (e.g., products, office, equipment, signage).
            1. Briefly summarize what you see.
            2. Based *only* on the visuals, state "YES" if this summary is consistent with the stated industry, or "NO" if it is not.

            Format your response as:
            Summary: [Your summary]
            Match: [YES/NO]
            """

            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=[prompt, uploaded_file],
                config=genai.types.GenerateContentConfig(
                    temperature=0.2,
                    top_p=1,
                    top_k=1,
                    max_output_tokens=256,
                    safety_settings=self.safety_settings
                )
            )

            # Clean up the file from Gemini
            self.client.files.delete(name=uploaded_file.name)

            response_text = response.text
            summary_line = next((line for line in response_text.split('\n') if line.startswith("Summary:")), "Summary: N/A")
            match_line = next((line for line in response_text.split('\n') if line.startswith("Match:")), "Match: NO")
            
            summary = summary_line.split(":", 1)[-1].strip()
            match = match_line.split(":", 1)[-1].strip()

            video_doc.video_summary = summary # Save for our records
            
            if match == "YES":
                self.score += 20
                video_doc.verified = True
            else:
                self.score -= 20
                self.fail_reasons.append(f"Video summary ({summary}) does not match stated industry ({self.profile.industry}).")
            
            video_doc.save()

        except Exception as e:
            logger.error(f"Video verification failed for {self.user.email}: {e}")
            self.score -= 20
            self.fail_reasons.append("AI analysis of business video failed.")
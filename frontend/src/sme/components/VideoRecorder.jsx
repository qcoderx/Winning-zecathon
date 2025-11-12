import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const VideoRecorder = ({ data, onComplete, onBack, canGoBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [stream, setStream] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const MAX_RECORDING_TIME = 60; // 60 seconds

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
      console.error('Camera access error:', err);
    }
  };

  const startRecording = () => {
    if (!stream) return;

    try {
      chunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo({ blob, url: videoUrl });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to start recording. Please try again.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const retakeVideo = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
    if (recordedVideo?.url) {
      URL.revokeObjectURL(recordedVideo.url);
    }
  };

  const handleContinue = () => {
    if (!recordedVideo) {
      setError('Please record a video before continuing.');
      return;
    }

    onComplete({ 
      videoData: {
        blob: recordedVideo.blob,
        duration: recordingTime,
        timestamp: new Date().toISOString()
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="bg-white dark:bg-pulse-dark rounded-xl shadow-soft p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-pulse-navy dark:text-white mb-2">
          Record Business Video
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Record a 30-60 second video showing your business location and operations
        </p>
      </div>

      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Recording Guidelines:</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Show your business signage or storefront</li>
            <li>• Include your products, services, or workspace</li>
            <li>• Speak clearly about what your business does</li>
            <li>• Keep recording between 30-60 seconds</li>
            <li>• Ensure good lighting and clear audio</li>
          </ul>
        </div>

        {/* Video Recording Area */}
        <div className="relative">
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {!stream && !recordedVideo && (
              <div className="flex items-center justify-center h-full">
                <motion.button
                  onClick={startCamera}
                  className="flex flex-col items-center gap-3 p-6 text-gray-600 dark:text-gray-400 hover:text-pulse-cyan"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-symbols-outlined text-4xl">videocam</span>
                  <span className="font-medium">Start Camera</span>
                </motion.button>
              </div>
            )}

            {stream && !recordedVideo && (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {recordedVideo && (
              <video
                src={recordedVideo.url}
                controls
                className="w-full h-full object-cover"
              />
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <motion.div
                className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
              </motion.div>
            )}

            {/* Timer */}
            {stream && !recordedVideo && (
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
              </div>
            )}
          </div>

          {/* Recording Controls */}
          {stream && !recordedVideo && (
            <div className="flex justify-center mt-4 gap-4">
              {!isRecording ? (
                <motion.button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-symbols-outlined">fiber_manual_record</span>
                  Start Recording
                </motion.button>
              ) : (
                <motion.button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-symbols-outlined">stop</span>
                  Stop Recording
                </motion.button>
              )}
            </div>
          )}

          {/* Recorded Video Controls */}
          {recordedVideo && (
            <div className="flex justify-center mt-4 gap-4">
              <motion.button
                onClick={retakeVideo}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="material-symbols-outlined">refresh</span>
                Retake Video
              </motion.button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600">error</span>
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between pt-8">
        {canGoBack && (
          <motion.button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
        )}
        
        <motion.button
          type="button"
          onClick={handleContinue}
          disabled={!recordedVideo}
          className="ml-auto px-8 py-3 pulse-gradient-bg text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: recordedVideo ? 1.02 : 1 }}
          whileTap={{ scale: recordedVideo ? 0.98 : 1 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

export default VideoRecorder;
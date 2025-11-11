# PulseFi Landing Page Animations

## Overview
Added comprehensive Framer Motion animations to make the landing page feel alive and interactive. All animations are subtle, performant, and enhance the user experience without being overwhelming.

## Animation Details by Component

### Header Component
- **Slide-in from top**: Header slides down with fade-in on page load
- **Logo pulse**: Heartbeat icon has subtle rotation and stroke animation
- **Navigation links**: Staggered fade-in with hover scale and lift effects
- **Sign Up button**: Scale and glow effects on hover/tap

### Hero Component
- **Background image**: Subtle scale animation on load
- **Heartbeat SVG**: Animated path drawing that loops infinitely
- **Title text**: Staggered fade-in with upward motion
- **Gradient text**: Animated background position for "Heartbeat" text
- **Buttons**: Scale effects with glowing shadows on hover

### Features Component
- **Section reveal**: Fade-in when scrolling into view
- **Card animations**: Staggered appearance with upward slide
- **Hover effects**: Cards lift and scale with shadow enhancement
- **Icon animations**: Icons rotate and scale on hover

### Process Component
- **Progress line**: Animated line that draws across the process steps
- **Step icons**: Staggered horizontal slide-in with subtle rotations
- **Investment steps**: Alternating slide-in from left/right
- **Video section**: Scale animation with pulsing play button

### Opportunities Component
- **Card grid**: Staggered fade-in animation for SME cards
- **Card hover**: Lift, scale, and shadow effects
- **Score animations**: Subtle pulsing of Pulse and Profit scores
- **Logo interactions**: Scale and rotate effects on company logos

### Footer Component
- **Section reveal**: Fade-in animation when in viewport
- **Logo animation**: Continuous subtle rotation of heartbeat icon
- **Link animations**: Slide-in effects with hover interactions
- **Staggered content**: All footer sections animate in sequence

## Animation Principles Used

1. **Scroll-triggered animations**: Using `useInView` hook for performance
2. **Staggered animations**: Creating natural, flowing sequences
3. **Hover micro-interactions**: Subtle feedback for all interactive elements
4. **Performance optimization**: Animations only trigger when elements are visible
5. **Consistent timing**: Standardized durations and easing functions
6. **Accessibility**: Respects user motion preferences

## Key Features

- **Smooth transitions**: All animations use optimized easing curves
- **Responsive design**: Animations work across all screen sizes
- **Performance focused**: Minimal impact on page load and scroll performance
- **Brand consistency**: Animations reflect the PulseFi brand personality
- **User engagement**: Subtle interactions that encourage exploration

## Technical Implementation

- **Framer Motion**: Primary animation library
- **useInView hook**: Scroll-triggered animations
- **CSS variables**: Consistent color animations
- **Transform animations**: GPU-accelerated for smooth performance
- **Stagger effects**: Coordinated timing for multiple elements
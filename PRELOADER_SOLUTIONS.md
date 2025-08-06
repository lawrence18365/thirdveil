# iOS Video Preloader Solutions - Implementation Guide

## The Problem
iOS Safari aggressively shows play button overlays on video elements, even with all the standard workarounds applied (muted, playsinline, autoplay attributes, CSS hacks, etc.). This has become increasingly difficult to prevent in recent iOS versions.

## Your Options (Ranked by Reliability)

### 🥇 Option 1: Image Sequence Animation (Most Reliable)
**Files:** `image-sequence-preloader.js`
**Reliability:** 100% - No video element = no play button
**Quality:** Excellent
**File Size:** Larger (multiple images)

**Implementation Steps:**
1. Extract frames from your video:
   ```bash
   ffmpeg -i media/preloader.mp4 -vf fps=30 media/frames/frame_%03d.jpg
   ```
2. Replace your current script tag in index.html:
   ```html
   <script src="image-sequence-preloader.js"></script>
   ```
3. Update the initialization in the script with your frame count

---

### 🥈 Option 2: Animated GIF/APNG (Simplest)
**Files:** `gif-preloader.js`
**Reliability:** 100% - Uses img element instead of video
**Quality:** Good (APNG) / Moderate (GIF)
**File Size:** Moderate

**Implementation Steps:**
1. Convert your video to GIF or APNG:
   ```bash
   # For GIF (smaller file, lower quality):
   ffmpeg -i media/preloader.mp4 -vf "fps=20,scale=360:-1:flags=lanczos" media/preloader.gif
   
   # For APNG (better quality, larger file):
   ffmpeg -i media/preloader.mp4 -vf "fps=30,scale=360:-1" -f apng media/preloader.apng
   ```
2. Replace your script tag:
   ```html
   <script src="gif-preloader.js"></script>
   ```

---

### 🥉 Option 3: CSS-Only Animation (Best Performance)
**Files:** `css-animation-preloader.css`, `css-animation-preloader.js`
**Reliability:** 100% - Pure CSS, no media elements
**Quality:** Different aesthetic (not video-like)
**File Size:** Tiny

**Implementation Steps:**
1. Add the CSS file to your head:
   ```html
   <link rel="stylesheet" href="css-animation-preloader.css">
   ```
2. Add a logo image at `media/logo.png` (or use text animation)
3. Replace your script tag:
   ```html
   <script src="css-animation-preloader.js"></script>
   ```

---

### 🎯 Option 4: Smart Detection with Fallback (Adaptive)
**Files:** `smart-preloader.js`
**Reliability:** 95% - Keeps video for desktop, elegant fallback for iOS
**Quality:** Excellent on desktop, good on mobile
**File Size:** Small

**Implementation Steps:**
1. Simply replace your script tag:
   ```html
   <script src="smart-preloader.js"></script>
   ```
2. This will automatically detect iOS and use an appropriate fallback

---

## Quick Fix (Immediate Implementation)

If you need the fastest solution right now, use **Option 4 (Smart Detection)**:

1. Back up your current `scripts.js`:
   ```bash
   cp scripts.js scripts-backup.js
   ```

2. Replace the preloader section in your scripts.js with the content from `smart-preloader.js`

3. Test on iOS device

---

## Testing Recommendations

1. **Test on Real Devices:** iOS Simulator doesn't always show the same behavior as real devices
2. **Test These Scenarios:**
   - First visit (no cache)
   - Return visit (cached)
   - Low power mode
   - Different iOS versions (15, 16, 17)
   - Both Safari and Chrome on iOS

---

## My Recommendation

Based on your setup and the premium nature of Third Veil:

**For Immediate Fix:** Use Option 4 (Smart Detection) - it's drop-in ready and maintains your video for desktop users.

**For Best Long-term Solution:** Convert to Option 1 (Image Sequence) or Option 2 (APNG) - these completely eliminate the iOS video problem while maintaining visual quality.

The nuclear option of removing the preloader entirely is not recommended as it's part of your brand experience, but you could consider making it desktop-only if none of these solutions work for your specific iOS version.

## Need Help?

- If ffmpeg commands fail, try online converters like CloudConvert or Convertio
- For image sequence, aim for 20-30 fps to balance quality and file size
- Consider using WebP format instead of JPG for better compression
- Test with Safari's Responsive Design Mode but verify on real device
// GIF/APNG Preloader Implementation
// This completely avoids video elements and their controls

function setupGifPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderVideo = document.getElementById('preloaderVideo');
    const mainContent = document.getElementById('main-content');
    
    if (!preloader) return;
    
    // Hide the video element completely
    if (preloaderVideo) {
        preloaderVideo.style.display = 'none';
        preloaderVideo.remove();
    }
    
    // Create animated image element
    const animatedImage = document.createElement('img');
    animatedImage.className = 'preloader-animation';
    animatedImage.style.cssText = `
        max-width: min(42vw, 360px);
        width: clamp(220px, 38vw, 360px);
        height: auto;
        display: block;
    `;
    
    // Use APNG for better quality or GIF for broader compatibility
    // APNG supports transparency and better compression
    animatedImage.src = 'media/preloader.apng'; // or 'media/preloader.gif'
    
    // Add to preloader
    preloader.appendChild(animatedImage);
    
    // Calculate animation duration (e.g., 3 seconds)
    const animationDuration = 3000;
    
    // Reveal after animation completes
    setTimeout(() => {
        preloader.classList.add('is-hidden');
        setTimeout(() => {
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.style.display = 'flex';
                mainContent.style.opacity = '1';
                mainContent.style.visibility = 'visible';
                mainContent.removeAttribute('aria-hidden');
            }
            if (preloader && preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 600);
    }, animationDuration);
}

// Convert your video to GIF/APNG using:
// For GIF: ffmpeg -i preloader.mp4 -vf "fps=20,scale=360:-1:flags=lanczos" -c:v gif media/preloader.gif
// For APNG: ffmpeg -i preloader.mp4 -vf "fps=30,scale=360:-1" -f apng media/preloader.apng

// Replace your current DOMContentLoaded with this:
document.addEventListener('DOMContentLoaded', setupGifPreloader);
// CSS Animation Preloader Implementation
function setupCSSPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderVideo = document.getElementById('preloaderVideo');
    const mainContent = document.getElementById('main-content');
    
    if (!preloader) return;
    
    // Remove video element entirely
    if (preloaderVideo) {
        preloaderVideo.remove();
    }
    
    // Clear preloader content
    preloader.innerHTML = '';
    
    // Option A: Use a static logo image with CSS animations
    const logoImage = document.createElement('img');
    logoImage.src = 'media/logo.png'; // Your Third Veil logo
    logoImage.alt = 'Third Veil';
    logoImage.className = 'preloader-logo-animated';
    preloader.appendChild(logoImage);
    
    // Option B: Or use animated text (uncomment if preferred)
    /*
    const textContainer = document.createElement('div');
    textContainer.className = 'preloader-text-animated';
    const text = 'THIRD VEIL';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
        textContainer.appendChild(span);
    });
    preloader.appendChild(textContainer);
    
    // Add decorative line
    const line = document.createElement('div');
    line.className = 'preloader-line';
    preloader.appendChild(line);
    */
    
    // Set animation duration (match your CSS animation)
    const animationDuration = 3000;
    
    // Reveal site after animation
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', setupCSSPreloader);
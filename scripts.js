/**
 * Home page preloader: play full video, then reveal content.
 * Only runs if #preloader exists (i.e., on index.html).
 *
 * Universal experience (503KB optimized):
 * - All devices get the complete beautiful animation
 * - Ensure muted, inline autoplay on iOS (no big play button)
 * - Programmatic play() attempt; on failure, one-time user-gesture fallback
 * - Wait for full video completion before revealing site
 */
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const preloaderVideo = document.getElementById('preloaderVideo');
    const mainContent = document.getElementById('main-content');

    // If no preloader on this page, just ensure main content visible.
    if (!preloader || !preloaderVideo) {
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.removeAttribute('aria-hidden');
        }
        return;
    }

    // Prepare main content to be shown after video completes
    if (mainContent) {
        mainContent.classList.add('hidden');
        mainContent.setAttribute('aria-hidden', 'true');
    }

    // Feature-detect a "mobile" context without breaking desktop:
    // Small viewport OR iOS userAgent implies mobile handling.
    const isSmallViewport = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const ua = (navigator.userAgent || '').toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isMobile = isSmallViewport || isIOS;

    // COMPREHENSIVE iOS FIX: Multiple layers of defense against play button
    
    // Layer 1: Essential attributes for iOS autoplay
    preloaderVideo.setAttribute('muted', '');
    preloaderVideo.muted = true;
    preloaderVideo.setAttribute('playsinline', '');
    preloaderVideo.setAttribute('webkit-playsinline', '');
    preloaderVideo.setAttribute('x5-playsinline', ''); // For some Android browsers
    preloaderVideo.playsInline = true;
    preloaderVideo.autoplay = true;
    preloaderVideo.defaultMuted = true; // Extra insurance
    
    // Layer 2: Disable all forms of controls
    preloaderVideo.controls = false;
    preloaderVideo.removeAttribute('controls');
    preloaderVideo.setAttribute('disablepictureinpicture', '');
    preloaderVideo.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
    
    // Layer 3: Add custom CSS styles programmatically (belt and suspenders)
    const injectStyles = () => {
        // Check if styles already injected
        if (!document.getElementById('ios-video-fix')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'ios-video-fix';
            styleSheet.innerHTML = `
                #preloaderVideo {
                    pointer-events: none !important;
                    -webkit-tap-highlight-color: transparent !important;
                    -webkit-touch-callout: none !important;
                    -webkit-user-select: none !important;
                    user-select: none !important;
                }
                #preloaderVideo::-webkit-media-controls,
                #preloaderVideo::-webkit-media-controls-container,
                #preloaderVideo::-webkit-media-controls-start-playback-button,
                #preloaderVideo::-webkit-media-controls-overlay-play-button,
                #preloaderVideo::-webkit-media-controls-panel,
                #preloaderVideo::-webkit-media-controls-play-button,
                #preloaderVideo::-webkit-media-controls-enclosure {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    position: absolute !important;
                    top: -9999px !important;
                    pointer-events: none !important;
                    width: 0 !important;
                    height: 0 !important;
                    transform: scale(0) !important;
                }
                /* iOS-specific using supports */
                @supports (-webkit-touch-callout: none) {
                    #preloaderVideo::-webkit-media-controls-start-playback-button {
                        display: none !important;
                        -webkit-appearance: none !important;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    };
    
    // Layer 4: Create invisible overlay div to block any interaction
    const createBlocker = () => {
        const blocker = document.createElement('div');
        blocker.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            background: transparent;
            pointer-events: auto;
        `;
        preloader.appendChild(blocker);
        
        // Prevent all interactions on the blocker
        blocker.addEventListener('click', (e) => e.preventDefault(), true);
        blocker.addEventListener('touchstart', (e) => e.preventDefault(), true);
        blocker.addEventListener('touchend', (e) => e.preventDefault(), true);
    };
    
    // Layer 5: Programmatic play with promise handling
    const forcePlay = () => {
        const playPromise = preloaderVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Video is playing successfully
                console.log('Video autoplay successful');
            }).catch(error => {
                // Autoplay was prevented, try again on first interaction
                console.log('Autoplay blocked, waiting for user interaction');
                const playOnInteraction = () => {
                    preloaderVideo.play();
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('click', playOnInteraction);
                };
                document.addEventListener('touchstart', playOnInteraction, { once: true, passive: true });
                document.addEventListener('click', playOnInteraction, { once: true });
            });
        }
    };
    
    // Apply all fixes
    injectStyles();
    createBlocker();
    
    // Try to play immediately and after DOM ready
    if (document.readyState === 'complete') {
        forcePlay();
    } else {
        window.addEventListener('load', forcePlay);
    }
    
    // Additional attempt after a short delay (iOS sometimes needs this)
    setTimeout(forcePlay, 100);

    // Reveal logic shared by desktop/mobile
    const reveal = () => {
        preloader.classList.add('is-hidden');
        
        // Show main content with smooth entrance
        if (mainContent) {
            mainContent.classList.remove('hidden');
            mainContent.removeAttribute('aria-hidden');
        }
        
        // Remove preloader from DOM after animation completes
        setTimeout(() => {
            if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 1400); // match CSS transition duration
    };

    // All devices now get the full beautiful animation experience
    // With 503KB optimization, mobile can handle the complete video
    const setupFullVideoFlow = () => {
        const finish = () => {
            reveal();
        };
        preloaderVideo.addEventListener('ended', finish);

        // Robustness fallback in case 'ended' never fires
        const FALLBACK_MS = 3800;
        const fallbackTimer = setTimeout(() => {
            preloaderVideo.removeEventListener('ended', finish);
            reveal();
        }, FALLBACK_MS);
        preloaderVideo.addEventListener('ended', () => clearTimeout(fallbackTimer));
    };

    // Universal flow - everyone gets the full branded experience
    setupFullVideoFlow();
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 20; // Small offset from top
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Email form handling
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = emailForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (emailRegex.test(email)) {
                    // Simulate successful subscription
                    showMessage('Thank you for joining The Inner Circle! We\'ll be in touch soon.', 'success');
                    emailInput.value = '';
                } else {
                    showMessage('Please enter a valid email address.', 'error');
                }
            } else {
                showMessage('Please enter your email address.', 'error');
            }
        });
    }
});

// Message display function
function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        margin-top: 1rem;
        padding: 12px 16px;
        border-radius: 4px;
        text-align: center;
        font-size: 0.9rem;
        font-weight: 500;
        ${type === 'success' 
            ? 'background-color: #f0f9f0; color: #1b5e20; border: 1px solid #4caf50;' 
            : 'background-color: #fef2f2; color: #7f1d1d; border: 1px solid #ef4444;'
        }
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    `;
    
    // Insert message after the form
    const form = document.getElementById('emailForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

/* Minimal mode: no entrance animations needed */
function triggerEntranceAnimations() {}

// Minimal mode: remove scroll-triggered animations setup

// Minimal mode: no product cards on the page

// Minimal mode: no buttons to enhance

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Minimal mode: no purchase buttons present

// Minimal mode: no scroll progress needed

console.log('Third Veil website loaded successfully ✨');

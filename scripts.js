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
            mainContent.style.display = 'flex';
            mainContent.style.opacity = '1';
            mainContent.style.visibility = 'visible';
            mainContent.removeAttribute('aria-hidden');
        }
        return;
    }

    // Prepare main content to be shown after video completes
    if (mainContent) {
        mainContent.style.display = 'none';
        mainContent.setAttribute('aria-hidden', 'true');
    }

    // Feature-detect a "mobile" context without breaking desktop:
    // Small viewport OR iOS userAgent implies mobile handling.
    const isSmallViewport = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const ua = (navigator.userAgent || '').toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isMobile = isSmallViewport || isIOS;

    // Ensure video is configured for inline autoplay (esp. iOS)
    preloaderVideo.setAttribute('muted', '');
    preloaderVideo.muted = true;
    preloaderVideo.setAttribute('playsinline', '');
    preloaderVideo.setAttribute('webkit-playsinline', ''); // extra-safe for older iOS
    preloaderVideo.playsInline = true;
    preloaderVideo.autoplay = true;
    
    // Aggressively prevent any video controls from appearing
    preloaderVideo.controls = false;
    preloaderVideo.setAttribute('controls', 'false');
    preloaderVideo.removeAttribute('controls');
    preloaderVideo.setAttribute('disablepictureinpicture', '');
    preloaderVideo.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
    
    // RESEARCH-BASED: Force removal of overlay play button specifically
    const destroyOverlayButton = () => {
        preloaderVideo.controls = false;
        preloaderVideo.removeAttribute('controls');
        
        // Hide any shadow DOM controls
        const shadowRoot = preloaderVideo.shadowRoot;
        if (shadowRoot) {
            const overlayButtons = shadowRoot.querySelectorAll('*[pseudo*="overlay"], *[class*="overlay"], *[class*="play"]');
            overlayButtons.forEach(button => {
                if (button.style) {
                    button.style.display = 'none';
                    button.style.opacity = '0';
                    button.style.visibility = 'hidden';
                    button.style.width = '0';
                    button.style.height = '0';
                }
            });
        }
    };
    
    // Apply immediately and continuously
    destroyOverlayButton();
    setInterval(destroyOverlayButton, 50); // More frequent for stubborn buttons

    // Try to autoplay immediately
    const attemptPlay = () => preloaderVideo.play().catch(() => Promise.reject());

    // Fallback: kick playback on first user gesture if autoplay was blocked
    const addUserGestureKick = () => {
        const kick = () => {
            preloaderVideo.play().finally(() => {
                document.removeEventListener('touchstart', kick, { capture: true });
                document.removeEventListener('click', kick, { capture: true });
            });
        };
        // Use capture to get earliest possible event on iOS Safari
        document.addEventListener('touchstart', kick, { once: true, capture: true });
        document.addEventListener('click', kick, { once: true, capture: true });
    };

    // Reveal logic shared by desktop/mobile
    const reveal = () => {
        preloader.classList.add('is-hidden');
        setTimeout(() => {
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.style.display = 'flex';
                mainContent.style.opacity = '1';
                mainContent.style.visibility = 'visible';
                mainContent.removeAttribute('aria-hidden');
            }
            if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 600); // match CSS transition
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
    
    // Ensure autoplay works on all devices
    attemptPlay().catch(() => {
        if (isMobile) {
            addUserGestureKick();
        }
    });
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

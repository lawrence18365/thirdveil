// Smart iOS Detection with Elegant Fallback
// This keeps video for desktop but uses a beautiful alternative for iOS

function setupSmartPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderVideo = document.getElementById('preloaderVideo');
    const mainContent = document.getElementById('main-content');
    
    if (!preloader) return;
    
    // Robust iOS detection
    const isIOS = (() => {
        const ua = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        
        // Check for iOS devices including iPadOS
        return /iphone|ipod/.test(ua) || 
               /ipad/.test(ua) || 
               (platform === 'macintel' && maxTouchPoints > 1) || // iPad Pro
               (/safari/.test(ua) && /apple/.test(navigator.vendor.toLowerCase()) && 'ontouchstart' in window);
    })();
    
    // Also check for any mobile Safari
    const isMobileSafari = /safari/.test(navigator.userAgent.toLowerCase()) && 
                          /mobile/.test(navigator.userAgent.toLowerCase()) && 
                          !/chrome/.test(navigator.userAgent.toLowerCase());
    
    if (isIOS || isMobileSafari) {
        // iOS/Mobile Safari: Use elegant CSS animation fallback
        setupIOSFallback();
    } else {
        // Desktop/Android: Try video with fallback
        setupVideoWithFallback();
    }
    
    function setupIOSFallback() {
        // Remove video completely
        if (preloaderVideo) {
            preloaderVideo.remove();
        }
        
        // Create beautiful iOS-specific preloader
        preloader.innerHTML = `
            <div class="ios-preloader-container">
                <div class="ios-logo-wrapper">
                    <svg class="ios-logo" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <!-- Third Veil minimalist logo -->
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#4b3b61" stroke-width="1" opacity="0.3"/>
                        <text x="100" y="95" text-anchor="middle" font-family="Cinzel, serif" font-size="24" font-weight="600" fill="#4b3b61">
                            THIRD
                        </text>
                        <text x="100" y="120" text-anchor="middle" font-family="Cinzel, serif" font-size="24" font-weight="600" fill="#4b3b61">
                            VEIL
                        </text>
                        <line x1="50" y1="105" x2="150" y2="105" stroke="#4b3b61" stroke-width="1" opacity="0.5"/>
                    </svg>
                    <div class="ios-pulse-ring"></div>
                    <div class="ios-pulse-ring" style="animation-delay: 0.5s;"></div>
                </div>
                <div class="ios-loading-text">AWAKENING THE SENSES</div>
            </div>
        `;
        
        // Add iOS-specific styles
        const style = document.createElement('style');
        style.textContent = `
            .ios-preloader-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 30px;
            }
            
            .ios-logo-wrapper {
                position: relative;
                width: 200px;
                height: 200px;
            }
            
            .ios-logo {
                width: 100%;
                height: 100%;
                animation: iosFadeIn 1.5s ease-out;
            }
            
            @keyframes iosFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .ios-pulse-ring {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                border: 2px solid #4b3b61;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;
                animation: iosPulse 2s ease-out infinite;
            }
            
            @keyframes iosPulse {
                0% {
                    opacity: 0.8;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(1.3);
                }
            }
            
            .ios-loading-text {
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 300;
                letter-spacing: 0.3em;
                color: #4b3b61;
                opacity: 0;
                animation: iosTextFade 1s ease-out 0.5s forwards;
            }
            
            @keyframes iosTextFade {
                to {
                    opacity: 0.7;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Shorter duration for iOS
        setTimeout(revealContent, 2500);
    }
    
    function setupVideoWithFallback() {
        if (!preloaderVideo) return;
        
        // Ensure all necessary attributes
        preloaderVideo.muted = true;
        preloaderVideo.playsInline = true;
        preloaderVideo.autoplay = true;
        
        let videoFailed = false;
        let playAttempts = 0;
        const maxAttempts = 3;
        
        const tryPlayVideo = () => {
            if (playAttempts >= maxAttempts || videoFailed) {
                // Fall back to CSS animation
                setupIOSFallback();
                return;
            }
            
            playAttempts++;
            
            const playPromise = preloaderVideo.play();
            if (playPromise) {
                playPromise
                    .then(() => {
                        console.log('Video playing successfully');
                        preloaderVideo.addEventListener('ended', revealContent);
                        // Fallback timer
                        setTimeout(revealContent, 4000);
                    })
                    .catch(error => {
                        console.log('Video play failed, attempt', playAttempts);
                        if (playAttempts < maxAttempts) {
                            setTimeout(tryPlayVideo, 100);
                        } else {
                            setupIOSFallback();
                        }
                    });
            }
        };
        
        // Error handling
        preloaderVideo.addEventListener('error', () => {
            videoFailed = true;
            setupIOSFallback();
        });
        
        // Start trying to play
        tryPlayVideo();
    }
    
    function revealContent() {
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
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', setupSmartPreloader);
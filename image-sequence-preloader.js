// Image Sequence Preloader Solution
// Convert your video to frames and use this approach

class ImageSequencePreloader {
    constructor(options) {
        this.frameCount = options.frameCount || 30; // Number of frames
        this.framePath = options.framePath || 'media/frames/frame_'; // Path to frames
        this.frameExtension = options.frameExtension || '.jpg';
        this.fps = options.fps || 30;
        this.container = document.getElementById('preloader');
        this.currentFrame = 0;
        this.images = [];
        this.canvas = null;
        this.ctx = null;
        this.onComplete = options.onComplete || (() => {});
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'preloader-canvas';
        this.canvas.style.cssText = `
            max-width: min(42vw, 360px);
            width: clamp(220px, 38vw, 360px);
            height: auto;
        `;
        
        // Replace video with canvas
        const video = document.getElementById('preloaderVideo');
        if (video) {
            video.style.display = 'none';
        }
        this.container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Preload all frames
        this.preloadFrames().then(() => {
            this.startAnimation();
        });
    }

    preloadFrames() {
        const promises = [];
        
        for (let i = 0; i < this.frameCount; i++) {
            const promise = new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                // Pad frame number with zeros (e.g., frame_001.jpg)
                const frameNumber = String(i + 1).padStart(3, '0');
                img.src = `${this.framePath}${frameNumber}${this.frameExtension}`;
                this.images[i] = img;
            });
            promises.push(promise);
        }
        
        return Promise.all(promises);
    }

    startAnimation() {
        const frameDuration = 1000 / this.fps;
        
        const animate = () => {
            if (this.currentFrame < this.frameCount) {
                this.drawFrame(this.currentFrame);
                this.currentFrame++;
                setTimeout(() => {
                    requestAnimationFrame(animate);
                }, frameDuration);
            } else {
                this.onComplete();
            }
        };
        
        // Set canvas dimensions from first frame
        if (this.images[0]) {
            this.canvas.width = this.images[0].width;
            this.canvas.height = this.images[0].height;
        }
        
        animate();
    }

    drawFrame(frameIndex) {
        if (this.images[frameIndex]) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.images[frameIndex], 0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Usage in your existing code:
// 1. Extract frames from your video using ffmpeg:
// ffmpeg -i preloader.mp4 -vf fps=30 media/frames/frame_%03d.jpg
// 
// 2. Replace video initialization with:
/*
const preloader = new ImageSequencePreloader({
    frameCount: 90, // Adjust based on your video
    framePath: 'media/frames/frame_',
    frameExtension: '.jpg',
    fps: 30,
    onComplete: () => {
        // Your existing reveal logic
        reveal();
    }
});
preloader.init();
*/
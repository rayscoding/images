
class PremiumProductSlider {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 5;
    this.isAutoplay = true;
    this.autoplayInterval = null;
    this.slideDuration = 5000;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    this.updateSlider();
    this.startAutoplay();
    this.setupEventListeners();
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const slides = document.querySelectorAll('.slide');
    slides[this.currentSlide].classList.remove('active');
    slides[this.currentSlide].classList.add('prev');

    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;

    slides[this.currentSlide].classList.remove('prev');
    slides[this.currentSlide].classList.add('active');

    this.updateUI();
    this.restartAutoplay();

    setTimeout(() => {
      this.isTransitioning = false;
      // Clean up previous slide classes
      slides.forEach(slide => slide.classList.remove('prev'));
    }, 1000);
  }

  previousSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const slides = document.querySelectorAll('.slide');
    slides[this.currentSlide].classList.remove('active');

    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;

    slides[this.currentSlide].classList.add('active');

    this.updateUI();
    this.restartAutoplay();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 1000);
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentSlide) return;
    this.isTransitioning = true;

    const slides = document.querySelectorAll('.slide');
    slides[this.currentSlide].classList.remove('active');

    this.currentSlide = index;

    slides[this.currentSlide].classList.add('active');

    this.updateUI();
    this.restartAutoplay();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 1000);
  }

  updateUI() {
    // Update counter
    document.querySelector('.counter-current').textContent =
      String(this.currentSlide + 1).padStart(2, '0');

    // Update thumbnails
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
      thumb.classList.toggle('active', index === this.currentSlide);
    });

    // Update progress ring
    this.updateProgressRing();
  }

  updateProgressRing() {
    const circle = document.getElementById('progressCircle');
    const radius = 36; // radius = 36
    const circumference = 2 * Math.PI * radius;

    // Set the strokeDasharray to the circumference value
    circle.style.strokeDasharray = circumference;

    // Delay the progress update by 100ms
    setTimeout(() => {
      // Calculate the progress based on currentSlide and totalSlides
      const progress = ((this.currentSlide + 1) / this.totalSlides) * circumference;

      // Update the strokeDashoffset to show progress
      circle.style.strokeDashoffset = circumference - progress;
    }, 100);
  }

  startAutoplay() {
    if (!this.isAutoplay) return;

    this.clearAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideDuration);
  }

  clearAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  restartAutoplay() {
    if (this.isAutoplay) {
      this.startAutoplay();
    }
  }

  toggleAutoplay() {
    const icon = document.getElementById('autoplayIcon');

    if (this.isAutoplay) {
      this.clearAutoplay();
      this.isAutoplay = false;
      icon.className = 'fas fa-play';
    } else {
      this.isAutoplay = true;
      this.startAutoplay();
      icon.className = 'fas fa-pause';
    }
  }

  setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          this.toggleAutoplay();
          break;
      }
    });

    // Touch/swipe support
    let startY = 0;
    let startX = 0;
    const slider = document.querySelector('.main-slider');

    slider.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    });

    slider.addEventListener('touchend', (e) => {
      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const deltaY = startY - endY;
      const deltaX = startX - endX;

      // Determine if vertical or horizontal swipe
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (Math.abs(deltaY) > 50) {
          if (deltaY > 0) {
            this.nextSlide();
          } else {
            this.previousSlide();
          }
        }
      } else {
        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            this.nextSlide();
          } else {
            this.previousSlide();
          }
        }
      }
    });

    // Mouse wheel support
    slider.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }, { passive: false });

    // Pause on hover
    const container = document.querySelector('.slider-container');
    container.addEventListener('mouseenter', () => {
      if (this.isAutoplay) {
        this.clearAutoplay();
      }
    });

    container.addEventListener('mouseleave', () => {
      if (this.isAutoplay) {
        this.startAutoplay();
      }
    });

    // Visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.clearAutoplay();
      } else if (this.isAutoplay) {
        this.startAutoplay();
      }
    });

    // Wishlist button functionality
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const heart = btn.querySelector('i');
        if (heart.classList.contains('far')) {
          heart.classList.remove('far');
          heart.classList.add('fas');
          btn.style.color = '#ff6b6b';
          btn.style.borderColor = '#ff6b6b';
        } else {
          heart.classList.remove('fas');
          heart.classList.add('far');
          btn.style.color = 'white';
          btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
      });
    });
  }

  updateSlider() {
    this.updateUI();
  }
}

// Initialize slider
const slider = new PremiumProductSlider();

// Add some extra visual effects
document.addEventListener('DOMContentLoaded', () => {
  // Animate elements on load
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);

  // Add parallax effect to background
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    const bg = document.querySelector('.background-animation');
    bg.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
  });
});


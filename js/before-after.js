(function() {
    class BeforeAfterComparison {
        constructor(element) {
            this.element = element;
            this.slider = element.querySelector('.comparison-slider');
            this.beforeImage = element.querySelector('.before-image');
            this.isVertical = element.classList.contains('split-vertical');
            
            this.isDragging = false;
            this.startPos = 0;
            this.sliderPos = 0;

            this.init();
        }

        init() {
            // Mouse events
            this.slider.addEventListener('mousedown', this.startDragging.bind(this));
            document.addEventListener('mousemove', this.drag.bind(this));
            document.addEventListener('mouseup', this.stopDragging.bind(this));

            // Touch events
            this.slider.addEventListener('touchstart', this.startDragging.bind(this));
            document.addEventListener('touchmove', this.drag.bind(this));
            document.addEventListener('touchend', this.stopDragging.bind(this));

            // Initial position
            this.updateSliderPosition(50);
        }

        startDragging(e) {
            this.isDragging = true;
            const pos = e.type === 'mousedown' ? e : e.touches[0];
            this.startPos = this.isVertical ? pos.pageY : pos.pageX;
            this.sliderPos = this.isVertical ?
                this.slider.offsetTop :
                this.slider.offsetLeft;
        }

        stopDragging() {
            this.isDragging = false;
        }

        drag(e) {
            if (!this.isDragging) return;

            e.preventDefault();
            
            const pos = e.type === 'mousemove' ? e : e.touches[0];
            const currentPos = this.isVertical ? pos.pageY : pos.pageX;
            const walk = currentPos - this.startPos;

            const containerSize = this.isVertical ?
                this.element.offsetHeight :
                this.element.offsetWidth;

            let newPosition = ((this.sliderPos + walk) / containerSize) * 100;

            // Constrain to 0-100
            newPosition = Math.max(0, Math.min(100, newPosition));

            this.updateSliderPosition(newPosition);
        }

        updateSliderPosition(position) {
            if (this.isVertical) {
                this.slider.style.top = `${position}%`;
                this.beforeImage.style.clipPath = `inset(0 0 ${100 - position}% 0)`;
            } else {
                this.slider.style.left = `${position}%`;
                this.beforeImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
            }
        }
    }

    // Initialize all comparison sliders
    document.querySelectorAll('[data-before-after]').forEach(element => {
        new BeforeAfterComparison(element);
    });
})();
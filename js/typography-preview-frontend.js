document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.typography-preview-block').forEach(block => {
        const previewText = block.querySelector('.preview-text');
        const fontSizeInput = block.querySelector('input[data-attribute="fontSize"]');
        const fontWeightInput = block.querySelector('input[data-attribute="fontWeight"]');
        const weightNames = JSON.parse(block.dataset.weightNames || '{}');
        const availableWeights = JSON.parse(block.dataset.availableWeights || '[]');

        // Make preview text directly editable
        if (previewText) {
            previewText.setAttribute('contenteditable', 'true');
        }

        // Update font size
        if (fontSizeInput && previewText) {
            const fontSizeValue = block.querySelector('.fontSize-value');
            
            // Initialize the value
            previewText.style.fontSize = `${fontSizeInput.value}px`;
            if (fontSizeValue) {
                fontSizeValue.textContent = `${fontSizeInput.value}px`;
            }

            // Update when slider changes
            fontSizeInput.addEventListener('input', function() {
                const newSize = this.value;
                previewText.style.fontSize = `${newSize}px`;
                if (fontSizeValue) {
                    fontSizeValue.textContent = `${newSize}px`;
                }
            });
        }

        // Update font weight
        if (fontWeightInput && previewText) {
            
            // Set up the slider to use indices instead of direct weight values
            fontWeightInput.min = 0;
            fontWeightInput.max = availableWeights.length - 1;
            fontWeightInput.step = 1;

            // Map the slider index to actual weights
            const getWeightFromIndex = (index) => availableWeights[index];

            // Initialize the value from the saved attribute
            const savedWeight = parseInt(fontWeightInput.getAttribute('value'));
            const initialIndex = availableWeights.indexOf(savedWeight);
            if (initialIndex !== -1) {
                fontWeightInput.value = initialIndex;
                previewText.style.fontWeight = savedWeight;
                const weightValue = block.querySelector('.control-group:last-child span');
                if (weightValue) {
                    weightValue.textContent = weightNames[savedWeight] || savedWeight;
                }
            }

            // Update display when slider changes
            fontWeightInput.addEventListener('input', function() {
                const weightIndex = parseInt(this.value);
                const selectedWeight = getWeightFromIndex(weightIndex);
                previewText.style.fontWeight = selectedWeight;
                
                // Update weight label if exists
                const weightValue = block.querySelector('.control-group:last-child span');
                if (weightValue) {
                    weightValue.textContent = weightNames[selectedWeight] || selectedWeight;
                }
            });
        }
    });
});
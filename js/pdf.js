const { __ } = wp.i18n;

document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('downloadPDF');
    const downloadLink = downloadButton.getElementsByTagName('a')[0];
    const originalButtonText = downloadLink.textContent;
    if (!downloadButton) return;

    downloadButton.addEventListener('click', generatePDF);

    async function generatePDF() {
        const { jsPDF } = window.jspdf;
        const progressText = __( 'Generating PDF...', 'wpguidelines' );

        // Show loading indicator
        downloadButton.disabled = true;
        downloadLink.textContent = progressText;

        try {
            // Get all h1 sections
            const content = document.querySelector('.entry-content');
            const headings = Array.from(content.querySelectorAll('h1, h2'));
            const sections = [];

            // Create sections array by finding content between headings
            headings.forEach((heading, index) => {
                const sectionContent = [];
                let currentElement = heading;

                // Add the heading itself
                sectionContent.push(currentElement);

                // Get all elements until next h1 or h2 or end
                while (currentElement.nextElementSibling && 
                    !['H1', 'H2'].includes(currentElement.nextElementSibling.tagName)) {
                    currentElement = currentElement.nextElementSibling;
                    sectionContent.push(currentElement);
                }

                sections.push({
                    level: heading.tagName.toLowerCase(),
                    elements: sectionContent
                });
            });

            // Create PDF with 16:9 aspect ratio
            const width = 1920;
            const height = 1080;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [width, height]
            });

            pdf.setProperties({
                title: document.title,
                subject: 'Guidelines',
                keywords: 'brand guidelines, style guide'
            });

            // Create a temporary container for rendering
            const tempContainer = document.createElement('div');
            tempContainer.style.width = width + 'px';
            tempContainer.style.height = height + 'px';
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            document.body.appendChild(tempContainer);

            // Add cover page
            const coverContainer = document.createElement('div');
            const coverTitle = document.getElementsByClassName('wp-block-post-title')[0].cloneNode(true);
            const coverLogo = document.getElementsByClassName('custom-logo')[0].cloneNode(true);
            const coverLogoSVG = document.getElementsByClassName('custom-logo')[0].innerHTML;

            tempContainer.innerHTML = ''; 
            coverContainer.style.width = width + 'px';
            coverContainer.style.height = height + 'px';
            coverContainer.style.background = 'var(--wp--preset--color--accent-3)';
            coverContainer.style.padding = 'var(--wp--style--root--padding-left)';

            coverTitle.style.marginTop = 'auto';
            coverTitle.style.marginBottom = 'auto';
            coverTitle.style.width = width/2 + 'px';

            coverLogo.style.marginTop = 'auto';
            coverLogo.style.marginBottom = 'auto';
            coverLogo.style.width = width/2 + 'px';
            
            coverContainer.appendChild(coverLogo.cloneNode(true));
            coverContainer.appendChild(coverTitle.cloneNode(true));
            tempContainer.appendChild(coverContainer);

            const coverCanvas = await html2canvas(coverContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: width,
                height: height,
                windowWidth: width,
                windowHeight: height
            });

            const coverImgData = coverCanvas.toDataURL('image/jpeg', 0.95);
            
            pdf.addImage(coverImgData, 'JPEG', 0, 0, width, height, '', 'FAST');
            pdf.addPage([width, height], 'landscape');

            // Process each section
            let totalSections = sections.length;
            for (let i = 0; i < totalSections; i++) {
                const section = sections[i];
                
                // Clear and prepare temp container
                tempContainer.innerHTML = '';
                const sectionContainer = document.createElement('div');
                sectionContainer.className = `pdf-section-container ${section.level}-section`;
                sectionContainer.style.padding = 'var(--wp--style--root--padding-left)';
                sectionContainer.style.background = 'var(--wp--preset--color--base)';
                
                // Add elements to temp container
                section.elements.forEach(element => {
                    sectionContainer.appendChild(element.cloneNode(true));
                });
                tempContainer.appendChild(sectionContainer);

                // Convert to canvas
                const canvas = await html2canvas(sectionContainer, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    width: width,
                    height: height,
                    windowWidth: width,
                    windowHeight: height
                });

                // Add to PDF
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                
                if (i > 0) {
                    pdf.addPage([width, height], 'landscape');
                }
                
                pdf.addImage(imgData, 'JPEG', 0, 0, width, height, '', 'FAST');

                // Update progress
                downloadLink.textContent = `${progressText} ${i + 1}/${totalSections}`;
            }

            // Clean up
            document.body.removeChild(tempContainer);

            // Save the PDF
            const title = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const currentDate = new Date();

            pdf.save(`${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDay()}_${title}.pdf`);

        } catch (error) {
            console.error('PDF generation failed:', error);
            alert( __('Failed to generate PDF. Please try again.', 'wpguidelines' ));
        } finally {
            // Reset button
            downloadButton.disabled = false;
            downloadLink.textContent = originalButtonText;
        }
    }
});
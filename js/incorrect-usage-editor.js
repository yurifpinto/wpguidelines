wp.domReady(function () {
    // Register custom styles
    wp.blocks.registerBlockStyle('core/image', {
        name: 'incorrect-x',
        label: 'Incorrect (X)'
    });

    wp.blocks.registerBlockStyle('core/image', {
        name: 'incorrect-line',
        label: 'Incorrect (Line)'
    });

    // Add custom attributes to image block
    const imageBlock = wp.blocks.getBlockType('core/image');
    if (imageBlock) {
        wp.blocks.registerBlockType('core/image', {
            ...imageBlock,
            attributes: {
                ...imageBlock.attributes,
                incorrectLineColor: {
                    type: 'string',
                    default: '#ff0000'
                },
                incorrectLineThickness: {
                    type: 'number',
                    default: 3
                },
                incorrectLineOpacity: {
                    type: 'number',
                    default: 0.85
                }
            }
        });
    }

    function addCustomStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .is-style-incorrect-x,
            .is-style-incorrect-line {
                position: relative !important;
                display: inline-block !important;
            }
            
            .is-style-incorrect-x::before,
            .is-style-incorrect-x::after,
            .is-style-incorrect-line::before {
                content: "" !important;
                position: absolute !important;
                pointer-events: none !important;
                z-index: 1 !important;
                transform-origin: center;

                background: var(--incorrect-line-color);
                height: var(--incorrect-line-thickness);
                opacity: var(--incorrect-line-opacity);
            }

            .is-style-incorrect-x::before,
            .is-style-incorrect-x::after {
                top: 20px;
                left: 0;
                margin: 5px;
                width: 40px;
            }

            .is-style-incorrect-x::before {
                transform: rotate(45deg);
            }
            .is-style-incorrect-x::after {
                transform: rotate(-45deg);
            }

            .is-style-incorrect-line::before {
                width: 100%;
                inset: 0;
                margin: auto;
                transform: rotate(45deg);
            }
        `;
        document.head.appendChild(style);
    }

    // Add the styles when the editor loads
    addCustomStyles();

    // Create custom controls for the image block
    const withIncorrectUsageControls = wp.compose.createHigherOrderComponent((BlockEdit) => {
        return function(props) {
            // Only show controls for image blocks with incorrect usage styles
            if (props.name !== 'core/image' || 
                (!props.attributes.className?.includes('is-style-incorrect'))) {
                return wp.element.createElement(BlockEdit, props);
            }

            // Return the block edit UI
            return wp.element.createElement(
                wp.element.Fragment,
                null,
                wp.element.createElement(BlockEdit, props),
                wp.element.createElement(
                    wp.blockEditor.InspectorControls,
                    { group: "styles" },
                    wp.element.createElement(
                        wp.components.PanelBody,
                        { title: 'Incorrect Usage Style', initialOpen: true },
                        // Color Picker
                        wp.element.createElement(
                            'div',
                            { style: { marginBottom: '1em' } },
                            wp.element.createElement(
                                'label',
                                null,
                                'Line Color'
                            ),
                            wp.element.createElement(
                                wp.components.ColorPicker,
                                {
                                    color: props.attributes.incorrectLineColor,
                                    onChangeComplete: function(color) {
                                        props.setAttributes({ incorrectLineColor: color.hex });
                                    }
                                }
                            )
                        ),
                        // Thickness Control
                        wp.element.createElement(
                            wp.components.RangeControl,
                            {
                                label: 'Line Thickness',
                                value: props.attributes.incorrectLineThickness,
                                onChange: function(value) {
                                    props.setAttributes({ incorrectLineThickness: value });
                                },
                                min: 1,
                                max: 10
                            }
                        ),
                        // Opacity Control
                        wp.element.createElement(
                            wp.components.RangeControl,
                            {
                                label: 'Line Opacity',
                                value: props.attributes.incorrectLineOpacity,
                                onChange: function(value) {
                                    props.setAttributes({ incorrectLineOpacity: value });
                                },
                                min: 0,
                                max: 100
                            }
                        )
                    )
                )
            );
        };
    }, 'withIncorrectUsageControls');

    // Add the custom controls to the editor
    wp.hooks.addFilter(
        'editor.BlockEdit',
        'wpguidelines/with-incorrect-usage-controls',
        withIncorrectUsageControls
    );

    // Add style attributes to the block
    wp.hooks.addFilter(
        'blocks.getSaveContent.extraProps',
        'wpguidelines/incorrect-usage-styles',
        function(props, blockType, attributes) {
            if (blockType.name !== 'core/image') {
                return props;
            }

            if (!attributes.className?.includes('is-style-incorrect')) {
                return props;
            }

            return {
                ...props,
                style: {
                    ...props.style,
                    '--incorrect-line-color': attributes.incorrectLineColor,
                    '--incorrect-line-thickness': `${attributes.incorrectLineThickness}px`,
                    '--incorrect-line-opacity': attributes.incorrectLineOpacity / 100
                }
            };
        }
    );
});
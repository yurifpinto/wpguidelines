wp.domReady(function() {
    const { registerBlockType } = wp.blocks;
    const { MediaUpload, InspectorControls } = wp.blockEditor;
    const { Button, PanelBody, RangeControl, SelectControl } = wp.components;
    const { createElement: el } = wp.element;

    registerBlockType('guidelines/before-after', {
        title: 'Image Comparison',
        icon: 'image-flip-horizontal',
        category: 'media',
        attributes: {
            beforeImage: {
                type: 'object',
                default: null
            },
            afterImage: {
                type: 'object',
                default: null
            },
            splitDirection: {
                type: 'string',
                default: 'horizontal'
            },
            borderRadius: {
                type: 'number',
                default: 0
            },
            align: {
                type: 'string',
                default: 'wide'
            }
        },
        supports: {
            align: ["wide","full"]
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { beforeImage, afterImage, splitDirection, borderRadius } = attributes;
            
            // Style for editor preview
            const blockStyle = {
                borderRadius: borderRadius + 'px',
                overflow: 'hidden'
            }

            return el('div',
                {
                    className: `before-after-block-editor split-${splitDirection}`,
                    style: blockStyle
                },

                // Inspector Controls
                [ el(InspectorControls, null,
                    el(PanelBody,
                        { title: 'Image Settings' },
                        el('div', { className: 'editor-image-size-note' },
                            'Note: Images should have the same dimensions for best results'
                        ),
                        el(SelectControl, {
                            label: 'Split Direction',
                            value: splitDirection,
                            options: [
                                { label: 'Horizontal Split', value: 'horizontal' },
                                { label: 'Vertical Split', value: 'vertical' }
                            ],
                            onChange: (value) => setAttributes({ splitDirection: value })
                        }),
                        el(RangeControl, {
                            label: 'Border Radius',
                            value: borderRadius,
                            onChange: (value) => setAttributes({ borderRadius: value }),
                            min: 0,
                            max: 50,
                            step: 1,
                            allowReset: true,
                            resetFallbackValue: 0
                        })
                    )
                ),

                // Main Editor UI
                el('div',
                    { className: 'image-selectors' },
                    [
                        // Before image selector
                        el('div',
                            { className: 'image-selector' },
                            [
                                el(MediaUpload, {
                                    onSelect: (media) => {
                                        setAttributes({ beforeImage: {
                                            url: media.url,
                                            alt: media.alt,
                                            id: media.id
                                        }});
                                    },
                                    allowedTypes: ['image'],
                                    value: beforeImage?.id,
                                    render: function(obj) {
                                        return el(Button, {
                                            className: beforeImage ? 'image-button' : 'button button-large',
                                            onClick: obj.open
                                        },
                                        beforeImage ?
                                            el('img', {
                                                src: beforeImage.url,
                                                alt: beforeImage.alt
                                            }) :
                                            'Select \'Before\' Image'
                                        );
                                    }
                                })
                            ]
                        ),

                        // After Image Selector
                        el('div',
                            { className: 'image-selector' },
                            [
                                el(MediaUpload, {
                                    onSelect: (media) => {
                                        setAttributes({ afterImage: {
                                            url: media.url,
                                            alt: media.alt,
                                            id: media.id
                                        }});
                                    },
                                    allowedTypes: ['image'],
                                    value: afterImage?.id,
                                    render: function(obj) {
                                        return el(Button, {
                                            className: afterImage ? 'image-button' : 'button button-large',
                                            onClick: obj.open
                                        },
                                        afterImage ?
                                            el('img', {
                                                src: afterImage.url,
                                                alt: afterImage.alt
                                            }) :
                                            'Select \'After\' Image'
                                        );
                                    }
                                })
                            ]
                        )
                    ]
                )]
            );
        },

        save: function() {
            return null; // Using dynamic rendering
        }
    });
});
const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, useBlockProps, useSettings, __experimentalFontFamilyControl } = wp.blockEditor;
const { useSelect } = wp.data;
const { PanelBody, RangeControl, SelectControl, CheckboxControl, TextControl } = wp.components;
const { __ } = wp.i18n;
const { createElement, Fragment } = wp.element;

registerBlockType('wpguidelines/typography-preview', {
    title: __('Type Tester', 'wpguidelines'),
    icon: 'text',
    category: 'wpguidelines/guidelines',
    supports: {
        align: ['wide', 'full']
    },
    attributes: {
        content: {
            type: 'string',
            default: 'Sample Text'
        },
        fontSize: {
            type: 'number',
            default: 16
        },
        fontWeight: {
            type: 'number',
            default: 400
        },
        fontFamily: {
            type: 'string',
            default: ''
        },
        align: {
            type: 'string',
            default: 'wide'
        },
        availableWeights: {
            type: 'array',
            default: [100, 200, 300, 400, 500, 600, 700, 800, 900]
        },
        weightNames: {
            type: 'object',
            default: {}
        }
    },

    edit: function (props) {
        const { attributes, setAttributes } = props;
        const { content, fontSize, fontWeight, fontFamily, align, availableWeights, weightNames } = attributes;
        const blockProps = useBlockProps({
            className: `typography-preview-block align${align || 'none'}`
        });
        const { fontFamilies } = useSelect((select) => {
            const { theme, custom = [] } = select('core/block-editor').getSettings()?.__experimentalFeatures?.typography?.fontFamilies || {};
            return {
                fontFamilies: [...theme, ...custom]
            }
        }, []);

        // Get current font details
        const currentFont = window.typographyPreviewData?.themeFonts?.find(f => f.fontFamily === fontFamily);
        const fontWeights = currentFont?.weights || [100, 200, 300, 400, 500, 600, 700, 800, 900];

        // Map the slider index to actual weights
        const getWeightFromIndex = (index) => availableWeights[index];

        return createElement(Fragment, {},
            createElement(InspectorControls, {},
                createElement(PanelBody, {
                    title: __('Typography Settings', 'wpguidelines')
                },
                    createElement(__experimentalFontFamilyControl, {
                        label: __('Font Family', 'wpguidelines'),
                        value: fontFamily,
                        fontFamilies: fontFamilies,
                        onChange: (value) => setAttributes({ fontFamily: value })
                    })
                ),
                createElement(PanelBody, {
                    title: __('Available Weights', 'wpguidelines'),
                    initialOpen: true
                },
                    fontWeights.map(weight => (
                        createElement(CheckboxControl, {
                            label: currentFont?.weightLabels[weight] ? `${currentFont?.weightLabels[weight]} (${weight})` : `${weight}`,
                            checked: availableWeights.includes(weight),
                            onChange: (isChecked) => {
                                const newWeights = isChecked
                                    ? [...availableWeights, weight].sort((a, b) => a - b)
                                    : availableWeights.filter(w => w !== weight);

                                setAttributes({
                                    availableWeights: newWeights,
                                    fontWeight: newWeights.includes(fontWeight)
                                        ? fontWeight
                                        : (newWeights[0] || 400)
                                });
                            }
                        })
                    ))
                ),
                createElement(PanelBody, {
                    title: __('Weight Labels', 'wpguidelines'),
                    initialOpen: false
                },
                    availableWeights.map(weight => (
                        createElement(TextControl, {
                            label: __('Name for', 'wpguidelines') + ` ${weight}`,
                            value: weightNames[weight] || '',
                            onChange: (newName) => setAttributes({
                                weightNames: {
                                    ...weightNames,
                                    [weight]: newName
                                }
                            }),
                            help: __('Display name for this weight (e.g. "Regular", "Bold")', 'wpguidelines')
                        })
                    ))
                )
            ),
            createElement('div', blockProps,
                createElement('div', {
                    className: 'typography-controls'
                },
                    createElement('div', {
                        className: 'control-group'
                    },
                        createElement('label', {}, __('Font Size', 'wpguidelines')),
                        createElement('input', {
                            type: 'range',
                            min: 8,
                            max: 144,
                            value: fontSize,
                            onChange: (e) => setAttributes({ fontSize: parseInt(e.target.value) })
                        }),
                        createElement('span', { className: 'fontSize-value' }, fontSize + 'px')
                    ),
                    createElement('div', {
                        className: 'control-group'
                    },
                        createElement('label', {}, __('Font Weight', 'wpguidelines')),
                        createElement('input', {
                            type: 'range',
                            min: 0,
                            max: availableWeights.length - 1,
                            step: 1,
                            value: availableWeights.indexOf(fontWeight),
                            onChange: (e) => {
                                const weightIndex = parseInt(e.target.value);
                                const selectedWeight = getWeightFromIndex(weightIndex);
                                setAttributes({ fontWeight: selectedWeight });
                            }
                        }),
                        createElement('span', {}, weightNames[fontWeight] || fontWeight)
                    )
                ),
                createElement('div', {
                    className: 'preview-text',
                    style: {
                        fontSize: `${fontSize}px`,
                        fontWeight: fontWeight,
                        fontFamily: fontFamily || 'inherit',
                        position: 'relative'
                    }
                },
                    createElement(RichText, {
                        tagName: 'div',
                        className: content ? '' : 'empty-content',
                        value: content,
                        onChange: (newContent) => setAttributes({ content: newContent }),
                        placeholder: '', // Empty placeholder to prevent default behavior
                        style: {
                            fontSize: `${fontSize}px`,
                            fontWeight: fontWeight,
                            fontFamily: fontFamily || 'inherit',
                            position: 'relative',
                            zIndex: 2
                        }
                    }),
                    !content && createElement('div', {
                        className: 'preview-placeholder',
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            color: 'var(--wp--preset--color--contrast-3)',
                            pointerEvents: 'none',
                            zIndex: 1
                        }
                    }, __('Click to edit text', 'wpguidelines'))
                )
            )
        );
    },

    save: function (props) {
        const { attributes } = props;
        const { content, fontSize, fontWeight, fontFamily, availableWeights, weightNames } = attributes;

        const blockProps = useBlockProps.save({
            className: `typography-preview-block align${props.attributes.align || 'none'}`
        });

        return createElement('div', {
            ...blockProps,
            'data-available-weights': JSON.stringify(availableWeights),
            'data-weight-names': JSON.stringify(weightNames)
        },
            createElement('div', {
                className: 'typography-controls'
            },
                createElement('div', {
                    className: 'control-group'
                },
                    createElement('label', {}, __('Font Size', 'wpguidelines')),
                    createElement('input', {
                        type: 'range',
                        min: 8,
                        max: 144,
                        value: fontSize,
                        'data-attribute': 'fontSize'
                    }),
                    createElement('span', { className: 'fontSize-value' }, fontSize + 'px')
                ),
                createElement('div', {
                    className: 'control-group'
                },
                    createElement('label', {}, __('Font Weight', 'wpguidelines')),
                    createElement('input', {
                        type: 'range',
                        min: Math.min(...availableWeights),
                        max: Math.max(...availableWeights),
                        step: (Math.max(...availableWeights) - Math.min(...availableWeights)) / (availableWeights.length),
                        value: fontWeight,
                        'data-attribute': 'fontWeight'
                    }),
                    createElement('span', {}, weightNames[fontWeight] || fontWeight)
                )
            ),
            createElement('div', {
                className: 'preview-text',
                style: {
                    fontSize: `${fontSize}px`,
                    fontWeight: fontWeight,
                    fontFamily: fontFamily || 'inherit'
                }
            }, content)
        );
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const typographyBlocks = document.querySelectorAll('.typography-preview-block');

    typographyBlocks.forEach(block => {
        const weightInput = block.querySelector('input[data-attribute="fontWeight"]');
        const weightValue = block.querySelector('.control-group span');
        const availableWeights = JSON.parse(block.dataset.availableWeights);
        const weightNames = JSON.parse(block.dataset.weightNames);

        if (weightInput) {
            // Set up the slider to use indices instead of direct weight values
            weightInput.min = 0;
            weightInput.max = availableWeights.length - 1;
            weightInput.step = 1;

            // Map the slider index to actual weights
            const getWeightFromIndex = (index) => availableWeights[index];

            // Update display when slider changes
            weightInput.addEventListener('input', function () {
                const weightIndex = parseInt(this.value);
                const selectedWeight = getWeightFromIndex(weightIndex);
                this.value = weightIndex;
                weightValue.textContent = weightNames[selectedWeight] || selectedWeight;
            });

            // Initialize the value
            const initialWeight = parseInt(weightInput.value);
            const initialIndex = availableWeights.indexOf(initialWeight);
            if (initialIndex !== -1) {
                weightInput.value = initialIndex;
                weightValue.textContent = weightNames[initialWeight] || initialWeight;
            }
        }
    });
});
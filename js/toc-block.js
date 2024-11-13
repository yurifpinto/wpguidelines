wp.domReady(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement: el } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, RangeControl, ToggleControl } = wp.components;
    const { select } = wp.data;
    const { __ } = wp.i18n;

    registerBlockType('guidelines/toc', {
        title: __('Table of Contents', 'wpguidelines'),
        icon: 'list-view',
        category: 'widgets',
        attributes: {
            maxLevel: {
                type: 'number',
                default: 2
            },
            isHorizontal: {
                type: 'boolean',
                default: false
            }
        },

        // This handles the editor view
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { maxLevel, isHorizontal } = attributes;
            
            return el('div', 
                { className: `guidelines-toc ${isHorizontal ? 'is-horizontal' : '' }`},
                [
                    //Inspector controls
                    el( InspectorControls, null,
                        el( PanelBody,
                            { title: 'TOC Settings' },
                            el(ToggleControl, {
                                label: 'Horizontal Layout',
                                checked: isHorizontal,
                                onChange: (value) => {
                                    setAttributes({
                                        isHorizontal: value,
                                        maxLevel: value ? 1 : maxLevel
                                    });
                                }
                            }),
                            !isHorizontal && el( RangeControl, {
                                label: 'Heading Levels',
                                value: maxLevel,
                                onChange: (value) => setAttributes({ maxLevel: value }),
                                min: 1,
                                max: 4
                            })
                        )
                    ),
                    el('h2', { className: 'toc-title' }, 'Table of Contents'),
                    el('div', {className: 'toc-preview-message' }, 
                        'Table of contents will be generated automatically'
                    )
                ]
            );
        },

        save: function() {
            return null; // Dynamic block, render callback will handle frontend
        }
    });
});
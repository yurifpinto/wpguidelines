/* translators: This is a JavaScript file containing translatable strings */

wp.domReady(function() {
    const { registerBlockType } = wp.blocks;
    const { createElement: el } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, RangeControl, ToggleControl } = wp.components;
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
            },
            collapseDepth: {
                type: 'number',
                default: 1
            }
        },

        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { maxLevel, isHorizontal, collapseDepth } = attributes;
            
            return el('div', 
                { className: `guidelines-toc ${isHorizontal ? 'is-horizontal' : '' }`},
                [
                    //Inspector controls
                    el( InspectorControls, null,
                        el( PanelBody,
                            { title: __( 'TOC Settings', 'wpguidelines' ) },
                            el(ToggleControl, {
                                label: __( 'Horizontal Layout', 'wpguidelines' ),
                                checked: isHorizontal,
                                onChange: (value) => {
                                    setAttributes({
                                        isHorizontal: value,
                                        maxLevel: value ? 1 : maxLevel
                                    });
                                }
                            }),
                            !isHorizontal && el( RangeControl, {
                                label: __( 'Heading Levels', 'wpguidelines' ),
                                value: maxLevel,
                                onChange: (value) => setAttributes({ maxLevel: value }),
                                min: 1,
                                max: 6
                            }),
                            !isHorizontal && el( RangeControl, {
                                label: __( 'Collapse Depth' ),
                                value: collapseDepth,
                                onChange: (value) => setAttributes({ collapseDepth: value }),
                                min: 1,
                                max: 6,
                                help: __( 'Level at which to start collapsing items', 'wpguidelines')
                            })
                        )
                    ),
                    el('div', {className: 'toc-preview-message' }, 
                        __( 'Table of contents will be generated automatically', 'wpguidelines' )
                    )
                ]
            );
        },

        save: function() {
            return null; // Dynamic block, render callback will handle frontend
        }
    });
});
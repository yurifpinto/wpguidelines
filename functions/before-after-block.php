<?php

 /*
 * Custom block: Before/after image
 */

 // Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

function wpguidelines_register_before_after_block() {
    wp_register_script(
        'before-after-block-editor',
        get_stylesheet_directory_uri() . '/js/before-after-block.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n')
    );

    wp_register_style(
        'before-after-block-editor',
        get_stylesheet_directory_uri() . '/css/before-after-editor.css'
    );

    register_block_type( 'guidelines/before-after', [
        'editor_script' => 'before-after-block-editor',
        'editor_style' => 'before-after-block-editor',
        'render_callback' => 'wpguidelines_render_before_after_block',
        'attributes' => [
            'beforeImage' => [
                'type' => 'object',
                'default' => null
            ],
            'afterImage' => [
                'type' => 'object',
                'default' => null
            ]
        ]
    ]);
}
add_action( 'init', 'wpguidelines_register_before_after_block' );

function wpguidelines_render_before_after_block($attributes) {
    if (!isset($attributes['beforeImage']) || !isset($attributes['afterImage'])) {
        return '';
    }

    $before = $attributes['beforeImage'];
    $after = $attributes['afterImage'];
    $split_direction = isset($attributes['splitDirection']) ? esc_attr($attributes['splitDirection']) : 'horizontal';
    $border_radius = isset($attributes['borderRadius']) ? intval($attributes['borderRadius']) : 0;

    $wrapper_style = $border_radius > 0 ? sprintf('style="border-radius: %dpx; overflow: hidden;"', $border_radius) : '';

    return sprintf(
        '<div class="before-after-comparison split-%s" data-before-after %s>
            <div class="comparison-wrapper">
                <div class="after-image">
                    <img src="%s" alt="%s" />
                </div>
                <div class="before-image">
                    <img src="%s" alt="%s" />
                </div>                
                <div class="comparison-slider">
                    <div class="slider-handle" aria-label="Comparison slider">
                        <svg viewBox="0 0 25 15" preserveAspectRatio="xMinYMin meet" xmlns="http://www.w3.org/2000/svg" class="before-after-slider-icon">
                            <g transform="translate(0.5,-4.5)">
                                <line class="cls-1" x1="3.8" y1="12" x2="20.2" y2="12"/>
                                <path class="cls-1" d="M15.8,16.78l4.11-4.11a1,1,0,0,0,0-1.41l-4-4"/>
                                <path class="cls-1" d="M8.2,7.22,4.09,11.33a1,1,0,0,0,0,1.41l4,4"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>',
        $split_direction,
        $wrapper_style,
        esc_url($after['url']),
        esc_attr($after['alt']),
        esc_url($before['url']),
        esc_attr($before['alt'])
    );
}

// Enqueue frontend assets
function wpguidelines_enqueue_before_after_assets() {
    if (has_block('guidelines/before-after')) {
        wp_enqueue_style(
            'before-after-comparison',
            get_stylesheet_directory_uri() . '/css/before-after.css', [], '1.0'
        );

        wp_enqueue_script(
            'before-after-comparison',
            get_stylesheet_directory_uri() . '/js/before-after.js', [], '1.0', true
        );
    }
}
add_action('wp_enqueue_scripts', 'wpguidelines_enqueue_before_after_assets');
<?php

/**
 *
 * @package wpguidelines
 */

function wpguidelines_register_typography_preview_block()
{
    if (!function_exists('register_block_type')) {
        return;
    }

    // Register the script first
    wp_register_script(
        'typography-preview-block',
        get_stylesheet_directory_uri() . '/js/typography-preview-block.js',
        array(
            'wp-blocks',
            'wp-element',
            'wp-editor',
            'wp-components',
            'wp-i18n',
            'wp-block-editor'
        ),
        filemtime(get_stylesheet_directory() . '/js/typography-preview-block.js')
    );

    // Then localize it
    wp_localize_script(
        'typography-preview-block',
        'typographyPreviewData',
        array()
    );

    wp_register_style(
        'typography-preview-block',
        get_stylesheet_directory_uri() . '/css/typography-preview-block.css',
        array(),
        '1.0'
    );

    wp_register_script(
        'typography-preview-frontend',
        get_stylesheet_directory_uri() . '/js/typography-preview-frontend.js',
        array(),
        '1.0',
        true
    );

    register_block_type('wpguidelines/typography-preview', array(
        'editor_script' => 'typography-preview-block',
        'editor_style' => 'typography-preview-block-editor',
        'style' => 'typography-preview-block',
        'script' => 'typography-preview-frontend',
        'attributes' => array(
            'content' => array(
                'type' => 'string',
                'default' => 'Our brand typeface'
            ),
            'fontSize' => array(
                'type' => 'number',
                'default' => 76
            ),
            'fontWeight' => array(
                'type' => 'number',
                'default' => 400
            ),
            'fontFamily' => array(
                'type' => 'string',
                'default' => 'Default'
            )
        )
    ));
}

add_action('init', 'wpguidelines_register_typography_preview_block');
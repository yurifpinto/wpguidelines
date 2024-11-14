<?php
/**
 * wpguidelines functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package wpguidelines
 */

 // Load theme translations
function wpguidelines_load_theme_textdomain() {
    load_child_theme_textdomain( 'wpguidelines', get_stylesheet_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'wpguidelines_load_theme_textdomain' );

// Guidelines category for block patterns
function wpguidelines_register_pattern_categories() {
	register_block_pattern_category( 'wpguidelines/guidelines', array( 
		'label'       => __( 'Guidelines', 'wpguidelines' ),
		'description' => __( 'Custom patterns for WP Guidelines', 'wpguidelines' )
	) );
}
add_action( 'init', 'wpguidelines_register_pattern_categories' );

// Child theme styles
function wpguidelines_enqueue_styles() {
	wp_enqueue_style( 'wpguidelines-style', get_stylesheet_uri() );
}
add_action( 'wp_enqueue_scripts', 'wpguidelines_enqueue_styles' );

// Child theme custom scripts
function wpguidelines_enqueue_scripts() {
    wp_enqueue_script( 'wpguidelines-custom-scripts', get_stylesheet_directory_uri() . '/js/script.js', [], '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'wpguidelines_enqueue_scripts' );

 /*
 * Custom block styles
 */
function wpguidelines_register_block_styles() {
    register_block_style( 'core/image', array(
        'name'  => 'incorrect-x',
        'label' => __( 'Incorrect (X)', 'wpguidelines' )
    ) );

    register_block_style( 'core/image', array(
        'name'  => 'incorrect-line',
        'label' => __( 'Incorrect (Line)', 'wpguidelines' )
    ) );

    register_block_style( 'core/image', array(
        'name'  => 'correct',
        'label' => __( 'Correct (Check)', 'wpguidelines' )
    ) );
}
add_action( 'init', 'wpguidelines_register_block_styles' );

function wpguidelines_enqueue_block_styles() {
    wp_enqueue_block_style( 'core/image', array(
        'handle' => 'wpguidelines-block-image',
        'src'    => get_stylesheet_directory_uri() . '/blocks/core-image.css',
        'path'   => get_stylesheet_directory_uri().  '/blocks/core-image.css'
    ) );
}
add_action( 'after_setup_theme', 'wpguidelines_enqueue_block_styles' );

/*
 * Custom block: Header tags with anchors
 */
function wpguidelines_enqueue_header_anchor_script() {
    if (wp_cache_get('has_toc', 'wpguidelines') === true) {
        wp_enqueue_script(
            'header-anchor',
            get_stylesheet_directory_uri() . '/js/header-anchor.js',
            array( 'wp-blocks', 'wp-compose', 'wp-element', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-data', 'wp-dom-ready', ),
            '1.0',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'wpguidelines_enqueue_header_anchor_script');

/*
 * Custom block: Table of Contents
 */
function register_toc_block() {
	wp_register_script( 'guidelines-toc-block',
        get_stylesheet_directory_uri() . '/js/toc-block.js',
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-i18n' )
    );

	register_block_type('guidelines/toc', array(
        'editor_script' => 'guidelines-toc-block',
        'render_callback' => 'render_toc_block',
        'attributes' => array(
            'maxLevel' => array(
                'type' => 'number',
                'default' => 2
            )
        )
    ));

    wp_set_script_translations( 'guidelines-toc-block', 'wpguidelines' );
}
add_action('init', 'register_toc_block');

function render_toc_block($attributes) {
    // Add a flag to indicate TOC is present
    wp_cache_set('has_toc', true, 'wpguidelines');

    // Get the current post content
    $post = get_post();
    if (!$post) return '';

    $content = $post->post_content;
    $is_horizontal = isset($attributes['isHorizontal']) ? $attributes['isHorizontal'] : false;
    $max_level = isset($attributes['maxLevel']) ? $attributes['maxLevel'] : 2;
    
    // Initialize output
    $output = sprintf(
        '<div class="guidelines-toc %s" id="guidelines-toc">',
        $is_horizontal ? 'is-horizontal' : ''
    );
	$output .= '<button class="toc-toggle" aria-expanded="false">';
	$output .= '<div class="toggle-wrapper">';
	$output .= '<span class="toggle-text">Menu</span>';
	$output .= '<span class="toggle-icon"></span>';
	$output .= '</div>';
	$output .= '</button>';
    $output .= '<nav class="toc-content">';
    
    // Match headings up to the selected level
    $pattern = '/<h([1-' . $max_level . '])([^>]*?)>(.*?)<\/h[1-' . $max_level . ']>/i';
    preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);
    
    // Generate TOC items
    if (!empty($matches)) {
        foreach ($matches as $match) {
            $level = $match[1];
            $attrs = $match[2];
            $title = strip_tags($match[3]);
            $anchor = sanitize_title($title);

            // Get ID from heading
            if (preg_match('/id=["\']([^"\']+)["\']/i', $attrs, $id_match)) {
                $anchor = $id_match[1];
            } else {
                // Inject ID into the actual content
                add_filter('the_content', function($content) use ($match, $anchor) {
                    $heading_with_id = str_replace(
                        $match[0],
                        "<h{$match[1]} id=\"{$anchor}\"{$match[2]}>{$match[3]}</h{$match[1]}>",
                        $content
                    );
                    return $heading_with_id;
                });
            }
			
            $indent = ($level - 1) * 0.5;
            $output .= sprintf(
                '<a href="#%s" class="toc-item level-%d" style="padding-left: %srem">%s</a>',
                esc_attr($anchor),
                $level,
                $indent,
                esc_html($title)
            );
        }
    }
    
    $output .= '</nav></div>';
    
    return $output;
}

 /*
 * Custom block: Before/after image
 */
function wpguidelines_register_before_after_block() {
    wp_register_script(
        'before-after-block-editor',
        get_stylesheet_directory_uri() . '/js/before-after-block.js',
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n']
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

    wp_set_script_translations( 'before-after-block-editor', 'wpguidelines' );
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
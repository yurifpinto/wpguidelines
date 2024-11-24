<?php
/**
 * wpguidelines functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package wpguidelines
 */

// Load child theme textdomain for translations
function wpguidelines_load_theme_textdomain() {
    load_child_theme_textdomain( 'twentytwentyfour', get_stylesheet_directory() . '/languages' );
    load_theme_textdomain( 'wpguidelines', get_stylesheet_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'wpguidelines_load_theme_textdomain' );

// Child theme styles
function wpguidelines_enqueue_styles() {
	wp_enqueue_style( 'wpguidelines-style', get_stylesheet_uri() );
}
add_action( 'wp_enqueue_scripts', 'wpguidelines_enqueue_styles' );

// Import external files
function wpguidelines_load_external() {
    require_once get_stylesheet_directory() . '/functions/toc-block.php';
    require_once get_stylesheet_directory() . '/functions/before-after-block.php';
}
add_action('init', 'wpguidelines_load_external', 5); // Priority 5 ensures it loads early

// Allow ttf and otf fonts
function wpguidelines_font_correct_filetypes( $data, $file, $filename, $mimes, $real_mime ) {
    if (!empty($data['ext']) && !empty($data['type'])) {
        return $data;
    }
    
    $wp_file_type = wp_check_filetype( $filename, $mimes );
    
    if ('ttf' === $wp_file_type['ext']) {
       $data['ext'] = 'ttf';
       $data['type'] = 'font/ttf';
    }
    
    if ('otf' === $wp_file_type['ext']) {
        $data['ext'] = 'otf';
        $data['type'] = 'font/otf';
    }
    
    return $data;
}
add_filter( 'wp_check_filetype_and_ext', 'wpguidelines_font_correct_filetypes', 10, 5 );

function allow_custom_mime_types( $mimes ) {    
    $mimes['ttf'] = 'font/ttf';
    $mimes['otf'] = 'font/otf';

    return $mimes;
}
add_filter( 'upload_mimes', 'allow_custom_mime_types' );

 // 'Guidelines' category for block patterns
 function wpguidelines_register_pattern_categories() {
	register_block_pattern_category( 'wpguidelines/guidelines', array( 
		'label'       => __( 'Guidelines', 'wpguidelines' ),
		'description' => __( 'Custom patterns for WP Guidelines', 'wpguidelines' )
	) );
}
add_action( 'init', 'wpguidelines_register_pattern_categories' );

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
        'src'    => get_stylesheet_directory_uri() . '/css/core-image.css',
        'path'   => get_stylesheet_directory_uri().  '/css/core-image.css'
    ) );

    wp_enqueue_block_style( 'core/site-logo', array(
        'handle' => 'wpguidelines-block-logo',
        'src'    => get_stylesheet_directory_uri() . '/css/core-site-logo.css',
        'path'   => get_stylesheet_directory_uri() . '/css/core-site-logo.css'
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
            array( 'wp-blocks', 'wp-compose', 'wp-element', 'wp-editor', 'wp-components', 'wp-hooks', 'wp-data', 'wp-dom-ready' ),
            '1.0',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'wpguidelines_enqueue_header_anchor_script');

// JS custom block translations
function wpguidelines_load_script_translations() {
    wp_set_script_translations( 'guidelines-toc-block', 'wpguidelines', get_stylesheet_directory() . '/languages' );
    wp_set_script_translations( 'before-after-block-editor', 'wpguidelines', get_stylesheet_directory() . '/languages' );
}
add_action( 'enqueue_block_editor_assets', 'wpguidelines_load_script_translations', 100 );
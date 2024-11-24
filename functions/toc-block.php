<?php
/*
 * Custom block: Table of Contents
 */

 // Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

function wpguidelines_enqueue_toc_assets() {
    wp_enqueue_script(
        'tocbot',
        'https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.30.0/tocbot.min.js',
        array(), '4.30.0', true
    );

    wp_enqueue_style(
        'tocbot',
        get_stylesheet_directory_uri() . '/css/tocbot.css',
        array(), '4.30.0'
    );

    wp_enqueue_style(
        'wpguidelines-toc-styles',
        get_stylesheet_directory_uri() . '/css/toc.css', [], '1.0.0'
    );

    wp_enqueue_script(
        'wpguidelines-toc-scripts',
        get_stylesheet_directory_uri() . '/js/toc.js', array( 'tocbot' ), '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'wpguidelines_enqueue_toc_assets');

function register_toc_block() {
	wp_register_script( 'guidelines-toc-block',
        get_stylesheet_directory_uri() . '/js/toc-block.js',
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-i18n' )
    );

	register_block_type('guidelines/toc', array(
        'editor_script' => 'guidelines-toc-block',
        'render_callback' => 'render_toc_block',
        'style' => 'wpguidelines-toc-styles',
        'attributes' => array(
            'maxLevel' => array(
                'type' => 'number',
                'default' => 2
            ),
            'isHorizontal' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'collapseDepth' => array(
                'type' => 'number',
                'default' => 1
            )
        )
    ));
}
add_action('init', 'register_toc_block');

function render_toc_block($attributes) {
    // Add a flag to indicate TOC is present
    wp_cache_set('has_toc', true, 'wpguidelines');

    // Get the current post content
    $post = get_post();
    if (!$post) return '';
    $content = $post->post_content;

    $max_level = isset($attributes['maxLevel']) ? $attributes['maxLevel'] : 2;
    $is_horizontal = isset($attributes['isHorizontal']) ? $attributes['isHorizontal'] : false;
    $collapse_depth = isset($attributes['collapseDepth']) ? $attributes['collapseDepth'] : 1;

    $classes = ['guidelines-toc'];
    if ($is_horizontal) $classes[] = 'is-horizontal';

    // Match headings up to the selected level
    $pattern = '/<h([1-' . $max_level . '])([^>]*?)>(.*?)<\/h[1-' . $max_level . ']>/i';
    preg_match_all($pattern, $content, $matches, PREG_SET_ORDER);

    if (!empty($matches)) {
        foreach($matches as $match) {
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
        }
    }

    // Build Tocbot heading selector string dynamically
    $heading_selectors = array();
    for ($i = 1; $i <= $max_level; $i++) {
        $heading_selectors[] = 'h' . $i;
    }
    $heading_selector = implode(', ', $heading_selectors);
    
    // Initialize output
    $output = sprintf(
        '<div class="%s" data-max-level="%d" id="guidelines-toc">',
        esc_attr(implode(' ', $classes)),
        $max_level
    );
	$output .= '<button class="toc-toggle" aria-expanded="false">';
	$output .= '<div class="toggle-wrapper">';
	$output .= '<span class="toggle-text">Menu</span>';
	$output .= '<span class="toggle-icon"></span>';
	$output .= '</div>';
	$output .= '</button>';
    $output .= '<nav class="toc-content toc">';
    $output .= sprintf(
        '<script>
            document.addEventListener("DOMContentLoaded", function() {
            tocbot.init({
                tocSelector: ".toc-content",
                contentSelector: ".entry-content",
                headingSelector: "%s",
                hasInnerContainers: true,
                collapseDepth: %d,
                headingsOffset: 100,
                scrollSmooth: true,
                scrollSmoothOffset: -100,
                enableUrlHashUpdateOnScroll: true
            });
            tocbot.refresh();
        });
        </script>',
        esc_attr($heading_selector),
        (int)$collapse_depth
    );
    $output .= '</nav></div>';
    
    return $output;
}
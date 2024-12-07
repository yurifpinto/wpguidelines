<?php

 /*
 * PDF download functionality
 */

 // Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
function wpguidelines_enqueue_pdf_assets() {
    wp_enqueue_script(
        'jspdf',
        'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js',
        array(), '2.5.2', true
    );

    wp_enqueue_script(
        'html2canvas',
        'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        array(), '1.4.1', true
    );

    wp_enqueue_script(
        'guidelines-pdf',
        get_stylesheet_directory_uri() . '/js/pdf.js',
        array('jspdf', 'html2canvas', 'wp-i18n'), '1.0', true
    );

    wp_enqueue_style(
        'wpguidelines-pdf-styles',
        get_stylesheet_directory_uri() . '/css/pdf.css', [], '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'wpguidelines_enqueue_pdf_assets');
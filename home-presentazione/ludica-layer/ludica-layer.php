<?php
/**
 * Plugin Name: LUDiCa — Esplora la filiera
 * Description: Quattro livelli e ramificazioni di azioni, attori e strumenti. Shortcode: [ludica_filiera]. Alias: [ludica_layers].
 * Version: 2.1.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) { exit; }
add_action('wp_enqueue_scripts', function () {
 $base = plugin_dir_url(__FILE__);
 wp_enqueue_style('ludica-layer', $base . 'assets/layers.css', array(), '2.1.0');
 wp_enqueue_script('ludica-layer', $base . 'assets/layers.js', array(), '2.1.0', true);
});
function ludica_filiera_v2_render($atts = array(), $content = null, $tag = '') {
 return file_get_contents(__DIR__ . '/template.html');
}
add_shortcode('ludica_filiera', 'ludica_filiera_v2_render');
add_shortcode('ludica_layers', 'ludica_filiera_v2_render');

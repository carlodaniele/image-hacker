<?php
/**
 * Plugin Name: Image Hacker
 * Description: Adds new features to the core Image block
 * Version:     1.0.0
 * Author:      Your Name
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: image-hacker
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Enqueue block editor assets.
 */
function image_hacker_enqueue_editor_assets() {
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

	// Enqueue the script with our modifications
	wp_enqueue_script(
		'image-hacker-script',
		plugins_url( 'build/index.js', __FILE__ ),
		array( 'wp-plugins', 'wp-edit-post' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
	);

	// Enqueue the editor-only styles
	wp_enqueue_style(
		'image-hacker-editor-style',
		plugins_url( 'build/editor.css', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'build/editor.css' )
	);
}
add_action( 'enqueue_block_editor_assets', 'image_hacker_enqueue_editor_assets' );

/**
 * Enqueue front-end and editor assets.
 */
function image_hacker_enqueue_assets() {
	$asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

	// Enqueue styles for both front-end and editor
	wp_enqueue_style(
		'image-hacker-style',
		plugins_url( 'build/style-index.css', __FILE__ ),
		[],
		filemtime( plugin_dir_path( __FILE__ ) . 'build/style-index.css' )
	);
}
add_action( 'enqueue_block_assets', 'image_hacker_enqueue_assets' );
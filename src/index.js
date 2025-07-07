import { registerBlockStyle, registerBlockVariation } from '@wordpress/blocks';
import domReady from '@wordpress/dom-ready';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment, useEffect } from '@wordpress/element';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import {
	PanelBody,
	Notice,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
// Import the hook for dispatching notices
import { useDispatch } from '@wordpress/data';

import './style.scss';

function addImageAnimationAttribute(settings, name) {
	if (name !== 'core/image') {
		return settings;
	}
	settings.attributes = {
		...settings.attributes,
		imageAnimation: {
			type: 'boolean',
			default: false,
		},
	};
	return settings;
}

/**
 * This HOC adds all our custom functionality.
 */
const withPolaroidControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (props.name !== 'core/image') {
			return <BlockEdit {...props} />;
		}

		const { attributes, setAttributes, isSelected } = props;
		const { imageAnimation, className, lightbox } = attributes;

		const isPolaroid = className?.includes('is-style-polaroid');

		// Get the function to create notices
		const { createNotice } = useDispatch('core/notices');

		// This hook acts as a safety net.
		useEffect(() => {
			if (isPolaroid && lightbox?.enabled) {
				// 1. Immediately disable the lightbox to prevent the conflict.
				setAttributes({ lightbox: { ...lightbox, enabled: false } });

				// 2. Show a temporary "snack bar" notice to the user.
				createNotice(
					'warning', // The type of notice (info, success, warning, error)
					__('Lightbox disabled for Polaroid style.', 'image-hacker'), // The message
					{
						type: 'snackbar', // This makes it a temporary pop-up
						isDismissible: true,
					}
				);
			}
		}, [isPolaroid, lightbox]);

		return (
			<Fragment>
				<BlockEdit {...props} />

				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							icon="format-image"
							label={__('Toggle Animation', 'image-hacker')}
							isActive={imageAnimation}
							onClick={() =>
								setAttributes({ imageAnimation: !imageAnimation })
							}
						/>
					</ToolbarGroup>
				</BlockControls>

				{/* Keep the persistent notice in the sidebar for proactive info. */}
				{isSelected && isPolaroid && (
					<InspectorControls>
						<PanelBody title={__('Polaroid Style', 'image-hacker')}>
							<Notice status="info" isDismissible={false}>
								{__(
									'The "Expand on click" (lightbox) feature is disabled for this style to prevent visual conflicts.',
									'image-hacker'
								)}
							</Notice>
						</PanelBody>
					</InspectorControls>
				)}
			</Fragment>
		);
	};
}, 'withPolaroidControls');

function addAnimationFrontendClass(extraProps, blockType, attributes) {
	if (blockType.name === 'core/image' && attributes.imageAnimation) {
		extraProps.className = `${extraProps.className || ''} has-image-animation`;
	}
	return extraProps;
}

// --- HOOKS REGISTRATION ---

addFilter(
	'blocks.registerBlockType',
	'image-hacker/add-image-animation-attribute',
	addImageAnimationAttribute
);
addFilter(
	'editor.BlockEdit',
	'image-hacker/with-polaroid-controls',
	withPolaroidControls
);
addFilter(
	'blocks.getSaveContent.extraProps',
	'image-hacker/add-animation-frontend-class',
	addAnimationFrontendClass
);

domReady(() => {
	registerBlockStyle('core/image', {
		name: 'polaroid',
		label: 'Polaroid',
	});
	registerBlockVariation('core/image', {
		name: 'animated-polaroid',
		title: 'Animated Polaroid',
		icon: 'image-filter',
		attributes: {
			className: 'is-style-polaroid',
			imageAnimation: true,
		},
		scope: ['inserter'],
	});
});
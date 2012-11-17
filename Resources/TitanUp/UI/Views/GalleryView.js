/**
 * Pure javascript picture gallery for Titanium
 * Copyright (c) 2011 by Novelys and other contributors
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

/**
 * To use, you must initialize it with an arguments object, which must provide
 * an "images" property.  The images property is an array of objects, each of which
 * has a headline and an array of 2 renditions, a smaller one for the thumbnail
 * view, and a larger one for the full-size view.  Each rendition has a width, height,
 * and URL as shown below:
 * 
 * var gv = TU.UI.createGalleryView ({
 * 	images: [{
 * 		headline: 'foo',
 * 		renditions: [
 * 			{
 * 				width: 120,
 * 				height: 90,
 * 				url: 'http://www.sample.com/foo-120x90.jpg'
 * 			},
 * 			{
 * 				width: 640,
 * 				height: 480,
 * 				url: 'http://www.sample.com/foo-640x480.jpg'
 * 			},
 * 		]
 * 	},
 *  ...
 * 	]
 * })
 */

var TU = require ('/TitanUp/TitanUp');

var GalleryViewPopup = function (images, startIndex, adViewClass) {

	var _self = null;
	var _scrollableGalleryView = null;
	var _captionView = null;
	var _captionOverlay = null;
	var _captionLabel = null;
	var _adView = null;

	var _isUiHidden = false;

	if (adViewClass != null)
	{
		_adView = new adViewClass ({bottom: 0});
	}

	var wparams = {
		backgroundColor : '#000',
		title : (startIndex + 1) + ' of ' + images.length,
		translucent : true
	};
	
	if (TU.Device.getOS() == 'android')
	{
		wparams.fullscreen = true;
		wparams.navBarHidden = true;
	}

	_self = Ti.UI.createWindow(wparams);

	_scrollableGalleryView = Ti.UI.createScrollableView({

		top : 0,
		bottom : 0,
		
		views : [],

		showPagingControl : false,
		maxZoomScale : 2.0,

		currentPage : startIndex

	});

	var m = TU.UI.Sizer.getDimension (4);	
	var fs = TU.UI.Sizer.getDimension (18);
	var caption = (typeof images[startIndex].headline !== 'undefined') ? images[startIndex].headline : '';
	
	_captionView = Ti.UI.createView ({
		left: m,
		right: m,
		bottom : (_adView == null) ? m : (m + _adView.getHeight ()),
		height: parseInt (fs * 3.5),
	})
	
	_captionOverlay = Ti.UI.createView ({
		left: 0,
		right: 0,
		height: Ti.UI.FILL,
		backgroundColor: '#000',
		opacity: 0.5
	})
	
	_captionLabel = Ti.UI.createLabel({
		text : caption,
		top: m,
		left: m,
		right: m,
		bottom: m,
		color : '#fff',
		font : {fontSize : fs, fontWeight : 'bold'},
		textAlign : 'center',
		ellipsize: true,
		zIndex : 2
	});
	
	_captionView.add (_captionOverlay);
	_captionView.add (_captionLabel);
	
	/**
	 * Recompute the size of a given image size, in order to make it fit
	 * into the screen.
	 *
	 * @param {Number} width
	 *
	 * @param {Number} height
	 *
	 * @returns {Object} new width and the new height.
	 */
	var reComputeImageSize = function(width, height) {

		var newWidth = width, 
			newHeight = height;

		var pw = TU.Device.getDisplayWidth ();
		var ph = TU.Device.getDisplayHeight ();
		
		/*
		 * By working ratios of image sizes and screen sizes we ensure that, we will always
		 * start resizing the dimension (height or width) overflowing the screen. Thus, the resized image will
		 * always be contained by the screen boundaries.
		 */
		if ((width / pw) >= (height / ph)) {
			if (width > pw) {
				newHeight = (height * pw) / width;
				newWidth = pw;

			} 
			else if (height > ph) {
				newWidth = (width * ph) / height;
				newHeight = ph;
			}

		} 
		else {
			if (height > ph) {
				newWidth = (width * ph) / height;
				newHeight = ph;

			} 
			else if (width > pw) {
				newHeight = (height * pw) / width;
				newWidth = pw;
			}

		}

		return {
			width : newWidth,
			height : newHeight
		}

	}



	/**
	 * Recompute image size on orientation change.
	 */
	var reComputeImageSizeOnChange = function(index) {
		newSize = reComputeImageSize(images[index].renditions[1].width, images[index].renditions[1].height);

		_scrollableGalleryView.views[index].height = newSize.height;
		_scrollableGalleryView.views[index].width = newSize.width;
	}


	/**
	 * toggle caption, navigation arrows and title bar.
	 */
	var toggleUI = function() {

		if (_isUiHidden) {
			if (TU.Device.getOS () != 'android')
			{
				_self.showNavBar();
			}

			// without animating both the overlay and the container view, you get some
			// strange artifacts on android

			var animation1 = Titanium.UI.createAnimation();
			animation1.duration = 300;
			animation1.opacity = 1;

			var animation2 = Titanium.UI.createAnimation();
			animation2.duration = 300;
			animation2.opacity = 0.5;
			
			_captionView.animate (animation1);
			_captionOverlay.animate (animation2);
		} 
		else 
		{
			if (TU.Device.getOS () != 'android')
			{
				_self.hideNavBar();
			}

			// without animating both the overlay and the container view, you get some
			// strange artifacts on android
			
			var animation1 = Titanium.UI.createAnimation();
			animation1.duration = 300;
			animation1.opacity = 0.0;

			var animation2 = Titanium.UI.createAnimation();
			animation2.duration = 300;
			animation2.opacity = 0.0;
			
			_captionView.animate(animation1);
			_captionOverlay.animate (animation2);
		}
		_isUiHidden = !_isUiHidden;
	}
	
	
	var imageViews = [];
	if (TU.Device.getOS () == 'android')
	{
		for (var i = 0, b = images.length; i < b; i++) {

			var view = Ti.UI.createImageView({
				backgroundColor : '#000',
				image : images[i].renditions[1].url,
			});

			imageViews[i] = view;

			// Not very optimized... But Android scrollableView does not respond to tap event.
			// Views in the other hand, do.
			view.addEventListener('singletap', toggleUI);

		}

		_scrollableGalleryView.views = imageViews;

		// on android, it seems that you have to set the current page *after*
		// you add the views, which kind of makes sense...
		_scrollableGalleryView.currentPage = startIndex;

		//reComputeImagesSizeOnChange();

		_self.add(_scrollableGalleryView);
		
		if (_adView)
		{
			_self.add (_adView);
		}
	} 
	else {

		for (var i = 0, b = images.length; i < b; i++) {

			var view = Ti.UI.createImageView({
				backgroundColor : '#000',

				image : images[i].renditions[1].url,

				height : 'auto',
				width : 'auto',

				index: i,

				firstLoad: true

			});

			view.addEventListener('load', function (e) {
				if (e.source.firstLoad) {
					reComputeImageSizeOnChange(e.source.index);
				}

				e.source.firstLoad = false;
			});

			view.addEventListener('singletap', toggleUI);

			imageViews[i] = view;
		}

		_scrollableGalleryView.views = imageViews;

		_self.add(_scrollableGalleryView);
	}

	_self.add(_captionView);

	if (_adView !== null) {
		_self.add(_adView);
	}

	_scrollableGalleryView.addEventListener('scroll', function(e) 
	{
		var pnum = e.currentPage + 1;

		_self.title = pnum + ' of ' + images.length;

		if (typeof images[e.currentPage].headline == 'undefined' || images[e.currentPage].headline == 'undefined') {
			images[e.currentPage].headline = '';
		}

		if (_captionLabel != null) {
			_captionLabel.text = images[e.currentPage].headline;
		}
	});
	
	return _self;
};



function GalleryView (params)
{
	var _self = null;
	var _thumbnailScrollView = null;
	var _adViewClass = null;
	var _adView = null;
	var _popup = null;

	var _params = null;
	var _numCols = 0;
	var _borderPadding = 0;
	var _thumbSize = 0;
	var _dpifactor = 0;
	
	_params = (typeof params == 'undefined') ? {} : params;

	_params.title = (typeof _params.title == 'undefined') ? 'Gallery' : _params.title;
	
	_params.images = (typeof _params.images == 'undefined') ? [] : _params.images;

	_params.images = (typeof _params.images == 'undefined') ? [] : _params.images;

	_params.numCols = (typeof _params.numCols == 'undefined') ? 4 : _params._numCols;
	_params.numColsPortrait = (typeof _params.numColsPortrait == 'undefined') ? _params.numCols : _params.numColsPortrait;
	_params.numColsLandscape = (typeof _params.numColsLandscape == 'undefined') ? _params.numCols : _params.numColsLandscape;

	_params.borderPadding = (typeof _params.borderPadding == 'undefined') ? 4 : _params.borderPadding;
	_params.borderColor = (typeof _params.borderColor == 'undefined') ? '#fff' : _params.borderColor;
	_params.borderWidth = (typeof _params.borderWidth == 'undefined') ? 1 : _params.borderWidth;
	
	_params.backgroundColor = (typeof _params.backgroundColor == 'undefined') ? '#000' : _params.backgroundColor;

	_params.textColor = (typeof _params.textColor == 'undefined') ? '#fff' : _params.textColor;
	
	_params.barColor = (typeof _params.barColor == 'undefined') ? '#000' : _params.barColor;

	_adViewClass = (typeof params.adViewClass == 'undefined') ? null : params.adViewClass;
	
	if (_adViewClass)
	{
		_adView = new _adViewClass ({bottom: 0});
	}

	_dpifactor = TU.Device.getDpi () / 160;
	
	var _self = Ti.UI.createView({
		backgroundColor: _params.backgroundColor
	});
	
	/**
	 * Recompute thumbnails size on orientation change.
	 */
	var recomputeSizes = function() 
	{
		computeSizes();

		var currCol = 0;
		var currRow = 0;
		var yPos = _borderPadding;
		var xPos = _borderPadding;

		for (var i = 0, b = _thumbnailScrollView.children.length; i < b; i++) {

			if (currCol % _numCols === 0 && currCol > 0) {
				xPos = _borderPadding;
				yPos += _borderPadding + _thumbSize;
				currRow++;
			}

			var currentThumb = _thumbnailScrollView.children[i];

			// @fixme: there is a LOT of repeated code here...
			var iv_w = 0;
			var iv_h = 0;
			
			var img = _params.images[i];
			var imgr = img.renditions[0];
			var img_w = parseInt (imgr.width);
			var img_h = parseInt (imgr.height);
			
			if (img_w > img_h)
			{
				iv_w = (_thumbSize - (6 * _dpifactor));
				iv_h = parseInt (_thumbSize * img_h / img_w - (6 * _dpifactor));
			}
			else
			{
				iv_h = (_thumbSize - (6 * _dpifactor));
				iv_w = parseInt (_thumbSize * img_w / img_h - (6 * _dpifactor));
			}

			currentThumb.width = _thumbSize;
			currentThumb.height = _thumbSize;

			currentThumb.left = xPos;
			currentThumb.top = yPos;

			currentThumb.children[0].width = iv_w;
			currentThumb.children[0].height = iv_h;
			
			currentThumb.children[0].top = parseInt ((_thumbSize - iv_h) / 2);
			currentThumb.children[0].left = parseInt ((_thumbSize - iv_w) / 2);

			// Increments values (thumb layout)
			currCol++;
			xPos += _thumbSize + _borderPadding;
		}
	}


	var computeSizes = function() 
	{
		_numCols = _params.numCols;
		
		if (TU.Device.getDisplayWidth () > TU.Device.getDisplayHeight ()) 
		{
			// Landscape
			_numCols = _params.numColsLandscape;
		} 
		else 
		{
			_numCols = _params.numColsPortrait;
		}

		_borderPadding = (_params.borderPadding);
		_thumbSize = (TU.Device.getDisplayWidth() - ((_numCols + 1) * _borderPadding)) / _numCols;
	}

	var createThumbGallery = function() 
	{
		_thumbnailScrollView = Ti.UI.createScrollView({
			top: 0,
			bottom: (_adView == null) ? 0 : _adView.getHeight (),
			
			contentWidth: '100%',

			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: false,

			backgroundColor: _params.backgroundColor
		});

		computeSizes();

		// Laying out thumbnails
		var currCol = 0;
		var currRow = 0;
		var yPos = _borderPadding;
		var xPos = _borderPadding;

		for (var i = 0, b = _params.images.length; i < b; i++) 
		{
			if (currCol % _numCols === 0 && currCol > 0) {
				xPos = _borderPadding;
				yPos += _borderPadding + _thumbSize;
				currRow++;
			}

			// Border of the thumbnail (make the thumbnail look a bit like a real picture).
			var thumbImageBorder = Ti.UI.createView({

				width : _thumbSize,
				height : _thumbSize,

				imageId : i,

				left : xPos,
				top : yPos,

				backgroundColor : _params.backgroundColor,
				borderWidth: _params.borderWidth,
				borderColor: _params.borderColor
			});

			var img = _params.images[i];
			var imgr = img.renditions[0];
			var thumbPath = imgr.url;

			var iv_w = 0;
			var iv_h = 0;
			
			var img_w = parseInt (imgr.width);
			var img_h = parseInt (imgr.height);
			
			if (img_w > img_h)
			{
				iv_w = (_thumbSize - (6 * _dpifactor));
				iv_h = parseInt (_thumbSize * img_h / img_w - (6 * _dpifactor));
			}
			else
			{
				iv_h = (_thumbSize - (6 * _dpifactor));
				iv_w = parseInt (_thumbSize * img_w / img_h - (6 * _dpifactor));
			}

			var thumbImage = Ti.UI.createImageView({

				image : thumbPath,
				imageId : i,

				width : iv_w,
				height : iv_h,

				top : parseInt ((_thumbSize - iv_h) / 2),
				left : parseInt ((_thumbSize - iv_w) / 2)
			});

			thumbImageBorder.add(thumbImage);

			thumbImageBorder.addEventListener('click', function(e) {
				
				_popup = new GalleryViewPopup (_params.images, e.source.imageId, _adViewClass);
				_popup.barColor = _params.barColor;

				TU.UI.TGWM.openWindow (_popup);
			});

			_thumbnailScrollView.add(thumbImageBorder);

			// Increments values (thumb layout)
			currCol++;
			xPos += _thumbSize + _borderPadding;

		}
		
		_self.add(_thumbnailScrollView);
		if (_adView != null)
		{
			_self.add (_adView);
		}
	}

	createThumbGallery();
	
	Ti.Gesture.addEventListener('orientationchange', recomputeSizes);

	_self.addEventListener('close', function() {
		Ti.Gesture.removeEventListener('orientationchange', recomputeSizes);
	});

	return _self;
}

GalleryView.TUInit = function (tu)
{
	TU = tu;
}

module.exports = GalleryView;

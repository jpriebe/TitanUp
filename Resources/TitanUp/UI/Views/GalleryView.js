/**
 * Originally based on https://github.com/novelys/titanium-picture-gallery
 */

/**
 * To use, you must initialize it with an params object, which has a "config" property,
 * which is an object with an "images" property.  The images property is an array of objects, each of which
 * has either a headline or an abstract (or both -- GalleryView will use the longer of the two for the
 * caption), and an array of 2 renditions, a smaller one for the thumbnail
 * view, and a larger one for the full-size view.  Each rendition has a width, height,
 * and URL as shown below:
 *
 * var gv = TU.UI.createGalleryView ({
 *     config: {
 *         images: [{
 *             headline: 'Short title for image',
 *             abstact: 'Longer title for image is here',
 *             renditions: [
 *                 {
 *                     width: 120,
 *                     height: 90,
 *                     url: 'http://www.sample.com/foo-120x90.jpg'
 *                 },
 *                 {
 *                     width: 640,
 *                     height: 480,
 *                     url: 'http://www.sample.com/foo-640x480.jpg'
 *                 }
 *             ]
 *         },
 *         ...
 *         ]
 *     }
 * });

 */


var TU = null;
var GalleryViewPopup = require ('/TitanUp/UI/Views/GalleryViewPopup');
var GalleryViewImagePager = require ('/TitanUp/UI/Views/GalleryViewImagePager');



function GalleryView (params)
{
	var _self = null;
	var _thumbnailScrollView = null;
	var _adView = null;
	var _popup = null;

    var _startIndex = false;
    var _allowThumbView = true;
    var _genFixedAdCallback = null;
    var _genInterstitialCallback = null;
    var _title = 'Gallery';
    var _images = [];

	var _numCols = 3;
    var _numColsPortrait = 3;
    var _numColsLandscape = 4;

    var _cellMargin = 4;
	var _cellPadding = 0;
    var _borderColor = '#fff';
    var _borderWidth = 1;

    var _backgroundColor = '#000';
    var _cellBackgroundColor = '#333';
    var _textColor = '#fff';
    var _barColor = '#000';

	var _thumbSize = 0;
	var _dpifactor = 0;
    var _showImageCount = false;

    var _lastLoadedOrientation = '';

    var _collapseLabelProps = {
        font: { fontFamily: JSON.parse (JSON.stringify (TU.UI.Theme.fonts.medium)), fontSize: 13 },
        title: "\u25BC"
    };
    var _expandLabelProps = {
        font: { fontFamily: JSON.parse (JSON.stringify (TU.UI.Theme.fonts.medium)), fontSize: 13 },
        title: "\u25B2"
    };

    _process_params ();
    _init ();
    return _self;


    function _process_params ()
    {
        var newparams = {};
        if (typeof params !== 'undefined')
        {
            newparams = JSON.parse (JSON.stringify (params));
        }

        // restore some objects that don't survive the JSON processing
        if (typeof params.config !== 'undefined')
        {
            if (typeof params.config.genFixedAdCallback !== 'undefined')
            {
                newparams.config.genFixedAdCallback = params.config.genFixedAdCallback;
            }
            if (typeof params.config.genInterstitialCallback !== 'undefined')
            {
                newparams.config.genInterstitialCallback = params.config.genInterstitialCallback;
            }
        }

        params = newparams;

        var config = {};
        if (typeof params.config !== 'undefined')
        {
            config = params.config;
            delete params.config;
        }
        
        if (typeof config.startIndex !== 'undefined')
        {
            _startIndex = config.startIndex;
        }

        if (typeof config.allowThumbView !== 'undefined')
        {
            _allowThumbView = config.allowThumbView;
        }

        if (typeof config.genFixedAdCallback !== 'undefined')
        {
            _genFixedAdCallback = config.genFixedAdCallback;
        }

        if (typeof config.genInterstitialCallback !== 'undefined')
        {
            _genInterstitialCallback = config.genInterstitialCallback;
        }

        if (typeof config.title !== 'undefined')
        {
            _title = config.title;
        }

        if (typeof config.images !== 'undefined')
        {
            _images = config.images;
        }

        if (typeof config.numCols !== 'undefined')
        {
            _numCols = config.numCols;
            _numColsPortrait = config.numCols;
            _numColsLandscape = config.numCols;
        }

        if (typeof config.numColsPortrait !== 'undefined')
        {
            _numColsPortrait = config.numColsPortrait;
        }

        if (typeof config.numColsLandscape !== 'undefined')
        {
            _numColsLandscape = config.numColsLandscape;
        }

        if (typeof config.cellPadding !== 'undefined')
        {
            _cellPadding = config.cellPadding;
        }

        if (typeof config.cellMargin !== 'undefined')
        {
            _cellMargin = config.cellMargin;
        }

        if (typeof config.borderColor !== 'undefined')
        {
            _borderColor = config.borderColor;
        }

        if (typeof config.borderWidth !== 'undefined')
        {
            _borderWidth = config.borderWidth;
        }

        if (typeof config.backgroundColor !== 'undefined')
        {
            _backgroundColor = config.backgroundColor;
        }

        if (typeof config.cellBackgroundColor !== 'undefined')
        {
            _cellBackgroundColor = config.cellBackgroundColor;
        }

        if (typeof config.textColor !== 'undefined')
        {
            _textColor = config.textColor;
        }

        if (typeof config.barColor !== 'undefined')
        {
            _barColor = config.barColor;
        }

        if (typeof config.showImageCount !== 'undefined')
        {
            _showImageCount = config.showImageCount;
        }

        if (typeof config.collapseLabelProps !== 'undefined')
        {
            _collapseLabelProps = config.collapseLabelProps;
        }
        
        if (typeof config.expandLabelProps !== 'undefined')
        {
            _expandLabelProps = config.expandLabelProps;
        }
    }


    function _init ()
    {
        if (!_allowThumbView)
        {
            var idx = (_startIndex !== false) ? _startIndex : 0;

            _self = new GalleryViewImagePager ({
                config: {
                    images: _images,
                    startIndex: idx,
                    genFixedAdCallback: _genFixedAdCallback,
                    genInterstitialCallback: _genInterstitialCallback,
                    showImageCount: _showImageCount,
                    collapseLabelProps: _collapseLabelProps,
                    expandLabelProps: _expandLabelProps
                }
            });
            _self.barColor = _barColor;

            _popup = _self;

            return _self;
        }

        _dpifactor = TU.Device.getDpi () / 160;

        _self = Ti.UI.createView ({
            backgroundColor: _backgroundColor
        });

        load_content ();

        if (_startIndex !== false)
        {
            openPopup (_startIndex);
        }

        _self.onorientationchange = onorientationchange;

        return _self;
    }


	function computeSizes ()
	{
		if (TU.Device.getDisplayWidth () > TU.Device.getDisplayHeight ())
		{
			// Landscape
            _numCols = _numColsLandscape;
		} 
		else 
		{
            _numCols = _numColsPortrait;
		}

		_thumbSize = parseInt ((TU.Device.getDisplayWidth() - ((_numCols + 1) * _cellMargin)) / _numCols);
	}

	function load_content ()
	{
        if (!_allowThumbView)
        {
            _lastLoadedOrientation = Ti.Gesture.isLandscape () ? 'landscape' : 'portrait';
            return;
        }

       	TU.Logger.debug ('[GalleryView] load_content() entering...');

        _self.removeAllChildren ();

        _adView = null;
        if (!Ti.Gesture.isLandscape ())
        {
            if (_genFixedAdCallback)
            {
            	TU.Logger.debug ('[GalleryView] adding ad view...');
                _adView = _genFixedAdCallback ({bottom: 0}, 'thumbs');
            }
        }

		_thumbnailScrollView = Ti.UI.createScrollView({
			top: 0,
			bottom: (_adView == null) ? 0 : _adView.getHeight (),
			
			contentWidth: '100%',

			showVerticalScrollIndicator: true,
			showHorizontalScrollIndicator: false,

			backgroundColor: _backgroundColor
		});

		computeSizes();

		// Laying out thumbnails
		var currCol = 0;
		var currRow = 0;
		var yPos = _cellMargin;
		var xPos = _cellMargin;

		for (var i = 0, b = _images.length; i < b; i++)
		{
			if (currCol % _numCols === 0 && currCol > 0) {
				xPos = _cellMargin;
				yPos += _cellMargin + _thumbSize;
				currRow++;
			}

			// Border of the thumbnail (make the thumbnail look a bit like a real picture).
			var thumbImageBorder = Ti.UI.createView({

				width : _thumbSize,
				height : _thumbSize,

				imageIdx : i,

				left : xPos,
				top : yPos,

                backgroundColor: _cellBackgroundColor,
				borderWidth: _borderWidth,
				borderColor: _borderColor
			});

			var img = _images[i];
			var imgr = img.renditions[0];
			var thumbPath = imgr.url;

			var iv_w = 0;
			var iv_h = 0;
			
			var img_w = parseInt (imgr.width);
			var img_h = parseInt (imgr.height);

            /*
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
			*/

            if (img_w > img_h)
            {
                iv_w = _thumbSize - (2 * _cellPadding);
                iv_h = parseInt (_thumbSize * img_h / img_w);
            }
            else
            {
                iv_h = _thumbSize - (2 * _cellPadding);
                iv_w = parseInt (_thumbSize * img_w / img_h);
            }

			var thumbImage = Ti.UI.createImageView({

				image : thumbPath,
                defaultImage: '',

                imageIdx : i,

				width : iv_w,
				height : iv_h,

				top : parseInt ((_thumbSize - iv_h) / 2),
				left : parseInt ((_thumbSize - iv_w) / 2)
			});

			thumbImageBorder.add(thumbImage);

			thumbImageBorder.addEventListener('click', function (e) {
                openPopup(e.source.imageIdx);
            });

			_thumbnailScrollView.add(thumbImageBorder);

			// Increments values (thumb layout)
			currCol++;
			xPos += _thumbSize + _cellMargin;

		}
		
		_self.add(_thumbnailScrollView);
		if (_adView != null)
		{
			_self.add (_adView);
		}

        _lastLoadedOrientation = Ti.Gesture.isLandscape () ? 'landscape' : 'portrait';
    }

    function openPopup (imageIdx)
    {
        _popup = new GalleryViewPopup ({
            config: {
                images: _images,
                startIndex: imageIdx,
                genFixedAdCallback: _genFixedAdCallback,
                genInterstitialCallback: _genInterstitialCallback,
                showImageCount: _showImageCount
            }
        });
        _popup.barColor = _barColor;

        _popup.addEventListener ('imagechanged', function (e) {
            _self.fireEvent ("imagechanged", e);
        });

        _popup.addEventListener ('close', function (e) {
            _popup = null;
        });

        TU.UI.openWindow (_popup);
    }

    function onorientationchange (e)
    {
        var new_orientation = Ti.Gesture.isLandscape () ? 'landscape' : 'portrait';

        TU.Logger.debug ('[GalleryView] onorientationchange; new_orientation: ' + new_orientation);

        if (new_orientation == _lastLoadedOrientation)
        {
            return;
        }

        load_content ();

        if (_popup != null)
        {
            _popup.onorientationchange ();
        }
    }
}

GalleryView.TUInit = function (tu)
{
	TU = tu;
    GalleryViewPopup.TUInit (tu);
};

module.exports = GalleryView;

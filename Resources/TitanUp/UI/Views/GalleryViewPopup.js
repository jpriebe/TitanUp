var TU = null;

var GalleryViewImagePager = require ('/TitanUp/UI/Views/GalleryViewImagePager');

function GalleryViewPopup (params) {
    var _self = null;
    var _gvip = null;

    var _images = [];
    var _startIndex = 0;
    var _genFixedAdCallback = null;
    var _genInterstitialCallback = null;
    var _showImageCount = false;

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

        if (typeof config.images !== 'undefined')
        {
            _images = config.images;
        }

        if (typeof config.startIndex !== 'undefined')
        {
            _startIndex = config.startIndex;
        }

        if (typeof config.showImageCount !== 'undefined')
        {
            _showImageCount = config.showImageCount;
        }

        if (typeof config.genFixedAdCallback !== 'undefined')
        {
            _genFixedAdCallback = config.genFixedAdCallback;
        }

        if (typeof config.genInterstitialCallback !== 'undefined')
        {
            _genInterstitialCallback = config.genInterstitialCallback;
        }
    }

    function _init ()
    {
        var wparams = {
            backgroundColor : '#000',
            title : (_startIndex + 1) + ' of ' + _images.length,
            translucent : true,
            orientationModes: [
                Ti.UI.PORTRAIT,
                Ti.UI.UPSIDE_PORTRAIT,
                Ti.UI.LANDSCAPE_LEFT,
                Ti.UI.LANDSCAPE_RIGHT
            ]
        };

        if (TU.Device.getOS() == 'android')
        {
            wparams.fullscreen = true;
            wparams.navBarHidden = true;
        }

        _self = TU.UI.createOAWindow(wparams);

        _gvip = new GalleryViewImagePager ({
            config: {
                images: _images,
                startIndex: _startIndex,
                genFixedAdCallback: _genFixedAdCallback,
                genInterstitialCallback: _genInterstitialCallback,
                showImageCount: _showImageCount
            }
        });

        _self.add (_gvip);

        _self.addEventListener ('onorientationchange', function () {
            _gvip.onorientationchange();
        });
    }
}

GalleryViewPopup.TUInit = function (tu)
{
    TU = tu;
    GalleryViewImagePager.TUInit (tu);
};

module.exports = GalleryViewPopup;
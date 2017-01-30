var TU = null;
var TiTouchImageView = null;

function GalleryViewImagePager (params) {

    var _self = null;
    var _scrollableGalleryView = null;
    var _vp = null;
    var _captionView = null;
    var _captionOverlay = null;
    var _captionExpandedLabel = null;
    var _adView = null;

    var _captionExpandedDownArrowLabel = null;
    var _captionCollapsedArrowLabel = null;

    var _images = [];
    var _views = [];
    var _startIndex = 0;
    var _effective_start_index = 0;
    var _curr_page_index = -1;      // what physical page of the ViewPager on we on?
    var _curr_image_index = -1;     // what is the last actual image user looked at (excluding ads)
    var _genFixedAdCallback = null;
    var _genInterstitialCallback = null;
    var _showImageCount = false;

    var _pager_bottom = 0;

    var _isUiHidden = false;

    var _lastLoadedOrientation = '';
    var _caption_collapsed_height = 0;
    var _caption_expanded_height = 0;
    var _caption_margin = 4;
    var _caption_fs = 13;
    var _caption_font = JSON.parse (JSON.stringify (TU.UI.Theme.fonts.medium));
    _caption_font.fontSize = _caption_fs;

    var _collapseLabelProps = null;
    var _expandLabelProps = null;
    
    var _caption_is_collapsed = false;

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
        var vparams = {
            backgroundColor : '#000',
            translucent : true
        };

        _self = Ti.UI.createView(vparams);

        _self.onorientationchange = onorientationchange;

        load_content ();

        TU.Logger.debug ('[GVIP] _init(); curr_page_index = ' + _curr_page_index);
        load_neighboring_images (-1, _curr_page_index);
    }



    /**
     * Recompute the size of a given image size, in order to make it fit
     * into the screen.
     * @param {Number} width
     * @param {Number} height
     * @returns {Object} new width and the new height.
     */
    function recompute_image_size (width, height)
    {
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
                newHeight = parseInt ((height * pw) / width);
                newWidth = pw;

            }
            else if (height > ph) {
                newWidth = parseInt ((width * ph) / height);
                newHeight = ph;
            }

        }
        else {
            if (height > ph) {
                newWidth = parseInt ((width * ph) / height);
                newHeight = ph;

            }
            else if (width > pw) {
                newHeight = parseInt ((height * pw) / width);
                newWidth = pw;
            }

        }

        //TU.Logger.debug ("[GalleryViewImagePager] recompute_image_size (" + width + ", " + height + ") ==> " + newWidth + ", " + newHeight);

        return {
            width : newWidth,
            height : newHeight
        };
    }

    function recursive_remove_children (v, depth)
    {
        if (typeof depth === 'undefined')
        {
            depth = 0;
        }

        var prefix = '';
        var i;
        for (i = 0; i < depth; i++)
        {
            prefix += "    ";
        }

        for (i = 0; i < v.children.length; i++)
        {
            var vc = v.children[i];
            TU.Logger.debug (prefix + "[" + i + "] ");
            if (vc.children.length > 0)
            {
                recursive_remove_children (vc, depth + 1);
            }

            v.remove (vc);
        }
    }

    function unload_image (idx)
    {
        if ((idx < 0) || (idx > _views.length - 1))
        {
            TU.Logger.warn ('[GVIP] unload_image(): page index ' + idx + ' out of bounds (' + _views.length + ' views in gallery)');
            return;
        }

        if (typeof _views[idx].image_index === 'undefined')
        {
            TU.Logger.debug ('[GVIP] unload_image(): page ' + idx + ' does not contain an image; skipping...');
            return;
        }


        TU.Logger.debug ('[GVIP] unloading image ' + _views[idx].image_index + ' (page ' + idx + ")");

        TU.Logger.debug ("[GVIP] available memory: " + Ti.Platform.availableMemory);

        if (typeof _views[idx].image_view !== 'undefined')
        {
            // this is a TiTouchImageView -- take special care to manage memory
            _views[idx].image_view.recycleBitmap ();
        }

        // I thought this might have something to do with it, but maybe not....
        //recursive_remove_children (_views[idx]);
        _views[idx].removeAllChildren ();

        _views[idx].status = 'unloaded';
    }

    function load_image (idx)
    {
        if ((idx < 0) || (idx > _views.length - 1))
        {
            TU.Logger.warn ('[GVIP] load_image(): page index ' + idx + ' out of bounds (' + _views.length + ' views in gallery)');
            return;
        }

        if (typeof _views[idx].image_index === 'undefined')
        {
            TU.Logger.debug ('[GVIP] load_image(): page ' + idx + ' does not contain an image; skipping...');
            return;
        }

        var image_index = _views[idx].image_index;

        var status = _views[idx].status;
        if (status != 'unloaded')
        {
            return;
        }

        _views[idx].status = 'loaded';

        TU.Logger.debug ('[GVIP] loading image ' + image_index + ' (page ' + idx + ")");

        var img = _images[image_index];
        var imgr = img.renditions[1];
        var url = imgr.url;
        var is = recompute_image_size (imgr.width, imgr.height);
        var iv = create_zoomable_imageview(url, is.width, is.height);

        _views[idx].add (iv);
    }

    function load_neighboring_images (prev_idx, curr_idx)
    {
        if (prev_idx == curr_idx)
        {
            return;
        }

        TU.Logger.debug ('[GVIP] load_neighboring_images (' + prev_idx + ", " + curr_idx + ')');

        var unload_idx = -1;
        if (prev_idx > curr_idx)
        {
            unload_idx = prev_idx + 2;
        }
        else if (prev_idx < curr_idx)
        {
            unload_idx = prev_idx - 2;
        }

        if ((unload_idx >= 0) && (unload_idx < _views.length))
        {
            unload_image (unload_idx);
        }

        var start = curr_idx - 2;
        var end = curr_idx + 2;

        if (start < 0)
        {
            start = 0;
        }
        if (end > _views.length - 1)
        {
            end = _views.length - 1;
        }

        TU.Logger.debug ('[GVIP] loading from ' + start + ' to ' + end);

        for (var i = start; i <= end; i++)
        {
            load_image (i);
        }
    }

    function load_image_via_xhr (v, url)
    {
        var xhr = Ti.Network.createHTTPClient ();

        xhr.onload = function (e) {

            // now that we've got the image data, we can create the view
            var iv = TiTouchImageView.createView({
                backgroundColor : '#000',
                image: e.source.responseData,
                defaultImage: '',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zoom: 1,
                maxZoom: 3,
                minZoom: 0.25
            });

            v.image_view = iv;

            v.add (iv);
        };

        xhr.onerror = function (e) {
            TU.Logger.warn ("[GVIP] Could not load image from: " + url);
        };

        xhr.setTimeout (30000);
        xhr.open ('GET', url);
        xhr.send ();
    }



    function create_zoomable_imageview (url, w, h)
    {
        if (TiTouchImageView != null)
        {
            var v = Ti.UI.createView ({
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            });

            load_image_via_xhr (v, url);
            return v;
        }


        //var view = Ti.UI.createImageView({
        var view = TU.UI.createRemoteImageView({
            backgroundColor : '#000',
            width : w,
            height : h,
            image : url,
            defaultImage: ''
        });

        var sv = Ti.UI.createScrollView({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            maxZoomScale: 3.0
        });

        sv.add (view);

        return sv;
    }

    function build_views ()
    {
        _effective_start_index = 0;

        _views = [];
        for (var i = 0, b = _images.length; i < b; i++) {

            if (_genInterstitialCallback != null)
            {
                var interstitial = _genInterstitialCallback (i);

                if (interstitial != null)
                {
                    var wrapper = Ti.UI.createView ({
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    });

                    wrapper.add (interstitial);

                    _views.push (wrapper);
                }
            }

            var view;

            var url = _images[i].renditions[1].url;
            //TU.Logger.debug ('[GalleryViewImagePager]  - ' + url);

            // create placeholder view
            var view = Ti.UI.createView ({
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            });
            view.image_index = i;
            view.status = 'unloaded';
            _views.push (view);

            if (i == _startIndex)
            {
                _effective_start_index = _views.length - 1;
            }

            // Not very optimized... But Android scrollableView does not respond to tap event.
            // Views in the other hand, do.
            view.addEventListener('singletap', toggleUI);
        }
    }

    function build_content_view ()
    {
        _scrollableGalleryView = Ti.UI.createScrollableView({
            top : 0,
            bottom : _pager_bottom,
            views : _views,
            showPagingControl : false,
            maxZoomScale : 2.0
        });

        _scrollableGalleryView.addEventListener ('scrollend', function (e) {
            if (e.source != _scrollableGalleryView)
            {
                return;
            }

            var prev_page_index = _curr_page_index;

            _curr_page_index = e.currentPage;

            load_neighboring_images (prev_page_index, _curr_page_index);

            set_caption ();

            var v = _views[e.currentPage];
            if (typeof v.image_index !== 'undefined')
            {
                _curr_image_index = v.image_index;
                _self.fireEvent ("imagechanged", { index: v.image_index });
            }
        });

        if (_curr_page_index != -1)
        {
            // we're here because of an orientation change; preserve the last page viewed
            _scrollableGalleryView.currentPage = _curr_page_index;
        }
        else
        {
            _scrollableGalleryView.currentPage = _effective_start_index;
            _curr_page_index = _effective_start_index;
        }
        
        _self.add(_scrollableGalleryView);
    }

    function load_content ()
    {
        var curr_orientation = get_orientation ();

        if (!TU.Device.getIsTablet() && (TU.Device.getOS() == 'ios'))
        {
            TU.Logger.debug ('[VideoView] orientation: ' + _self.current_orientation);
            if (curr_orientation == 'landscape')
            {
                TU.Logger.debug ('[VideoView] hiding navbar...');
                TU.UI.hide_navbar ();
            }
            else
            {
                TU.Logger.debug ('[VideoView] showing navbar...');
                TU.UI.show_navbar ();
            }
        }

        _self.removeAllChildren ();

        _pager_bottom = 0;

        if (curr_orientation != 'landscape')
        {
            if (_genFixedAdCallback != null)
            {
                _adView = _genFixedAdCallback ({bottom: 0}, 'full');
            }

            if (_adView !== null)
            {
                _self.add(_adView);
                _pager_bottom += _adView.getHeight ();
            }
        }

        build_views ();
        build_content_view ();

        _caption_collapsed_height = parseInt (_caption_fs * 3.5);

        _captionView = Ti.UI.createView ({
            left: _caption_margin,
            right: _caption_margin,
            bottom : _pager_bottom + _caption_margin,
            height: _caption_collapsed_height,
            zIndex: 100,
            visible: true
        });

        _captionView.addEventListener('click', on_captionView_click);

        _captionOverlay = Ti.UI.createView ({
            left: 0,
            right: 0,
            height: Ti.UI.FILL,
            backgroundColor: '#000',
            opacity: 0.5
        });

        _captionCollapsedArrowLabel = Ti.UI.createLabel({
            text: _expandLabelProps.title,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            color : '#fff',
            font : _expandLabelProps.font,
            zIndex : 2,
            visible: false
        });

        _caption_height = _captionCollapsedArrowLabel.rect.height + 32;

        _captionView.add (_captionOverlay);
        _captionView.add (_captionCollapsedArrowLabel);

        _captionExpandedLabel = Ti.UI.createLabel({
            text: '',
            left: _caption_margin,
            right: _caption_margin,
            color : '#fff',
            font : _caption_font,
            zIndex : 2,
            visible: false
        });

        _captionExpandedDownArrowLabel = Ti.UI.createLabel({
            text: _collapseLabelProps.title,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            top: 0,
            color : '#fff',
            font : _collapseLabelProps.font,
            zIndex : 2,
            visible: false
        });

		_caption_expanded_height = _captionExpandedLabel.rect.height + _captionExpandedDownArrowLabel.rect.height + 32;
        _captionExpandedLabel.addEventListener ('postlayout', on_expcap_postlayout);

        _captionView.add (_captionExpandedDownArrowLabel);
        _captionView.add (_captionExpandedLabel);

        _self.add(_captionView);

        load_neighboring_images (-1, _curr_page_index);

        set_caption ();

        var v = _views[_curr_page_index];
        if (typeof v.image_index !== 'undefined')
        {
            _curr_image_index = v.image_index;
	        _self.fireEvent ("imagechanged", { index: _startIndex });
        }

        _lastLoadedOrientation = get_orientation ();
    }


    function on_expcap_postlayout (e)
    {
        if (_captionExpandedLabel.rect.height == 0)
        {
            return;
        }

        _caption_expanded_height = _captionExpandedLabel.rect.height + _captionExpandedDownArrowLabel.rect.height + 32;
		//_caption_expanded_height = _captionExpandedLabel.rect.height + 32;
		TU.Logger.debug ("[GVIP] setting _caption_expanded_height = " + _caption_expanded_height);

        _caption_expanded_height = _captionExpandedLabel.rect.height + 32;

        if (!_caption_is_collapsed)
        {
            _captionView.setHeight (_caption_expanded_height);
        }
    }


    var _last_orientation = '';
    function get_orientation ()
    {
        var o = _last_orientation;
        if (Ti.Gesture.isLandscape ())
        {
            o = 'landscape';
        }
        else if (Ti.Gesture.isPortrait ())
        {
            o = 'portrait';
        }

        return o;
    }


    function clear_caption ()
    {
        _captionView.setVisible (false);
    }

    function set_caption ()
    {
        var v = _views[_curr_page_index];
        if (typeof v.image_index === 'undefined')
        {
            clear_caption ();
            return;
        }

        var idx = v.image_index;

        var headline = (typeof _images[idx].headline !== 'undefined') ? _images[idx].headline : '';
        var abstract = (typeof _images[idx].abstract !== 'undefined') ? _images[idx].abstract : '';

        var caption = (headline.length > abstract.length) ? headline : abstract;

        if (_showImageCount)
        {
            var idx1 = idx + 1;
            caption = "[ " + idx1 + " / " + _images.length + " ]\n" + caption;
        }

        _captionExpandedLabel.text = caption;

        if (_caption_is_collapsed)
        {
            _captionView.setHeight (_caption_collapsed_height);
            _captionExpandedLabel.setVisible (false);
            _captionExpandedDownArrowLabel.setVisible (false);
            _captionCollapsedArrowLabel.setVisible (true);
        }
        else
        {
            _captionView.setHeight (_caption_expanded_height);
            _captionExpandedLabel.setVisible (true);
            _captionExpandedDownArrowLabel.setVisible (true);
            _captionCollapsedArrowLabel.setVisible (false);
        }

        _captionView.setVisible (true);
    }


    function on_captionView_click (e)
    {
        if (_caption_is_collapsed)
        {
            _caption_is_collapsed = false;
        }
        else
        {
            _caption_is_collapsed = true;
        }

        set_caption();

        e.cancelBubble = true;
    }

    /**
     * toggle caption, navigation arrows and title bar.
     */
    function toggleUI ()
    {
        var w = TU.UI.getActiveWindow ();
        
        if (_isUiHidden)
        {
            if (w != null)
            {
                if (TU.Device.getOS () == 'ios')
                {
                    w.showNavBar ();
                }
                else if (TU.Device.getOS () == 'android')
                {
                    w.activity.actionBar.show();
                }
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
            if (w != null)
            {
                if (TU.Device.getOS () == 'ios')
                {
                    w.hideNavBar ();
                }
                else if (TU.Device.getOS () == 'android')
                {
                    w.activity.actionBar.hide();
                }
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

    function onorientationchange (e)
    {
        var new_orientation = get_orientation ();

        //TU.Logger.debug ('[GalleryView] onorientationchange; new_orientation: ' + new_orientation);

        if (new_orientation == _lastLoadedOrientation)
        {
            return;
        }

        load_content ();
    }
}

GalleryViewImagePager.TUInit = function (tu)
{
    TU = tu;

    if (TU.Device.getOS() == 'android')
    {
        try
        {
            TiTouchImageView = require('org.iotashan.TiTouchImageView');
        }
        catch (e)
        {
            TU.Logger.debug ("[GVIP] could not load TiTouchImageView");
        }
    }
};

module.exports = GalleryViewImagePager;
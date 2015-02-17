var TU = null;

/**
 * This ImageView is a little different from the stock ImageView in that it uses HTTPClient to
 * retrieve remote images so that it can trigger events properly
 *
 * @param params
 * @constructor
 */
function RemoteImageView (params)
{
    var _self;
    var _url;
    var _onload = null;

    _process_params ();
    _init ();

    return _self;

    function _process_params ()
    {
    	var newparams = JSON.parse (JSON.stringify (params));
    	
    	if (typeof params.onload !== 'undefined')
    	{
    		newparams.onload = params.onload;
    	}

        if (typeof params.image === 'undefined')
        {
            throw {
                message: 'Error: must define params.image when instantiating RemoteImageView.'
            };
        }

        _url = params.image;
        delete params.image;

        if (typeof params.onload !== 'undefined')
        {
            _onload = params.onload;
        }
    }

    function _init ()
    {
        _self = Ti.UI.createImageView (params);
        load ();
    }

    function load ()
    {
        var xhr = Ti.Network.createHTTPClient ();

        xhr.onload = onload;
        xhr.onerror = onerror;
        xhr.setTimeout (30000);          // ...or whatever is appropriate
        xhr.open ('GET', _url);
        xhr.send ();
    }

    function onload (e)
    {
        var uri = e.source.location;

        _self.image = e.source.responseData;

        if (_onload != null)
        {
            _onload ({ url: _url });
        }
    }

    function onerror (e)
    {
        TU.Logger.warn ("Could not load image from: " + _url);
    }
}

RemoteImageView.TUInit = function (tu)
{
    TU = tu;
};

module.exports = RemoteImageView;
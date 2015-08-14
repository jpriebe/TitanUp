var TU = null;

function TextField (params)
{
    var _self, _wrapper;

    var _pleft = 0,
        _pright = 0;


    if (TU.Device.getOS () != 'android')
    {
        _self = Ti.UI.createTextField (params);
        return _self;
    }

    // because we're going to delete some properties from the params array,
    // it's better that we clone it first so the caller doesn't experience
    // weird side effects
    params = JSON.parse (JSON.stringify (params));

    if (typeof params.paddingLeft !== 'undefined')
    {
        _pleft = params.paddingLeft;
    }
    if (typeof params.paddingRight !== 'undefined')
    {
        _pright = params.paddingRight;
    }

    _wrapper = Ti.UI.createView (params);

    if (typeof params.width !== 'undefined')
    {
        params.width -= (_pleft + _pright);
    }

    params.left = _pleft;
    params.right = _pright;
    params.top = 0;
    params.bottom = 0;
    params.backgroundColor = 'transparent';

    if (TU.Device.getAndroid5Plus())
    {
        params.top = 4;
        delete params.bottom;
    }

    _self = Ti.UI.createTextField(params);

    _wrapper.add (_self);

    _self.wrapper = _wrapper;

    return _self;
}

TextField.TUInit = function (tu)
{
    TU = tu;
};

module.exports = TextField;
/*
 Modified from code found here:
 https://developer.appcelerator.com/question/154274/is-there-a-way-to-create-circular-progress-bar
 http://pastie.org/8953493
 */

var TU = null;


/*
 params.config.progress: A value between 0 and 1
 params.config.size: The size of the circular progress bar
 params.config.margin: The margin of the circular progress bar
 params.config.progressColor: The backgroundColor of the progress bar
 --
 params.config.topper.color: The center circle color
 params.config.topper.size: The size of the center circle
 ---
 params.config.font.visible: Boolean to display the font or not
 params.config.font.color: The font color
 params.config.font.size: The fontSize
 params.config.font.shadowColor: The font shadow color
 params.config.font.shadowRadius: The font shadow radius
 params.config.font.shadowOffset.x: The x value of the shadow shadowOffset
 params.config.font.shadowOffset.y: The y value of the shadow shadowOffset
 */
function CircularProgressBar (params)
{
    var _self = null;
    var _wrapper = null;
    var _layer1 = null;
    var _layer2 = null;
    var _layer3 = null;
    var _layer4 = null;
    var _l_progress = null;
    var _topper = null;

    var _config = null;

    _process_params ();
    _init ();

    return _self;


    function _process_params ()
    {
        if (typeof params === 'undefined')
        {
            params = {};
        }
        else
        {
            params = JSON.parse (JSON.stringify (params));
        }

        if (typeof params.backgroundColor === 'undefined') params.backgroundColor = '#fff';

        _config = {};

        if (typeof params.config !== 'undefined')
        {
            _config = params.config;
            delete params.config;
        }

        if (typeof _config.progress === 'undefined' || _config.progress > 1 || _config.progress < 0) _config.progress = 0;
        if (typeof _config.size === 'undefined') _config.size = 46;
        if (typeof _config.margin === 'undefined') _config.margin = 4;
        if (typeof _config.progressColor === 'undefined') _config.progressColor = TU.UI.Theme.highlightColor;
        if (typeof _config.topper === 'undefined') _config.topper = {};
        if (typeof _config.topper.color === 'undefined') _config.topper.color = TU.UI.Theme.lightBackgroundColor;
        if (typeof _config.topper.size === 'undefined') _config.topper.size = _config.size - 10;
        if (typeof _config.font === 'undefined') _config.font = {};
        if (typeof _config.font.visible === 'undefined') _config.font.visible = true;
        if (typeof _config.font.size === 'undefined') _config.font.size = 12;
        if (typeof _config.font.color === 'undefined') _config.font.color = TU.UI.Theme.darkTextColor;
        if (typeof _config.font.shadowColor === 'undefined') _config.font.shadowColor = TU.UI.Theme.mediumTextColor;
        if (typeof _config.font.shadowRadius === 'undefined') _config.font.shadowRadius = 1;
        if (typeof _config.font.shadowOffset === 'undefined') _config.font.shadowOffset = {};
        if (typeof _config.font.shadowOffset.x === 'undefined') _config.font.shadowOffset.x = 0;
        if (typeof _config.font.shadowOffset.y === 'undefined') _config.font.shadowOffset.y = 1;

        if (typeof params.width === 'undefined')
        {
            params.width = _config.size + _config.margin;
        }
        if (typeof params.height === 'undefined')
        {
            params.height = _config.size + _config.margin;
        }
        if (typeof params.borderRadius === 'undefined')
        {
            params.borderRadius = (_config.size + _config.margin) / 2 * (Ti.Platform.displayCaps.logicalDensityFactor || 1);
        }
    }

    function _init ()
    {
        _self = Ti.UI.createView(params);

        _wrapper = Ti.UI.createView({
            width: _config.size,
            height: _config.size,
            borderRadius: _config.size / 2 * (Ti.Platform.displayCaps.logicalDensityFactor || 1)
        });

        _layer1 = Ti.UI.createView({
            width: _config.size,
            height: _config.size,
            borderRadius: _config.size / 2 * (Ti.Platform.displayCaps.logicalDensityFactor || 1),
            backgroundColor: _config.progressColor
        });

        _layer2 = Ti.UI.createView({
            left: 0,
            width: _config.size / 2,
            height: _config.size,
            backgroundColor: params.backgroundColor
        });

        _layer3 = Ti.UI.createView({
            left: 0,
            width: _config.size,
            height: _config.size,
        });

        var layer3Inner = Ti.UI.createView({
            right: 0,
            width: _config.size / 2,
            height: _config.size,
            backgroundColor: params.backgroundColor
        });
        _layer3.add(layer3Inner);

        _layer4 = Ti.UI.createView({
            right: 0,
            width: _config.size / 2,
            height: _config.size,
            backgroundColor: _config.progressColor
        });

        _topper = Ti.UI.createView({
            width: _config.topper.size,
            height: _config.topper.size,
            borderRadius: _config.topper.size / 2 * (Ti.Platform.displayCaps.logicalDensityFactor || 1),
            backgroundColor: _config.topper.color
        });

        _l_progress = Ti.UI.createLabel({
            visible: _config.font.visible,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: _config.font.color,
            font: {
                fontSize:_config.font.size
            },
            shadowColor: _config.font.shadowColor,
            shadowRadius: _config.font.shadowRadius,
            shadowOffset: {
                x: _config.font.shadowOffset.x,
                y: _config.font.shadowOffset.y
            },
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            text: ''
        });

        _self.add (_wrapper);
        _topper.add (_l_progress);
        _wrapper.add (_layer1);
        _wrapper.add (_layer2);
        _wrapper.add (_layer3);
        _wrapper.add (_layer4);
        _wrapper.add (_topper);

        set_progress (_config.progress);

        _self.xset_progress = set_progress;
    }

    function set_progress (progress)
    {
        var angle = 360 * progress;
        _layer2.visible = (angle > 180) ? false : true;
        _layer4.visible = (angle > 180) ? true : false;
        _layer3.transform = Ti.UI.create2DMatrix().rotate(angle);

        _l_progress.setText (parseInt (progress * 100) + '%');
    }
}

CircularProgressBar.TUInit = function (tu)
{
    TU = tu;
};


module.exports = CircularProgressBar;

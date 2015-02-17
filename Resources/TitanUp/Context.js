var TU = null;

var _active_activity = null;
var _activity_count = 0;

function generate_name ()
{
    _activity_count++;

    return "activity-" + _activity_count;
}

function on_open (w)
{
    var name = w.context_id;
    var activity = w.activity;

    activity.onStart = function() {
        if (_active_activity == name) {
            Ti.App.fireEvent('resumed');
        }

        _active_activity = name;
    };

    activity.onStop = function() {
        if (_active_activity == name) {
            Ti.App.fireEvent('paused');
        }
    };
}

function on_close (w)
{
    var activity = w.activity;

    activity.onStart = null;
    activity.onStop = null;
}

function Context ()
{
}

Context.track = function (win) {
    if (TU.Device.getOS () != 'android')
    {
        return;
    }

    win.context_id = generate_name ();
    win.addEventListener ('open', function (e) { on_open (win); });
    win.addEventListener ('close', function (e) { on_close (win); });
};

Context.TUInit = function (tu)
{
    TU = tu;
};

module.exports = Context;
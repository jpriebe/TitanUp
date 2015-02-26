var TU = null;

var _force_low_priority_messages = false;
var _callback = null;

var _buffer = {
    entries: [],

    enabled: false,
    max_num_entries: 0,
    max_entry_length: 0,

    num_entries: 0,
    first_entry: -1,
    last_entry: -1
};

_buffer.add = function (msg)
{
    if (msg.length > _buffer.max_entry_length)
    {
        msg = msg.substring (0, _buffer.max_entry_length) + '...';
    }

    var idx = _buffer.last_entry + 1;
    if (idx == _buffer.max_num_entries)
    {
        idx = 0;
    }

    if (idx == _buffer.first_entry)
    {
        _buffer.first_entry++;
        if (_buffer.first_entry == _buffer.max_num_entries)
        {
            _buffer.first_entry = 0;
        }
    }
    else
    {
        _buffer.first_entry = 0;
        _buffer.num_entries++;
    }
    _buffer.entries[idx] = msg;

    _buffer.last_entry = idx;
};

function Logger ()
{

}


function format_ts ()
{
    var now = new Date(),
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return now.getFullYear()
    + '-' + pad(now.getMonth()+1)
    + '-' + pad(now.getDate())
    + ' ' + pad(now.getHours())
    + ':' + pad(now.getMinutes())
    + ':' + pad(now.getSeconds())
    + '.' + now.getMilliseconds();
}

function handle_msg (msg)
{
    msg = format_ts () + ' ' + msg;

    if (_buffer.enabled)
    {
        _buffer.add (msg);
    }

    return msg;
}

Logger.trace = function (msg)
{
    if (_force_low_priority_messages)
    {
        Ti.API.info (handle_msg ("TRACE " + msg));
    }
    else
    {
        Ti.API.trace (handle_msg (msg));
    }

    if (_callback !== null)
    {
        _callback ('trace', msg);
    }
};

Logger.debug = function (msg)
{
    if (_force_low_priority_messages)
    {
        Ti.API.info (handle_msg ("DEBUG " + msg));
    }
    else
    {
        Ti.API.debug (handle_msg (msg));
    }

    if (_callback !== null)
    {
        _callback ('debug', msg);
    }
};

Logger.info = function (msg)
{
    Ti.API.info (handle_msg (msg));

    if (_callback !== null)
    {
        _callback ('info', msg);
    }
};

Logger.warn = function (msg)
{
    Ti.API.warn (handle_msg (msg));

    if (_callback !== null)
    {
        _callback ('warn', msg);
    }
};

Logger.error = function (msg)
{
    Ti.API.error (handle_msg (msg));

    if (_callback !== null)
    {
        _callback ('error', msg);
    }
};

/**
 * By default, debug and trace messages will be dropped in production builds.  By
 * setting force low priority messages to true, Logger will use Ti.API.info() calls
 * on these low priority messages to make sure they appear in production builds.
 *
 * @param v
 */
Logger.setForceLowPriorityMessages = function (v)
{
    _force_low_priority_messages = v;
};

Logger.setCallback = function (cb)
{
    _callback = cb;
};

/**
 * Turns on the log buffer so that the app can store and retrieve the most recent
 * log messages.
 * @param max_num_entries maximum number of entries to store in the circular buffer
 * @param max_entry_length maximum length in characters of each message; messages will be truncated if they are longer than this value
 */
Logger.enableLogBuffer = function (max_num_entries, max_entry_length)
{
    if (typeof max_num_entries === 'undefined')
    {
        max_num_entries = 500;
    }
    if (typeof max_entry_length === 'undefined')
    {
        max_entry_length = 160;
    }

    _buffer.enabled = true;
    _buffer.max_num_entries = max_num_entries;
    _buffer.max_entry_length = max_entry_length;
};

Logger.getMessages = function ()
{
    var retval = [];

    for (var i = 0; i < _buffer.num_entries; i++)
    {
        var idx = (i + _buffer.first_entry) % _buffer.max_num_entries;
        retval.push (_buffer.entries[idx]);
    }

    return retval;
};

module.exports = Logger;
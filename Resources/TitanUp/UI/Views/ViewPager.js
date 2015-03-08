var TU = null;

function ViewPager (params)
{
    var _self = null;

    var _sv = null;
    var _title_bar = null;
    var _title_labels = [];
    var _title_labels_bold = [];

    var _views = [];
    var _titles = [];
    var _curr_idx = 0;
    var _initialized = false;
    var _initialPageIndex = 0;

    var _title_label_width = 0;

    var _singleTitle = false;
    var _titleAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;

    var _titleBarHeight = 24;
    var _titleBarColor = TU.UI.Theme.lightTextColor;
    var _titleBarColorDim = '';
    var _titleBarBackgroundColor = TU.UI.Theme.darkBackgroundColor;
    var _showUnderline = true;
    var _underlineColor = TU.UI.Theme.darkBackgroundColor;

    _process_params ();
    _init ();
    return _self;


    function _process_params ()
    {
        if (typeof params.views !== 'undefined')
        {
            _views = params.views;
            delete params.views;
        }

        if (typeof params.titles !== 'undefined')
        {
            _titles = params.titles;
            delete params.titles;
        }

        if (typeof params.initialPageIndex !== 'undefined')
        {
            _initialPageIndex = params.initialPageIndex;
            delete params.initialPageIndex;
        }

        if (typeof params.singleTitle !== 'undefined')
        {
            _singleTitle = params.singleTitle;
            delete params.singleTitle;
        }

        if (typeof params.titleAlign !== 'undefined')
        {
            _titleAlign = params.titleAlign;
            delete params.titleAlign;
        }

        if (typeof params.titleBarHeight !== 'undefined')
        {
            _titleBarHeight = params.titleBarHeight;
            delete params.titleBarHeight;
        }

        if (typeof params.titleBarColor !== 'undefined')
        {
            _titleBarColor = params.titleBarColor;
            delete params.titleBarColor;
        }

        _titleBarColorDim = TU.UI.Theme.adjustLuminance (_titleBarColor, 0.6);

        if (typeof params.titleBarColorDim !== 'undefined')
        {
            _titleBarColorDim = params.titleBarColorDim;
            delete params.titleBarColorDim;
        }

        if (typeof params.titleBarBackgroundColor !== 'undefined')
        {
            _titleBarBackgroundColor = params.titleBarBackgroundColor;
            delete params.titleBarBackgroundColor;
        }

        if (typeof params.showUnderline !== 'undefined')
        {
            _showUnderline = params.showUnderline;
            delete params.showUnderline;
        }

        if (typeof params.underlineColor !== 'undefined')
        {
            _underlineColor = params.underlineColor;
            delete params.underlineColor;
        }
    }


    function _init ()
    {
        _self = Ti.UI.createView (params);

        _curr_idx = _initialPageIndex;

        if (TU.Device.getOS() == 'ios')
        {
            init_view_ios ();
        }
        else if (TU.Device.getOS() == 'android')
        {
            init_view_android ();
        }

        _self.addEventListener ('beforeRemove', function (e) {
            for (var i = 0; i < _views.length; i++)
            {
                TU.UI.removeView (_views[i]);
            }
        });

        _self.xgetTitleBar = function ()
        {
            return _title_bar;
        };

        _self.xgetCurrentPage = function ()
        {
            return _curr_idx;
        };
    }

    function updateTitleBar (index)
    {
        if (!_singleTitle)
        {
            _title_labels_bold[_curr_idx].visible = false;
            _title_labels[_curr_idx].visible = true;
        }

        _curr_idx = index;

        if (!_singleTitle)
        {
            _title_labels_bold[_curr_idx].visible = true;
            _title_labels[_curr_idx].visible = false;
        }

        _title_bar.left = -1 * _title_label_width * _curr_idx;
    }

    function build_title_bar ()
    {
        if (_singleTitle)
        {
            _title_label_width = TU.Device.getDisplayWidth ();
        }
        else
        {
            _title_label_width = TU.Device.getIsTablet()
                ? parseInt (TU.Device.getDisplayWidth () / 5)
                : parseInt (TU.Device.getDisplayWidth () / 2);
        }

        _title_bar = Ti.UI.createView ({
            top: 0,
            height: _titleBarHeight,
            backgroundColor: _titleBarBackgroundColor
        });

        var fnormal = { fontFamily: 'Arial', fontSize: 14 };
        var fbold = { fontFamily: 'Arial', fontSize: 14, fontWeight: 'bold' };

        var x = parseInt ((TU.Device.getDisplayWidth () - _title_label_width) / 2);

        _title_labels = [];
        _title_labels_bold = [];
        for (var i in _titles)
        {
            var lv = Ti.UI.createView ({
                left: x,
                width: _title_label_width
            });
            _title_bar.add (lv);

            var l = Ti.UI.createLabel ({
                left: 8,
                right: 8,
                font: fnormal,
                textAlign: _titleAlign,
                text: _titles[i],
                visible: ((i != _curr_idx) || (_singleTitle)),
                color: ((_singleTitle) ? _titleBarColor : _titleBarColorDim)
            });

            _title_labels.push (l);
            lv.add (l);

            if (!_singleTitle)
            {
                var lb = Ti.UI.createLabel ({
                    left: 8,
                    right: 8,
                    font: fbold,
                    textAlign: _titleAlign,
                    text: _titles[i],
                    visible: (i == _curr_idx),
                    color: _titleBarColor
                });

                _title_labels_bold.push (lb);
                lv.add (lb);

                // add click handler to jump right to a page
                l.addEventListener ('click', function (idx) {
                    return function () {
                        if (_sv !== null)
                        {
                            _sv.scrollToView (idx);
                        }
                    };
                }(i));
            }

            x += _title_label_width;
        }

        if (_showUnderline)
        {
            var uv = Ti.UI.createView ({
                left: 0,
                right: 0,
                bottom: 0,
                height: 1,
                backgroundColor: _underlineColor
            });
            _title_bar.add (uv);
        }

        _self.add (_title_bar);
    }

    function init_view_ios ()
    {
        build_title_bar ();

        _sv = Ti.UI.createScrollableView({
            top: _titleBarHeight,
            views: _views,
            showPagingControl: false,
            pagingControlHeight: 0,
            currentPage: _curr_idx
        });

        _self.add (_sv);


        _sv.addEventListener ('scrollend', function (e) {
            if (e.source != _sv)
            {
                return;
            }

            var prev_idx = _curr_idx;
            updateTitleBar (e.currentPage);
            _self.fireEvent ('pagechange', { prevIndex: prev_idx, index: e.currentPage });
        });


        // https://gist.github.com/robertmesserle/8983914
        function throttle(func, wait) {
            var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0, maxWait = wait,
                now = function () { return new Date().getTime(); },
                delayed = function() {
                    var remaining = wait - (now() - stamp);
                    if (remaining <= 0) {
                        if (maxTimeoutId) clearTimeout(maxTimeoutId);
                        var isCalled = trailingCall;
                        maxTimeoutId = timeoutId = trailingCall = undefined;
                        if (isCalled) {
                            lastCalled = now();
                            result = func.apply(thisArg, args);
                            if (!timeoutId && !maxTimeoutId) args = thisArg = null;
                        }
                    } else timeoutId = setTimeout(delayed, remaining);
                },
                maxDelayed = function() {
                    if (timeoutId) clearTimeout(timeoutId);
                    maxTimeoutId = timeoutId = trailingCall = undefined;
                    lastCalled = now();
                    result = func.apply(thisArg, args);
                    if (!timeoutId && !maxTimeoutId) args = thisArg = null;
                };
            return function() {
                args = arguments;
                stamp = now();
                thisArg = this;
                trailingCall = timeoutId;

                if (maxWait === false) var leadingCall = !timeoutId;
                else {
                    var remaining = maxWait - (stamp - lastCalled), isCalled = remaining <= 0;
                    if (isCalled) {
                        if (maxTimeoutId) maxTimeoutId = clearTimeout(maxTimeoutId);
                        lastCalled = stamp;
                        result = func.apply(thisArg, args);
                    } else if (!maxTimeoutId) maxTimeoutId = setTimeout(maxDelayed, remaining);
                }

                if (isCalled && timeoutId) timeoutId = clearTimeout(timeoutId);
                else if (!timeoutId && wait !== maxWait) timeoutId = setTimeout(delayed, wait);

                if (leadingCall) {
                    isCalled = true;
                    result = func.apply(thisArg, args);
                }

                if (isCalled && !timeoutId && !maxTimeoutId) args = thisArg = null;
                return result;
            };
        }

        var on_scroll = function (e)
        {
            if (typeof e === 'undefined')
            {
                return;
            }

            if (e.source != _sv)
            {
                return;
            }
            if (_singleTitle)
            {
                return;
            }

            _title_bar.left = parseInt (-1 * _title_label_width * e.currentPageAsFloat);
        };

        var throttled = throttle (on_scroll, 25);

        _sv.addEventListener ('scroll', throttled);

        if (_curr_idx > 0)
        {
            updateTitleBar(_curr_idx);
        }

        _initialized = true;
    }


    function init_view_android ()
    {
        var PagerModule = require("so.hau.tomas.pager");

        build_title_bar();

        var pages = [];
        for (var i = 0; i < _views.length; i++)
        {
            pages.push ({
                title: "",
                view: _views[i]
            });
        }

        var options = {
            top: _titleBarHeight,
            initialPage: _curr_idx,
            pages: pages,
            tabs: {
                style: PagerModule.MARKET,
                lineColor: _underlineColor,
                lineColorSelected: _underlineColor,
                tabBackground: _titleBarBackgroundColor,
                tabBackgroundSelected: _titleBarBackgroundColor
            }
        };

        if (!_showUnderline)
        {
            options.tabs.lineHeight = 0;
            options.tabs.lineHeightSelected = 0;
        }

        if (_singleTitle)
        {
            options.tabs.padding = {
                paddingClip : 0 - TU.Device.getDisplayWidth ()
            };
            options.tabs.lineHeightSelected = 0;
        }


        var _pv = PagerModule.createViewPager(options);

        var _suppress_pagechange = false;

        _pv.addEventListener('pageChange', function (e) {
            if (_suppress_pagechange)
            {
                _suppress_pagechange = false;
                return;
            }

            _curr_idx = e.to;
            updateTitleBar(_curr_idx);
            _self.fireEvent ('pagechange', { prevIndex: e.from, index: e.to });
        });

        _self.add (_pv);
    }

    return _self;
}

ViewPager.TUInit = function (tu)
{
    TU = tu;
};

module.exports = ViewPager;

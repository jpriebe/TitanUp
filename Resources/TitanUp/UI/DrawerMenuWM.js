var TU = null;

/**
 * Builds and manages a basic drawer menu / navigation group based UI.  For android, relies on
 * https://github.com/manumaticx/Ti.DrawerLayout
 *
 * @param params
 * @returns {*}
 * @constructor
 */
function DrawerMenuWM (params)
{
    var _self = null;
    var _main_view = null;
    var _overlay = null;
    var _left_menu_view = null;
    var _left_menu_width = 0;
    var _menu_params = {};
    var _orientation_modes = 'portrait';
    var _ios_options = {};
    var _menu_items = [];
    var _byo_menu = false;   // is the caller supplying a menu via params.left_menu_view ???
    var _menu_button_accessibility_label = 'Main Menu';
    var _back_button_accessibility_label = 'Back';


    if (typeof params === 'undefined')
    {
        params = {};
    }

    if (typeof params.ios_options !== 'undefined')
    {
        _ios_options = params.ios_options;
        delete params.ios_options;
    }

    if (typeof params.menu_items !== 'undefined')
    {
        _menu_items = params.menu_items;
        delete params.menu_items;
    }

    if (typeof params.menu_params !== 'undefined')
    {
        _menu_params = params.menu_params;
        delete params.menu_params;
    }

    if (typeof params.orientation_modes !== 'undefined')
    {
        _orientation_modes = params.orientation_modes;
        delete params.orientation_modes;
    }

    if (typeof _ios_options.bar_color === 'undefined')
    {
        _ios_options.bar_color = 'black';
    }
    if (typeof _ios_options.bar_text_color === 'undefined')
    {
        _ios_options.bar_text_color = 'white';
    }
    if (typeof _ios_options.left_nav_buttons === 'undefined')
    {
        _ios_options.left_nav_buttons = [];
    }

    if (typeof params.menu_button_accessibility_label !== 'undefined')
    {
        _menu_button_accessibility_label = params.menu_button_accessibility_label;
        delete params.menu_button_accessibility_label;
    }

    if (typeof params.back_button_accessibility_label !== 'undefined')
    {
        _back_button_accessibility_label = params.back_button_accessibility_label;
        delete params.back_button_accessibility_label;
    }


    // this is mandatory
    if (params.main_view)
    {
        _main_view = params.main_view;    
    }
    delete params.main_view;

    if (typeof params.left_menu_view !== 'undefined')
    {
        _left_menu_view = params.left_menu_view;
        _left_menu_width = _left_menu_view.getWidth ();
        _byo_menu = true;
        delete params.left_menu_view;
    }
    else
    {
        _left_menu_width = parseInt (0.8 * Math.min (TU.Device.getDisplayWidth (), TU.Device.getDisplayHeight ()));
        _menu_params.width = _left_menu_width;
        _left_menu_view = DrawerMenuWM.build_menu (_menu_items, JSON.parse (JSON.stringify (_menu_params)));
    }

    if (Ti.Platform.osname == 'android')
    {
        init_win_android (params);
    }
    else
    {
        init_win_ios (params);
    }

    
    function init_win_ios (params)
    {
        var _win_params = {};
        var _left_menu_showing = false;

        set_win_params (params);

        _left_menu_view.setZIndex (100000);
        _left_menu_view.setLeft (0 - _left_menu_width);

        _left_menu_view.addEventListener ('swipe', function (e) {
            if (e.direction == 'left')
            {
                hide_left_menu ();
            }
        });

        for (var k in _win_params)
        {
            params[k] = _win_params[k];
        }

        params.orientationModes = _orientation_modes;
        var _main_win = Ti.UI.createWindow (params);
        _main_win.add (_main_view);

        // ideally, we would use a Ti.UI.Button, but there are a few problems:
        //  - accessibility label is ignored on button in NavBar (https://jira.appcelerator.org/browse/TIMOB-15418)
        //  - on iOS 6, the button has a 3D border with a gradient, no matter how I try to control for that
        // so we use an ImageView; the big drawback is that VoiceOver will say "main menu - image" instead of
        // "main menu - button".

        var menu_btn = Ti.UI.createImageView ({
            image: (TU.Device.getiOS7Plus() ? '/images/menu_indicator-ios7.png' : '/images/menu_indicator.png'),
            width: 24,
            height: 24,
            accessibilityLabel: _menu_button_accessibility_label
        });

        var navbtns = [];
        navbtns.push (menu_btn);
        for (var i = 0; i < _ios_options.left_nav_buttons.length; i++)
        {
            navbtns.push (_ios_options.left_nav_buttons[i]);
        }
        _main_win.leftNavButtons = navbtns;

        _self = Ti.UI.iOS.createNavigationWindow ({
            window : _main_win,
            orientationModes: _orientation_modes
        });

        _overlay = Ti.UI.createView ({
            backgroundColor: '#000',
            opacity: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: _left_menu_view.getZIndex() - 1
        });

        _overlay.addEventListener ('swipe', function (e) {
            if (e.direction == 'left')
            {
                hide_left_menu ();
            }
        });

        _self.addEventListener ('open', on_open);

        function set_win_params (params)
        {
            if (typeof params.barColor === 'undefined')
            {
                _win_params.barColor = _ios_options.bar_color;
            }

            if (typeof params.barImage === 'undefined')
            {
                if (typeof _ios_options.bar_image !== 'undefined')
                {
                    _win_params.barImage = _ios_options.bar_image;
                }
            }

            if (typeof params.title_image !== 'undefined')
            {
                _win_params.titleImage = params.title_image;
                delete params.title_image;
            }
            else
            {
                // FIXME -- this won't work; we can't reuse this control!
                if (typeof params.title !== 'undefined')
                {
                    _win_params.titleControl =  Ti.UI.createLabel({
                        text: params.title,
                        color: _ios_options.bar_text_color,
                        font: TU.UI.Theme.fonts.mediumBold,
                        width: Ti.UI.SIZE
                    });
                }
            }

            _win_params.statusBarStyle = Titanium.UI.iPhone.StatusBar.LIGHT_CONTENT;
            _win_params.navTintColor = _ios_options.bar_text_color;
            _win_params.translucent = false;
        }

        function show_left_menu ()
        {
            if (_left_menu_showing)
            {
                return;
            }

            _left_menu_showing = true;

            _main_view.add (_overlay);
            _main_view.add (_left_menu_view);

            _overlay.animate ({
                opacity: 0.5,
                curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
                duration: 300
            });
            _left_menu_view.animate ({
                left: 0,
                curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
                duration: 300
            });
        }

        function hide_left_menu ()
        {
            if (!_left_menu_showing)
            {
                return;
            }

            _left_menu_showing = false;

            _overlay.animate ({
                    opacity: 0,
                    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
                    duration: 300
                },
                function () {
                    _main_view.remove (_overlay);
                }
            );

            _left_menu_view.animate ({
                    left: 0 - _left_menu_width,
                    curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
                    duration: 300
                },
                function () {
                    _main_view.remove (_left_menu_view);
                }
            );
        }

        function on_open ()
        {
            // D'oh!  Have to wait until the window is open before we try to add a click event
            // listener: http://developer.appcelerator.com/question/125494/inexplicable-bug-toolbar-button-only-listens-4-clicks
            // In our case, the click event never fired when we tried to add it immediately after
            // creating the menu button.
            menu_btn.addEventListener('click',function() {
                if (_left_menu_showing)
                {
                    hide_left_menu ();
                }
                else
                {
                    show_left_menu ();
                }
            });

            _self.register_event_listener();
        }

        _self.register_event_listener = function () {
            _left_menu_view.addEventListener ('click', function (e) {
                if (typeof e.row === 'undefined')
                {
                    return;
                }

                if ((typeof e.row.togglemenuonclick === 'undefined') || (e.row.togglemenuonclick == true))
                {
                    hide_left_menu ();
                }

                /*
                 if (_byo_menu)
                 {
                 return;
                 }
                 */

                _self.fireEvent ('menu_item_selected', {
                    index: e.row.index,
                    identifier: e.row.identifier,
                    caption: e.row.caption
                });
            });
        };


        // since the navigationWindow already has an "openWindow()", function, we had to rename our function
        // to TUopenWindow() (the TU.UI.openWindow() function knows to call TUopenWindow())
        _self.TUopenWindow = function (w)
        {
            // ideally, we would use a Ti.UI.Button, but there are a few problems:
            //  - accessibility label is ignored on button in NavBar (https://jira.appcelerator.org/browse/TIMOB-15418)
            //  - on iOS 6, the button has a 3D border with a gradient, no matter how I try to control for that
            // so we use an ImageView; the big drawback is that VoiceOver will say "main menu - image" instead of
            // "main menu - button".

            var back_btn = Ti.UI.createImageView ({
                image: (TU.Device.getiOS7Plus() ? '/images/icon-back-ios7.png' : '/images/icon-back.png'),
                accessibilityLabel: _back_button_accessibility_label
            });

            w.leftNavButtons = [back_btn];

            // can't add the click event listener until the window is open, or it won't fire
            w.addEventListener('open', function (e) {
                back_btn.addEventListener('click', function (e) {
                    TU.UI.closeWindow (w);
                });
            });

            for (var k in _win_params)
            {
                //TU.Logger.debug ('[DrawerMenuWM] setting ' + k + ' = ' + _win_params[k]);
                w[k] = _win_params[k];
            }

            _self.openWindow (w);
        };

        // since the navigationWindow already has a "closeWindow()", function, we had to rename our function
        // to TUcloseWindow() (the TU.UI.closeWindow() function knows to call TUcloseWindow())
        _self.TUcloseWindow = function (w)
        {
            _self.closeWindow (w);
        };

        _self.replaceView = function (v, title)
        {
            _main_win.remove (_main_view);

            if (typeof title !== 'undefined')
            {
                if (typeof _main_win.titleControl !== 'undefined')
                {
                    _main_win.titleControl.text = title;
                }
            }

            _main_view = v;
            _main_win.add (v);
        };

        _self.replaceLeftView = function (v)
        {
            _left_menu_view = null;
            _left_menu_view = v;
            _left_menu_view.setZIndex (100000);
            _left_menu_view.setLeft (0 - _left_menu_width);
            _self.register_event_listener ();
        };

        _self.replaceMenuOptions = function (menu_items)
        {
            hide_left_menu();

            _menu_items = menu_items;
            _left_menu_view = DrawerMenuWM.build_menu (_menu_items, JSON.parse (JSON.stringify (_menu_params)));
            _self.register_event_listener ();
        };

        _self.setMenuWidth = function (width)
        {
            _left_menu_width = width;
            show_left_menu();
        };
    }
    
    function init_win_android (params)
    {
        params.exitOnClose = true;
        params.orientationModes = _orientation_modes;
        _self = Ti.UI.createWindow(params);

        var TiDrawerLayout = require('com.tripvi.drawerlayout');
        var d = TiDrawerLayout.createDrawer({
            leftView: _left_menu_view,
            centerView: _main_view,
            leftDrawerWidth: _left_menu_view.width,
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            drawerArrowIcon : true
        });
    
        _self.addEventListener('open', function(e) {
            _self.activity.actionBar.displayHomeAsUp = true;

            _self.activity.actionBar.onHomeIconItemSelected = function() {
                d.toggleLeftWindow();
            };

            // android best practices suggest opening the app with the drawer open until the
            // user learns to operate it himself
            // http://developer.android.com/design/patterns/navigation-drawer.html
            var drawer_opened_yet = Ti.App.Properties.getBool ("TitanUp.general.drawer_opened", false);
            if (!drawer_opened_yet)
            {
                // note -- we need to distinguish between a user-initiated open and the
                // auto-open.  You'd think you could just set automatic_open to true
                // and then when the draweropen event fires, set it to false so that the
                // next open is recognized as a user-initiated open.  HOWEVER,  it seems
                // like we're not always getting the draweropen event on our auto-open.
                // Without a reliable event indicating that the drawer is open, I can't
                // tell whether I'm dealing with a user-initiated open or an auto-open.
                // SO, we finesse this in a really ugly way -- don't attach the event
                // listener for 1000ms.  Any "early" drawer opens are assumed to be automatic.
                TU.Logger.info ("[MainMenuWindow.init_win_android] never opened drawer...");
                d.openLeftWindow ();

                setTimeout (function () {
                    d.addEventListener('draweropen', function(e) {
                        TU.Logger.info ("[MainMenuWindow.init_win_android] drawer opened by user...");
                        Ti.App.Properties.setBool ("TitanUp.general.drawer_opened", true);
                    });
                }, 1000);
            }

            _self.activity.actionBar.setTitle (params.title);
        });
    
        _self.add (d);
        
        _self.register_event_listener = function ()
        {
            _left_menu_view.addEventListener ('click', function (e) {
                if ((typeof e.row.togglemenuonclick === 'undefined') || (e.row.togglemenuonclick == true))
                {
                    d.toggleLeftWindow();
                }

                /*
                if (_byo_menu)
                {
                    return;
                }
                */

                _self.fireEvent ('menu_item_selected', {
                        index: e.row.index,
                        identifier: e.row.identifier, 
                        caption: e.row.caption
                });
            });
        };

        _self.register_event_listener ();

        // since the navigationWindow already has an "openWindow()", function, we had to rename our function
        // to TUopenWindow() (the TU.UI.openWindow() function knows to call TUopenWindow())
        _self.TUopenWindow = function (w)
        {
            w.addEventListener('open', function() {
                w.activity.actionBar.logo = "";
                w.activity.actionBar.displayHomeAsUp = true;

                w.activity.actionBar.onHomeIconItemSelected = function() {
                    TU.UI.closeWindow (w);
                };
            });
            w.open();
        };

        // since the navigationWindow already has a "closeWindow()", function, we had to rename our function
        // to TUcloseWindow() (the TU.UI.closeWindow() function knows to call TUcloseWindow())
        _self.TUcloseWindow = function (w)
        {
            w.close();
        };
        
        _self.replaceView = function (v, title)
        {
        	TU.Logger.debug ('[DrawerMenuWM] replacing view; setting title to "' + title + '"');

            if (typeof title !== 'undefined')
            {
                _self.title = title;
            }

            d.centerView = v;
        };

        _self.replaceLeftView = function (v)
        {
            d.leftView = v;
            _left_menu_view = v;
            _self.register_event_listener();
        };
        
        _self.replaceMenuOptions = function (menu_items)
        {
            _menu_items = menu_items;
            _left_menu_view = DrawerMenuWM.build_menu (_menu_items, JSON.parse (JSON.stringify (_menu_params)));
            _self.register_event_listener ();
            d.leftView = (_left_menu_view);
        };

        _self.setMenuWidth = function (width)
        {
            d.leftDrawerWidth = width;
            d.toggleLeftWindow();
        };

    }
    
    _self.replaceMenuOption = function (identifier, option)
    {
        var new_menu_items = [];
        for (var i = 0; i < _menu_items.length; i++)
        {
            if (_menu_items[i].identifier == identifier)
            {
                new_menu_items.push (option);
            }
            else
            {
                new_menu_items.push (_menu_items[i]);
            }
        }
        
        _self.replaceMenuOptions (new_menu_items);
    };
    
    
    return _self;
}

DrawerMenuWM.build_menu = function (menu_items, params)
{
    var top = 0;
    var bottom = 0;
    var menu_row_height = 50;
    var font = TU.UI.Theme.fonts.largeBold;
    var color = 'white';
    var background_color = 'black';
    var separator_color = 'transparent';
    var width = 0;

    if (typeof params.color !== 'undefined')
    {
        color = params.color;
        delete params.color;
    }
    if (typeof params.background_color !== 'undefined')
    {
        background_color = params.background_color;
        delete params.background_color;
    }
    if (typeof params.separator_color !== 'undefined')
    {
        separator_color = params.separator_color;
        delete params.separator_color;
    }
    if (typeof params.row_height !== 'undefined')
    {
        menu_row_height = params.row_height;
        delete params.row_height;
    }
    if (typeof params.width !== 'undefined')
    {
        width = params.width;
        delete params.width;
    }

    var rows = [];
    for (var i = 0; i < menu_items.length; i++)
    {
        var row = Ti.UI.createTableViewRow({
            height: menu_row_height
        });

        var mi = menu_items[i];

        var l = Ti.UI.createLabel({
            left: 10,
            text: mi.caption,
            font: font,
            color: color,
            height: menu_row_height
        });


        if (typeof mi.icon !== 'undefined')
        {
            var iv = Ti.UI.createImageView ({
                width: 24,
                height: 24,
                left: 10,
                image: mi.icon
            });
            row.add (iv);
            l.left = 44;
        }

        row.add (l);

        // we have to draw our own separator if we want it to go from edge-to-edge
        // on iOS7...
        if (separator_color != 'transparent')
        {
            var sv = Ti.UI.createView ({
                height: 1,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: separator_color
            });

            row.add (sv);
        }

        row.index = i;
        row.identifier = mi.identifier;
        row.caption = mi.caption;
        rows.push (row);
    }

    var tv = Ti.UI.createTableView({
        top: top,
        bottom: bottom,
        width: width,
        backgroundColor: background_color,
        separatorColor: 'transparent',
        data: rows
    });

    return tv;
};

DrawerMenuWM.TUInit = function (tu)
{
	TU = tu;
    TU.UI.DrawerMenuWM = DrawerMenuWM;
};

module.exports = DrawerMenuWM;

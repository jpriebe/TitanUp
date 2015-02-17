function UIViewsRemoteImageViewDemoWindow ()
{
    var _self = null;

    _self = Ti.UI.createWindow ({
        title: 'TU.UI.Views.RemoteImgaeView',
        backgroundColor: TU.UI.Theme.lightBackgroundColor
    });
    
    var margin = 10;
    
    var contentview = Ti.UI.createView ({
        top: margin,
        left: margin,
        right: margin,
        bottom: margin,
        backgroundColor: TU.UI.Theme.lightBackgroundColor,
        layout: 'vertical'
    });
    
    var l = Ti.UI.createLabel ({
        left: margin,
        right: margin,
        top: margin,
        text: "TU.UI.Views.RemoteImageView is an ImageView that can reliably trigger a callback when the image is loaded.  Under some circumstances (when in a TableViewRow with touchEnabled=false) the standard ImageView will not fire its load event.  RemoteImageView will reliably call the onload callback.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });

    contentview.add (l);
        
    function build_tableviewrow (url, use_remote)
    {
        var tvr = Ti.UI.createTableViewRow ({
            height: 110 
        });
                
        var iv;
        var caption;
        if (use_remote)
        {
            caption = "RemoteImageView";
            iv = TU.UI.createRemoteImageView ({
                top: 10,
                left: 10,
                width: 120,
                height: 90,
                image: url,
                touchEnabled: false,
                onload:  function (e) {
                    l2.setText ("loaded");
                }
            });
        }
        else
        {
            caption = "ImageView";
            iv = Ti.UI.createImageView ({
                top: 10,
                left: 10,
                width: 120,
                height: 90,
                image: url,
                touchEnabled: false
            });
            iv.addEventListener ('load', function (e) {
                l2.setText ("loaded");
            });
        }

       tvr.add (iv);

        var l = Ti.UI.createLabel ({
            top: 10,
            left: 140,
            right: 10,
            font: TU.UI.Theme.fonts.mediumBold,
            color: TU.UI.Theme.darkTextColor,
            text: caption
        });
        
        tvr.add (l);
        
        var l2 = Ti.UI.createLabel ({
            top: 50,
            left: 140,
            right: 10,
            font: TU.UI.Theme.fonts.medium,
            color: TU.UI.Theme.darkTextColor,
            text: 'not loaded'
        });
        
        tvr.add (l2);

        return tvr;
    }


    var tv = Ti.UI.createTableView ({
        left: margin,
        right: margin,
        top: 4 * margin,
        bottom: margin
    });
    
    var rows = [];

    var cb = new Date().getTime();
    for (var i = 0; i < 10; i++)
    {
        rows.push (build_tableviewrow ('http://wwwcache.wralsportsfan.com/asset/colleges/unc/2012/02/29/10796821/10796821-1330708109-120x90.jpg?cb=' + cb, (i % 2 == 0)));
        cb++;        
    }
        
    tv.setData (rows);
    contentview.add (tv);
    
    _self.add (contentview);
    
    return _self;
}


module.exports = UIViewsRemoteImageViewDemoWindow;

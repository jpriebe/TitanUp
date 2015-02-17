function UIViewsModalViewDemoWindow ()
{
    var _self = null;

    _self = Ti.UI.createWindow ({
        title: 'TU.UI.Views.ModalView',
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
        text: "TU.UI.Views.ModalView is a simple cross-platform way to make a view modal.",
        color: TU.UI.Theme.darkTextColor,
        font: TU.UI.Theme.fonts.medium
    });

    contentview.add (l);

    var btn = Ti.UI.createButton ({
        top: margin,
        height: 40,
        left: margin,
        right: margin,
        title: "Open Modal View"
    });
    
    btn.addEventListener ('click', function (e) {
        var v = Ti.UI.createView ({
            width: 200,
            height: 200,
            backgroundColor: '#000'
        });
        
        var l = Ti.UI.createLabel ({
            color: '#fff',
            font: TU.UI.Theme.fonts.mediumBold,
            text: "Hello, world"
        });
        
        v.add (l);
        
        var mv = TU.UI.createModalView ({ view: v });
        
        _self.add (mv);
        
        setTimeout (function () {
            _self.remove (mv);
        }, 3000);
    });
    
    contentview.add (btn);
    
    _self.add (contentview);
    
    return _self;
}

module.exports = UIViewsModalViewDemoWindow;

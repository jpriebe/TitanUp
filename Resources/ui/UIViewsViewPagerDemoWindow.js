var TU = require ('/TitanUp/TitanUp');

function UIViewsViewPagerDemoWindow ()
{
    var _self = null;
    var _tableviews = [];
    var _titles = ['Cool stuff', 'Weird stuff', 'Random stuff', 'Wacky stuff'];

    _self = Ti.UI.createWindow ({
        title: 'TU.UI.Views.ViewPager',
        backgroundColor: TU.UI.Theme.lightBackgroundColor
    });

    for (var i in _titles)
    {
        var idx = 1;
        var tableData = [];

        for (var j = 0; j < 30; j++)
        {
            var row = Ti.UI.createTableViewRow({
                height: 50,
                title: _titles[i] + ' ' + idx,
            });
            idx++;

            tableData.push(row);
        }

        tv = Titanium.UI.createTableView({
            width: '100%', height: '100%',
            data: tableData
        });

        _tableviews.push (tv);
    }

    var vp = TU.UI.createViewPager ({
        top: 0,
        bottom: 0,
        views: _tableviews,
        titles: _titles
    });

    _self.add (vp);

    return _self;
}

module.exports = UIViewsViewPagerDemoWindow;

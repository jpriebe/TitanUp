var TU = null;

function ModalView (params)
{
    var _self;

    if (typeof params.view === 'undefined')
    {
        throw {
            message: 'Error: you must specify params.view'
        };
    }

    _self = Ti.UI.createView ({
        backgroundColor: 'transparent',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    });

    _self.add (Ti.UI.createView ({
        backgroundColor: '#000',
        opacity: 0.5,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }));

    _self.add (params.view);

    return _self;
}

ModalView.TUInit = function (tu)
{
    TU = tu;
};

module.exports = ModalView;
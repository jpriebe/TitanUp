var TU = null;

function Theme () 
{
}


function initialize ()
{
	Theme.mediumBackgroundColor = '#999';
	Theme.lightBackgroundColor = '#fff';
	Theme.darkBackgroundColor = '#666';

	Theme.highlightColor = '#ccc';
    Theme.alertColor = '#f00';

	Theme.darkTextColor = '#000';
    Theme.mediumTextColor = '#000';
    Theme.lightTextColor = '#fff';

    // backward compatibility...
    Theme.backgroundColor = Theme.lightBackgroundColor;
    Theme.textColor = Theme.darkTextColor;

    if (TU.Device.getOS () == 'ios')
    {
        Theme.fonts = {
            small: { fontSize: 12 },
            medium: { fontSize: 16 },
            large: { fontSize: 24 },
            smallBold: { fontSize: 12, fontWeight: 'bold' },
            mediumBold: { fontSize: 16, fontWeight: 'bold' },
            largeBold: { fontSize: 24, fontWeight: 'bold' }
        };
    }
    else
    {
        Theme.fonts = {
            small: { fontSize: '13dp' },
            medium: { fontSize: '18dp' },
            large: { fontSize: '26dp' },
            smallBold: { fontSize: '13dp', fontWeight: 'bold' },
            mediumBold: { fontSize: '18dp', fontWeight: 'bold' },
            largeBold: { fontSize: '26dp', fontWeight: 'bold' }
        };
    }
}


Theme.TUInit = function (tu)
{
	TU = tu;
	initialize ();
};

Theme.adjustLuminance = function (hex, lum)
{
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6)
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++)
    {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c * lum), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
};

Theme.scaleFont = function (font, scale_factor)
{
    // make a copy of the font so that when we change the size, we don't change
    // the original (caller may have likely referenced one of the fonts from the
    // Theme; changing its size could wreak havoc!)
    var new_font = JSON.parse (JSON.stringify (font));

    if (typeof new_font.fontSize === 'undefined')
    {
        return null;
    }

    var font_size = '' + new_font.fontSize;

    var font_val = 0;
    var font_unit = '';

    var matches = font_size.match (/(\d+)(px|pt|dp|dip|mm|in)/);

    if (matches == null)
    {
        matches = font_size.match (/(\d+)/);
        if (matches == null)
        {
            return null;
        }

        font_val = matches[1];
    }
    else
    {
        font_val = matches[1];
        font_unit = matches[2];
    }

    font_val = parseInt (font_val * scale_factor);

    new_font.fontSize = '' + font_val + font_unit;

    return  new_font;
};



module.exports = Theme;
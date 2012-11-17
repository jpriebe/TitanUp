var TU = null;

function Theme () 
{
}


function initialize ()
{
	Theme.backgroundColor = '#999';
	Theme.lightBackgroundColor = '#fff';
	Theme.darkBackgroundColor = '#666';
	Theme.highlightColor = '#ccc';
	Theme.textColor = '#000';
	
	if (TU.Device.getOS () == 'ios')
	{
		Theme.fonts = {
			small: { fontSize: 12 },
			medium: { fontSize: 16 },
			large: { fontSize: 24 },
			smallBold: { fontSize: 12, fontWeight: 'bold' },
			mediumBold: { fontSize: 16, fontWeight: 'bold' },
			largeBold: { fontSize: 24, fontWeight: 'bold' },
		};		
	}
	else
	{
		Theme.fonts = {
			small: { fontSize: '10dp' },
			medium: { fontSize: '13dp' },
			large: { fontSize: '18dp' },
			smallBold: { fontSize: '10dp', fontWeight: 'bold' },
			mediumBold: { fontSize: '13dp', fontWeight: 'bold' },
			largeBold: { fontSize: '18dp', fontWeight: 'bold' },
		};
	}
}


Theme.TUInit = function (tu)
{
	TU = tu;
	initialize ();
};



module.exports = Theme;
//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var FirstView = require('ui/FirstView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#000000',
		exitOnClose:true
	});
		
	//construct UI
	var firstView = new FirstView();
	self.add(firstView);
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;

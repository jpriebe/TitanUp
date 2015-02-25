function FirstView (options) {
	
	var win = Ti.UI.createWindow({
		title: "ViewPager Demo",
		backgroundColor: "#000000",
		modal: true
	});
	
	var pagerModule = require("net.bajawa.pager");

	win.add(pagerModule.createViewPager(options));
	
	return win;
}

module.exports = FirstView;

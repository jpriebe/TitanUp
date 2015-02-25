function FirstView() {
	
	var self = Ti.UI.createView();

	var pagerModule = require("net.bajawa.pager");
	var ViewPagerView = require("ui/ViewPagerView");
	
	var dummyTableData = (function () {
		var a = [];
		for (var i=0; i < 100; i++) a.push({ title: "I am item " + i });
		return a;
	}());
	
	var pagerData = [
		{ title: "First tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Second tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Third tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Fourth tab",	view: Ti.UI.createTableView({ data: dummyTableData }) }
	];
	
	var pagerDataScrolling = [
		{ title: "First tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Second tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Third tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Fourth tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Fifth tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Sixth tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Seventh tab",	view: Ti.UI.createTableView({ data: dummyTableData }) },
		{ title: "Eight tab",	view: Ti.UI.createTableView({ data: dummyTableData }) }
	];
	
	var tableData = [
		{ 
			title: '"Vanilla" ViewPager',
			opts: {
				data: pagerData,
				tabs: {
					style: pagerModule.NONE
				}
			}
		},
		{
			title: '"Vanilla" ViewPager w/ indicator',
			opts: {
				data: pagerData,
				tabs: {
					style: pagerModule.NONE
				},
				indicator: {
					style: pagerModule.LINE
				}
			}
		},
		{
			title: '"Vanilla" ViewPager w/ custom indicator',
			opts: {
				data: pagerData,
				tabs: {
					style: pagerModule.NONE
				},
				indicator: {
					style: pagerModule.LINE,
					height: 5,
					color: "#91a438",
					fadeOutTime: 100,
					fadingDuration: 1000
				}
			}
		},
		{
			title: 'ViewPager w/ fixed tabs',
			opts: {
				data: pagerData,
				tabs: {
					style: pagerModule.NORMAL
				}
			}
		},
		{
			title: 'ViewPager w/ fixed tabs and indicator',
			opts: {
				data: pagerData,
				tabs: {
					style: pagerModule.NORMAL
				},
				indicator: {
					style: pagerModule.LINE
				}
			}
		},
		{
			title: 'ViewPager w/ fixed tabs and custom styling',
			opts: {
				data: pagerData,
				tabs: {
					style: pagerModule.NORMAL,
					backgroundColor: "#cccccc",
					backgroundColorSelected: "#fff000",
					lineColor: "#00ff00",
					lineColorSelected: "#0000ff",
					lineHeight: 5,
					lineHeightSelected: 10,
					font: {
						size: 16,
						color: "#000fff",
						colorSelected: "#aabbcc"
					},
					padding: {
						left: 0,
						top: 15,
						right: 0,
						bottom: 15
					}
				}
			}
		},
		{
			title: 'ViewPager w/ scrolling tabs',
			opts: {
				data: pagerDataScrolling,
				tabs: {
					style: pagerModule.SCROLLING
				}
			}
		},
		{
			title: 'ViewPager w/ scrolling tabs and indicator',
			opts: {
				data: pagerDataScrolling,
				tabs: {
					style: pagerModule.SCROLLING
				},
				indicator: {
					style: pagerModule.LINE
				}
			}
		},
		{
			title: 'ViewPager w/ scrolling tabs and custom styling',
			opts: {
				data: pagerDataScrolling,
				tabs: {
					style: pagerModule.SCROLLING,
					backgroundColor: "#cccccc",
					backgroundColorSelected: "#fff000",
					lineColor: "#00ff00",
					lineColorSelected: "#0000ff",
					lineHeight: 5,
					lineHeightSelected: 10,
					font: {
						size: 16,
						color: "#000fff",
						colorSelected: "#aabbcc"
					},
					padding: {
						left: 20,
						top: 15,
						right: 20,
						bottom: 15
					}
				}
			}
		},
		{
			title: 'ViewPager w/ market tabs',
			opts: {
				data: pagerDataScrolling,
				tabs: {
					style: pagerModule.MARKET
				}
			}
		},
		{
			title: 'ViewPager w/ market tabs and custom styling',
			opts: {
				data: pagerDataScrolling,
				tabs: {
					style: pagerModule.MARKET,
					backgroundColor: "#3b3b3b",
					lineHeight: 0,
					lineHeightSelected: 0,
					font: {
						size: 16,
						color: "#91a438",
						colorSelected: "#91a438",
					},
					padding: {
						// top: 20,
						bottom: 15,
						// title: 40,
						clip: -10,
					}
				}
			}
		},
	];

	var table = Ti.UI.createTableView({
		data: tableData
	});
	
	table.addEventListener("click", function (e) {
		new ViewPagerView(e.rowData.opts).open();
	});
	
	self.add(table);
	
	return self;
}

module.exports = FirstView;

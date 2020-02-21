// a object to draw a table
function Table(canvasId){
	// the context object
	this.canvas = document.getElementById(canvasId);
	this.table = document.createElement("table");
	this.table.setAttribute("class","dataTable");

	// parameters
	this.numRows = 2;
	this.numColumns = 2;
	this.showRowTitle = true;
	this.showColumnTitle = true;
	this.showRowHeadings = true;
	this.showColumnHeadings = true;
	this.rowTitle = "Row Title";
	this.columnTitle = "Column Title";
	this.columnHeadings = ["col 1","col 2"];
	this.rowHeadings = ["row 1","row 2"];

	// the cell text of the table
	this.cell = [];				// this is the array of the td elements for the actual data cells
	this.cellText = [];			// text
	this.cellNodes = [];		// the text nodes that hold the text.
	this.rowTitleNode = null;	// text nodes for the row and column Titles
	this.columnTitleNode = null;

	// formatting objects
	this.changeBackground = false;	// flag for changing the background called form setup parameters
	this.backgrounds = null;		// array of background colors

	// initialize the table
	this.init = function(){
		if (this.canvas !== null){
			// find the parent node
			parentNode = this.canvas.parentNode;
			parentNode.replaceChild(this.table,this.canvas);

			// now create the table
			// first the title row
			var row = null;
			var titleCell = null;
			if (this.showColumnTitle){
				row = document.createElement("tr");
				this.table.appendChild(row);

				// empty cell for corner
				if (this.showColumnTitle){
					var blankCell = document.createElement("td");
					blankCell.setAttribute("class","dataCell");
					if (this.showColumnHeadings){
						blankCell.setAttribute("rowSpan","2");
					}
					if (this.showRowHeadings){
						blankCell.setAttribute("colspan","2");
					}
					row.appendChild(blankCell);
				}
				// now add the row title cell.
				titleCell = document.createElement("th");
				titleCell.setAttribute("class","dataHeader");
				titleCell.setAttribute("colspan",this.numColumns);
				this.columnTitleNode = document.createTextNode(this.columnTitle);
				titleCell.appendChild(this.columnTitleNode);
				row.appendChild(titleCell);
			}  // add columnTitle
			// now if add column headings
			if (this.showColumnHeadings){
				row = document.createElement("tr"); // create the row for the headings
				this.table.appendChild(row);
				for (var l = 0; l < this.columnHeadings.length; l ++){
					// if there is a column title add it now
					titleCell = document.createElement("th");
					titleCell.setAttribute("class","dataHeader");
					var headingNode = document.createTextNode(this.columnHeadings[l]);
					titleCell.appendChild(headingNode);
					row.appendChild(titleCell);
				}
			}

			// add the data values
			for (var i = 0; i < this.numRows; i ++){
				row = document.createElement("tr");
				this.table.appendChild(row);

				if (i === 0 & this.showRowTitle){
					// if there is a column title add it now
					titleCell = document.createElement("th");
					titleCell.setAttribute("class","dataHeader");
					titleCell.setAttribute("rowspan",this.numRows);
					this.rowTitleNode = document.createTextNode(this.rowTitle);
					titleCell.appendChild(this.rowTitleNode);
					row.appendChild(titleCell);
				}

				// had the header for the row if show
				if (this.showRowHeadings){
					titleCell = document.createElement("th");
					titleCell.setAttribute("class","dataHeader");
					var rowHead = document.createTextNode(this.rowHeadings[i]);
					titleCell.appendChild(rowHead);
					row.appendChild(titleCell);
				}

				// now add the cells of the row
				if (this.cellNodes.length <= i) {  // if not created, create
					this.cellNodes[i] = [];  // the text nodes that hold the text for this row
				}
				if (this.cell.length <= i){  // if the cell is not created, create
					this.cell[i] = [];  // the td element to allow modifying
				}
				for (var j = 0; j < this.numColumns; j ++){
					this.cell[i][j] = document.createElement("td");
					this.cell[i][j].setAttribute("class","dataCell");
					if (this.cellNodes[i].length <= j){  // if cell node not in existence
						this.cellNodes[i][j] = document.createTextNode(i+" "+j);  // create the text node to hold the text for the table cell
					}
					this.cell[i][j].appendChild(this.cellNodes[i][j]);
					row.appendChild(this.cell[i][j]);
				}

//				alert("setting up table class = "+this.table.getAttribute("class"));
			}
			// any final setup parameters
			if (this.changeBackground){  // if there is a setup parameter to change the background
				this.setCellBackgrounds(this.backgrounds);
			}
		}// canvas exists
	};

	//clear the table by removing all of the table elements.  Leave main table HTMl tag so table
	// can be initialized and recreated.
	this.clearTable = function(){

		while (this.table.hasChildNodes()){
			this.table.removeChild(this.table.lastChild);
		}

		// reset canvas so can reinit table.
		parentNode = this.table.parentNode;
		parentNode.replaceChild(this.canvas,this.table);
	};

	this.drawResults = function(){
		// empty method for now
	};

	this.setupResults = function(dvType){
		// empty method
	};

	this.isNumber =function(o) {
		return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
	};

	// setters and getters
	// setters
	// set the DOM objects
	this.setDOMObjects = function(canvasId){
		this.canvas = document.getElementById(canvasId); // drawing canvas
		this.init();
	};

	// set the canvas size.
	this.setSize = function(canvasWidth,canvasHeight){
		this.adjustSize = false;
//		this.canvas.width = canvasWidth;
//		this.canvas.height = canvasHeight;

		// resize the table
		this.table.setAttribute("width",canvasWidth);
//		this.table.setAttri
	};

	// allow the changing of cell values
	this.setData = function(data){  // this is called by plotting objects
		this.setCellValues(data);
	};

	// general method to change cell contents - this version for changing all
	this.setCellValues = function(cellValues){
		// make sure the shape is correct
		if (cellValues !== null){
			// make sure it is exists
			if (cellValues.length === this.numRows & cellValues[0].length === this.numColumns){
				this.cellText = cellValues;
//alert("in table = "+this.cellText[0][0]+"  num rows = "+this.numRows + "  celltext.length = "+this.cellText.length);
				// reset all off the cells values
				for (var i = 0; i < this.numRows; i ++){
					for (var j = 0; j < this.numColumns; j ++){
						this.setCell(this.cellText[i][j],i,j);
					}
				}
			}
		}
	};

	this.setCell = function(value,row,col){
		var celVal = value;
		if (this.isNumber(value)){  // test for if it is a number
			celVal = value.toFixed(2);  // set standard 2 decimal places for numbers
		}

		this.cellNodes[row][col].nodeValue = celVal;
	};

	this.setCellNodes = function(cellNodes){
		this.cellNodes = cellNodes;  // these are the type of cells.
		// get the number of rows and columns from this array
		this.numRows = this.cellNodes.length;
		this.numColumns = this.cellNodes[0].length;
	};

	this.setCellBackground = function(colorString,row,col){
		if (row < this.numRows & col < this.numColumns){
			this.cell[row][col].removeAttribute("bgcolor");  // remove any existing background color
			this.cell[row][col].setAttribute("bgColor",colorString);
		}
	};

	this.setCellBackgrounds = function(colorStrings){
		for (var i = 0; i < colorStrings.length; i ++){
			for (var j = 0; j < colorStrings[0].length; j ++){  // assume square table
				this.setCellBackground(colorStrings[i][j],i,j);
			}
		}
	};

	this.setSpecialParameters = function(specialParameters){
		// how to handle the special parameters to alter the illustration in this case
		if (specialParameters instanceof xySpecialParam){
			if (specialParameters.typeExtra == SUP_DATA){  // supplementary data to use in table
				if (specialParameters.showExtra === true){
					this.setData(specialParameters.extraParam);
				}
			}
		}  // if just one special parameter is passed
		else if (specialParameters === null){
			// capture null data.
		}
		else if (specialParameters.length >= 1){  // is an array of special parameters passed
			for (var i = 0; i < specialParameters.length; i ++){
				// now check each special parameter
				if (specialParameters[i] instanceof xySpecialParam){
					if (specialParameters[i].typeExtra == SUP_DATA){  // supplementary data to use in table
						if (specialParameters[i].showExtra === true){
							this.setData(specialParameters[i].extraParam);
						}
					}
				}
				// convert the number of dots
			}  // end going through array
		}  // end checking for array of special parameters
	};

	// function for setup parameters
	this.setSetupParam = function(setupParam){
//alert("table setup Param type = "+setupParam[0].typeSetup);
		// check for special parameters that belong to this object
		if (setupParam === null){
			// capture null data.
		}
		else if (setupParam instanceof SetupParam){
			if (setupParam.typeSetup == COLTITLE){
				this.columnTitle = setupParam.setupParam;
			}
			if (setupParam.typeSetup == ROWTITLE){
				this.rowTitle = setupParam.setupParam;
			}
			if (setupParam.typeSetup == COLHEADING){
				this.columnHeadings = setupParam.setupParam;
			}
			if (setupParam.typeSetup == ROWHEADING){
				this.rowHeadings = setupParam.setupParam;
			}
			if (setupParam.typeSetup == BACKCOLORS){
				this.backgrounds = setupParam.setupParam;
				this.changeBackground = true;
			}
		}
		else if (setupParam.length >= 1){  // is an array of special parameters passed
			for (var i = 0; i < setupParam.length; i ++){
				// now check each special parameter
				if (setupParam[i] instanceof SetupParam){
					if (setupParam[i].typeSetup == COLTITLE){
						this.columnTitle = setupParam[i].setupParam;
					}
					if (setupParam[i].typeSetup == ROWTITLE){
						this.rowTitle = setupParam[i].setupParam;
					}
					if (setupParam[i].typeSetup == COLHEADINGS){
						this.columnHeadings = setupParam[i].setupParam;
					}
					if (setupParam[i].typeSetup == ROWHEADINGS){
						this.rowHeadings = setupParam[i].setupParam;
					}
					if (setupParam[i].typeSetup == BACKCOLORS){
						this.backgrounds = setupParam[i].setupParam;
						this.changeBackground = true;
					}
				}
			}  // end going through array
		}  // end checking for array of setup parameters
	};

	// getters
	this.getCSV = function(){
		var s = "";  // csv String
		// add column title
		if (this.showColumnTitle){
			// spacing out the column title
			if (this.showRowTitle === true) { s += " ,";}
			if (this.showRowHeadings === true) { s += " ,";}
			s += this.columnTitle+"<br>";
		}
		if (this.showColumnHeadings === true){
			// spacing out the column headings
			if (this.showRowTitle === true) { s += " ,";}
			if (this.showRowHeadings === true) { s += " ,";}
			for (var i = 0; i < this.columnHeadings.length; i ++){
				s += this.columnHeadings[i]+",";
			}
			s += "<br>";
		}

		// now add the data append the row headings and titles if exist
		for (var r = 0; r < this.cellNodes.length; r ++){  // go by rows r
			if (this.showRowTitle === true){
				if (r == 0){
					// add title to first row
					s += this.rowTitle+",";
				}
				else{
					// just add a marker
					s += " ,";
				}
			}
			// check on  row headings
			if (this.showRowHeadings === true){
				s += this.rowHeadings[r]+",";
			}

			// now add the columns for this row
			for (var c = 0; c < this.cellNodes[r].length; c ++){
				s += this.cellNodes[r][c].nodeValue+",";
			}
			s += "<br>";
		}

		// return the CSV table
		return s;
	};

	this.getCSV_Down = function(){
		var s = "";  // csv String
		// add column title
		if (this.showColumnTitle){
			// spacing out the column title
			if (this.showRowTitle === true) { s += " ,";}
			if (this.showRowHeadings === true) { s += " ,";}
			s += this.columnTitle+"\n";
		}
		if (this.showColumnHeadings === true){
			// spacing out the column headings
			if (this.showRowTitle === true) { s += " ,";}
			if (this.showRowHeadings === true) { s += " ,";}
			for (var i = 0; i < this.columnHeadings.length; i ++){
				s += this.columnHeadings[i]+",";
			}
			s += "\n";
		}

		// now add the data append the row headings and titles if exist
		for (var r = 0; r < this.cellNodes.length; r ++){  // go by rows r
			if (this.showRowTitle === true){
				if (r == 0){
					// add title to first row
					s += this.rowTitle+",";
				}
				else{
					// just add a marker
					s += " ,";
				}
			}
			// check on  row headings
			if (this.showRowHeadings === true){
				s += this.rowHeadings[r]+",";
			}

			// now add the columns for this row
			for (var c = 0; c < this.cellNodes[r].length; c ++){
				s += this.cellNodes[r][c].nodeValue+",";
			}
			s += "\n";
		}

		// return the CSV table
		return s;
	};
}

// below are specialty tables
// table to display signal detection data as an output.
function SDT_Table(idResults, idResExpl,idResultVal){
	// split the canvas into two elements
	this.base = document.getElementById(idResults);
	this.span = document.createElement("span");
	this.parentNode = this.base.parentNode;
	this.parentNode.replaceChild(this.span,this.base);  // replace the canvas with a span
	// add two canvas
	this.tableCanvas = document.createElement("canvas");  // canvas for the table
	this.tableCId = "tableCanvas";
	this.tableCanvas.setAttribute("id",this.tableCId);
	this.tableCanvas.setAttribute("width","50");
	this.canvas = document.createElement("canvas");  // canvas for the buttons and text
	this.canvas.setAttribute("id","idButton");
	this.canvas.setAttribute("width","50");
	this.span.appendChild(this.tableCanvas);
	this.span.appendChild(this.canvas);
	this.context = this.canvas.getContext("2d");

	this.table = new Table(this.tableCId);				// the table
	this.tableInit = false;								// flag is the table initilized or not?
	this.explainP = document.getElementById(idResExpl); // results explanation paragraph
	this.resultTag = document.getElementById(idResultVal);	// where the results values will be shown.
    this.threshSpan = document.createElement("span");
    if (this.resultTag != null){
        this.resultTag.appendChild(this.threshSpan);
    }

	// default settings
	this.def = new Defaults();

	// drawing objects and parameters
	this.dataReady = false;			// flag if the data has been presented
	this.useData = true;			// this is a graphic object so needs data from outside.
	this.showResultsVal = false;	// flag if the results (threshold or PSE) is to be put on the screen
	this.resultsVal = null;  // the results value
	this.dvType = "Threshold";  // what the results parameter is.
	this.dvUnit = "";
	this.roomControls = false;  // flag if need to make room for controls
	this.background = this.def.defBackground;
	this.foreground = colorString(20,20,20);
	// colors of the boxes in the SDT table
	this.hitColor		= this.def.defLinesColors[1];
	this.crColor		= this.def.defLinesColors[0];
	this.missesColor	= complementString(this.hitColor);
	this.faColor		= complementString(this.crColor);
	this.adjustSize = true;

	// data array and parameters
	this.data = [];
	this.explanation = "";

	// buttons
	this.dataButton = null;		// button to show the data in a CSV format
	this.showDataButton = true;	// flag to indicate if show data button is to be displayed.
	this.resultButton = null;	// shows the calculated results
	this.showResButton = true;	// flag to cause the show result button to be shown.
	this.showResVal =  false;

	// special ways to add indications on the graph.
	this.specialParam = [];  // an array of special parameters that can be passed to add special
	// features to the xy scatter plot

    // file downloading objects
    this.MIME_TYPE = 'text/plain';
    this.a = []; // array of download a href objects of the download 

	// bind for listeners
	var self = this;

	this.initDOM = function(){  // call the initDOM objects to initial them
		if (this.explainP !== null)		{ this.explainP.setAttribute("class","paragraphs"); }
//		this.table.initDOM();  // if init DOM for this plot with explanation, also do for plot
	};

	// initialize the results plot
	this.setupResults = function(dvType){
		this.dvType = dvType;  // what type of dv does this experiment have.

		// initialize DOM objects if not called
		this.initDOM();

		// clear the results value
		this.clearResultVal();
		this.clearExpl();

		// set the headings and titles for the table.
		this.table.columnTitle = "The Signal is:";
		this.table.rowTitle = "Judgment:";
		this.table.columnHeadings = ["Present","Not Present"];
		this.table.rowHeadings = ["Happened","Did not happen"];


		// setup button listeners
		// relevant listeners
		this.canvas.onmousedown = function(event){
			// determine location of the mouse
			this.event = event || window.event;
			// clear the background
			var x,y;
			// get location of click on canvas
			if (event.pageX || event.pageY) {
				x = this.event.pageX;
				y = this.event.pageY;
			}
			else {
				x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			x -= self.canvas.offsetLeft;  // correct for page offsets
			y -= self.canvas.offsetTop;

			if (self.showDataButton){  // check if the data button has been clicked, if visible
				if (self.dataButton.isClickOverButton(x,y) & self.dataButton.buttonDrawn){
					self.dataButton.setButtonColors(self.dataButton.buttonPressed1,
													self.dataButton.buttonPressed2);
					self.dataButton.drawButton();
				}
			}
			if (self.showResButton){  // check if the show result button has been clicked, if visible
				if (self.resultButton.isClickOverButton(x,y) & self.resultButton.buttonDrawn){
					self.resultButton.setButtonColors(self.resultButton.buttonPressed1,
														self.resultButton.buttonPressed2);
					self.resultButton.drawButton();
				}
			}
		};  // end mousedown on draw canvas

		this.canvas.onmouseup = function(event){
			if (self.showDataButton){
				if (self.dataButton.buttonDrawn){  // only worry if the button has been drawn
					// redraw the button
					self.dataButton.setButtonColors(self.dataButton.buttonNorm1,
													self.dataButton.buttonNorm2);
					self.dataButton.drawButton();
				}
			}
			if (self.showResButton){
				if (self.resultButton.buttonDrawn){  // only worry if the button has been drawn
					// redraw the button
					self.resultButton.setButtonColors(self.resultButton.buttonNorm1,
														self.resultButton.buttonNorm2);
					self.resultButton.drawButton();
				}
			}
		};  // end onmouseup

		this.canvas.onclick = function(event){
			// only worry about the click if the data has been displayed
			if (self.dataReady){
				this.event = event || window.event;

				var x,y;  // x and y position of the click, ultimately

				// get location of click on canvas
				if (event.pageX || event.pageY) {
					x = this.event.pageX;
					y = this.event.pageY;
				}
				else {
					x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				x -= self.canvas.offsetLeft;  // correct for page offsets
				y -= self.canvas.offsetTop;

				// now see if there is a click over a button
				if (self.showDataButton){
					var showDataResp = self.dataButton.isClickOverButton(x,y);
					if (showDataResp){
						self.showDataTable();
					}
				}
				self.showResultsVal = false;
				if (self.showResButton) {
					self.showResultsVal = self.resultButton.isClickOverButton(x,y);
					if (self.showResultsVal) {
						self.showResultVal();
					}
					// if the show results button is clicked redraw the results.
				}
			}
		};	// end click handler

        // Rockstars use event delegation! 
        // drag listeners for Chrome and Opera (hopefully firefox soon)
        document.body.addEventListener('dragstart', function(e) {
            var a = e.target;
            if (a.classList.contains('dragout')) {
                e.dataTransfer.setData('DownloadURL', a.dataset.downloadurl);
            }
        }, false);

        document.body.addEventListener('dragend', function(e) {
            var a = e.target;
            if (a.classList.contains('dragout')) {
                cleanUp(a);
            }
        }, false);

		this.drawResults();  // call the results drawing method for the first time.
	};

	// the main results drawing method
	this.drawResults = function(){
		// pass needed parameters on to the plot object
		// figure out which ones I can remove before I am done here.
		this.table.dataReady = this.dataReady;				// has data been collected
		this.table.background = this.background;
		this.table.foreground = this.foreground;

		// data array and parameters
//		this.table.drawResults();
		if (this.adjustSize){  // check for screen size changes
			if (this.roomControls === false){  // if no controls fill browser
				resizeCanvas(this.canvas,this.context,def.defProWidthFull*0.6,0.8*def.defProHeightFull);
			}
			else if (this.roomControls === true){ // if controls, reduce overall canvas
				if (window.innerWidth > window.innerHeight){  // for wide browsers reduce width
					resizeCanvas(this.canvas,this.context,this.def.defProWidthConW*0.6,0.8*this.def.defProHeightFull);
				}
				else {  // if browser window is tall
					resizeCanvas(this.canvas,this.context,this.def.defProWidthFull*0.6,0.8*this.def.defProWidthConH);
				}
			}
		}

		// grab the canvas size into variables
		var width = this.canvas.width;  // width of canvas
		var height = this.canvas.height;  // height of column in pixels

		// clear canvas
		this.context.fillStyle=this.background;
		this.context.fillRect(0,0,width,height);

		if (this.dataReady){  // if data has been collected plot the data
			// shrink canvas to necessary size when data is being presented
			this.canvas.width = 250;
			this.canvas.height = height/2;
			width = this.canvas.width;
			height = this.canvas.height;

			if (this.tableInit === false){
				this.table.init();  // inilize the table
				this.tableInit = true;  // flag that the table has been initialized.
				// now that cells exist, change background color of the data cells.
				var blend = colorString(255,255,255);  // do alpha manually here, here is the default background color
				backgrounds = [];
				backgrounds[0] = [colorHex(opacityColor(this.hitColor,blend,0.5)),
										colorHex(opacityColor(this.faColor,blend,0.5))];
				backgrounds[1] = [colorHex(opacityColor(this.missesColor,blend,0.5)),
										colorHex(opacityColor(this.crColor,blend,0.5))];

				this.table.setCellBackgrounds(backgrounds);
			}
			this.table.setCellValues(this.data);

			// place the buttons on the screen.
//			if (this.showDataButton){
//				this.dataButton = new Button(this.canvas,"Show Data",width*1/10,height/25,width*8/10,width/25);
//				this.dataButton.drawButton();
//			}
			if (this.showResButton){
				this.resultButton = new Button(this.canvas,"Show "+this.dvType,
												width*1/10,height/25+width/5,width*8/10,width/25);
				this.resultButton.buttonFont = def.defFont14;
				this.resultButton.drawButton();
			}
		}
		else {
			if (this.tableInit === true){  // if a table has been drawn clear it.
				this.table.clearTable();
				this.tableInit = false;
			}

			var s = "The experiment has not been completed.";
			var s1 = "There are no results to display.";
			this.context.font = this.def.defFont18;
			this.context.fillStyle = this.def.defForeground;
			this.context.textAlign="center";
			this.context.fillText(s,width/2,height/2);
			this.context.fillText(s1,width/2,height/2+20);
		}
	};

	this.clearResultVal = function(){
        // clear the results value
        if (this.threshSpan !== null) {
            this.threshSpan.innerHTML = "";
        }
        if (this.showDataButton) {
            if (this.a.length > 0) {
                this.resultTag.removeChild(this.resultTag.lastChild); // remove the last node
                this.cleanUp(this.a[0], ""); // clean up aftermyself.
            }
        }
	};

	this.showResultVal = function(){
		this.showResultsVal = true;
		var s = "<br>Your d' = "+this.resultsVal[0].toFixed(2)+" and your criterion = "+this.resultsVal[1].toFixed(2);
		// clear the results value
		self.threshSpan.innerHTML = s+"<br>";

	};

	this.clearExpl = function(){
		var innerHTML = "";
		//
		if (this.explainP !== null) { this.explainP.innerHTML = innerHTML; }
	};

	this.showExpl = function(){
		// show the explanation for the text
//		var innerHTML = "Here is where I will explain the results,";
//		innerHTML += " yep, right here.";
			//
		this.explainP.innerHTML = this.explanation;

	};

    // these are functions to help download data
    this.cleanUp = function(a, removalText) {
        a.textContent = removalText;

        // Need a small delay for the revokeObjectURL to work properly.
        setTimeout(function() {
            window.URL.revokeObjectURL(a.href);
        }, 1500);
    };

    this.downloadFile = function(dataset, parentObject, fileName, buttonText, removalText) {
        this.dataset = dataset; // the data set to download in a text.csv file
        this.parentObject = parentObject; // the parent object to put the link when the data set is ready to go.
        this.buttonText = buttonText;
        this.removeText = removalText;
        this.fileName = fileName;

        window.URL = window.webkitURL || window.URL; // need a url object

        var bb = new Blob([dataset], { type: this.MIME_TYPE }); // blobify the text

        var curA = this.a.length;

        this.a[curA] = document.createElement('a'); // create the download link.
        this.a[curA].setAttribute("class", "downloadLink");
        this.a[curA].download = this.fileName;
        this.a[curA].href = window.URL.createObjectURL(bb);
        this.a[curA].textContent = this.buttonText;

        this.a[curA].dataset.downloadurl = [this.MIME_TYPE, this.a[curA].download, this.a[curA].href].join(':');
        this.a[curA].draggable = true; // Don't really need, but good practice.
        this.a[curA].classList.add('dragout');

        this.parentObject.appendChild(this.a[curA]);

        this.a[curA].onclick = function(e) {
            self.cleanUp(this, removalText);
        };
    };

    this.setupDownloadData = function() {
        // add the labels
        var ouptupString = "";
		outputString = this.table.getCSV_Down();

        var outputSpan = document.createElement('span');
        this.resultTag.appendChild(outputSpan);
        this.downloadFile(outputString, outputSpan, "myData.csv", "Download Data", "Data Downloaded");
    }

	// method to display the data table
	this.showDataTable =function(){
		// add the labels
		var dataString = "";

		// determine the window dimensions
		var width = screen.width/3;
		var height = screen.height;
		var windowDescr = 'width='+width+',height='+height+', left=0, toolbar=yes, location=no,';
		windowDescr += 'directories=no, status=no, menubar=no, scrollbars=yes, resizable=no,';
		windowDescr += 'copyhistory=no, titlebar=no';
		var dataWindow=window.open('','_blank',windowDescr);

		dataString = this.table.getCSV();

//		dataWindow.document.write("<p>This is 'myWindow'</p>");
		dataWindow.document.write(dataString);
		dataWindow.focus();
	};

	// getters and setters
	// setters
	// set the DOM objects
	this.setDOMObjects = function(idResults, idResExpl,idResultVal){
		this.graph.setDOMObjects(idResults);
		this.explainP = document.getElementById(idResExpl); // results explanation paragraph
		this.resultTag = document.getElementById(idResultVal);  // DOM object to hod the result value
	};
	// set the size of the canvas
	this.setSize = function(canvasWidth,canvasHeight){
//		this.table.setSize(canvasWidth,canvasHeight);
		this.canvas.width = canvasWidth*0.6;
		this.canvas.height = canvasHeight;
		this.adjustSize = false;
	};

	// This method sets the data into the results object and also redraws the data graph now allowing
	// the graph to be drawn.
	this.setData = function(data){
//		this.table.setData(data);
		this.data = data;
		this.dataReady = true;
		this.showExpl();
		this.drawResults();

        // setup download data
        if (this.showDataButton) {
            this.setupDownloadData(); // call routine to set up the download link for the data.
        }
	};

	this.setSecondData = function(data2){
//		this.graph.setSecondData(data2);
		// not implemented or probably needed but a place holder
	};

	/**
	 *Sets the results value.  As this is not the data array, it does not reset the dataReady flag and
	 * does not call the drawResults method.
	 */
	this.setResultsVal = function(resultsVal){
//		this.graph.resultsVal = resultsVal;
		this.resultsVal = resultsVal;  // the threshold or PSE
	};


	// sets special parameters for the xygraph to add novel display elements
	this.setSpecialParameters = function(specialParameters){
		this.table.setSpecialParameters(specialParameters);
//alert('in set special param length = '+specialParameters.length);
	};   // end setSpecialParameters

	// function for setup parameters
	this.setSetupParam = function(setupParam){
		// do not need any setup parameters here.
		this.table.setSetupParam(setupParam);
	};

}
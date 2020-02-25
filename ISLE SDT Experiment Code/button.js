// a drawing library as an object
function Button(canvas, label, xStart, yStart, width, height) {
    this.canvas = canvas; // drawing canvas
    this.context = this.canvas.getContext("2d"); // drawing context
    this.label = label; // button text label
    this.def = new Defaults(); // defaults

    // parameters of the button size
    this.xStart = xStart;
    this.yStart = yStart;
    this.width = width;
    this.height = height;

    this.buttonPosSize = [this.xStart, this.yStart, this.width, this.height];

    // button description objects
    this.buttonStyle = colorString(255, 0, 0); // button style
    this.buttonColor1 = colorString(50, 50, 150);
    this.buttonColor2 = colorString(100, 100, 200);
    this.buttonNorm1 = this.buttonColor1; // colors for the normal button
    this.buttonNorm2 = this.buttonColor2;
    this.buttonPressed1 = colorString(20, 20, 60); // colors but button pressed to give feedback
    this.buttonPressed2 = colorString(40, 40, 80);
    this.buttonFont = def.defFont18;

    this.buttonDrawn = false; // flag for if button is drawn

    this.buttonPos = [xStart, yStart, width, height];

    // button constants
    var X = 0; // indexes in button array
    var Y = 1;
    var W = 2;
    var H = 3;

    // binding for event handers
    var self = this;

    // drawing methods
    // draw a button
    this.drawButton = function() {
        // now put on the label for the button
        this.context.font = this.buttonFont; // do this first so make sure outline is bigger than font
        var textWidth = this.context.measureText(this.label).width;

        // make sure button fits text
        if (this.width < 1.2 * textWidth) {
            this.width = 1.2 * textWidth;
        }
        if (this.height < 25) {
            this.height = 25;
        }

        // make sure button stays on screen
        if (this.xStart < 0) {
            this.xStart = 0;
        }
        if (this.yStart < 0) {
            this.yStart = 0;
        }
        if (this.xStart + this.width > this.canvas.width) {
            this.xStart = this.canvas.width - this.width;
        }
        if (this.yStart + this.height > this.canvas.height) {
            this.yStart = this.canvas.height - this.height;
        }

        // create the fill for the button
        this.buttonStyle = this.context.createRadialGradient(this.xStart + this.width / 2, this.yStart + this.height / 2, 5,
            this.xStart + this.width / 2, this.yStart + this.height / 2, this.width);
        this.buttonStyle.addColorStop(0, this.buttonColor1);
        this.buttonStyle.addColorStop(1, this.buttonColor2);
        this.context.fillStyle = this.buttonStyle;

        this.context.fillRect(this.xStart, this.yStart, this.width, this.height);

        // draw the label
        this.context.fillStyle = colorString(255, 255, 255);
        //		this.context.textAlign = 'left';
        //		this.context.fillText(this.label,this.xStart+this.width/2-textWidth/2,
        //									this.yStart+this.height/2+this.def.defFontSizePx/2);
        this.context.textAlign = 'center';
        this.context.fillText(this.label, this.xStart + this.width / 2,
            this.yStart + this.height / 2 + this.def.defFontSizePx / 2);

        // now let object know the button has been drawn
        this.buttonDrawn = true;

        // collect the current button position
        this.buttonPos = [this.xStart, this.yStart, this.width, this.height];
    };

    this.isClickOverButton = function(x, y) {
        var isOver = false; // flag turns true if the click is over the button

        // check x dimension
        if (x >= this.xStart & x <= this.xStart + this.width) {
            //			alert("over x");
            // check y dimension
            if (y >= this.yStart & y <= this.yStart + this.height) {
                //				alert("over button");
                isOver = true;
            }
        }

        return isOver;
    };

    // setters and getters
    // setters
    this.setCanvas = function(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d"); // right now assume a 2d drawing context
    };

    this.setLabel = function(label) {
        this.label = label;
    };

    this.setButton = function(xStart, yStart, width, height) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.width = width;
        this.height = height;
    };

    // set button colors
    this.setButtonColors = function(color1, color2) {
        this.buttonColor1 = color1;
        this.buttonColor2 = color2;
    };
    this.setButtonColorSet = function(norm1, norm2, pressed1, pressed2) {
        this.buttonNorm1 = norm1;
        this.buttonNorm2 = norm2;
        this.buttonPressed1 = pressed1;
        //		alert("setting button color set");
        this.buttonPressed2 = pressed2;
        this.buttonColor1 = this.buttonNorm1;
        this.buttonColor2 = this.buttonNorm2;
    };

    this.buttonStart = function(event) {
        if (self.buttonDrawn) { // only worry if the button has been drawn
            //				alert("button draw over canvas");
            // determine location of the mouse
            this.event = event || window.event;
            // clear the background
            var x, y;

            // get location of click on canvas
            if (event.pageX || event.pageY) {
                x = this.event.pageX;
                y = this.event.pageY;
            } else {
                x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            x -= self.canvas.offsetLeft; // correct for page offsets
            y -= self.canvas.offsetTop;

            //			alert("x = "+x+" y = "+y);
            if (self.isClickOverButton(x, y)) {
                //				alert("mouse is over button");
                self.setButtonColors(self.buttonPressed1, self.buttonPressed2);
                self.drawButton();
            }
        }
    }

    this.buttonEnd = function(event) {
        if (self.buttonDrawn) { // only worry if the button has been drawn
            //			alert("button mouseup");
            // redraw the button
            self.setButtonColors(self.buttonNorm1, self.buttonNorm2);
            self.drawButton();
        }
    }

    this.touchBegin = function(event) {
        event.preventDefault();
        if (self.buttonDrawn) { // only worry if the button has been drawn
            //				alert("button draw over canvas");
            var loc = new TouchLoc(event, self.canvas);

            // get the points on the screen that have been touched
//            var touches = event.changedTouches;
            //				alert(touches.length+"  x of 0 = "+touches[0].pageX);
//            var x = touches[0].pageX - self.canvasResp.offsetLeft; // correct for page offsets
//            var y = touches[0].pageY - self.canvasResp.offsetTop;

            //			alert("x = "+x+" y = "+y);
            if (self.isClickOverButton(loc.x, loc.y)) {
                //				alert("mouse is over button");
                self.setButtonColors(self.buttonPressed1, self.buttonPressed2);
                self.drawButton();
            }
        }
    }

    this.touchFinish = function(event) {
        event.preventDefault();
        if (self.buttonDrawn) { // only worry if the button has been drawn
            //			alert("button mouseup");
            // redraw the button
            self.setButtonColors(self.buttonNorm1, self.buttonNorm2);
            self.drawButton();
        }
    }

    this.internalListen = function() {
        this.canvas.addEventListener('mousedown', self.buttonStart);
        this.canvas.addEventListener("mouseup", self.buttonEnd);

        // touch listeners below
        // the beginning of the touch
        this.canvas.addEventListener('touchstart', self.touchBegin, false);

        this.canvas.addEventListener('touchend', self.touchFinish, false);
    };
}

function NumberPad(canvas, xStart, yStart, numRow) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d"); // drawing context
    this.xStart = xStart;
    this.yStart = yStart;
    this.numRow = numRow;

    this.def = new Defaults();
    this.font = this.def.defFont16;
    this.color1Norm = colorString(50, 50, 150); // colors for the normal button
    this.color2Norm = colorString(100, 100, 200);
    this.color1Pressed = colorString(20, 20, 60); // colors but button pressed to give feedback
    this.color2Pressed = colorString(40, 40, 80);
    this.buttons = []; // array of buttons to be pressed
    this.gap = 4; // spacing between buttons

    this.oneRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "B", "C"]; // order of items in button array for each shape number pad
    this.twoRow = ["1", "2", "3", "4", "5", "B", "6", "7", "8", "9", "0", "C"];
    this.fourRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "B", "0", "C"];
    this.oneRUnicode = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 8, 46];
    this.twoRUnicode = [49, 50, 51, 52, 53, 8, 54, 55, 56, 57, 48, 46];
    this.fourRUnicode = [49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 48, 46];

    this.labels = this.fourRow; // what are the labels for this button pad
    this.unicodes = this.fourRUnicode;

    // dimesions of the number pad
    this.totalWidth = 0;
    this.totalHeight = 0;

    this.initPad = function() {
        var s = "0"; // determine button dimensions
        this.context.font = this.font;
        var sLen = 2 * this.context.measureText(s).width;

        // test the dimensions of the number pad, can only be 1,2,4 rows for now
        if (this.numRow < 1) {
            this.numRow = 1;
        }
        if (this.numRow == 3) {
            this.numRow = 4;
        } // reset 3 to four rows like a standard keyboard number pad.
        if (this.numRow > 4) {
            this.numRow = 4;
        }

        // now figure out the lables being used and unocide array
        if (this.numRow == 1) {
            this.labels = this.oneRow;
            this.unicodes = this.oneRUnicode;
        } else if (this.numRow == 2) {
            this.labels = this.twoRow;
            this.unicodes = this.twoRUnicode;
        } else {
            this.labels = this.fourRow;
            this.unicodes = this.fourRUnicode;
        }

        // create the buttons
        var rowWidth = 12 / this.numRow; // figure out the number of buttons on each row.
        var curRow = 0; // current drawing row of number pad
        var curButton = 0; // current button in row
        // make sure the canvas supplied drawing area is big enough
        this.totalWidth = rowWidth * sLen + this.gap * (rowWidth - 1);
        this.totalHeight = this.numRow * sLen + (this.gap) * (this.numRow - 1);
        if ((this.canvas.width - this.xStart) < this.totalWidth) {
            this.xStart = this.canvas.width - this.totalWidth;
        }
        if (this.canvas.height - this.yStart < this.totalHeight) {
            this.yStart = this.canvas.height - this.totalHeight;
        }
        // increase the canvas if you can and it is necessary
        if (this.xStart < 0) {
            this.canvas.width = this.totalWidth;
            this.xStart = 0;
        }
        if (this.yStart < 0) {
            this.canvas.height = this.totalHeight;
            this.ystart = 0;
        }

        //		alert(sLen+" canvas height = "+this.canvas.height);
        for (var i = 0; i < 12; i++) {
            this.buttons[i] = new Button(this.canvas, this.labels[i],
                this.xStart + sLen * curButton + this.gap * curButton,
                this.yStart + curRow * sLen + (this.gap) * curRow,
                sLen, sLen);
            this.buttons[i].buttonFont = this.font;
            this.buttons[i].setButtonColorSet(this.color1Norm, this.color2Norm, this.color1Over, this.color2Over);
            // up the indexes
            // first item in row
            curButton++; // increase button
            if (curButton >= rowWidth) {
                // done with this row
                curRow++; // start next row
                curButton = 0; // at beginning  // if my math is correct I dod not need to check anything else.
            }
        }
    };

    this.drawPad = function() {
        // debug
        //		this.context.fillStyle = colorString(255,0,0);
        //alert("drawPad");
        //		this.context.fillRect(xStart,yStart,this.canvas.width,this.canvas.height);

        // draw the buttons
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].drawButton();
        }
    };

    // return what button is being pressed
    this.keyPressed = function(x, y) {
        var unicode = -1; // -1 is a flag to indicate that there is not a valid keypress

        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].isClickOverButton(x, y) & this.buttons[i].buttonDrawn) {
                unicode = this.unicodes[i];
            }
        }

        return unicode;
    };

    // feedback on keypresses
    this.keyDown = function(x, y) {
        //alert("checking keydown");
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].isClickOverButton(x, y) & this.buttons[i].buttonDrawn) {
                //				alert("mouse is over button");
                this.buttons[i].setButtonColors(this.buttons[i].buttonPressed1, this.buttons[i].buttonPressed2);
                this.buttons[i].drawButton();
            }
        }
    };
    this.keyUp = function() {
        for (var i = 0; i < this.buttons.length; i++) {
            //				alert("mouse is over button");
            this.buttons[i].setButtonColors(this.buttons[i].buttonNorm1, this.buttons[i].buttonNorm2);
            this.buttons[i].drawButton();
        }
    };

    this.resetPad = function(xStart, yStart) {
        var s = "0"; // determine button dimensions
        this.context.font = this.font;
        var sLen = 2 * this.context.measureText(s).width;
        // reset the buttons
        this.xStart = xStart;
        this.yStart = yStart;
        var rowWidth = 12 / this.numRow; // figure out the number of buttons on each row.
        var curRow = 0; // current drawing row of number pad
        var curButton = 0; // current button in row
        // make sure the canvas supplied drawing area is big enough
        this.totalWidth = rowWidth * sLen + this.gap * (rowWidth - 1);
        this.totalHeight = this.numRow * sLen + (this.gap) * (this.numRow - 1);
        if ((this.canvas.width - this.xStart) < this.totalWidth) {
            this.xStart = this.canvas.width - this.totalWidth;
        }
        if (this.canvas.height - this.yStart < this.totalHeight) {
            this.yStart = this.canvas.height - this.totalHeight;
        }
        // increase the canvas if you can and it is necessary
        if (this.xStart < 0) {
            this.canvas.width = this.totalWidth;
            this.xStart = 0;
        }
        if (this.yStart < 0) {
            this.canvas.height = this.totalHeight;
            this.ystart = 0;
        }

        //		alert(sLen+" canvas height = "+this.canvas.height);
        for (var i = 0; i < 12; i++) {
            this.buttons[i].setButton(this.xStart + sLen * curButton + this.gap * curButton,
                this.yStart + curRow * sLen + (this.gap) * curRow,
                sLen, sLen);
            // up the indexes
            // first item in row
            curButton++; // increase button
            if (curButton >= rowWidth) {
                // done with this row
                curRow++; // start next row
                curButton = 0; // at beginning  // if my math is correct I dod not need to check anything else.
            }
        }
    };
}
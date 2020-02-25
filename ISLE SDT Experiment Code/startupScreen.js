function StartScreen() {

    this.def = new Defaults();

    // position and dimensions of start button
    this.bX = -10; // default position of start button.
    this.bY = -10;
    this.bW = 0;
    this.bH = 0;

    this.BUTTON_X = 0; // the indexes of the array that gets the button location information
    this.BUTTON_Y = 1;
    this.BUTTON_W = 2;
    this.BUTTON_H = 3;

    // local button objects
    this.startButton; // the button drawing object

    this.drawStartScreen = function(canvas, context) {
        // get the dimensions of the drawing areas
        var width = canvas.width;
        var height = canvas.height;

        // clear the screen to full white for startup
        context.fillStyle = colorString(255, 255, 255);
        context.fillRect(0, 0, width, height);

        // draw the text in the middle of the screen
        context.font = this.def.defFont;
        var s = "Press the space bar to begin the experiment.";
        // draw the text
        context.fillStyle = colorString(10, 10, 10);
        context.textAlign = 'center';
        context.fillText(s, width / 2, height / 2);
        //		alert("doing startup screen width = "+width+" height = "+height+" \nstrlength = "+strLength+" "+s);
        s = "Or press the button below.";
        var strLength = context.measureText(s).width; // need to measure this text to make box below for button.
        context.fillText(s, width / 2, height / 2 + this.def.defFontSizePx);

        // now put a button on the screen for touch screens to use
        // determine position and dimensions
        this.bX = width / 2 - strLength / 2;
        this.bY = height / 2 + 3 * this.def.defFontSizePx;
        this.bW = strLength;
        this.bH = 3 * this.def.defFontSizePx;
        // create the button
        this.startButton = new Button(canvas, "Start", this.bX, this.bY, this.bW, this.bH);
        this.startButton.internalListen();
        // draw the button
        this.startButton.drawButton();
    }

    this.drawClearScreen = function(canvas, context) {
        // get the dimensions of the drawing areas
        var width = canvas.width;
        var height = canvas.height;

        // clear the screen to full white for startup
        context.fillStyle = colorString(255, 255, 255);
        context.fillRect(0, 0, width, height);

        // draw the text in the middle of the screen
        context.font = this.def.defFont16;
        var s = "The experiment has finished.";
        var strLength = context.measureText(s).width;
        // draw the text
        context.fillStyle = colorString(10, 10, 10);
        context.fillText(s, width / 2 - strLength / 2, height / 2);

        context.font = this.def.defFont16;
        s = "You may now view your results.";
        strLength = context.measureText(s).width;
        // draw the text
        context.fillStyle = colorString(10, 10, 10);
        context.fillText(s, width / 2 - strLength / 2, height / 2 + 18);
    }

    this.isStartButtonClicked = function(x, y) {
        //		alert("startupscreen checking but start button is clicked");
        var buttonDim = [this.bX, this.bY, this.bW, this.bH];
        //		alert("have button dimensions bX = "+buttonDim[0]);
        var isClicked = this.startButton.isClickOverButton(x, y);
        //		alert("isClicked in startupscreen = "+isClicked);
        return isClicked;
    }

    this.clearButton = function() {
        if (this.startButton.buttonDrawn) {
            this.startButton.buttonDrawn = false;
        }
    }

    // getters and setters
    // getters
    this.getButton = function() {
        var buttonDim = [this.bX, this.bY, this.bW, this.bH];
        return buttonDim;
    }
}
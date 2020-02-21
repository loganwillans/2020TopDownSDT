// my slider object
function Slider(label, canvas, pctWidth) {

    if (!(this instanceof Slider)) { // make sure object is called correctly
        return new Slider(label, canvas, pctWidth);
    }

    // default values
    this.def = new Defaults();

    // label and canvas objects
    this.label = label; // the label for the slider
    this.canvas = canvas;
    this.canvas.style.cursor = "pointer"; // make the cursor a pointer
    this.background = this.def.defBackground;
    this.foreground = this.def.defFontColor;

    // default parameters
    this.pctWidth = pctWidth; // percent of the inner width of browser for slider
    this.width = window.innerWidth * this.pctWidth / 100; // size of drawing area
    this.height = this.canvas.height;
    this.sldrMin = 0; // default min
    this.sldrMax = 100; // default max
    this.sldrVal = 50; // current slider value
    this.sldrChange = false; // has the slider changed its
    // dimensions of slider
    this.sldrRad = 6; // diameter of slider
    this.sliderBegin = 0; // starting point of the slider (will arc out from this for conclusion at this.rad)
    this.sliderEnd = this.width; // end of slider
    this.sliderMiddle = this.height / 2; // the center of the slider

    // click offsets to correct if in other objects that have offsets
    this.offsetLeft = 0;
    this.offsetTop = 0;

    // optional parameters of the slider
    this.mouseIsDown = false; // track if mouse button is down to deal with dragging of slider
    this.showValue = true; // display the current value of the slider
    this.showLimits = false; // diplsay the max and minium values of the slider, below the slider
    this.showSteps = true; // display the step by step conrols of the slider
    this.sliderStep = 1; // size of the step in the +/-
    this.autoStep = true; // flag to allow autostepsize calculations

    // highlight the step controls
    this.strokeNormal = "rgb(100,100,100)";
    this.strokeMouseIsDown = "rgb(0,0,0)";
    this.minusIsDown = false;
    this.plusIsDown = false;
    this.moveVal; // timer to move a slider the the plus or minus is held down.
    this.updateMS = 100; // rate of moving slider
    this.delayMS = 400; // how much to delay before starting to move the slider
    // dimensions of the step controls
    this.minusMin = 0;
    this.minusMax = 0;
    this.plusMin = 0;
    this.plusMax = 0;

    // flag to see if we want to track or not
    this.doTrack = true;
    this.noTrackBack = colorString(125, 125, 125);
    this.showSlider = true; // flag if the slider is visible
    this.circle = false; // set true to allow for sliders to go back to the beginning after then going to limit.

    // if a done button
    this.doneButton = null; // a button to catch if the responding is finished
    this.doneLabel = "Done"; // the label for the button
    this.showButton = false; // flag if button is to be shown
    this.buttonCreated = false; // flag so button is made only once
    this.donePos = []; // The array that has the position information for the button
    //	this.X_START = 0;  // position of the xstart value of the done button
    this.doneButtonFont = def.defFotn16; // font of the button
    this.color1Norm = colorString(125, 125, 125);
    this.color2Norm = colorString(175, 175, 175);
    this.color1Over = colorString(75, 75, 75);
    this.color2Over = colorString(125, 125, 125);

    var self = this; // bind this object so I can use it in the event handler

    // internal setters and getters
    this.setValue = function(val) {
        if (val < self.sldrMin) {
            if (self.circle) {
                val = self.sldrMax;
            } else {
                val = self.sldrMin;
            }
        }
        if (val > self.sldrMax) {
            if (self.circle) {
                val = self.sldrMin;
            } else {
                val = self.sldrMax;
            }
        }
        //        alert("step = "+this.sliderStep+" valu = "+val);
        if (val != this.sldrVal) {
            this.sldrChange = true;
        }
        self.sldrVal = val;

        this.drawSlider();
    };

    this.startUpdate = function() {
        clearInterval(self.moveVal);
        self.moveVal = setInterval(self.update, self.updateMS);
    }

    this.update = function() {
        if (self.plusIsDown) { // plus is pressed if true
            self.setValue((self.sldrVal + self.sliderStep));
            self.sldrChange = true;
        } else if (self.minusIsDown) { // minus is press if false.  do not act if not entered
            self.setValue((self.sldrVal - self.sliderStep));
            self.sldrChange = true;
        } else {
            // if neither pressed stop slider
            clearInterval(self.moveVal);
        }
    }

    // is minus being pressed
    this.setMinusIsDown = function(mDown) {
        if (mDown === true) {
            this.minusIsDown = true;
            self.moveVal = setInterval(self.startUpdate, self.delayMS);
        } else {
            this.minusIsDown = false;
        }
    };
    // is plus being pressed
    this.setPlusIsDown = function(pDown) {
        if (pDown === true) {
            this.plusIsDown = true;
            self.moveVal = setInterval(self.startUpdate, self.delayMS);
        } else {
            this.plusIsDown = false;
        }
    };

    // internal getters to handle the binding problem
    this.getSliderMin = function() {
        return this.sldrMin;
    };
    this.getSliderMax = function() {
        return this.sldrMax;
    };
    this.getSliderStep = function() {
        return this.sliderStep;
    };
    this.getValue = function() {
        return this.sldrVal;
    };
    this.getSliderRad = function() {
        return this.sldrRad;
    };
    this.getSliderBegin = function() {
        return this.sliderBegin;
    };
    this.getSliderEnd = function() {
        return this.sliderEnd;
    };
    this.getSliderMiddle = function() {
        return this.sliderMiddle;
    };
    this.getMinusMin = function() {
        return this.minusMin;
    };
    this.getMinusMax = function() {
        return this.minusMax;
    };
    this.getPlusMin = function() {
        return this.plusMin;
    };
    this.getPlusMax = function() {
        return this.plusMax;
    };

    // the basic draw slider function
    this.drawSlider = function() {
        //alert(this.label+"  "+this.canvas.parentNode+this.canvas.parentNode.parentNode);
        this.width = window.innerWidth * this.pctWidth / 100; // size of drawing area
        this.canvas.width = this.width;
        this.context = canvas.getContext("2d"); // the drawing context

        // now round the slider value to the current slider step size
        this.sldrVal = this.sliderStep * Math.round(this.sldrVal / this.sliderStep);

        // test slider value
        if (this.sldrVal > this.sldrMax) {
            this.sldrVal = this.sldrMax;
        }
        if (this.sldrVal < this.sldrMin) {
            this.sldrVal = this.sldrMin;
        }

        // resize the canvas height
        this.height = Math.round(this.def.defFontSizePx * 1.8);
        this.canvas.height = this.height;
        if (this.showLimits === true) { // resize the canvas if the max and min values are displayed
            this.canvas.height = 2 * this.height;
        }
        this.context.font = this.def.defFontEm; // set the font
        this.textWidth = Math.floor(this.context.measureText(this.label).width) + 1; // what is the size of the label.
        this.sliderBelow = false; // flag to indicate if slider is to be drawn below as opposted to next to label
        this.heightAdd = 0;
        if (this.textWidth > this.width * 0.33) {
            // if the text takes up more than 33* of the slider area
            // move the slider below the text
            this.heightAdd = this.def.defFontSizePx * 1.8;
            this.canvas.height = this.canvas.height + this.heightAdd;
            this.sliderBelow = true;
        }

        // check about button
        if (this.showButton) {
            this.donePos = [this.width * 99 / 100, this.canvas.height / 4, this.canvas.height / 2, 24]; // define the position of the button
            if (this.buttonCreated === false) {
                this.doneButton = new Button(this.canvas, this.doneLabel, this.donePos[0], this.donePos[1], this.donePos[2], this.donePos[3]);
                this.doneButton.setButtonColorSet(this.color1Norm, this.color2Norm, this.color1Over, this.color2Over);
                this.buttonCreated = true;
            }
            //			this.doneButton.buttonFont = this.doneButtonFont;
        }

        // clear the slider field
        this.context.fillStyle = this.def.defBackground;
        if (this.doTrack === false) {
            this.context.fillStyle = this.noTrackBack;
        }
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw button if needed
        if (this.showButton) {
            this.doneButton.drawButton();
            this.donePos = this.doneButton.buttonPos;
        } // collect the button position

        if (this.showSlider) {
            // fill with the indicated background
            this.context.fillStyle = this.background;
            if (this.doTrack === false) {
                this.context.fillStyle = this.noTrackBack;
            }
            var end = this.width;
            if (this.showButton) {
                end = this.donePos[0] - 1;
            }
            this.context.fillRect(0, 0, end, this.canvas.height);
            //			this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
            // redraw button if need to
            if (this.showButton) {
                this.doneButton.drawButton();
            }

            // draw the label
            this.context.font = this.def.defFontEm; // set the font
            this.context.fillStyle = this.foreground;
            this.context.textAlign = "left";
            this.context.fillText(this.label, 0, 3 * this.height / 4);
            // reset font
            this.context.font = this.def.defFont;

            this.textWidth = Math.floor(this.context.measureText(this.label).width) + 1;
            if (this.sliderBelow === true) {
                this.textWidth = 1; // if the slider is below the label, use the whole canvas
            }

            // plan for the value at the end of the slider
            this.valueWidth = 0; // set this value so can use below
            if (this.showValue === true) {
                this.valLimit = this.sldrMax;
                if (this.sldrMax.toFixed(0).length < this.sldrMin.toFixed(0).length) {
                    this.valLimit = this.sldrMin;
                }
                this.valueLabel = " = " + this.valLimit.toFixed(0); // longest possible string
                if (this.sliderStep >= 0.1 & this.sliderStep < 1) {
                    this.valueLabel = " = " + this.valLimit.toFixed(1);
                } else if (this.sliderStep < 0.1 & this.sliderStep >= 0.01) {
                    this.valueLabel = " = " + this.valLimit.toFixed(2);
                } else if (this.sliderStep < 0.01) {
                    this.valueLabel = " = " + this.valLimit.toFixed(3);
                }
                this.valueWidth = this.context.measureText(this.valueLabel).width;

                //write current value
                this.context.textAlign = "left";
                this.valueLabel = " = " + this.sldrVal.toFixed(0);
                if (this.sliderStep >= 0.1 & this.sliderStep < 1) {
                    this.valueLabel = " = " + this.sldrVal.toFixed(1);
                } else if (this.sliderStep < 0.1 & this.sliderStep >= 0.01) {
                    this.valueLabel = " = " + this.sldrVal.toFixed(2);
                } else if (this.sliderStep < 0.01) {
                    this.valueLabel = " = " + this.sldrVal.toFixed(3);
                }
                this.context.fillStyle = this.foreground;
                this.context.fillText(this.valueLabel, this.width - this.valueWidth, 3 * this.height / 4 + this.heightAdd);
            }

            if (this.showButton) { // determine if button is present and add to offset if it is.
                this.valueWidth += this.donePos[2] + 3; // add the width of the button to the what needs to be protected at the end of the slider
            } // collect the button position

            // steup the step value controls
            this.stepWidth = 0;
            if (this.showSteps === true) {
                // draw the minus sign
                this.currLineWidth = this.context.lineWidth;
                this.stepWidth = this.height;
                this.context.beginPath();
                this.minusMin = this.textWidth + 5;
                this.minusMax = this.minusMin + this.stepWidth;
                this.context.moveTo(this.minusMin, this.height / 2 + this.heightAdd);
                this.context.lineTo(this.minusMin + this.stepWidth, this.height / 2 + this.heightAdd);
                this.context.lineWidth = Math.round(this.height / 10);
                if (this.minusIsDown === false) {
                    this.context.strokeStyle = this.strokeNormal;
                } else {
                    this.context.strokeStyel = this.strokeMouseIsDown;
                }
                this.context.stroke();

                // now do the plus sign
                this.context.beginPath();
                // horizontal mark
                this.plusMin = this.width - this.valueWidth - 5 - this.stepWidth;
                this.plusMax = this.width - this.valueWidth - 5;
                this.context.moveTo(this.plusMin, this.height / 2 + this.heightAdd);
                this.context.lineTo(this.plusMax, this.height / 2 + this.heightAdd);
                // vertical mark
                this.context.moveTo(this.plusMin + Math.floor(this.stepWidth / 2), this.height / 2 - Math.floor(this.stepWidth / 2) + this.heightAdd);
                this.context.lineTo(this.plusMin + Math.floor(this.stepWidth / 2), this.height / 2 + Math.floor(this.stepWidth / 2) + this.heightAdd);

                if (this.plusIsDown === false) {
                    this.context.strokeStyle = this.strokeNormal;
                } else {
                    this.context.strokeStyle = this.strokeMouseIsDown;
                }
                this.context.stroke();


                // reset linewidth
                this.context.lineWidth = this.currLineWidth;
            }

            //start drawing the slider bar
            this.context.beginPath();
            this.sldrRad = 4; // diameter of slider
            this.sliderBegin = this.textWidth + 10 + this.stepWidth; // starting point of the slider (will arc out from this for conclusion at this.rad)
            this.sliderEnd = this.width - this.valueWidth - 10 - this.stepWidth; // end of slider
            this.sliderMiddle = this.height / 2 + this.heightAdd; // the center of the slider
            this.context.arc(this.sliderBegin, this.sliderMiddle, this.sldrRad, Math.PI / 2, 3 * Math.PI / 2, false);
            this.context.lineTo(this.sliderEnd, this.sliderMiddle - this.sldrRad);
            this.context.arc(this.sliderEnd, this.sliderMiddle, this.sldrRad, 3 * Math.PI / 2, Math.PI / 2, false);
            this.context.closePath();

            // show the max and min values if required
            if (this.showLimits === true) {
                // minimum label
                this.limitLabel = this.sldrMin.toFixed(0);
                if (this.sldrMin > 1 & this.sldrMin <= 10) {
                    this.limitLabel = this.sldrMin.toFixed(1);
                } else if (this.sldrMin <= 1) {
                    this.limitLabel = this.sldrMin.toFixed(2);
                }
                this.context.textAlign = "left";
                this.context.fillStyle = this.foreground;
                this.context.fillText(this.limitLabel, this.sliderBegin - this.sldrRad, this.sliderMiddle + this.sldrRad + this.def.defFontSizePx * 1.2);

                // maximum label
                this.limitLabel = this.sldrMax.toFixed(0);
                if (this.sldrMax > 1 & this.sldrMax <= 10) {
                    this.limitLabel = this.sldrMax.toFixed(1);
                } else if (this.sldrMax <= 1) {
                    this.limitLabel = this.sldrMax.toFixed(2);
                }
                this.context.textAlign = "right";
                this.context.fillText(this.limitLabel, this.sliderEnd + this.sldrRad, this.sliderMiddle + this.sldrRad + this.def.defFontSizePx * 1.2);
            }

            // outline whole slider path
            this.context.strokeStyle = "rgb(128,128,128)";
            this.context.stroke();

            // create the gradient for the filled portion of the slider
            this.gradient = this.context.createLinearGradient(0, this.sliderMiddle - this.sldrRad, 0, this.sliderMiddle + this.sldrRad);
            this.gradient.addColorStop(0, "rgb(128,128,128)");
            this.gradient.addColorStop(0.5, "rgb(90,90,90)");
            this.gradient.addColorStop(1, "rgb(128,128,128)");

            // determine the current position from the current value
            this.relVal = (this.sldrVal - this.sldrMin) / (this.sldrMax - this.sldrMin); // where in the range is it.
            // now determine the position in pixes
            this.valPxl = (this.sliderEnd - this.sliderBegin) * this.relVal + this.sliderBegin;
            // use this to fill part of the slider

            //create the filled part of the slider to indicate the current value
            this.context.beginPath();
            this.context.arc(this.sliderBegin, this.sliderMiddle, this.sldrRad, Math.PI / 2, 3 * Math.PI / 2, false);
            this.context.lineTo(this.valPxl, this.sliderMiddle - this.sldrRad);
            this.context.lineTo(this.valPxl, this.sliderMiddle + this.sldrRad);
            this.context.closePath();

            // Fill with gradient the part of the slider below the current value
            this.context.fillStyle = this.gradient;
            this.context.fill();

            // now create the marker bar of the slider
            this.context.beginPath();
            // shape the marker
            this.context.arc(this.valPxl, this.sliderMiddle - this.sldrRad, this.sldrRad, 0, Math.PI, true); // top
            this.context.lineTo(this.valPxl - this.sldrRad, this.sliderMiddle + this.sldrRad); // left side
            this.context.arc(this.valPxl, this.sliderMiddle + this.sldrRad, this.sldrRad, Math.PI, 0, true); // bottom
            this.context.closePath();

            // draw the marker bar
            //		this.context.fillStyle="red";  // testing
            // create the gratient for the marker
            // alert(this.valPxl+" "+this.val);
            this.gradient = this.context.createRadialGradient(this.valPxl,
                this.sliderMiddle,
                0,
                this.valPxl,
                this.sliderMiddle,
                2 * this.sldrRad);
            this.gradient.addColorStop(0, "rgb(100,100,100)");
            this.gradient.addColorStop(1, "rgb(138,138,138)");
            this.context.fillStyle = this.gradient;
            this.context.fill();
            // now outline
            this.context.strokeStyle = "rgb(30,30,30)";
            this.context.stroke();
        }
        //alert("finished drawSlider showValue = "+this.showValue);

        if (this.sldrChange == true && window.CustomEvent) {
            // the slider has changed value, set up an event
            this.sldrChange = false;
            // create an event for the illustration to get the updated parameters
            this.sldrValChange = new CustomEvent(
                "onchange", {
                    detail: {
                        value: self.sldrVal,
                        time: window.performance.now(),
                    },
                    bubbles: true,
                    cancelable: true
                }
            );
            this.canvas.dispatchEvent(this.sldrValChange); // dispatch event the stimulus has been drawn
        }
    };

    // set up the event handlers
    //	it would be nice to set up keyboard handlers if possible
    //	this.canvas.onkeydown = function(event){
    //		alert("keypress");
    //	}
    // what to do changing slider values directly
    this.canvas.onmousedown = function(event) {
        this.event = event || window.event;
        if (self.doTrack) { // if allowing tracking
            // get location of click on canvas
            if (event.pageX || event.pageY) {
                this.x = this.event.pageX;
                this.y = this.event.pageY;
            } else {
                this.x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                this.y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            self.handleStart(this.x, this.y); // handle the mouse down actions.
        }
    };

    //does this work for dragging the slider?
    this.canvas.onmouseup = function(event) {
        this.event = event || window.event;
        clearInterval(self.moveVal); // clear timer (even if not pressed);

        if (self.doTrack) {
            // get location of click on canvas
            if (this.event.pageX || this.event.pageY) {
                this.x = this.event.pageX;
                this.y = this.event.pageY;
            } else {
                this.x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                this.y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            self.handleEnd(this.x, this.y);
        }
    };
    // mouse moving
    this.canvas.onmousemove = function(event) {
        if (self.mouseIsDown === true & self.doTrack) {
            this.event = event || window.event;

            // get location of click on canvas
            if (event.pageX || event.pageY) {
                this.x = this.event.pageX;
                this.y = this.event.pageY;
            } else {
                this.x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                this.y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            self.handleMove(this.x, this.y);
        }
    };

    this.canvas.onmouseout = function(event) { // stop tracking
        self.clearMouseButtons();
    };

    // touch listeners below
    // the beginning of the touch
    this.canvas.addEventListener('touchstart', function(event) { // use anonymous inner function as in an object
        event.preventDefault();
        if (self.doTrack) {
            //			event.preventDefault();

            // get the points on the screen that have been touched
            var touches = event.changedTouches;
            //			alert(touches.length+"  x of 0 = "+touches[0].pageX);
            self.handleStart(touches[0].pageX, touches[0].pageY);
        }
    }, false);

    this.canvas.addEventListener('touchend', function(event) {
        event.preventDefault();
        if (self.doTrack) {
            //			event.preventDefault();

            // get the points on the screen that have been touched
            var touches = event.changedTouches;
            //			alert(touches.length+"  x of 0 = "+touches[0].pageX);
            self.handleEnd(touches[0].pageX, touches[0].pageY);
        }
    }, false);

    this.canvas.addEventListener('touchmove', function(event) {
        event.preventDefault();
        if (self.doTrack) {
            //			event.preventDefault();

            // get the points on the screen that have been touched
            var touches = event.changedTouches;
            //			alert(touches.length+"  x of 0 = "+touches[0].pageX);
            self.handleMove(touches[0].pageX, touches[0].pageY);
        }
    }, false);

    this.handleStart = function(pageX, pageY) {
        this.clearMouseButtons();

        // grab the bound variables
        this.sM = this.getSliderMin(); // min value for slider
        this.sMx = this.getSliderMax(); // max value for slider
        this.sR = this.getSliderRad(); // radius of slider
        this.sB = this.getSliderBegin(); // x value of beginning of slider.
        this.sE = this.getSliderEnd(); // x value of end of slider
        this.sMd = this.getSliderMiddle(); // the middle of the slider in the y dimension
        this.mM = this.getMinusMin(); // minimum x pixel for minus mark
        this.mMx = this.getMinusMax(); // maximumx pixel for minus mark
        this.pM = this.getPlusMin(); // minimum x pixel for plus mark
        this.pMx = this.getPlusMax(); // maximum x pixel for plus mark
        this.sS = this.getSliderStep();

        this.x = pageX - canvas.offsetLeft - this.offsetLeft; // correct for page offsets
        this.y = pageY - canvas.offsetTop - this.offsetTop;

        // is it on the slider
        if (this.x >= this.sB & this.x <= this.sE) { // is horizontally over the slider
            if ((this.y >= this.sMd - (2 * this.sR)) & (this.y <= this.sMd + (2 * this.sR))) {
                // vertically close enough
                // convert x pixels to slider value
                this.sliderRange = this.sMx - this.sM; // range of slider values
                this.xPxl = this.x - this.sB; // how far from the beginning of the slider
                this.xRange = this.sE - this.sB; // the range of x values
                this.sV = (this.xPxl / this.xRange) * this.sliderRange + this.sM;
                this.setValue(this.sV);
                this.mouseIsDown = true;
                this.setPlusIsDown(false);
                this.setMinusIsDown(false);
                //				alert("new val = " + this.sV);
                //				this.setValue(this.sV);
            }
        } else if (this.x >= this.mM & this.x <= this.mMx) {
            this.setMinusIsDown(true);
            this.mouseIsDown = false;
            this.setPlusIsDown(false);
            this.sV = this.getValue(); // get the current value
            this.sV -= this.sS;
            this.setValue(this.sV);
        } else if (this.x >= this.pM & this.x <= this.pMx) {
            this.setPlusIsDown(true);
            this.setMinusIsDown(false);
            this.mouseIsDown = false;
            this.sV = this.getValue();
            this.sV += this.sS;
            this.setValue(this.sV);
        } else {
            this.clearMouseButtons();
            if (this.showButton) { // highlight the button as well.
                if (this.doneButton.isClickOverButton(this.x, this.y) & this.doneButton.buttonDrawn) {
                    this.doneButton.setButtonColors(this.doneButton.buttonPressed1, this.doneButton.buttonPressed2);
                }
            }
        }

        // check to see if need to highlight button
        this.drawSlider(); // update the slider
    }; // end handleStart

    this.handleEnd = function(pageX, pageY) {
        // clear the button presses
        this.mouseIsDown = false;
        this.setMinusIsDown(false);
        this.setPlusIsDown(false);

        // clear the done button if pressed
        if (this.showButton) { // highlight the button as well.
            if (this.doneButton.isClickOverButton(this.x, this.y) & this.doneButton.buttonDrawn) {
                this.doneButton.setButtonColors(this.doneButton.buttonNorm1, this.doneButton.buttonNorm2);
            }
        }

        // grab the bound variables
        this.sM = this.getSliderMin(); // minimum value for slider
        this.sMx = this.getSliderMax(); // maximum value for slider
        this.sS = this.getSliderStep(); // step size fo slider
        this.sR = this.getSliderRad(); // sliderRadius
        this.sB = this.getSliderBegin(); // x value of beginning of slider
        this.sE = this.getSliderEnd(); // x value of end of slider
        this.sMd = this.getSliderMiddle(); // the middle of the slider in the y dimension.
        this.mM = this.getMinusMin(); // the minimum x for minus sign
        this.mMx = this.getMinusMax(); // the maximum x for minus sign
        this.pM = this.getPlusMin(); // the minimum x for plus sign
        this.pMx = this.getPlusMax(); // the maximum x for plus sign
        //		alert("this.sliderMin() = "+this.pM);


        this.x = pageX - canvas.offsetLeft - this.offsetLeft; // correct for page offsets
        this.y = pageY - canvas.offsetTop - this.offsetTop;

        // is it on the slider
        if (this.x >= this.sB & this.x <= this.sE) { // is horizontally over the slider
            if ((this.y >= this.sMd - (2 * this.sR)) & (this.y <= this.sMd + (2 * this.sR))) {
                // vertically close enough
                // convert x pixels to slider value
                this.sliderRange = this.sMx - this.sM; // range of slider values
                this.xPxl = this.x - this.sB; // how far from the beginning of the slider
                this.xRange = this.sE - this.sB; // the range of x values
                this.sV = (this.xPxl / this.xRange) * this.sliderRange + this.sM;
            }
        }
        this.drawSlider();
    }; // end handleEnd

    this.handleMove = function(pageX, pageY) {
        // grab the bound variables
        this.sM = this.getSliderMin(); // min value for slider
        this.sMx = this.getSliderMax(); // max value for slider
        this.sR = this.getSliderRad(); // radius of slider
        this.sB = this.getSliderBegin(); // x value of beginning of slider.
        this.sE = this.getSliderEnd(); // x value of end of slider
        this.sMd = this.getSliderMiddle(); // the middle of the slider in the y dimension
        this.mM = this.getMinusMin(); // minimum x pixel for minus mark
        this.mMx = this.getMinusMax(); // maximumx pixel for minus mark
        this.pM = this.getPlusMin(); // minimum x pixel for plus mark
        this.pMx = this.getPlusMax(); // maximum x pixel for plus mark

        this.x = pageX - canvas.offsetLeft - this.offsetLeft; // correct for page offsets
        this.y = pageY - canvas.offsetTop - this.offsetTop;
        //			debug statements
        //			this.context = canvas.getContext("2d");  // the drawing context
        //			this.context.fillStyle = "rgb(250,0,0)";
        //			this.context.fillText(" x = "+this.x,40,20);
        //		this.context.fillStyle=this.def.defFontColor;
        //		this.context.fillText(this.label,0,3*this.height/4);

        // is it on the slider
        if (this.x >= this.sB & this.x <= this.sE) { // is horizontally over the slider
            if ((this.y >= this.sMd - (2 * this.sR)) & (this.y <= this.sMd + (2 * this.sR))) {
                // vertically close enough
                // convert x pixels to slider value
                this.sliderRange = this.sMx - this.sM; // range of slider values
                this.xPxl = this.x - this.sB; // how far from the beginning of the slider
                this.xRange = this.sE - this.sB; // the range of x values
                this.sV = (this.xPxl / this.xRange) * this.sliderRange + this.sM;
                this.setValue(this.sV);
                this.mouseIsDown = true;
            }
        }
        this.drawSlider(); // update the slider
    }; // end handleMove

    // parameters setters
    this.setShowValue = function(doShowValue) {
        if (doShowValue === true) {
            this.showValue = true;
        } else {
            this.showValue = false;
        }
        //		this.showValue = doShowValue;
        //alert("in showvalue = "+this.showValue);
        this.drawSlider();
    };

    this.setRange = function(minValue, maxValue) {
        this.sldrMin = minValue;
        this.sldrMax = maxValue;
        if (this.autoStep === true) {
            if (this.sldrMax > 10) {
                this.sliderStep = 1;
            } else if (this.sldrMax > 1 & this.sldrMax <= 10) {
                this.sliderStep = 0.1;
            } else if (this.sldrMax <= 1) {
                this.sliderStep = 0.01;
            }
        }
        this.drawSlider();
    };

    // set the slider step value
    this.setSliderStep = function(newStep) {
        if (newStep > 0) {
            this.sliderStep = newStep;
            this.autoStep = false;
        }
    };

    this.setShowMaxMin = function(showMaxMin) {
        if (showMaxMin === true) {
            this.showLimits = true;
        } else {
            this.showLimits = false;
        }
    };

    this.getValue = function() { //return the current value of your slider
        return this.sldrVal;
    };

    this.setPctWidth = function(percentWidth) {
        if (percentWidth >= 5 & percentWidth <= 100) { // check for liimits
            this.pctWidth = percentWidth; // percent of the inner width of browser for slider
            this.width = window.innerWidth * this.pctWidth / 100; // size of drawing area
            //alert("width pct = "+this.pctWidth+" width pix = "+this.width);
            this.drawSlider();
        }
    };

    // cancel slider tracking temporarily
    this.setDoTrack = function(trackFlag) {
        if (trackFlag === true) {
            this.doTrack = true;
        } else {
            this.doTrack = false;
        }
        this.drawSlider();
    };

    this.setEnable = function(trackFlag) {
        this.setDoTrack(trackFlag);
    };

    this.getEnable = function() {
        return this.doTrack;
    };

    this.clearMouseButtons = function() { // clear the mouse down buttons.
        this.mouseIsDown = false;
        this.PlusIsDown = false;
        this.minusIsDown = false;
    };
}

// create a set of three sliders to control each of the primary guns on a monitor
function ColorSlider(label, rdflt, gdflt, bdflt, paragraph, gunsToShow) {

    if (!(this instanceof ColorSlider)) { // make sure object is called correctly
        return new ColorSlider(label, rdflt, gdflt, bdflt, paragraph);
    }

    this.label = label;
    this.labelP = null; // the document object that holds the label
    this.r = null; // sliders for each of the three primary guns: red, green, blue
    this.g = null;
    this.b = null;
    this.paragraph = paragraph; // get the paragraph container
    // default values for the gun
    this.rVal = rdflt;
    this.gVal = gdflt;
    this.bVal = bdflt;
    this.lastMove = 2; // keep track of which slider to move using key updates.

    // flag to indicate if the gun is shown
    this.showR = true;
    this.showG = true;
    this.showB = true;

    // flag for if using the achromatic version of this color slider to allow switching
    // use the red slider but relabel
    this.acromatic = false; // this flag takes priority and will remove the g and b sliders.

    this.rCanvas = null; // the response canvases for the three guns so they can be used for event handing
    this.gCanvas = null;
    this.bCanvas = null;

    // general display flag
    this.showSlider = true;

    // tracking flags
    this.doTrack = true;

    // button related objects and parameters
    this.showButton = false;
    this.doneButton = null;

    // flag if the currently indicated color should be displayed
    this.showColor = false;
    var FULL = 95;
    var COLOR = 75;
    this.sliderWidth = FULL;
    this.timerColor = null; // timer to update a color patch to show the current color
    this.colorCanvas = null; // the drawing canvas for the color display patch

    // bind the slider to itself
    var self = this;

    // set up the sliders
    this.init = function() {
        // first remove all the current children of this node, if any.
        while (this.paragraph.hasChildNodes()) {
            this.paragraph.removeChild(this.paragraph.lastChild);
        }

        // create the paragraph for the document.
        this.labelP = document.createElement('p');
        this.paragraph.appendChild(this.labelP);

        // adjust what is shown based on if this is achromatic or not
        if (this.achromatic) {
            this.showR = true;
            this.showG = false;
            this.showB = false;
        }

        // if showing the current color, create a canvas here
        // append below at the proper place
        if (this.showColor) {
            this.colorCanvas = document.createElement('canvas');
            this.colorCanvas.width = window.innerWidth * 0.1; // fit at end of slider
        }

        // create the canvases for each of the sliders
        if (this.showR) {
            this.rCanvas = document.createElement('canvas');
            this.paragraph.appendChild(this.rCanvas);
            if (this.showColor) {
                this.paragraph.appendChild(this.colorCanvas);
            }
        }
        if (this.showG) {
            this.gCanvas = document.createElement('canvas');
            this.paragraph.appendChild(this.gCanvas);
            if (this.showColor & !this.showR) {
                this.paragraph.appendChild(this.colorCanvas);
            }
        }
        if (this.showB) {
            this.bCanvas = document.createElement('canvas');
            this.paragraph.appendChild(this.bCanvas);
            if (this.showColor & !this.showR & !this.showR) {
                this.paragraph.appendChild(this.colorCanvas);
            }
        }

        // create the different sliders
        if (this.showR) { // red gun slider
            this.r = null;
            var label = "R";
            if (this.achromatic) {
                label = "";
            }
            this.r = new Slider(label, this.rCanvas, this.sliderWidth);
            this.r.setSliderStep(1);
            this.r.setRange(0, 255);
            this.r.setShowMaxMin(false);
            this.r.setValue(this.rVal);
            if (this.achromatic) { // colors for achromatic slider
                this.r.background = colorString(0, 0, 0);
                this.r.foreground = colorString(255, 255, 255);
            } else { // colors for colored slider r gun
                this.r.background = colorString(100, 0, 0);
                this.r.foreground = colorString(255, 150, 150);
            }
            this.lastMove = 0; // red was last moved
            this.rCanvas.onclick = function(event){
                self.lastMove = 0;
            }
        }
        if (this.showG) { // green gun slider
            this.g = null;
            this.g = new Slider("G", this.gCanvas, this.sliderWidth);
            this.g.setSliderStep(1);
            this.g.setRange(0, 255);
            this.g.setShowMaxMin(false);
            this.g.background = colorString(0, 50, 0);
            this.g.foreground = colorString(150, 255, 150);
            this.g.setValue(this.gVal);
            this.lastMove = 1; // red was last move
            this.gCanvas.onclick = function(event){
                self.lastMove = 1;
            }
        }
        if (this.showB) { // blue gun slider
            this.b = null;
            this.b = new Slider("B", this.bCanvas, this.sliderWidth);
            this.b.setSliderStep(1);
            this.b.setRange(0, 255);
            this.b.setShowMaxMin(false);
            this.b.background = colorString(0, 0, 100);
            this.b.foreground = colorString(150, 200, 255);
            this.b.setValue(this.bVal);
            this.lastMove = 2;
            this.bCanvas.onclick = function(event){
                self.lastMove = 2;
            }
        }

        // if showing a color, set the interval
        if (this.showColor) {
            this.timerColor = setInterval(this.dispCurColor, 100);
        }
    };

    // function to call the individual drawSlider functions
    this.drawSlider = function() {
        if (this.showSlider) {
            var innerHTML = this.label;
            this.labelP.innerHTML = innerHTML;
        } else {
            this.labelP.innerHTML = "";
        }

        if (this.showR) {
            // send along the current display settings
            this.r.showSlider = this.showSlider;
            this.r.showButton = this.showButton; // set the button setting
            // can be accessed outside this object directly
            this.r.drawSlider();
            if (this.r.showButton) {
                this.doneButton = this.r.doneButton;
            } // assign the button to a local variable so it
        }
        if (this.showG) {
            // send along the current display settings
            this.g.showSlider = this.showSlider;
            if (!this.showR) {
                this.g.showButton = this.showButton;
            } // check to make sure r slider does not show the button
            else {
                this.g.showButton = false;
            } // just a check to make sure the button does not show up inopportunely
            this.g.drawSlider();
            if (this.g.showButton) {
                this.doneButton = this.g.doneButton;
            } // assign the button to a local variable so it
        }
        if (this.showB) {
            // send along the current display settings
            this.b.showSlider = this.showSlider;
            if (!this.showR & !this.showG) {
                this.b.showButton = this.showButton;
            } // check to make sure r and g sliders do not show the button
            else {
                this.b.showButton = false;
            } // just a check to make sure the button does not show up inopportunely
            this.b.drawSlider();
            if (this.b.showButton) {
                this.doneButton = this.b.doneButton;
            } // assign the button to a local variable so it
        }
    };

    // change to subtractive color sliders
    this.type = function(typeMix) {

        if (typeMix == true) { // true means additive
            this.r.label = "R";
            this.r.background = colorString(100, 0, 0);
            this.r.foreground = colorString(255, 150, 150);
            this.g.label = "G";
            this.g.background = colorString(0, 50, 0);
            this.g.foreground = colorString(150, 255, 150);
            this.b.label = "B";
            this.b.background = colorString(0, 0, 100);
            this.b.foreground = colorString(150, 200, 255);
        } else { // false means subtractive
            this.r.label = "C";
            this.r.background = colorString(0, 100, 100);
            this.r.foreground = colorString(150, 255, 255);
            this.g.label = "M";
            this.g.background = colorString(50, 00, 50);
            this.g.foreground = colorString(255, 150, 255);
            this.b.label = "Y";
            this.b.background = colorString(100, 100, 00);
            this.b.foreground = colorString(255, 255, 100);
        }

        this.drawSlider();
    };

    this.dispCurColor = function() {
        //		alert("showing the current color ");

        // first find the canvas height to set
        if (self.showR) {
            self.colorCanvas.height = self.r.canvas.height;
        } else if (self.showG) {
            self.colorCanvas.height = self.g.canvas.height;
        } else if (self.showB) {
            self.colorCanvas.height = self.b.canvas.height;
        }

        // get the drawing context
        var context = self.colorCanvas.getContext("2d");
        context.fillStyle = self.getColor();
        context.fillRect(10, 0, self.colorCanvas.width - 10, self.colorCanvas.height);
        // surround the color box with a black line
        context.strokeStyle = colorString(0, 0, 0);
        context.strokeWidth = 1;
        context.strokeRect(10, 0, self.colorCanvas.width - 10, self.colorCanvas.height);
        //			alert("should have drawn the rectangle height = "+context.fillStyle);
    };

    // setters and getters
    // setters
    // to do this as a color or achromatic slider
    this.setAchromatic = function(b) {
        if (b) {
            this.achromatic = true;
        } else {
            this.achromatic = false;
        }

        // re-init the slider
        this.init();
    };

    // set which guns are displayed
    this.setShowGuns = function(guns) {
        if (guns.length == 3) {
            // make sure an array is of the proper lengths
            this.showR = guns[0];
            this.showG = guns[1];
            this.showB = guns[2];
            if (this.achromatic) {
                this.showG = false; // control for an achromatic presentation
                this.showB = false;
            }
        }
    };

    // set the slider widths
    this.setPctWidth = function(percentWidth) {
        if (this.showR) {
            if (this.showColor) {
                this.r.setPctWidth(percentWidth * 85 / 100);
            } else {
                this.r.setPctWidth(percentWidth);
            }
        }
        if (this.showG) {
            if (this.showColor & this.showR == false) {
                this.g.setPctWidth(percentWidth * 85 / 100);
            } else {
                this.g.setPctWidth(percentWidth);
            }
        }
        if (this.showB) {
            if (this.showColor & this.showR == false & this.showG == false) {
                this.b.setPctWidth(percentWidth * 85 / 100);
            } else {
                this.b.setPctWidth(percentWidth);
            }
        }

        if (this.showColor) {
            this.colorCanvas.width = window.innerWidth * 0.15 * percentWidth / 100;
        }
    };

    // set the values on the guns
    this.setValue = function(guns) {
        //alert("r =  "+guns[0]+" g = "+guns[1]+" b = "+guns[2]);
        if (guns.length == 3) { // array length is proper
            this.rVal = guns[0];
            this.gVal = guns[1];
            this.bVal = guns[2];
            if (this.showR) {
                this.r.setValue(this.rVal);
                this.lastMove = 0;
            }
            if (this.showG) {
                this.g.setValue(this.gVal);
                this.lastMove = 1;
            }
            if (this.showB) {
                this.b.setValue(this.bVal);
                this.lastMove = 2;
            }

        }
    };

    this.stepUp =  function(){
        if (this.lastMove == 0){
            this.rVal ++;
            if (this.rVal > 255){
                this.rVal = 255;
            }
            this.r.setValue(this.rVal);
        }
        if (this.lastMove == 1){
            this.gVal ++;
            if (this.gVal > 255){
                this.gVal = 255;
            }
            this.g.setValue(this.gVal);
        }
        if (this.lastMove == 2){
            this.bVal ++;
            if (this.bVal > 255){
                this.bVal = 255;
            }
            this.b.setValue(this.bVal);
        }
    }

    this.stepDown = function(){
        if (this.lastMove == 0){
            this.rVal --;
            if (this.rVal < 0){
                this.rVal = 0;
            }
            this.r.setValue(this.rVal);
        }
        if (this.lastMove == 1){
            this.gVal --;
            if (this.gVal < 0){
                this.gVal = 0;
            }
            this.g.setValue(this.gVal);
        }
        if (this.lastMove == 2){
            this.bVal --;
            if (this.bVal < 0){
                this.bVal = 0;
            }
            this.b.setValue(this.bVal);
        }
    }

    // set the values on the guns by passing relative intensities
    this.setRelValue = function(guns) {
        //alert("r =  "+guns[0]+" g = "+guns[1]+" b = "+guns[2]);
        if (guns.length == 3) { // array length is proper
            this.rVal = Math.floor(guns[0] * 255);
            this.gVal = Math.floor(guns[1] * 255);
            this.bVal = Math.floor(guns[2] * 255);
            //            alert(this.rVal+" "+this.gVal+" "+this.bVal);
            if (this.showR) {
                this.r.setValue(this.rVal);
                this.lastMove = 0;
            }
            if (this.showG) {
                this.g.setValue(this.gVal);
                this.lastMove = 1;
            }
            if (this.showB) {
                this.b.setValue(this.bVal);
                this.lastMove = 2;
            }

        }
    };

    this.setR = function(rVal) { // set the rGun
        if (this.showR) {
            if (rVal >= 0 & rVal <= 255) {
                this.rVal = rVal;
                this.r.setValue(this.rVal);
                this.lastMove = 0;
            }
        }
    };
    this.setG = function(gVal) { // set the rGun
        if (this.showG) {
            if (gVal >= 0 & gVal <= 255) {
                this.gVal = gVal;
                this.g.setValue(this.gVal);
                this.lastMove = 1;
            }
        }
    };
    this.setB = function(bVal) { // set the rGun
        if (this.showB) {
            if (bVal >= 0 & bVal <= 255) {
                this.bVal = bVal;
                this.b.setValue(this.bVal);
                this.lastMove = 2;
            }
        }
    };
    this.setLum = function(lumVal) {
        if (this.achromatic) { // check to make sure it is in a chromatic mode
            if (lumVal >= 0 & lumVal <= 255) {
                this.rVal = lumVal;
                this.r.setValue(this.rVal);
                this.lastMove = 0;
            }
        } else { // if not use this function to set all guns to same value
            if (lumVal >= 0 & lumVal <= 255) { // make sure in range
                this.rVal = lumVal; // set the values
                this.gVal = lumVal;
                this.bVal = lumVal;
                if (this.showR) {
                    this.r.setValue(this.rVal);
                    this.lastMove = 0;
                } // apply to visible guns
                if (this.showG) {
                    this.g.setValue(this.gVal);
                    this.lastMove = 1;
                }
                if (this.showB) {
                    this.b.setValue(this.bVal);
                    this.lastMove = 2;
                }
            }
        }
    };

    // set the slider ranges
    this.setRange = function(min, max) {
        if (this.showR) {
            this.r.setRange(min, max);
        }
        if (this.showG) {
            this.g.setRange(min, max);
        }
        if (this.showB) {
            this.b.setRange(min, max);
        }
    };

    // set if max and min values are to be displayed
    this.setShowMaxMin = function(b) {
        if (this.showR) {
            this.r.setShowMaxMin(b);
        }
        if (this.showG) {
            this.g.setShowMaxMin(b);
        }
        if (this.showB) {
            this.b.setShowMaxMin(b);
        }
    };

    // do the sliders and if they track
    this.setDoTrack = function(b) {
        if (this.showR) {
            this.r.setDoTrack(b);
        }
        if (this.showG) {
            this.g.setDoTrack(b);
        }
        if (this.showB) {
            this.b.setDoTrack(b);
        }
        this.doTrack = b;
    };

    // set if the sliders shows the value
    this.setShowValue = function(b) {
        if (this.showR) {
            this.r.showValue = b;
        }
        if (this.showG) {
            this.g.showValue = b;
        }
        if (this.showB) {
            this.b.showValue = b;
        }
    };

    // set if a button is to be shown
    this.setShowButton = function(b) {
        if (this.showR) {
            this.r.showButton = b;
        } else if (this.showG) {
            this.g.showButton = b;
        } else if (this.showB) {
            this.b.showButton = b;
        }
        this.showButton = b;
        // only show one button, the top most of the RGB sliders that is shown
    };

    // set the slider button label
    this.setDoneLabel = function(label) {
        if (this.showR) {
            this.r.doneLabel = label;
        } else if (this.showG) {
            this.g.doneLabel = label;
        } else if (this.showB) {
            this.b.doneLabel = label;
        }
        // only show one button, the top most of the RGB sliders that is shown
    };

    // set if the color indicated by the slider is to be drawn
    this.setShowColor = function(b) {
        this.showColor = b;
        if (this.showColor) { // allow the color to be displayed
            this.sliderWidth = COLOR;
        } else { // do not display the color
            clearInterval(timerColor); // if running clear the timer Color timer
            this.sliderWidth = FULL;
        }
        this.init(); // reinitialize the slider objects.
    };


    // getters
    // return the current values as a color
    this.getColor = function() {
        // return the current color
        if (this.showR) {
            this.rVal = this.r.getValue();
            this.lastMove = 0;
        }
        if (this.showG) {
            this.gVal = this.g.getValue();
            this.lastMove = 1;
        }
        if (this.showB) {
            this.bVal = this.b.getValue();
            this.lastMove = 2;
        }
        var color = colorString(this.rVal, this.gVal, this.bVal);

        // if achromatic, just do r gun for all three guns
        if (this.achromatic) {
            color = colorString(this.rVal, this.rVal, this.rVal);
        }

        return color;
    };

    // return the current values as an array
    this.getValue = function() {
        this.values = [];
        this.i = 0; // index of array
        // add the red gun
        if (this.showR) {
            this.values[this.i] = this.r.getValue();
        } // is the red slider shown?
        else {
            this.values[this.i] = this.rVal;
        } // otherwise just give the current default value.

        this.i++; // increase i for next gun
        if (this.showG) {
            this.values[this.i] = this.g.getValue();
        } // the green slider shown?
        else {
            this.values[this.i] = this.gVal;
        } // otherwise just give the current default value.

        this.i++;
        if (this.showB) {
            this.values[this.i] = this.b.getValue();
        } // is the blue slider shown?
        else {
            this.values[this.i] = this.bVal;
        } // otherwise just give the current default value.

        // if achromatic, put r value in all positions
        if (this.achromatic) {
            for (var i = 0; i < 3; i++) {
                values[i] = this.r.getValue();
            }
        }

        return this.values;
    };

    // return the current values as an array of relative intensities
    this.getRelValue = function() {
        this.values = [];
        this.i = 0; // index of array
        // add the red gun
        if (this.showR) {
            this.values[this.i] = this.r.getValue() / 255;
        } // is the red slider shown?
        else {
            this.values[this.i] = this.rVal / 255;
        } // otherwise just give the current default value.

        this.i++; // increase i for next gun
        if (this.showG) {
            this.values[this.i] = this.g.getValue() / 255;
        } // the green slider shown?
        else {
            this.values[this.i] = this.gVal / 255;
        } // otherwise just give the current default value.

        this.i++;
        if (this.showB) {
            this.values[this.i] = this.b.getValue() / 255;
        } // is the blue slider shown?
        else {
            this.values[this.i] = this.bVal / 255;
        } // otherwise just give the current default value.

        // if achromatic, put r value in all positions
        if (this.achromatic) {
            for (var i = 0; i < 3; i++) {
                values[i] = this.r.getValue() / 255;
            }
        }

        return this.values;
    };

    // return the canvas that has the button
    this.getButtonCanvas = function() {
        var canvas = this.rCanvas;
        if (!this.showR) {
            canvas = this.gCanvas;
        }
        if (!this.showR & !this.showG) {
            canvas = this.bCanvas;
        }

        return canvas;
    };

    if (gunsToShow.length == 3) {
        this.setShowGuns(gunsToShow);
    } // indicate which guns will be visible

    this.init();
}
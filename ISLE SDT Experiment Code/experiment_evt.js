// global variables
// stimulus parameters
var def = new Defaults(); // default settings


// the experiment object
function Experiment(method, stimulus, expParam, expWindowID, results) {
    //alert("in experiment");
    // grab passed objects
    this.method = method; // the psychophysical method
    this.stimulus = stimulus; // the stimulus for the experiment
    this.expParam = expParam; // the parameters of this experiment what is the IV, etc.
    this.expWindowID = expWindowID; // the number of the tab that the experiment runs in.
    this.results = results; // the results display object
    this.expTab = Number(this.expWindowID.split("_")[1]); // the tab number of the experiment tab
    this.resTab = this.expTab + 1; // the tab number of the results tab both of these are to allow th experiment to switch automatically to result at the end
    this.controlIV = false; // flag to allow the parameters of the independent variable to be altered
    this.ivControlID; // this variable will hold the document id for the variable control
    this.ivName = stimulus.VARIABLES[expParam.methodIVIndex]; // the string with the name of the independent variable

    // convert this id to a integer to indicate the tab being used
    this.posUnder = this.expWindowID.lastIndexOf("_");
    this.tabNum = this.expWindowID.substr(this.posUnder + 1, 1);

    // condition variables to indicate the state of the experiment
    this.expStart = false; // has the experiment been started, false until space bar is pressed on experiment tab
    this.expDone = false; // has the experiment been complete, false until last trial - changed by experiment method object

    // object to deal with stimulus running a trial
    this.trialCheck; // timer to see if a trial has completed
    this.adjust = false; // is the data collection using a continuous adjustment during the trial.
    this.dataCheck; // see if the data has been cond.

    //alert("in experiment");

    // bind the object
    var self = this;

    // set everything to initial settings
    this.init = function() {
        // determine what variables are to be show on the stimulus setup screen
        //		var variablesToShow = [true,true,true];
        if (this.expParam.stimParam.length > 0) { // set the stimulus parameters if there are any
            this.stimulus.setStimParam(this.expParam.stimParam);
        }
        // after setting stimulus parameters which might impact exp variables to be allowed to adjust
        // then set what variables may be set up.
        this.stimulus.setVariablesShow(this.expParam.variablesToShow);
        // set stimulus screen to startup
        this.stimulus.setShowStartup(true);
        this.stimulus.redraw();
        this.stimulus.setShowStim(false); // for flashed stimuli always turn off stimulus.  If not flashed the start trial functions can
        // turn stimulus back on.

        // is there a response area
        if (this.expParam.respArea) {
            this.stimulus.outsideCanvasHeight = this.expParam.respCanvasHeight;
        }

        // now setup the experiment parameters
        this.method.setMethodParams(expParam.methodParam); // pass any parameters, if any to experiment.
        this.method.setupParameters(this.ivName);
        this.method.dvType = expParam.dvType;
        if (this.method.typeMethod == MOA) {
            if (expParam.dvType == PSE) {
                this.method.dataLabels = expParam.dataLabels; // if doing a Point of subjective equality experiment
                // using a method of adjustment (will change later to
                // include other methods) then send over data labels
                // for the data array from the experiment specific parameters
                // How to process the PSE data
                this.method.PSEtype = expParam.PSEtype;
            }
            //
            if (this.method.respType == MOA_COLOR) {
                this.method.dataLabels = expParam.dataLabels; // if doing a Point of subjective equality experiment
                this.method.respDimUse = expParam.colorSliderShow; // what guns on the color slider to show
            }
            if (this.method.respType == MOA_COLOR_WHEEL) {
                this.method.dataLabels = expParam.dataLabels; // pass data labels for colors
                this.method.respDimUse = expParam.colorSliderShow; // will change to what on the color wheel to show
            }
            //                alert("exp data labels "+expParam.dataLabels);
        };

        // set up the response area
        this.method.setupRespArea(stimulus.STIM_NAME);

        if (this.method.typeMethod == MAG_EST || this.method.typeMethod == SPAT_CUING || this.method.typeMethod == RT_ACC) {
            this.results.showResButton = false;
        } else {
            this.results.showResButton = true;
        };

        window.onresize = function() {
            // resize everything
            //		alert("window has changed size");
            self.stimulus.redraw();
            self.stimulus.redrawControls();
            self.method.drawRespArea();
            self.method.redrawControls();
            self.results.drawResults();
        };

        window.onkeydown = function(event) {
            // grab all key presses
            event.preventDefault();
            if (curTab == self.tabNum) {
                // cur tab comes from the tab making javascript routines.
                var unicode = event.keyCode ? event.keyCode : event.charCode; // determine the key that is pressed
                //				alert("key is pressed and experiment window is open "+unicode+"  "+ def.K_SPACE);
                if (unicode == def.K_SPACE & self.expStart == false) {
                    //					alert("spacebar pressed, exp window open, experiment not started");
                    self.startExp();
                } else if (self.expStart == true) {
                    // capture everything typed
                    if (self.method.showResp === true) { // only process if the response window is displayed
                        var resp = self.method.getKeyResponse(unicode);
                        //alert("there has been a click and the response  = "+resp);
                        if (resp) {
                            // there has been a valid response
                            //						alert("go on to next trial");
                            clearInterval(this.dataCheck);
                            self.startTrial(); // go to the next trial.
                        }
                    }
                } else {
                    stimulus.redraw();
                }
            } else {
                // capture everything typed
            }
        }; // end key press function

        // capture mouse clicks on experimental canvas
        this.stimulus.getCanvas().onclick = function(event) {
            this.event = event || window.event;
            var stimCanvas = self.stimulus.getCanvas();

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
            x -= self.stimulus.getCanvas().offsetLeft; // correct for page offsets
            y -= self.stimulus.getCanvas().offsetTop;

            //			alert("x = "+x+" y = "+y);

            // only check for start button if experiment has not started
            if (self.expStart == false) {
                //				alert("button click before experiment start");
                // find the location of the start button
                var startButton = self.stimulus.getStartButton();
                // see if click is inside the button
                if (self.stimulus.isStartButtonClicked(x, y)) {
                    self.startExp();
                }
            } else {
                // is there a stimulus response needed
                self.stimulus.checkClick(x, y);
            }
        };

        // touch version of stimulus canvas click
        this.stimulus.getCanvas().addEventListener('touchend', function(event) {
            event.preventDefault();

            var loc = new TouchLoc(event, self.stimulus.getCanvas());

            if (self.expStart == false) {
                var startbutton = self.stimulus.getStartButton();
                if (self.stimulus.isStartButtonClicked(loc.x, loc.y)) {
                    self.startExp();
                }
            } else {
                self.stimulus.checkClick(loc.x, loc.y);
            }
        });

        // capture when stimulus has been drawn
        this.stimulus.getCanvas().addEventListener('stimDrawn', function(event) {
            event.preventDefault();
            //            alert("event.detail.time " + event.detail.time);

            // check with methods need this type of information
            if (self.method.dvType == RT) {
                self.method.rtStart = event.detail.time;
            }
        }, false);

        // capture when to show the response panel
        this.stimulus.getCanvas().addEventListener("collectData", function(event) {
            if (event.detail.ready === true && self.method.showResp == false) {
                // check if the response window if visible because of Method of adjustment (at least freq discrim)
                self.collectResp();
            }
        }, false);

        this.method.getRespCanvas().addEventListener("valChange", function(event) {
            if (self.adjust) {
                // start a time to check the data if the method uses continuous adjustment
                // all seems ready to be event driven, except for this one.
                self.stimulus.setStimLevel(self.expParam.methodIVIndex, self.method.sldrIV.getValue());
                self.stimulus.redraw();
            }
        }, false);


        // setup the response controls
        this.method.getRespCanvas().onclick = function(event) {
                // only worry about the click if the response objects are being shown
                if (self.method.showResp === true) {
                    this.event = event || window.event;

                    // find out where the click is
                    var mRespCanvas = self.method.getRespCanvas();

                    var x, y;

                    // get location of click on canvas
                    if (event.pageX || event.pageY) {
                        x = this.event.pageX;
                        y = this.event.pageY;
                    } else {
                        x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                        y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                    }
                    x -= mRespCanvas.offsetLeft; // correct for page offsets
                    y -= mRespCanvas.offsetTop;

                    //alert("x = "+x+" y = "+y);
                    // now see if there is a response
                    var resp = self.method.getResponse(x, y);
                    //alert("there has been a click and the response  = "+resp);

                    if (resp) {
                        // there has been a valid response
                        //					alert("go on to next trial");
                        clearInterval(this.dataCheck);
                        self.startTrial(); // go to the next trial.
                    }
                } // end if the response objects are visible
            } // end  respCanvas onclick

        // do the respCanvas touch responses
        // the beginning of the touch
        this.method.getRespCanvas().addEventListener('touchstart', function(event) { // use anonymous inner function as in an object
            event.preventDefault();
            if (self.method.showResp === true) { // only worry if the button has been drawn

                // get the points on the screen that have been touched
                var touches = event.changedTouches;
                //	    		alert(touches.length+"  x of 0 = "+touches[0].pageX);
                var x = touches[0].pageX - self.method.getRespCanvas().offsetLeft; // correct for page offsets
                var y = touches[0].pageY - self.method.getRespCanvas().offsetTop;

                //                alert("x = " + x + " y = " + y);
                self.method.setRespCanvas(x, y);
            }
        }, false);

        this.method.getRespCanvas().addEventListener('touchend', function(event) {
            event.preventDefault();
            if (self.method.showResp === true) { // only worry if the button has been drawn
                //			alert("button mouseup");
                // get the points on the screen that have been touched
                var touches = event.changedTouches;
                //	    			alert(touches.length+"  x of 0 = "+touches[0].pageX);
                var x = touches[0].pageX - self.method.getRespCanvas().offsetLeft; // correct for page offsets
                var y = touches[0].pageY - self.method.getRespCanvas().offsetTop;

                // now see if there is a response
                var resp = self.method.getResponse(x, y);
                //alert("there has been a click and the response  = "+resp);

                if (resp) {
                    // there has been a valid response
                    //					alert("go on to next trial");
                    clearInterval(this.dataCheck);
                    self.startTrial(); // go to the next trial.
                }
            }
        }, false);

        // now do the results objects
        this.results.setupResults(this.expParam.dvType);
        this.results.dvUnit = this.expParam.dvUnit;
        this.results.dataLabels = this.method.dataLabels;
        //                        alert("data labels " +this.method.dataLabels);
        this.results.explanation = this.expParam.resultsExplanation;
        this.results.method = this.method.typeMethod;

        // conditional parameters
        if (this.method.typeMethod == MOCS) {
            // alert("MOCS");
            // scale the results on the y axis
            this.results.setYRange(0.0, 1.0);
        }
        if (this.method.typeMethod == ATTN_BLINK) {
            this.results.setYRange(0, 100);
            // set for percentage results.
        }
    }

    /**
     *if the experiment allows the values of the iv to be manipulated, it sends the
     * necessary information to the method to cause it to set it up in the place indicated
     * in the web page id
     */
    this.initIVControl = function(ivControlID) {
        this.ivControlID = ivControlID; // grab the id
        method.setupIVControl(this.ivControlID, this.expParam); // pass the document id and the experimental parametes object
        // to the method which will know what to do with a properly formated expParam object.
    }

    /*
     * this Method sets up the beginning of the experiment.
     */
    this.startExp = function() {
        //alert("starting experiment");
        // reset the flags
        this.expStart = true; // experiment has started
        this.expDone = false; // make sure know experiment is not done
        this.stimulus.setShowStartup(false); // turn off startup screen
        this.stimulus.holdParam(true); // freeze the settings
        this.method.holdParam(true); // freeze the settings
        this.method.stimName = this.stimulus.STIM_NAME;
        this.method.setShowResp(false);
        if (this.method.dvType == PSE) {
            this.method.standardVal = this.stimulus.getStandardVal();
        }
        //		this.method.setMethodParams(expParam.methodParam);  // pass any parameters, if any to experiment.
        this.method.initExp(); // call the method to set up the experiment
        if (this.method.typeMethod == MOA) {
            this.adjust = true;
        }
        if (this.method.typeMethod == MOCS) {
            // doing a method of constant stimuli experiment
            if (this.method.typeMOCS == this.method.FORCED_CHOICE) {
                this.stimulus.forcedChoice = true; // doing a forced choice
                this.stimulus.typeForcedChoice = this.method.typeFC; // the type of forced choice
                //				alert("forced choice = "+this.stimulus.forcedChoice+"  typeFC = "+this.stimulus.typeForcedChoice);
            }
        }
        if (this.method.typeMethod == MAG_EST) {
            this.stimulus.useModulus = true;
            this.stimulus.modText = this.method.getModulusText();
            this.stimulus.modVal = this.method.modValue;
        }
        // start the first trial of the experiment
        this.startTrial();
    }

    // trial initiation method
    this.startTrial = function() {
        //alert("getting a new IV level");
        this.method.clearRespCanvas();
        this.method.setShowResp(false); // hide the response values
        var ivValtmp = this.method.getIV_Val(); // get the next value of the IV to test -
        //if method of adjustment this is the staring value
        var ivVal;
        if (ivValtmp.length > 1) {
            ivVal = ivValtmp[0]; // forced choice so more than one value returned
        } else {
            ivVal = ivValtmp; // not forced choice so only one value being returned
        }

        if (this.method.lastTrial == true) { // this experiment is done
            this.stimulus.showClear = true;
            this.expDone = true;
            this.stimulus.redraw();
            //			alert("experiment is done and the threshold = "+this.method.getResult());

            // set the axes label
            this.results.yLabel = this.method.yLabel;
            this.results.xLabel = this.method.xLabel;

            data = this.method.getData(); // get the experimental data
            // set the threshold value
            this.results.setResultsVal(this.method.getResult());
            //alert("data = "+this.method.getData().length);
            if (this.method.typeMethod == MOA) {
                // set the results in the stimulus value
                if (this.method.dvType == PSE || this.method.dvType == COLOR_VAL) {
                    this.stimulus.setComparison(this.method.getFullComparison());
                    this.results.numLines = data[0].length - 1; // set the number of lines to plot to all that go over
                    if (this.results.numLines > 1) {
                        this.results.showLegend = true;
                    }
                    // all other methods only have one line at the moment.
                    //					this.stimulus.redraw();
                }
                // set the range
                this.results.setYRange(this.method.ivMin, this.method.ivMax);
            } else if (this.method.typeMethod == MOCS) {
                this.results.resultsLevel = this.method.thresholdVal;
            } else if (this.method.typeMethod == RT_ACC || this.method.typeMethod == ATTN_BLINK) {
                // need to develop this section to all both rt and accuracy to be displayed
                this.results.numLines = data[0].length - 1;
                if (this.results.numLines > 1) {
                    this.results.showLegend = true;
                }
            }

            // set the trial by trial data
            //            			alert("setting data"+" "+data.length+" "+data[0].length+" "+this.results.numLines);
            this.results.setData(data);
            //                        alert("Data Set"+" "+data.length+" "+data[0].length+" "+this.results.numLines);

            // change the active tab to the results tab
            changeTab(this.expTab, this.resTab);
        } else { // the experiment is not done
            if (this.method.typeMethod < SPAT_CUING) {
                this.stimulus.setStimLevel(expParam.methodIVIndex, ivVal);
            } else {
                this.stimulus.setStimLevel(expParam.methodIVIndex, ivValtmp);
            }
            if (this.method.typeMethod == MOCS) { // forced choice trial parameters
                // doing a method of constant stimuli experiment
                if (this.method.typeMOCS == this.method.FORCED_CHOICE) {
                    this.stimulus.fcParam = ivValtmp[1];
                    //				alert("forced choice = "+this.stimulus.forcedChoice+"  typeFC = "+this.stimulus.typeForcedChoice);
                }
            }
            // pressing of end of trial, particularly on sound stimuli experiment to clear sound path
            this.stimulus.startTrial();
        }
    }

    /**
     *Tells the experimental method, that the trial is over and that it is time to
     *  show the response objects and collect the data.
     */
    this.collectResp = function() {
        //		alert("I am ready to collect responses");
        this.method.setShowResp(true);
    }

    // check for resizing of window
    window.onresize = function() {
        //	drawColumns(canvas);
        //	alert("window resize");
    }

    // setup of the button listeners
    this.setupListener = function(idStimReset, idMethodReset) {
        var stimResetButton = document.getElementById(idStimReset);
        // setup the stimulus reset Listener
        stimResetButton.onclick = function() {
            //  			alert("reset button has been clicked");
            self.stimulus.reset();
        }

        // setup the method reset listener
        var methodResetButton = document.getElementById(idMethodReset);
        methodResetButton.onclick = function() {
            //  	  		alert("method reset button");
            self.method.reset();
        }
    }

    // send her buttons to create
    // listeners to start the new experiment
    this.setupNewExpListener = function(classNew) {
        var newExpButtons = document.getElementsByClassName(classNew);

        // now set up the listeners
        //alert("here");
        //alert("number of new exp buttons = "+newExpButtons.length);
        for (var i = 0; i < newExpButtons.length; i++) {
            newExpButtons[i].onclick = function() {
                self.newExperiment();
            }
        }
    }

    // reset so another experiment can be run.
    this.newExperiment = function() {
        if (this.expDone) {
            //			alert("resetting means something");
            // reset the flags
            this.expStart = false; // experiment has started
            this.expDone = false; // make sure know experiment is not done
            this.stimulus.setShowStartup(true); // turn off startup screen
            this.stimulus.holdParam(false); // freeze the settings
            this.method.holdParam(false); // freeze the settings
            this.method.setShowResp(false);
            this.results.dataReady = false;
            this.stimulus.redraw();
            this.results.drawResults();
            this.results.clearResultVal();
            this.results.showResultsVal = false;
            this.results.clearExpl();
        }
    }
}

window.onload = function() {
    // see if using tabs
    var useTabs = document.getElementById("useTabs");
    if (useTabs.value = "true") {
        pageSetup();
    }
}
// default values for the site (at least until I learn to pass CSS values to JavaScript)

function Defaults() {
    // the default font
    this.defFont = "13px Lucida Sans Unicode";
    this.defFontEm = "oblique 13px Lucida Sans Unicode";
    this.defFontSizePx = 13;
    this.defFontColor = "#333";
    this.defFont24 = "24px Lucida Sans Unicode";
    this.defFont22 = "22px Lucida Sans Unicode";
    this.defFont20 = "20px Lucida Sans Unicode";
    this.defFont18 = "18px Lucida Sans Unicode";
    this.defFont16 = "16px Lucida Sans Unicode";
    this.defFont14 = "14px Lucida Sans Unicode";
    this.defFont12 = "12px Lucida Sans Unicode";
    this.defFont10 = "10px Lucida Sans Unicode";
    this.defFont8 = "8px Lucida Sans Unicode";
    this.defFont14Bold = "bold 14px Lucida Sans Unicode";
    this.defFont16Bold = "bold 16px Lucida Sans Unicode";
    this.defFont18Bold = "bold 18px Lucida Sans Unicode";
    this.defFont20Bold = "bold 20px Lucida Sans Unicode";

    // defaults realated to sizes
    this.defProWidthFull = 0.98; // proportion of width for a canvas that fills the screen horizontally
    this.defProHeightFull = 1.00; // default proporition of height to fill browser window
    this.defProWidthConW = 0.65; // proportion of screen width if controls on side
    this.defProWidthConH = 0.65; // proportinof screen height if controls below.
    this.defGraphHeightPro = 0.8; // the default exctent of vertical screen available to use for a graph.

    // dimensional constants
    this.WIDTH = 0;
    this.HEIGHT = 1;

    // default colors
    this.defBackground = "rgb(255,255,255)";
    this.defForeground = "rgb(0,0,0)";
    this.defLine1Color = "rgb(100,100,255)";
    this.defLinesColors = [this.defLine1Color, "rgb(255,100,100)", "rgb(100,255,100)", "rgb(175,175,50)", "rgb(175,75,50)"];
    this.defLinesColors2 = ["rgb(175,75,50)", "rgb(175,175,50)", "rgb(100,255,100)", "rgb(255,100,100)", this.defLine1Color];
    this.defResultColor = "rgb(240,100,100)";
    this.WHITE = "rgb(255,255,255)";
    this.BLACK = "rgb(0,0,0)";

    // key press constants unicode values
    this.K_SPACE = 32;
    this.YES_KEY = 90;
    this.NO_KEY = 191;
    this.DEL = 46;
    this.BKSP = 8;
    this.LEFT_ARROW = 37;
    this.UP_ARROW = 38;
    this.RIGHT_ARROW = 39;
    this.DOWN_ARROW = 40;

    // response codes  for data files.
    this.YES = 1;
    this.NO = 0;
    this.LEFT = 1;
    this.RIGHT = 0;
    this.FIRST = 1;
    this.SECOND = 0;
}

// lab wide constants
// method constants
var MOL = 0;
var MOL_STR = "Method of Limits";
var MOCS = 1;
var MOCS_STR = "Method of Constant Stimuli";
var MOA = 2;
var MOA_STR = "Method of Adjustment";
var MAG_EST = 3;
var MAG_EST_STR = "Magnitude Estimation";
var SIG_DET = 4; // signal detection experiment
var SIG_DET_STR = "Signal Detection Experiment";
var SPAT_CUING = 5; // spatial cuing experiment
var SPAT_CUING_STR = "Spatial Cuing Experiment";
var RT_ACC = 6; // experiments measuring reaction time and accuracy
var RT_ACC_STR = "Reaction Time and Accuracy";
var ATTN_BLINK = 7; // experiment to measure attenional blink
var ATTN_BLINK_STR = "Attentional Blink";

var METHOD_NAMES = [MOL_STR, MOCS_STR, MOA_STR, MAG_EST_STR, SIG_DET_STR, SPAT_CUING_STR, RT_ACC_STR,
    ATTN_BLINK_STR
];

// MOA response values
var MOA_STD = 0; // method of adjustment standard slider response
var MOA_COLOR = 1; // method of adjustment use a color slider for the response
var MOA_COLOR_WHEEL = 2; //  method of adjustment but use a color wheel
var MOA_CIE = 3; // method of adjustment use a cie diagram -- not implmemented yet

// type of DV
var THRESHOLD = "threshold"; // threshold
var COLOR_VAL = "color"; // collect color values
var PSE = "PSE"; // point of subjective equality
var MEAN = 0; // how to process the PSE data, this average the dv value
var DIFFERENCE = 1; // this do a difference between standard and dv
var COLOR_DIST = 2; // distances between two color values
var SIG_DET_VALUES = ["hits", "misses", "false alarms", "correct rejections"];
var RT = "Reaction Time"; // collecting reaction time data and will collect accuracy as well
var PCT_CORRECT = "% Correct"; // collect accuracy data converted to percent correct

// constants for adding special features to a graph
var CONNECT_VAL = 0; // index draw a connector between different points
var CONNECT_MAX = 0; // if connecting make it a maximum of one line to maximum of another line
var CONNECT_PEAK = 6; // connect first two peaks of a cyclical wave
var OVERLAP = 1; // index of overlap for graph
var X_VAL = 2; // index of x value
var X_SCALE = 3; // index of how to scale the x value for plotting in a stimulus
var X_COLOR = 4; // index value of the parameter to change the color of the line showing the x value.
var HISTOGRAM = 5; // should the histogram be added to an x y scatter plot adding the collected xValues
var SAMP_LINE = 6; // the line that is being sampled for the histogram
var CLEAR_HIST = 7; // should  a data collection set be cleared in a histogram
var AREA_UNDER = 8; // highlight an area under the curve.
var AREA_ABOVE = 0; // fill in the area above the x value
var AREA_BELOW = 1; // fill in the area below the x value
var POS_DIAG = 9; // draw the positive diagonal
var SHOW_POINT = 10; // indicate a particular value on the graph
var LINE_COLOR = 11; // color of the first line
var SUP_DATA = 12; // supplemental data for extra table  wish I had a better way to do this.
var PEAK_HEIGHT = 13; // find the height from the 0 point to the peak height in a function that has a peak
var GRAPH_HEIGHT_PRO = 14; // proportion of the drawing area to be used for the the graph - height dimension
var GRAPH_WIDTH_PRO = 15; // proportion of the drawing area to be used for the the graph - width dimension
var MULTI_COLOR = -16; // each bar had a different color
var DO_RELATIVE = -17; // convert data to relative values to plot
var X_MAX_VAL = -18; // change the x max value

// bar graph special values
var HIDE_X_LABELS = 16;
var GRADIENT = 17;
var SHOW_X_VAL_ON_GRAPH = 18;
var SHOW_Y_LINE = 19;
var Y_LINE_COLOR = 20;

function xySpecialParam(typeExtra, showExtra, extraParam) {
    this.typeExtra = typeExtra;
    this.showExtra = showExtra;
    this.extraParam = extraParam;
}

// constants for plotting functions
var PLOT1FIRST = 0; // order of the two plots
var COLTITLE = 1; // column title of a table
var ROWTITLE = 2; // row title of a table
var COLHEADINGS = 3; // column headings of a table
var ROWHEADINGS = 4; // row headings of a table
var PLOT_SEC_POS = 5; // in secondary plot, where to put it
var BACKCOLORS = 6; // background colors in a table.
var PORT_WIDTH = 7; // width of canvas, percentage of browser width, for portrait layout
var PORT_HEIGHT = 8; // height of canvas, percentage of browser height, for portrait layout
var LAND_WIDTH = 9; // width of canvas, percentage of borwser width, for landscape layout
var LAND_HEIGHT = 10; // height of canvas, percentage of browser height, for landscape layout
var SQUARE_GRAPH = 11; // make the graph square on smaller axis of canvas
var SECOND_X = 12; // x axis label for a second graph being shown
var SECOND_Y = 13; // y axis lable for a second graph being shown
var SECOND_Y_RANGE = -14; // range for the y axis on the second graph being shown.
var SECOND_X_LABELS = -15; // for a bar graph the labels.
var SECOND_NUM_LINES = -16; // change the number of data sets in the second graph.
var SECOND_LEGEND = -17; // set the legend on the second graph
var SECOND_DATA = -18; // if the second data has some special conditions
var PASS_SECOND_DATA = -19; // pass an array for the second data.
var HIGHLIGHT_NOTE = -20; // on the musical scale when it is a second graph how to highlight a note

function SetupParam(typeSetup, setupParam) {
    this.typeSetup = typeSetup;
    this.setupParam = setupParam;
}

function IllusParam(typeParam, value) {
    this.typeParam = typeParam;
    this.value = value;
}

// constants to go above with physiological simulation values
var SHOW_CELLS = 14;
var STIM_TYPE = 15;
var MARKS = 21;

// row column designators.
var ROW = true;
var COL = false;

// constants associated with stimulus parameters for any stimulus, use negative numbers for these generic parameters
// first fixation
var FIX_WHEN = -1; // when should be the fixation mark be shown
var EVERY = -1; // at the beginning of every trial
var EVERY_ON = -4; // at the beginning of every trial and stays on NOT IMPLEMENTED
var FIRST = -2; // at the beginning of only the first trial
var NEVER = -3; // never show the fixation mark.

// how to send IV information to different objects
function DesignParam(name, numLevels, values, levelsUse, condParam, ioType, levelParam, shortName) {
    this.name = name;
    this.numLevels = numLevels;
    this.values = values;
    this.levelsUse = levelsUse;
    this.condParam = condParam;
    this.ioType = ioType;
    this.levelParam = levelParam;
    if (this.levelParam == null) {
        this.levelParam = [SELECT];
    }
    this.shortName = shortName;
    if (this.shortName == null){
        this.shortName = this.name;
    }
}
var NOT_USE = 0; // codes for levels of variable to use or not or if a condition parameter (a functional IV)
var USE = 1;
var ALL = 2; // simple code to don't have to write use over and over;
var MATCH = 3; // use the same levels and values as IV indicated next (it will be position in array);
var CHECK = 0; // this is default to use checkboxes for selecting levels. It does not need to be specified
var RADIO = 1; // for variables that are not condition parameters, and only one value can be checked, can use radio buttons
var CALC_LEVELS = 3; // use the information in this variable to determine the IV levels.
var SELECT = 4; // use the selected values
var INCLUDE_BOTH = 0; // if in determining levels, include both top and bottom values
var BOTH_NEXT = 10; // if in determining levels, pick the min and max from next two items in IV array and include both.
var REQUIRED = 5; // use all of the levels and do not allow user to chose
var SLIDER = 6; // use a slider to set the variable level.  Like Radio in that item is just one level that can be selected
var MIN = 0; // positions in the levels array for this information for sliders
var MAX = 1; // values to pass to slider
var DEF = 2; // default slider value
var STEP = 3;

function StimParam(type, value, extra) {
    this.type = type; // type of stimulus parameter
    this.value = value; // the main values association with the parameter
    this.extra = extra; // any extra information needed for this stimulus information
    //    this.param = param;  // needed for qualification, not implemented at present, as is true of so much of this
}

var ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// indexes for stimulus settings
var VAR_LABEL = 0;
var VAR_VALUE = 1;

function DefaultVal(name, defVal) { // set a default value in an experiment
    this.name = name;
    this.defVal = defVal;
}
var NUM_TRIALS = 1; // set the default number of trials per condition

function DV_Param(name, type, principle) {
    this.name = name;
    this.type = type;
    this.principle = principle; // flag if more than one this indicates if the primary DV for graphing
}
// constants for the type variable of DV
var NOMINAL = 0;
var ORDINAL = 1;
var INTERVAL = 2;
var RATIO = 3;
var ACCURACY = 4; // a special type of ratio data
var STAIRCASE_SPAN = 5; // another special type of ratio data
var PCT_CORRECT_DV = 6; // another type of ratio data.  It seems I am more interested in these specifics, but let us see.
var RATIO_NEG = 3.5; // a ratio variable but with a 0 that could be in the middle of the graph.

// send instructions to ploting about variation in plotting (might use this to replace the xySpecialParam)
function Plot_Param(type, vals) {
    this.type = type;
    this.vals = vals;
}
// constants for type of plot param
var DV_TOGETHER = 1; // plot the dv together/  The values indicate the labels for the different DV to show up on graph.

function MethodParam(type, value) {
    this.type = type;
    this.value = value;
}
// constants for method parameters, negative values refer to parameters that all methods might share.
var INSTRUCT = -1;
var RESP_SCR_INSTRUCT = -2;
var DO_BLOCK = -3;

// parameters that relate to a particular experiment and can go to either method or stimulus
function ExpParam(type, value) {
    this.type = type;
    this.value = value;
}
var EXP_ID_IDX = 1; // the method param that holds the number indicating the experiment
var STROOP = 1; // the experiment id for the stroop experiment

function ShowHide(element, control, baseText, visPtr, hidPtr, rowCol, contentId) {
    // element is the DOM element that is to be shown or hid
    // control is the DOM element that is clicked or touched to control the element.
    this.e = document.getElementById(element);
    this.con = document.getElementById(control);
    this.base = baseText; // the text that goes in the area.
    this.vis = visPtr; // unicode for the pointer when the element is visible
    this.hid = hidPtr; // unicode for the pointer when the element is hidden
    this.rowCol = rowCol; // flag for ir removing a row or a column.  True = row.
    this.ROW = ROW;
    this.bShow = true;
    this.contentId = contentId; // the id for the content iframe
    // change pointers to single an active element
    this.con.style.cursor = "pointer";

    // set some sizes
    if (this.rowCol === ROW) {
        this.e.style.height = "0px";
        this.con.height = "52px";
    } else {
        this.e.style.width = "224px";
        this.con.style.width = "46px";
    }

    // bind
    var self = this;

    // show hide elements
    // supposed cross brower version of show/hide
    // xTableRowDisplay r1, Copyright 2004-2007 Michael Foster (Cross-Browser.com)
    // Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
    //modified by John H. Krantz
    this.xTableRowDisplay = function(bShow, el) {
        var nRow = 0;

        //      sec = xGetElementById(sec);
        if (el && nRow < el.rows.length) {
            el.rows[nRow].style.display = bShow ? '' : 'none';
        }
        var claimed = 120 + 52; // values for banner and title
        if (!bShow) {
            this.e.style.height = "0px";
            claimed = 120 + 52;
        } else {
            this.e.style.height = "0px";
        }
        sizeFrame(self.contentId, self.rowCol, claimed); // resize the iframe
    };
    // above modified for columns (cells)
    this.xTableColDisplay = function(bShow, el) {

        el.style.display = bShow ? '' : 'none';
        var claimed = 224 + 46; // values for banner and title
        if (!bShow) {
            claimed = 120 + 46;
        }

        sizeFrame(self.contentId, self.rowCol, claimed); // resize the iframe
    };

    this.showHide = function(el, con, base, vis, hid, rc) {

        // el = element to show and hid
        // con = element that controls showing and hiding
        // base = base text to show in con area.
        // vis.  symbol to shown when visible
        // hid = symbol for when el is hidden
        // rc = doing a row or a column?

        // rows
        if (rc === self.ROW) {
            if (el.rows[0].style.display === 'none') {
                //  el.style.visibility = "collapse";
                self.bShow = true;
                self.xTableRowDisplay(self.bShow, el);
                con.innerHTML = vis + base;
            } else {
                //el.style.visibility = "visible";
                self.bShow = false;
                self.xTableRowDisplay(self.bShow, el);
                con.innerHTML = hid + base;
            }

        } else { // columns
            if (el.style.display === 'none') {
                self.bShow = true;
                self.xTableColDisplay(self.bShow, el);
                con.innerHTML = base + vis + base;
            } else {
                //el.style.visibility = "visible";
                self.bShow = false;
                self.xTableColDisplay(self.bShow, el);
                con.innerHTML = base + hid + base;
            }
            //    document.getElementById("myP").style.visibility = "hidden";
        }
    };

    // listeners (touch and click)
    this.con.onclick = function() {
        self.showHide(self.e, self.con, self.base, self.vis, self.hid, self.rowCol);
        //        self.xTableRowDisplay(false, self.e);
    }
    this.con.addEventListener('touchend', function(event) {
        event.preventDefault();
        self.showHide(self.e, self.con, self.base, self.vis, self.hid, self.rowCol);
    }, false);
}

// resize the iframe window to screen availability
function sizeFrame(contentId, rowCol, claimed) {

    this.contentFrame = document.getElementById(contentId); // resize the content screen area
    this.rowCol = rowCol; // changing row or column
    this.claimed = claimed; // current area taken up
    // bind
    var self = this;

    // extract the information we want from the html so
    this.iframeTag = this.contentFrame.getElementsByTagName('iframe');
    this.frameW = this.iframeTag[0].getAttribute("width");
    this.frameH = this.iframeTag[0].getAttribute("height");
    //    alert(this.iframeTag.length + " " + this.frameW + " " + this.frameH);

    if (this.rowCol === ROW) { // ajust height
        //        alert("looking at height " + claimed);
        this.frameH = window.innerHeight - claimed;
        this.iframeTag[0].setAttribute("height", this.frameH);

    } else { // adjust width
        //        alert("looking at width " + claimed);
        this.frameW = window.innerWidth - claimed;
        this.iframeTag[0].setAttribute("width", this.frameW);
    }
    //    alert(this.iframeTag.length + " " + this.frameW + " " + this.frameH);

}

function arrayIsEqual(array1, array2) {
    this.same = true; // default to true

    if (array1.length != array2.length) { // check to see the main dimensions match first
        this.same = false;
    } else {
        for (this.i = 0; this.i < array1.length; this.i ++) {
            if (array1[this.i].length != array2[this.i].length){ // sech to see second dimension matches
                this.same = false;
            } else {
                // now compare items
                for (this.j = 0; this.j < array1[this.i].length; this.j ++){
                    if (array1[this.i][this.j] != array2[this.i][this.j]){
                        this.same = false;
                    }
                }
            }
        }
    }
    return this.same;
}

function transferArrayElements2d(arrayNew){
    var arrayOld = [];
    for (this.i = 0; this.i < arrayNew.length; this.i ++){
        arrayOld[this.i] = [];
        for (this.j = 0; this.j < arrayNew[this.i].length; this.j ++){
            arrayOld[this.i][this.j] = arrayNew[this.i][this.j];
        }
    }

    return arrayOld;
}

// information for later

//    U+25B2 (Black up-pointing triangle ▲)
//   U+25BC (Black down-pointing triangle ▼)
//    U+25C0 (Black left-pointing triangle ◀)
//    U+25B6 (Black right-pointing triangle ▶)

// find mouse event location
function MouseLoc(event, canvas) {
    this.event = event || window.event;

    this.x = 0; // x and y values of the click
    this.y = 0;

    // get location of click on canvas
    if (event.pageX || event.pageY) {
        this.x = this.event.pageX;
        this.y = this.event.pageY;
    } else {
        this.x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        this.y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    this.x -= canvas.offsetLeft; // correct for page offsets
    this.y -= canvas.offsetTop;

    //    alert("x " + this.x + " y " + this.y + " offL " + canvas.offsetLeft + " offR " + canvas.offsetTop);
}
// find location of a touch in a canvas
function TouchLoc(event, canvas) {

    this.x = event.changedTouches[0].pageX; // x and y values of the click
    this.y = event.changedTouches[0].pageY;

    this.x -= canvas.offsetLeft; // correct for page offsets
    this.y -= canvas.offsetTop;
}

function TimeNow() {
    var d = new Date(),
        h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
        m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
        s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds(),
        ms = (d.getMilliseconds() < 100 ? '0' : '') + (d.getMilliseconds() < 10 ? '0' : '') + d.getMilliseconds();
    var curTime = h + ':' + m + ':' + s + "." + ms;
    return curTime;
}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
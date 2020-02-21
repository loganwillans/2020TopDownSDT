var RED = 0;
var GREEN = 1;
var BLUE = 2;
var ALPHA = 3;

function colorString(rVal, gVal, bVal) {
    var colorString = "rgb(0,0,0)"; // default value
    if (rVal >= 0 & rVal <= 255 & gVal >= 0 & gVal <= 255 & bVal >= 0 & bVal <= 255) {
        colorString = 'rgb(' + rVal + ',' + gVal + ',' + bVal + ')';
    }
    return colorString;
}

function colorStringAlpha(rVal, gVal, bVal, alpha) {
    var colorString = "black"; // default value
    if (rVal >= 0 & rVal <= 255 & gVal >= 0 & gVal <= 255 & bVal >= 0 & bVal <= 255 & alpha >= 0 & alpha <= 1.0) {
        colorString = 'rgba(' + rVal + ',' + gVal + ',' + bVal + ',' + alpha + ')';
    }
    return colorString;
}

function grayLevel(level) {
    return (colorString(level, level, level));
}

// create a color from an array
function colorStringArray(values) {
    var colorString = "black";

    var s = "rgb(";
    var goodString = true;
    if (values.length == 3) {
        for (var i = 0; i < 3; i++) {
            if (values[i] >= 0 & values[i] <= 255) {
                s += values[i];
                if (i < 2) {
                    s += ",";
                }
            } else {
                goodString = false;
            }
        } // add all the values
    } // no alpha given
    else if (values.length == 4) {
        for (var i = 0; i < 3; i++) {
            if (values[i] >= 0 & values[i] <= 255) {
                s += values[i];
                s += ",";
            } else {
                goodString = false;
            }
        } // add all the color values
        // now add alpha
        if (values[3] >= 0 & values[3] <= 1.0) {
            s += values[3];
        } else {
            goodString = false;
        }
    }
    // test the string
    if (goodString) {
        s += ")";
        colorString = s;
    }

    return colorString;
}

// return an array of color values from a color string
function colorVal(colorString) {
    var subColorString = colorString.split(",");

    this.r = parseInt(subColorString[0].substr(subColorString[0].indexOf("(") + 1, 3));
    this.g = parseInt(subColorString[1]);
    if (subColorString.length == 3) { // no alpha
        this.b = parseInt(subColorString[2].substring(0, subColorString[2].indexOf(")")));
    } else {
        // there is alpha
        this.b = parseInt(subColorString[2]);
        this.a = Number(subColorString[3].substring(0, subColorString[3].indexOf(")")));
    }

    var colorVals = [this.r, this.g, this.b];
    if (subColorString.length == 4) {
        // there is alpha
        colorVals[3] = this.a;
    }

    return colorVals;
}

function colorDistString(color1, color2) {
    this.val1 = colorVal(color1);
    this.val2 = colorVal(color2);

    // determine distanceson each gun
    this.distSq = []; // square distances on each gun
    for (this.i = 0; this.i < this.val1.length; this.i++) {
        this.distSq[this.i] = (this.val1[this.i] - this.val2[this.i]) * (this.val1[this.i] - this.val2[this.i]);
    }

    // sum the elements
    this.distSumSq = this.distSq[RED] + this.distSq[GREEN] + this.distSq[BLUE];

    return Math.sqrt(this.distSumSq); // return the square root of the sum.
}

// create a complementary color from an array of values
function complementArray(colorVal) {
    this.complement = [];

    for (var i = 0; i < colorVal.length; i++) {
        this.complement[i] = 255 - colorVal[i];
    }

    return this.complement;
}

// create a complementary color from a string  return a string
function complementString(colorString) {
    this.colorVals = colorVal(colorString); // convert to values
    this.compVals = complementArray(this.colorVals); // get the complement

    return colorStringArray(this.compVals);
}

function colorHex(colorString) {
    this.colorVals = colorVal(colorString); // conver to values
    // convert to hex format
    var outString = "#" + this.colorVals[0].toString(16) + this.colorVals[1].toString(16) + this.colorVals[2].toString(16);

    // if alpha add the alpha value to the hex
    if (this.colorVals.length == 4) {
        alpha = Math.floor(255 * this.colorVals[3]);

        outString += alpha.toString(16);
    }
    return outString;
}

function addAlphaToString(colorString, alphaVal) {
    this.colorVals = colorVal(colorString);

    return colorStringAlpha(this.colorVals[0], this.colorVals[1], this.colorVals[2], alphaVal);
}

function opacity(over, back, alpha) {
    var out = 0;
    if (alpha >= 0 && alpha <= 1.0) { // make sure alpha is in range
        out = alpha * over + (1 - alpha) * back;
    }

    return out;
}

function opacityColor(colorStringOver, colorStringBack, alpha) {
    var colorVals = colorVal(colorStringOver);

    var backVals = colorVal(colorStringBack);

    outVals = [];
    for (var i = 0; i < 3; i++) {
        // get new values for each color
        outVals[i] = opacity(colorVals[i], backVals[i], alpha);
    }

    return colorStringArray(outVals);
}
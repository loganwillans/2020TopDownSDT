// a drawing library as an object
function Draw(canvas) {
    this.canvas = canvas; // drawing canvas
    this.context = this.canvas.getContext("2d"); // drawing context
    this.buttonStyle = colorString(255, 0, 0); // button style
    this.buttonColor1 = colorString(50, 50, 150);
    this.buttonColor2 = colorString(100, 100, 200);
    this.background = colorString(255, 255, 255);
    this.foreground = colorString(255, 0, 0); // drawing color
    this.strokeWidth = 1; // draw stroke width
    this.def = new Defaults(); // defaults
    this.font = this.def.defFont;

    // button constants
    var X = 0; // indexes in button array
    var Y = 1;
    var W = 2;
    var H = 3;

    // indexes of the contact points on text filled rectangles
    this.TOP = 0;
    this.RIGHT = 1;
    this.BOT = 2;
    this.LEFT = 3;

    // clear the current canvas.
    this.clear = function() {
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // drawing graphical methods
    /**
     *draw a simple straight line
     */
    this.line = function(x1, y1, x2, y2) {
        // start the path
        this.context.beginPath();

        // move to the first endpoint
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2); // line to the second end point

        // set the drawing parameters and draw
        this.context.lineWidth = this.strokeWidth;
        this.context.strokeStyle = this.foreground;
        this.context.stroke();
    };

    this.linePt = function(pt1, pt2) {
        // start the path
        this.line(pt1.x, pt1.y, pt2.x, pt2.y);
    };

    //methods related to circles
    //  draw a simple circle, don't draw just pass back so can be drawn or stroked by calling object
    this.circle = function(xCtr, yCtr, radius) {
        // variable that is a path
        this.context.beginPath();
        this.context.arc(xCtr, yCtr, radius, 0, 2 * Math.PI);
    };

    // draw an arc with degree values if more convenient
    this.arcDeg = function(xCtr, yCtr, radius, startAngle, endAngle) {
        this.sA = Math.PI * startAngle / 180;
        this.eA = Math.PI * endAngle / 180;
        this.context.beginPath();
        this.context.arc(xCtr, yCtr, radius, this.sA, this.eA);
    }

    this.wedge = function(xCtr, yCtr, radius, startRad, endRad, clockwise) {
        this.context.beginPath();
        this.context.moveTo(xCtr, yCtr);
        this.context.arc(xCtr, yCtr, radius, startRad, endRad, clockwise);
        this.context.closePath();
    }
    this.wedgeDeg = function(xCtr, yCtr, radius, startDeg, endDeg, clockwise) {
        this.startRad = startDeg * Math.PI / 180;
        this.endRad = endDeg * Math.PI / 180;
        this.wedge(xCtr, yCtr, radius, this.startRad, this.endRad, clockwise);
    }

    // does the circle contain another coordinate
    this.circleContainsPoint = function(xCtr, yCtr, radius, xVal, yVal) {
        var inside = false;

        // determine how far the point is from the center
        var dist = Math.sqrt((xVal - xCtr) * (xVal - xCtr) + (yVal - yCtr) * (yVal - yCtr));
        if (dist < radius) {
            inside = true;
        } // if radius is greater than the distance from the center,
        // the circle contains the point.
        return inside; // return what you found
    };

    // identify a point on a circles edge given a angle factor
    this.circleAnglePoint = function(angle, diam, xCtr, yCtr) {
        var radius = diam / 2;

        var x = radius * Math.cos(angle * Math.PI / 180) + xCtr;
        var y = radius * Math.sin(angle * Math.PI / 180) + yCtr;
        //alert("x = "+x+" y = "+y+" "+yCtr);  // leave this till I know this is correct

        var position = [x, y];
        return position;
    };

    // methods related to ellipses
    this.ellipse = function(xCtr, yCtr, width, height) {
        // create ellipse drawing function
        // determine the length of the two axes
        var xRad = width / 2; // the axes of the ellipse, the longer is the major axis,
        var yRad = height / 2; // the smaller is the minor axis.
        this.context.beginPath();

        // move to the top of the ellipse
        this.context.moveTo(xCtr, yCtr - yRad);

        // square the two radio to same some time
        var xR2 = Math.pow(xRad, 2);
        var yR2 = Math.pow(yRad, 2);

        // draw Right side of Ellipse
        var yStep = 1; // how var to change y for each new stop point
        for (var y = -yRad; y <= yRad; y += yStep) {
            var xOff = Math.sqrt(xR2 - ((Math.pow(y, 2) * xR2) / yR2));
            this.context.lineTo(xCtr + xOff, yCtr + y);
        }

        // now draw the left side of the ellipse
        for (var y = yRad; y >= -yRad; y -= yStep) {
            var xOff = Math.sqrt(xR2 - ((Math.pow(y, 2) * xR2) / yR2));
            this.context.lineTo(xCtr - xOff, yCtr + y);
        }
        this.context.closePath();
    }

    this.ellipseXFlat = function(xCtr, yCtr, width, height, xOff) {
        // still need to figure this out.
        // create ellipse drawing function
        // determine the length of the two axes
        var xRad = width / 2; // the axes of the ellipse, the longer is the major axis,
        var yRad = height / 2; // the smaller is the minor axis.
        this.context.beginPath();

        // move to the top of the ellipse
        this.context.moveTo(xCtr, yCtr - yRad);

        // square the two radio to same some time
        var xR2 = Math.pow(xRad, 2);
        var yR2 = Math.pow(yRad, 2);

        // draw Right side of Ellipse
        var yStep = 1; // how var to change y for each new stop point
        for (var y = -yRad; y <= yRad; y += yStep) {
            var xOff = Math.sqrt(xR2 - ((Math.pow(y, 2) * xR2) / yR2));
            this.context.lineTo(xCtr + xOff, yCtr + y);
        }

        // now draw the left side of the ellipse
        for (var y = yRad; y >= -yRad; y -= yStep) {
            var xOff = Math.sqrt(xR2 - ((Math.pow(y, 2) * xR2) / yR2));
            this.context.lineTo(xCtr - xOff, yCtr + y);
        }
        this.context.closePath();
    }

    // draw a part of an ellipse
    this.ellipseHalf = function(xCtr, yCtr, width, height, right) {
        // create ellipse drawing function
        // determine the length of the two axes
        var xRad = width / 2; // the axes of the ellipse, the longer is the major axis,
        var yRad = height / 2; // the smaller is the minor axis.
        this.side = right; // which side of the ellipse to draw
        this.context.beginPath();

        // move to the top of the ellipse
        this.context.moveTo(xCtr, yCtr - yRad);

        // square the two radio to same some time
        var xR2 = Math.pow(xRad, 2);
        var yR2 = Math.pow(yRad, 2);

        // draw Right side of Ellipse
        var yStep = 1; // how var to change y for each new stop point

        if (this.side) {
            for (var y = -yRad; y <= yRad; y += yStep) {
                var xOff = Math.sqrt(xR2 - ((Math.pow(y, 2) * xR2) / yR2));
                this.context.lineTo(xCtr + xOff, yCtr + y);
            }
        } else {
            // now draw the left side of the ellipse
            for (var y = yRad; y >= -yRad; y -= yStep) {
                var xOff = Math.sqrt(xR2 - ((Math.pow(y, 2) * xR2) / yR2));
                this.context.lineTo(xCtr - xOff, yCtr + y);
            }
        }

        this.context.lineTo(xCtr, yCtr + yRad);

    }

    // replicates the canvas arc function
    this.arc = function(x, y, r, sDeg, eDeg, counterclockwise) {
        // convert angles to radians
        var sAngle = sDeg * Math.PI / 180;
        var eAngle = eDeg * Math.PI / 180;
        this.context.beginPath();
        this.context.arc(x, y, r, sAngle, eAngle, counterclockwise);
        this.context.closePath();
    }
    this.arcCon = function(x, y, r, sDeg, eDeg, counterclockwise) {
        // convert angles to radians
        var sAngle = sDeg * Math.PI / 180;
        var eAngle = eDeg * Math.PI / 180;
        this.context.arc(x, y, r, sAngle, eAngle, counterclockwise);
    }

    //  stroke a simple square
    this.strokeSquareCtr = function(xCtr, yCtr, width) {
        // variable that is a path
        // set the drawing parameters and draw
        this.context.lineWidth = this.strokeWidth;
        this.context.strokeStyle = this.foreground;
        this.context.strokeRect(xCtr - width / 2, yCtr - width / 2, width, width);
    };

    //  fill a simple square
    this.fillSquareCtr = function(xCtr, yCtr, width) {
        // variable that is a path
        // set the drawing parameters and draw
        this.context.fillStyle = this.foreground;
        this.context.fillRect(xCtr - width / 2, yCtr - width / 2, width, width);
    };

    //  stroke a simple rectangle
    this.strokeRectCtr = function(xCtr, yCtr, width, height) {
        // variable that is a path
        // set the drawing parameters and draw
        this.context.strokeWidth = this.lineWidth;
        this.context.strokeStyle = this.foreground;
        this.context.strokeRect(xCtr - width / 2, yCtr - height / 2, width, height);
    };

    //  fill a simple rect
    this.fillRectCtr = function(xCtr, yCtr, width, height) {
        // variable that is a path
        // set the drawing parameters and draw
        this.context.fillStyle = this.foreground;
        this.context.fillRect(xCtr - width / 2, yCtr - height / 2, width, height);
    };

    this.triangleFromApex = function(apexX, apexY, w, h, dir) {
        this.apexX = apexX;
        this.apexY = apexY; // position of the apex
        this.w = w; // width of triangle
        this.h = h; // height of triangle
        this.dir = dir; // direction of apex

        this.context.beginPath();
        // move to apex
        this.context.moveTo(this.apexX, this.apexY);
        if (this.dir == this.TOP) { // each of the different directions
            // apex is at top
            this.context.lineTo(this.apexX - this.w / 2, this.apexY + this.h);
            this.context.lineTo(this.apexX + this.w / 2, this.apexY + this.h);
        } else if (this.dir == this.BOT) {
            // apex is at bottom
            this.context.lineTo(this.apexX - this.w / 2, this.apexY - this.h);
            this.context.lineTo(this.apexX + this.w / 2, this.apexY - this.h);
        } else if (this.dir == this.RIGHT) {
            // apex is at Right
            this.context.lineTo(this.apexX - this.w, this.apexY + this.h / 2);
            this.context.lineTo(this.apexX - this.w, this.apexY - this.h / 2);
        } else if (this.dir == this.LEFT) {
            // apex is at Left
            this.context.lineTo(this.apexX + this.w, this.apexY + this.h / 2);
            this.context.lineTo(this.apexX + this.w, this.apexY - this.h / 2);
        }
        this.context.closePath();
    }
    // triangle from a certain angle
    this.triangleFromAngle = function(apexX, apexY, h, rad) {
        this.apexX = apexX;
        this.apexY = apexY; // position of the apex
        this.h = h; // LENGTH of sides
        this.rad = rad; // angle of triangle away from apex

        this.context.beginPath();
        // move to apex
        this.context.moveTo(this.apexX, this.apexY);
        //        alert(" first point " + this.apexX + " " + this.apexY);
        // first side
        this.newX = this.apexX - this.h * Math.sin(this.rad + Math.PI / 3);
        this.newY = this.apexY - this.h * Math.cos(this.rad + Math.PI / 3);
        //        alert(" second point " + this.newX + " " + this.newY);
        this.context.lineTo(this.newX, this.newY);
        this.newX = this.newX - this.h * Math.sin(this.rad + Math.PI);
        this.newY = this.newY - this.h * Math.cos(this.rad + Math.PI);
        //        alert(" third point " + this.newX + " " + this.newY);
        this.context.lineTo(this.newX, this.newY);

        this.context.closePath();
    }

    // create a polygon
    this.polygon = function(x, y) {
        this.x = x;
        this.y = y;
        // x and y are arrays
        this.context.beginPath();
        this.context.moveTo(this.x[0], this.y[0]);
        for (this.i = 1; this.i < x.length; this.i++) {
            this.context.lineTo(this.x[this.i], this.y[this.i]);
        }
        this.context.closePath();
    }
    // create a polygon from pts
    this.polygonPts = function(pts) {
        this.pts = pts; // array of vertices
        this.context.beginPath();
        this.context.moveTo(this.pts[0].x, this.pts[0].y);
        for (this.i = 1; this.i < this.pts.length; this.i++) {
            this.context.lineTo(this.pts[this.i].x, this.pts[this.i].y);
        }
        this.context.closePath();
    }
    // does the polygon contain a point
    this.polygonContainsPt = function(x, y, pt) {
        this.x = x; // array of x values of polygon
        this.y = y; // array of y values of polygon
        this.pt = pt; // the point to determine if in the polygon

        this.inPoly = false; // flag if point is in polygon

        // create the polygon
        this.polygon(this.x, this.y);

        // let the context determine if the point is in the polygon.
        this.inPoly = this.context.isPointInPath(this.pt.x, this.pt.y);

        return this.inPoly; // return the flag.
    }
    // does the polygon contain a point using an array of points
    this.polygonPtsContainsPt = function(vert, pt) {
        this.vert = vert; // array of points for the verticies of the polygon
        this.pt = pt; // the point to determine if in the polygon

        this.inPoly = false; // flag if point is in polygon

        // create the polygon
        this.polygonPts(this.vert);

        // let the context determine if the point is in the polygon.
        this.inPoly = this.context.isPointInPath(this.pt.x, this.pt.y);

        return this.inPoly; // return the flag.
    }

    // does this rectangle contain a point
    this.rectCtrContainPt = function(ctr, width, height, pt) {
        this.ctr = ctr; // center of the rectangle
        this.rW = width; // width of rectangle
        this.rH = height; // height of rectangle
        this.pt = pt; // point to check

        this.polygon([this.ctr.x - this.rW / 2, this.ctr.x + this.rW / 2, this.ctr.x + this.rW / 2, this.ctr.x - this.rW / 2], [this.ctr.y - this.rH / 2, this.ctr.y - this.rH / 2, this.ctr.y + this.rH / 2, this.ctr.y + this.rH / 2]);

        this.inRect = this.context.isPointInPath(this.pt.x, this.pt.y);

        return this.inRect; // return the flag
    }

    // text functions
    /**
     *draw text rotated at a particular angle centered on a given point
     */
    this.fillRotatedText = function(txt, deg, xCtr, yCtr) {
        this.context.translate(xCtr, yCtr); // move center of canvas to the center point
        this.context.rotate(-deg * Math.PI / 180); // convert to radians
        //alert("in fill rotated text");
        this.context.font = this.font;
        var textLength = this.context.measureText(txt).width;
        this.context.fillStyle = this.foreground;
        this.context.textAlign = "center";
        this.context.fillText(txt, 0, this.def.defFontSizePx / 2);
        // debug drawings
        //this.context.fillRect(0,0,20,20);

        this.context.rotate(deg * Math.PI / 180); // undo rotation
        this.context.translate(-xCtr, -yCtr); // undo the translation
    };

    /*
     *draw a rectangle and put text in the center of it.  Make rectangle fit text
     */
    this.textFillRect = function(txt, xCtr, yCtr, textColor, border, fill, lines) {
        this.txt = txt; // the text in the rectangle
        this.xCtr = xCtr; // the x value for the center of the rectangle
        this.yCtr = yCtr; // the y value of the center of the rectangle
        this.textColor = textColor; // the color for the text
        this.border = border; // the color of the outside edge of the color
        this.fill = fill; // the fill color
        this.lines = lines; // the number of lines for the text.  To Implement lager
        // all text is centered on the rectangle

        this.context.strokeStyle = this.border; // set the border color
        this.context.fillStyle = this.fill; // set the fill color

        this.textLength = this.context.measureText(this.txt).width; // how long is the text
        // fill the rectangle first
        // determine the rectangle values
        this.left = this.xCtr - this.textLength / 2 - 5;
        this.top = this.yCtr - this.def.defFontSizePx;
        this.rWidth = this.textLength + 10;
        this.rHeight = 2 * this.def.defFontSizePx;

        this.context.fillRect(this.left, this.top, this.rWidth, this.rHeight);

        // do the border
        this.context.strokeRect(this.left, this.top, this.rWidth, this.rHeight);

        // draw the text
        this.context.fillStyle = this.textColor;
        this.context.textAlign = "center"; // set the alignment as center
        this.context.fillText(txt, this.xCtr, this.yCtr + this.def.defFontSizePx / 2); // write the text

        // determine the contact points for connectors
        this.topContact = [this.xCtr, this.top];
        this.rightContact = [this.left + this.rWidth, this.yCtr];
        this.botContact = [this.xCtr, this.top + this.rHeight];
        this.leftContact = [this.left, this.yCtr];

        return [this.topContact, this.rightContact, this.botContact, this.leftContact];
    }

    // drawing functions of a specialized nature for my purposes
    // draw a plus mark usually as a fixation mark
    this.drawPlus = function(xCtr, yCtr, radius) {
        this.context.beginPath();
        // move to the middle of the plux
        // horizontal line
        this.context.moveTo(xCtr - radius, yCtr);
        this.context.lineTo(xCtr + radius, yCtr);
        // vertical line
        this.context.moveTo(xCtr, yCtr - radius);
        this.context.lineTo(xCtr, yCtr + radius);

        // set the drawing parameters
        this.context.lineWidth = this.strokeWidth;
        this.context.strokeStyle = this.foreground;
        this.context.stroke();
    };
    this.drawMinus = function(xCtr, yCtr, radius) {
        this.xStt = xCtr - radius;
        this.xStp = xCtr + radius;
        this.line(this.xStt, yCtr, this.xStp, yCtr);
    }
    // draw a plus mark usually as a fixation mark
    this.drawX = function(xCtr, yCtr, radius) {
        this.context.beginPath();
        // move to the middle of the plux
        // horizontal line
        this.context.moveTo(xCtr - radius, yCtr - radius);
        this.context.lineTo(xCtr + radius, yCtr + radius);
        // vertical line
        this.context.moveTo(xCtr + radius, yCtr - radius);
        this.context.lineTo(xCtr - radius, yCtr + radius);

        // set the drawing parameters
        this.context.lineWidth = this.strokeWidth;
        this.context.strokeStyle = this.foreground;
        this.context.stroke();
    };

    /**
     *axis drawing function.  Start from the origin, lower left, not normal, upper left corner  Think like a graph
     * @orgX = the orgin
     */
    this.drawAxes = function(originX, originY, width, height) {
        // simple first version, just the main axes lines
        this.line(originX, originY, originX + width, originY); // X-axis
        this.line(originX, originY, originX, originY - height); // y-axis

        // draw the has marks:
        var hashLength = this.def.defFontSizePx / 2;
        // x axis has marks
        this.line(originX, originY, originX, originY + hashLength); // at origin
        this.line(originX + width - this.strokeWidth / 2, originY, originX + width - this.strokeWidth / 2, originY + hashLength); // at End
        // y axis has marks
        this.line(originX, originY, originX - hashLength, originY); // at origin
        this.line(originX, originY - height + this.strokeWidth / 2, originX - hashLength, originY - height + this.strokeWidth / 2); // at End
    };

    this.drawArrow = function(xStart, yStart, xEnd, yEnd) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.xEnd = xEnd;
        this.yEnd = yEnd;

        this.dist = Math.sqrt((this.xEnd - this.xStart) * (this.xEnd - this.xStart) + (this.yEnd - this.yStart) * (this.yEnd - this.yStart));
        // length of line

        // draw the line
        this.line(this.xStart, this.yStart, this.xEnd, this.yEnd);

        // determine angle
        this.arrowBase = 10 * this.strokeWidth;
        this.arrowHeight = 10 * this.strokeWidth;
        this.context.fillStyle = this.foreground;

        // angle of line
        if (this.yStart != this.yEnd) {
            this.lineAngle = Math.asin((this.yStart - this.yEnd) / this.dist);
            //        alert("angle " + this.lineAngle + " length = " + this.dist);
            this.triangleFromAngle(this.xEnd, this.yEnd, this.arrowHeight, this.lineAngle);
        } else {
            if (this.xStart > this.xEnd) {
                this.triangleFromApex(this.xEnd, this.yEnd, this.arrowHeight, this.arrowBase, this.LEFT);
            } else {
                this.triangleFromApex(this.xEnd, this.yEnd, this.arrowHeight, this.arrowBase, this.RIGHT);
            }
        }
        this.context.fill();
    }

    this.arrowConnect = function(xStart, yStart, xEnd, yEnd, dirOut, dirIn) {
        this.MIN = 15; //
        this.xStart = xStart; // coordinates for
        this.yStart = yStart;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.dirOut = dirOut; // direction out of start
        this.dirIn = dirIn; // direction into end

        //alert(this.xStart + " " + this.yStart + " " + this.xEnd + " " + this.yEnd);
        this.x1 = this.xStart;
        this.x2 = this.xEnd;
        this.y1 = this.yStart;
        this.y2 = this.yEnd;
        if (this.dirOut === this.RIGHT) { // arrows coming to the right at the start
            this.y2 = this.yStart;
            if (this.x2 < this.x1 + this.MIN) { // minimal distance from right edge
                this.x2 = this.x1 + this.MIN;

                // will need to break line
                if (this.dirIn === this.TOP) { // arrows coming in from the top.
                    this.line(this.x1, this.y1, this.x2, this.y2); // go out to right
                    this.y1 = this.y2;
                    //                    alert(this.y2);
                    this.y2 = (this.yEnd - this.y2) / 2 + this.y2;
                    //                    alert("after = " + this.y2);
                    this.x1 = this.x2;
                    this.line(this.x1, this.y1, this.x2, this.y2); // go down half the distance
                    this.x1 = this.x2;
                    this.y1 = this.y2;
                    this.x2 = this.xEnd; // go to over top.
                }
            }
            this.line(this.x1, this.y1, this.x2, this.y2);
        }
        this.line(this.x2, this.y2, this.xEnd, this.yEnd);

        // do the arrow
        this.arrowBase = 10;
        this.arrowHeight = 10;
        this.context.fillStyle = this.foreground;
        if (this.dirIn === this.TOP) {
            this.triangleFromApex(this.xEnd, this.yEnd, this.arrowBase, this.arrowHeight, this.BOT);
        } else if (this.dirIn === this.BOT) {
            this.triangleFromApex(this.xEnd, this.yEnd, this.arrowBase, this.arrowHeight, this.TOP);
        } else if (this.dirIn === this.RIGHT) {
            this.triangleFromApex(this.xEnd, this.yEnd, this.arrowHeight, this.arrowBase, this.LEFT);
        } else if (this.dirIn === this.LEFT) {
            this.triangleFromApex(this.xEnd, this.yEnd, this.arrowHeight, this.arrowBase, this.RIGHT);
        }
        this.context.fill();
    }

    // draw a grating
    this.sineGrating = function(xCtr, yCtr, diam, cycle, relAmp, middle, phase) {
        // xCtr, yCtr center points of grating
        // diam diameter of grating
        // cycle is cycle width in pixels
        // relAmp is the range of contrast relative the the smallest lum range available
        // middle is the middle luminance
        // phase the phase of the starting luminance
        this.xStart = xCtr - diam / 2;
        this.yStart = yCtr - diam / 2;

        // determine the smallest possible lum range
        if (middle < 128) { // middle is below half lum
            this.maxRange = middle;
        } else { // middle is above half lum
            this.maxRange = 255 - middle;
        }

        for (this.i = this.xStart; this.i <= this.xStart + diam; this.i++) {
            // draw the grating as a series of lines
            // determine current luminance
            this.relInt = Math.sin((2 * Math.PI * (this.i - this.xStart) / cycle + phase * Math.PI / 180));
            this.foreVal = Math.floor(this.maxRange * relAmp * this.relInt + middle + 0.5);
            //            alert(relAmp + " " + this.relInt + " " + this.foreVal);
            //            this.context.fillStyle = "red";
            //            this.context.fillText(""+this.foreVal,this.xStart+(this.i-this.xStart)*15,25);
            this.foreground = colorString(this.foreVal, this.foreVal, this.foreVal);
            this.line(this.i, this.yStart, this.i, this.yStart + diam);
        }

    }

    // draw a checkerboard
    this.checkerboard = function(xCtr, yCtr, diam, checkSize, contrast, middle) {
        // xCtr, yCtr center points of checkerboard
        // diam diameter of checkerboard
        // checkSize is the check size in pixels
        // contrast is the range of contrast relative the the smallest lum range available
        // middle is the middle luminance
        this.xStart = xCtr - diam / 2;
        this.yStart = yCtr - diam / 2;

        // error check checksize
        if (checkSize < 1.0) {
            this.context.fillstyle == colorString(middle, middle, middle);
            this.context.fillRect(this.xStart, this.yStart, diam, diam);
        } else {
            // determine the smallest possible lum range
            if (middle < 128) { // middle is below half lum
                this.maxRange = middle;
            } else { // middle is above half lum
                this.maxRange = 255 - middle;
            }

            // draw the checkerboard
            for (this.x = this.xStart; this.x < this.xStart + diam; this.x += checkSize * 2) {
                for (this.y = this.yStart; this.y < this.yStart + diam; this.y += checkSize * 2) {
                    // now determine luminance  dark squares
                    this.lum = Math.floor(middle - contrast * this.maxRange + 0.5); // luminance level
                    this.context.fillStyle = colorString(this.lum, this.lum, this.lum);
                    this.context.fillRect(this.x, this.y, checkSize, checkSize);
                    this.context.fillRect(this.x + checkSize, this.y + checkSize, checkSize, checkSize);

                    // now determine luminance light squares
                    this.lum = Math.floor(middle + contrast * this.maxRange + 0.5); // luminance level
                    this.context.fillStyle = colorString(this.lum, this.lum, this.lum);
                    this.context.fillRect(this.x, this.y + checkSize, checkSize, checkSize);
                    this.context.fillRect(this.x + checkSize, this.y, checkSize, checkSize);
                }
            }
            // cover background
            this.context.fillStyle = colorString(middle, middle, middle);
            this.context.fillRect(this.xStart + diam, this.yStart - 1, 2 * checkSize, diam + 2 * checkSize + 2);
            this.context.fillRect(this.xStart - 1, this.yStart + diam, diam + 2 * checkSize + 2, 2 * checkSize);
        }

    }

    this.lineAA = function(x1, y1, x2, y2, contrast, back, halfWidth) {
        this.normal = new NormalDistribution();
        this.normal.setMeanStdDev(0, halfWidth / 3); // set the std dev so line covers three std dev each side.
        this.normPeak = this.normal.getValue(0); // maximum of normal distribution on this line

        // determine angle of slide
        this.invert = false; // line is closer to horizontal than vertical
        if (Math.abs(y2 - y1) > Math.abs(x2 - x1)) {
            this.invert = true; // closer to vertical than horizontal
        }

        //      setAAAxis(start, stop);  // sets up parameters for antialiasing
        // replace this function all above with this below
        this.angle = Math.PI / 2.0;
        if (this.invert) {
            this.angle = Math.atan((x2 - x1) / (y2 - y1));
        } else {
            this.angle = Math.atan((y2 - y1) / (x2 - x1));
        }
        this.angle -= Math.PI / 2.0;
        this.relY = Math.abs(Math.sin(this.angle));
        // too here

        this.ySlope = 0;
        this.startL = x1;
        this.stopL = x2;
        this.step = 1.0;
        this.yPos = y1;
        this.intercept;
        this.dist;
        this.lumLevel;
        if (this.invert) {
            this.ySlope = (x2 - x1) / (y2 - y1);
            this.startL = y1;
            this.stopL = y2;
            this.yPos = x1;
        } else {
            this.ySlope = (y2 - y1) / (x2 - x1);
        }

        // how to step through the line
        this.intercept = this.yPos - this.ySlope * this.startL;
        if (this.stopL < this.startL) {
            this.step = -1.0;
        }

        // determine the smallest possible lum range
        this.maxRange = 0;
        if (back < 128) { // middle is below half lum
            this.maxRange = back;
        } else { // middle is above half lum
            this.maxRange = 255 - back;
        }


        //now draw the antialiased line
        for (this.i = this.startL; this.i <= this.stopL; this.i += this.step) {
            // current center of the line
            this.yPos = this.i * this.ySlope + this.intercept;
            // the smoothed dimension.
            for (this.j = -halfWidth; this.j <= halfWidth; this.j++) {
                this.dist = Math.abs((this.j + Math.round(this.yPos)) - this.yPos) * this.relY;
                // current light level
                this.lumLevel = Math.floor(contrast * this.maxRange * (this.normal.getValue(this.dist) / this.normPeak) + 0.5) + back;
                this.context.fillStyle = colorString(this.lumLevel, this.lumLevel, this.lumLevel);

                //                alert(this.lumLevel+" "+contrast+" "+this.maxRange+" "+this.dist+" "+this.normPeak+" "+this.normal.getValue(this.dist));
                //                alert(this.yPos+" "+this.relY);

                if (!this.invert) {
                    this.circle(this.i, this.j + Math.floor(this.yPos + 0.5), 1.0);
                    this.context.fill();
                    //                    g2d.draw(new Ellipse2D.Double(i, (int)(j + Math.round(yPos)), 1.0, 1.0));
                } else {
                    this.circle(this.j + Math.floor(this.yPos + 0.5), this.i, 1);
                    this.context.fill();
                    //                   g2d.draw(new Ellipse2D.Double(
                    //                   (int)(j + Math.round(yPos)), i, 1.0, 1.0));
                }
            } // end antialiasing loop
        } // end for loop to do main line
    }

    // setters and getters
    // setters
    this.setCanvas = function(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d"); // right now assume a 2d drawing context
    };
    // set the foreground
    this.setForeground = function(style) {
        this.foreground = style;
    };
    // set stroke width
    this.setStrokeWidth = function(w) {
        if (w > 0) { // see if it is a positive number
            this.strokeWidth = w;
        }
    };
    // set button colors
    this.setButtonColors = function(color1, color2) {
        this.buttonColor1 = color1;
        this.buttonColor2 = color2;
    };
}

// draw related objects
// new point object
function Point(x, y) {
    this.x = x;
    this.y = y;
}

// point with a z dimension
function Point3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function Annulus() {
    // object holding parameters for a circle inside a circle - centersurround, simultaneous contrast
    this.xCtr = 0; // center of the cener-surround cricles
    this.yCtr = 0;
    this.outerDiam = 50; // diameter of the outer circle
    this.innerDiam = 25; // diameter of hte inner circle both are in pixels
    this.outerColor = colorString(0, 0, 0);
    this.innerColor = colorString(0, 0, 0);
    this.outerOutline = colorString(255, 255, 255);
    this.innerOutline = colorString(255, 255, 255);
}

function AnnulusSplitCtr() {
    // object holding parameters for a circle inside a circle - centersurround, simultaneous contrast
    this.xCtr = 0; // center of the cener-surround cricles
    this.yCtr = 0;
    this.outerDiam = 50; // diameter of the outer circle
    this.innerDiam = 25; // diameter of hte inner circle both are in pixels
    this.outerColor = colorString(0, 0, 0);
    this.innerTopColor = colorString(0, 0, 0);
    this.innerBotColor = colorString(0, 0, 0);
    this.separation = 0; // the size of the gap between the top and bottom inner circle
    this.outerOutline = colorString(255, 255, 255);
    this.innerOutline = colorString(255, 255, 255);
}
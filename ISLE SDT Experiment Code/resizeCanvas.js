//
// resizeCanvas
//
this.wrapperMargin = 4;
this.marginLeft = 5;
this.padding = 12;
this.tabSize = 32;
this.titleHeight = 57;
this.outsideH = 0;


function resizeCanvas(canvas, context, proWidth, proHeight) {
    // now size the window for the activity
    this.wWidth = window.innerWidth;
    this.wHeight = window.innerHeight;
    //alert("resizeCanvas");
    // adjust canvas width by input proportions
    this.width = this.wWidth * proWidth - this.wrapperMargin * 2 - this.padding * 2 - this.marginLeft;
    this.height = this.wHeight * proHeight - this.wrapperMargin * 2 - this.tabSize - this.titleHeight - this.outsideH;
    canvas.width = this.width;
    canvas.height = this.height;
}

// set parameters
function setOutsideHeight(oH) {
    if (oH >= 0) {
        this.outsideH = oH;
    }
}

function setWrapperMargin(margin) {
    if (margin >= 0) {
        this.wrapperMargin = margin;
    }
}

function setPadding(padd) {
    if (padd >= 0) {
        this.padding = padd;
    }
}

function setTabSize(tabHeight) {
    if (tabHeight >= 0) {
        this.tabSize = tabHeight;
    }
}

function setTitleHeight(tHeight) {
    if (tHeight >= 0) {
        this.titleHeight = tHeight;
    }
}

// on click of one of tabs
// control position of DOM OBJECT
function Handedness(illusID, handID,
    dflt) {
    this.illus = document.getElementById(illusID);
    this.hand = document.getElementById(handID);
    this.handVal = document.getElementById(dflt).value;

    this.illus.style.display = "block";
    this.illus.style.cssFloat = "left";
    this.HAND_VAL = ["right", "left"];
    this.RIGHT = 0;
    this.LEFT = 1;
    this.curHand = this.LEFT;
    if (this.handVal === this.HAND_VAL[this.LEFT]) {
        this.curHand = this.RIGHT;
    }

    // bind object
    var self = this;

    this.swapPos = function() {
        if (this.curHand == this.RIGHT) {
            this.hand.value = "Right Handed";
            this.curHand = this.LEFT;
            this.illus.style.cssFloat = "right";
        } else {
            this.hand.value = "Left Handed";
            this.curHand = this.RIGHT;
            this.illus.style.cssFloat = "left";
        }
        this.handVal = this.HAND_VAL[self.curHand];
    }

    this.swapPos();

    // set up listeners
    // first mouse listeners
    this.hand.onclick = function() {
        self.swapPos();
    }
    // touch events
    this.hand.addEventListener("touchstart", function(event) {
        //        alert("touchstart");
        event.preventDefault();
        self.swapPos();
    }, false);

}
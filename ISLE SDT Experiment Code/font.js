function measureTextHeight(ctx, left, top, width, height) {
    //alert("in measureTextheight");
    // Draw the text in the specified area
    ctx.save();
    ctx.translate(left, top + Math.round(height * 0.8));
    ctx.fillText('gM'); // This seems like tall text...  Doesn't it?
    ctx.restore();

    // Get the pixel data from the canvas
    var data = ctx.getImageData(left, top, width, height).data,
        first = false,
        last = false,
        r = height,
        c = 0;

    // Find the last line with a non-white pixel
    while (!last && r) {
        r--;
        for (c = 0; c < width; c++) {
            if (data[r * width * 4 + c * 4 + 3]) {
                last = r;
                break;
            }
        }
    }

    // Find the first line with a non-white pixel
    while (r) {
        r--;
        for (c = 0; c < width; c++) {
            if (data[r * width * 4 + c * 4 + 3]) {
                first = r;
                break;
            }
        }

        // If we've got it then return the height
        if (first != r) return last - first;
    }

    // We screwed something up...  What do you expect from free code?
    return -1;
}

// object version of the code
function MeasureTextHeight() {

    this.getTextHeight = function(ctx, left, top, width, height) {
        //alert("in measureTextheight");
        // grab variables for the object
        this.context = ctx;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;

        // Draw the text in the specified area
        this.context.save();
        this.context.translate(this.left, this.top + Math.round(this.height * 0.8));
        this.context.fillText('gM'); // This seems like tall text...  Doesn't it?
        this.context.restore();

        // Get the pixel data from the canvas
        var data = this.context.getImageData(this.left, this.top, this.width, this.height).data,
            first = false,
            last = false,
            r = height,
            c = 0;

        // Find the last line with a non-white pixel
        while (!last && r) {
            r--;
            for (c = 0; c < this.width; c++) {
                if (data[r * this.width * 4 + c * 4 + 3]) {
                    last = r;
                    break;
                }
            }
        }

        // Find the first line with a non-white pixel
        while (r) {
            r--;
            for (c = 0; c < this.width; c++) {
                if (data[r * this.width * 4 + c * 4 + 3]) {
                    first = r;
                    break;
                }
            }

            // If we've got it then return the height
            if (first != r) return last - first;
        }

        // We screwed something up...  What do you expect from free code?
        return -1;
    }
}

// font weight contstants
var W_NORMAL = "normal";
var W_BOLD = "bold";
var W100 = "100";
var W200 = "200";
var W300 = "300";
var W400 = "400"; // normal weight
var W500 = "500";
var W600 = "600";
var W700 = "700";
var W800 = "800";
var W900 = "900";

function BuildFont(style, weight, size, family) {
    this.ftStyle = style;
    this.ftWeight = weight;
    this.ftSize = size;
    this.family = family
    this.sffx = "px";

    this.fontTx = this.ftStyle + this.ftWeight + this.ftSize + this.sffx + " " + this.family;

    return this.fontTx;
}
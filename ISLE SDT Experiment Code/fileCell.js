function FileCell(fileText, path, cell) {
    // put variables into local variables
    this.fileText = fileText; // list of filenames with the content  and id for the object to be clicked on
    this.path = path; // path from home to files
    this.cellID = cell; // id for cell to place information
    this.fileDOM = []; // the DOM obect to click on
    var self = this; // bind

    //    alert(this.fileText.length + " " + this.fileText[0] + " " + this.path);

    this.showText = function(path, name) {
        var block = document.getElementById(self.cellID);
        var blockHTML = "<iframe src = '" + path + name + ".html' seamless frameborder = '0' scrolling = 'auto' width = '800' height = '800'></iframe>";
        block.innerHTML = blockHTML;
        // size the iframe
        var claimed = 120 + 52; // values for banner and title
        sizeFrame("content", ROW, claimed);
        claimed = 224 + 46;
        sizeFrame("content", COL, claimed);
    };

    // create listeners
    // listeners (touch and click)
    if (this.fileText.length > 1) { // if there is more than one file
        for (var i = 0; i < this.fileText.length; i++) {
            this.fileDOM[i] = document.getElementById(this.fileText[i]);
            this.fileDOM[i].style.cursor = "pointer";
            this.fileDOM[i].onclick = function(e) {
                self.showText(self.path, e.target.id);
            }
            // touch
            this.fileDOM[i].addEventListener('touchend', function(e) {
                event.preventDefault();
                self.showText(self.path, e.target.id);
            }, false);
        }

    } else {
        this.fileDOM[0] = document.getElementById(this.fileText);
        this.fileDOM.onclick = function() {
            self.showText(self.path, self.fileText);
        }
        // touch
        this.fileDOM[0].addEventListener('touchend', function(event) {
            event.preventDefault();
            self.showTEXT(self.path, self.fileText);
        }, false);
    };
}



// parse URL information
function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }

    return parms;
}

function getIframeURL(url) {
    this.params = parseURLParams(url); // the the parameters
    this.chURL = ""; // chapter string

    if (typeof this.params != 'undefined') {
        if (typeof this.params.ch != 'undefined') {
            this.chURL = this.params.ch[0];
        }
    }

    return this.chURL;
}
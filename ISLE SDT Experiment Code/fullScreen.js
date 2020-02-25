function fullScreenListener(idButton, idFullScreen) {
    // get tab container
    this.fullButton = document.getElementById(idButton);
    this.idFullScreen = idFullScreen; // id for what gest put into the full screen.
    // set up the listener

    // bind
    var self = this;

    fullButton.onclick = function() {
        openFullScreen(idFullScreen);
        //        goFullscreen(self.idFullScreen);
    }


    this.openFullScreen = function(id) {
        //		var theURL = "http://psych.hanover.edu/";
        //		window.open(theURL, "", "fullscreen=yes, scrollbars=auto");
        var width = screen.width;
        var height = screen.height;
        var windowDescr = 'width=' + width + ',height=' + height + ', channelmode=yes, left=0, toolbar=no, location=no,';
        windowDescr += 'directories=no, status=no, menubar=no, scrollbars=yes, resizable=no,';
        windowDescr += 'copyhistory=no, titlebar=no, location=no';
        var dataWindow = window.open(id, '_blank', windowDescr);

        //		dataWindow.document.write("<p>This is 'myWindow'</p>");
        // dataWindow.document.URL = id;
    }

    goFullscreen = function(id) {
        // Get the element that we want to take into fullscreen mode
        var element = document.getElementById(id);

        // These function will not exist in the browsers that don't support fullscreen mode yet,
        // so we'll have to check to see if they're available before calling them.

        if (element.mozRequestFullScreen) {
            // This is how to go into fullscren mode in Firefox
            // Note the "moz" prefix, which is short for Mozilla.
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            // This is how to go into fullscreen mode in Chrome and Safari
            // Both of those browsers are based on the Webkit project, hence the same prefix.
            element.webkitRequestFullScreen();
        }
        // Hooray, now we're in fullscreen mode!
    }
}

function openFullWindow(url) {
    //		var theURL = "http://psych.hanover.edu/";
    //		window.open(theURL, "", "fullscreen=yes, scrollbars=auto");
    var width = screen.width;
    var height = screen.height;
    var windowDescr = 'width=' + width + ',height=' + height + ', channelmode=yes, left=0, toolbar=no, location=no,';
    windowDescr += 'directories=no, status=no, menubar=no, scrollbars=no, resizable=no,';
    windowDescr += 'copyhistory=no, titlebar=no, location=no';
    var dataWindow = window.open(url, '_blank', windowDescr);

    //		dataWindow.document.write("<p>This is 'myWindow'</p>");
    // dataWindow.document.URL = id;
}
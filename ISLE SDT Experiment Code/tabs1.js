var curTab = 1; // globa varuable to indicate the current tabe that has been selected.

function pageSetup() {
    // get tab container
    var container = document.getElementById("tabContainer");
    var tabcon = document.getElementById("tabscontent");
    //alert(tabcon.childNodes.item(1));
    // set current tab
    var navitem = document.getElementById("tabHeader_1");

    //store which tab we are on
    var ident = navitem.id.split("_")[1];
    //alert(ident);
    navitem.parentNode.setAttribute("data-current", ident);
    //set current tab with class of activetabheader
    navitem.setAttribute("class", "tabActiveHeader");

    //hide tab contents we don't need
    var pages = tabcon.getElementsByTagName("div");
    for (var i = 1; i < pages.length; i++) {
        pages.item(i).style.display = "none";
    };

    //this adds click event to tabs
    var tabs = container.getElementsByTagName("li");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].onclick = displayPage;
    }

    // set up a listener
    window.onkeyup = function(event) {
        this.def = new Defaults();
        // cur tab comes from the tab making javascript routines.
        var keyUnicode = event.keyCode ? event.keyCode : event.charCode; // determine the key that is pressed
        var newTab = curTab;

        if (keyUnicode == this.def.LEFT_ARROW || keyUnicode == this.def.UP_ARROW){
            newTab --;
        }

        if (keyUnicode == this.def.RIGHT_ARROW || keyUnicode == this.def.DOWN_ARROW){
            newTab ++;
        }

        if (newTab > tabs.length){
            newTab = tabs.length;
        }
        if (newTab < 1) {
            newTab = 1;
        }

        changeTab(curTab, newTab);
    }
}

// on click of one of tabs
function displayPage() {
    var current = this.parentNode.getAttribute("data-current");
    //remove class of activetabheader and hide old contents
    document.getElementById("tabHeader_" + current).removeAttribute("class");
    document.getElementById("tabpage_" + current).style.display = "none";

    var ident = this.id.split("_")[1];
    //add class of activetabheader to new active tab and show contents
    curTab = ident;
    this.setAttribute("class", "tabActiveHeader");
    document.getElementById("tabpage_" + ident).style.display = "block";
    this.parentNode.setAttribute("data-current", ident);

    // create event that tab has changed.
    // create an event
    this.tabEvent = new CustomEvent(
        "tabChange", {
            detail: {
                tab: curTab,
                time: window.performance.now(),
            },
            bubbles: true,
            cancelable: true
        }
    );
    window.dispatchEvent(this.tabEvent); // dispatch event the stimulus has been drawn
}

// software call to change the tab
function changeTab(current, ident) {
    //  var current = this.parentNode.getAttribute("data-current");
    //remove class of activetabheader and hide old contents
    document.getElementById("tabHeader_" + current).removeAttribute("class");
    document.getElementById("tabpage_" + current).style.display = "none";

    //    var ident = this.id.split("_")[1];
    //add class of activetabheader to new active tab and show contents
    curTab = ident;

    // grab the tabs
    var container = document.getElementById("tabContainer");
    var tabs = container.getElementsByTagName("li");

    tabs[ident - 1].setAttribute("class", "tabActiveHeader");
    document.getElementById("tabpage_" + ident).style.display = "block";
    tabs[ident - 1].parentNode.setAttribute("data-current", ident);

    // create event that tab has changed.
    // create an event
    this.tabEvent = new CustomEvent(
        "tabChange", {
            detail: {
                tab: curTab,
                time: window.performance.now(),
            },
            bubbles: true,
            cancelable: true
        }
    );
    this.window.dispatchEvent(this.tabEvent); // dispatch event the stimulus has been drawn
}

// background task

var app = {};
var appState = { workTab: null };

app.openOrFocusTab = function(url) {
    if (appState.workTab === null) {
        app.makeNewWorkTab(url);
    } else {
        app.refreshTabInfo(url);  // add url variable to function
    }
}

app.refreshTabInfo = function(url) {
    
    chrome.tabs.get(appState.workTab.id, tab => {
         if (chrome.runtime.lastError) {
             // can't find the tab, let start over w/ new tab.
             appState.workTab = null;
             app.makeNewWorkTab(url);
         } else {
             appState.workTab = tab;

             var re = /google\.com/;
             if (!re.test(tab.url)){
                 app.makeNewWorkTab(url);
             }

             if (!appState.workTab.highlighted) {
                 chrome.tabs.update(appState.workTab.id, {highlighted: true});
             }
         }
    });
    

   
}

app.makeNewWorkTab = function(url) {
    // make a new tab
    chrome.tabs.create({url}, function(tab) {
        appState.workTab = tab;
    });
}



app.checkForWork = function() {

    console.log("checking for work");
     
    // work always available lol and no server to ping
    app.openOrFocusTab(app.url);

    clearTimeout(app.timeout);
    app.timeout = setTimeout(app.checkForWork, 16000);
}

app.reset = function() { 
    clearTimeout(app.timeout);
    appState = { workTab: null };
    app.url = "http://www.google.com"; 
}

app.url = "https://www.google.com/"; // can change url in console by typing: app.url = "http://any"




// run in console to test.
// type in console to start: app.checkForWork();
// to reset: app.reset();

console.log("To start this app: app.checkForWork();");
console.log("To reset the app: app.reset();");
console.log("You can change the url anytime: app.url = \"http://anyurl.com\";");
console.log("while app is running, you can see tab opening then you can test by closing tab or move tab somewhere, or select different tab");




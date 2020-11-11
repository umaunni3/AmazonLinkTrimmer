// get the current URL from the active tab, and return it. Takes in a callback function, which it will
// call with the current URL as an argument.
function getCurrURL(callback) {
	chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    	let url = tabs[0].url;
    	// use `url` here inside the callback because it's asynchronous!
        callback(url);
	});
}

// trim out the tracking junk from the given Amazon product URL
function trimTrackingJunk(url) {
    let re = /amazon.com\/dp\/(.*?)\//; // capture everyting between the 2nd and 3rd slashes in amazon.com/dp/.../
    var matches = re.exec(url);
    console.log("matches: ");
    console.log(matches);
    if (matches == null) {
        return url; // if no match, something went wrong, so just return the full url
    } else {
        return matches[0];
    }
   
}

// takes in some text and directly writes it to the user's clipboard.
function copyTextToClipboard(text) {
    // set up a temporary element to write the data to, which the clipboard can then read from.
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    
    // select the text in that text area; the clipboard writing method will write whatever is currently selected.
    copyFrom.select();
    document.execCommand('copy');
    
    // cleanup:
    // deselect the text
    copyFrom.blur();
    // remove the text field from the document
    document.body.removeChild(copyFrom);
}

// Main handler method. Takes in a url and trims it, and then stores in the user's clipboard.
function copyTrimmedLinkToClipboard(url) {
    var url = trimTrackingJunk(url);
//    alert("document url issss " + url);
    copyTextToClipboard(url);
}

// set the onClick action for the extension icon. it should fetch the URL and then trigger the main handler method (copyTrimmedLinkToClipboard)
chrome.browserAction.onClicked.addListener(function(tab) {  getCurrURL(copyTrimmedLinkToClipboard);});

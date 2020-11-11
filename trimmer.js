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
    // amazon product links have two formats (maybe more? but I only know of two...):
    // - amazon.com/dp/PROD_ID
    // - amazon.com/gp/product/PROD_ID
    // We need to be able to match either one. I split it into two regexes, because making it work with a single
    // regex expression was turning out to be a pain. 
    let re_dp = /amazon.com\/dp\/([A-Z|0-9]*)/; // capture the PROD_ID in amazon.com/dp/PROD_ID formatted links
    let re_gp = /amazon.com\/gp\/product\/([A-Z|0-9]*)/;  // same as above, but for amazon.com/gp/product/PROD_ID formatted links
    var re_exprs = [re_dp, re_gp];
    var re;
    for (re of re_exprs) {
        let matches = re.exec(url);
        if (matches != null) {
            return matches[0];
        }
    }
    // if we finish the loop without having returned, then none of the regexes worked, so we may not be on an amazon product page
    // (or maybe there's just yet another amazon product link format that I don't know about). In this case, just return the original
    // url without trying to trim it.
    return url;
   
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

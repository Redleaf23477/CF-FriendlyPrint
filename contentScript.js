let url = window.location.href;
let pageProp = {
    "whatPage" : undefined,
};

// whatPage : whether it is problem, blog(probably tutorial), or something else
pageProp.whatPage = (
    url.search("/problem/") != -1? "problem" :
    url.search("/blog/") != -1? "blog" :
    "something else"
);

// sending message to popup.js
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "getPageProp":
                sendResponse(JSON.stringify(pageProp));
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);
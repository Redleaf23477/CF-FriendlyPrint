let url = window.location.href;
let pageProp = {
    "whatPage" : undefined,
    "probLinks" : undefined
};

// whatPage : whether it is problem, blog(probably tutorial), or something else
pageProp.whatPage = (
    url.search("/problem/") != -1? "problem" :
    url.search("/blog/") != -1? "blog" :
    "something else"
);

// if it is a blog page, fetch list of problems
if(pageProp.whatPage == "blog") {
    let content = document.querySelector(".ttypography");
    let listOfLinks = content.querySelectorAll("a");
    let isProbLink = (link) => {
        return link.search(/\/problem\//i) != -1;
    };
    pageProp.probLinks = [];
    listOfLinks.forEach((item) => {
        if(isProbLink(item.href)) {
            pageProp.probLinks.push({
                href: item.href,
                text: item.text
            });
        }
    });
}

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

//////////////////////////////////////////////////////////////////////////////
// Load values from chrome storage
// 
//    Note: Currently has nothing to load
//////////////////////////////////////////////////////////////////////////////

let appSettings = {
	mode: "normal"      // "dummy" for snapshot only, "normal" for better UI but maybe buggy
};

//////////////////////////////////////////////////////////////////////////////
// Main script
//////////////////////////////////////////////////////////////////////////////

let url = window.location.href;
let pageProp = {
	"whatPage": undefined,
	"probLinks": undefined
};

// init everything when the page is fully loaded
window.addEventListener('load', () => {
	// init pageProp.whatPage - whether it is problem, blog(probably tutorial), 
	// or something else
	pageProp.whatPage = (
		url.search("/problem/") != -1 ? "problem" :
			url.search("/blog/") != -1 ? "blog" :
				"something else"
	);

	// init pageProp.probLinks - fetch list of problem in blog page so that user 
	// can choose problems to print in normal mode
	if (appSettings.mode == "normal") {
		// if it is a blog page, fetch list of problems when webpage is ready
			if (pageProp.whatPage == "blog") {
				let content = document.querySelector(".ttypography");
				let listOfLinks = content.querySelectorAll("a");
				let isProbLink = (link) => {
					return link.search(/\/problem\//i) != -1;
				};
				pageProp.probLinks = {};
				listOfLinks.forEach((item) => {
					if (isProbLink(item.href)) {
						if (!pageProp.probLinks.hasOwnProperty(item.href)) {
							pageProp.probLinks[item.href] = item.text
						}
					}
				});
			}
	}
});

// sending message to popup.js on request
chrome.runtime.onMessage.addListener(
	function (message, sender, sendResponse) {
		switch (message.type) {
			case "getPageProp":
				sendResponse(JSON.stringify(pageProp));
				break;
			default:
				console.error("Unrecognised message: ", message);
		}
	}
);

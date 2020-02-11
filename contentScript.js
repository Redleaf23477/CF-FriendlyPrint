
//////////////////////////////////////////////////////////////////////////////
// Load values from chrome storage
// 
//    Note: Currently has nothing to load
//////////////////////////////////////////////////////////////////////////////

let appSettings = { mode: undefined };

chrome.storage.sync.get("appMode", (data) => {
  appSettings.mode = data.appMode;
});

//////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////

/*
 * isProblemPage
 *   Check whether current page is a problem page
 * 
 * @return boolean 
 */
let isProblemPage = () => {
  return window.location.href.search("/problem/") != -1;
};

/*
 * isBlogPage
 *   Check whether current page is a blog entry page
 * 
 * @return boolean 
 */
let isBlogPage = () => {
  return window.location.href.search("/blog/") != -1;
};

/*
 * isRegularRoundTutorialPage
 *   Check whether current page is a tutorial page on regular round
 * 
 * @return boolean 
 */
let isRegularRoundTutorialPage = () => {
  if(isBlogPage() == false) return false;
  let attachList = document.querySelectorAll("a.notice");
  let res = false;
  attachList.forEach((item) => {
    let isRegularRoundLink = (href) => { return href.search("/contest/") != -1; };
    if(isRegularRoundLink(item.href))
      res = true;
  });
  return res;
};

//////////////////////////////////////////////////////////////////////////////
// Main script
//////////////////////////////////////////////////////////////////////////////

let pageProp = {
	"whatPage": undefined,
	"probLinks": undefined
};

// init everything when the page is fully loaded
window.addEventListener('load', () => {
	// init pageProp.whatPage - whether it is problem, blog(probably tutorial), 
  // or something else
	pageProp.whatPage = (
	  isProblemPage()? "problem" :
    isRegularRoundTutorialPage()? "tutorial" : 
    isBlogPage()? "blog" : 
    "something else"
	);

	// init pageProp.probLinks - fetch list of problem in blog page so that user 
	// can choose problems to print in normal mode
	if (appSettings.mode == "normal") {
		// if it is a blog page, fetch list of problems when webpage is ready
			if (pageProp.whatPage == "tutorial") {
				let content = document.querySelector(".ttypography");
				let listOfLinks = content.querySelectorAll("a");
				let isProbLink = (link) => { return link.search("/problem/") != -1; };
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

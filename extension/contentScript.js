
//////////////////////////////////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////////////////////////////////

let appSettings = { mode: undefined };

let pageProp = {
  "complete": false,
	"whatPage": undefined,
  "probLinks": undefined,
  "openedSpoilers": []
};

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
    let isRegularRoundLink = (href, txt) => { 
      return href.search("/contest/") != -1 && txt.search("Tutorial") != -1; 
    };
    if(isRegularRoundLink(item.href, item.parentNode.childNodes[0].textContent))
      res = true;
  });
  return res;
};

/*
 * fetchTutorialProblems
 *   fetch all problems in round and store in `pageProp.probLinks`
 * 
 * @return void
 */
let fetchTutorialProblems = () => {
  let content = document.querySelector(".ttypography");
  let listOfLinks = content.querySelectorAll("a");
  let isProbLink = (link) => { return link.search("/problem/") != -1; };
  pageProp.probLinks = {};
  listOfLinks.forEach((item) => {
    if (isProbLink(item.href)) {
      if (!pageProp.probLinks.hasOwnProperty(item.href)) {
        pageProp.probLinks[item.href] = item.text;
      }
    }
  });
}

/*
 * markSpoilers
 *   add sync callback between spoiler and checkbox when toggling spoiler
 * 
 * @return void
 */
let markSpoilers = () => {
  let div = document.querySelector(".ttypography").childNodes;
  let isProbLink = (link) => {
    return link.search("/problem/") != -1;
  };
  let currentProb = "NA"; // stores href of problem
  for(let child of div) {
    if("querySelector" in child) {
      // update href
      let a = child.querySelector("a");
      if(a === null) {
        // do nothing
      } else if (isProbLink(a.href)) {
        currentProb = a.href;
      }
      // mark spoilers with problem href
      let spoilers = child.querySelectorAll(".spoiler-title");
      spoilers.forEach((item) => {
        // mark spoiler, prefix "cffp" = CF Friendly Print
        item.setAttribute("cffp_probhref", currentProb);
        // if either spoiler of a problem is opened, check it in popup
        item.addEventListener("click", () => {
          let markedSpoilers = document.querySelectorAll("[cffp_probhref='" + item.getAttribute("cffp_probhref") + "']");
          let probChecked = false;
          markedSpoilers.forEach((ms) => {
            if(ms.parentNode.classList.contains("spoiler-open")) {
              probChecked = true;
            }
          });
          // if this problem should be checked, store in `pageProp.openedSpoiler`
          // else remove if needed
          if(probChecked == true) {
            if(typeof pageProp.openedSpoilers == "undefined") {
              pageProp.openedSpoilers = [];
            }
            if(pageProp.openedSpoilers.indexOf(item.getAttribute("cffp_probhref")) === -1){
              pageProp.openedSpoilers.push(item.getAttribute("cffp_probhref"));
            }
          } else {
            let idx = pageProp.openedSpoilers.indexOf(item.getAttribute("cffp_probhref"));
            if(idx !== -1) {
              pageProp.openedSpoilers.splice(idx, 1);
            }
          }
        });
      });
    }
  }
}

/*
 * fetchTutorialPageInfo
 *   if all tutorials are loaded, fetch list of tutorial problems and mark spoilers
 * 
 * @return boolean - true if success, false if some tutorials are not loaded yet
 */
let fetchTutorialPageInfo = () => {
  // if it is a tutorial page, fetch list of problems when webpage is ready
  if(!document.querySelector(".problemTutorial")) {
    fetchTutorialProblems();
    markSpoilers();
    return true;
  } else {
    return false;
  }
}

//////////////////////////////////////////////////////////////////////////////
// Main script
//////////////////////////////////////////////////////////////////////////////

// get extension settings from chrome.storage and fetch page info
chrome.storage.sync.get("appMode", (data) => {
  appSettings.mode = data.appMode;

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
  if (appSettings.mode == "normal" && pageProp.whatPage == "tutorial") {
    if(fetchTutorialPageInfo()) {
      pageProp.complete = true;
    }
  } else {
    pageProp.complete = true;
  }

});

// sending message to popup.js on request
chrome.runtime.onMessage.addListener(
	function (message, sender, sendResponse) {
		switch (message.type) {
			case "getPageProp":
        if(!pageProp.complete) {
          if(fetchTutorialPageInfo()) {
            pageProp.complete = true;
          }
        }
				sendResponse(JSON.stringify(pageProp));
				break;
			default:
				console.error("Unrecognised message: ", message);
		}
	}
);

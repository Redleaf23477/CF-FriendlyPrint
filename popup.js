let errorLog = (msg) => { console.log(msg); };

//////////////////////////////////////////////////////////////////////////////
// Get Elements from popup.html
//////////////////////////////////////////////////////////////////////////////

let button_print = document.getElementById('printButton');
let p_whatPage = document.getElementById('whatPage');
let l_probList = document.getElementById('probList');

//////////////////////////////////////////////////////////////////////////////
// Variables from content script
//////////////////////////////////////////////////////////////////////////////

let pageProp = undefined;

//////////////////////////////////////////////////////////////////////////////
// Load values from chrome storage
//////////////////////////////////////////////////////////////////////////////

// loading is placed in window.onload, 
// so that settings is sured to be loaded when used
let appSettings = undefined;

//////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////

/*
 * showWhatPage
 *   modify UI based on what kind of page the user is viewing
 * 
 * @param whatPage - if the webpage is fully loaded, either "problem", "blog", "tutorial", or "something else",
 *   otherwise type of whatPage is "undefined"
 * @return null
 */
let showWhatPage = (whatPage) => {
  // do nothing if the page is not fully load yet
  if(typeof whatPage == "undefined") {
    button_print.hidden = true;
    return;
  }

  switch(whatPage) {
  case "problem":
    p_whatPage.innerText = "This is a " + whatPage + " page!";
    button_print.hidden = false;
    break;
    case "tutorial":
      p_whatPage.innerText = "This is a " + whatPage + " page!";
      button_print.hidden = false;
      break;
  case "blog":
    p_whatPage.innerText = "This is a " + whatPage + " page!";
    button_print.hidden = false;
    break;
  case "something else":
    p_whatPage.innerText = "This page isn't supported to be printed QAQ";
    button_print.hidden = true;
    break;
  default:
    p_whatPage.innerText = "unexpected error occured";
    errorLog("unexpected whatPage");
    break;
  }
}

/*
 * showProbList
 *   show checkbox for every problem in tutoral page, called when
 * user is viewing blog page
 * 
 * @param object probDict - dictionary to store problem href and name
 *   { (string) problem href => (string) problem Name }
 * @return null
 */
let showProbList = (probDict) => {
  Object.keys(probDict).forEach((key, index) => {
    let probName = probDict[key];
    let href = key;
    let cb = document.createElement("input");
    cb.setAttribute("type", "checkbox");
    cb.setAttribute("value", href);
    cb.setAttribute("name", probName);
    let txt = document.createElement("label");
    txt.setAttribute("for", probName);
    txt.innerText = probName;
    l_probList.appendChild(cb);
    l_probList.appendChild(txt);
    l_probList.appendChild(document.createElement("br"));
  });
}

/*
 * getPrintList
 *   get array of checked problems in the checkboxes
 * 
 * @return array of objects 
 *   ( { href: (string)problem  href, name: (string) problem name } )
 */
let getPrintList = () => {
  let list = [];
  let cb = l_probList.querySelectorAll("input");
  cb.forEach((item) => {
    if(item.checked) {
      list.push({
        href: item.value,
        name: item.name
      });
    }
  });
  return list;
}

//////////////////////////////////////////////////////////////////////////////
// Main script
//////////////////////////////////////////////////////////////////////////////

// show popup UI
window.onload = (function () {
  if(typeof appSettings == "undefined") {
    appSettings = { mode: undefined };
    chrome.storage.sync.get("appMode", (data) => {
      appSettings.mode = data.appMode;
    });
  }
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getPageProp"}, function(recv) {
      if(typeof recv == "undefined") {
        errorLog("returned undefined");
        if(chrome.runtime.lastError) {
          // We couldn't talk to the content script, probably it's not there
          errorLog("unexpected error");
        }
      } else {
        pageProp = JSON.parse(recv);
        showWhatPage(pageProp.whatPage);
        if(appSettings.mode == "normal" && pageProp.whatPage == "tutorial") {
          showProbList(pageProp.probLinks);
        }
      }
    });
  });
});

// print webpage
button_print.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // select script to be executed
    let isProblemPage = (pageProp.whatPage == "problem");
    let isBlogPage = (pageProp.whatPage == "blog" || pageProp.whatPage == "tutorial");
    let fileToExec = (
      isProblemPage? './printProb.js' : 
      isBlogPage? './printBlog.js' :
      'printUnsupported.js'
    );
    // if normal mode, pass list of problems to be printed
    let param = undefined;
    if(appSettings.mode == "normal" && isBlogPage == true) {
      param = { printList : getPrintList(), pageType : pageProp.whatPage };
    } else if(appSettings.mode == "dummy") {
      param = { pageType : pageProp.whatPage };
    }
    chrome.tabs.executeScript(
      tabs[0].id,
      {code:"let printSettings = " + JSON.stringify(param) + ";"}
    );
    // execute print script
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: fileToExec}
    );
  });
};

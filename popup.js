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
// 
//    Note: Currently has nothing to load
//////////////////////////////////////////////////////////////////////////////
/*
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});
*/

let appSettings = {
  mode: "normal"
};

//////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////

/*
 * showWhatPage
 *   modify UI based on what kind of page the user is viewing
 * 
 * @param whatPage - if the webpage is fully loaded, either "problem", "blog", or "something else"
 *   else type of whatPage is "undefined"
 * @return null
 */
let showWhatPage = (whatPage) => {
  // do nothing if the page is not fully load yet
  if(typeof whatPage == "undefined") return;

  switch(whatPage) {
  case "problem":
    p_whatPage.innerText = "This is a " + whatPage + " page!";
    break;
  case "blog":
    p_whatPage.innerText = "This is a " + whatPage + " page!";
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
        if(appSettings.mode == "normal" && pageProp.whatPage == "blog") {
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
    let isBlogPage = (pageProp.whatPage == "blog");
    let fileToExec = (
      isProblemPage? './printProb.js' : 
      isBlogPage? './printTutorial.js' :
      'printUnsupported.js'
    );
    // if normal mode, pass list of problems to be printed
    if(appSettings.mode == "normal" && isBlogPage == true) {
      let param = { printList : getPrintList() };
      chrome.tabs.executeScript(
        tabs[0].id,
        {code:"let printSettings = " + JSON.stringify(param) + ";"}
      );
    }
    // execute print script
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: fileToExec}
    );
  });
};

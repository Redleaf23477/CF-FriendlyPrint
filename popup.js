
let errorLog = (msg) => { console.log(msg); };

let button_print = document.getElementById('printButton');
let p_whatPage = document.getElementById('whatPage');
let l_probList = document.getElementById('probList');

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

//////////////////////////////////////////////////////////////////////////////
// Layer Logics
//////////////////////////////////////////////////////////////////////////////

function showWhatPage(whatPage) {
  p_whatPage.innerText = "This is a " + whatPage + " page!";
}

function showProbList(probLinks) {
  probLinks.forEach((item) => {
    let probName = item.text;
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(probName))
    l_probList.appendChild(li);
  });
}

// show page properties
window.onload = (function () {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getPageProp"}, function(pageProp) {
      if(typeof pageProp == "undefined") {
        errorLog("returned undefined");
        if(chrome.runtime.lastError) {
          // We couldn't talk to the content script, probably it's not there
          errorLog("unexpected error");
        }
      } else {
        pageProp = JSON.parse(pageProp);
        showWhatPage(pageProp.whatPage);
        if(pageProp.whatPage == "blog") {
          showProbList(pageProp.probLinks);
        }
      }
    });
  });
});

// print webpage
button_print.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let url = tabs[0].url;
    let isProblemPage = (url.search('problem') != -1);
    let isBlogPage = (url.search('blog') != -1);
    let fileToExec = (
      isProblemPage? './printProb.js' : 
      isBlogPage? './printTutorial.js' :
      'printUnsupported.js'
    );
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: fileToExec});
  });
};

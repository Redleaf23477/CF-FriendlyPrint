
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

let appSettings = {
  mode: "modern"
};

//////////////////////////////////////////////////////////////////////////////
// Layer Logics
//////////////////////////////////////////////////////////////////////////////

function showWhatPage(whatPage) {
  p_whatPage.innerText = "This is a " + whatPage + " page!";
}

function showProbList(probDict) {
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

function getPrintList() {
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

if(appSettings.mode == "modern") {
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
}

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
    // if modern mode, pass list of problems to be printed
    if(isBlogPage == true && appSettings.mode == "modern") {
      let param = { printList : getPrintList() };
      chrome.tabs.executeScript(
        tabs[0].id,
        {code:"let printSettings = " + JSON.stringify(param) + ";"}
      );
    }
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: fileToExec}
    );
  });
};

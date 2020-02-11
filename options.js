
let appSettings = {
  mode: undefined
};

//////////////////////////////////////////////////////////////////////////////
// Elements in options.html
//////////////////////////////////////////////////////////////////////////////

let sel_appMode = document.getElementById("sel_appMode");
let introDivs = document.querySelectorAll(".appMode_intro");

//////////////////////////////////////////////////////////////////////////////
// Function
//////////////////////////////////////////////////////////////////////////////

let showModeIntro = () => {
  introDivs.forEach((item) => {
    item.classList.remove("loading_element");
    if(item.id == appSettings.mode + "_intro") {
      item.classList.remove("hidden_div");
      item.classList.add("show_div");
    } else {
      item.classList.remove("show_div");
      item.classList.add("hidden_div");
    }
  });
};

//////////////////////////////////////////////////////////////////////////////
// Get data from chrome storage
//////////////////////////////////////////////////////////////////////////////

chrome.storage.sync.get("appMode", (data) => { 
  appSettings.mode = data.appMode; 
  // set default value in #sel_appMode
  for(let i = 0; i < sel_appMode.options.length; i++) {
    let opt = sel_appMode.options[i];
    if(opt.value == appSettings.mode) {
      opt.selected = true; break;
    }
  }
  sel_appMode.classList.remove("loading_element");
  showModeIntro(); 
});

//////////////////////////////////////////////////////////////////////////////
// Main scripts
//////////////////////////////////////////////////////////////////////////////

// store setting when #sel_appMode onChange
sel_appMode.addEventListener("change", () => {
  chrome.storage.sync.set({appMode: sel_appMode.value}, ()=>{
    alert("appMode set to " + sel_appMode.value);
  });
  appSettings.mode = sel_appMode.value;
  showModeIntro();
});
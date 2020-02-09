
function printTutorial()
{
  // header
  document.getElementById('header').remove();
  // menu box
  document.getElementsByClassName('roundbox menu-box')[0].remove();
  document.getElementsByClassName('roundbox meta')[0].remove();
  document.getElementsByClassName('second-level-menu')[0].remove();
  // sidebar
  document.getElementById('sidebar').remove();
  // pageContent
  document.getElementById('pageContent').className = "";
  document.getElementsByClassName('comments')[0].remove();
  // footer
  document.getElementById('footer').remove();

  // print
  window.print();
  location.reload();
  return true;
}

function removeUnwantedProblems(printList) {
  let printListHrefs = [];
  printList.forEach((item) => { printListHrefs.push(item.href); });
  let div = document.querySelector(".ttypography").childNodes;
  console.log(div);
  let trashCan = [];
  let isProbLink = (link) => {
    return link.search(/\/problem\//i) != -1;
  };
  let currentProb = "NA"; // stores link of problem
  for(let child of div) {
    if("querySelector" in child) {
      let a = child.querySelector("a");
      if(a === null) {
        // do nothing
      } else if (isProbLink(a.href)) {
        currentProb = a.href;
      }
    }
    if(!printListHrefs.includes(currentProb)) {
      trashCan.push(child);
    }
  }
  console.log(printListHrefs);
  console.log(trashCan);
  trashCan.forEach((node) => { node.remove(); });
}

// printSettings : declared by popup.js
console.log(printSettings);
if(appSettings.mode == "modern") {
  console.log("Let's kill problems!!!")
  removeUnwantedProblems(printSettings.printList);
}
printTutorial();

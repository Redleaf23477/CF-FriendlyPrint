
//////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////

/*
 * printBlog
 *   Remove dom elements that has nothing to do with blog contents.
 *   Then, trigger browser's print webpage function
 *   Finally, reload the webpage
 * 
 * @return null
 */
let printBlog = () => {
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
}

/*
 * removeUnwantedProblems
 *   If print blog page in "normal" mode, remove dom elements except for that 
 * of the checked problems.
 * 
 * @param array printList - array of objects storing info of checked problems
 *   ( { href: (string)problem  href, name: (string) problem name } )
 * @return null
 */
let removeUnwantedProblems = (printList) => {
  let printListHrefs = [];
  printList.forEach((item) => { printListHrefs.push(item.href); });
  let div = document.querySelector(".ttypography").childNodes;
  console.log(div);
  let trashCan = [];
  let isProbLink = (link) => {
    return link.search(/\/problem\//i) != -1;
  };
  let currentProb = "NA"; // stores href of problem
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
  trashCan.forEach((node) => { node.remove(); });
}

//////////////////////////////////////////////////////////////////////////////
// Main script
//////////////////////////////////////////////////////////////////////////////

/*
 * Variables injected from contentScript.js
 * (Object) printSettings - parameters for printing
 * (Object) appSettings - extension settings
 */

if(appSettings.mode == "normal" && printSettings.pageType == "tutorial") {
  removeUnwantedProblems(printSettings.printList);
}
printBlog();

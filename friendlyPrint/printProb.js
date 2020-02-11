
//////////////////////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////////////////////

/*
 * printProbPage
 *   Remove dom elements that has nothing to do with problem contents and some
 *   problem info so that most problem can fit in a single A4 paper.
 *   Then, trigger browser's print webpage function
 *   Finally, reload the webpage
 * 
 * @return null
 */
let printProbPage = () => {
    // header
    document.getElementById('header').remove();
    // menu box
    document.getElementsByClassName('roundbox menu-box')[0].remove();
    document.getElementsByClassName('second-level-menu')[0].remove();
    // sidebar
    document.getElementById('sidebar').remove();
    // pageContent
    document.getElementById('pageContent').className = "";
    document.getElementsByClassName('time-limit')[0].remove();
    document.getElementsByClassName('memory-limit')[0].remove();
    document.getElementsByClassName('input-file')[0].remove();
    document.getElementsByClassName('output-file')[0].remove();
    // footer
    document.getElementById('footer').remove();

    // print
    window.print();
    location.reload();
}

//////////////////////////////////////////////////////////////////////////////
// Main script
//////////////////////////////////////////////////////////////////////////////

/*
 * Variables injected from contentScript.js
 * (Object) printSettings - parameters for printing
 * (Object) appSettings - extension settings
 */

printProbPage();

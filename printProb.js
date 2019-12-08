function printProbPage()
{
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
    return true;
}
printProbPage();

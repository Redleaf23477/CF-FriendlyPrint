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
printTutorial();

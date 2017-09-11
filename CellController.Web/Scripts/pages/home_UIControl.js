var boolMenu = false;
var menuID = "";

function show(id)
{
    document.getElementById(id).style.display = 'block';
}

function hide(id)
{
    document.getElementById(id).style.display = 'none';
}

function set(id)
{
    boolMenu = true;
    menuID = id;
}

function reset()
{
    boolMenu = false;
}

function processMenu()
{
    setCookie('isMenu', boolMenu, 30);
    setCookie('menuID', menuID, 30);
}

function insertAfter(newElement, targetElement) {
    // target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;

    // if the parents lastchild is the targetElement...
    if (parent.lastChild == targetElement) {
        // add the newElement after the target element.
        parent.appendChild(newElement);
    } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
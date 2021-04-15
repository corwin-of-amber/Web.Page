function tog(id) {
    var elt = document.getElementById(id);
    if (elt.style.display == "none")
        elt.style.display = "block";
    else
        elt.style.display = "none";
}

window.addEventListener('DOMContentLoaded', () => {
    var addr = "shacha";
    addr += "ri@theplacion";
    addr = addr.replace('theplac', 'techn');
    var a = document.querySelector('a#me');
    a.setAttribute('href', "mailto:"+addr.replace('tech', 'cs.tech')+".ac.il");
    a.innerHTML = addr;
});

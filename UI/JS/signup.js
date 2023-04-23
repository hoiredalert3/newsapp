let l1_continue_btn = document.getElementById('l1-continue-btn');
let l2_back_btn = document.getElementById('l2-back-btn');
let signup_btn = document.getElementById('signup-btn');
var l1 = document.getElementById('signup-l1');
var l2 = document.getElementById('signup-l2');

document.getElementById('signup-l2').style.visibility = 'hidden';

function swapOverlay(hide, show) {
    hide.style.visibility = 'hidden';
    show.style.visibility = 'visible';
}

l1_continue_btn.onclick = function () {
    swapOverlay(l1, l2);
}

l2_back_btn.onclick = function () {
    swapOverlay(l2, l1);
}

signup_btn.onclick = function () {
    // do shits...
    window.location.href = './signin.html'
}
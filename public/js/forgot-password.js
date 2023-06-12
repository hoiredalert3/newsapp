// var l1 = document.getElementById('fpw-layout-1');
// var l2 = document.getElementById('fpw-layout-2');
// var l3 = document.getElementById('fpw-layout-3');

// l2.style.visibility = 'hidden';
// l3.style.visibility = 'hidden';

// function switchLayout(hide, show) {
//     hide.style.visibility = 'hidden';
//     show.style.visibility = 'visible';
// }

// // document.querySelector('#fpw-layout-1>i.back-btn').onclick = function () {
// //     window.location.href = '/signin';
// // }

// document.querySelector('#fpw-layout-1>button').onclick = function () {
//     // send a request to server for OTP
//     switchLayout(l1, l2);
// }

// document.querySelector('#fpw-layout-2>i.back-btn').onclick = function () {
//     switchLayout(l2, l1);
// }

// document.querySelector('#fpw-layout-2>button').onclick = function () {
//     // verify OTP
//     switchLayout(l2, l3);
// }

// document.querySelector('#fpw-layout-3>i.back-btn').onclick = function () {
//     switchLayout(l3, l2);
// }

// // document.querySelector('#fpw-layout-3>button').onclick = function () {
// //     // request password change
// //     window.location.href = '/signin';
// // }

function setupOtpBoxes() {
    var otp_boxes = document.querySelectorAll('.otp-container>input');

    otp_boxes.forEach(function (box, index) {
        box.addEventListener('input', function () {
            if (index != otp_boxes.length - 1) {
                otp_boxes[index + 1].focus();
            }
            else
                box.blur();
        })
    })
}

function checkPasswordConfirm(formId){
    let password = document.querySelector(`#${formId} [name=password]`)
    let cfPassword = document.querySelector(`#${formId} [name=confirmPassword]`)
    if(password.value != cfPassword.value){
      cfPassword.setCustomValidity('Mật khẩu không khớp!')
      cfPassword.reportValidity()
    }
    else{
      cfPassword.setCustomValidity('')
    }
  }
  
setupOtpBoxes();
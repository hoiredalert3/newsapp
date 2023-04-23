document.querySelectorAll('#login-btn, #facebook-login-btn, #google-login-btn').forEach(element => {
    element.onclick = function () {
        window.location.href = './index.html';
    }
})
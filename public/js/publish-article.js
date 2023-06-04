LABEL_CONTAINER_CLASS = "label--container";


document.addEventListener('keydown', function (event) {
    if (event.keyCode === 27) {
        hideAddLabelDisplay();
    }
    if (event.keyCode === 13){
        addNewLabel();
    }
});

document.querySelector('form').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

function removeLabel(index) {
    let labels = document.getElementsByClassName(LABEL_CONTAINER_CLASS);
    labels[index].remove();
    let imgs = document.querySelectorAll('.'+LABEL_CONTAINER_CLASS + ' > img');
    for (let i = index; i < imgs.length; i++) {
        imgs[i].onclick = function () {
            removeLabel(i);
        }
    }
}

function addNewLabel() {
    if(document.getElementById("new-label-input").value.length == 0)
    return;
    let container = document.createElement('div');
    let p = document.createElement('p');
    let img = document.createElement('img');

    p.innerHTML = document.getElementById("new-label-input").value.toUpperCase();
    document.getElementById("new-label-input").value = "";
    img.src = "/img/icons/exit.png";
    container.classList.add(LABEL_CONTAINER_CLASS);

    container.appendChild(p);
    container.appendChild(img);
    document.getElementById("grid-label--container").appendChild(container);
    container.onclick = function() {
        removeLabel(document.getElementsByClassName(LABEL_CONTAINER_CLASS).length - 1);
    };
    hideAddLabelDisplay();
}

function showAddLabelDisplay(){
    document.getElementById("add-label-display").style.display = "flex";
}

function hideAddLabelDisplay() {
    document.getElementById("add-label-display").style.display = "none";
}

function redirectToPage(page){
    window.location.href = page;
}
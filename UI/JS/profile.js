const PROFILE_PIC_INPUT_ID = "profile-pic";
const PROFILE_PIC_IMG_CLASS = "img-avatar";
const SUBSCRIBE_BTN_ID = "subscribe-btn";
const PREMIUM_DISPLAY_ID = "premium-display";
const ROLE_NAME_ID = "roles";
const SECTION_CLASS = "profile-section";
const CURRENT_SECTION_CLASS = "current-section";
const SECTION_CONTENT_CLASS = "section-content";
const CURRENT_SECTION_CONTENT_CLASS = "current-section-content";
const SPECIAL_INPUT_CLASS = "special-input-container";
const LIST_OF_CONTENT_CLASS = "list-of-content";
const CURRENT_CONTENT_CLASS = "current-content";
const LIST_OF_ARTICLE_CLASS = "list-of-article--container";
const CURRENT_LIST_OF_ARTICLE_CLASS = "current-list-of-article--container";

// Đổi các trạng thái User
var CURRENT_ROLE = 1;

const ROLE_NAME = {
    0: "Error",
    1: "Người đọc",
    2: "Người đọc",
    3: "Phóng viên",
    4: "Biên tập viên",
    5: "Administrator",
}

changeToCurrentUser(CURRENT_ROLE);

function uploadImgUser() {
    const uploadImg = document.getElementById(PROFILE_PIC_INPUT_ID);
    const userAvatar = document.getElementsByClassName(PROFILE_PIC_IMG_CLASS);
    const file = uploadImg.files[0];
    reader = new FileReader();
    reader.addEventListener('load', () => {
        for (let i = 0; i < userAvatar.length; i++) {
            userAvatar[i].src = reader.result;
        }
    });
    if (file) {
        reader.readAsDataURL(file);
    }
}


function changeToCurrentUser(index) {
    changeRoleName(index);
    if (index < 3 || index == 5) {
        document.getElementsByClassName(SECTION_CLASS)[1].style.display = "none";
        if (index == 1) {
            document.getElementById(SUBSCRIBE_BTN_ID).style.display = "inline-block";
            document.getElementById(PREMIUM_DISPLAY_ID).style.display = "none";
        }
        else if (index == 2) {
            document.getElementById(SUBSCRIBE_BTN_ID).style.display = "none";
            document.getElementById(PREMIUM_DISPLAY_ID).style.display = "flex";
        }
    }
    else {
        document.getElementById(SUBSCRIBE_BTN_ID).style.display = "none";
        document.getElementById(PREMIUM_DISPLAY_ID).style.display = "none";
        document.getElementsByClassName(SECTION_CLASS)[1].style.display = "block";
        if (index == 3) {
            document.querySelectorAll('.' + SECTION_CLASS + ' > p')[1].textContent = "Các bài viết của tôi";
            document.getElementsByClassName(SPECIAL_INPUT_CLASS)[0].style.display = "flex";
        }
        else if (index == 4) {
            document.querySelectorAll('.' + SECTION_CLASS + ' > p')[1].textContent = "Danh sách duyệt";
            document.getElementsByClassName(SPECIAL_INPUT_CLASS)[1].style.display = "flex";
        }

    }

}

function changeRoleName(index) {
    document.getElementById(ROLE_NAME_ID).innerHTML = ROLE_NAME[index];
}

function changeSection(index) {
    let secs = document.getElementsByClassName(SECTION_CLASS);
    for (let i = 0; i < secs.length; i++) {
        secs[i].classList.remove(CURRENT_SECTION_CLASS);
    }
    secs[index].classList.add(CURRENT_SECTION_CLASS);
    if (index == 1 && CURRENT_ROLE == 4)
        changeSectionContent(2);
    else changeSectionContent(index);
}

function changeSectionContent(index) {
    let section_contents = document.getElementsByClassName(SECTION_CONTENT_CLASS);
    for (let i = 0; i < section_contents.length; i++) {
        section_contents[i].classList.remove(CURRENT_SECTION_CONTENT_CLASS);
    }
    section_contents[index].classList.add(CURRENT_SECTION_CONTENT_CLASS);
}

function changeIndexOfContent(index) {
    let items = document.querySelectorAll('.' + LIST_OF_CONTENT_CLASS + ' li');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove(CURRENT_CONTENT_CLASS);
    }
    items[index].classList.add(CURRENT_CONTENT_CLASS);
    changeListOfAricle(index);
}

function changeListOfAricle(index) {
    let list_of_article_container = document.getElementsByClassName(LIST_OF_ARTICLE_CLASS);
    for (let i = 0; i < list_of_article_container.length; i++) {
        list_of_article_container[i].classList.remove(CURRENT_LIST_OF_ARTICLE_CLASS);
    }
    list_of_article_container[index].classList.add(CURRENT_LIST_OF_ARTICLE_CLASS);
}

function displaySubscribe() {
    document.getElementById("container-0").style.display = "flex";
}

function exitSubscribe() {
    document.getElementById("container-0").style.display = "none";
}

function buyPremium() {
    exitSubscribe();
    CURRENT_ROLE = (CURRENT_ROLE + 1) % 6;
    if (CURRENT_ROLE == 0) CURRENT_ROLE = 1;
    changeToCurrentUser(CURRENT_ROLE);
    // ....
}

function switchUser() {
    CURRENT_ROLE = (CURRENT_ROLE + 1) % 6;
    if (CURRENT_ROLE == 0) CURRENT_ROLE = 1;
    changeToCurrentUser(CURRENT_ROLE);
}
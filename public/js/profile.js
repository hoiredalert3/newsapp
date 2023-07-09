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

// changeToCurrentUser(CURRENT_ROLE);

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


// function changeToCurrentUser(index) {
//     // document.getElementsByClassName(SPECIAL_INPUT_CLASS)[0].style.display = "none";
//     // document.getElementsByClassName(SPECIAL_INPUT_CLASS)[1].style.display = "none";
//     // document.getElementById(SUBSCRIBE_BTN_ID).style.display = "none";
//     // document.getElementById(PREMIUM_DISPLAY_ID).style.display = "none";
//     // document.getElementsByClassName(SECTION_CLASS)[1].style.display = "none";
//     // document.getElementsByClassName("div4")[0].style.display = "none";
//     // changeSection(0);
//     if (index < 3 || index == 5) {
//         if (index == 1) {
//             document.getElementById(SUBSCRIBE_BTN_ID).style.display = "inline-block";
//         }
//         else if (index == 2) {
//             document.getElementById(PREMIUM_DISPLAY_ID).style.display = "flex";
//         }
//         else if (index == 5) {
//             document.getElementsByClassName("div4")[0].style.display = "block";
//         }
//     }
//     else {
//         document.getElementsByClassName(SECTION_CLASS)[1].style.display = "block";
//         if (index == 3) {
//             document.querySelectorAll('.' + SECTION_CLASS + ' > p')[1].textContent = "Các bài viết của tôi";
//             document.getElementsByClassName(SPECIAL_INPUT_CLASS)[0].style.display = "flex";
//         }
//         else if (index == 4) {
//             document.querySelectorAll('.' + SECTION_CLASS + ' > p')[1].textContent = "Danh sách duyệt";
//             document.getElementsByClassName(SPECIAL_INPUT_CLASS)[1].style.display = "flex";
//         }
//     }

// }

function removeClass(class_name) {
    let list = document.querySelectorAll('.' + class_name);
    if (list.length > 0)
        list.forEach(item => {
            item.classList.remove(class_name);
        })
}

function setFirstSubsection(section_index) {
    removeClass(CURRENT_LIST_OF_ARTICLE_CLASS);
    removeClass(CURRENT_CONTENT_CLASS);

    let current_tab = document.querySelectorAll('.' + SECTION_CONTENT_CLASS).item(section_index);
    current_tab.querySelectorAll('.' + LIST_OF_CONTENT_CLASS + '>ul>li')[0].classList.add(CURRENT_CONTENT_CLASS);
    current_tab.querySelectorAll('.' + LIST_OF_ARTICLE_CLASS)[0].classList.add(CURRENT_LIST_OF_ARTICLE_CLASS);
}


function changeSection(index) {
    let secs = document.getElementsByClassName(SECTION_CLASS);
    for (let i = 0; i < secs.length; i++) {
        secs[i].classList.remove(CURRENT_SECTION_CLASS);
    }
    secs[index].classList.add(CURRENT_SECTION_CLASS);
    if (index == 1) {
        changeSectionContent(1);
        setFirstSubsection(1);
    }
    else changeSectionContent(index);
}

function changeSectionContent(index) {
    let section_contents = document.getElementsByClassName(SECTION_CONTENT_CLASS);
    for (let i = 0; i < section_contents.length; i++) {
        section_contents[i].classList.remove(CURRENT_SECTION_CONTENT_CLASS);
    }
    section_contents[index].classList.add(CURRENT_SECTION_CONTENT_CLASS);
}

function changeIndexOfContent(section_idx, index) {
    let current_tab = document.querySelectorAll('.' + SECTION_CONTENT_CLASS)[section_idx];

    let items = current_tab.querySelectorAll('.' + LIST_OF_CONTENT_CLASS + ' li');
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove(CURRENT_CONTENT_CLASS);
    }
    items[index].classList.add(CURRENT_CONTENT_CLASS);
    changeListOfAricle(section_idx, index);
}

function changeListOfAricle(section_idx, index) {
    let current_tab = document.querySelectorAll('.' + SECTION_CONTENT_CLASS)[section_idx];

    let list_of_article_container = current_tab.getElementsByClassName(LIST_OF_ARTICLE_CLASS);
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

async function buyPremium() {
}

// function switchUser() {
//     CURRENT_ROLE = (CURRENT_ROLE + 1) % 6;
//     if (CURRENT_ROLE == 0) CURRENT_ROLE = 1;
//     changeToCurrentUser(CURRENT_ROLE);
// }

function displayAdmin() {
    window.location.href = '/admin';
}

function toSignIn() {
    window.location.href = '/users/login';
}

function updateInfos(event) {
    event.prevent
}
function submitInfomations() {

}
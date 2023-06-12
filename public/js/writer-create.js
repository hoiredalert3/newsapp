// USER_STATE = {
//     0: "guest",
//     1: "reader",
//     2: "subcriber",
//     3: "writer",
//     4: "editor",
//     5: "administrator"
// };

// CATEGORIES = {
//     'Thời sự': ['Chính trị', 'Quốc phòng', 'Lao động', 'Dân sinh', 'Thời luận', 'Việc làm', 'Quyền được biết', 'Pháp luật', 'Phóng sự/Điều tra'],
//     'Thế giới': ['Kinh tế thế giới', 'Quân sự', 'Góc nhìn', 'Hồ sơ', 'Người Việt năm châu', 'Chuyện lạ'],
//     'Kinh tế': ['Kinh tế xanh', 'Làm giàu', 'Doanh nhân', 'Ngân hàng', 'Chính sách - phát triển', 'Địa ốc', 'Doanh nghiệp', 'Chứng khoán'],
//     'Giáo dục': ['Tuyển sinh', 'Chọn nghề - chọn trường', 'Du học', 'Cẩm nang tuyển sinh 2023', 'Phụ huynh', 'Nhà trường'],
//     'Du lịch': ['Khám phá', 'Tin tức sự kiện', 'Chơi gì, ăn đâu, đi thế nào', 'Bất động sản du lịch', 'Câu chuyện du lịch'],
//     'Sức khỏe': ['Khỏe đẹp mỗi ngày', 'Niềm tin vào y đức', 'Làm đẹp', 'Giới tính'],
//     'Văn hóa': ['Câu chuyện văn hóa', 'Khảo cứu', 'Xem - nghe', 'Sống đẹp']
// };

// CURRENT_USER = 3;
// const USERS_HEADER_CLASS = "template-user--header";
// const CURRENT_USER_HEADER_CLASS = "current-user--header";
// changeUser(CURRENT_USER);

// function changeUser(index) {
//     users = document.getElementsByClassName(USERS_HEADER_CLASS);
//     for (let i = 0; i < users.length; i++) {
//         users[i].classList.remove(CURRENT_USER_HEADER_CLASS);
//     }
//     users[index].classList.add(CURRENT_USER_HEADER_CLASS);
// }

// (function populateCatSelector() {
//     let catSelector = document.getElementById('category');
//     let entries = Object.entries(CATEGORIES);

//     entries.forEach(entry => {
//         let group = document.createElement('optgroup');
//         group.setAttribute('label', entry[0]);

//         entry[1].forEach(sub_cat => {
//             let option = document.createElement('option');
//             option.setAttribute('value', sub_cat);
//             option.innerText = sub_cat;
//             group.appendChild(option);
//         })
//         catSelector.appendChild(group);
//     })
// })();

// handle tags

var tags = [];
document.querySelector('#modal-add-btn').onclick = function () {
    let inp = document.getElementById('tag-input');
    if (inp.value.length > 0 && !tags.includes(inp.value)) {
        tags.push(inp.value);
        addToTagsList(inp.value);
    }
    document.querySelector('.modal-close-btn').click();
}

document.querySelectorAll('.modal-close-btn').forEach(function (element) {
    element.onclick = function () {
        document.getElementById('tag-input').value = '';
    }
})

function addToTagsList(tag) {
    var container = document.getElementById('tags-container');

    function createTagContainer(tag) {
        let outer_div = document.createElement('div');
        outer_div.classList.add('tag-container');

        let text_span = document.createElement('span');
        text_span.classList.add('tag-name');
        text_span.innerText = tag;

        let del_icon = document.createElement('i');
        del_icon.classList.add('bi', 'bi-x', 'fs-4');
        del_icon.setAttribute('type', 'button');
        del_icon.onclick = function () {
            container.removeChild(outer_div);
            let index = tags.indexOf(tag);
            if (index != -1) {
                tags.splice(index, 1);
            }
        }

        outer_div.appendChild(text_span);
        outer_div.appendChild(del_icon);

        return outer_div;
    }
    container.appendChild(createTagContainer(tag));
}

// handle image upload request
const uploadImage = (blobInfo, progress) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', '/users/imgupload');

    xhr.upload.onprogress = (e) => {
        progress(e.loaded / e.total * 100);
    };

    xhr.onload = () => {
        if (xhr.status === 403) {
            reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
            return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
            reject('HTTP Error: ' + xhr.status);
            return;
        }

        const json = JSON.parse(xhr.responseText);

        if (!json) {
            reject('No response from server');
            return;
        }

        if (!json.location && json.errorMessage) {
            reject('Error: ' + json.errorMessage);
            return;
        }

        if (typeof json.location != 'string') {
            reject('Invalid JSON: ' + xhr.responseText);
            return;
        }

        resolve(json.location);
    };

    xhr.onerror = () => {
        reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    };

    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
});

function cancelEditing(event) {
    event.preventDefault();
    window.location.href = '/users/profile';
}

function showAlert(message) {
    document.querySelector('#alertModal .modal-content div').innerText = message;
    document.getElementById('alertTriggerBtn').click();
}

// get the first image in the content as thumbnail
function getThumbnail(content) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(content, 'text/html');
    img = doc.querySelector('img');
    if (img)
        return img.getAttribute('src');
    return '';
}

async function submitArticle(event) {
    event.preventDefault();

    let postParams = {};

    postParams.authorId = document.getElementById('authorId').value;
    postParams.categories = [document.querySelector('#category option:checked').parentElement.getAttribute('value'), document.getElementById('category').value];
    postParams.tags = tags;
    postParams.title = document.getElementById('title').value;
    postParams.summary = document.getElementById('summary').value;
    postParams.content = tinymce.activeEditor.getContent();
    postParams.thumbnailUrl = getThumbnail(postParams.content);
    if (postParams.title.length == 0) {
        showAlert('Bài viết chưa có tiêu đề!');
        return;
    }
    if (postParams.summary.length == 0) {
        showAlert('Bài viết chưa có nội dung tóm tắt!');
        return;
    }
    if (postParams.tags.length == 0) {
        showAlert('Bài viết cần có ít nhất 1 nhãn!');
        return;
    }
    if (postParams.thumbnailUrl.length == 0) {
        showAlert('Bài viết cần chứa ít nhất 1 ảnh để làm thumbnail!');
        return
    }

    //console.log("Posting ");
    let res = await fetch('/users/submit-article', {
        method: 'post',
        body: JSON.stringify(postParams),
        headers: { 'Content-type': 'application/json' }
    });

    let json = await res.json();
    //console.log(JSON.stringify(json));
    if (json.completed)
        showAlert('Bài viết đã được tạo');
    else
        showAlert('Có lỗi xảy ra trong quá trình tạo bài viết');
}

// document.querySelectorAll('.buttons/*').forEach(element => {
//     element.onclick = function () {
//         // ...
//         window.location.href = '/profile';
//     }
// })
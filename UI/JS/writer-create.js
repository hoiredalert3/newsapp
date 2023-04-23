USER_STATE = {
    0: "guest",
    1: "reader",
    2: "subcriber",
    3: "writer",
    4: "editor",
    5: "administrator"
};

CATEGORIES = {
    'Thời sự': ['Chính trị', 'Quốc phòng', 'Lao động', 'Dân sinh', 'Thời luận', 'Việc làm', 'Quyền được biết', 'Pháp luật', 'Phóng sự/Điều tra'],
    'Thế giới': ['Kinh tế thế giới', 'Quân sự', 'Góc nhìn', 'Hồ sơ', 'Người Việt năm châu', 'Chuyện lạ'],
    'Kinh tế': ['Kinh tế xanh', 'Làm giàu', 'Doanh nhân', 'Ngân hàng', 'Chính sách - phát triển', 'Địa ốc', 'Doanh nghiệp', 'Chứng khoán'],
    'Giáo dục': ['Tuyển sinh', 'Chọn nghề - chọn trường', 'Du học', 'Cẩm nang tuyển sinh 2023', 'Phụ huynh', 'Nhà trường'],
    'Du lịch': ['Khám phá', 'Tin tức sự kiện', 'Chơi gì, ăn đâu, đi thế nào', 'Bất động sản du lịch', 'Câu chuyện du lịch'],
    'Sức khỏe': ['Khỏe đẹp mỗi ngày', 'Niềm tin vào y đức', 'Làm đẹp', 'Giới tính'],
    'Văn hóa': ['Câu chuyện văn hóa', 'Khảo cứu', 'Xem - nghe', 'Sống đẹp']
};

CURRENT_USER = 3;
const USERS_HEADER_CLASS = "template-user--header";
const CURRENT_USER_HEADER_CLASS = "current-user--header";
changeUser(CURRENT_USER);

function changeUser(index) {
    users = document.getElementsByClassName(USERS_HEADER_CLASS);
    for (let i = 0; i < users.length; i++) {
        users[i].classList.remove(CURRENT_USER_HEADER_CLASS);
    }
    users[index].classList.add(CURRENT_USER_HEADER_CLASS);
}

(function populateCatSelector() {
    let catSelector = document.getElementById('category');
    let entries = Object.entries(CATEGORIES);

    entries.forEach(entry => {
        let group = document.createElement('optgroup');
        group.setAttribute('label', entry[0]);

        entry[1].forEach(sub_cat => {
            let option = document.createElement('option');
            option.setAttribute('value', sub_cat);
            option.innerText = sub_cat;
            group.appendChild(option);
        })
        catSelector.appendChild(group);
    })
})();

// handle tags

var tags = [];
document.querySelector('#modal-add-btn').onclick = function () {
    let inp = document.getElementById('tag-input');
    if (inp.value.length > 0 && !tags.includes(inp.value)) {
        tags.push(inp.value);
        addToTagsList(inp.value);
    }
    document.querySelector('.modal-close-btn').click();
    console.log(tags);
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


document.querySelectorAll('.buttons/*').forEach(element => {
    element.onclick = function () {
        // ...
        window.location.href = './profile.html';
    }
})
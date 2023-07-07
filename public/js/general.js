
// 1 phut update 1 lan
setInterval(updateYear, 60000);
const date_options = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
function updateYear() {
    date = new Date();
    today = date.toLocaleDateString('vi-VN', date_options);
    document.getElementById("current-year").innerHTML = date.getFullYear();
}

// // current user
// USER_STATE = {
//     0: "guest",
//     1: "reader",
//     2: "subcriber",
//     3: "writer",
//     4: "editor",
//     5: "administrator"
// };

// CURRENT_USER = 1;
// const USERS_HEADER_CLASS = "template-user--header";
// const CURRENT_USER_HEADER_CLASS = "current-user--header";
// changeUser(CURRENT_USER);

// function changeUser(index){
//     users = document.getElementsByClassName(USERS_HEADER_CLASS);
//     for(let i = 0; i < users.length; i++){
//         users[i].classList.remove(CURRENT_USER_HEADER_CLASS);
//     }
//     users[index].classList.add(CURRENT_USER_HEADER_CLASS);
// }
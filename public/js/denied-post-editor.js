const COMMENT_CLASS = "comment";
const TITLE_OF_DENY_CLASS = "title-deny";
const APPROVAL_BTN_CLASS = "approval-btn";
const DENIED_BTN_CLASS = "denied-btn";
const APPROVAL_ARTICLE_BTN_ID = "approval-article-btn";
const DENIED_ARTICLE_BTN_ID = "denied-article-btn";

function displayComment(index) {
  let cmts = document.getElementsByClassName(COMMENT_CLASS);
  let titles = document.getElementsByClassName(TITLE_OF_DENY_CLASS);
  let app_btns = document.getElementsByClassName(APPROVAL_BTN_CLASS);
  let den_btns = document.getElementsByClassName(DENIED_BTN_CLASS);
  cmts[index].style.display = "flex";
  titles[index].style.display = "block";
  app_btns[index].style.background = "transparent";
  den_btns[index].style.backgroundColor = "rgba(222, 222, 222, 0.5)";
}

function hideComment(index) {
  let cmts = document.getElementsByClassName(COMMENT_CLASS);
  let titles = document.getElementsByClassName(TITLE_OF_DENY_CLASS);
  let app_btns = document.getElementsByClassName(APPROVAL_BTN_CLASS);
  let den_btns = document.getElementsByClassName(DENIED_BTN_CLASS);
  cmts[index].style.display = "none";
  titles[index].style.display = "none";
  app_btns[index].style.backgroundColor = "rgba(222, 222, 222, 0.5)";
  den_btns[index].style.background = "transparent";
}

function checkDenied() {
  let cmts = document.getElementsByClassName(COMMENT_CLASS);
  for (let i = 0; i < cmts.length; i++)
    if (cmts[i].value.trim().length >= 1) return true;
  return false;
}

// displayComment(0)
// displayComment(1)
// displayComment(2)
// displayComment(3)
// displayComment(4)





// handle tags

var tags = [];
try {
  tags_span = document.getElementsByClassName("tag-name");
  var containerParent = document.getElementById("tags-container");
  var containerChild = document.querySelectorAll(".tag-container");
  for (var i = 0; i < tags_span.length; i++) {
    var span = tags_span[i].innerHTML;
    tags.push(span);
  }

  containerChild.forEach(item => {
    item.querySelector('i').onclick = () => {
      let tag = item.querySelector('span').innerHTML;
      let index = tags.indexOf(tag);
      if (index != -1) {
        tags.splice(index, 1);
      }
      containerParent.removeChild(item);
    }
  });

} catch (e) {
  console.log(e);
}

document.querySelector("#modal-add-btn").onclick = function () {
  let inp = document.getElementById("tag-input");
  if (inp.value.length > 0 && !tags.includes(inp.value)) {
    tags.push(inp.value);
    addToTagsList(inp.value);
  }
  document.querySelector(".modal-close-btn").click();
};

document.querySelectorAll(".modal-close-btn").forEach(function (element) {
  element.onclick = function () {
    document.getElementById("tag-input").value = "";
  };
});

function addToTagsList(tag) {
  var container = document.getElementById("tags-container");

  function createTagContainer(tag) {
    let outer_div = document.createElement("div");
    outer_div.classList.add("tag-container");

    let text_span = document.createElement("span");
    text_span.classList.add("tag-name");
    text_span.innerText = tag;

    let del_icon = document.createElement("i");
    del_icon.classList.add("bi", "bi-x", "fs-4");
    del_icon.setAttribute("type", "button");
    del_icon.onclick = function () {
      container.removeChild(outer_div);
      let index = tags.indexOf(tag);
      if (index != -1) {
        tags.splice(index, 1);
      }
    };

    outer_div.appendChild(text_span);
    outer_div.appendChild(del_icon);

    return outer_div;
  }
  container.appendChild(createTagContainer(tag));
}

// handle image upload request
const uploadImage = (blobInfo, progress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open("POST", "/users/imgupload");

    xhr.upload.onprogress = (e) => {
      progress((e.loaded / e.total) * 100);
    };

    xhr.onload = () => {
      if (xhr.status === 403) {
        reject({ message: "HTTP Error: " + xhr.status, remove: true });
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject("HTTP Error: " + xhr.status);
        return;
      }

      const json = JSON.parse(xhr.responseText);

      if (!json) {
        reject("No response from server");
        return;
      }

      if (!json.location && json.errorMessage) {
        reject("Error: " + json.errorMessage);
        return;
      }

      if (typeof json.location != "string") {
        reject("Invalid JSON: " + xhr.responseText);
        return;
      }

      resolve(json.location);
    };

    xhr.onerror = () => {
      reject(
        "Image upload failed due to a XHR Transport error. Code: " + xhr.status
      );
    };

    const formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
  });

function get_confirmation(title, message, callback) {
  document.querySelector("#confirmModal .modal-title").innerText = title;
  document.querySelector("#confirmModal .modal-body").innerText = message;
  tmp = () => {
    callback();
    document.querySelector("#confirmModal .reject-btn").click();
  };
  document.getElementById("confirmModal").addEventListener(
    "hide.bs.modal",
    () => {
      document
        .querySelector("#confirmModal .accept-btn")
        .removeEventListener("click", tmp);
    },
    { once: true }
  );
  document
    .querySelector("#confirmModal .accept-btn")
    .addEventListener("click", tmp, { once: true });
  document.getElementById("confirmModal-btn").click();
}

async function submitDraft() {
  console.log("Submitting draft");

  let postParams = {};

  postParams.authorId = document.getElementById("authorId").value;
  postParams.categories = [
    document
      .querySelector("#category option:checked")
      .parentElement.getAttribute("value"),
    document.getElementById("category").value,
  ];
  postParams.tags = tags;
  postParams.title = document.getElementById("title").value;
  postParams.summary = document.getElementById("summary").value;
  postParams.content = tinymce.activeEditor.getContent();
  postParams.thumbnailUrl = getThumbnail(postParams.content);

  if (
    !(
      postParams.title.length ||
      postParams.summary.length ||
      postParams.content.length ||
      postParams.thumbnailUrl.length
    )
  ) {
    showAlert("Bài viết cần có nội dung");
    return;
  }

  console.log("Posting...");
  let res = await fetch("/users/submit-draft", {
    method: "post",
    body: JSON.stringify(postParams),
    headers: { "Content-type": "application/json" },
  });

  let json = await res.json();
  console.log(JSON.stringify(json));
  if (json.completed) {
    showAlert("Bài viết đã được lưu", () => {
      window.location.href = "/users/profile";
    });
  } else showAlert("Có lỗi xảy ra trong quá trình lưu bài viết");
}

function cancelEditing(event) {
  event.preventDefault();
  get_confirmation(
    "Bài viết chưa được lưu",
    "Bạn có muốn lưu lại bài viết hiện tại không?",
    submitDraft
  );
}

function showAlert(message, callback = null) {
  document.querySelector("#alertModal .modal-content div").innerText = message;
  if (callback != null)
    document
      .getElementById("alertModal")
      .addEventListener("hidden.bs.modal", callback, { once: true });
  document.getElementById("alertTriggerBtn").click();
}

// get the first image in the content as thumbnail
function getThumbnail(content) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(content, "text/html");
  img = doc.querySelector("img");
  if (img) return img.getAttribute("src");
  return "";
}

async function submitArticle(event) {
  event.preventDefault();

  let postParams = {};

  postParams.authorId = document.getElementById("authorId").value;
  postParams.categories = [
    document
      .querySelector("#category option:checked")
      .parentElement.getAttribute("value"),
    document.getElementById("category").value,
  ];
  postParams.tags = tags;
  postParams.title = document.getElementById("title").value;
  postParams.summary = document.getElementById("summary").value;
  postParams.content = tinymce.activeEditor.getContent();
  postParams.thumbnailUrl = getThumbnail(postParams.content);
  if (document.getElementById("draftId") != null) {
    postParams.draftId = document.getElementById("draftId").value;
  } else if (document.getElementById("unappId") != null) {
    postParams.unappId = document.getElementById("unappId").value;
  }
  else if (document.getElementById("rejectedId") != null) {
    postParams.rejectedId = document.getElementById("rejectedId").value;
  }
  if (postParams.title.length == 0) {
    showAlert("Bài viết chưa có tiêu đề!");
    return;
  }
  if (postParams.summary.length == 0) {
    showAlert("Bài viết chưa có nội dung tóm tắt!");
    return;
  }
  if (postParams.tags.length == 0) {
    showAlert("Bài viết cần có ít nhất 1 nhãn!");
    return;
  }
  if (postParams.thumbnailUrl.length == 0) {
    showAlert("Bài viết cần chứa ít nhất 1 ảnh để làm thumbnail!");
    return;
  }

  //console.log("Posting ");
  let res = await fetch("/users/submit-article", {
    method: "post",
    body: JSON.stringify(postParams),
    headers: { "Content-type": "application/json" },
  });

  let json = await res.json();
  //console.log(JSON.stringify(json));
  if (json.completed) {
    showAlert("Bài viết đã được tạo", () => {
      window.location.href = "/users/profile";
    });
  } else showAlert("Có lỗi xảy ra trong quá trình tạo bài viết");
}

const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}
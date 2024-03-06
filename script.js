let storedPosts = [];
let currentPage = 1;
const itemsPerPage = 10;

const fetchAndDisplayPosts = () => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((json) => {
      storedPosts = json;
      displayPosts();
      renderPaginationIndex();
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
};
const displayPosts = () => {
  const lists = document.getElementById("lists");
  lists.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = storedPosts.slice(startIndex, endIndex);
  currentItems.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("postcomm");
    postElement.dataset.id = post.id;

    const titleElement = document.createElement("h1");
    titleElement.classList.add("titlecomm");
    titleElement.textContent = post.title;
    postElement.appendChild(titleElement);

    const bodyElement = document.createElement("p");
    bodyElement.classList.add("bodycomm");
    bodyElement.textContent = post.body;
    postElement.appendChild(bodyElement);

    const editButton = document.createElement("button");
    editButton.classList.add("editbtn");
    editButton.textContent = "Edit";
    editButton.onclick = editPost;
    postElement.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deletebtn");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = deletePost;
    postElement.appendChild(deleteButton);

    lists.appendChild(postElement);
  });
};
const generateNewId = () => {
  if (storedPosts.length === 0) return 1;
  return Math.max(...storedPosts.map((post) => post.id)) + 1;
};
const addPost = () => {
  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();

  if (title === "" || body === "") {
    return alert("Please fill in both title and body");
  }

  const newPost = {
    id: generateNewId(),
    userId: "1", // Assuming user ID is always 1 for simplicity
    title: title,
    body: body,
  };

  storedPosts.unshift(newPost);
  displayPosts();
  renderPaginationIndex();
  sendUpdatedData(storedPosts);

  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
};
const renderPaginationIndex = () => {
  const paginationIndex = document.getElementById("paginationIndex");
  paginationIndex.innerHTML = "";

  const totalPages = Math.ceil(storedPosts.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageIndexItem = document.createElement("li");
    pageIndexItem.textContent = i;
    pageIndexItem.addEventListener("click", () => {
      currentPage = i;
      displayPosts();
      renderPaginationIndex();
    });

    // Check if the current page matches the page number being rendered
    if (i === currentPage) {
      pageIndexItem.classList.add("active");
    }

    paginationIndex.appendChild(pageIndexItem);
  }
};
const deletePost = (event) => {
  const postElement = event.target.closest(".postcomm");
  const postId = parseInt(postElement.dataset.id);

  storedPosts = storedPosts.filter((post) => post.id !== postId);
  displayPosts();
  renderPaginationIndex();
  sendUpdatedData(storedPosts);

};
const editPost = (event) => {
  const postElement = event.target.closest(".postcomm");
  const postId = parseInt(postElement.dataset.id);
  const titleElement = postElement.querySelector(".titlecomm");
  const bodyElement = postElement.querySelector(".bodycomm");
  const editButton = postElement.querySelector(".editbtn");
  const deleteButton = postElement.querySelector(".deletebtn");

  const titleText = titleElement.textContent;
  const bodyText = bodyElement.textContent;

  const titleInput = document.createElement("input");
  titleInput.setAttribute("type", "text");
  titleInput.setAttribute("class", "edit-title");
  titleInput.setAttribute("value", titleText);

  const bodyInput = document.createElement("input");
  bodyInput.setAttribute("type", "text");
  bodyInput.setAttribute("class", "edit-body");
  bodyInput.setAttribute("value", bodyText);

  titleElement.innerHTML = "";
  bodyElement.innerHTML = "";

  titleElement.appendChild(titleInput);
  bodyElement.appendChild(bodyInput);

  editButton.style.display = "none"; // Hide the edit button
  deleteButton.style.display = "none"; // Hide the delete button

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const saveButton = document.createElement("button");
  saveButton.classList.add("savebtn");
  saveButton.textContent = "Save";
  saveButton.onclick = () => {
    saveEdit(postId, titleInput.value, bodyInput.value);
  };

  buttonContainer.appendChild(saveButton);
  postElement.appendChild(buttonContainer);
};
const saveEdit = (postId, newTitle, newBody) => {
  const editedPost = storedPosts.find((post) => post.id === postId);

  if (editedPost) {
    if (newTitle.trim() === "" || newBody.trim() === "") {
      alert("You can't edit it to be empty");
    } else {
      editedPost.title = newTitle;
      editedPost.body = newBody;
      displayPosts();
      sendUpdatedData(storedPosts);
    }
  }
};

const sendUpdatedData = (updatedData) => {
  fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error("Failed to send updated data to server");
      }
      return response.json();
  })
  .then((data) => {
      console.log("Updated data sent successfully:", data);
  })
  .catch((error) => {
      console.error("Error sending updated data to server:", error);
  });
};
fetchAndDisplayPosts();

let storedPosts = [];

const fetchAndDisplayPosts = () => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((json) => {
      storedPosts = json;
      displayPosts();
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
};

const displayPosts = () => {
  const lists = document.getElementById("lists");
  lists.innerHTML = "";
  storedPosts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.textContent =
      "ID: " +
      post.id +
      " User ID: " +
      post.userId +
      " Title: " +
      post.title +
      "  Body: " +
      post.body;
    lists.appendChild(postElement);
  });
};

const addPost = () => {
  const newPost = {
    id: generateNewId(),
    userId: document.getElementById("id").value,
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
  };

  storedPosts.unshift(newPost);
  displayPosts();

  document.getElementById("id").value = "";
  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
};

const generateNewId = () => {
  if (storedPosts.length === 0) return 1;
  return Math.max(...storedPosts.map((post) => post.id)) + 1;
};

const deletePostById = () => {
  const idToDelete = document.getElementById("deleteId").value;
  storedPosts = storedPosts.filter((post) => post.id !== parseInt(idToDelete));
  displayPosts();
  document.getElementById("deleteId").value = "";
};

const editPost = () => {
  const idToEdit = document.getElementById("editId").value;
  const userIdToEdit = document.getElementById("edituserID").value;
  const newTitle = document.getElementById("editTitle").value;
  const newBody = document.getElementById("editBody").value;

  const postToEdit = storedPosts.find((post) => post.id === parseInt(idToEdit));

  if (postToEdit) {
    postToEdit.userId = userIdToEdit;
    postToEdit.title = newTitle;
    postToEdit.body = newBody;
    displayPosts();
  }

  document.getElementById("editId").value = "";
  document.getElementById("editTitle").value = "";
  document.getElementById("editBody").value = "";
};

fetchAndDisplayPosts();
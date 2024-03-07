// Declare an empty array to store fetched posts
let storedPosts = [];
// Set the initial current page to 1
let currentPage = 1;
// Define the number of items to display per page
const itemsPerPage = 10;

// Function to fetch posts from a JSON API and display them
const fetchAndDisplayPosts = () => {
  // Fetch posts from the JSON API
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((json) => {
      // Store the fetched posts
      storedPosts = json;
      // Display posts on the page
      displayPosts();
      // Render pagination index
      renderPaginationIndex();
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
};

// Function to display posts on the page
const displayPosts = () => {
  // Get the container for displaying posts
  const lists = document.getElementById("lists");
  // Clear the container
  lists.innerHTML = "";

  // Calculate the start and end index of the posts to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Get the current items to display based on the current page
  const currentItems = storedPosts.slice(startIndex, endIndex);

  // Loop through each post and create HTML elements to display them
  currentItems.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("postcomm");
    postElement.dataset.id = post.id;
    lists.appendChild(postElement);

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
  });
};

// Function to generate a new ID for a post
const generateNewId = () => {
  // If there are no stored posts, return 1, otherwise generate a new ID
  if (storedPosts.length === 0) return 1;
  return Math.max(...storedPosts.map((post) => post.id)) + 1;
};

// Function to add a new post
const addPost = () => {
  // Get the title and body input values
  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();

  // Validate input fields
  if (title === "" || body === "") {
    return alert("Please fill in both title and body");
  }

  // Create a new post object with generated ID
  const newPost = {
    id: generateNewId(),
    userId: "1", // Assuming user ID is always 1 for simplicity and we could change it  later if we added login
    title: title,
    body: body,
  };

  // Add the new post to the beginning of the stored posts array
  storedPosts.unshift(newPost);
  // Display posts on the page
  displayPosts();
  // Render pagination index
  renderPaginationIndex();
  // Send updated data to the server
  sendUpdatedData(storedPosts);

  // Clear input fields after adding the post
  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
};

// Function to render pagination index
const renderPaginationIndex = () => {
  // Get the pagination index container
  const paginationIndex = document.getElementById("paginationIndex");
  // Clear the container
  paginationIndex.innerHTML = "";

  // Calculate the total number of pages
  const totalPages = Math.ceil(storedPosts.length / itemsPerPage);

  // Loop to create pagination index items
  for (let i = 1; i <= totalPages; i++) {
    const pageIndexItem = document.createElement("li");
    pageIndexItem.textContent = i;
    pageIndexItem.addEventListener("click", () => {
      // Update current page when a pagination index item is clicked
      currentPage = i;
      // Display posts for the new current page
      displayPosts();
      // Render pagination index again
      renderPaginationIndex();
    });

    // Check if the current page matches the page number being rendered and add 'active' class
    if (i === currentPage) {
      pageIndexItem.classList.add("active");
    }

    // Append pagination index item to the container
    paginationIndex.appendChild(pageIndexItem);
  }
};

// Function to delete a post
const deletePost = (event) => {
  // Find the post element and its ID
  const postElement = event.target.closest(".postcomm");
  const postId = parseInt(postElement.dataset.id);

  // Filter out the post to be deleted from the stored posts array
  storedPosts = storedPosts.filter((post) => post.id !== postId);
  // Display posts after deletion
  displayPosts();
  // Render pagination index again
  renderPaginationIndex();
  // Send updated data to the server
  sendUpdatedData(storedPosts);
};

// Function to edit a post
const editPost = (event) => {
  
  // Find the post element and its ID
  const postElement = event.target.closest(".postcomm");
  const postId = parseInt(postElement.dataset.id);
  // Find the title and body elements of the post
  const titleElement = postElement.querySelector(".titlecomm");
  const bodyElement = postElement.querySelector(".bodycomm");
  // Find edit, delete, and save buttons of the post
  const editButton = postElement.querySelector(".editbtn");
  const deleteButton = postElement.querySelector(".deletebtn");

  // Get the current title and body text of the post
  const titleText = titleElement.textContent;
  const bodyText = bodyElement.textContent;

  // Create textareas for editing the title and body
  const titleInput = document.createElement("textarea");
  titleInput.value = titleText;
  titleInput.setAttribute("class", "edit-title");

  const bodyInput = document.createElement("textarea");
  bodyInput.value = bodyText;
  bodyInput.setAttribute("class", "edit-body");

  // Clear the title and body elements and replace them with the textareas
  titleElement.innerHTML = "";
  bodyElement.innerHTML = "";

  titleElement.appendChild(titleInput);
  bodyElement.appendChild(bodyInput);

  // Hide edit and delete buttons
  editButton.style.display = "none";
  deleteButton.style.display = "none";

  // Create a container for the save button
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // Create and append the save button
  const saveButton = document.createElement("button");
  saveButton.classList.add("savebtn");
  saveButton.textContent = "Save";
  saveButton.onclick = () => {
    // Call saveEdit function when save button is clicked
    saveEdit(postId, titleInput.value, bodyInput.value);
  };

  buttonContainer.appendChild(saveButton);
  postElement.appendChild(buttonContainer);
};

// Function to save edited post
const saveEdit = (postId, newTitle, newBody) => {
  // Find the edited post in the stored posts array
  const editedPost = storedPosts.find((post) => post.id === postId);

  if (editedPost) {
    // Validate if new title or body is empty
    if (newTitle.trim() === "" || newBody.trim() === "") {
      alert("You can't edit it to be empty");
    } else {
      // Update the title and body of the edited post
      editedPost.title = newTitle;
      editedPost.body = newBody;
      // Display posts after editing
      displayPosts();
      // Send updated data to the server
      sendUpdatedData(storedPosts);
    }
  }
};

// Function to send updated data to the server
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

// Fetch and display posts when the page loads
fetchAndDisplayPosts();
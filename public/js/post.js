const pathArr = window.location.pathname.split("/");
const postId = pathArr[pathArr.length - 1];

const getPost = async () => {
  try {
    const post = await fetch(`/api/post/post-by-id/${postId}`, {
      method: "GET",
    });
    const comment = await fetch(`/api/comment/${postId}`, {
      method: "GET",
    });

    if (!post.ok || !comment.ok) {
      throw new Error("Failed to fetch data");
    }

    const postData = await post.json();
    const commentData = await comment.json();

    const currentUserId = sessionStorage.getItem("user_id");

    const user = await fetch(`/api/user/name/${currentUserId}`);
    if (!user.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await user.json();

    if (parseInt(currentUserId) === postData.created_by) {
      const deletePostButton = document.createElement("button");
      deletePostButton.textContent = "Delete Post";
      deletePostButton.onclick = deletePost;
      deletePostButton.id = "deletePost";
      deletePostButton.classList.add(
        "bg-green-600",
        "text-white",
        "px-4",
        "py-2",
        "rounded-md",
        "m-2"
      );
      document
        .getElementById("deletePostContainer")
        .appendChild(deletePostButton);
      const updatePostButton = document.createElement("button");
      updatePostButton.textContent = "Update Post";
      updatePostButton.id = "updatePost";
      updatePostButton.onclick = updatePostForm;
      updatePostButton.classList.add(
        "bg-green-600",
        "text-white",
        "px-4",
        "py-2",
        "rounded-md",
        "m-2"
      );
      document
        .getElementById("updatePostContainer")
        .appendChild(updatePostButton);
    }

    document.getElementById("title").textContent = postData.title;

    const descriptionElement = document.getElementById("description");
    descriptionElement.innerHTML = `<p id="postContent">${postData.content}</p><p>-${userData}</p>`;

    let commentSection = "";
    for (let i = 0; i < commentData.length; i++) {
      const name = await fetch(`/api/user/name/${commentData[i].user_id}`, {
        method: "GET",
      });

      if (!name.ok) {
        throw new Error("Failed to fetch user name");
      }

      const userName = await name.json();
      commentSection += `<p class="mb-4">${commentData[i].content}<br>-${userName}</p>`;
    }

    document.getElementById("commentSection").innerHTML = commentSection;
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const commentToPost = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`/api/comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: document.getElementById("commentContent").value,
        user_id: sessionStorage.getItem("user_id"),
        post_id: postId,
      }),
    });

    if (response.ok) {
      console.log("Comment successful");
      location.reload();
    } else {
      console.error("Comment failed");
    }
  } catch (error) {
    console.error("Error during Comment:", error);
  }
};

const deletePost = async () => {
  try {
    const destroyPost = await fetch(`/api/post/${postId}`, {
      method: "DELETE",
    });

    if (!destroyPost.ok) {
      throw new Error("Failed to delete post");
    }
    console.log("Post deleted successfully");
    document.location.replace("/dashboard");
  } catch (error) {
    console.error("Error deleting post:", error.message);
  }
};

const updatePostForm = async () => {
  const title = document.getElementById("title");
  const content = document.getElementById("postContent");

  const updateTitle = document.createElement("input");
  const updateContent = document.createElement("textarea");

  for (const attribute of title.attributes) {
    updateTitle.setAttribute(attribute.name, attribute.value);
  }
  for (const attribute of content.attributes) {
    updateContent.setAttribute(attribute.name, attribute.value);
  }
  updateTitle.value = title.textContent;
  updateContent.value = content.textContent;

  updateContent.classList.add("w-4/5", "h-40");

  title.parentNode.replaceChild(updateTitle, title);
  content.parentNode.replaceChild(updateContent, content);

  const deletePostContainer = document.getElementById("deletePostContainer");
  const updatePostBtn = document.getElementById("updatePost");

  updatePostBtn.onclick = updatePost;
  deletePostContainer.classList.add("hidden");
};

const updatePost = async () => {
  try {
    const updatePost = await fetch(`/api/post/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: document.getElementById("title").value,
        content: document.getElementById("postContent").value,
      }),
    });

    if (updatePost.ok) {
      document.location.replace("/dashboard");
    }
  } catch (err) {
    console.error(err);
  }
};


getPost();
document.getElementById("submitForm").addEventListener("click", commentToPost);
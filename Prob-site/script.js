document.addEventListener("DOMContentLoaded", () => {
    const postsContainer = document.getElementById("posts");
    const addPostForm = document.getElementById("addPostForm");
    const searchInput = document.getElementById("search");

    // Загружаем данные из localStorage
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    savedPosts.forEach((post, index) => renderPost(post, index));

    // Добавление нового поста
    addPostForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        const newPost = { title, content, comments: [] };
        savedPosts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(savedPosts));

        renderPost(newPost, savedPosts.length - 1);
        addPostForm.reset();
    });

    // Функция рендеринга поста
    function renderPost(post, index) {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.setAttribute("data-index", index);
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="comments-container"></div>
            <div class="comments">
                <textarea placeholder="Оставить отзыв"></textarea>
                <button>Добавить отзыв</button>
            </div>
            <button class="delete-post">Удалить статью</button>
        `;

        const commentsContainer = postElement.querySelector(".comments-container");
        const commentInput = postElement.querySelector(".comments textarea");
        const addCommentButton = postElement.querySelector(".comments button");
        const deletePostButton = postElement.querySelector(".delete-post");

        // Рендеринг комментариев
        renderComments(post.comments, commentsContainer);

        // Добавление отзывов
        addCommentButton.addEventListener("click", () => {
            const comment = commentInput.value;
            if (comment) {
                post.comments.push(comment);
                localStorage.setItem("posts", JSON.stringify(savedPosts));
                renderComments(post.comments, commentsContainer);
                commentInput.value = "";
            }
        });

        // Удаление статьи
        deletePostButton.addEventListener("click", () => {
            savedPosts.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(savedPosts));
            postsContainer.innerHTML = ""; // Очистить всё для повторного рендеринга
            savedPosts.forEach((newPost, newIndex) => renderPost(newPost, newIndex));
        });

        postsContainer.appendChild(postElement);
    }

    // Обновление отзывов
    function renderComments(comments, container) {
        container.innerHTML = "";
        comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.textContent = comment;
            container.appendChild(commentElement);
        });
    }

    // Фильтр для поиска постов
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll(".post").forEach(post => {
            const title = post.querySelector("h3").textContent.toLowerCase();
            const content = post.querySelector("p").textContent.toLowerCase();
            post.style.display = (title.includes(query) || content.includes(query)) ? "block" : "none";
        });
    });
});

const likeButtons = document.querySelectorAll(".js-like-btn")
const dislikeButtons = document.querySelectorAll(".js-dislike-btn")

likeButtons.forEach(element => {
    element.addEventListener("click", function () {
        const postId = element.getAttribute("data-post-id");

        const params = new URLSearchParams({ id: postId });

        axios.post('/like', params, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });

    })
});

dislikeButtons.forEach(element => {
    element.addEventListener("click", function () {
        const postId = element.getAttribute("data-post-id");

        const params = new URLSearchParams({ id: postId });

        axios.post('/dislike', params, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        });

    })
});
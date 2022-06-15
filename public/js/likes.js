const likeButtons = document.querySelectorAll(".js-like-btn")
const dislikeButtons = document.querySelectorAll(".js-dislike-btn")

likeButtons.forEach(element => {
    element.addEventListener("click", function () {
        const postId = element.getAttribute("data-post-id");

        let likesButton = document.getElementById("post-" + postId + "-likes-button")
        let likesText = document.getElementById("post-" + postId + "-likes-text")
        let likesAmount = document.getElementById("post-" + postId + "-likes-amount")

        const params = new URLSearchParams({ id: postId });
        axios.post('/like', params, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        })
            .then(function (response) {
                // handle success
                if (response.data) {
                    likesButton.classList.add("btn-secondary");
                    likesButton.classList.remove("btn-outline-secondary");
                    likesText.innerText = "Liked"
                    likesAmount.innerText = ++likesAmount.innerText
                } else {
                    likesButton.classList.remove("btn-secondary");
                    likesButton.classList.add("btn-outline-secondary");
                    likesText.innerText = "Like"
                    likesAmount.innerText = --likesAmount.innerText;
                }
            })
            .catch(function (error) {
                // handle error
                console.log("E: ", error);
            })
            .then(function () {
                // always executed
            });



    })
});

// TODO Add dislike/downvote feature
// dislikeButtons.forEach(element => {
//     element.addEventListener("click", function () {
//         const postId = element.getAttribute("data-post-id");

//         const params = new URLSearchParams({ id: postId });

//         axios.post('/dislike', params, {
//             headers: { 'content-type': 'application/x-www-form-urlencoded' }
//         });

//     })
// });
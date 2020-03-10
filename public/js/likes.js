const like = async () => {
    const response = await fetch("http://localhost:3000/like", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({likee: user})
    });

    if (response.status == 200) {
        const likes = document.getElementById("likes-count");
        let likeCount = parseInt(likes.innerText.split(" ")[0], 10) + 1;
        likes.innerText = `${likeCount} Likes`; 
    }
};

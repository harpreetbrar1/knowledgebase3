const latestPostContainer = document.getElementById("latest-post-container");

const page = window.location.href;
const user = page.split("/")[page.split("/").length - 1];

renderPosts = async (url) => {
    while (latestPostContainer.firstChild)
        latestPostContainer.removeChild(latestPostContainer.firstChild);

    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
    });

    const posts = await response.json();
    posts.forEach((post) => {

        const discussionCard = document.createElement("div");
        const toggleContainer = document.createElement("div");
        const postInfo = document.createElement("div");
        const textContainer = document.createElement("div");
        const text = document.createElement("p");
        const profilePicContainer = document.createElement("div");
        const subjectContainer = document.createElement("div");
        const topicContainer = document.createElement("div");
        const profilePic = document.createElement("img");
        const subject = document.createElement("h5");
        const topic = document.createElement("h5");
        const date = document.createElement("h6");
        const replies = document.createElement("h6");
        const replyCollapseContainer = document.createElement("div");

        discussionCard.className = "discussion-tard card";
        postInfo.className = "row";
        textContainer.className = "row";
        text.className = "discussion-text";
        profilePicContainer.className = "col-sm-3 post-info-item";
        subjectContainer.className = "col-sm-6 post-info-item";
        topicContainer.className = "col-sm-3 post-info-item";
        profilePic.className = "poster-profile-pic";
        subject.className = "discussion-subject";
        topic.className = "discussion-topic";
        toggleContainer.className = "reply-toggle-container"
        date.className = "post-time-stamp";
        replies.className = "discussion-replies";
        replies.dataset.toggle = "collapse";
        replies.role = "button";
        replies.setAttribute("aria-expanded", false);
        replies.setAttribute("aria-controls", `collapse-${post.id}`);
        replies.setAttribute("href", `#collapse-${post.id}`);
        replies.onclick = () => { renderReplies(post.id); };
        replyCollapseContainer.id = `collapse-${post.id}`;
        replyCollapseContainer.className = "collapse";

        discussionCard.append(postInfo);
        discussionCard.append(textContainer);
        discussionCard.append(toggleContainer);
        discussionCard.append(replyCollapseContainer);
        postInfo.append(profilePicContainer);
        postInfo.append(subjectContainer);
        postInfo.append(topicContainer);
        profilePicContainer.append(profilePic);
        subjectContainer.append(subject);
        topicContainer.append(topic);
        textContainer.append(text);
        toggleContainer.append(date);
        toggleContainer.append(replies);

        profilePic.src = post.imageurl;
        
        profilePic.onclick = function (e) {
                if(typeof post.iduser !== 'undefined') {
                    window.location.replace(`/profile/${post.iduser}`);
                }
                else if (typeof post.creator !== 'undefined') {
                    window.location.replace(`/profile/${post.creator}`);
                }
            
        }


        subject.innerText = post.subject;
        topic.innerText = post.topic;
        text.innerText = post.content;
        date.innerText = post.date.split("T")[0];
       
       
        
        
        replies.innerText = `${post.replies} replies`;

        latestPostContainer.append(discussionCard);
    });
};

renderNextPage = async () => {
    renderPosts(`http://localhost:3000/post/1`);
};

renderPreviousPage = async (pagination) => {
    renderPosts(`http://localhost:3000/post/-1`);
};

renderReplies = async (post) => {
    const repliesContainer = document.getElementById(`collapse-${post}`);

    while (repliesContainer.firstChild)
        repliesContainer.removeChild(repliesContainer.firstChild);

    const response = await fetch(`http://localhost:3000/post/${post}/replies`, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
    });

    const replies = await response.json();

    replies.forEach((reply) => {
        const replyContainer = document.createElement("div");
        const profilePic = document.createElement("img");
        const replyContent = document.createElement("p");
        const profilePicContainer = document.createElement("div");
        const replyContentContainer = document.createElement("div");

        replyContainer.className = "row discussion-reply";
        profilePicContainer.className = "col-sm-3";
        replyContentContainer.className = "col-sm-9";
        profilePic.className = "discussion-reply-profile-pic";
        replyContent.className = "discussion-reply-content";
        profilePic.style.width = "100px";
        profilePic.style.height = "100px";

        profilePicContainer.append(profilePic);
        replyContentContainer.append(replyContent);
        replyContainer.append(profilePicContainer);
        replyContainer.append(replyContentContainer);

        replyContent.innerText = reply.reply_content;
        profilePic.src = reply.imageurl;


        profilePic.onclick = function (e) {
            window.location.replace(`/profile/${reply.iduser}`);
        }



        repliesContainer.append(replyContainer);
    });

    const commentContainer = document.createElement("comment-container");
    const commentBtnContainer = document.createElement("div");
    const commentTextarea = document.createElement("textarea");
    const commentBtn = document.createElement("button");

    commentTextarea.className = "comment-textarea";
    commentBtn.className = "comment-btn btn btn-success btn-sm";
    commentBtnContainer.className = "comment-btn-container";
    commentBtn.innerText = "Comment";

    commentContainer.append(commentTextarea);
    commentBtnContainer.append(commentBtn);
    commentContainer.append(commentBtnContainer);

    commentBtn.onclick = () => {
        
        createReply(post, commentTextarea.value); commentTextarea.value = "" 
    };

    repliesContainer.append(commentContainer);
};

createReply = async (post, content) => {
    const response = await fetch("http://localhost:3000/post/reply", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ postId: post, content: content })
    });
    console.log(response.status);
    console.log("response.status");
    if (response.status == 200) {
        renderReplies(post);
    }
};

messageUser = async () => {
    window.location.href = `http://localhost:3000/conversation/user/${user}`;
}

createConversation = async () => {
    const response = await fetch("http://localhost:3000/conversations", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ recipient: user, message: document.getElementById("post-box").value})
    });
    
    document.getElementById("post-box").value = "";
    window.location.href = response.url;
}


if (page.split("/")[page.split("/").length - 1] == "landing") {
    
    renderPosts("http://localhost:3000/post/0");
} else {
    renderPosts(`http://localhost:3000/post/user/${user}`);
}

const socket = io("http://localhost:5000");
const conversations = document.getElementById("current-conversations");
const message = document.getElementById("message-input");
const sendBtn = document.getElementById("send-button");
const conversationBox = document.getElementById("convo-box");
let currentConversation;

socket.on("private-message-retrieval", (message) => {
    renderMessage(message);
});

startConversation = (convo) => {
    const newConversation = convo;

    while (conversationBox.firstChild)
        conversationBox.removeChild(conversationBox.firstChild);

    renderMessages(convo);
    socket.emit("leave", `${currentConversation}`)
    socket.emit("join", `${newConversation}`);
    currentConversation = newConversation;
};

renderMessage = (message) => {
    const messageRow = document.createElement("div");
    const messageContainer = document.createElement("div");
    const profilePic = document.createElement("img");
    const content = document.createElement("div");
    const name = document.createElement("h6");
    const msg = document.createElement("h6");

    messageRow.className = "row message-row";
    messageContainer.id = "messageContainer";
    profilePic.id = "profile-pic-message";
    content.id = "content";
    content.className = "row";
    name.id = "name-message";
    msg.id = "message";

    messageRow.append(messageContainer);
    messageContainer.append(profilePic);
    messageContainer.append(content);
    content.append(name);
    content.append(msg);

    profilePic.src = message.imageurl;
    name.innerText = `${message.firstname} ${message.lastname}`;
    msg.innerText = `${message.text}`;

    conversationBox.append(messageRow);
};

renderMessages = async (convo) => {
    const response = await fetch(`http://localhost:3000/message/${convo}`, {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
    });

    const messages = await response.json();
    messages.forEach((message) => {
        renderMessage(message);
    });



    setTimeout(() => {
        conversationBox.scrollTop = conversationBox.scrollHeight - conversationBox.clientHeight;
    }, 100);
};

renderConversations = async () => {
    const response = await fetch("http://localhost:3000/conversations", {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
    });

    const data = await response.json();

    data.convo.forEach((conversation) => {
        const convoCard = document.createElement("div");
        const userCard = document.createElement("div");
        const profilePic = document.createElement("img");
        const name = document.createElement("h5");
        convoCard.className = "row conversation-row";
        convoCard.onclick = () => { startConversation(); };
        convoCard.append(userCard);
        userCard.id = "user-card";
        userCard.append(profilePic);
        userCard.append(name);
        profilePic.id = "profile-pic-select";
        name.id = "name"
        name.className = "d-none d-lg-block";

        convoCard.dataset.convo = conversation.id;
        if (conversation.sender_id == data.user) {
            profilePic.src = conversation.recipient_pic
            name.innerText = `${conversation.recipient_fn} ${conversation.recipient_ln}`;
        } else {
            profilePic.src = conversation.sender_pic;
            name.innerText = `${conversation.sender_fn} ${conversation.sender_ln}`;
        }

        convoCard.onclick = () => { startConversation(conversation.id) }
        conversations.append(convoCard);
    });
}

sendBtn.onclick = async (event) => {




    if (currentConversation == null) {
        alert("Select or start a conversation before messaging.");
        return;
    }

    event.preventDefault();
    let messageValue = message.value;

    const response = fetch("http://localhost:3000/message", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: messageValue, conversation: currentConversation })
    }).then(async (response) => {



        if (response.status == 200) {
            const user = await response.json();
            socket.emit("private-message", { room: `${currentConversation}`, message: messageValue, user: user });
            renderMessage({ text: messageValue, firstname: user[0].firstname, lastname: user[0].lastname, imageurl: user[0].imageurl });

            setTimeout(() => {
                conversationBox.scrollTop = conversationBox.scrollHeight - conversationBox.clientHeight;
            }, 100);

            // fetch("http://localhost:3000/sendEmail", {
            //     method: "POST",
            //     mode: "cors",
            //     credentials: "same-origin",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({ message: messageValue, conversation: currentConversation })
            // })

            messageValue = null;
        }
    });
};

renderConversations();

module.exports = {
    sendMessage: (req, callback) => {
        const userId = req.session.userId;
        const message = req.body.message;
        const conversation = req.body.conversation;

        req.con.query(`INSERT INTO messages (text, sender, conversation) VALUES ("${req.body.message}", "${req.session.userId}", "${conversation}")`, (err) => {
            if (err) {
                console.log(err);
            }
        });

        req.con.query(`select firstname, lastname, imageurl from user where user.iduser = ${userId}`, (err, results) => {
            if (err) console.log(err);
            callback(err, results);
        });
    },

    getMessages: (req, callback) => {
        const convo = req.params.conversationId;

        req.con.query(`select text, messages.sender, recipient, firstname, lastname, imageurl from messages join conversations join user on messages.conversation = conversations.id and messages.sender = user.iduser
        where conversations.id = ${convo}`, (err, results) => {
            if (err) {
                console.log(err);
                callback(`Unable to fetch messages for conversation with id ${convo}`);
            }
            callback(null, results);
        });
    },

    getConversations: (req, callback) => {
        const userId = req.session.userId;

        req.con.query(`select * from
        (select id, sender_id, recipient_id, sender_pic, sender_fn, sender_ln, recipient_pic, recipient_fn, recipient_ln from
        (select id, sender, recipient, imageurl as sender_pic, iduser as sender_id, firstname as sender_fn, lastname as sender_ln from conversations join user on conversations.sender = user.iduser) as a
        join
    (select iduser as recipient_id, imageurl as recipient_pic, firstname as recipient_fn, lastname as recipient_ln from user) as b
        on a.recipient = b.recipient_id) as c
        where sender_id = ${userId} or recipient_id = ${userId}`, (err, results) => {
            if (err) {
                console.log(err);
                callback("Unable to fetch conversations.");
            }
            const data = { convo: results, user: req.session.userId };
            callback(null, data);
        });
    },

    createConversation: (req, callback) => {
        const userId = req.session.userId;
        const recipient = req.body.recipient;
        const message = req.body.message;

        req.con.query(`select * from conversations where 
        (conversations.sender = ${userId} and conversations.recipient = ${recipient}) 
        or (conversations.sender = ${recipient} and conversations.recipient = ${userId})`, (err, results) => {
            if (err) {
                console.log(err);
                callback("Unable to create conversation.");
            }

            if (results.length == 0) {
                req.con.query(`insert into conversations (sender, recipient) values("${userId}", "${recipient}")`, (err) => {
                    if (err) {
                        console.log(err);
                        callback("Unable to create conversation");
                    }
                    req.con.query(`select id from conversations order by id desc limit 1`, (err, convo) => {
                         req.con.query(`INSERT INTO messages (text, sender, conversation) VALUES ("${message}", "${userId}", "${convo[0].id}")`)
                    });
                });
            }
        });
    },
  
    getEmailInformation: (req, callback) => {

        const conversationId = req.body.conversation
        req.con.query(`Select a.firstname AS senderFirst, a.lastname AS senderLast , b.firstname AS RecieverFirst, b.lastname AS RecieverLast, b.name AS SenderEmail, a.name AS RecieverEmail from conversations 
        join user a on conversations.sender = a.iduser 
        join user b on conversations.recipient = b.iduser
        where conversations.id = ${conversationId};`, (err, results) => {
            if (err) {
                console.log(err);
                callback("Unable to fetch conversation data");
            }
            const data = { message: req.body.message, emailInfo: results }
            callback(null, data)
        })
    }
};

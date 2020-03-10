module.exports = {

	post: (req, callback) => {
		const subject = req.body.subject;
        const content = req.body.content;
        const topic = req.body.topic;
        const user = req.session.userId

		req.con.query(`INSERT INTO posts (subject, content, topic, creator) VALUES ("${subject}", "${content}", "${topic}", "${user}")`, (err, results) => {
            if (err) {
                console.log(err);
				callback("Unable to post.");
            }
            else {

            }
        });


    },

    getPosts: (req, callback) => {
        if (req.params.userId) {
            req.con.query(`select id, subject, content, topic, creator, firstname, lastname, imageurl, posts.date, posts.replies from posts join user on posts.creator = user.iduser where user.iduser = ${req.params.userId} order by posts.date`, (err, results) => {
            if (err) {
                console.log(err);
                callback("Unable to fetch discussion/posts.");
            }
            
            callback(null, results);
            });
            return;
        }

        req.session.pagination = parseInt(req.session.pagination, 10) < 0 ? 
            0 : parseInt(req.session.pagination, 10) + parseInt(req.params.pagination, 10);

        if (parseInt(req.session.pagination, 10) < 0)
            req.session.pagination = 0;

        req.con.query(`select id, subject, content, topic,iduser, firstname, lastname, imageurl, posts.date, posts.replies from posts join user on posts.creator = user.iduser order by posts.date desc limit ${5 * req.session.pagination}, 5`, (err, results) => {
            if (err) {
                console.log(err);
                callback("Unable to fetch discussion/posts.");
            }
            callback(null, results);
        })
    },

    getReplies: (req, callback) => {
        const postId = req.params.postId;
        console.log(postId)
        req.con.query(`select iduser, reply_id, reply_content, firstname, lastname, imageurl from
        (select replies.id as reply_id, replies.content as reply_content, replier 
            from replies join posts on replies.post = posts.id where posts.id = ${postId}) as a
        join user on replier = user.iduser`, (err, results) => {
            if (err) {
                console.log(err);
                callback("Unable to fetch replies");
            }
            console.log(results)
            callback(null, results);
        });
    },

    postReply: (req, callback) => {
        const replier = req.session.userId;
        const postId = req.body.postId;
        const content = req.body.content;

        req.con.query(`INSERT into replies (content, post, replier) VALUES("${content}", "${postId}", "${replier}")`, (err) => {
            if (err) {
                console.log(err);
                callback(err);
            }

            req.con.query(`update posts set posts.replies = posts.replies + 1 where posts.id = ${postId}`, (err) => {
                if (err) {
                    console.log(err);
                    callback(err);
                }
            });
        });
    }
};

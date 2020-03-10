const db = require("../model/post")

module.exports = {
    
    post: (req, res) => {
        console.log('posts');
        db.post(req, (err) => {
            if (err) return res.sendStatus(500);
        });

        return res.status(200).redirect("/landing");
    },
    

    getPosts: (req, res) => {
        db.getPosts(req, (err, results) => {
            
            if (err) return res.sendStatus(500);

            if (!results.length) {
                req.session.pagination = 0;
                return res.sendStatus(200);
            }

            return res.json(results);
        });
    },

    getReplies: (req, res) => {
        db.getReplies(req, (err, results) => {
            if (err) return res.sendStatus(500);
            return res.json(results);
        });
    },

    postReply: (req, res) => {
        db.postReply(req, (err) => {
            if (err) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    }
};

module.exports = {


	getUserDetails: (req, callback) => {
		const email = req.session.email

		req.con.query(`SELECT * FROM user WHERE name=?`, [email], (err, results) => {
			if (err) {
				callback(Error('Error from Database'))
            } else {
                req.con.query(`select * from likes where likee = ${req.session.userId}`, (err, likes) => {
                    if (err) callback("Likes fetch error.");
                    req.session.likes = likes.length ? likes.length : 0;
                    results[0]["likes"] = likes.length ? likes.length : 0;
				    callback(null, results)
                });
			}
		})
	},

	fetchProfileDetails: (req, callback) => {
		const userId = req.params.id
		
		console.log('userId', userId) 
		req.con.query(`SELECT * FROM user WHERE iduser=?`, [userId], (err, results) => {
			if (err) {
				callback(Error('Error from Database'))
            } else {
				
                req.con.query(`select * from likes where likee = ${userId}`, (err, likes) => {
                    if (err) callback("ssssLikes fetch error.");
					
                    req.con.query(`select * from posts where creator = ${results[0].iduser}`, (err, posts) => {
                        results[0]["postCount"] = posts.length;
                    });
                    results[0]["likes"] = likes.length ? likes.length : 0;
				    callback(null, results)
                });
			}
		})
	},

	editProfile: (req, callback) => {
		Object.keys(req.body).forEach(k => (!req.body[k] && req.body[k] !== undefined) && delete req.body[k]);
		const userId = req.session.userId;
		
		req.con.query(`Update user SET ? WHERE iduser = ${userId} `, [req.body], (err, results) => {
			if (err) {
				callback(Error('Error from Database'))
			} else {
				callback(null)
			}
		})

	},

	countUserPosts: (req, callback) => {

		const userid = req.session.userId;
		req.con.query(`Select COUNT(*) as n from posts JOIN user  on posts.creator = user.iduser where iduser = ${userid};`, (err, results) => {
            if (err) {
                
				callback("Unable to post.");
            }
            else {
                callback(null, results)
            }
        });

	},

	countUserMessages: (req, callback) => {
	
		const userid = req.session.userId;
		req.con.query(`SELECT COUNT(*) as numberofmessages FROM conversations WHERE conversations.sender = ${userid} OR conversations.recipient = ${userid};`, (err, results) => {
            if (err) {
                console.log(err);
				callback("Unable to post.");
            }
            else {
				
                callback(null, results)
            }
        });

	}
}

const sha1 = require("sha1");

module.exports = {

	getUser: (req, callback) => {

		const email = req.body.email
		const password = sha1(req.body.password);

		req.con.query(`SELECT * FROM user WHERE name=?`, [email], (err, results) => {
			if (err) {
				callback(Error('Error from Database'))
			} else {
				
				if (results.length > 0) {
					if (results[0].password === password) {
						callback(null, results)
					} else {
						callback(Error('Username and Password does not match'))
					}
				} else {
					callback(Error("Username Does not exist"))
				}
			}
		})
	},

	emailCheck: (req, callback) => {

		req.con.query(`SELECT * FROM user WHERE name=?`, [req.body.email], (err, results) => {
			if (err) {
				console.log(err);
				callback(Error('Error from Database', err))
			} else {
				
				callback(null, results)
			}
		})
	},

	registerUser: (req, callback) => {
		// userId is auto incremented in DB
		const newUser = {
			name: req.session.email,
			password: sha1(req.session.password),
			firstname: req.session.firstName,
			lastname: req.session.lastName,
			country: req.body.country,
			about: req.body.about,
			imageurl: req.body.url,
			birthday: req.body.birthday
		}
		

		req.con.query(`Insert INTO user SET ?`, [newUser], (err, results) => {
			if (err) {
				callback(Error('Error from Database'))
			} else {
				console.log('eeee ', req.session.email)
				req.con.query(`Select iduser FROM user where name=?`,[req.session.email],  (err, results) => {
					if (err) {
						callback(Error('Error from Database'))
					} else {
						
						req.session.userId = results[0].iduser;
						
						callback(null, results[0].iduser)
		
					}
				})
				

			}
		})
	},

	search: (req, callback) => {
		const value = req.body.searchValue;

		req.con.query(`Select * from posts JOIN user on posts.creator = user.iduser where subject like '%${value}%'`, (err, results) => {

			if (err) {
				
				callback(Error('Error from Database'))
			} else {

				console.log("results")
				
				callback(null,results)

			}
		})
    },

	searchByTopic: (req, callback) => {
		
		const value = req.body.searchByTopic;
		console.log('searchByTopic ', value)

		req.con.query(`Select * from posts JOIN user  on posts.creator = user.iduser where topic like '%${value}%'`, (err, results) => {

			if (err) {
				console.log("ERROR")
				callback(Error('Error from Database'))
			} else {

				console.log("results")
				
				callback(null,results)

			}
		})
    },

    like: (req, callback) => {
        const liker = req.session.userId;
        const likee = req.body.likee;
        req.con.query(`select * from likes where liker = ${liker} and likee = ${likee}`, (err, likes) => {
            if (err) throw err;
            if (!likes.length) {
                req.con.query(`insert into likes (liker, likee) values("${liker}", "${likee}")`, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    callback(null);
                });
            }
        });
    },

    getLikes: (req, callback) => {
        req.con.query(`select * from likes where likee = ${req.params.user}`, (err, results) => {
            if (err) {
                console.log("Like insert failed.");
            }
            callback(null, results);
        });
    }
}

const db = require("../model/auth");
const jwt = require("jsonwebtoken");

module.exports = {

    index: (req, res) => {
        req.session.email = null;
        req.session.user = null;
        req.session.token = null;
		return res.render('register', { pageTitle: 'People App', heading: 'Welcome to KnowledgeBase', registerCSS: true, validation: req.query.error, login: true, auth:true });
	},

	login: (req, res) => {
		db.getUser(req, (err,user) => {
			if (err) {
				return res.render('register', { pageTitle: 'People App', heading: 'Welcome to KnowledgeBase', registerCSS: true, validation: err.message, login: true, auth:true });
			}

            const token = jwt.sign({user: user[0].iduser, name: user[0].name}, process.env.JWT_SECRET);
            req.session.email = user[0].name;
            req.session.userId = user[0].iduser;
			req.session.token = token;
			req.session.userDetails = user[0]
			return res.redirect('/landing')
		})
	},

	register: (req, res) => {

		//Submitted from /register page
		const firstName = req.body.firstName
		const lastName = req.body.lastName
		const email = req.body.email
		const password = req.body.password
		const confirmPassword = req.body.confirmPassword

		if (password != confirmPassword) {
			return res.render('register', { pageTitle: 'People App', heading: 'Welcome to KnowledgeBase', registerCSS: true, validation: 'Password must match your confirm password', login: true })
		}

		db.emailCheck(req, (err, user) => {
			if (err) throw err
			if (user.length > 0) {
				return res.render('register', { pageTitle: 'People App', heading: 'Welcome to KnowledgeBase', registerCSS: true, validation: "User already exists", login: true })
			} else {
				if (email && firstName && lastName && password) {
					req.session.email = email;
					req.session.firstName = firstName;
					req.session.lastName = lastName;
					req.session.password = password;
					
					return res.redirect('/about')
				}

			}
		})

		//Submitted from /about page
		const country = req.body.country;
		
		//Stores data submitted from /about page
		if (typeof country != 'undefined') {
			db.registerUser(req, (err, user) => {
				if (err) {
					console.log('Error from Database')
					throw err
				}
				else {
					console.log("User ", user);

					const token2 = jwt.sign({user: user, name: req.session.email}, process.env.JWT_SECRET);
					
            		req.session.userId = user;
					req.session.token = token2;
					return res.redirect('/landing')
				}
			})
		}
	},

	about: (req, res) => {
		return res.render('about', { pageTitle: 'People App', heading: 'Tell us a bit more about yourself', aboutCSS: true, login: true })
	},


	search: (req, res) => {
		db.search(req, (err,results) => {
			let month = {
				Jan: '01', Feb:'02', Mar : '03', Apr : '04', May: '05',
				 Jun: '06', Jul: '07', Aug : '08',  Sep : '09', Oct: '10',
				 Nov: '11', Dec : '12'
			}
			let data = results
			for(let i = 0; i < data.length; i++) {
				let date = ''+data[i].date
				
				 let temporaryDate = date.split(" ")
				 let tempMonth = '' +temporaryDate[1]
				 
				 let newdate  = '' + temporaryDate[2] + '-'  + month[tempMonth] + '-' + temporaryDate[3];
				 data[i].date = newdate
				 
			}
			
			return res.render('searchResultCard',{searchResultCardCSS:true, results: data})

		})		

		
	},
	
	searchByTopic: (req, res) => {
		
		db.searchByTopic(req, (err,results) => {
			let month = {
				Jan: '01', Feb:'02', Mar : '03', Apr : '04', May: '05',
				 Jun: '06', Jul: '07', Aug : '08',  Sep : '09', Oct: '10',
				 Nov: '11', Dec : '12'
			}
			let data = results
			
			for(let i = 0; i < data.length; i++) {
				let date = ''+data[i].date
				
				 let temporaryDate = date.split(" ")
				 let tempMonth = '' +temporaryDate[1]
				 
				 let newdate  = '' + temporaryDate[2] + '-'  + month[tempMonth] + '-' + temporaryDate[3];
				 data[i].date = newdate
				 console.log(date.split(" "))
			}
			
			return res.render('searchResultCard',{searchResultCardCSS:true, results: data, searchByTopic:true})

		})		

		
	},

    like: (req, res) => {
        db.like(req, (err, results) => {
            if (err) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    },

    getLikes: (req, res) => {
        db.getLikes(req, (err, results) => {
            if (err) return res.sendStatus(500);
            return res.json(results);
        });
    }
}

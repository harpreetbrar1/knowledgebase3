const db = require("../model/message")
const emailService = require("../util/emailService")

module.exports = {
    sendMessage: (req, res) => {
        db.sendMessage(req, (err, results) => {
            if (err) return res.sendStatus(500);
            res.json(results);
        });
    },
    
    getMessages: (req, res) => {
        db.getMessages(req, (err, results) => {
            if (err) return res.sendStatus(500);
            return res.json(results);
        })
    },

    getConversations: (req, res) => {
        db.getConversations(req, (err, results) => {
            if (err) return res.sendStatus(500);
            return res.json(results);
        });
    },

    createConversation: (req, res) => {
        db.createConversation(req, (err, results) => {
            if (err) return res.sendStatus(500);
        });
        return res.status(200).redirect("/messaging");
    },
  
    // sendEmail: (req, res) => {
    //     db.getEmailInformation(req, (err, results) => {
    //         if (err) return res.sendStatus(500)
    //         emailService.sendEmail(results)
    //         return res.json(results)

    //     });
    // }
}

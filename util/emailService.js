const sgMail = require('@sendgrid/mail');

// module.exports = {

//   sendEmail: (conversationInfo) => {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//     const msg = {
//       to: `${conversationInfo.emailInfo[0].RecieverEmail}`,
//       from: `${conversationInfo.emailInfo[0].SenderEmail}`,
//       subject: `Message from ${conversationInfo.emailInfo[0].senderFirst} ${conversationInfo.emailInfo[0].senderLast} from KnowledgeBase`,
//       text: `${conversationInfo.message}`,
//     };
//     sgMail.send(msg);
//   }

// }
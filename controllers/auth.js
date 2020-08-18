const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
exports.signup = (req, res, next) => {
    const msg = {
        to: 'vishusaxena1188@gmail.com',
        from: 'signup@idealobs.com',
        subject: 'Verify your email',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg).then(result => res.status(200).json({
        message: 'success'
    }));
}
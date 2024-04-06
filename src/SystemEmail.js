const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'skcode2001@gmail.com',
        pass: 'kzoxkunktavwdrof'
    }
})

async function sendAuthMail(receiverEmail, randomCode = 4545) {
    const mailOptions = {
        from: 'skcode2001@gmail.com',
        to: receiverEmail.toString(),
        subject: 'OTP Verification Code For OpenLedger',
        html: `<div style="width: 800px;height: 700px;box-shadow: -1px 0 10px #000000;">
        <div>
            <img src="logo.jpg" alt="Logo" style="width: 100px; height: 100px; margin-left: 350px; margin-top: 5px;">
        </div>
        <div style="display: flex;justify-content: center;  align-items: center; background:#EB4746; height: 100px;
        width: 800px;margin-top: 5px;">
            <img src="mail pic.png" alt="mail" style="width: 150px;
            height: 100px;">
        </div>
        <div> 
            <h2 style=" margin: 30px;">Email Verification</h2>
            <p style=" margin: 30px;">Hi there,<br>You're set to start enjoying OpenLedger Community Management System. Simply enter the code below to verify your email address and get 
            Started.<br> The code expires in 48 hours.</p>
            <button style="display: flex;justify-content: center;align-items: center; height: 40px; background-color:#EB4746;
            border: none;border-radius: 5px; color: white; font-size: 18px; padding-left: 30px; padding-right: 30px; text-align: center;
            margin: 60px 60px 60px 270px; font-weight: bold;">Verification Code ${randomCode}</button>
            <hr style="width: 600px;border-color: red;margin-left: 103px; ">
        
        </div>
        
        <div style="display: flex;justify-content: center;align-items: center;margin: 40px auto auto auto;">
        <img src="fb.png" alt="fb logo" style=" height: 65px;width: 65px;">
        <img src="snap.png" alt="snapchat logo" style=" height: 60px; width: 95px;">
        <img src="ln.png" alt="linkdn logo" style=" height: 50px; width: 50px;">
        <img src="insta.png" alt="insta logo" style=" margin-left: 20px;height: 50px;width: 50px;">
        </div>
        <div>
        <p style="display: flex;justify-content: center;align-items: center;margin: 10px;">800 Broadway Suit 1500 New York, NY 000423, USA</p>
        <p style="display: flex;justify-content: center;align-items: center;font-weight: bold;margin: 15px ;">| Privacy Policy | Contact Details |</p>
        </div>
     `
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(err, info) {
            if(err) {
                console.log(err)
                resolve(false)
            }else {
                console.log('Email sent successfully...')
                resolve(true)
            }
        })

    })
}

module.exports = {
    sendAuthMail
}
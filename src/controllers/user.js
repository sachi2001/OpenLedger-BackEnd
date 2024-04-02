const bcrypt = require('bcrypt')
const saltRounds = 6
const mongoose = require('../mongoDB')

const { sendAuthMail } = require('../SystemEmail')

const {UserModel, TempCodeModel} = require('../Model')



const emailValidation = async (req, res) => {
    const vCode = req.body['code']
    const userEmail = req.body['userEmail']
    const dbResponse = await TempCodeModel.findOne({"userEmail": userEmail}).sort({"_id": -1})
    
    let validated
    console.log(dbResponse['code'] + " " + vCode) 
    if (vCode === dbResponse['code']) {
        validated = true
    } else {
        validated = false
    }
    res.status(validated?200:409).json({
        email_validation: validated
    })
}

// Generate random code for email verification ...
// Registration step 01
const verificationCode = async (req, res) => {
    let passCode = true
    const randomCode = (Math.random()*10000 + 10000).toFixed(0).toString().substring(1)
    console.log("Random Code : " + randomCode)

    // Delete previous codes sent to the same email address 
    await TempCodeModel.deleteMany({"userEmail": req.body['userEmail']})

    // Add temp code to the database
    await TempCodeModel.insertMany({
        userEmail: req.body['userEmail'],
        code: randomCode,
        date: Date.now
    }).then(success => {
        console.log("Temp code saved...")
    }).catch(err => {
        console.log(err)
        passCode = false
    })

    // Sending code through email
    if(!(passCode && await sendAuthMail(req.body['userEmail'], randomCode))) passCode = false 
   
    // Respond to client device
    res.status(passCode?200:409).json({
        codeSent: passCode
    })
}


// Find the last ID number use in the database
async function lastID(){
    const response = await UserModel.find({}, {"userID": 1}).sort({"userID": -1}).limit(1)
    return response[0]['userID']
}   

// New User registration for system 
// Password are converted to hash code before saving in the database 
const newUserRegistration = async (req, res) => {
    let process_success = true
    console.log("New user registration ...")

    // Converting newly created password to hash code 
    const hashPass = await bcrypt.hash(req.body['user_password'], saltRounds)
    let idNum = await lastID()

    await UserModel.insertMany(
        {
            userID: ++idNum,
            userName: req.body['user_name'],
            userEmail: req.body['user_email'],
            passwordHash: hashPass,
            profileLink: "await"
        }
    ).then(success => {
        console.log("Registration Success...")
    }).catch(err => {
        console.log(err)
        process_success = false
    })
    
    // Response to client 
    res.status(process_success?201:409).json({
        process_success: process_success
    })
}


module.exports = {
    emailValidation,
    newUserRegistration,
    verificationCode
}
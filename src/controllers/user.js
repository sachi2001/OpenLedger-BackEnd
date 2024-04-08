const bcrypt = require('bcrypt')
const saltRounds = 6
const mongoose = require('../mongoDB')

const { sendAuthMail } = require('../SystemEmail')

const {UserModel, TempCodeModel} = require('../Model')


// Validate the code send by the client/user 
// Registration step 02
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
    res.status(200).json({
        email_validation: validated
    })
}

// Check whether accout already available in the database 
const emailExists = async (user_email) => {
    let response = await UserModel.findOne({userEmail:user_email})
    return (response != null)
}

// Generate random code for email verification ...
// Registration step 01
const verificationCode = async (req, res) => {
    let passCode = true, errorMessage = null
    const randomCode = (Math.random()*10000 + 10000).toFixed(0).toString().substring(1)
    console.log("Random Code : " + randomCode)

    // Check whether the account exists ...
    if(await emailExists(req.body['userEmail'])) {
        passCode = false
        errorMessage = 'accountAlreadyExists'
    }

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
        errorMessage = 'severError'
        passCode = false
    })

    // Sending code through email
    if(passCode) {
        if(!(await sendAuthMail(req.body['userEmail'], randomCode))) {
            passCode = false
            errorMessage = 'emailServerError'
        }
    }
    
   
    // Respond to client device
    res.status(200).json({
        codeSent: passCode,
        error: errorMessage
    })
}


// Find the last ID number use in the database
async function lastID(){
    const response = await UserModel.find({}, {"userID": 1}).sort({"userID": -1}).limit(1)
    if (response.length == 0) return 0
    return response[0]['userID']
}   

// New User registration for system 
// Password are converted to hash code before saving in the database 
// New user registration step 03
const newUserRegistration = async (req, res) => {
    let process_success = true
    console.log("New user registration ...")

    try{
        
        // Converting newly created password to hash code 
        const hashPass = await bcrypt.hash(req.body['user_password'], saltRounds)
        let idNum = await lastID()
        
        console.log('texting...')
        await UserModel.insertMany(
            {
                userID: ++idNum,
                userName: req.body['user_name'],
                userEmail: req.body['user_email'],
                passwordHash: hashPass,
                userImageID: req.body['user_image_id'],
                pictureScale: req.body['picture_scale']
            }
        ).then(success => {
            console.log("Registration Success...")
        }).catch(err => {
            console.log(err)
            process_success = false
        })
        
        // Response to client 
        res.status(process_success?201:200).json({
            process_success: process_success
        })
    } catch(e) {
        // Error occour during the process
        res.status(200).json({
            process_success: false,
            message: e
        })
    }
    
    
}


module.exports = {
    emailValidation,
    newUserRegistration,
    verificationCode
}
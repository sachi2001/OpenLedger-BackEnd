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

// Check whether account already available in the database 
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
        
        // Response to client about image success
        res.status(process_success?201:200).json({
            process_success: process_success,
            message: null
        })
    } catch(e) {
        // Error occur during the process
        res.status(200).json({
            process_success: false,
            message: e
        })
    }
    
    
}


// Registration process ...
// Final registration step
const checkLogin = async (req, res) => {
    // Initiate response variables
    let errorMessage = null, validate = false, userDetails = null;

    try{// Email and password
        const userEmail = req.body['user_email'],
                userPass = req.body['user_pass'];

        // Fetch data from the database
        const response = await UserModel.findOne({userEmail: userEmail})

        // Check whether the email exists in the database
        if(response != null) {
            // Hash password compare
            validate = await bcrypt.compare(userPass, response.passwordHash) // Compare the hash codes
            if(validate) userDetails = {
                userID: response.userID,
                userName: response.userName,
                userEmail: response.userEmail,
                userImageID: response.userImageID,
                pictureScale: response.pictureScale
            }
        } else {
            errorMessage = 'invalidEmail'
        }
    } catch(e) {
        errorMessage = 'severError'
    }

    res.status(200).json({
        accountValidate: validate,
        error: errorMessage,
        userDetails: userDetails
    })
}


module.exports = {
    emailValidation,
    newUserRegistration,
    verificationCode,
    checkLogin
}
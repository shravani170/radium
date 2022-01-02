const UserModel = require("../models/User Model")
const mongoose = require("mongoose")
const validate = require("../Util/Validation")
const Uploading = require("../Util/S3Uploading")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const { json } = require("body-parser")




const createUser = async function (req, res) {
    try {
        let requestbody = req.body;
        let files = req.files;
        if (!validate.isValidRequestBody(requestbody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
            return
        }
        if (!(files && files.length > 0)) {

            res.status(400).send({ status: false, message: "Noting to Upload to AWS S3" })
        }
        // Extract params
        let { fname, lname, email, phone, password, address } = requestbody;// Object destructing
        //  Validation starts
        if (!validate.isValid(fname)) {
            res.status(400).send({ status: false, message: `fname is required` })
            return
        };
        if (!validate.isValid(lname)) {
            res.status(400).send({ status: false, message: `lname is required ` })
            return
        };
        if (!validate.isValid(phone)) {
            res.status(400).send({ status: false, message: 'phone no is required' })
            return
        };
        phone = phone.trim()

        if (!(/^\(?([1-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone))) {
            res.status(400).send({ status: false, message: `Please fill a valid phone number` })
            return
        };
        const isPhoneAlreadyUsed = await UserModel.findOne({ phone }); //{phone: phone} object shorthand property
        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone} phone number is already registered` })
            return
        };

        if (!validate.isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        };
        email = email.trim().toLowerCase()
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address ` })
            return
        };
        const isEmailAlreadyUsed = await UserModel.findOne({ email }); // {email: email} object shorthand property
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        };
        if (!validate.isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        };

        if (!(password.length > 7 && password.length < 16)) {
            res.status(400).send({ status: false, message: "password should  between 8 and 15 characters" })
            return
        };

        if (!validate.isValid(address.billing.street)) {

            return res.status(400).send({ status: false, message: "Please provide Billing street" });;

        }

        if (!validate.isValid(address.billing.city)) {

            return res.status(400).send({ status: false, message: "Please provide Billing city" });;

        }

        if (!validate.isValid(address.billing.pincode)) {

            return res.status(400).send({ status: false, message: "Please provide Billing pincode" });;

        }

        if (!validate.isValid(address.shipping.street)) {

            return res.status(400).send({ status: false, message: "Please provide Shipping street" });;

        }

        if (!validate.isValid(address.shipping.city)) {

            return res.status(400).send({ status: false, message: "Please provide Shipping city" });;

        }

        if (!validate.isValid(address.shipping.pincode)) {

            return res.status(400).send({ status: false, message: "Please provide Shipping pincode" });;

        }

        // Validation ends
        var uploadedFileURL = await Uploading.uploadFile(files[0]);
        const userData = { fname, lname, email, profileImage: uploadedFileURL, phone, password, address };

        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt)

        const newUser = await UserModel.create(userData);
        res.status(201).send({ status: true, message: ` success`, data: newUser });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    };
};

const loginUser = async function (req, res) {
    try {

        if (!validate.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, msg: "provide login credentials" })
        };
        let { email, password } = req.body
        if (!validate.isValid(email)) {
            return res.status(401).send({ status: false, msg: "Email is required" })
        };
        email = email.toLowerCase().trim()
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        };
        if (!validate.isValid(password)) {
            res.status(402).send({ status: false, msg: "password is required" })
            return
        };

        const user = await UserModel.findOne({ email: req.body.email })
        //console.log(user)
        if (!user) {
            res.status(403).send({ status: false, msg: "invalid email or password, try again with valid login credentials " })
            return
        };

        if (!await bcrypt.compare(password, user.password)) {//1st password user i/p 2nd db
            return res.status(401).send({ msg: "Invalid credential" })
        }

        const token = await jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),//issue date
            exp: Math.floor(Date.now() / 1000) + 30 * 60//expire date 30*60 = 30min 
        }, 'project5');
        res.header('x-api-key', token);
        res.status(200).send({ status: true, userId: user._id, token });
        return
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
        return
    };
};

const getUserDetails = async (req, res) => {
    userId = req.params.userId;
    TokenDetail = req.user

    if (TokenDetail.userId != userId) {//id present in token=id received in params
        res.status(403).send({ status: false, message: "userId in url param and in token is not same" })
    }

    if (!validate.isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: `${userId} is not a valid book id` })
    }

    const FoundUser = await UserModel.findOne({ _id: userId })
    if (!FoundUser) {
        return res.status(404).send({ status: false, message: `No User found with given User Id` })
    }

    res.status(200).send({ status: true, "message": "User profile details", "data": FoundUser })

}

const UpdateUser = async (req, res) => {

    userId = req.params.userId;
    const requestBody = req.body;
    const profileImage = req.files
    TokenDetail = req.user// req.user = decodedtoken.userId user id in token

    if (!validate.isValidRequestBody(requestBody)) {
        return res.status(400).send({ status: false, message: 'No paramateres passed. Book unmodified' })
    }
    const UserFound = await UserModel.findOne({ _id: userId })


    if (!UserFound) {
        return res.status(404).send({ status: false, message: `User not found with given UserId` })
    }
    if (TokenDetail.userId != userId) {//token user id and prams user id
       return res.status(400).send({ status: false, message: "userId in url param and in token is not same" })
    }



    let { fname, lname, email, phone, password } = requestBody
    if (Object.prototype.hasOwnProperty.call(requestBody, 'email')) {///////
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(requestBody.email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        };

        const isEmailAlreadyUsed = await UserModel.findOne({ email: requestBody.email });
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${requestBody.email} email address is already registered` })
            return
        };
    }
    //console.log(Object.prototype.hasOwnProperty.call(requestBody, 'password'))
    if (Object.prototype.hasOwnProperty.call(requestBody, 'password')) {
        requestBody.password = requestBody.password.trim();
        if (!(requestBody.password.length > 7 && requestBody.password.length < 16)) {
            res.status(400).send({ status: false, message: "password should  between 8 and 15 characters" })
            return
        };

        var salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(requestBody.password, salt)
        //console.log(password)
        requestBody.password = password;
    }
    if (profileImage && profileImage.length > 0) {
        var uploadedFileURL = await Uploading.uploadFile(profileImage[0]);
       // console.log(uploadedFileURL)
        requestBody.profileImage = uploadedFileURL
    };
    if (requestBody.address) {
        requestBody.address = JSON.parse(requestBody.address)
        if (requestBody.address.shipping) {
            if (requestBody.address.shipping.street) {
                UserFound.address.shipping.street = requestBody.address.shipping.street
                await UserFound.save()
            }
            if (requestBody.address.shipping.city) {
                UserFound.address.shipping.city = requestBody.address.shipping.city
                await UserFound.save()
            }
            if (requestBody.address.shipping.pincode) {
                UserFound.address.shipping.pincode = requestBody.address.shipping.pincode
                await UserFound.save()
            }
        }

        if (requestBody.address.billing) {
            if (requestBody.address.billing.street) {
                UserFound.address.billing.street = requestBody.address.billing.street
                await UserFound.save()
            }
            if (requestBody.address.billing.city) {
                UserFound.address.billing.city = requestBody.address.billing.city
                await UserFound.save()
            }
            if (requestBody.address.billing.pincode) {
                UserFound.address.billing.pincode = requestBody.address.billing.pincode
                await UserFound.save()
            }
        }
    }

    requestBody.UpdatedAt = new Date()
    const UpdateData = { fname, profileImage: uploadedFileURL, lname, email, phone, password }
    const upatedUser = await UserModel.findOneAndUpdate({ _id: userId }, UpdateData, { new: true })
    res.status(200).send({ status: true, message: 'User updated successfully', data: upatedUser });

}

module.exports = { createUser, loginUser, getUserDetails, UpdateUser }
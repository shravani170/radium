const bookModel = require('../model/bookModel');
const writerModel = require('../model/writerModel');
const mongoose = require('mongoose');
const moment = require('moment');
const aws = require("aws-sdk");
const reviewModel = require('../model/reviewModel');
const { reviewData } = require('./reviewController');
aws.config.update({
    accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
    secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
    region: "ap-south-1" // Mumbai region
});


// this function uploads file to AWS and gives back the url for the file
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) { // exactly 

        // Create S3 service object
        let s3 = new aws.S3({ apiVersion: "2006-03-01" });
        var uploadParams = {
            ACL: "public-read", // this file is publically readable
            Bucket: "classroom-training-bucket", // HERE
            Key: "sG_newFolder/" + new Date() + file.originalname, // HERE    "pk_newFolder/harry-potter.png" pk_newFolder/harry-potter.png
            Body: file.buffer,
        };

        // Callback - function provided as the second parameter ( most oftenly)
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err });
            }
            console.log(data)
            console.log(`File uploaded successfully. ${data.Location}`);
            return resolve(data.Location); //HERE 
        });
    });
};

//USING VALIDATION
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)

}

//POST /books

const createBook = async function (req, res) {
    try {

        let book = req.body
       
        if (!isValidRequestBody(book)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide writer details' });
            return;
        }
    
    const { title, excerpt, userId, ISBN, category, subCategory,bookCover } = book
        const isBookAlreadyExist = await bookModel.findOne({ title: title, ISBN: ISBN });
        if (isBookAlreadyExist) {//unique
            return res.status(403).send({ status: false, message: 'Book  already  exist' });
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Title  is required' });
            return;
        }

        if (!isValid(excerpt)) {
            res.status(400).send({ status: false, message: 'Excerpt is required' });
            return;
        }
        if (!isValid(userId)) {
            res.status(400).send({ status: false, message: `Userid is required` });
            return;
        }
        if (!isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: `Userid is Invalid` });
            return;
        }
        if (!isValid(ISBN)) {
            res.status(400).send({ status: false, message: `ISBN is required` });
            return;
        }
        if (!isValid(category)) {
            res.status(400).send({ status: false, message: `category is required` });
            return;
        }
        if (!isValid(subCategory)) {
            res.status(400).send({ status: false, message: `subCategory is required` });
            return;
        }
        if (!isValid(bookCover)) {
            res.status(400).send({ status: false, message: `subCategory is required` });
            return;
        }
        const sameTitle = await bookModel.findOne({ title: title.trim() });
        if (sameTitle) {
            return res.status(403).send({ status: false, message: `${title} is already in used` });
        }
        const sameISBN = await bookModel.findOne({ ISBN: ISBN.split(" ").join("") });
        if (sameISBN) {
            return res.status(403).send({ status: false, message: `${ISBN.split(" ").join("")} is already in used` });
        }
        if (req.user.userId == userId) {//only user is authorised to create book
            let findid = await writerModel.findOne({ userId })
            if (findid) {
               // console.log(findid)
               
                    
                    book["releasedAt"] = moment().format("MMM Do YY");
                    book["ISBN"] = ISBN.split(" ").join("");

                    let savedBook = await bookModel.create(book);
                    return res.status(201).send({ status: true, message: 'Success', data: savedBook });
                } else {
                    return res.status(404).send({ status: false, messege: "Cant Find The Writer" });
                }
            } else {
                return res.status(400).send({ status: false, messege: "You are not authorised" });
            }
        }
      catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    }

   const uploadImage=async function (req, res) {
    try {
        let files = req.files;
        if (files && files.length > 0) {
          //upload to s3 and return true..incase of error in uploading this will goto catch block( as rejected promise)
          let uploadedFileURL = await uploadFile( files[0] ); // expect this function to take file as input and give url of uploaded file as output 
          res.status(201).send({ status: true, data: uploadedFileURL });
    
        } 
        else {
          res.status(400).send({ status: false, msg: "No file to write" });
        }
    
      } 
      catch (e) {
        console.log("error is: ", e);
        res.status(500).send({ status: false, msg: "Error in uploading file to s3" });
      }
    
    }




//GET /books
const getBook = async function (req, res) {

        try {
            let updatedfilter = { isDeleted: false }
            if (req.query.userId) {
                updatedfilter["userId"] = req.query.userId
                if (!isValidObjectId(req.query.userId)) {
                    res.status(400).send({ status: false, message: `Userid is Invalid` });
                    return;
                }
            }
            if (req.query.category) {
                updatedfilter["category"] = (req.query.category).toLowerCase().trim()
            }
            if (req.query.subCategory) {
                updatedfilter["subCategory"] = (req.query.subCategory).toLowerCase().trim()
            }
            let check = await bookModel.find(updatedfilter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            if (check.length > 0) {//sorting books alphabetically
                check.sort(function (a, b) {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                    return 0;
                })
                return res.status(200).send({ status: true, messege: "Book List", data: check })
            }
            else {
                return res.status(404).send({ messege: "Cant Find What You Are Looking For" })
            }

        }
        catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    }


    //GET /books/:bookId

    const findBook = async function (req, res) {
        try {
            let bookId = req.params.bookId
            if (!isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, messege: "Please Use A Valid Link" })
            }
            if (!isValid(bookId)) {
                return res.status(400).send({ status: false, messege: "Please Use A Valid Link" })
            }
            let findbook = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0 })
            if (findbook) {
                let { title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releasedAt, createdAt, updatedAt } = findbook

                let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ createdAt: 0, updatedAt: 0, __v: 0 });

                const data = { title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releasedAt, createdAt, updatedAt, reviewsData }

                data["reviews"] = data["reviewsData"].length//to count reviews
                return res.status(200).send({ status: true, messege: "Book List", Data: data })

            } else {
                return res.status(404).send({ status: false, messege: "Cant Find What You Are Looking For" })
            }

        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    }


    //PUT /books/:bookId

    const updateBook = async function (req, res) {
        try {
            const bookId = req.params.bookId
            if (!isValidObjectId(bookId)) {
                res.status(400).send({ status: false, message: `bookid is Invalid` });
                return;
            }
            let title = req.body.title
            let excerpt = req.body.excerpt
            let ISBN = req.body.ISBN
            let releasedate = req.body.releasedate
            if (!isValid(bookId)) {
                return res.status(400).send({ messege: "Please Provide The Book Id" })
            }

            if (!isValidRequestBody(req.body)) {
                return res.status(400).send({ messege: "Please Provide The Required Field" })
            }

            if (title) {
                if (!isValid(title)) {
                    return res.status(400).send({ messege: "Please Provide The Valid Title" })
                }
                const sametitle = await bookModel.findOne({ title: title.trim() });
                if (sametitle) {
                    return res.status(403).send({ status: false, message: `${title.trim()} is already in used` });
                }
                title = title.trim();
            }
            if (title === "") { return res.status(400).send({ status: false, messege: "Provide The Title" }) }
            if (excerpt) {
                if (!isValid(excerpt)) {
                    return res.status(400).send({ messege: "Please Provide The Valid Excerpt" })
                }
            }
            if (excerpt === "") { return res.status(400).send({ status: false, messege: "Provide The Excerpt" }) }
            if (ISBN) {

                if (!isValid(ISBN)) {
                    return res.status(400).send({ status: false, messege: "Please Provide The Valid ISBN" })
                }
                const SameISBN = await bookModel.findOne({ ISBN: ISBN.split(" ").join("") });
                if (SameISBN) {
                    return res.status(403).send({ status: false, message: `${ISBN.split(" ").join("")} is already in used` });
                }
                ISBN = ISBN.split(" ").join("");

            }
            if (ISBN === "") { return res.status(400).send({ status: false, messege: "Provide The ISBN" }) }
            if (releasedate) {
                if (!isValid(releasedate)) {
                    return res.status(400).send({ messege: "Please Provide The Valid Date" })
                }
            }
            if (releasedate === "") { return res.status(400).send({ status: false, messege: "Provide The Release Date" }) }

            const check = await bookModel.findOne({ _id: bookId, isDeleted: false })
            if (!check) {
                return res.status(404).send({ status: false, msg: "Currently Their Is No Book" })
            }
            let id = check.userId

            if (req.user.userId == id) {//authorisation only user is authorised to update the book
                let findid1 = await writerModel.findOne({ id })
                if (!findid1) {
                    return res.status(404).send({ status: false, messege: "Cant Find The Writer" })
                }
                const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedate }, { new: true })

                return res.status(200).send({ status: true, message: 'Book updated successfully', data: updatedBook });
            } else {
                return res.status(404).send({ msg: "You Are Not Authorised To Update This" })
            }

        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    }


    //DELETE /books/:bookId

    const deleteBook = async function (req, res) {
        try {
            const bookId = req.params.bookId
            if (!isValid(bookId)) {
                return res.status(400).send({ messege: "Please Provide The bookId" })
            }
            if (!isValidObjectId(bookId)) {
                return res.status(400).send({ messege: "Please Provide Valid ObjectId" })
            }
            let findbook = await bookModel.findOne({ _id: bookId })
            if (!findbook) {
                return res.status(400).send({ message: "Currently Their Is No booK" })
            }
            let id = findbook.userId
            if (req.user.userId == id) {//only user is autherised
                let findid2 = await writerModel.findOne({ id })
                if (!findid2) {
                    return res.status(404).send({ status: false, messege: "Cant Find The Writer" })
                }
                let deletedbook = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true })
                if (deletedbook) {
                    return res.status(200).send({ status: true, messege: "Book Deleted Successfully", data: deletedbook })
                }

                else {
                    return res.status(404).send({ msg: "Book Has Been Already Deleted" })
                }
            }

        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    }















    module.exports.createBook = createBook
    module.exports.getBook = getBook
    module.exports.findBook = findBook
    module.exports.updateBook = updateBook
    module.exports.deleteBook = deleteBook
    module.exports.uploadImage = uploadImage
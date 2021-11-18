const bookModel = require("../models/bookModel.js");
const authorModel = require("../models/authorModel.js");
const publisherModel = require("../models/publisherModel.js");
const mongoose = require("mongoose");

const createBook = async function (req, res) {
  const data = req.body;
  authorId=req.body.author
  let request= await authorModel.findById(authorId)
  let pubId=req.body.publisher
let pubRequest=await publisherModel.findById(pubId)
if(request  && pubRequest){
  let createBook=await bookModel.create(data)
  res.send({ msg:createBook  });
}
else{
  res.send("the auther id or publisher id provided is not valid" );
}

};

const getBook = async function (req, res) {
  let AllBooks = await  bookModel.find().populate('author',{_id:1,author_name:1,age:1}).populate('publisher')
  res.send({completebook:AllBooks });
};

module.exports.createBook = createBook;
//module.exports.getBooks = getBooks;
module.exports.getBook = getBook;


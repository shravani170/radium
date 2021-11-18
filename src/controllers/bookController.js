const BookModel =require('../models/bookModel')
const authorController =require('./authorController')
const authorModel = require('../models/authorModel')

const getBookData = async function (req, res) {
    var data = req.body
    let savedData = await BookModel.create(data)
    res.send({ msg: savedData })
}
//find the author of “Two states” and update the book price to 100;  
//Send back the author_name and updated price in response

const updateAuthor = async function (req, res) {
    let allBook = await BookModel.find({name:"2 states"})
    let abc1 = await authorModel.find({author_Id:allBook[0].author_Id})
    let abc2 = abc1[0].author_name
   await BookModel.updateMany({name:"2 states"},{price:100}) 
   let abc3 = allBook[0].price
        res.send({ "author_name":abc2,"price":abc3 })
}
//Find the books which costs between 50-100(50,100 inclusive) 
//and respond back with the author names of respective books
const getAuthorName = async function (req, res) {
    let book = await bookModel.find({ price: { $in: [50, 100] } });
    let len = book.length
    let array = []
    let array1 = []
    for (let element of book) {
        let a = element.author_id
        let b = element.name;
        array.push(a)
        array1.push(b)
    }
    let arrayOfNames = []
    for (let element of array) {
        let name = await authorModel.find({ author_id: element })
        arrayOfNames.push(name[0].author_name)
    }
    res.send({ "books": array1, "authors": arrayOfNames })
}



module.exports. getAuthorName =  getAuthorName
module.exports.getBookData = getBookData
module.exports.updateAuthor = updateAuthor

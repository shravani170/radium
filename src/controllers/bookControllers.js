const bookModal=require('../modal/bookModal')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
  }
  
  const isValidRequestBody = function (writer) {
    return Object.keys(writer).length > 0
  }
const bookCreation = async function (req, res){
    try{
        const book = req.body;
        //const writerId = req.body.userId;
        //const tokenUserId = req["x-api-key"]['_id']
        if (!isValidRequestBody(book)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide writer details' });
            return;
          }
        const {title,excerpt,userId,ISBN,category,subCategory,review,deletedAt,isDeleted,releasedAt} = book
        const isIsbnAlreadyUsed = await writerModal.findOne({ ISBN:ISBN });
        if (isIsbnAlreadyUsed) {
            return res.status(403).send({ status: false, message: 'ISBN  already  exist' });
        }
        const isTitleAlreadyUsed = await writerModal.findOne({ title:title });
            if (isTitleAlreadyUsed) {
                return res.status(403).send({ status: false, message: 'title  already  exist' });
            }
        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'title is required' });
            return;
          }
          if (!isValid(excerpt)) {
            res.status(400).send({ status: false, message: 'excerpt is required' });
            return;
          }
          if (!isValid(userId)) {
            res.status(400).send({ status: false, message: 'userId is required' });
            return;
          }
          if (!isValid(ISBN)) {
            res.status(400).send({ status: false, message: 'ISBN is required' });
            return;
          }
          if (!isValid(category)) {
            res.status(400).send({ status: false, message: 'category is required' });
            return;
          }
          if (!isValid(subCategory)) {
            res.status(400).send({ status: false, message: 'subCategory is required' });
            return;
          }  
           // if (writerId === tokenUserId) {
                    let bookData={title,excerpt,userId,ISBN,category,subCategory,review,deletedAt,isDeleted,releasedAt}
                    bookData.releasedAt=new Date();
                    let data = await bookModal.create(bookData);
                    return res.status(201).send({ status: true, data: data });
           // } else {
            //    return res.status(403).send({ status: false, msg: "Not Authorised, Please login from requested account" });
           // }
        
    }catch (error) {
     res.status(500).send({ status: false, message: error.message });
   }
}

module.exports.bookCreation = bookCreation

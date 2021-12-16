const reviewModal=require('../modal/reviewModal')
const bookModal=require('../modal/bookModal')

const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}
const isValidRequestBody = function (writer) {
  return Object.keys(writer).length > 0
}
const reviewData =async function (req, res){
try{
    const parems =req.params.bookId
    const review = req.body
    if (!isValidRequestBody(review)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide writer details' });
      return;
    }
    const bookId = review.bookId
    let book= 0
    if(parems==bookId){
     book = await bookModal.findOne({_id:bookId})
    }
    if(book.length==0){
        return res.status(404).send({status:false,message:'book dose not exist'});
    }
    const {reviewedBy,rating}=review;
    if (!isValid(bookId)) {
        res.status(400).send({ status: false, message: 'Title  is required' });
        return;
      }
    if (!isValid( reviewedBy)) {
        res.status(400).send({ status: false, message: 'Title  is required' });
        return;
      }
    
    if (!isValid(rating)) {
        res.status(400).send({ status: false, message: 'Title  is required' });
        return;
      }
    const reviewedAt=new Date();
    let reviewData={bookId,reviewedBy,reviewedAt,rating};
    reviewData = await reviewModal.create(reviewData)
    res.status(201).send({status:true,message: 'Success',data:reviewData})
}catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
   
} 
module.exports.reviewData = reviewData
const reviewModal=require('../modal/reviewModal')
const bookModal=require('../modal/bookModal')

const reviewData =async function (req, res){
try{
    const review = req.body
    const bookId = req.body.bookId
    const book =await bookModal.findOne({_id:bookId})
    
    if(!book.length>0){
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
const express = require('express');

const router = express.Router();

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});
router.get('/color', function (req, res) {
    res.send('this is another ex api!')
});
router.get('/movies', function (req, res) {
   
    res.send(["terminator","avengers","antman","spiderman","superman"])
 });
 router.get('/movies/:movieId', function (req, res) {
   
  let movies= ["terminator","avengers","antman","spiderman","superman"]
  let index =req.params.movieId//jo postman me value di wo fetch karega
  let movieAtIndex = movies[index]//array ke kis position pe aayega 
  let a=movies.length
  if(index>a){
    res.send('index is out of bound') 
  }
  else{
    res.send(movieAtIndex)
  }
 });


router.get('/films', function (req, res) {
   
    res.send([ {
        id: 1,
        name: "The Shining"
       }, 
       {
        id:2 ,
        name: "Incendies"
       },
        {
        id: 3,
        name: "Rang de Basanti"
       },
        {
        id: 4,
        name: "Finding Demo"
       }])
 });
 router.get('/films/:filmId', function (req, res) {
   
    let movies= [ {
        id: 1,
        name: "The Shining"
       }, 
       {
        id:2 ,
        name: "Incendies"
       },
        {
        id: 3,
        name: "Rang de Basanti"
       },
        {
        id: 4,
        name: "Finding Demo"
       }]
   let value = req.params.filmId
   if(value >= movies.length){
   res.send('no movie exist')
   }else{
       res.send(movies[value])
   }
    });
 module.exports = router;
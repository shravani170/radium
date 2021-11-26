const axios = require("axios");
const cryptoModel= require("../models/cryptoModel")

// res.status(200). send( { data: userDetails } )

const getcoins = async function (req, res){

  try{ 

       let options = {
          header: {
              Authorization: "Bearer 995d40f0-11f5-4beb-b758-6554ae50a59a"
          },
        method : "get", 
        url : "http://api.coincap.io/v2/assets",
         
      }
      let response= await axios(options)
      let list= response.data.data
      for (i in list) {
          let cryptoData = {
              symbol:list[i].symbol,
              name:list[i].name,
              marketCapUsd:list[i].marketCapUsd,
              priceUsd:list[i].priceUsd,
          } 
          await cryptoModel.findOneAndUpdate({symbol:list[i].symbol}, cryptoData,{upsert:true,new:true});
      }
      list.sort(function (previous,next){return (previous.changePercent24Hr) - (next.changePercent24Hr)
    })
              
      res.status(200).send( {msg: "Success", data: list} )

  }
  catch(err) {
      console.log(err.message)
      res.status(500).send( { msg: "Something went wrong" } )
  }
}
module.exports.getcoins= getcoins



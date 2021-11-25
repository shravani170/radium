const axios = require("axios");

// res.status(200). send( { data: userDetails } )

const geteWeather = async function (req, res) {
  try {
    let options = {
      method: "get",
      url: "http://api.openweathermap.org/data/2.5/weather?q=London&appid=28f4e462e84610e7306c2a98769a789a",
    };
    const weatherForcast = await axios(options);

    console.log("WORKING");
    let weather = weatherForcast.data;
    res.status(200).send({ msg: "Successfully fetched data", data: weather });

  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }

};
//get london tem only from entire data
const getlondonTemp = async function (req, res) {
  try {
    let options = {
      method: "get",
      url: "http://api.openweathermap.org/data/2.5/weather?q=London&appid=28f4e462e84610e7306c2a98769a789a",
    };
    const london = await axios(options);
const tempOfLondon=london.data.main.temp
    console.log(tempOfLondon);

    res.status(200).send({ msg: "temp of london", data: tempOfLondon });

  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }

};
const getsortedByTemp = async function (req, res) {
  try {
    let cities=["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
    let temparray=[]
    for(i=0;i<cities.length;i++){
    let obj={city: cities[i]}//{city:bengaluru,temp:100}
    
      
      let resp=await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=28f4e462e84610e7306c2a98769a789a`)
    
  
    console.log(resp.data.main.temp);
    obj.temp=resp.data.main.temp
    temparray.push(obj)
    }
   let sorted=temparray.sort(function(previous,next){previous.temp-next.temp})
console.log(sorted)
res.status(200).send({ status:true, data:sorted });
  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }

};




module.exports.geteWeather = geteWeather;
 module.exports.getlondonTemp = getlondonTemp;
 module.exports.getsortedByTemp = getsortedByTemp ;
const axios = require("axios");

// res.status(200). send( { data: userDetails } )

const getWeather = async function (req, res) {
  try {
    let options = {
      method: "get",
      url: "http://api.openweathermap.org/data/2.5/weather?q=London&appid=d03c6511ac589c04857f3a2bc06681fd",
    };
    const weather = await axios(options);

    console.log("WORKING");
    let states = weather.data;
    res.status(200).send({ msg: "Successfully fetched data", data: states });

  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }

};

const getWeatherOfLondon = async function (req, res) {
  try {
    let options = {
      method: "get",
      url: "http://api.openweathermap.org/data/2.5/weather?q=London&appid=d03c6511ac589c04857f3a2bc06681fd",
    };
    const weatherStates = await axios(options);
    const londonTemp = weatherStates.data.main.temp
    // console.log("WORKING");
    // let states = londonTemp.data;
    res.status(200).send({ msg: "Successfully fetched data", data: londonTemp });

  } 
  catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Some error occured" });
  }

};
const getCityTemprature = async function (req, res) {
  try {
      let city =["Bengaluru","Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
      let id = req.query.appid;
      console.log(id);
      let tempratureArray=[]
      let options
      for (let i = 0; i < city.length; i++) {
          console.log("hi1")
            options = {
               method: "get",
               url: `http://api.openweathermap.org/data/2.5/weather?q=${city[i]}&appid=${id}`,
           }
          console.log("hi2")
          let response = await axios(options)
          console.log("hi3")
          tempratureArray.push({"city":city[i],"temp":response.data.main.temp})
      }
      tempratureArray.sort(function(a, b){return parseFloat(a.temp)-parseFloat(b.temp)})
      res.status(200).send({ message: "Data fetch successfully", data: tempratureArray })
  } catch (error) {
      res.status(500).send({ msg: "failed to fetch data", error: error.message })
  }
};



module.exports.getWeather = getWeather;
module.exports. getWeatherOfLondon =  getWeatherOfLondon;
module.exports. getCityTemprature =  getCityTemprature;
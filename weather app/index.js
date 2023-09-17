//creating weather api
let APIkey='d1845658f92b31c64bd94f06f7188c9c';
function renderWeatherInfo(data){
    let newPara=document.createElement('p');
newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`;
document.body.appendChild(newPara);
}

async function fetchWeatherDetail(){
  try {
    let  cityname='goa';
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`);
    let data=await response.json();
    console.log('weather data is' , data);
     renderWeatherInfo(data);
// for error handling we use try and catch block
  } catch (error) {
       console.log("found error" ,error)
  }
   

}

async function getCustomWeatherDetail(){
    try {
        let latitude=18.5;
        let longitude=17.6;
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}`)
        let data=await response.json();
        console.log('weather logitude and latitude is' , data);
        renderWeatherInfo(data);
    } catch (error) {
          console.log('found errror ',error)
    }
   
}
// Geolocation API-gives latitude and longitude of user
function getGeolocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log(' not have geolocation ');
    }
}
function showPosition(position){
    let lati=position.coords.latitude;
    let long=position.coords.longitude;
    console.log(lati);
   console.log(long);
  
}
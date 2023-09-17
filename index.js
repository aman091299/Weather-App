   const userTab=document.querySelector("[data-userWeather]") 
   const searchTab=document.querySelector("[data-searchWeather]")
   const userContainer=document.querySelector(".weather-container")
   const grantAccessContainer=document.querySelector(".grant-location-container")
   const searchForm=document.querySelector("[data-searchForm]")
   const loadingScreen=document.querySelector(".loading-container")
   const userInfoContainer=document.querySelector(".user-info-container")
   
   //intially variables need?

   let currentTab=userTab;
   const API_KEY='d1845658f92b31c64bd94f06f7188c9c'
   currentTab.classList.add("current-tab");
    
   //ek kam pending hai ?
   getfromSessionStorage();

    function switchTab(clickedTab){
        if(currentTab != clickedTab){
           currentTab.classList.remove("current-tab");
           currentTab=clickedTab;
           currentTab.classList.add("current-tab");
           if(!searchForm.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove('active');
            searchForm.classList.add('active');
           }
           else{
            //phle mai search wale tab pe tha,ab your weather tab visible krana h
            userInfoContainer.classList.remove('active');
            searchForm.classList.remove('active');
            //ab hm weather vale tab me hai,finding coordinate on weather tab ,check locale  storage first ,if coordinate  is not there then  saved it first
            getfromSessionStorage()  ;
           }

        }

    }
   userTab.addEventListener('click',()=>{
    switchTab(userTab);
   });
    
   searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
   });
   //check  if coordinates are already present in session storage
function  getfromSessionStorage(){
 
    const localCoordinates =sessionStorage.getItem("user-coordinates") 
  
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
      
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} =coordinates;
     // make grantcontainer invisible 
     grantAccessContainer.classList.remove("active");
     //make loader visible
     loadingScreen.classList.add("active");
     //API call
     try{
   const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
   const data=await  response.json();
   loadingScreen.classList.remove("active");
   userInfoContainer.classList.add("active");
   renderWeatherInfo(data)

}
     catch(e){
           loadingScreen.classList.remove("active");
           grantAccessContainer.classList.add("active");
           console.log("error is found",e)
     }


}
function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const weatherDesc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp =document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    //fetch  values from weatherInfo object and put it on UI elements
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=  `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src= `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}
function getlocation(){
    if(navigator.geolocation){
       
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocation supported");
    }
}
function showPosition(position){
    const userCoordinates={
        lat : position.coords.latitude,
        lon : position.coords.longitude,
     
    }
   // setting up session storage of latitude and logitude
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates)
}
 // finding geolocation from access button
const grantAccessButton =document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getlocation);
 
const searchInput=document.querySelector("[data-searchInput]")
const cityError=document.querySelector("[ data-error-container ]")
 searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
        if(cityName){
            fetchSearchWeatherInfo(cityName);
        }
        else{
            return;
        }
 })  

 async function fetchSearchWeatherInfo(cityName){
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active")
    loadingScreen.classList.add("active");
    try{
         const response=await  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}` )
         
         const data=await response.json();
         
        if(data.cod == '404'){
            
            loadingScreen.classList.remove("active");
            cityError.classList.add("active");
        }
        else{
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
              renderWeatherInfo(data) ;
        }
        
    }
    catch(e){
        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        grantAccessButton.classList.add("active");
        console("error found on search Tab city name",e);
    }
 }
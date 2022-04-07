import './App.css';
import Axios from 'axios';
import {useState, useEffect} from 'react';

function App() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weatherIcon, setWeatherIcon] = useState ('');
  const [textWeather, setTextWeather] = useState ('');
  const [temp, setTemp] = useState(0);
  const [isFarenheit, setIsFarenheit] = useState(false);
  const [indicator, setIndicator] = useState('°C');
  const [humidity, setHumidity] = useState(0);
  const [feelsLike, setFeelsLike] = useState(0);

  const key = '10bc2d7f7046721d24c2667b2fb25de1';
  let date = new Date().toDateString();
  let image = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;


  function convertion(){
    if(isFarenheit){
      setTemp(((temp-32)/1.8).toFixed(2));
      setFeelsLike(((feelsLike-32)/1.8).toFixed(2));

      setIndicator('°C');
      setIsFarenheit(false);
    }else{
      let farenheit = (temp*1.8) + 32;
      let feelLikeFarenheit = (feelsLike*1.8) + 32;

      setTemp(farenheit);
      setFeelsLike(feelLikeFarenheit);
      setIndicator('°F');
      setIsFarenheit(true);
    }
  }



  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(locate, gestionError, {enableHighAccuracy: true});
    function locate(position){
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    }

    function gestionError(err) {
      if(err.code === 1){
        alert("no se pudo obtener la direccion");
      }
    }

    Axios({
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`,
    })
      .then((response) => {
        setTemp(response.data.main.temp);
        setCity(response.data.name);
        setWeatherIcon(response.data.weather[0].icon);
        setCountry(response.data.sys.country);
        setTextWeather(response.data.weather[0].description);
        setHumidity(response.data.main.humidity);
        setFeelsLike(response.data.main.feels_like);
      })
      .catch((error) => {
        console.log(error);
    });

  }, [lon])





  return (
    <div className="App vw-100 vh-100 text-info d-flex align-items-center">
      <div className="container vh-75 difusal py-5">
        <p className="py-4 fs-1 fw-light">{city}, {country}</p>
          <h3 className="mb-5">{date}</h3>
          <div className="mt-4 d-block justify-content-center d-md-flex">
            <img  src={image} width="300px" height="300px"/>
            <div className="align-self-center">
              <p >{textWeather}</p>
              <p>Humedad: {humidity}%</p>
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-center">
              <h1 className="m-0 fw-lighter textTemp">{temp}</h1>
              <div className="d-block align-items-center p-4">
                <p className={isFarenheit ? "h-50 m-0 fs-1 opacity-25 pointer" : "h-50 m-0 fs-1"} onClick={convertion}>°C</p>
                <p className={isFarenheit ? "h-50 m-0 fs-1" : "h-50 m-0 fs-1 opacity-25 pointer"} onClick={convertion}>°F</p>
              </div>
            </div>
            <p>Sensación térmica de {feelsLike} {indicator}</p>
          </div>
      </div>
    </div>
  );
}

export default App;
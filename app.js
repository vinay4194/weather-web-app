const currDate = document.getElementById("date");
let weatherCon = document.querySelector(".weathercon");
//Expand the More Info tab---
const moreInfoDiv = document.querySelector(".more-info");
const moreInfo = document.querySelector(".fa-chevron-up"); //btn
const changeIcon = document.querySelector(".changeIcon");
const moreInfoItems = document.querySelector(".more-info-items");

moreInfo.addEventListener("click", activeInfo);
function activeInfo() {
	moreInfoDiv.classList.toggle("active");
	moreInfoDiv.classList.toggle("show-content");

	if (moreInfoDiv.classList.contains("active")) {
		changeIcon.classList.remove("fa-chevron-up");
		changeIcon.classList.add("fa-chevron-down");
	} else {
		changeIcon.classList.remove("fa-chevron-down");
		changeIcon.classList.add("fa-chevron-up");
	}
}

//Expand the Search Cities tab---
const searchCitiesDiv = document.querySelector(".search-cities");
const searchCities = document.querySelector(".fa-bars"); //btn
searchCities.addEventListener("click", activeSearch);

function activeSearch() {
	searchCitiesDiv.classList.toggle("activate");
	swapIconsTopRight(); //change icon from bars to cross n vice versa
}

//Search for a City and load its data---
const searchBox = document.getElementById("search-box");
const searchBtn = document.querySelector(".fa-search");
const errorMsg = document.querySelector(".error-msg");
//Select initial city on page load
let selectedCity = "Greater Noida";
getCityData(selectedCity);

searchBtn.addEventListener("click", function () {
	let searchInput = searchBox.value;
	if (searchInput == "") {
	} else {
		selectedCity = searchInput;
		getCityData(selectedCity);
	}
});

//Set the data for PreSuggested Cities---
const cityName = document.querySelectorAll(".cityTitle");
cityName.forEach((city) => {
	city.addEventListener("click", () => {
		const currentCity = city.innerHTML;
		// window.location.href=`http://localhost:8000/${currentCity}`;
		getCityData(currentCity);
	});
});
//Remove a City from saved cities
let removeCity = document.querySelectorAll(".fa-times-circle");
removeCity.forEach((city) => {
	city.addEventListener("click", () => {
		const currentElement = city.parentElement;
		currentElement.remove();
	});
});

//---------------*** Functions ***-------------------

//Get the data for the Selected City
function getCityData(city) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=02148ae38e8005a7ab9ed6cd5817beac`)
		.then((response) => response.json())
		.then((data) => {
			//show data if correct city name is entered
			if (data.cod == "200") {
				let arrData = [data];
				setData(arrData);
				searchCitiesDiv.classList.remove("activate");
				swapIconsTopRight();
			}
			//Show error if wrong city name is entered
			else if ((data.cod = "404")) {
				errorMsg.innerHTML = "City not found!";
			}
		});
}

//Kelvin to °C
function KtoC(k) {
	let c = k - 273.15;
	return c;
}

//change icon from bars to cross n vice versa
function swapIconsTopRight() {
	const swapIcons = document.querySelector(".swapIcons");
	if (searchCitiesDiv.classList.contains("activate")) {
		swapIcons.classList.remove("fa-bars");
		swapIcons.classList.add("fa-times");
	} else {
		swapIcons.classList.add("fa-bars");
		swapIcons.classList.remove("fa-times");
	}
}

function setData(data) {
	//Main Info elements
	const locationC = document.querySelector(".location");
	const tempC = document.querySelector(".temp");
	const tempMinMaxC = document.querySelector(".temp-min-max");
	const wcStatus = document.getElementById("wc-status");

	//More info elements
	const place = document.getElementById("place");
	const temp = document.getElementById("temp");
	const wConditions = document.getElementById("w-conditions");
	const feelsLike = document.getElementById("feels-like");
	const pressure = document.getElementById("pressure");
	const humidity = document.getElementById("humidity");
	const visibility = document.getElementById("visibility");
	const windSpeed = document.getElementById("wind-speed");
	errorMsg.innerHTML = "";

	//Set the Main Info contents
	locationC.innerHTML = `${data[0].name}, ${data[0].sys.country}`;
	tempC.innerHTML = `${KtoC(data[0].main.temp).toFixed(1)}°C`;
	tempMinMaxC.innerHTML = `Min ${KtoC(data[0].main.temp_min).toFixed(2)}°C | Max ${KtoC(data[0].main.temp_max).toFixed(2)}°C`;
	wcStatus.innerHTML = data[0].weather[0].main;
	let weather_con = data[0].weather[0].main;

	//Set the More Info contents
	place.innerHTML = data[0].name;
	temp.innerHTML = `${KtoC(data[0].main.temp).toFixed(1)}°C`;
	wConditions.innerHTML = data[0].weather[0].description;
	feelsLike.innerHTML = `${KtoC(data[0].main.feels_like).toFixed(1)}°C`;
	pressure.innerHTML = `${data[0].main.pressure} hPa`;
	humidity.innerHTML = `${data[0].main.humidity}%`;
	visibility.innerHTML = `${data[0].visibility} m`;
	windSpeed.innerHTML = `${data[0].wind.speed} m/s`;

	//Set the time for the selected city
	offset = data[0].timezone / 3600;
	setInterval(function () {
		d = new Date();
		utc = d.getTime() + d.getTimezoneOffset() * 60000;
		nd = new Date(utc + 3600000 * offset);
		t = String(nd);
		formated_time = t.split(" G"); //time without the GMT info
		currDate.innerHTML = formated_time[0].replace(/ /g, " | ");
	}, 1000);

	let unixTime = data[0].dt;
	let sunsetTime = data[0].sys.sunset;
	let sunriseTime = data[0].sys.sunrise;

	if ((unixTime > sunsetTime && unixTime > sunriseTime) || (unixTime < sunsetTime && unixTime < sunriseTime)) {
		if (weather_con == "Clear") {
			weatherCon.innerHTML = '<i class="scale fas fa-moon"></i>';
		}
	} else {
		if (weather_con == "Clear") {
			weatherCon.innerHTML = '<i class="scale fas fa-sun"></i>';
		}
	}

	// if(weather_con=="Sunny"){
	//    weatherCon.innerHTML='<i class="scale fas fa-sun"></i> '
	// }
	//Set the Main Weather Conditions Icon-------
	if (weather_con == "Clouds") {
		weatherCon.innerHTML = '<i class="scale fas fa-cloud"></i> ';
	} else if (weather_con == "Sunny") {
		weatherCon.innerHTML = '<i class="scale fas fa-sun"></i> ';
	} else if (weather_con == "Rainy" || weather_con == "Rain") {
		weatherCon.innerHTML = '<i class="scale fas fa-cloud-rain"></i> ';
	} else if (weather_con == "Haze") {
		weatherCon.innerHTML = '<i class="scale fas fa-smog"></i> ';
	}
}

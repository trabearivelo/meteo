(function() {

    document.getElementById("cityTitle").innerHTML = "Paris / FRANCE";
    document.getElementById("date").innerHTML = new Date().toDateString();

    let getMeteoData = function(city, latitude, longitude) {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&hourly=temperature_2m&forecast_days=1";
        fetch(url, {method: "GET"})
            .then(function(response) {
                const json = response.json();
                return json;
            })
            .then(function(data) {
                console.log(data);
                document.getElementById("cityList").classList.add("d-none");
                document.getElementById("cityTitle").innerHTML = city;
                const times = data.hourly.time;
                const temperatures = data.hourly.temperature_2m;
                let divHeures = document.getElementById("heures");
                divHeures.innerHTML = "";
                for (let i = 0; i < times.length; i++) {
                    const time = times[i];
                    const temperature = temperatures[i];
                    const timeDiv = document.createElement("div");
                    timeDiv.setAttribute("class", "col");
                    timeDiv.innerHTML = time + " " + temperature + " °C";
                    divHeures.appendChild(timeDiv);
                }
            });
    };

    let showCityProposal = function(jsonData) {
        if (!jsonData) {
            return;
        }

        const ulElt = document.getElementById("cityList");
        ulElt.innerHTML = "";

        for (let i = 0; i < jsonData.length; i++) {
            let data = jsonData[i];
            const itemElt = document.createElement("li");
            itemElt.setAttribute("class", "list-group-item city-item");
            itemElt.setAttribute("id", data.id);
            itemElt.setAttribute("latitude", data.latitude);
            itemElt.setAttribute("longitude", data.longitude);
            let city = data.name + " / " + data.country;
            itemElt.innerText = (data.postcodes ? data.postcodes[0] : "") + " - " + data.name + " / " + data.admin1  + " / " + data.country;

            itemElt.addEventListener("click", function(event) {
                console.log(data.latitude, data.longitude);
                getMeteoData(city, data.latitude, data.longitude);
            });


            ulElt.appendChild(itemElt);
        }

        ulElt.classList.remove("d-none");
    };

    let getGPSCoordonnees = function() {
        let texte = document.getElementById("textRechercher").value;
        if (texte === null || texte.trim() === "") {
            alert("Veuillez saisir une ville ou un code postal");
            return;
        }
        let url = "https://geocoding-api.open-meteo.com/v1/search?name=" + texte;
        let jsonData;
        fetch(url, {method: "GET"})
            .then(function(response) {
                const json = response.json();
                console.log(json);
                return json;
            })
            .then(function(data) {
                jsonData = data.results;
                console.log(jsonData);
                showCityProposal(jsonData);
            });
    };

    let btnRechercher = document.getElementById("btnRechercher");

    btnRechercher.addEventListener("click", getGPSCoordonnees);
})();
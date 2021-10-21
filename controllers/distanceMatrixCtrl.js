const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=Seattle&destinations=San+Francisco&'

const API_KEY = 'key=AIzaSyDOvZ2ahswxSzdfVCqhB9aTT4DaWyQWTqQ'



// Callback function used to process Distance Matrix response
function distance (response, status) {
    if (status !== "OK") {
      alert("Error with distance matrix");
      return;
    }
    console.log("==========start_response===========");
    console.log(response.originAddresses[0]);
    console.log("==========end_reponse============");
    let routes = response.rows[0].elements;
    var leastseconds = 86400; // 24 hours
    let drivetime = "";
    let closest = "";
    console.log("=====routes=========");
    console.log(routes[0].duration.value);
    console.log("=====end routes==========");
    for (let i = 0; i < routes.length; i++) {
      const routeseconds = routes[i].duration.value;
      if (routeseconds > 0 && routeseconds < leastseconds) {
        leastseconds = routeseconds; // this route is the shortest (so far)
        drivetime = routes[i].duration.text; // hours and minutes
        closest = response.originAddresses[i]; // city name from destinations
        console.log("=====closest chosen===== ");
        console.log(i);
        console.log("=====closest chosen==========");
      }
    }
    alert("The closest location is " + closest + " (" + drivetime + ")");
  }

  module.exports = distance
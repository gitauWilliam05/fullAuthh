("use strict");
const API_KEY = "AIzaSyA2lYBBhFiY0k1KkTdqHbG1k8wgrBWs_0E";
const DISTANCE_API_URL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

var qs = require("querystring"),
  request = require("request");

async function get_closest(req, res, callback) {
  try {
    console.log("===req==", req.body);
    var options = generateOptions.call(this, req.body);
    await fetchDistance_Data(options, function (err, data) {
      console.log("options", options);
      if (err) return callback(err);
      console.log("fetch_data", data);
      let resp = calculate_shortest_distance(data, data.status, function (err, data) {
        if (err) return callback(err);

        return resp;
      });
      console.log("response_data", resp);
      return res.status(200).send(resp);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

async function fetchDistance_Data(options, callback) {
  console.log("options", options);
  var URI = DISTANCE_API_URL + qs.stringify(options);
  console.log("API_URI", URI);
  await request(URI, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      var data = JSON.parse(body);
      console.log("response", data);
      callback(null, data);
    } else {
      callback(new Error("Request error: Could not fetch data from Google's servers: " + body));
    }
  });
}

var generateOptions = function (args) {
  console.log("args", args);
  var options = {
    index: args.index || null,
    origins: args.origin,
    destinations: args.destination,
    mode: args.mode || "driving",
    units: args.units || "metric",
    language: args.language || "en",
    avoid: args.avoid || null,
    sensor: args.sensor || false,
    key: API_KEY,
  };

  if (!args.origin && args.origins) {
    options.origins = args.origins.join("|");
    options.batchMode = true;
  }
  if (!args.destination && args.destinations) {
    options.destinations = args.destinations.join("|");
    options.batchMode = true;
  }

  if (!options.origins) {
    throw new Error("Argument Error: Origin is invalid");
  }
  if (!options.destinations) {
    throw new Error("Argument Error: Destination is invalid");
  }
  return options;
};

// the  function used to process Distance Matrix response data
function calculate_shortest_distance(response, status) {
  console.log("======processing response==========");
  if (status !== "OK") {
    throw new Error("Error with distance matrix" + status);
  }
  console.log("==========start_response===========");

  console.log(response);
  console.log("==========end_reponse============");
  let routes = response.rows[0].elements;
  console.log("route data", routes);
  var leastseconds = 86400; // 24 hours
  let drivetime = "";
  let closest = "";
  let distance = "";

  for (let i = 0; i < routes.length; i++) {
    const routeseconds = routes[i].duration.value;
    if (routeseconds > 0 && routeseconds < leastseconds) {
      leastseconds = routeseconds; // this route is the shortest (so far)
      drivetime = routes[i].duration.text; // hours and minutes
      distance = routes[i].distance.text;
      closest = response.destination_addresses[i]; //  from destinations
      console.log("=====start looping data ===== ");
      console.log(closest);
      console.log("=======end looping data========");
    }
  }
  return {
    closest,
    drivetime,
    distance,
  };
}

module.exports = {
  get_closest,
};

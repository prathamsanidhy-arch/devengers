const lat = 28.6139;
const lon = 77.2090;
const query = `[out:json];(node["amenity"~"police|hospital|townhall|courthouse"](around:10000,${lat},${lon});node["office"~"government|administrative|utility|energy"](around:10000,${lat},${lon}););out;`;
fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: "data=" + encodeURIComponent(query),
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept": "application/json",
    "User-Agent": "SmartBharatApp/1.0"
  }
}).then(res => res.json()).then(data => {
  console.log("Got " + data.elements.length + " elements");
}).catch(console.error);

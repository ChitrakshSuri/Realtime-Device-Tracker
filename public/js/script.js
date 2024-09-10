const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}

const map = L.map("map").setView([0, 0], 2); // Start with a zoomed-out view
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Chitraksh",
}).addTo(map);

const markers = {};

// Handle location updates from the server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // Only set map view on first location update to avoid resetting view on every update
  if (!markers[id]) {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
    map.setView([latitude, longitude], 10); // Set view to new user's location
  } else {
    markers[id].setLatLng([latitude, longitude]);
  }
});

// Handle user disconnection and remove their marker
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]); // Remove the marker from the map
    delete markers[id]; // Remove from the markers object
  }
});

window.onload = function () {
  searchAddress();
};

// Initialize the map
var map = L.map("map").setView([19.076, 72.8774], 10);

// Add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 10,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Variable to store the current marker
var currentMarker = null;

// Function to show a small message below the input (like flash)
function showMessage(text, type) {
  // Remove any existing message
  const existing = document.querySelector(".geocode-message");
  if (existing) existing.remove();

  // Create new message
  const msg = document.createElement("div");
  msg.className = "geocode-message";
  msg.style = `
      margin-top: 5px;
      padding: 8px 12px;
      font-size: 0.9rem;
      border-radius: 4px;
      border: 1px solid;
      background: ${type === "error" ? "#f8d7da" : "#d4edda"};
      color: ${type === "error" ? "#721c24" : "#155724"};
      border-color: ${type === "error" ? "#f5c6cb" : "#c3e6cb"};
    `;
  msg.textContent = text;

  // Insert it after the address input
  const input = document.getElementById("address-input");
  input.parentNode.insertBefore(msg, input.nextSibling);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (msg.parentNode) msg.remove();
  }, 4000);
}

// Function to search an address using OpenStreetMap (Nominatim)
async function searchAddress() {
  const address = document.getElementById("address-input").value.trim();
  if (!address) {
    showMessage("Please enter an address (e.g., Bandra, Mumbai)", "error");
    return;
  }

  // Nominatim (OpenStreetMap) geocoding URL
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "MyRealEstateApp/1.0 (your-email@example.com)", // ← Change this!
      },
    });
    const data = await response.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      const displayName = data[0].display_name;

      // Remove old marker (if any)
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      // Add new marker
      currentMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(displayName)
        .openPopup();

      // Center map on the found location
      map.setView([lat, lng], 15);

      // Fill hidden form fields
      document.getElementById("lat").value = lat;
      document.getElementById("lng").value = lng;
      document.getElementById("full-address").value = displayName;

      // Show success message
      showMessage("Location found: " + displayName, "success");
    } else {
      showMessage("Address not found. Try a more specific name.", "error");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    showMessage("Failed to search address. Check console.", "error");
  }
}

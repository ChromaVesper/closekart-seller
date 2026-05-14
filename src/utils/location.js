/**
 * Haversine distance calculation between two GPS coordinates.
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Filter a list of products/reels/shops by buyer's GPS position and radius.
 * @param {Array} items - Array of Firestore documents with { latitude, longitude }
 * @param {number} buyerLat
 * @param {number} buyerLon
 * @param {number} radiusKm - Max distance in km
 * @returns {Array} Filtered items with a `distanceKm` property added
 */
export function filterByDistance(items, buyerLat, buyerLon, radiusKm) {
  return items
    .filter((item) => {
      if (!item.latitude || !item.longitude) return true; // Include items with no location data
      const dist = haversineDistance(buyerLat, buyerLon, item.latitude, item.longitude);
      return dist <= radiusKm;
    })
    .map((item) => ({
      ...item,
      distanceKm:
        item.latitude && item.longitude
          ? haversineDistance(buyerLat, buyerLon, item.latitude, item.longitude).toFixed(1)
          : null,
    }))
    .sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
}

/**
 * Get browser GPS position as a Promise
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

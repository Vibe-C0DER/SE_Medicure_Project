/**
 * Haversine Distance Utility
 * Calculates the great-circle distance between two lat/lng points in kilometers.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers, or null if any coordinate is invalid
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((EARTH_RADIUS_KM * c).toFixed(1));
};

/**
 * Formats a distance number into a human-readable string.
 * @param {number|null} km
 * @returns {string}
 */
export const formatDistance = (km) => {
  if (km == null) return 'Distance N/A';
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km} km away`;
};

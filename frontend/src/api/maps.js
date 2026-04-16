/**
 * Google Maps API Utility
 * Uses the Google Maps JS SDK services via window.google
 */

const getGoogleKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Converts address text to lat/lng coordinates
 */
export const getCoordinates = async (address) => {
  if (!window.google) {
    throw new Error('Google Maps API not loaded');
  }

  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        resolve({
          lat: lat(),
          lng: lng(),
          address: results[0].formatted_address,
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * Searches for specialists near a location
 */
export const searchSpecialists = async (query, location) => {
  if (!window.google) {
    throw new Error('Google Maps API not loaded');
  }

  if (!location || (!location.lat || !location.lng)) {
    throw new Error('Invalid location data');
  }

  // Dummy container for PlacesService
  const dummyDiv = document.createElement('div');
  const service = new window.google.maps.places.PlacesService(dummyDiv);

  const request = {
    query: `${query} near ${location.address || 'me'}`,
    radius: 5000, // number instead of string
  };

  // Add coordinates for better accuracy
  request.location = new window.google.maps.LatLng(
    location.lat,
    location.lng
  );

  return new Promise((resolve, reject) => {
    service.textSearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        resolve(
          results.map((place) => ({
            place_id: place.place_id,
            name: place.name,
            rating: place.rating || 0,
            address: place.formatted_address || place.vicinity,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            types: place.types || [],
            photos: place.photos || [],
          }))
        );
      } else if (
        status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
      ) {
        resolve([]);
      } else {
        reject(new Error(`Places search failed: ${status}`));
      }
    });
  });
};
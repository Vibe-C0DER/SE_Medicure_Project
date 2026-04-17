import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Navbar from '../components/Navbar';
import { calculateDistance, formatDistance } from '../utils/distance';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

const SpecialistMap = () => {
  const routerLocation = useLocation();
  const { latitude, longitude, specialist: routerSpecialist } = routerLocation.state || {};

  const { results: reduxResults, query: reduxSpecialist } = useSelector((state) => state.search);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState({});
  const [sortBy, setSortBy] = useState('distance');

  const specialist = reduxSpecialist || routerSpecialist;
  const userLat = latitude || null;
  const userLng = longitude || null;
  const center = { lat: userLat || 0, lng: userLng || 0 };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (isLoaded && map) {
      const service = new window.google.maps.places.PlacesService(map);

      const fetchDetails = (results) => {
        let delay = 0;
        results.forEach((place) => {
          setTimeout(() => {
            service.getDetails(
              { placeId: place.place_id, fields: ['formatted_phone_number'] },
              (detailResult, detailStatus) => {
                if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && detailResult?.formatted_phone_number) {
                  setPhoneNumbers((prev) => ({ ...prev, [place.place_id]: detailResult.formatted_phone_number }));
                } else {
                  setPhoneNumbers((prev) => ({ ...prev, [place.place_id]: 'Phone unavailable' }));
                }
              }
            );
          }, delay);
          delay += 250;
        });
      };

      if (reduxResults && reduxResults.length > 0) {
        // Use results from Redux — already have lat/lng
        const enriched = reduxResults.map((r) => ({
          ...r,
          geometry: { location: { lat: r.lat, lng: r.lng } },
          distance: calculateDistance(userLat, userLng, r.lat, r.lng),
        }));
        setPlaces(enriched);
        fetchDetails(reduxResults);
      } else if (specialist && userLat && userLng) {
        // Fallback: use Places API textSearch
        const request = {
          location: center,
          radius: '5000',
          query: `${specialist} near me`,
        };
        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const enriched = results.map((place) => {
              const placeLat = typeof place.geometry.location.lat === 'function'
                ? place.geometry.location.lat()
                : place.geometry.location.lat;
              const placeLng = typeof place.geometry.location.lng === 'function'
                ? place.geometry.location.lng()
                : place.geometry.location.lng;
              return {
                ...place,
                lat: placeLat,
                lng: placeLng,
                distance: calculateDistance(userLat, userLng, placeLat, placeLng),
              };
            });
            setPlaces(enriched);
            fetchDetails(enriched);
          }
        });
      }
    }
  }, [isLoaded, map, specialist, userLat, userLng, reduxResults]);

  // Sorted list — memoized, recalculates only when places or sortBy changes
  const sortedPlaces = useMemo(() => {
    if (!places.length) return [];
    return [...places].sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      // Default: distance ascending (null distances pushed to bottom)
      if (a.distance == null && b.distance == null) return 0;
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });
  }, [places, sortBy]);

  if (!userLat || !userLng) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light text-slate-800">
        <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
        <Link to="/symptoms" className="text-[#db2777] hover:underline font-bold">Go back to Symptom Checker</Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light text-slate-900 font-sans overflow-hidden h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`w-full md:w-[450px] lg:w-[400px] flex flex-col bg-white border-r border-slate-200 z-20 shadow-xl md:shadow-none flex-shrink-0 absolute md:relative h-full transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
          id="sidebarPanel"
        >
          {/* Header */}
          <div className="flex-none p-4 border-b border-slate-100 bg-white z-10 sticky top-0">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-slate-900">Nearby {specialist}s</h1>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Sort by:</span>
              <button
                onClick={() => setSortBy('distance')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  sortBy === 'distance'
                    ? 'bg-[#db2777] text-white border-transparent shadow-sm shadow-pink-200'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-pink-200 hover:text-[#db2777]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">near_me</span>
                Distance
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  sortBy === 'rating'
                    ? 'bg-[#db2777] text-white border-transparent shadow-sm shadow-pink-200'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-pink-200 hover:text-[#db2777]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">star</span>
                Rating
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-500 font-medium px-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#db2777]">near_me</span>
              Showing {sortedPlaces.length} results near your location
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-background-light">
            {sortedPlaces.length === 0 && isLoaded && (
              <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
                <span className="material-symbols-outlined text-4xl">search_off</span>
                <p className="text-sm font-medium">
                  {specialist ? `No ${specialist}s found near your location.` : 'Searching for specialists...'}
                </p>
              </div>
            )}

            {sortedPlaces.map((place) => (
              <div
                key={place.place_id}
                onClick={() => setSelectedPlace(place)}
                className="group bg-white p-4 rounded-xl border border-pink-100 hover:border-[#db2777]/40 hover:shadow-md hover:shadow-pink-100 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#db2777] opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl"></div>
                <div className="flex flex-col gap-2">
                  {/* Name + Rating Row */}
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-slate-900 font-bold text-base leading-tight group-hover:text-[#db2777] transition-colors flex-1">
                      {place.name}
                    </h3>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {place.rating ? (
                        <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold border border-yellow-100">
                          <span className="material-symbols-outlined text-[13px]">star</span>
                          {place.rating}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded text-slate-400 text-xs border border-slate-100">
                          No rating
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Distance Badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#db2777]">directions_walk</span>
                    <span className="text-xs font-semibold text-[#db2777]">
                      {formatDistance(place.distance)}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-[16px] text-pink-300 mt-0.5 shrink-0">location_on</span>
                    <span className="line-clamp-2 text-xs">{place.formatted_address || place.vicinity || place.address}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="material-symbols-outlined text-[16px] text-pink-300 shrink-0">call</span>
                    <span className="line-clamp-1 font-medium text-xs">{phoneNumbers[place.place_id] || 'Loading...'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map */}
        <section className="flex-1 relative bg-pink-50 w-full h-full">
          <button
            className="md:hidden absolute top-4 left-4 z-30 bg-white p-3 rounded-full shadow-lg text-slate-700 hover:text-[#db2777] transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600">
              Map cannot be loaded right now.
            </div>
          )}

          {!isLoaded && !loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-pink-50/50">
              <div className="flex flex-col items-center gap-2 text-pink-500">
                <span className="material-symbols-outlined text-[32px] animate-bounce">location_on</span>
                <span className="text-sm font-semibold">Loading Map...</span>
              </div>
            </div>
          )}

          {isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={mapOptions}
            >
              {/* User's location marker */}
              <Marker
                position={center}
                icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                title="Your Location"
              />

              {/* Specialist markers */}
              {sortedPlaces.map((place) => (
                <Marker
                  key={place.place_id}
                  position={place.geometry.location}
                  icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                  onClick={() => setSelectedPlace(place)}
                />
              ))}

              {/* Info window */}
              {selectedPlace && (
                <InfoWindow
                  position={selectedPlace.geometry.location}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div className="p-1 max-w-[200px]">
                    <h3 className="font-bold text-sm text-gray-900 mb-1 leading-tight">{selectedPlace.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{selectedPlace.formatted_address || selectedPlace.vicinity || selectedPlace.address}</p>
                    <div className="flex items-center gap-1 text-xs text-[#db2777] font-bold mb-1">
                      <span className="material-symbols-outlined text-[13px]">directions_walk</span>
                      {formatDistance(selectedPlace.distance)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-700 font-bold mb-2">
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      {phoneNumbers[selectedPlace.place_id] || 'Loading...'}
                    </div>
                    {selectedPlace.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-1 py-0.5 rounded w-max">
                        <span className="material-symbols-outlined text-[12px] text-yellow-500">star</span>
                        <span className="text-xs font-bold text-yellow-700">{selectedPlace.rating}</span>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </section>
      </main>
    </div>
  );
};

export default SpecialistMap;

import React, { useCallback, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Navbar from '../components/Navbar';

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
  const { latitude, longitude, specialist } = routerLocation.state || {};

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState({});

  const center = { lat: latitude || 0, lng: longitude || 0 };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (isLoaded && map && specialist && latitude && longitude) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: center,
        radius: '5000',
        query: `${specialist} near me`,
      };
      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPlaces(results);
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
        }
      });
    }
  }, [isLoaded, map, specialist, latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light text-slate-800">
        <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
        <Link to="/symptoms" className="text-[#db2777] hover:underline font-bold">Go back to Symptom Checker</Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light text-slate-900 font-sans overflow-hidden h-screen flex flex-col">
      {/* <header className="flex-none z-50 bg-white border-b border-pink-100 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between mx-auto w-full max-w-[1920px]">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-3 text-slate-900 hover:opacity-80 transition-opacity" to="/">
              <div className="size-9 bg-[#db2777]/10 rounded-lg flex items-center justify-center text-[#db2777]">
                <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800">MediCure</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6 ml-4">
              <Link className="text-slate-600 hover:text-[#db2777] text-sm font-medium transition-colors" to="/">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
             <Link to="/prediction-result" className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#db2777] text-sm font-bold rounded-lg transition-colors border border-pink-100">
                Back to Results
             </Link>
          </div>
        </div>
      </header> */}
      <Navbar/>

      <main className="flex-1 flex overflow-hidden relative">
        <aside className={`w-full md:w-[450px] lg:w-[400px] flex flex-col bg-white border-r border-slate-200 z-20 shadow-xl md:shadow-none flex-shrink-0 absolute md:relative h-full transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} id="sidebarPanel">
          <div className="flex-none p-4 border-b border-slate-100 bg-white z-10 sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-slate-900">Nearby {specialist}s</h1>
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium px-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#db2777]">near_me</span>
              Showing {places.length} results near your location
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-background-light">
            {places.length === 0 && isLoaded && (
                <p className="text-sm text-slate-500 text-center py-4">Searching for specialists...</p>
            )}
            {places.map((place) => (
              <div 
                key={place.place_id}
                onClick={() => setSelectedPlace(place)}
                className="group bg-white p-4 rounded-xl border border-pink-100 hover:border-[#db2777]/40 hover:shadow-md hover:shadow-pink-100 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#db2777] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-slate-900 font-bold text-lg leading-tight group-hover:text-[#db2777] transition-colors">
                          {place.name}
                        </h3>
                      </div>
                      {place.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 text-xs font-bold border border-yellow-100">
                          <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                          {place.rating}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                      <span className="material-symbols-outlined text-[18px] text-pink-300 mt-0.5 shrink-0">location_on</span>
                      <span className="line-clamp-2">{place.formatted_address || place.vicinity}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <span className="material-symbols-outlined text-[18px] text-pink-300 shrink-0">call</span>
                      <span className="line-clamp-1 font-medium">{phoneNumbers[place.place_id] || 'Loading...'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

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
                <Marker
                  position={center}
                  icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                  title="Your Location"
                />

                {places.map((place) => (
                  <Marker
                    key={place.place_id}
                    position={place.geometry.location}
                    icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
                    onClick={() => setSelectedPlace(place)}
                  />
                ))}

                {selectedPlace && (
                  <InfoWindow
                    position={selectedPlace.geometry.location}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div className="p-1 max-w-[200px]">
                      <h3 className="font-bold text-sm text-gray-900 mb-1 leading-tight">{selectedPlace.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{selectedPlace.formatted_address || selectedPlace.vicinity}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-700 font-bold mb-2">
                         <span className="material-symbols-outlined text-[14px]">call</span>
                         {phoneNumbers[selectedPlace.place_id] || 'Loading...'}
                      </div>
                      {selectedPlace.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-1 py-0.5 rounded w-max">
                          <span className="material-symbols-outlined text-[12px] text-yellow-500 fill-current">star</span>
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

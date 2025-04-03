import React, { useEffect, useRef, useState } from 'react';
import { Profile, GeoLocation } from '@/types';
import { toast } from 'sonner';
import { loadGoogleMapsApi, isValidGoogleMapsApiKey } from '@/utils/MapUtils';
import GoogleMapsApiKeyInput from './GoogleMapsApiKeyInput';

// Default API key - in production, use environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface MapProps {
  selectedProfile?: Profile | null;
  profiles?: Profile[];
  onProfileSelect?: (profileId: string) => void;
  className?: string;
  initialCenter?: GeoLocation;
  initialZoom?: number;
}

const Map: React.FC<MapProps> = ({
  selectedProfile,
  profiles,
  onProfileSelect,
  className = '',
  initialCenter = { lat: 39.8283, lng: -98.5795 },
  initialZoom = 3,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState<string>(GOOGLE_MAPS_API_KEY);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});
  const infoWindowsRef = useRef<{ [key: string]: google.maps.InfoWindow }>({});

  // Show API key input if no key is provided
  const [showKeyInput, setShowKeyInput] = useState<boolean>(!GOOGLE_MAPS_API_KEY);

  // Initialize map when API key is available
  useEffect(() => {
    if (!mapContainer.current || !apiKey || showKeyInput) return;

    let mapInstance: google.maps.Map | null = null;
    let isComponentMounted = true;

    const initMap = async () => {
      try {
        await loadGoogleMapsApi(apiKey);
        
        if (mapContainer.current && !mapRef.current && isComponentMounted) {
          mapInstance = new google.maps.Map(mapContainer.current, {
            center: { lat: initialCenter.lat, lng: initialCenter.lng },
            zoom: initialZoom,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
          });
          
          mapRef.current = mapInstance;
          
          // Add event listener for map load
          google.maps.event.addListenerOnce(mapInstance, 'tilesloaded', () => {
            if (isComponentMounted) {
              setIsMapReady(true);
            }
          });
        }
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        if (isComponentMounted) {
          toast.error("Failed to initialize map. Please check your Google Maps API key.");
          setShowKeyInput(true);
        }
      }
    };

    initMap();

    return () => {
      isComponentMounted = false;
      
      // Safer cleanup approach
      if (mapRef.current) {
        // First clean up info windows
        Object.values(infoWindowsRef.current).forEach(infoWindow => {
          try {
            infoWindow.close();
          } catch (e) {
            console.warn("Error closing info window:", e);
          }
        });
        
        // Then clean up markers
        Object.values(markersRef.current).forEach(marker => {
          try {
            marker.setMap(null);
          } catch (e) {
            console.warn("Error removing marker:", e);
          }
        });
        
        // Clear references
        infoWindowsRef.current = {};
        markersRef.current = {};
        
        // Remove all event listeners
        if (window.google && window.google.maps) {
          google.maps.event.clearInstanceListeners(mapRef.current);
        }
        
        mapRef.current = null;
      }
    };
  }, [apiKey, showKeyInput, initialCenter, initialZoom]);

  // Check localStorage for saved API key on first load
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('google_maps_api_key');
      if (savedKey && isValidGoogleMapsApiKey(savedKey)) {
        setApiKey(savedKey);
        setShowKeyInput(false);
      }
    } catch (e) {
      console.warn('Could not access localStorage', e);
    }
  }, []);

  // Handle API key set from GoogleMapsApiKeyInput
  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    setShowKeyInput(false);
  };

  // Add markers for profiles - with explicit cleanup
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    // Create local tracking of created elements
    const currentMarkers: { [key: string]: google.maps.Marker } = {};
    const currentInfoWindows: { [key: string]: google.maps.InfoWindow } = {};
    let isEffectActive = true;

    // Clear existing markers before creating new ones
    Object.values(markersRef.current).forEach(marker => {
      try {
        marker.setMap(null);
      } catch (e) {
        console.warn("Error removing marker:", e);
      }
    });
    
    // Clear existing info windows
    Object.values(infoWindowsRef.current).forEach(infoWindow => {
      try {
        infoWindow.close();
      } catch (e) {
        console.warn("Error closing info window:", e);
      }
    });

    // Add markers for all profiles
    if (profiles?.length && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      
      profiles.forEach(profile => {
        if (!isEffectActive) return;
        
        const { location } = profile.address;
        const position = { lat: location.lat, lng: location.lng };
        
        // Create marker
        const marker = new google.maps.Marker({
          position,
          map: mapRef.current,
          title: profile.name,
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: selectedProfile?.id === profile.id ? 10 : 8,
            fillColor: selectedProfile?.id === profile.id ? '#7c3aed' : '#4f46e5',
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#ffffff',
          }
        });
        
        // Create info window
        const contentString = `
          <div style="max-width: 250px; padding: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <img src="${profile.avatar}" alt="${profile.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
              <div>
                <h3 style="margin: 0; font-weight: 600;">${profile.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${profile.address.city}, ${profile.address.state}</p>
              </div>
            </div>
            <p style="margin: 5px 0; font-size: 14px;">${profile.description.substring(0, 100)}${profile.description.length > 100 ? '...' : ''}</p>
          </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 300
        });
        
        // Add click event to marker
        const clickListener = marker.addListener('click', () => {
          // Close all info windows
          Object.values(currentInfoWindows).forEach(window => {
            try {
              window.close();
            } catch (e) {
              console.warn("Error closing info window:", e);
            }
          });
          
          // Open this info window
          infoWindow.open(mapRef.current, marker);
          
          // Call profile select handler if provided
          if (onProfileSelect) {
            onProfileSelect(profile.id);
          }
        });
        
        // Store marker and info window references
        currentMarkers[profile.id] = marker;
        currentInfoWindows[profile.id] = infoWindow;
        
        // Extend bounds to include this marker
        bounds.extend(position);
      });
      
      // Fit map to bounds if multiple profiles and no selected profile
      if (isEffectActive && profiles.length > 1 && !selectedProfile && mapRef.current) {
        try {
          mapRef.current.fitBounds(bounds);
          
          // Add some padding
          google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
            if (isEffectActive && mapRef.current) {
              mapRef.current.setZoom(Math.min(mapRef.current.getZoom() || 15, 15));
            }
          });
        } catch (e) {
          console.warn("Error fitting bounds:", e);
        }
      }
      
      // Update refs with the current collections we've created
      if (isEffectActive) {
        markersRef.current = currentMarkers;
        infoWindowsRef.current = currentInfoWindows;
      }
    }
    
    // Handle selected profile
    if (isEffectActive && selectedProfile && mapRef.current) {
      try {
        const { location } = selectedProfile.address;
        
        // Center map on selected profile
        mapRef.current.panTo({ lat: location.lat, lng: location.lng });
        mapRef.current.setZoom(14);
        
        // If we have a marker for the selected profile, show its info window
        if (markersRef.current[selectedProfile.id]) {
          const marker = markersRef.current[selectedProfile.id];
          const infoWindow = infoWindowsRef.current[selectedProfile.id];
          
          if (infoWindow) {
            // Close all other info windows
            Object.values(infoWindowsRef.current).forEach(window => {
              if (window !== infoWindow) {
                try {
                  window.close();
                } catch (e) {
                  console.warn("Error closing info window:", e);
                }
              }
            });
            
            // Open this info window
            infoWindow.open(mapRef.current, marker);
          }
        }
        // If we don't have profiles list but have a selected profile, create a marker for it
        else if (!profiles) {
          const position = { lat: location.lat, lng: location.lng };
          
          const marker = new google.maps.Marker({
            position,
            map: mapRef.current,
            title: selectedProfile.name,
            animation: google.maps.Animation.DROP,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#7c3aed',
              fillOpacity: 0.9,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            }
          });
          
          // Store this single marker for cleanup
          currentMarkers['selected'] = marker;
        }
      } catch (e) {
        console.warn("Error handling selected profile:", e);
      }
    }

    return () => {
      isEffectActive = false;
      
      // Clean up the markers created in this effect
      Object.values(currentMarkers).forEach(marker => {
        try {
          if (marker) {
            google.maps.event.clearInstanceListeners(marker);
            marker.setMap(null);
          }
        } catch (e) {
          console.warn("Error cleaning up marker:", e);
        }
      });
      
      // Close info windows created in this effect
      Object.values(currentInfoWindows).forEach(infoWindow => {
        try {
          if (infoWindow) {
            infoWindow.close();
          }
        } catch (e) {
          console.warn("Error closing info window:", e);
        }
      });
    };
  }, [isMapReady, selectedProfile, profiles, onProfileSelect]);

  // Render the map container or API key input
  return (
    <>
      {showKeyInput ? (
        <GoogleMapsApiKeyInput onApiKeySet={handleApiKeySet} />
      ) : (
        <div 
          ref={mapContainer} 
          className={`w-full h-full ${className}`}
          style={{ minHeight: '100%' }}
          data-testid="map-container"
        />
      )}
    </>
  );
};

export default Map;


import React, { useEffect, useRef, useState } from 'react';
import { Profile, GeoLocation } from '@/types';
import { toast } from 'sonner';
import { loadGoogleMapsApi, isValidGoogleMapsApiKey } from '@/utils/MapUtils';
import GoogleMapsApiKeyInput from './GoogleMapsApiKeyInput';

// Default API key - in production, use environment variables
const GOOGLE_MAPS_API_KEY = '';

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

    const initMap = async () => {
      try {
        await loadGoogleMapsApi(apiKey);
        
        if (!mapRef.current) {
          mapRef.current = new google.maps.Map(mapContainer.current, {
            center: { lat: initialCenter.lat, lng: initialCenter.lng },
            zoom: initialZoom,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
          });
          
          // Add event listener for map load
          google.maps.event.addListenerOnce(mapRef.current, 'tilesloaded', () => {
            setIsMapReady(true);
          });
        }
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        toast.error("Failed to initialize map. Please check your Google Maps API key.");
        setShowKeyInput(true);
      }
    };

    initMap();

    return () => {
      // Clean up markers
      Object.values(markersRef.current).forEach(marker => {
        marker.setMap(null);
      });
      markersRef.current = {};
      
      // Clean up info windows
      Object.values(infoWindowsRef.current).forEach(infoWindow => {
        infoWindow.close();
      });
      infoWindowsRef.current = {};
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

  // Add markers for profiles
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = {};
    
    // Clear existing info windows
    Object.values(infoWindowsRef.current).forEach(infoWindow => {
      infoWindow.close();
    });
    infoWindowsRef.current = {};

    // Add markers for all profiles
    if (profiles?.length) {
      const bounds = new google.maps.LatLngBounds();
      
      profiles.forEach(profile => {
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
        marker.addListener('click', () => {
          // Close all info windows
          Object.values(infoWindowsRef.current).forEach(window => {
            window.close();
          });
          
          // Open this info window
          infoWindow.open(mapRef.current, marker);
          
          // Call profile select handler if provided
          if (onProfileSelect) {
            onProfileSelect(profile.id);
          }
        });
        
        // Store marker and info window references
        markersRef.current[profile.id] = marker;
        infoWindowsRef.current[profile.id] = infoWindow;
        
        // Extend bounds to include this marker
        bounds.extend(position);
      });
      
      // Fit map to bounds if multiple profiles and no selected profile
      if (profiles.length > 1 && !selectedProfile) {
        mapRef.current.fitBounds(bounds);
        
        // Add some padding
        const listener = google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
          mapRef.current?.setZoom(Math.min(mapRef.current.getZoom() || 15, 15));
        });
      }
    }
    
    // Handle selected profile
    if (selectedProfile) {
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
            window.close();
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
        
        const contentString = `
          <div style="max-width: 250px; padding: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <img src="${selectedProfile.avatar}" alt="${selectedProfile.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
              <div>
                <h3 style="margin: 0; font-weight: 600;">${selectedProfile.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${selectedProfile.address.city}, ${selectedProfile.address.state}</p>
              </div>
            </div>
            <p style="margin: 5px 0; font-size: 14px;">${selectedProfile.description}</p>
            <p style="margin: 5px 0; font-size: 12px; font-weight: 600;">${selectedProfile.address.street}, ${selectedProfile.address.city}, ${selectedProfile.address.state} ${selectedProfile.address.zipCode}</p>
          </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 300
        });
        
        // Store references
        markersRef.current[selectedProfile.id] = marker;
        infoWindowsRef.current[selectedProfile.id] = infoWindow;
        
        // Open info window
        infoWindow.open(mapRef.current, marker);
      }
    }
  }, [isMapReady, selectedProfile, profiles, onProfileSelect]);

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        google.maps.event.trigger(mapRef.current, 'resize');
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (showKeyInput) {
    return (
      <GoogleMapsApiKeyInput 
        onApiKeySet={handleApiKeySet} 
        className={className}
      />
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className={`h-full min-h-[300px] ${className} relative rounded-md overflow-hidden border`}
    >
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="animate-pulse-slow">
            <div className="h-10 w-10 rounded-full bg-primary animate-spin border-t-2 border-primary-foreground"></div>
          </div>
          <span className="ml-3 text-sm font-medium">Loading map...</span>
        </div>
      )}
    </div>
  );
};

export default Map;

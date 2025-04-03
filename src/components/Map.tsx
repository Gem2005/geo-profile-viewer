
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Profile, GeoLocation } from '@/types';
import { toast } from 'sonner';

// Note: In a production app, this would be stored as an environment variable
// or retrieved from a backend service
const MAPBOX_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN";

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
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_ACCESS_TOKEN);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // For token input if the hardcoded token is not set
  const [showTokenInput, setShowTokenInput] = useState<boolean>(!MAPBOX_ACCESS_TOKEN || MAPBOX_ACCESS_TOKEN === "YOUR_MAPBOX_ACCESS_TOKEN");

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || showTokenInput) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      if (!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [initialCenter.lng, initialCenter.lat],
          zoom: initialZoom,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        map.current.on('load', () => {
          setIsMapReady(true);
        });

        // Add responsive handling
        window.addEventListener('resize', () => {
          map.current?.resize();
        });
      }
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      toast.error("Failed to initialize map. Please check your Mapbox token.");
      setShowTokenInput(true);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, showTokenInput, initialCenter, initialZoom]);

  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
    if (input.value.trim()) {
      setMapboxToken(input.value.trim());
      setShowTokenInput(false);
    }
  };

  // Add markers for all profiles if provided
  useEffect(() => {
    if (!isMapReady || !map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // If we have multiple profiles to show
    if (profiles?.length) {
      profiles.forEach(profile => {
        const { location } = profile.address;
        
        // Create a marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'rounded-full bg-primary w-6 h-6 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold';
        markerEl.innerHTML = profile.name.charAt(0);
        
        // If this is the selected profile, make it larger
        if (selectedProfile?.id === profile.id) {
          markerEl.classList.add('w-8', 'h-8');
          markerEl.classList.remove('w-6', 'h-6');
        }
        
        // Create and add the marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([location.lng, location.lat])
          .addTo(map.current!);
        
        // Add popup with profile info on click
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="flex items-center gap-3">
              <img src="${profile.avatar}" alt="${profile.name}" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 class="font-semibold">${profile.name}</h3>
                <p class="text-xs text-muted-foreground">${profile.address.city}, ${profile.address.state}</p>
              </div>
            </div>
            <p class="mt-2 text-sm">${profile.description.substring(0, 100)}${profile.description.length > 100 ? '...' : ''}</p>
          `);
        
        marker.setPopup(popup);
        
        // Add click handler if onProfileSelect is provided
        if (onProfileSelect) {
          marker.getElement().addEventListener('click', () => {
            onProfileSelect(profile.id);
          });
        }
        
        markersRef.current[profile.id] = marker;
      });
      
      // If there are multiple profiles, fit the map to show all markers
      if (profiles.length > 1 && !selectedProfile) {
        const bounds = new mapboxgl.LngLatBounds();
        profiles.forEach(profile => {
          bounds.extend([
            profile.address.location.lng,
            profile.address.location.lat
          ]);
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
    
    // If we have a single selected profile
    if (selectedProfile) {
      const { location } = selectedProfile.address;
      
      // Fly to the selected profile location
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 14,
        essential: true,
        duration: 1000
      });
      
      // If we don't have multiple profiles being shown, create a marker just for this selected profile
      if (!profiles) {
        const markerEl = document.createElement('div');
        markerEl.className = 'rounded-full bg-accent w-8 h-8 border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold';
        markerEl.innerHTML = selectedProfile.name.charAt(0);
        
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([location.lng, location.lat])
          .addTo(map.current);
        
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="flex items-center gap-3">
              <img src="${selectedProfile.avatar}" alt="${selectedProfile.name}" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 class="font-semibold">${selectedProfile.name}</h3>
                <p class="text-xs text-muted-foreground">${selectedProfile.address.city}, ${selectedProfile.address.state}</p>
              </div>
            </div>
            <p class="mt-2 text-sm">${selectedProfile.description}</p>
            <p class="mt-2 text-xs font-semibold">${selectedProfile.address.street}, ${selectedProfile.address.city}, ${selectedProfile.address.state} ${selectedProfile.address.zipCode}</p>
          `);
        
        marker.setPopup(popup).togglePopup();
        markersRef.current[selectedProfile.id] = marker;
      } else if (markersRef.current[selectedProfile.id]) {
        // If the marker already exists, open its popup
        markersRef.current[selectedProfile.id].togglePopup();
      }
    }
  }, [isMapReady, selectedProfile, profiles, onProfileSelect]);

  if (showTokenInput) {
    return (
      <div className={`border rounded-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4">Mapbox API Token Required</h3>
        <p className="mb-4 text-muted-foreground">
          Please enter a valid Mapbox access token to enable the map functionality. 
          You can get one from <a href="https://account.mapbox.com/access-tokens/" 
          target="_blank" rel="noopener noreferrer" 
          className="text-blue-500 hover:underline">Mapbox</a>.
        </p>
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <input 
            type="text" 
            className="w-full p-2 border rounded-md"
            placeholder="pk.eyJ1IjoieW91..." 
            required
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Set Token
          </button>
        </form>
      </div>
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

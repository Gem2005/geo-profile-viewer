
// Function to validate Google Maps API key
export const isValidGoogleMapsApiKey = (key: string): boolean => {
  // Basic validation - should be a non-empty string with proper length
  return typeof key === 'string' && key.length > 20;
};

// Get Google Maps API URL with the key
export const getGoogleMapsApiUrl = (apiKey: string): string => {
  return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
};

// Function to load Google Maps API script dynamically
export const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if API is already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = getGoogleMapsApiUrl(apiKey);
    script.async = true;
    script.defer = true;
    
    // Handle script load success
    script.onload = () => {
      resolve();
    };
    
    // Handle script load error
    script.onerror = () => {
      reject(new Error('Google Maps API could not be loaded.'));
    };
    
    // Append script to document head
    document.head.appendChild(script);
  });
};

// Function to get coordinates from address
export const geocodeAddress = async (
  address: string, 
  apiKey: string
): Promise<{ lat: number; lng: number } | null> => {
  try {
    // Ensure Google Maps API is loaded
    await loadGoogleMapsApi(apiKey);
    
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Define type for window to add google maps
declare global {
  interface Window {
    google: {
      maps: any;
    };
  }
}

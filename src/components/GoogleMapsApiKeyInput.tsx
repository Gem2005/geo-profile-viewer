
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { isValidGoogleMapsApiKey } from '@/utils/MapUtils';

interface GoogleMapsApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  className?: string;
}

const GoogleMapsApiKeyInput: React.FC<GoogleMapsApiKeyInputProps> = ({ 
  onApiKeySet,
  className = '' 
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  
  // Check for saved API key in localStorage
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('google_maps_api_key');
      if (savedKey && isValidGoogleMapsApiKey(savedKey)) {
        setApiKey(savedKey);
      }
    } catch (error) {
      console.warn('Could not access localStorage', error);
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isValidGoogleMapsApiKey(apiKey)) {
      // Save to localStorage
      try {
        localStorage.setItem('google_maps_api_key', apiKey);
      } catch (error) {
        console.warn('Could not save to localStorage', error);
      }
      
      // Call the callback
      onApiKeySet(apiKey);
      toast.success('Google Maps API key has been set');
    } else {
      toast.error('Please enter a valid Google Maps API key');
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Google Maps API Key Required</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">
          Please enter a valid Google Maps API key to enable the map functionality. 
          You can get one from <a 
            href="https://console.cloud.google.com/google/maps-apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline"
          >
            Google Cloud Console
          </a>.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="AIzaSyC..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Your API key will be stored locally in your browser. It is never sent to our servers.
            </p>
          </div>
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full">
              Set API Key
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsApiKeyInput;

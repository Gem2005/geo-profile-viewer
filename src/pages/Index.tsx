
import React, { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { profiles, searchProfiles } from '@/data/profiles';
import ProfileList from '@/components/ProfileList';
import SearchBar from '@/components/SearchBar';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>(profiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'profiles' | 'map'>('profiles');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle search and filter
  const handleSearch = (query: string, filterBy: string) => {
    setFilteredProfiles(searchProfiles(query, filterBy));
  };

  // Handle profile selection for map view
  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setActiveView('map');
  };

  // Handle profile selection from map markers
  const handleProfileSelectFromMap = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setSelectedProfile(profile);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen">
      <header className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="text-primary" />
            Geo Profile Viewer
          </h1>
          <Link to="/admin">
            <Button variant="outline" className="gap-2">
              <ShieldCheck size={16} />
              Admin Panel
            </Button>
          </Link>
        </div>
        <SearchBar onSearch={handleSearch} />
      </header>

      <Tabs 
        value={activeView} 
        onValueChange={(value) => setActiveView(value as 'profiles' | 'map')}
        className="mt-8"
      >
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles" className="mt-0">
          <ProfileList 
            profiles={filteredProfiles} 
            onSelectProfile={handleSelectProfile}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="map" className="mt-0">
          <div className="h-[70vh] rounded-md overflow-hidden">
            <Map 
              selectedProfile={selectedProfile}
              profiles={filteredProfiles}
              onProfileSelect={handleProfileSelectFromMap}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

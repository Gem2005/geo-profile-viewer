
import React, { useState } from 'react';
import { Profile } from '@/types';
import { profiles as initialProfiles, addProfile, updateProfile, deleteProfile } from '@/data/profiles';
import AdminPanel from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);

  // Handle adding a new profile
  const handleAddProfile = (profile: Profile) => {
    // Generate a proper ID for the new profile
    const newProfile = {
      ...profile,
      id: crypto.randomUUID()
    };
    
    addProfile(newProfile);
    setProfiles(prevProfiles => [...prevProfiles, newProfile]);
  };

  // Handle updating a profile
  const handleUpdateProfile = (updatedProfile: Profile) => {
    updateProfile(updatedProfile);
    setProfiles(prevProfiles => 
      prevProfiles.map(profile => 
        profile.id === updatedProfile.id ? updatedProfile : profile
      )
    );
  };

  // Handle deleting a profile
  const handleDeleteProfile = (id: string) => {
    deleteProfile(id);
    setProfiles(prevProfiles => 
      prevProfiles.filter(profile => profile.id !== id)
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              Back to Profiles
            </Button>
          </Link>
        </div>
      </header>

      <AdminPanel
        profiles={profiles}
        onAddProfile={handleAddProfile}
        onUpdateProfile={handleUpdateProfile}
        onDeleteProfile={handleDeleteProfile}
      />
    </div>
  );
};

export default Admin;

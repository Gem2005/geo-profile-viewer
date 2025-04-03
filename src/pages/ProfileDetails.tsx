import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Profile } from '@/types';
import { getProfileById, updateProfile } from '@/data/profiles';
import ProfileDetail from '@/components/ProfileDetail';
import AdminPanel from '@/components/AdminPanel';
import { toast } from 'sonner';

const ProfileDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // Simulate API call to get profile
    setIsLoading(true);
    setTimeout(() => {
      const foundProfile = getProfileById(id);
      
      if (foundProfile) {
        setProfile(foundProfile);
      } else {
        toast.error('Profile not found');
        navigate('/');
      }
      
      setIsLoading(false);
    }, 500);
  }, [id, navigate]);

  // Handle edit profile
  const handleEditProfile = (profile: Profile) => {
    setIsEditing(true);
  };

  // Handle update profile
  const handleUpdateProfile = (updatedProfile: Profile) => {
    updateProfile(updatedProfile);
    setProfile(updatedProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="h-80 bg-muted rounded-md"></div>
              <div className="h-60 bg-muted rounded-md"></div>
            </div>
            <div className="lg:col-span-2">
              <div className="h-[500px] bg-muted rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isEditing ? (
        <AdminPanel
          profiles={[profile]}
          onAddProfile={() => {}}
          onUpdateProfile={handleUpdateProfile}
          onDeleteProfile={() => {}}
        />
      ) : (
        <ProfileDetail 
          profile={profile} 
          onEdit={handleEditProfile}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default ProfileDetails;


import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import { Profile } from '@/types';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ProfileListProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  isLoading?: boolean;
}

const ProfileList: React.FC<ProfileListProps> = ({ 
  profiles, 
  onSelectProfile, 
  isLoading = false 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-muted"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </div>
            </div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="flex space-x-2">
              <div className="h-8 flex-1 bg-muted rounded"></div>
              <div className="h-8 flex-1 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">No profiles found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end pb-2">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid size={18} />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List size={18} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              onViewSummary={onSelectProfile} 
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              onViewSummary={onSelectProfile} 
              compact 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileList;

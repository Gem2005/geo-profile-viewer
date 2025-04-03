
import React from 'react';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Mail, Phone, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCardProps {
  profile: Profile;
  onViewSummary: (profile: Profile) => void;
  compact?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onViewSummary, compact = false }) => {
  const navigate = useNavigate();
  const { name, avatar, description, address, email, phone, occupation, company } = profile;
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // View profile details
  const handleViewDetails = () => {
    navigate(`/profile/${profile.id}`);
  };

  // Render compact card for smaller screens or list views
  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-xs text-muted-foreground flex items-center">
                <MapPin size={12} className="mr-1" />
                {address.city}, {address.state}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={() => onViewSummary(profile)}
          >
            View on Map
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Render full card
  return (
    <Card className="hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-2 border-primary/10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-xl">{name}</h3>
            {occupation && (
              <p className="text-sm text-muted-foreground">{occupation}</p>
            )}
            {company && (
              <p className="text-xs text-muted-foreground">
                @ {company}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-0">
        <p className="text-sm mt-2 line-clamp-3">{description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={16} className="mr-2 text-primary" />
            <span className="line-clamp-1">
              {address.city}, {address.state}, {address.country}
            </span>
          </div>
          
          {email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail size={16} className="mr-2 text-primary" />
              <span className="truncate">{email}</span>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone size={16} className="mr-2 text-primary" />
              <span>{phone}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex justify-between space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewSummary(profile)}
        >
          Show on Map
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;

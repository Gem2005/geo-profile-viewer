
import React from 'react';
import { Profile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  Globe, 
  ArrowLeft, 
  Edit,
  Twitter,
  Linkedin,
  Facebook,
  Instagram
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Map from './Map';

interface ProfileDetailProps {
  profile: Profile;
  onEdit?: (profile: Profile) => void;
  isAdmin?: boolean;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({ 
  profile, 
  onEdit,
  isAdmin = false
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  const handleEdit = () => {
    if (onEdit) onEdit(profile);
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back to List
        </Button>
        
        {isAdmin && onEdit && (
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="gap-2"
          >
            <Edit size={16} />
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 border-2 border-primary/10 mb-4">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                
                {profile.occupation && (
                  <p className="text-muted-foreground">{profile.occupation}</p>
                )}
                
                {profile.company && (
                  <p className="text-sm text-muted-foreground mb-4">
                    @ {profile.company}
                  </p>
                )}
                
                <p className="mt-4 text-sm">{profile.description}</p>
                
                {profile.interests && profile.interests.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {profile.interests.map((interest, index) => (
                        <span 
                          key={index} 
                          className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
                  <div className="mt-6 flex justify-center gap-3">
                    {profile.socialLinks.twitter && (
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
                         className="text-muted-foreground hover:text-primary transition-colors">
                        <Twitter size={18} />
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                         className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {profile.socialLinks.facebook && (
                      <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                         className="text-muted-foreground hover:text-primary transition-colors">
                        <Facebook size={18} />
                      </a>
                    )}
                    {profile.socialLinks.instagram && (
                      <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                         className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.address.street}<br/>
                      {profile.address.city}, {profile.address.state} {profile.address.zipCode}<br/>
                      {profile.address.country}
                    </p>
                  </div>
                </div>
                
                {profile.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${profile.email}`} className="text-sm text-primary hover:underline">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${profile.phone}`} className="text-sm text-primary hover:underline">
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {profile.website && (
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-primary" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-primary hover:underline"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
                
                {profile.company && (
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-primary" />
                    <div>
                      <p className="font-medium">Company</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.company}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <Map
                selectedProfile={profile}
                className="h-[500px] lg:h-full rounded-t-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;

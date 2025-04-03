import React, { useState } from 'react';
import { Profile, Address, GeoLocation } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Edit, 
  User, 
  Trash2, 
  Twitter as TwitterIcon, 
  Linkedin as LinkedinIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminPanelProps {
  profiles: Profile[];
  onAddProfile: (profile: Profile) => void;
  onUpdateProfile: (profile: Profile) => void;
  onDeleteProfile: (id: string) => void;
}

const emptyProfile: Omit<Profile, 'id'> = {
  name: '',
  avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
  description: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    location: {
      lat: 0,
      lng: 0
    }
  },
  phone: '',
  email: '',
  occupation: '',
  company: '',
  interests: []
};

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  profiles, 
  onAddProfile, 
  onUpdateProfile, 
  onDeleteProfile 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [interestsInput, setInterestsInput] = useState('');

  const handleEditProfile = (profile: Profile) => {
    setCurrentProfile({ ...profile });
    setInterestsInput(profile.interests?.join(', ') || '');
    setIsAddingNew(false);
    setIsEditing(true);
  };

  const handleAddProfile = () => {
    setCurrentProfile({ 
      id: `new-${Date.now()}`, 
      ...emptyProfile 
    });
    setInterestsInput('');
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (!currentProfile) return;
    
    if (!currentProfile.name || !currentProfile.address.city) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    if (interestsInput) {
      currentProfile.interests = interestsInput
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);
    } else {
      currentProfile.interests = [];
    }
    
    try {
      if (isAddingNew) {
        onAddProfile(currentProfile);
        toast.success('Profile created successfully');
      } else {
        onUpdateProfile(currentProfile);
        toast.success('Profile updated successfully');
      }
      
      setIsEditing(false);
      setCurrentProfile(null);
    } catch (error) {
      toast.error('Failed to save profile');
      console.error(error);
    }
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      onDeleteProfile(id);
      toast.success('Profile deleted successfully');
    }
  };

  const updateField = (
    field: string, 
    value: string | string[] | GeoLocation, 
    isAddressField = false
  ) => {
    if (!currentProfile) return;
    
    if (isAddressField) {
      setCurrentProfile({
        ...currentProfile,
        address: {
          ...currentProfile.address,
          [field]: value
        }
      });
    } else {
      setCurrentProfile({
        ...currentProfile,
        [field]: value
      });
    }
  };

  const updateGeoLocation = (field: 'lat' | 'lng', value: string) => {
    if (!currentProfile) return;
    
    try {
      const numValue = parseFloat(value);
      
      setCurrentProfile({
        ...currentProfile,
        address: {
          ...currentProfile.address,
          location: {
            ...currentProfile.address.location,
            [field]: isNaN(numValue) ? 0 : numValue
          }
        }
      });
    } catch (e) {
      console.error('Invalid coordinate value', e);
    }
  };

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
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Button onClick={handleAddProfile}>Add New Profile</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map(profile => (
          <Card key={profile.id} className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                </Avatar>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditProfile(profile)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => handleDeleteProfile(profile.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg mt-2">{profile.name}</CardTitle>
              {profile.occupation && (
                <p className="text-sm text-muted-foreground">{profile.occupation}</p>
              )}
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm line-clamp-2">{profile.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {profile.address.city}, {profile.address.state}
              </p>
            </CardContent>
            <CardFooter className="bg-muted/30 text-xs text-muted-foreground py-2">
              ID: {profile.id}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddingNew ? 'Add New Profile' : 'Edit Profile'}
            </DialogTitle>
          </DialogHeader>
          
          {currentProfile && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="extras">Extras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={currentProfile.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="avatar"
                      value={currentProfile.avatar}
                      onChange={(e) => updateField('avatar', e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage 
                        src={currentProfile.avatar} 
                        alt={currentProfile.name || 'Avatar'} 
                      />
                      <AvatarFallback>
                        <User size={16} />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={currentProfile.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Brief description about the person"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={currentProfile.occupation || ''}
                    onChange={(e) => updateField('occupation', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={currentProfile.company || ''}
                    onChange={(e) => updateField('company', e.target.value)}
                    placeholder="Example Corp"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="address" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={currentProfile.address.street}
                    onChange={(e) => updateField('street', e.target.value, true)}
                    placeholder="123 Main St"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={currentProfile.address.city}
                    onChange={(e) => updateField('city', e.target.value, true)}
                    placeholder="New York"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={currentProfile.address.state}
                      onChange={(e) => updateField('state', e.target.value, true)}
                      placeholder="NY"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={currentProfile.address.zipCode}
                      onChange={(e) => updateField('zipCode', e.target.value, true)}
                      placeholder="10001"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={currentProfile.address.country}
                    onChange={(e) => updateField('country', e.target.value, true)}
                    placeholder="United States"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={currentProfile.address.location.lat}
                      onChange={(e) => updateGeoLocation('lat', e.target.value)}
                      placeholder="37.7749"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={currentProfile.address.location.lng}
                      onChange={(e) => updateGeoLocation('lng', e.target.value)}
                      placeholder="-122.4194"
                      required
                    />
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>Need coordinates? Find them on <a href="https://www.latlong.net/" target="_blank" rel="noopener noreferrer" className="text-primary underline">LatLong.net</a></p>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentProfile.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={currentProfile.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={currentProfile.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="extras" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interests">Interests (comma separated)</Label>
                  <Textarea
                    id="interests"
                    value={interestsInput}
                    onChange={(e) => setInterestsInput(e.target.value)}
                    placeholder="Hiking, Photography, Reading"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Social Links</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TwitterIcon size={16} className="text-muted-foreground" />
                      <Input
                        value={currentProfile.socialLinks?.twitter || ''}
                        onChange={(e) => {
                          setCurrentProfile({
                            ...currentProfile,
                            socialLinks: {
                              ...currentProfile.socialLinks,
                              twitter: e.target.value
                            }
                          });
                        }}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <LinkedinIcon size={16} className="text-muted-foreground" />
                      <Input
                        value={currentProfile.socialLinks?.linkedin || ''}
                        onChange={(e) => {
                          setCurrentProfile({
                            ...currentProfile,
                            socialLinks: {
                              ...currentProfile.socialLinks,
                              linkedin: e.target.value
                            }
                          });
                        }}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              {isAddingNew ? 'Create Profile' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;

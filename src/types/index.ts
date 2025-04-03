
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  location: GeoLocation;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  description: string;
  address: Address;
  phone?: string;
  email?: string;
  interests?: string[];
  occupation?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

export type FilterOption = 'name' | 'location' | 'occupation';

export interface MapViewOptions {
  center: GeoLocation;
  zoom: number;
}

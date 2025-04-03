
import { Profile } from "@/types";

export const profiles: Profile[] = [
  {
    id: "1",
    name: "Emma Johnson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    description: "Senior Software Engineer specializing in frontend development with React and TypeScript",
    occupation: "Software Engineer",
    company: "TechCorp Inc.",
    address: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA",
      location: {
        lat: 37.7749,
        lng: -122.4194
      }
    },
    phone: "+1 (555) 123-4567",
    email: "emma.johnson@example.com",
    interests: ["Hiking", "Photography", "Coding"],
    website: "https://emmajonson.example.com",
    socialLinks: {
      twitter: "https://twitter.com/emmaj",
      linkedin: "https://linkedin.com/in/emmaj"
    }
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    description: "UX/UI Designer with 8 years of experience creating intuitive user interfaces",
    occupation: "UX Designer",
    company: "Design Masters",
    address: {
      street: "456 Market Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      location: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    phone: "+1 (555) 234-5678",
    email: "james.wilson@example.com",
    interests: ["Design", "Travel", "Music"],
    website: "https://jameswilson.example.com",
    socialLinks: {
      twitter: "https://twitter.com/jamesw",
      linkedin: "https://linkedin.com/in/jamesw"
    }
  },
  {
    id: "3",
    name: "Sophia Chen",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    description: "Data Scientist working on machine learning models for predictive analytics",
    occupation: "Data Scientist",
    company: "DataMind Analytics",
    address: {
      street: "789 Park Avenue",
      city: "Boston",
      state: "MA",
      zipCode: "02108",
      country: "USA",
      location: {
        lat: 42.3601,
        lng: -71.0589
      }
    },
    phone: "+1 (555) 345-6789",
    email: "sophia.chen@example.com",
    interests: ["AI Research", "Data Visualization", "Piano"],
    website: "https://sophiachen.example.com",
    socialLinks: {
      twitter: "https://twitter.com/sophiac",
      linkedin: "https://linkedin.com/in/sophiac"
    }
  },
  {
    id: "4",
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    description: "Product Manager with a background in software development and business strategy",
    occupation: "Product Manager",
    company: "InnovateTech",
    address: {
      street: "101 Pine Street",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
      location: {
        lat: 47.6062,
        lng: -122.3321
      }
    },
    phone: "+1 (555) 456-7890",
    email: "michael.brown@example.com",
    interests: ["Product Strategy", "Hiking", "Chess"],
    website: "https://michaelbrown.example.com",
    socialLinks: {
      twitter: "https://twitter.com/michaelb",
      linkedin: "https://linkedin.com/in/michaelb"
    }
  },
  {
    id: "5",
    name: "Olivia Martinez",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    description: "Marketing Specialist focusing on digital campaigns and brand development",
    occupation: "Marketing Specialist",
    company: "BrandBoost Media",
    address: {
      street: "222 Oak Street",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      country: "USA",
      location: {
        lat: 30.2672,
        lng: -97.7431
      }
    },
    phone: "+1 (555) 567-8901",
    email: "olivia.martinez@example.com",
    interests: ["Content Creation", "Social Media", "Yoga"],
    website: "https://oliviamartinez.example.com",
    socialLinks: {
      instagram: "https://instagram.com/oliviam",
      linkedin: "https://linkedin.com/in/oliviam"
    }
  },
  {
    id: "6",
    name: "William Lee",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    description: "DevOps Engineer specializing in cloud infrastructure and automation",
    occupation: "DevOps Engineer",
    company: "CloudScale Systems",
    address: {
      street: "333 Elm Street",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
      location: {
        lat: 41.8781,
        lng: -87.6298
      }
    },
    phone: "+1 (555) 678-9012",
    email: "william.lee@example.com",
    interests: ["Cloud Computing", "Automation", "Cycling"],
    website: "https://williamlee.example.com",
    socialLinks: {
      twitter: "https://twitter.com/williaml",
      linkedin: "https://linkedin.com/in/williaml"
    }
  }
];

// Helper function to get a profile by ID
export const getProfileById = (id: string): Profile | undefined => {
  return profiles.find(profile => profile.id === id);
};

// Helper function to search and filter profiles
export const searchProfiles = (
  query: string, 
  filterBy: string = 'name'
): Profile[] => {
  if (!query) return profiles;
  
  const lowerCaseQuery = query.toLowerCase();
  
  return profiles.filter(profile => {
    switch (filterBy) {
      case 'name':
        return profile.name.toLowerCase().includes(lowerCaseQuery);
      case 'location':
        return (
          profile.address.city.toLowerCase().includes(lowerCaseQuery) ||
          profile.address.state.toLowerCase().includes(lowerCaseQuery) ||
          profile.address.country.toLowerCase().includes(lowerCaseQuery)
        );
      case 'occupation':
        return profile.occupation?.toLowerCase().includes(lowerCaseQuery);
      default:
        return profile.name.toLowerCase().includes(lowerCaseQuery);
    }
  });
};

// Initial data for admin functions (used for add/edit/delete operations)
export let profilesData = [...profiles];

// Admin functions
export const addProfile = (profile: Profile): void => {
  profilesData.push(profile);
};

export const updateProfile = (updatedProfile: Profile): void => {
  const index = profilesData.findIndex(p => p.id === updatedProfile.id);
  if (index !== -1) {
    profilesData[index] = updatedProfile;
  }
};

export const deleteProfile = (id: string): void => {
  profilesData = profilesData.filter(profile => profile.id !== id);
};

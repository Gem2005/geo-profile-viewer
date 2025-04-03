# Geo Profile Viewer

This is a React + Vite web application that displays a list of profiles and their addresses on an interactive map. It includes:
- Profile display with name, photo, and brief description.
- An interactive map that shows addresses.
- A "Summary" button to show each profile's location on the map.
- A simple admin panel to manage profiles (add, edit, delete).
- Search and filter functionality.

## Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment
Vercel Deployment: https://geo-profile-viewer.vercel.app/


## Features
- Responsive design for mobile and desktop.
- Error handling for invalid addresses or map integration failures.
- Loading indicators during data fetching and map rendering.

## Tech Stack
- React (using Vite)
- TypeScript
- Map Integration (Google Maps or Mapbox)


## Additional Information
- Ensure you have a valid API key for your chosen map service.
- Configure environment variables (if needed) for the map services in a .env file.


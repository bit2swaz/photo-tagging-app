# Photo Tagging Game Frontend

This is the frontend for the Photo Tagging Game application.

## Environment Variables

Create a `.env` file in the root of the frontend project with the following variables:

```
# API Base URL for production deployment
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com

# Uncomment the line below for local development
# VITE_API_BASE_URL=http://localhost:3000
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Build

```bash
# Build for production
npm run build
```

## Deployment

This application is configured for deployment on Netlify. Make sure to set the `VITE_API_BASE_URL` environment variable in your Netlify deployment settings to point to your backend API URL.

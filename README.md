# Photo Tagging Game 📸🔎

A fun and challenging "Where's Waldo?"-inspired photo-tagging game built as part of **The Odin Project's** curriculum. Test your observational skills by finding hidden characters within bustling, detailed scenes, then compete for the fastest time on the global leaderboard!

## ✨ Features

* **Engaging Gameplay:** Find a set of hidden characters in a large, intricate image against the clock.
* **Multiple Difficulties:** Play across Easy (3 characters), Medium (5 characters), and Hard (7 characters) maps, each with unique themes and hidden individuals.
* **Dynamic Character Tracking:** See which characters you still need to find, with real-time updates as you progress.
* **Precision Marking:** Click on the image to mark potential character locations, with visual feedback for correct or incorrect guesses.
* **Global Leaderboard:** Submit your best times and see how you stack up against other players worldwide.
* **Responsive UI/UX:** A clean, gamified interface inspired by modern SaaS apps, ensuring a smooth experience across various devices.
* **Custom Assets:** Features unique game maps and character icons, creating a fresh hidden-object challenge.

## 🚀 Live Demo

Experience the game live here:
[**Live Demo Link**](https://your-deployed-app-url.com) *(Will be updated after deployment!)*

## 🛠️ Technologies Used

* **Frontend:** React.js, Vite, CSS Modules
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Styling:** Custom CSS, modern UI/UX principles (animations, transitions, transforms)
* **Version Control:** Git, GitHub

## 🏃 Getting Started Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* PostgreSQL installed and running
* Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/bit2swaz/photo-tagging-app.git](https://github.com/bit2swaz/photo-tagging-app.git)
    cd photo-tagging-app
    ```
2.  **Set up Backend:**
    ```bash
    cd server
    npm install
    # Back to root
    cd ..
    ```
3.  **Set up Frontend:**
    ```bash
    cd client
    npm install
    # Back to root
    cd ..
    ```

### Database Setup

1.  **Create a PostgreSQL database:**
    Connect to your PostgreSQL server (e.g., via `psql`):
    ```sql
    CREATE DATABASE "photo-tagging-db"; -- Or whatever name you prefer, update .env accordingly
    ```
2.  **Configure Environment Variables:**
    Create a `.env` file in the **root directory** of the project and add your database credentials and backend port. Refer to `.env.example` for required variables.
    ```
    # Example .env content
    DB_USER=your_pg_user
    DB_HOST=localhost
    DB_DATABASE=photo-tagging-db
    DB_PASSWORD=your_pg_password
    DB_PORT=5432 # Default PostgreSQL port
    PORT=3001    # Backend server port
    ```
3.  **Initialize Database Schema and Data:**
    From the **root directory**, run the database setup script:
    ```bash
    node db/db_setup.js
    ```

### Running the Application

1.  **Start the Backend Server:**
    From the **root directory**:
    ```bash
    node server.js
    ```
    The backend should start on `http://localhost:3001` (or your configured `PORT`).

2.  **Start the Frontend Development Server:**
    In a **new terminal**, navigate to the `client` directory:
    ```bash
    cd client
    npm run dev # or npm start, depending on your setup
    ```
    The frontend should open in your browser, usually at `http://localhost:5173/`.

---

## 👨‍💻 Project from The Odin Project

This project was developed as part of [The Odin Project's](https://www.theodinproject.com/) curriculum, specifically within the Full Stack JavaScript path. It demonstrates mastery of React, Node.js, Express, and PostgreSQL, along with practical application of UI/UX principles.

---

## ❤️ Made with Love

Made with ❤️ by [bit2swaz](https://github.com/bit2swaz)

## Backend Deployment

### Environment Variables

For the backend deployment on Render or similar services, make sure to set the following environment variables:

```
# Database Connection
DATABASE_URL=postgres://your-supabase-connection-string

# Server Port (usually set automatically by the hosting provider)
PORT=3000

# Optional - set to 'production' in production environment
NODE_ENV=production
```

### Database Setup

The application uses PostgreSQL. The database schema is defined in `db/db_schema.sql`.

## Frontend Deployment

### Environment Variables

For the frontend deployment on Netlify, set the following environment variable:

```
VITE_API_BASE_URL=https://your-backend-api.onrender.com
```

## Local Development

### Backend Setup

1. Create a PostgreSQL database
2. Copy `.env.example` to `.env` and update with your database credentials
3. Run `npm install` to install dependencies
4. Run `node db/db_setup.js` to set up the database schema and seed data
5. Run `node server.js` to start the backend server

### Frontend Setup

1. Navigate to the client directory: `cd client/photo-tagging-frontend`
2. Create a `.env` file with: `VITE_API_BASE_URL=http://localhost:3000`
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

## Deployment Guide

### Database (Supabase)

1. **Create a Supabase Project**:
   - Sign up for Supabase at https://supabase.com
   - Create a new project
   - Go to the SQL Editor and run the schema from `db/db_schema.sql`

2. **Get Connection String**:
   - Go to Settings > Database
   - Find your connection string under "Connection Pooling"
   - It should look like: `postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
   - Make sure special characters in the password are properly URL-encoded (%, &, ?, @ need to be encoded)

### Backend (Render)

1. **Create a New Web Service**:
   - Sign up for Render at https://render.com
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the build command: `npm install`
   - Set the start command: `node server.js`

2. **Set Environment Variables**:
   - Go to Environment tab
   - Add the following variables:
     - `DATABASE_URL`: Your Supabase connection string
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (or let Render set it automatically)

3. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   - Note your service URL (e.g., `https://photo-tagging-api.onrender.com`)

### Frontend (Netlify)

1. **Create a New Site**:
   - Sign up for Netlify at https://netlify.com
   - Create a new site from Git
   - Connect your GitHub repository
   - Set the build command: `cd client/photo-tagging-frontend && npm install && npm run build`
   - Set the publish directory: `client/photo-tagging-frontend/dist`

2. **Set Environment Variables**:
   - Go to Site settings > Build & deploy > Environment
   - Add the following variable:
     - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://photo-tagging-api.onrender.com`)

3. **Deploy**:
   - Trigger a new deploy
   - Your site should be live at a Netlify URL (e.g., `https://photo-tagging-app.netlify.app`)

## Troubleshooting

### Database Connection Issues

If you're seeing 500 errors when trying to access `/api/photos`:

1. **Check Render Logs**:
   - Go to your Render dashboard > Web Service > Logs
   - Look for database connection errors

2. **Verify Environment Variables**:
   - Make sure `DATABASE_URL` is correctly set in Render
   - Ensure special characters in the password are properly URL-encoded

3. **Database Network Access**:
   - In Supabase, go to Settings > Database
   - Under "Connection Pooling", make sure "Enable Pooling" is ON
   - Check if "Trusted Sources" is restricting access

4. **Test Database Connection**:
   - Use the `db/check_render_db.js` script locally to test your connection string
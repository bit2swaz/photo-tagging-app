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
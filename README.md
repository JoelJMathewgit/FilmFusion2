# Film Fusion

**Authors:**  
Abdul Muqit Afzal (Project Manager)  
Shah Syed (Front End Lead)  
Joel Mathews (Back End Lead)  
Hamuddin Khan (Technical Manager)  
Sk Akif Rahman (Software Quality Lead)

---

## Project Overview

**Film Fusion** is a complete movie catalog web application built as part of a university software development course. The app allows users to browse, search, filter, and favorite movies from a dynamic, database-powered collection. It includes real-time authentication, interactive UI components, and a modular React structure — all powered by Firebase.

The goal of the project was to simulate the experience of building a full-stack production-ready app using modern technologies, but in a way that is accessible and deployable for classroom grading or demonstration.

---

## Features

- Browse a collection of movies from Firestore
- Sort movies alphabetically (A–Z or Z–A)
- Sort movies by release year (earliest to latest or latest to earliest)
- Search for movies by title using a responsive input field
- View movie details inside modals without navigating
- Log in or sign up using Firebase Authentication
- Add or remove movies from a personalized Favorites list
- View your Favorite Movies page once authenticated
- Responsive design using Bulma and custom CSS
- Full test suite using Vitest and React Testing Library

---

## Technologies Used

- **Frontend**: React (Vite setup, functional components, hooks)
- **Backend**: Firebase (Firestore for DB, Auth for login, Admin SDK for testing)
- **Styling**: Bulma CSS Framework + Custom CSS
- **Routing**: React Router DOM
- **Testing**:
    - Vitest (unit and integration tests)
    - React Testing Library (UI behavior testing)
- **Tooling**:
    - Vite for blazing-fast development
    - `run.bat` for easy Windows setup

---

## What We Learned

Before this project, our team had never created a full web application from scratch. Through this experience, we learned how to:

- Build and structure a complete React app
- Use hooks, props, component modularization, and context
- Authenticate users with Firebase Auth
- Store and retrieve real data using Firestore
- Write clean and testable code using Vitest and Testing Library
- Use Firebase Admin SDK for backend scripting
- Manage state between components and routes
- Handle real-world UI/UX concerns like filtering, modals, and pagination
- Collaborate using Git and division of responsibilities

This project gave us a practical understanding of how modern web apps are built and tested in the real world.

---

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 18+ (LTS recommended)
- **npm**: Version 9+ (comes with Node.js)
- **Internet Access**: Required for Firebase APIs and installation
- **Browser**: Chrome, Firefox, Edge (modern browser recommended)

---

## How to Run the Project

- Clone the repository
- cd film-fusion

### Option 1: Using the run.bat Script (Windows Only)

```bash
./run.bat //Windows Powershell
// Or
run.bat //Command Prompt
```

This will automatically install all dependencies and start the local development server at:

```bash
http://localhost:5173
```

### Option 2: Manual Setup (Cross-Platform)

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open your browser and go to:

```bash
http://localhost:5173
```

## Acknowledgements

This project was completed for our university coursework in software development. We extend our thanks to our instructor and teaching assistants for their guidance and feedback throughout the project timeline.
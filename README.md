# MovieVerse

MovieVerse is a full-stack movie review and rating platform built with the MERN stack.

## Features
- Authentication with JWT
- Movie discovery and search
- Movie details page
- Reviews and ratings foundation
- Profile and admin screens
- Responsive dark UI built with Tailwind CSS

## Project Structure
- backend/: Express server, models, routes, middleware
- frontend/: React + Vite app

## Backend Setup
1. cd backend
2. npm install
3. cp .env.example .env
4. npm run dev

## Frontend Setup
1. cd frontend
2. npm install
3. npm run dev

## Environment Variables
See backend/.env.example for the required variables.

## Deployment Notes
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Sample Data
Use the MongoDB Atlas connection string from the prompt and seed with a few genres and movies through the admin API or MongoDB shell.

<<<<<<< HEAD
Deployment Link - https://9a328140.book-club-frontend.pages.dev/
📚 Book Club Platform — Frontend
🌟 Overview

The Book Club Platform is a modern, interactive frontend web application designed to help book lovers collaborate, suggest books, participate in discussions, track reading progress, and engage with a vibrant reading community.

This platform focuses on dynamic UI, real-time updates, personalized experiences, and smooth user interaction.

🎯 Project Goals

Provide a dynamic book suggestion and voting system

Enable structured discussion forums

Track reading progress visually

Allow personal reading goal management

Display ratings, reviews, and achievements

Offer a responsive and engaging user experience

🏗️ Tech Stack

React.js

React Router

Context API (AuthContext)

Axios

Tailwind CSS / CSS Modules

Backend: Express + PostgreSQL (separate repository)

🔐 Authentication

Authentication is handled using:

JWT stored in localStorage

AuthContext for global state management

Protected routes for authenticated users

Role-based UI rendering (Admin / Member)

👥 User Roles
Role	Permissions
Member	Suggest books, vote, review, track progress
Admin	Approve suggestions, manage books
🚀 Features
1️⃣ Book Suggestion System
✅ Suggest a Book

Users can submit:

Title

Author

Description

✅ Real-Time Voting

Users can upvote suggestions

Suggestions sorted by vote count

Duplicate voting prevented

✅ Admin Approval

Admin can approve suggestions

Approved suggestion becomes an official book

2️⃣ Books Module

View all approved books

Book details page

Ratings and reviews

Voting system

Pagination

3️⃣ Discussion Forums

Book-specific threads

Nested comments (threaded replies)

Rich discussion UI

Pagination support

4️⃣ Reading Progress Tracker

Update reading percentage

Progress bars

Visual tracking per book

5️⃣ Personal Reading Goals

Set target books/pages

Date range selection

Progress tracking widgets

6️⃣ Reviews & Ratings

1–5 star rating system

One review per user per book

Sort reviews by:

Most recent

Highest rated

Like system for reviews

7️⃣ Personal Library

Users can organize books into:

📖 Currently Reading

✅ Completed

📚 To Read

Supports:

Drag and drop (if implemented)

Custom shelves (optional enhancement)

8️⃣ Meetings System

Schedule virtual meetings

RSVP system

Meeting link integration

9️⃣ Notifications System

Real-time activity updates

Notification dropdown

Read/unread state

🔟 Gamification

Achievement badges

Participation rewards

Reading milestones

📂 Folder Structure
src/
 ├── features/
 │   ├── books/
 │   ├── suggestions/
 │   ├── discussions/
 │   ├── reviews/
 │   ├── progress/
 │   ├── goals/
 │   ├── library/
 │   ├── meetings/
 │   ├── notifications/
 │
 ├── context/
 │   └── AuthContext.jsx
 │
 ├── services/
 │   └── api.js
 │
 ├── routes/
 │   └── ProtectedRoute.jsx
 │
 └── App.jsx
🧠 Architecture Highlights

Feature-based folder structure

Separation of concerns

Reusable UI components

API layer abstraction

Context-based authentication

Role-based rendering logic

🖥️ Setup Instructions
1️⃣ Clone the repository
git clone <your-frontend-repo-url>
cd frontend
2️⃣ Install dependencies
npm install
3️⃣ Create .env file
VITE_API_URL=http://localhost:5000/api
4️⃣ Start development server
npm run dev
📱 Responsive Design

The platform is fully responsive and optimized for:

Desktop

Tablet

Mobile

🔮 Future Enhancements

Dark Mode

Social Media Sharing

Real-time WebSocket updates

Advanced recommendation engine

Analytics dashboard improvements

🎓 Academic Value

This project demonstrates:

Role-based access control

Community-driven voting system

Real-time UI updates

Complex relational database interaction

State management best practices

Modular frontend architecture

👩‍💻 Author

Poojitha Thadiboyina

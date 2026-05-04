# The Watcher

## Movie & TV Show Watchlist Tracker

---

## 📖 Overview

**The Watcher** is a web application that allows users to track movies and TV shows they want to watch, are currently watching, or have already watched. Users can search for titles, add them to personalized watchlists, rate content, and track viewing progress.

This project is developed as part of the **SSW/CS Agile Methods for Software Development** course (Spring 2026). The team follows **Scrum methodology**, delivering working increments over four two-week sprints.

---

## 👥 Scrum Team

| Role | Name |
|------|------|
| **Product Owner** | Jessica Militello |
| **Scrum Master** | Janet Koublanou |
| **Development Team** | Samah Keshiro |
| **Development Team** | Shane Mitchell |
| **Development Team** | Hailey Slack |
| **Development Team** | Kileen McNeill |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | JavaScript |
| Backend | Python |
| Version Control | Git & GitHub |
| Project Management | GitHub Projects |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| User Authentication | Create account, login, logout functionality |
| Search | Search for movies and TV shows by title |
| Watchlist | Add/remove titles to personal watchlist |
| Status Tracking | Mark content as Plan to Watch, Watching, or Watched |
| Progress Tracking | Track episode/season progress for TV shows |
| Ratings & Reviews | Rate watched content and write reviews |

---

## 📂 Repository Structure

```
the-watcher/
├── frontend/          # Frontend application code
├── backend/           # Backend API and server code
├── docs/              # Documentation and reports
├── .gitignore         # Git ignore file
└── README.md          # Project overview
```


### Installation

bash
** Clone the repository
git clone https://github.com/[your-org]/the-watcher.git

** Navigate to project directory
cd the-watcher

** Set up Movie API
Go to https://www.themoviedb.org/settings/api
Click Create → choose Developer
Fill out the form (app name: "the-watcher", personal use, website name: http://localhost:3000, etc)
Copy the API Key (v3 auth)
nano backend/.env
    TMDB_API_KEY=[paste_key]
    SECRET_KEY=[any_string]
Ctrl+X --> Y --> enter
python manage.py fetch_tmdb_movies
python manage.py import_movies api/data/top_grossing_movies_sample.csv

** Ensure npm is installed
npm -v

** Start backend
cd the-watcher/backend
source venv/bin/activate
python manage.py runserver

** Start frontend (in separate terminal)
npm start

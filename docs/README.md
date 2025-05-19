# INST377-finalProject

# Job Junction
A modern job search platform connecting job seekers with opportunities across the tech industry.

## Features

Job Junction is a web application that provides:
- **Job Search**: Real-time job listings from Adzuna
- **Bookmarking**: Save jobs for later use
- **Authentication**: Secure user accounts with Supabase
- **Responsive Design**: Optimized for desktop (Chrome)



[➔ Jump to Developer Manual](#developer-manual)



---

# Developer Manual**
## Installation

## Clone repository
  git clone https://github.com/ETTRAN777/INST377-finalProject.git

## Install dependencies
npm init
npm install express
npm install nodemon
npm install dotenv
npm install body-parser
npm install supabase
## Start development server
npm start

## Environment Variables (.env)
- SUPABASE_URL= process.env.SUPABASE_URL
- SUPABASE_KEY= process.env.SUPABASE_KEY
- ADZUNA_API_ID= id in script.js
- ADZUNA_API_KEY= key in script.js

## API Documentation

| Method | Endpoint       | Parameters               | Description               |
|--------|----------------|--------------------------|---------------------------|
| GET    | `/api/jobs`    | location, title, salary  | Search job listings       |
| GET    | `/api/jobs/:id`| -                        | Get job details           |


## Authentication Endpoints

| Method | Endpoint       | Body                  | Description         |
|--------|----------------|-----------------------|---------------------|
| POST   | `/auth/signup` | `{email, password}`   | Create new user     |
| POST   | `/auth/login`  | `{email, password}`   | Authenticate user   |

## Known Issues

| Issue                      | Affected Area       |
|----------------------------|---------------------|
|                            |                     |
| Jobsearch Load Time        | Job Search Page     |
|------------------------    |---------------------| 
| Bookmark database retreival| Bookmarks Page      |
|                            |                     |
|----------------------------|---------------------|
| Bad formatting on salary   |                     |
| and date posted filters    | Job Search Page     |

## Roadmap 🗺️
### 2025
- Fix search filters
- Connect bookmark database for bookmarks across devices

### 2026
- Advanced search filters
- Salary comparison tool

### 2027
Mobile app development
- Interview preparation toolkit
- Company review system
- AI-powered job matching

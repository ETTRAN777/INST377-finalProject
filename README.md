# INST377-finalProject

# Job Junction 🚂
A modern job search platform connecting job seekers with opportunities across the tech industry.

## Features ✨

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


## Install dependencies


## Start development server


## Environment Variables (.env)
- SUPABASE_URL=
- SUPABASE_KEY=
- ADZUNA_API_ID=
- ADZUNA_API_KEY=

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

## Known Issues ⚠️

| Issue                  | Affected Area       |
|------------------------|---------------------|
|                         |         |
| Jobsearch Load Time       | Job Search Page         | 
|                        | Resume parsing      |



## Roadmap 🗺️
### 2025
- Advanced search filters
- Salary comparison tool

### 2026
- Mobile app development
- Interview preparation toolkit
- Company review system

### 2027
- AI-powered job matching

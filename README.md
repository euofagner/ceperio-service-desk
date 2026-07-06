# Ceperio Service Desk

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-in%20development-yellow)
![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![SQL Server](https://img.shields.io/badge/SQL_Server-LocalDB-CC2927?logo=microsoftsqlserver)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Axios](https://img.shields.io/badge/Axios-1.18-5A29E4?logo=axios)
![Scalar](https://img.shields.io/badge/Scalar-API-00B4D8?logo=scalar)

A Full-stack IT service desk application built with ASP.NET Core Web API and React to streamline internal support ticket management.

## Screenshots 

### Dashboard 
![Dashboard](/screenshots/dashboard.png)

*Overview of tickets with status, priorities and success/error notifications*

### Create new ticket 
![Create ticket](/screenshots/create-ticket.png) 

*Ticket creation form with title, description and priority*

### API Documentation (Scalar)
![Api docs](/screenshots/api-documentation.png)

*Interactive API documentation with all endpoints*

## About and motivation
This project was inspired by a real workflow need, observed during my internship at a company with around 40 employees, IT support requests were handled by phone calls without any tracking system.

The goal is to build a ticket management system that allows users to create, track, update, and manage IT support requests through a simple and intuitive interface.

---

## Features

- CRUD operations for tickets
- Ticket status management
- Priority levels
- Ticket dashboard with live summary
- Filter tickets by status
- Success and error toast notifications
- Loading skeletons
- Responsive interface
- API documentation with Scalar

---

## Stack

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Scalar

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

---

## Architecture 

```text
 React
   │
 Axios
   │
ASP.NET Core Web API
   │
Entity Framework Core
   │
SQL Server LocalDB
```
---

## How to run

## Prerequisites 

- .NET 10 SDK
- Node.js 22+
- SQL Server LocalDB
- Git

## Clone the repository

```bash
git clone https://github.com/euofagner/CeperioServiceDesk.git
cd CeperioServiceDesk
```

### Backend

navigate to the backend project:

```bash
cd backend/CeperioServiceDesk/CeperioServiceDesk.API
```

restore dependencies:

```bash
dotnet restore
```

apply database migrations and run the API:
the database is automatically created after running:

```bash
dotnet ef database update

dotnet run
```

The API will be at:

```
https://localhost:7290

https://localhost:7290/scalar/v1
```

---

### Frontend

Navigate to the frontend project:

```bash
cd frontend/ceperio-service-desk-web
```

install dependencies and run the application: 
```bash
npm install

npm run dev
```

the frontend will be at: 

```
http://localhost:5173
```

## Developed by 
**Fagner da Silva** *as a full-stack portfolio project*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Fagner%20da%20Silva-0A66C2?logo=linkedin)](https://linkedin.com/in/fagner-da-silva-43950b260)
[![GitHub](https://img.shields.io/badge/GitHub-euofagner-181717?logo=github)](https://github.com/euofagner)

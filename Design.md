# Low-Level Design (LLD) - Productivity Tracker with

# Pair Programming

## 1. Introduction


This document describes the Low-Level Design (LLD) for a Productivity Tracker application with
Pomodoro-based task management. The system supports Personal and Team Task Management,
and Pair Programming sessions that allow users to collaborate on the same Pomodoro session.

## 2. Backend Design


The backend is implemented using Node.js, Express, and MongoDB. Key responsibilities:
authentication, task management, team tasks, sessions, and real-time synchronization.

## 2.1 Backend Folder Structure

- server/
- nnn controllers/ (task.js, teamTask.js, user.js)
- nnn db/ (db connection)
- nnn middleware/ (authMiddleware.js)
- nnn models/ (task.js, teamTask.js, user.js)
- nnn routes/ (authroutes.js, taskroutes.js, teamTaskRoutes.js)
- nnn server.js
- nnn .env

## 2.2 Backend Features

- Authentication (JWT-based)
- Personal Task CRUD
- Team Task CRUD with permissions (assigner vs assignee)
- Pair Programming session management (session create/join/sync)
- Protected routes via middleware

## 3. Frontend Design


The frontend is built with React. It provides pages for login/signup, personal tasks, team tasks, pair
programming, and a dashboard for stats.

## 3.1 Frontend Folder Structure

- /src
- nnn api/ (axios wrappers)
- nnn Auth/ (Login.jsx, Signup.jsx)
- nnn Components/ (TaskHistory.jsx, TaskManagement.jsx, TeamTaskHistory.jsx,
    TeamTaskManagement.jsx, Timer.jsx, Timer2.jsx)
- nnn Pages/ (dashboard.jsx, Hero.jsx, Login.jsx, Signup.jsx, TasksPage.jsx,
    TeamTasksPage.jsx)
- nnn context/ (AuthContext.jsx)
- nnn index.js


## 3.2 Component Responsibilities

- Timer.jsx & Timer2.jsx: Manage countdown, breaks, pomodoro cycles, trigger onComplete
    callbacks
- TaskManagement.jsx: Create/update personal tasks
- TaskHistory.jsx: Display personal tasks grouped by status
- TeamTaskManagement.jsx: Create/assign team tasks
- TeamTaskHistory.jsx: View assigned-to-me and assigned-by-me lists
- TasksPage.jsx: Orchestrates personal tasks + timer
- TeamTasksPage.jsx: Orchestrates team tasks + timer + pair programming

## 4. UX Flow

- User authenticates (signup/login)
- Dashboard shows quick stats and navigation
- Personal Task Page allows create/update/delete tasks and run Pomodoro
- Team Task Page allows assign/manage tasks and join shared sessions
- Pair Programming: Host starts session, peers join via session ID or invite, timer syncs in real-time

## 5. API Mapping

- Auth: POST /api/auth/signup, POST /api/auth/login, GET /api/auth/profile
- Personal Tasks: POST /api/tasks, GET /api/tasks, PUT /api/tasks/:id, DELETE /api/tasks/:id
- Team Tasks: POST /api/team-tasks, GET /api/team-tasks/assigned-to-me, GET
    /api/team-tasks/assigned-by-me, PATCH /api/team-tasks/:taskId/status, PATCH
    /api/team-tasks/:taskId, DELETE /api/team-tasks/:taskId
- Sessions (suggested): POST /api/sessions/start, POST /api/sessions/pause, POST
    /api/sessions/stop, POST /api/sessions/complete
- WebSocket events: join_session, timer_update, task_update, end_session

## 6. Database Schemas (summary)

- User: _id, name, email, passwordHash, createdAt
- Task: _id, user (ref), name, minutesSpent, pomodoros, priority, completed, status, timestamps
- TeamTask: _id, name, pomodoros, priority, deadline, status, assignedBy, assignedTo[],
    timestamps
- PomodoroSession (optional): sessionId, taskId, participants[], duration, status, startTime,
    endTime

## 7. Team Task Sequence (example)

- Team member (assigner) creates a team task and selects one or more assignees.  
- The task is saved in the backend with details of assignedBy and assignedTo.  
- Each assignee can view their assigned tasks in the Team Tasks Page under “Assigned to Me.”  
- When an assignee marks a task as completed, the update is stored in the backend.  
- The assigner can view progress in the Assigned by Me tab, where completion status of each assignee’s task is reflected in real-time.  


## 8. Future Enhancements

- Persist PomodoroSession records for analytics
- AI suggestions (Gemini), smart break recommendations
- Email/web notifications (Nodemailer, Web Push)
- Team leaderboards & advanced analytics

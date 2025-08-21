`                                      `**Low-Level Design (LLD) Document**


**Project: Productivity Tracker (Pomodoro Technique)**

1\. Overview:-

The Productivity Tracker helps users manage tasks using the Pomodoro Technique.

Users can log in, create tasks, run a timer with start/pause/stop controls, and record productivity.

After each session, they confirm task completion, and all data is reflected in their dashboard statistics.

2\. Core Features:-

- Authentication
- Login & Signup with email/password
- JWT/cookie-based authentication
- Task Management
- Create and start tasks
- End task manually or automatically after Pomodoro finishes
- Mark task as completed or not completed
- Pomodoro Timer
- Default: 25 min focus
- Start, Pause, Resume, Stop options
- Dashboard

3\. User Flow:-

- User signs up / logs in
- Hero Page → Start a task
- User can start timer → User can Pause/Stop
- Timer ends → User marks task Completed/Not Completed

4\. System Components:-

- Frontend: React (UI – login, timer)
- Backend: Node.js/Express (REST APIs)
- Database: MongoDB (store users, tasks)

5\. Database Schema:-

User

{

`*`"userId": "uuid",

`*`"name": "string",

`*`"email": "string",

`*`"passwordHash": "string",

`*`"createdAt": "timestamp"

}

Task

{

`*`"taskId": "uuid",

`*`"userId": "uuid",

`*`"title": "string",

`*`"status": "in-progress | completed | failed",

`*`"createdAt": "timestamp",

`*`"completedAt": "timestamp"

}


6\. Class Diagram (Backend Services):-

+------------------+

| UserService      |

| - createUser()   |

| - loginUser()    |

| - getUserStats() |

+------------------+

+------------------+

| TaskService      |

| - createTask()   |

| - updateTask()   |

| - getTasks()     |

| - deleteTask()   |

+------------------+


7\. API Design:-

Auth

POST /api/auth/signup → Register

POST /api/auth/login → Authenticate

Tasks

POST /api/tasks → Create new task

PUT /api/tasks/:id → Update task status

GET /api/tasks → Get tasks list



8\. UI Wireframes (Conceptual):-

- Login / Signup Page → Auth form
- Timer Screen → Countdown + Pause/Stop
- Completion Popup → "Did you complete task?" Yes/No

9\. Future Enhancements (If Time Permits):-

- AI-driven Productivity Suggestions (Gemini API)
- Collect feedback after sessions (rating + note)
- Use Gemini API to analyze feedback
- Provide tips like “Try shorter Pomodoros” or “Take longer breaks”
- Show tips in dashboard
- Smart Notifications
- Nodemailer → Email reminders when session ends (“Mark task completed?”)
- Desktop Notifications → Browser popups for session status
- Team Collaboration & Leaderboard
- Track productivity across teams
- Compare Pomodoros completed
- Advanced Analytics
- Identify most productive hours of the day
- Personalized break/work ratio recommendations

10\. Sequence Flow (Timer Example):-

- User → Start Timer → Backend records session start  
- Backend → Sends countdown updates → Frontend displays timer  
- Timer ends → Backend prompts completion → User confirms  
- Backend → Records completion 

# Student Task Management System

A beginner-friendly React project built with HTML, CSS, React.js, and Vite.

## Features
- Sign up and log in with separate demo accounts
- Forgot password demo flow
- Add tasks with subject, due date, and priority
- Mark tasks as completed or pending
- Delete tasks
- Filter tasks and search by title, subject, or priority
- Dashboard summary for total, pending, completed, and overdue tasks
- Saves demo users and tasks in browser `localStorage`
- Responsive layout for desktop and mobile

## Requirements
- Node.js (LTS version recommended)
- VS Code (recommended)
- A modern browser

## Run the project
1. Extract this ZIP folder.
2. Open the `student-task-management-system` folder in VS Code.
3. Open VS Code Terminal: **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## How to test
1. Click **Create account** and register with your name, email, and password.
2. The dashboard opens after successful signup.
3. Add tasks and try the search, filters, complete, and delete controls.
4. Log out, then log in with the same account.
5. Use **Forgot password?** to set a new password for the registered email.

## Important demo limitation
This is a front-end classroom project. `localStorage` stores data only in the current browser and is not secure authentication. The forgot-password feature changes the password locally and does not send a real email. Do not use real or sensitive passwords. A production app needs a backend, database, password hashing, and a secure email verification/reset flow.

## Main files
- `index.html` — HTML page entry point
- `src/main.jsx` — starts the React app
- `src/App.jsx` — login, signup, password reset, dashboard, and task logic
- `src/index.css` — global styles
- `src/App.css` — page and component styles

# Student Task Management System

A beginner-friendly React project built with HTML, CSS, React.js, and Vite.

## Features
- Sign up and log in with separate demo accounts (each user sees only their own tasks)
- Forgot password demo flow
- Add tasks with subject, due date, and priority
- Mark tasks as completed or pending
- Delete tasks (with confirmation)
- Filter tasks and search by title, subject, or priority
- Dashboard summary for total, pending, completed, and overdue tasks
- Saves demo users and tasks in browser `localStorage`
- Responsive layout for desktop and mobile

## Requirements
- Node.js 20.19+ or 22.12+ (required by Vite 8)
- VS Code (recommended)
- A modern browser

## Run the project
1. Extract this ZIP folder.
2. Open the `student-task-management-system` folder in VS Code.
3. Open the terminal: **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

To create a production build: `npm run build`, then `npm run preview`.

## How to test
1. Click **Create account** and register with your name, email, and password.
2. The dashboard opens after successful signup.
3. Add tasks and try the search, filters, complete, and delete controls.
4. Log out, then log in with the same account.
5. Use **Forgot password?** to set a new password for the registered email.

## Important demo limitation
This is a front-end classroom project. `localStorage` stores data only in the current browser and is not secure authentication. The forgot-password feature changes the password locally and does not send a real email. Do not use real or sensitive passwords. A production app needs a backend, database, server-side salted password hashing, and a secure email verification/reset flow.

## Project structure
```
index.html                      HTML entry point
vite.config.js                  Vite + React plugin config
src/
  main.jsx                      Starts the React app
  App.jsx                       State, auth logic, task logic
  index.css, App.css            Global and component styles
  utils/storage.js              localStorage helpers, hashing, date helpers
  components/
    AuthLayout.jsx              Shared card layout for auth pages
    LoginForm.jsx
    SignupForm.jsx
    ForgotPasswordForm.jsx
    Dashboard.jsx               Filters/search/stats logic + page layout
    Header.jsx
    SummaryCards.jsx
    TaskForm.jsx
    TaskFilters.jsx
    TaskList.jsx
    TaskItem.jsx
```

## What was fixed
- `npm run build` ran `vite` (the dev server) instead of `vite build`.
- Added the missing `vite.config.js` (React plugin) and all `src` files.
- Moved `vite` and the React plugin to `devDependencies` and replaced `latest` with fixed versions.
- Passwords are now stored as SHA-256 hashes instead of plain text.
- Tasks are tied to each user's account.

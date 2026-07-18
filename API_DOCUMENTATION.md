# API Documentation

## Base URL
`/api/v1`

## Endpoints

### 1. Authentication (`/auth`)
- **POST `/register`**: Register a new user
- **POST `/googleLogin`**: Login using Google OAuth
- **GET `/logout`**: Logout the current user
- **PATCH `/update-role`**: Update user role (Protected)
- **GET `/google/callback`**: Callback for Google OAuth

### 2. Meetings (`/meeting`)
- **POST `/createmeeting`**: Create a new meeting
- **GET `/mentor-meetings`**: Get meetings for logged-in mentor (Protected)
- **GET `/student-meetings`**: Get meetings for logged-in student (Protected)
- **PATCH `/cancel/:meetingId`**: Cancel a specific meeting (Protected)

### 3. Students (`/student`)
- **GET `/list`**: Get a list of all students

### 4. Google Calendar (`/google`)
- **GET `/connect`**: Connect user's Google Calendar (Protected)

### 5. Attendance (`/attendance`)
- **GET `/meeting/:meetingId`**: Get attendance for a specific meeting (Protected)
- **POST `/join/:meetingId`**: Mark a user as joined for a meeting (Protected)
- **POST `/leave/:meetingId`**: Mark a user as left for a meeting (Protected)
- **GET `/export/excel/:meetingId`**: Export meeting attendance as Excel (Protected)
- **GET `/export/pdf/:meetingId`**: Export meeting attendance as PDF (Protected)

# Teacher Meeting Scheduler

## 1. Project Overview
Teacher Meeting Scheduler is a web application designed to facilitate the scheduling, management, and tracking of meetings between faculty (mentors) and students. It integrates seamlessly with Google Calendar and Google Meet, providing real-time synchronization, automated email reminders, and comprehensive attendance tracking.

### Covered Features
| Feature | Description | Status |
|---------|-------------|--------|
| **Role-based Dashboards** | Separate dashboards for Faculty and Students. | ✅ Complete |
| **Google Calendar Sync** | Two-way synchronization with Google Calendar. | ✅ Complete |
| **Google Meet Integration** | Auto-generation of Google Meet links for meetings. | ✅ Complete |
| **Meeting Management** | Create, view, update, and cancel scheduled meetings. | ✅ Complete |
| **Automated Reminders** | Email reminders sent 24 hours, 1 hour, and 15 mins prior. | ✅ Complete |
| **Attendance Tracking** | Real-time join/leave tracking with total duration. | ✅ Complete |
| **Exportable Reports** | Download attendance records in PDF or Excel formats. | ✅ Complete |
| **Meeting History** | Dedicated view for past/completed meetings. | ✅ Complete |
| **Calendar Views** | Visual calendar mapping of scheduled meetings. | ✅ Complete |

## 2. Application Process Flow

To understand how the MeetSync application functions end-to-end, here is the standard user flow:

### 1. Authentication & Role Selection
- **Google Login:** Users sign in via Google OAuth. The platform verifies their credentials and issues a secure JWT token, which is stored in an HTTP-only cookie and managed globally via React Context.
- **Role Assignment:** First-time users are prompted to choose a role: **Teacher (Faculty/Mentor)** or **Student**. This choice dynamically determines their permissions and assigns them to the appropriate dashboard.
- **Route Protection:** All application routes (`/student-dashboard`, `/faculty-dashboard`) are protected. If an unauthenticated user tries to visit them, they are redirected. Additionally, users are restricted to their specific role dashboard to ensure data isolation.

### 2. Dashboard Interface
- **Faculty Dashboard:** Teachers can view their upcoming meetings, check attendance logs from past sessions, download Excel/PDF attendance reports, and create new meetings.
- **Student Dashboard:** Students can see meetings assigned to them by their teachers and directly join Google Meet links when the session starts.

### 3. Meeting Scheduling & Calendar Sync
- **Creation:** A Faculty member can create a meeting by specifying a title, description, time, and selecting participating students from the directory.
- **Google Calendar Sync:** The backend leverages the teacher's Google Calendar API token to auto-create a Google Calendar Event and securely generates a unique **Google Meet Link**.
- **Email Notifications:** Once scheduled, the system triggers `EmailJS` to instantly send personalized meeting invitations containing the agenda and the Meet link to both the participants and the mentor.

### 4. Automated Reminders (Cron Jobs)
- A background cron job (`reminderCron.js`) runs continuously on the server, checking meeting start times every 5 minutes.
- It automatically triggers batch EmailJS notifications at **24 hours**, **1 hour**, and **15 minutes** prior to the meeting's start time to ensure all participants are reminded. 
- Reminders are iterated individually per user to prevent email delivery failure.

### 5. Session Execution & History
- Once the meeting time ends, the server auto-completes the meeting status.
- The faculty can log and review the attendance of participants and can download the finalized logs using the integrated PDF/Excel export endpoints.

## 3. Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v16.x or higher)
- npm or yarn
- MongoDB (local or Atlas cluster)

## 4. Installation Steps

**Clone the repository:**
```bash
git clone https://github.com/your-username/teacher-meeting-scheduler.git
cd teacher-meeting-scheduler
```

**Install dependencies:**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

**Configure environment variables:**
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/MeetSync
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
```

**Set up Google OAuth credentials:**
1. Go to the Google Cloud Console.
2. Create a new project and enable the Google Calendar API.
3. Generate OAuth 2.0 Client IDs and Secrets, and add them to your `.env` file.

**Database setup (MongoDB connection):**
Ensure MongoDB is running locally on port `27017` or update the `MONGODB_URI` in your `.env` file to point to your MongoDB Atlas connection string.

## 5. Running the Application

**Development mode:**
Open two terminals.

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

**Production mode:**
```bash
cd client
npm run build
cd ../server
npm start
```

## 6. Running Tests
*(Testing suite setup is currently pending. Unit and integration tests will be added in future releases using Jest and Supertest).*

## 7. API Endpoints
Comprehensive documentation of all backend API endpoints is available in the dedicated API documentation file.

👉 [**View API Documentation**](./API_DOCUMENTATION.md)

## 8. Deployment Guide

**Deploying Client on Netlify:**
1. Connect your GitHub repository to Netlify.
2. Set the Build Command to `npm run build` (in the client directory).
3. Set the Publish directory to `client/dist`.
4. Add the necessary Environment Variables (e.g., `VITE_API_URL`).

**Deploying Server on Render:**
1. Connect your GitHub repository to Render as a Web Service.
2. Set the Root Directory to `server`.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `npm start`.
5. Add all the Environment Variables from your local `.env` file.

## 9. Folder Structure
```text
/
├── client/                 # Frontend React Application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components and dashboards
│   │   ├── config/         # API and third-party configuration
│   │   ├── context/        # React Context providers (AuthContext)
│   │   └── pages/          # Full-page route components
│   └── public/             # Static assets
└── server/                 # Backend Node.js Application (Express)
    ├── controller/         # Request handling and business logic
    ├── middlewares/        # Express middlewares (Auth, Error handling)
    ├── models/             # Mongoose database schemas
    ├── routes/             # API route definitions
    ├── util/               # Helper functions (Google Calendar, etc.)
    └── cron/               # Scheduled background jobs (Reminders, Auto-complete)
```

## 10. Contributing
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes following conventional commit messages.
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

Please adhere to standard code formatting conventions and ensure all code is properly commented.

## 11. Support/Contact
For any queries, feature requests, or support, please contact the developer at:
- **Email**: tanishk.workforme@gmail.com
- **GitHub**: [@your-username](https://github.com/tanishksarathe)

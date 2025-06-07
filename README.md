# AutoTask
This project aims to minimize the time required for manual task assignment by automatically selecting time slots based on availability, deadlines, and preferred scheduling hours.

## Features
- **Auto Scheduling:** Automatically schedule new tasks while ensuring deadlines and preferred times are met.
- **Rescheduling:** Reschedule overdue tasks when there are available slots.
- **Task Management:** 
  - Allow users to create, read, update, and delete tasks.
  - Search and filter tasks *(In-progress)*.
- **User Management:** 
  - Allow users to Sign-up and Log-in with email and password.
  - Log-in with Google.
  - Send email verification after signing up successfully.
  - Send verification links for forgotten password requests.
- **Performance Dashboard *(In-progress)*:** Analyze users' performance daily, weekly, and monthly.

## Database
- **MongoDB:** Store users, tasks, and preferred scheduling hours.
- **Redis:** Store blacklisted tokens to verify token validity.

## Security
- **Authentication:** JWT-based authentication.
- **Authorization:** Protect end-points by checking valid access tokens.
- **CORS:** CORS configuration for frontend integration.

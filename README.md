## Google Calendar Integration

The meeting flow now creates Google Calendar events with Google Meet links from the server.

Set one of these credential options in `server/.env`:

- OAuth refresh token flow:
	- `GOOGLE_CALENDAR_CLIENT_ID`
	- `GOOGLE_CALENDAR_CLIENT_SECRET`
	- `GOOGLE_CALENDAR_REFRESH_TOKEN`
	- `GOOGLE_CALENDAR_REDIRECT_URI` (optional if already configured)
- Service account flow:
	- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
	- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

Optional settings:

- `GOOGLE_CALENDAR_ID` defaults to `primary`
- `GOOGLE_CALENDAR_TIME_ZONE` defaults to `UTC`

The create-meeting request is available at `POST /meeting/createmeeting` and expects authenticated requests with the JWT cookie already set.

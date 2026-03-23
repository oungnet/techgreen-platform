# Ban Non-Yai Smarter - Membership & OAuth Setup

## 1) Required `.env` values

```env
# Database
DATABASE_URL="mysql://root:1234@localhost:3306/techgreen_db"

# Existing Manus OAuth (legacy flow)
OAUTH_SERVER_URL=""
VITE_APP_ID=""
JWT_SECRET=""
OWNER_OPEN_ID=""

# Session / Auth
SESSION_SECRET="replace-with-long-random-secret"
NEXTAUTH_SECRET="replace-with-long-random-secret"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Facebook OAuth
FACEBOOK_APP_ID=""
FACEBOOK_APP_SECRET=""
```

## 2) Google OAuth callback

Set redirect URI in Google Cloud Console:

`http://localhost:3000/api/auth/google/callback`

## 3) Facebook OAuth callback

Set redirect URI in Meta for Developers:

`http://localhost:3000/api/auth/facebook/callback`

## 4) Local auth endpoints

- `POST /api/auth/local/register`
- `POST /api/auth/local/login`
- `POST /api/auth/local/verify-email`
- `POST /api/auth/local/forgot-password`
- `POST /api/auth/local/reset-password`
- `POST /api/auth/logout`

## 5) Notes

- Current local email verification/reset token storage is in-memory (for development starter).
- For production, move tokens and password hashes to dedicated DB tables.
- Admin route guard is applied to `/admin*` pages on frontend.

# TechGreen Platform 2026 - Membership System Implementation Guide

## Overview

The TechGreen Platform now includes a comprehensive membership system with user registration, authentication, profile management, and subscription tier management. This guide provides an overview of the implementation and how to use the system.

## System Architecture

### Backend Components

#### 1. Database Schema (Drizzle ORM)

**Users Table**
- `id`: Primary key
- `email`: User email (unique)
- `name`: User full name
- `phone`: Optional phone number
- `address`: Optional address
- `bio`: Optional biography
- `avatar`: Optional avatar URL
- `role`: User role (admin, user, guest)
- `membershipTier`: Current membership tier (free, basic, premium, enterprise)
- `membershipStatus`: Status of membership (active, inactive)
- `membershipExpiresAt`: Membership expiration date
- `emailVerified`: Email verification status (0 or 1)
- `lastSignedIn`: Last login timestamp
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

**Auth Credentials Table**
- `id`: Primary key
- `userId`: Foreign key to users table
- `passwordHash`: Bcrypt hashed password
- `emailVerificationToken`: Token for email verification
- `emailVerificationTokenExpiresAt`: Token expiration
- `passwordResetToken`: Token for password reset
- `passwordResetTokenExpiresAt`: Token expiration

**Membership Subscriptions Table**
- `id`: Primary key
- `userId`: Foreign key to users table
- `tier`: Subscription tier (free, basic, premium, enterprise)
- `status`: Subscription status (active, cancelled, suspended)
- `paymentMethod`: Payment method (free, credit_card, bank_transfer)
- `startDate`: Subscription start date
- `endDate`: Subscription end date
- `nextPaymentDate`: Next payment date
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

**Membership Preferences Table**
- `id`: Primary key
- `userId`: Foreign key to users table
- `newsletter`: Newsletter opt-in (0 or 1)
- `promotions`: Promotions opt-in (0 or 1)
- `dataSharing`: Data sharing opt-in (0 or 1)
- `twoFactorEnabled`: 2FA enabled (0 or 1)
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

#### 2. Backend API Endpoints (tRPC)

**Membership Router** (`server/routers/membership.ts`)

```typescript
// Public Procedures
membership.register          // Register new user
membership.login            // User login
membership.verifyEmail      // Verify email with token

// Protected Procedures
membership.getSubscription  // Get user's subscription details
membership.upgradeTier      // Upgrade membership tier
membership.getPreferences   // Get user preferences
membership.updatePreferences // Update user preferences
membership.cancelSubscription // Cancel membership
```

**Users Router** (`server/routers/users.ts`)

```typescript
// Protected Procedures
users.getProfile           // Get user profile
users.updateProfile        // Update profile information
users.getActivity          // Get user activity history
users.getStats             // Get user statistics
```

### Frontend Components

#### 1. Pages

**LoginMembership** (`client/src/pages/LoginMembership.tsx`)
- Combined login and registration form
- Email/password authentication
- Email verification flow
- Social login options (Google, Facebook, Manus OAuth)
- Responsive design with TechGreen theme

**UserProfileMembership** (`client/src/pages/UserProfileMembership.tsx`)
- Tabbed interface with three sections:
  - **Profile Tab**: View and edit user profile information
  - **Membership Tab**: View subscription details, upgrade tier, cancel subscription
  - **Preferences Tab**: Manage notification and privacy preferences
- Real-time updates using tRPC mutations
- Membership tier visualization
- Payment method selection

#### 2. Components

**ProtectedRoute** (`client/src/components/ProtectedRoute.tsx`)
- Route protection component for authenticated users
- Supports membership tier requirements
- Supports role-based access control
- Displays appropriate error messages

**NavigationEnhanced** (Updated)
- Updated to use new membership login page
- Displays user menu with profile and membership options
- Shows admin menu for admin users
- Responsive mobile menu

#### 3. Hooks

**useAuth** (`client/src/_core/hooks/useAuth.ts`)
- Provides authentication state management
- Handles login/logout
- Automatic redirect for unauthenticated users
- Persists user info to localStorage

## User Flow

### Registration Flow

1. User visits `/login` page
2. Clicks "สมัครสมาชิก" (Register) tab
3. Fills in name, email, password, and optional phone
4. Submits form
5. Backend creates user account with free tier
6. Email verification token is generated
7. User receives verification token (displayed in development)
8. User enters verification token
9. Email is verified and membership becomes active
10. User can now login

### Login Flow

1. User visits `/login` page
2. Enters email and password
3. Backend verifies credentials
4. User is authenticated and redirected to profile
5. User info is stored in context and localStorage

### Membership Upgrade Flow

1. Authenticated user visits `/profile`
2. Clicks "สมาชิก" (Membership) tab
3. Selects desired tier (basic, premium, enterprise)
4. Selects payment method (credit card, bank transfer)
5. Clicks "อัปเกรดตอนนี้" (Upgrade Now)
6. Backend updates subscription
7. Membership tier is updated
8. User receives confirmation

### Preferences Management Flow

1. Authenticated user visits `/profile`
2. Clicks "ตั้งค่า" (Preferences) tab
3. Toggles preferences:
   - Newsletter subscription
   - Promotions
   - Data sharing
   - Two-factor authentication
4. Clicks "บันทึกการตั้งค่า" (Save Preferences)
5. Backend updates preferences
6. User receives confirmation

## Security Features

### Password Security
- Passwords are hashed using bcrypt (10 rounds)
- Minimum 8 characters required
- Passwords are never stored in plain text

### Email Verification
- Email verification tokens are generated using crypto.randomBytes
- Tokens expire after 24 hours
- Users cannot login until email is verified

### Session Management
- Uses HTTP-only cookies for session storage
- Session tokens are secure and cannot be accessed by JavaScript
- Automatic logout on session expiration

### Role-Based Access Control (RBAC)
- Admin role: Full access to admin features
- User/Member role: Access to user features
- Guest role: Limited access to public features

### Protected Routes
- Profile page requires authentication
- Dashboard requires authentication
- Admin pages require admin role
- Premium features require premium tier

## API Usage Examples

### Frontend (React/tRPC)

```typescript
// Register
const registerMutation = trpc.membership.register.useMutation();
await registerMutation.mutateAsync({
  email: "user@example.com",
  password: "securePassword123",
  name: "John Doe",
  phone: "08X-XXX-XXXX",
});

// Login
const loginMutation = trpc.membership.login.useMutation();
const result = await loginMutation.mutateAsync({
  email: "user@example.com",
  password: "securePassword123",
});

// Get Profile
const { data: profile } = trpc.users.getProfile.useQuery();

// Update Profile
const updateMutation = trpc.users.updateProfile.useMutation();
await updateMutation.mutateAsync({
  name: "Jane Doe",
  bio: "Software engineer",
  phone: "08X-XXX-XXXX",
  address: "Bangkok, Thailand",
});

// Get Subscription
const { data: subscription } = trpc.membership.getSubscription.useQuery();

// Upgrade Tier
const upgradeMutation = trpc.membership.upgradeTier.useMutation();
await upgradeMutation.mutateAsync({
  tier: "premium",
  paymentMethod: "credit_card",
});

// Update Preferences
const prefMutation = trpc.membership.updatePreferences.useMutation();
await prefMutation.mutateAsync({
  newsletter: 1,
  promotions: 1,
  dataSharing: 0,
  twoFactorEnabled: 1,
});
```

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/techgreen

# JWT/Session
SESSION_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Email (for sending verification emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Tier Pricing

| Tier | Price | Features |
|------|-------|----------|
| Free | ฿0 | Basic access to public data |
| Basic | ฿299/month | Advanced analytics, API access |
| Premium | ฿999/month | Priority support, custom reports |
| Enterprise | Custom | Dedicated support, custom integration |

## Troubleshooting

### Common Issues

**Issue: Email verification token not received**
- In development, token is displayed in the response
- In production, implement email sending service
- Check SMTP configuration

**Issue: Login fails with "Invalid email or password"**
- Verify email exists in database
- Check password is correct
- Ensure account is verified

**Issue: Protected routes redirect to login**
- Check user is authenticated
- Verify session cookie is set
- Clear browser cache and cookies

**Issue: Membership tier not updating**
- Verify user is authenticated
- Check database connection
- Verify payment method is valid

## Future Enhancements

1. **Email Verification**
   - Implement email sending service (SendGrid, AWS SES)
   - Automated verification emails

2. **Password Reset**
   - Password reset flow with email verification
   - Secure token-based reset

3. **Two-Factor Authentication**
   - TOTP (Time-based One-Time Password)
   - SMS verification

4. **Payment Integration**
   - Stripe integration for credit card payments
   - Omise integration for Thai payment methods
   - Automated billing

5. **Social Login**
   - Google OAuth
   - Facebook OAuth
   - Manus OAuth

6. **User Analytics**
   - Track user activity
   - Generate usage reports
   - Membership analytics

7. **Admin Dashboard**
   - User management
   - Subscription management
   - Revenue analytics
   - Support tickets

## Support

For issues or questions about the membership system, please contact:
- Email: support@techgreen.local
- Phone: +66-X-XXX-XXXX
- Documentation: https://docs.techgreen.local/membership

## License

This membership system is part of the TechGreen Platform 2026 and is subject to the same license terms.

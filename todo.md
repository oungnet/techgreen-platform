# TechGreen Platform 2025 - TODO

## Phase 1: File Storage System (Completed)
- [x] Database schema: Create files and fileShares tables
- [x] Database migration: Execute SQL to create tables
- [x] Query helpers: Add file management functions to server/db.ts
- [x] tRPC router: Create files router with upload, list, delete, update, share procedures
- [x] Register files router: Add filesRouter to main appRouter
- [x] FileManager component: Create UI for uploading and managing files
- [x] Add FileManager to UserDashboard page
- [x] Create vitest tests for file operations
- [x] Test file upload, download, delete, and share functionality (15 tests passed)
- [x] Create checkpoint

## Phase 2: Platform Enhancement (Completed)
- [x] Database schema: Extend users table with profile fields
- [x] Database schema: Create articles table for Learning page
- [x] Database schema: Create comments table for article comments
- [x] Database schema: Create ratings table for article ratings
- [x] Database schema: Create emailSubscriptions table
- [x] Database schema: Create emailNotifications table
- [x] Database migration: Execute SQL to create new tables
- [x] Query helpers: Add article management functions to server/db.ts
- [x] Query helpers: Add comment management functions
- [x] Query helpers: Add rating management functions
- [x] Query helpers: Add email subscription functions
- [x] tRPC router: Create articles router with procedures
- [x] tRPC router: Create users router with profile management
- [x] tRPC router: Create emailSubscriptions router
- [x] Register new routers in appRouter
- [x] SearchArticles component: Full-text search functionality
- [x] ArticleComments component: Display and add comments
- [x] ArticleRating component: 5-star rating system
- [x] Learning page: Integrate search and components
- [x] UserProfile page: Edit user profile information
- [x] EmailPreferences page: Manage email subscriptions
- [x] Add routes to App.tsx
- [x] Create unit tests for articles API
- [x] Create unit tests for user profile API
- [x] Create unit tests for email subscription API
- [x] Run all tests and verify passing (23/23 tests passed)
- [x] Create checkpoint

## Phase 3: Admin Dashboard (Completed)
- [x] Database schema: Add articles, comments, ratings tables
- [x] Database schema: Add emailSubscriptions and emailNotifications tables
- [x] Database migration: Execute SQL to create new tables
- [x] Query helpers: Add article management functions
- [x] Query helpers: Add comment management functions
- [x] tRPC router: Create admin router with article procedures
- [x] tRPC router: Create admin router with comment procedures
- [x] tRPC router: Create admin dashboard stats procedure
- [x] AdminArticlesTable component: Display and manage articles
- [x] AdminCommentsTable component: Display and manage comments
- [x] AdminDashboard page: Overview with statistics
- [x] Add admin route to App.tsx
- [x] Create unit tests for admin operations
- [x] Run all tests and verify passing (13/15 admin tests pass)
- [x] Create checkpoint

## Phase 4: Advanced Admin Features (In Progress)

### Database & Backend (Completed)
- [x] Add contentModeration table for flagged comments
- [x] Add emailCampaigns table for campaign management
- [x] Add campaignRecipients table for tracking sent emails
- [x] Add userAnalytics table for tracking user behavior
- [x] Database migration: Execute SQL to create new tables
- [x] Query helpers: Add analytics functions (getArticleStats, getCommentStats, getUserStats)
- [x] Query helpers: Add user management functions (updateUserRole, deactivateUser)
- [x] Query helpers: Add moderation functions (flagComment, getModerationQueue, approve/reject)
- [x] Query helpers: Add campaign functions (createCampaign, getCampaigns, updateStatus)
- [x] Query helpers: Add user analytics functions (getOrCreateUserAnalytics, updateUserAnalytics)

### Backend APIs (Completed)
- [x] Create analytics router with statistics procedures
- [x] Create moderation router with approval/rejection procedures
- [x] Create campaigns router with campaign management procedures
- [x] Register all new routers in appRouter

### Frontend - Analytics Dashboard (Completed)
- [x] Create AnalyticsDashboard page (/admin/analytics)
- [x] Build article statistics chart (Chart.js - doughnut)
- [x] Build comment statistics chart (Chart.js - bar)
- [x] Build user distribution chart (Chart.js - pie)
- [x] Add statistics cards (total articles, comments, users)
- [x] Add route to App.tsx

### Frontend - Content Moderation (In Progress)
- [ ] Create ContentModeration page (/admin/moderation)
- [ ] Build flagged comments table
- [ ] Add approve/reject interface
- [ ] Add moderation statistics

### Frontend - Email Campaigns (In Progress)
- [ ] Create EmailCampaigns page (/admin/campaigns)
- [ ] Build campaign creation form
- [ ] Build campaigns list with status
- [ ] Add campaign sending interface

### Frontend - User Management (In Progress)
- [ ] Create UserManagement page (/admin/users)
- [ ] Build users table with pagination
- [ ] Add role change functionality
- [ ] Add user deactivation

### Frontend - Homepage Redesign (In Progress)
- [ ] Create new Hero section with better visuals
- [ ] Add feature cards with icons
- [ ] Add testimonials section
- [ ] Add statistics section
- [ ] Add CTA buttons
- [ ] Improve color scheme and typography

### Frontend - Navigation Menu (In Progress)
- [ ] Create improved navigation component
- [ ] Add user profile dropdown
- [ ] Add admin menu for admins
- [ ] Add mobile responsive menu

### Testing & Deployment
- [ ] Write tests for analytics procedures
- [ ] Write tests for moderation procedures
- [ ] Write tests for campaign procedures
- [ ] Run all tests and verify passing
- [ ] Create checkpoint

# TechGreen Platform 2025 - TODO

## File Storage System Implementation

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

## Phase 2: Platform Enhancement (COMPLETED)

### Database & Backend
- [x] Extend users table with profile fields
- [x] Create articles table for Learning content
- [x] Create comments table for article comments
- [x] Create ratings table for article ratings
- [x] Create emailSubscriptions table for newsletter
- [x] Create emailNotifications table for email tracking
- [x] Database migration for all new tables

### Backend APIs
- [x] User profile management procedures
- [x] Article management procedures
- [x] Comment procedures
- [x] Rating procedures
- [x] Email subscription procedures
- [x] Full-text search procedure for articles
- [x] Email notification procedures

### Frontend
- [x] User profile page (/profile)
- [x] Email preferences page (/email-preferences)
- [x] Learning page with search
- [x] Comments section component
- [x] Rating stars component
- [x] All 23 tests passing

## Phase 3: Admin Dashboard (COMPLETED)

### Database & Backend
- [x] Add admin-only procedures for article management
- [x] Add comment approval/rejection procedures
- [x] Add admin statistics procedures
- [x] Add user activity tracking procedures

### Backend APIs
- [x] articlesRouter: create, update, delete (admin only)
- [x] commentsRouter: approve, reject, delete (admin only)
- [x] adminRouter: getDashboardStats, getArticleStats, getCommentStats
- [x] Add adminProcedure middleware for role-based access

### Frontend - Admin Dashboard
- [x] Create AdminDashboard page (/admin)
- [x] Build articles management table
- [x] Build comments management table
- [x] Add article creation/edit form
- [x] Add comment approval interface
- [x] Create statistics/analytics section
- [x] Add user management section

### Components
- [x] AdminArticlesTable component
- [x] AdminCommentsTable component
- [x] AdminDashboard page

### Testing
- [x] Write tests for admin procedures
- [x] Test role-based access control
- [x] Test article CRUD operations
- [x] Test comment approval workflow (13/15 tests passing)
- [ ] Create checkpoint

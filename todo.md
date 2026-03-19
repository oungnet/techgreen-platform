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

## Completed Features

- [x] Database (MySQL/TiDB) with users table
- [x] tRPC API backend
- [x] Manus OAuth authentication
- [x] S3 File Storage integration
- [x] Dev server running
- [x] GitHub repository synced
- [x] Nested anchor tags bug fixed
- [x] 8 main pages created (Home, DisabilityBenefits, TaxBenefits, Resources, Innovation, Partnership, Dashboard, Learning)
- [x] 5 additional pages (Register, Login, ApplyBenefits, Contact, UserDashboard)
- [x] Responsive design with Sarabun font

## Phase 2: Platform Enhancement (COMPLETED)

### Database & Backend
- [x] Extend users table with profile fields (bio, avatar, phone, address)
- [x] Create articles table for Learning content
- [x] Create comments table for article comments
- [x] Create ratings table for article ratings
- [x] Create emailSubscriptions table for newsletter
- [x] Create emailNotifications table for email tracking
- [x] Database migration for all new tables

### Backend APIs
- [x] User profile management procedures (get, update)
- [x] Article management procedures (create, list, search, getBySlug)
- [x] Comment procedures (create, list)
- [x] Rating procedures (create, update, get)
- [x] Email subscription procedures (getPreferences, updatePreferences, getNotifications)
- [x] Full-text search procedure for articles
- [x] Email notification procedures

### Frontend - Member System
- [x] Create user profile page (/profile)
- [x] Add profile edit form
- [x] Display user info with edit capability

### Frontend - Learning Page Enhancement
- [x] Implement full-text search component (SearchArticles)
- [x] Integrate search with Learning page
- [x] Add article list display

### Frontend - Comments & Ratings
- [x] Create comments section component (ArticleComments)
- [x] Implement rating stars component (ArticleRating)
- [x] Add rating submission

### Frontend - Email Notifications
- [x] Create email subscription component
- [x] Add subscription preferences page (/email-preferences)
- [x] Display notification history
- [x] Display notification status

### Testing & Deployment
- [x] Write vitest tests for new procedures (8 articles tests)
- [x] Test full-text search functionality
- [x] Test email notification system
- [x] All 23 tests passing
- [ ] Create checkpoint

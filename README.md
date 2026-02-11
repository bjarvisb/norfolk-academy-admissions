# Norfolk Academy Admissions & Athletics Tracker

A web application for tracking prospective student-athletes through the 2027-28 admissions cycle.

## Features

- Student profile management with comprehensive notes system
- Two view modes: Table view and List view
- Advanced filtering by status, grade, and search
- Real-time data sync with Google Sheets backend
- Secure authentication through Norfolk Academy Google Apps

## Deployment to Vercel

### Step 1: Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your email or GitHub account

### Step 2: Deploy via File Upload
1. Click "Add New..." → "Project"
2. Choose "Continue without a Git Repository"
3. Select "Upload Files"
4. Drag and drop the ENTIRE project folder or select all files:
   - package.json
   - vite.config.js
   - tailwind.config.js
   - postcss.config.js
   - index.html
   - src/ folder (contains App.jsx, main.jsx, index.css)
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

### Step 3: Wait for Deployment
- Vercel will install dependencies and build your app
- This typically takes 1-3 minutes
- You'll get a live URL when complete (e.g., `your-project.vercel.app`)

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Technical Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Google Apps Script (already configured)
- **Hosting**: Vercel

## Google Apps Script Connection

The app connects to your Google Apps Script deployment at:
```
https://script.google.com/a/macros/norfolkacademy.org/s/AKfycbzi3SOLX51KXq9IzT5XaFreXbJJmrgLztFmL1W0a2uss_gtcXeMjEDABX1LlHrN0fpk/exec
```

This is already configured in `src/App.jsx` and requires no additional setup.

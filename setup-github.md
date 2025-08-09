# GitHub Repository Setup Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Set repository name: `TaskFlow-Manager`
5. Set description: "TaskFlow – Simple Task Manager App built with React, Node.js, Express, and MongoDB"
6. Choose **Public** (or Private if preferred)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands in your terminal:

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/TaskFlow-Manager.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Set Up Branch Protection (Optional but Recommended)

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Branches" in the left sidebar
4. Click "Add rule"
5. Branch name pattern: `main`
6. Check "Require pull request reviews before merging"
7. Check "Require status checks to pass before merging"
8. Click "Create"

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Create repository and push
gh repo create TaskFlow-Manager --public --description "TaskFlow – Simple Task Manager App built with React, Node.js, Express, and MongoDB"
git remote add origin https://github.com/$(gh api user --jq .login)/TaskFlow-Manager.git
git branch -M main
git push -u origin main
```

## Verification

After pushing, verify your repository contains:
- ✅ Backend code with API endpoints
- ✅ Frontend React application
- ✅ Comprehensive tests
- ✅ Documentation (README.md)
- ✅ Proper .gitignore files
- ✅ Package.json files with dependencies

Your TaskFlow application is now ready for collaboration and deployment!

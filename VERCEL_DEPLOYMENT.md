# Vercel Deployment Guide

This guide covers deploying the frontend application to Vercel with proper configuration.

## Prerequisites

- Vercel account connected to your GitHub repository
- Firebase project with authentication and Firestore enabled
- Backend API deployed and accessible

## Environment Variables

The following environment variables must be configured in Vercel:

### Firebase Configuration (Required)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend API Configuration (Required)
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

## Vercel Project Configuration

### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

### Environment Variables Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each environment variable listed above
4. Select the appropriate environments (Production, Preview, Development)
5. Click **Save**

### Domain Configuration

1. Go to **Settings → Domains**
2. Add your custom domain if needed
3. Configure DNS records as instructed by Vercel

## Deployment Process

### Automatic Deployment
- Push to `main` branch triggers production deployment
- Pull requests trigger preview deployments
- All commits are automatically built and deployed

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Post-Deployment Checklist

### ✅ Verify Build Success
- Check build logs in Vercel dashboard
- Ensure no build errors or warnings
- Verify all pages generated successfully

### ✅ Test Firebase Integration
- [ ] User authentication (sign up/sign in)
- [ ] Google OAuth authentication
- [ ] Firestore data operations
- [ ] Firebase Storage image loading

### ✅ Test Backend API Integration
- [ ] Video generation endpoint
- [ ] Payment processing
- [ ] Marketplace operations
- [ ] Seller payout requests

### ✅ Performance Checks
- [ ] Image optimization working (Next.js Image)
- [ ] Pages load quickly
- [ ] No console errors in browser
- [ ] Mobile responsiveness

## Common Issues & Solutions

### Issue: Firebase authentication fails
**Solution**: Verify Firebase environment variables are correctly set in Vercel

### Issue: Images not loading from Firebase Storage
**Solution**: Check `next.config.ts` has correct `remotePatterns` for Firebase domains:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    { protocol: 'https', hostname: 'storage.googleapis.com' },
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
  ]
}
```

### Issue: Backend API calls failing
**Solution**: Update `NEXT_PUBLIC_BACKEND_URL` and `NEXT_PUBLIC_API_BASE_URL` to production API URL

### Issue: Build fails with Firebase error
**Solution**: The Firebase configuration is now conditional and handles missing env vars gracefully during build

## Monitoring & Logs

### View Deployment Logs
1. Go to Vercel dashboard
2. Select your project
3. Click on specific deployment
4. View **Build Logs** and **Function Logs**

### Analytics
- Vercel provides built-in analytics
- Monitor page views, performance, and errors
- Set up custom events if needed

## Security Considerations

### Environment Variables
- ✅ All sensitive values stored as environment variables
- ✅ `.env.local` excluded from git
- ✅ Firebase API keys are public (client-side) but secured via Firebase rules
- ✅ Backend API should validate all requests

### Firebase Security Rules
Ensure Firestore and Storage rules are properly configured:
- Only authenticated users can read/write their own data
- Marketplace listings are publicly readable
- Admin operations require admin role verification

## Rollback Procedure

If a deployment causes issues:

1. Go to Vercel dashboard
2. Find previous working deployment
3. Click **...** menu → **Promote to Production**
4. Confirm rollback

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Firebase Documentation**: https://firebase.google.com/docs

## Update Checklist

When pushing updates:
- [ ] Test locally with `npm run build`
- [ ] Verify all environment variables are set
- [ ] Test all critical user flows
- [ ] Monitor deployment logs
- [ ] Test production deployment
- [ ] Verify no regressions

# Vercel Deployment Guide

## Quick Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to web folder
cd web

# 3. Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: mineral-forecasting-plutus
# - Framework: Next.js
# - Build command: npm run build
# - Output directory: .next
```

### Option 2: Deploy via GitHub Integration

1. **Push to GitHub** (already done - branch: `windsurf/autogen`)

2. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Import from GitHub: `hkj13/mineral-forecasting-plutus`

3. **Configure Project**
   - **Framework Preset:** Next.js
   - **Root Directory:** `web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

## Configuration File

The project already has the correct Next.js configuration in `web/next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};
```

## Environment Variables (Optional)

If connecting to a backend API, set these in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

## Expected URLs After Deployment

- **Production:** `https://mineral-forecasting-plutus.vercel.app`
- **Preview:** `https://mineral-forecasting-plutus-*.vercel.app`

## Demo Credentials

```
Email: judge@plutus.iitism.ac.in
Password: Plutus2025!
```

## Troubleshooting

### Build Fails
- Check that `web/` is set as root directory
- Ensure Node.js 18+ is selected in Vercel settings

### Styles Not Loading
- Clear Vercel cache and redeploy
- Check Tailwind CSS configuration

### API Connection Issues
- The current MVP uses frontend mock data
- No backend required for demo

## Pages Available

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Demo authentication |
| Dashboard | `/dashboard` | KPIs, charts, insights |
| Forecasting | `/forecasting` | ML predictions |
| Scenarios | `/scenarios` | Policy simulations |
| Analytics | `/analytics` | ANOVA, state mapping |

---

**Ready to Deploy!** 🚀

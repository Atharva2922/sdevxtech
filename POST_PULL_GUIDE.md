# Post-Pull Setup Guide

## After running `git pull`, always run:

```bash
# Install any new dependencies
npm install

# Clear Next.js cache if needed
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Restart the dev server
npm run dev
```

## Common Issues After Git Pull

### 1. Missing Dependencies
**Error**: `Module not found: Can't resolve 'package-name'`

**Solution**:
```bash
npm install
```

### 2. Build Cache Issues
**Error**: Unexpected errors or stale code

**Solution**:
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

### 3. Environment Variables
**Error**: Missing environment variables

**Solution**: Check if `.env.local` needs updates based on new code

## Automated Post-Pull Script

Create a file `post-pull.ps1`:
```powershell
Write-Host "Running post-pull setup..." -ForegroundColor Green
npm install
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Write-Host "Setup complete! Run 'npm run dev' to start." -ForegroundColor Green
```

Then after `git pull`, just run:
```bash
.\post-pull.ps1
```

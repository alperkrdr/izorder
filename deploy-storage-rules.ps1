# Firebase Storage Rules Deploy Script
Write-Host "🔥 Firebase Storage Rules Deploy Script" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host ""

# Check if firebase CLI is available
try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "✅ Firebase CLI version: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g firebase-tools" -ForegroundColor Cyan
    exit 1
}

# Check current project
Write-Host "📋 Current Firebase project status:" -ForegroundColor Blue
firebase use

Write-Host ""
Write-Host "🚀 Deploying Firebase Storage rules..." -ForegroundColor Blue

# Deploy storage rules
try {
    firebase deploy --only storage
    Write-Host ""
    Write-Host "✅ Storage rules deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🧪 Test the upload now:" -ForegroundColor Cyan
    Write-Host "1. Go to http://localhost:3000/admin/basinda-biz/ekle" -ForegroundColor White
    Write-Host "2. Try uploading an image" -ForegroundColor White
    Write-Host "3. The upload should work without 403 errors" -ForegroundColor White
} catch {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "💡 Manual solution:" -ForegroundColor Yellow
    Write-Host "1. Go to https://console.firebase.google.com/project/izorder-92337/storage/rules" -ForegroundColor White
    Write-Host "2. Copy the rules from firebase-storage.rules file" -ForegroundColor White
    Write-Host "3. Paste and click Publish" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

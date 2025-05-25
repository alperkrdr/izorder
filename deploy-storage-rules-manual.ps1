# Firebase Storage Rules Deployment Script
# Bu script Firebase Storage rules'larını deploy etmek için gerekli adımları gösterir

Write-Host "🔥 Firebase Storage Rules Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Rules dosyası: firebase-storage.rules" -ForegroundColor Green
Write-Host "🎯 Hedef project: izorder-92337" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Manuel deployment adımları:" -ForegroundColor Yellow
Write-Host "1. Firebase Console'a gidin" -ForegroundColor White
Write-Host "2. Storage rules'ları güncelleyin" -ForegroundColor White
Write-Host "3. Değişiklikleri yayınlayın" -ForegroundColor White
Write-Host ""

Write-Host "🌐 Firebase Console Storage Rules sayfasını açıyor..." -ForegroundColor Cyan
Start-Process "https://console.firebase.google.com/project/izorder-92337/storage/rules"

Write-Host ""
Write-Host "📄 Rules dosyasının içeriğini görüntülüyor..." -ForegroundColor Cyan
Get-Content -Path "firebase-storage.rules" | Write-Host -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Firebase Console açıldı. Manuel olarak rules'ları kopyalayıp yapıştırın." -ForegroundColor Green

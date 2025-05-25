@echo off
echo Deploying Firebase Storage Rules...
echo.

echo Current project status:
call firebase use

echo.
echo Deploying storage rules...
call firebase deploy --only storage

echo.
echo Deployment completed!
pause

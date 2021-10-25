$cmtMsg = Read-Host "Commit Message"
flutter build web --release
git add .
git commit -m "$cmtMsg"
git push origin master
cd build/web
git init
git add .
git remote add origin https://github.com/erwijet/tigerwatch-deploy.git
git commit -m "build"
git push origin master
#!/bin/bash

git init
git remote add origin https://github.com/Skicken/pomodoro.git
git fetch
git checkout origin/dev -b dev

npm install
npx prisma generate
npx nx run pomodoro-frontend:serve --configuration=development


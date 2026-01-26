@echo off
chcp 65001 >nul
echo ==========================================
echo   DietHolesteric -> Android Installer
echo ==========================================

REM 1. Проверка установки Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не установлен!
    pause
    exit /b
)

REM 2. Создание проекта Vite React
if not exist "package.json" (
    echo [INIT] Создаем проект...
    call npm create vite@latest . -- --template react
    call npm install
    call npm install lucide-react @capacitor/core @capacitor/cli @capacitor/android
    call npx cap init "DietHolesteric" com.dietholesteric.app --web-dir dist
)

REM 3. Копирование кода
if exist "App.jsx" (
    echo [COPY] Копируем App.jsx...
    copy /Y "App.jsx" "src\App.jsx"
)

REM 4. Генерация данных
if exist "generate_data.cjs" (
    echo [DATA] Генерация JSON...
    call node generate_data.cjs
)

REM 5. Сборка
echo [BUILD] Сборка проекта...
call npm run build

REM 6. Android
if not exist "android" (
    echo [PLATFORM] Добавление Android...
    call npx cap add android
)

echo [SYNC] Синхронизация...
call npx cap sync

echo [LAUNCH] Запуск Android Studio...
call npx cap open android
pause

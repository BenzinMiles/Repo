@echo off
chcp 65001 >nul
echo ==========================================
echo   DietHolesteric -> Android Installer
echo ==========================================

REM 1. Проверка установки Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ОШИБКА] Node.js не установлен!
    echo Пожалуйста, скачайте и установите его с сайта https://nodejs.org/
    pause
    exit /b
)

REM 2. Установка зависимостей
echo [DEPS] Проверка и установка библиотек...
if not exist "node_modules" (
    call npm install
) else (
    echo node_modules уже существуют. Пропускаем полную установку (для обновления запустите npm install вручную).
)

REM 3. Генерация данных
if exist "generate_data.js" (
    echo [DATA] Генерируем рецепты и планы (JSON)...
    call node generate_data.js
) else (
    echo [WARNING] Файл generate_data.js не найден!
    pause
    exit /b
)

REM 4. Сборка проекта
echo [BUILD] Собираем веб-версию (Vite)...
call npm run build

REM 5. Настройка Android
if not exist "android" (
    echo [PLATFORM] Добавляем Android платформу...
    call npx cap add android
)

REM 6. Синхронизация
echo [SYNC] Переносим файлы в Android проект...
call npx cap sync

REM 7. Запуск
echo [LAUNCH] Открываем Android Studio...
echo Сейчас откроется студия. Подождите индексацию (Gradle Sync) и нажмите кнопку Run (Зеленый треугольник) или Build -> Build Bundle(s) / APK(s).
call npx cap open android

echo ==========================================
echo   Готово!
echo ==========================================
pause

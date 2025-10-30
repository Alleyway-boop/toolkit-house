@echo off
setlocal

echo 🚀 Initializing and updating git submodules...

:: 检查是否存在 .gitmodules
if not exist .gitmodules (
    echo ❌ No .gitmodules file found in this directory.
    exit /b 1
)

:: 初始化并更新子模块（包括嵌套）
git submodule update --init --recursive

if %errorlevel% neq 0 (
    echo ❌ Failed to update submodules.
    exit /b %errorlevel%
)

echo ✅ All submodules initialized successfully!
endlocal

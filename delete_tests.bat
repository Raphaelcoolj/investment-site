@echo off
echo Attempting to delete test files... > delete_log.txt
del /F /Q "c:\crypto-site\playwright.config.ts" >> delete_log.txt 2>&1
del /F /Q "c:\crypto-site\jest.config.js" >> delete_log.txt 2>&1
del /F /Q "c:\crypto-site\jest.setup.js" >> delete_log.txt 2>&1
rd /S /Q "c:\crypto-site\e2e" >> delete_log.txt 2>&1
rd /S /Q "c:\crypto-site\src\app\api\__tests__" >> delete_log.txt 2>&1
rd /S /Q "c:\crypto-site\src\app\api\auth\__tests__" >> delete_log.txt 2>&1
rd /S /Q "c:\crypto-site\src\components\__tests__" >> delete_log.txt 2>&1
echo Done. >> delete_log.txt

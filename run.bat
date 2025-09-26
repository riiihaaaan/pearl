@echo off
echo Starting Ollama server...
start /B ollama serve
timeout /t 5 /nobreak > nul
echo Starting HTTP server on port 8000...
start /B python -m http.server 8000
echo Servers started. Open http://localhost:8000 in your browser.
pause

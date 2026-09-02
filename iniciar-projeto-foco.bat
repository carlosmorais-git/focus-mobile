@echo off
REM Navega ate a pasta do projeto (pasta onde este .bat esta)
cd /d "%~dp0"

REM Ativa o Node.js versao 20 via NVM
@REM nvm use 20

REM Inicia o projeto com o Expo
npm start

REM Mantem o terminal aberto apos o termino
pause

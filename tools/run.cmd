@echo off
node Config/Config.js
node Data/Data.js
node Resources/resources.js

cd LanguageJS
./run.cmd

@echo on
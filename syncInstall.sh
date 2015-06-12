#!/bin/sh
#作業スクリプト
#	lib-Install 同期スクリプト

rsync -auv /Users/Shared/psAxe/lib-psAxe/lib/ /Users/Shared/psAxe/psAxe/ExtensionContent/psAxeInstall/lib
rsync -auv /Users/Shared/psAxe/lib-psAxe/scripts/axe01/ /Users/Shared/psAxe/psAxe/ExtensionContent/psAxeInstall/scripts/axe01
rsync -auv /Users/Shared/psAxe/lib-psAxe/scripts/axe02/ /Users/Shared/psAxe/psAxe/ExtensionContent/psAxeInstall/scripts/axe02

rsync -auv /Users/Shared/psAxe/psAxe/ExtensionContent/psAxeInstall/ /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/HTML/psAxeInstall
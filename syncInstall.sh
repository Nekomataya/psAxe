#!/bin/sh
#作業スクリプト
#	エクステンション同期スクリプト
#	テスト｜開発用ソースディレクトリ
#		/Users/kiyo/Sites/remaping.js/
#			ライブラリ本体以外はここをソースにするコーディングディレクトリ
#			gitクローン
#			remaping/   ソースディレクトリ
#			xpsedit/    ソースディレクトリ
#			sbdConvert/ ソースディレクトリ
#			xpsedit/  ソースディレクトリ
#			xpsedit/  ソースディレクトリ
#		/Users/kiyo/Sites/uat-electron/
#			ライブラリ本体はソースから同期 uat-Erlectron版のコーディングディレクトリ
#			gitクローン
#			node.js関連？
#			pman/     ソースディレクトリ
#		/Users/kiyo/Library/Application Support/nas/
#			ライブラリ本体のテスト兼コーディングアドレス 同期未完　同期終了後にこちらをマージ元にする2021 0101
#			axe/    ソースディレクトリ
#			otome/  ソースディレクトリ

#		/Library/Application Support/Adobe/CEP/extensions/info.nekomataya.psAxe
#			psAxe/         コーディングディレクトリ 同期対象
#		/Library/Application Support/Adobe/CEP/extensions/info.nekomataya.psAxe.toolbar
#			paAxe/toolbar  コーディングディレクトリ 同期対象
#		/Library/Application Support/Adobe/CEP/extensions/info.nekomataya.uatElectron
#			



#基礎データはlib-psAxeフォルダのみに集約

#rsync -auv /Users/Shared/psAxe/lib-psAxe/lib/ /Users/Shared/psAxe/psAxe/ExtensionContent/psAxeInstall/lib
#rsync -auv /Users/Shared/psAxe/lib-psAxe/ext-lib/ /Users/Shared/psAxe/psAxe/ExtensionContent/psAxeInstall/ext-lib

#rsync -auv /Users/Shared/psAxe/lib-psAxe/scripts/axe01/ /Users/Shared/psAxe/psAxe/ExtensionContent/psAxeInstall/scripts/axe01
#rsync -auv /Users/Shared/psAxe/lib-psAxe/scripts/axe02/ /Users/Shared/psAxe/psAxe/ExtensionContent/psAxeInstall/scripts/axe02
rsync -av /Users/kiyo/Library/Application\ Support/nas/* /Users/Shared/psAxe/lib-psAxe/nas

# CS6用のコンテンツをデバッグ用のディレクトリから、ビルドディレクトリに転送
rsync -av --delete /Applications/Adobe\ Photoshop\ CS6/Plug-ins/Panels/nas\(u\)psAXE/content/nas\(u\)psAXE.assets/HTML/* /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/HTML
rsync -av --delete /Applications/Adobe\ Photoshop\ CS6/Plug-ins/Panels/psAXEtoolbar/content/psAXEtoolbar.assets/HTML/* /Users/Shared/psAxe/Configurator4-CS6/psAXEtoolbar.assets/HTML

#CS6系列からCC系列へ内容の同期
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/HTML/index.html /Users/Shared/psAxe/psAxe/ExtensionContent
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/HTML/ext.js /Users/Shared/psAxe/psAxe/ExtensionContent
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/HTML/style.css /Users/Shared/psAxe/psAxe/ExtensionContent
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/HTML/nas/* /Users/Shared/psAxe/psAxe/ExtensionContent/nas
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/HTML/nasCalc/* /Users/Shared/psAxe/psAxe/ExtensionContent/nasCalc
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/HTML/images/* /Users/Shared/psAxe/psAxe/ExtensionContent/images
# rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/nas\(u\)PsAXE.assets/res/* /Users/Shared/psAxe/psAxe/ExtensionContent/res #ここの同期は置きかえが済むまで手作業

rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/psAXEtoolbar.assets/HTML/index.html /Users/Shared/psAxe/psAxeToolBar/ExtensionContent
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/psAXEtoolbar.assets/HTML/ext.js /Users/Shared/psAxe/psAxeToolBar/ExtensionContent
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/psAXEtoolbar.assets/HTML/style.css /Users/Shared/psAxe/psAxeToolBar/ExtensionContent
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/psAXEtoolbar.assets/HTML/nas/* /Users/Shared/psAxe/psAxeToolBar/ExtensionContent/nas
rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/psAXEtoolbar.assets/HTML/images/* /Users/Shared/psAxe/psAxeToolBar/ExtensionContent/images
#rsync -av --delete /Users/Shared/psAxe/Configurator4-CS6/psAXEtoolbar.assets/res/* /Users/Shared/psAxe/psAxeToolBar/res #ここの同期は置きかえが済むまで手作業

#
#end script
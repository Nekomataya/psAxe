/*
	Adobe�X�N���v�g�Ŏ��s����C���X�g�[��
	�A�v���P�[�V�����̔���
	�C���X�g�[����
	���擾�E�ݒ�Ȃ�

$Id: nasPsAxeInstall.jsx,v 1.6 2014/11/28  kiyo Exp $
 */
// enable double clicking from the Macintosh Finder or the Windows Explorer
 #target photoshop
//�����I�u�W�F�N�g�����݂��Ȃ��ꍇ���̃I�u�W�F�N�g�ŃG���[���������
try{if(arguments[0]){;};}catch(ERR){var arguments=new Array();}
//==================== �^�[�Q�b�g�p�X���擾���Ă���
//alert(arguments[0] +":"+ Folder.current.path)

if($.fileName){
//	CS3�ȍ~�́@$.fileName�I�u�W�F�N�g���g�p
	if($.os.indexOf("Windows")){
	 var nasFolderPath = new File($.fileName).parent.path +"/";
	}else{
	 var nasFolderPath = new File($.fileName).parent.parent.fsName +"/";
	}
//	var thisFileName=new File($.fileName).name;//���ʗp���ȃt�@�C����

}else{
//	var thisFileName="nasLibInstall.jsx";//���ʗp���ȃt�@�C����
//	$.fileName �I�u�W�F�N�g���Ȃ��ꍇ�̓C���X�g�[���p�X�����߂�������
	var nasFolderPath = Folder.userData.fullName + "/"+ localize("$$$/nas=nas/");
}
//	alert(nasFolderPath)
var thisFileName="nasPsAxeInstall.jsx";//���ʗp���ȃt�@�C����
var thisDataFileName="nas_PsAxe_install.dat";//�f�[�^�t�@�C�������ʗp ���f�B���N�g���̂�
var thisPackageSign="//(nas_PsAxe_installer_data03)";//�f�[�^�̑��s�ڂ����ׂāB���ꂪ��v���Ȃ��Ɠ���I��
//	nas���C�u������O��Ƃ��Ȃ��A�P�Ƃœ��삷��X�N���v�g�ł���B


try{
//app �I�u�W�F�N�g�������AdobeScript���Ɣ��f����B�G���[���ł�΁A���Ԃ�HTML�u���E�U���Ă��Ƃ�
if(app){;};}catch(ERR){	abortProcess("Adobe������N�����Ă��������B");}

var nas_Installer=new Object();//

	nas_Installer.myInstall=new Object();//�C���X�g�[���菇�{�̊i�[�I�u�W�F�N�g
	nas_Installer.debug=false;
	nas_Installer.job="install";//"install" or "uninstall"
	nas_Installer.isShutdown=false;//shutdown Flag
	nas_Installer.installLog=new Array();//actionLog
		nas_Installer.pushLog=function(myString){this.installLog.push(myString);};
		//	���O�v�b�V���c���ƂŃ��O�̍\���ς��邩���c
		nas_Installer.pushLog("startup Install:"+new Date().toString());

	nas_Installer.replacePath=new Object();//���v���[�X�p�p�X�̃g���[��

//�ȈՎ���
var isWindows=($.os.match(/windows/i))?true:false;//windows�t���O
nas_Installer.replacePath.startup=app.path+"/"+localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts");
///c/Program%20Files/Adobe/Adobe%20Photoshop%20CS5.1/Presets/Scripts

//�Ȉ�GUI���C�u�����𓋍ڂ���B
var LineFeed=(isWindows)?"\x0d\x0a":"\x0d";//���s�R�[�h�ݒ�

// GUI Setup
//�Ȉ�GUI���C�u����
	var leftMargin=12;
	var rightMargin=24;
	var topMargin=2;
	var bottomMargin=24;
	var leftPadding=8;
	var rightPadding=8;
	var topPadding=2;
	var bottomPadding=2;
	var colUnit=120;
	var lineUnit=24;
	var quartsOffset=(isWindows)? 0:4;
function nasGrid(col,line,width,height){
	left=(col*colUnit)+leftMargin+leftPadding;
	top=(line*lineUnit)+topMargin+topPadding;
	right=left+width-rightPadding;
	bottom=(height <= lineUnit)?top+height-bottomPadding-quartsOffset:top+height-bottomPadding;
		return [left,top,right,bottom];
}
//�A�v���P�[�V�����ʃV���b�g�_�E�����\�b�h
applicationShutdown =function(){
	switch(app.name){
case	"Adobe AfterEffects":app.quit();
break;
case	"Adobe Photoshop":executeAction( charIDToTypeID("quit"), undefined, DialogModes.NO );
break;
default:
	alert("�A�v���P�[�V�������I�����Ă�������");
	}
}
//�C���X�g���[�̈ʒu���w��

var checkNG=true;
if(arguments[0]){
	installerFile =new File(File(arguments[0]).path+"/"+thisFileName);
	Folder.current=installerFile.parent;
}else{

if($.fileName){
var installerFile=new File($.fileName);
Folder.current=installerFile.parent;
//	alert(installerFile.name +" ; "+thisFileName)
//�J�����g�ɃC���X�g�[����ݒ肵�Ă��邩�ǂ����m�F
}else{
var installerFile=new File("./"+thisFileName);//�J�����g�ɃC���X�g�[����ݒ肵�Ă��邩�ǂ����m�F
}
}
	if(nas_Installer.debug){alert(installerFile.fsName);}
//alert(installerFile.fsName+":"+Folder.current.fsName);

while(checkNG){
	if((! installerFile.exists)||(installerFile.name!=thisFileName)){
		alert(installerFile.fsName);
		installerFile=File.openDialog("���ݎ��s���Ă���C���X�g�[���[���w�肵�Ă��������B",Folder.current);
	}
	if((installerFile)&&(installerFile.name==thisFileName)){
//���K�w�̃C���X�g�[���ݒ���m�F
		var checkFolder=installerFile.parent;
		var checkFiles=checkFolder.getFiles();
		for(var idx=0;idx<checkFiles.length;idx++){
			if(checkFiles[idx].name==thisDataFileName){
	myCheckFile=new File(checkFiles[idx].fsName);
	myCheckFile.open("r");
	var magickNumber=myCheckFile.readln(1);
	myCheckFile.close();
				if(magickNumber==thisPackageSign){
		checkNG=false;
		Folder.current=checkFolder;

		nas_Installer.replacePath.source=Folder.current.path+"/"+Folder.current.name;

		break;
		
				}
			};
		};
	}
}


/*
Photoshop	�p�X�̎擾/���C�u�����̐ݒ�B
���C�u���������[�h����̂�
"//@include"�������������A���̏ꍇ�́A�C���X�g�[������X�N���v�g���̂����ς���K�v������B
�ʂ̃��[�h���g�p���������ǂ������B


���@�͊�{�I�ɂӂ���

include�ɑ�������@�\�����O�ŏ����B
�Q�Ɨp�̕ϐ���A���̂����肪�[�����Ă���΁A�L�p���傫��
���ꂪ�Ȃ��ƌ��ǃI�[�o�[�w�b�h���ł����Ȃ�̂Ń_���ۂ��B
�v����

include�����܂ޕ������C���X�g�[�����ɐ������ăX�N���v�g�`���ɖ��ߍ��ށB
�����ς������ăC���X�g�[�������ǁA�I�[�o�[�w�b�h�͏�����
�\�[�X����include�[�����߂̂��镔���́A�p�X�̒u���������Ȃ��B
%STARUP%	Folder.startup.path+name�ƒu�� �X�N���v�g�t�H���_(Preset/Scripts/ or �v���Z�b�g/�X�N���v�g)�ɐݒ�
/c/Program%20Files/Adobe/Adobe%20Photoshop%20CS5.1/Presets/Scripts/nas		nas�t�H���_�̃p�X�ƒu��
~/AppData/Roaming/nas	���[�U�w��̃C���X�g�[����̃p�X�ƒu��
/f/psScripts/PsAXE	���[�U�w��̃C���X�g�[�����̃p�X�ƒu��
~/AppData/Roaming/nas		�ݒ�t�@�C�����̃��[�U�p�X�ƒu��

 */

/*
	�C���X�g�[�����Ŏg�p����֐�-�C���X�g�[���N���X�̃��\�b�h
 */
//���b�Z�[�W�o��
nas_Installer.showMsg	=function(msg){alert(msg);};
//�v���Z�X���f���b�Z�[�W
nas_Installer.abortProcess	=function(msg){
	alert("����[! �Ȃ񂩑z��O�̂��Ƃ��N������\n=================\n"+msg+"\n======================\n��̃��b�Z�[�W���˂��܂���܂ł��m�点��������ƁA�Ȃ�Ƃ��Ȃ邩���m��܂���B\n�_���Ȃ炠����߂ă`��");
	this.pushLog("�z��O�G���[ :"+msg);

return false;
}
//�p�X�̒u��
nas_Installer.pathReplace=function(myString)
{
		myString = myString.replace(/\%STARTUP\%/g,this.replacePath.startup);
		myString = myString.replace(/\%NAS\%/g,this.replacePath.nas);
		myString = myString.replace(/\%INSTALL\%/g,this.replacePath.install);
		myString = myString.replace(/\%SOURCE\%/g,this.replacePath.source);
		myString = myString.replace(/\%USER\%/g,this.replacePath.user);
return myString;
}
//�u�����t�@�C������
nas_Installer.copyScriptWithReplace= function(readfile,writefile)
{
	if (readfile.exists && readfile.name.match(/\.jsx?$/i)){
		var myOpenfile = new File(readfile.fsName);
		myOpenfile.open("r");
		myContent = myOpenfile.read();
//alert(myContent);
		if (writefile && writefile.name.match(/\.jsx?$/i)){
			var myWritefile = new File(writefile.fsName);
			myWritefile.open("w");
			myWritefile.write(this.pathReplace(myContent));
			myWritefile.close();
		}else{	return false
		}
this.pushLog("copy scriptfile with repalacement ok:" +readfile.fsName +" > "+writefile.fsName);
		return true;
	}else {
this.pushLog("copy scriptfile with repalacement miss:" +readfile.fsName +" > "+writefile.fsName);
		return false;
	};
}

nas_Installer.doInstall=function(actionFlag)
{
	if(actionFlag=="uninstall"){
		this.myInstall=this.myUnInstall;
		this.installLog.push("change mode Uninstall.")
	}
//�C���f�b�N�X���ɃC���X�g�[�������s ���܂͕�������[�v���Ȃ�����ˁB(2008/02/05)
//����ȓ��삪�~�������function�ɒ��ڏ����ȃ�

	for(var idx=0;idx<this.myInstall.length;idx++){

		var myAction="NOP";
if(this.myInstall[idx][0] instanceof Function)
{
	myAction="doFunction"
}else{
	switch(this.myInstall[idx][0])
	{
case	"mkdir":	myAction="makeFolder";
break;
case	"rmdir":	myAction="removeFolder";
break;
case	"cd":	myAction="changeDir";
break;
case	"confirm":	myAction="confirm";
break;
case	"shutdown":	myAction="shutdown";
break;
case	"cp":	myAction="copyFile";
break;
case	"mv":	myAction="renameFile";
break;
case	"rm":	myAction="deleteFile";
break;
case	"clearAll":	myAction="clearSelfFiles";
break;
default	:
		if(this.myInstall[idx].length=2){ myAction="copyFile";};
	}
}
		switch(myAction){
case	"confirm":	if(! confirm(this.pathReplace(this.myInstall[idx][1]))){return false;};
break;
case	"shutdown":	nas_Installer.isShutdown=true;return false;
break;
case	"makeFolder":
		var targetDir=new Folder(this.pathReplace(this.myInstall[idx][1]));
		if(! targetDir.exists){
			if(this.debug){
				alert(targetDir.fsName+" ��������C��");
			}else{
				try{targetDir.create();}catch(err){this.abortProcess(myAction+":\n"+err);return false;};
			}
			this.pushLog(myAction+" : "+targetDir.fsName);
		}else{
			this.showMsg("�t�H���_ "+targetDir.fsName+" �����łɂ�����ۂ��̂Ńp�X");
			this.pushLog(myAction+" : "+targetDir.fsName +"allready exists");
		}
break;
case	"removeFolder":
		var targetDir=new Folder(this.pathReplace(this.myInstall[idx][1]));
		if(targetDir.exists){
			if(this.debug){
				if(targetDir.getFiles().length!=0){
					this.showMsg("�t�H���_����łȂ����� "+targetDir.fsName+" ���폜�����C��");
				}else{
					this.showMsg(targetDir.fsName+" ���폜�����C��");
				}
			}else{
//�t�H���_�R���e���c�m�F
				if(targetDir.getFiles().length!=0)
				{
//					this.abortProcess(myAction+":\n�t�H���_����łȂ��l");return false;
					this.showMsg(myAction+":\n�t�H���_����łȂ��̂ō폜�p�X��");
				this.pushLog("skip "+myAction+" : "+targetDir.fsName);

				}else{
					try{targetDir.remove();}catch(err){this.abortProcess(myAction+":\n"+err);return false;};
				}
			}
			this.pushLog(myAction+" : "+targetDir.fsName);
		}else{
			this.showMsg("�t�H���_ "+targetDir.fsName+" �͖����l");
			this.pushLog(myAction+" : "+targetDir.fsName +"cannot remove");
		}
break;
case	"changeDir":
		if(! this.myInstall[idx][1]){
			Folder.current=new Folder(this.replacePath.source);//�\�[�X�t�H���_�ɖ߂�
		}else{
			Folder.current=new Folder(this.myInstall[idx][1]);
		};
		this.pushLog(myAction+" : "+Folder.current.fsName);
break;
case	"copyFile":
		if(this.myInstall[idx][0]=="cp"){
			var destFile	=new File(this.pathReplace(this.myInstall[idx][1]));
			var targetFile	=new File(this.pathReplace(this.myInstall[idx][2]));
		}else{
			var destFile	=new File(this.pathReplace(this.myInstall[idx][0]));
			var targetFile	=new File(this.pathReplace(this.myInstall[idx][1]));
		}
		if((destFile.exists)&&(! targetFile.exists)){
if(destFile.name.match(/\.jsx?$/)){
			this.pushLog(myAction);
			this.pushLog("file copy with WordReplace :");
//include �u���R�s�[
			if(this.debug){
				alert(destFile.fsName+" �� "+targetFile.fsName+" �ɒu���R�s�[�����C��");
			}else{
				try{
					if(! this.copyScriptWithReplace(destFile,targetFile)){this.abortProcess(myAction+":\n"+err);return false;};
				
					}catch(err){this.abortProcess(myAction+":\n"+err);return false;}
			}
}else{
//�P���t�@�C���R�s�[
			if(this.debug){
				alert(destFile.fsName+" �� "+targetFile.fsName+" �ɃR�s�[�����C��");
			}else{
				try{	destFile.copy(targetFile)}catch(err){this.abortProcess(myAction+":\n"+err);return false;};
			}
			this.pushLog("file copy :"+destFile.fsName+" > "+targetFile.fsName);
}
		}else{this.showMsg("�t�@�C��\n"+destFile.fsName+" : "+targetFile.fsName+"\n���m�F���܂��傤�B");}
break;
case	"renameFile":
		var destFile	=new File(this.pathReplace(this.myInstall[idx][1]));
		var targetFile	=new File(this.pathReplace(this.myInstall[idx][2]));

		if((destFile.exists)&&(! targetFile.exists)){
//�t�@�C�����R�s�[���Č��t�@�C��������
			if(this.debug){
				alert(destFile.fsName+" �� "+targetFile.fsName+" �Ɉړ������C��");
			}else{
				//Adobe�X�N���v�g��move���\�b�h�͖����̂ŁAcopy + remove �ɂ���B
				try{	if(destFile.copy(targetFile)){destFile.remove();};
				}catch(err){this.abortProcess(myAction+":\n"+err);return false;};
			}
			this.pushLog(myAction+" :"+destFile.fsName+" > "+targetFile.fsName);
		}else{
			this.showMsg("�t�@�C��\n"+destFile.fsName+" : "+targetFile.fsName+"\n���m�F���܂��傤�B");
			this.pushLog(myAction+" : (error) "+destFile.fsName+" > "+targetFile.fsName);
		}
break;
case	"deleteFile":
		var targetFile	=new File(this.pathReplace(this.myInstall[idx][1]));

		if(targetFile.exists){
			if(this.debug){
				alert(targetFile.fsName+" ���폜�����C��");
			}else{
				try{
					targetFile.remove();				
				}catch(err){this.abortProcess(myAction+":\n"+err);return false;}
			}
			this.pushLog(myAction+" : "+targetFile.fsName);
		}else{
			//alert(targetFile.fsName+" �͖����l");
			this.pushLog(myAction+" : "+targetFile.fsName +"is not exists.");
		}
break;
case	"doFunction":
		try{
			var myResult=(this.myInstall[idx][0](this.myInstall[idx][1]));
			if(! myResult){return false;}
			this.pushLog("do userFunction");
		}catch(err){this.abortProcess(myAction+":\n"+err);return false;};
break;
default:
		this.abortProcess(myAction+":\n"+this.myInstall[idx].toString());return false;

		}
	}
//�A���C���X�g�[���ƃC���X�g�[���́A���s����R�}���h�z�񂪈قȂ邾���œ����֐��ŏ��������
return true;
}

//==================�����Őݒ�t�@�C����ǂݍ���Ŏ��s
//	alert(decodeURI(Folder.current.name));
myOpenFile=new File(thisDataFileName);
	myOpenFile.open("r");
	var setting=myOpenFile.read();
	myOpenFile.close();
if(setting){
	eval(setting);
//	�A�v���P�[�V�����̌�������擾locale��{����_���[
/*
app.locale PhotoshopCS2�ȍ~
app.language AfterEffect6.5�ȍ~(6.0�������邩��?)
PhotoshopCS 7 �̌�����擾���@�����̂Ƃ���s��
JP�̊m�F�����Ȃ�Folder.startup�̓��e�������͂��邯�ǂ���Ȃ��񏑂������Ȃ��B
�ЂƂ܂��������Đi�߂邱�Ƃ�
*/

//================================================================(syetemCheck)
if(!(app.name.match(nas_Installer.myAppRegExp)) || !(app.version.match(nas_Installer.myVersionRegExp)))
{
	var stopInstall=true;
}else{
	var stopInstall=false;
};
//====================================================================(install)

	if(stopInstall){
//���f�\��
	var msg="\n=====================\n���̊��ł̓C���X�g�[���ł��Ȃ��悤�ł��B\n�A�v���P�[�V������o�[�W�������m�F���Ă���ēx���s���Ă݂Ă��������B"

	alert(app.name+" / "+app.version+msg);
	}else{

//�C���X�g�[����̑��݂��m�F���ăC���X�g�[���ςȂ�΁A�A���C���X�g�[�����[�h�ɂ���B
myInstallLocation=new Folder(nas_Installer.replacePath.install);
myInstallDataFile=new File(nas_Installer.replacePath.install+"/"+thisDataFileName);
//	�C���X�g�[���p�X�ƃ\�[�X�p�X����v���Ă�����A���C���X�g�[��
	if(nas_Installer.replacePath.install==nas_Installer.replacePath.source){nas_Installer.job="uninstall";}
//�C���X�g�[����ɃC���X�g�[���f�[�^���c���Ă�����A���C���X�g�[��(�o�[�W�����`�F�b�N�͂܂�2011.05.11)
	if((myInstallLocation.exists)&&(myInstallDataFile.exists)){nas_Installer.job="uninstall";}


//���ۂ̃C���X�g�[������
switch(nas_Installer.job){
case	"uninstall":
	myResult=nas_Installer.doInstall("uninstall");break;
case	"install":
default	:
	myResult=nas_Installer.doInstall("install");break;
}
	if(! myResult){nas_Installer.pushLog("aborted");}
	}
}else{
	nas_Installer.abortProcess("�C���X�g�[���ݒ肪�Ȃ����ۂ��c");
};
if(nas_Installer.isShutdown){nas_Installer.pushLog("user select shutdown Application")}

	nas_Installer.pushLog("log close :"+new Date().toString());
	if(myInstallLocation.exists){
//		�C���X�g�[���I�����́A�t�H���_����
		var myLogFile=new File(nas_Installer.replacePath.install+"/install.log");
	}else{
//		�A���C���X�g�[���̍ۂ̓t�H���_���Ȃ������m��Ȃ��̂Ń\�[�X�p�X�ɕۑ�
		var myLogFile=new File(nas_Installer.replacePath.source+"/install.log");
	}
		if(new Folder(myLogFile.path).exists){
			myLogFile.open("w");
			for (var idx=0;idx<nas_Installer.installLog.length;idx++){
				myLogFile.writeln(nas_Installer.installLog[idx].toString());
			}
			myLogFile.close();
		}
//���O�t�@�C�����C���X�g�[�����(�㏑����?)�c���ďI��
//�V���b�g�_�E���t���O������΃V���b�g�_�E�����ďI��
	if(nas_Installer.isShutdown){
			applicationShutdown();
	};


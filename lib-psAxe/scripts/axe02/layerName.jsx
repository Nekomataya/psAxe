/*
		Photoshop�@���C�����ύX�p�l��
	�A�N�e�B�u���C���̃��C������ύX�����
*/
	var exFlag=true;
//���������h�L�������g���Ȃ���ΏI��
	if(app.documents.length==0){
		exFlag=false;
	}else{
//�N�����Ƀ��C���R���N�V�����̏�Ԃ��m�F�@�t���b�v�A�C�e������0�ȉ��Ȃ�I��
		if(activeDocument.activeLayer.parent.layers.length<1){exFlag=false;};
	}
	if(exFlag){
//iclude nas���C�u�����ɕK�v�Ȋ�b�I�u�W�F�N�g���쐬����
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
//	���C�u�����̃��[�h�@CS2-4�p CS5�̓`�F�b�N���Ă��Ȃ������Ԃ���s�\
//==================== ���C�u������o�^���Ď��O�ɓǂݍ���
/*
	includeLibs�z��ɓo�^���ꂽ�t�@�C���������ǂݍ��ށB
	�o�^�̓p�X�ōs���B(File�I�u�W�F�N�g�ł͂Ȃ�)
	$.evalFile ���\�b�h�����݂���ꍇ�͂�����g�p���邪CS2�ȑO�̊��ł�global �� eval�֐��œǂݍ���
*/
//var nasLibFolderPath = Folder.userData.fullName + "/"+ localize("$$$/BenderSig/App/ScriptingSupport/InstalledScripts=Adobe/Adobe Photoshop CS4/Presets/Scripts") + "/"
//var nasLibFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/nas/lib/";

if($.fileName){
//	CS3�ȍ~�́@$.fileName�I�u�W�F�N�g������̂Ń��[�V�����t���[�ɂł���
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName �I�u�W�F�N�g���Ȃ��ꍇ�̓C���X�g�[���p�X�����߂�������
	var nasLibFolderPath = Folder.userData.fullName + "/nas/lib/";
}
var includeLibs=[
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",

	nasLibFolderPath+"xpsio.js",
	nasLibFolderPath+"mapio.js",
	nasLibFolderPath+"lib_STS.js",
	nasLibFolderPath+"dataio.js",
	nasLibFolderPath+"fakeAE.js",
	nasLibFolderPath+"io.js",
	nasLibFolderPath+"xpsQueue.js",
	nasLibFolderPath+"nas.XpsStore.js"
];
for(prop in includeLibs){
	var myScriptFileName=includeLibs[prop];
	if($.evalFile){
	//$.evalFile �t�@���N�V����������Ύ��s����
//		alert("loading with $.evalFile: "+myScriptFileName)
		$.evalFile(myScriptFileName);
	}else{
	//$.evalFile �����݂��Ȃ��o�[�W�����ł�eval�Ƀt�@�C����n��
//		var prevCurrentFolder = Folder.current;
		var scriptFile = new File(myScriptFileName);
//		Folder.current = scriptFile.path ;
		if(scriptFile.exists){
//			alert("eval :"+scriptFile.name)
			scriptFile.open();
			var myContent=scriptFile.read()
			scriptFile.close();
			eval(myContent);
		}
	}
}

//������
var currentLayer=app.activeDocument.activeLayer;
//	GUI������
w=nas.GUI.newWindow("dialog","���C���v���p�e�B",5,5);
w.countBuf=1;
w.onOpen=true;

w.nameView=nas.GUI.addButton(w,currentLayer.name,1,0,4,1);
w.bt0=nas.GUI.addButton(w,"[ / ]",0,1,1,1);
w.bt1=nas.GUI.addButton(w,"[++]",0,2,1,1);
w.bt2=nas.GUI.addButton(w,"[--]",1,2,1,1);
w.bt3=nas.GUI.addButton(w,"[�}##]",2,2,1,1);
w.namePad=nas.GUI.addEditText(w,currentLayer.name,1,1,4,1);

w.btL0=nas.GUI.addSelectButton(w,["frame","BG","BOOK","LO","A","B","C","D","E","F","G","H","I","J","K","L"],3,0,3,1.5,1);
w.btL1=nas.GUI.addButton(w,"��",1.5,3,1,1);
//w.btL2=nas.GUI.addButton(w,">>",2  ,3,0.7,1);


//w.bt3=nas.GUI.addButton(w,"��goFWD��",2.5,2,2.5,1);
//w.bt4=nas.GUI.addButton(w,"��goBWD��",2.5,3,2.5,1);
w.bt6=nas.GUI.addButton(w,"auto-number",2.5,3,2.5,1);
w.bt7=nas.GUI.addButton(w,"cancel",0,4,2.5,1);
w.bt5=nas.GUI.addButton(w,"OK",2.5,4,2.5,1);


w.nameView.onClick=function(){this.parent.namePad.text=this.text;}

w.bt0.onClick=function(){this.parent.namePad.text+="/";}

w.bt1.onClick=function(){
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		myNameSet[myNameSet.length-1]=nas.incrStr(myNameSet[myNameSet.length-1]);
		this.parent.namePad.text=myNameSet.join("/");
	}
};
w.bt2.onClick=function(){
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		myNameSet[myNameSet.length-1]=nas.incrStr(myNameSet[myNameSet.length-1],-1);
		this.parent.namePad.text=myNameSet.join("/");
	}
};
w.bt3.onClick=function(){
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		if(myNameSet[myNameSet.length-1].match(/(.*[^0-9\s])\s?([0-9]+)$/)){myNameSet[myNameSet.length-1]=RegExp.$1;this.countBuf=RegExp.$2 *1;}else{myNameSet[myNameSet.length-1]+=this.countBuf;};
		this.parent.namePad.text=myNameSet.join("/");
	}
};
w.btL1.onClick=function(){
	var myLabel=this.parent.btL0.value;
	if(this.parent.namePad.text!=""){
		var myNameSet=this.parent.namePad.text.split("/");
		myNameSet[myNameSet.length-1]=myNameSet[myNameSet.length-1].replace(/^([^0-9]*)/,myLabel);
		this.parent.namePad.text=myNameSet.join("/");
	}else{
		this.parent.namePad.text=myLabel
	}
}
w.btL0.onChange=w.btL1.onClick;
//w.btL2.onClick=function(){myShift(-1);}


//w.namePad.onChange=function(){myEasyFlip.flip("FWD");w.onOpen=false;this.active=true;};
//w.bt3.onClick=function(){myEasyFlip.flip("FWD");w.onOpen=false;this.parent.namePad.active=true;};
//w.bt4.onClick=function(){myEasyFlip.flip("BWD");w.onOpen=false;this.parent.namePad.active=true;};
w.bt7.onClick=function(){
	this.parent.onOpen=false;
	this.parent.close();
};
w.bt5.onClick=function(){
//	myEasyFlip.viewRestore();
	if((this.parent.namePad.text != currentLayer.name)&&(this.parent.namePad.text.length>0)){currentLayer.name=this.parent.namePad.text};
	this.parent.onOpen=false;
	this.parent.close();
};

w.bt6.onClick=function(){
//�@�Ώۃg���[���̃��x���������X�V
	var myLabel=currentLayer.parent.name;
	var startNumber=1;
	var currentName=[myLabel,nas.Zf(startNumber,3)].join("-");
	var lyCount=currentLayer.parent.layers.length;
	for(var idx=lyCount-1;idx>=0;idx--){
		currentLayer.parent.layers[idx].name=currentName;
		currentName=nas.incrStr(currentName);
	}
}
//============================================================== 
w.show();

//w.watch("onOpen",function(){alert(w.onOpen);w.unwatch("onOpen");});

//whle(true){}
	}else{alert("�Ȃ񂾂����C���������݂���");}
/*
    exportLayersAsFile.jsx
    
    ���C����Ԃ��ʂ̃t�@�C���Ƃ��ĕۑ�����B
    �I�v�V�����ŃO���[�v�t�H���_�̍쐬���s��
    
�菇�Ƃ��ẮA
	MAP�r���h���s��
	�l�[���X�y�[�X���R���N�V�����ō쐬����
	�V�X�e���t�H���_�ȉ��̃O���[�v�f�[�^�������\������XPS�𐶐�����B
	�r���h����
	�t���[�������C���ɓ�������
	���C����1�_�Ât�@�C���ɂƂ��ĕۑ�����B
	�I���W�i���h�L�������g��ۑ������ɕ���
�Ƃ����̂��]�܂����A�v���[�`�����ǁA����͂��Ȃ�
�R�[�f�B���O�Ɏ��Ԃ��������Ɂ@���쑬�x���x���̂��ۏ�t
�}�b�v�r���h�̏ȗ��v���Z�X�ł��̂܂܏����o����������B
-----------
���C��������t�@�C�������쐬����Ƃ��Ƀt�@�C���V�X�e���ŋ֎~����Ă��镶�����g���b�v����
�A�j���r���h�ȊO�̍ŏI����́A�t�@�C���̕������Ƃ��ď����o�����s���d�l�ɕύX
20111203

�I�v�V�����Ƃ��ďo�͑O�ɃR�}���h���s���\�ɂ���B
�X���[�W���O���ɕK�v�ȃR�}���h��optCode�ɒu���i�A�N�V�������s�@���̓t�B���^���s�R�[�h�Ȃǁj
�s�v�ȏꍇ�́@false ��u���Ƃ��Ă�������
�R�[�h�͕ۑ��̒��O�Ɏ��s����܂��B
20120416

CS6�ŃA�j���[�V����������������Ă��Ȃ���Ԃ����������̂ł��̑Ή��i�G���[��~�̉���j�R�[�h���Z��I�ɒǉ�
20120617
*/
var optCode=false;
/*
var optCode="";
// ======================================================= OLM Smoother
optCode+="var idFltr = charIDToTypeID( \"Fltr\" );";
optCode+="var desc4 = new ActionDescriptor();";
optCode+="var idUsng = charIDToTypeID( \"Usng\" );";
optCode+="desc4.putString( idUsng, \"OLM Smoother...\" );";
optCode+="executeAction( idFltr, desc4 );";

// ========================================�A�N�V�������s
var aSetName="animationTools";
var actionName="Smoother";

optCode+="var idPly = charIDToTypeID( \"Ply \" );";
optCode+="    var descAct = new ActionDescriptor();";
optCode+="    var idnull = charIDToTypeID( \"null\" );";
optCode+="        var refAct = new ActionReference();";
optCode+="        var idActn = charIDToTypeID( \"Actn\" );";
optCode+="        refAct.putName( idActn, actionName );";
optCode+="       var idASet = charIDToTypeID( \"ASet\" );";
optCode+="        refAct.putName( idASet, aSetName );";
optCode+="    descAct.putReference( idnull, refAct );";
optCode+="executeAction( idPly, descAct, DialogModes.NO );";
*/
// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
	app.bringToFront();
//Photoshop�p���C�u�����ǂݍ���

if($.fileName){
//	CS3�ȍ~�́@$.fileName�I�u�W�F�N�g������̂Ń��P�[�V�����t���[�ɂł���
	var nasLibFolderPath = new File($.fileName).parent.parent.path +"/lib/";
}else{
//	$.fileName �I�u�W�F�N�g���Ȃ��ꍇ�̓C���X�g�[���p�X�����߂�������
	var nasLibFolderPath = Folder.userData.fullName + "/"+ localize("$$$/nas/lib=nas/lib/");
}
var includeLibs=[nasLibFolderPath+"config.js"];//�ǂݍ��݃��C�u�������i�[����z��

if(! app.nas){
//iclude nas���C�u�����ɕK�v�Ȋ�b�I�u�W�F�N�g���쐬����
	var nas = new Object();
		nas.Version=new Object();
		nas.isAdobe=true;
		nas.axe=new Object();
		nas.baseLocation=new Folder(Folder.userData.fullName+ "/nas");
//	���C�u�����̃��[�h�@CS2-5�p
//==================== ���C�u������o�^���Ď��O�ɓǂݍ���
/*
	includeLibs�z��ɓo�^���ꂽ�t�@�C���������ǂݍ��ށB
	�o�^�̓p�X�ōs���B(File�I�u�W�F�N�g�ł͂Ȃ�)
	$.evalFile ���\�b�h�����݂���ꍇ�͂�����g�p���邪CS2�ȑO�̊��ł�global �� eval�֐��œǂݍ���

�������@���C�u�������X�g�i�ȉ��͓ǂݍ��ݏ��ʂɈ��̈ˑ���������̂Œ��Ӂj
�@config.js"		��ʐݒ�t�@�C���i�f�t�H���g�l�����j���̃��[�`���O�ł͎Q�ƕs�\
  nas_common.js		AE�EHTML���p��ʃA�j�����C�u����
  nas_GUIlib.js		Adobe�����pGUI���C�u����
  nas_psAxeLib.js	PS�p�����C�u����
  nas_prefarenceLib.js	Adobe�����p�f�[�^�ۑ����C�u����

  nasXpsStore.js	PS�ق�Adobe�ėpXpsStore���C�u����(AE�p�͓���)
  xpsio.js		�ėpXps���C�u����
  mapio.js		�ėpMap���C�u����
  lib_STS.js		Adobe�����pSTS���C�u����
  dataio.js		Xps�I�u�W�F�N�g���o�̓��C�u�����i�R���o�[�^���j
  fakeAE.js		���Ԋ����C�u����
  io.js			��܂҂���o�̓��C�u����
  psAnimationFrameClass.js	PS�p�t���[���A�j���[�V�������색�C�u����
  xpsQueue.js		PS�pXps-FrameAnimation�A�g���C�u����
*/
includeLibs=[
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",
	nasLibFolderPath+"nas_psAxeLib.js",
	nasLibFolderPath+"nas_prefarenceLib.js"
];
//=====================================�@Application Object�ɎQ�Ƃ�����
	app.nas=nas;
	bootFlag=true;
}else{
	//alert("object nas exists")
	nas=app.nas;
	bootFlag=false;
};

/*	���C�u�����ǂݍ���
�����ŕK�v�ȃ��C�u���������X�g�ɉ����Ă���ǂݍ��݂��s��
*/
includeLibs.push(nasLibFolderPath+"fakeAE.js");
includeLibs.push(nasLibFolderPath+"nas.XpsStore.js");
includeLibs.push(nasLibFolderPath+"xpsio.js");
includeLibs.push(nasLibFolderPath+"mapio.js");
includeLibs.push(nasLibFolderPath+"lib_STS.js");
includeLibs.push(nasLibFolderPath+"dataio.js");
includeLibs.push(nasLibFolderPath+"io.js");
includeLibs.push(nasLibFolderPath+"psAnimationFrameClass.js");
includeLibs.push(nasLibFolderPath+"xpsQueue.js");
	if(false){
	}
for(prop in includeLibs){
	var myScriptFileName=includeLibs[prop];
	if($.evalFile){
	//$.evalFile �t�@���N�V����������Ύ��s����
		$.evalFile(myScriptFileName);
	}else{
	//$.evalFile �����݂��Ȃ��o�[�W�����ł�eval�Ƀt�@�C����n��
		var scriptFile = new File(myScriptFileName);
		if(scriptFile.exists){
			scriptFile.open();
			var myContent=scriptFile.read()
			scriptFile.close();
			eval(myContent);
		}
	}
}
//=====================================�ۑ����Ă���J�X�^�}�C�Y�����擾
if(bootFlag){nas.readPrefarence();nas.workTitles.select();}
//=====================================
//+++++++++++++++++++++++++++++++++�����܂ŋ��p
var noSave=false;
//-----------------------����J�n���ɖ��ۑ��̏ꍇ�x��
if((app.documents.length)&&(! app.activeDocument.saved)){
    noSave=true;
    noSave=confirm("�h�L�������g�͕ۑ�����Ă��܂���B�ۑ����܂����H");
//��x���ۑ�����Ă��Ȃ��t�@�C���ɖ��O�����ĕۑ����郋�[�`�����K�v
//�܂��͖����I�ɕۑ����ꂽ�t�@�C���݂̂������悤�Ƀg���b�v����
    if(noSave){app.activeDocument.save();noSave=false;}
}
//-----------------------�ۑ����Ȃ��Ă�����͑��s
if((! noSave)&&(app.documents.length)&&(app.activeDocument.layers.length)){
var exportFiles=new Object;
 exportFiles.targetDoc=app.activeDocument;
try{
 exportFiles.currentTargetFolder=app.activeDocument.fullName.parent;
    }catch(eRR){
 exportFiles.currentTargetFolder=Folder.current;
    }
//����p�̈ꎞ�h�L�������g������Ă���
 exportFiles.tempDoc=app.activeDocument.duplicate("__exportTempDoc__");//�����ŃA�N�e�B�u�h�L�������g���؂�ւ��
 if(nas.axeAFC.checkAnimationMode()!="frameAnimation"){
	executeAction( stringIDToTypeID( "makeFrameAnimation" ), undefined, DialogModes.NO );
 };
 exportFiles.mkFolder=true;
 exportFiles.withRegister=true;
 exportFiles.byAFC=false;
 exportFiles.opForms=[".png",".psd",".tiff",".tga",".jpg"];
 exportFiles.opForm=0;
 exportFiles.guideLayers=[];
 exportFiles.guideLayersA=[];
 exportFiles.outputList=[];
 exportFiles.outputListA=[];
 exportFiles.outputListView=[];

exportFiles.isMenber=function(myObject){
    //�������肵�ă����o�����𔻒�
	if(( myObject.typename=="ArtLayer")&&
	    ((myObject.kind==LayerKind.NORMAL)||(myObject.kind==LayerKind.SMARTOBJECT))
    ){return true};
    return false;
}
exportFiles.refresh=function(){
//���Z�b�g���̍Ď擾���܂ނ̂Ŕz���������
	 this.guideLayers.length=0;this.outputList.length=0;
 for (var ix=0;ix<this.tempDoc.layers.length;ix++){
	if(this.tempDoc.layers[ix].name.match(/(frames?|peg|memo|system)/i)){
	 this.guideLayers.push(this.tempDoc.layers[ix]);
	 this.guideLayersA.push(this.targetDoc.layers[ix]);
	 continue;
	};//�t���[�����C���E���C���Z�b�g���X�L�b�v
//================ArtLayer�@�Ńm�[�}���ƃX�}�[�g�I�u�W�F�N�g��I��
	if(this.isMenber(this.tempDoc.layers[ix])){this.outputList.push(this.tempDoc.layers[ix]);this.outputListA.push(this.targetDoc.layers[ix]);continue;}
//=================���C���Z�b�g�ł��A�z���Ƀ��C�����܂�ł���ꍇ�i�P�i�̂݌@���� ���C���Z�b�g�������o�[�ɂ���j
	if((true)&&(this.tempDoc.layers[ix] instanceof LayerSet)&&(this.tempDoc.layers[ix].layers.length)){
		for (var lx=0;lx<this.tempDoc.layers[ix].layers.length;lx++){
            this.outputList.push(this.tempDoc.layers[ix].layers[lx]);
            this.outputListA.push(this.targetDoc.layers[ix].layers[lx]);
            continue;
		}
	}
 };//�����o���W�I��
//���X�g�ɓo�^
//	this.w.fileList.items
}
exportFiles.viewUpdate=function(){
    this.outputListView.length=0;
    if(this.byAFC){
        var myFrameCount=nas.axeAFC.countFrames();
        for(var fct=0;fct<myFrameCount;fct++){
//=============�v���t�B�N�X�́A�^�[�Q�b�g����擾����
            this.outputListView.push(this.targetDoc.name.replace(/\.[^.]*$/,"")+nas.Zf(fct+1,3));
        }
    }else{
      for(fl in this.outputList){
	    if((! this.mkFolder)||(this.outputList[fl].parent instanceof Document)){
		this.outputListView.push(this.outputList[fl].name.replace(/[\\\/\:\?\*\"\>\<\|]/g,"_"));
	    }else{
		this.outputListView.push(("[ "+this.outputList[fl].parent.name +" ] "+this.outputList[fl].name).replace(/[\\\/\:\?\*\"\>\<\|]/g,"_"));
	    }
      }
    }
}
//�C���f�b�N�X�ŗ^����ꂽ���C�����c���đ����\���ɂ���B
//�I�v�V�����Ńt���[�����\��
//�A�j���t���[���r���h�ƃZ�b�g�Ώۂ��قȂ�̂őΉ�
 exportFiles.set=function(index){
	 for(var ix=0;ix<this.guideLayers.length;ix++){
	  this.guideLayers[ix].visible=(this.withRegister==false)?false:true;
	} 
	for(var ix=0;ix<this.outputList.length;ix++){
	 this.outputList[ix].visible=(index==ix)?true:false;
	}
 }
//�A�j���t���[���r���h�p�̃^�[�Q�b�g����
 exportFiles.setA=function(index){
	 for(var ix=0;ix<this.guideLayers.length;ix++){
	  this.guideLayersA[ix].visible=(this.withRegister==false)?false:true;
	} 
	for(var ix=0;ix<this.outputList.length;ix++){
	 this.outputListA[ix].visible=(index==ix)?true:false;
	}
 }

	exportFiles.refresh();
	exportFiles.viewUpdate();

exportFiles.export=function(){
//
//
        var mySaveDocument=null;
        var myTargetFolder=this.currentTargetFolder;
        var mySaveOptions=null;
        switch(this.opForms[this.opForm]){
            case ".tiff":;
                mySaveOptions=new TiffSaveOptions;
            break;
            case ".tga":;
                mySaveOptions=new TargaSaveOptions;
                //mySaveOptions.
            break;
            case ".png":;
                mySaveOptions=new PNGSaveOptions;
		if(! isNaN(mySaveOptions.compression)){mySaveOptions.compression=1;}
            break;
            case ".jpg":;
                mySaveOptions=new JPEGSaveOptions;
            break;
            default:
                mySaveOptions=new PhotoshopSaveOptions;
        }
//=================================== ���ۂ̑��� ======================================//
    var myTempDoc=this.tempDoc;//�Ώۃh�L�������g���^�[�Q�b�g�{�̂ɐݒ�
	app.activeDocument=myTempDoc;
         if(this.byAFC){
//     var myFrameCount=nas.axeAFC.countFrames();
     var myFrameCount=this.outputList.length;
     for(var fidx=0;fidx<myFrameCount;fidx++){
       //�A�j���t���[�����o�� ���݂̃t�@�C��������g���q���̂��������̂��v���t�B�b�N�X�ɂ��Ďw��t�H���_�����ɕۑ�
                 nas.axeAFC.selectFrame(fidx+1);//�\���Z�b�g
                 var storeName=this.targetDoc.name.replace(/\.[^.]*$/,"")+nas.Zf(fidx+1,3)+this.opForms[this.opForm]
                 mySaveDocument=myTempDoc.duplicate (storeName, true)
         if(mySaveDocument){
             app.activeDocument=mySaveDocument;nas.axeAFC.initFrames();//�A�j���t���[����������
             mySaveDocument.layers[0].visible=true;//�\����������̂ŕ��A���Ă���             
             var mySaveFile=new File(myTargetFolder.fullName+"/"+mySaveDocument.name)
         //�\�Ȃ�ۑ�����
         try{
             mySaveDocument.saveAs(mySaveFile,mySaveOptions,true);
             }catch(eRR){alert(eRR)}
             mySaveDocument.close(SaveOptions.DONOTSAVECHANGES);//����
             app.activeDocument =myTempDoc;
       }
   }
         }else{
    for(var fidx=0;fidx<this.outputList.length;fidx++){
       //���C�������ǂ��Ďw��ɏ]���ăK�C�h���C���̂���Ȃ���I�����ďo��
                if(this.mkFolder)
                {
                   var folderName=this.outputList[fidx].parent.name.replace(/[\\\/\:\?\*\"\>\<\|]/g,"_");
                   myTargetFolder=new Folder(this.currentTargetFolder.fullName+"/"+folderName);
                };
                if(! myTargetFolder.exists){myTargetFolder.create();}
                 this.set(fidx);//�\���Z�b�g
                   var fileName=this.outputList[fidx].name.replace(/[\\\/\:\?\*\"\>\<\|]/g,"_");
                mySaveDocument=myTempDoc.duplicate (fileName+this.opForms[this.opForm], true);
         if(mySaveDocument){
/*
	�P�ƃt�@�C���Ƃ��ĕۑ����邽�߂Ƀ��C���������s���B
���̃h�L�������g�ɃA�j���t���[�����������ꍇ�i���Ȃ�̊m���ŗL��j
psd�h�L�������g�ɑ��݂��Ȃ����C�����w���t���[����A�j���T���l�[���̃L���b�V�������̂ŉ����ƕs�s���ł���B
�A�j���t���[�����폜���邽�߂ɏ��������s���B
�P���ȏ������ł͑��t���[���̕\��Ԃ��Đ�����邽�߁A���Y���C������\���̂܂ܕۑ������ꍇ������̂ōĕ\�����s���B
*/
             app.activeDocument=mySaveDocument;nas.axeAFC.initFrames();//�A�j���t���[����������
             mySaveDocument.layers[0].visible=true;//�\����������̂ŕ��A���Ă���
	if(optCode){eval(optCode);};
             var mySaveFile=new File(myTargetFolder.fullName+"/"+mySaveDocument.name);
         //�\�Ȃ�ۑ�����
         try{
             mySaveDocument.saveAs(mySaveFile,mySaveOptions,true);
             }catch(eRR){alert(eRR)}
             mySaveDocument.close(SaveOptions.DONOTSAVECHANGES);//����
             app.activeDocument =myTempDoc;
         }
    }
         }
//             myTempDoc.close(SaveOptions.DONOTSAVECHANGES);//�ꎞ�t�@�C���Ȃ̂ŕۑ������ɕ���
/*
    �e���|�����̂Ƃ���͈�l
    �ҏW��̃f�[�^�\�����ڐA�\�Ȃ�������邱�Ƃɂ��ďh�� 2011/09/28
    */
}
//==============================================UI
exportFiles.w=nas.GUI.newWindow("dialog","���C�����t�@�C���Ƃ��ĕۑ�",6,12);

exportFiles.w.msgBox=nas.GUI.addStaticText(exportFiles.w,"���C�����t�@�C���Ƃ��ĕۑ����܂��B�ۑ�����w�肵�Ă��������B",0,0,6,1);


exportFiles.w.folderTargetName=nas.GUI.addEditText(exportFiles.w,exportFiles.currentTargetFolder.fsName,0,1,5,1);
exportFiles.w.chgFolder=nas.GUI.addButton(exportFiles.w,"�ύX",5,1,1,1);

exportFiles.w.fileList=nas.GUI.addListBoxO(exportFiles.w,exportFiles.outputListView,null,0,2,4,7,{multiselect:true});
//�`�F�b�N�R���g���[��
exportFiles.w.mkSF=nas.GUI.addCheckBox(exportFiles.w,"�T�u�t�H���_�����",0,9,4,1);
	exportFiles.w.mkSF.value=exportFiles.mkFolder;
exportFiles.w.regOpt=nas.GUI.addCheckBox(exportFiles.w,"�^�b�v�ƃt���[����\������",0,10,4,1);
	exportFiles.w.regOpt.value=exportFiles.withRegister;
exportFiles.w.afcOpt=nas.GUI.addCheckBox(exportFiles.w,"�A�j���t���[�����o�͂���",0,11,4,1);
	exportFiles.w.afcOpt.value=exportFiles.byAFC;
//�{�^���R���g���[��
exportFiles.w.ffLb=nas.GUI.addStaticText(exportFiles.w,"file format:",4,2,2,1);
exportFiles.w.ffBt=nas.GUI.addDropDownList(exportFiles.w,exportFiles.opForms,exportFiles.opForm,4,3,2,1);
//exportFiles.w.FlBt=nas.GUI.addButton(exportFiles.w,"addFile",4,3,2,1);
exportFiles.w.rmBt=nas.GUI.addButton(exportFiles.w,"remove",4,4,2,1);
exportFiles.w.rstBt=nas.GUI.addButton(exportFiles.w,"reset",4,5,2,1);


exportFiles.w.bdBt=nas.GUI.addButton(exportFiles.w,"makeAnimation",4,9,2,1);
exportFiles.w.okBt=nas.GUI.addButton(exportFiles.w,"OK",4,10,2,1);
exportFiles.w.cnBt=nas.GUI.addButton(exportFiles.w,"cancel",4,11,2,1);
//==================================�R���g���[�����\�b�h
//�ۑ��t�H���_�ύX
exportFiles.w.chgFolder.onClick=function(){
    var newFolder=exportFiles.currentTargetFolder.selectDlg("select Save folder");
    if(newFolder){
        exportFiles.currentTargetFolder=newFolder;
        this.parent.folderTargetName.text=exportFiles.currentTargetFolder.fsName;
    }
}
//���X�g�ҏW�i�폜�j
exportFiles.w.rmBt.onClick=function(){
    //�I�����ꂽID�̃��C�����폜���ăA�b�v�f�[�g
    if(this.parent.fileList.selection){
var removeItemList=new Array();
for(ecItem in this.parent.fileList.selection){removeItemList.push(this.parent.fileList.selection[ecItem].index);}
removeItemList.sort(function(a,b){return(b-a);});
    for(var itmId=0;itmId<removeItemList.length;itmId++){
        exportFiles.outputList.splice(removeItemList[itmId],1);
    }
	exportFiles.viewUpdate();
    this.parent.fileList.update();
    }
 }
//�t�H�[�}�b�g�I��
exportFiles.w.ffBt.onChange=function(){
    exportFiles.opForm=this.selection.index;
}
//���X�g�����Z�b�g
exportFiles.w.rstBt.onClick=function(){
	exportFiles.refresh();
	exportFiles.viewUpdate();
    this.parent.fileList.update();
}
//�p�����[�^�ύX
exportFiles.w.fileList.update=function(){
    this.removeAll();
    for(var lid=0;lid<exportFiles.outputListView.length;lid++){
        this.add("item",exportFiles.outputListView[lid]);
          //("text",exportFiles.outputView[lid]);
    }
}
exportFiles.w.mkSF.onClick=function(){
    exportFiles.mkFolder=this.value;
      exportFiles.viewUpdate();
      this.parent.fileList.update();//�N���A����
      
}
//�^�b�v�o�̓I�v�V����
exportFiles.w.regOpt.onClick=function(){
    exportFiles.withRegister=this.value;
}
//�A�j���t���[���o�̓I�v�V����
exportFiles.w.afcOpt.onClick=function(){
      exportFiles.byAFC=this.value;
      if(this.value){
        this.parent.mkSF.enabled=false;
        this.parent.regOpt.enabled=false;
        this.parent.bdBt.enabled=false;
      }else{
        this.parent.mkSF.enabled=true;
        this.parent.regOpt.enabled=true;
        this.parent.bdBt.enabled=true;
      }
      exportFiles.viewUpdate();
      this.parent.fileList.update();//�N���A����
}
//�A�j���t���[�����r���h����
exportFiles.w.bdBt.onClick=function(){
�@app.activeDocument=exportFiles.targetDoc;
 var UndoString="���C������A�j���t���[��";
 var myExecute="nas.axeAFC.initFrames();for(var fix=0;fix<this.parent.fileList.items.length;fix++){if(fix>0){nas.axeAFC.dupulicateFrame();}exportFiles.setA(fix);};nas.axeAFC.reverseAnimationFrames();";

 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory(UndoString,myExecute);
 }else{
     evel(myExecute);
 }

    exportFiles.tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    this.parent.close();
}

exportFiles.w.okBt.onClick=function(){
 var UndoString="output";
 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory(UndoString, "exportFiles.export();");
          // =================== UNDO�o�b�t�@���g�p���ĕ��A
var id8 = charIDToTypeID( "slct" );
    var desc5 = new ActionDescriptor();
    var id9 = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        var id10 = charIDToTypeID( "HstS" );
        var id11 = charIDToTypeID( "Ordn" );
        var id12 = charIDToTypeID( "Prvs" );
        ref2.putEnumerated( id10, id11, id12 );
    desc5.putReference( id9, ref2 );
executeAction( id8, desc5, DialogModes.NO );
 }else{
     evel("exportFiles.export();");
 }

    exportFiles.tempDoc.close(SaveOptions.DONOTSAVECHANGES);
    this.parent.close();
}
//�L�����Z�����ďI��
exportFiles.w.cnBt.onClick=function(){
	exportFiles.tempDoc.close(SaveOptions.DONOTSAVECHANGES);
	this.parent.close();
}
//

exportFiles.w.show();

}

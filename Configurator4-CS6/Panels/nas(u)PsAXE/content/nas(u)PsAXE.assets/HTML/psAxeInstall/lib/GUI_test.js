/*
 *	TEST nas.GUI ���C�u�������쎎���X�N���v�g
 *		nas GUI-Library test script
 *	���̃t�@�C���́A�u�����_�[�����vGUI���C�u�����̎g�p�T���v���ł��B
 *	Adobe AE ���ł̃O���b�h�w��ɂ�� GUI���i�ւ̃A�N�Z�X���@��
 *	����ނ��̕����R���g���[����񋟂��܂��B
 *	�ڂ����g�p���@�́A�ȉ���URL���Q�Ƃ��Ă��������B
 *
 *	http://hpcgi2.nifty.com/Nekomata/nekojyarashi/wiki.cgi?ScriptLibrary
 *
 *	�Ȃ����̃��C�u�����́A�J�����̎b��łł��B
 *	�ו��͕ύX�ɂȂ�\�����L��܂��̂ŁA�T�C�g�̏������m�F���������B
 */
if (! app.nas){
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
//var nasLibFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
//										+ localize("$$$/nas/lib=nas/lib/");

if($.fileName){
//	CS3�ȍ~�́@$.fileName�I�u�W�F�N�g������̂Ń��P�[�V�����t���[�ɂł���
	var nasLibFolderPath = new File($.fileName).parent.path +"/lib/";
}else{
//	$.fileName �I�u�W�F�N�g���Ȃ��ꍇ�̓C���X�g�[���p�X�����߂�������
	var nasLibFolderPath = Folder.userData.fullName + "/"+ localize("$$$/nas/lib=nas/lib/");
}
var includeLibs=[
	nasLibFolderPath+"config.js",
	nasLibFolderPath+"nas_common.js",
	nasLibFolderPath+"nas_GUIlib.js",
];
/*
	nasLibFolderPath+"nas.XpsStore.js"

	nasLibFolderPath+"xpsio.js",
	nasLibFolderPath+"mapio.js",
	nasLibFolderPath+"lib_STS.js",
	nasLibFolderPath+"dataio.js",
	nasLibFolderPath+"fakeAE.js",
	nasLibFolderPath+"io.js",
	nasLibFolderPath+"psAnimationFrameClass.js",
	nasLibFolderPath+"xpsQueue.js"
*/
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
app.nas=nas;
}else{
alert("has nas")
nas=app.nas;
}
/* �E�B���h�E�̏�����
 * newWindow(�E�B���h�E�^�C�v,�E�B���h�E�^�C�g��[,�E�B���h�E��,�E�B���h�E����[,�����ʒuX,�����ʒuY]])
 *	�E�C���h�E���쐬���܂��B
 *	�߂�l:�E�B���h�E�I�u�W�F�N�g
 *	�^�C�v�ɂ�"dialog"�܂���"palette"���w��
 *	�����ƕ��́A�O���b�h�P�ʂŎw��i�ȗ��\�j
 *	�E�B���h�E�����ʒu�́A�s�N�Z���Łi�ȗ��\�j�w�肵�Ă��������B
*/
	var w= nas.GUI.newWindow       ("dialog" ,"�e�X�g �E�C���h�E" ,13 ,25);
//	var w= new Window	("palette","�e�X�g �E�C���h�E",[X,Y,X+7*nas.GUI.colUnit+nas.GUI.leftMargin+nas.GUI.rightMargin,Y+25*nas.GUI.lineUnit+nas.GUI.topMargin+nas.GUI.bottomMargin]);//������AE�I���W�i������
/* �E�C���h�E�z���ɃR���g���[����u���B
 *	�ڍׂ̓h�L�������g��ǂ�łˁB
 *	���������ꂽ�R���g���[���́A���������ɐe�G�������g�̔z���ɓo�^����܂��B
 *	��ʓI�ɂ́A�I�u�W�F�N�g�ɂ킩��₷�����O��^���ăA�N�Z�X�����₷���Ȃ�悤��
 *	�ȉ��̂悤�ɏ��������܂��B
 *
 *	�A�N�Z�X�ϐ� = �������R�}���h(�����������c);
 */
//	�{�^���G�������g
	w.btn  =nas.GUI.addButton      (w ,"�{�^��" ,0 ,1 ,3 ,1);

//	�A�C�R���{�^���G�������g
	w.iBtn  =nas.GUI.addIconButton      (w ,"�A�C�R���{�^��" ,3 ,5,1,1.5,"");

//	�ҏW�\�e�L�X�g
	w.etx  =nas.GUI.addEditText    (w ,"�ҏW�\�e�L�X�g" ,0 ,2 ,6 ,2);

//	�e�L�X�g
	w.stx  =nas.GUI.addStaticText  (w ,"�e�L�X�g" ,0 ,4 ,6 ,1,{style:"red"});

//	�`�F�b�N�{�b�N�X
	w.cbx  =nas.GUI.addCheckBox    (w ,"�`�F�b�N�{�b�N�X" ,0 ,5 ,3 ,1);

//	���W�I�{�^��
	w.rbt0 =nas.GUI.addRadioButton (w ,"���W�I�{�^��0" ,0 ,6 ,3 ,1);
	w.rbt1 =nas.GUI.addRadioButton (w ,"���W�I�{�^��1" ,0 ,7 ,3 ,1);

//	�X���C�_
	w.sld  =nas.GUI.addSlider      (w ,0 ,0 ,10 ,0 ,8 ,6 ,"top");

//	�X�N���[���o�[
	w.srb  =nas.GUI.addScrollBar   (w ,0 ,0 ,10 ,6 ,1 ,8);

//�����R���g���[���Q��AE7�ȍ~�̌݊����\�b�h���쐬
/*
	�Ώۂ� ListBox DropDownList
*/
//	�����R���g���[���E�Z���N�g�X�C�b�`
//		addSelecteSwitch(�e�G�������g,[�I�v�V����],�I��ID,X,Y,��,����)

	myOptions=["��","��","��","�~"];//�z���
	w.ss1  =nas.GUI.addSelectSwitch(w ,myOptions ,0 ,4 ,5.5 ,0.7 ,1);

	w.ss2  =nas.GUI.addSelectSwitch(w ,myOptions ,0 ,5 ,5 ,1 ,1.5,true);

//	�����R���g���[���E�Z���N�g�{�^��
//		addSelecteButton(�e�G�������g,[�I�v�V����],�I��ID,X,Y,��,����)

	myOptions=["<�Z���N�g�{�^��>","����1","����2","����3","����4","����5","����6","����7","����8","����9"];//�z���
	w.sbt  =nas.GUI.addSelectButton(w ,myOptions ,7 ,3 ,1 ,3 ,1,4);

	w.ddl  =nas.GUI.addDropDownList(w,myOptions,7, 3, 7 , 3, 1);
/*	
	w.ddl  =w.add("dropdownlist"  ,nas.GUI.Grid(3, 7 ,3,1,w),"noitem");
w.ddl.add("item","1");
w.ddl.add("item","2");
w.ddl.add("item","3");
*/
//	w.ddl =w.add("dropdownlist",nas.GUI.Grid(3,1,3,1,w),)
//	�����R���g���[���E���X�g�{�b�N�X �V���O���Z���N�g
/*
 ������
	addListBox(�e�I�u�W�F�N�g,[�I�v�V�������X�g],[�Z���N�g�����l],X,Y,��,����[,����I�v�V����])
	�܂���
	addListBox(�e�I�u�W�F�N�g,[�I�v�V�������X�g],�Z���N�gID,X,Y,��,����[,����I�v�V����])

 �߂�l
	�A�N�Z�X�x�[�X
 �v���p�e�B
	value �I�����ꂽ�l�E�܂��͑I�����ꂽ�l�̔z��(�}���`�Z���N�g��)
	options �I���\�Ȓl�̃��X�g
	selected 
	selects 
	�I�����ꂽ�l���擾���鎞�́A���X�g�{�b�N�X�I�u�W�F�N�g��
	 value �v���p�e�B���Q�Ƃ��Ă��������B
 */
	w.lbx0 =nas.GUI.addListBox (w ,["����","����","����","�Ђ��","���炰","����","�܂���"] ,1 ,0 ,9 ,3 ,4 ,"editable");

//	�����R���g���[���E���X�g�{�b�N�X �}���`�Z���N�g
	w.lbx1 =nas.GUI.addListBox (w ,["���","�݂���","������","�ɂ񂶂�","����ׂ�","��������","���傤��"] ,[true,false,true,false,true,false,true] ,3 ,9 ,3 ,5 ,"multiselect");
//	�����R���g���[�� �}���`�R���g���[��
/*
	�}���`�R���g���[���͈����ŕ����R���g���[��������ĕԂ��܂�
	nas.GUI.addMultiControl(�e�I�u�W�F�N�g,�L�[���[�h,������,Left,Top,Width,Height,�l����,[���x���e�L�X�g],[�����l],[�ŏ��l].[�ő�l])
	�e�I�u�W�F�N�g�ȊO�̈����͏ȗ��\�ł����A�r���̈������X�L�b�v����ꍇ��false���ŊԂ𖄂߂Ă����Ă��������B
*/

	w.mc0 =nas.GUI.addMultiControl(w,"number",1,7,1,6,1,true,false,0,-100,100,);
	w.mc1 =nas.GUI.addMultiControl(w,"angle",1,7,3,6,2,true);
	w.mc2 =nas.GUI.addMultiControl(w,"position",2,7,6,6,3,false);
	w.mc3 =nas.GUI.addMultiControl(w,"color",3,7,9,6,3,true);
	w.mc4 =nas.GUI.addMultiControl(w,"gamma",5,7,13,6,2,true,false,1,1/8,8);
// �R���{�{�b�N�X
	w.cBox=nas.GUI.addComboBox(w,["�R���{�{�b�N�X",1,2,3,4,5],"�΂��ڂ�",7,19,3,1)
	w.cBox=nas.GUI.addEditText(w,"�΂��ڂ�",7,20,3,1)
	
//	�p�l����u���Ă���ɂ��̔z���ɃR���g���[����u��

	w.pnl  =nas.GUI.addPanel       (w ,"PANEL" ,0 ,15 ,7 ,10);

//	�p�l���z���̃R���g���[���́A�p�l���̃��[�J�����W���ɓ���B
	w.pnl.btn  =nas.GUI.addButton      (w.pnl ,"BUTTON" ,0 ,1 ,3 ,1);
	w.pnl.etx  =nas.GUI.addEditText    (w.pnl ,"EDIT TEXT" ,0 ,2 ,6 ,2);
	w.pnl.stx  =nas.GUI.addStaticText  (w.pnl ,"STATIC TEXT" ,0 ,4 ,6 ,1);
	w.pnl.cbx  =nas.GUI.addCheckBox	   (w.pnl ,"CHECKBOX" ,0 ,5 ,3 ,1);
	w.pnl.rbt0 =nas.GUI.addRadioButton (w.pnl ,"RADIOBUTTON0" ,0 ,6 ,3 ,1);
	w.pnl.rbt1 =nas.GUI.addRadioButton (w.pnl ,"RADIOBUTTON1" ,0 ,7 ,3 ,1);
	w.pnl.sld  =nas.GUI.addSlider      (w.pnl ,0 ,0 ,10 ,0 ,8 ,6 ,"bottom");	w.pnl.srb  =nas.GUI.addScrollBar   (w.pnl ,0 ,0 ,10 ,6 ,1 ,8);

//�Z���N�g�{�^���́A�ȉ��̂悤�ȏ������̂�肩�����\�ł�
w.pnl.sbt  =nas.GUI.addSelectButton(w.pnl ,"<SelectBUTTON>" ,0 ,3 ,1 ,3 ,1);
	w.pnl.sbt.options.push("1st");
	w.pnl.sbt.options.push("2nd");
	w.pnl.sbt.options.push("3rd");
	w.pnl.sbt.options.push("4th");

//������ stb.add()����������Adobe�X�N���v�g�ƌ݊��𑝂�����

/*
 *	�ݒ肳�ꂽ�R���g���[���ɂ́A�Ȃɂ��̋@�\���������̂����ʂł��B
 *	�R���g���[�������삳�ꂽ���Ɂu�C�x���g�v���������܂��̂ŁB���̃C�x���g��
 *	�@�\��o�^���܂��B
 *
 *	���Ƃ��΁A�{�^�����N���b�N�����"Click"�C�x���g����������̂ŁA
 *	"Click"�C�x���g�������������ɋN������� onClick() ���\�b�h���`���Ă��܂��B
 */
	w.btn.onClick=function(){alert("�{�^�����N���b�N���܂���");};

/*
 *	�l�̕ύX���N�������ɋN���� "Change"�C�x���g
 *	���̗�ł́A�ҏW�\�e�L�X�g�̒l�����������Ă��܂��B
 */
	w.sbt.onChange=function(){w.etx.text+=this.value+nas.GUI.LineFeed;};

/*
 * 	�ǂ����X�N���[���o�[�̖߂�l��������?
 *	�����ł�
 *
 */
	w.srb.onChange=function(){w.etx.text+="srb\value : "+this.value+nas.GUI.LineFeed;};
/*
 *	���̃t�@�C���� ���̃G�������g�ɂ́A�Ȃɂ������ݒ肵�Ă���܂���B
 *	���K�p�ɏ��������Ă݂Ă��������B
 *
 *
 *	���ׂẴG�������g�̒�`���I�������A�E�C���h�E��\�����܂��B
 *	show()���\�b�h�ŕ\������܂ŁA��ʂɂ͉����\������܂���B 
 *	���R�A������ł��܂���B
 *	�Ō�ɕ\����Y��Ȃ��悤�ɁB
 */

	w.show();



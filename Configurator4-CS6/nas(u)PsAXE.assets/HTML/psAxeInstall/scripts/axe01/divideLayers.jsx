/*
	divideLayers.jsx
	���C�������L�[�ɂ��ă��C�����d���������h�L�������g���쐬����
��Ȏg�p�ړI�́A���C�A�E�g�E����⓮�擙�����ꂼ�ꃌ�C�����ƂɃ��C���Z�b�g��
���ނ��ꂽ�h�L�������g���쐬���邽�߂̍�ƕ⏕�X�N���v�g�ł���B



*/
/*
			layerSort(���C���R���N�V����[,���я�]);
	�ėp���C���\�[�g�֐�
		�w�肳�ꂽ���C���R���N�V���������C�����Ń\�[�g����B
		������false��^����ƁA�t���\�[�g�ɂȂ�i�A�j���̃Z���ł͋t�����X�L�Ȃ̂Ńf�t�H���g�j
		�����̃��C��������ꍇ�́A�x�����o���ď����𑱍s�B
		��ڈȍ~�͏����ΏۂɂȂ炸�ɉ��ɂ��܂��Ďc��
		���я��I�v�V������true/false�Ŏw��
		���C���R���N�V�����́ALayers,ArtLayers,LayerSets �Ȃ�
*/

layerSort= function(targetCol,revFlag){
//	���ёւ��Ώۂ�ݒ�
	var myTarget=targetCol;
//	���������C���R���N�V�����łȂ������ꍇ�A�L�����Z��
	if(!(targetCol instanceof Layers)){return false;};
//	�����Ȃ���Ή����琳��
	if(! revFlag) revFlag=false;//
//	���ёւ��Ώ̂̃��C����1�����Ȃ��ꍇ�́A���ёւ��s�\�Ȃ̂ŃL�����Z��
	if(myTarget.length<=1){return false;};
//	�\�[�g�p�z������
	var sortOrder=new Array();
	for (idx=0;idx<myTarget.length;idx++){
		if (myTarget[idx].isBackgroundLayer){
			continue;//���C�����w�i�������疳��
		}else{
			sortOrder.push(myTarget[idx].name);
		}
	}
//�܂����ёւ���(���̎��_�ŉ����琳��)
		sortOrder.sort();
	if (revFlag){
//���]�t���O����Δ��]
		sortOrder.reverse();
	}
//���ёւ����z�񂩂瓯�����C���̃`�F�b�N
	for (idx=1;idx<sortOrder.length;idx++){
		if(sortOrder[idx-1]==sortOrder[idx]){
			alert("�����̃��C��������܂��B\n��ڈȍ~�̃��C���͕��ёւ��̑ΏۂɂȂ�܂���B");
			break;
		}
	}
	for (idx=0;idx<sortOrder.length;idx++){
		myTarget.getByName(sortOrder[idx]).move(myTarget[0],ElementPlacement.PLACEBEFORE);
	}
	return sortOrder;
}
/*
		layerReverse(���C���R���N�V����);
	���C�����я����]�T�u�v���V�[�W��
	���C���̕��я��𔽓]����B�����̓��C���R���N�V����(~.layers)
*/
layerReverse= function(targetCol){
//	���ёւ��Ώۂ�ݒ�
	var myTarget=targetCol;
//	���������C���R���N�V�����łȂ������ꍇ�A�L�����Z��
	if(!(targetCol instanceof Layers)){return false;};
//	���ёւ��Ώ̂̃��C����1�����Ȃ��ꍇ�́A���ёւ��s�\�Ȃ̂ŃL�����Z��
	if(myTarget.length<=1){return false;};

//	�\�[�g�p�z������
	var sortOrder=new Array();
	for (idx=0;idx<myTarget.length;idx++){
		if (myTarget[idx].isBackgroundLayer){
			continue;//���C�����w�i�������疳��
		}else{
//���C�����̂�z��Ɋi�[
			sortOrder.push(myTarget[idx]);
		}
	}
//�t���Ŕz�u
	for (idx=0;idx<sortOrder.length;idx++){  
		sortOrder[idx].move(myTarget[0],ElementPlacement.PLACEBEFORE);
	}
	return;
}


/*
		reductString(�Ώە�����);
	����������߂��ėv�f��������֐�
	�����͕�����
	�߂�l�́A�G�������g�R���N�V�����z��
	[[�I���W�i���̃G�������g��,�X�e�[�W,�O���[�v���x��,�G�������gID,�C���L�q�q],[(����)],[(����)]�c]
*/
reductString=function(myString){
	if(!myString){return false};
	var resultArray=new Array();

var stgRegex=new RegExp("^(cont|layout|rough|key|cell|�R���e|���C�A�E�g|���t��|����|�ꌴ|��|�Z��)","i");
var lblRegex=new RegExp("^(BG|BOOK|SLIDE|PAN|T\\.U|T\\.B|Z\\.I|Z\\.O|L\/?O|�w�i|���}|�u�b�N|[A-Z])","i");

var revRegex=new RegExp("(���o?|���?|���J?|�G(�t�F�N�g)?|�ē�?|�J(�u�Z)?|�C��?|\\*+)$");
//�G�������g�Z�p���[�^�Ƃ���"/","_"���g�p���Ă���̂Ń��x����ID�̊Ԃɂ����̕���������ꍇ�͂��炩���ߒu�����Ă��炱�̃X�N���v�g�ɓn������

	if(myString.match(/(.+)\..+$/)){myString=RegExp.$1};//�t�@�C���g���q�͎̂Ă�
	if(myString.match(/^([^\/\_\ ]+)[\/\_\ ]([0-9]+)$/)){myString=RegExp.$1+"-"+RegExp.$2};//������S�̂�1���x���{���l���Ǝv����ꍇ�̓��x���Z�p���[�^���폜
//������������G�������g�z��ɕ���
	myElements=myString.replace(/\s*[\/\_]\s*/g,"/").split("/");
//�e�G�������g�����
	for (var idx=0;idx<myElements.length;idx++){

		myPattern=myElements[idx].replace(/\ *[\-\ ]\ */g,"-").split("-");
		if(myPattern.length==4){
			//�v�f4�̏ꍇ�́A�������őS�w��Ƃ݂Ȃ�
		}else{
			
		}
		switch (myPattern.length){
		case 4:;//�v�f��4�Ȃ̂őS�w��Ƃ݂Ȃ��ă}�b�s���O
			myStgPrefix	=myPattern[0];
			myGrpLabel	=myPattern[1];
			myElmIndex	=myPattern[2];
			myRevPostfix	=myPattern[3];
		break;
		case 3:;//�v�f��3�́A���v�f�Ŕ��� 2����
			if(myPattern[0].match(stgRegex)){
				myStgPrefix	=myPattern[0];
				myGrpLabel	=myPattern[1];
				myElmIndex	=myPattern[2];
				myRevPostfix	="";
			}else{
				myStgPrefix	="";
				myGrpLabel	=myPattern[0];
				myElmIndex	=myPattern[1];
				myRevPostfix	=myPattern[2];
			}
		break;
		case 2:;//�v�f��2�̏ꍇ�́A���x���ƃC���f�b�N�X�̑΂Ƃ��ď���
				myStgPrefix	="";
				myGrpLabel	=myPattern[0];
				myElmIndex	=myPattern[1];
				myRevPostfix	="";
		break;
		default:;//�W������
			myTestStr=myElements[idx];
//	�`���̓X�e�[�W�w�肩?
	if(myTestStr.match(stgRegex)){
		myStgPrefix=RegExp.$1;
//						�]��������X�V
		myTestStr=myTestStr.replace(myStgPrefix,"");
	}else{
		myStgPrefix="";
	}
//	�����ɏC�����x���w�肪���邩
	if(myTestStr.match(revRegex)){
		myRevPostfix=RegExp.$1;
//						�]��������X�V
		myTestStr=myTestStr.replace(myRevPrefix,"");
	}else{
		myRevPostfix="";
	}
//	���x���}�b�`�H
	if(myTestStr.match(lblRegex)){
		myGrpLabel=RegExp.$1;
//						�]��������X�V
		myElmIndex=myTestStr.replace(myGrpLabel,"");
	}else{
		myGrpLabel="";
		myElmIndex=myTestStr;
	}
//�]����ɃO���[�v���x���ƃC���f�b�N�X�ɋ󕶎��񂪌��ꂽ�ꍇ�⊮����
//�󕶎���͋֎~
		if(myElmIndex==""){myElmIndex=myElements[idx];};
		if(myGrpLabel==""){myGrpLabel=myElmIndex;};
//�t�H�[�}�b�g���ŃO���[�v���ɃG���g����1�_�݂̂̏ꍇ�́A�G�������g�C���f�b�N�X�ƃO���[�v������v�����������������
//	------ �b��ŃG�������g���]��
		break;
		}
				resultArray.push([myElements[idx],myStgPrefix,myGrpLabel,myElmIndex,myRevPostfix]);
	}

return resultArray;
}
/*
		classify(�^�[�Q�b�g���C���g���[��)
	�^�[�Q�b�g�̃��C���g���[����ΏۂɃ��C���𕪗ސ���(�d����)����i����
	�����́A���C���g���[��(layers �����I�u�W�F�N�g)
*/
classify=function(targetObject){
//	�^�[�Q�b�g���ɃA�[�g���C���������ꍇ�͏������~
	if(targetObject.artLayers.length==0){return false;}
	var moveActions=new Array();
//		�܂������W
	for (var idx=0;idx<targetObject.artLayers.length;idx++){
		//	���O�𕪉�
			myElements=reductString(targetObject.artLayers[idx].name);
			for (var id=0;id<myElements.length;id++){
//			var newLayerName=myElements[id].join("-").replace(/^\-/,"").replace(/\-$/,"");
			var newLayerName=myElements[id][0];
//				moveActions.push([targetObject.artLayers[idx],myElements[id][2],myElements[id][3],id]);
				moveActions.push([targetObject.artLayers[idx],myElements[id][2],newLayerName,id]);
		//		�����X�^�b�N��[���C���I�u�W�F�N�g/�^�[�Q�b�g�t�H���_��/�V���C����/�A�N�V�����t���O]�Őς�
			}
	}
//	alert(moveActions.toString());
//
	for (var idl=0;idl<moveActions.length;idl++){
		var targetLayer	=moveActions[idl][0];
		var dstFolderName	=moveActions[idl][1];
		var dstLayerName	=moveActions[idl][2];
		var actionFlag	=(moveActions[idl][3]==0)? true : false;
		var myDestFolder =new Object();
//	�ړ���t�H���_��ݒ�(getByName�ŃA�N�Z�X���Ď��s������쐬�E�ݒ肷��)�����CS�ł͓����� CS2�ȍ~�ł̓_��
//		try{myDestFolder=targetObject.layerSets.getByName(dstFolderName);}catch(e){myDestFolder=targetObject.layerSets.add(dstFolderName);}
//		dstFolderName=prompt("dstFolderName",dstFolderName);
var folderExists=false;
for(var ids=0;ids<targetObject.layerSets.length;ids++){
	if(dstFolderName==targetObject.layerSets[ids].name){folderExists=true;break;}
}
if(folderExists){
	myDestFolder=targetObject.layerSets.getByName(dstFolderName);
}else{
	myDestFolder=targetObject.layerSets.add();//�V�Z�b�g����Ė��O�����Ȃ��ƃ_�����ۂ�
	myDestFolder.name=dstFolderName;//�{������!
}
//	�A�N�V�����t���O��0�ȊO�Ȃ畡��
//	0�Ȃ�΁A�^�[�Q�b�g���g���ړ�
//	dstLayerName=prompt(targetLayer.name + " to targetLayerName?",dstLayerName);
		if(! actionFlag){
			newLayer=targetLayer.duplicate(myDestFolder,ElementPlacement.INSIDE);
			newLayer.name=dstLayerName;
		}else{
			targetLayer.move(myDestFolder,ElementPlacement.INSIDE);
			targetLayer.name=dstLayerName;
		}

//	���l�[��
	}
//�t�H���_�����\�[�g
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	layerSort(targetObject.layerSets[idf].layers);
}
//�^�[�Q�b�g���\�[�g
	layerSort(targetObject.layers);
/* */
//�w�i���C�����ł�����
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	if(targetObject.layerSets[idf].name.match(/BG/i)){
		targetObject.layerSets[idf].move(targetObject,ElementPlacement.PLACEATEND);
	}
}
//�u�b�N���C��������΍ł����
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	if(targetObject.layerSets[idf].name.match(/BOOK/i)){
		targetObject.layerSets[idf].move(targetObject,ElementPlacement.PLACEATBEGINNING);
	}
}
//���C�A�E�g������΂���ɏ��
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	if(targetObject.layerSets[idf].name.match(/L\/?O|���C�A�E�g/i)){
		targetObject.layerSets[idf].move(targetObject,ElementPlacement.PLACEATBEGINNING);
	}
}
//���C���Z�b�g�͒ʉ߂ł͂Ȃ��ʏ�ɂ��Ă�������?(�X�C�b�`���悤)
for(var idf=0;idf<targetObject.layerSets.length;idf++){
	targetObject.layerSets[idf].blendMode=BlendMode.NORMAL;
}
//�I��
return true;
}
/*
���C���R���N�V������getByName�͑�ώg���Â炢�̂�
���O�̊֐��������Ă�������

*/
//�t���ŃR�[��
//var tgt=activeDocument.activeLayer.parent.layers;
//alert(layerSort(tgt,false).toString());

//	layerReverse(activeDocument.layers);
//	reductString(app.project.item(1).name).toSource();
// alert(reductString(activeDocument.activeLayer.name).toSource());
//	
//alert(activeDocument.name);
if(app.documents.length){
var myUndo="���C���d����";var myAction="classify(activeDocument.activeLayer.parent)";


if(app.activeDocument.suspendHistory){app.activeDocument.suspendHistory(myUndo,myAction)}else{evel(myAction)}
}


/*
	���C���Z�b�g�̑S�폜
	�I���������C���̊܂܂��g���[�����̃��C���Z�b�g����������
	���C���Z�b�g���̃��C���̓��C���Ƃ��ď�������B�i�ċA�����͂��Ȃ��j
*/
exFlag=true;
//���������h�L�������g���Ȃ���ΏI��
	if(app.documents.length==0){
		exFlag=false;
	}
if(exFlag){
var targetSets=activeDocument.activeLayer.parent.layerSets;var setCount=targetSets.length;
	for (var idx=0;idx<setCount;idx++){
		
		var targetSet=targetSets[0];var myCount=targetSet.layers.length;
		for (var idL=0;idL<myCount;idL++){
			targetSet.layers[0].move(targetSet,ElementPlacement.PLACEBEFORE)
		}
		targetSet.remove();
	}
}else{alert("�h�L�������g�������݂����_");}

/*	�ėp���C���\�[�g�֐�
		�A�N�e�B�u���C���̊܂܂�郌�C���R���N�V���������C�����Ń\�[�g����B
		������false��^����ƁA�t���\�[�g�i�A�j���̃Z���Ȃ�t�����]�܂����j
		�����̃��C��������ꍇ�́A�x�����o���ď����͑��s
*/

layerSort= function(revFlag){
	if(! revFlag) revFlag=false;//
//	�A�N�e�B�u���C���̃g���[���[���^�[�Q�b�g�ɃZ�b�g����
	var myTarget=activeDocument.activeLayer.parent.layers;
//	���ёւ��Ώ̂̃��C����1�����Ȃ��ꍇ�́A���ёւ��s�\�Ȃ̂ŃL�����Z��
	if(myTarget.length<=1){return false;}
//	�\�[�g�p�z������
	var sortOrder=new Array();
	for (idx=0;idx<myTarget.length;idx++){
		if (myTarget[idx].isBackgroundLayer){
			continue;//���C�����w�i�������疳��
		}else{
			sortOrder.push(myTarget[idx].name);
		}
	}
		sortOrder.sort();//�t�����ёւ�
	if (revFlag){
		sortOrder.reverse();//�������ёւ�
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
//�t���ŃR�[��
layerSort(true).toString();


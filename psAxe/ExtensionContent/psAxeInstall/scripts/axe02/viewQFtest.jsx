/*
	����������Ps�L���[�t���[����𐶐�����֐�
	
*/

var qFrames=new Array;//�z��R���N�V����
//�L���[�t���[���I�u�W�F�N�g�R���X�g���N�^
QFrame=function(myIndex,myBody,myDuration)
{
	if(!(myBody instanceof Array)){myBody=[];}
	if(! myDuration){myDuration=1;}
//���͂��t�B���^���Ă���
	this.index=myIndex;//�J�n�t���[��index
	this.orderingBody=myBody;//���єz��
	this.duration=myDuration;//�p�����ԁi�t���[�����j
	this.isSame=function (myTarget){
		//�^�[�Q�b�g�I�u�W�F�N�g��body�z����r���郁���o�֐�
		if((myTarget instanceof QFrame)&&(myTarget.orderingBody.length==this.orderingBody.length))
		{
			

for(var ix=0;ix<this.orderingBody.length;ix++){
				if(this.orderingBody[ix]!=myTarget.orderingBody[ix]){return false;}
			}
			return true;//���[�v���Ō�܂Ŕ������true
		}else{
			return null;//��r�v���𖞂����Ă��Ȃ��̂�null��Ԃ�
		}
	}
}

/*	�ȉ�QFrame�I�u�W�F�N�g�ŕ\���𐧌䂷��g�����\�b�h
QFrame �I�u�W�F�N�g�܂��͕\���z��������ŗ^����

*/
function _setView(params){
	if(params instanceof QFrame){params=params.orderingBody}
	if(!(params instanceof Array)){params=[params]}
	var mx=this.layers.length
	for(var ix=0;ix<mx;ix++)
	{
				//alert(this.layers[mx-ix-1].viewQF+":::::  >")
		var elX=this.layers[mx-ix-1];
		var qX=params[ix%params.length];
		if(qX==0){
			elX.visible=false;//�Z�b�g�S�̂ŃJ������
			for(var qix=0;qix<elX.layers.length;qix++){elX.layers[qix].visible=false;}
		}else{
			elX.visible=true;
			var qmx=elX.layers.length
			for(var qix=0;qix<qmx;qix++)
			{
				var lidx=qmx-qix-1;
				elX.layers[lidx].visible=((qix+1)==qX)?true:false;//�\���w�肪����Ε\��
			}
		}
	}
}
//�A�N�e�B�u�h�L�������g�ɑ΂��Ċg���@
app.activeDocument.setView=_setView;

//����
var myQF=new QFrame(0,[1,2,3],1);
app.activeDocument.setView(myQF);



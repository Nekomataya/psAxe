/*
	����������Ps�L���[�t���[����𐶐�����֐�
	
*/
var myXps=XPS;

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

//XPS����p�[�X�ς݃f�[�^������C���̐������擾
var tempArray=new Array();
	for(var lix=0;lix<myXps.layers.length;lix++){
		tempArray[lix]=myXps.timeline(lix+1).parseTm();
	}

//XPS�̃t���[���������������ă��j�[�N�ȃL���[�t���[���z����`������
var myQueue=new Array();
myQueue.toString=function(){
	var myResult="";
	for(var ix=0;ix<this.length;ix++){
		myResult+="["+ix+"]"+this[ix].index+"\t:"+this[ix].orderingBody.join(",")+":("+this[ix].duration+")\n";
	}
	return myResult;
}
var currentQF=null;
var previewQF=new QFrame(-1,new Array(),1);//�v�f�O�Ȃ̂ŕK������Ɏ��s�����r�I�u�W�F�N�g
for(var fidx=0;fidx<myXps.duration();fidx++){



	var myOrderingArray=new Array();
	for(var lix=0;lix<myXps.layers.length;lix++){myOrderingArray.push(tempArray[lix][fidx])};
	currentQF=new QFrame(fidx,myOrderingArray,1);
//	alert(previewQF.isSame(currentQF))
	if(previewQF.isSame(currentQF)){
		//�����e�̃G���g���Ȃ̂Ōp�����Ԃ��������Z���Ď���
		myQueue[myQueue.length-1].duration++;
	}else{
		//�V�����G���g���Ȃ̂Ŏ��Ԃ�ώZ���ăL���[�ɉ�����
		myQueue.push(currentQF);
		previewQF=currentQF;//��r�p�ɕۑ�
	}
}

//���[�ށ@�u������v���ۂ��@2011 03 06

/*
	�UAE���������֐� ��`

�R���|�W�V�����̓��C����v�f�Ɏ��z��I�u�W�F�N�g
���C���́A�����̃^�C�����C����v�f�Ɏ��z��I�u�W�F�N�g
�^�C�����C���́A�L�[�t���[����v�f�Ɏ��z��I�u�W�F�N�g
�^�C�����C���� ��{�f�[�^�\����[frame,value]�̔z��B

value�́A�^�C�����C���̎�ʃv���p�e�B�ɂ��������ĕω�����l�̔z��B
�l���P���z��̏ꍇ�A�X�J���ϐ��Ƃ��Ďg����悤�ɂ��Ă����B

�ȉ��^�C�����C���̃v���p�e�B
value �̍\���A��̂���?

name(=id) ���ʖ�
valueAtTime(){�L�[�t���[����⊮�����l��Ԃ����\�b�h}
timeLineClass	�^�C�����C����� �W�I���g���E�G�t�F�N�g�E���}�b�v�ȂǂȂ�



�ȉ����C���̃v���p�e�B

width	���C���\�[�X��
height	���C���\�[�X����
pixelAspectRatio	�\�[�X�̏c����
 inPoint	IN�_
outPoint	OUT�_

 footage	�t�[�e�[�WID

duration(){���p�����Ԃ��擾���郁�\�b�h(w)}
name(id)	���ʖ�
orderId	�d�ˍ��킹�D�揇��

�ȉ��R���|�W�V�����̃v���p�e�B
name(id)	���ʎq
unitsOfSecond	�t���[�����[�g
compPixelAspectRatio	�R���|�̃s�N�Z���c����


*/
/*
	�x�N�g�����Z�֐��Q
*/
//�x�N�g�����Z���O����
//	�^����ꂽ�x�N�g���̎����𑽂����̂ɑ����ĕs������0�������ĕԂ�
function preformvector(vec1,vec2)
{
//�P���X�J���������ꍇ�A�v�f��1�̔z��ɕϊ����Ă����B
	if (typeof(vec1)=="number") {vec1=[vec1];}
	if (typeof(vec2)=="number") {vec2=[vec2];}
//�x�N�g���̎��������߂� �񎟌����O�������l������
	var difD = (vec1.length - vec2.length);
	var vecD = (vec1.length > vec2.length)? vec1.length:vec2.length;//������
//�Е����s������ꍇ��0�ŕ₤
	if (difD > 0) {
		for (var idx = 0 ; idx > difD; idx --){
			vec2 = vec2.concat([0]);
		}
	}
	if (difD < 0) {
		for (var idx = 0 ; idx < difD; idx ++){
			vec1 = vec1.concat([0]);
		}
	}
	return [vec1,vec2,vecD];
}
//	�x�N�g���a��Ԃ��B
function add(vec1,vec2) {

	vec1=preformvector(vec1,vec2)[0];
	vec2=preformvector(vec1,vec2)[1];
	vecD=preformvector(vec1,vec2)[2];

	var vec3 = new Array(vecD);

//�a�����߂ĕԂ��B
	for (idx = 0;idx < vecD ; idx ++) {
		 vec3[idx] = vec1[idx] + vec2[idx];
	}
return vec3;
}
//�x�N�g������Ԃ�
function sub(vec1,vec2) {

	vec1=preformvector(vec1,vec2)[0];
	vec2=preformvector(vec1,vec2)[1];
	vecD=preformvector(vec1,vec2)[2];

	var vec3 = new Array(vecD);

//�������߂ĕԂ��B
	for (idx = 0;idx < vecD ; idx ++) {
		 vec3[idx] = vec1[idx] - vec2[idx];
	}
return vec3;
}

//�x�N�g���ς�Ԃ�
function mul(vec,amount) {

	if (typeof(vec)=="number") vec=[vec];
//�x�N�g���̎��������߂� �񎟌����O�������l������
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//�ς����߂ĕԂ��B
for (idx = 0;idx < vecD ; idx ++) {
 vecNew[idx] = vec[idx] * amount;
}
return vecNew;
}

//�x�N�g������Ԃ�
function div(vec,amount) {
	if (typeof(vec)=="number") {vec=[vec];}
//�x�N�g���̎��������߂� �񎟌����O�������l������
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//�������߂ĕԂ��B
	for (idx = 0;idx < vecD ; idx ++) {
 vecNew[idx] = vec[idx] / amount;
}
return vecNew;
}


//�x�N�g���N�����v
function clamp(vec, limit1, limit2) {
		var max=limit1;var min=limit2;
	if (limit1 < limit2){
		max=limit2;min=limit1;
}
	if (typeof(vec)=="number") {vec=[vec];}
//�x�N�g���̎��������߂� �񎟌����O�������l������
	var vecD = (vec.length);
	var vecNew = new Array(vecD);
//�v�f���Ƃɒl���N�����v���ĕԂ��B
for (idx = 0;idx < vecD ; idx ++) {
	if (vec[idx] >= min && vec[idx] <= max){
		vecNew[idx] = vec[idx];
	}else {
		vecNew = (vec[idx] >= min )?vecNew.concat([max]):vecNew = vecNew.concat([min]);
	}
}
return vecNew;
}

//����
function dot(vec1,vec2) {

	vec1=preformvector(vec1,vec2)[0];
	vec2=preformvector(vec1,vec2)[1];
	vecD=preformvector(vec1,vec2)[2];

//	var vec3 = new Array(vecD);

	var Result = 0;
//�v�f���ƂɐώZ�B
	for (idx = 0;idx < vecD ; idx ++) {
		Result= Result + (vec1[idx] * vec2[idx])
	}
	return Result;
}
//�O��
//AE�̎d�l�ɍ��킹��2������3�����̒l�݂̂��v�Z����
//
function cross(vec1, vec2) {


	vec1=preformvector(vec1,vec2)[0];
	vec2=preformvector(vec1,vec2)[1];
	vecD=preformvector(vec1,vec2)[2];

//	var vec3 = new Array(vecD);

	var Result = 0;
//2������3�����ŕ���
	switch (vecD) {
case 2:
//2�����̎��͊O�ς����߂邽��z���W�l��0�����Ă��B(break�Ȃ�)
			vec1 = vec1.concat([0]);
			vec2 = vec2.concat([0]);
case 3:
	Result = [	vec1[1] * vec2[2] -  vec1[2] * vec2[1],
			vec1[2] * vec2[0] -  vec1[0] * vec2[2],
			vec1[0] * vec2[1] -  vec1[1] * vec2[0]	];
	break;
default:
	Result="2������3�����̒l�ł���K�v������܂��B"	;	
	}
return Result;
}

function length(vec) {
//�����������������߂�
	if (arguments.length==2){
		if (	typeof(arguments[0])=="number" &&
			typeof(arguments[1])=="number")
		{
			vec=[arguments[0],argments[1]];
		}else{
	if(	typeof(arguments[0][0])=="number" &&
		typeof(arguments[0][1])=="number" &&
		typeof(arguments[1][0])=="number" &&
		typeof(arguments[1][1])=="number" )
	{
		vec=sub(arguments[0],arguments[1]);
	}else{
		return "�z�����͂��܂��傤";
	}
		}
	}
//
//�x�N�g���̎��������߂� �񎟌����O�������l������
	var vecD = (vec.length);
	if (isNaN(vecD)) { return;  }
	var Length;
//���������߂�
switch (vecD) {
case 1:	Length = vec[0];break;
case 2:
case 3:
	Length = Math.pow(Math.pow(vec[0],2) + Math.pow(vec[1],2),.5);
		if (vecD > 2) {
	for (idx = 2 ; idx < vecD ; idx ++) {
		Length = Math.pow(Math.pow(Length,2) + Math.pow(vec[idx],2),.5);
	}
		};break;
default:	return "2�����܂���3�����̒l����͂��܂��傤";
}
return Length;
}

function normalize(vec) {return div(vec,length(vec));}

//�x�N�g�����Z�֐������܂�

//AE�@ExpressionOtherMath �݊� �p�x<>���W�A���ϊ��֐�
//���؂�Ȃ��ق����ǂ������A�^�p���Ă݂Ĕ��f���܂��傤 2006/06/23
function degreesToRadians(degrees)
{
	return Math.floor((degrees/180.)*Math.PI*100000000)/100000000;
}
function radiansToDegrees(radians)
{
	return Math.floor(180. * (radians/Math.PI)* 100000)/100000;
}

//AE�̓����͕킷�邽�߂ɐݒ肷��U�I�u�W�F�N�g�̒�`
//��`�Ɏg�p����֐�
//
//�N���X�v���g�^�C�v�̕���
//	���̊֐��ŁA�����p�������v���g�^�C�v�v���p�e�B���擾
//  function inherit(subClass, superClass) {
//        for (var prop in superClass.prototype) {
//            subClass.prototype[prop] = superClass.prototype[prop];
//        }
//    }
//



/*	�����L�����A�I�u�W�F�N�g�ݒ�
	�L�����A�I�u�W�F�N�g�P�͎̂g�p���Ȃ����A
	���W�n�I�u�W�F�N�g�̊�b�I�u�W�F�N�g�ɂȂ�B
	���W�n�̊�{���\�b�h�͂�������擾����B
	�����o�b�t�@�̂������́A�R��!
*/
function Carrier()
{
//this.prototype.contructor=Array;
	this.width		=	0	;
	this.height		=	0	;
	this.pixelAspect	=	1	;
	this.frameRate		=	1	;
	this.duration		=	0	;
}
//	new Carrier();
// Carrier.prototype.constructor = Array;
//	�v���g�^�C�v���\�b�h
	Carrier.prototype.setFrameRate	=
	function(rate){
		if(! rate)
		{rate=this.frameRate;}else{this.frameRate=rate;};
		this.frameDuration=1/rate;
	return rate;
	};
	Carrier.prototype.setFrameDuration	=
	function(duration){
		if(! duration)
		{duration=this.frameDuration;}else{this.frameDuration=duration;};
		this.frameRate=1/duration;
	return duration;
	};
	Carrier.prototype.setGeometry	=
	function(w,h,a){
		if(w){this.width	=w;}
		if(h){this.height	=h;}
		if(a){this.pixelAspect	=a;}
	return [w,h,a];
	};
/*	�L�[�t���[���ݒ�
	�L�[�t���[���̎�����^���ď���������B
	��̃L�[�t���[���́A�ȉ��̃v���p�e�B������
	����,		//�ώZ�t���[������
	[�l],		//�^�C�����C���̃v���p�e�B�ɂ��������đ�����
	[[�l�̐���ϐ�1],[2]],//�l�Ɠ������ŁA���g
	[[�^�C�~���O�̐���ϐ�1],[2]],//�񎟌��A���g
	�L�[�A�g���r���[�g,//AE�p�L�[�⊮�t���O
*/
function KeyFrame(f,v,vCp,tCp,kAtrib)
{
	if(!f){	f =0	}
		this.frame =f	;
	if(!v){	v=null	}
		this.value=v	;
	if(!vCp){ vCp=[1/3,2/3]	}
		this.valueCp=vCp	;
	if(!tCp){ tCp=[[1/3,2/3],[1/3,2/3]]	}
			this.timingCp=tCp	;//AE�݊��Ȃ�1������
	if(!kAtrib){ kAtrib=["stop","linear","time_fix"]	}
			this.keyAtrib=kAtrib	;
/*
�L�[�A�g���r���[�g�́A���݂�AE�݊���W�Ԃ��Ă����B��ōčl
[�^�C�~���O�⊮,�l�⊮,�l�̎��ԕ⊮(���[�r���O)]
*/

}
//	new KeyFrame();

//	�^�C�����C���ݒ�
function TimeLine(atrib)
{	this.name = atrib	}
//	new TimeLine();
	TimeLine.prototype= new Array();
	TimeLine.prototype.constructor=TimeLine;
/*
�^�C�����C����AE�̏ꍇ���ƃ^�C�����C���f�[�^�̃g���[���ƌ����ϓ_��Property�ɑ�������I�u�W�F�N�g
�ЂƂ̃^�C�����C���͂��ꂼ��̑����ƂƂ��ɃA�j���[�V�����\�ȃv���p�e�B��ێ�����B
�������A�����ɂ͉摜�͑��݂��Ȃ��@�摜�̔z���̃v���p�e�B�Ƃ��Ăł͂Ȃ��摜�̏�ʂɈʒu����l�b�g���[�N��
�{�[�h�Ƃ��ĂƂ炦��ׂ��ł��邱�Ƃ���
*/
/*	TimeLine.setKeyFrame(myKeyFrame)
����	�L�[�t���[���I�u�W�F�N�g
�ߒl	�o�^�����L�[�̃C���f�b�N�X

�^�C�����C���̃��\�b�h
�L�[�t���[�����^�C�����C���ɓo�^����B
���łɓo�^����Ă���L�[�t���[���̂����A����frame�l�������̂�����Ώ㏑������
����ȊO�͐V�K�o�^����B���̂܂܂��Ə��s���ɂȂ�̂Ō�ŏ��������v
�v���~�e�B�u�ȓo�^�����Ƃ��Ă�TimeLine.push(KeyFrame)���g�p���Ă��ǂ�
�������d���̌������ł��Ȃ��̂ŐV�K�Ɉꊇ�œo�^����ۂ̂ݐ���
�@���̕ӂ͂����Ɛ������Ȃ��Ɗ�Ȃ��ˁ@�Q�O�O�X
*/
TimeLine.prototype.setKeyFrame=	function (myKeyFrame){
	for (var id=0;id<this.length;id++)
	{
		nas.otome.writeConsole(myKeyFrame.frame+"<>"+this[id].frame);
		if(myKeyFrame.frame==this[id].frame)
		{
			this[id]=myKeyFrame;
			return id;
		}
	}
	this.push(KeyFrame);
	return this.length-1
};
//valueAtTime()
//AE�݊�?��������Ȃ�?�����ł͌݊��Ȃ�! t �̓t���[�����ŗ^���邱��
function valueAtTime_(t){
	if(t <= this[0].frame){return this[0].value}
	if(t >= this[this.length-1].frame){return this[this.length-1].value}
		for(id=1;id<this.length;id ++)
		{
	if(t == this[id].frame){return this[id].value}
	if(t <  this[id].frame){//�����L�[�t���[�������������̂Ōv�Z���ĕԂ�
//

if (this[id].keyAtrib[0]=="stop"){
//�L�[�⊮����~�̎��́A�⊮�v�Z�Ȃ��B�O���L�[�̒l�ŕԂ��B
	return this[id-1].value;
}else{
		var Vstart	=this[id-1].value;
		var Vcp1	=this[id-1].valueCp[0];
		var Vcp2	=this[id-1].valueCp[1];
		var Vend	=this[id].value;

		var Tstart	=this[id-1].frame;
		var Tcp1	=this[id-1].timingCp[0];
		var Tcp2	=this[id-1].timingCp[1];
		var Tend	=this[id].frame;

//�l���`���A�[�N�̑S�������߂�
		var HallArk=nas.bezierL(Vstart,Vcp1,Vcp2,Vend);
//�w�莞�Ԃ���^�C�~���O�W�������߂�
		var Now=(t-Tstart)/(Tend - Tstart);
//���Ԃ��� 2����(���ԁE�䗦)���ϐ������߂�B
		var Tvt= nas.bezierA(Tcp1[0],Tcp1[1],Now);
//���߂����ϐ��Ń^�C�~���O�W�����o��
		var Tvv= nas.bezierA(0,Tcp2[0],Tcp2[1],1,Tvt);
//�W������l�����߂�B
	Tt=Tvv;//�����ϐ�(�����l)
	Tmax=1;
	Tmin=0;
	var preLength	=0;//�n�_����̃A�[�N��
	var postLength	=0;//�I�_�܂ł̃A�[�N��
	var TtT	=0;//�e�X�g�œ�����䗦

do{
	preLength	=nas.bezierL(Vstart,Vcp1,Vcp2,Vend,0,Tt);
	postLength	=nas.bezierL(Vstart,Vcp1,Vcp2,Vend,Tt,1);
	TtT	=preLength/(preLength+postLength);
		if(Tvv<preLength/(preLength+postLength))
		{
			Tmin=Tt;//�����l�����ݒl��
			Tt=(Tmax+Tt)/2;//�V�e�X�g�l��ݒ�
		}else{
			Tmax=Tt;//����l�����ݒl��
			Tt=(Tmin+Tt)/2;//�V�e�X�g�l��ݒ�
		}
} while(TtT/Tvv>0.9999999 && TtT/Tvv<1.0000001);//���x�m�F
	//���̓���ꂽ���ϐ����g���Ēl��Ԃ��B�l�̎������Ń��[�v
	var Result=new Array(Vstart.length);
	for(i=0;i<Vstart.length;i++)
	{Result[i]=nas.bezier(Vstart[i],Vcp1[i],Vcp2[i],Vend[i],Tt)}
	return Result;
}	}	}

}

/*	���C���ݒ�
���C���̃����o�̓^�C�����C��
�f�t�H���g�ňȉ��̃^�C�����C��������B
�^�C�����}�b�v**
�A���J�[�|�C���g
�ʒu
��]
�s�����x
�J���Z��**
���C�v
�G�N�X�v���b�V����
	**��́A��܂҂�̂�
*/
function FakeLayer()
{

	this.width		=	640	;
	this.height		=	480	;
	this.pixelAspect	=	1	;
	this.frameRate		=	24	;
	this.duration		=	0	;
	this.activeFrame	=	0	;
//
		this.inPoint	=	0	;
		this.outPoint	= this.duration	;
//�^�C�����C���v���p�e�B�Ȃ̂Ōォ�珉����?��܂҂�ł͓��ɏ��������Ȃ��B
this.init= function(){

this.timeRemap	= new TimeLine("timeRemap");
	this.timeRemap.push(new KeyFrame(0,"blank"));
this.anchorPoint = new TimeLine("anchorPoint");
	this.anchorPoint.push(new KeyFrame(0,[this.width/2,this.height/2,0])) ;
this.position = new TimeLine("position");
	this.positiont.push(new KeyFrame(0,[thisComp.width/2,thisComp.heigth/2,0])) ;
this.rotation = new TimeLine("rotation");
	this.rotation.push(new KeyFrame(0,[0,0,0])) ;
this.opacity = new TimeLine("opacity");
	this.opacity.push(new KayFrame(0,100)) ;
}

};
//	new FakeLayer();
	FakeLayer.prototype=new Carrier();
	FakeLayer.prototype.constructor=FakeLayer;
//		inherit(FakeLayer,Carrier);//Carrier�̃��\�b�h���擾

FakeLayer.prototype.setClip=function(ip,op){
	if (ip && ip>=0 && ip<=duration) this.inPoint=ip;
	if (op && op>=0 && op<=duration) this.outPoint=op;
return [ip,op];
};
/*
FakeLayer.prototype.=function(){
};
FakeLayer.prototype.=function(){
};
FakeLayer.prototype.=function(){
};
*/
//	�R���|�W�V�����ݒ�
//	�R���|�W�V�����R���X�g���N�^
/*
function FakeComposition()
{
	this.width		=	640	;
	this.height		=	480	;
	this.pixelAspect	=	1	;
	this.frameRate		=	24	;
	this.duration		=	0	;
};
*/
function FakeComposition(w,h,a,l,f)
{
	this.layers=new Array();
		if (! w)	w	=640	;
		if (! h)	h	=480	;
		if (! a)	a	=1	;
		if (! l)	l	=6	;
		if (! f)	f	=24	;
	this.width	=w	;//��(�o�b�t�@���Epx)
	this.height	=h	;//����(�o�b�t�@�����Epx)
	this.pixelAspect=a	;//�s�N�Z���c����
	this.duration	=l	;//����(�p�����ԁE�b)
	this.framerate	=f	;//�t���[�����[�g(fps)
};
//	�_�~�[������
//	new FakeComposition();
	FakeComposition.prototype=new Carrier();
	FakeComposition.prototype.constructor=FakeComposition;
	
//		inherit(FakeComposition,Carrier);//Carrier�̃��\�b�h���擾
//		inherit(FakeComposition,Array);//�z��Ƃ��Ẵ��\�b�h���擾

//	���\�b�h�ݒ�
function frame_duration_(){return 1/this.framerate;}

FakeComposition.prototype.frameDuration	=frame_duration_	;
FakeComposition.prototype.frame_duration	=frame_duration_	;





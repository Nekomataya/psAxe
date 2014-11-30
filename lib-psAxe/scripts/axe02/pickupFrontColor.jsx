/*(�O�i�F�̐F�g���X�𒊏o)
	Photoshop�p�A�j���d�グ�X�N���v�g

	�O�i�F�𒊏o�������F�g���X�̐F�ɂ��āA���̃X�N���v�g�����s���܂��B
	�_�C�A���O���o��̂ŕK�v�ɂ��������Ĕ��������āA[OK]�{�^�����N���b�N���܂��B
	psPaint pickupColor... �t�B���^���g�p���܂��̂ŁA���炩���߃C���X�g�[�����Ă����Ă��������B 

Nekomataya/kiyo 2008
*/

/* ����Ȋ֐���?
	applyFilter(filterDescription,[[control,value]],dialog)
����
	filterDesctiotion	�t�B���^�L�q �J�e�S��+�t�B���^��(������)
	control	�R���g���[���L�q(������)
	value	�R���g���[���̒l(���l)
	dialog	�_�C�A���O���[�h(������ "ALL""ERROR""NO")[�ȗ���]
�߂�l
	���ɂȂ�(undefeined)
 */
applyFilter=function(fD,fVA,dMode){
if (fVA instanceof Array){
if (! dMode){dMode="NO";};
if (! dMode.match(/(ALL|ERROR)/)){dMode="NO";};
	var actionID = stringIDToTypeID(fD);
	var myDescription = new ActionDescriptor();
	var id=new Array();

	for(idx=0;idx<fVA.length;idx++){
		id[idx] = charIDToTypeID( fVA[idx][0]);
		myDescription.putInteger( id[idx], fVA[idx][1]);
	}
	myMode=eval("DialogModes."+dMode);
	executeAction( actionID, myDescription, myMode );
}else{return false;};//
}
// �J���[�l�擾
var r=app.foregroundColor.rgb.red;
var g=app.foregroundColor.rgb.green;
var b=app.foregroundColor.rgb.blue;

	var i=(76*r+150*g+29*b)/255;
	var u=(b-i);
	var v=(r-i);
//	var u=(b-i)*0.24;
//	var v=(r-i)*0.44;
//	var u=(b-i)*0.493;
//	var v=(r-i)*0.877;
var s=0;
	if(u==0){
		if(v>=0){s=90;}else{s=-90;}
	}else{
		s=180. * (Math.atan(v/u)/Math.PI);
	}
	if((u<0) && (v>0)){ s+=180};
	if((u<0) && (v<0)){ s+=180};
	if((u>0) && (v<0)){ s+=360};
var m=Math.sqrt(u*u+v*v);

/*
var myResult	="r : "+Math.floor(r)+"\tg : "+Math.floor(g)+"\tb : "+Math.floor(b)+"\n";
myResult	+="=================================\n";
myResult	+="Y : "+Math.floor(i)+"\tB-Y : "+Math.floor(u)+"\tR-Y : "+Math.floor(v)+"\n";
myResult	+="s = " + Math.floor(s*255/360)%255 +"/255\n";
myResult	+="S = " + Math.floor(s*1023/360)%1023 +"/1023\n";
myResult	+="m = " + Math.floor(m) ;

alert(myResult);
*/
var targetColor=Math.floor(s*255/360)%255;

//applyFilter("psPaint trace_B...",[["cTl0",127],["cTl1",127],["cTl2",127],["cTl3",255],["cTl4",0]]);
applyFilter("psPaint pickup_Color...",[["cTl0",targetColor],["cTl1",127],["cTl2",32],["cTl3",255],["cTl4",0]],"ALL");


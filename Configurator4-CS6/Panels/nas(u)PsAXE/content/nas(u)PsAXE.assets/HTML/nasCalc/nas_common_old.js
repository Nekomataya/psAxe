/*
nas_common.js
���Ѳ�ǽ������ץ���ʬ

--- �����Ȥ��
���Υץ���������ϡ֤ͤ��ޤ���פˤ���ޤ���

���ʤ��ϡ����Υץ����Τ������ɽ������Ѥ��ʤ�������
��ͳ�˥ץ����λ��ѡ�ʣ���������ۤʤɤ�Ԥ����Ȥ��Ǥ��ޤ���

���ʤ��ϡ����Υץ����򼫸ʤ���Ū�ˤ������äƲ�¤���뤳�Ȥ��Ǥ��ޤ���
���ξ�硢���Υץ������¤������ΤǤ��뤳�Ȥ��������ơ��������ɽ����
ź�դ���褦���ؤ�Ƥ���������

���Υץ�����Ȥ���Ȥ�ʤ��⤢�ʤ��μ�ͳ�ʤΤǤ���

��ԤϤ��Υץ�������Ѥ������Ȥˤ�äƵ����������ʤ�
�����פ��Ф��Ƥ���Ǥ���餤�ޤ���
���ʤ��ϡ����ʤ���Ƚ�Ǥ���Ǥ�ˤ����Ƥ��Υץ�������Ѥ���ΤǤ���

�ʤ󤫡����ä����Ȥ����ä���ʲ���Ϣ���Ƥ�館��Ȳ��Ȥ��ʤ뤫�⤷��ޤ���
http://homepage2.nifty.com/Nekomata/
mailto:nekomata_ya@mac.com

����ʴ����Ǥ���

�ɿ�
���Υץ����ϡ����ѤΥ⥸�塼�뷲�Ǥ���
�Ȥ߹��ߤǤĤ����뤫�ɤ����Ϻ�Ԥκ�Ȼ��֤ȥ��󥹤˺�������ޤ���
*/
/*��å����� (����̤���ѡ�
�ե졼��졼�Ȥ���å�����Ƥ���Τǡ���󥯤ϲ���Ǥ��ޤ���
�����٤���å�����Ƥ���Τǡ���󥯤ϲ���Ǥ��ޤ���
��������ꤷ�ʤ��Ǥ���������
����ͤ�����Ǥ��ޤ���
��å����������פ���
�ե饰���դ��ƥץ�ե���󥹤����򤵤��뤫?
*/
//	�ѿ������
var VER = "Ver.0.1 alpha";

//�ޥ����Хꥹ�饤���ѿ�
var Xoffset = 0;
var baseValue = 0;
var diffValue = 0;

//	���ִ�Ϣ����
// 	���״�Ϣ�Υե饰�����äƤ���ʤ����
//if (document.nasExchg.ExchgUnit.value.match(/Time/)=="Time") {}
var ccrate = 1000 ;	//�Ǿ���¬ñ��(javascript�Ǥϥߥ��ø���)
var MODE = "clock" ;	//ɽ���ν���⡼��(����)
var ClockOption = 12 ;	//���פν���⡼�� (12����)
var STATUS = "stop" ;
//	�ե졼��졼��	�������¤Ӥǥ롼�פ��롡RT 24FPS 30NDF 30DF 25FPS
RATEs = ["100","24FPS","30NDF","30DF","25FPS"];
var RATE = "24FPS" ;
//	FCT���󥿡��ե�������Ϣ
var SheetLength = 144;//�����ॷ���ȷ�³���� �ե졼��/��
//����ѿ�
//̾���դ���§�ϡ��ʲ��˽ऺ��
//������ץȾ���ѿ�̾�ϡ���ʸ���Τ�
//�ե�������Ʊ̾�Υ�����Ȥ� ��ʸ�����֤���� ��ʸ�����֤꽪��뵭ˡ��
//ʣ��ñ��ϡ����ָ��ʸ�������ָ����ʸ��
//	����ץ�����
var FRATE = 24;//����ץ�ե졼��졼��(�ե졼���³���֤��֤������뤫���)
var RESOLUTION = 144. / 2.540 ;//����ץ������ppc(dpc)
var LENGTH = 225. ;//����ץ�����ˡ(mm)
var FRAME_L=100 ;//����ץ���ե졼��(fl)
//Frame of Location ���˥᡼����󻣱ƥե졼��(traditional)
//����ͤϷ׻��쥿���ե졼�����ˤ����ۤ����׻�����������餫���ꤽ��?
var SCALE = 1;//����ץ������Ψ(�¿�)
// for AEkey
//	����ݥ�����󣳣ĥ�������
var FOCUS_D = 50; //��󥺾�����Υ (mm)
var FILM_W = 36;//FILM Width (mm)
var FILM_H = 24;//FILM Height(mm)
var IMAGE_CR = Math.sqrt(Math.pow(FILM_W,2)+ Math.pow(FILM_H,2));//���᡼����������ľ��(mm)
//	����ݥ����������
var COMP_W = 720;//comp Width (px);
var COMP_H = 486;//comp Height(px);
var COMP_A = 0.9;//comp Aspect(W/H);
var COMP_D = Math.sqrt(Math.pow(COMP_W * COMP_A,2)+ Math.pow(COMP_H,2));
var CAMERA_D = (COMP_D * FOCUS_D)/ IMAGE_CR;
//	�쥤�䡦�եåơ�������
//���ΤȤ�������ź�դ����������(�Ѵ��ˤ�̵�ط�)
var SRC_W = 720;//source Width (px);
var SRC_H = 486;//source Height(px);
var SRC_A = 0.9;//source Aspect(W/H);
// AE-Key data ���ϴ�Ϣ���ѿ�(�����)
var AE_Ver = "5.0";// 4.0/5.0/6.0
var KEY_STYLE = "withTime";//or "valueOnly"
var KEY_TYPE = "Scale";// or "Position"

//���ѿ� ���ѿ�����Ƴ�����ɽ���ǡ���(�ޤ��������ǡ���)
//�ѿ�̾�ϡ���ʸ���ǤϤ��ޤ� ���Ͼ�ʸ���Τ�
//�ե�������Ʊ̾��input�϶�����ʸ���Τߤ�ɽ��
//RESOLUTION �����ѿ�
var Dpi = RESOLUTION * 2.540 ;
var Dpc = RESOLUTION ;
//FRAME_L �����ѿ�
var FRAMEl = FRAME_L;
var FRAMEr = fl2fr(FRAME_L);

/*
	nas ���̥饤�֥��
���ش�Ϣ�Ȥ�������Ϣ������ͤΤ���ؿ���
*/
//
/*	��Υ��Ϣ�����ؿ�
dt2sc(AE��Z������)	�����:���֤�����������Ψ
sc2dt(��Ψ)	�����:��Ψ����������AE��Z������
*/
function dt2sc(dt){return (CAMERA_D/((1 * dt) + CAMERA_D))}
function sc2dt(sc){return ((CAMERA_D/(1 * sc))-CAMERA_D)}
/*	�ե졼���Ϣ�����ؿ� �졹�񤤤Ƥ�ְ㤨�����ʤΤǤޤȤ�Ƥ�����
fl �ϡ�����Υ��˥᡼����󻣱ƥե졼�ࡦ�������������100
fr �ϡ��쥿�����ƥե졼��(�׸���)��Ʊ�������������100
sc �ϡ���Ψ
FRAME_L�ϡ����þ���Ȥ��ƴ��ե졼�����fl�ͤ�Ϳ���뤳��
*/
function fl2fr(fl){return ((fl * 1 + 60)/1.60)}
function fr2fl(fr){return ((fr * 1.60)-60)}
/*
*/
function fl2sc(fl){return ((160*((FRAME_L * 1)+60))/(160*((fl*1)+60)))}
function fr2sc(fr){return (fl2sc(fr2fl(fr)))}
function sc2fl(sc){return ((((160 * (FRAME_L + 60))/(sc * 1))/160) - 60)}
function sc2fr(sc){return (fl2fr(sc2fl(sc)))}

// ����Ψ�Ѵ��ؿ�
// kac(�����,��ɸ��,���ѿ�)
// ����ͤ� ����Ψ��¿���

function kac(StartSize,EndSize,timingValue) {
if (timingValue == 0 || timingValue == 1){
	if (timingValue == 0) {resultS = StartSize}
	if (timingValue == 1) {resultS = EndSize}
} else {
/*
������ˡ��

�ޤ�������ˡ��1�Ȥ��ƽ�λ��ˡ����Ψ����� EndSize/Startsize

��Υɾ�������Ȥ��� ��εտ��򳫻����Ƚ�λ���ǵ��롣
��������Υɾ������ 1/1 = 1
��λ����Υɾ������ 1/(EndSize/Startsize) = Startsize/EndSize

Ϳ����줿���ѿ��ˤ������äƵ�Υɾ����������롣
((��λ����Υɾ������ - ��������Υɾ������) * ���ѿ�) + ��������Υɾ������
= (((Startsize/EndSize) - 1) * timingValue) + 1
�տ���Ȥä���Ψ������
������ˡ�˳ݤ���
������ˡ * ��Υɾ������
= StartSize / ((((Startsize/EndSize) - 1) * timingValue) + 1)
*/
//	resultS = (1-(timingValue)*(1-(StartSize/EndSize)));
resultS = StartSize / ((((StartSize/EndSize) - 1) * timingValue) + 1)

}
return (resultS);
}
//�մؿ�
//cak(�����,��ɸ��,����Ψ)
//����ͤϽ��ѿ���������٤�

function cak(StartSize,EndSize,scaleValue) {
return ("resultT");
}

// ������� ZERROfilling
function Zf(N,f) {
var prefix="";
if (N < 0) {N=Math.abs(N);prefix="-"}
if (String(N).length < f) {
	return prefix + ('00000000' + String(N)).slice(String(N).length + 8 - f , String(N).length + 8);
} else {return String(N);}
}
//���֥ե졼���Ѵ�
function ms2fr(ms){return (Math.floor(FRATE*(ms/1000)))}
//function ms2fr(ms){return (FRATE*(ms/1000))}
function fr2ms(frm){return (1000*frm/FRATE)}
function ms2FCT(ms,type,ostF){return Frm2FCT(Math.floor(FRATE * ms /1000),type,ostF)}
function FCT2ms(fct){return 1000*(FCT2Frm(fct))/FRATE}

//������ʸ��������
function Frm2FCT(frames,type,ostF) {
var negative_flag = false;
if (frames < 0) {frames = Math.abs(frames);negative_flag=true;}
	if (ostF == 1) {
		PostFix = ' _';
	} else {
		ostF = 0;
		PostFix = ' .';
	}
//
//	default	00000
//	type 2	0:00:00
//	type 3	000 + 00
//	type 4	p 0 / 0 + 00
//	type 5	p 0 / + 000
//
var m = Math.floor((frames + ostF) / (FRATE * 60));
 var s = Math.floor((frames + ostF) / FRATE);
  var SrM = s % 60;
   var p = Math.floor(frames / SheetLength ) + 1;
    var FrS = ((frames + ostF) % FRATE);
     var FrP = (frames % SheetLength) + ostF;
      var SrP = Math.floor(((frames % SheetLength) + ostF) / FRATE)

switch (type) {
case 5: Counter ='p ' + Zf(p,1) + ' / + ' + Zf(FrP,3) + PostFix ;break;
case 4: Counter ='p ' + Zf(p,1) + ' / ' + SrP +' + ' + Zf(FrS,2)+ PostFix ;break;
case 3: Counter =Zf(s,1) + ' + ' + Zf(FrS,2) + PostFix ;break;
case 2: Counter =Zf(m,1) + ':' + Zf(SrM,2) + ':' + Zf(FrS,2) + PostFix ;break;
default: Counter =Zf(frames + ostF ,4) + PostFix ;
}
if (negative_flag) {Counter="-( " + Counter +" )"}
 return Counter;
}
//������ʸ������0�������ȤΥե졼���ͤ��֤�
//������ʸ����ʳ��ˤ�'����ʸ����'���֤�[�����ѹ�]
function FCT2Frm(fct) {
	var fpsC = FRATE;
	fct = fct+"";
//ʸ����κǴ���ʸ����ɾ�����ƥ��ꥸ�͡����������
	if (fct.charAt(fct.length - 1)=='_') {
		ostF = 1;
		PostFix = '_';
	} else {
		ostF = 0;
		PostFix = '.';
	}
//ʸ����κǴ���ʸ�����ݥ��ȥե��å����ʤ��ڤ�Τ�
	if (fct.charAt(fct.length - 1)==PostFix) {
		fct = fct.slice(0,-1)
	}
//����������
	fct = fct.replace(/\ /g,'')
//Ƚ��
//	if (fct.match(/[0-9\:\p\/\+]/)) {return fct}
// �������ѿ������
	var p=1;
	 var h=0;
	  var m=0;
	   var s=0;
	    var k=0;
//	type 1	00000
	if (fct.match(/^[0-9]+$/)) {
		k=fct;
	} else {
//	type 2	0:00:00
	if (fct.match(/^([0-9]+:){1,3}[0-9]+$/)) {
//TC�ʤΤǥ��ץ�åȤ�������������
		tmpTC=new Array()
		tmpTC=fct.split(":")
		switch (tmpTC.length) {
case 4:	 h=tmpTC[tmpTC.length - 4];
case 3:	  m=tmpTC[tmpTC.length - 3];
case 2:	   s=tmpTC[tmpTC.length - 2];
case 1:	    k=tmpTC[tmpTC.length - 1];
		}
	} else {
//	type 3	000 + 00
	if (fct.match(/^[0-9]+\+[0-9]+$/)) {
		s=fct.substring(0,fct.search(/\+/));
		 k=fct.substr(fct.search(/\+/)+1);
	} else {
//	type 4	p 0 / 0 + 00
	if (fct.match(/^p[0-9]+\/[0-9]+\+[0-9]+$/)) {
		p=fct.slice(1,fct.search(/\//));
		 s=fct.substring(fct.search(/\//)+1,fct.search(/\+/));
		  k=fct.substr(fct.search(/\+/)+1);
	} else {
//	type 5	p 0 / + 000
	if (fct.match(/^p[0-9]+\/\+[0-9]+$/)) {
		p=fct.slice(1,fct.search(/\//));
		  k=fct.substr(fct.search(/\+/)+1);
	} else {
// �������
	return fct;
		}}}}}
// ���Ͳ��������û�
 p=parseInt(p,10);
  h=parseInt(h,10);
   m=parseInt(m,10);
     s=parseInt(s,10);
      k=parseInt(k,10);
var Frame=(p-1) * (fpsC * SheetLength) + h * (fpsC * 60 * 60) + m * (fpsC * 60) + s * (fpsC) + k - ostF;
 return Frame;
}





/* 
	��ƻ��Ȣ���ѥǡ������ؿ���
���������̤ǤĤ�������

*/
//������Ȥ��ͤ򤹤٤ƥХå����å�(����ʽ����κǸ�˸Ƥ�)
function updateBk() {
	for (n = 1 ; n< BkValue.length ; n++) {
	elName = ElementName[n];
	BkValue[n] = document.nasExchg.elements[elName].value }
}
//��ƻ��Ȣ���ѥǡ������ؿ��������
/*
	����Ϣ
���ޤ�Ĥ��äƤʤ�
*/
//	������������ʡ�
Log = new Array() ;
function nas_Push_Log(str) {Log = Log.concat([str])}
//	�� ��������Ƥߤ�
nas_Push_Log( "Program Started " + VER);
nas_Push_Log( Date() );
nas_Push_Log( "  FrameRate" + FRATE + "(" + FRATE + ")");
//nas_Push_Log( "  Start Mode  [" + MODE + "]" );
//

/*
	�ޥ����Хꥹ�饤��
�񤤤ƤϤߤ���
����� �Ҥ�äȤ��Ƥʤ󤫤Υѥƥ�Ȥˤդ���ͤʵ������Ƥʤ�ʤ���
��Ĵ��
�����Ȥ�input���֥������Ȥϡ��ʲ��ν񼰤�sliderVALUE��Ƥ�
sliderVALUE([event,�������̾,���,����,���(,�����)]);
����ͤ������ȥ�å�����ư����ɲ�TC��Ϣ�γ�ĥ�ޤ�(04.06.06)
*/
function sliderVALUE(chnk) {
//����Ǽ����Ϥ� [���٥��,�������̾,���,����,���(,�ǥե������)]
	Xoffset = chnk[0].screenX;

	slfocus = chnk[1];
	slmax = 1*chnk[2];
	slmin = 1*chnk[3];
	slstp = 1*chnk[4];
//��å�����Ƥ�����⡼���ѹ��ʤ��ǥ꥿����
if (document.nasExchg.elements[slfocus].disabled == true) {return false}
//����ͼ���
if (document.nasExchg.elements[slfocus].value == "--") {
	if (chnk.length == 6){baseValue = 1*chnk[5]} else {baseValue = slmin}
} else {
	baseValue = 1 * (document.nasExchg.elements[slfocus].value);
}
//�������륨����ȤΥ�������󥸤���α���ƥ��饤���⡼�ɤ�����
	document.nasExchg.elements[slfocus].blur();
//	document.nasExch.elements[slfocus].onchange = '';
switch (navigator.appName) {
case "Opera":
case "Microsoft Internet Explorer":
	document.body.onmousemove = MVSlider_IE;break;
case "Netscape":
	document.body.onmousemove = MVSlider_NS;break;
default:	return;
}
	document.body.onmouseup = sliderOFF;
}
function sliderOFF() {
//	document.nasExchg.elements[slfocus].focus();
	document.body.onmousemove = null;
	document.body.onmouseup = null;
//���饤���⡼�ɽ�λ���Ƴ������륨����ȤΥ�������󥸤�����
//	document.nasExch.elements[slfocus].onchange = 'CHK_VALUE';
//���饤�����ͤ������ͤȰۤʤäƤ������Τ߹���
if (document.nasExchg.elements[slfocus].value != baseValue) {CHK_VALUE()}
	return;
}
function MVSlider_NS(event) {
	diffValue = event.screenX - Xoffset;
	if (diffValue >= 0) {Flgl = 1} else {Flgl= -1}
//����ޤ������ͤ�Ȥ�
	newValue = baseValue + (Flgl * (Math.pow(diffValue/100,2)*100));
//��²��¤Ǥ�������
	if (newValue > slmax) {newValue = slmax} {
		if (newValue < slmin) {newValue = slmin}
	}
//���ƥåפǷ����
	var exN = Math.pow(10,slstp);
	newValue = Math.floor(newValue * exN)/exN;
if(document.nasExchg.elements[slfocus].value != newValue) {
	document.nasExchg.elements[slfocus].value = newValue ;
}
}

function MVSlider_IE() {
	diffValue = event.screenX - Xoffset;
	if (diffValue >= 0) {Flgl = 1} else {Flgl= -1}
//����ޤ������ͤ�Ȥ�
	newValue = baseValue + (Flgl * (Math.pow(diffValue/100,2)*100));
//��²��¤Ǥ�������
	if (newValue > slmax) {newValue = slmax} {
		if (newValue < slmin) {newValue = slmin}
	}
//���ƥåפǷ����
	var exN = Math.pow(10,slstp);
	newValue = Math.floor(newValue * exN)/exN;
if(document.nasExchg.elements[slfocus].value != newValue) { document.nasExchg.elements[slfocus].value = newValue }
}
//�ޥ����Хꥹ�饤����Ϣ��λ


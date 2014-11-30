//Photoshop用スクリプト
/*	前景色からpsPaint互換色値を取得	*/

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


var myResult	="r : "+Math.floor(r)+"\tg : "+Math.floor(g)+"\tb : "+Math.floor(b)+"\n";
myResult	+="=================================\n";
myResult	+="Y : "+Math.floor(i)+"\tB-Y : "+Math.floor(u)+"\tR-Y : "+Math.floor(v)+"\n";
myResult	+="s = " + Math.floor(s*255/360)%255 +"/255\n";
myResult	+="S = " + Math.floor(s*1023/360)%1023 +"/1023\n";
myResult	+="m = " + Math.floor(m) ;

alert(myResult);

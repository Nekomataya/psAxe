//�@��ƃp�X��fill���č�ƃp�X���폜����B(�O�i�F�E�p�X����E�A���`�G���A�Xoff)
 if((app.activeDocument.pathItems.length)&&(app.activeDocument.pathItems[0].kind==PathKind.WORKPATH)){
var myPathFill="var myPath=app.activeDocument.pathItems[0];";
//��ƃp�X�����M�ŕ`��
    myPathFill+="myPath.fillPath(app.foregroundColor,ColorBlendMode.NORMAL,100.0,false,0.0,false,true);";
//��ƃp�X���폜
    myPathFill+="myPath.remove();";
 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory("�p�X��h�ׂ�", myPathFill);
 }else{
     eval(myPathStroke);
 }
}

//�@��ƃp�X�����M�ŃX�g���[�N���č�ƃp�X���폜����B�v���b�V���Ȃ��B
 if((app.activeDocument.pathItems.length)&&(app.activeDocument.pathItems[0].kind==PathKind.WORKPATH)){
var myPathStroke="var myPath=app.activeDocument.pathItems[0];";
//��ƃp�X�����M�ŕ`��
    myPathStroke+="myPath.strokePath(ToolType.PENCIL,false);";
//��ƃp�X���폜
    myPathStroke+="myPath.remove();";
 if(app.activeDocument.suspendHistory){
     app.activeDocument.suspendHistory("�p�X���X�g���[�N", myPathStroke);
 }else{
     eval(myPathStroke);
 }
}

//簡易マップオブジェクト

psMapElement=function(myParentGroup,myName,myLayer)
{
	this.parent=myParentGroup;
	this.name=myName;
	this.body=myLayer;
	this.index=this.parent.elements.length;
}
psMapGroup=function(myMap,nameLabel,lot,myLayer)
{
	this.parent=myMap;
	this.body=myLayer;
	if(! nameLabel){nameLabel="";};//明示的に
	this.name=nameLabel;
	if(!lot){lot=0;};//最低0枚
	this.elements=new Array();//エレメントトレーラ
	if(lot){for(var idx=lot-1;idx>=0;idx--){this.elements.push(new psMapElement(this,this.body.layers[idx].name,this.body.layers[idx] ) )}}
}

var myPsMap=new Object();
	myPsMap.body=app.activeDocument;
	myPsMap.groups=new Array;//mapトレーラ
//トレーラにグループを登録　グループ自身がエレメントを登録する
for(var gIdx=myPsMap.body.layers.length-1;gIdx>=0;gIdx--){
	myPsMap.groups.push( new psMapGroup( myPsMap,myPsMap.body.layers[gIdx].name,myPsMap.body.layers[gIdx].layers.length,myPsMap.body.layers[gIdx] ) );
}


//myPsMap.groups[2].elements[0].body.visible=true;

for(var gidx=0;gidx<myPsMap.body.layers.length;gidx++){
	for(var eidx=0;eidx<myPsMap.groups[gidx].elements.length;eidx++){
		var myLayer=myPsMap.groups[gidx].elements[eidx].body;
		var myName=[myPsMap.groups[gidx].body.name,eidx+1].join("-")
			if(myLayer.name!=myName){myLayer.name=myName}
		}	
	}
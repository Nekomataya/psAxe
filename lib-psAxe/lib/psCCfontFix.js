//
// PSCCFontSizeFix.jsx
//   setFontSizePoints
//   setFontSizePixels
//
// This file contains a couple of functions that work around
// a bug in PSCC+ that prevents setting the size of the font
// for text layer via the DOM. There is also a test function
// provided.
// 
// NOTE: This function will bash both the font typeface and
//       contents of thelayer so it's best to use it right
//       after creating the layer.
//
// $Id: PSCCFontSizeBugFix.jsx,v 1.6 2014/10/19 01:13:04 xbytor Exp $
// Copyright: (c)2014, xbytor
// License: http://www.opensource.org/licenses/bsd-license.php
// Contact: xbytor@gmail.com
//
//　元コードを nas(u)psAxe にソースコードに組み込むために親クラスを設定
// 改変部分を含めこのコードを原コードのライセンスに従うものとします
// Copyright: (c)2014, kiyo@nekomataya.info
// License: http://www.opensource.org/licenses/bsd-license.php
// Contact: kiyo@nekomataya.info
////


if(nas){
nas.PSCCFontSizeFix = {
};
nas.getRootDocument = function(myLayer){var result=myLayer.parent;while (!(result instanceof Document)){result=result.parent};return result;};

nas.setActive=function(myLayer){app.activeDocument=nas.getRootDocument(myLayer);app.activeDocument.activeLayer=myLayer;}


nas.PSCCFontSizeFix.setFontSizePoints = function(layer, pt) {
	nas.setActive(layer);
  function cTID(s) { return app.charIDToTypeID(s); };
  function sTID(s) { return app.stringIDToTypeID(s); };

  var magicNumber = cTID("0042");

  var desc23 = new ActionDescriptor();  

    var ref6 = new ActionReference();  
    ref6.putProperty( cTID('Prpr'), cTID('TxtS') );  
    ref6.putEnumerated( cTID('TxLr'), cTID('Ordn'), cTID('Trgt') );  
  desc23.putReference( cTID('null'), ref6 );  

    var desc24 = new ActionDescriptor();  
    desc24.putInteger( sTID('textOverrideFeatureName'), magicNumber );  
   desc24.putInteger( sTID('typeStyleOperationType'), 3 );  
    desc24.putUnitDouble( cTID('Sz  '), cTID('#Pnt'), pt );  
  desc23.putObject( cTID('T   '), cTID('TxtS'), desc24 );
 
  executeAction( cTID('setd'), desc23, DialogModes.NO );  
  return;

};
nas.PSCCFontSizeFix.setFontSizePixels = function(layer, px) {
	nas.setActive(layer);
  function cTID(s) { return app.charIDToTypeID(s); };
  function sTID(s) { return app.stringIDToTypeID(s); };

  var magicNumber = cTID("0042");

  var desc23 = new ActionDescriptor();  

    var ref6 = new ActionReference();  
    ref6.putProperty( cTID('Prpr'), cTID('TxtS') );  
    ref6.putEnumerated( cTID('TxLr'), cTID('Ordn'), cTID('Trgt') );  
  desc23.putReference( cTID('null'), ref6 );  

    var desc24 = new ActionDescriptor();  
    desc24.putInteger( sTID('textOverrideFeatureName'), magicNumber );  
    desc24.putInteger( sTID('typeStyleOperationType'), 3 );  
    desc24.putUnitDouble( cTID('Sz  '), cTID('#Pxl'), px );  
  desc23.putObject( cTID('T   '), cTID('TxtS'), desc24 );
 
  executeAction( cTID('setd'), desc23, DialogModes.NO );  
  return;
};


nas.PSCCFontSizeFix.test = function() {
  var doc = app.documents.add(UnitValue("5 in"), UnitValue("7 in"), 300);
  var layer = doc.artLayers.add();  
  layer.kind = LayerKind.TEXT;  
  layer.name = "Test";  
  var titem = layer.textItem;

  titem.size = new UnitValue("50", "pt");
  
  if (Math.round(titem.size.as("pt")) != 50) {
    nas.PSCCFontSizeFix.setFontSizePoints(layer, 50);
  }
  
  titem.contents = "This text should be 50pt";  
  titem.font = "Monaco";
  alert(Math.round(titem.size.as("pt")) + " pt");

  doc.close(SaveOptions.DONOTSAVECHANGES);

  var doc = app.documents.add(UnitValue("5 in"), UnitValue("7 in"), 300);
  var layer = doc.artLayers.add();  
  layer.kind = LayerKind.TEXT;  
  layer.name = "Test";  
  var titem = layer.textItem;
  titem.size = new UnitValue("50", "px");
  
  if (Math.round(titem.size.as("px")) != 50) {
    nas.PSCCFontSizeFix.setFontSizePixels(layer, 50);
  }
  
  titem.contents = "This text should be 50px/12pt";  
  titem.font = "Monaco";
  alert(Math.round(titem.size.as("px")) + " px");

//  doc.close(SaveOptions.DONOTSAVECHANGES);
};
};
//nas.PSCCFontSizeFix.test();

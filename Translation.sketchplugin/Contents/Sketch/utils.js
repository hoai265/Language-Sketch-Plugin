function alert(title, message){
  var app = [NSApplication sharedApplication];
  [app displayDialog:message withTitle:title];
}

function isTextLayer(layer){
	if (layer.class() === MSTextLayer) {
            return true;
    }

    return false;
}

function isNeedTranslate(layer){
  var layerName = layer.name();
  if(layerName.indexOf("o_") == -1)
        return false;
    
  return true;	
}


function isExistFilePath(filePath){
  var fileManager = [NSFileManager defaultManager];
  return [fileManager fileExistsAtPath:filePath];
}

function getTextLayersOfPage(pages) {
  var layers = [pages children];
  textLayers = [];

  for (var i = 0; i < layers.count(); i++) {
      var layer = [layers objectAtIndex:i];
      if (isTextLayer(layer) && isNeedTranslate(layer)) {
        textLayers.push(layer);
      }
  }

  return textLayers;
}

function getTextLayersOfSelections(selections) {
  var textLayers = [];

  for (var i = 0; i < selections.count(); i++) {
      var layer = [selections objectAtIndex:i];
      if (isTextLayer(layer) && isNeedTranslate(layer)) {
        textLayers.push(layer);
      }
  }

  return textLayers;
}
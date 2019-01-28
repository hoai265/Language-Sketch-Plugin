function alert(title, message){
  var app = [NSApplication sharedApplication];
  [app displayDialog:message withTitle:title];
}

function isTextLayer(layer) {
  return (layer.class() === MSTextLayer);
}

function isSymbol(layer) {
  return (layer.class() === MSSymbolInstance);
}

function isNeedTranslate(layer) {
  var layerName = layer.name();
  return (layerName.indexOf("o_") == 0);
}


function isExistFilePath(filePath){
  var fileManager = [NSFileManager defaultManager];
  return [fileManager fileExistsAtPath:filePath];
}

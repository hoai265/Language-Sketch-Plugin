@import 'utils.js'

function translateFile(context, filePath) {
  var currentString = NSString.stringWithContentsOfFile_encoding_error(filePath, 4, null);
  var currentJsonObject = JSON.parse(currentString.toString());
  var keys = currentJsonObject["keys"];

	var comboBoxContainer = [[NSView alloc] initWithFrame:NSMakeRect(0,0,200,25)];
	var comboxBox = [[NSComboBox alloc] initWithFrame:NSMakeRect(0,0,200,25)];
	[comboxBox addItemsWithObjectValues:keys];
	[comboxBox selectItemAtIndex:0];
	[comboBoxContainer addSubview:comboxBox];

	var languageDialog = [[NSAlert alloc] init];
	[languageDialog setMessageText:"Select language to translate"];
	[languageDialog addButtonWithTitle:'OK']
	[languageDialog addButtonWithTitle:'Cancel']
	[languageDialog setAccessoryView:comboBoxContainer]

	if ([languageDialog runModal] == 1000) {
		var keyIndex = [comboxBox indexOfSelectedItem];
		var currentPage = context.document.currentPage();
		translatePage(currentPage, currentJsonObject, keys[keyIndex]);
		alert("Translate","Completed!");
	}
}

function translatePage(page, jsonObject, languageKey) {
  var pageLayers = [page children];
  for (var i = 0; i < pageLayers.count(); i++) {
    var layer = [pageLayers objectAtIndex: i];
    if (isNeedTranslate(layer)) {
      if (isSymbol(layer)) {
        translateSymbol(layer, jsonObject, languageKey);
      } else if (isTextLayer(layer)) {
        translateTextLayer(layer, jsonObject, languageKey);
      }
    }
  }
}

function translateSymbol(symbol, jsonObject, languageKey) {
  var overrides = NSMutableDictionary.dictionaryWithDictionary(symbol.overrides());
  var translatedOverrides = translateSymbolOverrides(symbol, overrides, jsonObject, languageKey);
  symbol.overrides = translatedOverrides;
}

function translateSymbolOverrides(symbol, overrides, jsonObject, languageKey) {
  var keys = overrides.allKeys();
  for (var i = 0; i < keys.count(); i++) {
    var overrideIdKey = keys.objectAtIndex(i);
    if (overrides[overrideIdKey].class().isSubclassOfClass_(NSMutableDictionary.class())) {
      overrides[overrideIdKey] = translateSymbolOverrides(symbol, overrides[overrideIdKey], jsonObject, languageKey);
    } else if (overrides[overrideIdKey].class().isSubclassOfClass_(NSString.class())) {
      var localeKey = symbol.name() + "_" + overrideIdKey;
      if (jsonObject[localeKey]) {
        var localeObject = jsonObject[localeKey];
        overrides[overrideIdKey] = localeObject[languageKey];
      }
    }
  }

  return overrides;
}

function translateTextLayer(textLayer, jsonObject, languageKey) {
  var layerNameKey = unescape(textLayer.name());
  if (jsonObject[layerNameKey]) {
    var localeObject = jsonObject[layerNameKey];
    textLayer.setStringValue(localeObject[languageKey]);
    [textLayer adjustFrameToFit];
  }
}

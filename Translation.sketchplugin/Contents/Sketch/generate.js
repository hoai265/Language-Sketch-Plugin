@import 'utils.js'

function generateLanguageFile(doc) {
  var languageKeys = getLanguageKeys();
	var currentPage = doc.currentPage();
  var generateString = generateLanguageString(currentPage, languageKeys);
  saveToLanguageFile(generateString, doc);
  alert("Generate language file", "Success");
}

function generateLanguageString(page, languageKeys) {
  var localeObject = {};

  var keysArray = [];
  for (var keyIndex = 0; keyIndex < languageKeys.length; keyIndex++) {
    var key = languageKeys[keyIndex];
    keysArray.push(unescape(key));
  }
	localeObject["keys"] = keysArray;

	var pageLayers = [page children];
	for (var i = 0; i < pageLayers.count(); i++) {
		var layer = [pageLayers objectAtIndex: i];
		if (isNeedTranslate(layer)) {
			if (isSymbol(layer)) {
				generateSymbolLayer(layer, localeObject, languageKeys);
			} else if (isTextLayer(layer)) {
				var languageKey = unescape(layer.name());
				if(!localeObject[languageKey]) {
					localeObject[languageKey] = generateLocaleObject(layer.stringValue(), languageKeys);
				}
			}
		}
	}

	return JSON.stringify(localeObject, undefined, 2);
}

function generateSymbolLayer(symbol, localeObject, languageKeys) {
	var overrides = NSMutableDictionary.dictionaryWithDictionary(symbol.overrides());
	generateSymbolOverrides(symbol, overrides, localeObject, languageKeys);
}

function generateSymbolOverrides(symbol, overrides, localeObject, languageKeys) {
  var keys = overrides.allKeys();
  for (var i = 0; i < keys.count(); i++) {
    var index = keys.objectAtIndex(i);
    if (overrides[index].class().isSubclassOfClass_(NSMutableDictionary.class())) {
      generateSymbolOverrides(symbol, overrides[index], localeObject, languageKeys);
    } else if (overrides[index].class().isSubclassOfClass_(NSString.class())) {
      var languageKey = unescape(symbol.name() + "_" + index);
      if (!localeObject[languageKey]) {
        localeObject[languageKey] = generateLocaleObject(overrides[index], languageKeys);
      }
    }
  }
}

function generateLocaleObject(stringValue, languageKeys) {
  var contentObject = {};
  for (var keyIndex = 0; keyIndex < languageKeys.length; keyIndex++) {
    var key = languageKeys[keyIndex];
    contentObject[key] = unescape(stringValue);
  }

	return contentObject;
}

function saveToLanguageFile(string, currentDocument) {
    var translationFileURL = [[[currentDocument fileURL] URLByDeletingPathExtension] URLByAppendingPathExtension:@"json"];
    var saveFilePath = [translationFileURL path];
	var saveString = NSString.stringWithString(string + "");
	saveString.writeToFile_atomically_encoding_error(saveFilePath,
                                                             true,
                                                             NSUTF8StringEncoding,
                                                             null);
}

function addSelectionsToFile(context, filePath) {
	var currentString = NSString.stringWithContentsOfFile_encoding_error(filePath, NSUTF8StringEncoding, null);
	var localeObject = JSON.parse(currentString.toString());
	var languageKeys = localeObject["keys"];

	var pageLayers = context.selection;
	if (pageLayers.count() > 0) {
	  for (var i = 0; i < pageLayers.count(); i++) {
	    var layer = [pageLayers objectAtIndex: i];
	    if (isNeedTranslate(layer)) {
	      if (isSymbol(layer)) {
	        generateSymbolLayer(layer, localeObject, languageKeys);
	      } else if (isTextLayer(layer)) {
	        var languageKey = unescape(layer.name());
					if(!localeObject[languageKey]) {
						localeObject[languageKey] = generateLocaleObject(layer.stringValue(), languageKeys);
					}
	      }
	    }
	  }

		saveToLanguageFile(JSON.stringify(localeObject, undefined, 2), context.document);
	} else {
	  alert("Notification", "Please choose some layers!");
	}
}

function generateAndAddToFile(context) {
	var languageKeys = getLanguageKeys();
	var localeObject = {};

	var keysArray = [];
	for (var keyIndex = 0; keyIndex < languageKeys.length; keyIndex++) {
		var key = languageKeys[keyIndex];
		keysArray.push(unescape(key));
	}
	localeObject["keys"] = keysArray;

	var pageLayers = context.selection;
	if (pageLayers.count() > 0) {
		for (var i = 0; i < pageLayers.count(); i++) {
			var layer = [pageLayers objectAtIndex: i];
			if (isNeedTranslate(layer)) {
				if (isSymbol(layer)) {
					generateSymbolLayer(layer, localeObject, languageKeys);
				} else if (isTextLayer(layer)) {
					var languageKey = unescape(layer.name());
					if(!localeObject[languageKey]) {
						localeObject[languageKey] = generateLocaleObject(layer.stringValue(), languageKeys);
					}
				}
			}
		}

		saveToLanguageFile(JSON.stringify(localeObject, undefined, 2), context.document);
	} else {
		alert("Notification", "Please choose some layers!");
	}
}

function getLanguageKeys(){
	var inputKeyContainerView = [[NSView alloc] initWithFrame:NSMakeRect(0,0,200,25)];
	var textField = [[NSTextField alloc] initWithFrame:NSMakeRect(0,0,200,25)];

    [inputKeyContainerView addSubview:textField];

	var alertDialog = [[NSAlert alloc] init];
	[alertDialog addButtonWithTitle:"OK"];
	[alertDialog setMessageText:"Enter language keys. Ex: vi,en,us,.."];
	[alertDialog setAlertStyle:NSWarningAlertStyle];
	[alertDialog setAccessoryView:inputKeyContainerView]
	if ([alertDialog runModal] == NSAlertFirstButtonReturn) {
		var languageKeys = [[textField stringValue] componentsSeparatedByString:","];
		return languageKeys;
	}
}

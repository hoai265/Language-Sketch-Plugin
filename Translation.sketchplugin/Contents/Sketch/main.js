@import 'translate.js'
@import 'generate.js'
@import 'utils.js'

var onGenerate = function(context){
	var currentDocument = context.document;
    if (currentDocument == null) {
        alert("Generate","You need to save your document first!");
        return;
    } else {
    	var translationFileURL = [[[currentDocument fileURL] URLByDeletingPathExtension] URLByAppendingPathExtension:@"json"];
    	if(isExistFilePath([translationFileURL path])){
    		var alertDialog = [[NSAlert alloc] init];
			[alertDialog addButtonWithTitle:"OK"];
			[alertDialog addButtonWithTitle:"Cancel"];
			[alertDialog setMessageText:"Replace current file?"];
			[alertDialog setAlertStyle:NSWarningAlertStyle];
			if ([alertDialog runModal] == NSAlertFirstButtonReturn) {
				generateLanguageFile(currentDocument);
			}
    	} else {
    		generateLanguageFile(currentDocument);
    	}
    }
};

var onAddToLanguageFile = function(context) {
    var currentDocument = context.document;
    if (currentDocument == null) {
        alert("Add to language file","You need to save your document first!");
        return;
    } else {
        var translationFileURL = [[[currentDocument fileURL] URLByDeletingPathExtension] URLByAppendingPathExtension:@"json"];
        if(isExistFilePath([translationFileURL path])){
            addToFile(context,[translationFileURL path]);
        } else {
            generateAndAddToFile(context);
        }
    }
};

var onTranslate = function(context) {
var currentDocument = context.document;
    if (currentDocument == null) {
        alert("Translate","You need to save your document first!");
        return;
    } else {
        var translationFileURL = [[[currentDocument fileURL] URLByDeletingPathExtension] URLByAppendingPathExtension:@"json"];
        if(isExistFilePath([translationFileURL path])){
            translateFile(context,[translationFileURL path]);
        } else {
            alert("Translate","Not found language file!");
        }
    }
};

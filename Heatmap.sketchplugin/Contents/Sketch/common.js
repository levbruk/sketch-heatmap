// Hello <3

// Plugin handler
var context, document, plugin, page, artboard, app, selection, shortcut

@import "library.js"

var onRun = function(contextInput) {

	context = contextInput
	document = context.document
	plugin = context.plugin
	page = document.currentPage()
	artboard = page.currentArtboard()
	app = NSApplication.sharedApplication()
	selection = context.selection

	switch (shortcut) {
		case "generate":
			Generate()
			break
		case "settings":
			Settings()
			break
	}
}

function handle(query) {
	shortcut = query
}


// Genearate

function fetchImageForLayer(layer, url) {

}

/*
function get(url) {
	var request = NSURLRequest.requestWithURL(NSURL.URLWithString(url));
	var data = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, null, null);
	if (data) {
		return data
	} else {
		showMessage("Error in fetching data. Try again");
		return null;
	}
}
*/

const FillType = { Solid: 0, Gradient: 1, Pattern: 4, Noise: 5 }
const PatternFillType = { Tile: 0, Fill: 1, Stretch: 2, Fit: 3}

function drawHeatmap(layer) {
	var layerSizes = layer.frame()
	var plugin = context.command // to access the command needed to store info in the file
	// Create layer to fill
	//var originalSelection = context.selection // Checkpoint here
	var frame = layer.contentBounds()
	log(layer.contentBounds())
	var x = 0
	var y = 0
	var w = frame.size.width
	var h = frame.size.height
	var heatmapShape = MSRectangleShape.alloc().init()
	heatmapShape.frame().setX(x)
	heatmapShape.frame().setY(y)
	heatmapShape.frame().setWidth(w)
	heatmapShape.frame().setHeight(h)
	heatmapShape.setName("Heatmap")
	heatmapShape.setNameIsFixed(true)
	var heatmap = MSShapeGroup.shapeWithPath(heatmapShape)
	layer.addLayers([heatmap])
	setColor(heatmap, "#CBCBCB", 1)
	setOpacity(heatmap, 0)
	deselectAllLayers()

	//context.selection.push(heatmap) //.setIsSelected(true)

	var fill = heatmap.style().fills().firstObject()

	// *** Crashes on corrupt data or connection reset
	var imageURL = "https://workshop.levbruk.com/sketch-heatmap/api/"
	var image = uploadArtboard() //fetchImageForLayer(layer, imageURL)
	if (image) {
        fill.fillType = FillType.Pattern
        fill.patternFillType = PatternFillType.Fill
        fill.image = MSImageData.alloc().initWithImage(image)
		setOpacity(heatmap, 0.8)
    } else {
        showMessage("Sorry!")
    }
}


function uploadArtboard(){
 	var url = "https://workshop.levbruk.com/sketch-heatmap/image.php"
    var copy = [artboard duplicate]
    var slice = MSExportRequest.exportRequestsFromExportableLayer(copy).firstObject()
    [copy removeFromParent]
    slice.scale = 1
    slice.format = "jpg"
    var filePath = NSTemporaryDirectory() + "heatmap/" + artboard.objectID() + ".jpg"
    [document saveArtboardOrSlice:slice toFile: filePath]
    var task = NSTask.alloc().init()
    task.setLaunchPath("/usr/bin/curl")
	var args = ["-X", "POST", "-F", "image=@" + filePath, url]

	task.setArguments(args)
    var outputPipe = [NSPipe pipe]
    [task setStandardOutput:outputPipe]
    task.launch()
    var outputData = [[outputPipe fileHandleForReading] readDataToEndOfFile]

    //var outputString = [[[NSString alloc] initWithData:outputData encoding:NSUTF8StringEncoding]]
    //var outputArray = [NSJSONSerialization JSONObjectWithData:outputData options:NSJSONReadingAllowFragments error:nil]

	var image = NSImage.alloc().initWithData(outputData)
	return image
}


function Generate() {

	if (selection.count() == 0 ) {
		app.displayDialog_withTitle("For this plugin to work right you have to select an artboard", "No artboard selected")
	} else {
		var layer = selection[0];
		// is the current layer a shape layer?
		if ([layer class] == MSArtboardGroup) {
			showMessage("Working...")
			drawHeatmap(layer)

		} else {
			app.displayDialog_withTitle("You did run the plugin on “" + [layer name] + "” that is not an artboard. Select artboard to generate heatmap", "Heatmap works on artboards only")
		}
		showMessage("Done!")
	}

}



// Goodbye.

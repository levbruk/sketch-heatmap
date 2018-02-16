// Hi!

// Files stuff

// Get current directory path
function getCurrentDir() {
	if (document.fileURL() != null) {
		return document.fileURL().URLByDeletingLastPathComponent()
	} else {
		return NSURL.URLWithString("~/Desktop/") // Go to desktop if this file has no path
	}
}


// Sketch stuff

function is(layer, theClass){
	var klass = layer.class()
	return klass === theClass
}

function isPage(layer){
	return is(layer, MSPage)
}

function isGroup(layer){
	return is(layer, MSLayerGroup)
}

function isText(layer){
	return is(layer, MSTextLayer)
}

function isShape(layer){
	return is(layer, MSShapeGroup)
}

function deselectAllLayers() {
	for (var i = 0; i < context.selection.count(); i++) {
		context.selection.objectAtIndex(0).deselectLayerAndParent()
	}
}

// UI message

function showMessage(text) {
	document.showMessage(text)
}

function randomTextChance() {
	var emojisArray = ["🍒", "💩", "⭐️"]
	var randomEmoji = emojisArray[Math.floor(Math.random() * emojisArray.length)]
	var randomString = ""
	int dice = Math.floor((Math.random()*20)+1)
	if (dice == 20) { // Critical hit!
		randomString = " " + randomEmoji
	}
	return randomString
}


function setColor(layer, hex, alpha) {
	var color = MSColor.alloc().init(),
		rgb = hexToRgb(hex),
		red = rgb.r / 255,
		green = rgb.g / 255,
		blue = rgb.b / 255,
		alpha = (alpha && !isNaN(alpha) && (alpha <= 1 || alpha >= 0))? alpha: 1

	color.red = red
	color.green = green
	color.blue = blue
	color.alpha = alpha

	if (isText(layer)) {
		layer.textColor = color
	} else if (isShape(layer)) {
		layer.style().addStylePartOfType(0)
		var fills = layer.style().fills()
		//if (fills.count() <= 0) layer.style().addStylePartOfType(0) // Sketch 3.8 fix for -> //fills.addNewStylePart()
		layer.style().fills().objectAtIndex(0).color = color
	}
}

function setOpacity(layer, opacity) {
	if (isShape(layer)) {
		var fills = layer.style().fills()
		if (fills.count() > 0) {
			layer.style().contextSettings().setOpacity(opacity)
		}
	}
}

function setSize(layer, width, height, absolute) {
	if (absolute) {
		layer.absoluteRect().width = width
		layer.absoluteRect().height = height
	} else {
		layer.frame().width = width
		layer.frame().height = height
	}
	return layer
}

function setPosition(layer, x, y, absolute) {
	if (absolute){
		layer.absoluteRect().x = x
		layer.absoluteRect().y = y
	} else {
		layer.frame().x = x
		layer.frame().y = y
	}
	return layer
}

function getFrame(layer) {
	var frame = layer.frame()

	return {
		x: Math.round(frame.x),
		y: Math.round(frame.y),
		width: Math.round(frame.width),
		height: Math.round(frame.height)
	}
}

function getRect(layer) { // get rekt m8
	var rect = layer.absoluteRect()
	return {
		x: Math.round(rect.x),
		y: Math.round(rect.y),
		width: Math.round(rect.width),
		height: Math.round(rect.height)
	}
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null
}

// Bye.

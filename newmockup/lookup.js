/* 
 *  lookup.js - under construction
 *
 */

var directoryView = function () {

	var me = this;
	me.initDirectory();

};

directoryView.prototype.initDirectory = function () {

	var me = this;

	// Find alphabet and make each letter a link for searching
	var alphabetLinks = $( ".alphabet-links > h5" ).text();
	console.log( alphabetLinks );
	//Iterate through structure, making each element a link (skip whitespaces here)
	for (var i = 0; i < alphabetLinks.length; i++) {
		console.log(alphabetLinks[i]);
	}

};

// Initialize directory view
var directoryView = new directoryView;
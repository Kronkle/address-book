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

	// Select empty heading within alphabet-links
	var alphabetLinks = $( ".alphabet-links > h5" ).text();

	// Create array of letters wrapped within link tags for name searching
	var links = jQuery.map(('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split(''), function(i) {
		return '<a href="' + i + '">' + i + '</a>&nbsp';
	});
	console.log(links);

	// Populate empty heading with links
	$(".alphabet-links > h5").html(links);

	// Add an "All" link to the set of links
	$(".alphabet-links > h5").append('<a href="All">All</a>');
	
};

// Initialize directory view
var directoryView = new directoryView;
/* 
 *  lookup.js - Defines and instantiates directory view for homepage
 *
 *  	directoryView: 
 *  	initDirectory - retrieves people data and populates directory component with all names initially
 *		renderProfile - renders employee profile
 *		populateLinks - calls renderProfile on all names that begin with the search letter selected
 *		populateAllLinks - calls renderProfile on all employees
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
		return '<a class=\"name-link\">' + i + '</a>&nbsp';
	});
	console.log(links);

	// Populate empty heading with links
	$(".alphabet-links > h5").html(links);


	// Add an "All" link to the set of links
	$(".alphabet-links > h5").append('<a class=\"all-link\">All</a>');

	// Populate all employees upon first loading the directory
	me.populateAllLinks();

	// When specific search letter is clicked, populate employees with names starting with the clicked letter
    $(".name-link").on("click", function() {

    	// Return value of clicked letter without extra whitespace
		var clickedLetter = $(this).text().trim();

		me.populateLinks(clickedLetter);
    });

    // When "All" is clicked, repopulate directory with all employees 
    // TODO: reload all employees in order
    $(".all-link").on("click", function() {
    	me.populateAllLinks();
    });
	
};

directoryView.prototype.populateLinks = function (clickedLetter) {

	var me = this;

	// Object literals to represent JSON sub-objects for a person
	var education = {"institution": "", "startYear": "", "endYear": "", "degree": ""};
	var workExperience = {"institution": "", "startYear": "", "title": ""};

	// Clear previous search results
	$(".app-search-results").empty();

	// Retrieve all employee JSON data
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {
			if (val.name.charAt(0) === clickedLetter){
			// Populate education from JSON sub-object
			education.institution = result.people[i].education[0].institution;
			education.startYear = result.people[i].education[0].startYear;
			education.endYear = result.people[i].education[0].endYear;
			education.degree = result.people[i].education[0].degree;

			// Populate work experience from JSON sub-object
			workExperience.institution = result.people[i].workExperience[0].institution;
			workExperience.startYear = result.people[i].workExperience[0].startYear;	
			workExperience.title = result.people[i].workExperience[0].title;

			// Render profile for selected person
			me.renderProfile(val.name, education, workExperience, val.picture);  	
			}			
		});	
    });
};

directoryView.prototype.populateAllLinks = function () {

	var me = this;

	// Clear previous search results
	$(".app-search-results").empty();
	
	// Object literals to represent JSON sub-objects for a person
	var education = {"institution": "", "startYear": "", "endYear": "", "degree": ""};
	var workExperience = {"institution": "", "startYear": "", "title": ""};

	// Retrieve all employee JSON data
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {
				
			// Populate education from JSON sub-object
			education.institution = result.people[i].education[0].institution;
			education.startYear = result.people[i].education[0].startYear;
			education.endYear = result.people[i].education[0].endYear;
			education.degree = result.people[i].education[0].degree;

			// Populate work experience from JSON sub-object
			workExperience.institution = result.people[i].workExperience[0].institution;
			workExperience.startYear = result.people[i].workExperience[0].startYear;	
			workExperience.title = result.people[i].workExperience[0].title;

			// Render profile for selected person
			me.renderProfile(val.name, education, workExperience, val.picture);  			
			
		});	
    });
};

// Append employee file to homepage results 
// TODO: use jquery .clone() on template html to be populated and/or an html templating tool to make this easier instead of manual appends below
directoryView.prototype.renderProfile = function(displayName, education, workExperience, picture) {
	
	// Setup container divs for employee
	$(".app-search-results").last().append("<div class=\"app-person-profile-container\"></div>");
	$(".app-person-profile-container").last().append("<div class=\"app-person-profile docs-highlight docs-blue\" data-intro=\"Person Profile\" data-position=\"bottom\"></div>");

	// Setup person profile header
	$("div.app-person-profile.docs-highlight.docs-blue").last().append("<div class=\"app-person-profile-header\"></div>");
	$(".app-person-profile-header").last().append("<div class=\"app-person-profile-photo\" style=\"background-image: url(" + picture + ")\"></div>");
	$(".app-person-profile-header").last().append("<h2>" + displayName + "</h2>");
	$(".app-person-profile-header").last().append("<div class=\"app-person-profile-department\">Strategic Sales</div><div class=\"app-person-profile-phone-number\">919-555-5555</div>")


	// Format display and work names for rendering of email address
	var emailName = displayName.toLowerCase().replace(" ",".");
	var workEmail = workExperience.institution.toLowerCase().replace(" ","").replace(".","");
	var displayEmail = emailName + "@" + workEmail + ".com"
	var displayURL = "mailto:" + displayEmail;

	$(".app-person-profile-header").last().append("<div class=\"app-person-profile-email\"><a href=" + displayURL + "\">" + displayEmail + "</a></div>");

	// Populate education info
	$("div.app-person-profile.docs-highlight.docs-blue").last().append("<div class=\"app-section\"></div>");
	$(".app-section").last().append("<div class=\"app-section-header\"><h3>Education</h3></div>");
	$(".app-section").last().append("<div class=\"app-section-body\"></div>");
	$(".app-section-body").last().append("<div class=\"app-history-item\"></div>");
	$(".app-section-body").last().append("<div class=\"app-history-item\"></div>");
	$(".app-history-item").last().append("<div class=\"app-history-item-dates-edu\">" + education.startYear + "-" + education.endYear + "</div>");
	$(".app-history-item").last().append("<div class=\"app-history-item-body\"></div>");
	$(".app-history-item-body").last().append("<div class=\"app-history-item-title-edu\">" + education.institution + "</div>");
	$(".app-history-item-body").last().append("<div class=\"app-history-item-degree\">" + education.degree + "</div>");

	// Populate work experience info
	$("div.app-person-profile.docs-highlight.docs-blue").last().append("<div class=\"app-section\"></div>");
	$(".app-section").last().append("<div class=\"app-section-header\"><h3>Experience</h3></div>");
	$(".app-section").last().append("<div class=\"app-section-body\"></div>");
	$(".app-section-body").last().append("<div class=\"app-history-item\"></div>");
	$(".app-section-body").last().append("<div class=\"app-history-item\"></div>");
	$(".app-history-item").last().append("<div class=\"app-history-item-dates-work\">" + workExperience.startYear + "-Present</div>");
	$(".app-section-body").last().append("<div class=\"app-history-item-body\"></div>");
	$(".app-history-item-body").last().append("<div class=\"app-history-item-title-work\">" + workExperience.institution + "</div>");
	$(".app-history-item-body").last().append("<div class=\"app-history-item-position\">" + workExperience.title + "</div>");

};

// Initialize directory view
var directoryView = new directoryView;
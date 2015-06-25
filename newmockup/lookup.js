/* 
 *  lookup.js - Defines and instantiates directory view for homepage
 *
 *  	directoryView: 
 *
 *  	initDirectory - retrieves people data and populates directory component with all names
 *		renderProfile - renders employee profile on the directory 
 *		populateLinks - calls renderProfile on all names that begin with the search letter selected
 *		populateAllLinks - calls renderProfile on all employees
 *		searchByName - calls renderProfile on all employees that contain search string in their names
 *		searchByDept - calls renderProfile on all employees that contain search string in their departments
 *		getExperience - retrieves education and work experience info from JSON object
 *      sortProfiles - sorts rendered employee profiles by first name in ascending profile
 */

var directoryView = function () {
	var me = this;
	me.initDirectory();
};

directoryView.prototype.initDirectory = function () {
	var me = this;

	// Select empty heading which will contain search letters
	var alphabetLinks = $( ".alphabet-links > h5" ).text();

	// Create array of letters wrapped within link tags for name searching
	var links = jQuery.map(('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split(''), function(i) {
		return '<a class=\"name-link\">' + i + '</a>&nbsp';
	});

	// Populate empty heading with search letters
	$(".alphabet-links > h5").html(links);

	// Add an "All" link to the set of search letters
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

    // When "Search by Name" is clicked, repopulate directory with employees that have searched name
    $(".nameSearch").on("click", function() {

    	// Ensure that a proper search has been run
    	if ($("#nameSearchInput").val() == '') {
    		alert("Please enter at least one letter to run a search");
    	} else {
    		me.searchByName($("#nameSearchInput").val());
    	}

    	$("#nameSearchInput").val('');
    });

    // Don't refresh the page when name search is run
    $(".nameSearchForm").submit(function(event) {
    	event.preventDefault();
    });

    // When "Search By Department" is clicked, repopulate directory with employees that have searched department
    $(".deptSearch").on("click", function() {

    	// Ensure that a proper search has been run
    	if ($("#deptSearchInput").val() == '') {
    		alert("Please enter at least one letter to run a search");
    	} else {
    		me.searchByDept($("#deptSearchInput").val());
    	}

    	$("#deptSearchInput").val('');
    });

    // Don't refresh the page when dept search is run
    $(".deptSearchForm").submit(function(event) {
     	event.preventDefault();
    });
	
};

directoryView.prototype.populateLinks = function (clickedLetter) {

	var me = this;

	// Object to represent both education and work experience
	var experience;

	// Clear previous search results from directory
	$(".app-search-results").empty();

	// Retrieve employee JSON data for all employees that match the search letter
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {
			if (val.name.charAt(0) === clickedLetter){
			
			experience = me.getExperience(result, i);

			// Render profile for selected person
			me.renderProfile(val.name, experience.education, experience.workExperience, val.picture, val.department);  	
			}			
		});	
		me.sortProfiles();
    });
};

directoryView.prototype.populateAllLinks = function () {

	var me = this;

	// Clear previous search results from directory
	$(".app-search-results").empty();
	
	// Object to represent both education and work experience
	var experience;

	// Retrieve all employee JSON data
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {
				
			experience = me.getExperience(result, i);

			// Render profile for selected person
			me.renderProfile(val.name, experience.education, experience.workExperience, val.picture, val.department);  				
		});	
		me.sortProfiles();
    });
    
};

directoryView.prototype.searchByName = function (name) {

	var me = this;
	var name = name;

	// Clear previous search results from directory 
	$(".app-search-results").empty();
	
	// Object to represent both education and work experience
	var experience;

	// Retrieve all employee JSON data that match search name
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {

			// TODO: find out why 'contains' is working but 'includes' isn't
			if (val.name.contains(name)) {
				
				experience = me.getExperience(result, i);

				// Render profile for selected person
				me.renderProfile(val.name, experience.education, experience.workExperience, val.picture, val.department);  			
			}
		});	
		me.sortProfiles();
    });
};

directoryView.prototype.searchByDept = function (dept) {

	var me = this;
	var dept = dept;
	// Clear previous search results
	$(".app-search-results").empty();
	
	// Object to represent both education and work experience
	var experience;

	// Retrieve all employee JSON data that match search department
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {

			// TODO: find out why 'contains' is working but 'includes' isn't
			if (val.department.contains(dept)) {

				experience = me.getExperience(result, i);
				
				// Render profile for selected person
				me.renderProfile(val.name, experience.education, experience.workExperience, val.picture, val.department);  			
			}
		});
		me.sortProfiles();
    });
};

directoryView.prototype.getExperience = function(result, i) {

	var education = workExperience = {};

	// Populate education from JSON sub-object
	education.institution = result.people[i].education[0].institution;
	education.startYear = result.people[i].education[0].startYear;
	education.endYear = result.people[i].education[0].endYear;
	education.degree = result.people[i].education[0].degree;

	// Populate work experience from JSON sub-object
	workExperience.institution = result.people[i].workExperience[0].institution;
	workExperience.startYear = result.people[i].workExperience[0].startYear;	
	workExperience.title = result.people[i].workExperience[0].title;

	// Return an object containing both education and work experience info
	return {
		education: education,
		workExperience: workExperience
	};
};

// Append employee file to homepage results 
// TODO: use jquery .clone() on template html to be populated and/or an html templating tool to make this easier instead of manual appends below
directoryView.prototype.renderProfile = function(displayName, education, workExperience, picture, dept) {
	
	// Setup container divs for employee
	$(".app-search-results").last().append("<div class=\"app-person-profile-container\"></div>");
	$(".app-person-profile-container").last().append("<div class=\"app-person-profile docs-highlight docs-blue\" data-intro=\"Person Profile\" data-position=\"bottom\"></div>");

	// Setup person profile header
	$("div.app-person-profile.docs-highlight.docs-blue").last().append("<div class=\"app-person-profile-header\"></div>");
	$(".app-person-profile-header").last().append("<div class=\"app-person-profile-photo\" style=\"background-image: url(" + picture + ")\"></div>");
	$(".app-person-profile-header").last().append("<h2>" + displayName + "</h2>");
	$(".app-person-profile-header").last().append("<div class=\"app-person-profile-department\">" + dept + "</div><div class=\"app-person-profile-phone-number\">919-555-5555</div>")

	console.log(education);
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

directoryView.prototype.sortProfiles = function() {

	var aToZDivs = $("div.app-person-profile").sort(function (a, b) {	
		return $(a).find("h2").text() > $(b).find("h2").text();	
	});

	$("div.app-search-results").html(aToZDivs);
};

// Initialize directory view
var directoryView = new directoryView;
/* 
 *  lookup.js - Defines and instantiates directory view for homepage
 *
 *  	directoryView: 
 *		new           - retrieves people data and populates directory component with names
 *  	initDirectory - defines click behavior for names within directory components
 *		renderProfile - renders person profile associated with directory component name clicked
 */

var directoryView = function () {

	var me = this;

	// Add div for each name in people data after corresponding directory seperator
	$.getJSON("/api/people", function(result){
		$.each(result.people, function(i, val){
			var letter = val.name.charAt(0);
			$(".app-directory-separator:contains(" + letter + ")").after("<div class=\"app-directory-item\">"+ val.name +"</div>");
		});
		me.initDirectory();
	});
};

directoryView.prototype.initDirectory = function () {

	var me = this; 

	// Render introductory text and hide current profile if shown
	$( ".app-directory-home" ).on( "click", function ( event ) {			
		$(".app-person-profile-container").hide();
		$(".app-directory-intro").show();
	});

	$(".app-directory-item").on("click", function() {

		// Object literals to represent JSON sub-objects for a person
		var education = {"institution": "", "startYear": "", "endYear": "", "degree": ""};
		var workExperience = {"institution": "", "startYear": "", "title": ""};

		// Return value of clicked name without extra whitespace
		var clickedName = $(this).text().trim();

		// Retrieve selected person's JSON data
		$.getJSON("/api/people", function(result){
	        	
			$.each(result.people, function(i, val){
				if (val.name === clickedName){
					
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
    });
};

directoryView.prototype.renderProfile = function(displayName, education, workExperience, picture) {

	// Set profile on right-hand side to proper info
	$(".app-person-profile-header").find("h2").text(displayName);

	// Populate education info
	$(".app-history-item-dates-edu").text(education.startYear + "-" + education.endYear);
	$(".app-history-item-title-edu").text(education.institution);
	$(".app-history-item-degree").text(education.degree);

	// Populate work experience info
	$(".app-history-item-dates-work").text(workExperience.startYear + "-Present");
	$(".app-history-item-title-work").text(workExperience.institution);
	$(".app-history-item-position").text(workExperience.title);

	// Format display and work names for rendering of email address
	var emailName = displayName.toLowerCase().replace(" ",".");
	var workEmail = workExperience.institution.toLowerCase().replace(" ","").replace(".","");
	var displayEmail = emailName + "@" + workEmail + ".com"
	var displayURL = "mailto:" + displayEmail;

	// Populate email address field, including URL when clicked
	$(".app-person-profile-email").find("a").text(displayEmail);
	$(".app-person-profile-email").find("a").attr("href", displayURL);

	// Render profile picture
	$(".app-person-profile-photo").attr("style", "background-image: url(" + picture + ")");

	// Render profile and hide introductory text if shown
	$(".app-directory-intro").hide();
	$(".app-person-profile-container").show();
};


// Initialize directory view
var directoryView = new directoryView;
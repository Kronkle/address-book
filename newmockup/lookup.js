/* 
 *  lookup.js - controls directory view for homepage
 *
 *  	initDirectory -           populates directory with all profiles and defines search behavior
 *		renderProfile -           renders a profile
 *		renderProfilesByClick -   populates directory with profiles that contain clicked letter as first letter of name
 *		renderAllProfiles -       populates directory with all profiles
 *      pullContactList -         pull contact list from server if user is logged in
 *		searchByName -            request a search for profiles that contain search string in name field
 *		searchByDept -            request a search for profiles that contain search string in department field
 *      sanitizeSearchInput -     replaces special characters and numbers in search input with whitespace
 *      renderProfilesBySearch -  populates directory with profiles that match search criteria
 *		getExperience -           retrieves education and work experience for a profile
 *      initFavButtons -          defines behavior for favorite icons next to each profile when user is logged in
 *		sortProfiles -            sort profiles to be rendered in alphabetical order and append them to the DOM
 */

 /* TODO List (8/19/15)
  * Edit all renderProfile calls to contain favorites parameter for goal item below --- DONE
  * Retain favIconBtn states ("Add Contact" after click or "Remove Contact") for logged in user
  *		-Current plan - edit HTML id to preserve favIcon state, push to server when new contact is added
  *						and pull from server when entire contact list is requested --- DONE
  * Fix CSS in preferences menu (center and align buttons/heading) --- DONE
  * Retain username at title of preferences menu upon page refresh --- DONE
  *
  * Final refactoring with all code in lookup.js separated into modular subroutines - IN PROGRESS (8/19/15)
  *     -Avoid parseHTML error log when letter with no associated employees in clicked in search --- DONE
  * 	-Precompile profiles.handlebars when finalized --- DONE
  * 	-Fix CSS workarounds in HTML --- DONE
  * Final refactoring of all other client-side code (including CSS tweaks) --- IN PROGRESS
  * Final refactoring of all server-side code
  * 	-Move all hbs templates to views
  * 	-Avoid loading JSON when loginFailure and registerFailure views are loaded
  * 	-Put routes into separate module
  */

var directoryView = function () {
	var me = this;
	me.initDirectory();
};

directoryView.prototype.initDirectory = function () {
	var me = this;

	$( document ).ready(function() {
		// Define behavior for "Add/Remove Contact" buttons
		me.initFavButtons();

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
		me.renderAllProfiles();

		// When specific search letter is clicked, populate employees with names starting with the clicked letter
	    $(".name-link").on("click", function() {

	    	// Return value of clicked letter without extra whitespace
			var clickedLetter = $(this).text().trim();

			me.renderProfilesByClick(clickedLetter);
	    });

	    // When "All" is clicked, repopulate directory with all employees 
	    $(".all-link").on("click", function() {
	    	me.renderAllProfiles();
	    });

	    // When a search button is clicked, repopulate directory with employees that fit search criteria
	    $(".nameSearch, .deptSearch").on("click", function() {

	    	// Retrieve user input from the previous input element
	    	var input = $(this).prev().children("#searchInput").val();

	    	// Ensure that a proper search has been run
	    	if ( input == '' ) {
	    		alert("Please enter at least one letter to run a search");
	    		return;
	    	} 

	    	// Determine which search to run
	    	if ( $(this).hasClass("nameSearch") ) {
	    		me.searchByName(input);
	    	} else {
	    		me.searchByDept(input);
	    	}

	    	// Clear user input from input element
	    	$(this).prev().children("#searchInput").val('');
	    });
	});
};

directoryView.prototype.renderProfile = function(displayName, education, workExperience, picture, dept, desc, contactList) {
	
	
	var loggedIn = false;
	var isContact = false;

	// Determine whether there is a current user who is logged in
	if (document.getElementById("loggedInMenu")){
		loggedIn = true;

		// If logged in, determine if profile to be displayed is a contact of current user
		if (contactList.indexOf(displayName) >= 1) {
			isContact = true;
		}
	}

	// Assign precompiled profile template to a function
	var template = Handlebars.templates['profile'];

	// Format profile email address and email url
	var emailName = displayName.toLowerCase().replace(" ",".");
	var workEmail = workExperience.institution.toLowerCase().replace(" ","").replace(".","");
	var displayEmail = emailName + "@" + workEmail + ".com"
	var displayURL = "mailto:" + displayEmail;

	// Create context data with all profile info for handlebars function to process
	var data = { "education": {"startYear": education.startYear, "endYear": education.endYear, "institution": education.institution, "degree": education.degree}, "workExperience": {"startYear": workExperience.startYear, "title": workExperience.title, "institution": workExperience.institution}, "desc": desc, "picture": picture, "name": displayName, "dept": dept, "emailUrl": displayURL, "email": displayEmail, "loggedIn": loggedIn, "isContact": isContact };

	// Generate html using the given context
	var result = template(data);

	return result;
};

directoryView.prototype.renderProfilesByClick = function (clickedLetter) {

	var me = this;
	var html = "";

	var contactList = me.pullContactList();

	// Clear previous search results from directory
	$(".app-search-results").empty();

	// Object to represent both education and work experience
	var experience;

	// Retrieve employee JSON data for all employees that match the search letter
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {
			if (val.name.charAt(0) === clickedLetter){
			
			experience = me.getExperience(result, i);

			// Render profile for selected person
			html += me.renderProfile(val.name, experience.education, experience.workExperience, val.picture, val.department, val.description, contactList);  	
			}			
		});	

		// Sort profiles if found
		if (html){
			me.sortProfiles(html);
		}
    });
};

directoryView.prototype.renderAllProfiles = function () {

	var me = this;
	var html = "";

	var contactList = me.pullContactList();

	// Clear previous search results from directory
	$(".app-search-results").empty();
	
	// Object to represent both education and work experience
	var experience;

	// Retrieve all employee JSON data
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {
				
			experience = me.getExperience(result, i);

			// Render profile for selected person
			html += me.renderProfile(val.name, experience.education, experience.workExperience, val.picture, val.department, val.description, contactList); 				
		});	
		me.sortProfiles(html);
    });
};

directoryView.prototype.pullContactList = function () {

	var loggedIn = false;
	var contactList = "";

	if (document.getElementById("loggedInMenu")){
		loggedIn = true;
	}

	// Pull contact list from server if user is logged in before rendering profiles
	if (loggedIn) {
	
		$.ajax({
			async: false,
			type: "POST",
			url: '/newmockup/pullContactList',
			data: {},
			success: function (favorites) {
				contactList = favorites;			
			}
		});
	}
	return contactList;
};

directoryView.prototype.searchByName = function (name) {

	var me = this;

	// Sanitize search input by replacing all special characters and numbers with whitespace via regex
	name = me.sanitizeSearchInput(name);

	// Transform search input into "Firstname Lastname" format
	for (i = 0; i < name.length; i++) {

		// Capitalize the first letter
		if (i == 0) {
			name = name.substring(0,1).toUpperCase() + name.substring(1);

		// Capitalize the first letter immediately after whitespace (assume this is last name)
		} else if (name[i] == " " && name[i+1] != " ") {
			name = name.substring(0,i+1) + name.substring(i+1,i+2).toUpperCase() + name.substring(i+2);
			// Iterate twice to skip over the newly capitalized letter
			i++;

		// Remove contiguous whitespace
        } else if (name[i] == " " && name[i+1] == " ") {
        	name = name.substring(0,i) + name.substring(i+1);
        	// Retain current iterator value since string has been shortened by one element
        	i--;

		// Lowercase all other letters
		} else {
			name = name.substring(0,i) + name.substring(i,i+1).toLowerCase() + name.substring(i+1);
		}
	}

	// Run search with processed input and render matched profiles to DOM
	me.renderProfilesBySearch(name, "name");
};

directoryView.prototype.searchByDept = function (dept) {

	var me = this;

	// Sanitize search input by replacing all special characters and numbers with whitespace via regex
	dept = me.sanitizeSearchInput(dept);

	// Transform search input into "Department" format
	dept = dept.substring(0,1).toUpperCase() + dept.substring(1).toLowerCase();

	// Run search with processed input and render matched profiles to DOM
	me.renderProfilesBySearch(dept, "department");
};

directoryView.prototype.sanitizeSearchInput = function (searchInput) {

	searchInput = searchInput.replace(/[&\/\\#,+()@$~%.'":;*?<>{}|!=^123456789]/g,' ');
	return searchInput;
};

directoryView.prototype.renderProfilesBySearch = function(input, searchType) {

	var me = this;
	var html = "";

	var contactList = me.pullContactList();

	// Clear previous search results
	$(".app-search-results").empty();
	
	// Object to represent both education and work experience
	var experience;

	// Represents either a "name" search or "department" search
	var searchType = searchType;

	// Retrieve all employee JSON data that match search department
	$.getJSON("/api/people", function(result) {
        var found = false;

		$.each(result.people, function(i, val) {

			// Search for input string within either "name" or "department" field
			if (val[searchType].indexOf(input) >= 0) {

				// Gather employee's education and work experience
				experience = me.getExperience(result, i);

				// Render profile for selected employee
				html += me.renderProfile(val.name, experience.education, experience.workExperience, val.picture, val.department, val.description, contactList);

				found = true;			
			}
		});

		// Sort profiles if search results are found, otherwise alert user
		if (found == true) {
			me.sortProfiles(html);
		} else {
			alert("No search results found");
		}
    });
};

directoryView.prototype.getExperience = function(result, i) {

	var education = {};
	var workExperience = {};

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

directoryView.prototype.initFavButtons = function() {

	// Indicate when a contact has been added
    $(".app-search-results").on("click", ".favIconBtn", function() {

    	// Retrieve name of contact that favIconBtn is attached to and assign to AJAX data object
    	var name = $(this).parent().prev().text();
    	var data = { "name": name };

		// Push contact change to server and update button text
		if ($(this).text() == "Add Contact") {

			// Push contact name to server
			$.ajax({
				async: false,
				type: "POST",
				url: '/newmockup/addContact',
				data: data,
				success: function () {
					alert( name + " has been added to your contact list.");
				}
			});
			
			$(this).html("Remove Contact");

		} else {
		
			// Push contact removal to server
			$.ajax({
				async: false,
				type: "POST",
				url: '/newmockup/deleteContact',
				data: data,
				success: function () {
					alert( name + " has been removed from your contact list.");
				}
			});
		
			$(this).html("Add Contact");
		}
	});
}

directoryView.prototype.sortProfiles = function(html) {

	// Convert html string into DOM nodes and sort profiles by name
	var aToZDivs = $.parseHTML(html).sort(function (a, b) {	

		if ($(a).find("h2").text() > $(b).find("h2").text()) {
			return 1;
		}

		if ($(a).find("h2").text() < $(b).find("h2").text()) {
			return -1;
		}

		return 0;
	});

	// Populate search results container with sorted profile divs
	$("div.app-search-results").html(aToZDivs);

	// Attach popover handlers to profile pictures that are triggered by mouse hover
	$('[data-toggle=popover]').popover({
		placement: 'right',
	});
};

// Initialize directory view
var directoryView = new directoryView;

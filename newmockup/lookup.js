/* 
 *  lookup.js - controls directory view for homepage
 *
 *  	initDirectory -           populates directory with all profiles and defines search behavior
 *		renderProfile -           renders a profile
 *		renderProfilesByClick -   populates directory with profiles that contain clicked letter as first letter of name
 *		renderAllProfiles -       populates directory with all profiles
 *		renderContactList - 	  renders contacts of currently logged in user after contact list button is clicked
 *      pullContactList -         pull contact list from server if user is logged in
 *		searchProfiles -          request a search for profiles that contain search string in name or department field
 *      sanitizeSearchInput -     replaces special characters and numbers in search input with whitespace
 *      renderProfilesBySearch -  populates directory with profiles that match search criteria
 *		getExperience -           retrieves education and work experience for a profile
 *      initFavButtons -          defines behavior for favorite icons next to each profile when user is logged in
 *		initContactListButton -   defines behavior for contact list button in user dropdown
 *		sortProfiles -            sort profiles to be rendered in alphabetical order and append them to the DOM
 */

 /* TODO List (9/18/15)
  * Final testing
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

		// Define behavior for "Contact List" button
		me.initContactListButton();

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
	    		me.searchProfiles(input, "name");
	    	} else {
	    		me.searchProfiles(input, "department");
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

directoryView.prototype.renderContactList = function (contacts) {

	var me = this;
	var html = "";

	var contactList = contacts;

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

			// If profile is a contact of current user, render it
			if (contactList.indexOf(val.name) >= 1) {
		
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
			alert("Your contact list is empty.");
		}
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

directoryView.prototype.searchProfiles = function (input, searchType) {

	var me = this;

	// Sanitize search input by replacing all special characters and numbers with whitespace via regex
	input = me.sanitizeSearchInput(input);

	// Transform search input into "First Last" format
	for (i = 0; i < input.length; i++) {

		// Capitalize the first letter
		if (i == 0) {
			input = input.substring(0,1).toUpperCase() + input.substring(1);

		// Capitalize the first letter immediately after whitespace (assume this is last word)
		} else if (input[i] == " " && input[i+1] != " ") {
			input = input.substring(0,i+1) + input.substring(i+1,i+2).toUpperCase() + input.substring(i+2);
			// Iterate twice to skip over the newly capitalized letter
			i++;

		// Remove contiguous whitespace
        } else if (input[i] == " " && input[i+1] == " ") {
        	input = input.substring(0,i) + input.substring(i+1);
        	// Retain current iterator value since string has been shortened by one element
        	i--;

		// Lowercase all other letters
		} else {
			input = input.substring(0,i) + input.substring(i,i+1).toLowerCase() + input.substring(i+1);
		}
	}

	// Run search with processed input and render matched profiles to DOM
    me.renderProfilesBySearch(input, searchType);
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
};

directoryView.prototype.initContactListButton = function () {
	
	var me = this;

	$(".app-directory-container").on("click", ".contact-list-form-btn", function() {

		// Close active dropdown
		$('.dropdown-toggle').dropdown("toggle");

		// Pull contact list to be passed to render function
		var contactList = me.pullContactList();

		// Render all contacts for current user
		me.renderContactList(contactList);
	});
};

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

/* 
 *  lookup.js - Defines and instantiates directory view for homepage
 *
 *  	directoryView: 
 *
 *  	initDirectory - retrieves people data and populates directory component with all names
 *		loadProfile - renders employee profile on the directory via Handlebars template with associated context
 *		populateLinks - calls loadProfile on all names that begin with the search letter selected
 *		populateAllLinks - calls loadProfile on all employees
 *		searchByName - calls loadProfile on all employees that contain search string in their names
 *		searchByDept - calls loadProfile on all employees that contain search string in their departments
 *		getExperience - retrieves education and work experience info from JSON object
 *      getSearchResults - iterate through JSON and return any employee that matches search
 *      sortProfiles - sorts rendered employee profiles by first name in ascending profile
 *		initializeFavoriteIcons - defines behavior for favorite icons next to each profile when user is logged in
 */

 /* TODO List (8/10/15)
  * Retain favIcon states (empty or filled-in after click) for logged in user
  *		-Current plan - edit HTML id to preserve favIcon state, push to server when new contact is added
  *						and pull from server when entire contact list is requested
  * Fix CSS in preferences menu (center and align buttons/heading) --- DONE
  * Retain username at title of preferences menu upon page refresh
  * Avoid parseHTML error log when letter with no associated employees in clicked in search
  * Move all hbs templates to views
  * Precompile profiles.handlebars when finalized
  * Avoid loading JSON when loginFailure and registerFailure views are loaded
  * Fix CSS workarounds in HTML
  * Final cleanup/wrap-up of all code (JSHint, Jasmine?)
  */

var directoryView = function () {
	var me = this;
	me.initDirectory();
};

directoryView.prototype.initDirectory = function () {
	var me = this;

	// Save array of HTML #favIcon elements for now
	var favIconsHtml = me.initializeFavoriteIcons();

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

	var html = "";

	// Clear previous search results from directory
	$(".app-search-results").empty();

	// Auth check here

	// Retrieve employee JSON data for all employees that match the search letter
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {
			if (val.name.charAt(0) === clickedLetter){
			
			experience = me.getExperience(result, i);

			// Render profile for selected person
			html += me.loadProfile(val.name, experience.education, experience.workExperience, val.picture, val.department, val.description);  	
			}			
		});	
		me.sortProfiles(html);
    });
};

directoryView.prototype.populateAllLinks = function () {

	var me = this;
	var html = "";
	var favIconsHtml;

	// Clear previous search results from directory
	$(".app-search-results").empty();
	
	// Object to represent both education and work experience
	var experience;

	// Auth check here

	// Retrieve all employee JSON data
	console.log(performance.now());
	$.getJSON("/api/people", function(result) {
        	
		$.each(result.people, function(i, val) {
				
			experience = me.getExperience(result, i);
			// Render profile for selected person
			html += me.loadProfile(val.name, experience.education, experience.workExperience, val.picture, val.department, val.description); 
			console.log(performance.now()); 				
		});	
		me.sortProfiles(html);
			
		/* If user is logged in, initialize behavior for star icons (TEST) */
		favIconsHtml = me.initializeFavoriteIcons();
    });
};

directoryView.prototype.searchByName = function (name) {

	var me = this;
	var name = name;

	// Capitalize first letter and any letters after whitespace, lowercase all other letters
	for(i = 0; i < name.length; i++) {

		// Capitalize the first letter
		if (i == 0) {
			name = name.substring(0,1).toUpperCase() + name.substring(1); 

		// Capitalize the first letter after whitespace (assuming this is last name), skip past it
		} else if (name[i] == " " && name[i+1] != " ") {
			name = name.substring(0,i+1) + name.substring(i+1,i+2).toUpperCase() + name.substring(i+2);
			i++;

		// Lowercase all other letters
		} else {
			name = name.substring(0,i) + name.substring(i,i+1).toLowerCase() + name.substring(i+1);
		}
	}

	me.getSearchResults(name, "name");
};

directoryView.prototype.searchByDept = function (dept) {

	var me = this;
	var dept = dept;

	// Capitalize first letter and lowercase the following letters for department matching
	dept = dept.substring(0,1).toUpperCase() + dept.substring(1).toLowerCase();

	// Get search results for sanitized input
	me.getSearchResults(dept, "department");
};

directoryView.prototype.getSearchResults = function(input, searchType) {

	var me = this;
	var html = "";
	var searchType = searchType;

	// Clear previous search results
	$(".app-search-results").empty();
	
	// Object to represent both education and work experience
	var experience;

	// Auth check here

	// Retrieve all employee JSON data that match search department
	$.getJSON("/api/people", function(result) {
        var found = false;
		$.each(result.people, function(i, val) {

			// NOTE - after v39 FireFox will support the "includes" function
			// Avoid searching for strings in the middle of a name
			if (val[searchType][0].contains(input[0]) && val[searchType].contains(input)) {
				
				// Gather employee's education and work experience
				experience = me.getExperience(result, i);

				// Render profile for selected employee
				html += me.loadProfile(val.name, experience.education, experience.workExperience, val.picture, val.department, val.description);

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

/* Potentially make a request to the server here, which will handle guest user template vs logged in user template */
directoryView.prototype.loadProfile = function(displayName, education, workExperience, picture, dept, desc) {
	
	var me = this;
	var html;
	var loggedIn = false;

	if (document.getElementById("loggedInMenu")){
		loggedIn = true;
	}

	// TODO: Precompile final profile.handlebars and uncomment code here

	// Retrieve precompiled template and set to a fn
	/*var template = Handlebars.templates['profile'];

	// Format display and work names for rendering of email address
	var emailName = displayName.toLowerCase().replace(" ",".");
	var workEmail = workExperience.institution.toLowerCase().replace(" ","").replace(".","");
	var displayEmail = emailName + "@" + workEmail + ".com"
	var displayURL = "mailto:" + displayEmail;

	// Create data for the context argument that template will accept (gather this from params later)
	var data = { "education": {"startYear": education.startYear, "endYear": education.endYear, "institution": education.institution, "degree": education.degree}, "workExperience": {"startYear": workExperience.startYear, "title": workExperience.title, "institution": workExperience.institution}, "desc": desc, "picture": picture, "name": displayName, "dept": dept, "emailUrl": displayURL, "email": displayEmail, "loggedIn": loggedIn };

	// Generate html using the given context
	var result = template(data);
	html = result;
	*/

	// Since user template is being edited, compile at runtime for now:
	$.ajax({
		async: false,
		url: 'profile.handlebars', 
		success: function (source) {

		// Compile template into a function
		var template = Handlebars.compile(source);

		// Format display and work names for rendering of email address
		var emailName = displayName.toLowerCase().replace(" ",".");
		var workEmail = workExperience.institution.toLowerCase().replace(" ","").replace(".","");
		var displayEmail = emailName + "@" + workEmail + ".com"
		var displayURL = "mailto:" + displayEmail;

		// Create data for the context argument that template will accept (gather this from params later)
		var data = { "education": {"startYear": education.startYear, "endYear": education.endYear, "institution": education.institution, "degree": education.degree}, "workExperience": {"startYear": workExperience.startYear, "title": workExperience.title, "institution": workExperience.institution}, "desc": desc, "picture": picture, "name": displayName, "dept": dept, "emailUrl": displayURL, "email": displayEmail, "loggedIn": loggedIn };

		// Generate html using the given context
		var result = template(data);
		html = result;
		}	
	});

	return html;
};

directoryView.prototype.initializeFavoriteIcons = function() {
	// Indicate when a contact has been added
    $(".favIconBtn").on("click", function() {

    	// Retrieve name of contact that favIconBtn is attached to and attach to object
    	var name = $(this).parent().prev().text();
    	var data = { "name": name };

		// Reverse text value of button after add or remove and push to server
		if ($(this).text() == "Add Contact") {

			// Push contact name to server
			$.ajax({
				async: false,
				type: "POST",
				url: '/newmockup/addContact',
				data: data,
				//dataType: 'json',
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
				//dataType: 'json',
				success: function () {
					alert( name + " has been removed from your contact list.");
				}
			});
		
			$(this).html("Add Contact");
		}
    });

    // Don't refresh the page when contact is added
    $(".addContactForm").submit(function(event) {
    	alert("Form submit handler triggered");
    	event.preventDefault();  	
    });
}

directoryView.prototype.sortProfiles = function(html) {

	// Tracking pre and post-sort performance for now
	console.log(performance.now());

	// Provide specific return values for compareFunction for the most stability in browsers
	var aToZDivs = $.parseHTML(html).sort(function (a, b) {	

		if ($(a).find("h2").text() > $(b).find("h2").text()) {
			return 1;
		}
		if ($(a).find("h2").text() < $(b).find("h2").text()) {
			return -1;
		}
		return 0;
	});

	$("div.app-search-results").html(aToZDivs);

	// Name headers reveal a popover when clicked
	$('[data-toggle="popover"]').popover({
		placement: 'right',
		viewport: '#viewport'
	});

	console.log(performance.now());
};

// Initialize directory view
var directoryView = new directoryView;
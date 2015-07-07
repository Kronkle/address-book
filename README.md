Working example of using jQuery, Express, and Node to provide an address book interface that polls
a JSON file for employee information.

**Mockup:** (Completed first version)
http://localhost:8080/mockup/

**NewMockup:** (Style redesign, in progress)
http://localhost:8080/newmockup/

**Employee Data:**
http://localhost:8080/api/people

Mockup Objectives: 
* Display intro text on homepage instead of static profile - DONE (6/3/15)
* Button in directory component for sorting names - DONE (6/6/15)

NewMockup Objectives::
* Styling redesign via Bootstrap with same functionality as previous version - DONE (Letter, name, and department searches instead of A-Z/Z-A sort - 6/19/15)
* Consistent ordering of employees for both homepage and search results - DONE (Ascending order for any search - 6/25/15)
* "Detailed view" for each individual employee - DONE (Bio popovers for each employee - 6/28/15) 
* Improved name and department searches - DONE (Search accounts for case errors and first and last names for name search - 7/5/15)
* Make renderProfile more efficient - DONE (loadProfile for rendering via Handlebars template - 6/30/15)
* Optimize new renderProfile - DONE (precompiled Handlebars template - 7/1/15)
* User login system with editable contact lists for each user account - IN PROGRESS (7/6/15)
* Final refactoring with all code in lookup.js separated into modular subroutines


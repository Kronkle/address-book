(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['profile'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<form class=\"addContactForm\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isContact : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    return "				<button type=\"button\" class=\"favIconBtn btn btn-default\">Remove Contact</button></form>\r\n";
},"4":function(depth0,helpers,partials,data) {
    return "				<button type=\"button\" class=\"favIconBtn btn btn-default\">Add Contact</button></form>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "<div class=\"app-person-profile docs-highlight docs-blue\" data-intro=\"Person Profile\" data-position=\"bottom\">\r\n	<div class=\"app-person-profile-header\">\r\n		<div class=\"app-person-profile-photo\" style=\"background-image: url("
    + alias3(((helper = (helper = helpers.picture || (depth0 != null ? depth0.picture : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"picture","hash":{},"data":data}) : helper)))
    + ")\" data-placement=\"right\" data-content=\""
    + alias3(((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"desc","hash":{},"data":data}) : helper)))
    + "\" title=\"\" data-toggle=\"popover\" data-trigger=\"hover\" href=\"#\" data-original-title=\"Bio\"></div>\r\n		<h2>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h2>\r\n		"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.loggedIn : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		<div class=\"app-person-profile-department\">"
    + alias3(((helper = (helper = helpers.dept || (depth0 != null ? depth0.dept : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"dept","hash":{},"data":data}) : helper)))
    + "</div>\r\n		<div class=\"app-person-profile-phone-number\">919-555-5555</div>\r\n		<div class=\"app-person-profile-email\"><a href=\""
    + alias3(((helper = (helper = helpers.emailUrl || (depth0 != null ? depth0.emailUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"emailUrl","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"email","hash":{},"data":data}) : helper)))
    + "</a></div>\r\n	</div>\r\n	<div class=\"app-section\">\r\n		<div class=\"app-section-header\">\r\n			<h3>Education</h3>\r\n		</div>\r\n		<div class=\"app-section-body\">\r\n			<div class=\"app-history-item\">\r\n				<div class=\"app-history-item-dates-edu\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.education : depth0)) != null ? stack1.startYear : stack1), depth0))
    + "-"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.education : depth0)) != null ? stack1.endYear : stack1), depth0))
    + "</div>\r\n				<div class=\"app-history-item-body\">\r\n					<div class=\"app-history-item-title-edu\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.education : depth0)) != null ? stack1.institution : stack1), depth0))
    + "</div>\r\n					<div class=\"app-history-item-degree\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.education : depth0)) != null ? stack1.degree : stack1), depth0))
    + "</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n	<div class=\"app-section\">\r\n		<div class=\"app-section-header\">\r\n			<h3>Experience</h3>\r\n		</div>\r\n		<div class=\"app-section-body\">\r\n			<div class=\"app-history-item\">\r\n				<div class=\"app-history-item-dates-work\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.workExperience : depth0)) != null ? stack1.startYear : stack1), depth0))
    + "-Present</div>\r\n				<div class=\"app-history-item-body\">\r\n					<div class=\"app-history-item-title-work\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.workExperience : depth0)) != null ? stack1.institution : stack1), depth0))
    + "</div>\r\n					<div class=\"app-history-item-position\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.workExperience : depth0)) != null ? stack1.title : stack1), depth0))
    + "</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>";
},"useData":true});
})();
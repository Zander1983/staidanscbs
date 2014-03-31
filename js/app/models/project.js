define(function (require) {

    "use strict";

    var Backbone            = require('backbone'),
      
    
        Project = Backbone.Model.extend({  

            urlRoot: "/project",   

        });



    return {
        Project: Project
    };

});
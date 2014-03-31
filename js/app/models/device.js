define(function (require) {

    "use strict";

    var Backbone            = require('backbone'),
      
    
        Device = Backbone.Model.extend({  

            urlRoot: "/device",   

        });



    return {
        Device: Device
    };

});
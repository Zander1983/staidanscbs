define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Home.html'),
        template            = _.template(tpl);

    return Backbone.View.extend({

        initialize: function (options) {

            this.render();

        },
  

        render: function (options) {
            
            this.$el.html(template({context:'Home'}));
            return this;
        },
      
        

    });

});
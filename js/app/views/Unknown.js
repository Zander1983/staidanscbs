define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Unknown.html'),
        template            = _.template(tpl);

    return Backbone.View.extend({

        initialize: function (options) {
            console.log('in Unknown');
            this.render();
        },

        render: function (options) {
         
            this.$el.html(template());
            return this;
        },
       

    });

});
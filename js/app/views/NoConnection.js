define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/NoConnection.html'),
        side_nav            = require('text!tpl/SideNav.html'),
        template            = _.template(tpl);

    return Backbone.View.extend({

        initialize: function (options) {
            console.log('in NoConnection');
            this.render();
        },

        render: function (options) {
         
            this.$el.html(template());
            return this;
        },
       

    });

});
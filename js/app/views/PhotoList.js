define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        Lazy                = require('jquery.lazyload'),
        tpl                 = require('text!tpl/PhotoList.html'),
        template = _.template(tpl),
        album_title;


    return Backbone.View.extend({

        initialize: function (options) {
                
            this.render();
        },

        render: function (options) {
            album_title = this.collection.first().get('album_title');
            
            this.$el.html(template({photo:this.collection.toJSON(), album_title:album_title}));
           
        },

    });

});
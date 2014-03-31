define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/AlbumList.html'),
        template = _.template(tpl),
        empty_tpl           = require('text!tpl/EmptyAlbum.html'),
        empty_template = _.template(empty_tpl);


    return Backbone.View.extend({

        initialize: function (options) {
            this.render();
        },

        render: function (options) {
            
            this.$el.html(template({album:this.collection.toJSON()}));
            
            if(this.collection.length>0){
                this.$el.html(template({album:this.collection.toJSON()}));
            }
            else{          
                this.$el.html(empty_template());
            }

        },


    });

});
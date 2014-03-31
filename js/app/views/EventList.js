define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/EventList.html'),
        empty_tpl           = require('text!tpl/EmptyEventList.html'),
        empty_template = _.template(empty_tpl),
        template = _.template(tpl);


    return Backbone.View.extend({

        initialize: function (options) {
            this.render();
        },

        render: function (options) {
            
            if(this.collection.length>0){
                
                this.$el.html(template({event:this.collection.toJSON()}));
            }
            else{
                
                this.$el.html(empty_template());
            }

        },


    });

});
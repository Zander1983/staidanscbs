define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        Moment              = require('moment'),
        tpl                 = require('text!tpl/ArticleList.html'),
        template = _.template(tpl), 
        is_messages;

    return Backbone.View.extend({

        initialize: function () {
            this.render();
            this.collection.on("reset", this.render, this);
        },

        render: function () {
            if(this.collection.length>0){
                is_messages =  true;
            }
            else{
                is_messages = false;
            }
            this.$el.html(template({article:this.collection.toJSON(), 
                                    is_messages:is_messages
                                    }));
            return this;
        },
          


    });

});
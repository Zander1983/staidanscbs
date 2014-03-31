define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Facebook.html'),
        template            = _.template(tpl);

    return Backbone.View.extend({

        initialize: function (options) {

            this.render();
        },

        render: function (options) {
         
            this.$el.html(template());
            return this;
        },
                
        events: {
             //"click input": "formationClicked",
            "click #inner-container a"   : 'linkClicked'
        },

        linkClicked: function(e){
    
            e.preventDefault();
    
            var href = $(e.currentTarget).attr('href');
            
            if (window.device.platform == 'android' || window.device.platform == 'Android') {
                //Android ONLY - ios can you inAppBrowser
                navigator.app.loadUrl(href, { openExternal:true });
            
            }
            else{
                window.open(href, '_blank');
            }
            
        },    

    });

});
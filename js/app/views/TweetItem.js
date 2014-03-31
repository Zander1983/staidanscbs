define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        Twitter             = require('twitter-text'),
        UsefulFuncs         = require('app/utils/useful_func'),
        tpl                 = require('text!tpl/TweetItem.html'),
        template = _.template(tpl);

    return Backbone.View.extend({

        initialize: function (options) {

            this.render();     

        },
        
        events: {
            "click #inner-container a"   : 'linkClicked'
        },
        
        
        linkClicked: function(e){
    
            e.preventDefault();
    
            var href = $(e.currentTarget).attr('href');
            
            if (window.device.platform === 'android' || window.device.platform === 'Android') {
                //Android ONLY - ios can you inAppBrowser
                navigator.app.loadUrl(href, { openExternal:true });
            
            }
            else{
                window.open(href, '_blank');
            }
            
        },

        render: function () {
            this.$el.html(template({model:this.model.attributes}));
            return this;
        },
                
         

    });

});
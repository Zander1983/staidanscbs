define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),    
        tpl                 = require('text!tpl/TweetList.html'),
        template = _.template(tpl);
  

    return Backbone.View.extend({

        initialize: function (options) {
            this.render(options);
            this.collection.on("reset", this.render, this);
        },

        render: function (options) {
            
            //console.log('twttr is ');
    
          //  console.log(twttr.txt.autoLink(this.collection.first().get('text'), {suppressNoFollow: true, suppressDataScreenName: true}));
            
      
            this.$el.html(template({items: this.collection.toJSON()}));
            return this;
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

    });

});
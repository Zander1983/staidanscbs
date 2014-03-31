define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        UsefulFuncs         = require('app/utils/useful_func'),
        tpl                 = require('text!tpl/GenericItem.html'),
        template = _.template(tpl);

    return Backbone.View.extend({

        initialize: function (options) {
            this.removeDescriptionStyles();
            this.checkImagePaths();
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
                
        
        removeDescriptionStyles: function(){
      
            var description = UsefulFuncs.removeStyles(this.model.attributes.description);
            
            if(description.length>0){
                this.model.set({description: description});
            }     
        },
                
        /*
         * Check to see if image paths are relative
         */     
        checkImagePaths: function(){
    
            var src = "";
            var description = this.model.attributes.description;     
            $(description).find('img').each(function(i, obj){
                

                    src = $(obj).attr('src');
                    if(src.indexOf('http') === -1){
                        //therefore its a relative path
                        description = description.replace(src,feed_domain+src);                         
                    }
            });
            
            this.model.set({description: description});
    
        }

    });

});
define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        models              = require('app/models/article_view'),
        Useful              = require('app/utils/useful_func'),
        tpl                 = require('text!tpl/Article.html'),
        template            = _.template(tpl),
        that;

    return Backbone.View.extend({

        initialize: function (options) {

            that = this;
            this.render();
            //save that user has seen it
            //this.saveView(options);
        },
                
        saveView: function(){
   
            var viewDetails = [];
            
            this.storage = window.localStorage;

            this.device_id = this.storage.getItem(project_title+'_device_id');
            this.api_key = this.storage.getItem(project_title+'_api_key');
            

            if(typeof(this.device_id)!=='undefined' && this.device_id!==null){
                viewDetails.device_id = this.device_id;
                viewDetails.article_id = this.model.id;
                viewDetails.project_title = project_title;

                var article_view = new models.ArticleView();

                return article_view.save(viewDetails, 
                                {
                                api:true,
                                headers: {device_id:this.device_id,
                                api_key:this.api_key},
                                success: function(data) {

                                        Useful.updateCountEl(data.get('count'));

                                    },
                                    error:   function(model, xhr, options){
                                
                                    },
                                });
            }
    
        },    
        

        render: function (options) {
            
            this.$el.html(template({title:this.model.get('title'),
                                    content: this.model.get('content')
                                    }));
            return this;
        },
                
                
        events: {
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
define(function (require) {

    "use strict";

    var Backbone            = require('backbone'),
      
    
        ArticleView = Backbone.Model.extend({  

            urlRoot: "/article_view",   

        }), 
        
        ArticleViewCount = Backbone.Model.extend({  

            initialize: function (options) {
                this.device_id = options.device_id;
                this.project_title = options.project_title;
                
            },
            urlRoot: function(){
                    return "/article_view_count/"+this.device_id+'/'+this.project_title;
                 },

        }), 
        
        ArticleViewCollection = Backbone.Collection.extend({

            model: ArticleView,
            initialize: function (options) {
                this.project_title = options.project_title;
            },
            url: function(){
                    return "/article_views/"+this.project_title;
                 },

        });


    return {
        ArticleView: ArticleView,
        ArticleViewCount:ArticleViewCount,
        ArticleViewCollection: ArticleViewCollection
    };

});
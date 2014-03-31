define(function (require) {

    "use strict";

    var Backbone            = require('backbone'),
      
    
        Article = Backbone.Model.extend({  

            urlRoot: "/article",   

        }), 
        
        ArticleCollection = Backbone.Collection.extend({

            model: Article,
            initialize: function (options) {
                this.device_id = options.device_id;
                this.project_title = options.project_title;
            },
            url: function(){
                    return "/articles/"+this.device_id+'/'+this.project_title;
                 },


        });


    return {
        Article: Article,
        ArticleCollection: ArticleCollection
    };

});
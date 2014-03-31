define(function (require) {

    "use strict";

    var Backbone            = require('backbone'),

        Tweet = Backbone.Model.extend(),

        TweetCollection = Backbone.Collection.extend({
            
            model: Tweet,
           
            url: function(){
                    if(in_browser===false){
                        return "/twitter/"+twitter_handle;
                    }
                    else{
                        return "/twitter/"+twitter_handle;
                    }
            },
                    
        });

    return {
        Tweet: Tweet,
        TweetCollection: TweetCollection
    };

});
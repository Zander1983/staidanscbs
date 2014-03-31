define(function (require) {

    "use strict";

    var Backbone            = require('backbone'),
        Feeds               = require('app/utils/feed_paths'),
        id=1,
        xml,
        parsed_albums = [], 
        num_photos,
        id,
        title,
        
        
        Album = Backbone.Model.extend({  

 
        }),

        
        AlbumCollection = Backbone.Collection.extend({

            model: Album,
            
            initialize: function (options) {
                this.flickr_api_key = options.flickr_api_key;
                this.flickr_user_id = options.flickr_user_id;
            },
                        
            url: function(){

                    if(in_browser===false){
                        return'http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key='+this.flickr_api_key+'&user_id='+this.flickr_user_id;
                    }
                    else{
                        return "/school-proxy.php?context="+Backbone.history.fragment+"&flickr_api_key="+this.flickr_api_key+"&flickr_user_id="+this.flickr_user_id;
                    }
            },
            
        
            parse: function (data) {
                xml = data;
                
                $(xml).find('photoset').each(function (index) {
                    
                    title = $(this).find('title').text();
                    id = $(this).attr('id');                    
                    num_photos = $(this).attr('photos');
         
                    parsed_albums.push({id:id, title: title, num_photos:num_photos});
                   
                });

                return parsed_albums;
            },
                    

            fetch: function (options) {
                options = options || {};
                options.dataType = "xml";
                return Backbone.Collection.prototype.fetch.call(this, options);
            }

        });


    return {
        Album: Album,
        AlbumCollection: AlbumCollection
    };

});
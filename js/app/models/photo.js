define(function (require) {

    "use strict";

    var Backbone            = require('backbone'),
        Feeds               = require('app/utils/feed_paths'),
        id=1,
        xml,
        parsed = [], 
        album_title = "",
        title = "",
        url_s = "",
        url_o = "",
        url_sq = "",
        url_m = "",
        
        Photo = Backbone.Model.extend({  
 
        }),

        
        PhotoCollection = Backbone.Collection.extend({

            model: Photo,
                    
            url: function(){

                    if(in_browser===false){
                        return 'http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key='+this.flickr_api_key+'&user_id='+this.flickr_user_id+'&extras=url_sq,url_t,url_s,url_m,url_o&photoset_id='+this.photoset_id;
                    }
                    else{
                        return "/school-proxy.php?context=photos&photoset_id="+this.photoset_id+"&flickr_api_key="+this.flickr_api_key+"&flickr_user_id="+this.flickr_user_id;
                    }
            },
         
            
            initialize: function (models, options) {
                parsed = [];
                this.photoset_id = options.photoset_id;
                this.flickr_api_key = options.flickr_api_key;
                this.flickr_user_id = options.flickr_user_id;
            },
        
            parse: function (data) {
                xml = data;
                album_title = "";              

                album_title = $(xml).find('photoset').attr('title');
                
                            
                $(xml).find('photo').each(function (index) {

                    id = $(this).attr('id'); 
                    title = $(this).attr('title');       
                    url_s = $(this).attr('url_s');
                    url_o = $(this).attr('url_o');
                    url_m = $(this).attr('url_m');
                    url_sq = $(this).attr('url_sq');
  
                    parsed.push({id:id, album_title:album_title, title: title, 
                                 url_s:url_s, url_o:url_o, url_m:url_m, url_sq:url_sq});
                
                });

                return parsed;
            },
                    

            fetch: function (options) {
                options = options || {};
                options.dataType = "xml";
                return Backbone.Collection.prototype.fetch.call(this, options);
            }

        });


    return {
        Photo: Photo,
        PhotoCollection: PhotoCollection
    };

});
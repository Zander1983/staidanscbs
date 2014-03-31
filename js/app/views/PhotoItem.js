define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/PhotoItem.html'),
        template = _.template(tpl),
        album_title;

    return Backbone.View.extend({

        initialize: function () {
            
            //var index = this.collection.indexOf(this.model);
            //var before = this.collection.at(index-1);
            //var after = this.collection.at(index+1);
            
            this.render();     
        },

        render: function () {
            album_title = this.model.attributes.album_title;
            
            
            this.$el.html(template({model:this.model.attributes, album_title:album_title}));
            
            this.loadIMage();
            //this.$el.html(template({side_nav:side_nav, model:this.model.attributes, before:before, after:after}));
            return this;
        },
                
                
        loadIMage: function(){

            var img = new Image();

            // wrap our new image in jQuery, then:
            $(img)
              // once the image has loaded, execute this code
              .load(function () {
                // set the image hidden by default    
                $(this).hide();

                // with the holding div #loader, apply:
                $('#loader')
                  // remove the loading class (so no background spinner), 
                  .removeClass('loading')
                  // then insert our image
                  .append(this);

                // fade our image in to create a nice effect
                $(this).fadeIn();
              })

              // if there was an error loading the image, react accordingly
              .error(function () {
                // notify the user that the image could not be loaded
              })

              // *finally*, set the src attribute of the new image to our image
              .attr('src', this.model.attributes.url_m);


                },

    });

});
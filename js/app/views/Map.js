define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Map.html'),
        template = _.template(tpl),
        that;
        
     function clickAway(event) {
    
        that.body.find('#main-content').css('min-height', '872px'); 
        document.removeEventListener('backbutton', clickAway);
       
    }


    return Backbone.View.extend({

        initialize: function (options) {
            this.body = options.body;
            that = this;
            this.render();
            
            document.addEventListener('backbutton', clickAway);
        },
                
        initMap: function () {
    
            require(['async!https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'], function(){
            
                that.myLatlng = new google.maps.LatLng(52.51722,-9.675377);

                that.mapOptions = {
                   center: that.myLatlng,
                   zoom: 15,
                   mapTypeId: google.maps.MapTypeId.ROADMAP
               };


               that.map = new google.maps.Map(that.$el.find('#map-canvas')[0],
                                             that.mapOptions);

                that.marker = new google.maps.Marker({
                   position: that.myLatlng,
                   map: that.map,
                   school_name: school_name
               });
            });

        },


        render: function () {
    
            this.$el.html(template());

            this.initMap();      
           
        },


    });

});
define(function (require) {

    "use strict";

    var Backbone    = require('backbone'),
        PageSlider  = require('app/utils/pageslider'),
        Useful      = require('app/utils/useful_func'),
        projectModel = require("app/models/project"),
        slider      = new PageSlider($('body')),
        generic,
        tweets,
        event,
        photos,
        albums,
        articles,
        deviceModel,
        that,
        flickr_api_key,
        flickr_user_id,
        feed_domain,
        project;

    return Backbone.Router.extend({

        routes: {
            "": "getHome",
            "news": "getGeneric",
            "news-item/:id": "getGenericItem",
            "about": "getGeneric",
            "about-item/:id": "getGenericItem",
            "people": "getGeneric",
            "people-item/:id": "getGenericItem",
            "academic": "getGeneric",
            "academic-item/:id": "getGenericItem",
            "sport": "getGeneric",
            "sport-item/:id": "getGenericItem",         
            "extra-curricular": "getGeneric",
            "extra-curricular-item/:id": "getGenericItem",         
            
            /*****In Every Project**************/
            "contact": "getContact",
            "events": "getEvent",
            "events-item/:id": "getEventItem",
            "facebook": "getFacebook",
            "tweets": "getTweets",
            "tweets-item/:id": "getTweetsItem",
            "albums": "getAlbums",
            "photos/:id": "getPhotos",
            "photo-item/:id": "getPhotoItem",
            "notification": "getNotification",
            "messages/:project_title": "getArticles",
            "message/:id": "getArticle",
            "waypay": "getWayPay",
            "map": "getMap",
        },
        
        initialize: function() {   
            
            that = this;
            that.body = $('body');
            this.setupShell();
            
            //this.bind( "route", this.routeChange);
            
            this.storage = window.localStorage;
            
            this.setProjectDetails();

            this.setDeviceDetails();
 
            if(typeof(this.device_id)!=='undefined' && this.device_id!==null){
                //only update counter if we know device_id. the first time gets installed, 
                //we wont be able to get device_id cos it can take some time to come back from registering
                //with apple/google
                this.updateMessageCounter();
            }
       

            $.ajaxPrefilter( function( options, originalOptions, jqXHR ) { 
                
                if(options.pure_ajax==true){
                    return;
                }

                if(options.api==true){
                    //172.16.22.68
                    //options.url = "http://localhost/schoolspace/device_api" + options.url;
                    
                    if(in_browser===true){
                        options.url = "http://localhost/schoolspace.me/device_api" + options.url;    
                    }
                    else{
                        if(options.update_notification==true){
                           //options.url = "http://localhost/schoolspace/device_api/update_notification" + options.url+"";   
                           options.url = push_server_url+"/device_api/update_notification" + options.url+"";   
                        }
                        else{
                            //options.url = "http://localhost/schoolspace/device_api" + options.url;   
                            options.url = push_server_url+"/device_api" + options.url;          

                        }
                    }
                }
                else{
                    if(in_browser===true){
                        //this is when testing in a browser
                        options.url = 'http://localhost/schoolspace/cli/'+project_title+'/www/scripts' + options.url   
                    }
                }
   
  
           });


            
        },
          
                
         /******************STANDARD HELPER FUNCTIONS*******************/       
         getHome: function(){
    
            require(["app/views/Home"], function (Home) {

                if(is_push===false){
                    slider.slidePage(new Home().$el);                       
                }
                is_push = false;

            });
            
    
        },
                
 
        setupShell: function(){
    
            require(["app/views/SetupShell"], function (SetupShell) {

                new SetupShell({body:that.body});

            });
            
    
        },
                
        setDeviceDetails: function(){
  
            this.device_id = this.storage.getItem(project_title+'_device_id');
            this.api_key = this.storage.getItem(project_title+'_api_key');
        },
                
                
        setFlickrDetails: function(){
  
            project.fetch({
                api: true,
                headers: {device_id:that.device_id,api_key:that.api_key},        
                success: function (data) {
                    flickr_user_id = data.get('flickr_user_id');
                    flickr_api_key = data.get('flickr_api_key');
                },
                error:function(model, xhr, options){    
                    console.log('there was an error');                  
                }
            });
        },
                
        routeChange: function(){
    
            $('html,body').scrollTop(0);
    
        },
                
                
        updateMessageCounter: function(){
       
            require(["app/models/article_view"], function (models) {
           
                var article_view_count = new models.ArticleViewCount({device_id: that.device_id, 
                                                                      project_title: project_title
                                                                        });
                
                article_view_count.fetch( 
                    {
                    api: true,
                    headers: {device_id:that.device_id,api_key:that.api_key},
                    success: function (data) {
                        that.message_count = data.get('count');
                        Useful.updateCountEl(that.message_count);
     
                    },
                    error: function(){
                        console.log('failed updateMessageCounter');
                    }
                }); 
                
            });
            
        },
          
        /******************ENDING STANDARD HELPER FUNCTIONS*******************/
        
        /*******************ROUTES START HERE***************************/
 
        
        getGeneric: function () {

                    if((typeof(generic)==='undefined' || generic===null)){

                        that.reGenerate();
                    
                    }
                    else if(generic.getType()!==Backbone.history.fragment){

                        that.reGenerate();
                        
                    }
                    else{
                        require(["app/views/GenericList"], function (GenericList) {                       
                            Useful.correctView(that.body);
                            slider.slidePage(new GenericList({collection: generic}).$el);
                        });
                    }
      
        },
        
        reGenerate: function(){

            require(["app/models/generic", "app/views/GenericList"], function (model, GenericList) {

                    Useful.showSpinner();
                    
                    if(typeof(feed_domain)==='undefined' || feed_domain===null){

                        $.when(that.setProjectDetailsWait()).done(function(data){

                        });

                    }


                    generic = new model.GenericCollection({feed_domain:feed_domain});

                    generic.fetch({
                        update:false,
                        success: function (collection) {
                            Useful.correctView(that.body);

                            if(is_push===false){
                                slider.slidePage(new GenericList({collection: collection}).$el);                         
                            }
                            is_push = false;

                            Useful.hideSpinner();

                        },
                        error:   function(model, xhr, options){
                           Useful.correctView(that.body); 
                           Useful.hideSpinner();
                           Useful.checkNetwork(slider);

                        },

                    });
            });
        },
        
        
        
        getGenericItem: function (id) {
            
            require(["app/views/GenericItem"], function (GenericItem) {

                Useful.correctView(that.body);
                 slider.slidePage(new GenericItem({model: generic.get(id)}).$el);
                                 
            });
        },
                
        getEvent: function () {
            
            require(["app/models/event", "app/views/EventList"], function (model, EventList) {
       
                if(typeof(event)==='undefined' || event===null){
                    Useful.showSpinner();
                    
                    event = new model.EventCollection();
                    
                    event.fetch({
                        success: function (collection) {
                            Useful.correctView(that.body);
                            slider.slidePage(new EventList({collection: collection}).$el);                          
                            Useful.hideSpinner();
                        },
                        error:function(){
                            Useful.correctView(that.body); 
                            Useful.hideSpinner();
                            Useful.checkNetwork(slider);

                        }
                    });
                }
                else{
                    Useful.correctView(that.body);
                    slider.slidePage(new EventList({collection: event}).$el);
                }
                
                
                            
            });
        },
       
                
        getEventItem: function (id) {
            require(["app/views/EventItem"], function (EventItem) {
                Useful.correctView(that.body);
                 slider.slidePage(new EventItem({model: event.get(id)}).$el);
                                 
            });
        },
                
        getFacebook: function () {
            
            require(["app/views/Facebook"], function (Facebook) { 
                Useful.correctView(that.body);
                slider.slidePage(new Facebook().$el);               
             });
        },

        getTweets: function () {

            require(["app/models/tweet", "app/views/TweetList"], function (models, TweetList) {
     
                if(typeof(tweets)==='undefined' || tweets===null){
                    
                    Useful.showSpinner();
                    
                    tweets = new models.TweetCollection(); 
          
                    tweets.fetch({
                        api: true,
                        headers: {device_id:that.device_id,api_key:that.api_key},
                        success: function (collection) {
                            Useful.correctView(that.body);
                            slider.slidePage(new TweetList({collection: collection}).$el);                      
                            Useful.hideSpinner();
                        }, 
                        error: function(){
                                Useful.correctView(that.body);
                                Useful.hideSpinner();
                                Useful.checkNetwork(slider);
                        }
                    }); 
                    
                    
                }
                else{
                    Useful.correctView(that.body);
                    slider.slidePage(new TweetList({collection: tweets}).$el);
                }
                                 
            });
           
        },
        
        getTweetsItem: function (id) {
            
            require(["app/views/TweetItem"], function (TweetItem) {

                Useful.correctView(that.body);
                 slider.slidePage(new TweetItem({model: tweets.get(id)}).$el);
                                 
            });
        },
                
                
        getAlbums: function (id) {
            //body.removeClass('left-nav');
            require(["app/models/album", "app/models/project", "app/views/AlbumList"], function (model, projectModel, AlbumList) {
       
                if(typeof(albums)==='undefined' || albums===null){
                    
                    Useful.showSpinner();
                    
                    /*
                     * FOR BROWSER TESTING
                     */
                    /*
                    if(in_browser===true){
                        that.device_id = test_device_id;
                        that.api_key = test_api_key;
                    }
                    
                    if(is_emulator===true){
                        that.device_id = test_device_id;
                        that.api_key = test_api_key;
                    }*/
                    
                    if(typeof(that.device_id)==='undefined' || that.device_id===null){
                        that.setDeviceDetails();
                    }
                    
                    
                    if(typeof(flickr_api_key)==='undefined' || flickr_api_key===null){

                        console.log('before the when');
                        $.when(that.setProjectDetailsWait()).done(function(data){

                        });
                        console.log('after the when');
                    }

                    albums = new model.AlbumCollection({flickr_api_key:flickr_api_key, flickr_user_id:flickr_user_id});

                    albums.fetch({
                        full_url: false,
                        success: function (collection) {
                            Useful.correctView(that.body);
                            slider.slidePage(new AlbumList({collection: collection}).$el);
                            Useful.hideSpinner();
                        },
                        error: function(){
                                Useful.correctView(that.body);
                                Useful.hideSpinner();
                                Useful.checkNetwork(slider);
                        }
                    });
         


                }
                else{ 
                    Useful.correctView(that.body);
                    slider.slidePage(new AlbumList({collection: albums}).$el);
                }
                            
            });
        },
        
        
        
         getPhotos: function (id) {
            //body.removeClass('left-nav');
            require(["app/models/photo", "app/views/PhotoList"], function (model, PhotoList) {
                
                
                    if(typeof(that.flickr_api_key)==='undefined' || that.flickr_api_key===null){
                        that.setFlickrDetails();
                    }

                    Useful.showSpinner();
                    photos = new model.PhotoCollection([], {flickr_api_key:flickr_api_key,
                                                            flickr_user_id:flickr_user_id,
                                                            photoset_id:id});
                    
                    photos.fetch({
                        full_url: true,
                        success: function (collection) {
                            Useful.correctView(that.body);
                            slider.slidePage(new PhotoList({collection: collection}).$el);
                            Useful.hideSpinner();
                            
                            $('img.lazy').lazyload();                            
                            setTimeout(function(){
                                $(window).trigger('scroll');
                            },1000);
                        
                        },
                        error: function(){
                                Useful.correctView(that.body);
                                Useful.hideSpinner();
                                Useful.checkNetwork(slider);
                        }
                    });
                            
            });
        },
        
        getPhotoItem: function (id) {
            //body.removeClass('left-nav');
            require(["app/views/PhotoItem"], function (PhotoItem) {
                 Useful.correctView(that.body);
                 slider.slidePage(new PhotoItem({model: photos.get(id)}).$el);
                           
            });
        },
                
                
        getWayPay: function () {
            
            require(["app/views/WayPay"], function (WayPay) {
                Useful.correctView(that.body);
                slider.slidePage(new WayPay().$el);               
             });
        },
                
                
        getNotification: function () {
            
            require(["app/models/device", "app/views/Notification"], function (model, Notification) {
                
                  if(typeof(deviceModel)==='undefined' || deviceModel===null){
                        Useful.showSpinner();
 
                        if(typeof(that.device_id)==='undefined' || that.device_id===null){
                            that.setDeviceDetails();
                        }
                        
                        deviceModel = new model.Device({id:that.device_id});


                        if(typeof(that.device_id)==='undefined' || that.device_id===null || typeof(that.api_key)==='undefined' || that.api_key===null){
                            Useful.hideSpinner();
                            Useful.correctView(that.body);
                            Useful.showAlert('Could not get notification settings, please try again later', 'Problem');
                            window.location.hash = "news";
                        }
                        else{   
                            deviceModel.fetch({
                                api: true,
                                headers: {device_id:that.device_id,api_key:that.api_key},        
                                success: function (data) {
                                    Useful.correctView(that.body);
                                    slider.slidePage(new Notification({model: data
                                                                        }).$el);   
                                    Useful.hideSpinner();
                                },
                                error:function(model, xhr, options){    
                                    Useful.correctView(that.body);
                                    Useful.hideSpinner();
                                    Useful.checkNetwork(slider);                  
                                }
                            });
                        }
                    
                  }else{    
                        Useful.correctView(that.body);
                        slider.slidePage(new Notification({model: deviceModel
                                                            }).$el);    
                  }

       
             });
        },
        
        
                
        getArticle: function (id) {
 
            require(["app/models/article", "app/views/Article"], function (models, Article) {
                               
                if(typeof(articles)==='undefined' || articles===null){
                    Useful.showSpinner();
                    
                    if(typeof(that.device_id)==='undefined' || that.device_id===null){
                        that.setDeviceDetails();
                    }

                    var article = new models.Article({id: id});

                    article.fetch({
                        api: true,
                        headers: {device_id:that.device_id,api_key:that.api_key},
                        success: function (data) {
                            
                            var articleView = new Article({model: data});

                            Useful.correctView(that.body);
                            slider.slidePage(articleView.$el);
                            
                            Useful.hideSpinner();

                            $.when(articleView.saveView()).done(function(data){
                                that.message_count = data.count;
                            });
          
                            data.set('seen', '1');
                            
                            setTimeout(function(){
                                is_push = false;
                            },1000);

                        },
                        error:function(){  
                            Useful.correctView(that.body);
                            Useful.hideSpinner();
                            Useful.checkNetwork(slider);                  
                        }
                    });
                    
                }
                else{
                    
                    var articleView = new Article({model: articles.get(id), 
                                                   device_id:that.device_id,
                                                   api_key:that.api_key
                                                    });
                                                    
                    Useful.correctView(that.body);
                    slider.slidePage(articleView.$el);

                    $.when(articleView.saveView()).done(function(data){
                        that.message_count = data.count;
                    });

                    articles.get(id).set('seen', '1');

                }

            });

        },
        
        
        getArticles: function (project_title) {
            
            require(["app/models/article", "app/views/ArticleList"], function (models, ArticleList) {
             
                if(typeof(articles)==='undefined' || articles===null){
                    Useful.showSpinner();
                    
                    if(typeof(that.device_id)==='undefined' || that.device_id===null){
                        that.setDeviceDetails();
                    }
                    
                    if(typeof(that.device_id)!=='undefined' && that.device_id!==null){
                       
                        articles = new models.ArticleCollection({device_id: that.device_id, project_title: project_title
                                                                });

                        articles.fetch({
                            api: true,
                            headers: {device_id:that.device_id,api_key:that.api_key},
                            success: function (collection) {
      
                                Useful.correctView(that.body);
                                slider.slidePage(new ArticleList({collection: collection}).$el);
                                Useful.hideSpinner();
                            }, 
                            error:   function(model, xhr, options){
                                Useful.correctView(that.body);
                                Useful.hideSpinner();
                                Useful.checkNetwork(slider);                  
                            }
                        }); 
                        
                    }
                    else{
                        Useful.showAlert('There was aproblem accessing messages, please close and reopen app and try again', 'One moment...');
                    }


                }
                else{

                    Useful.correctView(that.body);
                    slider.slidePage(new ArticleList({collection: articles}).$el);
                }
  

            });
        },
        
        
        getMap: function () {
            
            require(["app/views/Map"], function (Map) {    
                var mapView = new Map({body:that.body});
                //mapView.delegateEvents();
                Useful.showSpinner();
                
                Useful.correctView(that.body);
                slider.slidePage(mapView.$el);
                mapView.render();
                
                that.body.find('#main-content').css('min-height', '500px');
                
                Useful.hideSpinner();
             });
        },
                
        getContact: function () {
            
            require(["app/views/Contact"], function (Contact) { 
                Useful.correctView(that.body);
                slider.slidePage(new Contact().$el);               
             });
        },
                
                
        setProjectDetails: function(){
    
            require(["app/models/album", "app/models/project", "app/views/AlbumList"], function (model, projectModel, AlbumList) {
              
                
                    project = new projectModel.Project({id:project_title});
                    //get flicker details

                    project.fetch({
                        api: true,
                        headers: {device_id:standard_device_id,api_key:standard_api_key},        
                        success: function (data) {

                            flickr_user_id = data.get('flickr_user_id');
                            flickr_api_key = data.get('flickr_api_key');
                            feed_domain = data.get('feed_domain');
         
                        },
                        error:   function(model, xhr, options){
                           console.log('in setProjectDetails error');
                        },
                    });     
            });    
        },
        
        
        setProjectDetailsWait: function(){
     
                    project = new projectModel.Project({id:project_title});

                    return project.fetch({
                        api: true,
                        async:false,
                        headers: {device_id:standard_device_id,api_key:standard_api_key},        
                        success: function (data) {
                            
                            console.log('after the success');

                            flickr_user_id = data.get('flickr_user_id');
                            flickr_api_key = data.get('flickr_api_key');
                            feed_domain = data.get('feed_domain');
         
                        },
                        error:   function(model, xhr, options){
                           console.log('in setProjectDetails error');
                        },
                    });     
  
        },

    });

});
define(function (require) {

    "use strict";

    var _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/SetupShell.html'),
        template            = _.template(tpl),
        that;

    return Backbone.View.extend({

        initialize: function (options) {
            that = this;
            this.render();
        },

        render: function (options) {
         
            //this.$el.html(template({side_nav:side_template({message_count:0})}));
            //return this;

            this.options.body.append(template());
            
            this.doBinds();
        },

        doBinds: function(){
   

            this.options.body.find("div#side-nav-cont a").click( function() {
                //console.log('in side nav click');


                $( this ).parent().parent().parent().find('li').each(function(){
                    //console.log('in the each');
                    $( this ).removeClass( 'side-nav-active' );
                });

                $( this ).parent().addClass( 'side-nav-active' );

             });
                   
                   
            this.options.body.on("click", "#slide-menu-button", function (e) {
                
                
                if(window.location.hash==="#map"){
                    that.options.body.find('#main-content').css('min-height', '872px'); 
                }
                if (that.options.body.hasClass('left-nav')) {

                    that.options.body.removeClass('left-nav');
                   // $('.side-nav').hide();
                } else {
                   // $('.side-nav').show();
                    that.options.body.addClass('left-nav');           
                }
            });
            
            

            this.options.body.on("click", "#main-content", function (e) {

                that.options.body.removeClass('left-nav');
                //$('.side-nav').hide();

            });



            this.options.body.on('click', '.list a', function(event) {
                $(this).parent('li').addClass('tappable-active');
            });


                
            this.options.body.find("div#side-nav-cont a").click( function() {

                if(window.location.hash==="#map"){
                    that.options.body.find('#main-content').css('min-height', '872px'); 
                }

              $( this ).parent().parent().parent().find('li').each(function(){
                  //console.log('in the each');
                  $( this ).removeClass( 'side-nav-active' );
              });

              $( this ).parent().addClass( 'side-nav-active' );


           });

           
    
        },
      

    });

});
define(function (require) {

    "use strict";

 
    var UsefulFuncs = {};

   
    UsefulFuncs.getMonth = function(date_str) {
    
        var objDate = new Date(date_str);

    };
  
  
    UsefulFuncs.hideAlert = function() {
        $('.alert').hide();
    };
    

    UsefulFuncs.loadURL = function (url){
        navigator.app.loadUrl(url, { openExternal:true });
        return false; 
    };
    
    
    UsefulFuncs.linkClicked = function (e) {    
        e.preventDefault();
        var url = $(e.currentTarget).attr("rel"); 
        UsefulFuncs.loadURL(url);
    };

    UsefulFuncs.walk_the_DOM = function walk(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walk(node, func);
            node = node.nextSibling;
        }
    };
    
    /*
     * Very important function which removes all inner styling but leaves the tags. 
     * It also removes image height and width attributes
     */
    UsefulFuncs.removeStyles = function(html){
            
            var $html = $("<div>"+html+"</div>");
            
            $html.find('[style]').removeAttr('style');     
            $html.find('img').removeAttr('width').removeAttr('height');
            $html.find('table td').removeAttr('width').removeAttr('height');
            
            return $html.html();
    };
    
    
    UsefulFuncs.replaceURLWithHTMLLinks = function (text) {
            var exp = /(\b(www\.|http\:\/\/)\S+\b)/ig;
            return text.replace(exp,"<a href='$1'>$1</a>"); 
    };
    
    UsefulFuncs.updateCountEl = function (count) {
          
            var el = $('#message-count');
        
            if(count>0){
         
                el.html(count);
                if(!el.hasClass('topcoat-notification')){
                    el.addClass('topcoat-notification');
                }
         
            }
            else{
          
                //so its 0, remove class and empty html
                el.removeClass('topcoat-notification');
                el.empty();
            }

    };
    
    UsefulFuncs.correctView = function(body){
            
           body.removeClass('left-nav');
           body.scrollTop(0);
    };
    

    
    UsefulFuncs.showAlert = function(text, title) {
 
        navigator.notification.alert(
            text,  // message
            function(){},         // callback
            title            // title
        );
    };
    
    UsefulFuncs.showConfirm = function(text, title, klass) {
        return confirm(text);
        
        //navigator.notification.confirm();
        /*$('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();*/
    };
    
    
    UsefulFuncs.showSpinner = function(body){
            
            try {
              spinnerplugin.show();
            } 
            catch(e) {
            } 
            finally {

            }
    };
    
    UsefulFuncs.hideSpinner = function(body){
            
            try {
                spinnerplugin.hide();
            } 
            catch(e) {

            } 
            finally {

            }
    };
    


    UsefulFuncs.checkNetwork = function(slider){

        try {
                var networkState = navigator.connection.type;

                //do this for Andriod, check for ios
                if(networkState===Connection.NONE){

                    require(["app/views/NoConnection"], function (NoConnection) {
                        slider.slidePage(new NoConnection().$el); 
                    }); 

                }
                else{
                    require(["app/views/Unknown"], function (Unknown) {
                        slider.slidePage(new Unknown().$el); 
                    });          
                }
            } 
            catch(e) {
                    require(["app/views/Unknown"], function (Unknown) {
                        slider.slidePage(new Unknown().$el); 
                    });  
            } 
        
    };


    UsefulFuncs.testCode = function(){
      
                                var start = +new Date();  // log start timestamp
                                for(var x=0; x++; x<1000){
                                    var $news = $('#news');
                                }
                                var end =  +new Date();  // log end timestamp
                                var diff = end - start;
                                console.log('diff for #news is ');
                                console.log(diff);

                                var start = +new Date();  // log start timestamp
                                for(var x=0; x++; x<1000){
                                    var $news = $('li#news');
                                }
                                console.log('$news is ');
                                console.log($news);
                                
                                var end =  +new Date();  // log end timestamp
                                var diff = end - start;
                                console.log('diff for li#news is ');
                                console.log(diff); 
        
    };
    
    return UsefulFuncs;

    
});
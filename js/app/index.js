
var app = {
    // Application Constructor
    initialize: function() {
        
        this.bindEvents();
        
    },
  
    
    // Bind Event Listeners

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
     
         
     getPush: function(){
 
        return this.push; 
 
     },
             
     setPush: function(){
        //alert('in setPush');
        this.push = "1"; 
 
     },
             
    /*
     * This function registers the device with the server, and stores the device id and the api key.
     * This should only ever execute once. 
     */
    registerDeviceWithServer: function(reg_id){
            
            var url = push_server_url+"/device_api/device";
            //var url = "http://localhost/schoolspace/device_api/device";
           
          
            $.ajax({
                url: url,
                type: "post",
                data: {project_title: project_title, platform: window.device.platform},
                pure_ajax: true,
                headers :{device_id:standard_device_id,
                api_key:standard_api_key},
                success: function(data){

                    var obj = jQuery.parseJSON(data);
                
                    var device_id = obj.id;
                    var api_key = obj.api_key;
                    window.localStorage.setItem(project_title+'_device_id', device_id);
                    window.localStorage.setItem(project_title+'_api_key', api_key);

                    //now update the Reg Id
                    app.updateRegId(device_id, api_key, reg_id);
                    
                },
                error:   function(model, xhr, options){

                    console.log('error reggistering, response is : ');
                    console.log(xhr.responseText);
                },
            });
    },
    
    
    updateRegId: function(device_id, api_key, reg_id){
        
            var url = push_server_url+"/device_api/device/"+device_id;
   
            $.ajax({
                url: url,
                type: "put",
                data: {reg_id: reg_id},
                pure_ajax: true,
                headers :{device_id:device_id,
                api_key:api_key},
                success: function(data){
                    //alert("success in updateRegId");
                    
                },
                error:   function(model, xhr, options){
       
                },
            });
            
    },
     
           
 
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
   
        var pushNotification = window.plugins.pushNotification;
        if (window.device.platform == 'android' || window.device.platform == 'Android') {
    
            pushNotification.register(app.successHandler, app.errorHandler,{"senderID":project_number,"ecb":"app.onNotificationGCM"});                        
        }
        else{
            //so its apple
            pushNotification.register(app.tokenHandler,app.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
        }

    },
            

    // result contains any message sent from the plugin call
    successHandler: function(result) {
       //alert('Callback Success! Result = '+result)
    },
    errorHandler:function(error) { 

        //alert('in errorHandler');
        //alert(error);
    },
           
    /*
     * 
     * For iOS
     */        
    tokenHandler:function(status) {
       
        var device_id = window.localStorage.getItem(project_title+'_device_id');
        var api_key = window.localStorage.getItem(project_title+'_api_key');
        
        if(typeof(device_id)==='undefined' || device_id===null){
            //we dont have a device id so register it and save to local storage. 
            //should only ever enter here once     
            app.registerDeviceWithServer(status);        

        }
        else{
            app.updateRegId(device_id, api_key, status);
        }
       
    },
    
      
    /*
     * For Android Phones
     */
    onNotificationGCM: function(e) {
      

        switch( e.event )
        {
        
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    
                    var device_id = window.localStorage.getItem(project_title+'_device_id');
                    var api_key = window.localStorage.getItem(project_title+'_api_key');


                    if(typeof(device_id)==='undefined' || device_id===null){
                        //we dont have a device id so register it and save to local storage. 
                        //should only ever enter here once     
                  
                        app.registerDeviceWithServer(e.regid);        

                    }
                    else{
                        //so we have already registered device on server. Now update reg_id
                        //console.log('in the else so going to updateRegId and app.reg_id is ');
                        //console.log(app.reg_id);
                        app.updateRegId(device_id, api_key, e.regid);

                    }
                    
                }
                break;

            case 'message':
         
                window.location.hash = "message/"+e.payload.article_id;
         
                break;

            case 'error':
                //alert('GCM error = '+e.msg);
                break;

            default:
               // alert('An unknown GCM event has occurred');
                break;
        }
    }, 
    
    
    onNotificationAPN: function(event) {

        if ( event.article_id )
        {
            is_push = true;
            window.location.hash = "message/"+event.article_id;
            //localStorage.payload =// event.payload   
        }
        
        var pushNotification = window.plugins.pushNotification;
        /*if (event.alert) {
 
            navigator.notification.alert(event.alert);
        }*/
        if (event.badge) {

            pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }


    },

};
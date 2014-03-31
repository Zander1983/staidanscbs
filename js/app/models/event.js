define(function (require) {

    "use strict";

    var Backbone            = require('backbone'),
        Moment              = require('moment'),
        id=1,
        xml,
        parsed = [], 
        title = "",
        content = "",
        when = "",
        startDateTime = "",
        endDateTime = "",
        startTime = "",
        endTime = "",
        startDate = "",
        endDate = "",
        month,
        date,
        
        Event = Backbone.Model.extend({  
 
        }),

        
        EventCollection = Backbone.Collection.extend({

            model: Event,

            url: function(){
                    if(in_browser===false){
                        return 'https://www.google.com/calendar/feeds/'+gmail+'/public/full?orderby=starttime&sortorder=ascending&max-results=10&futureevents=true'
                    }
                    else{
                        return "/school-proxy.php?context=events&gmail="+gmail;
                    }
            },
            
        
            parse: function (data) {
                xml = data;

              
                $(xml).find('entry').each(function (index) {
      
                    title = $(this).find('title').text();
                    content = $(this).find('content').text();
                    when = $(this).find('when');
                    
                    startDateTime = when[0]['attributes']['startTime']['value'];
                    endDateTime = when[0]['attributes']['endTime']['value'];  
                    
                    var t = startDateTime.indexOf("T");
                    if(t !== -1){
                        //so there is a time, extract it
                        startTime = startDateTime.substring(t+1,t+6);
                        startDate = startDateTime.substring(0,t);
                    }
                    else{
                        //no time, so set the date
                        startDate = startDateTime;
                    }
                    
                    t = endDateTime.indexOf("T");
                    if(t !== -1){
                        //so there is a time, extract it
                        endTime = endDateTime.substring(t+1,t+6);
                        endDate = endDateTime.substring(0,t);
                    }
                    else{
                        //no time, so set the date
                        endDate = endDateTime;
                    }
                    
                    var dateObj = new Date(startDate);
                 
                    month = moment(startDate).format("MMM");
                    date = dateObj.getDate();
                    
                    //convert to nice time
                    startDate = moment(startDate).format("MMM Do YY");
                    endDate = moment(endDate).format("MMM Do YY");
                    
                    parsed.push({id:id, title: title, content:content, 
                                month:month, date:date,
                                startDate:startDate, endDate:endDate,
                                startTime:startTime, endTime:endTime});
                   id++;
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
        Event: Event,
        EventCollection: EventCollection
    };

});
require.config({

    baseUrl: 'js/lib',

    paths: {
        app: '../app',
        tpl: '../tpl'
    },

    shim: {
        'backbone': {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require(['backbone', 'app/router'], function (Backbone, Router) {

    var router = new Router();
    
    //Binds.doBinds();

    Backbone.history.start();
    
});



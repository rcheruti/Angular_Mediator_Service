Module.service('MenuService',[function(){
    
    var menuHash = {},
        defaultMenu = null ,
        observerBox = new ObserverBox()
        ;
    
    var modelEvent = { menu: null };
    observerBox.register({ put:modelEvent, remove:modelEvent });
    
    var ref = {
            // Map functions:
        get: function(menuName){
            if( !menuName ) return defaultMenu; 
            return menuHash[menuName];
        },
        put: function(menuName, menuEl){
            if( !menuName || !menuEl ) return ref;
            var menu = menuHash[menuName] = new Menu(menuName, menuEl);
            observerBox.dispatch( 'put', observerBox.event('put',{menu:menu}) );
            return ref;
        },
        remove:function(menuName){
            var menu = menuHash[menuName];
            delete menuHash[menuName];
            observerBox.dispatch( 'remove', observerBox.event('remove',{menu:menu}) );
            return ref;
        },
        
            // Config functions:
        setDefault: function(menuName){
            defaultMenu = menuHash[menuName];
            return ref;
        },
        
            // Listeners functions:
        on: function(eventName, $scopeOrNull, func){
            observerBox.on( eventName, $scopeOrNull, func );
            return ref;
        },
        off: function(eventName, func){
            observerBox.off( eventName, func );
        },
    };
    
    return ref;
}]);

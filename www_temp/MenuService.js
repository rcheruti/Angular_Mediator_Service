
(function(window){


var Module = angular.module('Menu',[]);



function Menu( menuName, menuEl ){
    this.name = menuName;
    this.element = angular.element(menuEl);
    this.open = false;
    this.attrs = [];
}

var proto = Menu.prototype;
proto.put = function(val){  };
proto.remove = function(val){  };
proto.toggle = function(val){  };




function MenuManager(){
    
}

var proto = MenuManager.prototype;



function ObserverBox(){
    this.eventModel = {};
    this.listeners = {};
}

var proto = ObserverBox.prototype ;

proto.register = function(arrEvents){
    if( !(arrEvents instanceof Object) ) arrEvents = [ arrEvents ];
    if( arrEvents instanceof Array ){
        for(var g in arrEvents){
            var evName = arrEvents[g];
            if( !this.listeners[ evName ] ) this.listeners[ evName ] = {};
        }
    }else{
        for(var evName in arrEvents){
            var evModel = arrEvents[evName];
            if( !this.listeners[ evName ] ) this.listeners[ evName ] = {};
            this.eventModel[evName ] = evModel ;
        }
    }
    return this;
};
proto.unregister = function(arrEvents){
    if( !(arrEvents instanceof Array) ) arrEvents = [ arrEvents ];
    for(var i = 0; i < arrEvents.length; i++){
        var evName = arrEvents[i];
        if( this.listeners[ evName ] ) delete this.listeners[ evName ];
        if( this.eventModel[ evName ] ) delete this.eventModel[ evName ];
    }
    return this;
};

    // $scopeOrNull is AngularJs Scope
proto.on = function(eventName, $scopeOrNull, func){
    if( !$scopeOrNull && !func ) return;
    if( !this.listeners[eventName] ) return;
    if( $scopeOrNull && func ){
        $scopeOrNull.$on('$destroy', function(){
            this.off(eventName, func );
        });
    }else if( $scopeOrNull && !func ){
        func = $scopeOrNull ;
    }
    this.listeners[eventName].push( func );
    return this;
};
proto.off = function(eventName, func){
    var listenerArr = this.listeners[eventName];
    for( var g = 0; g < listenerArr.length; g++ ){
        if( func === listenerArr[g] ){
            listenerArr.splice( g, 1 );
            break;
        }
    }
    return this;
};

proto.event = function(eventName, config){
    var copy = angular.merge({}, this.eventModel[eventName], config) ; // LINE WITH DEPENDENCY
    return copy;
};
proto.dispatch = function(eventName, event , syncOrDelay){
    var list = this.listeners[ eventName ];
    if(syncOrDelay === true){
        for(var i = 0; i < list.length; i++){
            list[i]( event );
        }
    }else{
        setTimeout(function(){
            for(var i = 0; i < list.length; i++){
                list[i]( event );
            }
        }, (syncOrDelay? syncOrDelay : 0) );
    }
    return this;
};



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


Module.directive('menuElement',['MenuService',
            function(MenuService){
    return {
        restrict: 'EA',
        scope:{
            'menuElement':'@'
        },
        compile: function(){
            return {
                pre:function($scope, $element, $attr){
                    var menuName = $attr.menuElement ;
                    if(!menuName) throw 'You need to define a name for the menu '
                        +'with the "menu-element" attribute. This is required!';
                    MenuService.put(menuName, $element);
                    $scope.$on('$destroy', function(){
                        MenuService.remove(menuName);
                    });
                }
            };
        }
    };
}]);

Module.directive('menuPut',['MenuService',
        function(MenuService){
    return {
        restrict: 'A',
        priority: 10,
        scope:{
            'menuPut':'@'
        },
        compile: function(){
            return {
                pre: function($scope, $element, $attr){
                    
                }
            };
        }
    };
}]);

Module.directive('menuRef',[function(){
    return {
        priority: 0 , 
        restrict:'A',
        bindToController:{
            'menuRef':'@'
        },
        controller:function(){},
        /*
        compile:function(){
            return {
                pre: function($scope, $element, $attrs, $contr){
                    
                }
            };
        },
        */
    };
}]);

Module.directive('menuRemove',['MenuService',
        function(MenuService){
    return {
        restrict: 'A',
        priority: 10,
        scope:{
            'menuRemove':'@'
        },
        compile: function(){
            return {
                pre: function($scope, $element, $attr){
                    
                }
            };
        }
    };
}]);

Module.directive('menuSwitch',['MenuService',
        function(MenuService){
    return {
        restrict: 'A',
        priority: 10,
        scope:{
            'menuSwitch':'@'
        },
        require:['?menuRef'],
        link: function($scope, $element, $attrs, $contrs){
            var menuName = $contrs[0]? $contrs[0].menuRef : '' ,
                menu = MenuService.get(menuName) ;
            
            MenuService.on('put',$scope, function(ev){
                if(menuName === ev.menu.name) menu = ev.menu;
            });
            MenuService.on('remove',$scope, function(ev){
                if(menuName === ev.menu.name) menu = null;
            });
        }
    };
}]);

Module.directive('menuToggle',['MenuService',
        function(MenuService){
    return {
        restrict: 'A',
        priority: 10,
        scope:{
            'menuToggle':'@'
        },
        compile: function(){
            return {
                pre: function($scope, $element, $attr){
                    
                }
            };
        }
    };
}]);


})(window);

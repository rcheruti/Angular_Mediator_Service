
(function(window){


var Module = angular.module('Menu',['ngTouch']);

Module.run(['$injector',function($injector){
    
    MenuManager.element = $injector.get('$rootElement');
        
}]);



function Menu( menuName, menuEl, manager ){
    this.name = menuName;
    this.element = angular.element(menuEl);
    this.attrs = {};
    this.manager = manager;
}


var proto = Menu.prototype;
proto._valCss = function(val){ return 'menu-'+ val +'-'+this.name ; };
proto._check = function(val){ 
    if(val) this.attrs[val] = true;
    if(!this.manager) return false;
    return true;
};

proto.add = proto.addClass = function(val){ 
    if(!this._check(val))return; 
    this.manager.element.addClass( this._valCss(val) ); 
};
proto.remove = proto.removeClass = function(val){ 
    if(!this._check())return; 
    this.manager.element.removeClass( this._valCss(val) );
};
proto.toggle = proto.toggleClass = function(val){ 
    if(!this._check(val))return; 
    this.manager.element.toggleClass( this._valCss(val) ); 
};
proto.removeAll = proto.removeClassAll = function(){
    var arr = this.attrs;
    for(var g in arr){
        this.removeClass( arr[g] );
    }
};




function MenuManagerConst(){
    this.element = null;
}

//var proto = MenuManagerConst.prototype;

var MenuManager = new MenuManagerConst();




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
        defaultMenuName = null ,
        observerBox = new ObserverBox()
        ;
    
    var modelEvent = { menu: null };
    observerBox.register({ put:modelEvent, remove:modelEvent });
    
    var ref = {
            // Map functions:
        get: function(menuName){
            if( !menuName ) return menuHash[defaultMenuName];
            return menuHash[menuName];
        },
        put: function(menuName, menuEl){
            if( !menuName || !menuEl ) return ref;
            var menu = menuHash[menuName] = new Menu(menuName, menuEl, MenuManager);
            observerBox.dispatch( 'put', observerBox.event('put',{menu:menu}) );
            return ref;
        },
        remove:function(menuName){
            var menu = menuHash[menuName];
            menu.removeClassAll();
            delete menuHash[menuName];
            observerBox.dispatch( 'remove', observerBox.event('remove',{menu:menu}) );
            return ref;
        },
        
            // Config functions:
        setDefault: function(menuName){
            defaultMenuName = menuName;
            return ref;
        },
        
            // Listeners functions:
        on: function(eventName, $scopeOrNull, func){
            observerBox.on( eventName, $scopeOrNull, func );
            return ref;
        },
        off: function(eventName, func){
            observerBox.off( eventName, func );
        }
    };
    
    return ref;
}]);


Module.directive('menuElement',['MenuService',
            function(MenuService){
    return {
        priority: 0,
        restrict: 'EA',
        scope:false,
        compile: function(){
            return {
                pre:function($scope, $element, $attr){
                    var menuName = $attr.menuElement ;
                    var menuDefault = ($attr.menuDefault || '').toLowerCase() === 'true'? true : false ;
                    if(!menuName) throw 'You need to define a name for the menu '
                        +'with the "menu-element" attribute. This is required!';
                    MenuService.put(menuName, $element);
                    if( menuDefault ) MenuService.setDefault( menuName );
                    $scope.$on('$destroy', function(){
                        MenuService.remove(menuName);
                    });
                }
            };
        }
    };
}]);

Module.directive('menuRef',['MenuService',
        function(MenuService){
    return {
        priority: 0 , 
        restrict:'A',
        scope:true,
        controllerAs: '$ctrl',
        controller:function(){},
        compile:function(){
            return {
                pre: function($scope, $element, $attrs, $contr){
                    $contr.menuRef = $attrs.menuRef ;
                    $scope.$menu = $contr.$menu = 
                            function(){ return MenuService.get( $attrs.menuRef ); };
                }
            };
        },
    };
}]);


var list = [
  ['menuAdd','add'],
  ['menuRemove','remove'],
  ['menuToggle','toggle']
];
for( var i = 0; i < list.length; i++ ){
  _createDirective( list[i][0], list[i][1] );
}

function _createDirective(name, method) {
  Module.directive( name , ['$swipe', 'MenuService',
    function ($swipe, MenuService) {
      return {
        restrict: 'A',
        priority: 10,
        scope: false,
        require: ['?^menuRef'],
        link: function ($scope, $element, $attr, $ctrls) {
          var val = $attr[name];
          if (!val) return;
          var $menu = $ctrls[0] ? $ctrls[0].$menu :
            function () { return MenuService.get(); };
          $swipe.bind($element, {
            start: function (pos, ev) {
              $menu()[method](val);
            }
          });
        }
      };
    }]);
}





})(window);

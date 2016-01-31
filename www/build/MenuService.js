
(function(window){


var Module = angular.module('Menu',['ngTouch']);

Module.run(['$rootElement','$timeout',
      function($rootElement,$timeout){
    
    RootMenuManager.element = $rootElement;
    RootMenuManager.$timeout = $timeout;
        
}]);



function Menu( menuName, menuEl, manager ){
  this.name = menuName;
  this.element = angular.element(menuEl);  // <--  dependency
  this.attrs = {};
  this.manager = manager;
  this._delay = 0;
  this._persistentDelay = false;
}


var proto = Menu.prototype;
proto._valCss = function(val){ 
  var cssClass = menuServiceProvider.lowerCaseClasses? this.name.toLowerCase() : this.name ;
  return 'menu-'+ val +'-'+cssClass ; 
};
proto._check = function(val){ 
  if(val) this.attrs[val] = true;
  if(!this.manager) return false;
  return true;
};
proto._delayFunc = function( func ){
  var that = this;
  if( !that._delay ) func.call( that );
  else{
    that.manager.$timeout(function(){
      if( !that._persistentDelay ) that._delay = 0;
      func.call( that );
    }, that._delay);
  }
};

//----------------------------------------------------------------------------

proto.add = proto.addClass = function(val){ 
  this._delayFunc(function(){ 
    this.attrs[val] = true;
    this.manager.element.addClass( this._valCss(val) ); 
  });
  return this;
};
proto.remove = proto.removeClass = function(val){ 
  this._delayFunc(function(){ 
    this.attrs[val] = false;
    this.manager.element.removeClass( this._valCss(val) ); 
  });
  return this;
};
proto.toggle = proto.toggleClass = function(val){ 
  this._delayFunc(function(){ 
    this.attrs[val] = !this.attrs[val];
    if( this.attrs[val] ) this.manager.element.addClass( this._valCss(val) ); 
    else this.manager.element.removeClass( this._valCss(val) ); 
  });
  return this; 
};
proto.removeAll = proto.removeClassAll = function(){
  var arr = this.attrs;
  this._delayFunc(function(){ 
    for(var g in arr) this.removeClass( arr[g] );
    this.attrs = {};
  });
  return this;
};
proto.delay = function(val, persistent){
  this._persistentDelay = persistent;
  this._delay = val;
  return this;
};
proto.has = function(val){
  return !!this.attrs[val];
};




//  for animations
/*
var pfx = ["webkit", "moz", "MS", "o", ""];
function PrefixedEvent(element, type, callback) {
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}
*/

function MenuManager( el, $t ){
    this.element = el;
    this.$timeout = $t;
}

//var proto = MenuManagerConst.prototype;

var RootMenuManager = new MenuManager();




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




var menuServiceProvider;

Module.provider('MenuService',[function(){
  
  menuServiceProvider = this;
  
  menuServiceProvider.lowerCaseClasses = true;
  
  menuServiceProvider.$get = [function(){
    
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
      put: function(menuName, menuEl, menuManag){
        if( !menuName || !menuEl ) return ref;
        if( !menuManag ) menuManag = RootMenuManager ;
        var menu = menuHash[menuName] = new Menu(menuName, menuEl, menuManag);
        observerBox.dispatch( 'put', observerBox.event('put',{menu:menu}) );
        return ref;
      },
      remove:function(menuName){
        var menu = menuHash[menuName];
        menu.removeAll();
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
      },
    };

    return ref;
  }];
  
}]);


Module.directive('menu', ['MenuService',
  function (MenuService) {
    return {
      restrict: 'EA',
      scope: false,
      controller: function () {},
      require: ['menu','?^^menuRef','?^menuManager'],
      compile: function () {
        return {
          pre: function ($scope, $element, $attr, $ctrls) {
            var menuName = $attr.menu;
            if (!menuName)
              throw 'You need to define a name for the menu '
                + 'with the "menu" attribute. This is required!';
            var menuDefault = ($attr.menuDefault || '').toLowerCase() === 'true' ? true : false;
            MenuService.put(menuName, $element, $ctrls[2]? $ctrls[2].manager : null );
            if (menuDefault)
              MenuService.setDefault(menuName);
            $ctrls[0].$menu = function () {
              return MenuService.get(menuName);
            };
            $ctrls[0].parentRef = $ctrls[1];
            $scope.$on('$destroy', function () {
              MenuService.remove(menuName);
            });
          }
        };
      }
    };
  }]);

Module.directive('menuAction',['$parse','MenuService','$swipe',
    function($parse,MenuService,$swipe){
  return {
    restrict: 'A',
    priority: 10,
    scope: false,
    /*
     * The object that is spected is in the form:
     * { MenuName:{ MenuAction:'AttrName' } }
     * where:
     *  - MenuName: the of the menu used in the "menu" directive
     *  - MenuAction: name o the method to call in the menu object. Ex.: 'toggle', 'add'...
     *  - AttrName: name of the class to pass to the method. Ex.: 'open'...
     */
    link: function($scope, $element, $attrs, $ctrls){
      var obj = $parse( $attrs.menuAction )();
      if( !obj ) return;
      $swipe.bind( $element, {
        start: function(pos, ev){
          for(var menuName in obj){
            var menuObj = obj[menuName];
            for( var menuAction in menuObj ){
              var attrName = menuObj[menuAction];
              MenuService.get( menuName )[ menuAction ]( attrName );
            }
          }
        }
      });
    }
  };
}]);
Module.directive('menuManager',['$timeout',function($timeout){
  
  return {
    restrict: 'EA',
    priority: 0,
    controller: function(){},
    compile: function(){
      return {
        pre: function($scope, $element, $attrs, $ctrls){
          $ctrls.manager = new MenuManager( $element , $timeout );
        }
      };
    }
    
  };
  
}]);

Module.directive('menuRef',['MenuService',
    function(MenuService){
  return {
    scope:false,
    controller:function(){},
    compile:function($element, $attrs){
      return {
        pre: function($scope, $element, $attrs, $contr){
          $contr.$menu = 
            function(val){ return MenuService.get( val || $attrs.menuRef ); };
        }
      };
    }
  };
}]);

Module.directive('menuService',['MenuService',function(MenuService){
  
  return {
    restrict: 'EA',
    scope: true,
    compile: function(){
      return {
        pre: function($scope, $element, $attrs, $ctrls){
          $scope.$menu = MenuService;
        }
      };
    }
  };
  
}]);


createDirective('menuAdd', 'add');
createDirective('menuRemove', 'remove');
createDirective('menuToggle', 'toggle');

function createDirective(name, method) {
  Module.directive(name, ['$swipe', 'MenuService',
    function ($swipe, MenuService) {
      return {
        require: ['?^menuRef', '?^menu'],
        link: function ($scope, $element, $attr, $ctrls) {
          var val = $attr[name];
          if (!val)
            return;
          var $menu;
          if( $ctrls[0] && $ctrls[1] ){
            if( $ctrls[1].parentRef === $ctrls[0] ) $menu = $ctrls[1].$menu ;
            else $menu = $ctrls[0].$menu ;
          }else{
            $menu = $ctrls[0] ? $ctrls[0].$menu :
              ($ctrls[1] ? $ctrls[1].$menu :
                function () {
                  return MenuService.get();
                }
              );
          }
          
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

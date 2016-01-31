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

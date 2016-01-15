Module.directive('menuRef',['MenuService',
    function(MenuService){
  return {
    scope:true,
    controller:function(){},
    compile:function($element, $attrs){
      return {
        pre: function($scope, $element, $attrs, $contr){
          $scope.$menu = $contr.$menu = 
            function(val){ return MenuService.get( val || $attrs.menuRef ); };
        }
      };
    }
  };
}]);

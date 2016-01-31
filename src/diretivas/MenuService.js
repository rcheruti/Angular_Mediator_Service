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
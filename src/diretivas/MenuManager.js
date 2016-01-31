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

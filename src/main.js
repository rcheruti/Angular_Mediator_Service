
var Module = angular.module('Menu',['ngTouch']);

Module.run(['$rootElement','$timeout',
      function($rootElement,$timeout){
    
    MenuManager.element = $rootElement;
    MenuManager.$timeout = $timeout;
        
}]);

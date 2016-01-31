
var Module = angular.module('Menu',['ngTouch']);

Module.run(['$rootElement','$timeout',
      function($rootElement,$timeout){
    
    RootMenuManager.element = $rootElement;
    RootMenuManager.$timeout = $timeout;
        
}]);

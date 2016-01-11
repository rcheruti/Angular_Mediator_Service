
var Module = angular.module('Menu',['ngTouch']);

Module.run(['$injector',function($injector){
    
    MenuManager.element = $injector.get('$rootElement');
        
}]);

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

Module.directive('menuRemove',['MenuService',
        function(MenuService){
    return {
        restrict: 'A',
        priority: 10,
        scope:{
            'menuRemove':'@'
        },
        compile: function(){
            return {
                pre: function($scope, $element, $attr){
                    
                }
            };
        }
    };
}]);

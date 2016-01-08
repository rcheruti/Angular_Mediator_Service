Module.directive('menuToggle',['MenuService',
        function(MenuService){
    return {
        restrict: 'A',
        priority: 10,
        scope:{
            'menuToggle':'@'
        },
        compile: function(){
            return {
                pre: function($scope, $element, $attr){
                    
                }
            };
        }
    };
}]);

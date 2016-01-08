Module.directive('menuElement',['MenuService',
            function(MenuService){
    return {
        restrict: 'EA',
        scope:{
            'menuElement':'@'
        },
        compile: function(){
            return {
                pre:function($scope, $element, $attr){
                    var menuName = $attr.menuElement ;
                    if(!menuName) throw 'You need to define a name for the menu '
                        +'with the "menu-element" attribute. This is required!';
                    MenuService.put(menuName, $element);
                    $scope.$on('$destroy', function(){
                        MenuService.remove(menuName);
                    });
                }
            };
        }
    };
}]);

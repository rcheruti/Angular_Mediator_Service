Module.directive('menuElement',['MenuService',
            function(MenuService){
    return {
        restrict: 'EA',
        scope:false,
        compile: function(){
            return {
                pre:function($scope, $element, $attr){
                    var menuName = $attr.menuElement ;
                    var menuDefault = ($attr.menuDefault || '').toLowerCase() === 'true'? true : false ;
                    if(!menuName) throw 'You need to define a name for the menu '
                        +'with the "menu-element" attribute. This is required!';
                    MenuService.put(menuName, $element);
                    if( menuDefault ) MenuService.setDefault( menuName );
                    $scope.$on('$destroy', function(){
                        MenuService.remove(menuName);
                    });
                }
            };
        }
    };
}]);

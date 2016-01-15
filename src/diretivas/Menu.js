Module.directive('menu',['MenuService',
            function(MenuService){
    return {
        restrict: 'EA',
        scope:false,
        controller: function(){},
        compile: function(){
            return {
                pre:function($scope, $element, $attr, $ctrl){
                    var menuName = $attr.menu ;
                    if(!menuName) throw 'You need to define a name for the menu '
                        +'with the "menu" attribute. This is required!';
                    var menuDefault = ($attr.menuDefault || '').toLowerCase() === 'true'? true : false ;
                    MenuService.put(menuName, $element);
                    if( menuDefault ) MenuService.setDefault( menuName );
                    $ctrl.$menu = function(){ return MenuService.get( menuName ); };
                    $scope.$on('$destroy', function(){
                        MenuService.remove(menuName);
                    });
                }
            };
        }
    };
}]);

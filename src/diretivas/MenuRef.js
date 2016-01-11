Module.directive('menuRef',['MenuService',
        function(MenuService){
    return {
        priority: 0 , 
        restrict:'A',
        scope:true,
        controllerAs: '$ctrl',
        controller:function(){},
        compile:function(){
            return {
                pre: function($scope, $element, $attrs, $contr){
                    $contr.menuRef = $attrs.menuRef ;
                    $scope.$menu = $contr.$menu = 
                            function(){ return MenuService.get( $attrs.menuRef ); };
                }
            };
        },
    };
}]);

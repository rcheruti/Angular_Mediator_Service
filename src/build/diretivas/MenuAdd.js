Module.directive('menuAdd',['$swipe','MenuService',
        function($swipe,MenuService){
    return {
        restrict: 'A',
        priority: 10,
        scope:false,
        require:['?^menuRef'],
        link: function($scope, $element, $attr, $ctrls){
            var val = $attr.menuToggle;
            if( !val ) return;
            var $menu = $ctrls[0]? $ctrls[0].$menu : MenuService.get();
            $swipe.bind($element, {
                start: function(pos, ev){
                    $menu.addClass( val );
                }
            });
        }
    };
}]);
Module.directive('menuSwitch',['MenuService',
        function(MenuService){
    return {
        restrict: 'A',
        priority: 10,
        scope:{
            'menuSwitch':'@'
        },
        require:['?menuRef'],
        link: function($scope, $element, $attrs, $contrs){
            var menuName = $contrs[0]? $contrs[0].menuRef : '' ,
                menu = MenuService.get(menuName) ;
            
            MenuService.on('put',$scope, function(ev){
                if(menuName === ev.menu.name) menu = ev.menu;
            });
            MenuService.on('remove',$scope, function(ev){
                if(menuName === ev.menu.name) menu = null;
            });
        }
    };
}]);

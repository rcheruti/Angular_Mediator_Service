Module.directive('menu', ['MenuService',
  function (MenuService) {
    return {
      restrict: 'EA',
      scope: false,
      controller: function () {},
      require: ['menu','?^^menuRef','?^menuManager'],
      compile: function () {
        return {
          pre: function ($scope, $element, $attr, $ctrls) {
            var menuName = $attr.menu;
            if (!menuName)
              throw 'You need to define a name for the menu '
                + 'with the "menu" attribute. This is required!';
            var menuDefault = ($attr.menuDefault || '').toLowerCase() === 'true' ? true : false;
            MenuService.put(menuName, $element, $ctrls[2]? $ctrls[2].manager : null );
            if (menuDefault)
              MenuService.setDefault(menuName);
            $ctrls[0].$menu = function () {
              return MenuService.get(menuName);
            };
            $ctrls[0].parentRef = $ctrls[1];
            $scope.$on('$destroy', function () {
              MenuService.remove(menuName);
            });
          }
        };
      }
    };
  }]);


var list = [
  ['menuAdd','add'],
  ['menuRemove','remove'],
  ['menuToggle','toggle']
];
for( var i = 0; i < list.length; i++ ){
  _createDirective( list[i][0], list[i][1] );
}

function _createDirective(name, method) {
  Module.directive( name , ['$swipe', 'MenuService',
    function ($swipe, MenuService) {
      return {
        restrict: 'A',
        priority: 10,
        scope: false,
        require: ['?^menuRef'],
        link: function ($scope, $element, $attr, $ctrls) {
          var val = $attr[name];
          if (!val) return;
          var $menu = $ctrls[0] ? $ctrls[0].$menu :
            function () { return MenuService.get(); };
          $swipe.bind($element, {
            start: function (pos, ev) {
              $menu()[method](val);
            }
          });
        }
      };
    }]);
}




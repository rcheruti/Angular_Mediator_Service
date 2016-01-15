

createDirective('menuAdd','add');
createDirective('menuRemove','remove');
createDirective('menuToggle','toggle');

function createDirective(name,method){
  Module.directive(name,['$swipe','MenuService',
          function($swipe,MenuService){
      return {
          require:['?^menuRef','?^menu'],
          link: function($scope, $element, $attr, $ctrls){
              var val = $attr[name];
              if( !val ) return;
              var $menu = $ctrls[0]? $ctrls[0].$menu : 
                    ( $ctrls[1]? $ctrls[1].$menu :
                      function(){ return MenuService.get(); }
                    );
              $swipe.bind($element, {
                  start: function(pos, ev){
                      $menu()[method]( val );
                  }
              });
          }
      };
  }]);
}



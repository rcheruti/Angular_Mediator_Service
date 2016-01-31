Module.directive('menuAction',['$parse','MenuService','$swipe',
    function($parse,MenuService,$swipe){
  return {
    restrict: 'A',
    priority: 10,
    scope: false,
    /*
     * The object that is spected is in the form:
     * { MenuName:{ MenuAction:'AttrName' } }
     * where:
     *  - MenuName: the of the menu used in the "menu" directive
     *  - MenuAction: name o the method to call in the menu object. Ex.: 'toggle', 'add'...
     *  - AttrName: name of the class to pass to the method. Ex.: 'open'...
     */
    link: function($scope, $element, $attrs, $ctrls){
      var obj = $parse( $attrs.menuAction )();
      if( !obj ) return;
      $swipe.bind( $element, {
        start: function(pos, ev){
          for(var menuName in obj){
            var menuObj = obj[menuName];
            for( var menuAction in menuObj ){
              var attrName = menuObj[menuAction];
              MenuService.get( menuName )[ menuAction ]( attrName );
            }
          }
        }
      });
    }
  };
}]);
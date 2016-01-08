Module.directive('menuRef',[function(){
    return {
        priority: 0 , 
        restrict:'A',
        bindToController:{
            'menuRef':'@'
        },
        controller:function(){},
        /*
        compile:function(){
            return {
                pre: function($scope, $element, $attrs, $contr){
                    
                }
            };
        },
        */
    };
}]);

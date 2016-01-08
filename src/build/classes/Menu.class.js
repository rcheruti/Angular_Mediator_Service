
function Menu( menuName, menuEl ){
    this.name = menuName;
    this.element = angular.element(menuEl);
    this.open = false;
    this.attrs = [];
}

var proto = Menu.prototype;
proto.put = function(val){  };
proto.remove = function(val){  };
proto.toggle = function(val){  };



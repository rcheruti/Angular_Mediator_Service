
function Menu( menuName, menuEl, manager ){
    this.name = menuName;
    this.element = angular.element(menuEl);
    this.attrs = {};
    this.manager = manager;
}


var proto = Menu.prototype;
proto._valCss = function(val){ return 'menu-'+ val +'-'+this.name ; };
proto._check = function(val){ 
    if(val) this.attrs[val] = true;
    if(!this.manager) return false;
    return true;
};

proto.addClass = function(val){ 
    if(!this._check(val))return; 
    this.manager.element.addClass( this._valCss(val) ); 
};
proto.removeClass = function(val){ 
    if(!this._check())return; 
    this.manager.element.removeClass( this._valCss(val) );
};
proto.toggleClass = function(val){ 
    if(!this._check(val))return; 
    this.manager.element.toggleClass( this._valCss(val) ); 
};
proto.removeClassAll = function(){
    var arr = this.attrs;
    for(var g in arr){
        this.removeClass( arr[g] );
    }
};



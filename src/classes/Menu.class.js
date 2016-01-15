
function Menu( menuName, menuEl, manager ){
  this.name = menuName;
  this.element = angular.element(menuEl);  // <--  dependency
  this.attrs = {};
  this.manager = manager;
  this._delay = 0;
  this._persistentDelay = false;
}


var proto = Menu.prototype;
proto._valCss = function(val){ 
  var cssClass = menuServiceProvider.lowerCaseClasses? this.name.toLowerCase() : this.name ;
  return 'menu-'+ val +'-'+cssClass ; 
};
proto._check = function(val){ 
  if(val) this.attrs[val] = true;
  if(!this.manager) return false;
  return true;
};
proto._delayFunc = function( func ){
  var that = this;
  if( !that._delay ) func.call( that );
  else{
    that.manager.$timeout(function(){
      if( !that._persistentDelay ) that._delay = 0;
      func.call( that );
    }, that._delay);
  }
};

//----------------------------------------------------------------------------

proto.add = function(val){ 
  this._delayFunc(function(){ 
    this.attrs[val] = true;
    this.manager.element.addClass( this._valCss(val) ); 
  });
  return this;
};
proto.remove = function(val){ 
  this._delayFunc(function(){ 
    this.attrs[val] = false;
    this.manager.element.removeClass( this._valCss(val) ); 
  });
  return this;
};
proto.toggle = function(val){ 
  this._delayFunc(function(){ 
    this.attrs[val] = !this.attrs[val];
    if( this.attrs[val] ) this.manager.element.addClass( this._valCss(val) ); 
    else this.manager.element.removeClass( this._valCss(val) ); 
  });
  return this; 
};
proto.removeAll = function(){
  var arr = this.attrs;
  this._delayFunc(function(){ 
    for(var g in arr) this.removeClass( arr[g] );
    this.attrs = {};
  });
  return this;
};
proto.delay = function(val, persistent){
  this._persistentDelay = persistent;
  this._delay = val;
  return this;
};
proto.has = function(val){
  return !!this.attrs[val];
};



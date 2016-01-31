
function ObserverBox(){
    this.eventModel = {};
    this.listeners = {};
}

var proto = ObserverBox.prototype ;

proto.register = function(arrEvents){
    if( !(arrEvents instanceof Object) ) arrEvents = [ arrEvents ];
    if( arrEvents instanceof Array ){
        for(var g in arrEvents){
            var evName = arrEvents[g];
            if( !this.listeners[ evName ] ) this.listeners[ evName ] = {};
        }
    }else{
        for(var evName in arrEvents){
            var evModel = arrEvents[evName];
            if( !this.listeners[ evName ] ) this.listeners[ evName ] = {};
            this.eventModel[evName ] = evModel ;
        }
    }
    return this;
};
proto.unregister = function(arrEvents){
    if( !(arrEvents instanceof Array) ) arrEvents = [ arrEvents ];
    for(var i = 0; i < arrEvents.length; i++){
        var evName = arrEvents[i];
        if( this.listeners[ evName ] ) delete this.listeners[ evName ];
        if( this.eventModel[ evName ] ) delete this.eventModel[ evName ];
    }
    return this;
};

    // $scopeOrNull is AngularJs Scope
proto.on = function(eventName, $scopeOrNull, func){
    if( !$scopeOrNull && !func ) return;
    if( !this.listeners[eventName] ) return;
    if( $scopeOrNull && func ){
        $scopeOrNull.$on('$destroy', function(){
            this.off(eventName, func );
        });
    }else if( $scopeOrNull && !func ){
        func = $scopeOrNull ;
    }
    this.listeners[eventName].push( func );
    return this;
};
proto.off = function(eventName, func){
    var listenerArr = this.listeners[eventName];
    for( var g = 0; g < listenerArr.length; g++ ){
        if( func === listenerArr[g] ){
            listenerArr.splice( g, 1 );
            break;
        }
    }
    return this;
};

proto.event = function(eventName, config){
    var copy = angular.merge({}, this.eventModel[eventName], config) ; // LINE WITH DEPENDENCY
    return copy;
};
proto.dispatch = function(eventName, event , syncOrDelay){
    var list = this.listeners[ eventName ];
    if(syncOrDelay === true){
        for(var i = 0; i < list.length; i++){
            list[i]( event );
        }
    }else{
        setTimeout(function(){
            for(var i = 0; i < list.length; i++){
                list[i]( event );
            }
        }, (syncOrDelay? syncOrDelay : 0) );
    }
    return this;
};


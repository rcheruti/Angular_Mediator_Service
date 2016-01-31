!function(a){function b(a,b,c){this.name=a,this.element=angular.element(b),this.attrs={},this.manager=c}function c(){this.element=null}function d(){this.eventModel={},this.listeners={}}function e(a,b){f.directive(a,["$swipe","MenuService",function(c,d){return{restrict:"A",priority:10,scope:!1,require:["?^menuRef"],link:function(e,f,g,h){var i=g[a];if(i){var j=h[0]?h[0].$menu:function(){return d.get()};c.bind(f,{start:function(a,c){j()[b](i)}})}}}}])}var f=angular.module("Menu",["ngTouch"]);f.run(["$injector",function(a){h.element=a.get("$rootElement")}]);var g=b.prototype;g._valCss=function(a){return"menu-"+a+"-"+this.name},g._check=function(a){return a&&(this.attrs[a]=!0),this.manager?!0:!1},g.add=g.addClass=function(a){this._check(a)&&this.manager.element.addClass(this._valCss(a))},g.remove=g.removeClass=function(a){this._check()&&this.manager.element.removeClass(this._valCss(a))},g.toggle=g.toggleClass=function(a){this._check(a)&&this.manager.element.toggleClass(this._valCss(a))},g.removeAll=g.removeClassAll=function(){var a=this.attrs;for(var b in a)this.removeClass(a[b])};var h=new c,g=d.prototype;g.register=function(a){if(a instanceof Object||(a=[a]),a instanceof Array)for(var b in a){var c=a[b];this.listeners[c]||(this.listeners[c]={})}else for(var c in a){var d=a[c];this.listeners[c]||(this.listeners[c]={}),this.eventModel[c]=d}return this},g.unregister=function(a){a instanceof Array||(a=[a]);for(var b=0;b<a.length;b++){var c=a[b];this.listeners[c]&&delete this.listeners[c],this.eventModel[c]&&delete this.eventModel[c]}return this},g.on=function(a,b,c){return(b||c)&&this.listeners[a]?(b&&c?b.$on("$destroy",function(){this.off(a,c)}):b&&!c&&(c=b),this.listeners[a].push(c),this):void 0},g.off=function(a,b){for(var c=this.listeners[a],d=0;d<c.length;d++)if(b===c[d]){c.splice(d,1);break}return this},g.event=function(a,b){var c=angular.merge({},this.eventModel[a],b);return c},g.dispatch=function(a,b,c){var d=this.listeners[a];if(c===!0)for(var e=0;e<d.length;e++)d[e](b);else setTimeout(function(){for(var a=0;a<d.length;a++)d[a](b)},c?c:0);return this},f.service("MenuService",[function(){var a={},c=null,e=new d,f={menu:null};e.register({put:f,remove:f});var g={get:function(b){return b?a[b]:a[c]},put:function(c,d){if(!c||!d)return g;var f=a[c]=new b(c,d,h);return e.dispatch("put",e.event("put",{menu:f})),g},remove:function(b){var c=a[b];return c.removeClassAll(),delete a[b],e.dispatch("remove",e.event("remove",{menu:c})),g},setDefault:function(a){return c=a,g},on:function(a,b,c){return e.on(a,b,c),g},off:function(a,b){e.off(a,b)}};return g}]),f.directive("menuElement",["MenuService",function(a){return{priority:0,restrict:"EA",scope:!1,compile:function(){return{pre:function(b,c,d){var e=d.menuElement,f="true"===(d.menuDefault||"").toLowerCase()?!0:!1;if(!e)throw'You need to define a name for the menu with the "menu-element" attribute. This is required!';a.put(e,c),f&&a.setDefault(e),b.$on("$destroy",function(){a.remove(e)})}}}}}]),f.directive("menuRef",["MenuService",function(a){return{priority:0,restrict:"A",scope:!0,controllerAs:"$ctrl",controller:function(){},compile:function(){return{pre:function(b,c,d,e){e.menuRef=d.menuRef,b.$menu=e.$menu=function(){return a.get(d.menuRef)}}}}}}]);for(var i=[["menuAdd","add"],["menuRemove","remove"],["menuToggle","toggle"]],j=0;j<i.length;j++)e(i[j][0],i[j][1])}(window);
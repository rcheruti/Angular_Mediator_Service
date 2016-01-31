
//  for animations
/*
var pfx = ["webkit", "moz", "MS", "o", ""];
function PrefixedEvent(element, type, callback) {
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) type = type.toLowerCase();
		element.addEventListener(pfx[p]+type, callback, false);
	}
}
*/

function MenuManager( el, $t ){
    this.element = el;
    this.$timeout = $t;
}

//var proto = MenuManagerConst.prototype;

var RootMenuManager = new MenuManager();



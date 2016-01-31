
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

function MenuManagerConst(){
    this.element = null;
    this.$timeout = null;
}

//var proto = MenuManagerConst.prototype;

var MenuManager = new MenuManagerConst();



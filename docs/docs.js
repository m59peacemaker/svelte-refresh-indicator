(function () {
'use strict';

function noop() {}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, newState, oldState) {
	for (var key in group) {
		if (!(key in newState)) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		if (differs(newValue, oldValue)) {
			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this._root._lock) return;
	this._root._lock = true;
	callAll(this._root._beforecreate);
	callAll(this._root._oncreate);
	callAll(this._root._aftercreate);
	this._root._lock = false;
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

var proto = {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set
};

function recompute$3 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'color' in newState && differs( state.color, oldState.color ) ) || ( 'sizeRatio' in newState && differs( state.sizeRatio, oldState.sizeRatio ) ) ) {
		state.styles = newState.styles = template$3.computed.styles( state.color, state.sizeRatio );
	}
}

var template$3 = (function () {
const MAX_BORDER_WIDTH = 6;
const MIN_BORDER_WIDTH = 2.2;
const BORDER_WIDTH_RANGE = MAX_BORDER_WIDTH - MIN_BORDER_WIDTH;

/*
6 => -2
5 => -0.5
4 => 1
3 => 1.9
2.5 => 2.5
2.2 => 2.8
*/
const quadPoly = x => (0.0491 * Math.pow(x, 4))
  - (0.8084 * Math.pow(x, 3))
  + (4.6942 * Math.pow(x, 2))
  - (12.511 * x)
  + 15.091;
const calcBottom = borderWidth => Math.round(quadPoly(borderWidth) * 10 + Number.EPSILON ) / 10;

return {
  data () {
    return {
      color: '#2196f3',
      sizeRatio: 1
    }
  },

  computed: {
    styles: (color, sizeRatio) => {
      sizeRatio = Math.min(1, sizeRatio);
      const borderWidth = MIN_BORDER_WIDTH + (sizeRatio * BORDER_WIDTH_RANGE);
      return {
        borderWidth,
        bottom: calcBottom(borderWidth),
        borderColor: `transparent ${color} transparent transparent`
      }
    }
  }
}

}());

function add_css$3 () {
	var style = createElement( 'style' );
	style.id = 'svelte-1191187168-style';
	style.textContent = "\n\n[svelte-1191187168].arrow-head, [svelte-1191187168] .arrow-head {\n  display: block;\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-style: solid;\n  border-width: 6px;\n  bottom: -2px;\n  right: 4px;\n  transform: rotate(-20deg);\n}\n\n";
	appendNode( style, document.head );
}

function create_main_fragment$3 ( state, component ) {
	var span, span_style_value;

	return {
		create: function () {
			span = createElement( 'span' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( span, 'svelte-1191187168', '' );
			span.className = "arrow-head";
			span.style.cssText = span_style_value = "\n    border-color: " + ( state.styles.borderColor ) + ";\n    border-width: " + ( state.styles.borderWidth ) + "px;\n    bottom: " + ( state.styles.bottom ) + "px;\n  ";
		},

		mount: function ( target, anchor ) {
			insertNode( span, target, anchor );
		},

		update: function ( changed, state ) {
			if ( span_style_value !== ( span_style_value = "\n    border-color: " + ( state.styles.borderColor ) + ";\n    border-width: " + ( state.styles.borderWidth ) + "px;\n    bottom: " + ( state.styles.bottom ) + "px;\n  " ) ) {
				span.style.cssText = span_style_value;
			}
		},

		unmount: function () {
			detachNode( span );
		},

		destroy: noop
	};
}

function ArrowHead ( options ) {
	options = options || {};
	this._state = assign( template$3.data(), options.data );
	recompute$3( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( 'svelte-1191187168-style' ) ) add_css$3();

	this._fragment = create_main_fragment$3( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ArrowHead.prototype, proto );

ArrowHead.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute$3( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ArrowHead.prototype.teardown = ArrowHead.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function recompute$2 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'which' in newState && differs( state.which, oldState.which ) ) || ( 'rotate' in newState && differs( state.rotate, oldState.rotate ) ) ) {
		state.rotateDeg = newState.rotateDeg = template$2.computed.rotateDeg( state.which, state.rotate );
	}

	if ( isInitial || ( 'which' in newState && differs( state.which, oldState.which ) ) || ( 'color' in newState && differs( state.color, oldState.color ) ) || ( 'rotate' in newState && differs( state.rotate, oldState.rotate ) ) ) {
		state.borderColor = newState.borderColor = template$2.computed.borderColor( state.which, state.color, state.rotate );
	}
}

var template$2 = (function () {
const START_OFFSET = {
  right: -136,
  left: -45
};

return {
  data () {
    return {
      which: 'right',
      color: '#2196f3',
      rotate: -136
    }
  },

  computed: {
    rotateDeg: (which, rotate) => START_OFFSET[which] + rotate,
    borderColor: (which, color, rotate) => {
      return [
        (which === 'right' && rotate > 22.5) || rotate > 135,
        which === 'right',
        which === 'left' && rotate > 315,
        rotate > 180,
      ].reduce((acc, shouldColor) => `${acc}${shouldColor ? color : 'transparent'} `, '')
    }
  }
}

}());

function add_css$2 () {
	var style = createElement( 'style' );
	style.id = 'svelte-4032933271-style';
	style.textContent = "\n\n[svelte-4032933271].half-circle, [svelte-4032933271] .half-circle {\n  animation-duration: 1.3125s;\n  animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);\n  animation-iteration-count: infinite; }\n\n[svelte-4032933271].left, [svelte-4032933271] .left,\n[svelte-4032933271].right, [svelte-4032933271] .right {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  width: 50%;\n  overflow: hidden;\n}\n\n[svelte-4032933271].left, [svelte-4032933271] .left {\n  /* The overflow: hidden separating the left and right caused a 1px distortion between them\n     in some browsers. This smooths it out by letting the left overlap the right by 1px\n     The left half circle width has to be reduced by 2px to compensate this 1px overlap\n   */\n  width: calc(50% + 1px);\n}\n\n[svelte-4032933271].right, [svelte-4032933271] .right {\n  right: 0\n}\n\n[svelte-4032933271].half-circle, [svelte-4032933271] .half-circle {\n  height: 100%;\n  width: 200%;\n  position: absolute;\n  top: 0;\n  box-sizing: border-box;\n  border-width: 3px;\n  border-style: solid;\n  border-color: #000 #000 transparent #000;\n  border-radius: 50%;\n}\n\n[svelte-4032933271].left .half-circle, [svelte-4032933271] .left .half-circle {\n  /* compensate the 1px overlap so that the circle remains the correct size and shape\n     see comment on .left\n   */\n  width: calc(200% - 2px);\n\n  border-right-color: transparent;\n}\n\n[svelte-4032933271].right .half-circle, [svelte-4032933271] .right .half-circle {\n  right: 0;\n  border-left-color: transparent;\n}\n\n";
	appendNode( style, document.head );
}

function create_main_fragment$2 ( state, component ) {
	var div, div_class_value, div_1, div_1_style_value;

	return {
		create: function () {
			div = createElement( 'div' );
			div_1 = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-4032933271', '' );
			div.className = div_class_value = "side " + ( state.which );
			div_1.className = "half-circle";
			div_1.style.cssText = div_1_style_value = "transform: rotate(" + ( state.rotateDeg ) + "deg); border-color: " + ( state.borderColor ) + ";";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "side " + ( state.which ) ) ) {
				div.className = div_class_value;
			}

			if ( div_1_style_value !== ( div_1_style_value = "transform: rotate(" + ( state.rotateDeg ) + "deg); border-color: " + ( state.borderColor ) + ";" ) ) {
				div_1.style.cssText = div_1_style_value;
			}
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: noop
	};
}

function ArrowSide ( options ) {
	options = options || {};
	this._state = assign( template$2.data(), options.data );
	recompute$2( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( 'svelte-4032933271-style' ) ) add_css$2();

	this._fragment = create_main_fragment$2( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( ArrowSide.prototype, proto );

ArrowSide.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute$2( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

ArrowSide.prototype.teardown = ArrowSide.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function recompute$1 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'progressRatio' in newState && differs( state.progressRatio, oldState.progressRatio ) ) ) {
		state.rotate = newState.rotate = template$1.computed.rotate( state.progressRatio );
	}
}

var template$1 = (function () {
const COMPLETE_ROTATION = 270;

return {
  data () {
    return {
      color: '#2196f3',
      progressRatio: 1
    }
  },

  computed: {
    rotate: progressRatio => COMPLETE_ROTATION * progressRatio
  }
}
}());

function add_css$1 () {
	var style = createElement( 'style' );
	style.id = 'svelte-3093726192-style';
	style.textContent = "\n\n[svelte-3093726192].arrow, [svelte-3093726192] .arrow {\n  position: relative;\n  height: 100%;\n}\n\n[svelte-3093726192].arrow-head-rotate, [svelte-3093726192] .arrow-head-rotate {\n  height: 100%;\n  width: 100%;\n}\n\n";
	appendNode( style, document.head );
}

function create_main_fragment$1 ( state, component ) {
	var div, div_style_value, text, text_1;

	var arrowside = new ArrowSide({
		_root: component._root,
		data: {
			which: "left",
			color: state.color,
			rotate: state.rotate
		}
	});

	var arrowside_1 = new ArrowSide({
		_root: component._root,
		data: {
			which: "right",
			color: state.color,
			rotate: state.rotate
		}
	});

	var if_block = (state.progressRatio > 0.3) && create_if_block$1( state, component );

	return {
		create: function () {
			div = createElement( 'div' );
			arrowside._fragment.create();
			text = createText( "\n  " );
			arrowside_1._fragment.create();
			text_1 = createText( "\n  " );
			if ( if_block ) if_block.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-3093726192', '' );
			div.className = "arrow";
			div.style.cssText = div_style_value = "transform: rotate(90deg); opacity: " + ( state.progressRatio ) + ";";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			arrowside._fragment.mount( div, null );
			appendNode( text, div );
			arrowside_1._fragment.mount( div, null );
			appendNode( text_1, div );
			if ( if_block ) if_block.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_style_value !== ( div_style_value = "transform: rotate(90deg); opacity: " + ( state.progressRatio ) + ";" ) ) {
				div.style.cssText = div_style_value;
			}

			var arrowside_changes = {};

			if ( 'color' in changed ) arrowside_changes.color = state.color;
			if ( 'rotate' in changed ) arrowside_changes.rotate = state.rotate;

			if ( Object.keys( arrowside_changes ).length ) arrowside.set( arrowside_changes );

			var arrowside_1_changes = {};

			if ( 'color' in changed ) arrowside_1_changes.color = state.color;
			if ( 'rotate' in changed ) arrowside_1_changes.rotate = state.rotate;

			if ( Object.keys( arrowside_1_changes ).length ) arrowside_1.set( arrowside_1_changes );

			if ( state.progressRatio > 0.3 ) {
				if ( if_block ) {
					if_block.update( changed, state );
				} else {
					if_block = create_if_block$1( state, component );
					if_block.create();
					if_block.mount( div, null );
				}
			} else if ( if_block ) {
				if_block.unmount();
				if_block.destroy();
				if_block = null;
			}
		},

		unmount: function () {
			detachNode( div );
			if ( if_block ) if_block.unmount();
		},

		destroy: function () {
			arrowside.destroy( false );
			arrowside_1.destroy( false );
			if ( if_block ) if_block.destroy();
		}
	};
}

function create_if_block$1 ( state, component ) {
	var div, div_style_value;

	var arrowhead = new ArrowHead({
		_root: component._root,
		data: { sizeRatio: (state.progressRatio - 0.3) / 0.7 }
	});

	return {
		create: function () {
			div = createElement( 'div' );
			arrowhead._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = "arrow-head-rotate";
			div.style.cssText = div_style_value = "transform: rotate(" + ( state.rotate - 136 ) + "deg);";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			arrowhead._fragment.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_style_value !== ( div_style_value = "transform: rotate(" + ( state.rotate - 136 ) + "deg);" ) ) {
				div.style.cssText = div_style_value;
			}

			var arrowhead_changes = {};

			if ( 'progressRatio' in changed ) arrowhead_changes.sizeRatio = (state.progressRatio - 0.3) / 0.7;

			if ( Object.keys( arrowhead_changes ).length ) arrowhead.set( arrowhead_changes );
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			arrowhead.destroy( false );
		}
	};
}

function Arrow ( options ) {
	options = options || {};
	this._state = assign( template$1.data(), options.data );
	recompute$1( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( 'svelte-3093726192-style' ) ) add_css$1();

	if ( !options._root ) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment$1( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	if ( !options._root ) {
		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign( Arrow.prototype, proto );

Arrow.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute$1( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Arrow.prototype.teardown = Arrow.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function recompute$4 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'which' in newState && differs( state.which, oldState.which ) ) || ( 'color' in newState && differs( state.color, oldState.color ) ) ) {
		state.borderColor = newState.borderColor = template$5.computed.borderColor( state.which, state.color );
	}
}

var template$5 = (function () {
return {
  data () {
    return {
      which: 'left',
      color: '#2196f3',
      animated: true
    }
  },

  computed: {
    borderColor: (which, color) => {
      const colorIf = side => which === side ? color : 'transparent';
      return `${color} ${colorIf('right')} transparent ${colorIf('left')}`
    }
  }
}

}());

function add_css$5 () {
	var style = createElement( 'style' );
	style.id = 'svelte-2555363830-style';
	style.textContent = "\n\n@keyframes svelte-2555363830-left-expand {\n  0%, 100% { transform: rotate(125deg); }\n  50%      { transform: rotate(-5deg); }\n}\n\n@keyframes svelte-2555363830-right-expand {\n  0%, 100% { transform: rotate(-125deg); }\n  50%      { transform: rotate(5deg); }\n}\n\n[svelte-2555363830].left .half-circle.animated, [svelte-2555363830] .left .half-circle.animated {\n  animation-name: svelte-2555363830-left-expand;\n}\n\n[svelte-2555363830].right .half-circle.animated, [svelte-2555363830] .right .half-circle.animated {\n  animation-name: svelte-2555363830-right-expand;\n}\n\n[svelte-2555363830].half-circle, [svelte-2555363830] .half-circle {\n  animation-duration: 1.3125s;\n  animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);\n  animation-iteration-count: infinite; }\n\n[svelte-2555363830].left, [svelte-2555363830] .left,\n[svelte-2555363830].right, [svelte-2555363830] .right {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  width: 50%;\n  overflow: hidden;\n}\n\n[svelte-2555363830].left, [svelte-2555363830] .left {\n  /* The overflow: hidden separating the left and right caused a 1px distortion between them\n     in some browsers. This smooths it out by letting the left overlap the right by 1px\n     The left half circle width has to be reduced by 2px to compensate this 1px overlap\n   */\n  width: calc(50% + 1px);\n}\n\n[svelte-2555363830].right, [svelte-2555363830] .right {\n  right: 0\n}\n\n[svelte-2555363830].half-circle, [svelte-2555363830] .half-circle {\n  height: 100%;\n  width: 200%;\n  position: absolute;\n  top: 0;\n  box-sizing: border-box;\n  border-width: 3px;\n  border-style: solid;\n  border-color: #000 #000 transparent #000;\n  border-radius: 50%;\n}\n\n[svelte-2555363830].left .half-circle, [svelte-2555363830] .left .half-circle {\n  /* compensate the 1px overlap so that the circle remains the correct size and shape\n     see comment on .left\n   */\n  width: calc(200% - 2px);\n\n  border-right-color: transparent;\n}\n\n[svelte-2555363830].right .half-circle, [svelte-2555363830] .right .half-circle {\n  right: 0;\n  border-left-color: transparent;\n}\n\n";
	appendNode( style, document.head );
}

function create_main_fragment$5 ( state, component ) {
	var div, div_class_value, div_1, div_1_class_value, div_1_style_value;

	return {
		create: function () {
			div = createElement( 'div' );
			div_1 = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-2555363830', '' );
			div.className = div_class_value = "side " + ( state.which );
			div_1.className = div_1_class_value = "half-circle " + ( state.animated ? 'animated' : '' );
			div_1.style.cssText = div_1_style_value = "border-color: " + ( state.borderColor ) + ";";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "side " + ( state.which ) ) ) {
				div.className = div_class_value;
			}

			if ( div_1_class_value !== ( div_1_class_value = "half-circle " + ( state.animated ? 'animated' : '' ) ) ) {
				div_1.className = div_1_class_value;
			}

			if ( div_1_style_value !== ( div_1_style_value = "border-color: " + ( state.borderColor ) + ";" ) ) {
				div_1.style.cssText = div_1_style_value;
			}
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: noop
	};
}

function SpinnerSide ( options ) {
	options = options || {};
	this._state = assign( template$5.data(), options.data );
	recompute$4( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( 'svelte-2555363830-style' ) ) add_css$5();

	this._fragment = create_main_fragment$5( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( SpinnerSide.prototype, proto );

SpinnerSide.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute$4( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

SpinnerSide.prototype.teardown = SpinnerSide.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template$4 = (function () {
return {
  data () {
    return {
      color: '#2196f3'
    }
  }
}
}());

function add_css$4 () {
	var style = createElement( 'style' );
	style.id = 'svelte-3874281406-style';
	style.textContent = "\n\n@keyframes svelte-3874281406-outer-rotate {\n  100% { transform: rotate(360deg); }\n}\n\n@keyframes svelte-3874281406-inner-rotate {\n  12.5% { transform: rotate(135deg); }\n  25%   { transform: rotate(270deg); }\n  37.5% { transform: rotate(405deg); }\n  50%   { transform: rotate(540deg); }\n  62.5% { transform: rotate(675deg); }\n  75%   { transform: rotate(810deg); }\n  87.5% { transform: rotate(945deg); }\n  100%  { transform: rotate(1080deg); }\n}\n\n[svelte-3874281406].spinner.animated, [svelte-3874281406] .spinner.animated {\n  animation: svelte-3874281406-outer-rotate 2.91667s linear infinite;\n}\n\n[svelte-3874281406].inner.animated, [svelte-3874281406] .inner.animated {\n  animation: svelte-3874281406-inner-rotate 5.25s cubic-bezier(0.35, 0, 0.25, 1) infinite;\n}\n\n[svelte-3874281406].spinner, [svelte-3874281406] .spinner {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n\n[svelte-3874281406].inner, [svelte-3874281406] .inner {\n  height: 100%;\n}\n\n";
	appendNode( style, document.head );
}

function create_main_fragment$4 ( state, component ) {
	var div, div_1, text;

	var spinnerside = new SpinnerSide({
		_root: component._root,
		data: { which: "left", color: state.color }
	});

	var spinnerside_1 = new SpinnerSide({
		_root: component._root,
		data: { which: "right", color: state.color }
	});

	return {
		create: function () {
			div = createElement( 'div' );
			div_1 = createElement( 'div' );
			spinnerside._fragment.create();
			text = createText( "\n    " );
			spinnerside_1._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-3874281406', '' );
			div.className = "spinner animated";
			div_1.className = "inner animated";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
			spinnerside._fragment.mount( div_1, null );
			appendNode( text, div_1 );
			spinnerside_1._fragment.mount( div_1, null );
		},

		update: function ( changed, state ) {
			var spinnerside_changes = {};

			if ( 'color' in changed ) spinnerside_changes.color = state.color;

			if ( Object.keys( spinnerside_changes ).length ) spinnerside.set( spinnerside_changes );

			var spinnerside_1_changes = {};

			if ( 'color' in changed ) spinnerside_1_changes.color = state.color;

			if ( Object.keys( spinnerside_1_changes ).length ) spinnerside_1.set( spinnerside_1_changes );
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			spinnerside.destroy( false );
			spinnerside_1.destroy( false );
		}
	};
}

function Spinner ( options ) {
	options = options || {};
	this._state = assign( template$4.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( 'svelte-3874281406-style' ) ) add_css$4();

	if ( !options._root ) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment$4( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	if ( !options._root ) {
		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign( Spinner.prototype, proto );

Spinner.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Spinner.prototype.teardown = Spinner.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'progressRatio' in newState && differs( state.progressRatio, oldState.progressRatio ) ) ) {
		state.spinning = newState.spinning = template.computed.spinning( state.progressRatio );
	}

	if ( isInitial || ( 'spinning' in newState && differs( state.spinning, oldState.spinning ) ) || ( 'lastProgressRatio' in newState && differs( state.lastProgressRatio, oldState.lastProgressRatio ) ) ) {
		state.arrowSyncRotate = newState.arrowSyncRotate = template.computed.arrowSyncRotate( state.spinning, state.lastProgressRatio );
	}
}

var template = (function () {
return {
  data () {
    return {
      progressRatio: undefined,
      lastProgressRatio: 0
    }
  },

  computed: {
    spinning: progressRatio => progressRatio === undefined,
    arrowSyncRotate: (spinning, lastProgressRatio) => {
      const ratio = !spinning ? 0 : (lastProgressRatio || 0);
      return ratio * 315
    }
  },

  oncreate () {
    this.observe('progressRatio', (newValue, oldValue) => this.set({ lastProgressRatio: oldValue }));
  }
}
}());

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-3294805183-style';
	style.textContent = "\n\n[svelte-3294805183].indicator, [svelte-3294805183] .indicator {\n  width: 26px;\n  height: 26px;\n  padding: 9px;\n  border-radius: 50%;\n  background-color: #fff;\n  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.15), 0 6px 13px 0 rgba(0, 0, 0, 0.2);\n}\n\n[svelte-3294805183].arrow-sync-container, [svelte-3294805183] .arrow-sync-container {\n  height: 100%;\n}\n\n";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div;

	function get_block ( state ) {
		if ( state.spinning ) return create_if_block;
		return create_if_block_1;
	}

	var current_block = get_block( state );
	var if_block = current_block( state, component );

	return {
		create: function () {
			div = createElement( 'div' );
			if_block.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-3294805183', '' );
			div.className = "indicator";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if_block.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( current_block === ( current_block = get_block( state ) ) && if_block ) {
				if_block.update( changed, state );
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block( state, component );
				if_block.create();
				if_block.mount( div, null );
			}
		},

		unmount: function () {
			detachNode( div );
			if_block.unmount();
		},

		destroy: function () {
			if_block.destroy();
		}
	};
}

function create_if_block ( state, component ) {
	var div, div_style_value;

	var spinner = new Spinner({
		_root: component._root
	});

	return {
		create: function () {
			div = createElement( 'div' );
			spinner._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			div.className = "arrow-sync-container";
			div.style.cssText = div_style_value = "transform: rotate(" + ( state.arrowSyncRotate ) + "deg);";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			spinner._fragment.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_style_value !== ( div_style_value = "transform: rotate(" + ( state.arrowSyncRotate ) + "deg);" ) ) {
				div.style.cssText = div_style_value;
			}
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			spinner.destroy( false );
		}
	};
}

function create_if_block_1 ( state, component ) {

	var arrow = new Arrow({
		_root: component._root,
		data: { progressRatio: state.progressRatio }
	});

	return {
		create: function () {
			arrow._fragment.create();
		},

		mount: function ( target, anchor ) {
			arrow._fragment.mount( target, anchor );
		},

		update: function ( changed, state ) {
			var arrow_changes = {};

			if ( 'progressRatio' in changed ) arrow_changes.progressRatio = state.progressRatio;

			if ( Object.keys( arrow_changes ).length ) arrow.set( arrow_changes );
		},

		unmount: function () {
			arrow._fragment.unmount();
		},

		destroy: function () {
			arrow.destroy( false );
		}
	};
}

function Indicator ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );
	recompute( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( 'svelte-3294805183-style' ) ) add_css();

	var oncreate = template.oncreate.bind( this );

	if ( !options._root ) {
		this._oncreate = [oncreate];
		this._beforecreate = [];
		this._aftercreate = [];
	} else {
	 	this._root._oncreate.push(oncreate);
	 }

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	if ( !options._root ) {
		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign( Indicator.prototype, proto );

Indicator.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Indicator.prototype.teardown = Indicator.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

const makeIndicator = () => {
  const div = document.createElement('div');
  div.style.margin = '30px 50px';
  div.style.display = 'inline-block';
  document.body.appendChild(div);
  return new Indicator({ target: div })
};

const demoStep = (indicator, ratio, resetFn) => {
  if (ratio > 1.4) { return resetFn() }
  window.requestAnimationFrame(() => {
    indicator.set({ progressRatio: ratio + 0.01 });
    demoStep(indicator, ratio + 0.01, resetFn);
  });
};

{
  const indicator = makeIndicator();
  const resetFn = () => setTimeout(() => demoStep(indicator, 0, resetFn), 1000);
  demoStep(indicator, 0, resetFn);
}

makeIndicator();

{
  const indicator = makeIndicator();
  const resetFn = () => {
    setTimeout(() => indicator.set({ progressRatio: undefined }), 100);
    setTimeout(() => demoStep(indicator, 0, resetFn), 2500);
  };
  demoStep(indicator, 0, resetFn);
}

}());

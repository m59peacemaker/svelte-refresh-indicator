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

function destroy(detach) {
	this.destroy = this.set = noop;
	this.fire('destroy');

	if (detach !== false) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
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
	destroy: destroy,
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set,
	teardown: destroy
};

function recompute$3 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'color' in newState && differs( state.color, oldState.color ) ) || ( 'sizeRatio' in newState && differs( state.sizeRatio, oldState.sizeRatio ) ) || ( 'size' in newState && differs( state.size, oldState.size ) ) ) {
		state.styles = newState.styles = template$3.computed.styles( state.color, state.sizeRatio, state.size );
	}
}

var template$3 = (function () {
return {
  data () {
    return {
      size: 44,
      color: '#2196f3',
      sizeRatio: 1
    }
  },

  computed: {
    styles: (color, sizeRatio, size) => {
      size = size * 1.692;
      sizeRatio = Math.min(1, sizeRatio);
      const maxBorderWidth = size * 0.1364;
      const minBorderWidth = size * 0.05;
      const borderWidthRange = maxBorderWidth - minBorderWidth;
      const borderWidth = Math.round( minBorderWidth + (sizeRatio * borderWidthRange) );

      return {
        borderWidth,
        borderColor: `transparent ${color} transparent transparent`
      }
    }
  }
}

}());

function encapsulateStyles$3 ( node ) {
	setAttribute( node, 'svelte-4267355228', '' );
}

function add_css$3 () {
	var style = createElement( 'style' );
	style.id = 'svelte-4267355228-style';
	style.textContent = "[svelte-4267355228].arrow-head,[svelte-4267355228] .arrow-head{transform:rotate(-25deg);position:absolute;display:flex;align-items:center;justify-content:flex-end;right:13%;bottom:-50%;height:100%;width:100%}span[svelte-4267355228],[svelte-4267355228] span{display:block;width:0;height:0;border-style:solid;border-width:6px}";
	appendNode( style, document.head );
}

function create_main_fragment$3 ( state, component ) {
	var div, span, span_style_value;

	return {
		create: function () {
			div = createElement( 'div' );
			span = createElement( 'span' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			encapsulateStyles$3( div );
			div.className = "arrow-head";
			span.style.cssText = span_style_value = "\n      border-color: " + ( state.styles.borderColor ) + ";\n      border-width: " + ( state.styles.borderWidth ) + "px;\n    ";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( span, div );
		},

		update: function ( changed, state ) {
			if ( span_style_value !== ( span_style_value = "\n      border-color: " + ( state.styles.borderColor ) + ";\n      border-width: " + ( state.styles.borderWidth ) + "px;\n    " ) ) {
				span.style.cssText = span_style_value;
			}
		},

		unmount: function () {
			detachNode( div );
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

	if ( !document.getElementById( 'svelte-4267355228-style' ) ) add_css$3();

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
      borderWidth: 3,
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

function encapsulateStyles$2 ( node ) {
	setAttribute( node, 'svelte-1807189378', '' );
}

function add_css$2 () {
	var style = createElement( 'style' );
	style.id = 'svelte-1807189378-style';
	style.textContent = "[svelte-1807189378].left,[svelte-1807189378] .left,[svelte-1807189378].right,[svelte-1807189378] .right{position:absolute;top:0;height:100%;width:50%;overflow:hidden}[svelte-1807189378].right,[svelte-1807189378] .right{right:0\n}[svelte-1807189378].half-circle,[svelte-1807189378] .half-circle{height:100%;width:200%;position:absolute;top:0;box-sizing:border-box;border-width:3px;border-style:solid;border-color:#000 #000 transparent #000;border-radius:50%}[svelte-1807189378].left .half-circle,[svelte-1807189378] .left .half-circle{border-right-color:transparent}[svelte-1807189378].right .half-circle,[svelte-1807189378] .right .half-circle{right:0;border-left-color:transparent}";
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
			encapsulateStyles$2( div );
			div.className = div_class_value = "side " + ( state.which );
			div_1.className = "half-circle";
			div_1.style.cssText = div_1_style_value = "\n      transform: rotate(" + ( state.rotateDeg ) + "deg);\n      border-width: " + ( state.borderWidth ) + "px;\n      border-color: " + ( state.borderColor ) + ";\n    ";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "side " + ( state.which ) ) ) {
				div.className = div_class_value;
			}

			if ( div_1_style_value !== ( div_1_style_value = "\n      transform: rotate(" + ( state.rotateDeg ) + "deg);\n      border-width: " + ( state.borderWidth ) + "px;\n      border-color: " + ( state.borderColor ) + ";\n    " ) ) {
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

	if ( !document.getElementById( 'svelte-1807189378-style' ) ) add_css$2();

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

function recompute$1 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'progressRatio' in newState && differs( state.progressRatio, oldState.progressRatio ) ) ) {
		state.rotate = newState.rotate = template$1.computed.rotate( state.progressRatio );
	}

	if ( isInitial || ( 'size' in newState && differs( state.size, oldState.size ) ) ) {
		state.borderWidth = newState.borderWidth = template$1.computed.borderWidth( state.size );
	}
}

var template$1 = (function () {
const COMPLETE_ROTATION = 270;

return {
  data () {
    return {
      size: 44,
      color: '#2196f3',
      progressRatio: 1
    }
  },

  computed: {
    rotate: progressRatio => COMPLETE_ROTATION * progressRatio,
    borderWidth: size => Math.round(size * 0.1154)
  }
}
}());

function encapsulateStyles$1 ( node ) {
	setAttribute( node, 'svelte-2409435514', '' );
}

function add_css$1 () {
	var style = createElement( 'style' );
	style.id = 'svelte-2409435514-style';
	style.textContent = "[svelte-2409435514].arrow,[svelte-2409435514] .arrow{position:relative;height:100%}[svelte-2409435514].arrow-head-rotate,[svelte-2409435514] .arrow-head-rotate{height:100%;width:100%}";
	appendNode( style, document.head );
}

function create_main_fragment$1 ( state, component ) {
	var div, div_style_value, text, text_1;

	var arrowside = new ArrowSide({
		_root: component._root,
		data: {
			which: "left",
			color: state.color,
			rotate: state.rotate,
			borderWidth: state.borderWidth
		}
	});

	var arrowside_1 = new ArrowSide({
		_root: component._root,
		data: {
			which: "right",
			color: state.color,
			rotate: state.rotate,
			borderWidth: state.borderWidth
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
			encapsulateStyles$1( div );
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
			if ( 'borderWidth' in changed ) arrowside_changes.borderWidth = state.borderWidth;

			if ( Object.keys( arrowside_changes ).length ) arrowside._set( arrowside_changes );

			var arrowside_1_changes = {};

			if ( 'color' in changed ) arrowside_1_changes.color = state.color;
			if ( 'rotate' in changed ) arrowside_1_changes.rotate = state.rotate;
			if ( 'borderWidth' in changed ) arrowside_1_changes.borderWidth = state.borderWidth;

			if ( Object.keys( arrowside_1_changes ).length ) arrowside_1._set( arrowside_1_changes );

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
		data: {
			color: state.color,
			size: state.size,
			sizeRatio: (state.progressRatio - 0.3) / 0.7
		}
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

			if ( 'color' in changed ) arrowhead_changes.color = state.color;
			if ( 'size' in changed ) arrowhead_changes.size = state.size;
			if ( 'progressRatio' in changed ) arrowhead_changes.sizeRatio = (state.progressRatio - 0.3) / 0.7;

			if ( Object.keys( arrowhead_changes ).length ) arrowhead._set( arrowhead_changes );
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

	if ( !document.getElementById( 'svelte-2409435514-style' ) ) add_css$1();

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

function recompute$5 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'which' in newState && differs( state.which, oldState.which ) ) || ( 'color' in newState && differs( state.color, oldState.color ) ) ) {
		state.borderColor = newState.borderColor = template$5.computed.borderColor( state.which, state.color );
	}

	if ( isInitial || ( 'initialProgress' in newState && differs( state.initialProgress, oldState.initialProgress ) ) ) {
		state.animationOffset = newState.animationOffset = template$5.computed.animationOffset( state.initialProgress );
	}
}

var template$5 = (function () {
const MAIN_DURATION = 2.91667;
const ANIMATION_DURATION = 1.3125;
const SYNC_MOD = MAIN_DURATION / ANIMATION_DURATION;

return {
  data () {
    return {
      which: 'left',
      borderWidth: 3,
      color: '#2196f3',
      animated: true,
      initialProgress: 0
    }
  },

  computed: {
    borderColor: (which, color) => {
      const colorIf = side => which === side ? color : 'transparent';
      return `${color} ${colorIf('right')} transparent ${colorIf('left')}`
    },
    animationOffset: initialProgress => {
      if (!initialProgress) { return 0 }
      return -((ANIMATION_DURATION * 1.1) * SYNC_MOD)
    }
  }
}

}());

function encapsulateStyles$5 ( node ) {
	setAttribute( node, 'svelte-2260197762', '' );
}

function add_css$5 () {
	var style = createElement( 'style' );
	style.id = 'svelte-2260197762-style';
	style.textContent = "@keyframes svelte-2260197762-left-expand{0%,100%{transform:rotate(125deg)}50%{transform:rotate(-5deg)}}@keyframes svelte-2260197762-right-expand{0%,100%{transform:rotate(-125deg)}50%{transform:rotate(5deg)}}[svelte-2260197762].left .half-circle.animated,[svelte-2260197762] .left .half-circle.animated{animation-name:svelte-2260197762-left-expand}[svelte-2260197762].right .half-circle.animated,[svelte-2260197762] .right .half-circle.animated{animation-name:svelte-2260197762-right-expand}[svelte-2260197762].half-circle,[svelte-2260197762] .half-circle{animation-duration:1.3125s;animation-timing-function:cubic-bezier(0.35, 0, 0.25, 1);animation-iteration-count:infinite}[svelte-2260197762].left,[svelte-2260197762] .left,[svelte-2260197762].right,[svelte-2260197762] .right{position:absolute;top:0;height:100%;width:50%;overflow:hidden}[svelte-2260197762].left,[svelte-2260197762] .left{width:calc(50% + 1px)}[svelte-2260197762].right,[svelte-2260197762] .right{right:0\n}[svelte-2260197762].half-circle,[svelte-2260197762] .half-circle{height:100%;width:200%;position:absolute;top:0;box-sizing:border-box;border-width:3px;border-style:solid;border-color:#000 #000 transparent #000;border-radius:50%}[svelte-2260197762].left .half-circle,[svelte-2260197762] .left .half-circle{width:calc(200% - 2px);border-right-color:transparent}[svelte-2260197762].right .half-circle,[svelte-2260197762] .right .half-circle{right:0;border-left-color:transparent}";
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
			encapsulateStyles$5( div );
			div.className = div_class_value = "side " + ( state.which );
			div_1.className = div_1_class_value = "half-circle " + ( state.animated ? 'animated' : '' );
			div_1.style.cssText = div_1_style_value = "\n      border-width: " + ( state.borderWidth ) + "px;\n      border-color: " + ( state.borderColor ) + ";\n      animation-delay: " + ( state.animationOffset ) + "s;\n    ";
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

			if ( div_1_style_value !== ( div_1_style_value = "\n      border-width: " + ( state.borderWidth ) + "px;\n      border-color: " + ( state.borderColor ) + ";\n      animation-delay: " + ( state.animationOffset ) + "s;\n    " ) ) {
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
	recompute$5( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	if ( !document.getElementById( 'svelte-2260197762-style' ) ) add_css$5();

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
	recompute$5( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

function recompute$4 ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'size' in newState && differs( state.size, oldState.size ) ) ) {
		state.borderWidth = newState.borderWidth = template$4.computed.borderWidth( state.size );
	}

	if ( isInitial || ( 'initialProgress' in newState && differs( state.initialProgress, oldState.initialProgress ) ) ) {
		state.animationOffset = newState.animationOffset = template$4.computed.animationOffset( state.initialProgress );
	}
}

var template$4 = (function () {
const ANIMATION_DURATION = 2.91667;

return {
  data () {
    return {
      size: 44,
      color: '#2196f3',
      // this is just serving as a boolean now, needs refactor
        // it just makes the animations start out in a state where the circle is fully expanded
        // and the open space is at the bottom, and is just about to collapse
        // this makes it easy to sync using the arrow-sync-container
      initialProgress: 0
    }
  },

  computed: {
    borderWidth: size => Math.round(size * 0.1154),
    animationOffset: initialProgress => {
      if (!initialProgress) { return 0 }
      return -(ANIMATION_DURATION * 1.1)
    }
  }
}
}());

function encapsulateStyles$4 ( node ) {
	setAttribute( node, 'svelte-2754252755', '' );
}

function add_css$4 () {
	var style = createElement( 'style' );
	style.id = 'svelte-2754252755-style';
	style.textContent = "@keyframes svelte-2754252755-outer-rotate{100%{transform:rotate(360deg)}}@keyframes svelte-2754252755-inner-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}[svelte-2754252755].spinner.animated,[svelte-2754252755] .spinner.animated{animation:svelte-2754252755-outer-rotate 2.91667s linear infinite}[svelte-2754252755].inner.animated,[svelte-2754252755] .inner.animated{animation:svelte-2754252755-inner-rotate 5.25s cubic-bezier(0.35, 0, 0.25, 1) infinite}[svelte-2754252755].spinner,[svelte-2754252755] .spinner{width:100%;height:100%;position:relative}[svelte-2754252755].inner,[svelte-2754252755] .inner{height:100%}";
	appendNode( style, document.head );
}

function create_main_fragment$4 ( state, component ) {
	var div, div_style_value, div_1, div_1_style_value, text;

	var spinnerside = new SpinnerSide({
		_root: component._root,
		data: {
			which: "left",
			color: state.color,
			borderWidth: state.borderWidth,
			initialProgress: state.initialProgress
		}
	});

	var spinnerside_1 = new SpinnerSide({
		_root: component._root,
		data: {
			which: "right",
			color: state.color,
			borderWidth: state.borderWidth,
			initialProgress: state.initialProgress
		}
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
			encapsulateStyles$4( div );
			div.className = "spinner animated";
			div.style.cssText = div_style_value = "animation-delay: " + ( state.animationOffset ) + "s;";
			div_1.className = "inner animated";
			div_1.style.cssText = div_1_style_value = "animation-delay: " + ( state.animationOffset ) + "s;";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
			spinnerside._fragment.mount( div_1, null );
			appendNode( text, div_1 );
			spinnerside_1._fragment.mount( div_1, null );
		},

		update: function ( changed, state ) {
			if ( div_style_value !== ( div_style_value = "animation-delay: " + ( state.animationOffset ) + "s;" ) ) {
				div.style.cssText = div_style_value;
			}

			if ( div_1_style_value !== ( div_1_style_value = "animation-delay: " + ( state.animationOffset ) + "s;" ) ) {
				div_1.style.cssText = div_1_style_value;
			}

			var spinnerside_changes = {};

			if ( 'color' in changed ) spinnerside_changes.color = state.color;
			if ( 'borderWidth' in changed ) spinnerside_changes.borderWidth = state.borderWidth;
			if ( 'initialProgress' in changed ) spinnerside_changes.initialProgress = state.initialProgress;

			if ( Object.keys( spinnerside_changes ).length ) spinnerside._set( spinnerside_changes );

			var spinnerside_1_changes = {};

			if ( 'color' in changed ) spinnerside_1_changes.color = state.color;
			if ( 'borderWidth' in changed ) spinnerside_1_changes.borderWidth = state.borderWidth;
			if ( 'initialProgress' in changed ) spinnerside_1_changes.initialProgress = state.initialProgress;

			if ( Object.keys( spinnerside_1_changes ).length ) spinnerside_1._set( spinnerside_1_changes );
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
	recompute$4( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	if ( !document.getElementById( 'svelte-2754252755-style' ) ) add_css$4();

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
	recompute$4( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'progressRatio' in newState && differs( state.progressRatio, oldState.progressRatio ) ) ) {
		state.spinning = newState.spinning = template.computed.spinning( state.progressRatio );
	}

	if ( isInitial || ( 'emphasized' in newState && differs( state.emphasized, oldState.emphasized ) ) || ( 'size' in newState && differs( state.size, oldState.size ) ) ) {
		state.padding = newState.padding = template.computed.padding( state.emphasized, state.size );
	}

	if ( isInitial || ( 'size' in newState && differs( state.size, oldState.size ) ) || ( 'padding' in newState && differs( state.padding, oldState.padding ) ) || ( 'emphasized' in newState && differs( state.emphasized, oldState.emphasized ) ) ) {
		state.spinnerSize = newState.spinnerSize = template.computed.spinnerSize( state.size, state.padding, state.emphasized );
	}

	if ( isInitial || ( 'spinning' in newState && differs( state.spinning, oldState.spinning ) ) || ( 'lastProgressRatio' in newState && differs( state.lastProgressRatio, oldState.lastProgressRatio ) ) ) {
		state.arrowSyncRotate = newState.arrowSyncRotate = template.computed.arrowSyncRotate( state.spinning, state.lastProgressRatio );
	}
}

var template = (function () {
return {
  data () {
    return {
      size: 38,
      color: '#2196f3',
      emphasized: false,
      progressRatio: undefined,
      lastProgressRatio: 0
    }
  },

  computed: {
    spinning: progressRatio => progressRatio === undefined,
    padding: (emphasized, size) => Math.round( (size * 0.2046) / (emphasized ? 1 : 1.7) ),
    spinnerSize: (size, padding, emphasized) => size - (padding * 2),
    arrowSyncRotate: (spinning, lastProgressRatio) => {
      const ratio = !spinning ? 0 : (lastProgressRatio || 0);
      return ratio * 270
    }
  },

  oncreate () {
    this.observe('progressRatio', (newValue, oldValue) => this.set({ lastProgressRatio: oldValue }));
  }
}
}());

function encapsulateStyles ( node ) {
	setAttribute( node, 'svelte-2977829762', '' );
}

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-2977829762-style';
	style.textContent = "[svelte-2977829762].refresh-indicator,[svelte-2977829762] .refresh-indicator{width:44px;height:44px;padding:4px;box-sizing:border-box;overflow:hidden}[svelte-2977829762].emphasized,[svelte-2977829762] .emphasized{padding:9px;border-radius:50%;background-color:#fff;box-shadow:0 2px 10px 0 rgba(0, 0, 0, 0.3)}[svelte-2977829762].arrow-sync-container,[svelte-2977829762] .arrow-sync-container{height:100%}";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div, div_class_value, div_style_value;

	var current_block_type = select_block_type( state );
	var if_block = current_block_type( state, component );

	return {
		create: function () {
			div = createElement( 'div' );
			if_block.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			encapsulateStyles( div );
			div.className = div_class_value = "refresh-indicator " + ( state.emphasized ? 'emphasized' : '' );
			div.style.cssText = div_style_value = "height: " + ( state.size ) + "px; width: " + ( state.size ) + "px; padding: " + ( state.padding ) + "px;";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			if_block.mount( div, null );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "refresh-indicator " + ( state.emphasized ? 'emphasized' : '' ) ) ) {
				div.className = div_class_value;
			}

			if ( div_style_value !== ( div_style_value = "height: " + ( state.size ) + "px; width: " + ( state.size ) + "px; padding: " + ( state.padding ) + "px;" ) ) {
				div.style.cssText = div_style_value;
			}

			if ( current_block_type === ( current_block_type = select_block_type( state ) ) && if_block ) {
				if_block.update( changed, state );
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block_type( state, component );
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
		_root: component._root,
		data: {
			color: state.color,
			size: state.spinnerSize,
			initialProgress: state.lastProgressRatio
		}
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

			var spinner_changes = {};

			if ( 'color' in changed ) spinner_changes.color = state.color;
			if ( 'spinnerSize' in changed ) spinner_changes.size = state.spinnerSize;
			if ( 'lastProgressRatio' in changed ) spinner_changes.initialProgress = state.lastProgressRatio;

			if ( Object.keys( spinner_changes ).length ) spinner._set( spinner_changes );
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
		data: {
			color: state.color,
			size: state.spinnerSize,
			progressRatio: state.progressRatio
		}
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

			if ( 'color' in changed ) arrow_changes.color = state.color;
			if ( 'spinnerSize' in changed ) arrow_changes.size = state.spinnerSize;
			if ( 'progressRatio' in changed ) arrow_changes.progressRatio = state.progressRatio;

			if ( Object.keys( arrow_changes ).length ) arrow._set( arrow_changes );
		},

		unmount: function () {
			arrow._fragment.unmount();
		},

		destroy: function () {
			arrow.destroy( false );
		}
	};
}

function select_block_type ( state ) {
	if ( state.spinning ) return create_if_block;
	return create_if_block_1;
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

	if ( !document.getElementById( 'svelte-2977829762-style' ) ) add_css();

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

export default Indicator;

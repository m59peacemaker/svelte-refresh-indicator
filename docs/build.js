(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Spinner = require( './Spinner.html' );

Spinner = ( Spinner && Spinner.__esModule ) ? Spinner['default'] : Spinner;

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-3541608156-style';
	style.textContent = "\n[svelte-3541608156].indicator, [svelte-3541608156] .indicator {\n  width: 26px;\n  height: 26px;\n  padding: 9px;\n  border-radius: 50%;\n  background-color: #fff;\n  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.15), 0 6px 13px 0 rgba(0, 0, 0, 0.2);\n}\n  /*position: fixed;\n  top: 0;\n  z-index: 10001;\n  perspective: 1000;\n  backface-visibility: hidden;\n  transform: scale(1);\n  overflow: hidden;\n}\n\n.refresh-main-animat {\n  transition: all 0.43s cubic-bezier(.08,.55,.81,1.8)\n  //transition: box-shadow 0.38s cubic-bezier(0.4, 0, 0.2, 1)\n}\n\n.refresh-nav {\n  transform: scale(1);\n}\n.refresh-noshow {\n  opacity: 0;\n  transform: scale(0.01) !important;\n  transition: all 0.25s ease-in-out !important;\n}*/\n";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div;

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
			setAttribute( div, 'svelte-3541608156', '' );
			div.className = "indicator";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			spinner._fragment.mount( div, null );
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			spinner.destroy( false );
		}
	};
}

function Indicator ( options ) {
	options = options || {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( 'svelte-3541608156-style' ) ) add_css();

	if ( !options._root ) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
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

assign( Indicator.prototype, {
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set
 });

Indicator.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
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

function createElement(name) {
	return document.createElement(name);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

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

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

module.exports = Indicator;

},{"./Spinner.html":2}],2:[function(require,module,exports){
'use strict';

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'animated' in newState && differs( state.animated, oldState.animated ) ) ) {
		state.animateClass = newState.animateClass = template.computed.animateClass( state.animated );
	}

	if ( isInitial || ( 'color' in newState && differs( state.color, oldState.color ) ) ) {
		state.halfCircleStyles = newState.halfCircleStyles = template.computed.halfCircleStyles( state.color );
	}
}

var template = (function () {
// TODO: there is a 1px space between the two sides that shouldn't be there :/
  const makeBorderRules = (color, side) =>
    `border-top-color: ${color}; border-${side}-color: ${color};`

  return {
    data () {
      return {
        animated: true,
        color: '#2196f3'
      }
    },

    computed: {
      animateClass: animated => animated ? 'animated' : '',
      halfCircleStyles: color => {
        return {
          left: makeBorderRules(color, 'left'),
          right: makeBorderRules(color, 'right')
        }
      }
    }
  }
}());

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-2347202610-style';
	style.textContent = "\n\n@keyframes svelte-2347202610-outer-rotate {\n  100% { transform: rotate(360deg); }\n}\n\n@keyframes svelte-2347202610-inner-rotate {\n  12.5% { transform: rotate(135deg); }\n  25%   { transform: rotate(270deg); }\n  37.5% { transform: rotate(405deg); }\n  50%   { transform: rotate(540deg); }\n  62.5% { transform: rotate(675deg); }\n  75%   { transform: rotate(810deg); }\n  87.5% { transform: rotate(945deg); }\n  100%  { transform: rotate(1080deg); }\n}\n\n@keyframes svelte-2347202610-left-expand {\n  0%, 100% { transform: rotate(130deg); }\n  50%      { transform: rotate(-5deg); }\n}\n\n@keyframes svelte-2347202610-right-expand {\n  0%, 100% { transform: rotate(-130deg); }\n  50%      { transform: rotate(5deg); }\n}\n\n[svelte-2347202610].spinner.animated, [svelte-2347202610] .spinner.animated {\n  animation: svelte-2347202610-outer-rotate 2.91667s linear infinite;\n}\n\n[svelte-2347202610].inner.animated, [svelte-2347202610] .inner.animated {\n  animation: svelte-2347202610-inner-rotate 5.25s cubic-bezier(0.35, 0, 0.25, 1) infinite;\n}\n\n[svelte-2347202610].left .half-circle.animated, [svelte-2347202610] .left .half-circle.animated {\n  animation-name: svelte-2347202610-left-expand;\n}\n\n[svelte-2347202610].right .half-circle.animated, [svelte-2347202610] .right .half-circle.animated {\n  animation-name: svelte-2347202610-right-expand;\n}\n\n[svelte-2347202610].spinner, [svelte-2347202610] .spinner {\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n\n[svelte-2347202610].inner, [svelte-2347202610] .inner {\n  height: 100%;\n}\n\n[svelte-2347202610].half-circle, [svelte-2347202610] .half-circle {\n  animation-duration: 1.3125s;\n  animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);\n  animation-iteration-count: infinite;\n}\n\n[svelte-2347202610].left, [svelte-2347202610] .left,\n[svelte-2347202610].right, [svelte-2347202610] .right {\n  position: absolute;\n  top: 0;\n  height: 100%;\n  width: 50%;\n  overflow: hidden;\n}\n\n[svelte-2347202610].left, [svelte-2347202610] .left {\n  /* The overflow: hidden separating the left and right caused a 1px distortion between them\n     in some browsers. This smooths it out by letting the left overlap the right by 1px\n   */\n  width: calc(50% + 1px);\n}\n\n[svelte-2347202610].right, [svelte-2347202610] .right {\n  right: 0\n}\n\n[svelte-2347202610].half-circle, [svelte-2347202610] .half-circle {\n  height: 100%;\n  width: 200%;\n  position: absolute;\n  top: 0;\n  box-sizing: border-box;\n  border-width: 3px;\n  border-style: solid;\n  border-color: #000 #000 transparent;\n  border-radius: 50%;\n}\n\n[svelte-2347202610].left .half-circle, [svelte-2347202610] .left .half-circle {\n  /* compensate the 1px overlap so that the circle remains the correct size and shape\n     see comment on .left\n   */\n  width: calc(200% - 2px);\n\n  border-right-color: transparent;\n}\n\n[svelte-2347202610].right .half-circle, [svelte-2347202610] .right .half-circle {\n  right: 0;\n  border-left-color: transparent;\n}\n\n";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div, div_class_value, div_1, div_1_class_value, div_2, div_3, div_3_class_value, div_3_style_value, text_1, div_4, div_5, div_5_class_value, div_5_style_value;

	return {
		create: function () {
			div = createElement( 'div' );
			div_1 = createElement( 'div' );
			div_2 = createElement( 'div' );
			div_3 = createElement( 'div' );
			text_1 = createText( "\n    " );
			div_4 = createElement( 'div' );
			div_5 = createElement( 'div' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-2347202610', '' );
			div.className = div_class_value = "spinner " + ( state.animateClass );
			div_1.className = div_1_class_value = "inner " + ( state.animateClass );
			div_2.className = "left";
			div_3.className = div_3_class_value = "half-circle " + ( state.animateClass );
			div_3.style.cssText = div_3_style_value = state.halfCircleStyles.left;
			div_4.className = "right";
			div_5.className = div_5_class_value = "half-circle " + ( state.animateClass );
			div_5.style.cssText = div_5_style_value = state.halfCircleStyles.right;
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( div_1, div );
			appendNode( div_2, div_1 );
			appendNode( div_3, div_2 );
			appendNode( text_1, div_1 );
			appendNode( div_4, div_1 );
			appendNode( div_5, div_4 );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = "spinner " + ( state.animateClass ) ) ) {
				div.className = div_class_value;
			}

			if ( div_1_class_value !== ( div_1_class_value = "inner " + ( state.animateClass ) ) ) {
				div_1.className = div_1_class_value;
			}

			if ( div_3_class_value !== ( div_3_class_value = "half-circle " + ( state.animateClass ) ) ) {
				div_3.className = div_3_class_value;
			}

			if ( div_3_style_value !== ( div_3_style_value = state.halfCircleStyles.left ) ) {
				div_3.style.cssText = div_3_style_value;
			}

			if ( div_5_class_value !== ( div_5_class_value = "half-circle " + ( state.animateClass ) ) ) {
				div_5.className = div_5_class_value;
			}

			if ( div_5_style_value !== ( div_5_style_value = state.halfCircleStyles.right ) ) {
				div_5.style.cssText = div_5_style_value;
			}
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: noop
	};
}

function Spinner ( options ) {
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
	if ( !document.getElementById( 'svelte-2347202610-style' ) ) add_css();

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Spinner.prototype, {
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set
 });

Spinner.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false )
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

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function createElement(name) {
	return document.createElement(name);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function createText(data) {
	return document.createTextNode(data);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

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

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

module.exports = Spinner;

},{}],3:[function(require,module,exports){
const Indicator = require('./src/Indicator.html')

new Indicator({ target: document.body })

},{"./src/Indicator.html":1}]},{},[3]);

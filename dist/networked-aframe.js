/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	// Dependencies
	__webpack_require__(1);

	// Global vars and functions
	__webpack_require__(3);

	// Network components
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(21);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/* global AFRAME THREE */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	var degToRad = THREE.Math.degToRad;
	var almostEqual = __webpack_require__(2);
	/**
	 * Linear Interpolation component for A-Frame.
	 */
	AFRAME.registerComponent('lerp', {
	  schema: {
	    properties: { default: ['position', 'rotation', 'scale'] }
	  },

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function init() {
	    var el = this.el;
	    this.lastPosition = el.getAttribute('position');
	    this.lastRotation = el.getAttribute('rotation');
	    this.lastScale = el.getAttribute('scale');

	    this.lerpingPosition = false;
	    this.lerpingRotation = false;
	    this.lerpingScale = false;

	    this.timeOfLastUpdate = 0;
	  },

	  /**
	   * Called on each scene tick.
	   */
	  tick: function tick(time, deltaTime) {
	    var progress;
	    var now = this.now();
	    var obj3d = this.el.object3D;

	    this.checkForComponentChanged();

	    // Lerp position
	    if (this.lerpingPosition) {
	      progress = (now - this.startLerpTimePosition) / this.duration;
	      obj3d.position.lerpVectors(this.startPosition, this.targetPosition, progress);
	      // console.log("new position", obj3d.position);
	      if (progress >= 1) {
	        this.lerpingPosition = false;
	      }
	    }

	    // Slerp rotation
	    if (this.lerpingRotation) {
	      progress = (now - this.startLerpTimeRotation) / this.duration;
	      THREE.Quaternion.slerp(this.startRotation, this.targetRotation, obj3d.quaternion, progress);
	      if (progress >= 1) {
	        this.lerpingRotation = false;
	      }
	    }

	    // Lerp scale
	    if (this.lerpingScale) {
	      progress = (now - this.startLerpTimeScale) / this.duration;
	      obj3d.scale.lerpVectors(this.startScale, this.targetScale, progress);
	      if (progress >= 1) {
	        this.lerpingScale = false;
	      }
	    }
	  },

	  checkForComponentChanged: function checkForComponentChanged() {
	    var el = this.el;

	    var hasChanged = false;

	    var newPosition = el.getAttribute('position');
	    if (this.isLerpable('position') && !this.almostEqualVec3(this.lastPosition, newPosition)) {
	      this.toPosition(this.lastPosition, newPosition);
	      this.lastPosition = newPosition;
	      hasChanged = true;
	    }

	    var newRotation = el.getAttribute('rotation');
	    if (this.isLerpable('rotation') && !this.almostEqualVec3(this.lastRotation, newRotation)) {
	      this.toRotation(this.lastRotation, newRotation);
	      this.lastRotation = newRotation;
	      hasChanged = true;
	    }

	    var newScale = el.getAttribute('scale');
	    if (this.isLerpable('scale') && !this.almostEqualVec3(this.lastScale, newScale)) {
	      this.toScale(this.lastScale, newScale);
	      this.lastScale = newScale;
	      hasChanged = true;
	    }

	    if (hasChanged) {
	      this.updateDuration();
	    }
	  },

	  isLerpable: function isLerpable(name) {
	    return this.data.properties.indexOf(name) != -1;
	  },

	  updateDuration: function updateDuration() {
	    var now = this.now();
	    this.duration = now - this.timeOfLastUpdate;
	    this.timeOfLastUpdate = now;
	  },

	  /**
	   * Start lerp to position (vec3)
	   */
	  toPosition: function toPosition(from, to) {
	    this.lerpingPosition = true;
	    this.startLerpTimePosition = this.now();
	    this.startPosition = new THREE.Vector3(from.x, from.y, from.z);
	    this.targetPosition = new THREE.Vector3(to.x, to.y, to.z);
	  },

	  /**
	   * Start lerp to euler rotation (vec3,'YXZ')
	   */
	  toRotation: function toRotation(from, to) {
	    this.lerpingRotation = true;
	    this.startLerpTimeRotation = this.now();
	    this.startRotation = new THREE.Quaternion();
	    this.startRotation.setFromEuler(new THREE.Euler(degToRad(from.x), degToRad(from.y), degToRad(from.z), 'YXZ'));
	    this.targetRotation = new THREE.Quaternion();
	    this.targetRotation.setFromEuler(new THREE.Euler(degToRad(to.x), degToRad(to.y), degToRad(to.z), 'YXZ'));
	  },

	  /**
	   * Start lerp to scale (vec3)
	   */
	  toScale: function toScale(from, to) {
	    this.lerpingScale = true;
	    this.startLerpTimeScale = this.now();
	    this.startScale = new THREE.Vector3(from.x, from.y, from.z);
	    this.targetScale = new THREE.Vector3(to.x, to.y, to.z);
	  },

	  almostEqualVec3: function almostEqualVec3(a, b) {
	    return almostEqual(a.x, b.x) && almostEqual(a.y, b.y) && almostEqual(a.z, b.z);
	  },

	  /**
	   * Returns the current time in milliseconds (ms)
	   */
	  now: function now() {
	    return Date.now();
	  }
	});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	var abs = Math.abs,
	    min = Math.min;

	function almostEqual(a, b, absoluteError, relativeError) {
	  var d = abs(a - b);

	  if (absoluteError == null) absoluteError = almostEqual.DBL_EPSILON;
	  if (relativeError == null) relativeError = absoluteError;

	  if (d <= absoluteError) {
	    return true;
	  }
	  if (d <= relativeError * min(abs(a), abs(b))) {
	    return true;
	  }
	  return a === b;
	}

	almostEqual.FLT_EPSILON = 1.19209290e-7;
	almostEqual.DBL_EPSILON = 2.2204460492503131e-16;

	module.exports = almostEqual;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var options = __webpack_require__(4);
	var utils = __webpack_require__(5);
	var NafLogger = __webpack_require__(6);
	var Schemas = __webpack_require__(7);
	var NetworkEntities = __webpack_require__(8);
	var NetworkConnection = __webpack_require__(10);
	var AdapterFactory = __webpack_require__(11);

	var naf = {};
	naf.app = '';
	naf.room = '';
	naf.clientId = '';
	naf.options = options;
	naf.utils = utils;
	naf.log = new NafLogger();
	naf.schemas = new Schemas();
	naf.version = "0.5.0";

	naf.adapters = new AdapterFactory();
	var entities = new NetworkEntities();
	var connection = new NetworkConnection(entities);
	naf.connection = connection;
	naf.entities = entities;

	module.exports = window.NAF = naf;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	var options = {
	  debug: false,
	  updateRate: 15, // How often network components call `sync`
	  compressSyncPackets: false, // compress network component sync packet json
	  useLerp: true // when networked entities are created the aframe-lerp-component is attached to the root
	};
	module.exports = options;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	module.exports.whenEntityLoaded = function (entity, callback) {
	  if (entity.hasLoaded) {
	    callback();
	  }
	  entity.addEventListener('loaded', function () {
	    callback();
	  });
	};

	module.exports.createHtmlNodeFromString = function (str) {
	  var div = document.createElement('div');
	  div.innerHTML = str;
	  var child = div.firstChild;
	  return child;
	};

	module.exports.getNetworkOwner = function (el) {
	  var components = el.components;
	  if (components.hasOwnProperty('networked')) {
	    return components['networked'].data.owner;
	  }
	  return null;
	};

	module.exports.getNetworkId = function (el) {
	  var components = el.components;
	  if (components.hasOwnProperty('networked')) {
	    return components['networked'].networkId;
	  }
	  return null;
	};

	module.exports.now = function () {
	  return Date.now();
	};

	module.exports.createNetworkId = function () {
	  return Math.random().toString(36).substring(2, 9);
	};

	module.exports.delimiter = '---';

	module.exports.childSchemaToKey = function (schema) {
	  var key = (schema.selector || '') + module.exports.delimiter + (schema.component || '') + module.exports.delimiter + (schema.property || '');
	  return key;
	};

	module.exports.keyToChildSchema = function (key) {
	  var splitKey = key.split(module.exports.delimiter, 3);
	  return { selector: splitKey[0] || undefined, component: splitKey[1], property: splitKey[2] || undefined };
	};

	module.exports.isChildSchemaKey = function (key) {
	  return key.indexOf(module.exports.delimiter) != -1;
	};

	module.exports.childSchemaEqual = function (a, b) {
	  return a.selector == b.selector && a.component == b.component && a.property == b.property;
	};

	/**
	 * Find the closest ancestor (including the passed in entity) that has a `networked` component
	 * @param {ANode} entity - Entity to begin the search on
	 * @returns {Promise<ANode>} An promise that resolves to an entity with a `networked` component
	 */
	function getNetworkedEntity(entity) {
	  return new Promise(function (resolve, reject) {
	    var curEntity = entity;

	    while (curEntity && !curEntity.hasAttribute("networked")) {
	      curEntity = curEntity.parentNode;
	    }

	    if (!curEntity) {
	      return reject("Entity does not have and is not a child of an entity with the [networked] component ");
	    }

	    curEntity.addEventListener("instantiated", function () {
	      resolve(curEntity);
	    }, { once: true });
	  });
	};

	module.exports.getNetworkedEntity = getNetworkedEntity;

	module.exports.takeOwnership = function (entity) {
	  var curEntity = entity;

	  while (curEntity && !curEntity.hasAttribute("networked")) {
	    curEntity = curEntity.parentNode;
	  }

	  if (curEntity) {
	    if (!curEntity.components.networked) {
	      throw new Error("Entity with [networked] component not initialized.");
	    }

	    return curEntity.components.networked.takeOwnership();
	  }

	  throw new Error("takeOwnership() must be called on an entity or child of an entity with the [networked] component.");
	};

	module.exports.isMine = function (entity) {
	  var curEntity = entity;

	  while (curEntity && !curEntity.hasAttribute("networked")) {
	    curEntity = curEntity.parentNode;
	  }

	  if (curEntity) {
	    if (!curEntity.components.networked) {
	      throw new Error("Entity with [networked] component not initialized.");
	    }

	    return curEntity.components.networked.data.owner === NAF.clientId;
	  }

	  throw new Error("isMine() must be called on an entity or child of an entity with the [networked] component.");
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NafLogger = function () {
	  function NafLogger() {
	    _classCallCheck(this, NafLogger);

	    this.debug = false;
	  }

	  _createClass(NafLogger, [{
	    key: "setDebug",
	    value: function setDebug(debug) {
	      this.debug = debug;
	    }
	  }, {
	    key: "write",
	    value: function write() {
	      if (this.debug) {
	        console.log.apply(this, arguments);
	      }
	    }
	  }, {
	    key: "error",
	    value: function error() {
	      console.error.apply(this, arguments);
	    }
	  }]);

	  return NafLogger;
	}();

	module.exports = NafLogger;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Schemas = function () {
	  function Schemas() {
	    _classCallCheck(this, Schemas);

	    this.dict = {};
	  }

	  _createClass(Schemas, [{
	    key: 'add',
	    value: function add(schema) {
	      if (this.validate(schema)) {
	        this.dict[schema.template] = schema;
	      } else {
	        NAF.log.error('Schema not valid: ', schema);
	        NAF.log.error('See https://github.com/haydenjameslee/networked-aframe#syncing-custom-components');
	      }
	    }
	  }, {
	    key: 'hasTemplate',
	    value: function hasTemplate(template) {
	      return this.dict.hasOwnProperty(template);
	    }
	  }, {
	    key: 'getComponents',
	    value: function getComponents(template) {
	      var components = ['position', 'rotation'];
	      if (this.hasTemplate(template)) {
	        components = this.dict[template].components;
	      }
	      return components;
	    }
	  }, {
	    key: 'validate',
	    value: function validate(schema) {
	      return schema.hasOwnProperty('template') && schema.hasOwnProperty('components');
	    }
	  }, {
	    key: 'remove',
	    value: function remove(template) {
	      delete this.dict[template];
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.dict = {};
	    }
	  }]);

	  return Schemas;
	}();

	module.exports = Schemas;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChildEntityCache = __webpack_require__(9);

	var NetworkEntities = function () {
	  function NetworkEntities() {
	    _classCallCheck(this, NetworkEntities);

	    this.entities = {};
	    this.childCache = new ChildEntityCache();

	    this.onRemoteEntityCreatedEvent = new Event('remoteEntityCreated');
	  }

	  _createClass(NetworkEntities, [{
	    key: 'registerEntity',
	    value: function registerEntity(networkId, entity) {
	      this.entities[networkId] = entity;
	    }
	  }, {
	    key: 'createRemoteEntity',
	    value: function createRemoteEntity(entityData) {
	      NAF.log.write('Creating remote entity', entityData);

	      var networkId = entityData.networkId;
	      var template = document.querySelector(entityData.template);
	      var clone = document.importNode(template.content, true);
	      var el = clone.firstElementChild;

	      el.setAttribute('id', 'naf-' + networkId);
	      this.initPosition(el, entityData.components);
	      this.initRotation(el, entityData.components);
	      this.addNetworkComponent(el, entityData);

	      this.registerEntity(networkId, el);

	      return el;
	    }
	  }, {
	    key: 'initPosition',
	    value: function initPosition(entity, componentData) {
	      var hasPosition = componentData.hasOwnProperty('position');
	      if (hasPosition) {
	        var position = componentData.position;
	        entity.setAttribute('position', position.x + ' ' + position.y + ' ' + position.z);
	      }
	    }
	  }, {
	    key: 'initRotation',
	    value: function initRotation(entity, componentData) {
	      var hasRotation = componentData.hasOwnProperty('rotation');
	      if (hasRotation) {
	        var rotation = componentData.rotation;
	        entity.setAttribute('rotation', rotation.x + ' ' + rotation.y + ' ' + rotation.z);
	      }
	    }
	  }, {
	    key: 'addNetworkComponent',
	    value: function addNetworkComponent(entity, entityData) {
	      var networkData = {
	        template: entityData.template,
	        owner: entityData.owner,
	        networkId: entityData.networkId
	      };
	      // TODO: refactor so we append this element before setting the attribute in order to avoid string serialization.
	      entity.setAttribute('networked', 'template: ' + entityData.template + '; owner: ' + entityData.owner + '; networkId: ' + entityData.networkId);
	      entity.firstUpdateData = entityData;
	    }
	  }, {
	    key: 'updateEntity',
	    value: function updateEntity(client, dataType, entityData) {
	      var isCompressed = entityData[0] == 1;
	      var networkId = isCompressed ? entityData[1] : entityData.networkId;

	      if (this.hasEntity(networkId)) {
	        this.entities[networkId].emit('networkUpdate', { entityData: entityData }, false);
	      } else if (!isCompressed && this.isFullSync(entityData)) {
	        this.receiveFirstUpdateFromEntity(entityData);
	      }
	    }
	  }, {
	    key: 'isFullSync',
	    value: function isFullSync(entityData) {
	      var numSentComps = Object.keys(entityData.components).length;
	      var numTemplateComps = NAF.schemas.getComponents(entityData.template).length;
	      return numSentComps === numTemplateComps;
	    }
	  }, {
	    key: 'receiveFirstUpdateFromEntity',
	    value: function receiveFirstUpdateFromEntity(entityData) {
	      var parent = entityData.parent;
	      var networkId = entityData.networkId;

	      var parentNotCreatedYet = parent && !this.hasEntity(parent);
	      if (parentNotCreatedYet) {
	        this.childCache.addChild(parent, entityData);
	      } else {
	        var remoteEntity = this.createRemoteEntity(entityData);
	        this.createAndAppendChildren(networkId, remoteEntity);
	        this.addEntityToPage(remoteEntity, parent);
	      }
	    }
	  }, {
	    key: 'createAndAppendChildren',
	    value: function createAndAppendChildren(parentId, parentEntity) {
	      var children = this.childCache.getChildren(parentId);
	      for (var i = 0; i < children.length; i++) {
	        var childEntityData = children[i];
	        var childId = childEntityData.networkId;
	        if (this.hasEntity(childId)) {
	          console.warn('Tried to instantiate entity multiple times', childId, childEntityData, 'Existing entity:', this.getEntity(childId));
	          continue;
	        }
	        var childEntity = this.createRemoteEntity(childEntityData);
	        this.createAndAppendChildren(childId, childEntity);
	        parentEntity.appendChild(childEntity);
	      }
	    }
	  }, {
	    key: 'addEntityToPage',
	    value: function addEntityToPage(entity, parentId) {
	      if (this.hasEntity(parentId)) {
	        this.addEntityToParent(entity, parentId);
	      } else {
	        this.addEntityToSceneRoot(entity);
	      }
	    }
	  }, {
	    key: 'addEntityToParent',
	    value: function addEntityToParent(entity, parentId) {
	      var parentEl = document.getElementById('naf-' + parentId);
	      parentEl.appendChild(entity);
	    }
	  }, {
	    key: 'addEntityToSceneRoot',
	    value: function addEntityToSceneRoot(el) {
	      var scene = document.querySelector('a-scene');
	      scene.appendChild(el);
	    }
	  }, {
	    key: 'completeSync',
	    value: function completeSync(targetClientId) {
	      for (var id in this.entities) {
	        if (this.entities.hasOwnProperty(id)) {
	          this.entities[id].emit('syncAll', { targetClientId: targetClientId }, false);
	        }
	      }
	    }
	  }, {
	    key: 'removeRemoteEntity',
	    value: function removeRemoteEntity(toClient, dataType, data) {
	      var id = data.networkId;
	      return this.removeEntity(id);
	    }
	  }, {
	    key: 'removeEntitiesOfClient',
	    value: function removeEntitiesOfClient(clientId) {
	      var entityList = [];
	      for (var id in this.entities) {
	        var entityOwner = NAF.utils.getNetworkOwner(this.entities[id]);
	        if (entityOwner == clientId) {
	          var entity = this.removeEntity(id);
	          entityList.push(entity);
	        }
	      }
	      return entityList;
	    }
	  }, {
	    key: 'removeEntity',
	    value: function removeEntity(id) {
	      if (this.hasEntity(id)) {
	        var entity = this.entities[id];
	        delete this.entities[id];
	        entity.parentNode.removeChild(entity);
	        return entity;
	      } else {
	        return null;
	      }
	    }
	  }, {
	    key: 'getEntity',
	    value: function getEntity(id) {
	      if (this.entities.hasOwnProperty(id)) {
	        return this.entities[id];
	      }
	      return null;
	    }
	  }, {
	    key: 'hasEntity',
	    value: function hasEntity(id) {
	      return this.entities.hasOwnProperty(id);
	    }
	  }, {
	    key: 'removeRemoteEntities',
	    value: function removeRemoteEntities() {
	      this.childCache = new ChildEntityCache();

	      for (var id in this.entities) {
	        var owner = this.entities[id].getAttribute('networked').owner;
	        if (owner != NAF.clientId) {
	          this.removeEntity(id);
	        }
	      }
	    }
	  }]);

	  return NetworkEntities;
	}();

	module.exports = NetworkEntities;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChildEntityCache = function () {
	  function ChildEntityCache() {
	    _classCallCheck(this, ChildEntityCache);

	    this.dict = {};
	  }

	  _createClass(ChildEntityCache, [{
	    key: "addChild",
	    value: function addChild(parentNetworkId, childData) {
	      if (!this.hasParent(parentNetworkId)) {
	        this.dict[parentNetworkId] = [];
	      }
	      this.dict[parentNetworkId].push(childData);
	    }
	  }, {
	    key: "getChildren",
	    value: function getChildren(parentNetworkId) {
	      if (!this.hasParent(parentNetworkId)) {
	        return [];
	      }
	      var children = this.dict[parentNetworkId];
	      delete this.dict[parentNetworkId];
	      return children;
	    }

	    /* Private */

	  }, {
	    key: "hasParent",
	    value: function hasParent(parentId) {
	      return this.dict.hasOwnProperty(parentId);
	    }
	  }]);

	  return ChildEntityCache;
	}();

	module.exports = ChildEntityCache;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ReservedDataType = { Update: 'u', Remove: 'r' };

	var NetworkConnection = function () {
	  function NetworkConnection(networkEntities) {
	    _classCallCheck(this, NetworkConnection);

	    this.entities = networkEntities;
	    this.setupDefaultDataSubscriptions();

	    this.connectedClients = {};
	    this.activeDataChannels = {};
	  }

	  _createClass(NetworkConnection, [{
	    key: 'setNetworkAdapter',
	    value: function setNetworkAdapter(adapter) {
	      this.adapter = adapter;
	    }
	  }, {
	    key: 'setupDefaultDataSubscriptions',
	    value: function setupDefaultDataSubscriptions() {
	      this.dataChannelSubs = {};

	      this.dataChannelSubs[ReservedDataType.Update] = this.entities.updateEntity.bind(this.entities);

	      this.dataChannelSubs[ReservedDataType.Remove] = this.entities.removeRemoteEntity.bind(this.entities);
	    }
	  }, {
	    key: 'connect',
	    value: function connect(serverUrl, appName, roomName) {
	      var enableAudio = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	      NAF.app = appName;
	      NAF.room = roomName;

	      this.adapter.setServerUrl(serverUrl);
	      this.adapter.setApp(appName);
	      this.adapter.setRoom(roomName);

	      var webrtcOptions = {
	        audio: enableAudio,
	        video: false,
	        datachannel: true
	      };
	      this.adapter.setWebRtcOptions(webrtcOptions);

	      this.adapter.setServerConnectListeners(this.connectSuccess.bind(this), this.connectFailure.bind(this));
	      this.adapter.setDataChannelListeners(this.dataChannelOpen.bind(this), this.dataChannelClosed.bind(this), this.receivedData.bind(this));
	      this.adapter.setRoomOccupantListener(this.occupantsReceived.bind(this));

	      this.adapter.connect();
	    }
	  }, {
	    key: 'onConnect',
	    value: function onConnect(callback) {
	      this.onConnectCallback = callback;

	      if (this.isConnected()) {
	        callback();
	      } else {
	        document.body.addEventListener('connected', callback, false);
	      }
	    }
	  }, {
	    key: 'connectSuccess',
	    value: function connectSuccess(clientId) {
	      NAF.log.write('Networked-Aframe Client ID:', clientId);
	      NAF.clientId = clientId;

	      var evt = new CustomEvent('connected', { 'detail': { clientId: clientId } });
	      document.body.dispatchEvent(evt);
	    }
	  }, {
	    key: 'connectFailure',
	    value: function connectFailure(errorCode, message) {
	      NAF.log.error(errorCode, "failure to connect");
	    }
	  }, {
	    key: 'occupantsReceived',
	    value: function occupantsReceived(occupantList) {
	      var prevConnectedClients = Object.assign({}, this.connectedClients);
	      this.connectedClients = occupantList;
	      this.checkForDisconnectingClients(prevConnectedClients, occupantList);
	      this.checkForConnectingClients(occupantList);
	    }
	  }, {
	    key: 'checkForDisconnectingClients',
	    value: function checkForDisconnectingClients(oldOccupantList, newOccupantList) {
	      for (var id in oldOccupantList) {
	        var clientFound = newOccupantList.hasOwnProperty(id);
	        if (!clientFound) {
	          NAF.log.write('Closing stream to ', id);
	          this.adapter.closeStreamConnection(id);
	        }
	      }
	    }

	    // Some adapters will handle this internally

	  }, {
	    key: 'checkForConnectingClients',
	    value: function checkForConnectingClients(occupantList) {
	      for (var id in occupantList) {
	        var startConnection = this.isNewClient(id) && this.adapter.shouldStartConnectionTo(occupantList[id]);
	        if (startConnection) {
	          NAF.log.write('Opening datachannel to ', id);
	          this.adapter.startStreamConnection(id);
	        }
	      }
	    }
	  }, {
	    key: 'getConnectedClients',
	    value: function getConnectedClients() {
	      return this.connectedClients;
	    }
	  }, {
	    key: 'isConnected',
	    value: function isConnected() {
	      return !!NAF.clientId;
	    }
	  }, {
	    key: 'isMineAndConnected',
	    value: function isMineAndConnected(clientId) {
	      return this.isConnected() && NAF.clientId === clientId;
	    }
	  }, {
	    key: 'isNewClient',
	    value: function isNewClient(clientId) {
	      return !this.isConnectedTo(clientId);
	    }
	  }, {
	    key: 'isConnectedTo',
	    value: function isConnectedTo(clientId) {
	      return this.adapter.getConnectStatus(clientId) === NAF.adapters.IS_CONNECTED;
	    }
	  }, {
	    key: 'dataChannelOpen',
	    value: function dataChannelOpen(clientId) {
	      NAF.log.write('Opened data channel from ' + clientId);
	      this.activeDataChannels[clientId] = true;
	      this.entities.completeSync(clientId);

	      var evt = new CustomEvent('clientConnected', { detail: { clientId: clientId } });
	      document.body.dispatchEvent(evt);
	    }
	  }, {
	    key: 'dataChannelClosed',
	    value: function dataChannelClosed(clientId) {
	      NAF.log.write('Closed data channel from ' + clientId);
	      this.activeDataChannels[clientId] = false;
	      this.entities.removeEntitiesOfClient(clientId);

	      var evt = new CustomEvent('clientDisconnected', { detail: { clientId: clientId } });
	      document.body.dispatchEvent(evt);
	    }
	  }, {
	    key: 'hasActiveDataChannel',
	    value: function hasActiveDataChannel(clientId) {
	      return this.activeDataChannels.hasOwnProperty(clientId) && this.activeDataChannels[clientId];
	    }
	  }, {
	    key: 'broadcastData',
	    value: function broadcastData(dataType, data) {
	      this.adapter.broadcastData(dataType, data);
	    }
	  }, {
	    key: 'broadcastDataGuaranteed',
	    value: function broadcastDataGuaranteed(dataType, data) {
	      this.adapter.broadcastDataGuaranteed(dataType, data);
	    }
	  }, {
	    key: 'sendData',
	    value: function sendData(toClientId, dataType, data, guaranteed) {
	      if (this.hasActiveDataChannel(toClientId)) {
	        if (guaranteed) {
	          this.adapter.sendDataGuaranteed(toClientId, dataType, data);
	        } else {
	          this.adapter.sendData(toClientId, dataType, data);
	        }
	      } else {
	        // console.error("NOT-CONNECTED", "not connected to " + toClient);
	      }
	    }
	  }, {
	    key: 'sendDataGuaranteed',
	    value: function sendDataGuaranteed(toClientId, dataType, data) {
	      this.sendData(toClientId, dataType, data, true);
	    }
	  }, {
	    key: 'subscribeToDataChannel',
	    value: function subscribeToDataChannel(dataType, callback) {
	      if (this.isReservedDataType(dataType)) {
	        NAF.log.error('NetworkConnection@subscribeToDataChannel: ' + dataType + ' is a reserved dataType. Choose another');
	        return;
	      }
	      this.dataChannelSubs[dataType] = callback;
	    }
	  }, {
	    key: 'unsubscribeToDataChannel',
	    value: function unsubscribeToDataChannel(dataType) {
	      if (this.isReservedDataType(dataType)) {
	        NAF.log.error('NetworkConnection@unsubscribeToDataChannel: ' + dataType + ' is a reserved dataType. Choose another');
	        return;
	      }
	      delete this.dataChannelSubs[dataType];
	    }
	  }, {
	    key: 'isReservedDataType',
	    value: function isReservedDataType(dataType) {
	      return dataType == ReservedDataType.Update || dataType == ReservedDataType.Remove;
	    }
	  }, {
	    key: 'receivedData',
	    value: function receivedData(fromClientId, dataType, data) {
	      if (this.dataChannelSubs.hasOwnProperty(dataType)) {
	        this.dataChannelSubs[dataType](fromClientId, dataType, data);
	      } else {
	        NAF.log.error('NetworkConnection@receivedData: ' + dataType + ' has not been subscribed to yet. Call subscribeToDataChannel()');
	      }
	    }
	  }, {
	    key: 'getServerTime',
	    value: function getServerTime() {
	      return this.adapter.getServerTime();
	    }
	  }, {
	    key: 'disconnect',
	    value: function disconnect() {
	      this.entities.removeRemoteEntities();
	      this.adapter.disconnect();

	      NAF.app = '';
	      NAF.room = '';
	      NAF.clientId = '';
	      this.connectedClients = {};
	      this.activeDataChannels = {};
	      this.adapter = null;

	      this.setupDefaultDataSubscriptions();

	      document.body.removeEventListener('connected', this.onConnectCallback);
	    }
	  }]);

	  return NetworkConnection;
	}();

	module.exports = NetworkConnection;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WsEasyRtcAdapter = __webpack_require__(12);
	var EasyRtcAdapter = __webpack_require__(13);

	var AdapterFactory = function () {
	  function AdapterFactory() {
	    _classCallCheck(this, AdapterFactory);

	    this.adapters = {
	      "wseasyrtc": WsEasyRtcAdapter,
	      "easyrtc": EasyRtcAdapter
	    };

	    this.IS_CONNECTED = AdapterFactory.IS_CONNECTED;
	    this.CONNECTING = AdapterFactory.CONNECTING;
	    this.NOT_CONNECTED = AdapterFactory.NOT_CONNECTED;
	  }

	  _createClass(AdapterFactory, [{
	    key: "register",
	    value: function register(adapterName, AdapterClass) {
	      this.adapters[adapterName] = AdapterClass;
	    }
	  }, {
	    key: "make",
	    value: function make(adapterName) {
	      var name = adapterName.toLowerCase();
	      if (this.adapters[name]) {
	        var AdapterClass = this.adapters[name];
	        return new AdapterClass();
	      } else {
	        throw new Error("Adapter: " + adapterName + " not registered. Please use NAF.adapters.register() to register this adapter.");
	      }
	    }
	  }]);

	  return AdapterFactory;
	}();

	AdapterFactory.IS_CONNECTED = "IS_CONNECTED";
	AdapterFactory.CONNECTING = "CONNECTING";
	AdapterFactory.NOT_CONNECTED = "NOT_CONNECTED";

	module.exports = AdapterFactory;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WsEasyRtcInterface = function () {
	  function WsEasyRtcInterface(easyrtc) {
	    _classCallCheck(this, WsEasyRtcInterface);

	    this.easyrtc = easyrtc || window.easyrtc;
	    this.app = 'default';
	    this.room = 'default';

	    this.connectedClients = [];

	    this.serverTimeRequests = 0;
	    this.timeOffsets = [];
	    this.avgTimeOffset = 0;
	  }

	  _createClass(WsEasyRtcInterface, [{
	    key: 'setServerUrl',
	    value: function setServerUrl(url) {
	      this.serverUrl = url;
	      this.easyrtc.setSocketUrl(url);
	    }
	  }, {
	    key: 'setApp',
	    value: function setApp(appName) {
	      this.app = appName;
	    }
	  }, {
	    key: 'setRoom',
	    value: function setRoom(roomName) {
	      this.room = roomName;
	      this.easyrtc.joinRoom(roomName, null);
	    }
	  }, {
	    key: 'setWebRtcOptions',
	    value: function setWebRtcOptions(options) {
	      // No webrtc support
	    }
	  }, {
	    key: 'setServerConnectListeners',
	    value: function setServerConnectListeners(successListener, failureListener) {
	      this.connectSuccess = successListener;
	      this.connectFailure = failureListener;
	    }
	  }, {
	    key: 'setRoomOccupantListener',
	    value: function setRoomOccupantListener(occupantListener) {
	      this.easyrtc.setRoomOccupantListener(function (roomName, occupants, primary) {
	        occupantListener(occupants);
	      });
	    }
	  }, {
	    key: 'setDataChannelListeners',
	    value: function setDataChannelListeners(openListener, closedListener, messageListener) {
	      this.openListener = openListener;
	      this.closedListener = closedListener;
	      this.easyrtc.setPeerListener(messageListener);
	    }
	  }, {
	    key: 'updateTimeOffset',
	    value: function updateTimeOffset() {
	      var _this = this;

	      var clientSentTime = Date.now() + this.avgTimeOffset;

	      return fetch(document.location.href, { method: "HEAD", cache: "no-cache" }).then(function (res) {
	        var precision = 1000;
	        var serverReceivedTime = new Date(res.headers.get("Date")).getTime() + precision / 2;
	        var clientReceivedTime = Date.now();
	        var serverTime = serverReceivedTime + (clientReceivedTime - clientSentTime) / 2;
	        var timeOffset = serverTime - clientReceivedTime;

	        _this.serverTimeRequests++;

	        if (_this.serverTimeRequests <= 10) {
	          _this.timeOffsets.push(timeOffset);
	        } else {
	          _this.timeOffsets[_this.serverTimeRequests % 10] = timeOffset;
	        }

	        _this.avgTimeOffset = _this.timeOffsets.reduce(function (acc, offset) {
	          return acc += offset;
	        }, 0) / _this.timeOffsets.length;

	        if (_this.serverTimeRequests > 10) {
	          setTimeout(function () {
	            return _this.updateTimeOffset();
	          }, 5 * 60 * 1000); // Sync clock every 5 minutes.
	        } else {
	          _this.updateTimeOffset();
	        }
	      });
	    }
	  }, {
	    key: 'connect',
	    value: function connect() {
	      var _this2 = this;

	      Promise.all([this.updateTimeOffset(), new Promise(function (resolve, reject) {
	        _this2.easyrtc.connect(_this2.app, resolve, reject);
	      })]).then(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2),
	            _ = _ref2[0],
	            clientId = _ref2[1];

	        _this2.connectSuccess(clientId);
	      }).catch(this.connectFailure);
	    }
	  }, {
	    key: 'shouldStartConnectionTo',
	    value: function shouldStartConnectionTo(clientId) {
	      return true;
	    }
	  }, {
	    key: 'startStreamConnection',
	    value: function startStreamConnection(clientId) {
	      this.connectedClients.push(clientId);
	      this.openListener(clientId);
	    }
	  }, {
	    key: 'closeStreamConnection',
	    value: function closeStreamConnection(clientId) {
	      var index = this.connectedClients.indexOf(clientId);
	      if (index > -1) {
	        this.connectedClients.splice(index, 1);
	      }
	      this.closedListener(clientId);
	    }
	  }, {
	    key: 'sendData',
	    value: function sendData(clientId, dataType, data) {
	      this.easyrtc.sendDataWS(clientId, dataType, data);
	    }
	  }, {
	    key: 'sendDataGuaranteed',
	    value: function sendDataGuaranteed(clientId, dataType, data) {
	      this.sendData(clientId, dataType, data);
	    }
	  }, {
	    key: 'broadcastData',
	    value: function broadcastData(dataType, data) {
	      var destination = { targetRoom: this.room };
	      this.easyrtc.sendDataWS(destination, dataType, data);
	    }
	  }, {
	    key: 'broadcastDataGuaranteed',
	    value: function broadcastDataGuaranteed(dataType, data) {
	      this.broadcastData(dataType, data);
	    }
	  }, {
	    key: 'getConnectStatus',
	    value: function getConnectStatus(clientId) {
	      var connected = this.connectedClients.indexOf(clientId) != -1;

	      if (connected) {
	        return NAF.adapters.IS_CONNECTED;
	      } else {
	        return NAF.adapters.NOT_CONNECTED;
	      }
	    }
	  }, {
	    key: 'getServerTime',
	    value: function getServerTime() {
	      return Date.now() + this.avgTimeOffset;
	    }
	  }, {
	    key: 'disconnect',
	    value: function disconnect() {
	      this.easyrtc.disconnect();
	    }
	  }]);

	  return WsEasyRtcInterface;
	}();

	module.exports = WsEasyRtcInterface;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EasyRtcAdapter = function () {
	  function EasyRtcAdapter(easyrtc) {
	    _classCallCheck(this, EasyRtcAdapter);

	    this.easyrtc = easyrtc || window.easyrtc;
	    this.app = "default";
	    this.room = "default";

	    this.audioStreams = {};
	    this.pendingAudioRequest = {};

	    this.serverTimeRequests = 0;
	    this.timeOffsets = [];
	    this.avgTimeOffset = 0;
	  }

	  _createClass(EasyRtcAdapter, [{
	    key: "setServerUrl",
	    value: function setServerUrl(url) {
	      this.easyrtc.setSocketUrl(url);
	    }
	  }, {
	    key: "setApp",
	    value: function setApp(appName) {
	      this.app = appName;
	    }
	  }, {
	    key: "setRoom",
	    value: function setRoom(roomName) {
	      this.room = roomName;
	      this.easyrtc.joinRoom(roomName, null);
	    }

	    // options: { datachannel: bool, audio: bool }

	  }, {
	    key: "setWebRtcOptions",
	    value: function setWebRtcOptions(options) {
	      // this.easyrtc.enableDebug(true);
	      this.easyrtc.enableDataChannels(options.datachannel);

	      this.easyrtc.enableVideo(false);
	      this.easyrtc.enableAudio(options.audio);

	      this.easyrtc.enableVideoReceive(false);
	      this.easyrtc.enableAudioReceive(options.audio);
	    }
	  }, {
	    key: "setServerConnectListeners",
	    value: function setServerConnectListeners(successListener, failureListener) {
	      this.connectSuccess = successListener;
	      this.connectFailure = failureListener;
	    }
	  }, {
	    key: "setRoomOccupantListener",
	    value: function setRoomOccupantListener(occupantListener) {
	      this.easyrtc.setRoomOccupantListener(function (roomName, occupants, primary) {
	        occupantListener(occupants);
	      });
	    }
	  }, {
	    key: "setDataChannelListeners",
	    value: function setDataChannelListeners(openListener, closedListener, messageListener) {
	      this.easyrtc.setDataChannelOpenListener(openListener);
	      this.easyrtc.setDataChannelCloseListener(closedListener);
	      this.easyrtc.setPeerListener(messageListener);
	    }
	  }, {
	    key: "updateTimeOffset",
	    value: function updateTimeOffset() {
	      var _this = this;

	      var clientSentTime = Date.now() + this.avgTimeOffset;

	      return fetch(document.location.href, { method: "HEAD", cache: "no-cache" }).then(function (res) {
	        var precision = 1000;
	        var serverReceivedTime = new Date(res.headers.get("Date")).getTime() + precision / 2;
	        var clientReceivedTime = Date.now();
	        var serverTime = serverReceivedTime + (clientReceivedTime - clientSentTime) / 2;
	        var timeOffset = serverTime - clientReceivedTime;

	        _this.serverTimeRequests++;

	        if (_this.serverTimeRequests <= 10) {
	          _this.timeOffsets.push(timeOffset);
	        } else {
	          _this.timeOffsets[_this.serverTimeRequests % 10] = timeOffset;
	        }

	        _this.avgTimeOffset = _this.timeOffsets.reduce(function (acc, offset) {
	          return acc += offset;
	        }, 0) / _this.timeOffsets.length;

	        if (_this.serverTimeRequests > 10) {
	          setTimeout(function () {
	            return _this.updateTimeOffset();
	          }, 5 * 60 * 1000); // Sync clock every 5 minutes.
	        } else {
	          _this.updateTimeOffset();
	        }
	      });
	    }
	  }, {
	    key: "connect",
	    value: function connect() {
	      var _this2 = this;

	      Promise.all([this.updateTimeOffset(), new Promise(function (resolve, reject) {
	        if (_this2.easyrtc.audioEnabled) {
	          _this2._connectWithAudio(resolve, reject);
	        } else {
	          _this2.easyrtc.connect(_this2.app, resolve, reject);
	        }
	      })]).then(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2),
	            _ = _ref2[0],
	            clientId = _ref2[1];

	        _this2._storeAudioStream(_this2.easyrtc.myEasyrtcid, _this2.easyrtc.getLocalStream());

	        _this2._myRoomJoinTime = _this2._getRoomJoinTime(clientId);
	        _this2.connectSuccess(clientId);
	      }).catch(this.connectFailure);
	    }
	  }, {
	    key: "shouldStartConnectionTo",
	    value: function shouldStartConnectionTo(client) {
	      return this._myRoomJoinTime <= client.roomJoinTime;
	    }
	  }, {
	    key: "startStreamConnection",
	    value: function startStreamConnection(clientId) {
	      this.easyrtc.call(clientId, function (caller, media) {
	        if (media === "datachannel") {
	          NAF.log.write("Successfully started datachannel to ", caller);
	        }
	      }, function (errorCode, errorText) {
	        console.error(errorCode, errorText);
	      }, function (wasAccepted) {
	        // console.log("was accepted=" + wasAccepted);
	      });
	    }
	  }, {
	    key: "closeStreamConnection",
	    value: function closeStreamConnection(clientId) {
	      // Handled by easyrtc
	    }
	  }, {
	    key: "sendData",
	    value: function sendData(clientId, dataType, data) {
	      // send via webrtc otherwise fallback to websockets
	      this.easyrtc.sendData(clientId, dataType, data);
	    }
	  }, {
	    key: "sendDataGuaranteed",
	    value: function sendDataGuaranteed(clientId, dataType, data) {
	      this.easyrtc.sendDataWS(clientId, dataType, data);
	    }
	  }, {
	    key: "broadcastData",
	    value: function broadcastData(dataType, data) {
	      var roomOccupants = this.easyrtc.getRoomOccupantsAsMap(this.room);

	      // Iterate over the keys of the easyrtc room occupants map.
	      // getRoomOccupantsAsArray uses Object.keys which allocates memory.
	      for (var roomOccupant in roomOccupants) {
	        if (roomOccupants.hasOwnProperty(roomOccupant) && roomOccupant !== this.easyrtc.myEasyrtcid) {
	          // send via webrtc otherwise fallback to websockets
	          this.easyrtc.sendData(roomOccupant, dataType, data);
	        }
	      }
	    }
	  }, {
	    key: "broadcastDataGuaranteed",
	    value: function broadcastDataGuaranteed(dataType, data) {
	      var destination = { targetRoom: this.room };
	      this.easyrtc.sendDataWS(destination, dataType, data);
	    }
	  }, {
	    key: "getConnectStatus",
	    value: function getConnectStatus(clientId) {
	      var status = this.easyrtc.getConnectStatus(clientId);

	      if (status == this.easyrtc.IS_CONNECTED) {
	        return NAF.adapters.IS_CONNECTED;
	      } else if (status == this.easyrtc.NOT_CONNECTED) {
	        return NAF.adapters.NOT_CONNECTED;
	      } else {
	        return NAF.adapters.CONNECTING;
	      }
	    }
	  }, {
	    key: "getMediaStream",
	    value: function getMediaStream(clientId) {
	      console.log('getMediaStream', clientId);
	      var that = this;
	      if (this.audioStreams[clientId]) {
	        NAF.log.write("Already had audio for " + clientId);
	        return Promise.resolve(this.audioStreams[clientId]);
	      } else {
	        NAF.log.write("Waiting on audio for " + clientId);
	        return new Promise(function (resolve) {
	          that.pendingAudioRequest[clientId] = resolve;
	        });
	      }
	    }
	  }, {
	    key: "disconnect",
	    value: function disconnect() {
	      this.easyrtc.disconnect();
	    }

	    /**
	     * Privates
	     */

	  }, {
	    key: "_storeAudioStream",
	    value: function _storeAudioStream(easyrtcid, stream) {
	      this.audioStreams[easyrtcid] = stream;
	      if (this.pendingAudioRequest[easyrtcid]) {
	        NAF.log.write("got pending audio for " + easyrtcid);
	        this.pendingAudioRequest[easyrtcid](stream);
	        delete this.pendingAudioRequest[easyrtcid](stream);
	      }
	    }
	  }, {
	    key: "_connectWithAudio",
	    value: function _connectWithAudio(connectSuccess, connectFailure) {
	      var that = this;

	      this.easyrtc.setStreamAcceptor(this._storeAudioStream.bind(this));

	      this.easyrtc.setOnStreamClosed(function (easyrtcid) {
	        delete that.audioStreams[easyrtcid];
	      });

	      this.easyrtc.initMediaSource(function () {
	        that.easyrtc.connect(that.app, connectSuccess, connectFailure);
	      }, function (errorCode, errmesg) {
	        console.error(errorCode, errmesg);
	      });
	    }
	  }, {
	    key: "_getRoomJoinTime",
	    value: function _getRoomJoinTime(clientId) {
	      var myRoomId = NAF.room;
	      var joinTime = easyrtc.getRoomOccupantsAsMap(myRoomId)[clientId].roomJoinTime;
	      return joinTime;
	    }
	  }, {
	    key: "getServerTime",
	    value: function getServerTime() {
	      return Date.now() + this.avgTimeOffset;
	    }
	  }]);

	  return EasyRtcAdapter;
	}();

	module.exports = EasyRtcAdapter;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var naf = __webpack_require__(3);

	AFRAME.registerComponent('networked-scene', {
	  schema: {
	    serverURL: { default: '/' },
	    app: { default: 'default' },
	    room: { default: 'default' },
	    connectOnLoad: { default: true },
	    onConnect: { default: 'onConnect' },
	    adapter: { default: 'wsEasyRtc' }, // See https://github.com/networked-aframe/networked-aframe#adapters for list of adapters
	    audio: { default: false }, // Only if adapter supports audio
	    debug: { default: false }
	  },

	  init: function init() {
	    var el = this.el;
	    this.connect = this.connect.bind(this);
	    el.addEventListener('connect', this.connect);
	    if (this.data.connectOnLoad) {
	      el.emit('connect', null, false);
	    }
	  },

	  /**
	   * Connect to signalling server and begin connecting to other clients
	   */
	  connect: function connect() {
	    NAF.log.setDebug(this.data.debug);
	    NAF.log.write('Networked-Aframe Connecting...');

	    this.checkDeprecatedProperties();
	    this.setupNetworkAdapter();

	    if (this.hasOnConnectFunction()) {
	      this.callOnConnect();
	    }
	    NAF.connection.connect(this.data.serverURL, this.data.app, this.data.room, this.data.audio);
	  },

	  checkDeprecatedProperties: function checkDeprecatedProperties() {
	    // No current
	  },

	  setupNetworkAdapter: function setupNetworkAdapter() {
	    var adapterName = this.data.adapter;
	    var adapter = NAF.adapters.make(adapterName);
	    NAF.connection.setNetworkAdapter(adapter);
	  },

	  hasOnConnectFunction: function hasOnConnectFunction() {
	    return this.data.onConnect != '' && window.hasOwnProperty(this.data.onConnect);
	  },

	  callOnConnect: function callOnConnect() {
	    NAF.connection.onConnect(window[this.data.onConnect]);
	  },

	  remove: function remove() {
	    NAF.log.write('networked-scene disconnected');
	    this.el.removeEventListener('connect', this.connect);
	    NAF.connection.disconnect();
	  }
	});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var naf = __webpack_require__(3);
	var componentHelper = __webpack_require__(16);
	var Compressor = __webpack_require__(20);
	var bind = AFRAME.utils.bind;

	AFRAME.registerComponent('networked', {
	  schema: {
	    template: { default: '' },
	    attachLocalTemplate: { default: true },

	    networkId: { default: '' },
	    owner: { default: '' }
	  },

	  init: function init() {
	    var wasCreatedByNetwork = this.wasCreatedByNetwork();

	    this.onConnected = bind(this.onConnected, this);
	    this.onSyncAll = bind(this.onSyncAll, this);
	    this.syncDirty = bind(this.syncDirty, this);
	    this.networkUpdateHandler = bind(this.networkUpdateHandler, this);

	    this.cachedData = {};
	    this.initNetworkParent();

	    if (this.data.networkId === '') {
	      this.el.setAttribute(this.name, { networkId: NAF.utils.createNetworkId() });
	    }

	    if (wasCreatedByNetwork) {
	      this.firstUpdate();
	      this.attachLerp();
	    } else {
	      if (this.data.attachLocalTemplate) {
	        this.attachLocalTemplate();
	      }

	      this.registerEntity(this.data.networkId);
	    }

	    this.lastOwnerTime = -1;

	    if (NAF.clientId) {
	      this.onConnected();
	    } else {
	      document.body.addEventListener('connected', this.onConnected, false);
	    }

	    document.body.dispatchEvent(this.entityCreatedEvent());
	    this.el.dispatchEvent(new CustomEvent('instantiated', { detail: { el: this.el } }));
	  },

	  attachLocalTemplate: function attachLocalTemplate() {
	    var template = document.querySelector(this.data.template);
	    var clone = document.importNode(template.content, true);
	    var el = clone.firstElementChild;
	    var elAttrs = el.attributes;

	    // Merge root element attributes with this entity
	    for (var i = 0; i < elAttrs.length; i++) {
	      this.el.setAttribute(elAttrs[i].name, elAttrs[i].value);
	    }

	    // Append all child elements
	    for (var i = 0; i < el.children.length; i++) {
	      this.el.appendChild(document.importNode(el.children[i], true));
	    }
	  },

	  takeOwnership: function takeOwnership() {
	    var owner = this.data.owner;
	    var lastOwnerTime = this.lastOwnerTime;
	    var now = NAF.connection.getServerTime();
	    if (owner && !this.isMine() && lastOwnerTime < now) {
	      this.lastOwnerTime = now;
	      this.removeLerp();
	      this.el.setAttribute('networked', { owner: NAF.clientId });
	      this.syncAll();
	      return true;
	    }
	    return false;
	  },

	  wasCreatedByNetwork: function wasCreatedByNetwork() {
	    return !!this.el.firstUpdateData;
	  },

	  initNetworkParent: function initNetworkParent() {
	    var parentEl = this.el.parentElement;
	    if (parentEl.hasOwnProperty('components') && parentEl.components.hasOwnProperty('networked')) {
	      this.parent = parentEl;
	    } else {
	      this.parent = null;
	    }
	  },

	  attachLerp: function attachLerp() {
	    if (NAF.options.useLerp) {
	      this.el.setAttribute('lerp', '');
	    }
	  },

	  removeLerp: function removeLerp() {
	    if (NAF.options.useLerp) {
	      this.el.removeAttribute('lerp');
	    }
	  },

	  registerEntity: function registerEntity(networkId) {
	    NAF.entities.registerEntity(networkId, this.el);
	  },

	  firstUpdate: function firstUpdate() {
	    var entityData = this.el.firstUpdateData;
	    this.networkUpdate(entityData);
	  },

	  onConnected: function onConnected() {
	    if (this.data.owner === '') {
	      this.lastOwnerTime = NAF.connection.getServerTime();
	      this.el.setAttribute(this.name, { owner: NAF.clientId });
	      this.syncAll();
	    }

	    document.body.removeEventListener('connected', this.onConnected, false);
	  },

	  isMine: function isMine() {
	    return this.data.owner === NAF.clientId;
	  },

	  play: function play() {
	    this.bindEvents();
	  },

	  bindEvents: function bindEvents() {
	    var el = this.el;
	    el.addEventListener('sync', this.syncDirty);
	    el.addEventListener('syncAll', this.onSyncAll);
	    el.addEventListener('networkUpdate', this.networkUpdateHandler);
	  },

	  pause: function pause() {
	    this.unbindEvents();
	  },

	  unbindEvents: function unbindEvents() {
	    var el = this.el;
	    el.removeEventListener('sync', this.syncDirty);
	    el.removeEventListener('syncAll', this.onSyncAll);
	    el.removeEventListener('networkUpdate', this.networkUpdateHandler);
	  },

	  tick: function tick() {
	    if (this.isMine() && this.needsToSync()) {
	      this.syncDirty();
	    }
	  },

	  onSyncAll: function onSyncAll(e) {
	    var targetClientId = e.detail.targetClientId;

	    this.syncAll(targetClientId);
	  },

	  /* Sending updates */

	  syncAll: function syncAll(targetClientId) {
	    if (!this.canSync()) {
	      return;
	    }
	    this.updateNextSyncTime();
	    var syncedComps = this.getAllSyncedComponents();
	    var components = componentHelper.gatherComponentsData(this.el, syncedComps);
	    var syncData = this.createSyncData(components);
	    // console.error('syncAll', syncData, NAF.clientId);
	    if (targetClientId) {
	      NAF.connection.sendDataGuaranteed(targetClientId, 'u', syncData);
	    } else {
	      NAF.connection.broadcastDataGuaranteed('u', syncData);
	    }
	    this.updateCache(components);
	  },

	  syncDirty: function syncDirty() {
	    if (!this.canSync()) {
	      return;
	    }
	    this.updateNextSyncTime();
	    var syncedComps = this.getAllSyncedComponents();
	    var dirtyComps = componentHelper.findDirtyComponents(this.el, syncedComps, this.cachedData);
	    if (dirtyComps.length == 0) {
	      return;
	    }
	    var components = componentHelper.gatherComponentsData(this.el, dirtyComps);
	    var syncData = this.createSyncData(components);
	    if (NAF.options.compressSyncPackets) {
	      syncData = Compressor.compressSyncData(syncData, syncedComps);
	    }
	    NAF.connection.broadcastData('u', syncData);
	    // console.error('syncDirty', syncData, NAF.clientId);
	    this.updateCache(components);
	  },

	  canSync: function canSync() {
	    return this.data.owner && this.isMine();
	  },

	  needsToSync: function needsToSync() {
	    return NAF.utils.now() >= this.nextSyncTime;
	  },

	  updateNextSyncTime: function updateNextSyncTime() {
	    this.nextSyncTime = NAF.utils.now() + 1000 / NAF.options.updateRate;
	  },

	  createSyncData: function createSyncData(components) {
	    var data = this.data;
	    var sync = {
	      0: 0, // 0 for not compressed
	      networkId: data.networkId,
	      owner: data.owner,
	      lastOwnerTime: this.lastOwnerTime,
	      template: data.template,
	      parent: this.getParentId(),
	      components: components
	    };
	    return sync;
	  },

	  getParentId: function getParentId() {
	    this.initNetworkParent(); // TODO fix calling this each network tick
	    if (!this.parent) {
	      return null;
	    }
	    var netComp = this.parent.getAttribute('networked');
	    return netComp.networkId;
	  },

	  getAllSyncedComponents: function getAllSyncedComponents() {
	    return NAF.schemas.getComponents(this.data.template);
	  },

	  updateCache: function updateCache(components) {
	    for (var name in components) {
	      this.cachedData[name] = components[name];
	    }
	  },

	  /* Receiving updates */

	  networkUpdateHandler: function networkUpdateHandler(received) {
	    var entityData = received.detail.entityData;
	    this.networkUpdate(entityData);
	  },

	  networkUpdate: function networkUpdate(entityData) {
	    if (entityData[0] == 1) {
	      entityData = Compressor.decompressSyncData(entityData, this.getAllSyncedComponents());
	    }

	    // Avoid updating components if the entity data received did not come from the current owner.
	    if (entityData.lastOwnerTime < this.lastOwnerTime || this.lastOwnerTime === entityData.lastOwnerTime && this.data.owner > entityData.owner) {
	      return;
	    }

	    if (this.data.owner !== entityData.owner) {
	      this.lastOwnerTime = entityData.lastOwnerTime;
	      this.attachLerp();
	      this.el.setAttribute('networked', { owner: entityData.owner });
	    }

	    this.updateComponents(entityData.components);
	  },

	  updateComponents: function updateComponents(components) {
	    var el = this.el;

	    for (var key in components) {
	      if (this.isSyncableComponent(key)) {
	        var data = components[key];
	        if (NAF.utils.isChildSchemaKey(key)) {
	          var schema = NAF.utils.keyToChildSchema(key);
	          var childEl = schema.selector ? el.querySelector(schema.selector) : el;
	          if (childEl) {
	            // Is false when first called in init
	            if (schema.property) {
	              childEl.setAttribute(schema.component, schema.property, data);
	            } else {
	              childEl.setAttribute(schema.component, data);
	            }
	          }
	        } else {
	          el.setAttribute(key, data);
	        }
	      }
	    }
	  },

	  isSyncableComponent: function isSyncableComponent(key) {
	    if (NAF.utils.isChildSchemaKey(key)) {
	      var schema = NAF.utils.keyToChildSchema(key);
	      return this.hasThisChildSchema(schema);
	    } else {
	      return this.getAllSyncedComponents().indexOf(key) != -1;
	    }
	  },

	  hasThisChildSchema: function hasThisChildSchema(schema) {
	    var schemaComponents = this.getAllSyncedComponents();
	    for (var i in schemaComponents) {
	      var localChildSchema = schemaComponents[i];
	      if (NAF.utils.childSchemaEqual(localChildSchema, schema)) {
	        return true;
	      }
	    }
	    return false;
	  },

	  remove: function remove() {
	    if (this.isMine() && NAF.connection.isConnected()) {
	      var syncData = { networkId: this.data.networkId };
	      NAF.connection.broadcastDataGuaranteed('r', syncData);
	    }
	    document.body.dispatchEvent(this.entityRemovedEvent(this.data.networkId));
	  },

	  entityCreatedEvent: function entityCreatedEvent() {
	    return new CustomEvent('entityCreated', { detail: { el: this.el } });
	  },
	  entityRemovedEvent: function entityRemovedEvent(networkId) {
	    return new CustomEvent('entityRemoved', { detail: { networkId: networkId } });
	  }
	});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var deepEqual = __webpack_require__(17);

	module.exports.gatherComponentsData = function (el, schemaComponents) {
	  var elComponents = el.components;
	  var compsData = {};

	  for (var i in schemaComponents) {
	    var element = schemaComponents[i];

	    if (typeof element === 'string') {
	      if (elComponents.hasOwnProperty(element)) {
	        var name = element;
	        var elComponent = elComponents[name];
	        compsData[name] = AFRAME.utils.clone(elComponent.data);
	      }
	    } else {
	      var childKey = NAF.utils.childSchemaToKey(element);
	      var child = element.selector ? el.querySelector(element.selector) : el;
	      if (child) {
	        var comp = child.components[element.component];
	        if (comp) {
	          var data = element.property ? comp.data[element.property] : comp.data;
	          compsData[childKey] = AFRAME.utils.clone(data);
	        } else {
	          // NAF.log.write('ComponentHelper.gatherComponentsData: Could not find component ' + element.component + ' on child ', child, child.components);
	        }
	      }
	    }
	  }
	  return compsData;
	};

	module.exports.findDirtyComponents = function (el, syncedComps, cachedData) {
	  var newComps = el.components;
	  var dirtyComps = [];

	  for (var i in syncedComps) {
	    var schema = syncedComps[i];
	    var compKey;
	    var newCompData;

	    var isRoot = typeof schema === 'string';
	    if (isRoot) {
	      var hasComponent = newComps.hasOwnProperty(schema);
	      if (!hasComponent) {
	        continue;
	      }
	      compKey = schema;
	      newCompData = newComps[schema].data;
	    } else {
	      // is child
	      var selector = schema.selector;
	      var compName = schema.component;
	      var propName = schema.property;
	      var childEl = selector ? el.querySelector(selector) : el;
	      var hasComponent = childEl && childEl.components.hasOwnProperty(compName);
	      if (!hasComponent) {
	        continue;
	      }
	      compKey = NAF.utils.childSchemaToKey(schema);
	      newCompData = childEl.components[compName].data;
	      if (propName) {
	        newCompData = newCompData[propName];
	      }
	    }

	    var compIsCached = cachedData.hasOwnProperty(compKey);
	    if (!compIsCached) {
	      dirtyComps.push(schema);
	      continue;
	    }

	    var oldCompData = cachedData[compKey];
	    if (!deepEqual(oldCompData, newCompData)) {
	      dirtyComps.push(schema);
	    }
	  }
	  return dirtyComps;
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(18);
	var isArguments = __webpack_require__(19);

	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();

	    // 7.3. Other pairs that do not both pass typeof value == 'object',
	    // equivalence is determined by ==.
	  } else if (!actual || !expected || (typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) != 'object' && (typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) != 'object') {
	    return opts.strict ? actual === expected : actual == expected;

	    // 7.4. For all other Object pairs, including Array objects, equivalence is
	    // determined by having the same number of owned properties (as verified
	    // with Object.prototype.hasOwnProperty.call), the same set of keys
	    // (although not necessarily the same order), equivalent values for every
	    // corresponding key, and an identical 'prototype' property. Note: this
	    // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	};

	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}

	function isBuffer(x) {
	  if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}

	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {
	    //happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length) return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i]) return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === (typeof b === 'undefined' ? 'undefined' : _typeof(b));
	}

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	'use strict';

	exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

	exports.shim = shim;
	function shim(obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	}

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var supportsArgumentsClass = function () {
	  return Object.prototype.toString.call(arguments);
	}() == '[object Arguments]';

	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};

	exports.unsupported = unsupported;
	function unsupported(object) {
	  return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
	};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";

	/**
	  Compressed packet structure:
	  [
	    1, // 1 for compressed
	    networkId,
	    ownerId,
	    parent,
	    {
	      0: data, // key maps to index of synced components in network component schema
	      3: data,
	      4: data
	    }
	  ]
	*/
	module.exports.compressSyncData = function (syncData, allComponents) {
	  var compressed = [];
	  compressed.push(1); // 0
	  compressed.push(syncData.networkId); // 1
	  compressed.push(syncData.owner); // 2
	  compressed.push(syncData.parent); // 3
	  compressed.push(syncData.template); // 4

	  var compressedComps = this.compressComponents(syncData.components, allComponents);
	  compressed.push(compressedComps); // 5

	  return compressed;
	};

	module.exports.compressComponents = function (syncComponents, allComponents) {
	  var compressed = {};
	  for (var i = 0; i < allComponents.length; i++) {
	    var name;
	    if (typeof allComponents[i] === 'string') {
	      name = allComponents[i];
	    } else {
	      name = NAF.utils.childSchemaToKey(allComponents[i]);
	    }
	    if (syncComponents.hasOwnProperty(name)) {
	      compressed[i] = syncComponents[name];
	    }
	  }
	  return compressed;
	};

	/**
	  Decompressed packet structure:
	  [
	    0: 0, // 0 for uncompressed
	    networkId: networkId,
	    owner: clientId,
	    parent: parentNetworkId or null,
	    template: template,
	    components: {
	      position: data,
	      scale: data,
	      .head---visible: data
	    },
	  ]
	*/
	module.exports.decompressSyncData = function (compressed, components) {
	  var entityData = {};
	  entityData[0] = 0;
	  entityData.networkId = compressed[1];
	  entityData.owner = compressed[2];
	  entityData.parent = compressed[3];
	  entityData.template = compressed[4];

	  var compressedComps = compressed[5];
	  var components = this.decompressComponents(compressedComps, components);
	  entityData.components = components;

	  return entityData;
	};

	module.exports.decompressComponents = function (compressed, components) {
	  var decompressed = {};
	  for (var i in compressed) {
	    var schemaComp = components[i];

	    var name;
	    if (typeof schemaComp === "string") {
	      name = schemaComp;
	    } else {
	      name = NAF.utils.childSchemaToKey(schemaComp);
	    }
	    decompressed[name] = compressed[i];
	  }
	  return decompressed;
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var naf = __webpack_require__(3);

	// @TODO if aframevr/aframe#3042 gets merged, this should just delegate to the aframe sound component
	AFRAME.registerComponent('networked-audio-source', {
	  schema: {
	    positional: { default: true }
	  },

	  init: function init() {
	    var _this = this;

	    this.listener = null;
	    this.stream = null;

	    this._setMediaStream = this._setMediaStream.bind(this);

	    NAF.utils.getNetworkedEntity(this.el).then(function (networkedEl) {
	      var ownerId = networkedEl.components.networked.data.owner;

	      if (ownerId) {
	        NAF.connection.adapter.getMediaStream(ownerId).then(_this._setMediaStream).catch(function (e) {
	          return naf.log.error('Error getting media stream for ' + ownerId, e);
	        });
	      } else {
	        // Correctly configured local entity, perhaps do something here for enabling debug audio loopback
	      }
	    });
	  },

	  _setMediaStream: function _setMediaStream(newStream) {
	    if (!this.sound) {
	      this.setupSound();
	    }

	    if (newStream != this.stream) {
	      if (this.stream) {
	        this.sound.disconnect();
	      }
	      if (newStream) {
	        // Chrome seems to require a MediaStream be attached to an AudioElement before AudioNodes work correctly
	        this.audioEl = new Audio();
	        this.audioEl.setAttribute("autoplay", "autoplay");
	        this.audioEl.setAttribute("playsinline", "playsinline");
	        this.audioEl.srcObject = newStream;

	        this.sound.setNodeSource(this.sound.context.createMediaStreamSource(newStream));
	      }
	      this.stream = newStream;
	    }
	  },


	  remove: function remove() {
	    if (!this.sound) return;

	    this.el.removeObject3D(this.attrName);
	    if (this.stream) {
	      this.sound.disconnect();
	    }
	  },

	  setupSound: function setupSound() {
	    var el = this.el;
	    var sceneEl = el.sceneEl;

	    if (this.sound) {
	      el.removeObject3D(this.attrName);
	    }

	    if (!sceneEl.audioListener) {
	      sceneEl.audioListener = new THREE.AudioListener();
	      sceneEl.camera && sceneEl.camera.add(sceneEl.audioListener);
	      sceneEl.addEventListener('camera-set-active', function (evt) {
	        evt.detail.cameraEl.getObject3D('camera').add(sceneEl.audioListener);
	      });
	    }
	    this.listener = sceneEl.audioListener;

	    this.sound = this.data.positional ? new THREE.PositionalAudio(this.listener) : new THREE.Audio(this.listener);
	    el.setObject3D(this.attrName, this.sound);
	  }
	});

/***/ })
/******/ ]);
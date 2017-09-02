webpackJsonp([1],{

/***/ "1dLM":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = renderThumbStyle;
const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = BAR_MAP;


function renderThumbStyle({ move, size, bar,barStyle }) {
  const style = {};
  const translate = `translate${bar.axis}(${ move }%)`;

  style[bar.size] = size;
  style.transform = translate;
  style.msTransform = translate;
  style.webkitTransform = translate;
  style.backgroundColor = barStyle.color;
  (bar.size == "height") ? style.width = barStyle.width : style.height = barStyle.width;
  style.opacity = barStyle.barOpacityMin;
  return style;
};


/***/ }),

/***/ "3GYV":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "6LjL":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const isServer = typeof window === 'undefined';

/* istanbul ignore next */
const requestFrame = (function() {
  if (isServer) return;
  const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
    function(fn) {
      return window.setTimeout(fn, 20);
    };
  return function(fn) {
    return raf(fn);
  };
})();

/* istanbul ignore next */
const cancelFrame = (function() {
  if (isServer) return;
  const cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
  return function(id) {
    return cancel(id);
  };
})();

/* istanbul ignore next */
const resetTrigger = function(element) {
  const trigger = element.__resizeTrigger__;
  const expand = trigger.firstElementChild;
  const contract = trigger.lastElementChild;
  const expandChild = expand.firstElementChild;

  contract.scrollLeft = contract.scrollWidth;
  contract.scrollTop = contract.scrollHeight;
  expandChild.style.width = expand.offsetWidth + 1 + 'px';
  expandChild.style.height = expand.offsetHeight + 1 + 'px';
  expand.scrollLeft = expand.scrollWidth;
  expand.scrollTop = expand.scrollHeight;
};

/* istanbul ignore next */
const checkTriggers = function(ele) {
  return ele.offsetWidth !== ele.__resizeLast__.width || ele.offsetHeight !== ele.__resizeLast__.height;
};

/* istanbul ignore next */
const scrollListener = function(event) {
  resetTrigger(this);
  if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
  this.__resizeRAF__ = requestFrame(() => {
    if (checkTriggers(this)) {
      this.__resizeLast__.width = this.offsetWidth;
      this.__resizeLast__.height = this.offsetHeight;
      this.__resizeListeners__.forEach((fn) => {
        fn.call(this, event);
      });
    }
  });
};

/* Detect CSS Animations support to detect ele display/re-attach */
const attachEvent = isServer ? {} : document.attachEvent;
const DOM_PREFIXES = 'Webkit Moz O ms'.split(' ');
const START_EVENTS = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' ');
const RESIZE_ANIMATION_NAME = 'resizeanim';
let animation = false;
let keyFramePrefix = '';
let animationStartEvent = 'animationstart';

/* istanbul ignore next */
if (!attachEvent && !isServer) {
  const testElement = document.createElement('fakeelement');
  if (testElement.style.animationName !== undefined) {
    animation = true;
  }

  if (animation === false) {
    let prefix = '';
    for (var i = 0; i < DOM_PREFIXES.length; i++) {
      if (testElement.style[DOM_PREFIXES[i] + 'AnimationName'] !== undefined) {
        prefix = DOM_PREFIXES[i];
        keyFramePrefix = '-' + prefix.toLowerCase() + '-';
        animationStartEvent = START_EVENTS[i];
        animation = true;
        break;
      }
    }
  }
}

let stylesCreated = false;
/* istanbul ignore next */
const createStyles = function() {
  if (!stylesCreated && !isServer) {
    const animationKeyframes = `@${keyFramePrefix}keyframes ${RESIZE_ANIMATION_NAME} { from { opacity: 0; } to { opacity: 0; } } `;
    const animationStyle = `${keyFramePrefix}animation: 1ms ${RESIZE_ANIMATION_NAME};`;

    // opacity: 0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
    const css = `${animationKeyframes}
      .resize-triggers { ${animationStyle} visibility: hidden; opacity: 0; }
      .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1 }
      .resize-triggers > div { background: #eee; overflow: auto; }
      .contract-trigger:before { width: 200%; height: 200%; }`;

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    stylesCreated = true;
  }
};

/* istanbul ignore next */
const addResizeListener = function(ele, fn) {
  if (isServer) return;
  if (attachEvent) {
    ele.attachEvent('onresize', fn);
  } else {
    if (!ele.__resizeTrigger__) {
      if (getComputedStyle(ele).position === 'static') {
        ele.style.position = 'relative';
      }
      createStyles();
      ele.__resizeLast__ = {};
      ele.__resizeListeners__ = [];

      const resizeTrigger = ele.__resizeTrigger__ = document.createElement('div');
      resizeTrigger.className = 'resize-triggers';
      resizeTrigger.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>';
      ele.appendChild(resizeTrigger);

      resetTrigger(ele);
      ele.addEventListener('scroll', scrollListener, true);

      /* Listen for a css animation to detect ele display/re-attach */
      if (animationStartEvent) {
        resizeTrigger.addEventListener(animationStartEvent, function(event) {
          if (event.animationName === RESIZE_ANIMATION_NAME) {
            resetTrigger(ele);
          }
        });
      }
    }
    ele.__resizeListeners__.push(fn);
  }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = addResizeListener;


/* istanbul ignore next */
const removeResizeListener = function(ele, fn) {
  if (attachEvent) {
    ele.detachEvent('onresize', fn);
  } else {
    ele.__resizeListeners__.splice(ele.__resizeListeners__.indexOf(fn), 1);
    if (!ele.__resizeListeners__.length) {
      ele.removeEventListener('scroll', scrollListener);
      ele.__resizeTrigger__ = !ele.removeChild(ele.__resizeTrigger__);
    }
  }
};
/* harmony export (immutable) */ __webpack_exports__["b"] = removeResizeListener;



/***/ }),

/***/ "7Otq":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/logo.578cfbe.png";

/***/ }),

/***/ "FUWz":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      activeNames: "",
      option: [{ label: "EasyScroll" }],
      dialogVisible: false,
      barOption: {
        barColor: "red"
      },
      colorSizeOption: {
        barColor: "red",
        barWidth: 10
      }
    };
  },

  computed: {
    simpleApp: function simpleApp() {
      return "<el-row style=\"padding:16px 16px;\">\n" + "                      <el-col :span=\"24\">\n" + "                        <EasyScrollbar>\n" + "                          <div  id=\"wrapper\" style=\"height: 300px;\">\n" + "                            <div style=\"height: 500px;background-color: greenyellow;text-align: center;\">\n" + "                              最简单的应用\n" + "                            </div>\n" + "                          </div>\n" + "                        </EasyScrollbar>\n" + "                      </el-col>\n" + "                    </el-row>";
    },
    desBarOption: function desBarOption() {
      return " opt:{\n" + "        barColor:\"#959595\",   //滚动条颜色\n" + "        barWidth:6,           //滚动条宽度\n" + "        railColor:\"#eee\",     //导轨颜色\n" + "        barMarginRight:0,     //垂直滚动条距离整个容器右侧距离单位（px）\n" + "        barMaginBottom:0,     //水平滚动条距离底部距离单位（px)\n" + "        barOpacityMin:0.3,      //滚动条非激活状态下的透明度\n" + "        zIndex:\"auto\",        //滚动条z-Index\n" + "        autohidemode:true,     //自动隐藏模式\n" + "        horizrailenabled:true,//是否显示水平滚动条\n" + "      }";
    },
    desBarOptionExa: function desBarOptionExa() {
      return "<EasyScrollbar :barOption=\"myBarOption\">\n" + "                     <div>\n" + "                       <div>\n" + "                         内容\n" + "                       </div>\n" + "                     </div>\n" + "                  </EasyScrollbar>\n" + "                  <script>\n" + "                     data{\n" + "                       return{\n" + "                         data(){\n" + "                           myBarOption:{\n" + "                             barColor:\"red\"\n" + "                           }\n" + "                         }\n" + "                       }\n" + "                     }\n" + "                  <\/script>";
    },
    colorSizeOptionDesc: function colorSizeOptionDesc() {
      return "colorSizeOption:{\n" + "          barColor:\"red\",\n" + "          barWidth:10\n" + "        }";
    },
    colorSizeOptionXml: function colorSizeOptionXml() {
      return " <el-row style=\"padding:16px 16px;\">\n" + "                  <el-col :span=\"24\">\n" + "                    <EasyScrollbar :barOption=\"colorSizeOption\">\n" + "                      <div id=\"wrapper\" style=\"height: 300px;\">\n" + "                        <div style=\"height: 500px;background-color: greenyellow;text-align: center;\">\n" + "                          改变颜色和尺寸\n" + "                        </div>\n" + "                      </div>\n" + "                    </EasyScrollbar>\n" + "                  </el-col>\n" + "                </el-row>";
    }
  },
  mounted: function mounted() {
    var bodyHei = document.documentElement.clientHeight;
    this.$refs.root.style.height = bodyHei;
    debugger;
  },
  methods: {
    addOption: function addOption() {
      this._data.option.push({ label: "EasyScroll" });
      this._data.option.push({ label: "EasyScroll" });
      this._data.option.push({ label: "EasyScroll" });
      this._data.option.push({ label: "EasyScroll" });
      this._data.option.push({ label: "EasyScroll" });
    }
  }
});

/***/ }),

/***/ "IOJX":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_main__ = __webpack_require__("o92L");


/* istanbul ignore next */
__WEBPACK_IMPORTED_MODULE_0__src_main__["a" /* default */].install = function(Vue) {
  Vue.component(__WEBPACK_IMPORTED_MODULE_0__src_main__["a" /* default */].name, __WEBPACK_IMPORTED_MODULE_0__src_main__["a" /* default */]);
};

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__src_main__["a" /* default */]);


/***/ }),

/***/ "M93x":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__("h8+N");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_50df39e4_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__("ws60");
function injectStyle (ssrContext) {
  __webpack_require__("3GYV")
}
var normalizeComponent = __webpack_require__("J0+h")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_50df39e4_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "Mp0L":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "NHnr":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("7+uW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App__ = __webpack_require__("M93x");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router__ = __webpack_require__("YaEn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_element_ui__ = __webpack_require__("zL8q");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_element_ui___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_element_ui__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_element_ui_lib_theme_default_index_css__ = __webpack_require__("q8zI");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_element_ui_lib_theme_default_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_element_ui_lib_theme_default_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scrollbar__ = __webpack_require__("IOJX");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__assets_styles_shCore_css__ = __webpack_require__("puaG");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__assets_styles_shCore_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__assets_styles_shCore_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__assets_styles_shThemeDefault_css__ = __webpack_require__("Mp0L");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__assets_styles_shThemeDefault_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__assets_styles_shThemeDefault_css__);










__WEBPACK_IMPORTED_MODULE_0_vue__["default"].config.productionTip = false;
__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_3_element_ui___default.a);
__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_5__scrollbar__["a" /* default */]);

new __WEBPACK_IMPORTED_MODULE_0_vue__["default"]({
  el: '#app',
  router: __WEBPACK_IMPORTED_MODULE_2__router__["a" /* default */],
  template: '<App/>',
  components: { App: __WEBPACK_IMPORTED_MODULE_1__App__["a" /* default */] }
});

/***/ }),

/***/ "USq8":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "root",
    staticStyle: {
      "height": "90%"
    }
  }, [_c('EasyScrollbar', [_c('div', {
    staticStyle: {
      "width": "100%",
      "height": "100%"
    }
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__("7Otq")
    }
  }), _vm._v(" "), _c('el-row', {
    staticStyle: {
      "padding": "16px",
      "text-align": "left"
    }
  }, [_c('el-collapse', {
    model: {
      value: (_vm.activeNames),
      callback: function($$v) {
        _vm.activeNames = $$v
      },
      expression: "activeNames"
    }
  }, [_c('el-collapse-item', {
    attrs: {
      "title": "安装",
      "name": "1"
    }
  }, [_c('div', [_vm._v("运行：")]), _vm._v(" "), _c('div', {
    staticClass: "code-back"
  }, [_vm._v("npm isntall --save easyscroll")]), _vm._v(" "), _c('div', [_vm._v("使用：")]), _vm._v(" "), _c('div', {
    staticClass: "code-back"
  }, [_vm._v("import EasyScroll from 'easyscroll';")]), _vm._v(" "), _c('div', {
    staticClass: "code-back"
  }, [_vm._v("Vue.use(EasyScroll);")])]), _vm._v(" "), _c('el-collapse-item', {
    attrs: {
      "title": "简单的应用",
      "name": "2"
    }
  }, [_c('el-row', {
    staticStyle: {
      "padding": "16px 16px"
    }
  }, [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('EasyScrollbar', [_c('div', {
    staticStyle: {
      "height": "300px"
    },
    attrs: {
      "id": "wrapper"
    }
  }, [_c('div', {
    staticStyle: {
      "height": "500px",
      "background-color": "greenyellow",
      "text-align": "center"
    }
  }, [_vm._v("\n                        最简单的应用\n                      ")])])])], 1)], 1), _vm._v(" "), _c('el-row', [_vm._v("代码：")]), _vm._v(" "), _c('el-row', [_c('pre', {
    staticClass: "brush: xml;"
  }, [_vm._v("                  " + _vm._s(_vm.simpleApp) + "\n                ")])]), _vm._v(" "), _c('el-row', [_c('div', [_vm._v("说明：")]), _vm._v(" "), _c('div', [_vm._v("安装完easyscroll之后，在组件中直接引用EasyScrollbar组件就行，产生滚动条的内容作为EasyScroll的$slot插入到滚动条组件中，注意插入到滚动条组件中内容\n                需要一个外层的包裹，即上面代码中的#wrapper div，其内部才是真正动态的内容。")])])], 1), _vm._v(" "), _c('el-collapse-item', {
    attrs: {
      "title": "配置参数",
      "name": "3"
    }
  }, [_c('div', [_vm._v("滚动条的主要参数：")]), _vm._v(" "), _c('pre', {
    staticClass: "brush: js;"
  }, [_vm._v("                  " + _vm._s(_vm.desBarOption) + "\n              ")]), _vm._v(" "), _c('div', [_vm._v("使用：")]), _vm._v(" "), _c('pre', {
    staticClass: "brush: js;"
  }, [_vm._v("                  " + _vm._s(_vm.desBarOptionExa) + "\n              ")])]), _vm._v(" "), _c('el-collapse-item', {
    attrs: {
      "title": "改变滚动条颜色尺寸",
      "name": "4"
    }
  }, [_c('el-row', {
    staticStyle: {
      "padding": "16px 16px"
    }
  }, [_c('el-col', {
    attrs: {
      "span": 24
    }
  }, [_c('EasyScrollbar', {
    attrs: {
      "barOption": _vm.colorSizeOption
    }
  }, [_c('div', {
    staticStyle: {
      "height": "300px"
    },
    attrs: {
      "id": "wrapper"
    }
  }, [_c('div', {
    staticStyle: {
      "height": "500px",
      "background-color": "greenyellow",
      "text-align": "center"
    }
  }, [_vm._v("\n                        改变颜色和尺寸\n                      ")])])])], 1)], 1), _vm._v(" "), _c('el-row', [_vm._v("代码：")]), _vm._v(" "), _c('el-row', [_c('pre', {
    staticClass: "brush: js;"
  }, [_vm._v("                  " + _vm._s(_vm.colorSizeOptionXml) + "\n\n                    参数：\n                  " + _vm._s(_vm.colorSizeOptionDesc) + "\n                ")])]), _vm._v(" "), _c('el-row', [_c('div', [_vm._v("说明：")]), _vm._v(" "), _c('div', [_vm._v("安装完easyscroll之后，在组件中直接引用EasyScrollbar组件就行，产生滚动条的内容作为EasyScroll的$slot插入到滚动条组件中，注意插入到滚动条组件中内容\n                  需要一个外层的包裹，即上面代码中的#wrapper div，其内部才是真正动态的内容。")])])], 1), _vm._v(" "), _c('el-collapse-item', {
    attrs: {
      "title": "内容大小可变动下效果",
      "name": "5"
    }
  }, [_c('el-button', {
    attrs: {
      "type": "text"
    },
    on: {
      "click": function($event) {
        _vm.dialogVisible = true
      }
    }
  }, [_vm._v("点击打开饿了么Dialog")]), _vm._v(" "), _c('el-dialog', {
    attrs: {
      "title": "提示",
      "visible": _vm.dialogVisible,
      "size": "tiny"
    },
    on: {
      "update:visible": function($event) {
        _vm.dialogVisible = $event
      }
    }
  }, [_c('el-row', {
    staticStyle: {
      "border-top": "1px solid",
      "border-bottom": "1px solid"
    }
  }, [_c('EasyScrollbar', [_c('div', {
    staticStyle: {
      "max-height": "200px"
    }
  }, _vm._l((_vm.option), function(item) {
    return _c('div', {
      key: item.label
    }, [_vm._v(_vm._s(item.label))])
  }))])], 1), _vm._v(" "), _c('span', {
    staticClass: "dialog-footer",
    slot: "footer"
  }, [_c('el-button', {
    on: {
      "click": function($event) {
        _vm.dialogVisible = false
      }
    }
  }, [_vm._v("取 消")]), _vm._v(" "), _c('el-button', {
    attrs: {
      "type": "primary"
    },
    on: {
      "click": _vm.addOption
    }
  }, [_vm._v("增加内容")])], 1)], 1)], 1)], 1)], 1)], 1)])], 1)
}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "WPAR":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "YaEn":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("7+uW");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__("/ocq");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_EasyScroll__ = __webpack_require__("bdwh");



__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]({
  routes: [{
    path: '/',
    name: 'EasyScroll',
    component: __WEBPACK_IMPORTED_MODULE_2__components_EasyScroll__["a" /* default */]
  }]
}));

/***/ }),

/***/ "bdwh":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_EasyScroll_vue__ = __webpack_require__("FUWz");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_a25b846a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_EasyScroll_vue__ = __webpack_require__("USq8");
function injectStyle (ssrContext) {
  __webpack_require__("WPAR")
}
var normalizeComponent = __webpack_require__("J0+h")
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_EasyScroll_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_0_4_vue_loader_lib_template_compiler_index_id_data_v_a25b846a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_template_index_0_EasyScroll_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "c2XT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("7+uW");

/*
* 用于判断当前浏览器的滚动条默认宽度，决定wrap的位置
* */
let scrollBarWidth;

/* harmony default export */ __webpack_exports__["a"] = (function() {
  if (__WEBPACK_IMPORTED_MODULE_0_vue__["default"].prototype.$isServer) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement('div');
  outer.overflow = 'scroll';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
});;


/***/ }),

/***/ "h8+N":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'app'
});

/***/ }),

/***/ "jH3o":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_resize_event__ = __webpack_require__("6LjL");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_dom__ = __webpack_require__("smZb");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_scrollbar_width__ = __webpack_require__("c2XT");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bar__ = __webpack_require__("mvHG");







/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'EasyScrollbar',
  components: { Bar: __WEBPACK_IMPORTED_MODULE_3__bar__["a" /* default */] },
  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean,
    tag: {
      type: String,
      default: 'div'
    },
    barOption: {}
  },
  created: function created() {
    this._data.opt = Object.assign(this._data.opt, this.barOption);
  },
  data: function data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0,
      preScrollHeigt: 0,
      opt: {
        barColor: "#959595",
        barWidth: 6,
        railColor: "#eee",
        barMarginRight: 0,
        barMaginBottom: 0,
        barOpacityMin: 0.3,
        zIndex: "auto",
        autohidemode: true,
        horizrailenabled: true }
    };
  },


  computed: {
    wrap: function wrap() {
      return this.$refs.wrap;
    }
  },
  render: function render(h) {
    var gutter = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_scrollbar_width__["a" /* default */])();
    var style = this.wrapStyle;
    var barStyle = { color: this.opt.barColor, width: this.opt.barWidth + "px", barOpacityMin: this.opt.barOpacityMin };
    var railStyle = { zIndex: this.opt.zIndex, color: this.opt.railColor, marginRight: this.opt.barMarginRight + "px", marginBottom: this.opt.barMaginBottom + "px" };
    if (gutter) {
      var gutterWith = "-" + gutter + "px";
      var gutterStyle = "margin-bottom:" + gutterWith + ";" + " margin-right:" + gutterWith;

      if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    var view = h(this.tag, {
      class: ['el-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default);
    var wrap = h(
      'div',
      {
        ref: 'wrap',
        style: style,
        on: {
          'scroll': this.handleScroll,
          'mouseenter': this.handleMouseEnter,
          'mouseleave': this.handleMouseLeave
        },

        'class': [this.wrapClass, 'easy-scrollbar__wrap', gutter ? '' : 'easy-scrollbar__wrap--hidden-default'] },
      [[view]]
    );
    var nodes = void 0;

    if (!this.native) {
      if (this.opt.horizrailenabled == true) {
        nodes = [wrap, h(
          __WEBPACK_IMPORTED_MODULE_3__bar__["a" /* default */],
          {
            ref: 'refHBar',
            attrs: { barStyle: barStyle,
              railStyle: railStyle,
              move: this.moveX,
              size: this.sizeWidth }
          },
          []
        ), h(
          __WEBPACK_IMPORTED_MODULE_3__bar__["a" /* default */],
          {
            ref: 'refVBar',
            attrs: { vertical: true,
              barStyle: barStyle,
              railStyle: railStyle,
              move: this.moveY,
              size: this.sizeHeight }
          },
          []
        )];
      } else {
        nodes = [wrap, h(
          __WEBPACK_IMPORTED_MODULE_3__bar__["a" /* default */],
          {
            ref: 'refVBar',
            attrs: { vertical: true,
              barStyle: barStyle,
              railStyle: railStyle,
              move: this.moveY,
              size: this.sizeHeight }
          },
          []
        )];
      }
    } else {
      nodes = [h(
        'div',
        {
          ref: 'wrap',
          'class': [this.wrapClass, 'easy-scrollbar__wrap'],
          style: style },
        [[view]]
      )];
    }
    return h('div', { class: 'easy-scrollbar' }, nodes);
  },


  methods: {
    handleScroll: function handleScroll() {
      var wrap = this.wrap;
      if (this.preScrollHeigt !== wrap.scrollHeight) {
        this.preScrollHeigt = wrap.scrollHeight;
        this.update();
      }
      this.moveY = wrap.scrollTop * 100 / wrap.clientHeight;
      this.moveX = wrap.scrollLeft * 100 / wrap.clientWidth;
    },

    handleMouseEnter: function handleMouseEnter() {
      if (this.$refs.refHBar) {
        this.$refs.refHBar.$el.children[0].style.opacity = 1;
      }
      if (this.$refs.refVBar) {
        this.$refs.refVBar.$el.children[0].style.opacity = 1;
      }
    },
    handleMouseLeave: function handleMouseLeave() {
      if (this.$refs.refHBar) {
        this.$refs.refHBar.$el.children[0].style.opacity = this.opt.barOpacityMin;
      }
      if (this.$refs.refVBar) {
        this.$refs.refVBar.$el.children[0].style.opacity = this.opt.barOpacityMin;
      }
    },
    update: function update() {
      var heightPercentage = void 0,
          widthPercentage = void 0;
      var wrap = this.wrap;
      if (!wrap) return;
      debugger;
      heightPercentage = wrap.clientHeight * 100 / wrap.scrollHeight;
      widthPercentage = wrap.clientWidth * 100 / wrap.scrollWidth;
      this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : '';
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : '';
      if (this.$refs.refVBar) {
        if (this.sizeHeight == 0) {
          this.$refs.refVBar.$el.style.display = "none";
        } else {
          this.$refs.refVBar.$el.style.display = "block";
        }
      }
      if (this.$refs.refHBar) {
        if (this.sizeWidth == 0) {
          this.$refs.refHBar.$el.style.display = "none";
        } else {
          this.$refs.refHBar.$el.style.display = "block";
        }
      }
    }
  },

  mounted: function mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    !this.noresize && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_resize_event__["a" /* addResizeListener */])(this.$refs.resize, this.update);
  },
  beforeDestroy: function beforeDestroy() {
    if (this.native) return;
    !this.noresize && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_resize_event__["b" /* removeResizeListener */])(this.$refs.resize, this.update);
  }
});

/***/ }),

/***/ "mvHG":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_bar_vue__ = __webpack_require__("zcff");
var normalizeComponent = __webpack_require__("J0+h")
/* script */

/* template */
var __vue_template__ = null
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_bar_vue__["a" /* default */],
  __vue_template__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "o92L":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_main_vue__ = __webpack_require__("jH3o");
function injectStyle (ssrContext) {
  __webpack_require__("tXCs")
}
var normalizeComponent = __webpack_require__("J0+h")
/* script */

/* template */
var __vue_template__ = null
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_0_4_vue_loader_lib_selector_type_script_index_0_main_vue__["a" /* default */],
  __vue_template__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ "puaG":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "q8zI":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "smZb":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export hasClass */
/* unused harmony export addClass */
/* unused harmony export removeClass */
/* unused harmony export setStyle */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__("7+uW");
/* istanbul ignore next */



const isServer = __WEBPACK_IMPORTED_MODULE_0_vue__["default"].prototype.$isServer;
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = isServer ? 0 : Number(document.documentMode);

/* istanbul ignore next */
const trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/* istanbul ignore next */
const camelCase = function(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/* istanbul ignore next */
const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(ele, event, handler) {
      if (ele && event && handler) {
        ele.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(ele, event, handler) {
      if (ele && event && handler) {
        ele.attachEvent('on' + event, handler);
      }
    };
  }
})();
/* harmony export (immutable) */ __webpack_exports__["a"] = on;


/* istanbul ignore next */
const off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(ele, event, handler) {
      if (ele && event) {
        ele.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(ele, event, handler) {
      if (ele && event) {
        ele.detachEvent('on' + event, handler);
      }
    };
  }
})();
/* harmony export (immutable) */ __webpack_exports__["b"] = off;


/* istanbul ignore next */
const once = function(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};
/* unused harmony export once */


/* istanbul ignore next */
function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

/* istanbul ignore next */
function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

/* istanbul ignore next */
function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

/* istanbul ignore next */
const getStyle = ieVersion < 9 ? function(ele, styleName) {
  if (isServer) return;
  if (!ele || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'styleFloat';
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return ele.filters.item('alpha').opacity / 100;
        } catch (e) {
          return 1.0;
        }
      default:
        return (ele.style[styleName] || ele.currentStyle ? ele.currentStyle[styleName] : null);
    }
  } catch (e) {
    return ele.style[styleName];
  }
} : function(ele, styleName) {
  if (isServer) return;
  if (!ele || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    var computed = document.defaultView.getComputedStyle(ele, '');
    return ele.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return ele.style[styleName];
  }
};
/* unused harmony export getStyle */


/* istanbul ignore next */
function setStyle(ele, styleName, value) {
  if (!ele || !styleName) return;

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(ele, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      ele.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      ele.style[styleName] = value;
    }
  }
};


/***/ }),

/***/ "tXCs":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "ws60":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "app"
    }
  }, [_c('router-view')], 1)
}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "zcff":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_dom__ = __webpack_require__("smZb");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__("1dLM");





/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number,
    barStyle: Object,
    railStyle: Object
  },

  computed: {
    bar: function bar() {
      return __WEBPACK_IMPORTED_MODULE_1__util__["a" /* BAR_MAP */][this.vertical ? 'vertical' : 'horizontal'];
    },
    railStyles: function railStyles() {
      return this.vertical ? "background-color:" + this.railStyle.color + ";z-Index:" + this.railStyle.zIndex + ";width:" + this.barStyle.width + ";right:" + this.railStyle.marginRight : "background-color:" + this.railStyle.color + ";z-Index:" + this.railStyle.zIndex + ";height:" + this.barStyle.width + ";bottom:" + this.railStyle.marginBottom;
    },
    wrap: function wrap() {
      return this.$parent.wrap;
    }
  },

  render: function render(h) {
    var size = this.size,
        move = this.move,
        bar = this.bar,
        barStyle = this.barStyle;

    return h(
      'div',
      {
        ref: 'railway',
        'class': ['esay-scrollbar__bar', 'is-' + bar.key],
        style: this.railStyles,
        on: {
          'mouseenter': this.handleRailMouseEnter,
          'mousedown': this.clickTrackHandler
        }
      },
      [h(
        'div',
        {
          ref: 'thumb',
          'class': 'easy-scrollbar__thumb',
          on: {
            'mousedown': this.clickThumbHandler
          },

          style: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["b" /* renderThumbStyle */])({ size: size, move: move, bar: bar, barStyle: barStyle }) },
        []
      )]
    );
  },


  methods: {
    clickThumbHandler: function clickThumbHandler(e) {
      this.startDrag(e);
      this[this.bar.axis] = e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]);
    },

    handleRailMouseEnter: function handleRailMouseEnter() {

      this.$refs.railway.children[0].style.opacity = 1;
    },
    clickTrackHandler: function clickTrackHandler(e) {
      var offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      var thumbHalf = this.$refs.thumb[this.bar.offset] / 2;
      var thumbPositionPercentage = (offset - thumbHalf) * 100 / this.$el[this.bar.offset];

      this.wrap[this.bar.scroll] = thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100;
    },
    startDrag: function startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_dom__["a" /* on */])(document, 'mousemove', this.mouseMoveDocumentHandler);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_dom__["a" /* on */])(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = function () {
        return false;
      };
    },
    mouseMoveDocumentHandler: function mouseMoveDocumentHandler(e) {
      if (this.cursorDown === false) return;
      var prevPage = this[this.bar.axis];

      if (!prevPage) return;

      var offset = (this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1;
      var thumbClickPosition = this.$refs.thumb[this.bar.offset] - prevPage;
      var thumbPositionPercentage = (offset - thumbClickPosition) * 100 / this.$el[this.bar.offset];

      this.wrap[this.bar.scroll] = thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100;
    },
    mouseUpDocumentHandler: function mouseUpDocumentHandler(e) {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_dom__["b" /* off */])(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  },

  destroyed: function destroyed() {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils_dom__["b" /* off */])(document, 'mouseup', this.mouseUpDocumentHandler);
  }
});

/***/ })

},["NHnr"]);
//# sourceMappingURL=app.ad3c02f94f6882e69bf1.js.map
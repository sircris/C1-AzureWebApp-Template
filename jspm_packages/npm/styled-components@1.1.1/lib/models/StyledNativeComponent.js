'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _isTag = require('../utils/isTag');

var _isTag2 = _interopRequireDefault(_isTag);

var _ThemeProvider = require('./ThemeProvider');

var _InlineStyle = require('./InlineStyle');

var _InlineStyle2 = _interopRequireDefault(_InlineStyle);

var _AbstractStyledComponent = require('./AbstractStyledComponent');

var _AbstractStyledComponent2 = _interopRequireDefault(_AbstractStyledComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createStyledNativeComponent = function createStyledNativeComponent(target, rules, parent) {
  /* Handle styled(OtherStyledNativeComponent) differently */
  var isStyledNativeComponent = _AbstractStyledComponent2.default.isPrototypeOf(target);
  if (isStyledNativeComponent && !(0, _isTag2.default)(target)) {
    return createStyledNativeComponent(target.target, target.rules.concat(rules), target);
  }

  var inlineStyle = new _InlineStyle2.default(rules);
  var ParentComponent = parent || _AbstractStyledComponent2.default;

  // $FlowIssue need to convince flow that ParentComponent can't be string here

  var StyledNativeComponent = function (_ParentComponent) {
    _inherits(StyledNativeComponent, _ParentComponent);

    function StyledNativeComponent() {
      _classCallCheck(this, StyledNativeComponent);

      var _this = _possibleConstructorReturn(this, (StyledNativeComponent.__proto__ || Object.getPrototypeOf(StyledNativeComponent)).call(this));

      _this.state = {
        theme: {}
      };
      return _this;
    }

    _createClass(StyledNativeComponent, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        // If there is a theme in the context, subscribe to the event emitter. This
        // is necessary due to pure components blocking context updates, this circumvents
        // that by updating when an event is emitted
        if (this.context[_ThemeProvider.CHANNEL]) {
          var subscribe = this.context[_ThemeProvider.CHANNEL];
          this.unsubscribe = subscribe(function (theme) {
            // This will be called once immediately
            _this2.setState({ theme: theme });
          });
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }
    }, {
      key: 'generateAndInjectStyles',
      value: function generateAndInjectStyles(theme, props) {
        var executionContext = _extends({}, props, { theme: theme });
        return inlineStyle.generateStyleObject(executionContext);
      }
      /* eslint-disable react/prop-types */

    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            style = _props.style,
            children = _props.children,
            innerRef = _props.innerRef;

        var theme = this.state.theme || this.props.theme || {};

        var generatedStyles = this.generateAndInjectStyles(theme, this.props);

        var propsForElement = _extends({}, this.props);
        propsForElement.style = [generatedStyles, style];
        if (innerRef) {
          propsForElement.ref = innerRef;
        }

        return (0, _react.createElement)(target, propsForElement, children);
      }
    }]);

    return StyledNativeComponent;
  }(ParentComponent);

  /* Used for inheritance */


  StyledNativeComponent.rules = rules;
  StyledNativeComponent.target = target;
  StyledNativeComponent.displayName = (0, _isTag2.default)(target) ? 'styled.' + target : 'Styled(' + target.displayName + ')';

  return StyledNativeComponent;
};

exports.default = createStyledNativeComponent;
module.exports = exports['default'];
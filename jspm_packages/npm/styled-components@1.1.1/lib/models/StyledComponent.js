'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _validAttr = require('../utils/validAttr');

var _validAttr2 = _interopRequireDefault(_validAttr);

var _isTag = require('../utils/isTag');

var _isTag2 = _interopRequireDefault(_isTag);

var _AbstractStyledComponent = require('./AbstractStyledComponent');

var _AbstractStyledComponent2 = _interopRequireDefault(_AbstractStyledComponent);

var _ThemeProvider = require('./ThemeProvider');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (ComponentStyle) {
  // eslint-disable-next-line no-undef
  var createStyledComponent = function createStyledComponent(target, rules, parent) {
    /* Handle styled(OtherStyledComponent) differently */
    var isStyledComponent = _AbstractStyledComponent2.default.isPrototypeOf(target);
    if (!(0, _isTag2.default)(target) && isStyledComponent) {
      return createStyledComponent(target.target, target.rules.concat(rules), target);
    }

    var componentStyle = new ComponentStyle(rules);
    var ParentComponent = parent || _AbstractStyledComponent2.default;

    var StyledComponent = function (_ParentComponent) {
      _inherits(StyledComponent, _ParentComponent);

      function StyledComponent() {
        _classCallCheck(this, StyledComponent);

        var _this = _possibleConstructorReturn(this, (StyledComponent.__proto__ || Object.getPrototypeOf(StyledComponent)).call(this));

        _this.state = {
          theme: {},
          generatedClassName: ''
        };
        return _this;
      }

      _createClass(StyledComponent, [{
        key: 'generateAndInjectStyles',
        value: function generateAndInjectStyles(theme, props) {
          var executionContext = _extends({}, props, { theme: theme });
          return componentStyle.generateAndInjectStyles(executionContext);
        }
      }, {
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
              var generatedClassName = _this2.generateAndInjectStyles(theme, _this2.props);
              _this2.setState({ theme: theme, generatedClassName: generatedClassName });
            });
          } else {
            var generatedClassName = this.generateAndInjectStyles(this.props.theme || {}, this.props);
            this.setState({ generatedClassName: generatedClassName });
          }
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          var generatedClassName = this.generateAndInjectStyles(this.state.theme || this.props.theme, nextProps);
          this.setState({ generatedClassName: generatedClassName });
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (this.unsubscribe) {
            this.unsubscribe();
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this3 = this;

          var _props = this.props,
              className = _props.className,
              children = _props.children,
              innerRef = _props.innerRef;
          var generatedClassName = this.state.generatedClassName;


          var propsForElement = {};
          /* Don't pass through non HTML tags through to HTML elements */
          Object.keys(this.props).filter(function (propName) {
            return !(0, _isTag2.default)(target) || (0, _validAttr2.default)(propName);
          }).forEach(function (propName) {
            propsForElement[propName] = _this3.props[propName];
          });
          propsForElement.className = [className, generatedClassName].filter(function (x) {
            return x;
          }).join(' ');
          if (innerRef) {
            propsForElement.ref = innerRef;
          }

          return (0, _react.createElement)(target, propsForElement, children);
        }
      }]);

      return StyledComponent;
    }(ParentComponent);

    StyledComponent.target = target;
    StyledComponent.rules = rules;

    StyledComponent.displayName = (0, _isTag2.default)(target) ? 'styled.' + target : 'Styled(' + target.displayName + ')';

    return StyledComponent;
  };

  return createStyledComponent;
};

module.exports = exports['default'];
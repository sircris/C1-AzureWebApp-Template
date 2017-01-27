'use strict';

var _templateObject = _taggedTemplateLiteral(['\n      color: ', ';\n    '], ['\n      color: ', ';\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['\n      background: ', ';\n    '], ['\n      background: ', ';\n    ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _utils = require('./utils');

var _ThemeProvider = require('../models/ThemeProvider');

var _ThemeProvider2 = _interopRequireDefault(_ThemeProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var styled = void 0;

describe('theming', function () {
  beforeEach(function () {
    styled = (0, _utils.resetStyled)();
  });

  it('should inject props.theme into a styled component', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var theme = { color: 'black' };
    (0, _enzyme.render)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: theme },
      _react2.default.createElement(Comp, null)
    ));
    (0, _utils.expectCSSMatches)('.a { color: ' + theme.color + '; }');
  });

  it('should inject props.theme into a styled component multiple levels deep', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var theme = { color: 'black' };
    (0, _enzyme.render)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: theme },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Comp, null)
        )
      )
    ));
    (0, _utils.expectCSSMatches)('.a { color: ' + theme.color + '; }');
  });

  it('should properly allow a component to fallback to its default props when a theme is not provided', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });

    Comp1.defaultProps = {
      theme: {
        color: "purple"
      }
    };
    (0, _enzyme.render)(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(Comp1, null)
    ));
    (0, _utils.expectCSSMatches)('.a { color: purple; }');
  });

  it('should properly set the theme with an empty object when no teme is provided and no defaults are set', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    (0, _enzyme.render)(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(Comp1, null)
    ));
    (0, _utils.expectCSSMatches)('.a { color: ; }');
  });

  it('should only inject props.theme into styled components within its child component tree', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var Comp2 = styled.div(_templateObject2, function (props) {
      return props.theme.color;
    });

    var theme = { color: 'black' };
    (0, _enzyme.render)(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        _ThemeProvider2.default,
        { theme: theme },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Comp1, null)
        )
      ),
      _react2.default.createElement(Comp2, null)
    ));
    (0, _utils.expectCSSMatches)('.a { color: ' + theme.color + '; } .b { background: ; }');
  });

  it('should inject props.theme into all styled components within the child component tree', function () {
    var Comp1 = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var Comp2 = styled.div(_templateObject2, function (props) {
      return props.theme.color;
    });
    var theme = { color: 'black' };
    (0, _enzyme.render)(_react2.default.createElement(
      _ThemeProvider2.default,
      { theme: theme },
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Comp1, null)
        ),
        _react2.default.createElement(Comp2, null)
      )
    ));
    (0, _utils.expectCSSMatches)('.a { color: ' + theme.color + '; } .b { background: ' + theme.color + '; }');
  });

  it('should inject new CSS when the theme changes', function () {
    var Comp = styled.div(_templateObject, function (props) {
      return props.theme.color;
    });
    var originalTheme = { color: 'black' };
    var newTheme = { color: 'blue' };
    var theme = originalTheme;
    // Force render the component
    var renderComp = function renderComp() {
      (0, _enzyme.render)(_react2.default.createElement(
        _ThemeProvider2.default,
        { theme: theme },
        _react2.default.createElement(Comp, null)
      ));
    };
    renderComp();
    var initialCSS = (0, _utils.expectCSSMatches)('.a { color: ' + theme.color + '; }');
    // Change the theme
    theme = newTheme;
    renderComp();
    (0, _utils.expectCSSMatches)(initialCSS + '.b { color: ' + newTheme.color + '; }');
  });
});
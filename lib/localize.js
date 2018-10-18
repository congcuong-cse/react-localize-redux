'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTranslate = exports.getTranslationsForSpecificLanguage = exports.getTranslationsForActiveLanguage = exports.translationsEqualSelector = exports.getActiveLanguage = exports.getOptions = exports.getLanguages = exports.getTranslations = exports.setActiveLanguage = exports.addTranslationForLanguage = exports.addTranslation = exports.initialize = exports.localizeReducer = exports.defaultTranslateOptions = exports.TRANSLATE = exports.SET_ACTIVE_LANGUAGE = exports.ADD_TRANSLATION_FOR_LANGUAGE = exports.ADD_TRANSLATION = exports.INITIALIZE = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.languages = languages;
exports.translations = translations;
exports.options = options;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _flat = require('flat');

var _reselect = require('reselect');

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * ACTIONS
 */


/**
 * TYPES
 */


// This is to get around the whole default options issue with Flow
// I tried using the $Diff approach, but with no luck so for now stuck with this terd.
// Because sometimes you just want flow to shut up!
var INITIALIZE = exports.INITIALIZE = '@@localize/INITIALIZE';
var ADD_TRANSLATION = exports.ADD_TRANSLATION = '@@localize/ADD_TRANSLATION';
var ADD_TRANSLATION_FOR_LANGUAGE = exports.ADD_TRANSLATION_FOR_LANGUAGE = '@@localize/ADD_TRANSLATION_FOR_LANGUAGE';
var SET_ACTIVE_LANGUAGE = exports.SET_ACTIVE_LANGUAGE = '@@localize/SET_ACTIVE_LANGUAGE';
var TRANSLATE = exports.TRANSLATE = '@@localize/TRANSLATE';

/**
 * REDUCERS
 */
function languages() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case INITIALIZE:
      var _options = action.payload.options || {};
      return action.payload.languages.map(function (language, index) {
        var isActive = function isActive(code) {
          return _options.defaultLanguage !== undefined ? code === _options.defaultLanguage : index === 0;
        };
        // check if it's using array of Language objects, or array of language codes
        return typeof language === 'string' ? { code: language, active: isActive(language) // language codes
        } : _extends({}, language, { active: isActive(language.code) }); // language objects
      });
    case SET_ACTIVE_LANGUAGE:
      return state.map(function (language) {
        return language.code === action.payload.languageCode ? _extends({}, language, { active: true }) : _extends({}, language, { active: false });
      });
    default:
      return state;
  }
}

function translations() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  var flattenedTranslations = void 0;
  var translationWithTransform = void 0;

  switch (action.type) {
    case INITIALIZE:
      if (!action.payload.translation) {
        return state;
      }

      flattenedTranslations = (0, _flat.flatten)(action.payload.translation, {
        safe: true
      });
      var _options2 = action.payload.options || {};
      var firstLanguage = typeof action.payload.languages[0] === 'string' ? action.payload.languages[0] : action.payload.languages[0].code;
      var _defaultLanguage = _options2.defaultLanguage || firstLanguage;
      var isMultiLanguageTranslation = Object.keys(flattenedTranslations).some(function (item) {
        return Array.isArray(flattenedTranslations[item]);
      });

      // add translation based on whether it is single vs multi language translation data
      var newTranslation = isMultiLanguageTranslation ? flattenedTranslations : (0, _utils.getSingleToMultilanguageTranslation)(_defaultLanguage, action.languageCodes, flattenedTranslations, state);

      return _extends({}, state, newTranslation);
    case ADD_TRANSLATION:
      translationWithTransform = action.payload.translationOptions && action.payload.translationOptions.translationTransform !== undefined ? action.payload.translationOptions.translationTransform(action.payload.translation || {}, action.languageCodes) : action.payload.translation;
      return _extends({}, state, (0, _flat.flatten)(translationWithTransform, { safe: true }));
    case ADD_TRANSLATION_FOR_LANGUAGE:
      flattenedTranslations = (0, _flat.flatten)(action.payload.translation, {
        safe: true
      });
      return _extends({}, state, (0, _utils.getSingleToMultilanguageTranslation)(action.payload.language, action.languageCodes, flattenedTranslations, state));
    default:
      return state;
  }
}

function options() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultTranslateOptions;
  var action = arguments[1];

  switch (action.type) {
    case INITIALIZE:
      var _options3 = action.payload.options || {};
      var _defaultLanguage2 = _options3.defaultLanguage || action.languageCodes[0];
      return _extends({}, state, (0, _utils.validateOptions)(_options3), { defaultLanguage: _defaultLanguage2 });
    default:
      return state;
  }
}

var defaultTranslateOptions = exports.defaultTranslateOptions = {
  renderToStaticMarkup: false,
  renderInnerHtml: false,
  ignoreTranslateChildren: false,
  defaultLanguage: '',
  onMissingTranslation: function onMissingTranslation(_ref) {
    var translationId = _ref.translationId,
        languageCode = _ref.languageCode;
    return 'Missing translationId: ${ translationId } for language: ${ languageCode }';
  }
};

var initialState = {
  languages: [],
  translations: {},
  options: defaultTranslateOptions
};

var localizeReducer = exports.localizeReducer = function localizeReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  // execute the languages reducer first as we need access to those values for other reducers
  var languagesState = languages(state.languages, action);
  var languageCodes = languagesState.map(function (language) {
    return language.code;
  });

  return {
    languages: languagesState,
    translations: translations(state.translations, _extends({}, action, {
      languageCodes: languageCodes
    })),
    options: options(state.options, _extends({}, action, { languageCodes: languageCodes }))
  };
};

/**
 * ACTION CREATORS
 */
var initialize = exports.initialize = function initialize(payload) {
  return {
    type: INITIALIZE,
    payload: payload
  };
};

var addTranslation = exports.addTranslation = function addTranslation(translation, options) {
  return {
    type: ADD_TRANSLATION,
    payload: {
      translation: translation,
      translationOptions: options
    }
  };
};

var addTranslationForLanguage = exports.addTranslationForLanguage = function addTranslationForLanguage(translation, language) {
  return {
    type: ADD_TRANSLATION_FOR_LANGUAGE,
    payload: { translation: translation, language: language }
  };
};

var setActiveLanguage = exports.setActiveLanguage = function setActiveLanguage(languageCode) {
  return {
    type: SET_ACTIVE_LANGUAGE,
    payload: { languageCode: languageCode }
  };
};

/**
 * SELECTORS
 */
var getTranslations = exports.getTranslations = function getTranslations(state) {
  return state.translations;
};

var getLanguages = exports.getLanguages = function getLanguages(state) {
  return state.languages;
};

var getOptions = exports.getOptions = function getOptions(state) {
  return state.options;
};

var getActiveLanguage = exports.getActiveLanguage = function getActiveLanguage(state) {
  var languages = getLanguages(state);
  return languages.filter(function (language) {
    return language.active === true;
  })[0];
};

/**
 * A custom equality checker that checker that compares an objects keys and values instead of === comparison
 * e.g. {name: 'Ted', sport: 'hockey'} would result in 'name,sport - Ted,hocker' which would be used for comparison
 *
 * NOTE: This works with activeLanguage, languages, and translations data types.
 * If a new data type is added to selector this would need to be updated to accomodate
 */
var translationsEqualSelector = exports.translationsEqualSelector = (0, _reselect.createSelectorCreator)(_reselect.defaultMemoize, function (prev, cur) {
  var prevKeys = (typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === 'object' ? Object.keys(prev).toString() : undefined;
  var curKeys = (typeof cur === 'undefined' ? 'undefined' : _typeof(cur)) === 'object' ? Object.keys(cur).toString() : undefined;

  var prevValues = (typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === 'object' ? (0, _utils.objectValuesToString)(prev) : undefined;
  var curValues = (typeof cur === 'undefined' ? 'undefined' : _typeof(cur)) === 'object' ? (0, _utils.objectValuesToString)(cur) : undefined;

  var prevCacheValue = prevKeys !== undefined && prevValues !== undefined ? prevKeys + ' - ' + prevValues : prev;

  var curCacheValue = curKeys !== undefined && curValues !== undefined ? curKeys + ' - ' + curValues : cur;

  return prevCacheValue === curCacheValue;
});

var getTranslationsForActiveLanguage = exports.getTranslationsForActiveLanguage = translationsEqualSelector(getActiveLanguage, getLanguages, getTranslations, _utils.getTranslationsForLanguage);

var getTranslationsForSpecificLanguage = exports.getTranslationsForSpecificLanguage = translationsEqualSelector(getLanguages, getTranslations, function (languages, translations) {
  return (0, _reselect.defaultMemoize)(function (languageCode) {
    return (0, _utils.getTranslationsForLanguage)({ code: languageCode, active: false }, languages, translations);
  });
});

var getTranslate = (0, _reselect.createSelector)(getTranslationsForActiveLanguage, getTranslationsForSpecificLanguage, getActiveLanguage, getOptions, function (translationsForActiveLanguage, getTranslationsForLanguage, activeLanguage, initializeOptions) {
  return function (value) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var translateOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var defaultLanguage = initializeOptions.defaultLanguage,
        defaultOptions = _objectWithoutProperties(initializeOptions, ['defaultLanguage']);

    var overrideLanguage = translateOptions.language;

    var translations = overrideLanguage !== undefined ? getTranslationsForLanguage(overrideLanguage) : translationsForActiveLanguage;

    var defaultTranslations = activeLanguage && activeLanguage.code === defaultLanguage ? translationsForActiveLanguage : getTranslationsForLanguage(defaultLanguage);

    var languageCode = overrideLanguage !== undefined ? overrideLanguage : activeLanguage && activeLanguage.code;

    var mergedOptions = _extends({}, defaultOptions, translateOptions);

    var getTranslation = function getTranslation(translationId) {
      var hasValidTranslation = translations[translationId] !== undefined;
      var hasValidDefaultTranslation = defaultTranslations[translationId] !== undefined;

      var defaultTranslation = hasValidDefaultTranslation ? (0, _utils.getLocalizedElement)({
        translation: defaultTranslations[translationId],
        data: data,
        renderInnerHtml: mergedOptions.renderInnerHtml
      }) : "No default translation found! Ensure you've added translations for your default langauge.";

      // if translation is not valid then generate the on missing translation message in it's place
      var translation = hasValidTranslation ? translations[translationId] : mergedOptions.onMissingTranslation({
        translationId: translationId,
        languageCode: languageCode,
        defaultTranslation: defaultTranslation
      });

      // if translations are missing than ovrride data to include translationId, languageCode
      // as these will be needed to render missing translations message
      var translationData = hasValidTranslation ? data : { translationId: translationId, languageCode: languageCode };

      return (0, _utils.getLocalizedElement)({
        translation: translation,
        data: translationData,
        languageCode: languageCode,
        renderInnerHtml: mergedOptions.renderInnerHtml
      });
    };

    if (typeof value === 'string') {
      return getTranslation(value);
    } else if (Array.isArray(value)) {
      return value.reduce(function (prev, cur) {
        return _extends({}, prev, _defineProperty({}, cur, getTranslation(cur)));
      }, {});
    } else {
      throw new Error('react-localize-redux: Invalid key passed to getTranslate.');
    }
  };
});
exports.getTranslate = getTranslate;
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.ajv"],{

/***/ "+9rK":
/*!**********************************************!*\
  !*** ./node_modules/ajv/lib/compile/util.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = {
  copy: copy,
  checkDataType: checkDataType,
  checkDataTypes: checkDataTypes,
  coerceToTypes: coerceToTypes,
  toHash: toHash,
  getProperty: getProperty,
  escapeQuotes: escapeQuotes,
  equal: __webpack_require__(/*! fast-deep-equal */ "aUsF"),
  ucs2length: __webpack_require__(/*! ./ucs2length */ "d17/"),
  varOccurences: varOccurences,
  varReplace: varReplace,
  cleanUpCode: cleanUpCode,
  finalCleanUpCode: finalCleanUpCode,
  schemaHasRules: schemaHasRules,
  schemaHasRulesExcept: schemaHasRulesExcept,
  toQuotedString: toQuotedString,
  getPathExpr: getPathExpr,
  getPath: getPath,
  getData: getData,
  unescapeFragment: unescapeFragment,
  unescapeJsonPointer: unescapeJsonPointer,
  escapeFragment: escapeFragment,
  escapeJsonPointer: escapeJsonPointer
};


function copy(o, to) {
  to = to || {};
  for (var key in o) to[key] = o[key];
  return to;
}


function checkDataType(dataType, data, negate) {
  var EQUAL = negate ? ' !== ' : ' === '
    , AND = negate ? ' || ' : ' && '
    , OK = negate ? '!' : ''
    , NOT = negate ? '' : '!';
  switch (dataType) {
    case 'null': return data + EQUAL + 'null';
    case 'array': return OK + 'Array.isArray(' + data + ')';
    case 'object': return '(' + OK + data + AND +
                          'typeof ' + data + EQUAL + '"object"' + AND +
                          NOT + 'Array.isArray(' + data + '))';
    case 'integer': return '(typeof ' + data + EQUAL + '"number"' + AND +
                           NOT + '(' + data + ' % 1)' +
                           AND + data + EQUAL + data + ')';
    default: return 'typeof ' + data + EQUAL + '"' + dataType + '"';
  }
}


function checkDataTypes(dataTypes, data) {
  switch (dataTypes.length) {
    case 1: return checkDataType(dataTypes[0], data, true);
    default:
      var code = '';
      var types = toHash(dataTypes);
      if (types.array && types.object) {
        code = types.null ? '(': '(!' + data + ' || ';
        code += 'typeof ' + data + ' !== "object")';
        delete types.null;
        delete types.array;
        delete types.object;
      }
      if (types.number) delete types.integer;
      for (var t in types)
        code += (code ? ' && ' : '' ) + checkDataType(t, data, true);

      return code;
  }
}


var COERCE_TO_TYPES = toHash([ 'string', 'number', 'integer', 'boolean', 'null' ]);
function coerceToTypes(optionCoerceTypes, dataTypes) {
  if (Array.isArray(dataTypes)) {
    var types = [];
    for (var i=0; i<dataTypes.length; i++) {
      var t = dataTypes[i];
      if (COERCE_TO_TYPES[t]) types[types.length] = t;
      else if (optionCoerceTypes === 'array' && t === 'array') types[types.length] = t;
    }
    if (types.length) return types;
  } else if (COERCE_TO_TYPES[dataTypes]) {
    return [dataTypes];
  } else if (optionCoerceTypes === 'array' && dataTypes === 'array') {
    return ['array'];
  }
}


function toHash(arr) {
  var hash = {};
  for (var i=0; i<arr.length; i++) hash[arr[i]] = true;
  return hash;
}


var IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
var SINGLE_QUOTE = /'|\\/g;
function getProperty(key) {
  return typeof key == 'number'
          ? '[' + key + ']'
          : IDENTIFIER.test(key)
            ? '.' + key
            : "['" + escapeQuotes(key) + "']";
}


function escapeQuotes(str) {
  return str.replace(SINGLE_QUOTE, '\\$&')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\f/g, '\\f')
            .replace(/\t/g, '\\t');
}


function varOccurences(str, dataVar) {
  dataVar += '[^0-9]';
  var matches = str.match(new RegExp(dataVar, 'g'));
  return matches ? matches.length : 0;
}


function varReplace(str, dataVar, expr) {
  dataVar += '([^0-9])';
  expr = expr.replace(/\$/g, '$$$$');
  return str.replace(new RegExp(dataVar, 'g'), expr + '$1');
}


var EMPTY_ELSE = /else\s*{\s*}/g
  , EMPTY_IF_NO_ELSE = /if\s*\([^)]+\)\s*\{\s*\}(?!\s*else)/g
  , EMPTY_IF_WITH_ELSE = /if\s*\(([^)]+)\)\s*\{\s*\}\s*else(?!\s*if)/g;
function cleanUpCode(out) {
  return out.replace(EMPTY_ELSE, '')
            .replace(EMPTY_IF_NO_ELSE, '')
            .replace(EMPTY_IF_WITH_ELSE, 'if (!($1))');
}


var ERRORS_REGEXP = /[^v.]errors/g
  , REMOVE_ERRORS = /var errors = 0;|var vErrors = null;|validate.errors = vErrors;/g
  , REMOVE_ERRORS_ASYNC = /var errors = 0;|var vErrors = null;/g
  , RETURN_VALID = 'return errors === 0;'
  , RETURN_TRUE = 'validate.errors = null; return true;'
  , RETURN_ASYNC = /if \(errors === 0\) return data;\s*else throw new ValidationError\(vErrors\);/
  , RETURN_DATA_ASYNC = 'return data;'
  , ROOTDATA_REGEXP = /[^A-Za-z_$]rootData[^A-Za-z0-9_$]/g
  , REMOVE_ROOTDATA = /if \(rootData === undefined\) rootData = data;/;

function finalCleanUpCode(out, async) {
  var matches = out.match(ERRORS_REGEXP);
  if (matches && matches.length == 2) {
    out = async
          ? out.replace(REMOVE_ERRORS_ASYNC, '')
               .replace(RETURN_ASYNC, RETURN_DATA_ASYNC)
          : out.replace(REMOVE_ERRORS, '')
               .replace(RETURN_VALID, RETURN_TRUE);
  }

  matches = out.match(ROOTDATA_REGEXP);
  if (!matches || matches.length !== 3) return out;
  return out.replace(REMOVE_ROOTDATA, '');
}


function schemaHasRules(schema, rules) {
  if (typeof schema == 'boolean') return !schema;
  for (var key in schema) if (rules[key]) return true;
}


function schemaHasRulesExcept(schema, rules, exceptKeyword) {
  if (typeof schema == 'boolean') return !schema && exceptKeyword != 'not';
  for (var key in schema) if (key != exceptKeyword && rules[key]) return true;
}


function toQuotedString(str) {
  return '\'' + escapeQuotes(str) + '\'';
}


function getPathExpr(currentPath, expr, jsonPointers, isNumber) {
  var path = jsonPointers // false by default
              ? '\'/\' + ' + expr + (isNumber ? '' : '.replace(/~/g, \'~0\').replace(/\\//g, \'~1\')')
              : (isNumber ? '\'[\' + ' + expr + ' + \']\'' : '\'[\\\'\' + ' + expr + ' + \'\\\']\'');
  return joinPaths(currentPath, path);
}


function getPath(currentPath, prop, jsonPointers) {
  var path = jsonPointers // false by default
              ? toQuotedString('/' + escapeJsonPointer(prop))
              : toQuotedString(getProperty(prop));
  return joinPaths(currentPath, path);
}


var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function getData($data, lvl, paths) {
  var up, jsonPointer, data, matches;
  if ($data === '') return 'rootData';
  if ($data[0] == '/') {
    if (!JSON_POINTER.test($data)) throw new Error('Invalid JSON-pointer: ' + $data);
    jsonPointer = $data;
    data = 'rootData';
  } else {
    matches = $data.match(RELATIVE_JSON_POINTER);
    if (!matches) throw new Error('Invalid JSON-pointer: ' + $data);
    up = +matches[1];
    jsonPointer = matches[2];
    if (jsonPointer == '#') {
      if (up >= lvl) throw new Error('Cannot access property/index ' + up + ' levels up, current level is ' + lvl);
      return paths[lvl - up];
    }

    if (up > lvl) throw new Error('Cannot access data ' + up + ' levels up, current level is ' + lvl);
    data = 'data' + ((lvl - up) || '');
    if (!jsonPointer) return data;
  }

  var expr = data;
  var segments = jsonPointer.split('/');
  for (var i=0; i<segments.length; i++) {
    var segment = segments[i];
    if (segment) {
      data += getProperty(unescapeJsonPointer(segment));
      expr += ' && ' + data;
    }
  }
  return expr;
}


function joinPaths (a, b) {
  if (a == '""') return b;
  return (a + ' + ' + b).replace(/' \+ '/g, '');
}


function unescapeFragment(str) {
  return unescapeJsonPointer(decodeURIComponent(str));
}


function escapeFragment(str) {
  return encodeURIComponent(escapeJsonPointer(str));
}


function escapeJsonPointer(str) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}


function unescapeJsonPointer(str) {
  return str.replace(/~1/g, '/').replace(/~0/g, '~');
}


/***/ }),

/***/ "//Jx":
/*!*****************************************!*\
  !*** ./node_modules/ajv/lib/keyword.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var IDENTIFIER = /^[a-z_$][a-z0-9_$-]*$/i;
var customRuleCode = __webpack_require__(/*! ./dotjs/custom */ "cjZW");

module.exports = {
  add: addKeyword,
  get: getKeyword,
  remove: removeKeyword
};

/**
 * Define custom keyword
 * @this  Ajv
 * @param {String} keyword custom keyword, should be unique (including different from all standard, custom and macro keywords).
 * @param {Object} definition keyword definition object with properties `type` (type(s) which the keyword applies to), `validate` or `compile`.
 * @return {Ajv} this for method chaining
 */
function addKeyword(keyword, definition) {
  /* jshint validthis: true */
  /* eslint no-shadow: 0 */
  var RULES = this.RULES;

  if (RULES.keywords[keyword])
    throw new Error('Keyword ' + keyword + ' is already defined');

  if (!IDENTIFIER.test(keyword))
    throw new Error('Keyword ' + keyword + ' is not a valid identifier');

  if (definition) {
    if (definition.macro && definition.valid !== undefined)
      throw new Error('"valid" option cannot be used with macro keywords');

    var dataType = definition.type;
    if (Array.isArray(dataType)) {
      var i, len = dataType.length;
      for (i=0; i<len; i++) checkDataType(dataType[i]);
      for (i=0; i<len; i++) _addRule(keyword, dataType[i], definition);
    } else {
      if (dataType) checkDataType(dataType);
      _addRule(keyword, dataType, definition);
    }

    var $data = definition.$data === true && this._opts.$data;
    if ($data && !definition.validate)
      throw new Error('$data support: "validate" function is not defined');

    var metaSchema = definition.metaSchema;
    if (metaSchema) {
      if ($data) {
        metaSchema = {
          anyOf: [
            metaSchema,
            { '$ref': 'https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/data.json#' }
          ]
        };
      }
      definition.validateSchema = this.compile(metaSchema, true);
    }
  }

  RULES.keywords[keyword] = RULES.all[keyword] = true;


  function _addRule(keyword, dataType, definition) {
    var ruleGroup;
    for (var i=0; i<RULES.length; i++) {
      var rg = RULES[i];
      if (rg.type == dataType) {
        ruleGroup = rg;
        break;
      }
    }

    if (!ruleGroup) {
      ruleGroup = { type: dataType, rules: [] };
      RULES.push(ruleGroup);
    }

    var rule = {
      keyword: keyword,
      definition: definition,
      custom: true,
      code: customRuleCode,
      implements: definition.implements
    };
    ruleGroup.rules.push(rule);
    RULES.custom[keyword] = rule;
  }


  function checkDataType(dataType) {
    if (!RULES.types[dataType]) throw new Error('Unknown type ' + dataType);
  }

  return this;
}


/**
 * Get keyword
 * @this  Ajv
 * @param {String} keyword pre-defined or custom keyword.
 * @return {Object|Boolean} custom keyword definition, `true` if it is a predefined keyword, `false` otherwise.
 */
function getKeyword(keyword) {
  /* jshint validthis: true */
  var rule = this.RULES.custom[keyword];
  return rule ? rule.definition : this.RULES.keywords[keyword] || false;
}


/**
 * Remove keyword
 * @this  Ajv
 * @param {String} keyword pre-defined or custom keyword.
 * @return {Ajv} this for method chaining
 */
function removeKeyword(keyword) {
  /* jshint validthis: true */
  var RULES = this.RULES;
  delete RULES.keywords[keyword];
  delete RULES.all[keyword];
  delete RULES.custom[keyword];
  for (var i=0; i<RULES.length; i++) {
    var rules = RULES[i].rules;
    for (var j=0; j<rules.length; j++) {
      if (rules[j].keyword == keyword) {
        rules.splice(j, 1);
        break;
      }
    }
  }
  return this;
}


/***/ }),

/***/ "0w4r":
/*!***************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/uniqueItems.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_uniqueItems(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  if (($schema || $isData) && it.opts.uniqueItems !== false) {
    if ($isData) {
      out += ' var ' + ($valid) + '; if (' + ($schemaValue) + ' === false || ' + ($schemaValue) + ' === undefined) ' + ($valid) + ' = true; else if (typeof ' + ($schemaValue) + ' != \'boolean\') ' + ($valid) + ' = false; else { ';
    }
    out += ' var i = ' + ($data) + '.length , ' + ($valid) + ' = true , j; if (i > 1) { ';
    var $itemType = it.schema.items && it.schema.items.type,
      $typeIsArray = Array.isArray($itemType);
    if (!$itemType || $itemType == 'object' || $itemType == 'array' || ($typeIsArray && ($itemType.indexOf('object') >= 0 || $itemType.indexOf('array') >= 0))) {
      out += ' outer: for (;i--;) { for (j = i; j--;) { if (equal(' + ($data) + '[i], ' + ($data) + '[j])) { ' + ($valid) + ' = false; break outer; } } } ';
    } else {
      out += ' var itemIndices = {}, item; for (;i--;) { var item = ' + ($data) + '[i]; ';
      var $method = 'checkDataType' + ($typeIsArray ? 's' : '');
      out += ' if (' + (it.util[$method]($itemType, 'item', true)) + ') continue; ';
      if ($typeIsArray) {
        out += ' if (typeof item == \'string\') item = \'"\' + item; ';
      }
      out += ' if (typeof itemIndices[item] == \'number\') { ' + ($valid) + ' = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ';
    }
    out += ' } ';
    if ($isData) {
      out += '  }  ';
    }
    out += ' if (!' + ($valid) + ') {   ';
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ('uniqueItems') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { i: i, j: j } ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should NOT have duplicate items (items ## \' + j + \' and \' + i + \' are identical)\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema:  ';
        if ($isData) {
          out += 'validate.schema' + ($schemaPath);
        } else {
          out += '' + ($schema);
        }
        out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + (__err) + ']); ';
      } else {
        out += ' validate.errors = [' + (__err) + ']; return false; ';
      }
    } else {
      out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    out += ' } ';
    if ($breakOnError) {
      out += ' else { ';
    }
  } else {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
  }
  return out;
}


/***/ }),

/***/ "1QhW":
/*!************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/validate.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_validate(it, $keyword, $ruleType) {
  var out = '';
  var $async = it.schema.$async === true,
    $refKeywords = it.util.schemaHasRulesExcept(it.schema, it.RULES.all, '$ref'),
    $id = it.self._getId(it.schema);
  if (it.isTop) {
    out += ' var validate = ';
    if ($async) {
      it.async = true;
      out += 'async ';
    }
    out += 'function(data, dataPath, parentData, parentDataProperty, rootData) { \'use strict\'; ';
    if ($id && (it.opts.sourceCode || it.opts.processCode)) {
      out += ' ' + ('/\*# sourceURL=' + $id + ' */') + ' ';
    }
  }
  if (typeof it.schema == 'boolean' || !($refKeywords || it.schema.$ref)) {
    var $keyword = 'false schema';
    var $lvl = it.level;
    var $dataLvl = it.dataLevel;
    var $schema = it.schema[$keyword];
    var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
    var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
    var $breakOnError = !it.opts.allErrors;
    var $errorKeyword;
    var $data = 'data' + ($dataLvl || '');
    var $valid = 'valid' + $lvl;
    if (it.schema === false) {
      if (it.isTop) {
        $breakOnError = true;
      } else {
        out += ' var ' + ($valid) + ' = false; ';
      }
      var $$outStack = $$outStack || [];
      $$outStack.push(out);
      out = ''; /* istanbul ignore else */
      if (it.createErrors !== false) {
        out += ' { keyword: \'' + ($errorKeyword || 'false schema') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';
        if (it.opts.messages !== false) {
          out += ' , message: \'boolean schema is false\' ';
        }
        if (it.opts.verbose) {
          out += ' , schema: false , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
        }
        out += ' } ';
      } else {
        out += ' {} ';
      }
      var __err = out;
      out = $$outStack.pop();
      if (!it.compositeRule && $breakOnError) {
        /* istanbul ignore if */
        if (it.async) {
          out += ' throw new ValidationError([' + (__err) + ']); ';
        } else {
          out += ' validate.errors = [' + (__err) + ']; return false; ';
        }
      } else {
        out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
      }
    } else {
      if (it.isTop) {
        if ($async) {
          out += ' return data; ';
        } else {
          out += ' validate.errors = null; return true; ';
        }
      } else {
        out += ' var ' + ($valid) + ' = true; ';
      }
    }
    if (it.isTop) {
      out += ' }; return validate; ';
    }
    return out;
  }
  if (it.isTop) {
    var $top = it.isTop,
      $lvl = it.level = 0,
      $dataLvl = it.dataLevel = 0,
      $data = 'data';
    it.rootId = it.resolve.fullPath(it.self._getId(it.root.schema));
    it.baseId = it.baseId || it.rootId;
    delete it.isTop;
    it.dataPathArr = [undefined];
    out += ' var vErrors = null; ';
    out += ' var errors = 0;     ';
    out += ' if (rootData === undefined) rootData = data; ';
  } else {
    var $lvl = it.level,
      $dataLvl = it.dataLevel,
      $data = 'data' + ($dataLvl || '');
    if ($id) it.baseId = it.resolve.url(it.baseId, $id);
    if ($async && !it.async) throw new Error('async schema in sync schema');
    out += ' var errs_' + ($lvl) + ' = errors;';
  }
  var $valid = 'valid' + $lvl,
    $breakOnError = !it.opts.allErrors,
    $closingBraces1 = '',
    $closingBraces2 = '';
  var $errorKeyword;
  var $typeSchema = it.schema.type,
    $typeIsArray = Array.isArray($typeSchema);
  if ($typeSchema && it.opts.nullable && it.schema.nullable === true) {
    if ($typeIsArray) {
      if ($typeSchema.indexOf('null') == -1) $typeSchema = $typeSchema.concat('null');
    } else if ($typeSchema != 'null') {
      $typeSchema = [$typeSchema, 'null'];
      $typeIsArray = true;
    }
  }
  if ($typeIsArray && $typeSchema.length == 1) {
    $typeSchema = $typeSchema[0];
    $typeIsArray = false;
  }
  if (it.schema.$ref && $refKeywords) {
    if (it.opts.extendRefs == 'fail') {
      throw new Error('$ref: validation keywords used in schema at path "' + it.errSchemaPath + '" (see option extendRefs)');
    } else if (it.opts.extendRefs !== true) {
      $refKeywords = false;
      it.logger.warn('$ref: keywords ignored in schema at path "' + it.errSchemaPath + '"');
    }
  }
  if (it.schema.$comment && it.opts.$comment) {
    out += ' ' + (it.RULES.all.$comment.code(it, '$comment'));
  }
  if ($typeSchema) {
    if (it.opts.coerceTypes) {
      var $coerceToTypes = it.util.coerceToTypes(it.opts.coerceTypes, $typeSchema);
    }
    var $rulesGroup = it.RULES.types[$typeSchema];
    if ($coerceToTypes || $typeIsArray || $rulesGroup === true || ($rulesGroup && !$shouldUseGroup($rulesGroup))) {
      var $schemaPath = it.schemaPath + '.type',
        $errSchemaPath = it.errSchemaPath + '/type';
      var $schemaPath = it.schemaPath + '.type',
        $errSchemaPath = it.errSchemaPath + '/type',
        $method = $typeIsArray ? 'checkDataTypes' : 'checkDataType';
      out += ' if (' + (it.util[$method]($typeSchema, $data, true)) + ') { ';
      if ($coerceToTypes) {
        var $dataType = 'dataType' + $lvl,
          $coerced = 'coerced' + $lvl;
        out += ' var ' + ($dataType) + ' = typeof ' + ($data) + '; ';
        if (it.opts.coerceTypes == 'array') {
          out += ' if (' + ($dataType) + ' == \'object\' && Array.isArray(' + ($data) + ')) ' + ($dataType) + ' = \'array\'; ';
        }
        out += ' var ' + ($coerced) + ' = undefined; ';
        var $bracesCoercion = '';
        var arr1 = $coerceToTypes;
        if (arr1) {
          var $type, $i = -1,
            l1 = arr1.length - 1;
          while ($i < l1) {
            $type = arr1[$i += 1];
            if ($i) {
              out += ' if (' + ($coerced) + ' === undefined) { ';
              $bracesCoercion += '}';
            }
            if (it.opts.coerceTypes == 'array' && $type != 'array') {
              out += ' if (' + ($dataType) + ' == \'array\' && ' + ($data) + '.length == 1) { ' + ($coerced) + ' = ' + ($data) + ' = ' + ($data) + '[0]; ' + ($dataType) + ' = typeof ' + ($data) + ';  } ';
            }
            if ($type == 'string') {
              out += ' if (' + ($dataType) + ' == \'number\' || ' + ($dataType) + ' == \'boolean\') ' + ($coerced) + ' = \'\' + ' + ($data) + '; else if (' + ($data) + ' === null) ' + ($coerced) + ' = \'\'; ';
            } else if ($type == 'number' || $type == 'integer') {
              out += ' if (' + ($dataType) + ' == \'boolean\' || ' + ($data) + ' === null || (' + ($dataType) + ' == \'string\' && ' + ($data) + ' && ' + ($data) + ' == +' + ($data) + ' ';
              if ($type == 'integer') {
                out += ' && !(' + ($data) + ' % 1)';
              }
              out += ')) ' + ($coerced) + ' = +' + ($data) + '; ';
            } else if ($type == 'boolean') {
              out += ' if (' + ($data) + ' === \'false\' || ' + ($data) + ' === 0 || ' + ($data) + ' === null) ' + ($coerced) + ' = false; else if (' + ($data) + ' === \'true\' || ' + ($data) + ' === 1) ' + ($coerced) + ' = true; ';
            } else if ($type == 'null') {
              out += ' if (' + ($data) + ' === \'\' || ' + ($data) + ' === 0 || ' + ($data) + ' === false) ' + ($coerced) + ' = null; ';
            } else if (it.opts.coerceTypes == 'array' && $type == 'array') {
              out += ' if (' + ($dataType) + ' == \'string\' || ' + ($dataType) + ' == \'number\' || ' + ($dataType) + ' == \'boolean\' || ' + ($data) + ' == null) ' + ($coerced) + ' = [' + ($data) + ']; ';
            }
          }
        }
        out += ' ' + ($bracesCoercion) + ' if (' + ($coerced) + ' === undefined) {   ';
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \'';
          if ($typeIsArray) {
            out += '' + ($typeSchema.join(","));
          } else {
            out += '' + ($typeSchema);
          }
          out += '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'should be ';
            if ($typeIsArray) {
              out += '' + ($typeSchema.join(","));
            } else {
              out += '' + ($typeSchema);
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } else {  ';
        var $parentData = $dataLvl ? 'data' + (($dataLvl - 1) || '') : 'parentData',
          $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';
        out += ' ' + ($data) + ' = ' + ($coerced) + '; ';
        if (!$dataLvl) {
          out += 'if (' + ($parentData) + ' !== undefined)';
        }
        out += ' ' + ($parentData) + '[' + ($parentDataProperty) + '] = ' + ($coerced) + '; } ';
      } else {
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \'';
          if ($typeIsArray) {
            out += '' + ($typeSchema.join(","));
          } else {
            out += '' + ($typeSchema);
          }
          out += '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'should be ';
            if ($typeIsArray) {
              out += '' + ($typeSchema.join(","));
            } else {
              out += '' + ($typeSchema);
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
      }
      out += ' } ';
    }
  }
  if (it.schema.$ref && !$refKeywords) {
    out += ' ' + (it.RULES.all.$ref.code(it, '$ref')) + ' ';
    if ($breakOnError) {
      out += ' } if (errors === ';
      if ($top) {
        out += '0';
      } else {
        out += 'errs_' + ($lvl);
      }
      out += ') { ';
      $closingBraces2 += '}';
    }
  } else {
    var arr2 = it.RULES;
    if (arr2) {
      var $rulesGroup, i2 = -1,
        l2 = arr2.length - 1;
      while (i2 < l2) {
        $rulesGroup = arr2[i2 += 1];
        if ($shouldUseGroup($rulesGroup)) {
          if ($rulesGroup.type) {
            out += ' if (' + (it.util.checkDataType($rulesGroup.type, $data)) + ') { ';
          }
          if (it.opts.useDefaults && !it.compositeRule) {
            if ($rulesGroup.type == 'object' && it.schema.properties) {
              var $schema = it.schema.properties,
                $schemaKeys = Object.keys($schema);
              var arr3 = $schemaKeys;
              if (arr3) {
                var $propertyKey, i3 = -1,
                  l3 = arr3.length - 1;
                while (i3 < l3) {
                  $propertyKey = arr3[i3 += 1];
                  var $sch = $schema[$propertyKey];
                  if ($sch.default !== undefined) {
                    var $passData = $data + it.util.getProperty($propertyKey);
                    out += '  if (' + ($passData) + ' === undefined ';
                    if (it.opts.useDefaults == 'empty') {
                      out += ' || ' + ($passData) + ' === null || ' + ($passData) + ' === \'\' ';
                    }
                    out += ' ) ' + ($passData) + ' = ';
                    if (it.opts.useDefaults == 'shared') {
                      out += ' ' + (it.useDefault($sch.default)) + ' ';
                    } else {
                      out += ' ' + (JSON.stringify($sch.default)) + ' ';
                    }
                    out += '; ';
                  }
                }
              }
            } else if ($rulesGroup.type == 'array' && Array.isArray(it.schema.items)) {
              var arr4 = it.schema.items;
              if (arr4) {
                var $sch, $i = -1,
                  l4 = arr4.length - 1;
                while ($i < l4) {
                  $sch = arr4[$i += 1];
                  if ($sch.default !== undefined) {
                    var $passData = $data + '[' + $i + ']';
                    out += '  if (' + ($passData) + ' === undefined ';
                    if (it.opts.useDefaults == 'empty') {
                      out += ' || ' + ($passData) + ' === null || ' + ($passData) + ' === \'\' ';
                    }
                    out += ' ) ' + ($passData) + ' = ';
                    if (it.opts.useDefaults == 'shared') {
                      out += ' ' + (it.useDefault($sch.default)) + ' ';
                    } else {
                      out += ' ' + (JSON.stringify($sch.default)) + ' ';
                    }
                    out += '; ';
                  }
                }
              }
            }
          }
          var arr5 = $rulesGroup.rules;
          if (arr5) {
            var $rule, i5 = -1,
              l5 = arr5.length - 1;
            while (i5 < l5) {
              $rule = arr5[i5 += 1];
              if ($shouldUseRule($rule)) {
                var $code = $rule.code(it, $rule.keyword, $rulesGroup.type);
                if ($code) {
                  out += ' ' + ($code) + ' ';
                  if ($breakOnError) {
                    $closingBraces1 += '}';
                  }
                }
              }
            }
          }
          if ($breakOnError) {
            out += ' ' + ($closingBraces1) + ' ';
            $closingBraces1 = '';
          }
          if ($rulesGroup.type) {
            out += ' } ';
            if ($typeSchema && $typeSchema === $rulesGroup.type && !$coerceToTypes) {
              out += ' else { ';
              var $schemaPath = it.schemaPath + '.type',
                $errSchemaPath = it.errSchemaPath + '/type';
              var $$outStack = $$outStack || [];
              $$outStack.push(out);
              out = ''; /* istanbul ignore else */
              if (it.createErrors !== false) {
                out += ' { keyword: \'' + ($errorKeyword || 'type') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { type: \'';
                if ($typeIsArray) {
                  out += '' + ($typeSchema.join(","));
                } else {
                  out += '' + ($typeSchema);
                }
                out += '\' } ';
                if (it.opts.messages !== false) {
                  out += ' , message: \'should be ';
                  if ($typeIsArray) {
                    out += '' + ($typeSchema.join(","));
                  } else {
                    out += '' + ($typeSchema);
                  }
                  out += '\' ';
                }
                if (it.opts.verbose) {
                  out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
                }
                out += ' } ';
              } else {
                out += ' {} ';
              }
              var __err = out;
              out = $$outStack.pop();
              if (!it.compositeRule && $breakOnError) {
                /* istanbul ignore if */
                if (it.async) {
                  out += ' throw new ValidationError([' + (__err) + ']); ';
                } else {
                  out += ' validate.errors = [' + (__err) + ']; return false; ';
                }
              } else {
                out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
              }
              out += ' } ';
            }
          }
          if ($breakOnError) {
            out += ' if (errors === ';
            if ($top) {
              out += '0';
            } else {
              out += 'errs_' + ($lvl);
            }
            out += ') { ';
            $closingBraces2 += '}';
          }
        }
      }
    }
  }
  if ($breakOnError) {
    out += ' ' + ($closingBraces2) + ' ';
  }
  if ($top) {
    if ($async) {
      out += ' if (errors === 0) return data;           ';
      out += ' else throw new ValidationError(vErrors); ';
    } else {
      out += ' validate.errors = vErrors; ';
      out += ' return errors === 0;       ';
    }
    out += ' }; return validate;';
  } else {
    out += ' var ' + ($valid) + ' = errors === errs_' + ($lvl) + ';';
  }
  out = it.util.cleanUpCode(out);
  if ($top) {
    out = it.util.finalCleanUpCode(out, $async);
  }

  function $shouldUseGroup($rulesGroup) {
    var rules = $rulesGroup.rules;
    for (var i = 0; i < rules.length; i++)
      if ($shouldUseRule(rules[i])) return true;
  }

  function $shouldUseRule($rule) {
    return it.schema[$rule.keyword] !== undefined || ($rule.implements && $ruleImplementsSomeKeyword($rule));
  }

  function $ruleImplementsSomeKeyword($rule) {
    var impl = $rule.implements;
    for (var i = 0; i < impl.length; i++)
      if (it.schema[impl[i]] !== undefined) return true;
  }
  return out;
}


/***/ }),

/***/ "2jsQ":
/*!***************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/_limitItems.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate__limitItems(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $op = $keyword == 'maxItems' ? '>' : '<';
  out += 'if ( ';
  if ($isData) {
    out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \'number\') || ';
  }
  out += ' ' + ($data) + '.length ' + ($op) + ' ' + ($schemaValue) + ') { ';
  var $errorKeyword = $keyword;
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ($errorKeyword || '_limitItems') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { limit: ' + ($schemaValue) + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should NOT have ';
      if ($keyword == 'maxItems') {
        out += 'more';
      } else {
        out += 'fewer';
      }
      out += ' than ';
      if ($isData) {
        out += '\' + ' + ($schemaValue) + ' + \'';
      } else {
        out += '' + ($schema);
      }
      out += ' items\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + ($schemaPath);
      } else {
        out += '' + ($schema);
      }
      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "3ZNU":
/*!******************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/if.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_if(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $thenSch = it.schema['then'],
    $elseSch = it.schema['else'],
    $thenPresent = $thenSch !== undefined && it.util.schemaHasRules($thenSch, it.RULES.all),
    $elsePresent = $elseSch !== undefined && it.util.schemaHasRules($elseSch, it.RULES.all),
    $currentBaseId = $it.baseId;
  if ($thenPresent || $elsePresent) {
    var $ifClause;
    $it.createErrors = false;
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += ' var ' + ($errs) + ' = errors; var ' + ($valid) + ' = true;  ';
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    out += '  ' + (it.validate($it)) + ' ';
    $it.baseId = $currentBaseId;
    $it.createErrors = true;
    out += '  errors = ' + ($errs) + '; if (vErrors !== null) { if (' + ($errs) + ') vErrors.length = ' + ($errs) + '; else vErrors = null; }  ';
    it.compositeRule = $it.compositeRule = $wasComposite;
    if ($thenPresent) {
      out += ' if (' + ($nextValid) + ') {  ';
      $it.schema = it.schema['then'];
      $it.schemaPath = it.schemaPath + '.then';
      $it.errSchemaPath = it.errSchemaPath + '/then';
      out += '  ' + (it.validate($it)) + ' ';
      $it.baseId = $currentBaseId;
      out += ' ' + ($valid) + ' = ' + ($nextValid) + '; ';
      if ($thenPresent && $elsePresent) {
        $ifClause = 'ifClause' + $lvl;
        out += ' var ' + ($ifClause) + ' = \'then\'; ';
      } else {
        $ifClause = '\'then\'';
      }
      out += ' } ';
      if ($elsePresent) {
        out += ' else { ';
      }
    } else {
      out += ' if (!' + ($nextValid) + ') { ';
    }
    if ($elsePresent) {
      $it.schema = it.schema['else'];
      $it.schemaPath = it.schemaPath + '.else';
      $it.errSchemaPath = it.errSchemaPath + '/else';
      out += '  ' + (it.validate($it)) + ' ';
      $it.baseId = $currentBaseId;
      out += ' ' + ($valid) + ' = ' + ($nextValid) + '; ';
      if ($thenPresent && $elsePresent) {
        $ifClause = 'ifClause' + $lvl;
        out += ' var ' + ($ifClause) + ' = \'else\'; ';
      } else {
        $ifClause = '\'else\'';
      }
      out += ' } ';
    }
    out += ' if (!' + ($valid) + ') {   var err =   '; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ('if') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { failingKeyword: ' + ($ifClause) + ' } ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should match "\' + ' + ($ifClause) + ' + \'" schema\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError(vErrors); ';
      } else {
        out += ' validate.errors = vErrors; return false; ';
      }
    }
    out += ' }   ';
    if ($breakOnError) {
      out += ' else { ';
    }
    out = it.util.cleanUpCode(out);
  } else {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
  }
  return out;
}


/***/ }),

/***/ "6MIY":
/*!********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/enum.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_enum(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $i = 'i' + $lvl,
    $vSchema = 'schema' + $lvl;
  if (!$isData) {
    out += ' var ' + ($vSchema) + ' = validate.schema' + ($schemaPath) + ';';
  }
  out += 'var ' + ($valid) + ';';
  if ($isData) {
    out += ' if (schema' + ($lvl) + ' === undefined) ' + ($valid) + ' = true; else if (!Array.isArray(schema' + ($lvl) + ')) ' + ($valid) + ' = false; else {';
  }
  out += '' + ($valid) + ' = false;for (var ' + ($i) + '=0; ' + ($i) + '<' + ($vSchema) + '.length; ' + ($i) + '++) if (equal(' + ($data) + ', ' + ($vSchema) + '[' + ($i) + '])) { ' + ($valid) + ' = true; break; }';
  if ($isData) {
    out += '  }  ';
  }
  out += ' if (!' + ($valid) + ') {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ('enum') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { allowedValues: schema' + ($lvl) + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should be equal to one of the allowed values\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' }';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "6gcW":
/*!*********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/allOf.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_allOf(it, $keyword, $ruleType) {
  var out = ' ';
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $currentBaseId = $it.baseId,
    $allSchemasEmpty = true;
  var arr1 = $schema;
  if (arr1) {
    var $sch, $i = -1,
      l1 = arr1.length - 1;
    while ($i < l1) {
      $sch = arr1[$i += 1];
      if (it.util.schemaHasRules($sch, it.RULES.all)) {
        $allSchemasEmpty = false;
        $it.schema = $sch;
        $it.schemaPath = $schemaPath + '[' + $i + ']';
        $it.errSchemaPath = $errSchemaPath + '/' + $i;
        out += '  ' + (it.validate($it)) + ' ';
        $it.baseId = $currentBaseId;
        if ($breakOnError) {
          out += ' if (' + ($nextValid) + ') { ';
          $closingBraces += '}';
        }
      }
    }
  }
  if ($breakOnError) {
    if ($allSchemasEmpty) {
      out += ' if (true) { ';
    } else {
      out += ' ' + ($closingBraces.slice(0, -1)) + ' ';
    }
  }
  out = it.util.cleanUpCode(out);
  return out;
}


/***/ }),

/***/ "6pwk":
/*!***************************************!*\
  !*** ./node_modules/ajv/lib/cache.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var Cache = module.exports = function Cache() {
  this._cache = {};
};


Cache.prototype.put = function Cache_put(key, value) {
  this._cache[key] = value;
};


Cache.prototype.get = function Cache_get(key) {
  return this._cache[key];
};


Cache.prototype.del = function Cache_del(key) {
  delete this._cache[key];
};


Cache.prototype.clear = function Cache_clear() {
  this._cache = {};
};


/***/ }),

/***/ "AK1u":
/*!**********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/format.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_format(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  if (it.opts.format === false) {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
    return out;
  }
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $unknownFormats = it.opts.unknownFormats,
    $allowUnknown = Array.isArray($unknownFormats);
  if ($isData) {
    var $format = 'format' + $lvl,
      $isObject = 'isObject' + $lvl,
      $formatType = 'formatType' + $lvl;
    out += ' var ' + ($format) + ' = formats[' + ($schemaValue) + ']; var ' + ($isObject) + ' = typeof ' + ($format) + ' == \'object\' && !(' + ($format) + ' instanceof RegExp) && ' + ($format) + '.validate; var ' + ($formatType) + ' = ' + ($isObject) + ' && ' + ($format) + '.type || \'string\'; if (' + ($isObject) + ') { ';
    if (it.async) {
      out += ' var async' + ($lvl) + ' = ' + ($format) + '.async; ';
    }
    out += ' ' + ($format) + ' = ' + ($format) + '.validate; } if (  ';
    if ($isData) {
      out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \'string\') || ';
    }
    out += ' (';
    if ($unknownFormats != 'ignore') {
      out += ' (' + ($schemaValue) + ' && !' + ($format) + ' ';
      if ($allowUnknown) {
        out += ' && self._opts.unknownFormats.indexOf(' + ($schemaValue) + ') == -1 ';
      }
      out += ') || ';
    }
    out += ' (' + ($format) + ' && ' + ($formatType) + ' == \'' + ($ruleType) + '\' && !(typeof ' + ($format) + ' == \'function\' ? ';
    if (it.async) {
      out += ' (async' + ($lvl) + ' ? await ' + ($format) + '(' + ($data) + ') : ' + ($format) + '(' + ($data) + ')) ';
    } else {
      out += ' ' + ($format) + '(' + ($data) + ') ';
    }
    out += ' : ' + ($format) + '.test(' + ($data) + '))))) {';
  } else {
    var $format = it.formats[$schema];
    if (!$format) {
      if ($unknownFormats == 'ignore') {
        it.logger.warn('unknown format "' + $schema + '" ignored in schema at path "' + it.errSchemaPath + '"');
        if ($breakOnError) {
          out += ' if (true) { ';
        }
        return out;
      } else if ($allowUnknown && $unknownFormats.indexOf($schema) >= 0) {
        if ($breakOnError) {
          out += ' if (true) { ';
        }
        return out;
      } else {
        throw new Error('unknown format "' + $schema + '" is used in schema at path "' + it.errSchemaPath + '"');
      }
    }
    var $isObject = typeof $format == 'object' && !($format instanceof RegExp) && $format.validate;
    var $formatType = $isObject && $format.type || 'string';
    if ($isObject) {
      var $async = $format.async === true;
      $format = $format.validate;
    }
    if ($formatType != $ruleType) {
      if ($breakOnError) {
        out += ' if (true) { ';
      }
      return out;
    }
    if ($async) {
      if (!it.async) throw new Error('async format in sync schema');
      var $formatRef = 'formats' + it.util.getProperty($schema) + '.validate';
      out += ' if (!(await ' + ($formatRef) + '(' + ($data) + '))) { ';
    } else {
      out += ' if (! ';
      var $formatRef = 'formats' + it.util.getProperty($schema);
      if ($isObject) $formatRef += '.validate';
      if (typeof $format == 'function') {
        out += ' ' + ($formatRef) + '(' + ($data) + ') ';
      } else {
        out += ' ' + ($formatRef) + '.test(' + ($data) + ') ';
      }
      out += ') { ';
    }
  }
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ('format') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { format:  ';
    if ($isData) {
      out += '' + ($schemaValue);
    } else {
      out += '' + (it.util.toQuotedString($schema));
    }
    out += '  } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should match format "';
      if ($isData) {
        out += '\' + ' + ($schemaValue) + ' + \'';
      } else {
        out += '' + (it.util.escapeQuotes($schema));
      }
      out += '"\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + ($schemaPath);
      } else {
        out += '' + (it.util.toQuotedString($schema));
      }
      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' } ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "APWh":
/*!*******************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/not.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_not(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  if (it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += ' var ' + ($errs) + ' = errors;  ';
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    $it.createErrors = false;
    var $allErrorsOption;
    if ($it.opts.allErrors) {
      $allErrorsOption = $it.opts.allErrors;
      $it.opts.allErrors = false;
    }
    out += ' ' + (it.validate($it)) + ' ';
    $it.createErrors = true;
    if ($allErrorsOption) $it.opts.allErrors = $allErrorsOption;
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' if (' + ($nextValid) + ') {   ';
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ('not') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should NOT be valid\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + (__err) + ']); ';
      } else {
        out += ' validate.errors = [' + (__err) + ']; return false; ';
      }
    } else {
      out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    out += ' } else {  errors = ' + ($errs) + '; if (vErrors !== null) { if (' + ($errs) + ') vErrors.length = ' + ($errs) + '; else vErrors = null; } ';
    if (it.opts.allErrors) {
      out += ' } ';
    }
  } else {
    out += '  var err =   '; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ('not') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should NOT be valid\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if ($breakOnError) {
      out += ' if (false) { ';
    }
  }
  return out;
}


/***/ }),

/***/ "AwJw":
/*!*********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/const.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_const(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  if (!$isData) {
    out += ' var schema' + ($lvl) + ' = validate.schema' + ($schemaPath) + ';';
  }
  out += 'var ' + ($valid) + ' = equal(' + ($data) + ', schema' + ($lvl) + '); if (!' + ($valid) + ') {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ('const') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { allowedValue: schema' + ($lvl) + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should be equal to constant\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' }';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "Dg32":
/*!*************************************************************!*\
  !*** ./node_modules/ajv/lib/refs/json-schema-draft-06.json ***!
  \*************************************************************/
/*! exports provided: $schema, $id, title, definitions, type, properties, default */
/***/ (function(module) {

module.exports = {"$schema":"http://json-schema.org/draft-06/schema#","$id":"http://json-schema.org/draft-06/schema#","title":"Core schema meta-schema","definitions":{"schemaArray":{"type":"array","minItems":1,"items":{"$ref":"#"}},"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"allOf":[{"$ref":"#/definitions/nonNegativeInteger"},{"default":0}]},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}},"type":["object","boolean"],"properties":{"$id":{"type":"string","format":"uri-reference"},"$schema":{"type":"string","format":"uri"},"$ref":{"type":"string","format":"uri-reference"},"title":{"type":"string"},"description":{"type":"string"},"default":{},"examples":{"type":"array","items":{}},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/definitions/nonNegativeInteger"},"minLength":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"additionalItems":{"$ref":"#"},"items":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/schemaArray"}],"default":{}},"maxItems":{"$ref":"#/definitions/nonNegativeInteger"},"minItems":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"contains":{"$ref":"#"},"maxProperties":{"$ref":"#/definitions/nonNegativeInteger"},"minProperties":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"required":{"$ref":"#/definitions/stringArray"},"additionalProperties":{"$ref":"#"},"definitions":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"properties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/stringArray"}]}},"propertyNames":{"$ref":"#"},"const":{},"enum":{"type":"array","minItems":1,"uniqueItems":true},"type":{"anyOf":[{"$ref":"#/definitions/simpleTypes"},{"type":"array","items":{"$ref":"#/definitions/simpleTypes"},"minItems":1,"uniqueItems":true}]},"format":{"type":"string"},"allOf":{"$ref":"#/definitions/schemaArray"},"anyOf":{"$ref":"#/definitions/schemaArray"},"oneOf":{"$ref":"#/definitions/schemaArray"},"not":{"$ref":"#"}},"default":{}};

/***/ }),

/***/ "RsDv":
/*!*********************************************!*\
  !*** ./node_modules/ajv/lib/refs/data.json ***!
  \*********************************************/
/*! exports provided: $schema, $id, description, type, required, properties, additionalProperties, default */
/***/ (function(module) {

module.exports = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/data.json#","description":"Meta-schema for $data reference (JSON Schema extension proposal)","type":"object","required":["$data"],"properties":{"$data":{"type":"string","anyOf":[{"format":"relative-json-pointer"},{"format":"json-pointer"}]}},"additionalProperties":false};

/***/ }),

/***/ "TbEC":
/*!*********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/oneOf.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_oneOf(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $currentBaseId = $it.baseId,
    $prevValid = 'prevValid' + $lvl,
    $passingSchemas = 'passingSchemas' + $lvl;
  out += 'var ' + ($errs) + ' = errors , ' + ($prevValid) + ' = false , ' + ($valid) + ' = false , ' + ($passingSchemas) + ' = null; ';
  var $wasComposite = it.compositeRule;
  it.compositeRule = $it.compositeRule = true;
  var arr1 = $schema;
  if (arr1) {
    var $sch, $i = -1,
      l1 = arr1.length - 1;
    while ($i < l1) {
      $sch = arr1[$i += 1];
      if (it.util.schemaHasRules($sch, it.RULES.all)) {
        $it.schema = $sch;
        $it.schemaPath = $schemaPath + '[' + $i + ']';
        $it.errSchemaPath = $errSchemaPath + '/' + $i;
        out += '  ' + (it.validate($it)) + ' ';
        $it.baseId = $currentBaseId;
      } else {
        out += ' var ' + ($nextValid) + ' = true; ';
      }
      if ($i) {
        out += ' if (' + ($nextValid) + ' && ' + ($prevValid) + ') { ' + ($valid) + ' = false; ' + ($passingSchemas) + ' = [' + ($passingSchemas) + ', ' + ($i) + ']; } else { ';
        $closingBraces += '}';
      }
      out += ' if (' + ($nextValid) + ') { ' + ($valid) + ' = ' + ($prevValid) + ' = true; ' + ($passingSchemas) + ' = ' + ($i) + '; }';
    }
  }
  it.compositeRule = $it.compositeRule = $wasComposite;
  out += '' + ($closingBraces) + 'if (!' + ($valid) + ') {   var err =   '; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ('oneOf') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { passingSchemas: ' + ($passingSchemas) + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should match exactly one schema in oneOf\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError(vErrors); ';
    } else {
      out += ' validate.errors = vErrors; return false; ';
    }
  }
  out += '} else {  errors = ' + ($errs) + '; if (vErrors !== null) { if (' + ($errs) + ') vErrors.length = ' + ($errs) + '; else vErrors = null; }';
  if (it.opts.allErrors) {
    out += ' } ';
  }
  return out;
}


/***/ }),

/***/ "XD0j":
/*!***********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/comment.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_comment(it, $keyword, $ruleType) {
  var out = ' ';
  var $schema = it.schema[$keyword];
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $comment = it.util.toQuotedString($schema);
  if (it.opts.$comment === true) {
    out += ' console.log(' + ($comment) + ');';
  } else if (typeof it.opts.$comment == 'function') {
    out += ' self._opts.$comment(' + ($comment) + ', ' + (it.util.toQuotedString($errSchemaPath)) + ', validate.root.schema);';
  }
  return out;
}


/***/ }),

/***/ "XPXQ":
/*!************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/contains.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_contains(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $idx = 'i' + $lvl,
    $dataNxt = $it.dataLevel = it.dataLevel + 1,
    $nextData = 'data' + $dataNxt,
    $currentBaseId = it.baseId,
    $nonEmptySchema = it.util.schemaHasRules($schema, it.RULES.all);
  out += 'var ' + ($errs) + ' = errors;var ' + ($valid) + ';';
  if ($nonEmptySchema) {
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += ' var ' + ($nextValid) + ' = false; for (var ' + ($idx) + ' = 0; ' + ($idx) + ' < ' + ($data) + '.length; ' + ($idx) + '++) { ';
    $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
    var $passData = $data + '[' + $idx + ']';
    $it.dataPathArr[$dataNxt] = $idx;
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
    if (it.util.varOccurences($code, $nextData) < 2) {
      out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';
    } else {
      out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';
    }
    out += ' if (' + ($nextValid) + ') break; }  ';
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' ' + ($closingBraces) + ' if (!' + ($nextValid) + ') {';
  } else {
    out += ' if (' + ($data) + '.length == 0) {';
  }
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ('contains') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should contain a valid item\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' } else { ';
  if ($nonEmptySchema) {
    out += '  errors = ' + ($errs) + '; if (vErrors !== null) { if (' + ($errs) + ') vErrors.length = ' + ($errs) + '; else vErrors = null; } ';
  }
  if (it.opts.allErrors) {
    out += ' } ';
  }
  out = it.util.cleanUpCode(out);
  return out;
}


/***/ }),

/***/ "Y3YA":
/*!*********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//all requires must be explicit because browserify won't work with dynamic requires
module.exports = {
  '$ref': __webpack_require__(/*! ./ref */ "bvhh"),
  allOf: __webpack_require__(/*! ./allOf */ "6gcW"),
  anyOf: __webpack_require__(/*! ./anyOf */ "YPXT"),
  '$comment': __webpack_require__(/*! ./comment */ "XD0j"),
  const: __webpack_require__(/*! ./const */ "AwJw"),
  contains: __webpack_require__(/*! ./contains */ "XPXQ"),
  dependencies: __webpack_require__(/*! ./dependencies */ "uSCx"),
  'enum': __webpack_require__(/*! ./enum */ "6MIY"),
  format: __webpack_require__(/*! ./format */ "AK1u"),
  'if': __webpack_require__(/*! ./if */ "3ZNU"),
  items: __webpack_require__(/*! ./items */ "eY4P"),
  maximum: __webpack_require__(/*! ./_limit */ "v43d"),
  minimum: __webpack_require__(/*! ./_limit */ "v43d"),
  maxItems: __webpack_require__(/*! ./_limitItems */ "2jsQ"),
  minItems: __webpack_require__(/*! ./_limitItems */ "2jsQ"),
  maxLength: __webpack_require__(/*! ./_limitLength */ "mQYA"),
  minLength: __webpack_require__(/*! ./_limitLength */ "mQYA"),
  maxProperties: __webpack_require__(/*! ./_limitProperties */ "d+r/"),
  minProperties: __webpack_require__(/*! ./_limitProperties */ "d+r/"),
  multipleOf: __webpack_require__(/*! ./multipleOf */ "qTHO"),
  not: __webpack_require__(/*! ./not */ "APWh"),
  oneOf: __webpack_require__(/*! ./oneOf */ "TbEC"),
  pattern: __webpack_require__(/*! ./pattern */ "cUtX"),
  properties: __webpack_require__(/*! ./properties */ "vVvC"),
  propertyNames: __webpack_require__(/*! ./propertyNames */ "bWPq"),
  required: __webpack_require__(/*! ./required */ "t+aO"),
  uniqueItems: __webpack_require__(/*! ./uniqueItems */ "0w4r"),
  validate: __webpack_require__(/*! ./validate */ "1QhW")
};


/***/ }),

/***/ "YPXT":
/*!*********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/anyOf.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_anyOf(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $noEmptySchema = $schema.every(function($sch) {
    return it.util.schemaHasRules($sch, it.RULES.all);
  });
  if ($noEmptySchema) {
    var $currentBaseId = $it.baseId;
    out += ' var ' + ($errs) + ' = errors; var ' + ($valid) + ' = false;  ';
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    var arr1 = $schema;
    if (arr1) {
      var $sch, $i = -1,
        l1 = arr1.length - 1;
      while ($i < l1) {
        $sch = arr1[$i += 1];
        $it.schema = $sch;
        $it.schemaPath = $schemaPath + '[' + $i + ']';
        $it.errSchemaPath = $errSchemaPath + '/' + $i;
        out += '  ' + (it.validate($it)) + ' ';
        $it.baseId = $currentBaseId;
        out += ' ' + ($valid) + ' = ' + ($valid) + ' || ' + ($nextValid) + '; if (!' + ($valid) + ') { ';
        $closingBraces += '}';
      }
    }
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' ' + ($closingBraces) + ' if (!' + ($valid) + ') {   var err =   '; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ('anyOf') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should match some schema in anyOf\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError(vErrors); ';
      } else {
        out += ' validate.errors = vErrors; return false; ';
      }
    }
    out += ' } else {  errors = ' + ($errs) + '; if (vErrors !== null) { if (' + ($errs) + ') vErrors.length = ' + ($errs) + '; else vErrors = null; } ';
    if (it.opts.allErrors) {
      out += ' } ';
    }
    out = it.util.cleanUpCode(out);
  } else {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
  }
  return out;
}


/***/ }),

/***/ "ZsDt":
/*!**************************************!*\
  !*** ./node_modules/ajv/lib/data.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var KEYWORDS = [
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
  'maxLength',
  'minLength',
  'pattern',
  'additionalItems',
  'maxItems',
  'minItems',
  'uniqueItems',
  'maxProperties',
  'minProperties',
  'required',
  'additionalProperties',
  'enum',
  'format',
  'const'
];

module.exports = function (metaSchema, keywordsJsonPointers) {
  for (var i=0; i<keywordsJsonPointers.length; i++) {
    metaSchema = JSON.parse(JSON.stringify(metaSchema));
    var segments = keywordsJsonPointers[i].split('/');
    var keywords = metaSchema;
    var j;
    for (j=1; j<segments.length; j++)
      keywords = keywords[segments[j]];

    for (j=0; j<KEYWORDS.length; j++) {
      var key = KEYWORDS[j];
      var schema = keywords[key];
      if (schema) {
        keywords[key] = {
          anyOf: [
            schema,
            { $ref: 'https://raw.githubusercontent.com/epoberezkin/ajv/master/lib/refs/data.json#' }
          ]
        };
      }
    }
  }

  return metaSchema;
};


/***/ }),

/***/ "bWPq":
/*!*****************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/propertyNames.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_propertyNames(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  out += 'var ' + ($errs) + ' = errors;';
  if (it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    var $key = 'key' + $lvl,
      $idx = 'idx' + $lvl,
      $i = 'i' + $lvl,
      $invalidName = '\' + ' + $key + ' + \'',
      $dataNxt = $it.dataLevel = it.dataLevel + 1,
      $nextData = 'data' + $dataNxt,
      $dataProperties = 'dataProperties' + $lvl,
      $ownProperties = it.opts.ownProperties,
      $currentBaseId = it.baseId;
    if ($ownProperties) {
      out += ' var ' + ($dataProperties) + ' = undefined; ';
    }
    if ($ownProperties) {
      out += ' ' + ($dataProperties) + ' = ' + ($dataProperties) + ' || Object.keys(' + ($data) + '); for (var ' + ($idx) + '=0; ' + ($idx) + '<' + ($dataProperties) + '.length; ' + ($idx) + '++) { var ' + ($key) + ' = ' + ($dataProperties) + '[' + ($idx) + ']; ';
    } else {
      out += ' for (var ' + ($key) + ' in ' + ($data) + ') { ';
    }
    out += ' var startErrs' + ($lvl) + ' = errors; ';
    var $passData = $key;
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
    if (it.util.varOccurences($code, $nextData) < 2) {
      out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';
    } else {
      out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';
    }
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' if (!' + ($nextValid) + ') { for (var ' + ($i) + '=startErrs' + ($lvl) + '; ' + ($i) + '<errors; ' + ($i) + '++) { vErrors[' + ($i) + '].propertyName = ' + ($key) + '; }   var err =   '; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ('propertyNames') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { propertyName: \'' + ($invalidName) + '\' } ';
      if (it.opts.messages !== false) {
        out += ' , message: \'property name \\\'' + ($invalidName) + '\\\' is invalid\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError(vErrors); ';
      } else {
        out += ' validate.errors = vErrors; return false; ';
      }
    }
    if ($breakOnError) {
      out += ' break; ';
    }
    out += ' } }';
  }
  if ($breakOnError) {
    out += ' ' + ($closingBraces) + ' if (' + ($errs) + ' == errors) {';
  }
  out = it.util.cleanUpCode(out);
  return out;
}


/***/ }),

/***/ "bnbC":
/*!*************************************************************!*\
  !*** ./node_modules/ajv/lib/refs/json-schema-draft-07.json ***!
  \*************************************************************/
/*! exports provided: $schema, $id, title, definitions, type, properties, default */
/***/ (function(module) {

module.exports = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"http://json-schema.org/draft-07/schema#","title":"Core schema meta-schema","definitions":{"schemaArray":{"type":"array","minItems":1,"items":{"$ref":"#"}},"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"allOf":[{"$ref":"#/definitions/nonNegativeInteger"},{"default":0}]},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}},"type":["object","boolean"],"properties":{"$id":{"type":"string","format":"uri-reference"},"$schema":{"type":"string","format":"uri"},"$ref":{"type":"string","format":"uri-reference"},"$comment":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"},"default":true,"readOnly":{"type":"boolean","default":false},"examples":{"type":"array","items":true},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/definitions/nonNegativeInteger"},"minLength":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"additionalItems":{"$ref":"#"},"items":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/schemaArray"}],"default":true},"maxItems":{"$ref":"#/definitions/nonNegativeInteger"},"minItems":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"contains":{"$ref":"#"},"maxProperties":{"$ref":"#/definitions/nonNegativeInteger"},"minProperties":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"required":{"$ref":"#/definitions/stringArray"},"additionalProperties":{"$ref":"#"},"definitions":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"properties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$ref":"#"},"propertyNames":{"format":"regex"},"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/stringArray"}]}},"propertyNames":{"$ref":"#"},"const":true,"enum":{"type":"array","items":true,"minItems":1,"uniqueItems":true},"type":{"anyOf":[{"$ref":"#/definitions/simpleTypes"},{"type":"array","items":{"$ref":"#/definitions/simpleTypes"},"minItems":1,"uniqueItems":true}]},"format":{"type":"string"},"contentMediaType":{"type":"string"},"contentEncoding":{"type":"string"},"if":{"$ref":"#"},"then":{"$ref":"#"},"else":{"$ref":"#"},"allOf":{"$ref":"#/definitions/schemaArray"},"anyOf":{"$ref":"#/definitions/schemaArray"},"oneOf":{"$ref":"#/definitions/schemaArray"},"not":{"$ref":"#"}},"default":true};

/***/ }),

/***/ "bvhh":
/*!*******************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/ref.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_ref(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $async, $refCode;
  if ($schema == '#' || $schema == '#/') {
    if (it.isRoot) {
      $async = it.async;
      $refCode = 'validate';
    } else {
      $async = it.root.schema.$async === true;
      $refCode = 'root.refVal[0]';
    }
  } else {
    var $refVal = it.resolveRef(it.baseId, $schema, it.isRoot);
    if ($refVal === undefined) {
      var $message = it.MissingRefError.message(it.baseId, $schema);
      if (it.opts.missingRefs == 'fail') {
        it.logger.error($message);
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ('$ref') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { ref: \'' + (it.util.escapeQuotes($schema)) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'can\\\'t resolve reference ' + (it.util.escapeQuotes($schema)) + '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: ' + (it.util.toQuotedString($schema)) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        if ($breakOnError) {
          out += ' if (false) { ';
        }
      } else if (it.opts.missingRefs == 'ignore') {
        it.logger.warn($message);
        if ($breakOnError) {
          out += ' if (true) { ';
        }
      } else {
        throw new it.MissingRefError(it.baseId, $schema, $message);
      }
    } else if ($refVal.inline) {
      var $it = it.util.copy(it);
      $it.level++;
      var $nextValid = 'valid' + $it.level;
      $it.schema = $refVal.schema;
      $it.schemaPath = '';
      $it.errSchemaPath = $schema;
      var $code = it.validate($it).replace(/validate\.schema/g, $refVal.code);
      out += ' ' + ($code) + ' ';
      if ($breakOnError) {
        out += ' if (' + ($nextValid) + ') { ';
      }
    } else {
      $async = $refVal.$async === true || (it.async && $refVal.$async !== false);
      $refCode = $refVal.code;
    }
  }
  if ($refCode) {
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = '';
    if (it.opts.passContext) {
      out += ' ' + ($refCode) + '.call(this, ';
    } else {
      out += ' ' + ($refCode) + '( ';
    }
    out += ' ' + ($data) + ', (dataPath || \'\')';
    if (it.errorPath != '""') {
      out += ' + ' + (it.errorPath);
    }
    var $parentData = $dataLvl ? 'data' + (($dataLvl - 1) || '') : 'parentData',
      $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';
    out += ' , ' + ($parentData) + ' , ' + ($parentDataProperty) + ', rootData)  ';
    var __callValidate = out;
    out = $$outStack.pop();
    if ($async) {
      if (!it.async) throw new Error('async schema referenced by sync schema');
      if ($breakOnError) {
        out += ' var ' + ($valid) + '; ';
      }
      out += ' try { await ' + (__callValidate) + '; ';
      if ($breakOnError) {
        out += ' ' + ($valid) + ' = true; ';
      }
      out += ' } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ';
      if ($breakOnError) {
        out += ' ' + ($valid) + ' = false; ';
      }
      out += ' } ';
      if ($breakOnError) {
        out += ' if (' + ($valid) + ') { ';
      }
    } else {
      out += ' if (!' + (__callValidate) + ') { if (vErrors === null) vErrors = ' + ($refCode) + '.errors; else vErrors = vErrors.concat(' + ($refCode) + '.errors); errors = vErrors.length; } ';
      if ($breakOnError) {
        out += ' else { ';
      }
    }
  }
  return out;
}


/***/ }),

/***/ "cUtX":
/*!***********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/pattern.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_pattern(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $regexp = $isData ? '(new RegExp(' + $schemaValue + '))' : it.usePattern($schema);
  out += 'if ( ';
  if ($isData) {
    out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \'string\') || ';
  }
  out += ' !' + ($regexp) + '.test(' + ($data) + ') ) {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ('pattern') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { pattern:  ';
    if ($isData) {
      out += '' + ($schemaValue);
    } else {
      out += '' + (it.util.toQuotedString($schema));
    }
    out += '  } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should match pattern "';
      if ($isData) {
        out += '\' + ' + ($schemaValue) + ' + \'';
      } else {
        out += '' + (it.util.escapeQuotes($schema));
      }
      out += '"\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + ($schemaPath);
      } else {
        out += '' + (it.util.toQuotedString($schema));
      }
      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "cjZW":
/*!**********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/custom.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_custom(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $rule = this,
    $definition = 'definition' + $lvl,
    $rDef = $rule.definition,
    $closingBraces = '';
  var $compile, $inline, $macro, $ruleValidate, $validateCode;
  if ($isData && $rDef.$data) {
    $validateCode = 'keywordValidate' + $lvl;
    var $validateSchema = $rDef.validateSchema;
    out += ' var ' + ($definition) + ' = RULES.custom[\'' + ($keyword) + '\'].definition; var ' + ($validateCode) + ' = ' + ($definition) + '.validate;';
  } else {
    $ruleValidate = it.useCustomRule($rule, $schema, it.schema, it);
    if (!$ruleValidate) return;
    $schemaValue = 'validate.schema' + $schemaPath;
    $validateCode = $ruleValidate.code;
    $compile = $rDef.compile;
    $inline = $rDef.inline;
    $macro = $rDef.macro;
  }
  var $ruleErrs = $validateCode + '.errors',
    $i = 'i' + $lvl,
    $ruleErr = 'ruleErr' + $lvl,
    $asyncKeyword = $rDef.async;
  if ($asyncKeyword && !it.async) throw new Error('async keyword in sync schema');
  if (!($inline || $macro)) {
    out += '' + ($ruleErrs) + ' = null;';
  }
  out += 'var ' + ($errs) + ' = errors;var ' + ($valid) + ';';
  if ($isData && $rDef.$data) {
    $closingBraces += '}';
    out += ' if (' + ($schemaValue) + ' === undefined) { ' + ($valid) + ' = true; } else { ';
    if ($validateSchema) {
      $closingBraces += '}';
      out += ' ' + ($valid) + ' = ' + ($definition) + '.validateSchema(' + ($schemaValue) + '); if (' + ($valid) + ') { ';
    }
  }
  if ($inline) {
    if ($rDef.statements) {
      out += ' ' + ($ruleValidate.validate) + ' ';
    } else {
      out += ' ' + ($valid) + ' = ' + ($ruleValidate.validate) + '; ';
    }
  } else if ($macro) {
    var $it = it.util.copy(it);
    var $closingBraces = '';
    $it.level++;
    var $nextValid = 'valid' + $it.level;
    $it.schema = $ruleValidate.validate;
    $it.schemaPath = '';
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    var $code = it.validate($it).replace(/validate\.schema/g, $validateCode);
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' ' + ($code);
  } else {
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = '';
    out += '  ' + ($validateCode) + '.call( ';
    if (it.opts.passContext) {
      out += 'this';
    } else {
      out += 'self';
    }
    if ($compile || $rDef.schema === false) {
      out += ' , ' + ($data) + ' ';
    } else {
      out += ' , ' + ($schemaValue) + ' , ' + ($data) + ' , validate.schema' + (it.schemaPath) + ' ';
    }
    out += ' , (dataPath || \'\')';
    if (it.errorPath != '""') {
      out += ' + ' + (it.errorPath);
    }
    var $parentData = $dataLvl ? 'data' + (($dataLvl - 1) || '') : 'parentData',
      $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty';
    out += ' , ' + ($parentData) + ' , ' + ($parentDataProperty) + ' , rootData )  ';
    var def_callRuleValidate = out;
    out = $$outStack.pop();
    if ($rDef.errors === false) {
      out += ' ' + ($valid) + ' = ';
      if ($asyncKeyword) {
        out += 'await ';
      }
      out += '' + (def_callRuleValidate) + '; ';
    } else {
      if ($asyncKeyword) {
        $ruleErrs = 'customErrors' + $lvl;
        out += ' var ' + ($ruleErrs) + ' = null; try { ' + ($valid) + ' = await ' + (def_callRuleValidate) + '; } catch (e) { ' + ($valid) + ' = false; if (e instanceof ValidationError) ' + ($ruleErrs) + ' = e.errors; else throw e; } ';
      } else {
        out += ' ' + ($ruleErrs) + ' = null; ' + ($valid) + ' = ' + (def_callRuleValidate) + '; ';
      }
    }
  }
  if ($rDef.modifying) {
    out += ' if (' + ($parentData) + ') ' + ($data) + ' = ' + ($parentData) + '[' + ($parentDataProperty) + '];';
  }
  out += '' + ($closingBraces);
  if ($rDef.valid) {
    if ($breakOnError) {
      out += ' if (true) { ';
    }
  } else {
    out += ' if ( ';
    if ($rDef.valid === undefined) {
      out += ' !';
      if ($macro) {
        out += '' + ($nextValid);
      } else {
        out += '' + ($valid);
      }
    } else {
      out += ' ' + (!$rDef.valid) + ' ';
    }
    out += ') { ';
    $errorKeyword = $rule.keyword;
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = '';
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ($errorKeyword || 'custom') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { keyword: \'' + ($rule.keyword) + '\' } ';
      if (it.opts.messages !== false) {
        out += ' , message: \'should pass "' + ($rule.keyword) + '" keyword validation\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + (__err) + ']); ';
      } else {
        out += ' validate.errors = [' + (__err) + ']; return false; ';
      }
    } else {
      out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    var def_customError = out;
    out = $$outStack.pop();
    if ($inline) {
      if ($rDef.errors) {
        if ($rDef.errors != 'full') {
          out += '  for (var ' + ($i) + '=' + ($errs) + '; ' + ($i) + '<errors; ' + ($i) + '++) { var ' + ($ruleErr) + ' = vErrors[' + ($i) + ']; if (' + ($ruleErr) + '.dataPath === undefined) ' + ($ruleErr) + '.dataPath = (dataPath || \'\') + ' + (it.errorPath) + '; if (' + ($ruleErr) + '.schemaPath === undefined) { ' + ($ruleErr) + '.schemaPath = "' + ($errSchemaPath) + '"; } ';
          if (it.opts.verbose) {
            out += ' ' + ($ruleErr) + '.schema = ' + ($schemaValue) + '; ' + ($ruleErr) + '.data = ' + ($data) + '; ';
          }
          out += ' } ';
        }
      } else {
        if ($rDef.errors === false) {
          out += ' ' + (def_customError) + ' ';
        } else {
          out += ' if (' + ($errs) + ' == errors) { ' + (def_customError) + ' } else {  for (var ' + ($i) + '=' + ($errs) + '; ' + ($i) + '<errors; ' + ($i) + '++) { var ' + ($ruleErr) + ' = vErrors[' + ($i) + ']; if (' + ($ruleErr) + '.dataPath === undefined) ' + ($ruleErr) + '.dataPath = (dataPath || \'\') + ' + (it.errorPath) + '; if (' + ($ruleErr) + '.schemaPath === undefined) { ' + ($ruleErr) + '.schemaPath = "' + ($errSchemaPath) + '"; } ';
          if (it.opts.verbose) {
            out += ' ' + ($ruleErr) + '.schema = ' + ($schemaValue) + '; ' + ($ruleErr) + '.data = ' + ($data) + '; ';
          }
          out += ' } } ';
        }
      }
    } else if ($macro) {
      out += '   var err =   '; /* istanbul ignore else */
      if (it.createErrors !== false) {
        out += ' { keyword: \'' + ($errorKeyword || 'custom') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { keyword: \'' + ($rule.keyword) + '\' } ';
        if (it.opts.messages !== false) {
          out += ' , message: \'should pass "' + ($rule.keyword) + '" keyword validation\' ';
        }
        if (it.opts.verbose) {
          out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
        }
        out += ' } ';
      } else {
        out += ' {} ';
      }
      out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
      if (!it.compositeRule && $breakOnError) {
        /* istanbul ignore if */
        if (it.async) {
          out += ' throw new ValidationError(vErrors); ';
        } else {
          out += ' validate.errors = vErrors; return false; ';
        }
      }
    } else {
      if ($rDef.errors === false) {
        out += ' ' + (def_customError) + ' ';
      } else {
        out += ' if (Array.isArray(' + ($ruleErrs) + ')) { if (vErrors === null) vErrors = ' + ($ruleErrs) + '; else vErrors = vErrors.concat(' + ($ruleErrs) + '); errors = vErrors.length;  for (var ' + ($i) + '=' + ($errs) + '; ' + ($i) + '<errors; ' + ($i) + '++) { var ' + ($ruleErr) + ' = vErrors[' + ($i) + ']; if (' + ($ruleErr) + '.dataPath === undefined) ' + ($ruleErr) + '.dataPath = (dataPath || \'\') + ' + (it.errorPath) + ';  ' + ($ruleErr) + '.schemaPath = "' + ($errSchemaPath) + '";  ';
        if (it.opts.verbose) {
          out += ' ' + ($ruleErr) + '.schema = ' + ($schemaValue) + '; ' + ($ruleErr) + '.data = ' + ($data) + '; ';
        }
        out += ' } } else { ' + (def_customError) + ' } ';
      }
    }
    out += ' } ';
    if ($breakOnError) {
      out += ' else { ';
    }
  }
  return out;
}


/***/ }),

/***/ "d+r/":
/*!********************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/_limitProperties.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate__limitProperties(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $op = $keyword == 'maxProperties' ? '>' : '<';
  out += 'if ( ';
  if ($isData) {
    out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \'number\') || ';
  }
  out += ' Object.keys(' + ($data) + ').length ' + ($op) + ' ' + ($schemaValue) + ') { ';
  var $errorKeyword = $keyword;
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ($errorKeyword || '_limitProperties') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { limit: ' + ($schemaValue) + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should NOT have ';
      if ($keyword == 'maxProperties') {
        out += 'more';
      } else {
        out += 'fewer';
      }
      out += ' than ';
      if ($isData) {
        out += '\' + ' + ($schemaValue) + ' + \'';
      } else {
        out += '' + ($schema);
      }
      out += ' properties\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + ($schemaPath);
      } else {
        out += '' + ($schema);
      }
      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "d17/":
/*!****************************************************!*\
  !*** ./node_modules/ajv/lib/compile/ucs2length.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://mathiasbynens.be/notes/javascript-encoding
// https://github.com/bestiejs/punycode.js - punycode.ucs2.decode
module.exports = function ucs2length(str) {
  var length = 0
    , len = str.length
    , pos = 0
    , value;
  while (pos < len) {
    length++;
    value = str.charCodeAt(pos++);
    if (value >= 0xD800 && value <= 0xDBFF && pos < len) {
      // high surrogate, and there is a next character
      value = str.charCodeAt(pos);
      if ((value & 0xFC00) == 0xDC00) pos++; // low surrogate
    }
  }
  return length;
};


/***/ }),

/***/ "eDuk":
/*!*************************************!*\
  !*** ./node_modules/ajv/lib/ajv.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(console) {

var compileSchema = __webpack_require__(/*! ./compile */ "jQLo")
  , resolve = __webpack_require__(/*! ./compile/resolve */ "qXHa")
  , Cache = __webpack_require__(/*! ./cache */ "6pwk")
  , SchemaObject = __webpack_require__(/*! ./compile/schema_obj */ "ugD5")
  , stableStringify = __webpack_require__(/*! fast-json-stable-stringify */ "9x6x")
  , formats = __webpack_require__(/*! ./compile/formats */ "n+SQ")
  , rules = __webpack_require__(/*! ./compile/rules */ "wXyd")
  , $dataMetaSchema = __webpack_require__(/*! ./data */ "ZsDt")
  , util = __webpack_require__(/*! ./compile/util */ "+9rK");

module.exports = Ajv;

Ajv.prototype.validate = validate;
Ajv.prototype.compile = compile;
Ajv.prototype.addSchema = addSchema;
Ajv.prototype.addMetaSchema = addMetaSchema;
Ajv.prototype.validateSchema = validateSchema;
Ajv.prototype.getSchema = getSchema;
Ajv.prototype.removeSchema = removeSchema;
Ajv.prototype.addFormat = addFormat;
Ajv.prototype.errorsText = errorsText;

Ajv.prototype._addSchema = _addSchema;
Ajv.prototype._compile = _compile;

Ajv.prototype.compileAsync = __webpack_require__(/*! ./compile/async */ "sagP");
var customKeyword = __webpack_require__(/*! ./keyword */ "//Jx");
Ajv.prototype.addKeyword = customKeyword.add;
Ajv.prototype.getKeyword = customKeyword.get;
Ajv.prototype.removeKeyword = customKeyword.remove;

var errorClasses = __webpack_require__(/*! ./compile/error_classes */ "iZoB");
Ajv.ValidationError = errorClasses.Validation;
Ajv.MissingRefError = errorClasses.MissingRef;
Ajv.$dataMetaSchema = $dataMetaSchema;

var META_SCHEMA_ID = 'http://json-schema.org/draft-07/schema';

var META_IGNORE_OPTIONS = [ 'removeAdditional', 'useDefaults', 'coerceTypes' ];
var META_SUPPORT_DATA = ['/properties'];

/**
 * Creates validator instance.
 * Usage: `Ajv(opts)`
 * @param {Object} opts optional options
 * @return {Object} ajv instance
 */
function Ajv(opts) {
  if (!(this instanceof Ajv)) return new Ajv(opts);
  opts = this._opts = util.copy(opts) || {};
  setLogger(this);
  this._schemas = {};
  this._refs = {};
  this._fragments = {};
  this._formats = formats(opts.format);

  this._cache = opts.cache || new Cache;
  this._loadingSchemas = {};
  this._compilations = [];
  this.RULES = rules();
  this._getId = chooseGetId(opts);

  opts.loopRequired = opts.loopRequired || Infinity;
  if (opts.errorDataPath == 'property') opts._errorDataPathProperty = true;
  if (opts.serialize === undefined) opts.serialize = stableStringify;
  this._metaOpts = getMetaSchemaOptions(this);

  if (opts.formats) addInitialFormats(this);
  addDefaultMetaSchema(this);
  if (typeof opts.meta == 'object') this.addMetaSchema(opts.meta);
  if (opts.nullable) this.addKeyword('nullable', {metaSchema: {const: true}});
  addInitialSchemas(this);
}



/**
 * Validate data using schema
 * Schema will be compiled and cached (using serialized JSON as key. [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) is used to serialize.
 * @this   Ajv
 * @param  {String|Object} schemaKeyRef key, ref or schema object
 * @param  {Any} data to be validated
 * @return {Boolean} validation result. Errors from the last validation will be available in `ajv.errors` (and also in compiled schema: `schema.errors`).
 */
function validate(schemaKeyRef, data) {
  var v;
  if (typeof schemaKeyRef == 'string') {
    v = this.getSchema(schemaKeyRef);
    if (!v) throw new Error('no schema with key or ref "' + schemaKeyRef + '"');
  } else {
    var schemaObj = this._addSchema(schemaKeyRef);
    v = schemaObj.validate || this._compile(schemaObj);
  }

  var valid = v(data);
  if (v.$async !== true) this.errors = v.errors;
  return valid;
}


/**
 * Create validating function for passed schema.
 * @this   Ajv
 * @param  {Object} schema schema object
 * @param  {Boolean} _meta true if schema is a meta-schema. Used internally to compile meta schemas of custom keywords.
 * @return {Function} validating function
 */
function compile(schema, _meta) {
  var schemaObj = this._addSchema(schema, undefined, _meta);
  return schemaObj.validate || this._compile(schemaObj);
}


/**
 * Adds schema to the instance.
 * @this   Ajv
 * @param {Object|Array} schema schema or array of schemas. If array is passed, `key` and other parameters will be ignored.
 * @param {String} key Optional schema key. Can be passed to `validate` method instead of schema object or id/ref. One schema per instance can have empty `id` and `key`.
 * @param {Boolean} _skipValidation true to skip schema validation. Used internally, option validateSchema should be used instead.
 * @param {Boolean} _meta true if schema is a meta-schema. Used internally, addMetaSchema should be used instead.
 * @return {Ajv} this for method chaining
 */
function addSchema(schema, key, _skipValidation, _meta) {
  if (Array.isArray(schema)){
    for (var i=0; i<schema.length; i++) this.addSchema(schema[i], undefined, _skipValidation, _meta);
    return this;
  }
  var id = this._getId(schema);
  if (id !== undefined && typeof id != 'string')
    throw new Error('schema id must be string');
  key = resolve.normalizeId(key || id);
  checkUnique(this, key);
  this._schemas[key] = this._addSchema(schema, _skipValidation, _meta, true);
  return this;
}


/**
 * Add schema that will be used to validate other schemas
 * options in META_IGNORE_OPTIONS are alway set to false
 * @this   Ajv
 * @param {Object} schema schema object
 * @param {String} key optional schema key
 * @param {Boolean} skipValidation true to skip schema validation, can be used to override validateSchema option for meta-schema
 * @return {Ajv} this for method chaining
 */
function addMetaSchema(schema, key, skipValidation) {
  this.addSchema(schema, key, skipValidation, true);
  return this;
}


/**
 * Validate schema
 * @this   Ajv
 * @param {Object} schema schema to validate
 * @param {Boolean} throwOrLogError pass true to throw (or log) an error if invalid
 * @return {Boolean} true if schema is valid
 */
function validateSchema(schema, throwOrLogError) {
  var $schema = schema.$schema;
  if ($schema !== undefined && typeof $schema != 'string')
    throw new Error('$schema must be a string');
  $schema = $schema || this._opts.defaultMeta || defaultMeta(this);
  if (!$schema) {
    this.logger.warn('meta-schema not available');
    this.errors = null;
    return true;
  }
  var valid = this.validate($schema, schema);
  if (!valid && throwOrLogError) {
    var message = 'schema is invalid: ' + this.errorsText();
    if (this._opts.validateSchema == 'log') this.logger.error(message);
    else throw new Error(message);
  }
  return valid;
}


function defaultMeta(self) {
  var meta = self._opts.meta;
  self._opts.defaultMeta = typeof meta == 'object'
                            ? self._getId(meta) || meta
                            : self.getSchema(META_SCHEMA_ID)
                              ? META_SCHEMA_ID
                              : undefined;
  return self._opts.defaultMeta;
}


/**
 * Get compiled schema from the instance by `key` or `ref`.
 * @this   Ajv
 * @param  {String} keyRef `key` that was passed to `addSchema` or full schema reference (`schema.id` or resolved id).
 * @return {Function} schema validating function (with property `schema`).
 */
function getSchema(keyRef) {
  var schemaObj = _getSchemaObj(this, keyRef);
  switch (typeof schemaObj) {
    case 'object': return schemaObj.validate || this._compile(schemaObj);
    case 'string': return this.getSchema(schemaObj);
    case 'undefined': return _getSchemaFragment(this, keyRef);
  }
}


function _getSchemaFragment(self, ref) {
  var res = resolve.schema.call(self, { schema: {} }, ref);
  if (res) {
    var schema = res.schema
      , root = res.root
      , baseId = res.baseId;
    var v = compileSchema.call(self, schema, root, undefined, baseId);
    self._fragments[ref] = new SchemaObject({
      ref: ref,
      fragment: true,
      schema: schema,
      root: root,
      baseId: baseId,
      validate: v
    });
    return v;
  }
}


function _getSchemaObj(self, keyRef) {
  keyRef = resolve.normalizeId(keyRef);
  return self._schemas[keyRef] || self._refs[keyRef] || self._fragments[keyRef];
}


/**
 * Remove cached schema(s).
 * If no parameter is passed all schemas but meta-schemas are removed.
 * If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
 * Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
 * @this   Ajv
 * @param  {String|Object|RegExp} schemaKeyRef key, ref, pattern to match key/ref or schema object
 * @return {Ajv} this for method chaining
 */
function removeSchema(schemaKeyRef) {
  if (schemaKeyRef instanceof RegExp) {
    _removeAllSchemas(this, this._schemas, schemaKeyRef);
    _removeAllSchemas(this, this._refs, schemaKeyRef);
    return this;
  }
  switch (typeof schemaKeyRef) {
    case 'undefined':
      _removeAllSchemas(this, this._schemas);
      _removeAllSchemas(this, this._refs);
      this._cache.clear();
      return this;
    case 'string':
      var schemaObj = _getSchemaObj(this, schemaKeyRef);
      if (schemaObj) this._cache.del(schemaObj.cacheKey);
      delete this._schemas[schemaKeyRef];
      delete this._refs[schemaKeyRef];
      return this;
    case 'object':
      var serialize = this._opts.serialize;
      var cacheKey = serialize ? serialize(schemaKeyRef) : schemaKeyRef;
      this._cache.del(cacheKey);
      var id = this._getId(schemaKeyRef);
      if (id) {
        id = resolve.normalizeId(id);
        delete this._schemas[id];
        delete this._refs[id];
      }
  }
  return this;
}


function _removeAllSchemas(self, schemas, regex) {
  for (var keyRef in schemas) {
    var schemaObj = schemas[keyRef];
    if (!schemaObj.meta && (!regex || regex.test(keyRef))) {
      self._cache.del(schemaObj.cacheKey);
      delete schemas[keyRef];
    }
  }
}


/* @this   Ajv */
function _addSchema(schema, skipValidation, meta, shouldAddSchema) {
  if (typeof schema != 'object' && typeof schema != 'boolean')
    throw new Error('schema should be object or boolean');
  var serialize = this._opts.serialize;
  var cacheKey = serialize ? serialize(schema) : schema;
  var cached = this._cache.get(cacheKey);
  if (cached) return cached;

  shouldAddSchema = shouldAddSchema || this._opts.addUsedSchema !== false;

  var id = resolve.normalizeId(this._getId(schema));
  if (id && shouldAddSchema) checkUnique(this, id);

  var willValidate = this._opts.validateSchema !== false && !skipValidation;
  var recursiveMeta;
  if (willValidate && !(recursiveMeta = id && id == resolve.normalizeId(schema.$schema)))
    this.validateSchema(schema, true);

  var localRefs = resolve.ids.call(this, schema);

  var schemaObj = new SchemaObject({
    id: id,
    schema: schema,
    localRefs: localRefs,
    cacheKey: cacheKey,
    meta: meta
  });

  if (id[0] != '#' && shouldAddSchema) this._refs[id] = schemaObj;
  this._cache.put(cacheKey, schemaObj);

  if (willValidate && recursiveMeta) this.validateSchema(schema, true);

  return schemaObj;
}


/* @this   Ajv */
function _compile(schemaObj, root) {
  if (schemaObj.compiling) {
    schemaObj.validate = callValidate;
    callValidate.schema = schemaObj.schema;
    callValidate.errors = null;
    callValidate.root = root ? root : callValidate;
    if (schemaObj.schema.$async === true)
      callValidate.$async = true;
    return callValidate;
  }
  schemaObj.compiling = true;

  var currentOpts;
  if (schemaObj.meta) {
    currentOpts = this._opts;
    this._opts = this._metaOpts;
  }

  var v;
  try { v = compileSchema.call(this, schemaObj.schema, root, schemaObj.localRefs); }
  catch(e) {
    delete schemaObj.validate;
    throw e;
  }
  finally {
    schemaObj.compiling = false;
    if (schemaObj.meta) this._opts = currentOpts;
  }

  schemaObj.validate = v;
  schemaObj.refs = v.refs;
  schemaObj.refVal = v.refVal;
  schemaObj.root = v.root;
  return v;


  /* @this   {*} - custom context, see passContext option */
  function callValidate() {
    /* jshint validthis: true */
    var _validate = schemaObj.validate;
    var result = _validate.apply(this, arguments);
    callValidate.errors = _validate.errors;
    return result;
  }
}


function chooseGetId(opts) {
  switch (opts.schemaId) {
    case 'auto': return _get$IdOrId;
    case 'id': return _getId;
    default: return _get$Id;
  }
}

/* @this   Ajv */
function _getId(schema) {
  if (schema.$id) this.logger.warn('schema $id ignored', schema.$id);
  return schema.id;
}

/* @this   Ajv */
function _get$Id(schema) {
  if (schema.id) this.logger.warn('schema id ignored', schema.id);
  return schema.$id;
}


function _get$IdOrId(schema) {
  if (schema.$id && schema.id && schema.$id != schema.id)
    throw new Error('schema $id is different from id');
  return schema.$id || schema.id;
}


/**
 * Convert array of error message objects to string
 * @this   Ajv
 * @param  {Array<Object>} errors optional array of validation errors, if not passed errors from the instance are used.
 * @param  {Object} options optional options with properties `separator` and `dataVar`.
 * @return {String} human readable string with all errors descriptions
 */
function errorsText(errors, options) {
  errors = errors || this.errors;
  if (!errors) return 'No errors';
  options = options || {};
  var separator = options.separator === undefined ? ', ' : options.separator;
  var dataVar = options.dataVar === undefined ? 'data' : options.dataVar;

  var text = '';
  for (var i=0; i<errors.length; i++) {
    var e = errors[i];
    if (e) text += dataVar + e.dataPath + ' ' + e.message + separator;
  }
  return text.slice(0, -separator.length);
}


/**
 * Add custom format
 * @this   Ajv
 * @param {String} name format name
 * @param {String|RegExp|Function} format string is converted to RegExp; function should return boolean (true when valid)
 * @return {Ajv} this for method chaining
 */
function addFormat(name, format) {
  if (typeof format == 'string') format = new RegExp(format);
  this._formats[name] = format;
  return this;
}


function addDefaultMetaSchema(self) {
  var $dataSchema;
  if (self._opts.$data) {
    $dataSchema = __webpack_require__(/*! ./refs/data.json */ "RsDv");
    self.addMetaSchema($dataSchema, $dataSchema.$id, true);
  }
  if (self._opts.meta === false) return;
  var metaSchema = __webpack_require__(/*! ./refs/json-schema-draft-07.json */ "bnbC");
  if (self._opts.$data) metaSchema = $dataMetaSchema(metaSchema, META_SUPPORT_DATA);
  self.addMetaSchema(metaSchema, META_SCHEMA_ID, true);
  self._refs['http://json-schema.org/schema'] = META_SCHEMA_ID;
}


function addInitialSchemas(self) {
  var optsSchemas = self._opts.schemas;
  if (!optsSchemas) return;
  if (Array.isArray(optsSchemas)) self.addSchema(optsSchemas);
  else for (var key in optsSchemas) self.addSchema(optsSchemas[key], key);
}


function addInitialFormats(self) {
  for (var name in self._opts.formats) {
    var format = self._opts.formats[name];
    self.addFormat(name, format);
  }
}


function checkUnique(self, id) {
  if (self._schemas[id] || self._refs[id])
    throw new Error('schema with key or id "' + id + '" already exists');
}


function getMetaSchemaOptions(self) {
  var metaOpts = util.copy(self._opts);
  for (var i=0; i<META_IGNORE_OPTIONS.length; i++)
    delete metaOpts[META_IGNORE_OPTIONS[i]];
  return metaOpts;
}


function setLogger(self) {
  var logger = self._opts.logger;
  if (logger === false) {
    self.logger = {log: noop, warn: noop, error: noop};
  } else {
    if (logger === undefined) logger = console;
    if (!(typeof logger == 'object' && logger.log && logger.warn && logger.error))
      throw new Error('logger must implement log, warn and error methods');
    self.logger = logger;
  }
}


function noop() {}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../console-browserify/index.js */ "ziTh")))

/***/ }),

/***/ "eY4P":
/*!*********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/items.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_items(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $idx = 'i' + $lvl,
    $dataNxt = $it.dataLevel = it.dataLevel + 1,
    $nextData = 'data' + $dataNxt,
    $currentBaseId = it.baseId;
  out += 'var ' + ($errs) + ' = errors;var ' + ($valid) + ';';
  if (Array.isArray($schema)) {
    var $additionalItems = it.schema.additionalItems;
    if ($additionalItems === false) {
      out += ' ' + ($valid) + ' = ' + ($data) + '.length <= ' + ($schema.length) + '; ';
      var $currErrSchemaPath = $errSchemaPath;
      $errSchemaPath = it.errSchemaPath + '/additionalItems';
      out += '  if (!' + ($valid) + ') {   ';
      var $$outStack = $$outStack || [];
      $$outStack.push(out);
      out = ''; /* istanbul ignore else */
      if (it.createErrors !== false) {
        out += ' { keyword: \'' + ('additionalItems') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { limit: ' + ($schema.length) + ' } ';
        if (it.opts.messages !== false) {
          out += ' , message: \'should NOT have more than ' + ($schema.length) + ' items\' ';
        }
        if (it.opts.verbose) {
          out += ' , schema: false , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
        }
        out += ' } ';
      } else {
        out += ' {} ';
      }
      var __err = out;
      out = $$outStack.pop();
      if (!it.compositeRule && $breakOnError) {
        /* istanbul ignore if */
        if (it.async) {
          out += ' throw new ValidationError([' + (__err) + ']); ';
        } else {
          out += ' validate.errors = [' + (__err) + ']; return false; ';
        }
      } else {
        out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
      }
      out += ' } ';
      $errSchemaPath = $currErrSchemaPath;
      if ($breakOnError) {
        $closingBraces += '}';
        out += ' else { ';
      }
    }
    var arr1 = $schema;
    if (arr1) {
      var $sch, $i = -1,
        l1 = arr1.length - 1;
      while ($i < l1) {
        $sch = arr1[$i += 1];
        if (it.util.schemaHasRules($sch, it.RULES.all)) {
          out += ' ' + ($nextValid) + ' = true; if (' + ($data) + '.length > ' + ($i) + ') { ';
          var $passData = $data + '[' + $i + ']';
          $it.schema = $sch;
          $it.schemaPath = $schemaPath + '[' + $i + ']';
          $it.errSchemaPath = $errSchemaPath + '/' + $i;
          $it.errorPath = it.util.getPathExpr(it.errorPath, $i, it.opts.jsonPointers, true);
          $it.dataPathArr[$dataNxt] = $i;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';
          } else {
            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';
          }
          out += ' }  ';
          if ($breakOnError) {
            out += ' if (' + ($nextValid) + ') { ';
            $closingBraces += '}';
          }
        }
      }
    }
    if (typeof $additionalItems == 'object' && it.util.schemaHasRules($additionalItems, it.RULES.all)) {
      $it.schema = $additionalItems;
      $it.schemaPath = it.schemaPath + '.additionalItems';
      $it.errSchemaPath = it.errSchemaPath + '/additionalItems';
      out += ' ' + ($nextValid) + ' = true; if (' + ($data) + '.length > ' + ($schema.length) + ') {  for (var ' + ($idx) + ' = ' + ($schema.length) + '; ' + ($idx) + ' < ' + ($data) + '.length; ' + ($idx) + '++) { ';
      $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
      var $passData = $data + '[' + $idx + ']';
      $it.dataPathArr[$dataNxt] = $idx;
      var $code = it.validate($it);
      $it.baseId = $currentBaseId;
      if (it.util.varOccurences($code, $nextData) < 2) {
        out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';
      } else {
        out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';
      }
      if ($breakOnError) {
        out += ' if (!' + ($nextValid) + ') break; ';
      }
      out += ' } }  ';
      if ($breakOnError) {
        out += ' if (' + ($nextValid) + ') { ';
        $closingBraces += '}';
      }
    }
  } else if (it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += '  for (var ' + ($idx) + ' = ' + (0) + '; ' + ($idx) + ' < ' + ($data) + '.length; ' + ($idx) + '++) { ';
    $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
    var $passData = $data + '[' + $idx + ']';
    $it.dataPathArr[$dataNxt] = $idx;
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
    if (it.util.varOccurences($code, $nextData) < 2) {
      out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';
    } else {
      out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';
    }
    if ($breakOnError) {
      out += ' if (!' + ($nextValid) + ') break; ';
    }
    out += ' }';
  }
  if ($breakOnError) {
    out += ' ' + ($closingBraces) + ' if (' + ($errs) + ' == errors) {';
  }
  out = it.util.cleanUpCode(out);
  return out;
}


/***/ }),

/***/ "iZoB":
/*!*******************************************************!*\
  !*** ./node_modules/ajv/lib/compile/error_classes.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var resolve = __webpack_require__(/*! ./resolve */ "qXHa");

module.exports = {
  Validation: errorSubclass(ValidationError),
  MissingRef: errorSubclass(MissingRefError)
};


function ValidationError(errors) {
  this.message = 'validation failed';
  this.errors = errors;
  this.ajv = this.validation = true;
}


MissingRefError.message = function (baseId, ref) {
  return 'can\'t resolve reference ' + ref + ' from id ' + baseId;
};


function MissingRefError(baseId, ref, message) {
  this.message = message || MissingRefError.message(baseId, ref);
  this.missingRef = resolve.url(baseId, ref);
  this.missingSchema = resolve.normalizeId(resolve.fullPath(this.missingRef));
}


function errorSubclass(Subclass) {
  Subclass.prototype = Object.create(Error.prototype);
  Subclass.prototype.constructor = Subclass;
  return Subclass;
}


/***/ }),

/***/ "jQLo":
/*!***********************************************!*\
  !*** ./node_modules/ajv/lib/compile/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var resolve = __webpack_require__(/*! ./resolve */ "qXHa")
  , util = __webpack_require__(/*! ./util */ "+9rK")
  , errorClasses = __webpack_require__(/*! ./error_classes */ "iZoB")
  , stableStringify = __webpack_require__(/*! fast-json-stable-stringify */ "9x6x");

var validateGenerator = __webpack_require__(/*! ../dotjs/validate */ "1QhW");

/**
 * Functions below are used inside compiled validations function
 */

var ucs2length = util.ucs2length;
var equal = __webpack_require__(/*! fast-deep-equal */ "aUsF");

// this error is thrown by async schemas to return validation errors via exception
var ValidationError = errorClasses.Validation;

module.exports = compile;


/**
 * Compiles schema to validation function
 * @this   Ajv
 * @param  {Object} schema schema object
 * @param  {Object} root object with information about the root schema for this schema
 * @param  {Object} localRefs the hash of local references inside the schema (created by resolve.id), used for inline resolution
 * @param  {String} baseId base ID for IDs in the schema
 * @return {Function} validation function
 */
function compile(schema, root, localRefs, baseId) {
  /* jshint validthis: true, evil: true */
  /* eslint no-shadow: 0 */
  var self = this
    , opts = this._opts
    , refVal = [ undefined ]
    , refs = {}
    , patterns = []
    , patternsHash = {}
    , defaults = []
    , defaultsHash = {}
    , customRules = [];

  root = root || { schema: schema, refVal: refVal, refs: refs };

  var c = checkCompiling.call(this, schema, root, baseId);
  var compilation = this._compilations[c.index];
  if (c.compiling) return (compilation.callValidate = callValidate);

  var formats = this._formats;
  var RULES = this.RULES;

  try {
    var v = localCompile(schema, root, localRefs, baseId);
    compilation.validate = v;
    var cv = compilation.callValidate;
    if (cv) {
      cv.schema = v.schema;
      cv.errors = null;
      cv.refs = v.refs;
      cv.refVal = v.refVal;
      cv.root = v.root;
      cv.$async = v.$async;
      if (opts.sourceCode) cv.source = v.source;
    }
    return v;
  } finally {
    endCompiling.call(this, schema, root, baseId);
  }

  /* @this   {*} - custom context, see passContext option */
  function callValidate() {
    /* jshint validthis: true */
    var validate = compilation.validate;
    var result = validate.apply(this, arguments);
    callValidate.errors = validate.errors;
    return result;
  }

  function localCompile(_schema, _root, localRefs, baseId) {
    var isRoot = !_root || (_root && _root.schema == _schema);
    if (_root.schema != root.schema)
      return compile.call(self, _schema, _root, localRefs, baseId);

    var $async = _schema.$async === true;

    var sourceCode = validateGenerator({
      isTop: true,
      schema: _schema,
      isRoot: isRoot,
      baseId: baseId,
      root: _root,
      schemaPath: '',
      errSchemaPath: '#',
      errorPath: '""',
      MissingRefError: errorClasses.MissingRef,
      RULES: RULES,
      validate: validateGenerator,
      util: util,
      resolve: resolve,
      resolveRef: resolveRef,
      usePattern: usePattern,
      useDefault: useDefault,
      useCustomRule: useCustomRule,
      opts: opts,
      formats: formats,
      logger: self.logger,
      self: self
    });

    sourceCode = vars(refVal, refValCode) + vars(patterns, patternCode)
                   + vars(defaults, defaultCode) + vars(customRules, customRuleCode)
                   + sourceCode;

    if (opts.processCode) sourceCode = opts.processCode(sourceCode);
    // console.log('\n\n\n *** \n', JSON.stringify(sourceCode));
    var validate;
    try {
      var makeValidate = new Function(
        'self',
        'RULES',
        'formats',
        'root',
        'refVal',
        'defaults',
        'customRules',
        'equal',
        'ucs2length',
        'ValidationError',
        sourceCode
      );

      validate = makeValidate(
        self,
        RULES,
        formats,
        root,
        refVal,
        defaults,
        customRules,
        equal,
        ucs2length,
        ValidationError
      );

      refVal[0] = validate;
    } catch(e) {
      self.logger.error('Error compiling schema, function code:', sourceCode);
      throw e;
    }

    validate.schema = _schema;
    validate.errors = null;
    validate.refs = refs;
    validate.refVal = refVal;
    validate.root = isRoot ? validate : _root;
    if ($async) validate.$async = true;
    if (opts.sourceCode === true) {
      validate.source = {
        code: sourceCode,
        patterns: patterns,
        defaults: defaults
      };
    }

    return validate;
  }

  function resolveRef(baseId, ref, isRoot) {
    ref = resolve.url(baseId, ref);
    var refIndex = refs[ref];
    var _refVal, refCode;
    if (refIndex !== undefined) {
      _refVal = refVal[refIndex];
      refCode = 'refVal[' + refIndex + ']';
      return resolvedRef(_refVal, refCode);
    }
    if (!isRoot && root.refs) {
      var rootRefId = root.refs[ref];
      if (rootRefId !== undefined) {
        _refVal = root.refVal[rootRefId];
        refCode = addLocalRef(ref, _refVal);
        return resolvedRef(_refVal, refCode);
      }
    }

    refCode = addLocalRef(ref);
    var v = resolve.call(self, localCompile, root, ref);
    if (v === undefined) {
      var localSchema = localRefs && localRefs[ref];
      if (localSchema) {
        v = resolve.inlineRef(localSchema, opts.inlineRefs)
            ? localSchema
            : compile.call(self, localSchema, root, localRefs, baseId);
      }
    }

    if (v === undefined) {
      removeLocalRef(ref);
    } else {
      replaceLocalRef(ref, v);
      return resolvedRef(v, refCode);
    }
  }

  function addLocalRef(ref, v) {
    var refId = refVal.length;
    refVal[refId] = v;
    refs[ref] = refId;
    return 'refVal' + refId;
  }

  function removeLocalRef(ref) {
    delete refs[ref];
  }

  function replaceLocalRef(ref, v) {
    var refId = refs[ref];
    refVal[refId] = v;
  }

  function resolvedRef(refVal, code) {
    return typeof refVal == 'object' || typeof refVal == 'boolean'
            ? { code: code, schema: refVal, inline: true }
            : { code: code, $async: refVal && !!refVal.$async };
  }

  function usePattern(regexStr) {
    var index = patternsHash[regexStr];
    if (index === undefined) {
      index = patternsHash[regexStr] = patterns.length;
      patterns[index] = regexStr;
    }
    return 'pattern' + index;
  }

  function useDefault(value) {
    switch (typeof value) {
      case 'boolean':
      case 'number':
        return '' + value;
      case 'string':
        return util.toQuotedString(value);
      case 'object':
        if (value === null) return 'null';
        var valueStr = stableStringify(value);
        var index = defaultsHash[valueStr];
        if (index === undefined) {
          index = defaultsHash[valueStr] = defaults.length;
          defaults[index] = value;
        }
        return 'default' + index;
    }
  }

  function useCustomRule(rule, schema, parentSchema, it) {
    var validateSchema = rule.definition.validateSchema;
    if (validateSchema && self._opts.validateSchema !== false) {
      var valid = validateSchema(schema);
      if (!valid) {
        var message = 'keyword schema is invalid: ' + self.errorsText(validateSchema.errors);
        if (self._opts.validateSchema == 'log') self.logger.error(message);
        else throw new Error(message);
      }
    }

    var compile = rule.definition.compile
      , inline = rule.definition.inline
      , macro = rule.definition.macro;

    var validate;
    if (compile) {
      validate = compile.call(self, schema, parentSchema, it);
    } else if (macro) {
      validate = macro.call(self, schema, parentSchema, it);
      if (opts.validateSchema !== false) self.validateSchema(validate, true);
    } else if (inline) {
      validate = inline.call(self, it, rule.keyword, schema, parentSchema);
    } else {
      validate = rule.definition.validate;
      if (!validate) return;
    }

    if (validate === undefined)
      throw new Error('custom keyword "' + rule.keyword + '"failed to compile');

    var index = customRules.length;
    customRules[index] = validate;

    return {
      code: 'customRule' + index,
      validate: validate
    };
  }
}


/**
 * Checks if the schema is currently compiled
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 * @return {Object} object with properties "index" (compilation index) and "compiling" (boolean)
 */
function checkCompiling(schema, root, baseId) {
  /* jshint validthis: true */
  var index = compIndex.call(this, schema, root, baseId);
  if (index >= 0) return { index: index, compiling: true };
  index = this._compilations.length;
  this._compilations[index] = {
    schema: schema,
    root: root,
    baseId: baseId
  };
  return { index: index, compiling: false };
}


/**
 * Removes the schema from the currently compiled list
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 */
function endCompiling(schema, root, baseId) {
  /* jshint validthis: true */
  var i = compIndex.call(this, schema, root, baseId);
  if (i >= 0) this._compilations.splice(i, 1);
}


/**
 * Index of schema compilation in the currently compiled list
 * @this   Ajv
 * @param  {Object} schema schema to compile
 * @param  {Object} root root object
 * @param  {String} baseId base schema ID
 * @return {Integer} compilation index
 */
function compIndex(schema, root, baseId) {
  /* jshint validthis: true */
  for (var i=0; i<this._compilations.length; i++) {
    var c = this._compilations[i];
    if (c.schema == schema && c.root == root && c.baseId == baseId) return i;
  }
  return -1;
}


function patternCode(i, patterns) {
  return 'var pattern' + i + ' = new RegExp(' + util.toQuotedString(patterns[i]) + ');';
}


function defaultCode(i) {
  return 'var default' + i + ' = defaults[' + i + '];';
}


function refValCode(i, refVal) {
  return refVal[i] === undefined ? '' : 'var refVal' + i + ' = refVal[' + i + '];';
}


function customRuleCode(i) {
  return 'var customRule' + i + ' = customRules[' + i + '];';
}


function vars(arr, statement) {
  if (!arr.length) return '';
  var code = '';
  for (var i=0; i<arr.length; i++)
    code += statement(i, arr);
  return code;
}


/***/ }),

/***/ "mQYA":
/*!****************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/_limitLength.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate__limitLength(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $op = $keyword == 'maxLength' ? '>' : '<';
  out += 'if ( ';
  if ($isData) {
    out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \'number\') || ';
  }
  if (it.opts.unicode === false) {
    out += ' ' + ($data) + '.length ';
  } else {
    out += ' ucs2length(' + ($data) + ') ';
  }
  out += ' ' + ($op) + ' ' + ($schemaValue) + ') { ';
  var $errorKeyword = $keyword;
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ($errorKeyword || '_limitLength') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { limit: ' + ($schemaValue) + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should NOT be ';
      if ($keyword == 'maxLength') {
        out += 'longer';
      } else {
        out += 'shorter';
      }
      out += ' than ';
      if ($isData) {
        out += '\' + ' + ($schemaValue) + ' + \'';
      } else {
        out += '' + ($schema);
      }
      out += ' characters\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + ($schemaPath);
      } else {
        out += '' + ($schema);
      }
      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "n+SQ":
/*!*************************************************!*\
  !*** ./node_modules/ajv/lib/compile/formats.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(/*! ./util */ "+9rK");

var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
var DAYS = [0,31,28,31,30,31,30,31,31,30,31,30,31];
var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i;
var HOSTNAME = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*$/i;
var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
var URIREF = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
// uri-template: https://tools.ietf.org/html/rfc6570
var URITEMPLATE = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
// For the source: https://gist.github.com/dperini/729294
// For test cases: https://mathiasbynens.be/demo/url-regex
// @todo Delete current URL in favour of the commented out URL rule when this issue is fixed https://github.com/eslint/eslint/issues/7983.
// var URL = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
var URL = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i;
var UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
var JSON_POINTER = /^(?:\/(?:[^~/]|~0|~1)*)*$/;
var JSON_POINTER_URI_FRAGMENT = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i;
var RELATIVE_JSON_POINTER = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;


module.exports = formats;

function formats(mode) {
  mode = mode == 'full' ? 'full' : 'fast';
  return util.copy(formats[mode]);
}


formats.fast = {
  // date: http://tools.ietf.org/html/rfc3339#section-5.6
  date: /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
  // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
  time: /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d:\d\d)?$/i,
  'date-time': /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d:\d\d)$/i,
  // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
  uri: /^(?:[a-z][a-z0-9+-.]*:)(?:\/?\/)?[^\s]*$/i,
  'uri-reference': /^(?:(?:[a-z][a-z0-9+-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
  'uri-template': URITEMPLATE,
  url: URL,
  // email (sources from jsen validator):
  // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
  // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
  email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  hostname: HOSTNAME,
  // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  // optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
  ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
  regex: regex,
  // uuid: http://tools.ietf.org/html/rfc4122
  uuid: UUID,
  // JSON-pointer: https://tools.ietf.org/html/rfc6901
  // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
  'json-pointer': JSON_POINTER,
  'json-pointer-uri-fragment': JSON_POINTER_URI_FRAGMENT,
  // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
  'relative-json-pointer': RELATIVE_JSON_POINTER
};


formats.full = {
  date: date,
  time: time,
  'date-time': date_time,
  uri: uri,
  'uri-reference': URIREF,
  'uri-template': URITEMPLATE,
  url: URL,
  email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
  hostname: hostname,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
  regex: regex,
  uuid: UUID,
  'json-pointer': JSON_POINTER,
  'json-pointer-uri-fragment': JSON_POINTER_URI_FRAGMENT,
  'relative-json-pointer': RELATIVE_JSON_POINTER
};


function isLeapYear(year) {
  // https://tools.ietf.org/html/rfc3339#appendix-C
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}


function date(str) {
  // full-date from http://tools.ietf.org/html/rfc3339#section-5.6
  var matches = str.match(DATE);
  if (!matches) return false;

  var year = +matches[1];
  var month = +matches[2];
  var day = +matches[3];

  return month >= 1 && month <= 12 && day >= 1 &&
          day <= (month == 2 && isLeapYear(year) ? 29 : DAYS[month]);
}


function time(str, full) {
  var matches = str.match(TIME);
  if (!matches) return false;

  var hour = matches[1];
  var minute = matches[2];
  var second = matches[3];
  var timeZone = matches[5];
  return ((hour <= 23 && minute <= 59 && second <= 59) ||
          (hour == 23 && minute == 59 && second == 60)) &&
         (!full || timeZone);
}


var DATE_TIME_SEPARATOR = /t|\s/i;
function date_time(str) {
  // http://tools.ietf.org/html/rfc3339#section-5.6
  var dateTime = str.split(DATE_TIME_SEPARATOR);
  return dateTime.length == 2 && date(dateTime[0]) && time(dateTime[1], true);
}


function hostname(str) {
  // https://tools.ietf.org/html/rfc1034#section-3.5
  // https://tools.ietf.org/html/rfc1123#section-2
  return str.length <= 255 && HOSTNAME.test(str);
}


var NOT_URI_FRAGMENT = /\/|:/;
function uri(str) {
  // http://jmrware.com/articles/2009/uri_regexp/URI_regex.html + optional protocol + required "."
  return NOT_URI_FRAGMENT.test(str) && URI.test(str);
}


var Z_ANCHOR = /[^\\]\\Z/;
function regex(str) {
  if (Z_ANCHOR.test(str)) return false;
  try {
    new RegExp(str);
    return true;
  } catch(e) {
    return false;
  }
}


/***/ }),

/***/ "qTHO":
/*!**************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/multipleOf.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_multipleOf(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  out += 'var division' + ($lvl) + ';if (';
  if ($isData) {
    out += ' ' + ($schemaValue) + ' !== undefined && ( typeof ' + ($schemaValue) + ' != \'number\' || ';
  }
  out += ' (division' + ($lvl) + ' = ' + ($data) + ' / ' + ($schemaValue) + ', ';
  if (it.opts.multipleOfPrecision) {
    out += ' Math.abs(Math.round(division' + ($lvl) + ') - division' + ($lvl) + ') > 1e-' + (it.opts.multipleOfPrecision) + ' ';
  } else {
    out += ' division' + ($lvl) + ' !== parseInt(division' + ($lvl) + ') ';
  }
  out += ' ) ';
  if ($isData) {
    out += '  )  ';
  }
  out += ' ) {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ('multipleOf') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { multipleOf: ' + ($schemaValue) + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should be multiple of ';
      if ($isData) {
        out += '\' + ' + ($schemaValue);
      } else {
        out += '' + ($schemaValue) + '\'';
      }
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + ($schemaPath);
      } else {
        out += '' + ($schema);
      }
      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += '} ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "qXHa":
/*!*************************************************!*\
  !*** ./node_modules/ajv/lib/compile/resolve.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var URI = __webpack_require__(/*! uri-js */ "ThTW")
  , equal = __webpack_require__(/*! fast-deep-equal */ "aUsF")
  , util = __webpack_require__(/*! ./util */ "+9rK")
  , SchemaObject = __webpack_require__(/*! ./schema_obj */ "ugD5")
  , traverse = __webpack_require__(/*! json-schema-traverse */ "ialn");

module.exports = resolve;

resolve.normalizeId = normalizeId;
resolve.fullPath = getFullPath;
resolve.url = resolveUrl;
resolve.ids = resolveIds;
resolve.inlineRef = inlineRef;
resolve.schema = resolveSchema;

/**
 * [resolve and compile the references ($ref)]
 * @this   Ajv
 * @param  {Function} compile reference to schema compilation funciton (localCompile)
 * @param  {Object} root object with information about the root schema for the current schema
 * @param  {String} ref reference to resolve
 * @return {Object|Function} schema object (if the schema can be inlined) or validation function
 */
function resolve(compile, root, ref) {
  /* jshint validthis: true */
  var refVal = this._refs[ref];
  if (typeof refVal == 'string') {
    if (this._refs[refVal]) refVal = this._refs[refVal];
    else return resolve.call(this, compile, root, refVal);
  }

  refVal = refVal || this._schemas[ref];
  if (refVal instanceof SchemaObject) {
    return inlineRef(refVal.schema, this._opts.inlineRefs)
            ? refVal.schema
            : refVal.validate || this._compile(refVal);
  }

  var res = resolveSchema.call(this, root, ref);
  var schema, v, baseId;
  if (res) {
    schema = res.schema;
    root = res.root;
    baseId = res.baseId;
  }

  if (schema instanceof SchemaObject) {
    v = schema.validate || compile.call(this, schema.schema, root, undefined, baseId);
  } else if (schema !== undefined) {
    v = inlineRef(schema, this._opts.inlineRefs)
        ? schema
        : compile.call(this, schema, root, undefined, baseId);
  }

  return v;
}


/**
 * Resolve schema, its root and baseId
 * @this Ajv
 * @param  {Object} root root object with properties schema, refVal, refs
 * @param  {String} ref  reference to resolve
 * @return {Object} object with properties schema, root, baseId
 */
function resolveSchema(root, ref) {
  /* jshint validthis: true */
  var p = URI.parse(ref)
    , refPath = _getFullPath(p)
    , baseId = getFullPath(this._getId(root.schema));
  if (Object.keys(root.schema).length === 0 || refPath !== baseId) {
    var id = normalizeId(refPath);
    var refVal = this._refs[id];
    if (typeof refVal == 'string') {
      return resolveRecursive.call(this, root, refVal, p);
    } else if (refVal instanceof SchemaObject) {
      if (!refVal.validate) this._compile(refVal);
      root = refVal;
    } else {
      refVal = this._schemas[id];
      if (refVal instanceof SchemaObject) {
        if (!refVal.validate) this._compile(refVal);
        if (id == normalizeId(ref))
          return { schema: refVal, root: root, baseId: baseId };
        root = refVal;
      } else {
        return;
      }
    }
    if (!root.schema) return;
    baseId = getFullPath(this._getId(root.schema));
  }
  return getJsonPointer.call(this, p, baseId, root.schema, root);
}


/* @this Ajv */
function resolveRecursive(root, ref, parsedRef) {
  /* jshint validthis: true */
  var res = resolveSchema.call(this, root, ref);
  if (res) {
    var schema = res.schema;
    var baseId = res.baseId;
    root = res.root;
    var id = this._getId(schema);
    if (id) baseId = resolveUrl(baseId, id);
    return getJsonPointer.call(this, parsedRef, baseId, schema, root);
  }
}


var PREVENT_SCOPE_CHANGE = util.toHash(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
/* @this Ajv */
function getJsonPointer(parsedRef, baseId, schema, root) {
  /* jshint validthis: true */
  parsedRef.fragment = parsedRef.fragment || '';
  if (parsedRef.fragment.slice(0,1) != '/') return;
  var parts = parsedRef.fragment.split('/');

  for (var i = 1; i < parts.length; i++) {
    var part = parts[i];
    if (part) {
      part = util.unescapeFragment(part);
      schema = schema[part];
      if (schema === undefined) break;
      var id;
      if (!PREVENT_SCOPE_CHANGE[part]) {
        id = this._getId(schema);
        if (id) baseId = resolveUrl(baseId, id);
        if (schema.$ref) {
          var $ref = resolveUrl(baseId, schema.$ref);
          var res = resolveSchema.call(this, root, $ref);
          if (res) {
            schema = res.schema;
            root = res.root;
            baseId = res.baseId;
          }
        }
      }
    }
  }
  if (schema !== undefined && schema !== root.schema)
    return { schema: schema, root: root, baseId: baseId };
}


var SIMPLE_INLINED = util.toHash([
  'type', 'format', 'pattern',
  'maxLength', 'minLength',
  'maxProperties', 'minProperties',
  'maxItems', 'minItems',
  'maximum', 'minimum',
  'uniqueItems', 'multipleOf',
  'required', 'enum'
]);
function inlineRef(schema, limit) {
  if (limit === false) return false;
  if (limit === undefined || limit === true) return checkNoRef(schema);
  else if (limit) return countKeys(schema) <= limit;
}


function checkNoRef(schema) {
  var item;
  if (Array.isArray(schema)) {
    for (var i=0; i<schema.length; i++) {
      item = schema[i];
      if (typeof item == 'object' && !checkNoRef(item)) return false;
    }
  } else {
    for (var key in schema) {
      if (key == '$ref') return false;
      item = schema[key];
      if (typeof item == 'object' && !checkNoRef(item)) return false;
    }
  }
  return true;
}


function countKeys(schema) {
  var count = 0, item;
  if (Array.isArray(schema)) {
    for (var i=0; i<schema.length; i++) {
      item = schema[i];
      if (typeof item == 'object') count += countKeys(item);
      if (count == Infinity) return Infinity;
    }
  } else {
    for (var key in schema) {
      if (key == '$ref') return Infinity;
      if (SIMPLE_INLINED[key]) {
        count++;
      } else {
        item = schema[key];
        if (typeof item == 'object') count += countKeys(item) + 1;
        if (count == Infinity) return Infinity;
      }
    }
  }
  return count;
}


function getFullPath(id, normalize) {
  if (normalize !== false) id = normalizeId(id);
  var p = URI.parse(id);
  return _getFullPath(p);
}


function _getFullPath(p) {
  return URI.serialize(p).split('#')[0] + '#';
}


var TRAILING_SLASH_HASH = /#\/?$/;
function normalizeId(id) {
  return id ? id.replace(TRAILING_SLASH_HASH, '') : '';
}


function resolveUrl(baseId, id) {
  id = normalizeId(id);
  return URI.resolve(baseId, id);
}


/* @this Ajv */
function resolveIds(schema) {
  var schemaId = normalizeId(this._getId(schema));
  var baseIds = {'': schemaId};
  var fullPaths = {'': getFullPath(schemaId, false)};
  var localRefs = {};
  var self = this;

  traverse(schema, {allKeys: true}, function(sch, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
    if (jsonPtr === '') return;
    var id = self._getId(sch);
    var baseId = baseIds[parentJsonPtr];
    var fullPath = fullPaths[parentJsonPtr] + '/' + parentKeyword;
    if (keyIndex !== undefined)
      fullPath += '/' + (typeof keyIndex == 'number' ? keyIndex : util.escapeFragment(keyIndex));

    if (typeof id == 'string') {
      id = baseId = normalizeId(baseId ? URI.resolve(baseId, id) : id);

      var refVal = self._refs[id];
      if (typeof refVal == 'string') refVal = self._refs[refVal];
      if (refVal && refVal.schema) {
        if (!equal(sch, refVal.schema))
          throw new Error('id "' + id + '" resolves to more than one schema');
      } else if (id != normalizeId(fullPath)) {
        if (id[0] == '#') {
          if (localRefs[id] && !equal(sch, localRefs[id]))
            throw new Error('id "' + id + '" resolves to more than one schema');
          localRefs[id] = sch;
        } else {
          self._refs[id] = fullPath;
        }
      }
    }
    baseIds[jsonPtr] = baseId;
    fullPaths[jsonPtr] = fullPath;
  });

  return localRefs;
}


/***/ }),

/***/ "sagP":
/*!***********************************************!*\
  !*** ./node_modules/ajv/lib/compile/async.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MissingRefError = __webpack_require__(/*! ./error_classes */ "iZoB").MissingRef;

module.exports = compileAsync;


/**
 * Creates validating function for passed schema with asynchronous loading of missing schemas.
 * `loadSchema` option should be a function that accepts schema uri and returns promise that resolves with the schema.
 * @this  Ajv
 * @param {Object}   schema schema object
 * @param {Boolean}  meta optional true to compile meta-schema; this parameter can be skipped
 * @param {Function} callback an optional node-style callback, it is called with 2 parameters: error (or null) and validating function.
 * @return {Promise} promise that resolves with a validating function.
 */
function compileAsync(schema, meta, callback) {
  /* eslint no-shadow: 0 */
  /* global Promise */
  /* jshint validthis: true */
  var self = this;
  if (typeof this._opts.loadSchema != 'function')
    throw new Error('options.loadSchema should be a function');

  if (typeof meta == 'function') {
    callback = meta;
    meta = undefined;
  }

  var p = loadMetaSchemaOf(schema).then(function () {
    var schemaObj = self._addSchema(schema, undefined, meta);
    return schemaObj.validate || _compileAsync(schemaObj);
  });

  if (callback) {
    p.then(
      function(v) { callback(null, v); },
      callback
    );
  }

  return p;


  function loadMetaSchemaOf(sch) {
    var $schema = sch.$schema;
    return $schema && !self.getSchema($schema)
            ? compileAsync.call(self, { $ref: $schema }, true)
            : Promise.resolve();
  }


  function _compileAsync(schemaObj) {
    try { return self._compile(schemaObj); }
    catch(e) {
      if (e instanceof MissingRefError) return loadMissingSchema(e);
      throw e;
    }


    function loadMissingSchema(e) {
      var ref = e.missingSchema;
      if (added(ref)) throw new Error('Schema ' + ref + ' is loaded but ' + e.missingRef + ' cannot be resolved');

      var schemaPromise = self._loadingSchemas[ref];
      if (!schemaPromise) {
        schemaPromise = self._loadingSchemas[ref] = self._opts.loadSchema(ref);
        schemaPromise.then(removePromise, removePromise);
      }

      return schemaPromise.then(function (sch) {
        if (!added(ref)) {
          return loadMetaSchemaOf(sch).then(function () {
            if (!added(ref)) self.addSchema(sch, ref, undefined, meta);
          });
        }
      }).then(function() {
        return _compileAsync(schemaObj);
      });

      function removePromise() {
        delete self._loadingSchemas[ref];
      }

      function added(ref) {
        return self._refs[ref] || self._schemas[ref];
      }
    }
  }
}


/***/ }),

/***/ "t+aO":
/*!************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/required.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_required(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $valid = 'valid' + $lvl;
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $vSchema = 'schema' + $lvl;
  if (!$isData) {
    if ($schema.length < it.opts.loopRequired && it.schema.properties && Object.keys(it.schema.properties).length) {
      var $required = [];
      var arr1 = $schema;
      if (arr1) {
        var $property, i1 = -1,
          l1 = arr1.length - 1;
        while (i1 < l1) {
          $property = arr1[i1 += 1];
          var $propertySch = it.schema.properties[$property];
          if (!($propertySch && it.util.schemaHasRules($propertySch, it.RULES.all))) {
            $required[$required.length] = $property;
          }
        }
      }
    } else {
      var $required = $schema;
    }
  }
  if ($isData || $required.length) {
    var $currentErrorPath = it.errorPath,
      $loopRequired = $isData || $required.length >= it.opts.loopRequired,
      $ownProperties = it.opts.ownProperties;
    if ($breakOnError) {
      out += ' var missing' + ($lvl) + '; ';
      if ($loopRequired) {
        if (!$isData) {
          out += ' var ' + ($vSchema) + ' = validate.schema' + ($schemaPath) + '; ';
        }
        var $i = 'i' + $lvl,
          $propertyPath = 'schema' + $lvl + '[' + $i + ']',
          $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.util.getPathExpr($currentErrorPath, $propertyPath, it.opts.jsonPointers);
        }
        out += ' var ' + ($valid) + ' = true; ';
        if ($isData) {
          out += ' if (schema' + ($lvl) + ' === undefined) ' + ($valid) + ' = true; else if (!Array.isArray(schema' + ($lvl) + ')) ' + ($valid) + ' = false; else {';
        }
        out += ' for (var ' + ($i) + ' = 0; ' + ($i) + ' < ' + ($vSchema) + '.length; ' + ($i) + '++) { ' + ($valid) + ' = ' + ($data) + '[' + ($vSchema) + '[' + ($i) + ']] !== undefined ';
        if ($ownProperties) {
          out += ' &&   Object.prototype.hasOwnProperty.call(' + ($data) + ', ' + ($vSchema) + '[' + ($i) + ']) ';
        }
        out += '; if (!' + ($valid) + ') break; } ';
        if ($isData) {
          out += '  }  ';
        }
        out += '  if (!' + ($valid) + ') {   ';
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } else { ';
      } else {
        out += ' if ( ';
        var arr2 = $required;
        if (arr2) {
          var $propertyKey, $i = -1,
            l2 = arr2.length - 1;
          while ($i < l2) {
            $propertyKey = arr2[$i += 1];
            if ($i) {
              out += ' || ';
            }
            var $prop = it.util.getProperty($propertyKey),
              $useData = $data + $prop;
            out += ' ( ( ' + ($useData) + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
            }
            out += ') && (missing' + ($lvl) + ' = ' + (it.util.toQuotedString(it.opts.jsonPointers ? $propertyKey : $prop)) + ') ) ';
          }
        }
        out += ') {  ';
        var $propertyPath = 'missing' + $lvl,
          $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.opts.jsonPointers ? it.util.getPathExpr($currentErrorPath, $propertyPath, true) : $currentErrorPath + ' + ' + $propertyPath;
        }
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
        out += ' } else { ';
      }
    } else {
      if ($loopRequired) {
        if (!$isData) {
          out += ' var ' + ($vSchema) + ' = validate.schema' + ($schemaPath) + '; ';
        }
        var $i = 'i' + $lvl,
          $propertyPath = 'schema' + $lvl + '[' + $i + ']',
          $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.util.getPathExpr($currentErrorPath, $propertyPath, it.opts.jsonPointers);
        }
        if ($isData) {
          out += ' if (' + ($vSchema) + ' && !Array.isArray(' + ($vSchema) + ')) {  var err =   '; /* istanbul ignore else */
          if (it.createErrors !== false) {
            out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
            if (it.opts.messages !== false) {
              out += ' , message: \'';
              if (it.opts._errorDataPathProperty) {
                out += 'is a required property';
              } else {
                out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
              }
              out += '\' ';
            }
            if (it.opts.verbose) {
              out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
            }
            out += ' } ';
          } else {
            out += ' {} ';
          }
          out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (' + ($vSchema) + ' !== undefined) { ';
        }
        out += ' for (var ' + ($i) + ' = 0; ' + ($i) + ' < ' + ($vSchema) + '.length; ' + ($i) + '++) { if (' + ($data) + '[' + ($vSchema) + '[' + ($i) + ']] === undefined ';
        if ($ownProperties) {
          out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', ' + ($vSchema) + '[' + ($i) + ']) ';
        }
        out += ') {  var err =   '; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'';
            if (it.opts._errorDataPathProperty) {
              out += 'is a required property';
            } else {
              out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
            }
            out += '\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ';
        if ($isData) {
          out += '  }  ';
        }
      } else {
        var arr3 = $required;
        if (arr3) {
          var $propertyKey, i3 = -1,
            l3 = arr3.length - 1;
          while (i3 < l3) {
            $propertyKey = arr3[i3 += 1];
            var $prop = it.util.getProperty($propertyKey),
              $missingProperty = it.util.escapeQuotes($propertyKey),
              $useData = $data + $prop;
            if (it.opts._errorDataPathProperty) {
              it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);
            }
            out += ' if ( ' + ($useData) + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
            }
            out += ') {  var err =   '; /* istanbul ignore else */
            if (it.createErrors !== false) {
              out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
              if (it.opts.messages !== false) {
                out += ' , message: \'';
                if (it.opts._errorDataPathProperty) {
                  out += 'is a required property';
                } else {
                  out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
                }
                out += '\' ';
              }
              if (it.opts.verbose) {
                out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
              }
              out += ' } ';
            } else {
              out += ' {} ';
            }
            out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ';
          }
        }
      }
    }
    it.errorPath = $currentErrorPath;
  } else if ($breakOnError) {
    out += ' if (true) {';
  }
  return out;
}


/***/ }),

/***/ "uSCx":
/*!****************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/dependencies.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_dependencies(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $schemaDeps = {},
    $propertyDeps = {},
    $ownProperties = it.opts.ownProperties;
  for ($property in $schema) {
    var $sch = $schema[$property];
    var $deps = Array.isArray($sch) ? $propertyDeps : $schemaDeps;
    $deps[$property] = $sch;
  }
  out += 'var ' + ($errs) + ' = errors;';
  var $currentErrorPath = it.errorPath;
  out += 'var missing' + ($lvl) + ';';
  for (var $property in $propertyDeps) {
    $deps = $propertyDeps[$property];
    if ($deps.length) {
      out += ' if ( ' + ($data) + (it.util.getProperty($property)) + ' !== undefined ';
      if ($ownProperties) {
        out += ' && Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($property)) + '\') ';
      }
      if ($breakOnError) {
        out += ' && ( ';
        var arr1 = $deps;
        if (arr1) {
          var $propertyKey, $i = -1,
            l1 = arr1.length - 1;
          while ($i < l1) {
            $propertyKey = arr1[$i += 1];
            if ($i) {
              out += ' || ';
            }
            var $prop = it.util.getProperty($propertyKey),
              $useData = $data + $prop;
            out += ' ( ( ' + ($useData) + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
            }
            out += ') && (missing' + ($lvl) + ' = ' + (it.util.toQuotedString(it.opts.jsonPointers ? $propertyKey : $prop)) + ') ) ';
          }
        }
        out += ')) {  ';
        var $propertyPath = 'missing' + $lvl,
          $missingProperty = '\' + ' + $propertyPath + ' + \'';
        if (it.opts._errorDataPathProperty) {
          it.errorPath = it.opts.jsonPointers ? it.util.getPathExpr($currentErrorPath, $propertyPath, true) : $currentErrorPath + ' + ' + $propertyPath;
        }
        var $$outStack = $$outStack || [];
        $$outStack.push(out);
        out = ''; /* istanbul ignore else */
        if (it.createErrors !== false) {
          out += ' { keyword: \'' + ('dependencies') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { property: \'' + (it.util.escapeQuotes($property)) + '\', missingProperty: \'' + ($missingProperty) + '\', depsCount: ' + ($deps.length) + ', deps: \'' + (it.util.escapeQuotes($deps.length == 1 ? $deps[0] : $deps.join(", "))) + '\' } ';
          if (it.opts.messages !== false) {
            out += ' , message: \'should have ';
            if ($deps.length == 1) {
              out += 'property ' + (it.util.escapeQuotes($deps[0]));
            } else {
              out += 'properties ' + (it.util.escapeQuotes($deps.join(", ")));
            }
            out += ' when property ' + (it.util.escapeQuotes($property)) + ' is present\' ';
          }
          if (it.opts.verbose) {
            out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
          }
          out += ' } ';
        } else {
          out += ' {} ';
        }
        var __err = out;
        out = $$outStack.pop();
        if (!it.compositeRule && $breakOnError) {
          /* istanbul ignore if */
          if (it.async) {
            out += ' throw new ValidationError([' + (__err) + ']); ';
          } else {
            out += ' validate.errors = [' + (__err) + ']; return false; ';
          }
        } else {
          out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
        }
      } else {
        out += ' ) { ';
        var arr2 = $deps;
        if (arr2) {
          var $propertyKey, i2 = -1,
            l2 = arr2.length - 1;
          while (i2 < l2) {
            $propertyKey = arr2[i2 += 1];
            var $prop = it.util.getProperty($propertyKey),
              $missingProperty = it.util.escapeQuotes($propertyKey),
              $useData = $data + $prop;
            if (it.opts._errorDataPathProperty) {
              it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);
            }
            out += ' if ( ' + ($useData) + ' === undefined ';
            if ($ownProperties) {
              out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
            }
            out += ') {  var err =   '; /* istanbul ignore else */
            if (it.createErrors !== false) {
              out += ' { keyword: \'' + ('dependencies') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { property: \'' + (it.util.escapeQuotes($property)) + '\', missingProperty: \'' + ($missingProperty) + '\', depsCount: ' + ($deps.length) + ', deps: \'' + (it.util.escapeQuotes($deps.length == 1 ? $deps[0] : $deps.join(", "))) + '\' } ';
              if (it.opts.messages !== false) {
                out += ' , message: \'should have ';
                if ($deps.length == 1) {
                  out += 'property ' + (it.util.escapeQuotes($deps[0]));
                } else {
                  out += 'properties ' + (it.util.escapeQuotes($deps.join(", ")));
                }
                out += ' when property ' + (it.util.escapeQuotes($property)) + ' is present\' ';
              }
              if (it.opts.verbose) {
                out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
              }
              out += ' } ';
            } else {
              out += ' {} ';
            }
            out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ';
          }
        }
      }
      out += ' }   ';
      if ($breakOnError) {
        $closingBraces += '}';
        out += ' else { ';
      }
    }
  }
  it.errorPath = $currentErrorPath;
  var $currentBaseId = $it.baseId;
  for (var $property in $schemaDeps) {
    var $sch = $schemaDeps[$property];
    if (it.util.schemaHasRules($sch, it.RULES.all)) {
      out += ' ' + ($nextValid) + ' = true; if ( ' + ($data) + (it.util.getProperty($property)) + ' !== undefined ';
      if ($ownProperties) {
        out += ' && Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($property)) + '\') ';
      }
      out += ') { ';
      $it.schema = $sch;
      $it.schemaPath = $schemaPath + it.util.getProperty($property);
      $it.errSchemaPath = $errSchemaPath + '/' + it.util.escapeFragment($property);
      out += '  ' + (it.validate($it)) + ' ';
      $it.baseId = $currentBaseId;
      out += ' }  ';
      if ($breakOnError) {
        out += ' if (' + ($nextValid) + ') { ';
        $closingBraces += '}';
      }
    }
  }
  if ($breakOnError) {
    out += '   ' + ($closingBraces) + ' if (' + ($errs) + ' == errors) {';
  }
  out = it.util.cleanUpCode(out);
  return out;
}


/***/ }),

/***/ "ugD5":
/*!****************************************************!*\
  !*** ./node_modules/ajv/lib/compile/schema_obj.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(/*! ./util */ "+9rK");

module.exports = SchemaObject;

function SchemaObject(obj) {
  util.copy(obj, this);
}


/***/ }),

/***/ "v43d":
/*!**********************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/_limit.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate__limit(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $errorKeyword;
  var $data = 'data' + ($dataLvl || '');
  var $isData = it.opts.$data && $schema && $schema.$data,
    $schemaValue;
  if ($isData) {
    out += ' var schema' + ($lvl) + ' = ' + (it.util.getData($schema.$data, $dataLvl, it.dataPathArr)) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else {
    $schemaValue = $schema;
  }
  var $isMax = $keyword == 'maximum',
    $exclusiveKeyword = $isMax ? 'exclusiveMaximum' : 'exclusiveMinimum',
    $schemaExcl = it.schema[$exclusiveKeyword],
    $isDataExcl = it.opts.$data && $schemaExcl && $schemaExcl.$data,
    $op = $isMax ? '<' : '>',
    $notOp = $isMax ? '>' : '<',
    $errorKeyword = undefined;
  if ($isDataExcl) {
    var $schemaValueExcl = it.util.getData($schemaExcl.$data, $dataLvl, it.dataPathArr),
      $exclusive = 'exclusive' + $lvl,
      $exclType = 'exclType' + $lvl,
      $exclIsNumber = 'exclIsNumber' + $lvl,
      $opExpr = 'op' + $lvl,
      $opStr = '\' + ' + $opExpr + ' + \'';
    out += ' var schemaExcl' + ($lvl) + ' = ' + ($schemaValueExcl) + '; ';
    $schemaValueExcl = 'schemaExcl' + $lvl;
    out += ' var ' + ($exclusive) + '; var ' + ($exclType) + ' = typeof ' + ($schemaValueExcl) + '; if (' + ($exclType) + ' != \'boolean\' && ' + ($exclType) + ' != \'undefined\' && ' + ($exclType) + ' != \'number\') { ';
    var $errorKeyword = $exclusiveKeyword;
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = ''; /* istanbul ignore else */
    if (it.createErrors !== false) {
      out += ' { keyword: \'' + ($errorKeyword || '_exclusiveLimit') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: {} ';
      if (it.opts.messages !== false) {
        out += ' , message: \'' + ($exclusiveKeyword) + ' should be boolean\' ';
      }
      if (it.opts.verbose) {
        out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
      }
      out += ' } ';
    } else {
      out += ' {} ';
    }
    var __err = out;
    out = $$outStack.pop();
    if (!it.compositeRule && $breakOnError) {
      /* istanbul ignore if */
      if (it.async) {
        out += ' throw new ValidationError([' + (__err) + ']); ';
      } else {
        out += ' validate.errors = [' + (__err) + ']; return false; ';
      }
    } else {
      out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    }
    out += ' } else if ( ';
    if ($isData) {
      out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \'number\') || ';
    }
    out += ' ' + ($exclType) + ' == \'number\' ? ( (' + ($exclusive) + ' = ' + ($schemaValue) + ' === undefined || ' + ($schemaValueExcl) + ' ' + ($op) + '= ' + ($schemaValue) + ') ? ' + ($data) + ' ' + ($notOp) + '= ' + ($schemaValueExcl) + ' : ' + ($data) + ' ' + ($notOp) + ' ' + ($schemaValue) + ' ) : ( (' + ($exclusive) + ' = ' + ($schemaValueExcl) + ' === true) ? ' + ($data) + ' ' + ($notOp) + '= ' + ($schemaValue) + ' : ' + ($data) + ' ' + ($notOp) + ' ' + ($schemaValue) + ' ) || ' + ($data) + ' !== ' + ($data) + ') { var op' + ($lvl) + ' = ' + ($exclusive) + ' ? \'' + ($op) + '\' : \'' + ($op) + '=\'; ';
    if ($schema === undefined) {
      $errorKeyword = $exclusiveKeyword;
      $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;
      $schemaValue = $schemaValueExcl;
      $isData = $isDataExcl;
    }
  } else {
    var $exclIsNumber = typeof $schemaExcl == 'number',
      $opStr = $op;
    if ($exclIsNumber && $isData) {
      var $opExpr = '\'' + $opStr + '\'';
      out += ' if ( ';
      if ($isData) {
        out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \'number\') || ';
      }
      out += ' ( ' + ($schemaValue) + ' === undefined || ' + ($schemaExcl) + ' ' + ($op) + '= ' + ($schemaValue) + ' ? ' + ($data) + ' ' + ($notOp) + '= ' + ($schemaExcl) + ' : ' + ($data) + ' ' + ($notOp) + ' ' + ($schemaValue) + ' ) || ' + ($data) + ' !== ' + ($data) + ') { ';
    } else {
      if ($exclIsNumber && $schema === undefined) {
        $exclusive = true;
        $errorKeyword = $exclusiveKeyword;
        $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;
        $schemaValue = $schemaExcl;
        $notOp += '=';
      } else {
        if ($exclIsNumber) $schemaValue = Math[$isMax ? 'min' : 'max']($schemaExcl, $schema);
        if ($schemaExcl === ($exclIsNumber ? $schemaValue : true)) {
          $exclusive = true;
          $errorKeyword = $exclusiveKeyword;
          $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;
          $notOp += '=';
        } else {
          $exclusive = false;
          $opStr += '=';
        }
      }
      var $opExpr = '\'' + $opStr + '\'';
      out += ' if ( ';
      if ($isData) {
        out += ' (' + ($schemaValue) + ' !== undefined && typeof ' + ($schemaValue) + ' != \'number\') || ';
      }
      out += ' ' + ($data) + ' ' + ($notOp) + ' ' + ($schemaValue) + ' || ' + ($data) + ' !== ' + ($data) + ') { ';
    }
  }
  $errorKeyword = $errorKeyword || $keyword;
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = ''; /* istanbul ignore else */
  if (it.createErrors !== false) {
    out += ' { keyword: \'' + ($errorKeyword || '_limit') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { comparison: ' + ($opExpr) + ', limit: ' + ($schemaValue) + ', exclusive: ' + ($exclusive) + ' } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should be ' + ($opStr) + ' ';
      if ($isData) {
        out += '\' + ' + ($schemaValue);
      } else {
        out += '' + ($schemaValue) + '\'';
      }
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      if ($isData) {
        out += 'validate.schema' + ($schemaPath);
      } else {
        out += '' + ($schema);
      }
      out += '         , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
    }
    out += ' } ';
  } else {
    out += ' {} ';
  }
  var __err = out;
  out = $$outStack.pop();
  if (!it.compositeRule && $breakOnError) {
    /* istanbul ignore if */
    if (it.async) {
      out += ' throw new ValidationError([' + (__err) + ']); ';
    } else {
      out += ' validate.errors = [' + (__err) + ']; return false; ';
    }
  } else {
    out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  }
  out += ' } ';
  if ($breakOnError) {
    out += ' else { ';
  }
  return out;
}


/***/ }),

/***/ "vVvC":
/*!**************************************************!*\
  !*** ./node_modules/ajv/lib/dotjs/properties.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function generate_properties(it, $keyword, $ruleType) {
  var out = ' ';
  var $lvl = it.level;
  var $dataLvl = it.dataLevel;
  var $schema = it.schema[$keyword];
  var $schemaPath = it.schemaPath + it.util.getProperty($keyword);
  var $errSchemaPath = it.errSchemaPath + '/' + $keyword;
  var $breakOnError = !it.opts.allErrors;
  var $data = 'data' + ($dataLvl || '');
  var $errs = 'errs__' + $lvl;
  var $it = it.util.copy(it);
  var $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  var $key = 'key' + $lvl,
    $idx = 'idx' + $lvl,
    $dataNxt = $it.dataLevel = it.dataLevel + 1,
    $nextData = 'data' + $dataNxt,
    $dataProperties = 'dataProperties' + $lvl;
  var $schemaKeys = Object.keys($schema || {}),
    $pProperties = it.schema.patternProperties || {},
    $pPropertyKeys = Object.keys($pProperties),
    $aProperties = it.schema.additionalProperties,
    $someProperties = $schemaKeys.length || $pPropertyKeys.length,
    $noAdditional = $aProperties === false,
    $additionalIsSchema = typeof $aProperties == 'object' && Object.keys($aProperties).length,
    $removeAdditional = it.opts.removeAdditional,
    $checkAdditional = $noAdditional || $additionalIsSchema || $removeAdditional,
    $ownProperties = it.opts.ownProperties,
    $currentBaseId = it.baseId;
  var $required = it.schema.required;
  if ($required && !(it.opts.$data && $required.$data) && $required.length < it.opts.loopRequired) var $requiredHash = it.util.toHash($required);
  out += 'var ' + ($errs) + ' = errors;var ' + ($nextValid) + ' = true;';
  if ($ownProperties) {
    out += ' var ' + ($dataProperties) + ' = undefined;';
  }
  if ($checkAdditional) {
    if ($ownProperties) {
      out += ' ' + ($dataProperties) + ' = ' + ($dataProperties) + ' || Object.keys(' + ($data) + '); for (var ' + ($idx) + '=0; ' + ($idx) + '<' + ($dataProperties) + '.length; ' + ($idx) + '++) { var ' + ($key) + ' = ' + ($dataProperties) + '[' + ($idx) + ']; ';
    } else {
      out += ' for (var ' + ($key) + ' in ' + ($data) + ') { ';
    }
    if ($someProperties) {
      out += ' var isAdditional' + ($lvl) + ' = !(false ';
      if ($schemaKeys.length) {
        if ($schemaKeys.length > 8) {
          out += ' || validate.schema' + ($schemaPath) + '.hasOwnProperty(' + ($key) + ') ';
        } else {
          var arr1 = $schemaKeys;
          if (arr1) {
            var $propertyKey, i1 = -1,
              l1 = arr1.length - 1;
            while (i1 < l1) {
              $propertyKey = arr1[i1 += 1];
              out += ' || ' + ($key) + ' == ' + (it.util.toQuotedString($propertyKey)) + ' ';
            }
          }
        }
      }
      if ($pPropertyKeys.length) {
        var arr2 = $pPropertyKeys;
        if (arr2) {
          var $pProperty, $i = -1,
            l2 = arr2.length - 1;
          while ($i < l2) {
            $pProperty = arr2[$i += 1];
            out += ' || ' + (it.usePattern($pProperty)) + '.test(' + ($key) + ') ';
          }
        }
      }
      out += ' ); if (isAdditional' + ($lvl) + ') { ';
    }
    if ($removeAdditional == 'all') {
      out += ' delete ' + ($data) + '[' + ($key) + ']; ';
    } else {
      var $currentErrorPath = it.errorPath;
      var $additionalProperty = '\' + ' + $key + ' + \'';
      if (it.opts._errorDataPathProperty) {
        it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
      }
      if ($noAdditional) {
        if ($removeAdditional) {
          out += ' delete ' + ($data) + '[' + ($key) + ']; ';
        } else {
          out += ' ' + ($nextValid) + ' = false; ';
          var $currErrSchemaPath = $errSchemaPath;
          $errSchemaPath = it.errSchemaPath + '/additionalProperties';
          var $$outStack = $$outStack || [];
          $$outStack.push(out);
          out = ''; /* istanbul ignore else */
          if (it.createErrors !== false) {
            out += ' { keyword: \'' + ('additionalProperties') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { additionalProperty: \'' + ($additionalProperty) + '\' } ';
            if (it.opts.messages !== false) {
              out += ' , message: \'';
              if (it.opts._errorDataPathProperty) {
                out += 'is an invalid additional property';
              } else {
                out += 'should NOT have additional properties';
              }
              out += '\' ';
            }
            if (it.opts.verbose) {
              out += ' , schema: false , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
            }
            out += ' } ';
          } else {
            out += ' {} ';
          }
          var __err = out;
          out = $$outStack.pop();
          if (!it.compositeRule && $breakOnError) {
            /* istanbul ignore if */
            if (it.async) {
              out += ' throw new ValidationError([' + (__err) + ']); ';
            } else {
              out += ' validate.errors = [' + (__err) + ']; return false; ';
            }
          } else {
            out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
          }
          $errSchemaPath = $currErrSchemaPath;
          if ($breakOnError) {
            out += ' break; ';
          }
        }
      } else if ($additionalIsSchema) {
        if ($removeAdditional == 'failing') {
          out += ' var ' + ($errs) + ' = errors;  ';
          var $wasComposite = it.compositeRule;
          it.compositeRule = $it.compositeRule = true;
          $it.schema = $aProperties;
          $it.schemaPath = it.schemaPath + '.additionalProperties';
          $it.errSchemaPath = it.errSchemaPath + '/additionalProperties';
          $it.errorPath = it.opts._errorDataPathProperty ? it.errorPath : it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          var $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';
          } else {
            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';
          }
          out += ' if (!' + ($nextValid) + ') { errors = ' + ($errs) + '; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete ' + ($data) + '[' + ($key) + ']; }  ';
          it.compositeRule = $it.compositeRule = $wasComposite;
        } else {
          $it.schema = $aProperties;
          $it.schemaPath = it.schemaPath + '.additionalProperties';
          $it.errSchemaPath = it.errSchemaPath + '/additionalProperties';
          $it.errorPath = it.opts._errorDataPathProperty ? it.errorPath : it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          var $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';
          } else {
            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';
          }
          if ($breakOnError) {
            out += ' if (!' + ($nextValid) + ') break; ';
          }
        }
      }
      it.errorPath = $currentErrorPath;
    }
    if ($someProperties) {
      out += ' } ';
    }
    out += ' }  ';
    if ($breakOnError) {
      out += ' if (' + ($nextValid) + ') { ';
      $closingBraces += '}';
    }
  }
  var $useDefaults = it.opts.useDefaults && !it.compositeRule;
  if ($schemaKeys.length) {
    var arr3 = $schemaKeys;
    if (arr3) {
      var $propertyKey, i3 = -1,
        l3 = arr3.length - 1;
      while (i3 < l3) {
        $propertyKey = arr3[i3 += 1];
        var $sch = $schema[$propertyKey];
        if (it.util.schemaHasRules($sch, it.RULES.all)) {
          var $prop = it.util.getProperty($propertyKey),
            $passData = $data + $prop,
            $hasDefault = $useDefaults && $sch.default !== undefined;
          $it.schema = $sch;
          $it.schemaPath = $schemaPath + $prop;
          $it.errSchemaPath = $errSchemaPath + '/' + it.util.escapeFragment($propertyKey);
          $it.errorPath = it.util.getPath(it.errorPath, $propertyKey, it.opts.jsonPointers);
          $it.dataPathArr[$dataNxt] = it.util.toQuotedString($propertyKey);
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            $code = it.util.varReplace($code, $nextData, $passData);
            var $useData = $passData;
          } else {
            var $useData = $nextData;
            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ';
          }
          if ($hasDefault) {
            out += ' ' + ($code) + ' ';
          } else {
            if ($requiredHash && $requiredHash[$propertyKey]) {
              out += ' if ( ' + ($useData) + ' === undefined ';
              if ($ownProperties) {
                out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
              }
              out += ') { ' + ($nextValid) + ' = false; ';
              var $currentErrorPath = it.errorPath,
                $currErrSchemaPath = $errSchemaPath,
                $missingProperty = it.util.escapeQuotes($propertyKey);
              if (it.opts._errorDataPathProperty) {
                it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);
              }
              $errSchemaPath = it.errSchemaPath + '/required';
              var $$outStack = $$outStack || [];
              $$outStack.push(out);
              out = ''; /* istanbul ignore else */
              if (it.createErrors !== false) {
                out += ' { keyword: \'' + ('required') + '\' , dataPath: (dataPath || \'\') + ' + (it.errorPath) + ' , schemaPath: ' + (it.util.toQuotedString($errSchemaPath)) + ' , params: { missingProperty: \'' + ($missingProperty) + '\' } ';
                if (it.opts.messages !== false) {
                  out += ' , message: \'';
                  if (it.opts._errorDataPathProperty) {
                    out += 'is a required property';
                  } else {
                    out += 'should have required property \\\'' + ($missingProperty) + '\\\'';
                  }
                  out += '\' ';
                }
                if (it.opts.verbose) {
                  out += ' , schema: validate.schema' + ($schemaPath) + ' , parentSchema: validate.schema' + (it.schemaPath) + ' , data: ' + ($data) + ' ';
                }
                out += ' } ';
              } else {
                out += ' {} ';
              }
              var __err = out;
              out = $$outStack.pop();
              if (!it.compositeRule && $breakOnError) {
                /* istanbul ignore if */
                if (it.async) {
                  out += ' throw new ValidationError([' + (__err) + ']); ';
                } else {
                  out += ' validate.errors = [' + (__err) + ']; return false; ';
                }
              } else {
                out += ' var err = ' + (__err) + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
              }
              $errSchemaPath = $currErrSchemaPath;
              it.errorPath = $currentErrorPath;
              out += ' } else { ';
            } else {
              if ($breakOnError) {
                out += ' if ( ' + ($useData) + ' === undefined ';
                if ($ownProperties) {
                  out += ' || ! Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
                }
                out += ') { ' + ($nextValid) + ' = true; } else { ';
              } else {
                out += ' if (' + ($useData) + ' !== undefined ';
                if ($ownProperties) {
                  out += ' &&   Object.prototype.hasOwnProperty.call(' + ($data) + ', \'' + (it.util.escapeQuotes($propertyKey)) + '\') ';
                }
                out += ' ) { ';
              }
            }
            out += ' ' + ($code) + ' } ';
          }
        }
        if ($breakOnError) {
          out += ' if (' + ($nextValid) + ') { ';
          $closingBraces += '}';
        }
      }
    }
  }
  if ($pPropertyKeys.length) {
    var arr4 = $pPropertyKeys;
    if (arr4) {
      var $pProperty, i4 = -1,
        l4 = arr4.length - 1;
      while (i4 < l4) {
        $pProperty = arr4[i4 += 1];
        var $sch = $pProperties[$pProperty];
        if (it.util.schemaHasRules($sch, it.RULES.all)) {
          $it.schema = $sch;
          $it.schemaPath = it.schemaPath + '.patternProperties' + it.util.getProperty($pProperty);
          $it.errSchemaPath = it.errSchemaPath + '/patternProperties/' + it.util.escapeFragment($pProperty);
          if ($ownProperties) {
            out += ' ' + ($dataProperties) + ' = ' + ($dataProperties) + ' || Object.keys(' + ($data) + '); for (var ' + ($idx) + '=0; ' + ($idx) + '<' + ($dataProperties) + '.length; ' + ($idx) + '++) { var ' + ($key) + ' = ' + ($dataProperties) + '[' + ($idx) + ']; ';
          } else {
            out += ' for (var ' + ($key) + ' in ' + ($data) + ') { ';
          }
          out += ' if (' + (it.usePattern($pProperty)) + '.test(' + ($key) + ')) { ';
          $it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          var $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            out += ' ' + (it.util.varReplace($code, $nextData, $passData)) + ' ';
          } else {
            out += ' var ' + ($nextData) + ' = ' + ($passData) + '; ' + ($code) + ' ';
          }
          if ($breakOnError) {
            out += ' if (!' + ($nextValid) + ') break; ';
          }
          out += ' } ';
          if ($breakOnError) {
            out += ' else ' + ($nextValid) + ' = true; ';
          }
          out += ' }  ';
          if ($breakOnError) {
            out += ' if (' + ($nextValid) + ') { ';
            $closingBraces += '}';
          }
        }
      }
    }
  }
  if ($breakOnError) {
    out += ' ' + ($closingBraces) + ' if (' + ($errs) + ' == errors) {';
  }
  out = it.util.cleanUpCode(out);
  return out;
}


/***/ }),

/***/ "wXyd":
/*!***********************************************!*\
  !*** ./node_modules/ajv/lib/compile/rules.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ruleModules = __webpack_require__(/*! ../dotjs */ "Y3YA")
  , toHash = __webpack_require__(/*! ./util */ "+9rK").toHash;

module.exports = function rules() {
  var RULES = [
    { type: 'number',
      rules: [ { 'maximum': ['exclusiveMaximum'] },
               { 'minimum': ['exclusiveMinimum'] }, 'multipleOf', 'format'] },
    { type: 'string',
      rules: [ 'maxLength', 'minLength', 'pattern', 'format' ] },
    { type: 'array',
      rules: [ 'maxItems', 'minItems', 'items', 'contains', 'uniqueItems' ] },
    { type: 'object',
      rules: [ 'maxProperties', 'minProperties', 'required', 'dependencies', 'propertyNames',
               { 'properties': ['additionalProperties', 'patternProperties'] } ] },
    { rules: [ '$ref', 'const', 'enum', 'not', 'anyOf', 'oneOf', 'allOf', 'if' ] }
  ];

  var ALL = [ 'type', '$comment' ];
  var KEYWORDS = [
    '$schema', '$id', 'id', '$data', 'title',
    'description', 'default', 'definitions',
    'examples', 'readOnly', 'writeOnly',
    'contentMediaType', 'contentEncoding',
    'additionalItems', 'then', 'else'
  ];
  var TYPES = [ 'number', 'integer', 'string', 'array', 'object', 'boolean', 'null' ];
  RULES.all = toHash(ALL);
  RULES.types = toHash(TYPES);

  RULES.forEach(function (group) {
    group.rules = group.rules.map(function (keyword) {
      var implKeywords;
      if (typeof keyword == 'object') {
        var key = Object.keys(keyword)[0];
        implKeywords = keyword[key];
        keyword = key;
        implKeywords.forEach(function (k) {
          ALL.push(k);
          RULES.all[k] = true;
        });
      }
      ALL.push(keyword);
      var rule = RULES.all[keyword] = {
        keyword: keyword,
        code: ruleModules[keyword],
        implements: implKeywords
      };
      return rule;
    });

    RULES.all.$comment = {
      keyword: '$comment',
      code: ruleModules.$comment
    };

    if (group.type) RULES.types[group.type] = group;
  });

  RULES.keywords = toHash(ALL.concat(KEYWORDS));
  RULES.custom = {};

  return RULES;
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9jb21waWxlL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIva2V5d29yZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy91bmlxdWVJdGVtcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9fbGltaXRJdGVtcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9pZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9lbnVtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL2FsbE9mLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2NhY2hlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL2Zvcm1hdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9ub3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvY29uc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvb25lT2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvY29tbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9jb250YWlucy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9hbnlPZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kYXRhLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL3Byb3BlcnR5TmFtZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvcmVmLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL3BhdHRlcm4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvY3VzdG9tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL19saW1pdFByb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvY29tcGlsZS91Y3MybGVuZ3RoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2Fqdi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9pdGVtcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9jb21waWxlL2Vycm9yX2NsYXNzZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvY29tcGlsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9fbGltaXRMZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvY29tcGlsZS9mb3JtYXRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL211bHRpcGxlT2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvY29tcGlsZS9yZXNvbHZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2NvbXBpbGUvYXN5bmMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvcmVxdWlyZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvZGVwZW5kZW5jaWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2NvbXBpbGUvc2NoZW1hX29iai5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9fbGltaXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvcHJvcGVydGllcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9jb21waWxlL3J1bGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTs7O0FBR2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDbEMsY0FBYyxtQkFBTyxDQUFDLDBCQUFjO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxlQUFlLGNBQWM7QUFDN0I7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0Esa0ZBQWtGO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLG1FQUFtRTtBQUNuRTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0EsZ0RBQWdEO0FBQ2hELGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRUFBc0U7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN6VWE7O0FBRWIsa0JBQWtCLG1CQUFPLENBQUMsc0JBQVU7QUFDcEMsYUFBYSxtQkFBTyxDQUFDLG9CQUFROztBQUU3QjtBQUNBO0FBQ0EsS0FBSztBQUNMLGdCQUFnQixrQ0FBa0M7QUFDbEQsZ0JBQWdCLGtDQUFrQywyQkFBMkI7QUFDN0UsS0FBSztBQUNMLGdFQUFnRTtBQUNoRSxLQUFLO0FBQ0wsNkVBQTZFO0FBQzdFLEtBQUs7QUFDTDtBQUNBLGdCQUFnQiw4REFBOEQsSUFBSTtBQUNsRixLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYWp2LjhiZjc5MmMyMDJiNzg1MmYzYTY5LmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGNvcHk6IGNvcHksXHJcbiAgY2hlY2tEYXRhVHlwZTogY2hlY2tEYXRhVHlwZSxcclxuICBjaGVja0RhdGFUeXBlczogY2hlY2tEYXRhVHlwZXMsXHJcbiAgY29lcmNlVG9UeXBlczogY29lcmNlVG9UeXBlcyxcclxuICB0b0hhc2g6IHRvSGFzaCxcclxuICBnZXRQcm9wZXJ0eTogZ2V0UHJvcGVydHksXHJcbiAgZXNjYXBlUXVvdGVzOiBlc2NhcGVRdW90ZXMsXHJcbiAgZXF1YWw6IHJlcXVpcmUoJ2Zhc3QtZGVlcC1lcXVhbCcpLFxyXG4gIHVjczJsZW5ndGg6IHJlcXVpcmUoJy4vdWNzMmxlbmd0aCcpLFxyXG4gIHZhck9jY3VyZW5jZXM6IHZhck9jY3VyZW5jZXMsXHJcbiAgdmFyUmVwbGFjZTogdmFyUmVwbGFjZSxcclxuICBjbGVhblVwQ29kZTogY2xlYW5VcENvZGUsXHJcbiAgZmluYWxDbGVhblVwQ29kZTogZmluYWxDbGVhblVwQ29kZSxcclxuICBzY2hlbWFIYXNSdWxlczogc2NoZW1hSGFzUnVsZXMsXHJcbiAgc2NoZW1hSGFzUnVsZXNFeGNlcHQ6IHNjaGVtYUhhc1J1bGVzRXhjZXB0LFxyXG4gIHRvUXVvdGVkU3RyaW5nOiB0b1F1b3RlZFN0cmluZyxcclxuICBnZXRQYXRoRXhwcjogZ2V0UGF0aEV4cHIsXHJcbiAgZ2V0UGF0aDogZ2V0UGF0aCxcclxuICBnZXREYXRhOiBnZXREYXRhLFxyXG4gIHVuZXNjYXBlRnJhZ21lbnQ6IHVuZXNjYXBlRnJhZ21lbnQsXHJcbiAgdW5lc2NhcGVKc29uUG9pbnRlcjogdW5lc2NhcGVKc29uUG9pbnRlcixcclxuICBlc2NhcGVGcmFnbWVudDogZXNjYXBlRnJhZ21lbnQsXHJcbiAgZXNjYXBlSnNvblBvaW50ZXI6IGVzY2FwZUpzb25Qb2ludGVyXHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gY29weShvLCB0bykge1xyXG4gIHRvID0gdG8gfHwge307XHJcbiAgZm9yICh2YXIga2V5IGluIG8pIHRvW2tleV0gPSBvW2tleV07XHJcbiAgcmV0dXJuIHRvO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY2hlY2tEYXRhVHlwZShkYXRhVHlwZSwgZGF0YSwgbmVnYXRlKSB7XHJcbiAgdmFyIEVRVUFMID0gbmVnYXRlID8gJyAhPT0gJyA6ICcgPT09ICdcclxuICAgICwgQU5EID0gbmVnYXRlID8gJyB8fCAnIDogJyAmJiAnXHJcbiAgICAsIE9LID0gbmVnYXRlID8gJyEnIDogJydcclxuICAgICwgTk9UID0gbmVnYXRlID8gJycgOiAnISc7XHJcbiAgc3dpdGNoIChkYXRhVHlwZSkge1xyXG4gICAgY2FzZSAnbnVsbCc6IHJldHVybiBkYXRhICsgRVFVQUwgKyAnbnVsbCc7XHJcbiAgICBjYXNlICdhcnJheSc6IHJldHVybiBPSyArICdBcnJheS5pc0FycmF5KCcgKyBkYXRhICsgJyknO1xyXG4gICAgY2FzZSAnb2JqZWN0JzogcmV0dXJuICcoJyArIE9LICsgZGF0YSArIEFORCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGVvZiAnICsgZGF0YSArIEVRVUFMICsgJ1wib2JqZWN0XCInICsgQU5EICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBOT1QgKyAnQXJyYXkuaXNBcnJheSgnICsgZGF0YSArICcpKSc7XHJcbiAgICBjYXNlICdpbnRlZ2VyJzogcmV0dXJuICcodHlwZW9mICcgKyBkYXRhICsgRVFVQUwgKyAnXCJudW1iZXJcIicgKyBBTkQgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBOT1QgKyAnKCcgKyBkYXRhICsgJyAlIDEpJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIEFORCArIGRhdGEgKyBFUVVBTCArIGRhdGEgKyAnKSc7XHJcbiAgICBkZWZhdWx0OiByZXR1cm4gJ3R5cGVvZiAnICsgZGF0YSArIEVRVUFMICsgJ1wiJyArIGRhdGFUeXBlICsgJ1wiJztcclxuICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBjaGVja0RhdGFUeXBlcyhkYXRhVHlwZXMsIGRhdGEpIHtcclxuICBzd2l0Y2ggKGRhdGFUeXBlcy5sZW5ndGgpIHtcclxuICAgIGNhc2UgMTogcmV0dXJuIGNoZWNrRGF0YVR5cGUoZGF0YVR5cGVzWzBdLCBkYXRhLCB0cnVlKTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHZhciBjb2RlID0gJyc7XHJcbiAgICAgIHZhciB0eXBlcyA9IHRvSGFzaChkYXRhVHlwZXMpO1xyXG4gICAgICBpZiAodHlwZXMuYXJyYXkgJiYgdHlwZXMub2JqZWN0KSB7XHJcbiAgICAgICAgY29kZSA9IHR5cGVzLm51bGwgPyAnKCc6ICcoIScgKyBkYXRhICsgJyB8fCAnO1xyXG4gICAgICAgIGNvZGUgKz0gJ3R5cGVvZiAnICsgZGF0YSArICcgIT09IFwib2JqZWN0XCIpJztcclxuICAgICAgICBkZWxldGUgdHlwZXMubnVsbDtcclxuICAgICAgICBkZWxldGUgdHlwZXMuYXJyYXk7XHJcbiAgICAgICAgZGVsZXRlIHR5cGVzLm9iamVjdDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodHlwZXMubnVtYmVyKSBkZWxldGUgdHlwZXMuaW50ZWdlcjtcclxuICAgICAgZm9yICh2YXIgdCBpbiB0eXBlcylcclxuICAgICAgICBjb2RlICs9IChjb2RlID8gJyAmJiAnIDogJycgKSArIGNoZWNrRGF0YVR5cGUodCwgZGF0YSwgdHJ1ZSk7XHJcblxyXG4gICAgICByZXR1cm4gY29kZTtcclxuICB9XHJcbn1cclxuXHJcblxyXG52YXIgQ09FUkNFX1RPX1RZUEVTID0gdG9IYXNoKFsgJ3N0cmluZycsICdudW1iZXInLCAnaW50ZWdlcicsICdib29sZWFuJywgJ251bGwnIF0pO1xyXG5mdW5jdGlvbiBjb2VyY2VUb1R5cGVzKG9wdGlvbkNvZXJjZVR5cGVzLCBkYXRhVHlwZXMpIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhVHlwZXMpKSB7XHJcbiAgICB2YXIgdHlwZXMgPSBbXTtcclxuICAgIGZvciAodmFyIGk9MDsgaTxkYXRhVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHQgPSBkYXRhVHlwZXNbaV07XHJcbiAgICAgIGlmIChDT0VSQ0VfVE9fVFlQRVNbdF0pIHR5cGVzW3R5cGVzLmxlbmd0aF0gPSB0O1xyXG4gICAgICBlbHNlIGlmIChvcHRpb25Db2VyY2VUeXBlcyA9PT0gJ2FycmF5JyAmJiB0ID09PSAnYXJyYXknKSB0eXBlc1t0eXBlcy5sZW5ndGhdID0gdDtcclxuICAgIH1cclxuICAgIGlmICh0eXBlcy5sZW5ndGgpIHJldHVybiB0eXBlcztcclxuICB9IGVsc2UgaWYgKENPRVJDRV9UT19UWVBFU1tkYXRhVHlwZXNdKSB7XHJcbiAgICByZXR1cm4gW2RhdGFUeXBlc107XHJcbiAgfSBlbHNlIGlmIChvcHRpb25Db2VyY2VUeXBlcyA9PT0gJ2FycmF5JyAmJiBkYXRhVHlwZXMgPT09ICdhcnJheScpIHtcclxuICAgIHJldHVybiBbJ2FycmF5J107XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdG9IYXNoKGFycikge1xyXG4gIHZhciBoYXNoID0ge307XHJcbiAgZm9yICh2YXIgaT0wOyBpPGFyci5sZW5ndGg7IGkrKykgaGFzaFthcnJbaV1dID0gdHJ1ZTtcclxuICByZXR1cm4gaGFzaDtcclxufVxyXG5cclxuXHJcbnZhciBJREVOVElGSUVSID0gL15bYS16JF9dW2EteiRfMC05XSokL2k7XHJcbnZhciBTSU5HTEVfUVVPVEUgPSAvJ3xcXFxcL2c7XHJcbmZ1bmN0aW9uIGdldFByb3BlcnR5KGtleSkge1xyXG4gIHJldHVybiB0eXBlb2Yga2V5ID09ICdudW1iZXInXHJcbiAgICAgICAgICA/ICdbJyArIGtleSArICddJ1xyXG4gICAgICAgICAgOiBJREVOVElGSUVSLnRlc3Qoa2V5KVxyXG4gICAgICAgICAgICA/ICcuJyArIGtleVxyXG4gICAgICAgICAgICA6IFwiWydcIiArIGVzY2FwZVF1b3RlcyhrZXkpICsgXCInXVwiO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZXNjYXBlUXVvdGVzKHN0cikge1xyXG4gIHJldHVybiBzdHIucmVwbGFjZShTSU5HTEVfUVVPVEUsICdcXFxcJCYnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcclxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcZi9nLCAnXFxcXGYnKVxyXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx0L2csICdcXFxcdCcpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdmFyT2NjdXJlbmNlcyhzdHIsIGRhdGFWYXIpIHtcclxuICBkYXRhVmFyICs9ICdbXjAtOV0nO1xyXG4gIHZhciBtYXRjaGVzID0gc3RyLm1hdGNoKG5ldyBSZWdFeHAoZGF0YVZhciwgJ2cnKSk7XHJcbiAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzLmxlbmd0aCA6IDA7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB2YXJSZXBsYWNlKHN0ciwgZGF0YVZhciwgZXhwcikge1xyXG4gIGRhdGFWYXIgKz0gJyhbXjAtOV0pJztcclxuICBleHByID0gZXhwci5yZXBsYWNlKC9cXCQvZywgJyQkJCQnKTtcclxuICByZXR1cm4gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cChkYXRhVmFyLCAnZycpLCBleHByICsgJyQxJyk7XHJcbn1cclxuXHJcblxyXG52YXIgRU1QVFlfRUxTRSA9IC9lbHNlXFxzKntcXHMqfS9nXHJcbiAgLCBFTVBUWV9JRl9OT19FTFNFID0gL2lmXFxzKlxcKFteKV0rXFwpXFxzKlxce1xccypcXH0oPyFcXHMqZWxzZSkvZ1xyXG4gICwgRU1QVFlfSUZfV0lUSF9FTFNFID0gL2lmXFxzKlxcKChbXildKylcXClcXHMqXFx7XFxzKlxcfVxccyplbHNlKD8hXFxzKmlmKS9nO1xyXG5mdW5jdGlvbiBjbGVhblVwQ29kZShvdXQpIHtcclxuICByZXR1cm4gb3V0LnJlcGxhY2UoRU1QVFlfRUxTRSwgJycpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKEVNUFRZX0lGX05PX0VMU0UsICcnKVxyXG4gICAgICAgICAgICAucmVwbGFjZShFTVBUWV9JRl9XSVRIX0VMU0UsICdpZiAoISgkMSkpJyk7XHJcbn1cclxuXHJcblxyXG52YXIgRVJST1JTX1JFR0VYUCA9IC9bXnYuXWVycm9ycy9nXHJcbiAgLCBSRU1PVkVfRVJST1JTID0gL3ZhciBlcnJvcnMgPSAwO3x2YXIgdkVycm9ycyA9IG51bGw7fHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7L2dcclxuICAsIFJFTU9WRV9FUlJPUlNfQVNZTkMgPSAvdmFyIGVycm9ycyA9IDA7fHZhciB2RXJyb3JzID0gbnVsbDsvZ1xyXG4gICwgUkVUVVJOX1ZBTElEID0gJ3JldHVybiBlcnJvcnMgPT09IDA7J1xyXG4gICwgUkVUVVJOX1RSVUUgPSAndmFsaWRhdGUuZXJyb3JzID0gbnVsbDsgcmV0dXJuIHRydWU7J1xyXG4gICwgUkVUVVJOX0FTWU5DID0gL2lmIFxcKGVycm9ycyA9PT0gMFxcKSByZXR1cm4gZGF0YTtcXHMqZWxzZSB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yXFwodkVycm9yc1xcKTsvXHJcbiAgLCBSRVRVUk5fREFUQV9BU1lOQyA9ICdyZXR1cm4gZGF0YTsnXHJcbiAgLCBST09UREFUQV9SRUdFWFAgPSAvW15BLVphLXpfJF1yb290RGF0YVteQS1aYS16MC05XyRdL2dcclxuICAsIFJFTU9WRV9ST09UREFUQSA9IC9pZiBcXChyb290RGF0YSA9PT0gdW5kZWZpbmVkXFwpIHJvb3REYXRhID0gZGF0YTsvO1xyXG5cclxuZnVuY3Rpb24gZmluYWxDbGVhblVwQ29kZShvdXQsIGFzeW5jKSB7XHJcbiAgdmFyIG1hdGNoZXMgPSBvdXQubWF0Y2goRVJST1JTX1JFR0VYUCk7XHJcbiAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPT0gMikge1xyXG4gICAgb3V0ID0gYXN5bmNcclxuICAgICAgICAgID8gb3V0LnJlcGxhY2UoUkVNT1ZFX0VSUk9SU19BU1lOQywgJycpXHJcbiAgICAgICAgICAgICAgIC5yZXBsYWNlKFJFVFVSTl9BU1lOQywgUkVUVVJOX0RBVEFfQVNZTkMpXHJcbiAgICAgICAgICA6IG91dC5yZXBsYWNlKFJFTU9WRV9FUlJPUlMsICcnKVxyXG4gICAgICAgICAgICAgICAucmVwbGFjZShSRVRVUk5fVkFMSUQsIFJFVFVSTl9UUlVFKTtcclxuICB9XHJcblxyXG4gIG1hdGNoZXMgPSBvdXQubWF0Y2goUk9PVERBVEFfUkVHRVhQKTtcclxuICBpZiAoIW1hdGNoZXMgfHwgbWF0Y2hlcy5sZW5ndGggIT09IDMpIHJldHVybiBvdXQ7XHJcbiAgcmV0dXJuIG91dC5yZXBsYWNlKFJFTU9WRV9ST09UREFUQSwgJycpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gc2NoZW1hSGFzUnVsZXMoc2NoZW1hLCBydWxlcykge1xyXG4gIGlmICh0eXBlb2Ygc2NoZW1hID09ICdib29sZWFuJykgcmV0dXJuICFzY2hlbWE7XHJcbiAgZm9yICh2YXIga2V5IGluIHNjaGVtYSkgaWYgKHJ1bGVzW2tleV0pIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gc2NoZW1hSGFzUnVsZXNFeGNlcHQoc2NoZW1hLCBydWxlcywgZXhjZXB0S2V5d29yZCkge1xyXG4gIGlmICh0eXBlb2Ygc2NoZW1hID09ICdib29sZWFuJykgcmV0dXJuICFzY2hlbWEgJiYgZXhjZXB0S2V5d29yZCAhPSAnbm90JztcclxuICBmb3IgKHZhciBrZXkgaW4gc2NoZW1hKSBpZiAoa2V5ICE9IGV4Y2VwdEtleXdvcmQgJiYgcnVsZXNba2V5XSkgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB0b1F1b3RlZFN0cmluZyhzdHIpIHtcclxuICByZXR1cm4gJ1xcJycgKyBlc2NhcGVRdW90ZXMoc3RyKSArICdcXCcnO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0UGF0aEV4cHIoY3VycmVudFBhdGgsIGV4cHIsIGpzb25Qb2ludGVycywgaXNOdW1iZXIpIHtcclxuICB2YXIgcGF0aCA9IGpzb25Qb2ludGVycyAvLyBmYWxzZSBieSBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgPyAnXFwnL1xcJyArICcgKyBleHByICsgKGlzTnVtYmVyID8gJycgOiAnLnJlcGxhY2UoL34vZywgXFwnfjBcXCcpLnJlcGxhY2UoL1xcXFwvL2csIFxcJ34xXFwnKScpXHJcbiAgICAgICAgICAgICAgOiAoaXNOdW1iZXIgPyAnXFwnW1xcJyArICcgKyBleHByICsgJyArIFxcJ11cXCcnIDogJ1xcJ1tcXFxcXFwnXFwnICsgJyArIGV4cHIgKyAnICsgXFwnXFxcXFxcJ11cXCcnKTtcclxuICByZXR1cm4gam9pblBhdGhzKGN1cnJlbnRQYXRoLCBwYXRoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFBhdGgoY3VycmVudFBhdGgsIHByb3AsIGpzb25Qb2ludGVycykge1xyXG4gIHZhciBwYXRoID0ganNvblBvaW50ZXJzIC8vIGZhbHNlIGJ5IGRlZmF1bHRcclxuICAgICAgICAgICAgICA/IHRvUXVvdGVkU3RyaW5nKCcvJyArIGVzY2FwZUpzb25Qb2ludGVyKHByb3ApKVxyXG4gICAgICAgICAgICAgIDogdG9RdW90ZWRTdHJpbmcoZ2V0UHJvcGVydHkocHJvcCkpO1xyXG4gIHJldHVybiBqb2luUGF0aHMoY3VycmVudFBhdGgsIHBhdGgpO1xyXG59XHJcblxyXG5cclxudmFyIEpTT05fUE9JTlRFUiA9IC9eXFwvKD86W15+XXx+MHx+MSkqJC87XHJcbnZhciBSRUxBVElWRV9KU09OX1BPSU5URVIgPSAvXihbMC05XSspKCN8XFwvKD86W15+XXx+MHx+MSkqKT8kLztcclxuZnVuY3Rpb24gZ2V0RGF0YSgkZGF0YSwgbHZsLCBwYXRocykge1xyXG4gIHZhciB1cCwganNvblBvaW50ZXIsIGRhdGEsIG1hdGNoZXM7XHJcbiAgaWYgKCRkYXRhID09PSAnJykgcmV0dXJuICdyb290RGF0YSc7XHJcbiAgaWYgKCRkYXRhWzBdID09ICcvJykge1xyXG4gICAgaWYgKCFKU09OX1BPSU5URVIudGVzdCgkZGF0YSkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBKU09OLXBvaW50ZXI6ICcgKyAkZGF0YSk7XHJcbiAgICBqc29uUG9pbnRlciA9ICRkYXRhO1xyXG4gICAgZGF0YSA9ICdyb290RGF0YSc7XHJcbiAgfSBlbHNlIHtcclxuICAgIG1hdGNoZXMgPSAkZGF0YS5tYXRjaChSRUxBVElWRV9KU09OX1BPSU5URVIpO1xyXG4gICAgaWYgKCFtYXRjaGVzKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSlNPTi1wb2ludGVyOiAnICsgJGRhdGEpO1xyXG4gICAgdXAgPSArbWF0Y2hlc1sxXTtcclxuICAgIGpzb25Qb2ludGVyID0gbWF0Y2hlc1syXTtcclxuICAgIGlmIChqc29uUG9pbnRlciA9PSAnIycpIHtcclxuICAgICAgaWYgKHVwID49IGx2bCkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWNjZXNzIHByb3BlcnR5L2luZGV4ICcgKyB1cCArICcgbGV2ZWxzIHVwLCBjdXJyZW50IGxldmVsIGlzICcgKyBsdmwpO1xyXG4gICAgICByZXR1cm4gcGF0aHNbbHZsIC0gdXBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh1cCA+IGx2bCkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWNjZXNzIGRhdGEgJyArIHVwICsgJyBsZXZlbHMgdXAsIGN1cnJlbnQgbGV2ZWwgaXMgJyArIGx2bCk7XHJcbiAgICBkYXRhID0gJ2RhdGEnICsgKChsdmwgLSB1cCkgfHwgJycpO1xyXG4gICAgaWYgKCFqc29uUG9pbnRlcikgcmV0dXJuIGRhdGE7XHJcbiAgfVxyXG5cclxuICB2YXIgZXhwciA9IGRhdGE7XHJcbiAgdmFyIHNlZ21lbnRzID0ganNvblBvaW50ZXIuc3BsaXQoJy8nKTtcclxuICBmb3IgKHZhciBpPTA7IGk8c2VnbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBzZWdtZW50ID0gc2VnbWVudHNbaV07XHJcbiAgICBpZiAoc2VnbWVudCkge1xyXG4gICAgICBkYXRhICs9IGdldFByb3BlcnR5KHVuZXNjYXBlSnNvblBvaW50ZXIoc2VnbWVudCkpO1xyXG4gICAgICBleHByICs9ICcgJiYgJyArIGRhdGE7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBleHByO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gam9pblBhdGhzIChhLCBiKSB7XHJcbiAgaWYgKGEgPT0gJ1wiXCInKSByZXR1cm4gYjtcclxuICByZXR1cm4gKGEgKyAnICsgJyArIGIpLnJlcGxhY2UoLycgXFwrICcvZywgJycpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gdW5lc2NhcGVGcmFnbWVudChzdHIpIHtcclxuICByZXR1cm4gdW5lc2NhcGVKc29uUG9pbnRlcihkZWNvZGVVUklDb21wb25lbnQoc3RyKSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBlc2NhcGVGcmFnbWVudChzdHIpIHtcclxuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGVzY2FwZUpzb25Qb2ludGVyKHN0cikpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZXNjYXBlSnNvblBvaW50ZXIoc3RyKSB7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9+L2csICd+MCcpLnJlcGxhY2UoL1xcLy9nLCAnfjEnKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHVuZXNjYXBlSnNvblBvaW50ZXIoc3RyKSB7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9+MS9nLCAnLycpLnJlcGxhY2UoL34wL2csICd+Jyk7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIElERU5USUZJRVIgPSAvXlthLXpfJF1bYS16MC05XyQtXSokL2k7XHJcbnZhciBjdXN0b21SdWxlQ29kZSA9IHJlcXVpcmUoJy4vZG90anMvY3VzdG9tJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBhZGQ6IGFkZEtleXdvcmQsXHJcbiAgZ2V0OiBnZXRLZXl3b3JkLFxyXG4gIHJlbW92ZTogcmVtb3ZlS2V5d29yZFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIERlZmluZSBjdXN0b20ga2V5d29yZFxyXG4gKiBAdGhpcyAgQWp2XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXl3b3JkIGN1c3RvbSBrZXl3b3JkLCBzaG91bGQgYmUgdW5pcXVlIChpbmNsdWRpbmcgZGlmZmVyZW50IGZyb20gYWxsIHN0YW5kYXJkLCBjdXN0b20gYW5kIG1hY3JvIGtleXdvcmRzKS5cclxuICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb24ga2V5d29yZCBkZWZpbml0aW9uIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgYHR5cGVgICh0eXBlKHMpIHdoaWNoIHRoZSBrZXl3b3JkIGFwcGxpZXMgdG8pLCBgdmFsaWRhdGVgIG9yIGBjb21waWxlYC5cclxuICogQHJldHVybiB7QWp2fSB0aGlzIGZvciBtZXRob2QgY2hhaW5pbmdcclxuICovXHJcbmZ1bmN0aW9uIGFkZEtleXdvcmQoa2V5d29yZCwgZGVmaW5pdGlvbikge1xyXG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cclxuICAvKiBlc2xpbnQgbm8tc2hhZG93OiAwICovXHJcbiAgdmFyIFJVTEVTID0gdGhpcy5SVUxFUztcclxuXHJcbiAgaWYgKFJVTEVTLmtleXdvcmRzW2tleXdvcmRdKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdLZXl3b3JkICcgKyBrZXl3b3JkICsgJyBpcyBhbHJlYWR5IGRlZmluZWQnKTtcclxuXHJcbiAgaWYgKCFJREVOVElGSUVSLnRlc3Qoa2V5d29yZCkpXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleXdvcmQgJyArIGtleXdvcmQgKyAnIGlzIG5vdCBhIHZhbGlkIGlkZW50aWZpZXInKTtcclxuXHJcbiAgaWYgKGRlZmluaXRpb24pIHtcclxuICAgIGlmIChkZWZpbml0aW9uLm1hY3JvICYmIGRlZmluaXRpb24udmFsaWQgIT09IHVuZGVmaW5lZClcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcInZhbGlkXCIgb3B0aW9uIGNhbm5vdCBiZSB1c2VkIHdpdGggbWFjcm8ga2V5d29yZHMnKTtcclxuXHJcbiAgICB2YXIgZGF0YVR5cGUgPSBkZWZpbml0aW9uLnR5cGU7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhVHlwZSkpIHtcclxuICAgICAgdmFyIGksIGxlbiA9IGRhdGFUeXBlLmxlbmd0aDtcclxuICAgICAgZm9yIChpPTA7IGk8bGVuOyBpKyspIGNoZWNrRGF0YVR5cGUoZGF0YVR5cGVbaV0pO1xyXG4gICAgICBmb3IgKGk9MDsgaTxsZW47IGkrKykgX2FkZFJ1bGUoa2V5d29yZCwgZGF0YVR5cGVbaV0sIGRlZmluaXRpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGRhdGFUeXBlKSBjaGVja0RhdGFUeXBlKGRhdGFUeXBlKTtcclxuICAgICAgX2FkZFJ1bGUoa2V5d29yZCwgZGF0YVR5cGUsIGRlZmluaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciAkZGF0YSA9IGRlZmluaXRpb24uJGRhdGEgPT09IHRydWUgJiYgdGhpcy5fb3B0cy4kZGF0YTtcclxuICAgIGlmICgkZGF0YSAmJiAhZGVmaW5pdGlvbi52YWxpZGF0ZSlcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCckZGF0YSBzdXBwb3J0OiBcInZhbGlkYXRlXCIgZnVuY3Rpb24gaXMgbm90IGRlZmluZWQnKTtcclxuXHJcbiAgICB2YXIgbWV0YVNjaGVtYSA9IGRlZmluaXRpb24ubWV0YVNjaGVtYTtcclxuICAgIGlmIChtZXRhU2NoZW1hKSB7XHJcbiAgICAgIGlmICgkZGF0YSkge1xyXG4gICAgICAgIG1ldGFTY2hlbWEgPSB7XHJcbiAgICAgICAgICBhbnlPZjogW1xyXG4gICAgICAgICAgICBtZXRhU2NoZW1hLFxyXG4gICAgICAgICAgICB7ICckcmVmJzogJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9lcG9iZXJlemtpbi9hanYvbWFzdGVyL2xpYi9yZWZzL2RhdGEuanNvbiMnIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIGRlZmluaXRpb24udmFsaWRhdGVTY2hlbWEgPSB0aGlzLmNvbXBpbGUobWV0YVNjaGVtYSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBSVUxFUy5rZXl3b3Jkc1trZXl3b3JkXSA9IFJVTEVTLmFsbFtrZXl3b3JkXSA9IHRydWU7XHJcblxyXG5cclxuICBmdW5jdGlvbiBfYWRkUnVsZShrZXl3b3JkLCBkYXRhVHlwZSwgZGVmaW5pdGlvbikge1xyXG4gICAgdmFyIHJ1bGVHcm91cDtcclxuICAgIGZvciAodmFyIGk9MDsgaTxSVUxFUy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcmcgPSBSVUxFU1tpXTtcclxuICAgICAgaWYgKHJnLnR5cGUgPT0gZGF0YVR5cGUpIHtcclxuICAgICAgICBydWxlR3JvdXAgPSByZztcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghcnVsZUdyb3VwKSB7XHJcbiAgICAgIHJ1bGVHcm91cCA9IHsgdHlwZTogZGF0YVR5cGUsIHJ1bGVzOiBbXSB9O1xyXG4gICAgICBSVUxFUy5wdXNoKHJ1bGVHcm91cCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJ1bGUgPSB7XHJcbiAgICAgIGtleXdvcmQ6IGtleXdvcmQsXHJcbiAgICAgIGRlZmluaXRpb246IGRlZmluaXRpb24sXHJcbiAgICAgIGN1c3RvbTogdHJ1ZSxcclxuICAgICAgY29kZTogY3VzdG9tUnVsZUNvZGUsXHJcbiAgICAgIGltcGxlbWVudHM6IGRlZmluaXRpb24uaW1wbGVtZW50c1xyXG4gICAgfTtcclxuICAgIHJ1bGVHcm91cC5ydWxlcy5wdXNoKHJ1bGUpO1xyXG4gICAgUlVMRVMuY3VzdG9tW2tleXdvcmRdID0gcnVsZTtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBjaGVja0RhdGFUeXBlKGRhdGFUeXBlKSB7XHJcbiAgICBpZiAoIVJVTEVTLnR5cGVzW2RhdGFUeXBlXSkgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHR5cGUgJyArIGRhdGFUeXBlKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEdldCBrZXl3b3JkXHJcbiAqIEB0aGlzICBBanZcclxuICogQHBhcmFtIHtTdHJpbmd9IGtleXdvcmQgcHJlLWRlZmluZWQgb3IgY3VzdG9tIGtleXdvcmQuXHJcbiAqIEByZXR1cm4ge09iamVjdHxCb29sZWFufSBjdXN0b20ga2V5d29yZCBkZWZpbml0aW9uLCBgdHJ1ZWAgaWYgaXQgaXMgYSBwcmVkZWZpbmVkIGtleXdvcmQsIGBmYWxzZWAgb3RoZXJ3aXNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0S2V5d29yZChrZXl3b3JkKSB7XHJcbiAgLyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xyXG4gIHZhciBydWxlID0gdGhpcy5SVUxFUy5jdXN0b21ba2V5d29yZF07XHJcbiAgcmV0dXJuIHJ1bGUgPyBydWxlLmRlZmluaXRpb24gOiB0aGlzLlJVTEVTLmtleXdvcmRzW2tleXdvcmRdIHx8IGZhbHNlO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSBrZXl3b3JkXHJcbiAqIEB0aGlzICBBanZcclxuICogQHBhcmFtIHtTdHJpbmd9IGtleXdvcmQgcHJlLWRlZmluZWQgb3IgY3VzdG9tIGtleXdvcmQuXHJcbiAqIEByZXR1cm4ge0Fqdn0gdGhpcyBmb3IgbWV0aG9kIGNoYWluaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiByZW1vdmVLZXl3b3JkKGtleXdvcmQpIHtcclxuICAvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXHJcbiAgdmFyIFJVTEVTID0gdGhpcy5SVUxFUztcclxuICBkZWxldGUgUlVMRVMua2V5d29yZHNba2V5d29yZF07XHJcbiAgZGVsZXRlIFJVTEVTLmFsbFtrZXl3b3JkXTtcclxuICBkZWxldGUgUlVMRVMuY3VzdG9tW2tleXdvcmRdO1xyXG4gIGZvciAodmFyIGk9MDsgaTxSVUxFUy5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHJ1bGVzID0gUlVMRVNbaV0ucnVsZXM7XHJcbiAgICBmb3IgKHZhciBqPTA7IGo8cnVsZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKHJ1bGVzW2pdLmtleXdvcmQgPT0ga2V5d29yZCkge1xyXG4gICAgICAgIHJ1bGVzLnNwbGljZShqLCAxKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfdW5pcXVlSXRlbXMoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xyXG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgdmFyICR2YWxpZCA9ICd2YWxpZCcgKyAkbHZsO1xyXG4gIHZhciAkaXNEYXRhID0gaXQub3B0cy4kZGF0YSAmJiAkc2NoZW1hICYmICRzY2hlbWEuJGRhdGEsXHJcbiAgICAkc2NoZW1hVmFsdWU7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnIHZhciBzY2hlbWEnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC5nZXREYXRhKCRzY2hlbWEuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFycikpICsgJzsgJztcclxuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcclxuICB9IGVsc2Uge1xyXG4gICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYTtcclxuICB9XHJcbiAgaWYgKCgkc2NoZW1hIHx8ICRpc0RhdGEpICYmIGl0Lm9wdHMudW5pcXVlSXRlbXMgIT09IGZhbHNlKSB7XHJcbiAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICBvdXQgKz0gJyB2YXIgJyArICgkdmFsaWQpICsgJzsgaWYgKCcgKyAoJHNjaGVtYVZhbHVlKSArICcgPT09IGZhbHNlIHx8ICcgKyAoJHNjaGVtYVZhbHVlKSArICcgPT09IHVuZGVmaW5lZCkgJyArICgkdmFsaWQpICsgJyA9IHRydWU7IGVsc2UgaWYgKHR5cGVvZiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9IFxcJ2Jvb2xlYW5cXCcpICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgZWxzZSB7ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB2YXIgaSA9ICcgKyAoJGRhdGEpICsgJy5sZW5ndGggLCAnICsgKCR2YWxpZCkgKyAnID0gdHJ1ZSAsIGo7IGlmIChpID4gMSkgeyAnO1xyXG4gICAgdmFyICRpdGVtVHlwZSA9IGl0LnNjaGVtYS5pdGVtcyAmJiBpdC5zY2hlbWEuaXRlbXMudHlwZSxcclxuICAgICAgJHR5cGVJc0FycmF5ID0gQXJyYXkuaXNBcnJheSgkaXRlbVR5cGUpO1xyXG4gICAgaWYgKCEkaXRlbVR5cGUgfHwgJGl0ZW1UeXBlID09ICdvYmplY3QnIHx8ICRpdGVtVHlwZSA9PSAnYXJyYXknIHx8ICgkdHlwZUlzQXJyYXkgJiYgKCRpdGVtVHlwZS5pbmRleE9mKCdvYmplY3QnKSA+PSAwIHx8ICRpdGVtVHlwZS5pbmRleE9mKCdhcnJheScpID49IDApKSkge1xyXG4gICAgICBvdXQgKz0gJyBvdXRlcjogZm9yICg7aS0tOykgeyBmb3IgKGogPSBpOyBqLS07KSB7IGlmIChlcXVhbCgnICsgKCRkYXRhKSArICdbaV0sICcgKyAoJGRhdGEpICsgJ1tqXSkpIHsgJyArICgkdmFsaWQpICsgJyA9IGZhbHNlOyBicmVhayBvdXRlcjsgfSB9IH0gJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHZhciBpdGVtSW5kaWNlcyA9IHt9LCBpdGVtOyBmb3IgKDtpLS07KSB7IHZhciBpdGVtID0gJyArICgkZGF0YSkgKyAnW2ldOyAnO1xyXG4gICAgICB2YXIgJG1ldGhvZCA9ICdjaGVja0RhdGFUeXBlJyArICgkdHlwZUlzQXJyYXkgPyAncycgOiAnJyk7XHJcbiAgICAgIG91dCArPSAnIGlmICgnICsgKGl0LnV0aWxbJG1ldGhvZF0oJGl0ZW1UeXBlLCAnaXRlbScsIHRydWUpKSArICcpIGNvbnRpbnVlOyAnO1xyXG4gICAgICBpZiAoJHR5cGVJc0FycmF5KSB7XHJcbiAgICAgICAgb3V0ICs9ICcgaWYgKHR5cGVvZiBpdGVtID09IFxcJ3N0cmluZ1xcJykgaXRlbSA9IFxcJ1wiXFwnICsgaXRlbTsgJztcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyBpZiAodHlwZW9mIGl0ZW1JbmRpY2VzW2l0ZW1dID09IFxcJ251bWJlclxcJykgeyAnICsgKCR2YWxpZCkgKyAnID0gZmFsc2U7IGogPSBpdGVtSW5kaWNlc1tpdGVtXTsgYnJlYWs7IH0gaXRlbUluZGljZXNbaXRlbV0gPSBpOyB9ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICBvdXQgKz0gJyAgfSAgJztcclxuICAgIH1cclxuICAgIG91dCArPSAnIGlmICghJyArICgkdmFsaWQpICsgJykgeyAgICc7XHJcbiAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCd1bmlxdWVJdGVtcycpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgaTogaSwgajogaiB9ICc7XHJcbiAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIE5PVCBoYXZlIGR1cGxpY2F0ZSBpdGVtcyAoaXRlbXMgIyMgXFwnICsgaiArIFxcJyBhbmQgXFwnICsgaSArIFxcJyBhcmUgaWRlbnRpY2FsKVxcJyAnO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogICc7XHJcbiAgICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICAgIG91dCArPSAndmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ICs9ICcgICAgICAgICAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgfVxyXG4gICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICBvdXQgKz0gJyBlbHNlIHsgJztcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfdmFsaWRhdGUoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyc7XHJcbiAgdmFyICRhc3luYyA9IGl0LnNjaGVtYS4kYXN5bmMgPT09IHRydWUsXHJcbiAgICAkcmVmS2V5d29yZHMgPSBpdC51dGlsLnNjaGVtYUhhc1J1bGVzRXhjZXB0KGl0LnNjaGVtYSwgaXQuUlVMRVMuYWxsLCAnJHJlZicpLFxyXG4gICAgJGlkID0gaXQuc2VsZi5fZ2V0SWQoaXQuc2NoZW1hKTtcclxuICBpZiAoaXQuaXNUb3ApIHtcclxuICAgIG91dCArPSAnIHZhciB2YWxpZGF0ZSA9ICc7XHJcbiAgICBpZiAoJGFzeW5jKSB7XHJcbiAgICAgIGl0LmFzeW5jID0gdHJ1ZTtcclxuICAgICAgb3V0ICs9ICdhc3luYyAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICdmdW5jdGlvbihkYXRhLCBkYXRhUGF0aCwgcGFyZW50RGF0YSwgcGFyZW50RGF0YVByb3BlcnR5LCByb290RGF0YSkgeyBcXCd1c2Ugc3RyaWN0XFwnOyAnO1xyXG4gICAgaWYgKCRpZCAmJiAoaXQub3B0cy5zb3VyY2VDb2RlIHx8IGl0Lm9wdHMucHJvY2Vzc0NvZGUpKSB7XHJcbiAgICAgIG91dCArPSAnICcgKyAoJy9cXCojIHNvdXJjZVVSTD0nICsgJGlkICsgJyAqLycpICsgJyAnO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAodHlwZW9mIGl0LnNjaGVtYSA9PSAnYm9vbGVhbicgfHwgISgkcmVmS2V5d29yZHMgfHwgaXQuc2NoZW1hLiRyZWYpKSB7XHJcbiAgICB2YXIgJGtleXdvcmQgPSAnZmFsc2Ugc2NoZW1hJztcclxuICAgIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XHJcbiAgICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XHJcbiAgICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICAgIHZhciAkZXJyb3JLZXl3b3JkO1xyXG4gICAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcclxuICAgIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcclxuICAgIGlmIChpdC5zY2hlbWEgPT09IGZhbHNlKSB7XHJcbiAgICAgIGlmIChpdC5pc1RvcCkge1xyXG4gICAgICAgICRicmVha09uRXJyb3IgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnIHZhciAnICsgKCR2YWxpZCkgKyAnID0gZmFsc2U7ICc7XHJcbiAgICAgIH1cclxuICAgICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCRlcnJvcktleXdvcmQgfHwgJ2ZhbHNlIHNjaGVtYScpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHt9ICc7XHJcbiAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ2Jvb2xlYW4gc2NoZW1hIGlzIGZhbHNlXFwnICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiBmYWxzZSAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnIHt9ICc7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xyXG4gICAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgIGlmIChpdC5hc3luYykge1xyXG4gICAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGl0LmlzVG9wKSB7XHJcbiAgICAgICAgaWYgKCRhc3luYykge1xyXG4gICAgICAgICAgb3V0ICs9ICcgcmV0dXJuIGRhdGE7ICc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IG51bGw7IHJldHVybiB0cnVlOyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdmFsaWQpICsgJyA9IHRydWU7ICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChpdC5pc1RvcCkge1xyXG4gICAgICBvdXQgKz0gJyB9OyByZXR1cm4gdmFsaWRhdGU7ICc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG4gIH1cclxuICBpZiAoaXQuaXNUb3ApIHtcclxuICAgIHZhciAkdG9wID0gaXQuaXNUb3AsXHJcbiAgICAgICRsdmwgPSBpdC5sZXZlbCA9IDAsXHJcbiAgICAgICRkYXRhTHZsID0gaXQuZGF0YUxldmVsID0gMCxcclxuICAgICAgJGRhdGEgPSAnZGF0YSc7XHJcbiAgICBpdC5yb290SWQgPSBpdC5yZXNvbHZlLmZ1bGxQYXRoKGl0LnNlbGYuX2dldElkKGl0LnJvb3Quc2NoZW1hKSk7XHJcbiAgICBpdC5iYXNlSWQgPSBpdC5iYXNlSWQgfHwgaXQucm9vdElkO1xyXG4gICAgZGVsZXRlIGl0LmlzVG9wO1xyXG4gICAgaXQuZGF0YVBhdGhBcnIgPSBbdW5kZWZpbmVkXTtcclxuICAgIG91dCArPSAnIHZhciB2RXJyb3JzID0gbnVsbDsgJztcclxuICAgIG91dCArPSAnIHZhciBlcnJvcnMgPSAwOyAgICAgJztcclxuICAgIG91dCArPSAnIGlmIChyb290RGF0YSA9PT0gdW5kZWZpbmVkKSByb290RGF0YSA9IGRhdGE7ICc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciAkbHZsID0gaXQubGV2ZWwsXHJcbiAgICAgICRkYXRhTHZsID0gaXQuZGF0YUxldmVsLFxyXG4gICAgICAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgICBpZiAoJGlkKSBpdC5iYXNlSWQgPSBpdC5yZXNvbHZlLnVybChpdC5iYXNlSWQsICRpZCk7XHJcbiAgICBpZiAoJGFzeW5jICYmICFpdC5hc3luYykgdGhyb3cgbmV3IEVycm9yKCdhc3luYyBzY2hlbWEgaW4gc3luYyBzY2hlbWEnKTtcclxuICAgIG91dCArPSAnIHZhciBlcnJzXycgKyAoJGx2bCkgKyAnID0gZXJyb3JzOyc7XHJcbiAgfVxyXG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bCxcclxuICAgICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnMsXHJcbiAgICAkY2xvc2luZ0JyYWNlczEgPSAnJyxcclxuICAgICRjbG9zaW5nQnJhY2VzMiA9ICcnO1xyXG4gIHZhciAkZXJyb3JLZXl3b3JkO1xyXG4gIHZhciAkdHlwZVNjaGVtYSA9IGl0LnNjaGVtYS50eXBlLFxyXG4gICAgJHR5cGVJc0FycmF5ID0gQXJyYXkuaXNBcnJheSgkdHlwZVNjaGVtYSk7XHJcbiAgaWYgKCR0eXBlU2NoZW1hICYmIGl0Lm9wdHMubnVsbGFibGUgJiYgaXQuc2NoZW1hLm51bGxhYmxlID09PSB0cnVlKSB7XHJcbiAgICBpZiAoJHR5cGVJc0FycmF5KSB7XHJcbiAgICAgIGlmICgkdHlwZVNjaGVtYS5pbmRleE9mKCdudWxsJykgPT0gLTEpICR0eXBlU2NoZW1hID0gJHR5cGVTY2hlbWEuY29uY2F0KCdudWxsJyk7XHJcbiAgICB9IGVsc2UgaWYgKCR0eXBlU2NoZW1hICE9ICdudWxsJykge1xyXG4gICAgICAkdHlwZVNjaGVtYSA9IFskdHlwZVNjaGVtYSwgJ251bGwnXTtcclxuICAgICAgJHR5cGVJc0FycmF5ID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCR0eXBlSXNBcnJheSAmJiAkdHlwZVNjaGVtYS5sZW5ndGggPT0gMSkge1xyXG4gICAgJHR5cGVTY2hlbWEgPSAkdHlwZVNjaGVtYVswXTtcclxuICAgICR0eXBlSXNBcnJheSA9IGZhbHNlO1xyXG4gIH1cclxuICBpZiAoaXQuc2NoZW1hLiRyZWYgJiYgJHJlZktleXdvcmRzKSB7XHJcbiAgICBpZiAoaXQub3B0cy5leHRlbmRSZWZzID09ICdmYWlsJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJyRyZWY6IHZhbGlkYXRpb24ga2V5d29yZHMgdXNlZCBpbiBzY2hlbWEgYXQgcGF0aCBcIicgKyBpdC5lcnJTY2hlbWFQYXRoICsgJ1wiIChzZWUgb3B0aW9uIGV4dGVuZFJlZnMpJyk7XHJcbiAgICB9IGVsc2UgaWYgKGl0Lm9wdHMuZXh0ZW5kUmVmcyAhPT0gdHJ1ZSkge1xyXG4gICAgICAkcmVmS2V5d29yZHMgPSBmYWxzZTtcclxuICAgICAgaXQubG9nZ2VyLndhcm4oJyRyZWY6IGtleXdvcmRzIGlnbm9yZWQgaW4gc2NoZW1hIGF0IHBhdGggXCInICsgaXQuZXJyU2NoZW1hUGF0aCArICdcIicpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoaXQuc2NoZW1hLiRjb21tZW50ICYmIGl0Lm9wdHMuJGNvbW1lbnQpIHtcclxuICAgIG91dCArPSAnICcgKyAoaXQuUlVMRVMuYWxsLiRjb21tZW50LmNvZGUoaXQsICckY29tbWVudCcpKTtcclxuICB9XHJcbiAgaWYgKCR0eXBlU2NoZW1hKSB7XHJcbiAgICBpZiAoaXQub3B0cy5jb2VyY2VUeXBlcykge1xyXG4gICAgICB2YXIgJGNvZXJjZVRvVHlwZXMgPSBpdC51dGlsLmNvZXJjZVRvVHlwZXMoaXQub3B0cy5jb2VyY2VUeXBlcywgJHR5cGVTY2hlbWEpO1xyXG4gICAgfVxyXG4gICAgdmFyICRydWxlc0dyb3VwID0gaXQuUlVMRVMudHlwZXNbJHR5cGVTY2hlbWFdO1xyXG4gICAgaWYgKCRjb2VyY2VUb1R5cGVzIHx8ICR0eXBlSXNBcnJheSB8fCAkcnVsZXNHcm91cCA9PT0gdHJ1ZSB8fCAoJHJ1bGVzR3JvdXAgJiYgISRzaG91bGRVc2VHcm91cCgkcnVsZXNHcm91cCkpKSB7XHJcbiAgICAgIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyAnLnR5cGUnLFxyXG4gICAgICAgICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvdHlwZSc7XHJcbiAgICAgIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyAnLnR5cGUnLFxyXG4gICAgICAgICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvdHlwZScsXHJcbiAgICAgICAgJG1ldGhvZCA9ICR0eXBlSXNBcnJheSA/ICdjaGVja0RhdGFUeXBlcycgOiAnY2hlY2tEYXRhVHlwZSc7XHJcbiAgICAgIG91dCArPSAnIGlmICgnICsgKGl0LnV0aWxbJG1ldGhvZF0oJHR5cGVTY2hlbWEsICRkYXRhLCB0cnVlKSkgKyAnKSB7ICc7XHJcbiAgICAgIGlmICgkY29lcmNlVG9UeXBlcykge1xyXG4gICAgICAgIHZhciAkZGF0YVR5cGUgPSAnZGF0YVR5cGUnICsgJGx2bCxcclxuICAgICAgICAgICRjb2VyY2VkID0gJ2NvZXJjZWQnICsgJGx2bDtcclxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkZGF0YVR5cGUpICsgJyA9IHR5cGVvZiAnICsgKCRkYXRhKSArICc7ICc7XHJcbiAgICAgICAgaWYgKGl0Lm9wdHMuY29lcmNlVHlwZXMgPT0gJ2FycmF5Jykge1xyXG4gICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnb2JqZWN0XFwnICYmIEFycmF5LmlzQXJyYXkoJyArICgkZGF0YSkgKyAnKSkgJyArICgkZGF0YVR5cGUpICsgJyA9IFxcJ2FycmF5XFwnOyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkY29lcmNlZCkgKyAnID0gdW5kZWZpbmVkOyAnO1xyXG4gICAgICAgIHZhciAkYnJhY2VzQ29lcmNpb24gPSAnJztcclxuICAgICAgICB2YXIgYXJyMSA9ICRjb2VyY2VUb1R5cGVzO1xyXG4gICAgICAgIGlmIChhcnIxKSB7XHJcbiAgICAgICAgICB2YXIgJHR5cGUsICRpID0gLTEsXHJcbiAgICAgICAgICAgIGwxID0gYXJyMS5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgd2hpbGUgKCRpIDwgbDEpIHtcclxuICAgICAgICAgICAgJHR5cGUgPSBhcnIxWyRpICs9IDFdO1xyXG4gICAgICAgICAgICBpZiAoJGkpIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyBpZiAoJyArICgkY29lcmNlZCkgKyAnID09PSB1bmRlZmluZWQpIHsgJztcclxuICAgICAgICAgICAgICAkYnJhY2VzQ29lcmNpb24gKz0gJ30nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpdC5vcHRzLmNvZXJjZVR5cGVzID09ICdhcnJheScgJiYgJHR5cGUgIT0gJ2FycmF5Jykge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRkYXRhVHlwZSkgKyAnID09IFxcJ2FycmF5XFwnICYmICcgKyAoJGRhdGEpICsgJy5sZW5ndGggPT0gMSkgeyAnICsgKCRjb2VyY2VkKSArICcgPSAnICsgKCRkYXRhKSArICcgPSAnICsgKCRkYXRhKSArICdbMF07ICcgKyAoJGRhdGFUeXBlKSArICcgPSB0eXBlb2YgJyArICgkZGF0YSkgKyAnOyAgfSAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgkdHlwZSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRkYXRhVHlwZSkgKyAnID09IFxcJ251bWJlclxcJyB8fCAnICsgKCRkYXRhVHlwZSkgKyAnID09IFxcJ2Jvb2xlYW5cXCcpICcgKyAoJGNvZXJjZWQpICsgJyA9IFxcJ1xcJyArICcgKyAoJGRhdGEpICsgJzsgZWxzZSBpZiAoJyArICgkZGF0YSkgKyAnID09PSBudWxsKSAnICsgKCRjb2VyY2VkKSArICcgPSBcXCdcXCc7ICc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHR5cGUgPT0gJ251bWJlcicgfHwgJHR5cGUgPT0gJ2ludGVnZXInKSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnYm9vbGVhblxcJyB8fCAnICsgKCRkYXRhKSArICcgPT09IG51bGwgfHwgKCcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnc3RyaW5nXFwnICYmICcgKyAoJGRhdGEpICsgJyAmJiAnICsgKCRkYXRhKSArICcgPT0gKycgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgICAgICAgICAgIGlmICgkdHlwZSA9PSAnaW50ZWdlcicpIHtcclxuICAgICAgICAgICAgICAgIG91dCArPSAnICYmICEoJyArICgkZGF0YSkgKyAnICUgMSknO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBvdXQgKz0gJykpICcgKyAoJGNvZXJjZWQpICsgJyA9ICsnICsgKCRkYXRhKSArICc7ICc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHR5cGUgPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGEpICsgJyA9PT0gXFwnZmFsc2VcXCcgfHwgJyArICgkZGF0YSkgKyAnID09PSAwIHx8ICcgKyAoJGRhdGEpICsgJyA9PT0gbnVsbCkgJyArICgkY29lcmNlZCkgKyAnID0gZmFsc2U7IGVsc2UgaWYgKCcgKyAoJGRhdGEpICsgJyA9PT0gXFwndHJ1ZVxcJyB8fCAnICsgKCRkYXRhKSArICcgPT09IDEpICcgKyAoJGNvZXJjZWQpICsgJyA9IHRydWU7ICc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHR5cGUgPT0gJ251bGwnKSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGEpICsgJyA9PT0gXFwnXFwnIHx8ICcgKyAoJGRhdGEpICsgJyA9PT0gMCB8fCAnICsgKCRkYXRhKSArICcgPT09IGZhbHNlKSAnICsgKCRjb2VyY2VkKSArICcgPSBudWxsOyAnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGl0Lm9wdHMuY29lcmNlVHlwZXMgPT0gJ2FycmF5JyAmJiAkdHlwZSA9PSAnYXJyYXknKSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnc3RyaW5nXFwnIHx8ICcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnbnVtYmVyXFwnIHx8ICcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnYm9vbGVhblxcJyB8fCAnICsgKCRkYXRhKSArICcgPT0gbnVsbCkgJyArICgkY29lcmNlZCkgKyAnID0gWycgKyAoJGRhdGEpICsgJ107ICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ICs9ICcgJyArICgkYnJhY2VzQ29lcmNpb24pICsgJyBpZiAoJyArICgkY29lcmNlZCkgKyAnID09PSB1bmRlZmluZWQpIHsgICAnO1xyXG4gICAgICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcclxuICAgICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgICAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCRlcnJvcktleXdvcmQgfHwgJ3R5cGUnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IHR5cGU6IFxcJyc7XHJcbiAgICAgICAgICBpZiAoJHR5cGVJc0FycmF5KSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnJyArICgkdHlwZVNjaGVtYS5qb2luKFwiLFwiKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3V0ICs9ICdcXCcgfSAnO1xyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIGJlICc7XHJcbiAgICAgICAgICAgIGlmICgkdHlwZUlzQXJyYXkpIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEuam9pbihcIixcIikpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnJyArICgkdHlwZVNjaGVtYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3V0ICs9ICcge30gJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XHJcbiAgICAgICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgKz0gJyB9IGVsc2UgeyAgJztcclxuICAgICAgICB2YXIgJHBhcmVudERhdGEgPSAkZGF0YUx2bCA/ICdkYXRhJyArICgoJGRhdGFMdmwgLSAxKSB8fCAnJykgOiAncGFyZW50RGF0YScsXHJcbiAgICAgICAgICAkcGFyZW50RGF0YVByb3BlcnR5ID0gJGRhdGFMdmwgPyBpdC5kYXRhUGF0aEFyclskZGF0YUx2bF0gOiAncGFyZW50RGF0YVByb3BlcnR5JztcclxuICAgICAgICBvdXQgKz0gJyAnICsgKCRkYXRhKSArICcgPSAnICsgKCRjb2VyY2VkKSArICc7ICc7XHJcbiAgICAgICAgaWYgKCEkZGF0YUx2bCkge1xyXG4gICAgICAgICAgb3V0ICs9ICdpZiAoJyArICgkcGFyZW50RGF0YSkgKyAnICE9PSB1bmRlZmluZWQpJztcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ICs9ICcgJyArICgkcGFyZW50RGF0YSkgKyAnWycgKyAoJHBhcmVudERhdGFQcm9wZXJ0eSkgKyAnXSA9ICcgKyAoJGNvZXJjZWQpICsgJzsgfSAnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcclxuICAgICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgICAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCRlcnJvcktleXdvcmQgfHwgJ3R5cGUnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IHR5cGU6IFxcJyc7XHJcbiAgICAgICAgICBpZiAoJHR5cGVJc0FycmF5KSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnJyArICgkdHlwZVNjaGVtYS5qb2luKFwiLFwiKSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3V0ICs9ICdcXCcgfSAnO1xyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIGJlICc7XHJcbiAgICAgICAgICAgIGlmICgkdHlwZUlzQXJyYXkpIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEuam9pbihcIixcIikpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnJyArICgkdHlwZVNjaGVtYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3V0ICs9ICcge30gJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XHJcbiAgICAgICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChpdC5zY2hlbWEuJHJlZiAmJiAhJHJlZktleXdvcmRzKSB7XHJcbiAgICBvdXQgKz0gJyAnICsgKGl0LlJVTEVTLmFsbC4kcmVmLmNvZGUoaXQsICckcmVmJykpICsgJyAnO1xyXG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgb3V0ICs9ICcgfSBpZiAoZXJyb3JzID09PSAnO1xyXG4gICAgICBpZiAoJHRvcCkge1xyXG4gICAgICAgIG91dCArPSAnMCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICdlcnJzXycgKyAoJGx2bCk7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcpIHsgJztcclxuICAgICAgJGNsb3NpbmdCcmFjZXMyICs9ICd9JztcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIGFycjIgPSBpdC5SVUxFUztcclxuICAgIGlmIChhcnIyKSB7XHJcbiAgICAgIHZhciAkcnVsZXNHcm91cCwgaTIgPSAtMSxcclxuICAgICAgICBsMiA9IGFycjIubGVuZ3RoIC0gMTtcclxuICAgICAgd2hpbGUgKGkyIDwgbDIpIHtcclxuICAgICAgICAkcnVsZXNHcm91cCA9IGFycjJbaTIgKz0gMV07XHJcbiAgICAgICAgaWYgKCRzaG91bGRVc2VHcm91cCgkcnVsZXNHcm91cCkpIHtcclxuICAgICAgICAgIGlmICgkcnVsZXNHcm91cC50eXBlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKGl0LnV0aWwuY2hlY2tEYXRhVHlwZSgkcnVsZXNHcm91cC50eXBlLCAkZGF0YSkpICsgJykgeyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMudXNlRGVmYXVsdHMgJiYgIWl0LmNvbXBvc2l0ZVJ1bGUpIHtcclxuICAgICAgICAgICAgaWYgKCRydWxlc0dyb3VwLnR5cGUgPT0gJ29iamVjdCcgJiYgaXQuc2NoZW1hLnByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYS5wcm9wZXJ0aWVzLFxyXG4gICAgICAgICAgICAgICAgJHNjaGVtYUtleXMgPSBPYmplY3Qua2V5cygkc2NoZW1hKTtcclxuICAgICAgICAgICAgICB2YXIgYXJyMyA9ICRzY2hlbWFLZXlzO1xyXG4gICAgICAgICAgICAgIGlmIChhcnIzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHByb3BlcnR5S2V5LCBpMyA9IC0xLFxyXG4gICAgICAgICAgICAgICAgICBsMyA9IGFycjMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpMyA8IGwzKSB7XHJcbiAgICAgICAgICAgICAgICAgICRwcm9wZXJ0eUtleSA9IGFycjNbaTMgKz0gMV07XHJcbiAgICAgICAgICAgICAgICAgIHZhciAkc2NoID0gJHNjaGVtYVskcHJvcGVydHlLZXldO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoJHNjaC5kZWZhdWx0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHBhc3NEYXRhID0gJGRhdGEgKyBpdC51dGlsLmdldFByb3BlcnR5KCRwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgIGlmICgnICsgKCRwYXNzRGF0YSkgKyAnID09PSB1bmRlZmluZWQgJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy51c2VEZWZhdWx0cyA9PSAnZW1wdHknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyB8fCAnICsgKCRwYXNzRGF0YSkgKyAnID09PSBudWxsIHx8ICcgKyAoJHBhc3NEYXRhKSArICcgPT09IFxcJ1xcJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyApICcgKyAoJHBhc3NEYXRhKSArICcgPSAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdC5vcHRzLnVzZURlZmF1bHRzID09ICdzaGFyZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyAnICsgKGl0LnVzZURlZmF1bHQoJHNjaC5kZWZhdWx0KSkgKyAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnICcgKyAoSlNPTi5zdHJpbmdpZnkoJHNjaC5kZWZhdWx0KSkgKyAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG91dCArPSAnOyAnO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRydWxlc0dyb3VwLnR5cGUgPT0gJ2FycmF5JyAmJiBBcnJheS5pc0FycmF5KGl0LnNjaGVtYS5pdGVtcykpIHtcclxuICAgICAgICAgICAgICB2YXIgYXJyNCA9IGl0LnNjaGVtYS5pdGVtcztcclxuICAgICAgICAgICAgICBpZiAoYXJyNCkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRzY2gsICRpID0gLTEsXHJcbiAgICAgICAgICAgICAgICAgIGw0ID0gYXJyNC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCRpIDwgbDQpIHtcclxuICAgICAgICAgICAgICAgICAgJHNjaCA9IGFycjRbJGkgKz0gMV07XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkc2NoLmRlZmF1bHQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRpICsgJ10nO1xyXG4gICAgICAgICAgICAgICAgICAgIG91dCArPSAnICBpZiAoJyArICgkcGFzc0RhdGEpICsgJyA9PT0gdW5kZWZpbmVkICc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMudXNlRGVmYXVsdHMgPT0gJ2VtcHR5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgfHwgJyArICgkcGFzc0RhdGEpICsgJyA9PT0gbnVsbCB8fCAnICsgKCRwYXNzRGF0YSkgKyAnID09PSBcXCdcXCcgJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgKSAnICsgKCRwYXNzRGF0YSkgKyAnID0gJztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy51c2VEZWZhdWx0cyA9PSAnc2hhcmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgJyArIChpdC51c2VEZWZhdWx0KCRzY2guZGVmYXVsdCkpICsgJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyAnICsgKEpTT04uc3RyaW5naWZ5KCRzY2guZGVmYXVsdCkpICsgJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJzsgJztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIGFycjUgPSAkcnVsZXNHcm91cC5ydWxlcztcclxuICAgICAgICAgIGlmIChhcnI1KSB7XHJcbiAgICAgICAgICAgIHZhciAkcnVsZSwgaTUgPSAtMSxcclxuICAgICAgICAgICAgICBsNSA9IGFycjUubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgd2hpbGUgKGk1IDwgbDUpIHtcclxuICAgICAgICAgICAgICAkcnVsZSA9IGFycjVbaTUgKz0gMV07XHJcbiAgICAgICAgICAgICAgaWYgKCRzaG91bGRVc2VSdWxlKCRydWxlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyICRjb2RlID0gJHJ1bGUuY29kZShpdCwgJHJ1bGUua2V5d29yZCwgJHJ1bGVzR3JvdXAudHlwZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgJyArICgkY29kZSkgKyAnICc7XHJcbiAgICAgICAgICAgICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGNsb3NpbmdCcmFjZXMxICs9ICd9JztcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgJyArICgkY2xvc2luZ0JyYWNlczEpICsgJyAnO1xyXG4gICAgICAgICAgICAkY2xvc2luZ0JyYWNlczEgPSAnJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICgkcnVsZXNHcm91cC50eXBlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgICAgICAgaWYgKCR0eXBlU2NoZW1hICYmICR0eXBlU2NoZW1hID09PSAkcnVsZXNHcm91cC50eXBlICYmICEkY29lcmNlVG9UeXBlcykge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnIGVsc2UgeyAnO1xyXG4gICAgICAgICAgICAgIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyAnLnR5cGUnLFxyXG4gICAgICAgICAgICAgICAgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy90eXBlJztcclxuICAgICAgICAgICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgICAgICAgICAgICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgICAgICAgICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgICAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgkZXJyb3JLZXl3b3JkIHx8ICd0eXBlJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyB0eXBlOiBcXCcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKCR0eXBlSXNBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEuam9pbihcIixcIikpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcnICsgKCR0eXBlU2NoZW1hKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dCArPSAnXFwnIH0gJztcclxuICAgICAgICAgICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBiZSAnO1xyXG4gICAgICAgICAgICAgICAgICBpZiAoJHR5cGVJc0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICcnICsgKCR0eXBlU2NoZW1hLmpvaW4oXCIsXCIpKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnXFwnICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG91dCArPSAnIHt9ICc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHZhciBfX2VyciA9IG91dDtcclxuICAgICAgICAgICAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgICAgICAgIGlmIChpdC5hc3luYykge1xyXG4gICAgICAgICAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyBpZiAoZXJyb3JzID09PSAnO1xyXG4gICAgICAgICAgICBpZiAoJHRvcCkge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnMCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICdlcnJzXycgKyAoJGx2bCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0ICs9ICcpIHsgJztcclxuICAgICAgICAgICAgJGNsb3NpbmdCcmFjZXMyICs9ICd9JztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgIG91dCArPSAnICcgKyAoJGNsb3NpbmdCcmFjZXMyKSArICcgJztcclxuICB9XHJcbiAgaWYgKCR0b3ApIHtcclxuICAgIGlmICgkYXN5bmMpIHtcclxuICAgICAgb3V0ICs9ICcgaWYgKGVycm9ycyA9PT0gMCkgcmV0dXJuIGRhdGE7ICAgICAgICAgICAnO1xyXG4gICAgICBvdXQgKz0gJyBlbHNlIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodkVycm9ycyk7ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzOyAnO1xyXG4gICAgICBvdXQgKz0gJyByZXR1cm4gZXJyb3JzID09PSAwOyAgICAgICAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgfTsgcmV0dXJuIHZhbGlkYXRlOyc7XHJcbiAgfSBlbHNlIHtcclxuICAgIG91dCArPSAnIHZhciAnICsgKCR2YWxpZCkgKyAnID0gZXJyb3JzID09PSBlcnJzXycgKyAoJGx2bCkgKyAnOyc7XHJcbiAgfVxyXG4gIG91dCA9IGl0LnV0aWwuY2xlYW5VcENvZGUob3V0KTtcclxuICBpZiAoJHRvcCkge1xyXG4gICAgb3V0ID0gaXQudXRpbC5maW5hbENsZWFuVXBDb2RlKG91dCwgJGFzeW5jKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uICRzaG91bGRVc2VHcm91cCgkcnVsZXNHcm91cCkge1xyXG4gICAgdmFyIHJ1bGVzID0gJHJ1bGVzR3JvdXAucnVsZXM7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKVxyXG4gICAgICBpZiAoJHNob3VsZFVzZVJ1bGUocnVsZXNbaV0pKSByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uICRzaG91bGRVc2VSdWxlKCRydWxlKSB7XHJcbiAgICByZXR1cm4gaXQuc2NoZW1hWyRydWxlLmtleXdvcmRdICE9PSB1bmRlZmluZWQgfHwgKCRydWxlLmltcGxlbWVudHMgJiYgJHJ1bGVJbXBsZW1lbnRzU29tZUtleXdvcmQoJHJ1bGUpKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uICRydWxlSW1wbGVtZW50c1NvbWVLZXl3b3JkKCRydWxlKSB7XHJcbiAgICB2YXIgaW1wbCA9ICRydWxlLmltcGxlbWVudHM7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltcGwubGVuZ3RoOyBpKyspXHJcbiAgICAgIGlmIChpdC5zY2hlbWFbaW1wbFtpXV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX19saW1pdEl0ZW1zKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGVycm9yS2V5d29yZDtcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkaXNEYXRhID0gaXQub3B0cy4kZGF0YSAmJiAkc2NoZW1hICYmICRzY2hlbWEuJGRhdGEsXHJcbiAgICAkc2NoZW1hVmFsdWU7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnIHZhciBzY2hlbWEnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC5nZXREYXRhKCRzY2hlbWEuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFycikpICsgJzsgJztcclxuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcclxuICB9IGVsc2Uge1xyXG4gICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYTtcclxuICB9XHJcbiAgdmFyICRvcCA9ICRrZXl3b3JkID09ICdtYXhJdGVtcycgPyAnPicgOiAnPCc7XHJcbiAgb3V0ICs9ICdpZiAoICc7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnbnVtYmVyXFwnKSB8fCAnO1xyXG4gIH1cclxuICBvdXQgKz0gJyAnICsgKCRkYXRhKSArICcubGVuZ3RoICcgKyAoJG9wKSArICcgJyArICgkc2NoZW1hVmFsdWUpICsgJykgeyAnO1xyXG4gIHZhciAkZXJyb3JLZXl3b3JkID0gJGtleXdvcmQ7XHJcbiAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICQkb3V0U3RhY2sucHVzaChvdXQpO1xyXG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAnX2xpbWl0SXRlbXMnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGxpbWl0OiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnIH0gJztcclxuICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBOT1QgaGF2ZSAnO1xyXG4gICAgICBpZiAoJGtleXdvcmQgPT0gJ21heEl0ZW1zJykge1xyXG4gICAgICAgIG91dCArPSAnbW9yZSc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICdmZXdlcic7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcgdGhhbiAnO1xyXG4gICAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICAgIG91dCArPSAnXFwnICsgJyArICgkc2NoZW1hVmFsdWUpICsgJyArIFxcJyc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWEpO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnIGl0ZW1zXFwnICc7XHJcbiAgICB9XHJcbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgIG91dCArPSAnICwgc2NoZW1hOiAgJztcclxuICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hKTtcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyAgICAgICAgICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgfSAnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB7fSAnO1xyXG4gIH1cclxuICB2YXIgX19lcnIgPSBvdXQ7XHJcbiAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgfVxyXG4gIG91dCArPSAnfSAnO1xyXG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcclxuICB9XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfaWYoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xyXG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgdmFyICR2YWxpZCA9ICd2YWxpZCcgKyAkbHZsO1xyXG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcclxuICB2YXIgJGl0ID0gaXQudXRpbC5jb3B5KGl0KTtcclxuICAkaXQubGV2ZWwrKztcclxuICB2YXIgJG5leHRWYWxpZCA9ICd2YWxpZCcgKyAkaXQubGV2ZWw7XHJcbiAgdmFyICR0aGVuU2NoID0gaXQuc2NoZW1hWyd0aGVuJ10sXHJcbiAgICAkZWxzZVNjaCA9IGl0LnNjaGVtYVsnZWxzZSddLFxyXG4gICAgJHRoZW5QcmVzZW50ID0gJHRoZW5TY2ggIT09IHVuZGVmaW5lZCAmJiBpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCR0aGVuU2NoLCBpdC5SVUxFUy5hbGwpLFxyXG4gICAgJGVsc2VQcmVzZW50ID0gJGVsc2VTY2ggIT09IHVuZGVmaW5lZCAmJiBpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRlbHNlU2NoLCBpdC5SVUxFUy5hbGwpLFxyXG4gICAgJGN1cnJlbnRCYXNlSWQgPSAkaXQuYmFzZUlkO1xyXG4gIGlmICgkdGhlblByZXNlbnQgfHwgJGVsc2VQcmVzZW50KSB7XHJcbiAgICB2YXIgJGlmQ2xhdXNlO1xyXG4gICAgJGl0LmNyZWF0ZUVycm9ycyA9IGZhbHNlO1xyXG4gICAgJGl0LnNjaGVtYSA9ICRzY2hlbWE7XHJcbiAgICAkaXQuc2NoZW1hUGF0aCA9ICRzY2hlbWFQYXRoO1xyXG4gICAgJGl0LmVyclNjaGVtYVBhdGggPSAkZXJyU2NoZW1hUGF0aDtcclxuICAgIG91dCArPSAnIHZhciAnICsgKCRlcnJzKSArICcgPSBlcnJvcnM7IHZhciAnICsgKCR2YWxpZCkgKyAnID0gdHJ1ZTsgICc7XHJcbiAgICB2YXIgJHdhc0NvbXBvc2l0ZSA9IGl0LmNvbXBvc2l0ZVJ1bGU7XHJcbiAgICBpdC5jb21wb3NpdGVSdWxlID0gJGl0LmNvbXBvc2l0ZVJ1bGUgPSB0cnVlO1xyXG4gICAgb3V0ICs9ICcgICcgKyAoaXQudmFsaWRhdGUoJGl0KSkgKyAnICc7XHJcbiAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XHJcbiAgICAkaXQuY3JlYXRlRXJyb3JzID0gdHJ1ZTtcclxuICAgIG91dCArPSAnICBlcnJvcnMgPSAnICsgKCRlcnJzKSArICc7IGlmICh2RXJyb3JzICE9PSBudWxsKSB7IGlmICgnICsgKCRlcnJzKSArICcpIHZFcnJvcnMubGVuZ3RoID0gJyArICgkZXJycykgKyAnOyBlbHNlIHZFcnJvcnMgPSBudWxsOyB9ICAnO1xyXG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcclxuICAgIGlmICgkdGhlblByZXNlbnQpIHtcclxuICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICAnO1xyXG4gICAgICAkaXQuc2NoZW1hID0gaXQuc2NoZW1hWyd0aGVuJ107XHJcbiAgICAgICRpdC5zY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArICcudGhlbic7XHJcbiAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvdGhlbic7XHJcbiAgICAgIG91dCArPSAnICAnICsgKGl0LnZhbGlkYXRlKCRpdCkpICsgJyAnO1xyXG4gICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XHJcbiAgICAgIG91dCArPSAnICcgKyAoJHZhbGlkKSArICcgPSAnICsgKCRuZXh0VmFsaWQpICsgJzsgJztcclxuICAgICAgaWYgKCR0aGVuUHJlc2VudCAmJiAkZWxzZVByZXNlbnQpIHtcclxuICAgICAgICAkaWZDbGF1c2UgPSAnaWZDbGF1c2UnICsgJGx2bDtcclxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkaWZDbGF1c2UpICsgJyA9IFxcJ3RoZW5cXCc7ICc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJGlmQ2xhdXNlID0gJ1xcJ3RoZW5cXCcnO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgaWYgKCRlbHNlUHJlc2VudCkge1xyXG4gICAgICAgIG91dCArPSAnIGVsc2UgeyAnO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyBpZiAoIScgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICc7XHJcbiAgICB9XHJcbiAgICBpZiAoJGVsc2VQcmVzZW50KSB7XHJcbiAgICAgICRpdC5zY2hlbWEgPSBpdC5zY2hlbWFbJ2Vsc2UnXTtcclxuICAgICAgJGl0LnNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgJy5lbHNlJztcclxuICAgICAgJGl0LmVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy9lbHNlJztcclxuICAgICAgb3V0ICs9ICcgICcgKyAoaXQudmFsaWRhdGUoJGl0KSkgKyAnICc7XHJcbiAgICAgICRpdC5iYXNlSWQgPSAkY3VycmVudEJhc2VJZDtcclxuICAgICAgb3V0ICs9ICcgJyArICgkdmFsaWQpICsgJyA9ICcgKyAoJG5leHRWYWxpZCkgKyAnOyAnO1xyXG4gICAgICBpZiAoJHRoZW5QcmVzZW50ICYmICRlbHNlUHJlc2VudCkge1xyXG4gICAgICAgICRpZkNsYXVzZSA9ICdpZkNsYXVzZScgKyAkbHZsO1xyXG4gICAgICAgIG91dCArPSAnIHZhciAnICsgKCRpZkNsYXVzZSkgKyAnID0gXFwnZWxzZVxcJzsgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkaWZDbGF1c2UgPSAnXFwnZWxzZVxcJyc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgdmFyIGVyciA9ICAgJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnaWYnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGZhaWxpbmdLZXl3b3JkOiAnICsgKCRpZkNsYXVzZSkgKyAnIH0gJztcclxuICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgbWF0Y2ggXCJcXCcgKyAnICsgKCRpZkNsYXVzZSkgKyAnICsgXFwnXCIgc2NoZW1hXFwnICc7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xyXG4gICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICcge30gJztcclxuICAgIH1cclxuICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih2RXJyb3JzKTsgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG91dCArPSAnIH0gICAnO1xyXG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgb3V0ICs9ICcgZWxzZSB7ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgPSBpdC51dGlsLmNsZWFuVXBDb2RlKG91dCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgIG91dCArPSAnIGlmICh0cnVlKSB7ICc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX2VudW0oaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xyXG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgdmFyICR2YWxpZCA9ICd2YWxpZCcgKyAkbHZsO1xyXG4gIHZhciAkaXNEYXRhID0gaXQub3B0cy4kZGF0YSAmJiAkc2NoZW1hICYmICRzY2hlbWEuJGRhdGEsXHJcbiAgICAkc2NoZW1hVmFsdWU7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnIHZhciBzY2hlbWEnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC5nZXREYXRhKCRzY2hlbWEuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFycikpICsgJzsgJztcclxuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcclxuICB9IGVsc2Uge1xyXG4gICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYTtcclxuICB9XHJcbiAgdmFyICRpID0gJ2knICsgJGx2bCxcclxuICAgICR2U2NoZW1hID0gJ3NjaGVtYScgKyAkbHZsO1xyXG4gIGlmICghJGlzRGF0YSkge1xyXG4gICAgb3V0ICs9ICcgdmFyICcgKyAoJHZTY2hlbWEpICsgJyA9IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJzsnO1xyXG4gIH1cclxuICBvdXQgKz0gJ3ZhciAnICsgKCR2YWxpZCkgKyAnOyc7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnIGlmIChzY2hlbWEnICsgKCRsdmwpICsgJyA9PT0gdW5kZWZpbmVkKSAnICsgKCR2YWxpZCkgKyAnID0gdHJ1ZTsgZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoc2NoZW1hJyArICgkbHZsKSArICcpKSAnICsgKCR2YWxpZCkgKyAnID0gZmFsc2U7IGVsc2Ugeyc7XHJcbiAgfVxyXG4gIG91dCArPSAnJyArICgkdmFsaWQpICsgJyA9IGZhbHNlO2ZvciAodmFyICcgKyAoJGkpICsgJz0wOyAnICsgKCRpKSArICc8JyArICgkdlNjaGVtYSkgKyAnLmxlbmd0aDsgJyArICgkaSkgKyAnKyspIGlmIChlcXVhbCgnICsgKCRkYXRhKSArICcsICcgKyAoJHZTY2hlbWEpICsgJ1snICsgKCRpKSArICddKSkgeyAnICsgKCR2YWxpZCkgKyAnID0gdHJ1ZTsgYnJlYWs7IH0nO1xyXG4gIGlmICgkaXNEYXRhKSB7XHJcbiAgICBvdXQgKz0gJyAgfSAgJztcclxuICB9XHJcbiAgb3V0ICs9ICcgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgJztcclxuICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnZW51bScpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgYWxsb3dlZFZhbHVlczogc2NoZW1hJyArICgkbHZsKSArICcgfSAnO1xyXG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIGJlIGVxdWFsIHRvIG9uZSBvZiB0aGUgYWxsb3dlZCB2YWx1ZXNcXCcgJztcclxuICAgIH1cclxuICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgIH1cclxuICAgIG91dCArPSAnIH0gJztcclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ICs9ICcge30gJztcclxuICB9XHJcbiAgdmFyIF9fZXJyID0gb3V0O1xyXG4gIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XHJcbiAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xyXG4gIH1cclxuICBvdXQgKz0gJyB9JztcclxuICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgb3V0ICs9ICcgZWxzZSB7ICc7XHJcbiAgfVxyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX2FsbE9mKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGl0ID0gaXQudXRpbC5jb3B5KGl0KTtcclxuICB2YXIgJGNsb3NpbmdCcmFjZXMgPSAnJztcclxuICAkaXQubGV2ZWwrKztcclxuICB2YXIgJG5leHRWYWxpZCA9ICd2YWxpZCcgKyAkaXQubGV2ZWw7XHJcbiAgdmFyICRjdXJyZW50QmFzZUlkID0gJGl0LmJhc2VJZCxcclxuICAgICRhbGxTY2hlbWFzRW1wdHkgPSB0cnVlO1xyXG4gIHZhciBhcnIxID0gJHNjaGVtYTtcclxuICBpZiAoYXJyMSkge1xyXG4gICAgdmFyICRzY2gsICRpID0gLTEsXHJcbiAgICAgIGwxID0gYXJyMS5sZW5ndGggLSAxO1xyXG4gICAgd2hpbGUgKCRpIDwgbDEpIHtcclxuICAgICAgJHNjaCA9IGFycjFbJGkgKz0gMV07XHJcbiAgICAgIGlmIChpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRzY2gsIGl0LlJVTEVTLmFsbCkpIHtcclxuICAgICAgICAkYWxsU2NoZW1hc0VtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XHJcbiAgICAgICAgJGl0LnNjaGVtYVBhdGggPSAkc2NoZW1hUGF0aCArICdbJyArICRpICsgJ10nO1xyXG4gICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGggKyAnLycgKyAkaTtcclxuICAgICAgICBvdXQgKz0gJyAgJyArIChpdC52YWxpZGF0ZSgkaXQpKSArICcgJztcclxuICAgICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XHJcbiAgICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnO1xyXG4gICAgICAgICAgJGNsb3NpbmdCcmFjZXMgKz0gJ30nO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgaWYgKCRhbGxTY2hlbWFzRW1wdHkpIHtcclxuICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnICcgKyAoJGNsb3NpbmdCcmFjZXMuc2xpY2UoMCwgLTEpKSArICcgJztcclxuICAgIH1cclxuICB9XHJcbiAgb3V0ID0gaXQudXRpbC5jbGVhblVwQ29kZShvdXQpO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbnZhciBDYWNoZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ2FjaGUoKSB7XHJcbiAgdGhpcy5fY2FjaGUgPSB7fTtcclxufTtcclxuXHJcblxyXG5DYWNoZS5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gQ2FjaGVfcHV0KGtleSwgdmFsdWUpIHtcclxuICB0aGlzLl9jYWNoZVtrZXldID0gdmFsdWU7XHJcbn07XHJcblxyXG5cclxuQ2FjaGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIENhY2hlX2dldChrZXkpIHtcclxuICByZXR1cm4gdGhpcy5fY2FjaGVba2V5XTtcclxufTtcclxuXHJcblxyXG5DYWNoZS5wcm90b3R5cGUuZGVsID0gZnVuY3Rpb24gQ2FjaGVfZGVsKGtleSkge1xyXG4gIGRlbGV0ZSB0aGlzLl9jYWNoZVtrZXldO1xyXG59O1xyXG5cclxuXHJcbkNhY2hlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIENhY2hlX2NsZWFyKCkge1xyXG4gIHRoaXMuX2NhY2hlID0ge307XHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9mb3JtYXQoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xyXG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgaWYgKGl0Lm9wdHMuZm9ybWF0ID09PSBmYWxzZSkge1xyXG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbiAgfVxyXG4gIHZhciAkaXNEYXRhID0gaXQub3B0cy4kZGF0YSAmJiAkc2NoZW1hICYmICRzY2hlbWEuJGRhdGEsXHJcbiAgICAkc2NoZW1hVmFsdWU7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnIHZhciBzY2hlbWEnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC5nZXREYXRhKCRzY2hlbWEuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFycikpICsgJzsgJztcclxuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcclxuICB9IGVsc2Uge1xyXG4gICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYTtcclxuICB9XHJcbiAgdmFyICR1bmtub3duRm9ybWF0cyA9IGl0Lm9wdHMudW5rbm93bkZvcm1hdHMsXHJcbiAgICAkYWxsb3dVbmtub3duID0gQXJyYXkuaXNBcnJheSgkdW5rbm93bkZvcm1hdHMpO1xyXG4gIGlmICgkaXNEYXRhKSB7XHJcbiAgICB2YXIgJGZvcm1hdCA9ICdmb3JtYXQnICsgJGx2bCxcclxuICAgICAgJGlzT2JqZWN0ID0gJ2lzT2JqZWN0JyArICRsdmwsXHJcbiAgICAgICRmb3JtYXRUeXBlID0gJ2Zvcm1hdFR5cGUnICsgJGx2bDtcclxuICAgIG91dCArPSAnIHZhciAnICsgKCRmb3JtYXQpICsgJyA9IGZvcm1hdHNbJyArICgkc2NoZW1hVmFsdWUpICsgJ107IHZhciAnICsgKCRpc09iamVjdCkgKyAnID0gdHlwZW9mICcgKyAoJGZvcm1hdCkgKyAnID09IFxcJ29iamVjdFxcJyAmJiAhKCcgKyAoJGZvcm1hdCkgKyAnIGluc3RhbmNlb2YgUmVnRXhwKSAmJiAnICsgKCRmb3JtYXQpICsgJy52YWxpZGF0ZTsgdmFyICcgKyAoJGZvcm1hdFR5cGUpICsgJyA9ICcgKyAoJGlzT2JqZWN0KSArICcgJiYgJyArICgkZm9ybWF0KSArICcudHlwZSB8fCBcXCdzdHJpbmdcXCc7IGlmICgnICsgKCRpc09iamVjdCkgKyAnKSB7ICc7XHJcbiAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgb3V0ICs9ICcgdmFyIGFzeW5jJyArICgkbHZsKSArICcgPSAnICsgKCRmb3JtYXQpICsgJy5hc3luYzsgJztcclxuICAgIH1cclxuICAgIG91dCArPSAnICcgKyAoJGZvcm1hdCkgKyAnID0gJyArICgkZm9ybWF0KSArICcudmFsaWRhdGU7IH0gaWYgKCAgJztcclxuICAgIGlmICgkaXNEYXRhKSB7XHJcbiAgICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnc3RyaW5nXFwnKSB8fCAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgKCc7XHJcbiAgICBpZiAoJHVua25vd25Gb3JtYXRzICE9ICdpZ25vcmUnKSB7XHJcbiAgICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICYmICEnICsgKCRmb3JtYXQpICsgJyAnO1xyXG4gICAgICBpZiAoJGFsbG93VW5rbm93bikge1xyXG4gICAgICAgIG91dCArPSAnICYmIHNlbGYuX29wdHMudW5rbm93bkZvcm1hdHMuaW5kZXhPZignICsgKCRzY2hlbWFWYWx1ZSkgKyAnKSA9PSAtMSAnO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnKSB8fCAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgKCcgKyAoJGZvcm1hdCkgKyAnICYmICcgKyAoJGZvcm1hdFR5cGUpICsgJyA9PSBcXCcnICsgKCRydWxlVHlwZSkgKyAnXFwnICYmICEodHlwZW9mICcgKyAoJGZvcm1hdCkgKyAnID09IFxcJ2Z1bmN0aW9uXFwnID8gJztcclxuICAgIGlmIChpdC5hc3luYykge1xyXG4gICAgICBvdXQgKz0gJyAoYXN5bmMnICsgKCRsdmwpICsgJyA/IGF3YWl0ICcgKyAoJGZvcm1hdCkgKyAnKCcgKyAoJGRhdGEpICsgJykgOiAnICsgKCRmb3JtYXQpICsgJygnICsgKCRkYXRhKSArICcpKSAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICcgJyArICgkZm9ybWF0KSArICcoJyArICgkZGF0YSkgKyAnKSAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgOiAnICsgKCRmb3JtYXQpICsgJy50ZXN0KCcgKyAoJGRhdGEpICsgJykpKSkpIHsnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgJGZvcm1hdCA9IGl0LmZvcm1hdHNbJHNjaGVtYV07XHJcbiAgICBpZiAoISRmb3JtYXQpIHtcclxuICAgICAgaWYgKCR1bmtub3duRm9ybWF0cyA9PSAnaWdub3JlJykge1xyXG4gICAgICAgIGl0LmxvZ2dlci53YXJuKCd1bmtub3duIGZvcm1hdCBcIicgKyAkc2NoZW1hICsgJ1wiIGlnbm9yZWQgaW4gc2NoZW1hIGF0IHBhdGggXCInICsgaXQuZXJyU2NoZW1hUGF0aCArICdcIicpO1xyXG4gICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyBpZiAodHJ1ZSkgeyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICB9IGVsc2UgaWYgKCRhbGxvd1Vua25vd24gJiYgJHVua25vd25Gb3JtYXRzLmluZGV4T2YoJHNjaGVtYSkgPj0gMCkge1xyXG4gICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyBpZiAodHJ1ZSkgeyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5rbm93biBmb3JtYXQgXCInICsgJHNjaGVtYSArICdcIiBpcyB1c2VkIGluIHNjaGVtYSBhdCBwYXRoIFwiJyArIGl0LmVyclNjaGVtYVBhdGggKyAnXCInKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyICRpc09iamVjdCA9IHR5cGVvZiAkZm9ybWF0ID09ICdvYmplY3QnICYmICEoJGZvcm1hdCBpbnN0YW5jZW9mIFJlZ0V4cCkgJiYgJGZvcm1hdC52YWxpZGF0ZTtcclxuICAgIHZhciAkZm9ybWF0VHlwZSA9ICRpc09iamVjdCAmJiAkZm9ybWF0LnR5cGUgfHwgJ3N0cmluZyc7XHJcbiAgICBpZiAoJGlzT2JqZWN0KSB7XHJcbiAgICAgIHZhciAkYXN5bmMgPSAkZm9ybWF0LmFzeW5jID09PSB0cnVlO1xyXG4gICAgICAkZm9ybWF0ID0gJGZvcm1hdC52YWxpZGF0ZTtcclxuICAgIH1cclxuICAgIGlmICgkZm9ybWF0VHlwZSAhPSAkcnVsZVR5cGUpIHtcclxuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICBvdXQgKz0gJyBpZiAodHJ1ZSkgeyAnO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICBpZiAoJGFzeW5jKSB7XHJcbiAgICAgIGlmICghaXQuYXN5bmMpIHRocm93IG5ldyBFcnJvcignYXN5bmMgZm9ybWF0IGluIHN5bmMgc2NoZW1hJyk7XHJcbiAgICAgIHZhciAkZm9ybWF0UmVmID0gJ2Zvcm1hdHMnICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgkc2NoZW1hKSArICcudmFsaWRhdGUnO1xyXG4gICAgICBvdXQgKz0gJyBpZiAoIShhd2FpdCAnICsgKCRmb3JtYXRSZWYpICsgJygnICsgKCRkYXRhKSArICcpKSkgeyAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICcgaWYgKCEgJztcclxuICAgICAgdmFyICRmb3JtYXRSZWYgPSAnZm9ybWF0cycgKyBpdC51dGlsLmdldFByb3BlcnR5KCRzY2hlbWEpO1xyXG4gICAgICBpZiAoJGlzT2JqZWN0KSAkZm9ybWF0UmVmICs9ICcudmFsaWRhdGUnO1xyXG4gICAgICBpZiAodHlwZW9mICRmb3JtYXQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIG91dCArPSAnICcgKyAoJGZvcm1hdFJlZikgKyAnKCcgKyAoJGRhdGEpICsgJykgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyAnICsgKCRmb3JtYXRSZWYpICsgJy50ZXN0KCcgKyAoJGRhdGEpICsgJykgJztcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJykgeyAnO1xyXG4gICAgfVxyXG4gIH1cclxuICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnZm9ybWF0JykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBmb3JtYXQ6ICAnO1xyXG4gICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWFWYWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJycgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkc2NoZW1hKSk7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyAgfSAnO1xyXG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIG1hdGNoIGZvcm1hdCBcIic7XHJcbiAgICAgIGlmICgkaXNEYXRhKSB7XHJcbiAgICAgICAgb3V0ICs9ICdcXCcgKyAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICsgXFwnJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJycgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJHNjaGVtYSkpO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnXCJcXCcgJztcclxuICAgIH1cclxuICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6ICAnO1xyXG4gICAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICAgIG91dCArPSAndmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICcnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJHNjaGVtYSkpO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnICAgICAgICAgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9ICc7XHJcbiAgfSBlbHNlIHtcclxuICAgIG91dCArPSAnIHt9ICc7XHJcbiAgfVxyXG4gIHZhciBfX2VyciA9IG91dDtcclxuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xyXG4gIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChpdC5hc3luYykge1xyXG4gICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICB9XHJcbiAgb3V0ICs9ICcgfSAnO1xyXG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcclxuICB9XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfbm90KGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcclxuICB2YXIgJGl0ID0gaXQudXRpbC5jb3B5KGl0KTtcclxuICAkaXQubGV2ZWwrKztcclxuICB2YXIgJG5leHRWYWxpZCA9ICd2YWxpZCcgKyAkaXQubGV2ZWw7XHJcbiAgaWYgKGl0LnV0aWwuc2NoZW1hSGFzUnVsZXMoJHNjaGVtYSwgaXQuUlVMRVMuYWxsKSkge1xyXG4gICAgJGl0LnNjaGVtYSA9ICRzY2hlbWE7XHJcbiAgICAkaXQuc2NoZW1hUGF0aCA9ICRzY2hlbWFQYXRoO1xyXG4gICAgJGl0LmVyclNjaGVtYVBhdGggPSAkZXJyU2NoZW1hUGF0aDtcclxuICAgIG91dCArPSAnIHZhciAnICsgKCRlcnJzKSArICcgPSBlcnJvcnM7ICAnO1xyXG4gICAgdmFyICR3YXNDb21wb3NpdGUgPSBpdC5jb21wb3NpdGVSdWxlO1xyXG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gdHJ1ZTtcclxuICAgICRpdC5jcmVhdGVFcnJvcnMgPSBmYWxzZTtcclxuICAgIHZhciAkYWxsRXJyb3JzT3B0aW9uO1xyXG4gICAgaWYgKCRpdC5vcHRzLmFsbEVycm9ycykge1xyXG4gICAgICAkYWxsRXJyb3JzT3B0aW9uID0gJGl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gICAgICAkaXQub3B0cy5hbGxFcnJvcnMgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIG91dCArPSAnICcgKyAoaXQudmFsaWRhdGUoJGl0KSkgKyAnICc7XHJcbiAgICAkaXQuY3JlYXRlRXJyb3JzID0gdHJ1ZTtcclxuICAgIGlmICgkYWxsRXJyb3JzT3B0aW9uKSAkaXQub3B0cy5hbGxFcnJvcnMgPSAkYWxsRXJyb3JzT3B0aW9uO1xyXG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcclxuICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAgICc7XHJcbiAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdub3QnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7fSAnO1xyXG4gICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcclxuICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBOT1QgYmUgdmFsaWRcXCcgJztcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgfVxyXG4gICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9IGVsc2UgeyAgZXJyb3JzID0gJyArICgkZXJycykgKyAnOyBpZiAodkVycm9ycyAhPT0gbnVsbCkgeyBpZiAoJyArICgkZXJycykgKyAnKSB2RXJyb3JzLmxlbmd0aCA9ICcgKyAoJGVycnMpICsgJzsgZWxzZSB2RXJyb3JzID0gbnVsbDsgfSAnO1xyXG4gICAgaWYgKGl0Lm9wdHMuYWxsRXJyb3JzKSB7XHJcbiAgICAgIG91dCArPSAnIH0gJztcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ICs9ICcgIHZhciBlcnIgPSAgICc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ25vdCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHt9ICc7XHJcbiAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIE5PVCBiZSB2YWxpZFxcJyAnO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnIH0gJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHt9ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xyXG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgb3V0ICs9ICcgaWYgKGZhbHNlKSB7ICc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX2NvbnN0KGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcclxuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxyXG4gICAgJHNjaGVtYVZhbHVlO1xyXG4gIGlmICgkaXNEYXRhKSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XHJcbiAgICAkc2NoZW1hVmFsdWUgPSAnc2NoZW1hJyArICRsdmw7XHJcbiAgfSBlbHNlIHtcclxuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XHJcbiAgfVxyXG4gIGlmICghJGlzRGF0YSkge1xyXG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYScgKyAoJGx2bCkgKyAnID0gdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnOyc7XHJcbiAgfVxyXG4gIG91dCArPSAndmFyICcgKyAoJHZhbGlkKSArICcgPSBlcXVhbCgnICsgKCRkYXRhKSArICcsIHNjaGVtYScgKyAoJGx2bCkgKyAnKTsgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgJztcclxuICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnY29uc3QnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGFsbG93ZWRWYWx1ZTogc2NoZW1hJyArICgkbHZsKSArICcgfSAnO1xyXG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIGJlIGVxdWFsIHRvIGNvbnN0YW50XFwnICc7XHJcbiAgICB9XHJcbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9ICc7XHJcbiAgfSBlbHNlIHtcclxuICAgIG91dCArPSAnIHt9ICc7XHJcbiAgfVxyXG4gIHZhciBfX2VyciA9IG91dDtcclxuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xyXG4gIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChpdC5hc3luYykge1xyXG4gICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICB9XHJcbiAgb3V0ICs9ICcgfSc7XHJcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgIG91dCArPSAnIGVsc2UgeyAnO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9vbmVPZihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xyXG4gIHZhciBvdXQgPSAnICc7XHJcbiAgdmFyICRsdmwgPSBpdC5sZXZlbDtcclxuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XHJcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xyXG4gIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRrZXl3b3JkKTtcclxuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XHJcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XHJcbiAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcclxuICB2YXIgJHZhbGlkID0gJ3ZhbGlkJyArICRsdmw7XHJcbiAgdmFyICRlcnJzID0gJ2VycnNfXycgKyAkbHZsO1xyXG4gIHZhciAkaXQgPSBpdC51dGlsLmNvcHkoaXQpO1xyXG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xyXG4gICRpdC5sZXZlbCsrO1xyXG4gIHZhciAkbmV4dFZhbGlkID0gJ3ZhbGlkJyArICRpdC5sZXZlbDtcclxuICB2YXIgJGN1cnJlbnRCYXNlSWQgPSAkaXQuYmFzZUlkLFxyXG4gICAgJHByZXZWYWxpZCA9ICdwcmV2VmFsaWQnICsgJGx2bCxcclxuICAgICRwYXNzaW5nU2NoZW1hcyA9ICdwYXNzaW5nU2NoZW1hcycgKyAkbHZsO1xyXG4gIG91dCArPSAndmFyICcgKyAoJGVycnMpICsgJyA9IGVycm9ycyAsICcgKyAoJHByZXZWYWxpZCkgKyAnID0gZmFsc2UgLCAnICsgKCR2YWxpZCkgKyAnID0gZmFsc2UgLCAnICsgKCRwYXNzaW5nU2NoZW1hcykgKyAnID0gbnVsbDsgJztcclxuICB2YXIgJHdhc0NvbXBvc2l0ZSA9IGl0LmNvbXBvc2l0ZVJ1bGU7XHJcbiAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gdHJ1ZTtcclxuICB2YXIgYXJyMSA9ICRzY2hlbWE7XHJcbiAgaWYgKGFycjEpIHtcclxuICAgIHZhciAkc2NoLCAkaSA9IC0xLFxyXG4gICAgICBsMSA9IGFycjEubGVuZ3RoIC0gMTtcclxuICAgIHdoaWxlICgkaSA8IGwxKSB7XHJcbiAgICAgICRzY2ggPSBhcnIxWyRpICs9IDFdO1xyXG4gICAgICBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoLCBpdC5SVUxFUy5hbGwpKSB7XHJcbiAgICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XHJcbiAgICAgICAgJGl0LnNjaGVtYVBhdGggPSAkc2NoZW1hUGF0aCArICdbJyArICRpICsgJ10nO1xyXG4gICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGggKyAnLycgKyAkaTtcclxuICAgICAgICBvdXQgKz0gJyAgJyArIChpdC52YWxpZGF0ZSgkaXQpKSArICcgJztcclxuICAgICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICcgdmFyICcgKyAoJG5leHRWYWxpZCkgKyAnID0gdHJ1ZTsgJztcclxuICAgICAgfVxyXG4gICAgICBpZiAoJGkpIHtcclxuICAgICAgICBvdXQgKz0gJyBpZiAoJyArICgkbmV4dFZhbGlkKSArICcgJiYgJyArICgkcHJldlZhbGlkKSArICcpIHsgJyArICgkdmFsaWQpICsgJyA9IGZhbHNlOyAnICsgKCRwYXNzaW5nU2NoZW1hcykgKyAnID0gWycgKyAoJHBhc3NpbmdTY2hlbWFzKSArICcsICcgKyAoJGkpICsgJ107IH0gZWxzZSB7ICc7XHJcbiAgICAgICAgJGNsb3NpbmdCcmFjZXMgKz0gJ30nO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnICsgKCR2YWxpZCkgKyAnID0gJyArICgkcHJldlZhbGlkKSArICcgPSB0cnVlOyAnICsgKCRwYXNzaW5nU2NoZW1hcykgKyAnID0gJyArICgkaSkgKyAnOyB9JztcclxuICAgIH1cclxuICB9XHJcbiAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcclxuICBvdXQgKz0gJycgKyAoJGNsb3NpbmdCcmFjZXMpICsgJ2lmICghJyArICgkdmFsaWQpICsgJykgeyAgIHZhciBlcnIgPSAgICc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnb25lT2YnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IHBhc3NpbmdTY2hlbWFzOiAnICsgKCRwYXNzaW5nU2NoZW1hcykgKyAnIH0gJztcclxuICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBtYXRjaCBleGFjdGx5IG9uZSBzY2hlbWEgaW4gb25lT2ZcXCcgJztcclxuICAgIH1cclxuICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgIH1cclxuICAgIG91dCArPSAnIH0gJztcclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ICs9ICcge30gJztcclxuICB9XHJcbiAgb3V0ICs9ICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih2RXJyb3JzKTsgJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7IHJldHVybiBmYWxzZTsgJztcclxuICAgIH1cclxuICB9XHJcbiAgb3V0ICs9ICd9IGVsc2UgeyAgZXJyb3JzID0gJyArICgkZXJycykgKyAnOyBpZiAodkVycm9ycyAhPT0gbnVsbCkgeyBpZiAoJyArICgkZXJycykgKyAnKSB2RXJyb3JzLmxlbmd0aCA9ICcgKyAoJGVycnMpICsgJzsgZWxzZSB2RXJyb3JzID0gbnVsbDsgfSc7XHJcbiAgaWYgKGl0Lm9wdHMuYWxsRXJyb3JzKSB7XHJcbiAgICBvdXQgKz0gJyB9ICc7XHJcbiAgfVxyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX2NvbW1lbnQoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XHJcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XHJcbiAgdmFyICRjb21tZW50ID0gaXQudXRpbC50b1F1b3RlZFN0cmluZygkc2NoZW1hKTtcclxuICBpZiAoaXQub3B0cy4kY29tbWVudCA9PT0gdHJ1ZSkge1xyXG4gICAgb3V0ICs9ICcgY29uc29sZS5sb2coJyArICgkY29tbWVudCkgKyAnKTsnO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIGl0Lm9wdHMuJGNvbW1lbnQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgb3V0ICs9ICcgc2VsZi5fb3B0cy4kY29tbWVudCgnICsgKCRjb21tZW50KSArICcsICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJywgdmFsaWRhdGUucm9vdC5zY2hlbWEpOyc7XHJcbiAgfVxyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX2NvbnRhaW5zKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcclxuICB2YXIgJGVycnMgPSAnZXJyc19fJyArICRsdmw7XHJcbiAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XHJcbiAgdmFyICRjbG9zaW5nQnJhY2VzID0gJyc7XHJcbiAgJGl0LmxldmVsKys7XHJcbiAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xyXG4gIHZhciAkaWR4ID0gJ2knICsgJGx2bCxcclxuICAgICRkYXRhTnh0ID0gJGl0LmRhdGFMZXZlbCA9IGl0LmRhdGFMZXZlbCArIDEsXHJcbiAgICAkbmV4dERhdGEgPSAnZGF0YScgKyAkZGF0YU54dCxcclxuICAgICRjdXJyZW50QmFzZUlkID0gaXQuYmFzZUlkLFxyXG4gICAgJG5vbkVtcHR5U2NoZW1hID0gaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoZW1hLCBpdC5SVUxFUy5hbGwpO1xyXG4gIG91dCArPSAndmFyICcgKyAoJGVycnMpICsgJyA9IGVycm9yczt2YXIgJyArICgkdmFsaWQpICsgJzsnO1xyXG4gIGlmICgkbm9uRW1wdHlTY2hlbWEpIHtcclxuICAgIHZhciAkd2FzQ29tcG9zaXRlID0gaXQuY29tcG9zaXRlUnVsZTtcclxuICAgIGl0LmNvbXBvc2l0ZVJ1bGUgPSAkaXQuY29tcG9zaXRlUnVsZSA9IHRydWU7XHJcbiAgICAkaXQuc2NoZW1hID0gJHNjaGVtYTtcclxuICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGg7XHJcbiAgICAkaXQuZXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoO1xyXG4gICAgb3V0ICs9ICcgdmFyICcgKyAoJG5leHRWYWxpZCkgKyAnID0gZmFsc2U7IGZvciAodmFyICcgKyAoJGlkeCkgKyAnID0gMDsgJyArICgkaWR4KSArICcgPCAnICsgKCRkYXRhKSArICcubGVuZ3RoOyAnICsgKCRpZHgpICsgJysrKSB7ICc7XHJcbiAgICAkaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoRXhwcihpdC5lcnJvclBhdGgsICRpZHgsIGl0Lm9wdHMuanNvblBvaW50ZXJzLCB0cnVlKTtcclxuICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRpZHggKyAnXSc7XHJcbiAgICAkaXQuZGF0YVBhdGhBcnJbJGRhdGFOeHRdID0gJGlkeDtcclxuICAgIHZhciAkY29kZSA9IGl0LnZhbGlkYXRlKCRpdCk7XHJcbiAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XHJcbiAgICBpZiAoaXQudXRpbC52YXJPY2N1cmVuY2VzKCRjb2RlLCAkbmV4dERhdGEpIDwgMikge1xyXG4gICAgICBvdXQgKz0gJyAnICsgKGl0LnV0aWwudmFyUmVwbGFjZSgkY29kZSwgJG5leHREYXRhLCAkcGFzc0RhdGEpKSArICcgJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHZhciAnICsgKCRuZXh0RGF0YSkgKyAnID0gJyArICgkcGFzc0RhdGEpICsgJzsgJyArICgkY29kZSkgKyAnICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyBpZiAoJyArICgkbmV4dFZhbGlkKSArICcpIGJyZWFrOyB9ICAnO1xyXG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcclxuICAgIG91dCArPSAnICcgKyAoJGNsb3NpbmdCcmFjZXMpICsgJyBpZiAoIScgKyAoJG5leHRWYWxpZCkgKyAnKSB7JztcclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGEpICsgJy5sZW5ndGggPT0gMCkgeyc7XHJcbiAgfVxyXG4gIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcclxuICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdjb250YWlucycpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHt9ICc7XHJcbiAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcclxuICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgY29udGFpbiBhIHZhbGlkIGl0ZW1cXCcgJztcclxuICAgIH1cclxuICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgIH1cclxuICAgIG91dCArPSAnIH0gJztcclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ICs9ICcge30gJztcclxuICB9XHJcbiAgdmFyIF9fZXJyID0gb3V0O1xyXG4gIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XHJcbiAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xyXG4gIH1cclxuICBvdXQgKz0gJyB9IGVsc2UgeyAnO1xyXG4gIGlmICgkbm9uRW1wdHlTY2hlbWEpIHtcclxuICAgIG91dCArPSAnICBlcnJvcnMgPSAnICsgKCRlcnJzKSArICc7IGlmICh2RXJyb3JzICE9PSBudWxsKSB7IGlmICgnICsgKCRlcnJzKSArICcpIHZFcnJvcnMubGVuZ3RoID0gJyArICgkZXJycykgKyAnOyBlbHNlIHZFcnJvcnMgPSBudWxsOyB9ICc7XHJcbiAgfVxyXG4gIGlmIChpdC5vcHRzLmFsbEVycm9ycykge1xyXG4gICAgb3V0ICs9ICcgfSAnO1xyXG4gIH1cclxuICBvdXQgPSBpdC51dGlsLmNsZWFuVXBDb2RlKG91dCk7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vL2FsbCByZXF1aXJlcyBtdXN0IGJlIGV4cGxpY2l0IGJlY2F1c2UgYnJvd3NlcmlmeSB3b24ndCB3b3JrIHdpdGggZHluYW1pYyByZXF1aXJlc1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAnJHJlZic6IHJlcXVpcmUoJy4vcmVmJyksXHJcbiAgYWxsT2Y6IHJlcXVpcmUoJy4vYWxsT2YnKSxcclxuICBhbnlPZjogcmVxdWlyZSgnLi9hbnlPZicpLFxyXG4gICckY29tbWVudCc6IHJlcXVpcmUoJy4vY29tbWVudCcpLFxyXG4gIGNvbnN0OiByZXF1aXJlKCcuL2NvbnN0JyksXHJcbiAgY29udGFpbnM6IHJlcXVpcmUoJy4vY29udGFpbnMnKSxcclxuICBkZXBlbmRlbmNpZXM6IHJlcXVpcmUoJy4vZGVwZW5kZW5jaWVzJyksXHJcbiAgJ2VudW0nOiByZXF1aXJlKCcuL2VudW0nKSxcclxuICBmb3JtYXQ6IHJlcXVpcmUoJy4vZm9ybWF0JyksXHJcbiAgJ2lmJzogcmVxdWlyZSgnLi9pZicpLFxyXG4gIGl0ZW1zOiByZXF1aXJlKCcuL2l0ZW1zJyksXHJcbiAgbWF4aW11bTogcmVxdWlyZSgnLi9fbGltaXQnKSxcclxuICBtaW5pbXVtOiByZXF1aXJlKCcuL19saW1pdCcpLFxyXG4gIG1heEl0ZW1zOiByZXF1aXJlKCcuL19saW1pdEl0ZW1zJyksXHJcbiAgbWluSXRlbXM6IHJlcXVpcmUoJy4vX2xpbWl0SXRlbXMnKSxcclxuICBtYXhMZW5ndGg6IHJlcXVpcmUoJy4vX2xpbWl0TGVuZ3RoJyksXHJcbiAgbWluTGVuZ3RoOiByZXF1aXJlKCcuL19saW1pdExlbmd0aCcpLFxyXG4gIG1heFByb3BlcnRpZXM6IHJlcXVpcmUoJy4vX2xpbWl0UHJvcGVydGllcycpLFxyXG4gIG1pblByb3BlcnRpZXM6IHJlcXVpcmUoJy4vX2xpbWl0UHJvcGVydGllcycpLFxyXG4gIG11bHRpcGxlT2Y6IHJlcXVpcmUoJy4vbXVsdGlwbGVPZicpLFxyXG4gIG5vdDogcmVxdWlyZSgnLi9ub3QnKSxcclxuICBvbmVPZjogcmVxdWlyZSgnLi9vbmVPZicpLFxyXG4gIHBhdHRlcm46IHJlcXVpcmUoJy4vcGF0dGVybicpLFxyXG4gIHByb3BlcnRpZXM6IHJlcXVpcmUoJy4vcHJvcGVydGllcycpLFxyXG4gIHByb3BlcnR5TmFtZXM6IHJlcXVpcmUoJy4vcHJvcGVydHlOYW1lcycpLFxyXG4gIHJlcXVpcmVkOiByZXF1aXJlKCcuL3JlcXVpcmVkJyksXHJcbiAgdW5pcXVlSXRlbXM6IHJlcXVpcmUoJy4vdW5pcXVlSXRlbXMnKSxcclxuICB2YWxpZGF0ZTogcmVxdWlyZSgnLi92YWxpZGF0ZScpXHJcbn07XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9hbnlPZihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xyXG4gIHZhciBvdXQgPSAnICc7XHJcbiAgdmFyICRsdmwgPSBpdC5sZXZlbDtcclxuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XHJcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xyXG4gIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRrZXl3b3JkKTtcclxuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XHJcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XHJcbiAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcclxuICB2YXIgJHZhbGlkID0gJ3ZhbGlkJyArICRsdmw7XHJcbiAgdmFyICRlcnJzID0gJ2VycnNfXycgKyAkbHZsO1xyXG4gIHZhciAkaXQgPSBpdC51dGlsLmNvcHkoaXQpO1xyXG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xyXG4gICRpdC5sZXZlbCsrO1xyXG4gIHZhciAkbmV4dFZhbGlkID0gJ3ZhbGlkJyArICRpdC5sZXZlbDtcclxuICB2YXIgJG5vRW1wdHlTY2hlbWEgPSAkc2NoZW1hLmV2ZXJ5KGZ1bmN0aW9uKCRzY2gpIHtcclxuICAgIHJldHVybiBpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRzY2gsIGl0LlJVTEVTLmFsbCk7XHJcbiAgfSk7XHJcbiAgaWYgKCRub0VtcHR5U2NoZW1hKSB7XHJcbiAgICB2YXIgJGN1cnJlbnRCYXNlSWQgPSAkaXQuYmFzZUlkO1xyXG4gICAgb3V0ICs9ICcgdmFyICcgKyAoJGVycnMpICsgJyA9IGVycm9yczsgdmFyICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgICc7XHJcbiAgICB2YXIgJHdhc0NvbXBvc2l0ZSA9IGl0LmNvbXBvc2l0ZVJ1bGU7XHJcbiAgICBpdC5jb21wb3NpdGVSdWxlID0gJGl0LmNvbXBvc2l0ZVJ1bGUgPSB0cnVlO1xyXG4gICAgdmFyIGFycjEgPSAkc2NoZW1hO1xyXG4gICAgaWYgKGFycjEpIHtcclxuICAgICAgdmFyICRzY2gsICRpID0gLTEsXHJcbiAgICAgICAgbDEgPSBhcnIxLmxlbmd0aCAtIDE7XHJcbiAgICAgIHdoaWxlICgkaSA8IGwxKSB7XHJcbiAgICAgICAgJHNjaCA9IGFycjFbJGkgKz0gMV07XHJcbiAgICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XHJcbiAgICAgICAgJGl0LnNjaGVtYVBhdGggPSAkc2NoZW1hUGF0aCArICdbJyArICRpICsgJ10nO1xyXG4gICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGggKyAnLycgKyAkaTtcclxuICAgICAgICBvdXQgKz0gJyAgJyArIChpdC52YWxpZGF0ZSgkaXQpKSArICcgJztcclxuICAgICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XHJcbiAgICAgICAgb3V0ICs9ICcgJyArICgkdmFsaWQpICsgJyA9ICcgKyAoJHZhbGlkKSArICcgfHwgJyArICgkbmV4dFZhbGlkKSArICc7IGlmICghJyArICgkdmFsaWQpICsgJykgeyAnO1xyXG4gICAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcclxuICAgIG91dCArPSAnICcgKyAoJGNsb3NpbmdCcmFjZXMpICsgJyBpZiAoIScgKyAoJHZhbGlkKSArICcpIHsgICB2YXIgZXJyID0gICAnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdhbnlPZicpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHt9ICc7XHJcbiAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIG1hdGNoIHNvbWUgc2NoZW1hIGluIGFueU9mXFwnICc7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xyXG4gICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICcge30gJztcclxuICAgIH1cclxuICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih2RXJyb3JzKTsgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG91dCArPSAnIH0gZWxzZSB7ICBlcnJvcnMgPSAnICsgKCRlcnJzKSArICc7IGlmICh2RXJyb3JzICE9PSBudWxsKSB7IGlmICgnICsgKCRlcnJzKSArICcpIHZFcnJvcnMubGVuZ3RoID0gJyArICgkZXJycykgKyAnOyBlbHNlIHZFcnJvcnMgPSBudWxsOyB9ICc7XHJcbiAgICBpZiAoaXQub3B0cy5hbGxFcnJvcnMpIHtcclxuICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgfVxyXG4gICAgb3V0ID0gaXQudXRpbC5jbGVhblVwQ29kZShvdXQpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICBvdXQgKz0gJyBpZiAodHJ1ZSkgeyAnO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBLRVlXT1JEUyA9IFtcclxuICAnbXVsdGlwbGVPZicsXHJcbiAgJ21heGltdW0nLFxyXG4gICdleGNsdXNpdmVNYXhpbXVtJyxcclxuICAnbWluaW11bScsXHJcbiAgJ2V4Y2x1c2l2ZU1pbmltdW0nLFxyXG4gICdtYXhMZW5ndGgnLFxyXG4gICdtaW5MZW5ndGgnLFxyXG4gICdwYXR0ZXJuJyxcclxuICAnYWRkaXRpb25hbEl0ZW1zJyxcclxuICAnbWF4SXRlbXMnLFxyXG4gICdtaW5JdGVtcycsXHJcbiAgJ3VuaXF1ZUl0ZW1zJyxcclxuICAnbWF4UHJvcGVydGllcycsXHJcbiAgJ21pblByb3BlcnRpZXMnLFxyXG4gICdyZXF1aXJlZCcsXHJcbiAgJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyxcclxuICAnZW51bScsXHJcbiAgJ2Zvcm1hdCcsXHJcbiAgJ2NvbnN0J1xyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWV0YVNjaGVtYSwga2V5d29yZHNKc29uUG9pbnRlcnMpIHtcclxuICBmb3IgKHZhciBpPTA7IGk8a2V5d29yZHNKc29uUG9pbnRlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgIG1ldGFTY2hlbWEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG1ldGFTY2hlbWEpKTtcclxuICAgIHZhciBzZWdtZW50cyA9IGtleXdvcmRzSnNvblBvaW50ZXJzW2ldLnNwbGl0KCcvJyk7XHJcbiAgICB2YXIga2V5d29yZHMgPSBtZXRhU2NoZW1hO1xyXG4gICAgdmFyIGo7XHJcbiAgICBmb3IgKGo9MTsgajxzZWdtZW50cy5sZW5ndGg7IGorKylcclxuICAgICAga2V5d29yZHMgPSBrZXl3b3Jkc1tzZWdtZW50c1tqXV07XHJcblxyXG4gICAgZm9yIChqPTA7IGo8S0VZV09SRFMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgdmFyIGtleSA9IEtFWVdPUkRTW2pdO1xyXG4gICAgICB2YXIgc2NoZW1hID0ga2V5d29yZHNba2V5XTtcclxuICAgICAgaWYgKHNjaGVtYSkge1xyXG4gICAgICAgIGtleXdvcmRzW2tleV0gPSB7XHJcbiAgICAgICAgICBhbnlPZjogW1xyXG4gICAgICAgICAgICBzY2hlbWEsXHJcbiAgICAgICAgICAgIHsgJHJlZjogJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9lcG9iZXJlemtpbi9hanYvbWFzdGVyL2xpYi9yZWZzL2RhdGEuanNvbiMnIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbWV0YVNjaGVtYTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX3Byb3BlcnR5TmFtZXMoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xyXG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgdmFyICRlcnJzID0gJ2VycnNfXycgKyAkbHZsO1xyXG4gIHZhciAkaXQgPSBpdC51dGlsLmNvcHkoaXQpO1xyXG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xyXG4gICRpdC5sZXZlbCsrO1xyXG4gIHZhciAkbmV4dFZhbGlkID0gJ3ZhbGlkJyArICRpdC5sZXZlbDtcclxuICBvdXQgKz0gJ3ZhciAnICsgKCRlcnJzKSArICcgPSBlcnJvcnM7JztcclxuICBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoZW1hLCBpdC5SVUxFUy5hbGwpKSB7XHJcbiAgICAkaXQuc2NoZW1hID0gJHNjaGVtYTtcclxuICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGg7XHJcbiAgICAkaXQuZXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoO1xyXG4gICAgdmFyICRrZXkgPSAna2V5JyArICRsdmwsXHJcbiAgICAgICRpZHggPSAnaWR4JyArICRsdmwsXHJcbiAgICAgICRpID0gJ2knICsgJGx2bCxcclxuICAgICAgJGludmFsaWROYW1lID0gJ1xcJyArICcgKyAka2V5ICsgJyArIFxcJycsXHJcbiAgICAgICRkYXRhTnh0ID0gJGl0LmRhdGFMZXZlbCA9IGl0LmRhdGFMZXZlbCArIDEsXHJcbiAgICAgICRuZXh0RGF0YSA9ICdkYXRhJyArICRkYXRhTnh0LFxyXG4gICAgICAkZGF0YVByb3BlcnRpZXMgPSAnZGF0YVByb3BlcnRpZXMnICsgJGx2bCxcclxuICAgICAgJG93blByb3BlcnRpZXMgPSBpdC5vcHRzLm93blByb3BlcnRpZXMsXHJcbiAgICAgICRjdXJyZW50QmFzZUlkID0gaXQuYmFzZUlkO1xyXG4gICAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgIG91dCArPSAnIHZhciAnICsgKCRkYXRhUHJvcGVydGllcykgKyAnID0gdW5kZWZpbmVkOyAnO1xyXG4gICAgfVxyXG4gICAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgIG91dCArPSAnICcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICcgPSAnICsgKCRkYXRhUHJvcGVydGllcykgKyAnIHx8IE9iamVjdC5rZXlzKCcgKyAoJGRhdGEpICsgJyk7IGZvciAodmFyICcgKyAoJGlkeCkgKyAnPTA7ICcgKyAoJGlkeCkgKyAnPCcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICcubGVuZ3RoOyAnICsgKCRpZHgpICsgJysrKSB7IHZhciAnICsgKCRrZXkpICsgJyA9ICcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICdbJyArICgkaWR4KSArICddOyAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICcgZm9yICh2YXIgJyArICgka2V5KSArICcgaW4gJyArICgkZGF0YSkgKyAnKSB7ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB2YXIgc3RhcnRFcnJzJyArICgkbHZsKSArICcgPSBlcnJvcnM7ICc7XHJcbiAgICB2YXIgJHBhc3NEYXRhID0gJGtleTtcclxuICAgIHZhciAkd2FzQ29tcG9zaXRlID0gaXQuY29tcG9zaXRlUnVsZTtcclxuICAgIGl0LmNvbXBvc2l0ZVJ1bGUgPSAkaXQuY29tcG9zaXRlUnVsZSA9IHRydWU7XHJcbiAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpO1xyXG4gICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xyXG4gICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcclxuICAgICAgb3V0ICs9ICcgJyArIChpdC51dGlsLnZhclJlcGxhY2UoJGNvZGUsICRuZXh0RGF0YSwgJHBhc3NEYXRhKSkgKyAnICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcclxuICAgIG91dCArPSAnIGlmICghJyArICgkbmV4dFZhbGlkKSArICcpIHsgZm9yICh2YXIgJyArICgkaSkgKyAnPXN0YXJ0RXJycycgKyAoJGx2bCkgKyAnOyAnICsgKCRpKSArICc8ZXJyb3JzOyAnICsgKCRpKSArICcrKykgeyB2RXJyb3JzWycgKyAoJGkpICsgJ10ucHJvcGVydHlOYW1lID0gJyArICgka2V5KSArICc7IH0gICB2YXIgZXJyID0gICAnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdwcm9wZXJ0eU5hbWVzJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBwcm9wZXJ0eU5hbWU6IFxcJycgKyAoJGludmFsaWROYW1lKSArICdcXCcgfSAnO1xyXG4gICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcclxuICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Byb3BlcnR5IG5hbWUgXFxcXFxcJycgKyAoJGludmFsaWROYW1lKSArICdcXFxcXFwnIGlzIGludmFsaWRcXCcgJztcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHZFcnJvcnMpOyAnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7IHJldHVybiBmYWxzZTsgJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgb3V0ICs9ICcgYnJlYWs7ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9IH0nO1xyXG4gIH1cclxuICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgb3V0ICs9ICcgJyArICgkY2xvc2luZ0JyYWNlcykgKyAnIGlmICgnICsgKCRlcnJzKSArICcgPT0gZXJyb3JzKSB7JztcclxuICB9XHJcbiAgb3V0ID0gaXQudXRpbC5jbGVhblVwQ29kZShvdXQpO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX3JlZihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xyXG4gIHZhciBvdXQgPSAnICc7XHJcbiAgdmFyICRsdmwgPSBpdC5sZXZlbDtcclxuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XHJcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcclxuICB2YXIgJGFzeW5jLCAkcmVmQ29kZTtcclxuICBpZiAoJHNjaGVtYSA9PSAnIycgfHwgJHNjaGVtYSA9PSAnIy8nKSB7XHJcbiAgICBpZiAoaXQuaXNSb290KSB7XHJcbiAgICAgICRhc3luYyA9IGl0LmFzeW5jO1xyXG4gICAgICAkcmVmQ29kZSA9ICd2YWxpZGF0ZSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkYXN5bmMgPSBpdC5yb290LnNjaGVtYS4kYXN5bmMgPT09IHRydWU7XHJcbiAgICAgICRyZWZDb2RlID0gJ3Jvb3QucmVmVmFsWzBdJztcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdmFyICRyZWZWYWwgPSBpdC5yZXNvbHZlUmVmKGl0LmJhc2VJZCwgJHNjaGVtYSwgaXQuaXNSb290KTtcclxuICAgIGlmICgkcmVmVmFsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdmFyICRtZXNzYWdlID0gaXQuTWlzc2luZ1JlZkVycm9yLm1lc3NhZ2UoaXQuYmFzZUlkLCAkc2NoZW1hKTtcclxuICAgICAgaWYgKGl0Lm9wdHMubWlzc2luZ1JlZnMgPT0gJ2ZhaWwnKSB7XHJcbiAgICAgICAgaXQubG9nZ2VyLmVycm9yKCRtZXNzYWdlKTtcclxuICAgICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgICAgICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnJHJlZicpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgcmVmOiBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRzY2hlbWEpKSArICdcXCcgfSAnO1xyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnY2FuXFxcXFxcJ3QgcmVzb2x2ZSByZWZlcmVuY2UgJyArIChpdC51dGlsLmVzY2FwZVF1b3Rlcygkc2NoZW1hKSkgKyAnXFwnICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJHNjaGVtYSkpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3V0ICs9ICcge30gJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XHJcbiAgICAgICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgICAgb3V0ICs9ICcgaWYgKGZhbHNlKSB7ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGl0Lm9wdHMubWlzc2luZ1JlZnMgPT0gJ2lnbm9yZScpIHtcclxuICAgICAgICBpdC5sb2dnZXIud2FybigkbWVzc2FnZSk7XHJcbiAgICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAgIG91dCArPSAnIGlmICh0cnVlKSB7ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBpdC5NaXNzaW5nUmVmRXJyb3IoaXQuYmFzZUlkLCAkc2NoZW1hLCAkbWVzc2FnZSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoJHJlZlZhbC5pbmxpbmUpIHtcclxuICAgICAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XHJcbiAgICAgICRpdC5sZXZlbCsrO1xyXG4gICAgICB2YXIgJG5leHRWYWxpZCA9ICd2YWxpZCcgKyAkaXQubGV2ZWw7XHJcbiAgICAgICRpdC5zY2hlbWEgPSAkcmVmVmFsLnNjaGVtYTtcclxuICAgICAgJGl0LnNjaGVtYVBhdGggPSAnJztcclxuICAgICAgJGl0LmVyclNjaGVtYVBhdGggPSAkc2NoZW1hO1xyXG4gICAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpLnJlcGxhY2UoL3ZhbGlkYXRlXFwuc2NoZW1hL2csICRyZWZWYWwuY29kZSk7XHJcbiAgICAgIG91dCArPSAnICcgKyAoJGNvZGUpICsgJyAnO1xyXG4gICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAkYXN5bmMgPSAkcmVmVmFsLiRhc3luYyA9PT0gdHJ1ZSB8fCAoaXQuYXN5bmMgJiYgJHJlZlZhbC4kYXN5bmMgIT09IGZhbHNlKTtcclxuICAgICAgJHJlZkNvZGUgPSAkcmVmVmFsLmNvZGU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICgkcmVmQ29kZSkge1xyXG4gICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgICBvdXQgPSAnJztcclxuICAgIGlmIChpdC5vcHRzLnBhc3NDb250ZXh0KSB7XHJcbiAgICAgIG91dCArPSAnICcgKyAoJHJlZkNvZGUpICsgJy5jYWxsKHRoaXMsICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyAnICsgKCRyZWZDb2RlKSArICcoICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyAnICsgKCRkYXRhKSArICcsIChkYXRhUGF0aCB8fCBcXCdcXCcpJztcclxuICAgIGlmIChpdC5lcnJvclBhdGggIT0gJ1wiXCInKSB7XHJcbiAgICAgIG91dCArPSAnICsgJyArIChpdC5lcnJvclBhdGgpO1xyXG4gICAgfVxyXG4gICAgdmFyICRwYXJlbnREYXRhID0gJGRhdGFMdmwgPyAnZGF0YScgKyAoKCRkYXRhTHZsIC0gMSkgfHwgJycpIDogJ3BhcmVudERhdGEnLFxyXG4gICAgICAkcGFyZW50RGF0YVByb3BlcnR5ID0gJGRhdGFMdmwgPyBpdC5kYXRhUGF0aEFyclskZGF0YUx2bF0gOiAncGFyZW50RGF0YVByb3BlcnR5JztcclxuICAgIG91dCArPSAnICwgJyArICgkcGFyZW50RGF0YSkgKyAnICwgJyArICgkcGFyZW50RGF0YVByb3BlcnR5KSArICcsIHJvb3REYXRhKSAgJztcclxuICAgIHZhciBfX2NhbGxWYWxpZGF0ZSA9IG91dDtcclxuICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XHJcbiAgICBpZiAoJGFzeW5jKSB7XHJcbiAgICAgIGlmICghaXQuYXN5bmMpIHRocm93IG5ldyBFcnJvcignYXN5bmMgc2NoZW1hIHJlZmVyZW5jZWQgYnkgc3luYyBzY2hlbWEnKTtcclxuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdmFsaWQpICsgJzsgJztcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyB0cnkgeyBhd2FpdCAnICsgKF9fY2FsbFZhbGlkYXRlKSArICc7ICc7XHJcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgJyArICgkdmFsaWQpICsgJyA9IHRydWU7ICc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcgfSBjYXRjaCAoZSkgeyBpZiAoIShlIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSkgdGhyb3cgZTsgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBlLmVycm9yczsgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQoZS5lcnJvcnMpOyBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDsgJztcclxuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICBvdXQgKz0gJyAnICsgKCR2YWxpZCkgKyAnID0gZmFsc2U7ICc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgIG91dCArPSAnIGlmICgnICsgKCR2YWxpZCkgKyAnKSB7ICc7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIGlmICghJyArIChfX2NhbGxWYWxpZGF0ZSkgKyAnKSB7IGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gJyArICgkcmVmQ29kZSkgKyAnLmVycm9yczsgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQoJyArICgkcmVmQ29kZSkgKyAnLmVycm9ycyk7IGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoOyB9ICc7XHJcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgZWxzZSB7ICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfcGF0dGVybihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xyXG4gIHZhciBvdXQgPSAnICc7XHJcbiAgdmFyICRsdmwgPSBpdC5sZXZlbDtcclxuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XHJcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xyXG4gIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRrZXl3b3JkKTtcclxuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XHJcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XHJcbiAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcclxuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxyXG4gICAgJHNjaGVtYVZhbHVlO1xyXG4gIGlmICgkaXNEYXRhKSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XHJcbiAgICAkc2NoZW1hVmFsdWUgPSAnc2NoZW1hJyArICRsdmw7XHJcbiAgfSBlbHNlIHtcclxuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XHJcbiAgfVxyXG4gIHZhciAkcmVnZXhwID0gJGlzRGF0YSA/ICcobmV3IFJlZ0V4cCgnICsgJHNjaGVtYVZhbHVlICsgJykpJyA6IGl0LnVzZVBhdHRlcm4oJHNjaGVtYSk7XHJcbiAgb3V0ICs9ICdpZiAoICc7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnc3RyaW5nXFwnKSB8fCAnO1xyXG4gIH1cclxuICBvdXQgKz0gJyAhJyArICgkcmVnZXhwKSArICcudGVzdCgnICsgKCRkYXRhKSArICcpICkgeyAgICc7XHJcbiAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICQkb3V0U3RhY2sucHVzaChvdXQpO1xyXG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ3BhdHRlcm4nKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IHBhdHRlcm46ICAnO1xyXG4gICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWFWYWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJycgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkc2NoZW1hKSk7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyAgfSAnO1xyXG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIG1hdGNoIHBhdHRlcm4gXCInO1xyXG4gICAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICAgIG91dCArPSAnXFwnICsgJyArICgkc2NoZW1hVmFsdWUpICsgJyArIFxcJyc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRzY2hlbWEpKTtcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJ1wiXFwnICc7XHJcbiAgICB9XHJcbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgIG91dCArPSAnICwgc2NoZW1hOiAgJztcclxuICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRzY2hlbWEpKTtcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyAgICAgICAgICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgfSAnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB7fSAnO1xyXG4gIH1cclxuICB2YXIgX19lcnIgPSBvdXQ7XHJcbiAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgfVxyXG4gIG91dCArPSAnfSAnO1xyXG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcclxuICB9XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfY3VzdG9tKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGVycm9yS2V5d29yZDtcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcclxuICB2YXIgJGVycnMgPSAnZXJyc19fJyArICRsdmw7XHJcbiAgdmFyICRpc0RhdGEgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWEgJiYgJHNjaGVtYS4kZGF0YSxcclxuICAgICRzY2hlbWFWYWx1ZTtcclxuICBpZiAoJGlzRGF0YSkge1xyXG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYScgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLmdldERhdGEoJHNjaGVtYS4kZGF0YSwgJGRhdGFMdmwsIGl0LmRhdGFQYXRoQXJyKSkgKyAnOyAnO1xyXG4gICAgJHNjaGVtYVZhbHVlID0gJ3NjaGVtYScgKyAkbHZsO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAkc2NoZW1hVmFsdWUgPSAkc2NoZW1hO1xyXG4gIH1cclxuICB2YXIgJHJ1bGUgPSB0aGlzLFxyXG4gICAgJGRlZmluaXRpb24gPSAnZGVmaW5pdGlvbicgKyAkbHZsLFxyXG4gICAgJHJEZWYgPSAkcnVsZS5kZWZpbml0aW9uLFxyXG4gICAgJGNsb3NpbmdCcmFjZXMgPSAnJztcclxuICB2YXIgJGNvbXBpbGUsICRpbmxpbmUsICRtYWNybywgJHJ1bGVWYWxpZGF0ZSwgJHZhbGlkYXRlQ29kZTtcclxuICBpZiAoJGlzRGF0YSAmJiAkckRlZi4kZGF0YSkge1xyXG4gICAgJHZhbGlkYXRlQ29kZSA9ICdrZXl3b3JkVmFsaWRhdGUnICsgJGx2bDtcclxuICAgIHZhciAkdmFsaWRhdGVTY2hlbWEgPSAkckRlZi52YWxpZGF0ZVNjaGVtYTtcclxuICAgIG91dCArPSAnIHZhciAnICsgKCRkZWZpbml0aW9uKSArICcgPSBSVUxFUy5jdXN0b21bXFwnJyArICgka2V5d29yZCkgKyAnXFwnXS5kZWZpbml0aW9uOyB2YXIgJyArICgkdmFsaWRhdGVDb2RlKSArICcgPSAnICsgKCRkZWZpbml0aW9uKSArICcudmFsaWRhdGU7JztcclxuICB9IGVsc2Uge1xyXG4gICAgJHJ1bGVWYWxpZGF0ZSA9IGl0LnVzZUN1c3RvbVJ1bGUoJHJ1bGUsICRzY2hlbWEsIGl0LnNjaGVtYSwgaXQpO1xyXG4gICAgaWYgKCEkcnVsZVZhbGlkYXRlKSByZXR1cm47XHJcbiAgICAkc2NoZW1hVmFsdWUgPSAndmFsaWRhdGUuc2NoZW1hJyArICRzY2hlbWFQYXRoO1xyXG4gICAgJHZhbGlkYXRlQ29kZSA9ICRydWxlVmFsaWRhdGUuY29kZTtcclxuICAgICRjb21waWxlID0gJHJEZWYuY29tcGlsZTtcclxuICAgICRpbmxpbmUgPSAkckRlZi5pbmxpbmU7XHJcbiAgICAkbWFjcm8gPSAkckRlZi5tYWNybztcclxuICB9XHJcbiAgdmFyICRydWxlRXJycyA9ICR2YWxpZGF0ZUNvZGUgKyAnLmVycm9ycycsXHJcbiAgICAkaSA9ICdpJyArICRsdmwsXHJcbiAgICAkcnVsZUVyciA9ICdydWxlRXJyJyArICRsdmwsXHJcbiAgICAkYXN5bmNLZXl3b3JkID0gJHJEZWYuYXN5bmM7XHJcbiAgaWYgKCRhc3luY0tleXdvcmQgJiYgIWl0LmFzeW5jKSB0aHJvdyBuZXcgRXJyb3IoJ2FzeW5jIGtleXdvcmQgaW4gc3luYyBzY2hlbWEnKTtcclxuICBpZiAoISgkaW5saW5lIHx8ICRtYWNybykpIHtcclxuICAgIG91dCArPSAnJyArICgkcnVsZUVycnMpICsgJyA9IG51bGw7JztcclxuICB9XHJcbiAgb3V0ICs9ICd2YXIgJyArICgkZXJycykgKyAnID0gZXJyb3JzO3ZhciAnICsgKCR2YWxpZCkgKyAnOyc7XHJcbiAgaWYgKCRpc0RhdGEgJiYgJHJEZWYuJGRhdGEpIHtcclxuICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcclxuICAgIG91dCArPSAnIGlmICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnID09PSB1bmRlZmluZWQpIHsgJyArICgkdmFsaWQpICsgJyA9IHRydWU7IH0gZWxzZSB7ICc7XHJcbiAgICBpZiAoJHZhbGlkYXRlU2NoZW1hKSB7XHJcbiAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcclxuICAgICAgb3V0ICs9ICcgJyArICgkdmFsaWQpICsgJyA9ICcgKyAoJGRlZmluaXRpb24pICsgJy52YWxpZGF0ZVNjaGVtYSgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnKTsgaWYgKCcgKyAoJHZhbGlkKSArICcpIHsgJztcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCRpbmxpbmUpIHtcclxuICAgIGlmICgkckRlZi5zdGF0ZW1lbnRzKSB7XHJcbiAgICAgIG91dCArPSAnICcgKyAoJHJ1bGVWYWxpZGF0ZS52YWxpZGF0ZSkgKyAnICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyAnICsgKCR2YWxpZCkgKyAnID0gJyArICgkcnVsZVZhbGlkYXRlLnZhbGlkYXRlKSArICc7ICc7XHJcbiAgICB9XHJcbiAgfSBlbHNlIGlmICgkbWFjcm8pIHtcclxuICAgIHZhciAkaXQgPSBpdC51dGlsLmNvcHkoaXQpO1xyXG4gICAgdmFyICRjbG9zaW5nQnJhY2VzID0gJyc7XHJcbiAgICAkaXQubGV2ZWwrKztcclxuICAgIHZhciAkbmV4dFZhbGlkID0gJ3ZhbGlkJyArICRpdC5sZXZlbDtcclxuICAgICRpdC5zY2hlbWEgPSAkcnVsZVZhbGlkYXRlLnZhbGlkYXRlO1xyXG4gICAgJGl0LnNjaGVtYVBhdGggPSAnJztcclxuICAgIHZhciAkd2FzQ29tcG9zaXRlID0gaXQuY29tcG9zaXRlUnVsZTtcclxuICAgIGl0LmNvbXBvc2l0ZVJ1bGUgPSAkaXQuY29tcG9zaXRlUnVsZSA9IHRydWU7XHJcbiAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpLnJlcGxhY2UoL3ZhbGlkYXRlXFwuc2NoZW1hL2csICR2YWxpZGF0ZUNvZGUpO1xyXG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcclxuICAgIG91dCArPSAnICcgKyAoJGNvZGUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgIG91dCA9ICcnO1xyXG4gICAgb3V0ICs9ICcgICcgKyAoJHZhbGlkYXRlQ29kZSkgKyAnLmNhbGwoICc7XHJcbiAgICBpZiAoaXQub3B0cy5wYXNzQ29udGV4dCkge1xyXG4gICAgICBvdXQgKz0gJ3RoaXMnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICdzZWxmJztcclxuICAgIH1cclxuICAgIGlmICgkY29tcGlsZSB8fCAkckRlZi5zY2hlbWEgPT09IGZhbHNlKSB7XHJcbiAgICAgIG91dCArPSAnICwgJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyAsICcgKyAoJHNjaGVtYVZhbHVlKSArICcgLCAnICsgKCRkYXRhKSArICcgLCB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgLCAoZGF0YVBhdGggfHwgXFwnXFwnKSc7XHJcbiAgICBpZiAoaXQuZXJyb3JQYXRoICE9ICdcIlwiJykge1xyXG4gICAgICBvdXQgKz0gJyArICcgKyAoaXQuZXJyb3JQYXRoKTtcclxuICAgIH1cclxuICAgIHZhciAkcGFyZW50RGF0YSA9ICRkYXRhTHZsID8gJ2RhdGEnICsgKCgkZGF0YUx2bCAtIDEpIHx8ICcnKSA6ICdwYXJlbnREYXRhJyxcclxuICAgICAgJHBhcmVudERhdGFQcm9wZXJ0eSA9ICRkYXRhTHZsID8gaXQuZGF0YVBhdGhBcnJbJGRhdGFMdmxdIDogJ3BhcmVudERhdGFQcm9wZXJ0eSc7XHJcbiAgICBvdXQgKz0gJyAsICcgKyAoJHBhcmVudERhdGEpICsgJyAsICcgKyAoJHBhcmVudERhdGFQcm9wZXJ0eSkgKyAnICwgcm9vdERhdGEgKSAgJztcclxuICAgIHZhciBkZWZfY2FsbFJ1bGVWYWxpZGF0ZSA9IG91dDtcclxuICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XHJcbiAgICBpZiAoJHJEZWYuZXJyb3JzID09PSBmYWxzZSkge1xyXG4gICAgICBvdXQgKz0gJyAnICsgKCR2YWxpZCkgKyAnID0gJztcclxuICAgICAgaWYgKCRhc3luY0tleXdvcmQpIHtcclxuICAgICAgICBvdXQgKz0gJ2F3YWl0ICc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcnICsgKGRlZl9jYWxsUnVsZVZhbGlkYXRlKSArICc7ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoJGFzeW5jS2V5d29yZCkge1xyXG4gICAgICAgICRydWxlRXJycyA9ICdjdXN0b21FcnJvcnMnICsgJGx2bDtcclxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkcnVsZUVycnMpICsgJyA9IG51bGw7IHRyeSB7ICcgKyAoJHZhbGlkKSArICcgPSBhd2FpdCAnICsgKGRlZl9jYWxsUnVsZVZhbGlkYXRlKSArICc7IH0gY2F0Y2ggKGUpIHsgJyArICgkdmFsaWQpICsgJyA9IGZhbHNlOyBpZiAoZSBpbnN0YW5jZW9mIFZhbGlkYXRpb25FcnJvcikgJyArICgkcnVsZUVycnMpICsgJyA9IGUuZXJyb3JzOyBlbHNlIHRocm93IGU7IH0gJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyAnICsgKCRydWxlRXJycykgKyAnID0gbnVsbDsgJyArICgkdmFsaWQpICsgJyA9ICcgKyAoZGVmX2NhbGxSdWxlVmFsaWRhdGUpICsgJzsgJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoJHJEZWYubW9kaWZ5aW5nKSB7XHJcbiAgICBvdXQgKz0gJyBpZiAoJyArICgkcGFyZW50RGF0YSkgKyAnKSAnICsgKCRkYXRhKSArICcgPSAnICsgKCRwYXJlbnREYXRhKSArICdbJyArICgkcGFyZW50RGF0YVByb3BlcnR5KSArICddOyc7XHJcbiAgfVxyXG4gIG91dCArPSAnJyArICgkY2xvc2luZ0JyYWNlcyk7XHJcbiAgaWYgKCRyRGVmLnZhbGlkKSB7XHJcbiAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICBvdXQgKz0gJyBpZiAodHJ1ZSkgeyAnO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyBpZiAoICc7XHJcbiAgICBpZiAoJHJEZWYudmFsaWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBvdXQgKz0gJyAhJztcclxuICAgICAgaWYgKCRtYWNybykge1xyXG4gICAgICAgIG91dCArPSAnJyArICgkbmV4dFZhbGlkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJycgKyAoJHZhbGlkKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3V0ICs9ICcgJyArICghJHJEZWYudmFsaWQpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcpIHsgJztcclxuICAgICRlcnJvcktleXdvcmQgPSAkcnVsZS5rZXl3b3JkO1xyXG4gICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgICBvdXQgPSAnJztcclxuICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcclxuICAgICQkb3V0U3RhY2sucHVzaChvdXQpO1xyXG4gICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAnY3VzdG9tJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBrZXl3b3JkOiBcXCcnICsgKCRydWxlLmtleXdvcmQpICsgJ1xcJyB9ICc7XHJcbiAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIHBhc3MgXCInICsgKCRydWxlLmtleXdvcmQpICsgJ1wiIGtleXdvcmQgdmFsaWRhdGlvblxcJyAnO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnIH0gJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHt9ICc7XHJcbiAgICB9XHJcbiAgICB2YXIgX19lcnIgPSBvdXQ7XHJcbiAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xyXG4gICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgIGlmIChpdC5hc3luYykge1xyXG4gICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICAgIH1cclxuICAgIHZhciBkZWZfY3VzdG9tRXJyb3IgPSBvdXQ7XHJcbiAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xyXG4gICAgaWYgKCRpbmxpbmUpIHtcclxuICAgICAgaWYgKCRyRGVmLmVycm9ycykge1xyXG4gICAgICAgIGlmICgkckRlZi5lcnJvcnMgIT0gJ2Z1bGwnKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyAgZm9yICh2YXIgJyArICgkaSkgKyAnPScgKyAoJGVycnMpICsgJzsgJyArICgkaSkgKyAnPGVycm9yczsgJyArICgkaSkgKyAnKyspIHsgdmFyICcgKyAoJHJ1bGVFcnIpICsgJyA9IHZFcnJvcnNbJyArICgkaSkgKyAnXTsgaWYgKCcgKyAoJHJ1bGVFcnIpICsgJy5kYXRhUGF0aCA9PT0gdW5kZWZpbmVkKSAnICsgKCRydWxlRXJyKSArICcuZGF0YVBhdGggPSAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICc7IGlmICgnICsgKCRydWxlRXJyKSArICcuc2NoZW1hUGF0aCA9PT0gdW5kZWZpbmVkKSB7ICcgKyAoJHJ1bGVFcnIpICsgJy5zY2hlbWFQYXRoID0gXCInICsgKCRlcnJTY2hlbWFQYXRoKSArICdcIjsgfSAnO1xyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyAnICsgKCRydWxlRXJyKSArICcuc2NoZW1hID0gJyArICgkc2NoZW1hVmFsdWUpICsgJzsgJyArICgkcnVsZUVycikgKyAnLmRhdGEgPSAnICsgKCRkYXRhKSArICc7ICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgkckRlZi5lcnJvcnMgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyAnICsgKGRlZl9jdXN0b21FcnJvcikgKyAnICc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRlcnJzKSArICcgPT0gZXJyb3JzKSB7ICcgKyAoZGVmX2N1c3RvbUVycm9yKSArICcgfSBlbHNlIHsgIGZvciAodmFyICcgKyAoJGkpICsgJz0nICsgKCRlcnJzKSArICc7ICcgKyAoJGkpICsgJzxlcnJvcnM7ICcgKyAoJGkpICsgJysrKSB7IHZhciAnICsgKCRydWxlRXJyKSArICcgPSB2RXJyb3JzWycgKyAoJGkpICsgJ107IGlmICgnICsgKCRydWxlRXJyKSArICcuZGF0YVBhdGggPT09IHVuZGVmaW5lZCkgJyArICgkcnVsZUVycikgKyAnLmRhdGFQYXRoID0gKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnOyBpZiAoJyArICgkcnVsZUVycikgKyAnLnNjaGVtYVBhdGggPT09IHVuZGVmaW5lZCkgeyAnICsgKCRydWxlRXJyKSArICcuc2NoZW1hUGF0aCA9IFwiJyArICgkZXJyU2NoZW1hUGF0aCkgKyAnXCI7IH0gJztcclxuICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgJyArICgkcnVsZUVycikgKyAnLnNjaGVtYSA9ICcgKyAoJHNjaGVtYVZhbHVlKSArICc7ICcgKyAoJHJ1bGVFcnIpICsgJy5kYXRhID0gJyArICgkZGF0YSkgKyAnOyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3V0ICs9ICcgfSB9ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKCRtYWNybykge1xyXG4gICAgICBvdXQgKz0gJyAgIHZhciBlcnIgPSAgICc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCRlcnJvcktleXdvcmQgfHwgJ2N1c3RvbScpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsga2V5d29yZDogXFwnJyArICgkcnVsZS5rZXl3b3JkKSArICdcXCcgfSAnO1xyXG4gICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgcGFzcyBcIicgKyAoJHJ1bGUua2V5d29yZCkgKyAnXCIga2V5d29yZCB2YWxpZGF0aW9uXFwnICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHZFcnJvcnMpOyAnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoJHJEZWYuZXJyb3JzID09PSBmYWxzZSkge1xyXG4gICAgICAgIG91dCArPSAnICcgKyAoZGVmX2N1c3RvbUVycm9yKSArICcgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyBpZiAoQXJyYXkuaXNBcnJheSgnICsgKCRydWxlRXJycykgKyAnKSkgeyBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9ICcgKyAoJHJ1bGVFcnJzKSArICc7IGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KCcgKyAoJHJ1bGVFcnJzKSArICcpOyBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDsgIGZvciAodmFyICcgKyAoJGkpICsgJz0nICsgKCRlcnJzKSArICc7ICcgKyAoJGkpICsgJzxlcnJvcnM7ICcgKyAoJGkpICsgJysrKSB7IHZhciAnICsgKCRydWxlRXJyKSArICcgPSB2RXJyb3JzWycgKyAoJGkpICsgJ107IGlmICgnICsgKCRydWxlRXJyKSArICcuZGF0YVBhdGggPT09IHVuZGVmaW5lZCkgJyArICgkcnVsZUVycikgKyAnLmRhdGFQYXRoID0gKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnOyAgJyArICgkcnVsZUVycikgKyAnLnNjaGVtYVBhdGggPSBcIicgKyAoJGVyclNjaGVtYVBhdGgpICsgJ1wiOyAgJztcclxuICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyAnICsgKCRydWxlRXJyKSArICcuc2NoZW1hID0gJyArICgkc2NoZW1hVmFsdWUpICsgJzsgJyArICgkcnVsZUVycikgKyAnLmRhdGEgPSAnICsgKCRkYXRhKSArICc7ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCArPSAnIH0gfSBlbHNlIHsgJyArIChkZWZfY3VzdG9tRXJyb3IpICsgJyB9ICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG91dCArPSAnIH0gJztcclxuICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgIG91dCArPSAnIGVsc2UgeyAnO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9fbGltaXRQcm9wZXJ0aWVzKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGVycm9yS2V5d29yZDtcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkaXNEYXRhID0gaXQub3B0cy4kZGF0YSAmJiAkc2NoZW1hICYmICRzY2hlbWEuJGRhdGEsXHJcbiAgICAkc2NoZW1hVmFsdWU7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnIHZhciBzY2hlbWEnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC5nZXREYXRhKCRzY2hlbWEuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFycikpICsgJzsgJztcclxuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcclxuICB9IGVsc2Uge1xyXG4gICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYTtcclxuICB9XHJcbiAgdmFyICRvcCA9ICRrZXl3b3JkID09ICdtYXhQcm9wZXJ0aWVzJyA/ICc+JyA6ICc8JztcclxuICBvdXQgKz0gJ2lmICggJztcclxuICBpZiAoJGlzRGF0YSkge1xyXG4gICAgb3V0ICs9ICcgKCcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPSBcXCdudW1iZXJcXCcpIHx8ICc7XHJcbiAgfVxyXG4gIG91dCArPSAnIE9iamVjdC5rZXlzKCcgKyAoJGRhdGEpICsgJykubGVuZ3RoICcgKyAoJG9wKSArICcgJyArICgkc2NoZW1hVmFsdWUpICsgJykgeyAnO1xyXG4gIHZhciAkZXJyb3JLZXl3b3JkID0gJGtleXdvcmQ7XHJcbiAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICQkb3V0U3RhY2sucHVzaChvdXQpO1xyXG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAnX2xpbWl0UHJvcGVydGllcycpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbGltaXQ6ICcgKyAoJHNjaGVtYVZhbHVlKSArICcgfSAnO1xyXG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIE5PVCBoYXZlICc7XHJcbiAgICAgIGlmICgka2V5d29yZCA9PSAnbWF4UHJvcGVydGllcycpIHtcclxuICAgICAgICBvdXQgKz0gJ21vcmUnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnZmV3ZXInO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnIHRoYW4gJztcclxuICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICBvdXQgKz0gJ1xcJyArICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKyBcXCcnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hKTtcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyBwcm9wZXJ0aWVzXFwnICc7XHJcbiAgICB9XHJcbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgIG91dCArPSAnICwgc2NoZW1hOiAgJztcclxuICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hKTtcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyAgICAgICAgICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgfSAnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB7fSAnO1xyXG4gIH1cclxuICB2YXIgX19lcnIgPSBvdXQ7XHJcbiAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgfVxyXG4gIG91dCArPSAnfSAnO1xyXG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcclxuICB9XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZ1xyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmVzdGllanMvcHVueWNvZGUuanMgLSBwdW55Y29kZS51Y3MyLmRlY29kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHVjczJsZW5ndGgoc3RyKSB7XHJcbiAgdmFyIGxlbmd0aCA9IDBcclxuICAgICwgbGVuID0gc3RyLmxlbmd0aFxyXG4gICAgLCBwb3MgPSAwXHJcbiAgICAsIHZhbHVlO1xyXG4gIHdoaWxlIChwb3MgPCBsZW4pIHtcclxuICAgIGxlbmd0aCsrO1xyXG4gICAgdmFsdWUgPSBzdHIuY2hhckNvZGVBdChwb3MrKyk7XHJcbiAgICBpZiAodmFsdWUgPj0gMHhEODAwICYmIHZhbHVlIDw9IDB4REJGRiAmJiBwb3MgPCBsZW4pIHtcclxuICAgICAgLy8gaGlnaCBzdXJyb2dhdGUsIGFuZCB0aGVyZSBpcyBhIG5leHQgY2hhcmFjdGVyXHJcbiAgICAgIHZhbHVlID0gc3RyLmNoYXJDb2RlQXQocG9zKTtcclxuICAgICAgaWYgKCh2YWx1ZSAmIDB4RkMwMCkgPT0gMHhEQzAwKSBwb3MrKzsgLy8gbG93IHN1cnJvZ2F0ZVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbGVuZ3RoO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgY29tcGlsZVNjaGVtYSA9IHJlcXVpcmUoJy4vY29tcGlsZScpXHJcbiAgLCByZXNvbHZlID0gcmVxdWlyZSgnLi9jb21waWxlL3Jlc29sdmUnKVxyXG4gICwgQ2FjaGUgPSByZXF1aXJlKCcuL2NhY2hlJylcclxuICAsIFNjaGVtYU9iamVjdCA9IHJlcXVpcmUoJy4vY29tcGlsZS9zY2hlbWFfb2JqJylcclxuICAsIHN0YWJsZVN0cmluZ2lmeSA9IHJlcXVpcmUoJ2Zhc3QtanNvbi1zdGFibGUtc3RyaW5naWZ5JylcclxuICAsIGZvcm1hdHMgPSByZXF1aXJlKCcuL2NvbXBpbGUvZm9ybWF0cycpXHJcbiAgLCBydWxlcyA9IHJlcXVpcmUoJy4vY29tcGlsZS9ydWxlcycpXHJcbiAgLCAkZGF0YU1ldGFTY2hlbWEgPSByZXF1aXJlKCcuL2RhdGEnKVxyXG4gICwgdXRpbCA9IHJlcXVpcmUoJy4vY29tcGlsZS91dGlsJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFqdjtcclxuXHJcbkFqdi5wcm90b3R5cGUudmFsaWRhdGUgPSB2YWxpZGF0ZTtcclxuQWp2LnByb3RvdHlwZS5jb21waWxlID0gY29tcGlsZTtcclxuQWp2LnByb3RvdHlwZS5hZGRTY2hlbWEgPSBhZGRTY2hlbWE7XHJcbkFqdi5wcm90b3R5cGUuYWRkTWV0YVNjaGVtYSA9IGFkZE1ldGFTY2hlbWE7XHJcbkFqdi5wcm90b3R5cGUudmFsaWRhdGVTY2hlbWEgPSB2YWxpZGF0ZVNjaGVtYTtcclxuQWp2LnByb3RvdHlwZS5nZXRTY2hlbWEgPSBnZXRTY2hlbWE7XHJcbkFqdi5wcm90b3R5cGUucmVtb3ZlU2NoZW1hID0gcmVtb3ZlU2NoZW1hO1xyXG5BanYucHJvdG90eXBlLmFkZEZvcm1hdCA9IGFkZEZvcm1hdDtcclxuQWp2LnByb3RvdHlwZS5lcnJvcnNUZXh0ID0gZXJyb3JzVGV4dDtcclxuXHJcbkFqdi5wcm90b3R5cGUuX2FkZFNjaGVtYSA9IF9hZGRTY2hlbWE7XHJcbkFqdi5wcm90b3R5cGUuX2NvbXBpbGUgPSBfY29tcGlsZTtcclxuXHJcbkFqdi5wcm90b3R5cGUuY29tcGlsZUFzeW5jID0gcmVxdWlyZSgnLi9jb21waWxlL2FzeW5jJyk7XHJcbnZhciBjdXN0b21LZXl3b3JkID0gcmVxdWlyZSgnLi9rZXl3b3JkJyk7XHJcbkFqdi5wcm90b3R5cGUuYWRkS2V5d29yZCA9IGN1c3RvbUtleXdvcmQuYWRkO1xyXG5BanYucHJvdG90eXBlLmdldEtleXdvcmQgPSBjdXN0b21LZXl3b3JkLmdldDtcclxuQWp2LnByb3RvdHlwZS5yZW1vdmVLZXl3b3JkID0gY3VzdG9tS2V5d29yZC5yZW1vdmU7XHJcblxyXG52YXIgZXJyb3JDbGFzc2VzID0gcmVxdWlyZSgnLi9jb21waWxlL2Vycm9yX2NsYXNzZXMnKTtcclxuQWp2LlZhbGlkYXRpb25FcnJvciA9IGVycm9yQ2xhc3Nlcy5WYWxpZGF0aW9uO1xyXG5BanYuTWlzc2luZ1JlZkVycm9yID0gZXJyb3JDbGFzc2VzLk1pc3NpbmdSZWY7XHJcbkFqdi4kZGF0YU1ldGFTY2hlbWEgPSAkZGF0YU1ldGFTY2hlbWE7XHJcblxyXG52YXIgTUVUQV9TQ0hFTUFfSUQgPSAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNy9zY2hlbWEnO1xyXG5cclxudmFyIE1FVEFfSUdOT1JFX09QVElPTlMgPSBbICdyZW1vdmVBZGRpdGlvbmFsJywgJ3VzZURlZmF1bHRzJywgJ2NvZXJjZVR5cGVzJyBdO1xyXG52YXIgTUVUQV9TVVBQT1JUX0RBVEEgPSBbJy9wcm9wZXJ0aWVzJ107XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyB2YWxpZGF0b3IgaW5zdGFuY2UuXHJcbiAqIFVzYWdlOiBgQWp2KG9wdHMpYFxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBvcHRpb25hbCBvcHRpb25zXHJcbiAqIEByZXR1cm4ge09iamVjdH0gYWp2IGluc3RhbmNlXHJcbiAqL1xyXG5mdW5jdGlvbiBBanYob3B0cykge1xyXG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBanYpKSByZXR1cm4gbmV3IEFqdihvcHRzKTtcclxuICBvcHRzID0gdGhpcy5fb3B0cyA9IHV0aWwuY29weShvcHRzKSB8fCB7fTtcclxuICBzZXRMb2dnZXIodGhpcyk7XHJcbiAgdGhpcy5fc2NoZW1hcyA9IHt9O1xyXG4gIHRoaXMuX3JlZnMgPSB7fTtcclxuICB0aGlzLl9mcmFnbWVudHMgPSB7fTtcclxuICB0aGlzLl9mb3JtYXRzID0gZm9ybWF0cyhvcHRzLmZvcm1hdCk7XHJcblxyXG4gIHRoaXMuX2NhY2hlID0gb3B0cy5jYWNoZSB8fCBuZXcgQ2FjaGU7XHJcbiAgdGhpcy5fbG9hZGluZ1NjaGVtYXMgPSB7fTtcclxuICB0aGlzLl9jb21waWxhdGlvbnMgPSBbXTtcclxuICB0aGlzLlJVTEVTID0gcnVsZXMoKTtcclxuICB0aGlzLl9nZXRJZCA9IGNob29zZUdldElkKG9wdHMpO1xyXG5cclxuICBvcHRzLmxvb3BSZXF1aXJlZCA9IG9wdHMubG9vcFJlcXVpcmVkIHx8IEluZmluaXR5O1xyXG4gIGlmIChvcHRzLmVycm9yRGF0YVBhdGggPT0gJ3Byb3BlcnR5Jykgb3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5ID0gdHJ1ZTtcclxuICBpZiAob3B0cy5zZXJpYWxpemUgPT09IHVuZGVmaW5lZCkgb3B0cy5zZXJpYWxpemUgPSBzdGFibGVTdHJpbmdpZnk7XHJcbiAgdGhpcy5fbWV0YU9wdHMgPSBnZXRNZXRhU2NoZW1hT3B0aW9ucyh0aGlzKTtcclxuXHJcbiAgaWYgKG9wdHMuZm9ybWF0cykgYWRkSW5pdGlhbEZvcm1hdHModGhpcyk7XHJcbiAgYWRkRGVmYXVsdE1ldGFTY2hlbWEodGhpcyk7XHJcbiAgaWYgKHR5cGVvZiBvcHRzLm1ldGEgPT0gJ29iamVjdCcpIHRoaXMuYWRkTWV0YVNjaGVtYShvcHRzLm1ldGEpO1xyXG4gIGlmIChvcHRzLm51bGxhYmxlKSB0aGlzLmFkZEtleXdvcmQoJ251bGxhYmxlJywge21ldGFTY2hlbWE6IHtjb25zdDogdHJ1ZX19KTtcclxuICBhZGRJbml0aWFsU2NoZW1hcyh0aGlzKTtcclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogVmFsaWRhdGUgZGF0YSB1c2luZyBzY2hlbWFcclxuICogU2NoZW1hIHdpbGwgYmUgY29tcGlsZWQgYW5kIGNhY2hlZCAodXNpbmcgc2VyaWFsaXplZCBKU09OIGFzIGtleS4gW2Zhc3QtanNvbi1zdGFibGUtc3RyaW5naWZ5XShodHRwczovL2dpdGh1Yi5jb20vZXBvYmVyZXpraW4vZmFzdC1qc29uLXN0YWJsZS1zdHJpbmdpZnkpIGlzIHVzZWQgdG8gc2VyaWFsaXplLlxyXG4gKiBAdGhpcyAgIEFqdlxyXG4gKiBAcGFyYW0gIHtTdHJpbmd8T2JqZWN0fSBzY2hlbWFLZXlSZWYga2V5LCByZWYgb3Igc2NoZW1hIG9iamVjdFxyXG4gKiBAcGFyYW0gIHtBbnl9IGRhdGEgdG8gYmUgdmFsaWRhdGVkXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHZhbGlkYXRpb24gcmVzdWx0LiBFcnJvcnMgZnJvbSB0aGUgbGFzdCB2YWxpZGF0aW9uIHdpbGwgYmUgYXZhaWxhYmxlIGluIGBhanYuZXJyb3JzYCAoYW5kIGFsc28gaW4gY29tcGlsZWQgc2NoZW1hOiBgc2NoZW1hLmVycm9yc2ApLlxyXG4gKi9cclxuZnVuY3Rpb24gdmFsaWRhdGUoc2NoZW1hS2V5UmVmLCBkYXRhKSB7XHJcbiAgdmFyIHY7XHJcbiAgaWYgKHR5cGVvZiBzY2hlbWFLZXlSZWYgPT0gJ3N0cmluZycpIHtcclxuICAgIHYgPSB0aGlzLmdldFNjaGVtYShzY2hlbWFLZXlSZWYpO1xyXG4gICAgaWYgKCF2KSB0aHJvdyBuZXcgRXJyb3IoJ25vIHNjaGVtYSB3aXRoIGtleSBvciByZWYgXCInICsgc2NoZW1hS2V5UmVmICsgJ1wiJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBzY2hlbWFPYmogPSB0aGlzLl9hZGRTY2hlbWEoc2NoZW1hS2V5UmVmKTtcclxuICAgIHYgPSBzY2hlbWFPYmoudmFsaWRhdGUgfHwgdGhpcy5fY29tcGlsZShzY2hlbWFPYmopO1xyXG4gIH1cclxuXHJcbiAgdmFyIHZhbGlkID0gdihkYXRhKTtcclxuICBpZiAodi4kYXN5bmMgIT09IHRydWUpIHRoaXMuZXJyb3JzID0gdi5lcnJvcnM7XHJcbiAgcmV0dXJuIHZhbGlkO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSB2YWxpZGF0aW5nIGZ1bmN0aW9uIGZvciBwYXNzZWQgc2NoZW1hLlxyXG4gKiBAdGhpcyAgIEFqdlxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgb2JqZWN0XHJcbiAqIEBwYXJhbSAge0Jvb2xlYW59IF9tZXRhIHRydWUgaWYgc2NoZW1hIGlzIGEgbWV0YS1zY2hlbWEuIFVzZWQgaW50ZXJuYWxseSB0byBjb21waWxlIG1ldGEgc2NoZW1hcyBvZiBjdXN0b20ga2V5d29yZHMuXHJcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB2YWxpZGF0aW5nIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBjb21waWxlKHNjaGVtYSwgX21ldGEpIHtcclxuICB2YXIgc2NoZW1hT2JqID0gdGhpcy5fYWRkU2NoZW1hKHNjaGVtYSwgdW5kZWZpbmVkLCBfbWV0YSk7XHJcbiAgcmV0dXJuIHNjaGVtYU9iai52YWxpZGF0ZSB8fCB0aGlzLl9jb21waWxlKHNjaGVtYU9iaik7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQWRkcyBzY2hlbWEgdG8gdGhlIGluc3RhbmNlLlxyXG4gKiBAdGhpcyAgIEFqdlxyXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gc2NoZW1hIHNjaGVtYSBvciBhcnJheSBvZiBzY2hlbWFzLiBJZiBhcnJheSBpcyBwYXNzZWQsIGBrZXlgIGFuZCBvdGhlciBwYXJhbWV0ZXJzIHdpbGwgYmUgaWdub3JlZC5cclxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBPcHRpb25hbCBzY2hlbWEga2V5LiBDYW4gYmUgcGFzc2VkIHRvIGB2YWxpZGF0ZWAgbWV0aG9kIGluc3RlYWQgb2Ygc2NoZW1hIG9iamVjdCBvciBpZC9yZWYuIE9uZSBzY2hlbWEgcGVyIGluc3RhbmNlIGNhbiBoYXZlIGVtcHR5IGBpZGAgYW5kIGBrZXlgLlxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IF9za2lwVmFsaWRhdGlvbiB0cnVlIHRvIHNraXAgc2NoZW1hIHZhbGlkYXRpb24uIFVzZWQgaW50ZXJuYWxseSwgb3B0aW9uIHZhbGlkYXRlU2NoZW1hIHNob3VsZCBiZSB1c2VkIGluc3RlYWQuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gX21ldGEgdHJ1ZSBpZiBzY2hlbWEgaXMgYSBtZXRhLXNjaGVtYS4gVXNlZCBpbnRlcm5hbGx5LCBhZGRNZXRhU2NoZW1hIHNob3VsZCBiZSB1c2VkIGluc3RlYWQuXHJcbiAqIEByZXR1cm4ge0Fqdn0gdGhpcyBmb3IgbWV0aG9kIGNoYWluaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBhZGRTY2hlbWEoc2NoZW1hLCBrZXksIF9za2lwVmFsaWRhdGlvbiwgX21ldGEpIHtcclxuICBpZiAoQXJyYXkuaXNBcnJheShzY2hlbWEpKXtcclxuICAgIGZvciAodmFyIGk9MDsgaTxzY2hlbWEubGVuZ3RoOyBpKyspIHRoaXMuYWRkU2NoZW1hKHNjaGVtYVtpXSwgdW5kZWZpbmVkLCBfc2tpcFZhbGlkYXRpb24sIF9tZXRhKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICB2YXIgaWQgPSB0aGlzLl9nZXRJZChzY2hlbWEpO1xyXG4gIGlmIChpZCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBpZCAhPSAnc3RyaW5nJylcclxuICAgIHRocm93IG5ldyBFcnJvcignc2NoZW1hIGlkIG11c3QgYmUgc3RyaW5nJyk7XHJcbiAga2V5ID0gcmVzb2x2ZS5ub3JtYWxpemVJZChrZXkgfHwgaWQpO1xyXG4gIGNoZWNrVW5pcXVlKHRoaXMsIGtleSk7XHJcbiAgdGhpcy5fc2NoZW1hc1trZXldID0gdGhpcy5fYWRkU2NoZW1hKHNjaGVtYSwgX3NraXBWYWxpZGF0aW9uLCBfbWV0YSwgdHJ1ZSk7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQWRkIHNjaGVtYSB0aGF0IHdpbGwgYmUgdXNlZCB0byB2YWxpZGF0ZSBvdGhlciBzY2hlbWFzXHJcbiAqIG9wdGlvbnMgaW4gTUVUQV9JR05PUkVfT1BUSU9OUyBhcmUgYWx3YXkgc2V0IHRvIGZhbHNlXHJcbiAqIEB0aGlzICAgQWp2XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgc2NoZW1hIG9iamVjdFxyXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IG9wdGlvbmFsIHNjaGVtYSBrZXlcclxuICogQHBhcmFtIHtCb29sZWFufSBza2lwVmFsaWRhdGlvbiB0cnVlIHRvIHNraXAgc2NoZW1hIHZhbGlkYXRpb24sIGNhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIHZhbGlkYXRlU2NoZW1hIG9wdGlvbiBmb3IgbWV0YS1zY2hlbWFcclxuICogQHJldHVybiB7QWp2fSB0aGlzIGZvciBtZXRob2QgY2hhaW5pbmdcclxuICovXHJcbmZ1bmN0aW9uIGFkZE1ldGFTY2hlbWEoc2NoZW1hLCBrZXksIHNraXBWYWxpZGF0aW9uKSB7XHJcbiAgdGhpcy5hZGRTY2hlbWEoc2NoZW1hLCBrZXksIHNraXBWYWxpZGF0aW9uLCB0cnVlKTtcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSBzY2hlbWFcclxuICogQHRoaXMgICBBanZcclxuICogQHBhcmFtIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgdG8gdmFsaWRhdGVcclxuICogQHBhcmFtIHtCb29sZWFufSB0aHJvd09yTG9nRXJyb3IgcGFzcyB0cnVlIHRvIHRocm93IChvciBsb2cpIGFuIGVycm9yIGlmIGludmFsaWRcclxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBzY2hlbWEgaXMgdmFsaWRcclxuICovXHJcbmZ1bmN0aW9uIHZhbGlkYXRlU2NoZW1hKHNjaGVtYSwgdGhyb3dPckxvZ0Vycm9yKSB7XHJcbiAgdmFyICRzY2hlbWEgPSBzY2hlbWEuJHNjaGVtYTtcclxuICBpZiAoJHNjaGVtYSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiAkc2NoZW1hICE9ICdzdHJpbmcnKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCckc2NoZW1hIG11c3QgYmUgYSBzdHJpbmcnKTtcclxuICAkc2NoZW1hID0gJHNjaGVtYSB8fCB0aGlzLl9vcHRzLmRlZmF1bHRNZXRhIHx8IGRlZmF1bHRNZXRhKHRoaXMpO1xyXG4gIGlmICghJHNjaGVtYSkge1xyXG4gICAgdGhpcy5sb2dnZXIud2FybignbWV0YS1zY2hlbWEgbm90IGF2YWlsYWJsZScpO1xyXG4gICAgdGhpcy5lcnJvcnMgPSBudWxsO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHZhciB2YWxpZCA9IHRoaXMudmFsaWRhdGUoJHNjaGVtYSwgc2NoZW1hKTtcclxuICBpZiAoIXZhbGlkICYmIHRocm93T3JMb2dFcnJvcikge1xyXG4gICAgdmFyIG1lc3NhZ2UgPSAnc2NoZW1hIGlzIGludmFsaWQ6ICcgKyB0aGlzLmVycm9yc1RleHQoKTtcclxuICAgIGlmICh0aGlzLl9vcHRzLnZhbGlkYXRlU2NoZW1hID09ICdsb2cnKSB0aGlzLmxvZ2dlci5lcnJvcihtZXNzYWdlKTtcclxuICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xyXG4gIH1cclxuICByZXR1cm4gdmFsaWQ7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0TWV0YShzZWxmKSB7XHJcbiAgdmFyIG1ldGEgPSBzZWxmLl9vcHRzLm1ldGE7XHJcbiAgc2VsZi5fb3B0cy5kZWZhdWx0TWV0YSA9IHR5cGVvZiBtZXRhID09ICdvYmplY3QnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHNlbGYuX2dldElkKG1ldGEpIHx8IG1ldGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc2VsZi5nZXRTY2hlbWEoTUVUQV9TQ0hFTUFfSUQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gTUVUQV9TQ0hFTUFfSURcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgcmV0dXJuIHNlbGYuX29wdHMuZGVmYXVsdE1ldGE7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogR2V0IGNvbXBpbGVkIHNjaGVtYSBmcm9tIHRoZSBpbnN0YW5jZSBieSBga2V5YCBvciBgcmVmYC5cclxuICogQHRoaXMgICBBanZcclxuICogQHBhcmFtICB7U3RyaW5nfSBrZXlSZWYgYGtleWAgdGhhdCB3YXMgcGFzc2VkIHRvIGBhZGRTY2hlbWFgIG9yIGZ1bGwgc2NoZW1hIHJlZmVyZW5jZSAoYHNjaGVtYS5pZGAgb3IgcmVzb2x2ZWQgaWQpLlxyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gc2NoZW1hIHZhbGlkYXRpbmcgZnVuY3Rpb24gKHdpdGggcHJvcGVydHkgYHNjaGVtYWApLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0U2NoZW1hKGtleVJlZikge1xyXG4gIHZhciBzY2hlbWFPYmogPSBfZ2V0U2NoZW1hT2JqKHRoaXMsIGtleVJlZik7XHJcbiAgc3dpdGNoICh0eXBlb2Ygc2NoZW1hT2JqKSB7XHJcbiAgICBjYXNlICdvYmplY3QnOiByZXR1cm4gc2NoZW1hT2JqLnZhbGlkYXRlIHx8IHRoaXMuX2NvbXBpbGUoc2NoZW1hT2JqKTtcclxuICAgIGNhc2UgJ3N0cmluZyc6IHJldHVybiB0aGlzLmdldFNjaGVtYShzY2hlbWFPYmopO1xyXG4gICAgY2FzZSAndW5kZWZpbmVkJzogcmV0dXJuIF9nZXRTY2hlbWFGcmFnbWVudCh0aGlzLCBrZXlSZWYpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIF9nZXRTY2hlbWFGcmFnbWVudChzZWxmLCByZWYpIHtcclxuICB2YXIgcmVzID0gcmVzb2x2ZS5zY2hlbWEuY2FsbChzZWxmLCB7IHNjaGVtYToge30gfSwgcmVmKTtcclxuICBpZiAocmVzKSB7XHJcbiAgICB2YXIgc2NoZW1hID0gcmVzLnNjaGVtYVxyXG4gICAgICAsIHJvb3QgPSByZXMucm9vdFxyXG4gICAgICAsIGJhc2VJZCA9IHJlcy5iYXNlSWQ7XHJcbiAgICB2YXIgdiA9IGNvbXBpbGVTY2hlbWEuY2FsbChzZWxmLCBzY2hlbWEsIHJvb3QsIHVuZGVmaW5lZCwgYmFzZUlkKTtcclxuICAgIHNlbGYuX2ZyYWdtZW50c1tyZWZdID0gbmV3IFNjaGVtYU9iamVjdCh7XHJcbiAgICAgIHJlZjogcmVmLFxyXG4gICAgICBmcmFnbWVudDogdHJ1ZSxcclxuICAgICAgc2NoZW1hOiBzY2hlbWEsXHJcbiAgICAgIHJvb3Q6IHJvb3QsXHJcbiAgICAgIGJhc2VJZDogYmFzZUlkLFxyXG4gICAgICB2YWxpZGF0ZTogdlxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdjtcclxuICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBfZ2V0U2NoZW1hT2JqKHNlbGYsIGtleVJlZikge1xyXG4gIGtleVJlZiA9IHJlc29sdmUubm9ybWFsaXplSWQoa2V5UmVmKTtcclxuICByZXR1cm4gc2VsZi5fc2NoZW1hc1trZXlSZWZdIHx8IHNlbGYuX3JlZnNba2V5UmVmXSB8fCBzZWxmLl9mcmFnbWVudHNba2V5UmVmXTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgY2FjaGVkIHNjaGVtYShzKS5cclxuICogSWYgbm8gcGFyYW1ldGVyIGlzIHBhc3NlZCBhbGwgc2NoZW1hcyBidXQgbWV0YS1zY2hlbWFzIGFyZSByZW1vdmVkLlxyXG4gKiBJZiBSZWdFeHAgaXMgcGFzc2VkIGFsbCBzY2hlbWFzIHdpdGgga2V5L2lkIG1hdGNoaW5nIHBhdHRlcm4gYnV0IG1ldGEtc2NoZW1hcyBhcmUgcmVtb3ZlZC5cclxuICogRXZlbiBpZiBzY2hlbWEgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBzY2hlbWFzIGl0IHN0aWxsIGNhbiBiZSByZW1vdmVkIGFzIG90aGVyIHNjaGVtYXMgaGF2ZSBsb2NhbCByZWZlcmVuY2VzLlxyXG4gKiBAdGhpcyAgIEFqdlxyXG4gKiBAcGFyYW0gIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gc2NoZW1hS2V5UmVmIGtleSwgcmVmLCBwYXR0ZXJuIHRvIG1hdGNoIGtleS9yZWYgb3Igc2NoZW1hIG9iamVjdFxyXG4gKiBAcmV0dXJuIHtBanZ9IHRoaXMgZm9yIG1ldGhvZCBjaGFpbmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gcmVtb3ZlU2NoZW1hKHNjaGVtYUtleVJlZikge1xyXG4gIGlmIChzY2hlbWFLZXlSZWYgaW5zdGFuY2VvZiBSZWdFeHApIHtcclxuICAgIF9yZW1vdmVBbGxTY2hlbWFzKHRoaXMsIHRoaXMuX3NjaGVtYXMsIHNjaGVtYUtleVJlZik7XHJcbiAgICBfcmVtb3ZlQWxsU2NoZW1hcyh0aGlzLCB0aGlzLl9yZWZzLCBzY2hlbWFLZXlSZWYpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIHN3aXRjaCAodHlwZW9mIHNjaGVtYUtleVJlZikge1xyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgICAgX3JlbW92ZUFsbFNjaGVtYXModGhpcywgdGhpcy5fc2NoZW1hcyk7XHJcbiAgICAgIF9yZW1vdmVBbGxTY2hlbWFzKHRoaXMsIHRoaXMuX3JlZnMpO1xyXG4gICAgICB0aGlzLl9jYWNoZS5jbGVhcigpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIHZhciBzY2hlbWFPYmogPSBfZ2V0U2NoZW1hT2JqKHRoaXMsIHNjaGVtYUtleVJlZik7XHJcbiAgICAgIGlmIChzY2hlbWFPYmopIHRoaXMuX2NhY2hlLmRlbChzY2hlbWFPYmouY2FjaGVLZXkpO1xyXG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hc1tzY2hlbWFLZXlSZWZdO1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVmc1tzY2hlbWFLZXlSZWZdO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIHZhciBzZXJpYWxpemUgPSB0aGlzLl9vcHRzLnNlcmlhbGl6ZTtcclxuICAgICAgdmFyIGNhY2hlS2V5ID0gc2VyaWFsaXplID8gc2VyaWFsaXplKHNjaGVtYUtleVJlZikgOiBzY2hlbWFLZXlSZWY7XHJcbiAgICAgIHRoaXMuX2NhY2hlLmRlbChjYWNoZUtleSk7XHJcbiAgICAgIHZhciBpZCA9IHRoaXMuX2dldElkKHNjaGVtYUtleVJlZik7XHJcbiAgICAgIGlmIChpZCkge1xyXG4gICAgICAgIGlkID0gcmVzb2x2ZS5ub3JtYWxpemVJZChpZCk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NjaGVtYXNbaWRdO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZWZzW2lkXTtcclxuICAgICAgfVxyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIF9yZW1vdmVBbGxTY2hlbWFzKHNlbGYsIHNjaGVtYXMsIHJlZ2V4KSB7XHJcbiAgZm9yICh2YXIga2V5UmVmIGluIHNjaGVtYXMpIHtcclxuICAgIHZhciBzY2hlbWFPYmogPSBzY2hlbWFzW2tleVJlZl07XHJcbiAgICBpZiAoIXNjaGVtYU9iai5tZXRhICYmICghcmVnZXggfHwgcmVnZXgudGVzdChrZXlSZWYpKSkge1xyXG4gICAgICBzZWxmLl9jYWNoZS5kZWwoc2NoZW1hT2JqLmNhY2hlS2V5KTtcclxuICAgICAgZGVsZXRlIHNjaGVtYXNba2V5UmVmXTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG4vKiBAdGhpcyAgIEFqdiAqL1xyXG5mdW5jdGlvbiBfYWRkU2NoZW1hKHNjaGVtYSwgc2tpcFZhbGlkYXRpb24sIG1ldGEsIHNob3VsZEFkZFNjaGVtYSkge1xyXG4gIGlmICh0eXBlb2Ygc2NoZW1hICE9ICdvYmplY3QnICYmIHR5cGVvZiBzY2hlbWEgIT0gJ2Jvb2xlYW4nKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdzY2hlbWEgc2hvdWxkIGJlIG9iamVjdCBvciBib29sZWFuJyk7XHJcbiAgdmFyIHNlcmlhbGl6ZSA9IHRoaXMuX29wdHMuc2VyaWFsaXplO1xyXG4gIHZhciBjYWNoZUtleSA9IHNlcmlhbGl6ZSA/IHNlcmlhbGl6ZShzY2hlbWEpIDogc2NoZW1hO1xyXG4gIHZhciBjYWNoZWQgPSB0aGlzLl9jYWNoZS5nZXQoY2FjaGVLZXkpO1xyXG4gIGlmIChjYWNoZWQpIHJldHVybiBjYWNoZWQ7XHJcblxyXG4gIHNob3VsZEFkZFNjaGVtYSA9IHNob3VsZEFkZFNjaGVtYSB8fCB0aGlzLl9vcHRzLmFkZFVzZWRTY2hlbWEgIT09IGZhbHNlO1xyXG5cclxuICB2YXIgaWQgPSByZXNvbHZlLm5vcm1hbGl6ZUlkKHRoaXMuX2dldElkKHNjaGVtYSkpO1xyXG4gIGlmIChpZCAmJiBzaG91bGRBZGRTY2hlbWEpIGNoZWNrVW5pcXVlKHRoaXMsIGlkKTtcclxuXHJcbiAgdmFyIHdpbGxWYWxpZGF0ZSA9IHRoaXMuX29wdHMudmFsaWRhdGVTY2hlbWEgIT09IGZhbHNlICYmICFza2lwVmFsaWRhdGlvbjtcclxuICB2YXIgcmVjdXJzaXZlTWV0YTtcclxuICBpZiAod2lsbFZhbGlkYXRlICYmICEocmVjdXJzaXZlTWV0YSA9IGlkICYmIGlkID09IHJlc29sdmUubm9ybWFsaXplSWQoc2NoZW1hLiRzY2hlbWEpKSlcclxuICAgIHRoaXMudmFsaWRhdGVTY2hlbWEoc2NoZW1hLCB0cnVlKTtcclxuXHJcbiAgdmFyIGxvY2FsUmVmcyA9IHJlc29sdmUuaWRzLmNhbGwodGhpcywgc2NoZW1hKTtcclxuXHJcbiAgdmFyIHNjaGVtYU9iaiA9IG5ldyBTY2hlbWFPYmplY3Qoe1xyXG4gICAgaWQ6IGlkLFxyXG4gICAgc2NoZW1hOiBzY2hlbWEsXHJcbiAgICBsb2NhbFJlZnM6IGxvY2FsUmVmcyxcclxuICAgIGNhY2hlS2V5OiBjYWNoZUtleSxcclxuICAgIG1ldGE6IG1ldGFcclxuICB9KTtcclxuXHJcbiAgaWYgKGlkWzBdICE9ICcjJyAmJiBzaG91bGRBZGRTY2hlbWEpIHRoaXMuX3JlZnNbaWRdID0gc2NoZW1hT2JqO1xyXG4gIHRoaXMuX2NhY2hlLnB1dChjYWNoZUtleSwgc2NoZW1hT2JqKTtcclxuXHJcbiAgaWYgKHdpbGxWYWxpZGF0ZSAmJiByZWN1cnNpdmVNZXRhKSB0aGlzLnZhbGlkYXRlU2NoZW1hKHNjaGVtYSwgdHJ1ZSk7XHJcblxyXG4gIHJldHVybiBzY2hlbWFPYmo7XHJcbn1cclxuXHJcblxyXG4vKiBAdGhpcyAgIEFqdiAqL1xyXG5mdW5jdGlvbiBfY29tcGlsZShzY2hlbWFPYmosIHJvb3QpIHtcclxuICBpZiAoc2NoZW1hT2JqLmNvbXBpbGluZykge1xyXG4gICAgc2NoZW1hT2JqLnZhbGlkYXRlID0gY2FsbFZhbGlkYXRlO1xyXG4gICAgY2FsbFZhbGlkYXRlLnNjaGVtYSA9IHNjaGVtYU9iai5zY2hlbWE7XHJcbiAgICBjYWxsVmFsaWRhdGUuZXJyb3JzID0gbnVsbDtcclxuICAgIGNhbGxWYWxpZGF0ZS5yb290ID0gcm9vdCA/IHJvb3QgOiBjYWxsVmFsaWRhdGU7XHJcbiAgICBpZiAoc2NoZW1hT2JqLnNjaGVtYS4kYXN5bmMgPT09IHRydWUpXHJcbiAgICAgIGNhbGxWYWxpZGF0ZS4kYXN5bmMgPSB0cnVlO1xyXG4gICAgcmV0dXJuIGNhbGxWYWxpZGF0ZTtcclxuICB9XHJcbiAgc2NoZW1hT2JqLmNvbXBpbGluZyA9IHRydWU7XHJcblxyXG4gIHZhciBjdXJyZW50T3B0cztcclxuICBpZiAoc2NoZW1hT2JqLm1ldGEpIHtcclxuICAgIGN1cnJlbnRPcHRzID0gdGhpcy5fb3B0cztcclxuICAgIHRoaXMuX29wdHMgPSB0aGlzLl9tZXRhT3B0cztcclxuICB9XHJcblxyXG4gIHZhciB2O1xyXG4gIHRyeSB7IHYgPSBjb21waWxlU2NoZW1hLmNhbGwodGhpcywgc2NoZW1hT2JqLnNjaGVtYSwgcm9vdCwgc2NoZW1hT2JqLmxvY2FsUmVmcyk7IH1cclxuICBjYXRjaChlKSB7XHJcbiAgICBkZWxldGUgc2NoZW1hT2JqLnZhbGlkYXRlO1xyXG4gICAgdGhyb3cgZTtcclxuICB9XHJcbiAgZmluYWxseSB7XHJcbiAgICBzY2hlbWFPYmouY29tcGlsaW5nID0gZmFsc2U7XHJcbiAgICBpZiAoc2NoZW1hT2JqLm1ldGEpIHRoaXMuX29wdHMgPSBjdXJyZW50T3B0cztcclxuICB9XHJcblxyXG4gIHNjaGVtYU9iai52YWxpZGF0ZSA9IHY7XHJcbiAgc2NoZW1hT2JqLnJlZnMgPSB2LnJlZnM7XHJcbiAgc2NoZW1hT2JqLnJlZlZhbCA9IHYucmVmVmFsO1xyXG4gIHNjaGVtYU9iai5yb290ID0gdi5yb290O1xyXG4gIHJldHVybiB2O1xyXG5cclxuXHJcbiAgLyogQHRoaXMgICB7Kn0gLSBjdXN0b20gY29udGV4dCwgc2VlIHBhc3NDb250ZXh0IG9wdGlvbiAqL1xyXG4gIGZ1bmN0aW9uIGNhbGxWYWxpZGF0ZSgpIHtcclxuICAgIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cclxuICAgIHZhciBfdmFsaWRhdGUgPSBzY2hlbWFPYmoudmFsaWRhdGU7XHJcbiAgICB2YXIgcmVzdWx0ID0gX3ZhbGlkYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICBjYWxsVmFsaWRhdGUuZXJyb3JzID0gX3ZhbGlkYXRlLmVycm9ycztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY2hvb3NlR2V0SWQob3B0cykge1xyXG4gIHN3aXRjaCAob3B0cy5zY2hlbWFJZCkge1xyXG4gICAgY2FzZSAnYXV0byc6IHJldHVybiBfZ2V0JElkT3JJZDtcclxuICAgIGNhc2UgJ2lkJzogcmV0dXJuIF9nZXRJZDtcclxuICAgIGRlZmF1bHQ6IHJldHVybiBfZ2V0JElkO1xyXG4gIH1cclxufVxyXG5cclxuLyogQHRoaXMgICBBanYgKi9cclxuZnVuY3Rpb24gX2dldElkKHNjaGVtYSkge1xyXG4gIGlmIChzY2hlbWEuJGlkKSB0aGlzLmxvZ2dlci53YXJuKCdzY2hlbWEgJGlkIGlnbm9yZWQnLCBzY2hlbWEuJGlkKTtcclxuICByZXR1cm4gc2NoZW1hLmlkO1xyXG59XHJcblxyXG4vKiBAdGhpcyAgIEFqdiAqL1xyXG5mdW5jdGlvbiBfZ2V0JElkKHNjaGVtYSkge1xyXG4gIGlmIChzY2hlbWEuaWQpIHRoaXMubG9nZ2VyLndhcm4oJ3NjaGVtYSBpZCBpZ25vcmVkJywgc2NoZW1hLmlkKTtcclxuICByZXR1cm4gc2NoZW1hLiRpZDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIF9nZXQkSWRPcklkKHNjaGVtYSkge1xyXG4gIGlmIChzY2hlbWEuJGlkICYmIHNjaGVtYS5pZCAmJiBzY2hlbWEuJGlkICE9IHNjaGVtYS5pZClcclxuICAgIHRocm93IG5ldyBFcnJvcignc2NoZW1hICRpZCBpcyBkaWZmZXJlbnQgZnJvbSBpZCcpO1xyXG4gIHJldHVybiBzY2hlbWEuJGlkIHx8IHNjaGVtYS5pZDtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0IGFycmF5IG9mIGVycm9yIG1lc3NhZ2Ugb2JqZWN0cyB0byBzdHJpbmdcclxuICogQHRoaXMgICBBanZcclxuICogQHBhcmFtICB7QXJyYXk8T2JqZWN0Pn0gZXJyb3JzIG9wdGlvbmFsIGFycmF5IG9mIHZhbGlkYXRpb24gZXJyb3JzLCBpZiBub3QgcGFzc2VkIGVycm9ycyBmcm9tIHRoZSBpbnN0YW5jZSBhcmUgdXNlZC5cclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIG9wdGlvbmFsIG9wdGlvbnMgd2l0aCBwcm9wZXJ0aWVzIGBzZXBhcmF0b3JgIGFuZCBgZGF0YVZhcmAuXHJcbiAqIEByZXR1cm4ge1N0cmluZ30gaHVtYW4gcmVhZGFibGUgc3RyaW5nIHdpdGggYWxsIGVycm9ycyBkZXNjcmlwdGlvbnNcclxuICovXHJcbmZ1bmN0aW9uIGVycm9yc1RleHQoZXJyb3JzLCBvcHRpb25zKSB7XHJcbiAgZXJyb3JzID0gZXJyb3JzIHx8IHRoaXMuZXJyb3JzO1xyXG4gIGlmICghZXJyb3JzKSByZXR1cm4gJ05vIGVycm9ycyc7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgdmFyIHNlcGFyYXRvciA9IG9wdGlvbnMuc2VwYXJhdG9yID09PSB1bmRlZmluZWQgPyAnLCAnIDogb3B0aW9ucy5zZXBhcmF0b3I7XHJcbiAgdmFyIGRhdGFWYXIgPSBvcHRpb25zLmRhdGFWYXIgPT09IHVuZGVmaW5lZCA/ICdkYXRhJyA6IG9wdGlvbnMuZGF0YVZhcjtcclxuXHJcbiAgdmFyIHRleHQgPSAnJztcclxuICBmb3IgKHZhciBpPTA7IGk8ZXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgZSA9IGVycm9yc1tpXTtcclxuICAgIGlmIChlKSB0ZXh0ICs9IGRhdGFWYXIgKyBlLmRhdGFQYXRoICsgJyAnICsgZS5tZXNzYWdlICsgc2VwYXJhdG9yO1xyXG4gIH1cclxuICByZXR1cm4gdGV4dC5zbGljZSgwLCAtc2VwYXJhdG9yLmxlbmd0aCk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQWRkIGN1c3RvbSBmb3JtYXRcclxuICogQHRoaXMgICBBanZcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgZm9ybWF0IG5hbWVcclxuICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfEZ1bmN0aW9ufSBmb3JtYXQgc3RyaW5nIGlzIGNvbnZlcnRlZCB0byBSZWdFeHA7IGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gYm9vbGVhbiAodHJ1ZSB3aGVuIHZhbGlkKVxyXG4gKiBAcmV0dXJuIHtBanZ9IHRoaXMgZm9yIG1ldGhvZCBjaGFpbmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gYWRkRm9ybWF0KG5hbWUsIGZvcm1hdCkge1xyXG4gIGlmICh0eXBlb2YgZm9ybWF0ID09ICdzdHJpbmcnKSBmb3JtYXQgPSBuZXcgUmVnRXhwKGZvcm1hdCk7XHJcbiAgdGhpcy5fZm9ybWF0c1tuYW1lXSA9IGZvcm1hdDtcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZERlZmF1bHRNZXRhU2NoZW1hKHNlbGYpIHtcclxuICB2YXIgJGRhdGFTY2hlbWE7XHJcbiAgaWYgKHNlbGYuX29wdHMuJGRhdGEpIHtcclxuICAgICRkYXRhU2NoZW1hID0gcmVxdWlyZSgnLi9yZWZzL2RhdGEuanNvbicpO1xyXG4gICAgc2VsZi5hZGRNZXRhU2NoZW1hKCRkYXRhU2NoZW1hLCAkZGF0YVNjaGVtYS4kaWQsIHRydWUpO1xyXG4gIH1cclxuICBpZiAoc2VsZi5fb3B0cy5tZXRhID09PSBmYWxzZSkgcmV0dXJuO1xyXG4gIHZhciBtZXRhU2NoZW1hID0gcmVxdWlyZSgnLi9yZWZzL2pzb24tc2NoZW1hLWRyYWZ0LTA3Lmpzb24nKTtcclxuICBpZiAoc2VsZi5fb3B0cy4kZGF0YSkgbWV0YVNjaGVtYSA9ICRkYXRhTWV0YVNjaGVtYShtZXRhU2NoZW1hLCBNRVRBX1NVUFBPUlRfREFUQSk7XHJcbiAgc2VsZi5hZGRNZXRhU2NoZW1hKG1ldGFTY2hlbWEsIE1FVEFfU0NIRU1BX0lELCB0cnVlKTtcclxuICBzZWxmLl9yZWZzWydodHRwOi8vanNvbi1zY2hlbWEub3JnL3NjaGVtYSddID0gTUVUQV9TQ0hFTUFfSUQ7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBhZGRJbml0aWFsU2NoZW1hcyhzZWxmKSB7XHJcbiAgdmFyIG9wdHNTY2hlbWFzID0gc2VsZi5fb3B0cy5zY2hlbWFzO1xyXG4gIGlmICghb3B0c1NjaGVtYXMpIHJldHVybjtcclxuICBpZiAoQXJyYXkuaXNBcnJheShvcHRzU2NoZW1hcykpIHNlbGYuYWRkU2NoZW1hKG9wdHNTY2hlbWFzKTtcclxuICBlbHNlIGZvciAodmFyIGtleSBpbiBvcHRzU2NoZW1hcykgc2VsZi5hZGRTY2hlbWEob3B0c1NjaGVtYXNba2V5XSwga2V5KTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGFkZEluaXRpYWxGb3JtYXRzKHNlbGYpIHtcclxuICBmb3IgKHZhciBuYW1lIGluIHNlbGYuX29wdHMuZm9ybWF0cykge1xyXG4gICAgdmFyIGZvcm1hdCA9IHNlbGYuX29wdHMuZm9ybWF0c1tuYW1lXTtcclxuICAgIHNlbGYuYWRkRm9ybWF0KG5hbWUsIGZvcm1hdCk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY2hlY2tVbmlxdWUoc2VsZiwgaWQpIHtcclxuICBpZiAoc2VsZi5fc2NoZW1hc1tpZF0gfHwgc2VsZi5fcmVmc1tpZF0pXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NjaGVtYSB3aXRoIGtleSBvciBpZCBcIicgKyBpZCArICdcIiBhbHJlYWR5IGV4aXN0cycpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TWV0YVNjaGVtYU9wdGlvbnMoc2VsZikge1xyXG4gIHZhciBtZXRhT3B0cyA9IHV0aWwuY29weShzZWxmLl9vcHRzKTtcclxuICBmb3IgKHZhciBpPTA7IGk8TUVUQV9JR05PUkVfT1BUSU9OUy5sZW5ndGg7IGkrKylcclxuICAgIGRlbGV0ZSBtZXRhT3B0c1tNRVRBX0lHTk9SRV9PUFRJT05TW2ldXTtcclxuICByZXR1cm4gbWV0YU9wdHM7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBzZXRMb2dnZXIoc2VsZikge1xyXG4gIHZhciBsb2dnZXIgPSBzZWxmLl9vcHRzLmxvZ2dlcjtcclxuICBpZiAobG9nZ2VyID09PSBmYWxzZSkge1xyXG4gICAgc2VsZi5sb2dnZXIgPSB7bG9nOiBub29wLCB3YXJuOiBub29wLCBlcnJvcjogbm9vcH07XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmIChsb2dnZXIgPT09IHVuZGVmaW5lZCkgbG9nZ2VyID0gY29uc29sZTtcclxuICAgIGlmICghKHR5cGVvZiBsb2dnZXIgPT0gJ29iamVjdCcgJiYgbG9nZ2VyLmxvZyAmJiBsb2dnZXIud2FybiAmJiBsb2dnZXIuZXJyb3IpKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2xvZ2dlciBtdXN0IGltcGxlbWVudCBsb2csIHdhcm4gYW5kIGVycm9yIG1ldGhvZHMnKTtcclxuICAgIHNlbGYubG9nZ2VyID0gbG9nZ2VyO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIG5vb3AoKSB7fVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfaXRlbXMoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xyXG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgdmFyICR2YWxpZCA9ICd2YWxpZCcgKyAkbHZsO1xyXG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcclxuICB2YXIgJGl0ID0gaXQudXRpbC5jb3B5KGl0KTtcclxuICB2YXIgJGNsb3NpbmdCcmFjZXMgPSAnJztcclxuICAkaXQubGV2ZWwrKztcclxuICB2YXIgJG5leHRWYWxpZCA9ICd2YWxpZCcgKyAkaXQubGV2ZWw7XHJcbiAgdmFyICRpZHggPSAnaScgKyAkbHZsLFxyXG4gICAgJGRhdGFOeHQgPSAkaXQuZGF0YUxldmVsID0gaXQuZGF0YUxldmVsICsgMSxcclxuICAgICRuZXh0RGF0YSA9ICdkYXRhJyArICRkYXRhTnh0LFxyXG4gICAgJGN1cnJlbnRCYXNlSWQgPSBpdC5iYXNlSWQ7XHJcbiAgb3V0ICs9ICd2YXIgJyArICgkZXJycykgKyAnID0gZXJyb3JzO3ZhciAnICsgKCR2YWxpZCkgKyAnOyc7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoJHNjaGVtYSkpIHtcclxuICAgIHZhciAkYWRkaXRpb25hbEl0ZW1zID0gaXQuc2NoZW1hLmFkZGl0aW9uYWxJdGVtcztcclxuICAgIGlmICgkYWRkaXRpb25hbEl0ZW1zID09PSBmYWxzZSkge1xyXG4gICAgICBvdXQgKz0gJyAnICsgKCR2YWxpZCkgKyAnID0gJyArICgkZGF0YSkgKyAnLmxlbmd0aCA8PSAnICsgKCRzY2hlbWEubGVuZ3RoKSArICc7ICc7XHJcbiAgICAgIHZhciAkY3VyckVyclNjaGVtYVBhdGggPSAkZXJyU2NoZW1hUGF0aDtcclxuICAgICAgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy9hZGRpdGlvbmFsSXRlbXMnO1xyXG4gICAgICBvdXQgKz0gJyAgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgJztcclxuICAgICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdhZGRpdGlvbmFsSXRlbXMnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGxpbWl0OiAnICsgKCRzY2hlbWEubGVuZ3RoKSArICcgfSAnO1xyXG4gICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgTk9UIGhhdmUgbW9yZSB0aGFuICcgKyAoJHNjaGVtYS5sZW5ndGgpICsgJyBpdGVtc1xcJyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogZmFsc2UgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBfX2VyciA9IG91dDtcclxuICAgICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICAgICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgICAkZXJyU2NoZW1hUGF0aCA9ICRjdXJyRXJyU2NoZW1hUGF0aDtcclxuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAkY2xvc2luZ0JyYWNlcyArPSAnfSc7XHJcbiAgICAgICAgb3V0ICs9ICcgZWxzZSB7ICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBhcnIxID0gJHNjaGVtYTtcclxuICAgIGlmIChhcnIxKSB7XHJcbiAgICAgIHZhciAkc2NoLCAkaSA9IC0xLFxyXG4gICAgICAgIGwxID0gYXJyMS5sZW5ndGggLSAxO1xyXG4gICAgICB3aGlsZSAoJGkgPCBsMSkge1xyXG4gICAgICAgICRzY2ggPSBhcnIxWyRpICs9IDFdO1xyXG4gICAgICAgIGlmIChpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRzY2gsIGl0LlJVTEVTLmFsbCkpIHtcclxuICAgICAgICAgIG91dCArPSAnICcgKyAoJG5leHRWYWxpZCkgKyAnID0gdHJ1ZTsgaWYgKCcgKyAoJGRhdGEpICsgJy5sZW5ndGggPiAnICsgKCRpKSArICcpIHsgJztcclxuICAgICAgICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRpICsgJ10nO1xyXG4gICAgICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XHJcbiAgICAgICAgICAkaXQuc2NoZW1hUGF0aCA9ICRzY2hlbWFQYXRoICsgJ1snICsgJGkgKyAnXSc7XHJcbiAgICAgICAgICAkaXQuZXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoICsgJy8nICsgJGk7XHJcbiAgICAgICAgICAkaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoRXhwcihpdC5lcnJvclBhdGgsICRpLCBpdC5vcHRzLmpzb25Qb2ludGVycywgdHJ1ZSk7XHJcbiAgICAgICAgICAkaXQuZGF0YVBhdGhBcnJbJGRhdGFOeHRdID0gJGk7XHJcbiAgICAgICAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpO1xyXG4gICAgICAgICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xyXG4gICAgICAgICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgJyArIChpdC51dGlsLnZhclJlcGxhY2UoJGNvZGUsICRuZXh0RGF0YSwgJHBhc3NEYXRhKSkgKyAnICc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3V0ICs9ICcgfSAgJztcclxuICAgICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnO1xyXG4gICAgICAgICAgICAkY2xvc2luZ0JyYWNlcyArPSAnfSc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mICRhZGRpdGlvbmFsSXRlbXMgPT0gJ29iamVjdCcgJiYgaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkYWRkaXRpb25hbEl0ZW1zLCBpdC5SVUxFUy5hbGwpKSB7XHJcbiAgICAgICRpdC5zY2hlbWEgPSAkYWRkaXRpb25hbEl0ZW1zO1xyXG4gICAgICAkaXQuc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyAnLmFkZGl0aW9uYWxJdGVtcyc7XHJcbiAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvYWRkaXRpb25hbEl0ZW1zJztcclxuICAgICAgb3V0ICs9ICcgJyArICgkbmV4dFZhbGlkKSArICcgPSB0cnVlOyBpZiAoJyArICgkZGF0YSkgKyAnLmxlbmd0aCA+ICcgKyAoJHNjaGVtYS5sZW5ndGgpICsgJykgeyAgZm9yICh2YXIgJyArICgkaWR4KSArICcgPSAnICsgKCRzY2hlbWEubGVuZ3RoKSArICc7ICcgKyAoJGlkeCkgKyAnIDwgJyArICgkZGF0YSkgKyAnLmxlbmd0aDsgJyArICgkaWR4KSArICcrKykgeyAnO1xyXG4gICAgICAkaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoRXhwcihpdC5lcnJvclBhdGgsICRpZHgsIGl0Lm9wdHMuanNvblBvaW50ZXJzLCB0cnVlKTtcclxuICAgICAgdmFyICRwYXNzRGF0YSA9ICRkYXRhICsgJ1snICsgJGlkeCArICddJztcclxuICAgICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRpZHg7XHJcbiAgICAgIHZhciAkY29kZSA9IGl0LnZhbGlkYXRlKCRpdCk7XHJcbiAgICAgICRpdC5iYXNlSWQgPSAkY3VycmVudEJhc2VJZDtcclxuICAgICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcclxuICAgICAgICBvdXQgKz0gJyAnICsgKGl0LnV0aWwudmFyUmVwbGFjZSgkY29kZSwgJG5leHREYXRhLCAkcGFzc0RhdGEpKSArICcgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgaWYgKCEnICsgKCRuZXh0VmFsaWQpICsgJykgYnJlYWs7ICc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcgfSB9ICAnO1xyXG4gICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnO1xyXG4gICAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoZW1hLCBpdC5SVUxFUy5hbGwpKSB7XHJcbiAgICAkaXQuc2NoZW1hID0gJHNjaGVtYTtcclxuICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGg7XHJcbiAgICAkaXQuZXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoO1xyXG4gICAgb3V0ICs9ICcgIGZvciAodmFyICcgKyAoJGlkeCkgKyAnID0gJyArICgwKSArICc7ICcgKyAoJGlkeCkgKyAnIDwgJyArICgkZGF0YSkgKyAnLmxlbmd0aDsgJyArICgkaWR4KSArICcrKykgeyAnO1xyXG4gICAgJGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aEV4cHIoaXQuZXJyb3JQYXRoLCAkaWR4LCBpdC5vcHRzLmpzb25Qb2ludGVycywgdHJ1ZSk7XHJcbiAgICB2YXIgJHBhc3NEYXRhID0gJGRhdGEgKyAnWycgKyAkaWR4ICsgJ10nO1xyXG4gICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRpZHg7XHJcbiAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpO1xyXG4gICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xyXG4gICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcclxuICAgICAgb3V0ICs9ICcgJyArIChpdC51dGlsLnZhclJlcGxhY2UoJGNvZGUsICRuZXh0RGF0YSwgJHBhc3NEYXRhKSkgKyAnICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgb3V0ICs9ICcgaWYgKCEnICsgKCRuZXh0VmFsaWQpICsgJykgYnJlYWs7ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9JztcclxuICB9XHJcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgIG91dCArPSAnICcgKyAoJGNsb3NpbmdCcmFjZXMpICsgJyBpZiAoJyArICgkZXJycykgKyAnID09IGVycm9ycykgeyc7XHJcbiAgfVxyXG4gIG91dCA9IGl0LnV0aWwuY2xlYW5VcENvZGUob3V0KTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciByZXNvbHZlID0gcmVxdWlyZSgnLi9yZXNvbHZlJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBWYWxpZGF0aW9uOiBlcnJvclN1YmNsYXNzKFZhbGlkYXRpb25FcnJvciksXHJcbiAgTWlzc2luZ1JlZjogZXJyb3JTdWJjbGFzcyhNaXNzaW5nUmVmRXJyb3IpXHJcbn07XHJcblxyXG5cclxuZnVuY3Rpb24gVmFsaWRhdGlvbkVycm9yKGVycm9ycykge1xyXG4gIHRoaXMubWVzc2FnZSA9ICd2YWxpZGF0aW9uIGZhaWxlZCc7XHJcbiAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XHJcbiAgdGhpcy5hanYgPSB0aGlzLnZhbGlkYXRpb24gPSB0cnVlO1xyXG59XHJcblxyXG5cclxuTWlzc2luZ1JlZkVycm9yLm1lc3NhZ2UgPSBmdW5jdGlvbiAoYmFzZUlkLCByZWYpIHtcclxuICByZXR1cm4gJ2NhblxcJ3QgcmVzb2x2ZSByZWZlcmVuY2UgJyArIHJlZiArICcgZnJvbSBpZCAnICsgYmFzZUlkO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIE1pc3NpbmdSZWZFcnJvcihiYXNlSWQsIHJlZiwgbWVzc2FnZSkge1xyXG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgTWlzc2luZ1JlZkVycm9yLm1lc3NhZ2UoYmFzZUlkLCByZWYpO1xyXG4gIHRoaXMubWlzc2luZ1JlZiA9IHJlc29sdmUudXJsKGJhc2VJZCwgcmVmKTtcclxuICB0aGlzLm1pc3NpbmdTY2hlbWEgPSByZXNvbHZlLm5vcm1hbGl6ZUlkKHJlc29sdmUuZnVsbFBhdGgodGhpcy5taXNzaW5nUmVmKSk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBlcnJvclN1YmNsYXNzKFN1YmNsYXNzKSB7XHJcbiAgU3ViY2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xyXG4gIFN1YmNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YmNsYXNzO1xyXG4gIHJldHVybiBTdWJjbGFzcztcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgcmVzb2x2ZSA9IHJlcXVpcmUoJy4vcmVzb2x2ZScpXHJcbiAgLCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJylcclxuICAsIGVycm9yQ2xhc3NlcyA9IHJlcXVpcmUoJy4vZXJyb3JfY2xhc3NlcycpXHJcbiAgLCBzdGFibGVTdHJpbmdpZnkgPSByZXF1aXJlKCdmYXN0LWpzb24tc3RhYmxlLXN0cmluZ2lmeScpO1xyXG5cclxudmFyIHZhbGlkYXRlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi4vZG90anMvdmFsaWRhdGUnKTtcclxuXHJcbi8qKlxyXG4gKiBGdW5jdGlvbnMgYmVsb3cgYXJlIHVzZWQgaW5zaWRlIGNvbXBpbGVkIHZhbGlkYXRpb25zIGZ1bmN0aW9uXHJcbiAqL1xyXG5cclxudmFyIHVjczJsZW5ndGggPSB1dGlsLnVjczJsZW5ndGg7XHJcbnZhciBlcXVhbCA9IHJlcXVpcmUoJ2Zhc3QtZGVlcC1lcXVhbCcpO1xyXG5cclxuLy8gdGhpcyBlcnJvciBpcyB0aHJvd24gYnkgYXN5bmMgc2NoZW1hcyB0byByZXR1cm4gdmFsaWRhdGlvbiBlcnJvcnMgdmlhIGV4Y2VwdGlvblxyXG52YXIgVmFsaWRhdGlvbkVycm9yID0gZXJyb3JDbGFzc2VzLlZhbGlkYXRpb247XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGU7XHJcblxyXG5cclxuLyoqXHJcbiAqIENvbXBpbGVzIHNjaGVtYSB0byB2YWxpZGF0aW9uIGZ1bmN0aW9uXHJcbiAqIEB0aGlzICAgQWp2XHJcbiAqIEBwYXJhbSAge09iamVjdH0gc2NoZW1hIHNjaGVtYSBvYmplY3RcclxuICogQHBhcmFtICB7T2JqZWN0fSByb290IG9iamVjdCB3aXRoIGluZm9ybWF0aW9uIGFib3V0IHRoZSByb290IHNjaGVtYSBmb3IgdGhpcyBzY2hlbWFcclxuICogQHBhcmFtICB7T2JqZWN0fSBsb2NhbFJlZnMgdGhlIGhhc2ggb2YgbG9jYWwgcmVmZXJlbmNlcyBpbnNpZGUgdGhlIHNjaGVtYSAoY3JlYXRlZCBieSByZXNvbHZlLmlkKSwgdXNlZCBmb3IgaW5saW5lIHJlc29sdXRpb25cclxuICogQHBhcmFtICB7U3RyaW5nfSBiYXNlSWQgYmFzZSBJRCBmb3IgSURzIGluIHRoZSBzY2hlbWFcclxuICogQHJldHVybiB7RnVuY3Rpb259IHZhbGlkYXRpb24gZnVuY3Rpb25cclxuICovXHJcbmZ1bmN0aW9uIGNvbXBpbGUoc2NoZW1hLCByb290LCBsb2NhbFJlZnMsIGJhc2VJZCkge1xyXG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUsIGV2aWw6IHRydWUgKi9cclxuICAvKiBlc2xpbnQgbm8tc2hhZG93OiAwICovXHJcbiAgdmFyIHNlbGYgPSB0aGlzXHJcbiAgICAsIG9wdHMgPSB0aGlzLl9vcHRzXHJcbiAgICAsIHJlZlZhbCA9IFsgdW5kZWZpbmVkIF1cclxuICAgICwgcmVmcyA9IHt9XHJcbiAgICAsIHBhdHRlcm5zID0gW11cclxuICAgICwgcGF0dGVybnNIYXNoID0ge31cclxuICAgICwgZGVmYXVsdHMgPSBbXVxyXG4gICAgLCBkZWZhdWx0c0hhc2ggPSB7fVxyXG4gICAgLCBjdXN0b21SdWxlcyA9IFtdO1xyXG5cclxuICByb290ID0gcm9vdCB8fCB7IHNjaGVtYTogc2NoZW1hLCByZWZWYWw6IHJlZlZhbCwgcmVmczogcmVmcyB9O1xyXG5cclxuICB2YXIgYyA9IGNoZWNrQ29tcGlsaW5nLmNhbGwodGhpcywgc2NoZW1hLCByb290LCBiYXNlSWQpO1xyXG4gIHZhciBjb21waWxhdGlvbiA9IHRoaXMuX2NvbXBpbGF0aW9uc1tjLmluZGV4XTtcclxuICBpZiAoYy5jb21waWxpbmcpIHJldHVybiAoY29tcGlsYXRpb24uY2FsbFZhbGlkYXRlID0gY2FsbFZhbGlkYXRlKTtcclxuXHJcbiAgdmFyIGZvcm1hdHMgPSB0aGlzLl9mb3JtYXRzO1xyXG4gIHZhciBSVUxFUyA9IHRoaXMuUlVMRVM7XHJcblxyXG4gIHRyeSB7XHJcbiAgICB2YXIgdiA9IGxvY2FsQ29tcGlsZShzY2hlbWEsIHJvb3QsIGxvY2FsUmVmcywgYmFzZUlkKTtcclxuICAgIGNvbXBpbGF0aW9uLnZhbGlkYXRlID0gdjtcclxuICAgIHZhciBjdiA9IGNvbXBpbGF0aW9uLmNhbGxWYWxpZGF0ZTtcclxuICAgIGlmIChjdikge1xyXG4gICAgICBjdi5zY2hlbWEgPSB2LnNjaGVtYTtcclxuICAgICAgY3YuZXJyb3JzID0gbnVsbDtcclxuICAgICAgY3YucmVmcyA9IHYucmVmcztcclxuICAgICAgY3YucmVmVmFsID0gdi5yZWZWYWw7XHJcbiAgICAgIGN2LnJvb3QgPSB2LnJvb3Q7XHJcbiAgICAgIGN2LiRhc3luYyA9IHYuJGFzeW5jO1xyXG4gICAgICBpZiAob3B0cy5zb3VyY2VDb2RlKSBjdi5zb3VyY2UgPSB2LnNvdXJjZTtcclxuICAgIH1cclxuICAgIHJldHVybiB2O1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICBlbmRDb21waWxpbmcuY2FsbCh0aGlzLCBzY2hlbWEsIHJvb3QsIGJhc2VJZCk7XHJcbiAgfVxyXG5cclxuICAvKiBAdGhpcyAgIHsqfSAtIGN1c3RvbSBjb250ZXh0LCBzZWUgcGFzc0NvbnRleHQgb3B0aW9uICovXHJcbiAgZnVuY3Rpb24gY2FsbFZhbGlkYXRlKCkge1xyXG4gICAgLyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xyXG4gICAgdmFyIHZhbGlkYXRlID0gY29tcGlsYXRpb24udmFsaWRhdGU7XHJcbiAgICB2YXIgcmVzdWx0ID0gdmFsaWRhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIGNhbGxWYWxpZGF0ZS5lcnJvcnMgPSB2YWxpZGF0ZS5lcnJvcnM7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbG9jYWxDb21waWxlKF9zY2hlbWEsIF9yb290LCBsb2NhbFJlZnMsIGJhc2VJZCkge1xyXG4gICAgdmFyIGlzUm9vdCA9ICFfcm9vdCB8fCAoX3Jvb3QgJiYgX3Jvb3Quc2NoZW1hID09IF9zY2hlbWEpO1xyXG4gICAgaWYgKF9yb290LnNjaGVtYSAhPSByb290LnNjaGVtYSlcclxuICAgICAgcmV0dXJuIGNvbXBpbGUuY2FsbChzZWxmLCBfc2NoZW1hLCBfcm9vdCwgbG9jYWxSZWZzLCBiYXNlSWQpO1xyXG5cclxuICAgIHZhciAkYXN5bmMgPSBfc2NoZW1hLiRhc3luYyA9PT0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgc291cmNlQ29kZSA9IHZhbGlkYXRlR2VuZXJhdG9yKHtcclxuICAgICAgaXNUb3A6IHRydWUsXHJcbiAgICAgIHNjaGVtYTogX3NjaGVtYSxcclxuICAgICAgaXNSb290OiBpc1Jvb3QsXHJcbiAgICAgIGJhc2VJZDogYmFzZUlkLFxyXG4gICAgICByb290OiBfcm9vdCxcclxuICAgICAgc2NoZW1hUGF0aDogJycsXHJcbiAgICAgIGVyclNjaGVtYVBhdGg6ICcjJyxcclxuICAgICAgZXJyb3JQYXRoOiAnXCJcIicsXHJcbiAgICAgIE1pc3NpbmdSZWZFcnJvcjogZXJyb3JDbGFzc2VzLk1pc3NpbmdSZWYsXHJcbiAgICAgIFJVTEVTOiBSVUxFUyxcclxuICAgICAgdmFsaWRhdGU6IHZhbGlkYXRlR2VuZXJhdG9yLFxyXG4gICAgICB1dGlsOiB1dGlsLFxyXG4gICAgICByZXNvbHZlOiByZXNvbHZlLFxyXG4gICAgICByZXNvbHZlUmVmOiByZXNvbHZlUmVmLFxyXG4gICAgICB1c2VQYXR0ZXJuOiB1c2VQYXR0ZXJuLFxyXG4gICAgICB1c2VEZWZhdWx0OiB1c2VEZWZhdWx0LFxyXG4gICAgICB1c2VDdXN0b21SdWxlOiB1c2VDdXN0b21SdWxlLFxyXG4gICAgICBvcHRzOiBvcHRzLFxyXG4gICAgICBmb3JtYXRzOiBmb3JtYXRzLFxyXG4gICAgICBsb2dnZXI6IHNlbGYubG9nZ2VyLFxyXG4gICAgICBzZWxmOiBzZWxmXHJcbiAgICB9KTtcclxuXHJcbiAgICBzb3VyY2VDb2RlID0gdmFycyhyZWZWYWwsIHJlZlZhbENvZGUpICsgdmFycyhwYXR0ZXJucywgcGF0dGVybkNvZGUpXHJcbiAgICAgICAgICAgICAgICAgICArIHZhcnMoZGVmYXVsdHMsIGRlZmF1bHRDb2RlKSArIHZhcnMoY3VzdG9tUnVsZXMsIGN1c3RvbVJ1bGVDb2RlKVxyXG4gICAgICAgICAgICAgICAgICAgKyBzb3VyY2VDb2RlO1xyXG5cclxuICAgIGlmIChvcHRzLnByb2Nlc3NDb2RlKSBzb3VyY2VDb2RlID0gb3B0cy5wcm9jZXNzQ29kZShzb3VyY2VDb2RlKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdcXG5cXG5cXG4gKioqIFxcbicsIEpTT04uc3RyaW5naWZ5KHNvdXJjZUNvZGUpKTtcclxuICAgIHZhciB2YWxpZGF0ZTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHZhciBtYWtlVmFsaWRhdGUgPSBuZXcgRnVuY3Rpb24oXHJcbiAgICAgICAgJ3NlbGYnLFxyXG4gICAgICAgICdSVUxFUycsXHJcbiAgICAgICAgJ2Zvcm1hdHMnLFxyXG4gICAgICAgICdyb290JyxcclxuICAgICAgICAncmVmVmFsJyxcclxuICAgICAgICAnZGVmYXVsdHMnLFxyXG4gICAgICAgICdjdXN0b21SdWxlcycsXHJcbiAgICAgICAgJ2VxdWFsJyxcclxuICAgICAgICAndWNzMmxlbmd0aCcsXHJcbiAgICAgICAgJ1ZhbGlkYXRpb25FcnJvcicsXHJcbiAgICAgICAgc291cmNlQ29kZVxyXG4gICAgICApO1xyXG5cclxuICAgICAgdmFsaWRhdGUgPSBtYWtlVmFsaWRhdGUoXHJcbiAgICAgICAgc2VsZixcclxuICAgICAgICBSVUxFUyxcclxuICAgICAgICBmb3JtYXRzLFxyXG4gICAgICAgIHJvb3QsXHJcbiAgICAgICAgcmVmVmFsLFxyXG4gICAgICAgIGRlZmF1bHRzLFxyXG4gICAgICAgIGN1c3RvbVJ1bGVzLFxyXG4gICAgICAgIGVxdWFsLFxyXG4gICAgICAgIHVjczJsZW5ndGgsXHJcbiAgICAgICAgVmFsaWRhdGlvbkVycm9yXHJcbiAgICAgICk7XHJcblxyXG4gICAgICByZWZWYWxbMF0gPSB2YWxpZGF0ZTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBzZWxmLmxvZ2dlci5lcnJvcignRXJyb3IgY29tcGlsaW5nIHNjaGVtYSwgZnVuY3Rpb24gY29kZTonLCBzb3VyY2VDb2RlKTtcclxuICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuXHJcbiAgICB2YWxpZGF0ZS5zY2hlbWEgPSBfc2NoZW1hO1xyXG4gICAgdmFsaWRhdGUuZXJyb3JzID0gbnVsbDtcclxuICAgIHZhbGlkYXRlLnJlZnMgPSByZWZzO1xyXG4gICAgdmFsaWRhdGUucmVmVmFsID0gcmVmVmFsO1xyXG4gICAgdmFsaWRhdGUucm9vdCA9IGlzUm9vdCA/IHZhbGlkYXRlIDogX3Jvb3Q7XHJcbiAgICBpZiAoJGFzeW5jKSB2YWxpZGF0ZS4kYXN5bmMgPSB0cnVlO1xyXG4gICAgaWYgKG9wdHMuc291cmNlQ29kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICB2YWxpZGF0ZS5zb3VyY2UgPSB7XHJcbiAgICAgICAgY29kZTogc291cmNlQ29kZSxcclxuICAgICAgICBwYXR0ZXJuczogcGF0dGVybnMsXHJcbiAgICAgICAgZGVmYXVsdHM6IGRlZmF1bHRzXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbGlkYXRlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVzb2x2ZVJlZihiYXNlSWQsIHJlZiwgaXNSb290KSB7XHJcbiAgICByZWYgPSByZXNvbHZlLnVybChiYXNlSWQsIHJlZik7XHJcbiAgICB2YXIgcmVmSW5kZXggPSByZWZzW3JlZl07XHJcbiAgICB2YXIgX3JlZlZhbCwgcmVmQ29kZTtcclxuICAgIGlmIChyZWZJbmRleCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIF9yZWZWYWwgPSByZWZWYWxbcmVmSW5kZXhdO1xyXG4gICAgICByZWZDb2RlID0gJ3JlZlZhbFsnICsgcmVmSW5kZXggKyAnXSc7XHJcbiAgICAgIHJldHVybiByZXNvbHZlZFJlZihfcmVmVmFsLCByZWZDb2RlKTtcclxuICAgIH1cclxuICAgIGlmICghaXNSb290ICYmIHJvb3QucmVmcykge1xyXG4gICAgICB2YXIgcm9vdFJlZklkID0gcm9vdC5yZWZzW3JlZl07XHJcbiAgICAgIGlmIChyb290UmVmSWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIF9yZWZWYWwgPSByb290LnJlZlZhbFtyb290UmVmSWRdO1xyXG4gICAgICAgIHJlZkNvZGUgPSBhZGRMb2NhbFJlZihyZWYsIF9yZWZWYWwpO1xyXG4gICAgICAgIHJldHVybiByZXNvbHZlZFJlZihfcmVmVmFsLCByZWZDb2RlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlZkNvZGUgPSBhZGRMb2NhbFJlZihyZWYpO1xyXG4gICAgdmFyIHYgPSByZXNvbHZlLmNhbGwoc2VsZiwgbG9jYWxDb21waWxlLCByb290LCByZWYpO1xyXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB2YXIgbG9jYWxTY2hlbWEgPSBsb2NhbFJlZnMgJiYgbG9jYWxSZWZzW3JlZl07XHJcbiAgICAgIGlmIChsb2NhbFNjaGVtYSkge1xyXG4gICAgICAgIHYgPSByZXNvbHZlLmlubGluZVJlZihsb2NhbFNjaGVtYSwgb3B0cy5pbmxpbmVSZWZzKVxyXG4gICAgICAgICAgICA/IGxvY2FsU2NoZW1hXHJcbiAgICAgICAgICAgIDogY29tcGlsZS5jYWxsKHNlbGYsIGxvY2FsU2NoZW1hLCByb290LCBsb2NhbFJlZnMsIGJhc2VJZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlbW92ZUxvY2FsUmVmKHJlZik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXBsYWNlTG9jYWxSZWYocmVmLCB2KTtcclxuICAgICAgcmV0dXJuIHJlc29sdmVkUmVmKHYsIHJlZkNvZGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkTG9jYWxSZWYocmVmLCB2KSB7XHJcbiAgICB2YXIgcmVmSWQgPSByZWZWYWwubGVuZ3RoO1xyXG4gICAgcmVmVmFsW3JlZklkXSA9IHY7XHJcbiAgICByZWZzW3JlZl0gPSByZWZJZDtcclxuICAgIHJldHVybiAncmVmVmFsJyArIHJlZklkO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlTG9jYWxSZWYocmVmKSB7XHJcbiAgICBkZWxldGUgcmVmc1tyZWZdO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVwbGFjZUxvY2FsUmVmKHJlZiwgdikge1xyXG4gICAgdmFyIHJlZklkID0gcmVmc1tyZWZdO1xyXG4gICAgcmVmVmFsW3JlZklkXSA9IHY7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZXNvbHZlZFJlZihyZWZWYWwsIGNvZGUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgcmVmVmFsID09ICdvYmplY3QnIHx8IHR5cGVvZiByZWZWYWwgPT0gJ2Jvb2xlYW4nXHJcbiAgICAgICAgICAgID8geyBjb2RlOiBjb2RlLCBzY2hlbWE6IHJlZlZhbCwgaW5saW5lOiB0cnVlIH1cclxuICAgICAgICAgICAgOiB7IGNvZGU6IGNvZGUsICRhc3luYzogcmVmVmFsICYmICEhcmVmVmFsLiRhc3luYyB9O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXNlUGF0dGVybihyZWdleFN0cikge1xyXG4gICAgdmFyIGluZGV4ID0gcGF0dGVybnNIYXNoW3JlZ2V4U3RyXTtcclxuICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGluZGV4ID0gcGF0dGVybnNIYXNoW3JlZ2V4U3RyXSA9IHBhdHRlcm5zLmxlbmd0aDtcclxuICAgICAgcGF0dGVybnNbaW5kZXhdID0gcmVnZXhTdHI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJ3BhdHRlcm4nICsgaW5kZXg7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1c2VEZWZhdWx0KHZhbHVlKSB7XHJcbiAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xyXG4gICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgICByZXR1cm4gJycgKyB2YWx1ZTtcclxuICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgICByZXR1cm4gdXRpbC50b1F1b3RlZFN0cmluZyh2YWx1ZSk7XHJcbiAgICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSByZXR1cm4gJ251bGwnO1xyXG4gICAgICAgIHZhciB2YWx1ZVN0ciA9IHN0YWJsZVN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gZGVmYXVsdHNIYXNoW3ZhbHVlU3RyXTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgaW5kZXggPSBkZWZhdWx0c0hhc2hbdmFsdWVTdHJdID0gZGVmYXVsdHMubGVuZ3RoO1xyXG4gICAgICAgICAgZGVmYXVsdHNbaW5kZXhdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAnZGVmYXVsdCcgKyBpbmRleDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVzZUN1c3RvbVJ1bGUocnVsZSwgc2NoZW1hLCBwYXJlbnRTY2hlbWEsIGl0KSB7XHJcbiAgICB2YXIgdmFsaWRhdGVTY2hlbWEgPSBydWxlLmRlZmluaXRpb24udmFsaWRhdGVTY2hlbWE7XHJcbiAgICBpZiAodmFsaWRhdGVTY2hlbWEgJiYgc2VsZi5fb3B0cy52YWxpZGF0ZVNjaGVtYSAhPT0gZmFsc2UpIHtcclxuICAgICAgdmFyIHZhbGlkID0gdmFsaWRhdGVTY2hlbWEoc2NoZW1hKTtcclxuICAgICAgaWYgKCF2YWxpZCkge1xyXG4gICAgICAgIHZhciBtZXNzYWdlID0gJ2tleXdvcmQgc2NoZW1hIGlzIGludmFsaWQ6ICcgKyBzZWxmLmVycm9yc1RleHQodmFsaWRhdGVTY2hlbWEuZXJyb3JzKTtcclxuICAgICAgICBpZiAoc2VsZi5fb3B0cy52YWxpZGF0ZVNjaGVtYSA9PSAnbG9nJykgc2VsZi5sb2dnZXIuZXJyb3IobWVzc2FnZSk7XHJcbiAgICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgY29tcGlsZSA9IHJ1bGUuZGVmaW5pdGlvbi5jb21waWxlXHJcbiAgICAgICwgaW5saW5lID0gcnVsZS5kZWZpbml0aW9uLmlubGluZVxyXG4gICAgICAsIG1hY3JvID0gcnVsZS5kZWZpbml0aW9uLm1hY3JvO1xyXG5cclxuICAgIHZhciB2YWxpZGF0ZTtcclxuICAgIGlmIChjb21waWxlKSB7XHJcbiAgICAgIHZhbGlkYXRlID0gY29tcGlsZS5jYWxsKHNlbGYsIHNjaGVtYSwgcGFyZW50U2NoZW1hLCBpdCk7XHJcbiAgICB9IGVsc2UgaWYgKG1hY3JvKSB7XHJcbiAgICAgIHZhbGlkYXRlID0gbWFjcm8uY2FsbChzZWxmLCBzY2hlbWEsIHBhcmVudFNjaGVtYSwgaXQpO1xyXG4gICAgICBpZiAob3B0cy52YWxpZGF0ZVNjaGVtYSAhPT0gZmFsc2UpIHNlbGYudmFsaWRhdGVTY2hlbWEodmFsaWRhdGUsIHRydWUpO1xyXG4gICAgfSBlbHNlIGlmIChpbmxpbmUpIHtcclxuICAgICAgdmFsaWRhdGUgPSBpbmxpbmUuY2FsbChzZWxmLCBpdCwgcnVsZS5rZXl3b3JkLCBzY2hlbWEsIHBhcmVudFNjaGVtYSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YWxpZGF0ZSA9IHJ1bGUuZGVmaW5pdGlvbi52YWxpZGF0ZTtcclxuICAgICAgaWYgKCF2YWxpZGF0ZSkgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWxpZGF0ZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2N1c3RvbSBrZXl3b3JkIFwiJyArIHJ1bGUua2V5d29yZCArICdcImZhaWxlZCB0byBjb21waWxlJyk7XHJcblxyXG4gICAgdmFyIGluZGV4ID0gY3VzdG9tUnVsZXMubGVuZ3RoO1xyXG4gICAgY3VzdG9tUnVsZXNbaW5kZXhdID0gdmFsaWRhdGU7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgY29kZTogJ2N1c3RvbVJ1bGUnICsgaW5kZXgsXHJcbiAgICAgIHZhbGlkYXRlOiB2YWxpZGF0ZVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZSBzY2hlbWEgaXMgY3VycmVudGx5IGNvbXBpbGVkXHJcbiAqIEB0aGlzICAgQWp2XHJcbiAqIEBwYXJhbSAge09iamVjdH0gc2NoZW1hIHNjaGVtYSB0byBjb21waWxlXHJcbiAqIEBwYXJhbSAge09iamVjdH0gcm9vdCByb290IG9iamVjdFxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGJhc2VJZCBiYXNlIHNjaGVtYSBJRFxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9iamVjdCB3aXRoIHByb3BlcnRpZXMgXCJpbmRleFwiIChjb21waWxhdGlvbiBpbmRleCkgYW5kIFwiY29tcGlsaW5nXCIgKGJvb2xlYW4pXHJcbiAqL1xyXG5mdW5jdGlvbiBjaGVja0NvbXBpbGluZyhzY2hlbWEsIHJvb3QsIGJhc2VJZCkge1xyXG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cclxuICB2YXIgaW5kZXggPSBjb21wSW5kZXguY2FsbCh0aGlzLCBzY2hlbWEsIHJvb3QsIGJhc2VJZCk7XHJcbiAgaWYgKGluZGV4ID49IDApIHJldHVybiB7IGluZGV4OiBpbmRleCwgY29tcGlsaW5nOiB0cnVlIH07XHJcbiAgaW5kZXggPSB0aGlzLl9jb21waWxhdGlvbnMubGVuZ3RoO1xyXG4gIHRoaXMuX2NvbXBpbGF0aW9uc1tpbmRleF0gPSB7XHJcbiAgICBzY2hlbWE6IHNjaGVtYSxcclxuICAgIHJvb3Q6IHJvb3QsXHJcbiAgICBiYXNlSWQ6IGJhc2VJZFxyXG4gIH07XHJcbiAgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCBjb21waWxpbmc6IGZhbHNlIH07XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogUmVtb3ZlcyB0aGUgc2NoZW1hIGZyb20gdGhlIGN1cnJlbnRseSBjb21waWxlZCBsaXN0XHJcbiAqIEB0aGlzICAgQWp2XHJcbiAqIEBwYXJhbSAge09iamVjdH0gc2NoZW1hIHNjaGVtYSB0byBjb21waWxlXHJcbiAqIEBwYXJhbSAge09iamVjdH0gcm9vdCByb290IG9iamVjdFxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGJhc2VJZCBiYXNlIHNjaGVtYSBJRFxyXG4gKi9cclxuZnVuY3Rpb24gZW5kQ29tcGlsaW5nKHNjaGVtYSwgcm9vdCwgYmFzZUlkKSB7XHJcbiAgLyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xyXG4gIHZhciBpID0gY29tcEluZGV4LmNhbGwodGhpcywgc2NoZW1hLCByb290LCBiYXNlSWQpO1xyXG4gIGlmIChpID49IDApIHRoaXMuX2NvbXBpbGF0aW9ucy5zcGxpY2UoaSwgMSk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogSW5kZXggb2Ygc2NoZW1hIGNvbXBpbGF0aW9uIGluIHRoZSBjdXJyZW50bHkgY29tcGlsZWQgbGlzdFxyXG4gKiBAdGhpcyAgIEFqdlxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgdG8gY29tcGlsZVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJvb3Qgcm9vdCBvYmplY3RcclxuICogQHBhcmFtICB7U3RyaW5nfSBiYXNlSWQgYmFzZSBzY2hlbWEgSURcclxuICogQHJldHVybiB7SW50ZWdlcn0gY29tcGlsYXRpb24gaW5kZXhcclxuICovXHJcbmZ1bmN0aW9uIGNvbXBJbmRleChzY2hlbWEsIHJvb3QsIGJhc2VJZCkge1xyXG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cclxuICBmb3IgKHZhciBpPTA7IGk8dGhpcy5fY29tcGlsYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgYyA9IHRoaXMuX2NvbXBpbGF0aW9uc1tpXTtcclxuICAgIGlmIChjLnNjaGVtYSA9PSBzY2hlbWEgJiYgYy5yb290ID09IHJvb3QgJiYgYy5iYXNlSWQgPT0gYmFzZUlkKSByZXR1cm4gaTtcclxuICB9XHJcbiAgcmV0dXJuIC0xO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gcGF0dGVybkNvZGUoaSwgcGF0dGVybnMpIHtcclxuICByZXR1cm4gJ3ZhciBwYXR0ZXJuJyArIGkgKyAnID0gbmV3IFJlZ0V4cCgnICsgdXRpbC50b1F1b3RlZFN0cmluZyhwYXR0ZXJuc1tpXSkgKyAnKTsnO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdENvZGUoaSkge1xyXG4gIHJldHVybiAndmFyIGRlZmF1bHQnICsgaSArICcgPSBkZWZhdWx0c1snICsgaSArICddOyc7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZWZWYWxDb2RlKGksIHJlZlZhbCkge1xyXG4gIHJldHVybiByZWZWYWxbaV0gPT09IHVuZGVmaW5lZCA/ICcnIDogJ3ZhciByZWZWYWwnICsgaSArICcgPSByZWZWYWxbJyArIGkgKyAnXTsnO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY3VzdG9tUnVsZUNvZGUoaSkge1xyXG4gIHJldHVybiAndmFyIGN1c3RvbVJ1bGUnICsgaSArICcgPSBjdXN0b21SdWxlc1snICsgaSArICddOyc7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiB2YXJzKGFyciwgc3RhdGVtZW50KSB7XHJcbiAgaWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gJyc7XHJcbiAgdmFyIGNvZGUgPSAnJztcclxuICBmb3IgKHZhciBpPTA7IGk8YXJyLmxlbmd0aDsgaSsrKVxyXG4gICAgY29kZSArPSBzdGF0ZW1lbnQoaSwgYXJyKTtcclxuICByZXR1cm4gY29kZTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfX2xpbWl0TGVuZ3RoKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGVycm9yS2V5d29yZDtcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkaXNEYXRhID0gaXQub3B0cy4kZGF0YSAmJiAkc2NoZW1hICYmICRzY2hlbWEuJGRhdGEsXHJcbiAgICAkc2NoZW1hVmFsdWU7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnIHZhciBzY2hlbWEnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC5nZXREYXRhKCRzY2hlbWEuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFycikpICsgJzsgJztcclxuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcclxuICB9IGVsc2Uge1xyXG4gICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYTtcclxuICB9XHJcbiAgdmFyICRvcCA9ICRrZXl3b3JkID09ICdtYXhMZW5ndGgnID8gJz4nIDogJzwnO1xyXG4gIG91dCArPSAnaWYgKCAnO1xyXG4gIGlmICgkaXNEYXRhKSB7XHJcbiAgICBvdXQgKz0gJyAoJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9IFxcJ251bWJlclxcJykgfHwgJztcclxuICB9XHJcbiAgaWYgKGl0Lm9wdHMudW5pY29kZSA9PT0gZmFsc2UpIHtcclxuICAgIG91dCArPSAnICcgKyAoJGRhdGEpICsgJy5sZW5ndGggJztcclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ICs9ICcgdWNzMmxlbmd0aCgnICsgKCRkYXRhKSArICcpICc7XHJcbiAgfVxyXG4gIG91dCArPSAnICcgKyAoJG9wKSArICcgJyArICgkc2NoZW1hVmFsdWUpICsgJykgeyAnO1xyXG4gIHZhciAkZXJyb3JLZXl3b3JkID0gJGtleXdvcmQ7XHJcbiAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICQkb3V0U3RhY2sucHVzaChvdXQpO1xyXG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAnX2xpbWl0TGVuZ3RoJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBsaW1pdDogJyArICgkc2NoZW1hVmFsdWUpICsgJyB9ICc7XHJcbiAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcclxuICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgTk9UIGJlICc7XHJcbiAgICAgIGlmICgka2V5d29yZCA9PSAnbWF4TGVuZ3RoJykge1xyXG4gICAgICAgIG91dCArPSAnbG9uZ2VyJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJ3Nob3J0ZXInO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnIHRoYW4gJztcclxuICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICBvdXQgKz0gJ1xcJyArICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKyBcXCcnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hKTtcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyBjaGFyYWN0ZXJzXFwnICc7XHJcbiAgICB9XHJcbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgIG91dCArPSAnICwgc2NoZW1hOiAgJztcclxuICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hKTtcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyAgICAgICAgICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgfSAnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB7fSAnO1xyXG4gIH1cclxuICB2YXIgX19lcnIgPSBvdXQ7XHJcbiAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgfVxyXG4gIG91dCArPSAnfSAnO1xyXG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcclxuICB9XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xyXG5cclxudmFyIERBVEUgPSAvXihcXGRcXGRcXGRcXGQpLShcXGRcXGQpLShcXGRcXGQpJC87XHJcbnZhciBEQVlTID0gWzAsMzEsMjgsMzEsMzAsMzEsMzAsMzEsMzEsMzAsMzEsMzAsMzFdO1xyXG52YXIgVElNRSA9IC9eKFxcZFxcZCk6KFxcZFxcZCk6KFxcZFxcZCkoXFwuXFxkKyk/KHp8WystXVxcZFxcZDpcXGRcXGQpPyQvaTtcclxudmFyIEhPU1ROQU1FID0gL15bYS16MC05XSg/OlthLXowLTktXXswLDYxfVthLXowLTldKT8oPzpcXC5bYS16MC05XSg/OlstMC05YS16XXswLDYxfVswLTlhLXpdKT8pKiQvaTtcclxudmFyIFVSSSA9IC9eKD86W2Etel1bYS16MC05K1xcLS5dKjopKD86XFwvP1xcLyg/Oig/OlthLXowLTlcXC0uX34hJCYnKCkqKyw7PTpdfCVbMC05YS1mXXsyfSkqQCk/KD86XFxbKD86KD86KD86KD86WzAtOWEtZl17MSw0fTopezZ9fDo6KD86WzAtOWEtZl17MSw0fTopezV9fCg/OlswLTlhLWZdezEsNH0pPzo6KD86WzAtOWEtZl17MSw0fTopezR9fCg/Oig/OlswLTlhLWZdezEsNH06KXswLDF9WzAtOWEtZl17MSw0fSk/OjooPzpbMC05YS1mXXsxLDR9Oil7M318KD86KD86WzAtOWEtZl17MSw0fTopezAsMn1bMC05YS1mXXsxLDR9KT86Oig/OlswLTlhLWZdezEsNH06KXsyfXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCwzfVswLTlhLWZdezEsNH0pPzo6WzAtOWEtZl17MSw0fTp8KD86KD86WzAtOWEtZl17MSw0fTopezAsNH1bMC05YS1mXXsxLDR9KT86OikoPzpbMC05YS1mXXsxLDR9OlswLTlhLWZdezEsNH18KD86KD86MjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KVxcLil7M30oPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCw1fVswLTlhLWZdezEsNH0pPzo6WzAtOWEtZl17MSw0fXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCw2fVswLTlhLWZdezEsNH0pPzo6KXxbVnZdWzAtOWEtZl0rXFwuW2EtejAtOVxcLS5ffiEkJicoKSorLDs9Ol0rKVxcXXwoPzooPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPyl8KD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9XXwlWzAtOWEtZl17Mn0pKikoPzo6XFxkKik/KD86XFwvKD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkqKSp8XFwvKD86KD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkrKD86XFwvKD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkqKSopP3woPzpbYS16MC05XFwtLl9+ISQmJygpKissOz06QF18JVswLTlhLWZdezJ9KSsoPzpcXC8oPzpbYS16MC05XFwtLl9+ISQmJygpKissOz06QF18JVswLTlhLWZdezJ9KSopKikoPzpcXD8oPzpbYS16MC05XFwtLl9+ISQmJygpKissOz06QC8/XXwlWzAtOWEtZl17Mn0pKik/KD86Iyg/OlthLXowLTlcXC0uX34hJCYnKCkqKyw7PTpALz9dfCVbMC05YS1mXXsyfSkqKT8kL2k7XHJcbnZhciBVUklSRUYgPSAvXig/OlthLXpdW2EtejAtOStcXC0uXSo6KT8oPzpcXC8/XFwvKD86KD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9Ol18JVswLTlhLWZdezJ9KSpAKT8oPzpcXFsoPzooPzooPzooPzpbMC05YS1mXXsxLDR9Oil7Nn18OjooPzpbMC05YS1mXXsxLDR9Oil7NX18KD86WzAtOWEtZl17MSw0fSk/OjooPzpbMC05YS1mXXsxLDR9Oil7NH18KD86KD86WzAtOWEtZl17MSw0fTopezAsMX1bMC05YS1mXXsxLDR9KT86Oig/OlswLTlhLWZdezEsNH06KXszfXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCwyfVswLTlhLWZdezEsNH0pPzo6KD86WzAtOWEtZl17MSw0fTopezJ9fCg/Oig/OlswLTlhLWZdezEsNH06KXswLDN9WzAtOWEtZl17MSw0fSk/OjpbMC05YS1mXXsxLDR9OnwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCw0fVswLTlhLWZdezEsNH0pPzo6KSg/OlswLTlhLWZdezEsNH06WzAtOWEtZl17MSw0fXwoPzooPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPykpfCg/Oig/OlswLTlhLWZdezEsNH06KXswLDV9WzAtOWEtZl17MSw0fSk/OjpbMC05YS1mXXsxLDR9fCg/Oig/OlswLTlhLWZdezEsNH06KXswLDZ9WzAtOWEtZl17MSw0fSk/OjopfFtWdl1bMC05YS1mXStcXC5bYS16MC05XFwtLl9+ISQmJygpKissOz06XSspXFxdfCg/Oig/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPylcXC4pezN9KD86MjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KXwoPzpbYS16MC05XFwtLl9+ISQmJ1wiKCkqKyw7PV18JVswLTlhLWZdezJ9KSopKD86OlxcZCopPyg/OlxcLyg/OlthLXowLTlcXC0uX34hJCYnXCIoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkqKSp8XFwvKD86KD86W2EtejAtOVxcLS5ffiEkJidcIigpKissOz06QF18JVswLTlhLWZdezJ9KSsoPzpcXC8oPzpbYS16MC05XFwtLl9+ISQmJ1wiKCkqKyw7PTpAXXwlWzAtOWEtZl17Mn0pKikqKT98KD86W2EtejAtOVxcLS5ffiEkJidcIigpKissOz06QF18JVswLTlhLWZdezJ9KSsoPzpcXC8oPzpbYS16MC05XFwtLl9+ISQmJ1wiKCkqKyw7PTpAXXwlWzAtOWEtZl17Mn0pKikqKT8oPzpcXD8oPzpbYS16MC05XFwtLl9+ISQmJ1wiKCkqKyw7PTpALz9dfCVbMC05YS1mXXsyfSkqKT8oPzojKD86W2EtejAtOVxcLS5ffiEkJidcIigpKissOz06QC8/XXwlWzAtOWEtZl17Mn0pKik/JC9pO1xyXG4vLyB1cmktdGVtcGxhdGU6IGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM2NTcwXHJcbnZhciBVUklURU1QTEFURSA9IC9eKD86KD86W15cXHgwMC1cXHgyMFwiJzw+JVxcXFxeYHt8fV18JVswLTlhLWZdezJ9KXxcXHtbKyMuLzs/Jj0sIUB8XT8oPzpbYS16MC05X118JVswLTlhLWZdezJ9KSsoPzo6WzEtOV1bMC05XXswLDN9fFxcKik/KD86LCg/OlthLXowLTlfXXwlWzAtOWEtZl17Mn0pKyg/OjpbMS05XVswLTldezAsM318XFwqKT8pKlxcfSkqJC9pO1xyXG4vLyBGb3IgdGhlIHNvdXJjZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZHBlcmluaS83MjkyOTRcclxuLy8gRm9yIHRlc3QgY2FzZXM6IGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxyXG4vLyBAdG9kbyBEZWxldGUgY3VycmVudCBVUkwgaW4gZmF2b3VyIG9mIHRoZSBjb21tZW50ZWQgb3V0IFVSTCBydWxlIHdoZW4gdGhpcyBpc3N1ZSBpcyBmaXhlZCBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludC9pc3N1ZXMvNzk4My5cclxuLy8gdmFyIFVSTCA9IC9eKD86KD86aHR0cHM/fGZ0cCk6XFwvXFwvKSg/OlxcUysoPzo6XFxTKik/QCk/KD86KD8hMTAoPzpcXC5cXGR7MSwzfSl7M30pKD8hMTI3KD86XFwuXFxkezEsM30pezN9KSg/ITE2OVxcLjI1NCg/OlxcLlxcZHsxLDN9KXsyfSkoPyExOTJcXC4xNjgoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTcyXFwuKD86MVs2LTldfDJcXGR8M1swLTFdKSg/OlxcLlxcZHsxLDN9KXsyfSkoPzpbMS05XVxcZD98MVxcZFxcZHwyWzAxXVxcZHwyMlswLTNdKSg/OlxcLig/OjE/XFxkezEsMn18MlswLTRdXFxkfDI1WzAtNV0pKXsyfSg/OlxcLig/OlsxLTldXFxkP3wxXFxkXFxkfDJbMC00XVxcZHwyNVswLTRdKSl8KD86KD86W2EtelxcdXswMGExfS1cXHV7ZmZmZn0wLTldKy0/KSpbYS16XFx1ezAwYTF9LVxcdXtmZmZmfTAtOV0rKSg/OlxcLig/OlthLXpcXHV7MDBhMX0tXFx1e2ZmZmZ9MC05XSstPykqW2EtelxcdXswMGExfS1cXHV7ZmZmZn0wLTldKykqKD86XFwuKD86W2EtelxcdXswMGExfS1cXHV7ZmZmZn1dezIsfSkpKSg/OjpcXGR7Miw1fSk/KD86XFwvW15cXHNdKik/JC9pdTtcclxudmFyIFVSTCA9IC9eKD86KD86aHR0cFtzXFx1MDE3Rl0/fGZ0cCk6XFwvXFwvKSg/Oig/OltcXDAtXFx4MDhcXHgwRS1cXHgxRiEtXFx4OUZcXHhBMS1cXHUxNjdGXFx1MTY4MS1cXHUxRkZGXFx1MjAwQi1cXHUyMDI3XFx1MjAyQS1cXHUyMDJFXFx1MjAzMC1cXHUyMDVFXFx1MjA2MC1cXHUyRkZGXFx1MzAwMS1cXHVEN0ZGXFx1RTAwMC1cXHVGRUZFXFx1RkYwMC1cXHVGRkZGXXxbXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdKSsoPzo6KD86W1xcMC1cXHgwOFxceDBFLVxceDFGIS1cXHg5RlxceEExLVxcdTE2N0ZcXHUxNjgxLVxcdTFGRkZcXHUyMDBCLVxcdTIwMjdcXHUyMDJBLVxcdTIwMkVcXHUyMDMwLVxcdTIwNUVcXHUyMDYwLVxcdTJGRkZcXHUzMDAxLVxcdUQ3RkZcXHVFMDAwLVxcdUZFRkVcXHVGRjAwLVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdW1xcdURDMDAtXFx1REZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0pKik/QCk/KD86KD8hMTAoPzpcXC5bMC05XXsxLDN9KXszfSkoPyExMjcoPzpcXC5bMC05XXsxLDN9KXszfSkoPyExNjlcXC4yNTQoPzpcXC5bMC05XXsxLDN9KXsyfSkoPyExOTJcXC4xNjgoPzpcXC5bMC05XXsxLDN9KXsyfSkoPyExNzJcXC4oPzoxWzYtOV18MlswLTldfDNbMDFdKSg/OlxcLlswLTldezEsM30pezJ9KSg/OlsxLTldWzAtOV0/fDFbMC05XVswLTldfDJbMDFdWzAtOV18MjJbMC0zXSkoPzpcXC4oPzoxP1swLTldezEsMn18MlswLTRdWzAtOV18MjVbMC01XSkpezJ9KD86XFwuKD86WzEtOV1bMC05XT98MVswLTldWzAtOV18MlswLTRdWzAtOV18MjVbMC00XSkpfCg/Oig/Oig/OlswLTlLU2EtelxceEExLVxcdUQ3RkZcXHVFMDAwLVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdKSstPykqKD86WzAtOUtTYS16XFx4QTEtXFx1RDdGRlxcdUUwMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0pKykoPzpcXC4oPzooPzpbMC05S1NhLXpcXHhBMS1cXHVEN0ZGXFx1RTAwMC1cXHVGRkZGXXxbXFx1RDgwMC1cXHVEQkZGXSg/IVtcXHVEQzAwLVxcdURGRkZdKXwoPzpbXlxcdUQ4MDAtXFx1REJGRl18XilbXFx1REMwMC1cXHVERkZGXSkrLT8pKig/OlswLTlLU2EtelxceEExLVxcdUQ3RkZcXHVFMDAwLVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdKSspKig/OlxcLig/Oig/OltLU2EtelxceEExLVxcdUQ3RkZcXHVFMDAwLVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdKXsyLH0pKSkoPzo6WzAtOV17Miw1fSk/KD86XFwvKD86W1xcMC1cXHgwOFxceDBFLVxceDFGIS1cXHg5RlxceEExLVxcdTE2N0ZcXHUxNjgxLVxcdTFGRkZcXHUyMDBCLVxcdTIwMjdcXHUyMDJBLVxcdTIwMkVcXHUyMDMwLVxcdTIwNUVcXHUyMDYwLVxcdTJGRkZcXHUzMDAxLVxcdUQ3RkZcXHVFMDAwLVxcdUZFRkVcXHVGRjAwLVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdW1xcdURDMDAtXFx1REZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0pKik/JC9pO1xyXG52YXIgVVVJRCA9IC9eKD86dXJuOnV1aWQ6KT9bMC05YS1mXXs4fS0oPzpbMC05YS1mXXs0fS0pezN9WzAtOWEtZl17MTJ9JC9pO1xyXG52YXIgSlNPTl9QT0lOVEVSID0gL14oPzpcXC8oPzpbXn4vXXx+MHx+MSkqKSokLztcclxudmFyIEpTT05fUE9JTlRFUl9VUklfRlJBR01FTlQgPSAvXiMoPzpcXC8oPzpbYS16MC05X1xcLS4hJCYnKCkqKyw7Oj1AXXwlWzAtOWEtZl17Mn18fjB8fjEpKikqJC9pO1xyXG52YXIgUkVMQVRJVkVfSlNPTl9QT0lOVEVSID0gL14oPzowfFsxLTldWzAtOV0qKSg/OiN8KD86XFwvKD86W15+L118fjB8fjEpKikqKSQvO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZm9ybWF0cztcclxuXHJcbmZ1bmN0aW9uIGZvcm1hdHMobW9kZSkge1xyXG4gIG1vZGUgPSBtb2RlID09ICdmdWxsJyA/ICdmdWxsJyA6ICdmYXN0JztcclxuICByZXR1cm4gdXRpbC5jb3B5KGZvcm1hdHNbbW9kZV0pO1xyXG59XHJcblxyXG5cclxuZm9ybWF0cy5mYXN0ID0ge1xyXG4gIC8vIGRhdGU6IGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzMzMzkjc2VjdGlvbi01LjZcclxuICBkYXRlOiAvXlxcZFxcZFxcZFxcZC1bMC0xXVxcZC1bMC0zXVxcZCQvLFxyXG4gIC8vIGRhdGUtdGltZTogaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzMzOSNzZWN0aW9uLTUuNlxyXG4gIHRpbWU6IC9eKD86WzAtMl1cXGQ6WzAtNV1cXGQ6WzAtNV1cXGR8MjM6NTk6NjApKD86XFwuXFxkKyk/KD86enxbKy1dXFxkXFxkOlxcZFxcZCk/JC9pLFxyXG4gICdkYXRlLXRpbWUnOiAvXlxcZFxcZFxcZFxcZC1bMC0xXVxcZC1bMC0zXVxcZFt0XFxzXSg/OlswLTJdXFxkOlswLTVdXFxkOlswLTVdXFxkfDIzOjU5OjYwKSg/OlxcLlxcZCspPyg/Onp8WystXVxcZFxcZDpcXGRcXGQpJC9pLFxyXG4gIC8vIHVyaTogaHR0cHM6Ly9naXRodWIuY29tL21hZmludG9zaC9pcy1teS1qc29uLXZhbGlkL2Jsb2IvbWFzdGVyL2Zvcm1hdHMuanNcclxuICB1cmk6IC9eKD86W2Etel1bYS16MC05Ky0uXSo6KSg/OlxcLz9cXC8pP1teXFxzXSokL2ksXHJcbiAgJ3VyaS1yZWZlcmVuY2UnOiAvXig/Oig/OlthLXpdW2EtejAtOSstLl0qOik/XFwvP1xcLyk/KD86W15cXFxcXFxzI11bXlxccyNdKik/KD86I1teXFxcXFxcc10qKT8kL2ksXHJcbiAgJ3VyaS10ZW1wbGF0ZSc6IFVSSVRFTVBMQVRFLFxyXG4gIHVybDogVVJMLFxyXG4gIC8vIGVtYWlsIChzb3VyY2VzIGZyb20ganNlbiB2YWxpZGF0b3IpOlxyXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjAxMzIzL3VzaW5nLWEtcmVndWxhci1leHByZXNzaW9uLXRvLXZhbGlkYXRlLWFuLWVtYWlsLWFkZHJlc3MjYW5zd2VyLTg4MjkzNjNcclxuICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzIChzZWFyY2ggZm9yICd3aWxsZnVsIHZpb2xhdGlvbicpXHJcbiAgZW1haWw6IC9eW2EtejAtOS4hIyQlJicqKy89P15fYHt8fX4tXStAW2EtejAtOV0oPzpbYS16MC05LV17MCw2MX1bYS16MC05XSk/KD86XFwuW2EtejAtOV0oPzpbYS16MC05LV17MCw2MX1bYS16MC05XSk/KSokL2ksXHJcbiAgaG9zdG5hbWU6IEhPU1ROQU1FLFxyXG4gIC8vIG9wdGltaXplZCBodHRwczovL3d3dy5zYWZhcmlib29rc29ubGluZS5jb20vbGlicmFyeS92aWV3L3JlZ3VsYXItZXhwcmVzc2lvbnMtY29va2Jvb2svOTc4MDU5NjgwMjgzNy9jaDA3czE2Lmh0bWxcclxuICBpcHY0OiAvXig/Oig/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPylcXC4pezN9KD86MjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KSQvLFxyXG4gIC8vIG9wdGltaXplZCBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUzNDk3L3JlZ3VsYXItZXhwcmVzc2lvbi10aGF0LW1hdGNoZXMtdmFsaWQtaXB2Ni1hZGRyZXNzZXNcclxuICBpcHY2OiAvXlxccyooPzooPzooPzpbMC05YS1mXXsxLDR9Oil7N30oPzpbMC05YS1mXXsxLDR9fDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7Nn0oPzo6WzAtOWEtZl17MSw0fXwoPzooPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoPzpcXC4oPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KD86KD86WzAtOWEtZl17MSw0fTopezV9KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsMn0pfDooPzooPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoPzpcXC4oPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KD86KD86WzAtOWEtZl17MSw0fTopezR9KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsM30pfCg/Oig/OjpbMC05YS1mXXsxLDR9KT86KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7M30oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw0fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsMn06KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7Mn0oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw1fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsM306KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MX0oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw2fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsNH06KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzo6KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsN30pfCg/Oig/OjpbMC05YS1mXXsxLDR9KXswLDV9Oig/Oig/OjI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSg/OlxcLig/OjI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSkpKD86JS4rKT9cXHMqJC9pLFxyXG4gIHJlZ2V4OiByZWdleCxcclxuICAvLyB1dWlkOiBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM0MTIyXHJcbiAgdXVpZDogVVVJRCxcclxuICAvLyBKU09OLXBvaW50ZXI6IGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM2OTAxXHJcbiAgLy8gdXJpIGZyYWdtZW50OiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNhcHBlbmRpeC1BXHJcbiAgJ2pzb24tcG9pbnRlcic6IEpTT05fUE9JTlRFUixcclxuICAnanNvbi1wb2ludGVyLXVyaS1mcmFnbWVudCc6IEpTT05fUE9JTlRFUl9VUklfRlJBR01FTlQsXHJcbiAgLy8gcmVsYXRpdmUgSlNPTi1wb2ludGVyOiBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9kcmFmdC1sdWZmLXJlbGF0aXZlLWpzb24tcG9pbnRlci0wMFxyXG4gICdyZWxhdGl2ZS1qc29uLXBvaW50ZXInOiBSRUxBVElWRV9KU09OX1BPSU5URVJcclxufTtcclxuXHJcblxyXG5mb3JtYXRzLmZ1bGwgPSB7XHJcbiAgZGF0ZTogZGF0ZSxcclxuICB0aW1lOiB0aW1lLFxyXG4gICdkYXRlLXRpbWUnOiBkYXRlX3RpbWUsXHJcbiAgdXJpOiB1cmksXHJcbiAgJ3VyaS1yZWZlcmVuY2UnOiBVUklSRUYsXHJcbiAgJ3VyaS10ZW1wbGF0ZSc6IFVSSVRFTVBMQVRFLFxyXG4gIHVybDogVVJMLFxyXG4gIGVtYWlsOiAvXlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPyQvaSxcclxuICBob3N0bmFtZTogaG9zdG5hbWUsXHJcbiAgaXB2NDogL14oPzooPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPykkLyxcclxuICBpcHY2OiAvXlxccyooPzooPzooPzpbMC05YS1mXXsxLDR9Oil7N30oPzpbMC05YS1mXXsxLDR9fDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7Nn0oPzo6WzAtOWEtZl17MSw0fXwoPzooPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoPzpcXC4oPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KD86KD86WzAtOWEtZl17MSw0fTopezV9KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsMn0pfDooPzooPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoPzpcXC4oPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KD86KD86WzAtOWEtZl17MSw0fTopezR9KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsM30pfCg/Oig/OjpbMC05YS1mXXsxLDR9KT86KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7M30oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw0fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsMn06KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7Mn0oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw1fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsM306KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MX0oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw2fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsNH06KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzo6KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsN30pfCg/Oig/OjpbMC05YS1mXXsxLDR9KXswLDV9Oig/Oig/OjI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSg/OlxcLig/OjI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSkpKD86JS4rKT9cXHMqJC9pLFxyXG4gIHJlZ2V4OiByZWdleCxcclxuICB1dWlkOiBVVUlELFxyXG4gICdqc29uLXBvaW50ZXInOiBKU09OX1BPSU5URVIsXHJcbiAgJ2pzb24tcG9pbnRlci11cmktZnJhZ21lbnQnOiBKU09OX1BPSU5URVJfVVJJX0ZSQUdNRU5ULFxyXG4gICdyZWxhdGl2ZS1qc29uLXBvaW50ZXInOiBSRUxBVElWRV9KU09OX1BPSU5URVJcclxufTtcclxuXHJcblxyXG5mdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcclxuICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzMzOSNhcHBlbmRpeC1DXHJcbiAgcmV0dXJuIHllYXIgJSA0ID09PSAwICYmICh5ZWFyICUgMTAwICE9PSAwIHx8IHllYXIgJSA0MDAgPT09IDApO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZGF0ZShzdHIpIHtcclxuICAvLyBmdWxsLWRhdGUgZnJvbSBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzMzM5I3NlY3Rpb24tNS42XHJcbiAgdmFyIG1hdGNoZXMgPSBzdHIubWF0Y2goREFURSk7XHJcbiAgaWYgKCFtYXRjaGVzKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gIHZhciB5ZWFyID0gK21hdGNoZXNbMV07XHJcbiAgdmFyIG1vbnRoID0gK21hdGNoZXNbMl07XHJcbiAgdmFyIGRheSA9ICttYXRjaGVzWzNdO1xyXG5cclxuICByZXR1cm4gbW9udGggPj0gMSAmJiBtb250aCA8PSAxMiAmJiBkYXkgPj0gMSAmJlxyXG4gICAgICAgICAgZGF5IDw9IChtb250aCA9PSAyICYmIGlzTGVhcFllYXIoeWVhcikgPyAyOSA6IERBWVNbbW9udGhdKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHRpbWUoc3RyLCBmdWxsKSB7XHJcbiAgdmFyIG1hdGNoZXMgPSBzdHIubWF0Y2goVElNRSk7XHJcbiAgaWYgKCFtYXRjaGVzKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gIHZhciBob3VyID0gbWF0Y2hlc1sxXTtcclxuICB2YXIgbWludXRlID0gbWF0Y2hlc1syXTtcclxuICB2YXIgc2Vjb25kID0gbWF0Y2hlc1szXTtcclxuICB2YXIgdGltZVpvbmUgPSBtYXRjaGVzWzVdO1xyXG4gIHJldHVybiAoKGhvdXIgPD0gMjMgJiYgbWludXRlIDw9IDU5ICYmIHNlY29uZCA8PSA1OSkgfHxcclxuICAgICAgICAgIChob3VyID09IDIzICYmIG1pbnV0ZSA9PSA1OSAmJiBzZWNvbmQgPT0gNjApKSAmJlxyXG4gICAgICAgICAoIWZ1bGwgfHwgdGltZVpvbmUpO1xyXG59XHJcblxyXG5cclxudmFyIERBVEVfVElNRV9TRVBBUkFUT1IgPSAvdHxcXHMvaTtcclxuZnVuY3Rpb24gZGF0ZV90aW1lKHN0cikge1xyXG4gIC8vIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzMzMzkjc2VjdGlvbi01LjZcclxuICB2YXIgZGF0ZVRpbWUgPSBzdHIuc3BsaXQoREFURV9USU1FX1NFUEFSQVRPUik7XHJcbiAgcmV0dXJuIGRhdGVUaW1lLmxlbmd0aCA9PSAyICYmIGRhdGUoZGF0ZVRpbWVbMF0pICYmIHRpbWUoZGF0ZVRpbWVbMV0sIHRydWUpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaG9zdG5hbWUoc3RyKSB7XHJcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzEwMzQjc2VjdGlvbi0zLjVcclxuICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMTEyMyNzZWN0aW9uLTJcclxuICByZXR1cm4gc3RyLmxlbmd0aCA8PSAyNTUgJiYgSE9TVE5BTUUudGVzdChzdHIpO1xyXG59XHJcblxyXG5cclxudmFyIE5PVF9VUklfRlJBR01FTlQgPSAvXFwvfDovO1xyXG5mdW5jdGlvbiB1cmkoc3RyKSB7XHJcbiAgLy8gaHR0cDovL2ptcndhcmUuY29tL2FydGljbGVzLzIwMDkvdXJpX3JlZ2V4cC9VUklfcmVnZXguaHRtbCArIG9wdGlvbmFsIHByb3RvY29sICsgcmVxdWlyZWQgXCIuXCJcclxuICByZXR1cm4gTk9UX1VSSV9GUkFHTUVOVC50ZXN0KHN0cikgJiYgVVJJLnRlc3Qoc3RyKTtcclxufVxyXG5cclxuXHJcbnZhciBaX0FOQ0hPUiA9IC9bXlxcXFxdXFxcXFovO1xyXG5mdW5jdGlvbiByZWdleChzdHIpIHtcclxuICBpZiAoWl9BTkNIT1IudGVzdChzdHIpKSByZXR1cm4gZmFsc2U7XHJcbiAgdHJ5IHtcclxuICAgIG5ldyBSZWdFeHAoc3RyKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2goZSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfbXVsdGlwbGVPZihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xyXG4gIHZhciBvdXQgPSAnICc7XHJcbiAgdmFyICRsdmwgPSBpdC5sZXZlbDtcclxuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XHJcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xyXG4gIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRrZXl3b3JkKTtcclxuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XHJcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XHJcbiAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcclxuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxyXG4gICAgJHNjaGVtYVZhbHVlO1xyXG4gIGlmICgkaXNEYXRhKSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XHJcbiAgICAkc2NoZW1hVmFsdWUgPSAnc2NoZW1hJyArICRsdmw7XHJcbiAgfSBlbHNlIHtcclxuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XHJcbiAgfVxyXG4gIG91dCArPSAndmFyIGRpdmlzaW9uJyArICgkbHZsKSArICc7aWYgKCc7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT09IHVuZGVmaW5lZCAmJiAoIHR5cGVvZiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9IFxcJ251bWJlclxcJyB8fCAnO1xyXG4gIH1cclxuICBvdXQgKz0gJyAoZGl2aXNpb24nICsgKCRsdmwpICsgJyA9ICcgKyAoJGRhdGEpICsgJyAvICcgKyAoJHNjaGVtYVZhbHVlKSArICcsICc7XHJcbiAgaWYgKGl0Lm9wdHMubXVsdGlwbGVPZlByZWNpc2lvbikge1xyXG4gICAgb3V0ICs9ICcgTWF0aC5hYnMoTWF0aC5yb3VuZChkaXZpc2lvbicgKyAoJGx2bCkgKyAnKSAtIGRpdmlzaW9uJyArICgkbHZsKSArICcpID4gMWUtJyArIChpdC5vcHRzLm11bHRpcGxlT2ZQcmVjaXNpb24pICsgJyAnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyBkaXZpc2lvbicgKyAoJGx2bCkgKyAnICE9PSBwYXJzZUludChkaXZpc2lvbicgKyAoJGx2bCkgKyAnKSAnO1xyXG4gIH1cclxuICBvdXQgKz0gJyApICc7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnICApICAnO1xyXG4gIH1cclxuICBvdXQgKz0gJyApIHsgICAnO1xyXG4gIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcclxuICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdtdWx0aXBsZU9mJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBtdWx0aXBsZU9mOiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnIH0gJztcclxuICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBiZSBtdWx0aXBsZSBvZiAnO1xyXG4gICAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICAgIG91dCArPSAnXFwnICsgJyArICgkc2NoZW1hVmFsdWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hVmFsdWUpICsgJ1xcJyc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6ICAnO1xyXG4gICAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICAgIG91dCArPSAndmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWEpO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnICAgICAgICAgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9ICc7XHJcbiAgfSBlbHNlIHtcclxuICAgIG91dCArPSAnIHt9ICc7XHJcbiAgfVxyXG4gIHZhciBfX2VyciA9IG91dDtcclxuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xyXG4gIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChpdC5hc3luYykge1xyXG4gICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICB9XHJcbiAgb3V0ICs9ICd9ICc7XHJcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgIG91dCArPSAnIGVsc2UgeyAnO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBVUkkgPSByZXF1aXJlKCd1cmktanMnKVxyXG4gICwgZXF1YWwgPSByZXF1aXJlKCdmYXN0LWRlZXAtZXF1YWwnKVxyXG4gICwgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXHJcbiAgLCBTY2hlbWFPYmplY3QgPSByZXF1aXJlKCcuL3NjaGVtYV9vYmonKVxyXG4gICwgdHJhdmVyc2UgPSByZXF1aXJlKCdqc29uLXNjaGVtYS10cmF2ZXJzZScpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZXNvbHZlO1xyXG5cclxucmVzb2x2ZS5ub3JtYWxpemVJZCA9IG5vcm1hbGl6ZUlkO1xyXG5yZXNvbHZlLmZ1bGxQYXRoID0gZ2V0RnVsbFBhdGg7XHJcbnJlc29sdmUudXJsID0gcmVzb2x2ZVVybDtcclxucmVzb2x2ZS5pZHMgPSByZXNvbHZlSWRzO1xyXG5yZXNvbHZlLmlubGluZVJlZiA9IGlubGluZVJlZjtcclxucmVzb2x2ZS5zY2hlbWEgPSByZXNvbHZlU2NoZW1hO1xyXG5cclxuLyoqXHJcbiAqIFtyZXNvbHZlIGFuZCBjb21waWxlIHRoZSByZWZlcmVuY2VzICgkcmVmKV1cclxuICogQHRoaXMgICBBanZcclxuICogQHBhcmFtICB7RnVuY3Rpb259IGNvbXBpbGUgcmVmZXJlbmNlIHRvIHNjaGVtYSBjb21waWxhdGlvbiBmdW5jaXRvbiAobG9jYWxDb21waWxlKVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJvb3Qgb2JqZWN0IHdpdGggaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJvb3Qgc2NoZW1hIGZvciB0aGUgY3VycmVudCBzY2hlbWFcclxuICogQHBhcmFtICB7U3RyaW5nfSByZWYgcmVmZXJlbmNlIHRvIHJlc29sdmVcclxuICogQHJldHVybiB7T2JqZWN0fEZ1bmN0aW9ufSBzY2hlbWEgb2JqZWN0IChpZiB0aGUgc2NoZW1hIGNhbiBiZSBpbmxpbmVkKSBvciB2YWxpZGF0aW9uIGZ1bmN0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiByZXNvbHZlKGNvbXBpbGUsIHJvb3QsIHJlZikge1xyXG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cclxuICB2YXIgcmVmVmFsID0gdGhpcy5fcmVmc1tyZWZdO1xyXG4gIGlmICh0eXBlb2YgcmVmVmFsID09ICdzdHJpbmcnKSB7XHJcbiAgICBpZiAodGhpcy5fcmVmc1tyZWZWYWxdKSByZWZWYWwgPSB0aGlzLl9yZWZzW3JlZlZhbF07XHJcbiAgICBlbHNlIHJldHVybiByZXNvbHZlLmNhbGwodGhpcywgY29tcGlsZSwgcm9vdCwgcmVmVmFsKTtcclxuICB9XHJcblxyXG4gIHJlZlZhbCA9IHJlZlZhbCB8fCB0aGlzLl9zY2hlbWFzW3JlZl07XHJcbiAgaWYgKHJlZlZhbCBpbnN0YW5jZW9mIFNjaGVtYU9iamVjdCkge1xyXG4gICAgcmV0dXJuIGlubGluZVJlZihyZWZWYWwuc2NoZW1hLCB0aGlzLl9vcHRzLmlubGluZVJlZnMpXHJcbiAgICAgICAgICAgID8gcmVmVmFsLnNjaGVtYVxyXG4gICAgICAgICAgICA6IHJlZlZhbC52YWxpZGF0ZSB8fCB0aGlzLl9jb21waWxlKHJlZlZhbCk7XHJcbiAgfVxyXG5cclxuICB2YXIgcmVzID0gcmVzb2x2ZVNjaGVtYS5jYWxsKHRoaXMsIHJvb3QsIHJlZik7XHJcbiAgdmFyIHNjaGVtYSwgdiwgYmFzZUlkO1xyXG4gIGlmIChyZXMpIHtcclxuICAgIHNjaGVtYSA9IHJlcy5zY2hlbWE7XHJcbiAgICByb290ID0gcmVzLnJvb3Q7XHJcbiAgICBiYXNlSWQgPSByZXMuYmFzZUlkO1xyXG4gIH1cclxuXHJcbiAgaWYgKHNjaGVtYSBpbnN0YW5jZW9mIFNjaGVtYU9iamVjdCkge1xyXG4gICAgdiA9IHNjaGVtYS52YWxpZGF0ZSB8fCBjb21waWxlLmNhbGwodGhpcywgc2NoZW1hLnNjaGVtYSwgcm9vdCwgdW5kZWZpbmVkLCBiYXNlSWQpO1xyXG4gIH0gZWxzZSBpZiAoc2NoZW1hICE9PSB1bmRlZmluZWQpIHtcclxuICAgIHYgPSBpbmxpbmVSZWYoc2NoZW1hLCB0aGlzLl9vcHRzLmlubGluZVJlZnMpXHJcbiAgICAgICAgPyBzY2hlbWFcclxuICAgICAgICA6IGNvbXBpbGUuY2FsbCh0aGlzLCBzY2hlbWEsIHJvb3QsIHVuZGVmaW5lZCwgYmFzZUlkKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB2O1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFJlc29sdmUgc2NoZW1hLCBpdHMgcm9vdCBhbmQgYmFzZUlkXHJcbiAqIEB0aGlzIEFqdlxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJvb3Qgcm9vdCBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIHNjaGVtYSwgcmVmVmFsLCByZWZzXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gcmVmICByZWZlcmVuY2UgdG8gcmVzb2x2ZVxyXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9iamVjdCB3aXRoIHByb3BlcnRpZXMgc2NoZW1hLCByb290LCBiYXNlSWRcclxuICovXHJcbmZ1bmN0aW9uIHJlc29sdmVTY2hlbWEocm9vdCwgcmVmKSB7XHJcbiAgLyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xyXG4gIHZhciBwID0gVVJJLnBhcnNlKHJlZilcclxuICAgICwgcmVmUGF0aCA9IF9nZXRGdWxsUGF0aChwKVxyXG4gICAgLCBiYXNlSWQgPSBnZXRGdWxsUGF0aCh0aGlzLl9nZXRJZChyb290LnNjaGVtYSkpO1xyXG4gIGlmIChPYmplY3Qua2V5cyhyb290LnNjaGVtYSkubGVuZ3RoID09PSAwIHx8IHJlZlBhdGggIT09IGJhc2VJZCkge1xyXG4gICAgdmFyIGlkID0gbm9ybWFsaXplSWQocmVmUGF0aCk7XHJcbiAgICB2YXIgcmVmVmFsID0gdGhpcy5fcmVmc1tpZF07XHJcbiAgICBpZiAodHlwZW9mIHJlZlZhbCA9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gcmVzb2x2ZVJlY3Vyc2l2ZS5jYWxsKHRoaXMsIHJvb3QsIHJlZlZhbCwgcCk7XHJcbiAgICB9IGVsc2UgaWYgKHJlZlZhbCBpbnN0YW5jZW9mIFNjaGVtYU9iamVjdCkge1xyXG4gICAgICBpZiAoIXJlZlZhbC52YWxpZGF0ZSkgdGhpcy5fY29tcGlsZShyZWZWYWwpO1xyXG4gICAgICByb290ID0gcmVmVmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVmVmFsID0gdGhpcy5fc2NoZW1hc1tpZF07XHJcbiAgICAgIGlmIChyZWZWYWwgaW5zdGFuY2VvZiBTY2hlbWFPYmplY3QpIHtcclxuICAgICAgICBpZiAoIXJlZlZhbC52YWxpZGF0ZSkgdGhpcy5fY29tcGlsZShyZWZWYWwpO1xyXG4gICAgICAgIGlmIChpZCA9PSBub3JtYWxpemVJZChyZWYpKVxyXG4gICAgICAgICAgcmV0dXJuIHsgc2NoZW1hOiByZWZWYWwsIHJvb3Q6IHJvb3QsIGJhc2VJZDogYmFzZUlkIH07XHJcbiAgICAgICAgcm9vdCA9IHJlZlZhbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghcm9vdC5zY2hlbWEpIHJldHVybjtcclxuICAgIGJhc2VJZCA9IGdldEZ1bGxQYXRoKHRoaXMuX2dldElkKHJvb3Quc2NoZW1hKSk7XHJcbiAgfVxyXG4gIHJldHVybiBnZXRKc29uUG9pbnRlci5jYWxsKHRoaXMsIHAsIGJhc2VJZCwgcm9vdC5zY2hlbWEsIHJvb3QpO1xyXG59XHJcblxyXG5cclxuLyogQHRoaXMgQWp2ICovXHJcbmZ1bmN0aW9uIHJlc29sdmVSZWN1cnNpdmUocm9vdCwgcmVmLCBwYXJzZWRSZWYpIHtcclxuICAvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXHJcbiAgdmFyIHJlcyA9IHJlc29sdmVTY2hlbWEuY2FsbCh0aGlzLCByb290LCByZWYpO1xyXG4gIGlmIChyZXMpIHtcclxuICAgIHZhciBzY2hlbWEgPSByZXMuc2NoZW1hO1xyXG4gICAgdmFyIGJhc2VJZCA9IHJlcy5iYXNlSWQ7XHJcbiAgICByb290ID0gcmVzLnJvb3Q7XHJcbiAgICB2YXIgaWQgPSB0aGlzLl9nZXRJZChzY2hlbWEpO1xyXG4gICAgaWYgKGlkKSBiYXNlSWQgPSByZXNvbHZlVXJsKGJhc2VJZCwgaWQpO1xyXG4gICAgcmV0dXJuIGdldEpzb25Qb2ludGVyLmNhbGwodGhpcywgcGFyc2VkUmVmLCBiYXNlSWQsIHNjaGVtYSwgcm9vdCk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxudmFyIFBSRVZFTlRfU0NPUEVfQ0hBTkdFID0gdXRpbC50b0hhc2goWydwcm9wZXJ0aWVzJywgJ3BhdHRlcm5Qcm9wZXJ0aWVzJywgJ2VudW0nLCAnZGVwZW5kZW5jaWVzJywgJ2RlZmluaXRpb25zJ10pO1xyXG4vKiBAdGhpcyBBanYgKi9cclxuZnVuY3Rpb24gZ2V0SnNvblBvaW50ZXIocGFyc2VkUmVmLCBiYXNlSWQsIHNjaGVtYSwgcm9vdCkge1xyXG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cclxuICBwYXJzZWRSZWYuZnJhZ21lbnQgPSBwYXJzZWRSZWYuZnJhZ21lbnQgfHwgJyc7XHJcbiAgaWYgKHBhcnNlZFJlZi5mcmFnbWVudC5zbGljZSgwLDEpICE9ICcvJykgcmV0dXJuO1xyXG4gIHZhciBwYXJ0cyA9IHBhcnNlZFJlZi5mcmFnbWVudC5zcGxpdCgnLycpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMTsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgcGFydCA9IHBhcnRzW2ldO1xyXG4gICAgaWYgKHBhcnQpIHtcclxuICAgICAgcGFydCA9IHV0aWwudW5lc2NhcGVGcmFnbWVudChwYXJ0KTtcclxuICAgICAgc2NoZW1hID0gc2NoZW1hW3BhcnRdO1xyXG4gICAgICBpZiAoc2NoZW1hID09PSB1bmRlZmluZWQpIGJyZWFrO1xyXG4gICAgICB2YXIgaWQ7XHJcbiAgICAgIGlmICghUFJFVkVOVF9TQ09QRV9DSEFOR0VbcGFydF0pIHtcclxuICAgICAgICBpZCA9IHRoaXMuX2dldElkKHNjaGVtYSk7XHJcbiAgICAgICAgaWYgKGlkKSBiYXNlSWQgPSByZXNvbHZlVXJsKGJhc2VJZCwgaWQpO1xyXG4gICAgICAgIGlmIChzY2hlbWEuJHJlZikge1xyXG4gICAgICAgICAgdmFyICRyZWYgPSByZXNvbHZlVXJsKGJhc2VJZCwgc2NoZW1hLiRyZWYpO1xyXG4gICAgICAgICAgdmFyIHJlcyA9IHJlc29sdmVTY2hlbWEuY2FsbCh0aGlzLCByb290LCAkcmVmKTtcclxuICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgc2NoZW1hID0gcmVzLnNjaGVtYTtcclxuICAgICAgICAgICAgcm9vdCA9IHJlcy5yb290O1xyXG4gICAgICAgICAgICBiYXNlSWQgPSByZXMuYmFzZUlkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoc2NoZW1hICE9PSB1bmRlZmluZWQgJiYgc2NoZW1hICE9PSByb290LnNjaGVtYSlcclxuICAgIHJldHVybiB7IHNjaGVtYTogc2NoZW1hLCByb290OiByb290LCBiYXNlSWQ6IGJhc2VJZCB9O1xyXG59XHJcblxyXG5cclxudmFyIFNJTVBMRV9JTkxJTkVEID0gdXRpbC50b0hhc2goW1xyXG4gICd0eXBlJywgJ2Zvcm1hdCcsICdwYXR0ZXJuJyxcclxuICAnbWF4TGVuZ3RoJywgJ21pbkxlbmd0aCcsXHJcbiAgJ21heFByb3BlcnRpZXMnLCAnbWluUHJvcGVydGllcycsXHJcbiAgJ21heEl0ZW1zJywgJ21pbkl0ZW1zJyxcclxuICAnbWF4aW11bScsICdtaW5pbXVtJyxcclxuICAndW5pcXVlSXRlbXMnLCAnbXVsdGlwbGVPZicsXHJcbiAgJ3JlcXVpcmVkJywgJ2VudW0nXHJcbl0pO1xyXG5mdW5jdGlvbiBpbmxpbmVSZWYoc2NoZW1hLCBsaW1pdCkge1xyXG4gIGlmIChsaW1pdCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcclxuICBpZiAobGltaXQgPT09IHVuZGVmaW5lZCB8fCBsaW1pdCA9PT0gdHJ1ZSkgcmV0dXJuIGNoZWNrTm9SZWYoc2NoZW1hKTtcclxuICBlbHNlIGlmIChsaW1pdCkgcmV0dXJuIGNvdW50S2V5cyhzY2hlbWEpIDw9IGxpbWl0O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY2hlY2tOb1JlZihzY2hlbWEpIHtcclxuICB2YXIgaXRlbTtcclxuICBpZiAoQXJyYXkuaXNBcnJheShzY2hlbWEpKSB7XHJcbiAgICBmb3IgKHZhciBpPTA7IGk8c2NoZW1hLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGl0ZW0gPSBzY2hlbWFbaV07XHJcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PSAnb2JqZWN0JyAmJiAhY2hlY2tOb1JlZihpdGVtKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4gc2NoZW1hKSB7XHJcbiAgICAgIGlmIChrZXkgPT0gJyRyZWYnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGl0ZW0gPSBzY2hlbWFba2V5XTtcclxuICAgICAgaWYgKHR5cGVvZiBpdGVtID09ICdvYmplY3QnICYmICFjaGVja05vUmVmKGl0ZW0pKSByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gY291bnRLZXlzKHNjaGVtYSkge1xyXG4gIHZhciBjb3VudCA9IDAsIGl0ZW07XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkoc2NoZW1hKSkge1xyXG4gICAgZm9yICh2YXIgaT0wOyBpPHNjaGVtYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpdGVtID0gc2NoZW1hW2ldO1xyXG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT0gJ29iamVjdCcpIGNvdW50ICs9IGNvdW50S2V5cyhpdGVtKTtcclxuICAgICAgaWYgKGNvdW50ID09IEluZmluaXR5KSByZXR1cm4gSW5maW5pdHk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGZvciAodmFyIGtleSBpbiBzY2hlbWEpIHtcclxuICAgICAgaWYgKGtleSA9PSAnJHJlZicpIHJldHVybiBJbmZpbml0eTtcclxuICAgICAgaWYgKFNJTVBMRV9JTkxJTkVEW2tleV0pIHtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0gPSBzY2hlbWFba2V5XTtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW0gPT0gJ29iamVjdCcpIGNvdW50ICs9IGNvdW50S2V5cyhpdGVtKSArIDE7XHJcbiAgICAgICAgaWYgKGNvdW50ID09IEluZmluaXR5KSByZXR1cm4gSW5maW5pdHk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGNvdW50O1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0RnVsbFBhdGgoaWQsIG5vcm1hbGl6ZSkge1xyXG4gIGlmIChub3JtYWxpemUgIT09IGZhbHNlKSBpZCA9IG5vcm1hbGl6ZUlkKGlkKTtcclxuICB2YXIgcCA9IFVSSS5wYXJzZShpZCk7XHJcbiAgcmV0dXJuIF9nZXRGdWxsUGF0aChwKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIF9nZXRGdWxsUGF0aChwKSB7XHJcbiAgcmV0dXJuIFVSSS5zZXJpYWxpemUocCkuc3BsaXQoJyMnKVswXSArICcjJztcclxufVxyXG5cclxuXHJcbnZhciBUUkFJTElOR19TTEFTSF9IQVNIID0gLyNcXC8/JC87XHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZUlkKGlkKSB7XHJcbiAgcmV0dXJuIGlkID8gaWQucmVwbGFjZShUUkFJTElOR19TTEFTSF9IQVNILCAnJykgOiAnJztcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVVcmwoYmFzZUlkLCBpZCkge1xyXG4gIGlkID0gbm9ybWFsaXplSWQoaWQpO1xyXG4gIHJldHVybiBVUkkucmVzb2x2ZShiYXNlSWQsIGlkKTtcclxufVxyXG5cclxuXHJcbi8qIEB0aGlzIEFqdiAqL1xyXG5mdW5jdGlvbiByZXNvbHZlSWRzKHNjaGVtYSkge1xyXG4gIHZhciBzY2hlbWFJZCA9IG5vcm1hbGl6ZUlkKHRoaXMuX2dldElkKHNjaGVtYSkpO1xyXG4gIHZhciBiYXNlSWRzID0geycnOiBzY2hlbWFJZH07XHJcbiAgdmFyIGZ1bGxQYXRocyA9IHsnJzogZ2V0RnVsbFBhdGgoc2NoZW1hSWQsIGZhbHNlKX07XHJcbiAgdmFyIGxvY2FsUmVmcyA9IHt9O1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgdHJhdmVyc2Uoc2NoZW1hLCB7YWxsS2V5czogdHJ1ZX0sIGZ1bmN0aW9uKHNjaCwganNvblB0ciwgcm9vdFNjaGVtYSwgcGFyZW50SnNvblB0ciwgcGFyZW50S2V5d29yZCwgcGFyZW50U2NoZW1hLCBrZXlJbmRleCkge1xyXG4gICAgaWYgKGpzb25QdHIgPT09ICcnKSByZXR1cm47XHJcbiAgICB2YXIgaWQgPSBzZWxmLl9nZXRJZChzY2gpO1xyXG4gICAgdmFyIGJhc2VJZCA9IGJhc2VJZHNbcGFyZW50SnNvblB0cl07XHJcbiAgICB2YXIgZnVsbFBhdGggPSBmdWxsUGF0aHNbcGFyZW50SnNvblB0cl0gKyAnLycgKyBwYXJlbnRLZXl3b3JkO1xyXG4gICAgaWYgKGtleUluZGV4ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgIGZ1bGxQYXRoICs9ICcvJyArICh0eXBlb2Yga2V5SW5kZXggPT0gJ251bWJlcicgPyBrZXlJbmRleCA6IHV0aWwuZXNjYXBlRnJhZ21lbnQoa2V5SW5kZXgpKTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGlkID09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGlkID0gYmFzZUlkID0gbm9ybWFsaXplSWQoYmFzZUlkID8gVVJJLnJlc29sdmUoYmFzZUlkLCBpZCkgOiBpZCk7XHJcblxyXG4gICAgICB2YXIgcmVmVmFsID0gc2VsZi5fcmVmc1tpZF07XHJcbiAgICAgIGlmICh0eXBlb2YgcmVmVmFsID09ICdzdHJpbmcnKSByZWZWYWwgPSBzZWxmLl9yZWZzW3JlZlZhbF07XHJcbiAgICAgIGlmIChyZWZWYWwgJiYgcmVmVmFsLnNjaGVtYSkge1xyXG4gICAgICAgIGlmICghZXF1YWwoc2NoLCByZWZWYWwuc2NoZW1hKSlcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaWQgXCInICsgaWQgKyAnXCIgcmVzb2x2ZXMgdG8gbW9yZSB0aGFuIG9uZSBzY2hlbWEnKTtcclxuICAgICAgfSBlbHNlIGlmIChpZCAhPSBub3JtYWxpemVJZChmdWxsUGF0aCkpIHtcclxuICAgICAgICBpZiAoaWRbMF0gPT0gJyMnKSB7XHJcbiAgICAgICAgICBpZiAobG9jYWxSZWZzW2lkXSAmJiAhZXF1YWwoc2NoLCBsb2NhbFJlZnNbaWRdKSlcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpZCBcIicgKyBpZCArICdcIiByZXNvbHZlcyB0byBtb3JlIHRoYW4gb25lIHNjaGVtYScpO1xyXG4gICAgICAgICAgbG9jYWxSZWZzW2lkXSA9IHNjaDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VsZi5fcmVmc1tpZF0gPSBmdWxsUGF0aDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGJhc2VJZHNbanNvblB0cl0gPSBiYXNlSWQ7XHJcbiAgICBmdWxsUGF0aHNbanNvblB0cl0gPSBmdWxsUGF0aDtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGxvY2FsUmVmcztcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG52YXIgTWlzc2luZ1JlZkVycm9yID0gcmVxdWlyZSgnLi9lcnJvcl9jbGFzc2VzJykuTWlzc2luZ1JlZjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZUFzeW5jO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIHZhbGlkYXRpbmcgZnVuY3Rpb24gZm9yIHBhc3NlZCBzY2hlbWEgd2l0aCBhc3luY2hyb25vdXMgbG9hZGluZyBvZiBtaXNzaW5nIHNjaGVtYXMuXHJcbiAqIGBsb2FkU2NoZW1hYCBvcHRpb24gc2hvdWxkIGJlIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIHNjaGVtYSB1cmkgYW5kIHJldHVybnMgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHNjaGVtYS5cclxuICogQHRoaXMgIEFqdlxyXG4gKiBAcGFyYW0ge09iamVjdH0gICBzY2hlbWEgc2NoZW1hIG9iamVjdFxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBtZXRhIG9wdGlvbmFsIHRydWUgdG8gY29tcGlsZSBtZXRhLXNjaGVtYTsgdGhpcyBwYXJhbWV0ZXIgY2FuIGJlIHNraXBwZWRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYW4gb3B0aW9uYWwgbm9kZS1zdHlsZSBjYWxsYmFjaywgaXQgaXMgY2FsbGVkIHdpdGggMiBwYXJhbWV0ZXJzOiBlcnJvciAob3IgbnVsbCkgYW5kIHZhbGlkYXRpbmcgZnVuY3Rpb24uXHJcbiAqIEByZXR1cm4ge1Byb21pc2V9IHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIGEgdmFsaWRhdGluZyBmdW5jdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGNvbXBpbGVBc3luYyhzY2hlbWEsIG1ldGEsIGNhbGxiYWNrKSB7XHJcbiAgLyogZXNsaW50IG5vLXNoYWRvdzogMCAqL1xyXG4gIC8qIGdsb2JhbCBQcm9taXNlICovXHJcbiAgLyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICBpZiAodHlwZW9mIHRoaXMuX29wdHMubG9hZFNjaGVtYSAhPSAnZnVuY3Rpb24nKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdvcHRpb25zLmxvYWRTY2hlbWEgc2hvdWxkIGJlIGEgZnVuY3Rpb24nKTtcclxuXHJcbiAgaWYgKHR5cGVvZiBtZXRhID09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gbWV0YTtcclxuICAgIG1ldGEgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICB2YXIgcCA9IGxvYWRNZXRhU2NoZW1hT2Yoc2NoZW1hKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzY2hlbWFPYmogPSBzZWxmLl9hZGRTY2hlbWEoc2NoZW1hLCB1bmRlZmluZWQsIG1ldGEpO1xyXG4gICAgcmV0dXJuIHNjaGVtYU9iai52YWxpZGF0ZSB8fCBfY29tcGlsZUFzeW5jKHNjaGVtYU9iaik7XHJcbiAgfSk7XHJcblxyXG4gIGlmIChjYWxsYmFjaykge1xyXG4gICAgcC50aGVuKFxyXG4gICAgICBmdW5jdGlvbih2KSB7IGNhbGxiYWNrKG51bGwsIHYpOyB9LFxyXG4gICAgICBjYWxsYmFja1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBwO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gbG9hZE1ldGFTY2hlbWFPZihzY2gpIHtcclxuICAgIHZhciAkc2NoZW1hID0gc2NoLiRzY2hlbWE7XHJcbiAgICByZXR1cm4gJHNjaGVtYSAmJiAhc2VsZi5nZXRTY2hlbWEoJHNjaGVtYSlcclxuICAgICAgICAgICAgPyBjb21waWxlQXN5bmMuY2FsbChzZWxmLCB7ICRyZWY6ICRzY2hlbWEgfSwgdHJ1ZSlcclxuICAgICAgICAgICAgOiBQcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBfY29tcGlsZUFzeW5jKHNjaGVtYU9iaikge1xyXG4gICAgdHJ5IHsgcmV0dXJuIHNlbGYuX2NvbXBpbGUoc2NoZW1hT2JqKTsgfVxyXG4gICAgY2F0Y2goZSkge1xyXG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIE1pc3NpbmdSZWZFcnJvcikgcmV0dXJuIGxvYWRNaXNzaW5nU2NoZW1hKGUpO1xyXG4gICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkTWlzc2luZ1NjaGVtYShlKSB7XHJcbiAgICAgIHZhciByZWYgPSBlLm1pc3NpbmdTY2hlbWE7XHJcbiAgICAgIGlmIChhZGRlZChyZWYpKSB0aHJvdyBuZXcgRXJyb3IoJ1NjaGVtYSAnICsgcmVmICsgJyBpcyBsb2FkZWQgYnV0ICcgKyBlLm1pc3NpbmdSZWYgKyAnIGNhbm5vdCBiZSByZXNvbHZlZCcpO1xyXG5cclxuICAgICAgdmFyIHNjaGVtYVByb21pc2UgPSBzZWxmLl9sb2FkaW5nU2NoZW1hc1tyZWZdO1xyXG4gICAgICBpZiAoIXNjaGVtYVByb21pc2UpIHtcclxuICAgICAgICBzY2hlbWFQcm9taXNlID0gc2VsZi5fbG9hZGluZ1NjaGVtYXNbcmVmXSA9IHNlbGYuX29wdHMubG9hZFNjaGVtYShyZWYpO1xyXG4gICAgICAgIHNjaGVtYVByb21pc2UudGhlbihyZW1vdmVQcm9taXNlLCByZW1vdmVQcm9taXNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHNjaGVtYVByb21pc2UudGhlbihmdW5jdGlvbiAoc2NoKSB7XHJcbiAgICAgICAgaWYgKCFhZGRlZChyZWYpKSB7XHJcbiAgICAgICAgICByZXR1cm4gbG9hZE1ldGFTY2hlbWFPZihzY2gpLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIWFkZGVkKHJlZikpIHNlbGYuYWRkU2NoZW1hKHNjaCwgcmVmLCB1bmRlZmluZWQsIG1ldGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBfY29tcGlsZUFzeW5jKHNjaGVtYU9iaik7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZnVuY3Rpb24gcmVtb3ZlUHJvbWlzZSgpIHtcclxuICAgICAgICBkZWxldGUgc2VsZi5fbG9hZGluZ1NjaGVtYXNbcmVmXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gYWRkZWQocmVmKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuX3JlZnNbcmVmXSB8fCBzZWxmLl9zY2hlbWFzW3JlZl07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX3JlcXVpcmVkKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcclxuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxyXG4gICAgJHNjaGVtYVZhbHVlO1xyXG4gIGlmICgkaXNEYXRhKSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XHJcbiAgICAkc2NoZW1hVmFsdWUgPSAnc2NoZW1hJyArICRsdmw7XHJcbiAgfSBlbHNlIHtcclxuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XHJcbiAgfVxyXG4gIHZhciAkdlNjaGVtYSA9ICdzY2hlbWEnICsgJGx2bDtcclxuICBpZiAoISRpc0RhdGEpIHtcclxuICAgIGlmICgkc2NoZW1hLmxlbmd0aCA8IGl0Lm9wdHMubG9vcFJlcXVpcmVkICYmIGl0LnNjaGVtYS5wcm9wZXJ0aWVzICYmIE9iamVjdC5rZXlzKGl0LnNjaGVtYS5wcm9wZXJ0aWVzKS5sZW5ndGgpIHtcclxuICAgICAgdmFyICRyZXF1aXJlZCA9IFtdO1xyXG4gICAgICB2YXIgYXJyMSA9ICRzY2hlbWE7XHJcbiAgICAgIGlmIChhcnIxKSB7XHJcbiAgICAgICAgdmFyICRwcm9wZXJ0eSwgaTEgPSAtMSxcclxuICAgICAgICAgIGwxID0gYXJyMS5sZW5ndGggLSAxO1xyXG4gICAgICAgIHdoaWxlIChpMSA8IGwxKSB7XHJcbiAgICAgICAgICAkcHJvcGVydHkgPSBhcnIxW2kxICs9IDFdO1xyXG4gICAgICAgICAgdmFyICRwcm9wZXJ0eVNjaCA9IGl0LnNjaGVtYS5wcm9wZXJ0aWVzWyRwcm9wZXJ0eV07XHJcbiAgICAgICAgICBpZiAoISgkcHJvcGVydHlTY2ggJiYgaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkcHJvcGVydHlTY2gsIGl0LlJVTEVTLmFsbCkpKSB7XHJcbiAgICAgICAgICAgICRyZXF1aXJlZFskcmVxdWlyZWQubGVuZ3RoXSA9ICRwcm9wZXJ0eTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciAkcmVxdWlyZWQgPSAkc2NoZW1hO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoJGlzRGF0YSB8fCAkcmVxdWlyZWQubGVuZ3RoKSB7XHJcbiAgICB2YXIgJGN1cnJlbnRFcnJvclBhdGggPSBpdC5lcnJvclBhdGgsXHJcbiAgICAgICRsb29wUmVxdWlyZWQgPSAkaXNEYXRhIHx8ICRyZXF1aXJlZC5sZW5ndGggPj0gaXQub3B0cy5sb29wUmVxdWlyZWQsXHJcbiAgICAgICRvd25Qcm9wZXJ0aWVzID0gaXQub3B0cy5vd25Qcm9wZXJ0aWVzO1xyXG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgb3V0ICs9ICcgdmFyIG1pc3NpbmcnICsgKCRsdmwpICsgJzsgJztcclxuICAgICAgaWYgKCRsb29wUmVxdWlyZWQpIHtcclxuICAgICAgICBpZiAoISRpc0RhdGEpIHtcclxuICAgICAgICAgIG91dCArPSAnIHZhciAnICsgKCR2U2NoZW1hKSArICcgPSB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICc7ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkaSA9ICdpJyArICRsdmwsXHJcbiAgICAgICAgICAkcHJvcGVydHlQYXRoID0gJ3NjaGVtYScgKyAkbHZsICsgJ1snICsgJGkgKyAnXScsXHJcbiAgICAgICAgICAkbWlzc2luZ1Byb3BlcnR5ID0gJ1xcJyArICcgKyAkcHJvcGVydHlQYXRoICsgJyArIFxcJyc7XHJcbiAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoRXhwcigkY3VycmVudEVycm9yUGF0aCwgJHByb3BlcnR5UGF0aCwgaXQub3B0cy5qc29uUG9pbnRlcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdmFsaWQpICsgJyA9IHRydWU7ICc7XHJcbiAgICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICAgIG91dCArPSAnIGlmIChzY2hlbWEnICsgKCRsdmwpICsgJyA9PT0gdW5kZWZpbmVkKSAnICsgKCR2YWxpZCkgKyAnID0gdHJ1ZTsgZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoc2NoZW1hJyArICgkbHZsKSArICcpKSAnICsgKCR2YWxpZCkgKyAnID0gZmFsc2U7IGVsc2Ugeyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCArPSAnIGZvciAodmFyICcgKyAoJGkpICsgJyA9IDA7ICcgKyAoJGkpICsgJyA8ICcgKyAoJHZTY2hlbWEpICsgJy5sZW5ndGg7ICcgKyAoJGkpICsgJysrKSB7ICcgKyAoJHZhbGlkKSArICcgPSAnICsgKCRkYXRhKSArICdbJyArICgkdlNjaGVtYSkgKyAnWycgKyAoJGkpICsgJ11dICE9PSB1bmRlZmluZWQgJztcclxuICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcclxuICAgICAgICAgIG91dCArPSAnICYmICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgJyArICgkdlNjaGVtYSkgKyAnWycgKyAoJGkpICsgJ10pICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCArPSAnOyBpZiAoIScgKyAoJHZhbGlkKSArICcpIGJyZWFrOyB9ICc7XHJcbiAgICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICAgIG91dCArPSAnICB9ICAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgKz0gJyAgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgJztcclxuICAgICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgICAgICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgncmVxdWlyZWQnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IG1pc3NpbmdQcm9wZXJ0eTogXFwnJyArICgkbWlzc2luZ1Byb3BlcnR5KSArICdcXCcgfSAnO1xyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnJztcclxuICAgICAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnaXMgYSByZXF1aXJlZCBwcm9wZXJ0eSc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICdzaG91bGQgaGF2ZSByZXF1aXJlZCBwcm9wZXJ0eSBcXFxcXFwnJyArICgkbWlzc2luZ1Byb3BlcnR5KSArICdcXFxcXFwnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQgKz0gJ1xcJyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX19lcnIgPSBvdXQ7XHJcbiAgICAgICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICAgICAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCArPSAnIH0gZWxzZSB7ICc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICcgaWYgKCAnO1xyXG4gICAgICAgIHZhciBhcnIyID0gJHJlcXVpcmVkO1xyXG4gICAgICAgIGlmIChhcnIyKSB7XHJcbiAgICAgICAgICB2YXIgJHByb3BlcnR5S2V5LCAkaSA9IC0xLFxyXG4gICAgICAgICAgICBsMiA9IGFycjIubGVuZ3RoIC0gMTtcclxuICAgICAgICAgIHdoaWxlICgkaSA8IGwyKSB7XHJcbiAgICAgICAgICAgICRwcm9wZXJ0eUtleSA9IGFycjJbJGkgKz0gMV07XHJcbiAgICAgICAgICAgIGlmICgkaSkge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnIHx8ICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyICRwcm9wID0gaXQudXRpbC5nZXRQcm9wZXJ0eSgkcHJvcGVydHlLZXkpLFxyXG4gICAgICAgICAgICAgICR1c2VEYXRhID0gJGRhdGEgKyAkcHJvcDtcclxuICAgICAgICAgICAgb3V0ICs9ICcgKCAoICcgKyAoJHVzZURhdGEpICsgJyA9PT0gdW5kZWZpbmVkICc7XHJcbiAgICAgICAgICAgIGlmICgkb3duUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnIHx8ICEgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpKSArICdcXCcpICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0ICs9ICcpICYmIChtaXNzaW5nJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoaXQub3B0cy5qc29uUG9pbnRlcnMgPyAkcHJvcGVydHlLZXkgOiAkcHJvcCkpICsgJykgKSAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgKz0gJykgeyAgJztcclxuICAgICAgICB2YXIgJHByb3BlcnR5UGF0aCA9ICdtaXNzaW5nJyArICRsdmwsXHJcbiAgICAgICAgICAkbWlzc2luZ1Byb3BlcnR5ID0gJ1xcJyArICcgKyAkcHJvcGVydHlQYXRoICsgJyArIFxcJyc7XHJcbiAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgaXQuZXJyb3JQYXRoID0gaXQub3B0cy5qc29uUG9pbnRlcnMgPyBpdC51dGlsLmdldFBhdGhFeHByKCRjdXJyZW50RXJyb3JQYXRoLCAkcHJvcGVydHlQYXRoLCB0cnVlKSA6ICRjdXJyZW50RXJyb3JQYXRoICsgJyArICcgKyAkcHJvcGVydHlQYXRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgICAgICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XHJcbiAgICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgncmVxdWlyZWQnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IG1pc3NpbmdQcm9wZXJ0eTogXFwnJyArICgkbWlzc2luZ1Byb3BlcnR5KSArICdcXCcgfSAnO1xyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnJztcclxuICAgICAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnaXMgYSByZXF1aXJlZCBwcm9wZXJ0eSc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICdzaG91bGQgaGF2ZSByZXF1aXJlZCBwcm9wZXJ0eSBcXFxcXFwnJyArICgkbWlzc2luZ1Byb3BlcnR5KSArICdcXFxcXFwnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQgKz0gJ1xcJyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgX19lcnIgPSBvdXQ7XHJcbiAgICAgICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICAgICAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCArPSAnIH0gZWxzZSB7ICc7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICgkbG9vcFJlcXVpcmVkKSB7XHJcbiAgICAgICAgaWYgKCEkaXNEYXRhKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdlNjaGVtYSkgKyAnID0gdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnOyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJGkgPSAnaScgKyAkbHZsLFxyXG4gICAgICAgICAgJHByb3BlcnR5UGF0aCA9ICdzY2hlbWEnICsgJGx2bCArICdbJyArICRpICsgJ10nLFxyXG4gICAgICAgICAgJG1pc3NpbmdQcm9wZXJ0eSA9ICdcXCcgKyAnICsgJHByb3BlcnR5UGF0aCArICcgKyBcXCcnO1xyXG4gICAgICAgIGlmIChpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkpIHtcclxuICAgICAgICAgIGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aEV4cHIoJGN1cnJlbnRFcnJvclBhdGgsICRwcm9wZXJ0eVBhdGgsIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCR2U2NoZW1hKSArICcgJiYgIUFycmF5LmlzQXJyYXkoJyArICgkdlNjaGVtYSkgKyAnKSkgeyAgdmFyIGVyciA9ICAgJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgncmVxdWlyZWQnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IG1pc3NpbmdQcm9wZXJ0eTogXFwnJyArICgkbWlzc2luZ1Byb3BlcnR5KSArICdcXCcgfSAnO1xyXG4gICAgICAgICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJyc7XHJcbiAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgb3V0ICs9ICdpcyBhIHJlcXVpcmVkIHByb3BlcnR5JztcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0ICs9ICdzaG91bGQgaGF2ZSByZXF1aXJlZCBwcm9wZXJ0eSBcXFxcXFwnJyArICgkbWlzc2luZ1Byb3BlcnR5KSArICdcXFxcXFwnJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgb3V0ICs9ICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgfSBlbHNlIGlmICgnICsgKCR2U2NoZW1hKSArICcgIT09IHVuZGVmaW5lZCkgeyAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgKz0gJyBmb3IgKHZhciAnICsgKCRpKSArICcgPSAwOyAnICsgKCRpKSArICcgPCAnICsgKCR2U2NoZW1hKSArICcubGVuZ3RoOyAnICsgKCRpKSArICcrKykgeyBpZiAoJyArICgkZGF0YSkgKyAnWycgKyAoJHZTY2hlbWEpICsgJ1snICsgKCRpKSArICddXSA9PT0gdW5kZWZpbmVkICc7XHJcbiAgICAgICAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyB8fCAhIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCgnICsgKCRkYXRhKSArICcsICcgKyAoJHZTY2hlbWEpICsgJ1snICsgKCRpKSArICddKSAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXQgKz0gJykgeyAgdmFyIGVyciA9ICAgJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdyZXF1aXJlZCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJyB9ICc7XHJcbiAgICAgICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCcnO1xyXG4gICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICdpcyBhIHJlcXVpcmVkIHByb3BlcnR5JztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJ3Nob3VsZCBoYXZlIHJlcXVpcmVkIHByb3BlcnR5IFxcXFxcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcXFxcXCcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dCArPSAnXFwnICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG91dCArPSAnIHt9ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7IH0gfSAnO1xyXG4gICAgICAgIGlmICgkaXNEYXRhKSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyAgfSAgJztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGFycjMgPSAkcmVxdWlyZWQ7XHJcbiAgICAgICAgaWYgKGFycjMpIHtcclxuICAgICAgICAgIHZhciAkcHJvcGVydHlLZXksIGkzID0gLTEsXHJcbiAgICAgICAgICAgIGwzID0gYXJyMy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgd2hpbGUgKGkzIDwgbDMpIHtcclxuICAgICAgICAgICAgJHByb3BlcnR5S2V5ID0gYXJyM1tpMyArPSAxXTtcclxuICAgICAgICAgICAgdmFyICRwcm9wID0gaXQudXRpbC5nZXRQcm9wZXJ0eSgkcHJvcGVydHlLZXkpLFxyXG4gICAgICAgICAgICAgICRtaXNzaW5nUHJvcGVydHkgPSBpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpLFxyXG4gICAgICAgICAgICAgICR1c2VEYXRhID0gJGRhdGEgKyAkcHJvcDtcclxuICAgICAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgIGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aCgkY3VycmVudEVycm9yUGF0aCwgJHByb3BlcnR5S2V5LCBpdC5vcHRzLmpzb25Qb2ludGVycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCAnICsgKCR1c2VEYXRhKSArICcgPT09IHVuZGVmaW5lZCAnO1xyXG4gICAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyB8fCAhIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCgnICsgKCRkYXRhKSArICcsIFxcJycgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJHByb3BlcnR5S2V5KSkgKyAnXFwnKSAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dCArPSAnKSB7ICB2YXIgZXJyID0gICAnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgncmVxdWlyZWQnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IG1pc3NpbmdQcm9wZXJ0eTogXFwnJyArICgkbWlzc2luZ1Byb3BlcnR5KSArICdcXCcgfSAnO1xyXG4gICAgICAgICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICBvdXQgKz0gJ2lzIGEgcmVxdWlyZWQgcHJvcGVydHknO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICdzaG91bGQgaGF2ZSByZXF1aXJlZCBwcm9wZXJ0eSBcXFxcXFwnJyArICgkbWlzc2luZ1Byb3BlcnR5KSArICdcXFxcXFwnJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dCArPSAnXFwnICc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7IH0gJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGl0LmVycm9yUGF0aCA9ICRjdXJyZW50RXJyb3JQYXRoO1xyXG4gIH0gZWxzZSBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgb3V0ICs9ICcgaWYgKHRydWUpIHsnO1xyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9kZXBlbmRlbmNpZXMoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xyXG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgdmFyICRlcnJzID0gJ2VycnNfXycgKyAkbHZsO1xyXG4gIHZhciAkaXQgPSBpdC51dGlsLmNvcHkoaXQpO1xyXG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xyXG4gICRpdC5sZXZlbCsrO1xyXG4gIHZhciAkbmV4dFZhbGlkID0gJ3ZhbGlkJyArICRpdC5sZXZlbDtcclxuICB2YXIgJHNjaGVtYURlcHMgPSB7fSxcclxuICAgICRwcm9wZXJ0eURlcHMgPSB7fSxcclxuICAgICRvd25Qcm9wZXJ0aWVzID0gaXQub3B0cy5vd25Qcm9wZXJ0aWVzO1xyXG4gIGZvciAoJHByb3BlcnR5IGluICRzY2hlbWEpIHtcclxuICAgIHZhciAkc2NoID0gJHNjaGVtYVskcHJvcGVydHldO1xyXG4gICAgdmFyICRkZXBzID0gQXJyYXkuaXNBcnJheSgkc2NoKSA/ICRwcm9wZXJ0eURlcHMgOiAkc2NoZW1hRGVwcztcclxuICAgICRkZXBzWyRwcm9wZXJ0eV0gPSAkc2NoO1xyXG4gIH1cclxuICBvdXQgKz0gJ3ZhciAnICsgKCRlcnJzKSArICcgPSBlcnJvcnM7JztcclxuICB2YXIgJGN1cnJlbnRFcnJvclBhdGggPSBpdC5lcnJvclBhdGg7XHJcbiAgb3V0ICs9ICd2YXIgbWlzc2luZycgKyAoJGx2bCkgKyAnOyc7XHJcbiAgZm9yICh2YXIgJHByb3BlcnR5IGluICRwcm9wZXJ0eURlcHMpIHtcclxuICAgICRkZXBzID0gJHByb3BlcnR5RGVwc1skcHJvcGVydHldO1xyXG4gICAgaWYgKCRkZXBzLmxlbmd0aCkge1xyXG4gICAgICBvdXQgKz0gJyBpZiAoICcgKyAoJGRhdGEpICsgKGl0LnV0aWwuZ2V0UHJvcGVydHkoJHByb3BlcnR5KSkgKyAnICE9PSB1bmRlZmluZWQgJztcclxuICAgICAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHkpKSArICdcXCcpICc7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICBvdXQgKz0gJyAmJiAoICc7XHJcbiAgICAgICAgdmFyIGFycjEgPSAkZGVwcztcclxuICAgICAgICBpZiAoYXJyMSkge1xyXG4gICAgICAgICAgdmFyICRwcm9wZXJ0eUtleSwgJGkgPSAtMSxcclxuICAgICAgICAgICAgbDEgPSBhcnIxLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICB3aGlsZSAoJGkgPCBsMSkge1xyXG4gICAgICAgICAgICAkcHJvcGVydHlLZXkgPSBhcnIxWyRpICs9IDFdO1xyXG4gICAgICAgICAgICBpZiAoJGkpIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyB8fCAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciAkcHJvcCA9IGl0LnV0aWwuZ2V0UHJvcGVydHkoJHByb3BlcnR5S2V5KSxcclxuICAgICAgICAgICAgICAkdXNlRGF0YSA9ICRkYXRhICsgJHByb3A7XHJcbiAgICAgICAgICAgIG91dCArPSAnICggKCAnICsgKCR1c2VEYXRhKSArICcgPT09IHVuZGVmaW5lZCAnO1xyXG4gICAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyB8fCAhIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCgnICsgKCRkYXRhKSArICcsIFxcJycgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJHByb3BlcnR5S2V5KSkgKyAnXFwnKSAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dCArPSAnKSAmJiAobWlzc2luZycgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKGl0Lm9wdHMuanNvblBvaW50ZXJzID8gJHByb3BlcnR5S2V5IDogJHByb3ApKSArICcpICkgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0ICs9ICcpKSB7ICAnO1xyXG4gICAgICAgIHZhciAkcHJvcGVydHlQYXRoID0gJ21pc3NpbmcnICsgJGx2bCxcclxuICAgICAgICAgICRtaXNzaW5nUHJvcGVydHkgPSAnXFwnICsgJyArICRwcm9wZXJ0eVBhdGggKyAnICsgXFwnJztcclxuICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XHJcbiAgICAgICAgICBpdC5lcnJvclBhdGggPSBpdC5vcHRzLmpzb25Qb2ludGVycyA/IGl0LnV0aWwuZ2V0UGF0aEV4cHIoJGN1cnJlbnRFcnJvclBhdGgsICRwcm9wZXJ0eVBhdGgsIHRydWUpIDogJGN1cnJlbnRFcnJvclBhdGggKyAnICsgJyArICRwcm9wZXJ0eVBhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcclxuICAgICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgICAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdkZXBlbmRlbmNpZXMnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IHByb3BlcnR5OiBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eSkpICsgJ1xcJywgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJywgZGVwc0NvdW50OiAnICsgKCRkZXBzLmxlbmd0aCkgKyAnLCBkZXBzOiBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRkZXBzLmxlbmd0aCA9PSAxID8gJGRlcHNbMF0gOiAkZGVwcy5qb2luKFwiLCBcIikpKSArICdcXCcgfSAnO1xyXG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIGhhdmUgJztcclxuICAgICAgICAgICAgaWYgKCRkZXBzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICdwcm9wZXJ0eSAnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRkZXBzWzBdKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICdwcm9wZXJ0aWVzICcgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJGRlcHMuam9pbihcIiwgXCIpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0ICs9ICcgd2hlbiBwcm9wZXJ0eSAnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eSkpICsgJyBpcyBwcmVzZW50XFwnICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG91dCArPSAnIHt9ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBfX2VyciA9IG91dDtcclxuICAgICAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xyXG4gICAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgIGlmIChpdC5hc3luYykge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3V0ICs9ICcgKSB7ICc7XHJcbiAgICAgICAgdmFyIGFycjIgPSAkZGVwcztcclxuICAgICAgICBpZiAoYXJyMikge1xyXG4gICAgICAgICAgdmFyICRwcm9wZXJ0eUtleSwgaTIgPSAtMSxcclxuICAgICAgICAgICAgbDIgPSBhcnIyLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICB3aGlsZSAoaTIgPCBsMikge1xyXG4gICAgICAgICAgICAkcHJvcGVydHlLZXkgPSBhcnIyW2kyICs9IDFdO1xyXG4gICAgICAgICAgICB2YXIgJHByb3AgPSBpdC51dGlsLmdldFByb3BlcnR5KCRwcm9wZXJ0eUtleSksXHJcbiAgICAgICAgICAgICAgJG1pc3NpbmdQcm9wZXJ0eSA9IGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eUtleSksXHJcbiAgICAgICAgICAgICAgJHVzZURhdGEgPSAkZGF0YSArICRwcm9wO1xyXG4gICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoKCRjdXJyZW50RXJyb3JQYXRoLCAkcHJvcGVydHlLZXksIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQgKz0gJyBpZiAoICcgKyAoJHVzZURhdGEpICsgJyA9PT0gdW5kZWZpbmVkICc7XHJcbiAgICAgICAgICAgIGlmICgkb3duUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnIHx8ICEgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpKSArICdcXCcpICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0ICs9ICcpIHsgIHZhciBlcnIgPSAgICc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgICAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdkZXBlbmRlbmNpZXMnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IHByb3BlcnR5OiBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eSkpICsgJ1xcJywgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJywgZGVwc0NvdW50OiAnICsgKCRkZXBzLmxlbmd0aCkgKyAnLCBkZXBzOiBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRkZXBzLmxlbmd0aCA9PSAxID8gJGRlcHNbMF0gOiAkZGVwcy5qb2luKFwiLCBcIikpKSArICdcXCcgfSAnO1xyXG4gICAgICAgICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgaGF2ZSAnO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRkZXBzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIG91dCArPSAncHJvcGVydHkgJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkZGVwc1swXSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICdwcm9wZXJ0aWVzICcgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJGRlcHMuam9pbihcIiwgXCIpKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyB3aGVuIHByb3BlcnR5ICcgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJHByb3BlcnR5KSkgKyAnIGlzIHByZXNlbnRcXCcgJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xyXG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnIHt9ICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0ICs9ICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgfSAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyB9ICAgJztcclxuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAkY2xvc2luZ0JyYWNlcyArPSAnfSc7XHJcbiAgICAgICAgb3V0ICs9ICcgZWxzZSB7ICc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaXQuZXJyb3JQYXRoID0gJGN1cnJlbnRFcnJvclBhdGg7XHJcbiAgdmFyICRjdXJyZW50QmFzZUlkID0gJGl0LmJhc2VJZDtcclxuICBmb3IgKHZhciAkcHJvcGVydHkgaW4gJHNjaGVtYURlcHMpIHtcclxuICAgIHZhciAkc2NoID0gJHNjaGVtYURlcHNbJHByb3BlcnR5XTtcclxuICAgIGlmIChpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRzY2gsIGl0LlJVTEVTLmFsbCkpIHtcclxuICAgICAgb3V0ICs9ICcgJyArICgkbmV4dFZhbGlkKSArICcgPSB0cnVlOyBpZiAoICcgKyAoJGRhdGEpICsgKGl0LnV0aWwuZ2V0UHJvcGVydHkoJHByb3BlcnR5KSkgKyAnICE9PSB1bmRlZmluZWQgJztcclxuICAgICAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHkpKSArICdcXCcpICc7XHJcbiAgICAgIH1cclxuICAgICAgb3V0ICs9ICcpIHsgJztcclxuICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XHJcbiAgICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRwcm9wZXJ0eSk7XHJcbiAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGggKyAnLycgKyBpdC51dGlsLmVzY2FwZUZyYWdtZW50KCRwcm9wZXJ0eSk7XHJcbiAgICAgIG91dCArPSAnICAnICsgKGl0LnZhbGlkYXRlKCRpdCkpICsgJyAnO1xyXG4gICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XHJcbiAgICAgIG91dCArPSAnIH0gICc7XHJcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICc7XHJcbiAgICAgICAgJGNsb3NpbmdCcmFjZXMgKz0gJ30nO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICBvdXQgKz0gJyAgICcgKyAoJGNsb3NpbmdCcmFjZXMpICsgJyBpZiAoJyArICgkZXJycykgKyAnID09IGVycm9ycykgeyc7XHJcbiAgfVxyXG4gIG91dCA9IGl0LnV0aWwuY2xlYW5VcENvZGUob3V0KTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVtYU9iamVjdDtcclxuXHJcbmZ1bmN0aW9uIFNjaGVtYU9iamVjdChvYmopIHtcclxuICB1dGlsLmNvcHkob2JqLCB0aGlzKTtcclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfX2xpbWl0KGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XHJcbiAgdmFyIG91dCA9ICcgJztcclxuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xyXG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcclxuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XHJcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xyXG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcclxuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcclxuICB2YXIgJGVycm9yS2V5d29yZDtcclxuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xyXG4gIHZhciAkaXNEYXRhID0gaXQub3B0cy4kZGF0YSAmJiAkc2NoZW1hICYmICRzY2hlbWEuJGRhdGEsXHJcbiAgICAkc2NoZW1hVmFsdWU7XHJcbiAgaWYgKCRpc0RhdGEpIHtcclxuICAgIG91dCArPSAnIHZhciBzY2hlbWEnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC5nZXREYXRhKCRzY2hlbWEuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFycikpICsgJzsgJztcclxuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcclxuICB9IGVsc2Uge1xyXG4gICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYTtcclxuICB9XHJcbiAgdmFyICRpc01heCA9ICRrZXl3b3JkID09ICdtYXhpbXVtJyxcclxuICAgICRleGNsdXNpdmVLZXl3b3JkID0gJGlzTWF4ID8gJ2V4Y2x1c2l2ZU1heGltdW0nIDogJ2V4Y2x1c2l2ZU1pbmltdW0nLFxyXG4gICAgJHNjaGVtYUV4Y2wgPSBpdC5zY2hlbWFbJGV4Y2x1c2l2ZUtleXdvcmRdLFxyXG4gICAgJGlzRGF0YUV4Y2wgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWFFeGNsICYmICRzY2hlbWFFeGNsLiRkYXRhLFxyXG4gICAgJG9wID0gJGlzTWF4ID8gJzwnIDogJz4nLFxyXG4gICAgJG5vdE9wID0gJGlzTWF4ID8gJz4nIDogJzwnLFxyXG4gICAgJGVycm9yS2V5d29yZCA9IHVuZGVmaW5lZDtcclxuICBpZiAoJGlzRGF0YUV4Y2wpIHtcclxuICAgIHZhciAkc2NoZW1hVmFsdWVFeGNsID0gaXQudXRpbC5nZXREYXRhKCRzY2hlbWFFeGNsLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpLFxyXG4gICAgICAkZXhjbHVzaXZlID0gJ2V4Y2x1c2l2ZScgKyAkbHZsLFxyXG4gICAgICAkZXhjbFR5cGUgPSAnZXhjbFR5cGUnICsgJGx2bCxcclxuICAgICAgJGV4Y2xJc051bWJlciA9ICdleGNsSXNOdW1iZXInICsgJGx2bCxcclxuICAgICAgJG9wRXhwciA9ICdvcCcgKyAkbHZsLFxyXG4gICAgICAkb3BTdHIgPSAnXFwnICsgJyArICRvcEV4cHIgKyAnICsgXFwnJztcclxuICAgIG91dCArPSAnIHZhciBzY2hlbWFFeGNsJyArICgkbHZsKSArICcgPSAnICsgKCRzY2hlbWFWYWx1ZUV4Y2wpICsgJzsgJztcclxuICAgICRzY2hlbWFWYWx1ZUV4Y2wgPSAnc2NoZW1hRXhjbCcgKyAkbHZsO1xyXG4gICAgb3V0ICs9ICcgdmFyICcgKyAoJGV4Y2x1c2l2ZSkgKyAnOyB2YXIgJyArICgkZXhjbFR5cGUpICsgJyA9IHR5cGVvZiAnICsgKCRzY2hlbWFWYWx1ZUV4Y2wpICsgJzsgaWYgKCcgKyAoJGV4Y2xUeXBlKSArICcgIT0gXFwnYm9vbGVhblxcJyAmJiAnICsgKCRleGNsVHlwZSkgKyAnICE9IFxcJ3VuZGVmaW5lZFxcJyAmJiAnICsgKCRleGNsVHlwZSkgKyAnICE9IFxcJ251bWJlclxcJykgeyAnO1xyXG4gICAgdmFyICRlcnJvcktleXdvcmQgPSAkZXhjbHVzaXZlS2V5d29yZDtcclxuICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcclxuICAgICQkb3V0U3RhY2sucHVzaChvdXQpO1xyXG4gICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xyXG4gICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAnX2V4Y2x1c2l2ZUxpbWl0JykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczoge30gJztcclxuICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCcnICsgKCRleGNsdXNpdmVLZXl3b3JkKSArICcgc2hvdWxkIGJlIGJvb2xlYW5cXCcgJztcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgfVxyXG4gICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyB9IGVsc2UgaWYgKCAnO1xyXG4gICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgb3V0ICs9ICcgKCcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPSBcXCdudW1iZXJcXCcpIHx8ICc7XHJcbiAgICB9XHJcbiAgICBvdXQgKz0gJyAnICsgKCRleGNsVHlwZSkgKyAnID09IFxcJ251bWJlclxcJyA/ICggKCcgKyAoJGV4Y2x1c2l2ZSkgKyAnID0gJyArICgkc2NoZW1hVmFsdWUpICsgJyA9PT0gdW5kZWZpbmVkIHx8ICcgKyAoJHNjaGVtYVZhbHVlRXhjbCkgKyAnICcgKyAoJG9wKSArICc9ICcgKyAoJHNjaGVtYVZhbHVlKSArICcpID8gJyArICgkZGF0YSkgKyAnICcgKyAoJG5vdE9wKSArICc9ICcgKyAoJHNjaGVtYVZhbHVlRXhjbCkgKyAnIDogJyArICgkZGF0YSkgKyAnICcgKyAoJG5vdE9wKSArICcgJyArICgkc2NoZW1hVmFsdWUpICsgJyApIDogKCAoJyArICgkZXhjbHVzaXZlKSArICcgPSAnICsgKCRzY2hlbWFWYWx1ZUV4Y2wpICsgJyA9PT0gdHJ1ZSkgPyAnICsgKCRkYXRhKSArICcgJyArICgkbm90T3ApICsgJz0gJyArICgkc2NoZW1hVmFsdWUpICsgJyA6ICcgKyAoJGRhdGEpICsgJyAnICsgKCRub3RPcCkgKyAnICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKSB8fCAnICsgKCRkYXRhKSArICcgIT09ICcgKyAoJGRhdGEpICsgJykgeyB2YXIgb3AnICsgKCRsdmwpICsgJyA9ICcgKyAoJGV4Y2x1c2l2ZSkgKyAnID8gXFwnJyArICgkb3ApICsgJ1xcJyA6IFxcJycgKyAoJG9wKSArICc9XFwnOyAnO1xyXG4gICAgaWYgKCRzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAkZXJyb3JLZXl3b3JkID0gJGV4Y2x1c2l2ZUtleXdvcmQ7XHJcbiAgICAgICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRleGNsdXNpdmVLZXl3b3JkO1xyXG4gICAgICAkc2NoZW1hVmFsdWUgPSAkc2NoZW1hVmFsdWVFeGNsO1xyXG4gICAgICAkaXNEYXRhID0gJGlzRGF0YUV4Y2w7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciAkZXhjbElzTnVtYmVyID0gdHlwZW9mICRzY2hlbWFFeGNsID09ICdudW1iZXInLFxyXG4gICAgICAkb3BTdHIgPSAkb3A7XHJcbiAgICBpZiAoJGV4Y2xJc051bWJlciAmJiAkaXNEYXRhKSB7XHJcbiAgICAgIHZhciAkb3BFeHByID0gJ1xcJycgKyAkb3BTdHIgKyAnXFwnJztcclxuICAgICAgb3V0ICs9ICcgaWYgKCAnO1xyXG4gICAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnbnVtYmVyXFwnKSB8fCAnO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnICggJyArICgkc2NoZW1hVmFsdWUpICsgJyA9PT0gdW5kZWZpbmVkIHx8ICcgKyAoJHNjaGVtYUV4Y2wpICsgJyAnICsgKCRvcCkgKyAnPSAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnID8gJyArICgkZGF0YSkgKyAnICcgKyAoJG5vdE9wKSArICc9ICcgKyAoJHNjaGVtYUV4Y2wpICsgJyA6ICcgKyAoJGRhdGEpICsgJyAnICsgKCRub3RPcCkgKyAnICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKSB8fCAnICsgKCRkYXRhKSArICcgIT09ICcgKyAoJGRhdGEpICsgJykgeyAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKCRleGNsSXNOdW1iZXIgJiYgJHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgJGV4Y2x1c2l2ZSA9IHRydWU7XHJcbiAgICAgICAgJGVycm9yS2V5d29yZCA9ICRleGNsdXNpdmVLZXl3b3JkO1xyXG4gICAgICAgICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRleGNsdXNpdmVLZXl3b3JkO1xyXG4gICAgICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWFFeGNsO1xyXG4gICAgICAgICRub3RPcCArPSAnPSc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCRleGNsSXNOdW1iZXIpICRzY2hlbWFWYWx1ZSA9IE1hdGhbJGlzTWF4ID8gJ21pbicgOiAnbWF4J10oJHNjaGVtYUV4Y2wsICRzY2hlbWEpO1xyXG4gICAgICAgIGlmICgkc2NoZW1hRXhjbCA9PT0gKCRleGNsSXNOdW1iZXIgPyAkc2NoZW1hVmFsdWUgOiB0cnVlKSkge1xyXG4gICAgICAgICAgJGV4Y2x1c2l2ZSA9IHRydWU7XHJcbiAgICAgICAgICAkZXJyb3JLZXl3b3JkID0gJGV4Y2x1c2l2ZUtleXdvcmQ7XHJcbiAgICAgICAgICAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAkZXhjbHVzaXZlS2V5d29yZDtcclxuICAgICAgICAgICRub3RPcCArPSAnPSc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICRleGNsdXNpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICRvcFN0ciArPSAnPSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHZhciAkb3BFeHByID0gJ1xcJycgKyAkb3BTdHIgKyAnXFwnJztcclxuICAgICAgb3V0ICs9ICcgaWYgKCAnO1xyXG4gICAgICBpZiAoJGlzRGF0YSkge1xyXG4gICAgICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnbnVtYmVyXFwnKSB8fCAnO1xyXG4gICAgICB9XHJcbiAgICAgIG91dCArPSAnICcgKyAoJGRhdGEpICsgJyAnICsgKCRub3RPcCkgKyAnICcgKyAoJHNjaGVtYVZhbHVlKSArICcgfHwgJyArICgkZGF0YSkgKyAnICE9PSAnICsgKCRkYXRhKSArICcpIHsgJztcclxuICAgIH1cclxuICB9XHJcbiAgJGVycm9yS2V5d29yZCA9ICRlcnJvcktleXdvcmQgfHwgJGtleXdvcmQ7XHJcbiAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICQkb3V0U3RhY2sucHVzaChvdXQpO1xyXG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAnX2xpbWl0JykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBjb21wYXJpc29uOiAnICsgKCRvcEV4cHIpICsgJywgbGltaXQ6ICcgKyAoJHNjaGVtYVZhbHVlKSArICcsIGV4Y2x1c2l2ZTogJyArICgkZXhjbHVzaXZlKSArICcgfSAnO1xyXG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XHJcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIGJlICcgKyAoJG9wU3RyKSArICcgJztcclxuICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICBvdXQgKz0gJ1xcJyArICcgKyAoJHNjaGVtYVZhbHVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvdXQgKz0gJycgKyAoJHNjaGVtYVZhbHVlKSArICdcXCcnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XHJcbiAgICAgIG91dCArPSAnICwgc2NoZW1hOiAgJztcclxuICAgICAgaWYgKCRpc0RhdGEpIHtcclxuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hKTtcclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyAgICAgICAgICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgfSAnO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB7fSAnO1xyXG4gIH1cclxuICB2YXIgX19lcnIgPSBvdXQ7XHJcbiAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgfVxyXG4gIG91dCArPSAnIH0gJztcclxuICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgb3V0ICs9ICcgZWxzZSB7ICc7XHJcbiAgfVxyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX3Byb3BlcnRpZXMoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcclxuICB2YXIgb3V0ID0gJyAnO1xyXG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XHJcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xyXG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcclxuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XHJcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xyXG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xyXG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XHJcbiAgdmFyICRlcnJzID0gJ2VycnNfXycgKyAkbHZsO1xyXG4gIHZhciAkaXQgPSBpdC51dGlsLmNvcHkoaXQpO1xyXG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xyXG4gICRpdC5sZXZlbCsrO1xyXG4gIHZhciAkbmV4dFZhbGlkID0gJ3ZhbGlkJyArICRpdC5sZXZlbDtcclxuICB2YXIgJGtleSA9ICdrZXknICsgJGx2bCxcclxuICAgICRpZHggPSAnaWR4JyArICRsdmwsXHJcbiAgICAkZGF0YU54dCA9ICRpdC5kYXRhTGV2ZWwgPSBpdC5kYXRhTGV2ZWwgKyAxLFxyXG4gICAgJG5leHREYXRhID0gJ2RhdGEnICsgJGRhdGFOeHQsXHJcbiAgICAkZGF0YVByb3BlcnRpZXMgPSAnZGF0YVByb3BlcnRpZXMnICsgJGx2bDtcclxuICB2YXIgJHNjaGVtYUtleXMgPSBPYmplY3Qua2V5cygkc2NoZW1hIHx8IHt9KSxcclxuICAgICRwUHJvcGVydGllcyA9IGl0LnNjaGVtYS5wYXR0ZXJuUHJvcGVydGllcyB8fCB7fSxcclxuICAgICRwUHJvcGVydHlLZXlzID0gT2JqZWN0LmtleXMoJHBQcm9wZXJ0aWVzKSxcclxuICAgICRhUHJvcGVydGllcyA9IGl0LnNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcyxcclxuICAgICRzb21lUHJvcGVydGllcyA9ICRzY2hlbWFLZXlzLmxlbmd0aCB8fCAkcFByb3BlcnR5S2V5cy5sZW5ndGgsXHJcbiAgICAkbm9BZGRpdGlvbmFsID0gJGFQcm9wZXJ0aWVzID09PSBmYWxzZSxcclxuICAgICRhZGRpdGlvbmFsSXNTY2hlbWEgPSB0eXBlb2YgJGFQcm9wZXJ0aWVzID09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKCRhUHJvcGVydGllcykubGVuZ3RoLFxyXG4gICAgJHJlbW92ZUFkZGl0aW9uYWwgPSBpdC5vcHRzLnJlbW92ZUFkZGl0aW9uYWwsXHJcbiAgICAkY2hlY2tBZGRpdGlvbmFsID0gJG5vQWRkaXRpb25hbCB8fCAkYWRkaXRpb25hbElzU2NoZW1hIHx8ICRyZW1vdmVBZGRpdGlvbmFsLFxyXG4gICAgJG93blByb3BlcnRpZXMgPSBpdC5vcHRzLm93blByb3BlcnRpZXMsXHJcbiAgICAkY3VycmVudEJhc2VJZCA9IGl0LmJhc2VJZDtcclxuICB2YXIgJHJlcXVpcmVkID0gaXQuc2NoZW1hLnJlcXVpcmVkO1xyXG4gIGlmICgkcmVxdWlyZWQgJiYgIShpdC5vcHRzLiRkYXRhICYmICRyZXF1aXJlZC4kZGF0YSkgJiYgJHJlcXVpcmVkLmxlbmd0aCA8IGl0Lm9wdHMubG9vcFJlcXVpcmVkKSB2YXIgJHJlcXVpcmVkSGFzaCA9IGl0LnV0aWwudG9IYXNoKCRyZXF1aXJlZCk7XHJcbiAgb3V0ICs9ICd2YXIgJyArICgkZXJycykgKyAnID0gZXJyb3JzO3ZhciAnICsgKCRuZXh0VmFsaWQpICsgJyA9IHRydWU7JztcclxuICBpZiAoJG93blByb3BlcnRpZXMpIHtcclxuICAgIG91dCArPSAnIHZhciAnICsgKCRkYXRhUHJvcGVydGllcykgKyAnID0gdW5kZWZpbmVkOyc7XHJcbiAgfVxyXG4gIGlmICgkY2hlY2tBZGRpdGlvbmFsKSB7XHJcbiAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcclxuICAgICAgb3V0ICs9ICcgJyArICgkZGF0YVByb3BlcnRpZXMpICsgJyA9ICcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICcgfHwgT2JqZWN0LmtleXMoJyArICgkZGF0YSkgKyAnKTsgZm9yICh2YXIgJyArICgkaWR4KSArICc9MDsgJyArICgkaWR4KSArICc8JyArICgkZGF0YVByb3BlcnRpZXMpICsgJy5sZW5ndGg7ICcgKyAoJGlkeCkgKyAnKyspIHsgdmFyICcgKyAoJGtleSkgKyAnID0gJyArICgkZGF0YVByb3BlcnRpZXMpICsgJ1snICsgKCRpZHgpICsgJ107ICc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvdXQgKz0gJyBmb3IgKHZhciAnICsgKCRrZXkpICsgJyBpbiAnICsgKCRkYXRhKSArICcpIHsgJztcclxuICAgIH1cclxuICAgIGlmICgkc29tZVByb3BlcnRpZXMpIHtcclxuICAgICAgb3V0ICs9ICcgdmFyIGlzQWRkaXRpb25hbCcgKyAoJGx2bCkgKyAnID0gIShmYWxzZSAnO1xyXG4gICAgICBpZiAoJHNjaGVtYUtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKCRzY2hlbWFLZXlzLmxlbmd0aCA+IDgpIHtcclxuICAgICAgICAgIG91dCArPSAnIHx8IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJy5oYXNPd25Qcm9wZXJ0eSgnICsgKCRrZXkpICsgJykgJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIGFycjEgPSAkc2NoZW1hS2V5cztcclxuICAgICAgICAgIGlmIChhcnIxKSB7XHJcbiAgICAgICAgICAgIHZhciAkcHJvcGVydHlLZXksIGkxID0gLTEsXHJcbiAgICAgICAgICAgICAgbDEgPSBhcnIxLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIHdoaWxlIChpMSA8IGwxKSB7XHJcbiAgICAgICAgICAgICAgJHByb3BlcnR5S2V5ID0gYXJyMVtpMSArPSAxXTtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyB8fCAnICsgKCRrZXkpICsgJyA9PSAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJHByb3BlcnR5S2V5KSkgKyAnICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCRwUHJvcGVydHlLZXlzLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciBhcnIyID0gJHBQcm9wZXJ0eUtleXM7XHJcbiAgICAgICAgaWYgKGFycjIpIHtcclxuICAgICAgICAgIHZhciAkcFByb3BlcnR5LCAkaSA9IC0xLFxyXG4gICAgICAgICAgICBsMiA9IGFycjIubGVuZ3RoIC0gMTtcclxuICAgICAgICAgIHdoaWxlICgkaSA8IGwyKSB7XHJcbiAgICAgICAgICAgICRwUHJvcGVydHkgPSBhcnIyWyRpICs9IDFdO1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB8fCAnICsgKGl0LnVzZVBhdHRlcm4oJHBQcm9wZXJ0eSkpICsgJy50ZXN0KCcgKyAoJGtleSkgKyAnKSAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBvdXQgKz0gJyApOyBpZiAoaXNBZGRpdGlvbmFsJyArICgkbHZsKSArICcpIHsgJztcclxuICAgIH1cclxuICAgIGlmICgkcmVtb3ZlQWRkaXRpb25hbCA9PSAnYWxsJykge1xyXG4gICAgICBvdXQgKz0gJyBkZWxldGUgJyArICgkZGF0YSkgKyAnWycgKyAoJGtleSkgKyAnXTsgJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciAkY3VycmVudEVycm9yUGF0aCA9IGl0LmVycm9yUGF0aDtcclxuICAgICAgdmFyICRhZGRpdGlvbmFsUHJvcGVydHkgPSAnXFwnICsgJyArICRrZXkgKyAnICsgXFwnJztcclxuICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgIGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aEV4cHIoaXQuZXJyb3JQYXRoLCAka2V5LCBpdC5vcHRzLmpzb25Qb2ludGVycyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCRub0FkZGl0aW9uYWwpIHtcclxuICAgICAgICBpZiAoJHJlbW92ZUFkZGl0aW9uYWwpIHtcclxuICAgICAgICAgIG91dCArPSAnIGRlbGV0ZSAnICsgKCRkYXRhKSArICdbJyArICgka2V5KSArICddOyAnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvdXQgKz0gJyAnICsgKCRuZXh0VmFsaWQpICsgJyA9IGZhbHNlOyAnO1xyXG4gICAgICAgICAgdmFyICRjdXJyRXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoO1xyXG4gICAgICAgICAgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy9hZGRpdGlvbmFsUHJvcGVydGllcyc7XHJcbiAgICAgICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XHJcbiAgICAgICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcclxuICAgICAgICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdhZGRpdGlvbmFsUHJvcGVydGllcycpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgYWRkaXRpb25hbFByb3BlcnR5OiBcXCcnICsgKCRhZGRpdGlvbmFsUHJvcGVydHkpICsgJ1xcJyB9ICc7XHJcbiAgICAgICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnJztcclxuICAgICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgKz0gJ2lzIGFuIGludmFsaWQgYWRkaXRpb25hbCBwcm9wZXJ0eSc7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG91dCArPSAnc2hvdWxkIE5PVCBoYXZlIGFkZGl0aW9uYWwgcHJvcGVydGllcyc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIG91dCArPSAnXFwnICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xyXG4gICAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiBmYWxzZSAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB7fSAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgICAgICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcclxuICAgICAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgICAgICBpZiAoaXQuYXN5bmMpIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkZXJyU2NoZW1hUGF0aCA9ICRjdXJyRXJyU2NoZW1hUGF0aDtcclxuICAgICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIGJyZWFrOyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICgkYWRkaXRpb25hbElzU2NoZW1hKSB7XHJcbiAgICAgICAgaWYgKCRyZW1vdmVBZGRpdGlvbmFsID09ICdmYWlsaW5nJykge1xyXG4gICAgICAgICAgb3V0ICs9ICcgdmFyICcgKyAoJGVycnMpICsgJyA9IGVycm9yczsgICc7XHJcbiAgICAgICAgICB2YXIgJHdhc0NvbXBvc2l0ZSA9IGl0LmNvbXBvc2l0ZVJ1bGU7XHJcbiAgICAgICAgICBpdC5jb21wb3NpdGVSdWxlID0gJGl0LmNvbXBvc2l0ZVJ1bGUgPSB0cnVlO1xyXG4gICAgICAgICAgJGl0LnNjaGVtYSA9ICRhUHJvcGVydGllcztcclxuICAgICAgICAgICRpdC5zY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArICcuYWRkaXRpb25hbFByb3BlcnRpZXMnO1xyXG4gICAgICAgICAgJGl0LmVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy9hZGRpdGlvbmFsUHJvcGVydGllcyc7XHJcbiAgICAgICAgICAkaXQuZXJyb3JQYXRoID0gaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5ID8gaXQuZXJyb3JQYXRoIDogaXQudXRpbC5nZXRQYXRoRXhwcihpdC5lcnJvclBhdGgsICRrZXksIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcclxuICAgICAgICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRrZXkgKyAnXSc7XHJcbiAgICAgICAgICAkaXQuZGF0YVBhdGhBcnJbJGRhdGFOeHRdID0gJGtleTtcclxuICAgICAgICAgIHZhciAkY29kZSA9IGl0LnZhbGlkYXRlKCRpdCk7XHJcbiAgICAgICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XHJcbiAgICAgICAgICBpZiAoaXQudXRpbC52YXJPY2N1cmVuY2VzKCRjb2RlLCAkbmV4dERhdGEpIDwgMikge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyAnICsgKGl0LnV0aWwudmFyUmVwbGFjZSgkY29kZSwgJG5leHREYXRhLCAkcGFzc0RhdGEpKSArICcgJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIHZhciAnICsgKCRuZXh0RGF0YSkgKyAnID0gJyArICgkcGFzc0RhdGEpICsgJzsgJyArICgkY29kZSkgKyAnICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdXQgKz0gJyBpZiAoIScgKyAoJG5leHRWYWxpZCkgKyAnKSB7IGVycm9ycyA9ICcgKyAoJGVycnMpICsgJzsgaWYgKHZhbGlkYXRlLmVycm9ycyAhPT0gbnVsbCkgeyBpZiAoZXJyb3JzKSB2YWxpZGF0ZS5lcnJvcnMubGVuZ3RoID0gZXJyb3JzOyBlbHNlIHZhbGlkYXRlLmVycm9ycyA9IG51bGw7IH0gZGVsZXRlICcgKyAoJGRhdGEpICsgJ1snICsgKCRrZXkpICsgJ107IH0gICc7XHJcbiAgICAgICAgICBpdC5jb21wb3NpdGVSdWxlID0gJGl0LmNvbXBvc2l0ZVJ1bGUgPSAkd2FzQ29tcG9zaXRlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkaXQuc2NoZW1hID0gJGFQcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgJGl0LnNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgJy5hZGRpdGlvbmFsUHJvcGVydGllcyc7XHJcbiAgICAgICAgICAkaXQuZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnL2FkZGl0aW9uYWxQcm9wZXJ0aWVzJztcclxuICAgICAgICAgICRpdC5lcnJvclBhdGggPSBpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkgPyBpdC5lcnJvclBhdGggOiBpdC51dGlsLmdldFBhdGhFeHByKGl0LmVycm9yUGF0aCwgJGtleSwgaXQub3B0cy5qc29uUG9pbnRlcnMpO1xyXG4gICAgICAgICAgdmFyICRwYXNzRGF0YSA9ICRkYXRhICsgJ1snICsgJGtleSArICddJztcclxuICAgICAgICAgICRpdC5kYXRhUGF0aEFyclskZGF0YU54dF0gPSAka2V5O1xyXG4gICAgICAgICAgdmFyICRjb2RlID0gaXQudmFsaWRhdGUoJGl0KTtcclxuICAgICAgICAgICRpdC5iYXNlSWQgPSAkY3VycmVudEJhc2VJZDtcclxuICAgICAgICAgIGlmIChpdC51dGlsLnZhck9jY3VyZW5jZXMoJGNvZGUsICRuZXh0RGF0YSkgPCAyKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnICcgKyAoaXQudXRpbC52YXJSZXBsYWNlKCRjb2RlLCAkbmV4dERhdGEsICRwYXNzRGF0YSkpICsgJyAnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgdmFyICcgKyAoJG5leHREYXRhKSArICcgPSAnICsgKCRwYXNzRGF0YSkgKyAnOyAnICsgKCRjb2RlKSArICcgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICAgIG91dCArPSAnIGlmICghJyArICgkbmV4dFZhbGlkKSArICcpIGJyZWFrOyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpdC5lcnJvclBhdGggPSAkY3VycmVudEVycm9yUGF0aDtcclxuICAgIH1cclxuICAgIGlmICgkc29tZVByb3BlcnRpZXMpIHtcclxuICAgICAgb3V0ICs9ICcgfSAnO1xyXG4gICAgfVxyXG4gICAgb3V0ICs9ICcgfSAgJztcclxuICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnO1xyXG4gICAgICAkY2xvc2luZ0JyYWNlcyArPSAnfSc7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHZhciAkdXNlRGVmYXVsdHMgPSBpdC5vcHRzLnVzZURlZmF1bHRzICYmICFpdC5jb21wb3NpdGVSdWxlO1xyXG4gIGlmICgkc2NoZW1hS2V5cy5sZW5ndGgpIHtcclxuICAgIHZhciBhcnIzID0gJHNjaGVtYUtleXM7XHJcbiAgICBpZiAoYXJyMykge1xyXG4gICAgICB2YXIgJHByb3BlcnR5S2V5LCBpMyA9IC0xLFxyXG4gICAgICAgIGwzID0gYXJyMy5sZW5ndGggLSAxO1xyXG4gICAgICB3aGlsZSAoaTMgPCBsMykge1xyXG4gICAgICAgICRwcm9wZXJ0eUtleSA9IGFycjNbaTMgKz0gMV07XHJcbiAgICAgICAgdmFyICRzY2ggPSAkc2NoZW1hWyRwcm9wZXJ0eUtleV07XHJcbiAgICAgICAgaWYgKGl0LnV0aWwuc2NoZW1hSGFzUnVsZXMoJHNjaCwgaXQuUlVMRVMuYWxsKSkge1xyXG4gICAgICAgICAgdmFyICRwcm9wID0gaXQudXRpbC5nZXRQcm9wZXJ0eSgkcHJvcGVydHlLZXkpLFxyXG4gICAgICAgICAgICAkcGFzc0RhdGEgPSAkZGF0YSArICRwcm9wLFxyXG4gICAgICAgICAgICAkaGFzRGVmYXVsdCA9ICR1c2VEZWZhdWx0cyAmJiAkc2NoLmRlZmF1bHQgIT09IHVuZGVmaW5lZDtcclxuICAgICAgICAgICRpdC5zY2hlbWEgPSAkc2NoO1xyXG4gICAgICAgICAgJGl0LnNjaGVtYVBhdGggPSAkc2NoZW1hUGF0aCArICRwcm9wO1xyXG4gICAgICAgICAgJGl0LmVyclNjaGVtYVBhdGggPSAkZXJyU2NoZW1hUGF0aCArICcvJyArIGl0LnV0aWwuZXNjYXBlRnJhZ21lbnQoJHByb3BlcnR5S2V5KTtcclxuICAgICAgICAgICRpdC5lcnJvclBhdGggPSBpdC51dGlsLmdldFBhdGgoaXQuZXJyb3JQYXRoLCAkcHJvcGVydHlLZXksIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcclxuICAgICAgICAgICRpdC5kYXRhUGF0aEFyclskZGF0YU54dF0gPSBpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpO1xyXG4gICAgICAgICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xyXG4gICAgICAgICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcclxuICAgICAgICAgICAgJGNvZGUgPSBpdC51dGlsLnZhclJlcGxhY2UoJGNvZGUsICRuZXh0RGF0YSwgJHBhc3NEYXRhKTtcclxuICAgICAgICAgICAgdmFyICR1c2VEYXRhID0gJHBhc3NEYXRhO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyICR1c2VEYXRhID0gJG5leHREYXRhO1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoJGhhc0RlZmF1bHQpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgJyArICgkY29kZSkgKyAnICc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoJHJlcXVpcmVkSGFzaCAmJiAkcmVxdWlyZWRIYXNoWyRwcm9wZXJ0eUtleV0pIHtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyBpZiAoICcgKyAoJHVzZURhdGEpICsgJyA9PT0gdW5kZWZpbmVkICc7XHJcbiAgICAgICAgICAgICAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyB8fCAhIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCgnICsgKCRkYXRhKSArICcsIFxcJycgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJHByb3BlcnR5S2V5KSkgKyAnXFwnKSAnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBvdXQgKz0gJykgeyAnICsgKCRuZXh0VmFsaWQpICsgJyA9IGZhbHNlOyAnO1xyXG4gICAgICAgICAgICAgIHZhciAkY3VycmVudEVycm9yUGF0aCA9IGl0LmVycm9yUGF0aCxcclxuICAgICAgICAgICAgICAgICRjdXJyRXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoLFxyXG4gICAgICAgICAgICAgICAgJG1pc3NpbmdQcm9wZXJ0eSA9IGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eUtleSk7XHJcbiAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoKCRjdXJyZW50RXJyb3JQYXRoLCAkcHJvcGVydHlLZXksIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy9yZXF1aXJlZCc7XHJcbiAgICAgICAgICAgICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xyXG4gICAgICAgICAgICAgICQkb3V0U3RhY2sucHVzaChvdXQpO1xyXG4gICAgICAgICAgICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgICAgICAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ3JlcXVpcmVkJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBtaXNzaW5nUHJvcGVydHk6IFxcJycgKyAoJG1pc3NpbmdQcm9wZXJ0eSkgKyAnXFwnIH0gJztcclxuICAgICAgICAgICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJyc7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJ2lzIGEgcmVxdWlyZWQgcHJvcGVydHknO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dCArPSAnc2hvdWxkIGhhdmUgcmVxdWlyZWQgcHJvcGVydHkgXFxcXFxcJycgKyAoJG1pc3NpbmdQcm9wZXJ0eSkgKyAnXFxcXFxcJyc7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dCArPSAnIH0gJztcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0ICs9ICcge30gJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xyXG4gICAgICAgICAgICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0LmFzeW5jKSB7XHJcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAkZXJyU2NoZW1hUGF0aCA9ICRjdXJyRXJyU2NoZW1hUGF0aDtcclxuICAgICAgICAgICAgICBpdC5lcnJvclBhdGggPSAkY3VycmVudEVycm9yUGF0aDtcclxuICAgICAgICAgICAgICBvdXQgKz0gJyB9IGVsc2UgeyAnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyBpZiAoICcgKyAoJHVzZURhdGEpICsgJyA9PT0gdW5kZWZpbmVkICc7XHJcbiAgICAgICAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgfHwgISBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoJyArICgkZGF0YSkgKyAnLCBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eUtleSkpICsgJ1xcJykgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dCArPSAnKSB7ICcgKyAoJG5leHRWYWxpZCkgKyAnID0gdHJ1ZTsgfSBlbHNlIHsgJztcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJHVzZURhdGEpICsgJyAhPT0gdW5kZWZpbmVkICc7XHJcbiAgICAgICAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgJiYgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoJyArICgkZGF0YSkgKyAnLCBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eUtleSkpICsgJ1xcJykgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dCArPSAnICkgeyAnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQgKz0gJyAnICsgKCRjb2RlKSArICcgfSAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICc7XHJcbiAgICAgICAgICAkY2xvc2luZ0JyYWNlcyArPSAnfSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICgkcFByb3BlcnR5S2V5cy5sZW5ndGgpIHtcclxuICAgIHZhciBhcnI0ID0gJHBQcm9wZXJ0eUtleXM7XHJcbiAgICBpZiAoYXJyNCkge1xyXG4gICAgICB2YXIgJHBQcm9wZXJ0eSwgaTQgPSAtMSxcclxuICAgICAgICBsNCA9IGFycjQubGVuZ3RoIC0gMTtcclxuICAgICAgd2hpbGUgKGk0IDwgbDQpIHtcclxuICAgICAgICAkcFByb3BlcnR5ID0gYXJyNFtpNCArPSAxXTtcclxuICAgICAgICB2YXIgJHNjaCA9ICRwUHJvcGVydGllc1skcFByb3BlcnR5XTtcclxuICAgICAgICBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoLCBpdC5SVUxFUy5hbGwpKSB7XHJcbiAgICAgICAgICAkaXQuc2NoZW1hID0gJHNjaDtcclxuICAgICAgICAgICRpdC5zY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArICcucGF0dGVyblByb3BlcnRpZXMnICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgkcFByb3BlcnR5KTtcclxuICAgICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvcGF0dGVyblByb3BlcnRpZXMvJyArIGl0LnV0aWwuZXNjYXBlRnJhZ21lbnQoJHBQcm9wZXJ0eSk7XHJcbiAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgJyArICgkZGF0YVByb3BlcnRpZXMpICsgJyA9ICcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICcgfHwgT2JqZWN0LmtleXMoJyArICgkZGF0YSkgKyAnKTsgZm9yICh2YXIgJyArICgkaWR4KSArICc9MDsgJyArICgkaWR4KSArICc8JyArICgkZGF0YVByb3BlcnRpZXMpICsgJy5sZW5ndGg7ICcgKyAoJGlkeCkgKyAnKyspIHsgdmFyICcgKyAoJGtleSkgKyAnID0gJyArICgkZGF0YVByb3BlcnRpZXMpICsgJ1snICsgKCRpZHgpICsgJ107ICc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyBmb3IgKHZhciAnICsgKCRrZXkpICsgJyBpbiAnICsgKCRkYXRhKSArICcpIHsgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKGl0LnVzZVBhdHRlcm4oJHBQcm9wZXJ0eSkpICsgJy50ZXN0KCcgKyAoJGtleSkgKyAnKSkgeyAnO1xyXG4gICAgICAgICAgJGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aEV4cHIoaXQuZXJyb3JQYXRoLCAka2V5LCBpdC5vcHRzLmpzb25Qb2ludGVycyk7XHJcbiAgICAgICAgICB2YXIgJHBhc3NEYXRhID0gJGRhdGEgKyAnWycgKyAka2V5ICsgJ10nO1xyXG4gICAgICAgICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRrZXk7XHJcbiAgICAgICAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpO1xyXG4gICAgICAgICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xyXG4gICAgICAgICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgJyArIChpdC51dGlsLnZhclJlcGxhY2UoJGNvZGUsICRuZXh0RGF0YSwgJHBhc3NEYXRhKSkgKyAnICc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcclxuICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCEnICsgKCRuZXh0VmFsaWQpICsgJykgYnJlYWs7ICc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBvdXQgKz0gJyB9ICc7XHJcbiAgICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyBlbHNlICcgKyAoJG5leHRWYWxpZCkgKyAnID0gdHJ1ZTsgJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG91dCArPSAnIH0gICc7XHJcbiAgICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgICAgICAgICBvdXQgKz0gJyBpZiAoJyArICgkbmV4dFZhbGlkKSArICcpIHsgJztcclxuICAgICAgICAgICAgJGNsb3NpbmdCcmFjZXMgKz0gJ30nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoJGJyZWFrT25FcnJvcikge1xyXG4gICAgb3V0ICs9ICcgJyArICgkY2xvc2luZ0JyYWNlcykgKyAnIGlmICgnICsgKCRlcnJzKSArICcgPT0gZXJyb3JzKSB7JztcclxuICB9XHJcbiAgb3V0ID0gaXQudXRpbC5jbGVhblVwQ29kZShvdXQpO1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHJ1bGVNb2R1bGVzID0gcmVxdWlyZSgnLi4vZG90anMnKVxyXG4gICwgdG9IYXNoID0gcmVxdWlyZSgnLi91dGlsJykudG9IYXNoO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBydWxlcygpIHtcclxuICB2YXIgUlVMRVMgPSBbXHJcbiAgICB7IHR5cGU6ICdudW1iZXInLFxyXG4gICAgICBydWxlczogWyB7ICdtYXhpbXVtJzogWydleGNsdXNpdmVNYXhpbXVtJ10gfSxcclxuICAgICAgICAgICAgICAgeyAnbWluaW11bSc6IFsnZXhjbHVzaXZlTWluaW11bSddIH0sICdtdWx0aXBsZU9mJywgJ2Zvcm1hdCddIH0sXHJcbiAgICB7IHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBydWxlczogWyAnbWF4TGVuZ3RoJywgJ21pbkxlbmd0aCcsICdwYXR0ZXJuJywgJ2Zvcm1hdCcgXSB9LFxyXG4gICAgeyB0eXBlOiAnYXJyYXknLFxyXG4gICAgICBydWxlczogWyAnbWF4SXRlbXMnLCAnbWluSXRlbXMnLCAnaXRlbXMnLCAnY29udGFpbnMnLCAndW5pcXVlSXRlbXMnIF0gfSxcclxuICAgIHsgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgIHJ1bGVzOiBbICdtYXhQcm9wZXJ0aWVzJywgJ21pblByb3BlcnRpZXMnLCAncmVxdWlyZWQnLCAnZGVwZW5kZW5jaWVzJywgJ3Byb3BlcnR5TmFtZXMnLFxyXG4gICAgICAgICAgICAgICB7ICdwcm9wZXJ0aWVzJzogWydhZGRpdGlvbmFsUHJvcGVydGllcycsICdwYXR0ZXJuUHJvcGVydGllcyddIH0gXSB9LFxyXG4gICAgeyBydWxlczogWyAnJHJlZicsICdjb25zdCcsICdlbnVtJywgJ25vdCcsICdhbnlPZicsICdvbmVPZicsICdhbGxPZicsICdpZicgXSB9XHJcbiAgXTtcclxuXHJcbiAgdmFyIEFMTCA9IFsgJ3R5cGUnLCAnJGNvbW1lbnQnIF07XHJcbiAgdmFyIEtFWVdPUkRTID0gW1xyXG4gICAgJyRzY2hlbWEnLCAnJGlkJywgJ2lkJywgJyRkYXRhJywgJ3RpdGxlJyxcclxuICAgICdkZXNjcmlwdGlvbicsICdkZWZhdWx0JywgJ2RlZmluaXRpb25zJyxcclxuICAgICdleGFtcGxlcycsICdyZWFkT25seScsICd3cml0ZU9ubHknLFxyXG4gICAgJ2NvbnRlbnRNZWRpYVR5cGUnLCAnY29udGVudEVuY29kaW5nJyxcclxuICAgICdhZGRpdGlvbmFsSXRlbXMnLCAndGhlbicsICdlbHNlJ1xyXG4gIF07XHJcbiAgdmFyIFRZUEVTID0gWyAnbnVtYmVyJywgJ2ludGVnZXInLCAnc3RyaW5nJywgJ2FycmF5JywgJ29iamVjdCcsICdib29sZWFuJywgJ251bGwnIF07XHJcbiAgUlVMRVMuYWxsID0gdG9IYXNoKEFMTCk7XHJcbiAgUlVMRVMudHlwZXMgPSB0b0hhc2goVFlQRVMpO1xyXG5cclxuICBSVUxFUy5mb3JFYWNoKGZ1bmN0aW9uIChncm91cCkge1xyXG4gICAgZ3JvdXAucnVsZXMgPSBncm91cC5ydWxlcy5tYXAoZnVuY3Rpb24gKGtleXdvcmQpIHtcclxuICAgICAgdmFyIGltcGxLZXl3b3JkcztcclxuICAgICAgaWYgKHR5cGVvZiBrZXl3b3JkID09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgdmFyIGtleSA9IE9iamVjdC5rZXlzKGtleXdvcmQpWzBdO1xyXG4gICAgICAgIGltcGxLZXl3b3JkcyA9IGtleXdvcmRba2V5XTtcclxuICAgICAgICBrZXl3b3JkID0ga2V5O1xyXG4gICAgICAgIGltcGxLZXl3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XHJcbiAgICAgICAgICBBTEwucHVzaChrKTtcclxuICAgICAgICAgIFJVTEVTLmFsbFtrXSA9IHRydWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgQUxMLnB1c2goa2V5d29yZCk7XHJcbiAgICAgIHZhciBydWxlID0gUlVMRVMuYWxsW2tleXdvcmRdID0ge1xyXG4gICAgICAgIGtleXdvcmQ6IGtleXdvcmQsXHJcbiAgICAgICAgY29kZTogcnVsZU1vZHVsZXNba2V5d29yZF0sXHJcbiAgICAgICAgaW1wbGVtZW50czogaW1wbEtleXdvcmRzXHJcbiAgICAgIH07XHJcbiAgICAgIHJldHVybiBydWxlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgUlVMRVMuYWxsLiRjb21tZW50ID0ge1xyXG4gICAgICBrZXl3b3JkOiAnJGNvbW1lbnQnLFxyXG4gICAgICBjb2RlOiBydWxlTW9kdWxlcy4kY29tbWVudFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZ3JvdXAudHlwZSkgUlVMRVMudHlwZXNbZ3JvdXAudHlwZV0gPSBncm91cDtcclxuICB9KTtcclxuXHJcbiAgUlVMRVMua2V5d29yZHMgPSB0b0hhc2goQUxMLmNvbmNhdChLRVlXT1JEUykpO1xyXG4gIFJVTEVTLmN1c3RvbSA9IHt9O1xyXG5cclxuICByZXR1cm4gUlVMRVM7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=
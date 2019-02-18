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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9jb21waWxlL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIva2V5d29yZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy91bmlxdWVJdGVtcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy92YWxpZGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9fbGltaXRJdGVtcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9pZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9lbnVtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL2FsbE9mLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2NhY2hlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL2Zvcm1hdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9ub3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvY29uc3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvb25lT2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvY29tbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9jb250YWlucy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9hbnlPZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kYXRhLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL3Byb3BlcnR5TmFtZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvcmVmLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL3BhdHRlcm4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvY3VzdG9tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL19saW1pdFByb3BlcnRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvY29tcGlsZS91Y3MybGVuZ3RoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2Fqdi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9pdGVtcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9jb21waWxlL2Vycm9yX2NsYXNzZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvY29tcGlsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9fbGltaXRMZW5ndGguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvY29tcGlsZS9mb3JtYXRzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2RvdGpzL211bHRpcGxlT2YuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvY29tcGlsZS9yZXNvbHZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2NvbXBpbGUvYXN5bmMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvcmVxdWlyZWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvZGVwZW5kZW5jaWVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hanYvbGliL2NvbXBpbGUvc2NoZW1hX29iai5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9kb3Rqcy9fbGltaXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Fqdi9saWIvZG90anMvcHJvcGVydGllcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYWp2L2xpYi9jb21waWxlL3J1bGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTs7O0FBR2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsbUJBQU8sQ0FBQyw2QkFBaUI7QUFDbEMsY0FBYyxtQkFBTyxDQUFDLDBCQUFjO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxlQUFlLGNBQWM7QUFDN0I7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0Esa0ZBQWtGO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLG1FQUFtRTtBQUNuRTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0EsZ0RBQWdEO0FBQ2hELGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzRUFBc0U7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN6VWE7O0FBRWIsa0JBQWtCLG1CQUFPLENBQUMsc0JBQVU7QUFDcEMsYUFBYSxtQkFBTyxDQUFDLG9CQUFROztBQUU3QjtBQUNBO0FBQ0EsS0FBSztBQUNMLGdCQUFnQixrQ0FBa0M7QUFDbEQsZ0JBQWdCLGtDQUFrQywyQkFBMkI7QUFDN0UsS0FBSztBQUNMLGdFQUFnRTtBQUNoRSxLQUFLO0FBQ0wsNkVBQTZFO0FBQzdFLEtBQUs7QUFDTDtBQUNBLGdCQUFnQiw4REFBOEQsSUFBSTtBQUNsRixLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuYWp2LmQ5Yjk2ZTcyNWI5MGY4Yzk1YmFiLmNodW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb3B5OiBjb3B5LFxuICBjaGVja0RhdGFUeXBlOiBjaGVja0RhdGFUeXBlLFxuICBjaGVja0RhdGFUeXBlczogY2hlY2tEYXRhVHlwZXMsXG4gIGNvZXJjZVRvVHlwZXM6IGNvZXJjZVRvVHlwZXMsXG4gIHRvSGFzaDogdG9IYXNoLFxuICBnZXRQcm9wZXJ0eTogZ2V0UHJvcGVydHksXG4gIGVzY2FwZVF1b3RlczogZXNjYXBlUXVvdGVzLFxuICBlcXVhbDogcmVxdWlyZSgnZmFzdC1kZWVwLWVxdWFsJyksXG4gIHVjczJsZW5ndGg6IHJlcXVpcmUoJy4vdWNzMmxlbmd0aCcpLFxuICB2YXJPY2N1cmVuY2VzOiB2YXJPY2N1cmVuY2VzLFxuICB2YXJSZXBsYWNlOiB2YXJSZXBsYWNlLFxuICBjbGVhblVwQ29kZTogY2xlYW5VcENvZGUsXG4gIGZpbmFsQ2xlYW5VcENvZGU6IGZpbmFsQ2xlYW5VcENvZGUsXG4gIHNjaGVtYUhhc1J1bGVzOiBzY2hlbWFIYXNSdWxlcyxcbiAgc2NoZW1hSGFzUnVsZXNFeGNlcHQ6IHNjaGVtYUhhc1J1bGVzRXhjZXB0LFxuICB0b1F1b3RlZFN0cmluZzogdG9RdW90ZWRTdHJpbmcsXG4gIGdldFBhdGhFeHByOiBnZXRQYXRoRXhwcixcbiAgZ2V0UGF0aDogZ2V0UGF0aCxcbiAgZ2V0RGF0YTogZ2V0RGF0YSxcbiAgdW5lc2NhcGVGcmFnbWVudDogdW5lc2NhcGVGcmFnbWVudCxcbiAgdW5lc2NhcGVKc29uUG9pbnRlcjogdW5lc2NhcGVKc29uUG9pbnRlcixcbiAgZXNjYXBlRnJhZ21lbnQ6IGVzY2FwZUZyYWdtZW50LFxuICBlc2NhcGVKc29uUG9pbnRlcjogZXNjYXBlSnNvblBvaW50ZXJcbn07XG5cblxuZnVuY3Rpb24gY29weShvLCB0bykge1xuICB0byA9IHRvIHx8IHt9O1xuICBmb3IgKHZhciBrZXkgaW4gbykgdG9ba2V5XSA9IG9ba2V5XTtcbiAgcmV0dXJuIHRvO1xufVxuXG5cbmZ1bmN0aW9uIGNoZWNrRGF0YVR5cGUoZGF0YVR5cGUsIGRhdGEsIG5lZ2F0ZSkge1xuICB2YXIgRVFVQUwgPSBuZWdhdGUgPyAnICE9PSAnIDogJyA9PT0gJ1xuICAgICwgQU5EID0gbmVnYXRlID8gJyB8fCAnIDogJyAmJiAnXG4gICAgLCBPSyA9IG5lZ2F0ZSA/ICchJyA6ICcnXG4gICAgLCBOT1QgPSBuZWdhdGUgPyAnJyA6ICchJztcbiAgc3dpdGNoIChkYXRhVHlwZSkge1xuICAgIGNhc2UgJ251bGwnOiByZXR1cm4gZGF0YSArIEVRVUFMICsgJ251bGwnO1xuICAgIGNhc2UgJ2FycmF5JzogcmV0dXJuIE9LICsgJ0FycmF5LmlzQXJyYXkoJyArIGRhdGEgKyAnKSc7XG4gICAgY2FzZSAnb2JqZWN0JzogcmV0dXJuICcoJyArIE9LICsgZGF0YSArIEFORCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICd0eXBlb2YgJyArIGRhdGEgKyBFUVVBTCArICdcIm9iamVjdFwiJyArIEFORCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIE5PVCArICdBcnJheS5pc0FycmF5KCcgKyBkYXRhICsgJykpJztcbiAgICBjYXNlICdpbnRlZ2VyJzogcmV0dXJuICcodHlwZW9mICcgKyBkYXRhICsgRVFVQUwgKyAnXCJudW1iZXJcIicgKyBBTkQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgTk9UICsgJygnICsgZGF0YSArICcgJSAxKScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgQU5EICsgZGF0YSArIEVRVUFMICsgZGF0YSArICcpJztcbiAgICBkZWZhdWx0OiByZXR1cm4gJ3R5cGVvZiAnICsgZGF0YSArIEVRVUFMICsgJ1wiJyArIGRhdGFUeXBlICsgJ1wiJztcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNoZWNrRGF0YVR5cGVzKGRhdGFUeXBlcywgZGF0YSkge1xuICBzd2l0Y2ggKGRhdGFUeXBlcy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBjaGVja0RhdGFUeXBlKGRhdGFUeXBlc1swXSwgZGF0YSwgdHJ1ZSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBjb2RlID0gJyc7XG4gICAgICB2YXIgdHlwZXMgPSB0b0hhc2goZGF0YVR5cGVzKTtcbiAgICAgIGlmICh0eXBlcy5hcnJheSAmJiB0eXBlcy5vYmplY3QpIHtcbiAgICAgICAgY29kZSA9IHR5cGVzLm51bGwgPyAnKCc6ICcoIScgKyBkYXRhICsgJyB8fCAnO1xuICAgICAgICBjb2RlICs9ICd0eXBlb2YgJyArIGRhdGEgKyAnICE9PSBcIm9iamVjdFwiKSc7XG4gICAgICAgIGRlbGV0ZSB0eXBlcy5udWxsO1xuICAgICAgICBkZWxldGUgdHlwZXMuYXJyYXk7XG4gICAgICAgIGRlbGV0ZSB0eXBlcy5vYmplY3Q7XG4gICAgICB9XG4gICAgICBpZiAodHlwZXMubnVtYmVyKSBkZWxldGUgdHlwZXMuaW50ZWdlcjtcbiAgICAgIGZvciAodmFyIHQgaW4gdHlwZXMpXG4gICAgICAgIGNvZGUgKz0gKGNvZGUgPyAnICYmICcgOiAnJyApICsgY2hlY2tEYXRhVHlwZSh0LCBkYXRhLCB0cnVlKTtcblxuICAgICAgcmV0dXJuIGNvZGU7XG4gIH1cbn1cblxuXG52YXIgQ09FUkNFX1RPX1RZUEVTID0gdG9IYXNoKFsgJ3N0cmluZycsICdudW1iZXInLCAnaW50ZWdlcicsICdib29sZWFuJywgJ251bGwnIF0pO1xuZnVuY3Rpb24gY29lcmNlVG9UeXBlcyhvcHRpb25Db2VyY2VUeXBlcywgZGF0YVR5cGVzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGFUeXBlcykpIHtcbiAgICB2YXIgdHlwZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpPTA7IGk8ZGF0YVR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdCA9IGRhdGFUeXBlc1tpXTtcbiAgICAgIGlmIChDT0VSQ0VfVE9fVFlQRVNbdF0pIHR5cGVzW3R5cGVzLmxlbmd0aF0gPSB0O1xuICAgICAgZWxzZSBpZiAob3B0aW9uQ29lcmNlVHlwZXMgPT09ICdhcnJheScgJiYgdCA9PT0gJ2FycmF5JykgdHlwZXNbdHlwZXMubGVuZ3RoXSA9IHQ7XG4gICAgfVxuICAgIGlmICh0eXBlcy5sZW5ndGgpIHJldHVybiB0eXBlcztcbiAgfSBlbHNlIGlmIChDT0VSQ0VfVE9fVFlQRVNbZGF0YVR5cGVzXSkge1xuICAgIHJldHVybiBbZGF0YVR5cGVzXTtcbiAgfSBlbHNlIGlmIChvcHRpb25Db2VyY2VUeXBlcyA9PT0gJ2FycmF5JyAmJiBkYXRhVHlwZXMgPT09ICdhcnJheScpIHtcbiAgICByZXR1cm4gWydhcnJheSddO1xuICB9XG59XG5cblxuZnVuY3Rpb24gdG9IYXNoKGFycikge1xuICB2YXIgaGFzaCA9IHt9O1xuICBmb3IgKHZhciBpPTA7IGk8YXJyLmxlbmd0aDsgaSsrKSBoYXNoW2FycltpXV0gPSB0cnVlO1xuICByZXR1cm4gaGFzaDtcbn1cblxuXG52YXIgSURFTlRJRklFUiA9IC9eW2EteiRfXVthLXokXzAtOV0qJC9pO1xudmFyIFNJTkdMRV9RVU9URSA9IC8nfFxcXFwvZztcbmZ1bmN0aW9uIGdldFByb3BlcnR5KGtleSkge1xuICByZXR1cm4gdHlwZW9mIGtleSA9PSAnbnVtYmVyJ1xuICAgICAgICAgID8gJ1snICsga2V5ICsgJ10nXG4gICAgICAgICAgOiBJREVOVElGSUVSLnRlc3Qoa2V5KVxuICAgICAgICAgICAgPyAnLicgKyBrZXlcbiAgICAgICAgICAgIDogXCJbJ1wiICsgZXNjYXBlUXVvdGVzKGtleSkgKyBcIiddXCI7XG59XG5cblxuZnVuY3Rpb24gZXNjYXBlUXVvdGVzKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoU0lOR0xFX1FVT1RFLCAnXFxcXCQmJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXGYvZywgJ1xcXFxmJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgJ1xcXFx0Jyk7XG59XG5cblxuZnVuY3Rpb24gdmFyT2NjdXJlbmNlcyhzdHIsIGRhdGFWYXIpIHtcbiAgZGF0YVZhciArPSAnW14wLTldJztcbiAgdmFyIG1hdGNoZXMgPSBzdHIubWF0Y2gobmV3IFJlZ0V4cChkYXRhVmFyLCAnZycpKTtcbiAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzLmxlbmd0aCA6IDA7XG59XG5cblxuZnVuY3Rpb24gdmFyUmVwbGFjZShzdHIsIGRhdGFWYXIsIGV4cHIpIHtcbiAgZGF0YVZhciArPSAnKFteMC05XSknO1xuICBleHByID0gZXhwci5yZXBsYWNlKC9cXCQvZywgJyQkJCQnKTtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoZGF0YVZhciwgJ2cnKSwgZXhwciArICckMScpO1xufVxuXG5cbnZhciBFTVBUWV9FTFNFID0gL2Vsc2VcXHMqe1xccyp9L2dcbiAgLCBFTVBUWV9JRl9OT19FTFNFID0gL2lmXFxzKlxcKFteKV0rXFwpXFxzKlxce1xccypcXH0oPyFcXHMqZWxzZSkvZ1xuICAsIEVNUFRZX0lGX1dJVEhfRUxTRSA9IC9pZlxccypcXCgoW14pXSspXFwpXFxzKlxce1xccypcXH1cXHMqZWxzZSg/IVxccyppZikvZztcbmZ1bmN0aW9uIGNsZWFuVXBDb2RlKG91dCkge1xuICByZXR1cm4gb3V0LnJlcGxhY2UoRU1QVFlfRUxTRSwgJycpXG4gICAgICAgICAgICAucmVwbGFjZShFTVBUWV9JRl9OT19FTFNFLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKEVNUFRZX0lGX1dJVEhfRUxTRSwgJ2lmICghKCQxKSknKTtcbn1cblxuXG52YXIgRVJST1JTX1JFR0VYUCA9IC9bXnYuXWVycm9ycy9nXG4gICwgUkVNT1ZFX0VSUk9SUyA9IC92YXIgZXJyb3JzID0gMDt8dmFyIHZFcnJvcnMgPSBudWxsO3x2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzOy9nXG4gICwgUkVNT1ZFX0VSUk9SU19BU1lOQyA9IC92YXIgZXJyb3JzID0gMDt8dmFyIHZFcnJvcnMgPSBudWxsOy9nXG4gICwgUkVUVVJOX1ZBTElEID0gJ3JldHVybiBlcnJvcnMgPT09IDA7J1xuICAsIFJFVFVSTl9UUlVFID0gJ3ZhbGlkYXRlLmVycm9ycyA9IG51bGw7IHJldHVybiB0cnVlOydcbiAgLCBSRVRVUk5fQVNZTkMgPSAvaWYgXFwoZXJyb3JzID09PSAwXFwpIHJldHVybiBkYXRhO1xccyplbHNlIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3JcXCh2RXJyb3JzXFwpOy9cbiAgLCBSRVRVUk5fREFUQV9BU1lOQyA9ICdyZXR1cm4gZGF0YTsnXG4gICwgUk9PVERBVEFfUkVHRVhQID0gL1teQS1aYS16XyRdcm9vdERhdGFbXkEtWmEtejAtOV8kXS9nXG4gICwgUkVNT1ZFX1JPT1REQVRBID0gL2lmIFxcKHJvb3REYXRhID09PSB1bmRlZmluZWRcXCkgcm9vdERhdGEgPSBkYXRhOy87XG5cbmZ1bmN0aW9uIGZpbmFsQ2xlYW5VcENvZGUob3V0LCBhc3luYykge1xuICB2YXIgbWF0Y2hlcyA9IG91dC5tYXRjaChFUlJPUlNfUkVHRVhQKTtcbiAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlcy5sZW5ndGggPT0gMikge1xuICAgIG91dCA9IGFzeW5jXG4gICAgICAgICAgPyBvdXQucmVwbGFjZShSRU1PVkVfRVJST1JTX0FTWU5DLCAnJylcbiAgICAgICAgICAgICAgIC5yZXBsYWNlKFJFVFVSTl9BU1lOQywgUkVUVVJOX0RBVEFfQVNZTkMpXG4gICAgICAgICAgOiBvdXQucmVwbGFjZShSRU1PVkVfRVJST1JTLCAnJylcbiAgICAgICAgICAgICAgIC5yZXBsYWNlKFJFVFVSTl9WQUxJRCwgUkVUVVJOX1RSVUUpO1xuICB9XG5cbiAgbWF0Y2hlcyA9IG91dC5tYXRjaChST09UREFUQV9SRUdFWFApO1xuICBpZiAoIW1hdGNoZXMgfHwgbWF0Y2hlcy5sZW5ndGggIT09IDMpIHJldHVybiBvdXQ7XG4gIHJldHVybiBvdXQucmVwbGFjZShSRU1PVkVfUk9PVERBVEEsICcnKTtcbn1cblxuXG5mdW5jdGlvbiBzY2hlbWFIYXNSdWxlcyhzY2hlbWEsIHJ1bGVzKSB7XG4gIGlmICh0eXBlb2Ygc2NoZW1hID09ICdib29sZWFuJykgcmV0dXJuICFzY2hlbWE7XG4gIGZvciAodmFyIGtleSBpbiBzY2hlbWEpIGlmIChydWxlc1trZXldKSByZXR1cm4gdHJ1ZTtcbn1cblxuXG5mdW5jdGlvbiBzY2hlbWFIYXNSdWxlc0V4Y2VwdChzY2hlbWEsIHJ1bGVzLCBleGNlcHRLZXl3b3JkKSB7XG4gIGlmICh0eXBlb2Ygc2NoZW1hID09ICdib29sZWFuJykgcmV0dXJuICFzY2hlbWEgJiYgZXhjZXB0S2V5d29yZCAhPSAnbm90JztcbiAgZm9yICh2YXIga2V5IGluIHNjaGVtYSkgaWYgKGtleSAhPSBleGNlcHRLZXl3b3JkICYmIHJ1bGVzW2tleV0pIHJldHVybiB0cnVlO1xufVxuXG5cbmZ1bmN0aW9uIHRvUXVvdGVkU3RyaW5nKHN0cikge1xuICByZXR1cm4gJ1xcJycgKyBlc2NhcGVRdW90ZXMoc3RyKSArICdcXCcnO1xufVxuXG5cbmZ1bmN0aW9uIGdldFBhdGhFeHByKGN1cnJlbnRQYXRoLCBleHByLCBqc29uUG9pbnRlcnMsIGlzTnVtYmVyKSB7XG4gIHZhciBwYXRoID0ganNvblBvaW50ZXJzIC8vIGZhbHNlIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgICAgPyAnXFwnL1xcJyArICcgKyBleHByICsgKGlzTnVtYmVyID8gJycgOiAnLnJlcGxhY2UoL34vZywgXFwnfjBcXCcpLnJlcGxhY2UoL1xcXFwvL2csIFxcJ34xXFwnKScpXG4gICAgICAgICAgICAgIDogKGlzTnVtYmVyID8gJ1xcJ1tcXCcgKyAnICsgZXhwciArICcgKyBcXCddXFwnJyA6ICdcXCdbXFxcXFxcJ1xcJyArICcgKyBleHByICsgJyArIFxcJ1xcXFxcXCddXFwnJyk7XG4gIHJldHVybiBqb2luUGF0aHMoY3VycmVudFBhdGgsIHBhdGgpO1xufVxuXG5cbmZ1bmN0aW9uIGdldFBhdGgoY3VycmVudFBhdGgsIHByb3AsIGpzb25Qb2ludGVycykge1xuICB2YXIgcGF0aCA9IGpzb25Qb2ludGVycyAvLyBmYWxzZSBieSBkZWZhdWx0XG4gICAgICAgICAgICAgID8gdG9RdW90ZWRTdHJpbmcoJy8nICsgZXNjYXBlSnNvblBvaW50ZXIocHJvcCkpXG4gICAgICAgICAgICAgIDogdG9RdW90ZWRTdHJpbmcoZ2V0UHJvcGVydHkocHJvcCkpO1xuICByZXR1cm4gam9pblBhdGhzKGN1cnJlbnRQYXRoLCBwYXRoKTtcbn1cblxuXG52YXIgSlNPTl9QT0lOVEVSID0gL15cXC8oPzpbXn5dfH4wfH4xKSokLztcbnZhciBSRUxBVElWRV9KU09OX1BPSU5URVIgPSAvXihbMC05XSspKCN8XFwvKD86W15+XXx+MHx+MSkqKT8kLztcbmZ1bmN0aW9uIGdldERhdGEoJGRhdGEsIGx2bCwgcGF0aHMpIHtcbiAgdmFyIHVwLCBqc29uUG9pbnRlciwgZGF0YSwgbWF0Y2hlcztcbiAgaWYgKCRkYXRhID09PSAnJykgcmV0dXJuICdyb290RGF0YSc7XG4gIGlmICgkZGF0YVswXSA9PSAnLycpIHtcbiAgICBpZiAoIUpTT05fUE9JTlRFUi50ZXN0KCRkYXRhKSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEpTT04tcG9pbnRlcjogJyArICRkYXRhKTtcbiAgICBqc29uUG9pbnRlciA9ICRkYXRhO1xuICAgIGRhdGEgPSAncm9vdERhdGEnO1xuICB9IGVsc2Uge1xuICAgIG1hdGNoZXMgPSAkZGF0YS5tYXRjaChSRUxBVElWRV9KU09OX1BPSU5URVIpO1xuICAgIGlmICghbWF0Y2hlcykgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEpTT04tcG9pbnRlcjogJyArICRkYXRhKTtcbiAgICB1cCA9ICttYXRjaGVzWzFdO1xuICAgIGpzb25Qb2ludGVyID0gbWF0Y2hlc1syXTtcbiAgICBpZiAoanNvblBvaW50ZXIgPT0gJyMnKSB7XG4gICAgICBpZiAodXAgPj0gbHZsKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhY2Nlc3MgcHJvcGVydHkvaW5kZXggJyArIHVwICsgJyBsZXZlbHMgdXAsIGN1cnJlbnQgbGV2ZWwgaXMgJyArIGx2bCk7XG4gICAgICByZXR1cm4gcGF0aHNbbHZsIC0gdXBdO1xuICAgIH1cblxuICAgIGlmICh1cCA+IGx2bCkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWNjZXNzIGRhdGEgJyArIHVwICsgJyBsZXZlbHMgdXAsIGN1cnJlbnQgbGV2ZWwgaXMgJyArIGx2bCk7XG4gICAgZGF0YSA9ICdkYXRhJyArICgobHZsIC0gdXApIHx8ICcnKTtcbiAgICBpZiAoIWpzb25Qb2ludGVyKSByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHZhciBleHByID0gZGF0YTtcbiAgdmFyIHNlZ21lbnRzID0ganNvblBvaW50ZXIuc3BsaXQoJy8nKTtcbiAgZm9yICh2YXIgaT0wOyBpPHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1tpXTtcbiAgICBpZiAoc2VnbWVudCkge1xuICAgICAgZGF0YSArPSBnZXRQcm9wZXJ0eSh1bmVzY2FwZUpzb25Qb2ludGVyKHNlZ21lbnQpKTtcbiAgICAgIGV4cHIgKz0gJyAmJiAnICsgZGF0YTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGV4cHI7XG59XG5cblxuZnVuY3Rpb24gam9pblBhdGhzIChhLCBiKSB7XG4gIGlmIChhID09ICdcIlwiJykgcmV0dXJuIGI7XG4gIHJldHVybiAoYSArICcgKyAnICsgYikucmVwbGFjZSgvJyBcXCsgJy9nLCAnJyk7XG59XG5cblxuZnVuY3Rpb24gdW5lc2NhcGVGcmFnbWVudChzdHIpIHtcbiAgcmV0dXJuIHVuZXNjYXBlSnNvblBvaW50ZXIoZGVjb2RlVVJJQ29tcG9uZW50KHN0cikpO1xufVxuXG5cbmZ1bmN0aW9uIGVzY2FwZUZyYWdtZW50KHN0cikge1xuICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGVzY2FwZUpzb25Qb2ludGVyKHN0cikpO1xufVxuXG5cbmZ1bmN0aW9uIGVzY2FwZUpzb25Qb2ludGVyKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL34vZywgJ34wJykucmVwbGFjZSgvXFwvL2csICd+MScpO1xufVxuXG5cbmZ1bmN0aW9uIHVuZXNjYXBlSnNvblBvaW50ZXIoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvfjEvZywgJy8nKS5yZXBsYWNlKC9+MC9nLCAnficpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgSURFTlRJRklFUiA9IC9eW2Etel8kXVthLXowLTlfJC1dKiQvaTtcbnZhciBjdXN0b21SdWxlQ29kZSA9IHJlcXVpcmUoJy4vZG90anMvY3VzdG9tJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGQ6IGFkZEtleXdvcmQsXG4gIGdldDogZ2V0S2V5d29yZCxcbiAgcmVtb3ZlOiByZW1vdmVLZXl3b3JkXG59O1xuXG4vKipcbiAqIERlZmluZSBjdXN0b20ga2V5d29yZFxuICogQHRoaXMgIEFqdlxuICogQHBhcmFtIHtTdHJpbmd9IGtleXdvcmQgY3VzdG9tIGtleXdvcmQsIHNob3VsZCBiZSB1bmlxdWUgKGluY2x1ZGluZyBkaWZmZXJlbnQgZnJvbSBhbGwgc3RhbmRhcmQsIGN1c3RvbSBhbmQgbWFjcm8ga2V5d29yZHMpLlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb24ga2V5d29yZCBkZWZpbml0aW9uIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgYHR5cGVgICh0eXBlKHMpIHdoaWNoIHRoZSBrZXl3b3JkIGFwcGxpZXMgdG8pLCBgdmFsaWRhdGVgIG9yIGBjb21waWxlYC5cbiAqIEByZXR1cm4ge0Fqdn0gdGhpcyBmb3IgbWV0aG9kIGNoYWluaW5nXG4gKi9cbmZ1bmN0aW9uIGFkZEtleXdvcmQoa2V5d29yZCwgZGVmaW5pdGlvbikge1xuICAvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gIC8qIGVzbGludCBuby1zaGFkb3c6IDAgKi9cbiAgdmFyIFJVTEVTID0gdGhpcy5SVUxFUztcblxuICBpZiAoUlVMRVMua2V5d29yZHNba2V5d29yZF0pXG4gICAgdGhyb3cgbmV3IEVycm9yKCdLZXl3b3JkICcgKyBrZXl3b3JkICsgJyBpcyBhbHJlYWR5IGRlZmluZWQnKTtcblxuICBpZiAoIUlERU5USUZJRVIudGVzdChrZXl3b3JkKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleXdvcmQgJyArIGtleXdvcmQgKyAnIGlzIG5vdCBhIHZhbGlkIGlkZW50aWZpZXInKTtcblxuICBpZiAoZGVmaW5pdGlvbikge1xuICAgIGlmIChkZWZpbml0aW9uLm1hY3JvICYmIGRlZmluaXRpb24udmFsaWQgIT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJ2YWxpZFwiIG9wdGlvbiBjYW5ub3QgYmUgdXNlZCB3aXRoIG1hY3JvIGtleXdvcmRzJyk7XG5cbiAgICB2YXIgZGF0YVR5cGUgPSBkZWZpbml0aW9uLnR5cGU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YVR5cGUpKSB7XG4gICAgICB2YXIgaSwgbGVuID0gZGF0YVR5cGUubGVuZ3RoO1xuICAgICAgZm9yIChpPTA7IGk8bGVuOyBpKyspIGNoZWNrRGF0YVR5cGUoZGF0YVR5cGVbaV0pO1xuICAgICAgZm9yIChpPTA7IGk8bGVuOyBpKyspIF9hZGRSdWxlKGtleXdvcmQsIGRhdGFUeXBlW2ldLCBkZWZpbml0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRhdGFUeXBlKSBjaGVja0RhdGFUeXBlKGRhdGFUeXBlKTtcbiAgICAgIF9hZGRSdWxlKGtleXdvcmQsIGRhdGFUeXBlLCBkZWZpbml0aW9uKTtcbiAgICB9XG5cbiAgICB2YXIgJGRhdGEgPSBkZWZpbml0aW9uLiRkYXRhID09PSB0cnVlICYmIHRoaXMuX29wdHMuJGRhdGE7XG4gICAgaWYgKCRkYXRhICYmICFkZWZpbml0aW9uLnZhbGlkYXRlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCckZGF0YSBzdXBwb3J0OiBcInZhbGlkYXRlXCIgZnVuY3Rpb24gaXMgbm90IGRlZmluZWQnKTtcblxuICAgIHZhciBtZXRhU2NoZW1hID0gZGVmaW5pdGlvbi5tZXRhU2NoZW1hO1xuICAgIGlmIChtZXRhU2NoZW1hKSB7XG4gICAgICBpZiAoJGRhdGEpIHtcbiAgICAgICAgbWV0YVNjaGVtYSA9IHtcbiAgICAgICAgICBhbnlPZjogW1xuICAgICAgICAgICAgbWV0YVNjaGVtYSxcbiAgICAgICAgICAgIHsgJyRyZWYnOiAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Vwb2JlcmV6a2luL2Fqdi9tYXN0ZXIvbGliL3JlZnMvZGF0YS5qc29uIycgfVxuICAgICAgICAgIF1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGRlZmluaXRpb24udmFsaWRhdGVTY2hlbWEgPSB0aGlzLmNvbXBpbGUobWV0YVNjaGVtYSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgUlVMRVMua2V5d29yZHNba2V5d29yZF0gPSBSVUxFUy5hbGxba2V5d29yZF0gPSB0cnVlO1xuXG5cbiAgZnVuY3Rpb24gX2FkZFJ1bGUoa2V5d29yZCwgZGF0YVR5cGUsIGRlZmluaXRpb24pIHtcbiAgICB2YXIgcnVsZUdyb3VwO1xuICAgIGZvciAodmFyIGk9MDsgaTxSVUxFUy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJnID0gUlVMRVNbaV07XG4gICAgICBpZiAocmcudHlwZSA9PSBkYXRhVHlwZSkge1xuICAgICAgICBydWxlR3JvdXAgPSByZztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFydWxlR3JvdXApIHtcbiAgICAgIHJ1bGVHcm91cCA9IHsgdHlwZTogZGF0YVR5cGUsIHJ1bGVzOiBbXSB9O1xuICAgICAgUlVMRVMucHVzaChydWxlR3JvdXApO1xuICAgIH1cblxuICAgIHZhciBydWxlID0ge1xuICAgICAga2V5d29yZDoga2V5d29yZCxcbiAgICAgIGRlZmluaXRpb246IGRlZmluaXRpb24sXG4gICAgICBjdXN0b206IHRydWUsXG4gICAgICBjb2RlOiBjdXN0b21SdWxlQ29kZSxcbiAgICAgIGltcGxlbWVudHM6IGRlZmluaXRpb24uaW1wbGVtZW50c1xuICAgIH07XG4gICAgcnVsZUdyb3VwLnJ1bGVzLnB1c2gocnVsZSk7XG4gICAgUlVMRVMuY3VzdG9tW2tleXdvcmRdID0gcnVsZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gY2hlY2tEYXRhVHlwZShkYXRhVHlwZSkge1xuICAgIGlmICghUlVMRVMudHlwZXNbZGF0YVR5cGVdKSB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdHlwZSAnICsgZGF0YVR5cGUpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cblxuLyoqXG4gKiBHZXQga2V5d29yZFxuICogQHRoaXMgIEFqdlxuICogQHBhcmFtIHtTdHJpbmd9IGtleXdvcmQgcHJlLWRlZmluZWQgb3IgY3VzdG9tIGtleXdvcmQuXG4gKiBAcmV0dXJuIHtPYmplY3R8Qm9vbGVhbn0gY3VzdG9tIGtleXdvcmQgZGVmaW5pdGlvbiwgYHRydWVgIGlmIGl0IGlzIGEgcHJlZGVmaW5lZCBrZXl3b3JkLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gZ2V0S2V5d29yZChrZXl3b3JkKSB7XG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgdmFyIHJ1bGUgPSB0aGlzLlJVTEVTLmN1c3RvbVtrZXl3b3JkXTtcbiAgcmV0dXJuIHJ1bGUgPyBydWxlLmRlZmluaXRpb24gOiB0aGlzLlJVTEVTLmtleXdvcmRzW2tleXdvcmRdIHx8IGZhbHNlO1xufVxuXG5cbi8qKlxuICogUmVtb3ZlIGtleXdvcmRcbiAqIEB0aGlzICBBanZcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXl3b3JkIHByZS1kZWZpbmVkIG9yIGN1c3RvbSBrZXl3b3JkLlxuICogQHJldHVybiB7QWp2fSB0aGlzIGZvciBtZXRob2QgY2hhaW5pbmdcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlS2V5d29yZChrZXl3b3JkKSB7XG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgdmFyIFJVTEVTID0gdGhpcy5SVUxFUztcbiAgZGVsZXRlIFJVTEVTLmtleXdvcmRzW2tleXdvcmRdO1xuICBkZWxldGUgUlVMRVMuYWxsW2tleXdvcmRdO1xuICBkZWxldGUgUlVMRVMuY3VzdG9tW2tleXdvcmRdO1xuICBmb3IgKHZhciBpPTA7IGk8UlVMRVMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcnVsZXMgPSBSVUxFU1tpXS5ydWxlcztcbiAgICBmb3IgKHZhciBqPTA7IGo8cnVsZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChydWxlc1tqXS5rZXl3b3JkID09IGtleXdvcmQpIHtcbiAgICAgICAgcnVsZXMuc3BsaWNlKGosIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX3VuaXF1ZUl0ZW1zKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcbiAgdmFyICRpc0RhdGEgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWEgJiYgJHNjaGVtYS4kZGF0YSxcbiAgICAkc2NoZW1hVmFsdWU7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYScgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLmdldERhdGEoJHNjaGVtYS4kZGF0YSwgJGRhdGFMdmwsIGl0LmRhdGFQYXRoQXJyKSkgKyAnOyAnO1xuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcbiAgfSBlbHNlIHtcbiAgICAkc2NoZW1hVmFsdWUgPSAkc2NoZW1hO1xuICB9XG4gIGlmICgoJHNjaGVtYSB8fCAkaXNEYXRhKSAmJiBpdC5vcHRzLnVuaXF1ZUl0ZW1zICE9PSBmYWxzZSkge1xuICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICBvdXQgKz0gJyB2YXIgJyArICgkdmFsaWQpICsgJzsgaWYgKCcgKyAoJHNjaGVtYVZhbHVlKSArICcgPT09IGZhbHNlIHx8ICcgKyAoJHNjaGVtYVZhbHVlKSArICcgPT09IHVuZGVmaW5lZCkgJyArICgkdmFsaWQpICsgJyA9IHRydWU7IGVsc2UgaWYgKHR5cGVvZiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9IFxcJ2Jvb2xlYW5cXCcpICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgZWxzZSB7ICc7XG4gICAgfVxuICAgIG91dCArPSAnIHZhciBpID0gJyArICgkZGF0YSkgKyAnLmxlbmd0aCAsICcgKyAoJHZhbGlkKSArICcgPSB0cnVlICwgajsgaWYgKGkgPiAxKSB7ICc7XG4gICAgdmFyICRpdGVtVHlwZSA9IGl0LnNjaGVtYS5pdGVtcyAmJiBpdC5zY2hlbWEuaXRlbXMudHlwZSxcbiAgICAgICR0eXBlSXNBcnJheSA9IEFycmF5LmlzQXJyYXkoJGl0ZW1UeXBlKTtcbiAgICBpZiAoISRpdGVtVHlwZSB8fCAkaXRlbVR5cGUgPT0gJ29iamVjdCcgfHwgJGl0ZW1UeXBlID09ICdhcnJheScgfHwgKCR0eXBlSXNBcnJheSAmJiAoJGl0ZW1UeXBlLmluZGV4T2YoJ29iamVjdCcpID49IDAgfHwgJGl0ZW1UeXBlLmluZGV4T2YoJ2FycmF5JykgPj0gMCkpKSB7XG4gICAgICBvdXQgKz0gJyBvdXRlcjogZm9yICg7aS0tOykgeyBmb3IgKGogPSBpOyBqLS07KSB7IGlmIChlcXVhbCgnICsgKCRkYXRhKSArICdbaV0sICcgKyAoJGRhdGEpICsgJ1tqXSkpIHsgJyArICgkdmFsaWQpICsgJyA9IGZhbHNlOyBicmVhayBvdXRlcjsgfSB9IH0gJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcgdmFyIGl0ZW1JbmRpY2VzID0ge30sIGl0ZW07IGZvciAoO2ktLTspIHsgdmFyIGl0ZW0gPSAnICsgKCRkYXRhKSArICdbaV07ICc7XG4gICAgICB2YXIgJG1ldGhvZCA9ICdjaGVja0RhdGFUeXBlJyArICgkdHlwZUlzQXJyYXkgPyAncycgOiAnJyk7XG4gICAgICBvdXQgKz0gJyBpZiAoJyArIChpdC51dGlsWyRtZXRob2RdKCRpdGVtVHlwZSwgJ2l0ZW0nLCB0cnVlKSkgKyAnKSBjb250aW51ZTsgJztcbiAgICAgIGlmICgkdHlwZUlzQXJyYXkpIHtcbiAgICAgICAgb3V0ICs9ICcgaWYgKHR5cGVvZiBpdGVtID09IFxcJ3N0cmluZ1xcJykgaXRlbSA9IFxcJ1wiXFwnICsgaXRlbTsgJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnIGlmICh0eXBlb2YgaXRlbUluZGljZXNbaXRlbV0gPT0gXFwnbnVtYmVyXFwnKSB7ICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgaiA9IGl0ZW1JbmRpY2VzW2l0ZW1dOyBicmVhazsgfSBpdGVtSW5kaWNlc1tpdGVtXSA9IGk7IH0gJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfSAnO1xuICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICBvdXQgKz0gJyAgfSAgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgJztcbiAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgndW5pcXVlSXRlbXMnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGk6IGksIGo6IGogfSAnO1xuICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIE5PVCBoYXZlIGR1cGxpY2F0ZSBpdGVtcyAoaXRlbXMgIyMgXFwnICsgaiArIFxcJyBhbmQgXFwnICsgaSArIFxcJyBhcmUgaWRlbnRpY2FsKVxcJyAnO1xuICAgICAgfVxuICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogICc7XG4gICAgICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICAgICAgb3V0ICs9ICd2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gJycgKyAoJHNjaGVtYSk7XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICcgICAgICAgICAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnIH0gJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcge30gJztcbiAgICB9XG4gICAgdmFyIF9fZXJyID0gb3V0O1xuICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XG4gICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyB9ICc7XG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgIG91dCArPSAnIGVsc2UgeyAnO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfdmFsaWRhdGUoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcbiAgdmFyIG91dCA9ICcnO1xuICB2YXIgJGFzeW5jID0gaXQuc2NoZW1hLiRhc3luYyA9PT0gdHJ1ZSxcbiAgICAkcmVmS2V5d29yZHMgPSBpdC51dGlsLnNjaGVtYUhhc1J1bGVzRXhjZXB0KGl0LnNjaGVtYSwgaXQuUlVMRVMuYWxsLCAnJHJlZicpLFxuICAgICRpZCA9IGl0LnNlbGYuX2dldElkKGl0LnNjaGVtYSk7XG4gIGlmIChpdC5pc1RvcCkge1xuICAgIG91dCArPSAnIHZhciB2YWxpZGF0ZSA9ICc7XG4gICAgaWYgKCRhc3luYykge1xuICAgICAgaXQuYXN5bmMgPSB0cnVlO1xuICAgICAgb3V0ICs9ICdhc3luYyAnO1xuICAgIH1cbiAgICBvdXQgKz0gJ2Z1bmN0aW9uKGRhdGEsIGRhdGFQYXRoLCBwYXJlbnREYXRhLCBwYXJlbnREYXRhUHJvcGVydHksIHJvb3REYXRhKSB7IFxcJ3VzZSBzdHJpY3RcXCc7ICc7XG4gICAgaWYgKCRpZCAmJiAoaXQub3B0cy5zb3VyY2VDb2RlIHx8IGl0Lm9wdHMucHJvY2Vzc0NvZGUpKSB7XG4gICAgICBvdXQgKz0gJyAnICsgKCcvXFwqIyBzb3VyY2VVUkw9JyArICRpZCArICcgKi8nKSArICcgJztcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBpdC5zY2hlbWEgPT0gJ2Jvb2xlYW4nIHx8ICEoJHJlZktleXdvcmRzIHx8IGl0LnNjaGVtYS4kcmVmKSkge1xuICAgIHZhciAka2V5d29yZCA9ICdmYWxzZSBzY2hlbWEnO1xuICAgIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gICAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xuICAgIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gICAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xuICAgIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICAgIHZhciAkZXJyb3JLZXl3b3JkO1xuICAgIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XG4gICAgdmFyICR2YWxpZCA9ICd2YWxpZCcgKyAkbHZsO1xuICAgIGlmIChpdC5zY2hlbWEgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoaXQuaXNUb3ApIHtcbiAgICAgICAgJGJyZWFrT25FcnJvciA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdmFsaWQpICsgJyA9IGZhbHNlOyAnO1xuICAgICAgfVxuICAgICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xuICAgICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gICAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgkZXJyb3JLZXl3b3JkIHx8ICdmYWxzZSBzY2hlbWEnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7fSAnO1xuICAgICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ2Jvb2xlYW4gc2NoZW1hIGlzIGZhbHNlXFwnICc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiBmYWxzZSAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB7fSAnO1xuICAgICAgfVxuICAgICAgdmFyIF9fZXJyID0gb3V0O1xuICAgICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcbiAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpdC5pc1RvcCkge1xuICAgICAgICBpZiAoJGFzeW5jKSB7XG4gICAgICAgICAgb3V0ICs9ICcgcmV0dXJuIGRhdGE7ICc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gbnVsbDsgcmV0dXJuIHRydWU7ICc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnIHZhciAnICsgKCR2YWxpZCkgKyAnID0gdHJ1ZTsgJztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGl0LmlzVG9wKSB7XG4gICAgICBvdXQgKz0gJyB9OyByZXR1cm4gdmFsaWRhdGU7ICc7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgaWYgKGl0LmlzVG9wKSB7XG4gICAgdmFyICR0b3AgPSBpdC5pc1RvcCxcbiAgICAgICRsdmwgPSBpdC5sZXZlbCA9IDAsXG4gICAgICAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbCA9IDAsXG4gICAgICAkZGF0YSA9ICdkYXRhJztcbiAgICBpdC5yb290SWQgPSBpdC5yZXNvbHZlLmZ1bGxQYXRoKGl0LnNlbGYuX2dldElkKGl0LnJvb3Quc2NoZW1hKSk7XG4gICAgaXQuYmFzZUlkID0gaXQuYmFzZUlkIHx8IGl0LnJvb3RJZDtcbiAgICBkZWxldGUgaXQuaXNUb3A7XG4gICAgaXQuZGF0YVBhdGhBcnIgPSBbdW5kZWZpbmVkXTtcbiAgICBvdXQgKz0gJyB2YXIgdkVycm9ycyA9IG51bGw7ICc7XG4gICAgb3V0ICs9ICcgdmFyIGVycm9ycyA9IDA7ICAgICAnO1xuICAgIG91dCArPSAnIGlmIChyb290RGF0YSA9PT0gdW5kZWZpbmVkKSByb290RGF0YSA9IGRhdGE7ICc7XG4gIH0gZWxzZSB7XG4gICAgdmFyICRsdmwgPSBpdC5sZXZlbCxcbiAgICAgICRkYXRhTHZsID0gaXQuZGF0YUxldmVsLFxuICAgICAgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICAgIGlmICgkaWQpIGl0LmJhc2VJZCA9IGl0LnJlc29sdmUudXJsKGl0LmJhc2VJZCwgJGlkKTtcbiAgICBpZiAoJGFzeW5jICYmICFpdC5hc3luYykgdGhyb3cgbmV3IEVycm9yKCdhc3luYyBzY2hlbWEgaW4gc3luYyBzY2hlbWEnKTtcbiAgICBvdXQgKz0gJyB2YXIgZXJyc18nICsgKCRsdmwpICsgJyA9IGVycm9yczsnO1xuICB9XG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bCxcbiAgICAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzLFxuICAgICRjbG9zaW5nQnJhY2VzMSA9ICcnLFxuICAgICRjbG9zaW5nQnJhY2VzMiA9ICcnO1xuICB2YXIgJGVycm9yS2V5d29yZDtcbiAgdmFyICR0eXBlU2NoZW1hID0gaXQuc2NoZW1hLnR5cGUsXG4gICAgJHR5cGVJc0FycmF5ID0gQXJyYXkuaXNBcnJheSgkdHlwZVNjaGVtYSk7XG4gIGlmICgkdHlwZVNjaGVtYSAmJiBpdC5vcHRzLm51bGxhYmxlICYmIGl0LnNjaGVtYS5udWxsYWJsZSA9PT0gdHJ1ZSkge1xuICAgIGlmICgkdHlwZUlzQXJyYXkpIHtcbiAgICAgIGlmICgkdHlwZVNjaGVtYS5pbmRleE9mKCdudWxsJykgPT0gLTEpICR0eXBlU2NoZW1hID0gJHR5cGVTY2hlbWEuY29uY2F0KCdudWxsJyk7XG4gICAgfSBlbHNlIGlmICgkdHlwZVNjaGVtYSAhPSAnbnVsbCcpIHtcbiAgICAgICR0eXBlU2NoZW1hID0gWyR0eXBlU2NoZW1hLCAnbnVsbCddO1xuICAgICAgJHR5cGVJc0FycmF5ID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgaWYgKCR0eXBlSXNBcnJheSAmJiAkdHlwZVNjaGVtYS5sZW5ndGggPT0gMSkge1xuICAgICR0eXBlU2NoZW1hID0gJHR5cGVTY2hlbWFbMF07XG4gICAgJHR5cGVJc0FycmF5ID0gZmFsc2U7XG4gIH1cbiAgaWYgKGl0LnNjaGVtYS4kcmVmICYmICRyZWZLZXl3b3Jkcykge1xuICAgIGlmIChpdC5vcHRzLmV4dGVuZFJlZnMgPT0gJ2ZhaWwnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJyRyZWY6IHZhbGlkYXRpb24ga2V5d29yZHMgdXNlZCBpbiBzY2hlbWEgYXQgcGF0aCBcIicgKyBpdC5lcnJTY2hlbWFQYXRoICsgJ1wiIChzZWUgb3B0aW9uIGV4dGVuZFJlZnMpJyk7XG4gICAgfSBlbHNlIGlmIChpdC5vcHRzLmV4dGVuZFJlZnMgIT09IHRydWUpIHtcbiAgICAgICRyZWZLZXl3b3JkcyA9IGZhbHNlO1xuICAgICAgaXQubG9nZ2VyLndhcm4oJyRyZWY6IGtleXdvcmRzIGlnbm9yZWQgaW4gc2NoZW1hIGF0IHBhdGggXCInICsgaXQuZXJyU2NoZW1hUGF0aCArICdcIicpO1xuICAgIH1cbiAgfVxuICBpZiAoaXQuc2NoZW1hLiRjb21tZW50ICYmIGl0Lm9wdHMuJGNvbW1lbnQpIHtcbiAgICBvdXQgKz0gJyAnICsgKGl0LlJVTEVTLmFsbC4kY29tbWVudC5jb2RlKGl0LCAnJGNvbW1lbnQnKSk7XG4gIH1cbiAgaWYgKCR0eXBlU2NoZW1hKSB7XG4gICAgaWYgKGl0Lm9wdHMuY29lcmNlVHlwZXMpIHtcbiAgICAgIHZhciAkY29lcmNlVG9UeXBlcyA9IGl0LnV0aWwuY29lcmNlVG9UeXBlcyhpdC5vcHRzLmNvZXJjZVR5cGVzLCAkdHlwZVNjaGVtYSk7XG4gICAgfVxuICAgIHZhciAkcnVsZXNHcm91cCA9IGl0LlJVTEVTLnR5cGVzWyR0eXBlU2NoZW1hXTtcbiAgICBpZiAoJGNvZXJjZVRvVHlwZXMgfHwgJHR5cGVJc0FycmF5IHx8ICRydWxlc0dyb3VwID09PSB0cnVlIHx8ICgkcnVsZXNHcm91cCAmJiAhJHNob3VsZFVzZUdyb3VwKCRydWxlc0dyb3VwKSkpIHtcbiAgICAgIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyAnLnR5cGUnLFxuICAgICAgICAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnL3R5cGUnO1xuICAgICAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArICcudHlwZScsXG4gICAgICAgICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvdHlwZScsXG4gICAgICAgICRtZXRob2QgPSAkdHlwZUlzQXJyYXkgPyAnY2hlY2tEYXRhVHlwZXMnIDogJ2NoZWNrRGF0YVR5cGUnO1xuICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoaXQudXRpbFskbWV0aG9kXSgkdHlwZVNjaGVtYSwgJGRhdGEsIHRydWUpKSArICcpIHsgJztcbiAgICAgIGlmICgkY29lcmNlVG9UeXBlcykge1xuICAgICAgICB2YXIgJGRhdGFUeXBlID0gJ2RhdGFUeXBlJyArICRsdmwsXG4gICAgICAgICAgJGNvZXJjZWQgPSAnY29lcmNlZCcgKyAkbHZsO1xuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkZGF0YVR5cGUpICsgJyA9IHR5cGVvZiAnICsgKCRkYXRhKSArICc7ICc7XG4gICAgICAgIGlmIChpdC5vcHRzLmNvZXJjZVR5cGVzID09ICdhcnJheScpIHtcbiAgICAgICAgICBvdXQgKz0gJyBpZiAoJyArICgkZGF0YVR5cGUpICsgJyA9PSBcXCdvYmplY3RcXCcgJiYgQXJyYXkuaXNBcnJheSgnICsgKCRkYXRhKSArICcpKSAnICsgKCRkYXRhVHlwZSkgKyAnID0gXFwnYXJyYXlcXCc7ICc7XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICcgdmFyICcgKyAoJGNvZXJjZWQpICsgJyA9IHVuZGVmaW5lZDsgJztcbiAgICAgICAgdmFyICRicmFjZXNDb2VyY2lvbiA9ICcnO1xuICAgICAgICB2YXIgYXJyMSA9ICRjb2VyY2VUb1R5cGVzO1xuICAgICAgICBpZiAoYXJyMSkge1xuICAgICAgICAgIHZhciAkdHlwZSwgJGkgPSAtMSxcbiAgICAgICAgICAgIGwxID0gYXJyMS5sZW5ndGggLSAxO1xuICAgICAgICAgIHdoaWxlICgkaSA8IGwxKSB7XG4gICAgICAgICAgICAkdHlwZSA9IGFycjFbJGkgKz0gMV07XG4gICAgICAgICAgICBpZiAoJGkpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGNvZXJjZWQpICsgJyA9PT0gdW5kZWZpbmVkKSB7ICc7XG4gICAgICAgICAgICAgICRicmFjZXNDb2VyY2lvbiArPSAnfSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXQub3B0cy5jb2VyY2VUeXBlcyA9PSAnYXJyYXknICYmICR0eXBlICE9ICdhcnJheScpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnYXJyYXlcXCcgJiYgJyArICgkZGF0YSkgKyAnLmxlbmd0aCA9PSAxKSB7ICcgKyAoJGNvZXJjZWQpICsgJyA9ICcgKyAoJGRhdGEpICsgJyA9ICcgKyAoJGRhdGEpICsgJ1swXTsgJyArICgkZGF0YVR5cGUpICsgJyA9IHR5cGVvZiAnICsgKCRkYXRhKSArICc7ICB9ICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnbnVtYmVyXFwnIHx8ICcgKyAoJGRhdGFUeXBlKSArICcgPT0gXFwnYm9vbGVhblxcJykgJyArICgkY29lcmNlZCkgKyAnID0gXFwnXFwnICsgJyArICgkZGF0YSkgKyAnOyBlbHNlIGlmICgnICsgKCRkYXRhKSArICcgPT09IG51bGwpICcgKyAoJGNvZXJjZWQpICsgJyA9IFxcJ1xcJzsgJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHR5cGUgPT0gJ251bWJlcicgfHwgJHR5cGUgPT0gJ2ludGVnZXInKSB7XG4gICAgICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRkYXRhVHlwZSkgKyAnID09IFxcJ2Jvb2xlYW5cXCcgfHwgJyArICgkZGF0YSkgKyAnID09PSBudWxsIHx8ICgnICsgKCRkYXRhVHlwZSkgKyAnID09IFxcJ3N0cmluZ1xcJyAmJiAnICsgKCRkYXRhKSArICcgJiYgJyArICgkZGF0YSkgKyAnID09ICsnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgICAgICAgaWYgKCR0eXBlID09ICdpbnRlZ2VyJykge1xuICAgICAgICAgICAgICAgIG91dCArPSAnICYmICEoJyArICgkZGF0YSkgKyAnICUgMSknO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG91dCArPSAnKSkgJyArICgkY29lcmNlZCkgKyAnID0gKycgKyAoJGRhdGEpICsgJzsgJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHR5cGUgPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRkYXRhKSArICcgPT09IFxcJ2ZhbHNlXFwnIHx8ICcgKyAoJGRhdGEpICsgJyA9PT0gMCB8fCAnICsgKCRkYXRhKSArICcgPT09IG51bGwpICcgKyAoJGNvZXJjZWQpICsgJyA9IGZhbHNlOyBlbHNlIGlmICgnICsgKCRkYXRhKSArICcgPT09IFxcJ3RydWVcXCcgfHwgJyArICgkZGF0YSkgKyAnID09PSAxKSAnICsgKCRjb2VyY2VkKSArICcgPSB0cnVlOyAnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkdHlwZSA9PSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGEpICsgJyA9PT0gXFwnXFwnIHx8ICcgKyAoJGRhdGEpICsgJyA9PT0gMCB8fCAnICsgKCRkYXRhKSArICcgPT09IGZhbHNlKSAnICsgKCRjb2VyY2VkKSArICcgPSBudWxsOyAnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpdC5vcHRzLmNvZXJjZVR5cGVzID09ICdhcnJheScgJiYgJHR5cGUgPT0gJ2FycmF5Jykge1xuICAgICAgICAgICAgICBvdXQgKz0gJyBpZiAoJyArICgkZGF0YVR5cGUpICsgJyA9PSBcXCdzdHJpbmdcXCcgfHwgJyArICgkZGF0YVR5cGUpICsgJyA9PSBcXCdudW1iZXJcXCcgfHwgJyArICgkZGF0YVR5cGUpICsgJyA9PSBcXCdib29sZWFuXFwnIHx8ICcgKyAoJGRhdGEpICsgJyA9PSBudWxsKSAnICsgKCRjb2VyY2VkKSArICcgPSBbJyArICgkZGF0YSkgKyAnXTsgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICcgJyArICgkYnJhY2VzQ29lcmNpb24pICsgJyBpZiAoJyArICgkY29lcmNlZCkgKyAnID09PSB1bmRlZmluZWQpIHsgICAnO1xuICAgICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICAgICAgICQkb3V0U3RhY2sucHVzaChvdXQpO1xuICAgICAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAndHlwZScpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgdHlwZTogXFwnJztcbiAgICAgICAgICBpZiAoJHR5cGVJc0FycmF5KSB7XG4gICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEuam9pbihcIixcIikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdXQgKz0gJ1xcJyB9ICc7XG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBiZSAnO1xuICAgICAgICAgICAgaWYgKCR0eXBlSXNBcnJheSkge1xuICAgICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEuam9pbihcIixcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcnICsgKCR0eXBlU2NoZW1hKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSAnXFwnICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcbiAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dCArPSAnIH0gJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gJyB7fSAnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfX2VyciA9IG91dDtcbiAgICAgICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICcgfSBlbHNlIHsgICc7XG4gICAgICAgIHZhciAkcGFyZW50RGF0YSA9ICRkYXRhTHZsID8gJ2RhdGEnICsgKCgkZGF0YUx2bCAtIDEpIHx8ICcnKSA6ICdwYXJlbnREYXRhJyxcbiAgICAgICAgICAkcGFyZW50RGF0YVByb3BlcnR5ID0gJGRhdGFMdmwgPyBpdC5kYXRhUGF0aEFyclskZGF0YUx2bF0gOiAncGFyZW50RGF0YVByb3BlcnR5JztcbiAgICAgICAgb3V0ICs9ICcgJyArICgkZGF0YSkgKyAnID0gJyArICgkY29lcmNlZCkgKyAnOyAnO1xuICAgICAgICBpZiAoISRkYXRhTHZsKSB7XG4gICAgICAgICAgb3V0ICs9ICdpZiAoJyArICgkcGFyZW50RGF0YSkgKyAnICE9PSB1bmRlZmluZWQpJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyAnICsgKCRwYXJlbnREYXRhKSArICdbJyArICgkcGFyZW50RGF0YVByb3BlcnR5KSArICddID0gJyArICgkY29lcmNlZCkgKyAnOyB9ICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICAgICAgICQkb3V0U3RhY2sucHVzaChvdXQpO1xuICAgICAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAndHlwZScpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgdHlwZTogXFwnJztcbiAgICAgICAgICBpZiAoJHR5cGVJc0FycmF5KSB7XG4gICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEuam9pbihcIixcIikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdXQgKz0gJ1xcJyB9ICc7XG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBiZSAnO1xuICAgICAgICAgICAgaWYgKCR0eXBlSXNBcnJheSkge1xuICAgICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEuam9pbihcIixcIikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcnICsgKCR0eXBlU2NoZW1hKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSAnXFwnICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcbiAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dCArPSAnIH0gJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gJyB7fSAnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfX2VyciA9IG91dDtcbiAgICAgICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG91dCArPSAnIH0gJztcbiAgICB9XG4gIH1cbiAgaWYgKGl0LnNjaGVtYS4kcmVmICYmICEkcmVmS2V5d29yZHMpIHtcbiAgICBvdXQgKz0gJyAnICsgKGl0LlJVTEVTLmFsbC4kcmVmLmNvZGUoaXQsICckcmVmJykpICsgJyAnO1xuICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICBvdXQgKz0gJyB9IGlmIChlcnJvcnMgPT09ICc7XG4gICAgICBpZiAoJHRvcCkge1xuICAgICAgICBvdXQgKz0gJzAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICdlcnJzXycgKyAoJGx2bCk7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJykgeyAnO1xuICAgICAgJGNsb3NpbmdCcmFjZXMyICs9ICd9JztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGFycjIgPSBpdC5SVUxFUztcbiAgICBpZiAoYXJyMikge1xuICAgICAgdmFyICRydWxlc0dyb3VwLCBpMiA9IC0xLFxuICAgICAgICBsMiA9IGFycjIubGVuZ3RoIC0gMTtcbiAgICAgIHdoaWxlIChpMiA8IGwyKSB7XG4gICAgICAgICRydWxlc0dyb3VwID0gYXJyMltpMiArPSAxXTtcbiAgICAgICAgaWYgKCRzaG91bGRVc2VHcm91cCgkcnVsZXNHcm91cCkpIHtcbiAgICAgICAgICBpZiAoJHJ1bGVzR3JvdXAudHlwZSkge1xuICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoaXQudXRpbC5jaGVja0RhdGFUeXBlKCRydWxlc0dyb3VwLnR5cGUsICRkYXRhKSkgKyAnKSB7ICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdC5vcHRzLnVzZURlZmF1bHRzICYmICFpdC5jb21wb3NpdGVSdWxlKSB7XG4gICAgICAgICAgICBpZiAoJHJ1bGVzR3JvdXAudHlwZSA9PSAnb2JqZWN0JyAmJiBpdC5zY2hlbWEucHJvcGVydGllcykge1xuICAgICAgICAgICAgICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYS5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICRzY2hlbWFLZXlzID0gT2JqZWN0LmtleXMoJHNjaGVtYSk7XG4gICAgICAgICAgICAgIHZhciBhcnIzID0gJHNjaGVtYUtleXM7XG4gICAgICAgICAgICAgIGlmIChhcnIzKSB7XG4gICAgICAgICAgICAgICAgdmFyICRwcm9wZXJ0eUtleSwgaTMgPSAtMSxcbiAgICAgICAgICAgICAgICAgIGwzID0gYXJyMy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpMyA8IGwzKSB7XG4gICAgICAgICAgICAgICAgICAkcHJvcGVydHlLZXkgPSBhcnIzW2kzICs9IDFdO1xuICAgICAgICAgICAgICAgICAgdmFyICRzY2ggPSAkc2NoZW1hWyRwcm9wZXJ0eUtleV07XG4gICAgICAgICAgICAgICAgICBpZiAoJHNjaC5kZWZhdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRwYXNzRGF0YSA9ICRkYXRhICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgkcHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyAgaWYgKCcgKyAoJHBhc3NEYXRhKSArICcgPT09IHVuZGVmaW5lZCAnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy51c2VEZWZhdWx0cyA9PSAnZW1wdHknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgfHwgJyArICgkcGFzc0RhdGEpICsgJyA9PT0gbnVsbCB8fCAnICsgKCRwYXNzRGF0YSkgKyAnID09PSBcXCdcXCcgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyApICcgKyAoJHBhc3NEYXRhKSArICcgPSAnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy51c2VEZWZhdWx0cyA9PSAnc2hhcmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnICcgKyAoaXQudXNlRGVmYXVsdCgkc2NoLmRlZmF1bHQpKSArICcgJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyAnICsgKEpTT04uc3RyaW5naWZ5KCRzY2guZGVmYXVsdCkpICsgJyAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSAnOyAnO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgkcnVsZXNHcm91cC50eXBlID09ICdhcnJheScgJiYgQXJyYXkuaXNBcnJheShpdC5zY2hlbWEuaXRlbXMpKSB7XG4gICAgICAgICAgICAgIHZhciBhcnI0ID0gaXQuc2NoZW1hLml0ZW1zO1xuICAgICAgICAgICAgICBpZiAoYXJyNCkge1xuICAgICAgICAgICAgICAgIHZhciAkc2NoLCAkaSA9IC0xLFxuICAgICAgICAgICAgICAgICAgbDQgPSBhcnI0Lmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCRpIDwgbDQpIHtcbiAgICAgICAgICAgICAgICAgICRzY2ggPSBhcnI0WyRpICs9IDFdO1xuICAgICAgICAgICAgICAgICAgaWYgKCRzY2guZGVmYXVsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRpICsgJ10nO1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyAgaWYgKCcgKyAoJHBhc3NEYXRhKSArICcgPT09IHVuZGVmaW5lZCAnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy51c2VEZWZhdWx0cyA9PSAnZW1wdHknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgfHwgJyArICgkcGFzc0RhdGEpICsgJyA9PT0gbnVsbCB8fCAnICsgKCRwYXNzRGF0YSkgKyAnID09PSBcXCdcXCcgJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyApICcgKyAoJHBhc3NEYXRhKSArICcgPSAnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy51c2VEZWZhdWx0cyA9PSAnc2hhcmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgIG91dCArPSAnICcgKyAoaXQudXNlRGVmYXVsdCgkc2NoLmRlZmF1bHQpKSArICcgJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJyAnICsgKEpTT04uc3RyaW5naWZ5KCRzY2guZGVmYXVsdCkpICsgJyAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSAnOyAnO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgYXJyNSA9ICRydWxlc0dyb3VwLnJ1bGVzO1xuICAgICAgICAgIGlmIChhcnI1KSB7XG4gICAgICAgICAgICB2YXIgJHJ1bGUsIGk1ID0gLTEsXG4gICAgICAgICAgICAgIGw1ID0gYXJyNS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgd2hpbGUgKGk1IDwgbDUpIHtcbiAgICAgICAgICAgICAgJHJ1bGUgPSBhcnI1W2k1ICs9IDFdO1xuICAgICAgICAgICAgICBpZiAoJHNob3VsZFVzZVJ1bGUoJHJ1bGUpKSB7XG4gICAgICAgICAgICAgICAgdmFyICRjb2RlID0gJHJ1bGUuY29kZShpdCwgJHJ1bGUua2V5d29yZCwgJHJ1bGVzR3JvdXAudHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKCRjb2RlKSB7XG4gICAgICAgICAgICAgICAgICBvdXQgKz0gJyAnICsgKCRjb2RlKSArICcgJztcbiAgICAgICAgICAgICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICRjbG9zaW5nQnJhY2VzMSArPSAnfSc7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAnICsgKCRjbG9zaW5nQnJhY2VzMSkgKyAnICc7XG4gICAgICAgICAgICAkY2xvc2luZ0JyYWNlczEgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCRydWxlc0dyb3VwLnR5cGUpIHtcbiAgICAgICAgICAgIG91dCArPSAnIH0gJztcbiAgICAgICAgICAgIGlmICgkdHlwZVNjaGVtYSAmJiAkdHlwZVNjaGVtYSA9PT0gJHJ1bGVzR3JvdXAudHlwZSAmJiAhJGNvZXJjZVRvVHlwZXMpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgZWxzZSB7ICc7XG4gICAgICAgICAgICAgIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyAnLnR5cGUnLFxuICAgICAgICAgICAgICAgICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvdHlwZSc7XG4gICAgICAgICAgICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgICAgICAgICAgICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gICAgICAgICAgICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgkZXJyb3JLZXl3b3JkIHx8ICd0eXBlJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyB0eXBlOiBcXCcnO1xuICAgICAgICAgICAgICAgIGlmICgkdHlwZUlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnJyArICgkdHlwZVNjaGVtYS5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnJyArICgkdHlwZVNjaGVtYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dCArPSAnXFwnIH0gJztcbiAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIGJlICc7XG4gICAgICAgICAgICAgICAgICBpZiAoJHR5cGVJc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSAnJyArICgkdHlwZVNjaGVtYS5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJycgKyAoJHR5cGVTY2hlbWEpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgfSAnO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xuICAgICAgICAgICAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgIGlmIChpdC5hc3luYykge1xuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyBpZiAoZXJyb3JzID09PSAnO1xuICAgICAgICAgICAgaWYgKCR0b3ApIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcwJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG91dCArPSAnZXJyc18nICsgKCRsdmwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0ICs9ICcpIHsgJztcbiAgICAgICAgICAgICRjbG9zaW5nQnJhY2VzMiArPSAnfSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgb3V0ICs9ICcgJyArICgkY2xvc2luZ0JyYWNlczIpICsgJyAnO1xuICB9XG4gIGlmICgkdG9wKSB7XG4gICAgaWYgKCRhc3luYykge1xuICAgICAgb3V0ICs9ICcgaWYgKGVycm9ycyA9PT0gMCkgcmV0dXJuIGRhdGE7ICAgICAgICAgICAnO1xuICAgICAgb3V0ICs9ICcgZWxzZSB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHZFcnJvcnMpOyAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzOyAnO1xuICAgICAgb3V0ICs9ICcgcmV0dXJuIGVycm9ycyA9PT0gMDsgICAgICAgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfTsgcmV0dXJuIHZhbGlkYXRlOyc7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcgdmFyICcgKyAoJHZhbGlkKSArICcgPSBlcnJvcnMgPT09IGVycnNfJyArICgkbHZsKSArICc7JztcbiAgfVxuICBvdXQgPSBpdC51dGlsLmNsZWFuVXBDb2RlKG91dCk7XG4gIGlmICgkdG9wKSB7XG4gICAgb3V0ID0gaXQudXRpbC5maW5hbENsZWFuVXBDb2RlKG91dCwgJGFzeW5jKTtcbiAgfVxuXG4gIGZ1bmN0aW9uICRzaG91bGRVc2VHcm91cCgkcnVsZXNHcm91cCkge1xuICAgIHZhciBydWxlcyA9ICRydWxlc0dyb3VwLnJ1bGVzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyspXG4gICAgICBpZiAoJHNob3VsZFVzZVJ1bGUocnVsZXNbaV0pKSByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uICRzaG91bGRVc2VSdWxlKCRydWxlKSB7XG4gICAgcmV0dXJuIGl0LnNjaGVtYVskcnVsZS5rZXl3b3JkXSAhPT0gdW5kZWZpbmVkIHx8ICgkcnVsZS5pbXBsZW1lbnRzICYmICRydWxlSW1wbGVtZW50c1NvbWVLZXl3b3JkKCRydWxlKSk7XG4gIH1cblxuICBmdW5jdGlvbiAkcnVsZUltcGxlbWVudHNTb21lS2V5d29yZCgkcnVsZSkge1xuICAgIHZhciBpbXBsID0gJHJ1bGUuaW1wbGVtZW50cztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltcGwubGVuZ3RoOyBpKyspXG4gICAgICBpZiAoaXQuc2NoZW1hW2ltcGxbaV1dICE9PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX19saW1pdEl0ZW1zKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZXJyb3JLZXl3b3JkO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxuICAgICRzY2hlbWFWYWx1ZTtcbiAgaWYgKCRpc0RhdGEpIHtcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XG4gICAgJHNjaGVtYVZhbHVlID0gJ3NjaGVtYScgKyAkbHZsO1xuICB9IGVsc2Uge1xuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XG4gIH1cbiAgdmFyICRvcCA9ICRrZXl3b3JkID09ICdtYXhJdGVtcycgPyAnPicgOiAnPCc7XG4gIG91dCArPSAnaWYgKCAnO1xuICBpZiAoJGlzRGF0YSkge1xuICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnbnVtYmVyXFwnKSB8fCAnO1xuICB9XG4gIG91dCArPSAnICcgKyAoJGRhdGEpICsgJy5sZW5ndGggJyArICgkb3ApICsgJyAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnKSB7ICc7XG4gIHZhciAkZXJyb3JLZXl3b3JkID0gJGtleXdvcmQ7XG4gIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgkZXJyb3JLZXl3b3JkIHx8ICdfbGltaXRJdGVtcycpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbGltaXQ6ICcgKyAoJHNjaGVtYVZhbHVlKSArICcgfSAnO1xuICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgTk9UIGhhdmUgJztcbiAgICAgIGlmICgka2V5d29yZCA9PSAnbWF4SXRlbXMnKSB7XG4gICAgICAgIG91dCArPSAnbW9yZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJ2Zld2VyJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnIHRoYW4gJztcbiAgICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICAgIG91dCArPSAnXFwnICsgJyArICgkc2NoZW1hVmFsdWUpICsgJyArIFxcJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJycgKyAoJHNjaGVtYSk7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyBpdGVtc1xcJyAnO1xuICAgIH1cbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICBvdXQgKz0gJyAsIHNjaGVtYTogICc7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWEpO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgICAgICAgICAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfSAnO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHt9ICc7XG4gIH1cbiAgdmFyIF9fZXJyID0gb3V0O1xuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChpdC5hc3luYykge1xuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgfVxuICBvdXQgKz0gJ30gJztcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9pZihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xuICB2YXIgb3V0ID0gJyAnO1xuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJHZhbGlkID0gJ3ZhbGlkJyArICRsdmw7XG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcbiAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XG4gICRpdC5sZXZlbCsrO1xuICB2YXIgJG5leHRWYWxpZCA9ICd2YWxpZCcgKyAkaXQubGV2ZWw7XG4gIHZhciAkdGhlblNjaCA9IGl0LnNjaGVtYVsndGhlbiddLFxuICAgICRlbHNlU2NoID0gaXQuc2NoZW1hWydlbHNlJ10sXG4gICAgJHRoZW5QcmVzZW50ID0gJHRoZW5TY2ggIT09IHVuZGVmaW5lZCAmJiBpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCR0aGVuU2NoLCBpdC5SVUxFUy5hbGwpLFxuICAgICRlbHNlUHJlc2VudCA9ICRlbHNlU2NoICE9PSB1bmRlZmluZWQgJiYgaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkZWxzZVNjaCwgaXQuUlVMRVMuYWxsKSxcbiAgICAkY3VycmVudEJhc2VJZCA9ICRpdC5iYXNlSWQ7XG4gIGlmICgkdGhlblByZXNlbnQgfHwgJGVsc2VQcmVzZW50KSB7XG4gICAgdmFyICRpZkNsYXVzZTtcbiAgICAkaXQuY3JlYXRlRXJyb3JzID0gZmFsc2U7XG4gICAgJGl0LnNjaGVtYSA9ICRzY2hlbWE7XG4gICAgJGl0LnNjaGVtYVBhdGggPSAkc2NoZW1hUGF0aDtcbiAgICAkaXQuZXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoO1xuICAgIG91dCArPSAnIHZhciAnICsgKCRlcnJzKSArICcgPSBlcnJvcnM7IHZhciAnICsgKCR2YWxpZCkgKyAnID0gdHJ1ZTsgICc7XG4gICAgdmFyICR3YXNDb21wb3NpdGUgPSBpdC5jb21wb3NpdGVSdWxlO1xuICAgIGl0LmNvbXBvc2l0ZVJ1bGUgPSAkaXQuY29tcG9zaXRlUnVsZSA9IHRydWU7XG4gICAgb3V0ICs9ICcgICcgKyAoaXQudmFsaWRhdGUoJGl0KSkgKyAnICc7XG4gICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xuICAgICRpdC5jcmVhdGVFcnJvcnMgPSB0cnVlO1xuICAgIG91dCArPSAnICBlcnJvcnMgPSAnICsgKCRlcnJzKSArICc7IGlmICh2RXJyb3JzICE9PSBudWxsKSB7IGlmICgnICsgKCRlcnJzKSArICcpIHZFcnJvcnMubGVuZ3RoID0gJyArICgkZXJycykgKyAnOyBlbHNlIHZFcnJvcnMgPSBudWxsOyB9ICAnO1xuICAgIGl0LmNvbXBvc2l0ZVJ1bGUgPSAkaXQuY29tcG9zaXRlUnVsZSA9ICR3YXNDb21wb3NpdGU7XG4gICAgaWYgKCR0aGVuUHJlc2VudCkge1xuICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICAnO1xuICAgICAgJGl0LnNjaGVtYSA9IGl0LnNjaGVtYVsndGhlbiddO1xuICAgICAgJGl0LnNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgJy50aGVuJztcbiAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvdGhlbic7XG4gICAgICBvdXQgKz0gJyAgJyArIChpdC52YWxpZGF0ZSgkaXQpKSArICcgJztcbiAgICAgICRpdC5iYXNlSWQgPSAkY3VycmVudEJhc2VJZDtcbiAgICAgIG91dCArPSAnICcgKyAoJHZhbGlkKSArICcgPSAnICsgKCRuZXh0VmFsaWQpICsgJzsgJztcbiAgICAgIGlmICgkdGhlblByZXNlbnQgJiYgJGVsc2VQcmVzZW50KSB7XG4gICAgICAgICRpZkNsYXVzZSA9ICdpZkNsYXVzZScgKyAkbHZsO1xuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkaWZDbGF1c2UpICsgJyA9IFxcJ3RoZW5cXCc7ICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkaWZDbGF1c2UgPSAnXFwndGhlblxcJyc7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICBpZiAoJGVsc2VQcmVzZW50KSB7XG4gICAgICAgIG91dCArPSAnIGVsc2UgeyAnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyBpZiAoIScgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICc7XG4gICAgfVxuICAgIGlmICgkZWxzZVByZXNlbnQpIHtcbiAgICAgICRpdC5zY2hlbWEgPSBpdC5zY2hlbWFbJ2Vsc2UnXTtcbiAgICAgICRpdC5zY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArICcuZWxzZSc7XG4gICAgICAkaXQuZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnL2Vsc2UnO1xuICAgICAgb3V0ICs9ICcgICcgKyAoaXQudmFsaWRhdGUoJGl0KSkgKyAnICc7XG4gICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XG4gICAgICBvdXQgKz0gJyAnICsgKCR2YWxpZCkgKyAnID0gJyArICgkbmV4dFZhbGlkKSArICc7ICc7XG4gICAgICBpZiAoJHRoZW5QcmVzZW50ICYmICRlbHNlUHJlc2VudCkge1xuICAgICAgICAkaWZDbGF1c2UgPSAnaWZDbGF1c2UnICsgJGx2bDtcbiAgICAgICAgb3V0ICs9ICcgdmFyICcgKyAoJGlmQ2xhdXNlKSArICcgPSBcXCdlbHNlXFwnOyAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGlmQ2xhdXNlID0gJ1xcJ2Vsc2VcXCcnO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgfSAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyBpZiAoIScgKyAoJHZhbGlkKSArICcpIHsgICB2YXIgZXJyID0gICAnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ2lmJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBmYWlsaW5nS2V5d29yZDogJyArICgkaWZDbGF1c2UpICsgJyB9ICc7XG4gICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgbWF0Y2ggXCJcXCcgKyAnICsgKCRpZkNsYXVzZSkgKyAnICsgXFwnXCIgc2NoZW1hXFwnICc7XG4gICAgICB9XG4gICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB9ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgfVxuICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodkVycm9ycyk7ICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgICB9XG4gICAgfVxuICAgIG91dCArPSAnIH0gICAnO1xuICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgICB9XG4gICAgb3V0ID0gaXQudXRpbC5jbGVhblVwQ29kZShvdXQpO1xuICB9IGVsc2Uge1xuICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICBvdXQgKz0gJyBpZiAodHJ1ZSkgeyAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9lbnVtKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcbiAgdmFyICRpc0RhdGEgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWEgJiYgJHNjaGVtYS4kZGF0YSxcbiAgICAkc2NoZW1hVmFsdWU7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYScgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLmdldERhdGEoJHNjaGVtYS4kZGF0YSwgJGRhdGFMdmwsIGl0LmRhdGFQYXRoQXJyKSkgKyAnOyAnO1xuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcbiAgfSBlbHNlIHtcbiAgICAkc2NoZW1hVmFsdWUgPSAkc2NoZW1hO1xuICB9XG4gIHZhciAkaSA9ICdpJyArICRsdmwsXG4gICAgJHZTY2hlbWEgPSAnc2NoZW1hJyArICRsdmw7XG4gIGlmICghJGlzRGF0YSkge1xuICAgIG91dCArPSAnIHZhciAnICsgKCR2U2NoZW1hKSArICcgPSB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICc7JztcbiAgfVxuICBvdXQgKz0gJ3ZhciAnICsgKCR2YWxpZCkgKyAnOyc7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgaWYgKHNjaGVtYScgKyAoJGx2bCkgKyAnID09PSB1bmRlZmluZWQpICcgKyAoJHZhbGlkKSArICcgPSB0cnVlOyBlbHNlIGlmICghQXJyYXkuaXNBcnJheShzY2hlbWEnICsgKCRsdmwpICsgJykpICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgZWxzZSB7JztcbiAgfVxuICBvdXQgKz0gJycgKyAoJHZhbGlkKSArICcgPSBmYWxzZTtmb3IgKHZhciAnICsgKCRpKSArICc9MDsgJyArICgkaSkgKyAnPCcgKyAoJHZTY2hlbWEpICsgJy5sZW5ndGg7ICcgKyAoJGkpICsgJysrKSBpZiAoZXF1YWwoJyArICgkZGF0YSkgKyAnLCAnICsgKCR2U2NoZW1hKSArICdbJyArICgkaSkgKyAnXSkpIHsgJyArICgkdmFsaWQpICsgJyA9IHRydWU7IGJyZWFrOyB9JztcbiAgaWYgKCRpc0RhdGEpIHtcbiAgICBvdXQgKz0gJyAgfSAgJztcbiAgfVxuICBvdXQgKz0gJyBpZiAoIScgKyAoJHZhbGlkKSArICcpIHsgICAnO1xuICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICQkb3V0U3RhY2sucHVzaChvdXQpO1xuICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ2VudW0nKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGFsbG93ZWRWYWx1ZXM6IHNjaGVtYScgKyAoJGx2bCkgKyAnIH0gJztcbiAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIGJlIGVxdWFsIHRvIG9uZSBvZiB0aGUgYWxsb3dlZCB2YWx1ZXNcXCcgJztcbiAgICB9XG4gICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfSAnO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHt9ICc7XG4gIH1cbiAgdmFyIF9fZXJyID0gb3V0O1xuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChpdC5hc3luYykge1xuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgfVxuICBvdXQgKz0gJyB9JztcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9hbGxPZihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xuICB2YXIgb3V0ID0gJyAnO1xuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XG4gIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRrZXl3b3JkKTtcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcbiAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xuICAkaXQubGV2ZWwrKztcbiAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xuICB2YXIgJGN1cnJlbnRCYXNlSWQgPSAkaXQuYmFzZUlkLFxuICAgICRhbGxTY2hlbWFzRW1wdHkgPSB0cnVlO1xuICB2YXIgYXJyMSA9ICRzY2hlbWE7XG4gIGlmIChhcnIxKSB7XG4gICAgdmFyICRzY2gsICRpID0gLTEsXG4gICAgICBsMSA9IGFycjEubGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAoJGkgPCBsMSkge1xuICAgICAgJHNjaCA9IGFycjFbJGkgKz0gMV07XG4gICAgICBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoLCBpdC5SVUxFUy5hbGwpKSB7XG4gICAgICAgICRhbGxTY2hlbWFzRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XG4gICAgICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGggKyAnWycgKyAkaSArICddJztcbiAgICAgICAgJGl0LmVyclNjaGVtYVBhdGggPSAkZXJyU2NoZW1hUGF0aCArICcvJyArICRpO1xuICAgICAgICBvdXQgKz0gJyAgJyArIChpdC52YWxpZGF0ZSgkaXQpKSArICcgJztcbiAgICAgICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xuICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnO1xuICAgICAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgIGlmICgkYWxsU2NoZW1hc0VtcHR5KSB7XG4gICAgICBvdXQgKz0gJyBpZiAodHJ1ZSkgeyAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyAnICsgKCRjbG9zaW5nQnJhY2VzLnNsaWNlKDAsIC0xKSkgKyAnICc7XG4gICAgfVxuICB9XG4gIG91dCA9IGl0LnV0aWwuY2xlYW5VcENvZGUob3V0KTtcbiAgcmV0dXJuIG91dDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgQ2FjaGUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIENhY2hlKCkge1xuICB0aGlzLl9jYWNoZSA9IHt9O1xufTtcblxuXG5DYWNoZS5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gQ2FjaGVfcHV0KGtleSwgdmFsdWUpIHtcbiAgdGhpcy5fY2FjaGVba2V5XSA9IHZhbHVlO1xufTtcblxuXG5DYWNoZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gQ2FjaGVfZ2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fY2FjaGVba2V5XTtcbn07XG5cblxuQ2FjaGUucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uIENhY2hlX2RlbChrZXkpIHtcbiAgZGVsZXRlIHRoaXMuX2NhY2hlW2tleV07XG59O1xuXG5cbkNhY2hlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIENhY2hlX2NsZWFyKCkge1xuICB0aGlzLl9jYWNoZSA9IHt9O1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfZm9ybWF0KGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XG4gIGlmIChpdC5vcHRzLmZvcm1hdCA9PT0gZmFsc2UpIHtcbiAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfVxuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxuICAgICRzY2hlbWFWYWx1ZTtcbiAgaWYgKCRpc0RhdGEpIHtcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XG4gICAgJHNjaGVtYVZhbHVlID0gJ3NjaGVtYScgKyAkbHZsO1xuICB9IGVsc2Uge1xuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XG4gIH1cbiAgdmFyICR1bmtub3duRm9ybWF0cyA9IGl0Lm9wdHMudW5rbm93bkZvcm1hdHMsXG4gICAgJGFsbG93VW5rbm93biA9IEFycmF5LmlzQXJyYXkoJHVua25vd25Gb3JtYXRzKTtcbiAgaWYgKCRpc0RhdGEpIHtcbiAgICB2YXIgJGZvcm1hdCA9ICdmb3JtYXQnICsgJGx2bCxcbiAgICAgICRpc09iamVjdCA9ICdpc09iamVjdCcgKyAkbHZsLFxuICAgICAgJGZvcm1hdFR5cGUgPSAnZm9ybWF0VHlwZScgKyAkbHZsO1xuICAgIG91dCArPSAnIHZhciAnICsgKCRmb3JtYXQpICsgJyA9IGZvcm1hdHNbJyArICgkc2NoZW1hVmFsdWUpICsgJ107IHZhciAnICsgKCRpc09iamVjdCkgKyAnID0gdHlwZW9mICcgKyAoJGZvcm1hdCkgKyAnID09IFxcJ29iamVjdFxcJyAmJiAhKCcgKyAoJGZvcm1hdCkgKyAnIGluc3RhbmNlb2YgUmVnRXhwKSAmJiAnICsgKCRmb3JtYXQpICsgJy52YWxpZGF0ZTsgdmFyICcgKyAoJGZvcm1hdFR5cGUpICsgJyA9ICcgKyAoJGlzT2JqZWN0KSArICcgJiYgJyArICgkZm9ybWF0KSArICcudHlwZSB8fCBcXCdzdHJpbmdcXCc7IGlmICgnICsgKCRpc09iamVjdCkgKyAnKSB7ICc7XG4gICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICBvdXQgKz0gJyB2YXIgYXN5bmMnICsgKCRsdmwpICsgJyA9ICcgKyAoJGZvcm1hdCkgKyAnLmFzeW5jOyAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyAnICsgKCRmb3JtYXQpICsgJyA9ICcgKyAoJGZvcm1hdCkgKyAnLnZhbGlkYXRlOyB9IGlmICggICc7XG4gICAgaWYgKCRpc0RhdGEpIHtcbiAgICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnc3RyaW5nXFwnKSB8fCAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyAoJztcbiAgICBpZiAoJHVua25vd25Gb3JtYXRzICE9ICdpZ25vcmUnKSB7XG4gICAgICBvdXQgKz0gJyAoJyArICgkc2NoZW1hVmFsdWUpICsgJyAmJiAhJyArICgkZm9ybWF0KSArICcgJztcbiAgICAgIGlmICgkYWxsb3dVbmtub3duKSB7XG4gICAgICAgIG91dCArPSAnICYmIHNlbGYuX29wdHMudW5rbm93bkZvcm1hdHMuaW5kZXhPZignICsgKCRzY2hlbWFWYWx1ZSkgKyAnKSA9PSAtMSAnO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcpIHx8ICc7XG4gICAgfVxuICAgIG91dCArPSAnICgnICsgKCRmb3JtYXQpICsgJyAmJiAnICsgKCRmb3JtYXRUeXBlKSArICcgPT0gXFwnJyArICgkcnVsZVR5cGUpICsgJ1xcJyAmJiAhKHR5cGVvZiAnICsgKCRmb3JtYXQpICsgJyA9PSBcXCdmdW5jdGlvblxcJyA/ICc7XG4gICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICBvdXQgKz0gJyAoYXN5bmMnICsgKCRsdmwpICsgJyA/IGF3YWl0ICcgKyAoJGZvcm1hdCkgKyAnKCcgKyAoJGRhdGEpICsgJykgOiAnICsgKCRmb3JtYXQpICsgJygnICsgKCRkYXRhKSArICcpKSAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyAnICsgKCRmb3JtYXQpICsgJygnICsgKCRkYXRhKSArICcpICc7XG4gICAgfVxuICAgIG91dCArPSAnIDogJyArICgkZm9ybWF0KSArICcudGVzdCgnICsgKCRkYXRhKSArICcpKSkpKSB7JztcbiAgfSBlbHNlIHtcbiAgICB2YXIgJGZvcm1hdCA9IGl0LmZvcm1hdHNbJHNjaGVtYV07XG4gICAgaWYgKCEkZm9ybWF0KSB7XG4gICAgICBpZiAoJHVua25vd25Gb3JtYXRzID09ICdpZ25vcmUnKSB7XG4gICAgICAgIGl0LmxvZ2dlci53YXJuKCd1bmtub3duIGZvcm1hdCBcIicgKyAkc2NoZW1hICsgJ1wiIGlnbm9yZWQgaW4gc2NoZW1hIGF0IHBhdGggXCInICsgaXQuZXJyU2NoZW1hUGF0aCArICdcIicpO1xuICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgIG91dCArPSAnIGlmICh0cnVlKSB7ICc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgIH0gZWxzZSBpZiAoJGFsbG93VW5rbm93biAmJiAkdW5rbm93bkZvcm1hdHMuaW5kZXhPZigkc2NoZW1hKSA+PSAwKSB7XG4gICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmtub3duIGZvcm1hdCBcIicgKyAkc2NoZW1hICsgJ1wiIGlzIHVzZWQgaW4gc2NoZW1hIGF0IHBhdGggXCInICsgaXQuZXJyU2NoZW1hUGF0aCArICdcIicpO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgJGlzT2JqZWN0ID0gdHlwZW9mICRmb3JtYXQgPT0gJ29iamVjdCcgJiYgISgkZm9ybWF0IGluc3RhbmNlb2YgUmVnRXhwKSAmJiAkZm9ybWF0LnZhbGlkYXRlO1xuICAgIHZhciAkZm9ybWF0VHlwZSA9ICRpc09iamVjdCAmJiAkZm9ybWF0LnR5cGUgfHwgJ3N0cmluZyc7XG4gICAgaWYgKCRpc09iamVjdCkge1xuICAgICAgdmFyICRhc3luYyA9ICRmb3JtYXQuYXN5bmMgPT09IHRydWU7XG4gICAgICAkZm9ybWF0ID0gJGZvcm1hdC52YWxpZGF0ZTtcbiAgICB9XG4gICAgaWYgKCRmb3JtYXRUeXBlICE9ICRydWxlVHlwZSkge1xuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGlmICgkYXN5bmMpIHtcbiAgICAgIGlmICghaXQuYXN5bmMpIHRocm93IG5ldyBFcnJvcignYXN5bmMgZm9ybWF0IGluIHN5bmMgc2NoZW1hJyk7XG4gICAgICB2YXIgJGZvcm1hdFJlZiA9ICdmb3JtYXRzJyArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJHNjaGVtYSkgKyAnLnZhbGlkYXRlJztcbiAgICAgIG91dCArPSAnIGlmICghKGF3YWl0ICcgKyAoJGZvcm1hdFJlZikgKyAnKCcgKyAoJGRhdGEpICsgJykpKSB7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIGlmICghICc7XG4gICAgICB2YXIgJGZvcm1hdFJlZiA9ICdmb3JtYXRzJyArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJHNjaGVtYSk7XG4gICAgICBpZiAoJGlzT2JqZWN0KSAkZm9ybWF0UmVmICs9ICcudmFsaWRhdGUnO1xuICAgICAgaWYgKHR5cGVvZiAkZm9ybWF0ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb3V0ICs9ICcgJyArICgkZm9ybWF0UmVmKSArICcoJyArICgkZGF0YSkgKyAnKSAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcgJyArICgkZm9ybWF0UmVmKSArICcudGVzdCgnICsgKCRkYXRhKSArICcpICc7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJykgeyAnO1xuICAgIH1cbiAgfVxuICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICQkb3V0U3RhY2sucHVzaChvdXQpO1xuICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ2Zvcm1hdCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgZm9ybWF0OiAgJztcbiAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWFWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRzY2hlbWEpKTtcbiAgICB9XG4gICAgb3V0ICs9ICcgIH0gJztcbiAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIG1hdGNoIGZvcm1hdCBcIic7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ1xcJyArICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKyBcXCcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRzY2hlbWEpKTtcbiAgICAgIH1cbiAgICAgIG91dCArPSAnXCJcXCcgJztcbiAgICB9XG4gICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6ICAnO1xuICAgICAgaWYgKCRpc0RhdGEpIHtcbiAgICAgICAgb3V0ICs9ICd2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRzY2hlbWEpKTtcbiAgICAgIH1cbiAgICAgIG91dCArPSAnICAgICAgICAgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgfVxuICAgIG91dCArPSAnIH0gJztcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJyB7fSAnO1xuICB9XG4gIHZhciBfX2VyciA9IG91dDtcbiAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcbiAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gIH1cbiAgb3V0ICs9ICcgfSAnO1xuICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgIG91dCArPSAnIGVsc2UgeyAnO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX25vdChpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xuICB2YXIgb3V0ID0gJyAnO1xuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJGVycnMgPSAnZXJyc19fJyArICRsdmw7XG4gIHZhciAkaXQgPSBpdC51dGlsLmNvcHkoaXQpO1xuICAkaXQubGV2ZWwrKztcbiAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xuICBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoZW1hLCBpdC5SVUxFUy5hbGwpKSB7XG4gICAgJGl0LnNjaGVtYSA9ICRzY2hlbWE7XG4gICAgJGl0LnNjaGVtYVBhdGggPSAkc2NoZW1hUGF0aDtcbiAgICAkaXQuZXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoO1xuICAgIG91dCArPSAnIHZhciAnICsgKCRlcnJzKSArICcgPSBlcnJvcnM7ICAnO1xuICAgIHZhciAkd2FzQ29tcG9zaXRlID0gaXQuY29tcG9zaXRlUnVsZTtcbiAgICBpdC5jb21wb3NpdGVSdWxlID0gJGl0LmNvbXBvc2l0ZVJ1bGUgPSB0cnVlO1xuICAgICRpdC5jcmVhdGVFcnJvcnMgPSBmYWxzZTtcbiAgICB2YXIgJGFsbEVycm9yc09wdGlvbjtcbiAgICBpZiAoJGl0Lm9wdHMuYWxsRXJyb3JzKSB7XG4gICAgICAkYWxsRXJyb3JzT3B0aW9uID0gJGl0Lm9wdHMuYWxsRXJyb3JzO1xuICAgICAgJGl0Lm9wdHMuYWxsRXJyb3JzID0gZmFsc2U7XG4gICAgfVxuICAgIG91dCArPSAnICcgKyAoaXQudmFsaWRhdGUoJGl0KSkgKyAnICc7XG4gICAgJGl0LmNyZWF0ZUVycm9ycyA9IHRydWU7XG4gICAgaWYgKCRhbGxFcnJvcnNPcHRpb24pICRpdC5vcHRzLmFsbEVycm9ycyA9ICRhbGxFcnJvcnNPcHRpb247XG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcbiAgICBvdXQgKz0gJyBpZiAoJyArICgkbmV4dFZhbGlkKSArICcpIHsgICAnO1xuICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdub3QnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7fSAnO1xuICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIE5PVCBiZSB2YWxpZFxcJyAnO1xuICAgICAgfVxuICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgfSAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyB7fSAnO1xuICAgIH1cbiAgICB2YXIgX19lcnIgPSBvdXQ7XG4gICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcbiAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gICAgfVxuICAgIG91dCArPSAnIH0gZWxzZSB7ICBlcnJvcnMgPSAnICsgKCRlcnJzKSArICc7IGlmICh2RXJyb3JzICE9PSBudWxsKSB7IGlmICgnICsgKCRlcnJzKSArICcpIHZFcnJvcnMubGVuZ3RoID0gJyArICgkZXJycykgKyAnOyBlbHNlIHZFcnJvcnMgPSBudWxsOyB9ICc7XG4gICAgaWYgKGl0Lm9wdHMuYWxsRXJyb3JzKSB7XG4gICAgICBvdXQgKz0gJyB9ICc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dCArPSAnICB2YXIgZXJyID0gICAnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ25vdCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHt9ICc7XG4gICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgTk9UIGJlIHZhbGlkXFwnICc7XG4gICAgICB9XG4gICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB9ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgfVxuICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgIG91dCArPSAnIGlmIChmYWxzZSkgeyAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9jb25zdChpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xuICB2YXIgb3V0ID0gJyAnO1xuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJHZhbGlkID0gJ3ZhbGlkJyArICRsdmw7XG4gIHZhciAkaXNEYXRhID0gaXQub3B0cy4kZGF0YSAmJiAkc2NoZW1hICYmICRzY2hlbWEuJGRhdGEsXG4gICAgJHNjaGVtYVZhbHVlO1xuICBpZiAoJGlzRGF0YSkge1xuICAgIG91dCArPSAnIHZhciBzY2hlbWEnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC5nZXREYXRhKCRzY2hlbWEuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFycikpICsgJzsgJztcbiAgICAkc2NoZW1hVmFsdWUgPSAnc2NoZW1hJyArICRsdmw7XG4gIH0gZWxzZSB7XG4gICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYTtcbiAgfVxuICBpZiAoISRpc0RhdGEpIHtcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICc7JztcbiAgfVxuICBvdXQgKz0gJ3ZhciAnICsgKCR2YWxpZCkgKyAnID0gZXF1YWwoJyArICgkZGF0YSkgKyAnLCBzY2hlbWEnICsgKCRsdmwpICsgJyk7IGlmICghJyArICgkdmFsaWQpICsgJykgeyAgICc7XG4gIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnY29uc3QnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGFsbG93ZWRWYWx1ZTogc2NoZW1hJyArICgkbHZsKSArICcgfSAnO1xuICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgYmUgZXF1YWwgdG8gY29uc3RhbnRcXCcgJztcbiAgICB9XG4gICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfSAnO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHt9ICc7XG4gIH1cbiAgdmFyIF9fZXJyID0gb3V0O1xuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChpdC5hc3luYykge1xuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgfVxuICBvdXQgKz0gJyB9JztcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9vbmVPZihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xuICB2YXIgb3V0ID0gJyAnO1xuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJHZhbGlkID0gJ3ZhbGlkJyArICRsdmw7XG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcbiAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xuICAkaXQubGV2ZWwrKztcbiAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xuICB2YXIgJGN1cnJlbnRCYXNlSWQgPSAkaXQuYmFzZUlkLFxuICAgICRwcmV2VmFsaWQgPSAncHJldlZhbGlkJyArICRsdmwsXG4gICAgJHBhc3NpbmdTY2hlbWFzID0gJ3Bhc3NpbmdTY2hlbWFzJyArICRsdmw7XG4gIG91dCArPSAndmFyICcgKyAoJGVycnMpICsgJyA9IGVycm9ycyAsICcgKyAoJHByZXZWYWxpZCkgKyAnID0gZmFsc2UgLCAnICsgKCR2YWxpZCkgKyAnID0gZmFsc2UgLCAnICsgKCRwYXNzaW5nU2NoZW1hcykgKyAnID0gbnVsbDsgJztcbiAgdmFyICR3YXNDb21wb3NpdGUgPSBpdC5jb21wb3NpdGVSdWxlO1xuICBpdC5jb21wb3NpdGVSdWxlID0gJGl0LmNvbXBvc2l0ZVJ1bGUgPSB0cnVlO1xuICB2YXIgYXJyMSA9ICRzY2hlbWE7XG4gIGlmIChhcnIxKSB7XG4gICAgdmFyICRzY2gsICRpID0gLTEsXG4gICAgICBsMSA9IGFycjEubGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAoJGkgPCBsMSkge1xuICAgICAgJHNjaCA9IGFycjFbJGkgKz0gMV07XG4gICAgICBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoLCBpdC5SVUxFUy5hbGwpKSB7XG4gICAgICAgICRpdC5zY2hlbWEgPSAkc2NoO1xuICAgICAgICAkaXQuc2NoZW1hUGF0aCA9ICRzY2hlbWFQYXRoICsgJ1snICsgJGkgKyAnXSc7XG4gICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGggKyAnLycgKyAkaTtcbiAgICAgICAgb3V0ICs9ICcgICcgKyAoaXQudmFsaWRhdGUoJGl0KSkgKyAnICc7XG4gICAgICAgICRpdC5iYXNlSWQgPSAkY3VycmVudEJhc2VJZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnIHZhciAnICsgKCRuZXh0VmFsaWQpICsgJyA9IHRydWU7ICc7XG4gICAgICB9XG4gICAgICBpZiAoJGkpIHtcbiAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJG5leHRWYWxpZCkgKyAnICYmICcgKyAoJHByZXZWYWxpZCkgKyAnKSB7ICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgJyArICgkcGFzc2luZ1NjaGVtYXMpICsgJyA9IFsnICsgKCRwYXNzaW5nU2NoZW1hcykgKyAnLCAnICsgKCRpKSArICddOyB9IGVsc2UgeyAnO1xuICAgICAgICAkY2xvc2luZ0JyYWNlcyArPSAnfSc7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyBpZiAoJyArICgkbmV4dFZhbGlkKSArICcpIHsgJyArICgkdmFsaWQpICsgJyA9ICcgKyAoJHByZXZWYWxpZCkgKyAnID0gdHJ1ZTsgJyArICgkcGFzc2luZ1NjaGVtYXMpICsgJyA9ICcgKyAoJGkpICsgJzsgfSc7XG4gICAgfVxuICB9XG4gIGl0LmNvbXBvc2l0ZVJ1bGUgPSAkaXQuY29tcG9zaXRlUnVsZSA9ICR3YXNDb21wb3NpdGU7XG4gIG91dCArPSAnJyArICgkY2xvc2luZ0JyYWNlcykgKyAnaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgdmFyIGVyciA9ICAgJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ29uZU9mJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBwYXNzaW5nU2NoZW1hczogJyArICgkcGFzc2luZ1NjaGVtYXMpICsgJyB9ICc7XG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBtYXRjaCBleGFjdGx5IG9uZSBzY2hlbWEgaW4gb25lT2ZcXCcgJztcbiAgICB9XG4gICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfSAnO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHt9ICc7XG4gIH1cbiAgb3V0ICs9ICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodkVycm9ycyk7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7IHJldHVybiBmYWxzZTsgJztcbiAgICB9XG4gIH1cbiAgb3V0ICs9ICd9IGVsc2UgeyAgZXJyb3JzID0gJyArICgkZXJycykgKyAnOyBpZiAodkVycm9ycyAhPT0gbnVsbCkgeyBpZiAoJyArICgkZXJycykgKyAnKSB2RXJyb3JzLmxlbmd0aCA9ICcgKyAoJGVycnMpICsgJzsgZWxzZSB2RXJyb3JzID0gbnVsbDsgfSc7XG4gIGlmIChpdC5vcHRzLmFsbEVycm9ycykge1xuICAgIG91dCArPSAnIH0gJztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9jb21tZW50KGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcbiAgdmFyICRjb21tZW50ID0gaXQudXRpbC50b1F1b3RlZFN0cmluZygkc2NoZW1hKTtcbiAgaWYgKGl0Lm9wdHMuJGNvbW1lbnQgPT09IHRydWUpIHtcbiAgICBvdXQgKz0gJyBjb25zb2xlLmxvZygnICsgKCRjb21tZW50KSArICcpOyc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGl0Lm9wdHMuJGNvbW1lbnQgPT0gJ2Z1bmN0aW9uJykge1xuICAgIG91dCArPSAnIHNlbGYuX29wdHMuJGNvbW1lbnQoJyArICgkY29tbWVudCkgKyAnLCAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcsIHZhbGlkYXRlLnJvb3Quc2NoZW1hKTsnO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX2NvbnRhaW5zKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcbiAgdmFyICRlcnJzID0gJ2VycnNfXycgKyAkbHZsO1xuICB2YXIgJGl0ID0gaXQudXRpbC5jb3B5KGl0KTtcbiAgdmFyICRjbG9zaW5nQnJhY2VzID0gJyc7XG4gICRpdC5sZXZlbCsrO1xuICB2YXIgJG5leHRWYWxpZCA9ICd2YWxpZCcgKyAkaXQubGV2ZWw7XG4gIHZhciAkaWR4ID0gJ2knICsgJGx2bCxcbiAgICAkZGF0YU54dCA9ICRpdC5kYXRhTGV2ZWwgPSBpdC5kYXRhTGV2ZWwgKyAxLFxuICAgICRuZXh0RGF0YSA9ICdkYXRhJyArICRkYXRhTnh0LFxuICAgICRjdXJyZW50QmFzZUlkID0gaXQuYmFzZUlkLFxuICAgICRub25FbXB0eVNjaGVtYSA9IGl0LnV0aWwuc2NoZW1hSGFzUnVsZXMoJHNjaGVtYSwgaXQuUlVMRVMuYWxsKTtcbiAgb3V0ICs9ICd2YXIgJyArICgkZXJycykgKyAnID0gZXJyb3JzO3ZhciAnICsgKCR2YWxpZCkgKyAnOyc7XG4gIGlmICgkbm9uRW1wdHlTY2hlbWEpIHtcbiAgICB2YXIgJHdhc0NvbXBvc2l0ZSA9IGl0LmNvbXBvc2l0ZVJ1bGU7XG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gdHJ1ZTtcbiAgICAkaXQuc2NoZW1hID0gJHNjaGVtYTtcbiAgICAkaXQuc2NoZW1hUGF0aCA9ICRzY2hlbWFQYXRoO1xuICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGg7XG4gICAgb3V0ICs9ICcgdmFyICcgKyAoJG5leHRWYWxpZCkgKyAnID0gZmFsc2U7IGZvciAodmFyICcgKyAoJGlkeCkgKyAnID0gMDsgJyArICgkaWR4KSArICcgPCAnICsgKCRkYXRhKSArICcubGVuZ3RoOyAnICsgKCRpZHgpICsgJysrKSB7ICc7XG4gICAgJGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aEV4cHIoaXQuZXJyb3JQYXRoLCAkaWR4LCBpdC5vcHRzLmpzb25Qb2ludGVycywgdHJ1ZSk7XG4gICAgdmFyICRwYXNzRGF0YSA9ICRkYXRhICsgJ1snICsgJGlkeCArICddJztcbiAgICAkaXQuZGF0YVBhdGhBcnJbJGRhdGFOeHRdID0gJGlkeDtcbiAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpO1xuICAgICRpdC5iYXNlSWQgPSAkY3VycmVudEJhc2VJZDtcbiAgICBpZiAoaXQudXRpbC52YXJPY2N1cmVuY2VzKCRjb2RlLCAkbmV4dERhdGEpIDwgMikge1xuICAgICAgb3V0ICs9ICcgJyArIChpdC51dGlsLnZhclJlcGxhY2UoJGNvZGUsICRuZXh0RGF0YSwgJHBhc3NEYXRhKSkgKyAnICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhciAnICsgKCRuZXh0RGF0YSkgKyAnID0gJyArICgkcGFzc0RhdGEpICsgJzsgJyArICgkY29kZSkgKyAnICc7XG4gICAgfVxuICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgYnJlYWs7IH0gICc7XG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcbiAgICBvdXQgKz0gJyAnICsgKCRjbG9zaW5nQnJhY2VzKSArICcgaWYgKCEnICsgKCRuZXh0VmFsaWQpICsgJykgeyc7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcgaWYgKCcgKyAoJGRhdGEpICsgJy5sZW5ndGggPT0gMCkgeyc7XG4gIH1cbiAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xuICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdjb250YWlucycpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHt9ICc7XG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBjb250YWluIGEgdmFsaWQgaXRlbVxcJyAnO1xuICAgIH1cbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyB9ICc7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcge30gJztcbiAgfVxuICB2YXIgX19lcnIgPSBvdXQ7XG4gIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XG4gIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xuICB9XG4gIG91dCArPSAnIH0gZWxzZSB7ICc7XG4gIGlmICgkbm9uRW1wdHlTY2hlbWEpIHtcbiAgICBvdXQgKz0gJyAgZXJyb3JzID0gJyArICgkZXJycykgKyAnOyBpZiAodkVycm9ycyAhPT0gbnVsbCkgeyBpZiAoJyArICgkZXJycykgKyAnKSB2RXJyb3JzLmxlbmd0aCA9ICcgKyAoJGVycnMpICsgJzsgZWxzZSB2RXJyb3JzID0gbnVsbDsgfSAnO1xuICB9XG4gIGlmIChpdC5vcHRzLmFsbEVycm9ycykge1xuICAgIG91dCArPSAnIH0gJztcbiAgfVxuICBvdXQgPSBpdC51dGlsLmNsZWFuVXBDb2RlKG91dCk7XG4gIHJldHVybiBvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vYWxsIHJlcXVpcmVzIG11c3QgYmUgZXhwbGljaXQgYmVjYXVzZSBicm93c2VyaWZ5IHdvbid0IHdvcmsgd2l0aCBkeW5hbWljIHJlcXVpcmVzXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgJyRyZWYnOiByZXF1aXJlKCcuL3JlZicpLFxuICBhbGxPZjogcmVxdWlyZSgnLi9hbGxPZicpLFxuICBhbnlPZjogcmVxdWlyZSgnLi9hbnlPZicpLFxuICAnJGNvbW1lbnQnOiByZXF1aXJlKCcuL2NvbW1lbnQnKSxcbiAgY29uc3Q6IHJlcXVpcmUoJy4vY29uc3QnKSxcbiAgY29udGFpbnM6IHJlcXVpcmUoJy4vY29udGFpbnMnKSxcbiAgZGVwZW5kZW5jaWVzOiByZXF1aXJlKCcuL2RlcGVuZGVuY2llcycpLFxuICAnZW51bSc6IHJlcXVpcmUoJy4vZW51bScpLFxuICBmb3JtYXQ6IHJlcXVpcmUoJy4vZm9ybWF0JyksXG4gICdpZic6IHJlcXVpcmUoJy4vaWYnKSxcbiAgaXRlbXM6IHJlcXVpcmUoJy4vaXRlbXMnKSxcbiAgbWF4aW11bTogcmVxdWlyZSgnLi9fbGltaXQnKSxcbiAgbWluaW11bTogcmVxdWlyZSgnLi9fbGltaXQnKSxcbiAgbWF4SXRlbXM6IHJlcXVpcmUoJy4vX2xpbWl0SXRlbXMnKSxcbiAgbWluSXRlbXM6IHJlcXVpcmUoJy4vX2xpbWl0SXRlbXMnKSxcbiAgbWF4TGVuZ3RoOiByZXF1aXJlKCcuL19saW1pdExlbmd0aCcpLFxuICBtaW5MZW5ndGg6IHJlcXVpcmUoJy4vX2xpbWl0TGVuZ3RoJyksXG4gIG1heFByb3BlcnRpZXM6IHJlcXVpcmUoJy4vX2xpbWl0UHJvcGVydGllcycpLFxuICBtaW5Qcm9wZXJ0aWVzOiByZXF1aXJlKCcuL19saW1pdFByb3BlcnRpZXMnKSxcbiAgbXVsdGlwbGVPZjogcmVxdWlyZSgnLi9tdWx0aXBsZU9mJyksXG4gIG5vdDogcmVxdWlyZSgnLi9ub3QnKSxcbiAgb25lT2Y6IHJlcXVpcmUoJy4vb25lT2YnKSxcbiAgcGF0dGVybjogcmVxdWlyZSgnLi9wYXR0ZXJuJyksXG4gIHByb3BlcnRpZXM6IHJlcXVpcmUoJy4vcHJvcGVydGllcycpLFxuICBwcm9wZXJ0eU5hbWVzOiByZXF1aXJlKCcuL3Byb3BlcnR5TmFtZXMnKSxcbiAgcmVxdWlyZWQ6IHJlcXVpcmUoJy4vcmVxdWlyZWQnKSxcbiAgdW5pcXVlSXRlbXM6IHJlcXVpcmUoJy4vdW5pcXVlSXRlbXMnKSxcbiAgdmFsaWRhdGU6IHJlcXVpcmUoJy4vdmFsaWRhdGUnKVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfYW55T2YoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcbiAgdmFyIG91dCA9ICcgJztcbiAgdmFyICRsdmwgPSBpdC5sZXZlbDtcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XG4gIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRrZXl3b3JkKTtcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcbiAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcbiAgdmFyICR2YWxpZCA9ICd2YWxpZCcgKyAkbHZsO1xuICB2YXIgJGVycnMgPSAnZXJyc19fJyArICRsdmw7XG4gIHZhciAkaXQgPSBpdC51dGlsLmNvcHkoaXQpO1xuICB2YXIgJGNsb3NpbmdCcmFjZXMgPSAnJztcbiAgJGl0LmxldmVsKys7XG4gIHZhciAkbmV4dFZhbGlkID0gJ3ZhbGlkJyArICRpdC5sZXZlbDtcbiAgdmFyICRub0VtcHR5U2NoZW1hID0gJHNjaGVtYS5ldmVyeShmdW5jdGlvbigkc2NoKSB7XG4gICAgcmV0dXJuIGl0LnV0aWwuc2NoZW1hSGFzUnVsZXMoJHNjaCwgaXQuUlVMRVMuYWxsKTtcbiAgfSk7XG4gIGlmICgkbm9FbXB0eVNjaGVtYSkge1xuICAgIHZhciAkY3VycmVudEJhc2VJZCA9ICRpdC5iYXNlSWQ7XG4gICAgb3V0ICs9ICcgdmFyICcgKyAoJGVycnMpICsgJyA9IGVycm9yczsgdmFyICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgICc7XG4gICAgdmFyICR3YXNDb21wb3NpdGUgPSBpdC5jb21wb3NpdGVSdWxlO1xuICAgIGl0LmNvbXBvc2l0ZVJ1bGUgPSAkaXQuY29tcG9zaXRlUnVsZSA9IHRydWU7XG4gICAgdmFyIGFycjEgPSAkc2NoZW1hO1xuICAgIGlmIChhcnIxKSB7XG4gICAgICB2YXIgJHNjaCwgJGkgPSAtMSxcbiAgICAgICAgbDEgPSBhcnIxLmxlbmd0aCAtIDE7XG4gICAgICB3aGlsZSAoJGkgPCBsMSkge1xuICAgICAgICAkc2NoID0gYXJyMVskaSArPSAxXTtcbiAgICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XG4gICAgICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGggKyAnWycgKyAkaSArICddJztcbiAgICAgICAgJGl0LmVyclNjaGVtYVBhdGggPSAkZXJyU2NoZW1hUGF0aCArICcvJyArICRpO1xuICAgICAgICBvdXQgKz0gJyAgJyArIChpdC52YWxpZGF0ZSgkaXQpKSArICcgJztcbiAgICAgICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xuICAgICAgICBvdXQgKz0gJyAnICsgKCR2YWxpZCkgKyAnID0gJyArICgkdmFsaWQpICsgJyB8fCAnICsgKCRuZXh0VmFsaWQpICsgJzsgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICc7XG4gICAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICAgIH1cbiAgICB9XG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcbiAgICBvdXQgKz0gJyAnICsgKCRjbG9zaW5nQnJhY2VzKSArICcgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgdmFyIGVyciA9ICAgJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdhbnlPZicpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHt9ICc7XG4gICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgbWF0Y2ggc29tZSBzY2hlbWEgaW4gYW55T2ZcXCcgJztcbiAgICAgIH1cbiAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnIH0gJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcge30gJztcbiAgICB9XG4gICAgb3V0ICs9ICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih2RXJyb3JzKTsgJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7IHJldHVybiBmYWxzZTsgJztcbiAgICAgIH1cbiAgICB9XG4gICAgb3V0ICs9ICcgfSBlbHNlIHsgIGVycm9ycyA9ICcgKyAoJGVycnMpICsgJzsgaWYgKHZFcnJvcnMgIT09IG51bGwpIHsgaWYgKCcgKyAoJGVycnMpICsgJykgdkVycm9ycy5sZW5ndGggPSAnICsgKCRlcnJzKSArICc7IGVsc2UgdkVycm9ycyA9IG51bGw7IH0gJztcbiAgICBpZiAoaXQub3B0cy5hbGxFcnJvcnMpIHtcbiAgICAgIG91dCArPSAnIH0gJztcbiAgICB9XG4gICAgb3V0ID0gaXQudXRpbC5jbGVhblVwQ29kZShvdXQpO1xuICB9IGVsc2Uge1xuICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICBvdXQgKz0gJyBpZiAodHJ1ZSkgeyAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgS0VZV09SRFMgPSBbXG4gICdtdWx0aXBsZU9mJyxcbiAgJ21heGltdW0nLFxuICAnZXhjbHVzaXZlTWF4aW11bScsXG4gICdtaW5pbXVtJyxcbiAgJ2V4Y2x1c2l2ZU1pbmltdW0nLFxuICAnbWF4TGVuZ3RoJyxcbiAgJ21pbkxlbmd0aCcsXG4gICdwYXR0ZXJuJyxcbiAgJ2FkZGl0aW9uYWxJdGVtcycsXG4gICdtYXhJdGVtcycsXG4gICdtaW5JdGVtcycsXG4gICd1bmlxdWVJdGVtcycsXG4gICdtYXhQcm9wZXJ0aWVzJyxcbiAgJ21pblByb3BlcnRpZXMnLFxuICAncmVxdWlyZWQnLFxuICAnYWRkaXRpb25hbFByb3BlcnRpZXMnLFxuICAnZW51bScsXG4gICdmb3JtYXQnLFxuICAnY29uc3QnXG5dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXRhU2NoZW1hLCBrZXl3b3Jkc0pzb25Qb2ludGVycykge1xuICBmb3IgKHZhciBpPTA7IGk8a2V5d29yZHNKc29uUG9pbnRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICBtZXRhU2NoZW1hID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShtZXRhU2NoZW1hKSk7XG4gICAgdmFyIHNlZ21lbnRzID0ga2V5d29yZHNKc29uUG9pbnRlcnNbaV0uc3BsaXQoJy8nKTtcbiAgICB2YXIga2V5d29yZHMgPSBtZXRhU2NoZW1hO1xuICAgIHZhciBqO1xuICAgIGZvciAoaj0xOyBqPHNlZ21lbnRzLmxlbmd0aDsgaisrKVxuICAgICAga2V5d29yZHMgPSBrZXl3b3Jkc1tzZWdtZW50c1tqXV07XG5cbiAgICBmb3IgKGo9MDsgajxLRVlXT1JEUy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIGtleSA9IEtFWVdPUkRTW2pdO1xuICAgICAgdmFyIHNjaGVtYSA9IGtleXdvcmRzW2tleV07XG4gICAgICBpZiAoc2NoZW1hKSB7XG4gICAgICAgIGtleXdvcmRzW2tleV0gPSB7XG4gICAgICAgICAgYW55T2Y6IFtcbiAgICAgICAgICAgIHNjaGVtYSxcbiAgICAgICAgICAgIHsgJHJlZjogJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9lcG9iZXJlemtpbi9hanYvbWFzdGVyL2xpYi9yZWZzL2RhdGEuanNvbiMnIH1cbiAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1ldGFTY2hlbWE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9wcm9wZXJ0eU5hbWVzKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcbiAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xuICAkaXQubGV2ZWwrKztcbiAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xuICBvdXQgKz0gJ3ZhciAnICsgKCRlcnJzKSArICcgPSBlcnJvcnM7JztcbiAgaWYgKGl0LnV0aWwuc2NoZW1hSGFzUnVsZXMoJHNjaGVtYSwgaXQuUlVMRVMuYWxsKSkge1xuICAgICRpdC5zY2hlbWEgPSAkc2NoZW1hO1xuICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGg7XG4gICAgJGl0LmVyclNjaGVtYVBhdGggPSAkZXJyU2NoZW1hUGF0aDtcbiAgICB2YXIgJGtleSA9ICdrZXknICsgJGx2bCxcbiAgICAgICRpZHggPSAnaWR4JyArICRsdmwsXG4gICAgICAkaSA9ICdpJyArICRsdmwsXG4gICAgICAkaW52YWxpZE5hbWUgPSAnXFwnICsgJyArICRrZXkgKyAnICsgXFwnJyxcbiAgICAgICRkYXRhTnh0ID0gJGl0LmRhdGFMZXZlbCA9IGl0LmRhdGFMZXZlbCArIDEsXG4gICAgICAkbmV4dERhdGEgPSAnZGF0YScgKyAkZGF0YU54dCxcbiAgICAgICRkYXRhUHJvcGVydGllcyA9ICdkYXRhUHJvcGVydGllcycgKyAkbHZsLFxuICAgICAgJG93blByb3BlcnRpZXMgPSBpdC5vcHRzLm93blByb3BlcnRpZXMsXG4gICAgICAkY3VycmVudEJhc2VJZCA9IGl0LmJhc2VJZDtcbiAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcbiAgICAgIG91dCArPSAnIHZhciAnICsgKCRkYXRhUHJvcGVydGllcykgKyAnID0gdW5kZWZpbmVkOyAnO1xuICAgIH1cbiAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcbiAgICAgIG91dCArPSAnICcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICcgPSAnICsgKCRkYXRhUHJvcGVydGllcykgKyAnIHx8IE9iamVjdC5rZXlzKCcgKyAoJGRhdGEpICsgJyk7IGZvciAodmFyICcgKyAoJGlkeCkgKyAnPTA7ICcgKyAoJGlkeCkgKyAnPCcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICcubGVuZ3RoOyAnICsgKCRpZHgpICsgJysrKSB7IHZhciAnICsgKCRrZXkpICsgJyA9ICcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICdbJyArICgkaWR4KSArICddOyAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyBmb3IgKHZhciAnICsgKCRrZXkpICsgJyBpbiAnICsgKCRkYXRhKSArICcpIHsgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgdmFyIHN0YXJ0RXJycycgKyAoJGx2bCkgKyAnID0gZXJyb3JzOyAnO1xuICAgIHZhciAkcGFzc0RhdGEgPSAka2V5O1xuICAgIHZhciAkd2FzQ29tcG9zaXRlID0gaXQuY29tcG9zaXRlUnVsZTtcbiAgICBpdC5jb21wb3NpdGVSdWxlID0gJGl0LmNvbXBvc2l0ZVJ1bGUgPSB0cnVlO1xuICAgIHZhciAkY29kZSA9IGl0LnZhbGlkYXRlKCRpdCk7XG4gICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xuICAgIGlmIChpdC51dGlsLnZhck9jY3VyZW5jZXMoJGNvZGUsICRuZXh0RGF0YSkgPCAyKSB7XG4gICAgICBvdXQgKz0gJyAnICsgKGl0LnV0aWwudmFyUmVwbGFjZSgkY29kZSwgJG5leHREYXRhLCAkcGFzc0RhdGEpKSArICcgJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcgdmFyICcgKyAoJG5leHREYXRhKSArICcgPSAnICsgKCRwYXNzRGF0YSkgKyAnOyAnICsgKCRjb2RlKSArICcgJztcbiAgICB9XG4gICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcbiAgICBvdXQgKz0gJyBpZiAoIScgKyAoJG5leHRWYWxpZCkgKyAnKSB7IGZvciAodmFyICcgKyAoJGkpICsgJz1zdGFydEVycnMnICsgKCRsdmwpICsgJzsgJyArICgkaSkgKyAnPGVycm9yczsgJyArICgkaSkgKyAnKyspIHsgdkVycm9yc1snICsgKCRpKSArICddLnByb3BlcnR5TmFtZSA9ICcgKyAoJGtleSkgKyAnOyB9ICAgdmFyIGVyciA9ICAgJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdwcm9wZXJ0eU5hbWVzJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBwcm9wZXJ0eU5hbWU6IFxcJycgKyAoJGludmFsaWROYW1lKSArICdcXCcgfSAnO1xuICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwncHJvcGVydHkgbmFtZSBcXFxcXFwnJyArICgkaW52YWxpZE5hbWUpICsgJ1xcXFxcXCcgaXMgaW52YWxpZFxcJyAnO1xuICAgICAgfVxuICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgfSAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyB7fSAnO1xuICAgIH1cbiAgICBvdXQgKz0gJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xuICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChpdC5hc3luYykge1xuICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHZFcnJvcnMpOyAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gdkVycm9yczsgcmV0dXJuIGZhbHNlOyAnO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgb3V0ICs9ICcgYnJlYWs7ICc7XG4gICAgfVxuICAgIG91dCArPSAnIH0gfSc7XG4gIH1cbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyAnICsgKCRjbG9zaW5nQnJhY2VzKSArICcgaWYgKCcgKyAoJGVycnMpICsgJyA9PSBlcnJvcnMpIHsnO1xuICB9XG4gIG91dCA9IGl0LnV0aWwuY2xlYW5VcENvZGUob3V0KTtcbiAgcmV0dXJuIG91dDtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfcmVmKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJHZhbGlkID0gJ3ZhbGlkJyArICRsdmw7XG4gIHZhciAkYXN5bmMsICRyZWZDb2RlO1xuICBpZiAoJHNjaGVtYSA9PSAnIycgfHwgJHNjaGVtYSA9PSAnIy8nKSB7XG4gICAgaWYgKGl0LmlzUm9vdCkge1xuICAgICAgJGFzeW5jID0gaXQuYXN5bmM7XG4gICAgICAkcmVmQ29kZSA9ICd2YWxpZGF0ZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICRhc3luYyA9IGl0LnJvb3Quc2NoZW1hLiRhc3luYyA9PT0gdHJ1ZTtcbiAgICAgICRyZWZDb2RlID0gJ3Jvb3QucmVmVmFsWzBdJztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyICRyZWZWYWwgPSBpdC5yZXNvbHZlUmVmKGl0LmJhc2VJZCwgJHNjaGVtYSwgaXQuaXNSb290KTtcbiAgICBpZiAoJHJlZlZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgJG1lc3NhZ2UgPSBpdC5NaXNzaW5nUmVmRXJyb3IubWVzc2FnZShpdC5iYXNlSWQsICRzY2hlbWEpO1xuICAgICAgaWYgKGl0Lm9wdHMubWlzc2luZ1JlZnMgPT0gJ2ZhaWwnKSB7XG4gICAgICAgIGl0LmxvZ2dlci5lcnJvcigkbWVzc2FnZSk7XG4gICAgICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgICAgICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gICAgICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgICAgICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnJHJlZicpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgcmVmOiBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRzY2hlbWEpKSArICdcXCcgfSAnO1xuICAgICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdjYW5cXFxcXFwndCByZXNvbHZlIHJlZmVyZW5jZSAnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRzY2hlbWEpKSArICdcXCcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkc2NoZW1hKSkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9ICcge30gJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgX19lcnIgPSBvdXQ7XG4gICAgICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XG4gICAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgb3V0ICs9ICcgaWYgKGZhbHNlKSB7ICc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXQub3B0cy5taXNzaW5nUmVmcyA9PSAnaWdub3JlJykge1xuICAgICAgICBpdC5sb2dnZXIud2FybigkbWVzc2FnZSk7XG4gICAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IGl0Lk1pc3NpbmdSZWZFcnJvcihpdC5iYXNlSWQsICRzY2hlbWEsICRtZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCRyZWZWYWwuaW5saW5lKSB7XG4gICAgICB2YXIgJGl0ID0gaXQudXRpbC5jb3B5KGl0KTtcbiAgICAgICRpdC5sZXZlbCsrO1xuICAgICAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xuICAgICAgJGl0LnNjaGVtYSA9ICRyZWZWYWwuc2NoZW1hO1xuICAgICAgJGl0LnNjaGVtYVBhdGggPSAnJztcbiAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJHNjaGVtYTtcbiAgICAgIHZhciAkY29kZSA9IGl0LnZhbGlkYXRlKCRpdCkucmVwbGFjZSgvdmFsaWRhdGVcXC5zY2hlbWEvZywgJHJlZlZhbC5jb2RlKTtcbiAgICAgIG91dCArPSAnICcgKyAoJGNvZGUpICsgJyAnO1xuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICRhc3luYyA9ICRyZWZWYWwuJGFzeW5jID09PSB0cnVlIHx8IChpdC5hc3luYyAmJiAkcmVmVmFsLiRhc3luYyAhPT0gZmFsc2UpO1xuICAgICAgJHJlZkNvZGUgPSAkcmVmVmFsLmNvZGU7XG4gICAgfVxuICB9XG4gIGlmICgkcmVmQ29kZSkge1xuICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgICBvdXQgPSAnJztcbiAgICBpZiAoaXQub3B0cy5wYXNzQ29udGV4dCkge1xuICAgICAgb3V0ICs9ICcgJyArICgkcmVmQ29kZSkgKyAnLmNhbGwodGhpcywgJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcgJyArICgkcmVmQ29kZSkgKyAnKCAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyAnICsgKCRkYXRhKSArICcsIChkYXRhUGF0aCB8fCBcXCdcXCcpJztcbiAgICBpZiAoaXQuZXJyb3JQYXRoICE9ICdcIlwiJykge1xuICAgICAgb3V0ICs9ICcgKyAnICsgKGl0LmVycm9yUGF0aCk7XG4gICAgfVxuICAgIHZhciAkcGFyZW50RGF0YSA9ICRkYXRhTHZsID8gJ2RhdGEnICsgKCgkZGF0YUx2bCAtIDEpIHx8ICcnKSA6ICdwYXJlbnREYXRhJyxcbiAgICAgICRwYXJlbnREYXRhUHJvcGVydHkgPSAkZGF0YUx2bCA/IGl0LmRhdGFQYXRoQXJyWyRkYXRhTHZsXSA6ICdwYXJlbnREYXRhUHJvcGVydHknO1xuICAgIG91dCArPSAnICwgJyArICgkcGFyZW50RGF0YSkgKyAnICwgJyArICgkcGFyZW50RGF0YVByb3BlcnR5KSArICcsIHJvb3REYXRhKSAgJztcbiAgICB2YXIgX19jYWxsVmFsaWRhdGUgPSBvdXQ7XG4gICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcbiAgICBpZiAoJGFzeW5jKSB7XG4gICAgICBpZiAoIWl0LmFzeW5jKSB0aHJvdyBuZXcgRXJyb3IoJ2FzeW5jIHNjaGVtYSByZWZlcmVuY2VkIGJ5IHN5bmMgc2NoZW1hJyk7XG4gICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdmFsaWQpICsgJzsgJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnIHRyeSB7IGF3YWl0ICcgKyAoX19jYWxsVmFsaWRhdGUpICsgJzsgJztcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgIG91dCArPSAnICcgKyAoJHZhbGlkKSArICcgPSB0cnVlOyAnO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgfSBjYXRjaCAoZSkgeyBpZiAoIShlIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSkgdGhyb3cgZTsgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBlLmVycm9yczsgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQoZS5lcnJvcnMpOyBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDsgJztcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgIG91dCArPSAnICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnIH0gJztcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgIG91dCArPSAnIGlmICgnICsgKCR2YWxpZCkgKyAnKSB7ICc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIGlmICghJyArIChfX2NhbGxWYWxpZGF0ZSkgKyAnKSB7IGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gJyArICgkcmVmQ29kZSkgKyAnLmVycm9yczsgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQoJyArICgkcmVmQ29kZSkgKyAnLmVycm9ycyk7IGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoOyB9ICc7XG4gICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfcGF0dGVybihpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xuICB2YXIgb3V0ID0gJyAnO1xuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxuICAgICRzY2hlbWFWYWx1ZTtcbiAgaWYgKCRpc0RhdGEpIHtcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XG4gICAgJHNjaGVtYVZhbHVlID0gJ3NjaGVtYScgKyAkbHZsO1xuICB9IGVsc2Uge1xuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XG4gIH1cbiAgdmFyICRyZWdleHAgPSAkaXNEYXRhID8gJyhuZXcgUmVnRXhwKCcgKyAkc2NoZW1hVmFsdWUgKyAnKSknIDogaXQudXNlUGF0dGVybigkc2NoZW1hKTtcbiAgb3V0ICs9ICdpZiAoICc7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgKCcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPSBcXCdzdHJpbmdcXCcpIHx8ICc7XG4gIH1cbiAgb3V0ICs9ICcgIScgKyAoJHJlZ2V4cCkgKyAnLnRlc3QoJyArICgkZGF0YSkgKyAnKSApIHsgICAnO1xuICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICQkb3V0U3RhY2sucHVzaChvdXQpO1xuICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ3BhdHRlcm4nKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IHBhdHRlcm46ICAnO1xuICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICBvdXQgKz0gJycgKyAoJHNjaGVtYVZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJHNjaGVtYSkpO1xuICAgIH1cbiAgICBvdXQgKz0gJyAgfSAnO1xuICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgbWF0Y2ggcGF0dGVybiBcIic7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ1xcJyArICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKyBcXCcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRzY2hlbWEpKTtcbiAgICAgIH1cbiAgICAgIG91dCArPSAnXCJcXCcgJztcbiAgICB9XG4gICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6ICAnO1xuICAgICAgaWYgKCRpc0RhdGEpIHtcbiAgICAgICAgb3V0ICs9ICd2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRzY2hlbWEpKTtcbiAgICAgIH1cbiAgICAgIG91dCArPSAnICAgICAgICAgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgfVxuICAgIG91dCArPSAnIH0gJztcbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJyB7fSAnO1xuICB9XG4gIHZhciBfX2VyciA9IG91dDtcbiAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcbiAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gIH1cbiAgb3V0ICs9ICd9ICc7XG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgb3V0ICs9ICcgZWxzZSB7ICc7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfY3VzdG9tKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZXJyb3JLZXl3b3JkO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJHZhbGlkID0gJ3ZhbGlkJyArICRsdmw7XG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcbiAgdmFyICRpc0RhdGEgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWEgJiYgJHNjaGVtYS4kZGF0YSxcbiAgICAkc2NoZW1hVmFsdWU7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYScgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLmdldERhdGEoJHNjaGVtYS4kZGF0YSwgJGRhdGFMdmwsIGl0LmRhdGFQYXRoQXJyKSkgKyAnOyAnO1xuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcbiAgfSBlbHNlIHtcbiAgICAkc2NoZW1hVmFsdWUgPSAkc2NoZW1hO1xuICB9XG4gIHZhciAkcnVsZSA9IHRoaXMsXG4gICAgJGRlZmluaXRpb24gPSAnZGVmaW5pdGlvbicgKyAkbHZsLFxuICAgICRyRGVmID0gJHJ1bGUuZGVmaW5pdGlvbixcbiAgICAkY2xvc2luZ0JyYWNlcyA9ICcnO1xuICB2YXIgJGNvbXBpbGUsICRpbmxpbmUsICRtYWNybywgJHJ1bGVWYWxpZGF0ZSwgJHZhbGlkYXRlQ29kZTtcbiAgaWYgKCRpc0RhdGEgJiYgJHJEZWYuJGRhdGEpIHtcbiAgICAkdmFsaWRhdGVDb2RlID0gJ2tleXdvcmRWYWxpZGF0ZScgKyAkbHZsO1xuICAgIHZhciAkdmFsaWRhdGVTY2hlbWEgPSAkckRlZi52YWxpZGF0ZVNjaGVtYTtcbiAgICBvdXQgKz0gJyB2YXIgJyArICgkZGVmaW5pdGlvbikgKyAnID0gUlVMRVMuY3VzdG9tW1xcJycgKyAoJGtleXdvcmQpICsgJ1xcJ10uZGVmaW5pdGlvbjsgdmFyICcgKyAoJHZhbGlkYXRlQ29kZSkgKyAnID0gJyArICgkZGVmaW5pdGlvbikgKyAnLnZhbGlkYXRlOyc7XG4gIH0gZWxzZSB7XG4gICAgJHJ1bGVWYWxpZGF0ZSA9IGl0LnVzZUN1c3RvbVJ1bGUoJHJ1bGUsICRzY2hlbWEsIGl0LnNjaGVtYSwgaXQpO1xuICAgIGlmICghJHJ1bGVWYWxpZGF0ZSkgcmV0dXJuO1xuICAgICRzY2hlbWFWYWx1ZSA9ICd2YWxpZGF0ZS5zY2hlbWEnICsgJHNjaGVtYVBhdGg7XG4gICAgJHZhbGlkYXRlQ29kZSA9ICRydWxlVmFsaWRhdGUuY29kZTtcbiAgICAkY29tcGlsZSA9ICRyRGVmLmNvbXBpbGU7XG4gICAgJGlubGluZSA9ICRyRGVmLmlubGluZTtcbiAgICAkbWFjcm8gPSAkckRlZi5tYWNybztcbiAgfVxuICB2YXIgJHJ1bGVFcnJzID0gJHZhbGlkYXRlQ29kZSArICcuZXJyb3JzJyxcbiAgICAkaSA9ICdpJyArICRsdmwsXG4gICAgJHJ1bGVFcnIgPSAncnVsZUVycicgKyAkbHZsLFxuICAgICRhc3luY0tleXdvcmQgPSAkckRlZi5hc3luYztcbiAgaWYgKCRhc3luY0tleXdvcmQgJiYgIWl0LmFzeW5jKSB0aHJvdyBuZXcgRXJyb3IoJ2FzeW5jIGtleXdvcmQgaW4gc3luYyBzY2hlbWEnKTtcbiAgaWYgKCEoJGlubGluZSB8fCAkbWFjcm8pKSB7XG4gICAgb3V0ICs9ICcnICsgKCRydWxlRXJycykgKyAnID0gbnVsbDsnO1xuICB9XG4gIG91dCArPSAndmFyICcgKyAoJGVycnMpICsgJyA9IGVycm9yczt2YXIgJyArICgkdmFsaWQpICsgJzsnO1xuICBpZiAoJGlzRGF0YSAmJiAkckRlZi4kZGF0YSkge1xuICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICBvdXQgKz0gJyBpZiAoJyArICgkc2NoZW1hVmFsdWUpICsgJyA9PT0gdW5kZWZpbmVkKSB7ICcgKyAoJHZhbGlkKSArICcgPSB0cnVlOyB9IGVsc2UgeyAnO1xuICAgIGlmICgkdmFsaWRhdGVTY2hlbWEpIHtcbiAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICAgIG91dCArPSAnICcgKyAoJHZhbGlkKSArICcgPSAnICsgKCRkZWZpbml0aW9uKSArICcudmFsaWRhdGVTY2hlbWEoJyArICgkc2NoZW1hVmFsdWUpICsgJyk7IGlmICgnICsgKCR2YWxpZCkgKyAnKSB7ICc7XG4gICAgfVxuICB9XG4gIGlmICgkaW5saW5lKSB7XG4gICAgaWYgKCRyRGVmLnN0YXRlbWVudHMpIHtcbiAgICAgIG91dCArPSAnICcgKyAoJHJ1bGVWYWxpZGF0ZS52YWxpZGF0ZSkgKyAnICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnICcgKyAoJHZhbGlkKSArICcgPSAnICsgKCRydWxlVmFsaWRhdGUudmFsaWRhdGUpICsgJzsgJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoJG1hY3JvKSB7XG4gICAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XG4gICAgdmFyICRjbG9zaW5nQnJhY2VzID0gJyc7XG4gICAgJGl0LmxldmVsKys7XG4gICAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xuICAgICRpdC5zY2hlbWEgPSAkcnVsZVZhbGlkYXRlLnZhbGlkYXRlO1xuICAgICRpdC5zY2hlbWFQYXRoID0gJyc7XG4gICAgdmFyICR3YXNDb21wb3NpdGUgPSBpdC5jb21wb3NpdGVSdWxlO1xuICAgIGl0LmNvbXBvc2l0ZVJ1bGUgPSAkaXQuY29tcG9zaXRlUnVsZSA9IHRydWU7XG4gICAgdmFyICRjb2RlID0gaXQudmFsaWRhdGUoJGl0KS5yZXBsYWNlKC92YWxpZGF0ZVxcLnNjaGVtYS9nLCAkdmFsaWRhdGVDb2RlKTtcbiAgICBpdC5jb21wb3NpdGVSdWxlID0gJGl0LmNvbXBvc2l0ZVJ1bGUgPSAkd2FzQ29tcG9zaXRlO1xuICAgIG91dCArPSAnICcgKyAoJGNvZGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgICBvdXQgPSAnJztcbiAgICBvdXQgKz0gJyAgJyArICgkdmFsaWRhdGVDb2RlKSArICcuY2FsbCggJztcbiAgICBpZiAoaXQub3B0cy5wYXNzQ29udGV4dCkge1xuICAgICAgb3V0ICs9ICd0aGlzJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICdzZWxmJztcbiAgICB9XG4gICAgaWYgKCRjb21waWxlIHx8ICRyRGVmLnNjaGVtYSA9PT0gZmFsc2UpIHtcbiAgICAgIG91dCArPSAnICwgJyArICgkZGF0YSkgKyAnICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnICwgJyArICgkc2NoZW1hVmFsdWUpICsgJyAsICcgKyAoJGRhdGEpICsgJyAsIHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICc7XG4gICAgfVxuICAgIG91dCArPSAnICwgKGRhdGFQYXRoIHx8IFxcJ1xcJyknO1xuICAgIGlmIChpdC5lcnJvclBhdGggIT0gJ1wiXCInKSB7XG4gICAgICBvdXQgKz0gJyArICcgKyAoaXQuZXJyb3JQYXRoKTtcbiAgICB9XG4gICAgdmFyICRwYXJlbnREYXRhID0gJGRhdGFMdmwgPyAnZGF0YScgKyAoKCRkYXRhTHZsIC0gMSkgfHwgJycpIDogJ3BhcmVudERhdGEnLFxuICAgICAgJHBhcmVudERhdGFQcm9wZXJ0eSA9ICRkYXRhTHZsID8gaXQuZGF0YVBhdGhBcnJbJGRhdGFMdmxdIDogJ3BhcmVudERhdGFQcm9wZXJ0eSc7XG4gICAgb3V0ICs9ICcgLCAnICsgKCRwYXJlbnREYXRhKSArICcgLCAnICsgKCRwYXJlbnREYXRhUHJvcGVydHkpICsgJyAsIHJvb3REYXRhICkgICc7XG4gICAgdmFyIGRlZl9jYWxsUnVsZVZhbGlkYXRlID0gb3V0O1xuICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XG4gICAgaWYgKCRyRGVmLmVycm9ycyA9PT0gZmFsc2UpIHtcbiAgICAgIG91dCArPSAnICcgKyAoJHZhbGlkKSArICcgPSAnO1xuICAgICAgaWYgKCRhc3luY0tleXdvcmQpIHtcbiAgICAgICAgb3V0ICs9ICdhd2FpdCAnO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcnICsgKGRlZl9jYWxsUnVsZVZhbGlkYXRlKSArICc7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgkYXN5bmNLZXl3b3JkKSB7XG4gICAgICAgICRydWxlRXJycyA9ICdjdXN0b21FcnJvcnMnICsgJGx2bDtcbiAgICAgICAgb3V0ICs9ICcgdmFyICcgKyAoJHJ1bGVFcnJzKSArICcgPSBudWxsOyB0cnkgeyAnICsgKCR2YWxpZCkgKyAnID0gYXdhaXQgJyArIChkZWZfY2FsbFJ1bGVWYWxpZGF0ZSkgKyAnOyB9IGNhdGNoIChlKSB7ICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpICcgKyAoJHJ1bGVFcnJzKSArICcgPSBlLmVycm9yczsgZWxzZSB0aHJvdyBlOyB9ICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyAnICsgKCRydWxlRXJycykgKyAnID0gbnVsbDsgJyArICgkdmFsaWQpICsgJyA9ICcgKyAoZGVmX2NhbGxSdWxlVmFsaWRhdGUpICsgJzsgJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCRyRGVmLm1vZGlmeWluZykge1xuICAgIG91dCArPSAnIGlmICgnICsgKCRwYXJlbnREYXRhKSArICcpICcgKyAoJGRhdGEpICsgJyA9ICcgKyAoJHBhcmVudERhdGEpICsgJ1snICsgKCRwYXJlbnREYXRhUHJvcGVydHkpICsgJ107JztcbiAgfVxuICBvdXQgKz0gJycgKyAoJGNsb3NpbmdCcmFjZXMpO1xuICBpZiAoJHJEZWYudmFsaWQpIHtcbiAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgb3V0ICs9ICcgaWYgKHRydWUpIHsgJztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcgaWYgKCAnO1xuICAgIGlmICgkckRlZi52YWxpZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvdXQgKz0gJyAhJztcbiAgICAgIGlmICgkbWFjcm8pIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKCRuZXh0VmFsaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKCR2YWxpZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnICcgKyAoISRyRGVmLnZhbGlkKSArICcgJztcbiAgICB9XG4gICAgb3V0ICs9ICcpIHsgJztcbiAgICAkZXJyb3JLZXl3b3JkID0gJHJ1bGUua2V5d29yZDtcbiAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gICAgb3V0ID0gJyc7XG4gICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xuICAgICQkb3V0U3RhY2sucHVzaChvdXQpO1xuICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJGVycm9yS2V5d29yZCB8fCAnY3VzdG9tJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBrZXl3b3JkOiBcXCcnICsgKCRydWxlLmtleXdvcmQpICsgJ1xcJyB9ICc7XG4gICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCdzaG91bGQgcGFzcyBcIicgKyAoJHJ1bGUua2V5d29yZCkgKyAnXCIga2V5d29yZCB2YWxpZGF0aW9uXFwnICc7XG4gICAgICB9XG4gICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB9ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgfVxuICAgIHZhciBfX2VyciA9IG91dDtcbiAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChpdC5hc3luYykge1xuICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgICB9XG4gICAgdmFyIGRlZl9jdXN0b21FcnJvciA9IG91dDtcbiAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICAgIGlmICgkaW5saW5lKSB7XG4gICAgICBpZiAoJHJEZWYuZXJyb3JzKSB7XG4gICAgICAgIGlmICgkckRlZi5lcnJvcnMgIT0gJ2Z1bGwnKSB7XG4gICAgICAgICAgb3V0ICs9ICcgIGZvciAodmFyICcgKyAoJGkpICsgJz0nICsgKCRlcnJzKSArICc7ICcgKyAoJGkpICsgJzxlcnJvcnM7ICcgKyAoJGkpICsgJysrKSB7IHZhciAnICsgKCRydWxlRXJyKSArICcgPSB2RXJyb3JzWycgKyAoJGkpICsgJ107IGlmICgnICsgKCRydWxlRXJyKSArICcuZGF0YVBhdGggPT09IHVuZGVmaW5lZCkgJyArICgkcnVsZUVycikgKyAnLmRhdGFQYXRoID0gKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnOyBpZiAoJyArICgkcnVsZUVycikgKyAnLnNjaGVtYVBhdGggPT09IHVuZGVmaW5lZCkgeyAnICsgKCRydWxlRXJyKSArICcuc2NoZW1hUGF0aCA9IFwiJyArICgkZXJyU2NoZW1hUGF0aCkgKyAnXCI7IH0gJztcbiAgICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAnICsgKCRydWxlRXJyKSArICcuc2NoZW1hID0gJyArICgkc2NoZW1hVmFsdWUpICsgJzsgJyArICgkcnVsZUVycikgKyAnLmRhdGEgPSAnICsgKCRkYXRhKSArICc7ICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dCArPSAnIH0gJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCRyRGVmLmVycm9ycyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBvdXQgKz0gJyAnICsgKGRlZl9jdXN0b21FcnJvcikgKyAnICc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJGVycnMpICsgJyA9PSBlcnJvcnMpIHsgJyArIChkZWZfY3VzdG9tRXJyb3IpICsgJyB9IGVsc2UgeyAgZm9yICh2YXIgJyArICgkaSkgKyAnPScgKyAoJGVycnMpICsgJzsgJyArICgkaSkgKyAnPGVycm9yczsgJyArICgkaSkgKyAnKyspIHsgdmFyICcgKyAoJHJ1bGVFcnIpICsgJyA9IHZFcnJvcnNbJyArICgkaSkgKyAnXTsgaWYgKCcgKyAoJHJ1bGVFcnIpICsgJy5kYXRhUGF0aCA9PT0gdW5kZWZpbmVkKSAnICsgKCRydWxlRXJyKSArICcuZGF0YVBhdGggPSAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICc7IGlmICgnICsgKCRydWxlRXJyKSArICcuc2NoZW1hUGF0aCA9PT0gdW5kZWZpbmVkKSB7ICcgKyAoJHJ1bGVFcnIpICsgJy5zY2hlbWFQYXRoID0gXCInICsgKCRlcnJTY2hlbWFQYXRoKSArICdcIjsgfSAnO1xuICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcbiAgICAgICAgICAgIG91dCArPSAnICcgKyAoJHJ1bGVFcnIpICsgJy5zY2hlbWEgPSAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnOyAnICsgKCRydWxlRXJyKSArICcuZGF0YSA9ICcgKyAoJGRhdGEpICsgJzsgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgb3V0ICs9ICcgfSB9ICc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCRtYWNybykge1xuICAgICAgb3V0ICs9ICcgICB2YXIgZXJyID0gICAnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCRlcnJvcktleXdvcmQgfHwgJ2N1c3RvbScpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsga2V5d29yZDogXFwnJyArICgkcnVsZS5rZXl3b3JkKSArICdcXCcgfSAnO1xuICAgICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBwYXNzIFwiJyArICgkcnVsZS5rZXl3b3JkKSArICdcIiBrZXl3b3JkIHZhbGlkYXRpb25cXCcgJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB7fSAnO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHZFcnJvcnMpOyAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7IHJldHVybiBmYWxzZTsgJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoJHJEZWYuZXJyb3JzID09PSBmYWxzZSkge1xuICAgICAgICBvdXQgKz0gJyAnICsgKGRlZl9jdXN0b21FcnJvcikgKyAnICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyBpZiAoQXJyYXkuaXNBcnJheSgnICsgKCRydWxlRXJycykgKyAnKSkgeyBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9ICcgKyAoJHJ1bGVFcnJzKSArICc7IGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KCcgKyAoJHJ1bGVFcnJzKSArICcpOyBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDsgIGZvciAodmFyICcgKyAoJGkpICsgJz0nICsgKCRlcnJzKSArICc7ICcgKyAoJGkpICsgJzxlcnJvcnM7ICcgKyAoJGkpICsgJysrKSB7IHZhciAnICsgKCRydWxlRXJyKSArICcgPSB2RXJyb3JzWycgKyAoJGkpICsgJ107IGlmICgnICsgKCRydWxlRXJyKSArICcuZGF0YVBhdGggPT09IHVuZGVmaW5lZCkgJyArICgkcnVsZUVycikgKyAnLmRhdGFQYXRoID0gKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnOyAgJyArICgkcnVsZUVycikgKyAnLnNjaGVtYVBhdGggPSBcIicgKyAoJGVyclNjaGVtYVBhdGgpICsgJ1wiOyAgJztcbiAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgIG91dCArPSAnICcgKyAoJHJ1bGVFcnIpICsgJy5zY2hlbWEgPSAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnOyAnICsgKCRydWxlRXJyKSArICcuZGF0YSA9ICcgKyAoJGRhdGEpICsgJzsgJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyB9IH0gZWxzZSB7ICcgKyAoZGVmX2N1c3RvbUVycm9yKSArICcgfSAnO1xuICAgICAgfVxuICAgIH1cbiAgICBvdXQgKz0gJyB9ICc7XG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgIG91dCArPSAnIGVsc2UgeyAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9fbGltaXRQcm9wZXJ0aWVzKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZXJyb3JLZXl3b3JkO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxuICAgICRzY2hlbWFWYWx1ZTtcbiAgaWYgKCRpc0RhdGEpIHtcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XG4gICAgJHNjaGVtYVZhbHVlID0gJ3NjaGVtYScgKyAkbHZsO1xuICB9IGVsc2Uge1xuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XG4gIH1cbiAgdmFyICRvcCA9ICRrZXl3b3JkID09ICdtYXhQcm9wZXJ0aWVzJyA/ICc+JyA6ICc8JztcbiAgb3V0ICs9ICdpZiAoICc7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgKCcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPSBcXCdudW1iZXJcXCcpIHx8ICc7XG4gIH1cbiAgb3V0ICs9ICcgT2JqZWN0LmtleXMoJyArICgkZGF0YSkgKyAnKS5sZW5ndGggJyArICgkb3ApICsgJyAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnKSB7ICc7XG4gIHZhciAkZXJyb3JLZXl3b3JkID0gJGtleXdvcmQ7XG4gIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgkZXJyb3JLZXl3b3JkIHx8ICdfbGltaXRQcm9wZXJ0aWVzJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBsaW1pdDogJyArICgkc2NoZW1hVmFsdWUpICsgJyB9ICc7XG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBOT1QgaGF2ZSAnO1xuICAgICAgaWYgKCRrZXl3b3JkID09ICdtYXhQcm9wZXJ0aWVzJykge1xuICAgICAgICBvdXQgKz0gJ21vcmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICdmZXdlcic7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB0aGFuICc7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ1xcJyArICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKyBcXCcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWEpO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgcHJvcGVydGllc1xcJyAnO1xuICAgIH1cbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICBvdXQgKz0gJyAsIHNjaGVtYTogICc7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWEpO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgICAgICAgICAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfSAnO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHt9ICc7XG4gIH1cbiAgdmFyIF9fZXJyID0gb3V0O1xuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChpdC5hc3luYykge1xuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgfVxuICBvdXQgKz0gJ30gJztcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZ1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL3B1bnljb2RlLmpzIC0gcHVueWNvZGUudWNzMi5kZWNvZGVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdWNzMmxlbmd0aChzdHIpIHtcbiAgdmFyIGxlbmd0aCA9IDBcbiAgICAsIGxlbiA9IHN0ci5sZW5ndGhcbiAgICAsIHBvcyA9IDBcbiAgICAsIHZhbHVlO1xuICB3aGlsZSAocG9zIDwgbGVuKSB7XG4gICAgbGVuZ3RoKys7XG4gICAgdmFsdWUgPSBzdHIuY2hhckNvZGVBdChwb3MrKyk7XG4gICAgaWYgKHZhbHVlID49IDB4RDgwMCAmJiB2YWx1ZSA8PSAweERCRkYgJiYgcG9zIDwgbGVuKSB7XG4gICAgICAvLyBoaWdoIHN1cnJvZ2F0ZSwgYW5kIHRoZXJlIGlzIGEgbmV4dCBjaGFyYWN0ZXJcbiAgICAgIHZhbHVlID0gc3RyLmNoYXJDb2RlQXQocG9zKTtcbiAgICAgIGlmICgodmFsdWUgJiAweEZDMDApID09IDB4REMwMCkgcG9zKys7IC8vIGxvdyBzdXJyb2dhdGVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxlbmd0aDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjb21waWxlU2NoZW1hID0gcmVxdWlyZSgnLi9jb21waWxlJylcbiAgLCByZXNvbHZlID0gcmVxdWlyZSgnLi9jb21waWxlL3Jlc29sdmUnKVxuICAsIENhY2hlID0gcmVxdWlyZSgnLi9jYWNoZScpXG4gICwgU2NoZW1hT2JqZWN0ID0gcmVxdWlyZSgnLi9jb21waWxlL3NjaGVtYV9vYmonKVxuICAsIHN0YWJsZVN0cmluZ2lmeSA9IHJlcXVpcmUoJ2Zhc3QtanNvbi1zdGFibGUtc3RyaW5naWZ5JylcbiAgLCBmb3JtYXRzID0gcmVxdWlyZSgnLi9jb21waWxlL2Zvcm1hdHMnKVxuICAsIHJ1bGVzID0gcmVxdWlyZSgnLi9jb21waWxlL3J1bGVzJylcbiAgLCAkZGF0YU1ldGFTY2hlbWEgPSByZXF1aXJlKCcuL2RhdGEnKVxuICAsIHV0aWwgPSByZXF1aXJlKCcuL2NvbXBpbGUvdXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFqdjtcblxuQWp2LnByb3RvdHlwZS52YWxpZGF0ZSA9IHZhbGlkYXRlO1xuQWp2LnByb3RvdHlwZS5jb21waWxlID0gY29tcGlsZTtcbkFqdi5wcm90b3R5cGUuYWRkU2NoZW1hID0gYWRkU2NoZW1hO1xuQWp2LnByb3RvdHlwZS5hZGRNZXRhU2NoZW1hID0gYWRkTWV0YVNjaGVtYTtcbkFqdi5wcm90b3R5cGUudmFsaWRhdGVTY2hlbWEgPSB2YWxpZGF0ZVNjaGVtYTtcbkFqdi5wcm90b3R5cGUuZ2V0U2NoZW1hID0gZ2V0U2NoZW1hO1xuQWp2LnByb3RvdHlwZS5yZW1vdmVTY2hlbWEgPSByZW1vdmVTY2hlbWE7XG5BanYucHJvdG90eXBlLmFkZEZvcm1hdCA9IGFkZEZvcm1hdDtcbkFqdi5wcm90b3R5cGUuZXJyb3JzVGV4dCA9IGVycm9yc1RleHQ7XG5cbkFqdi5wcm90b3R5cGUuX2FkZFNjaGVtYSA9IF9hZGRTY2hlbWE7XG5BanYucHJvdG90eXBlLl9jb21waWxlID0gX2NvbXBpbGU7XG5cbkFqdi5wcm90b3R5cGUuY29tcGlsZUFzeW5jID0gcmVxdWlyZSgnLi9jb21waWxlL2FzeW5jJyk7XG52YXIgY3VzdG9tS2V5d29yZCA9IHJlcXVpcmUoJy4va2V5d29yZCcpO1xuQWp2LnByb3RvdHlwZS5hZGRLZXl3b3JkID0gY3VzdG9tS2V5d29yZC5hZGQ7XG5BanYucHJvdG90eXBlLmdldEtleXdvcmQgPSBjdXN0b21LZXl3b3JkLmdldDtcbkFqdi5wcm90b3R5cGUucmVtb3ZlS2V5d29yZCA9IGN1c3RvbUtleXdvcmQucmVtb3ZlO1xuXG52YXIgZXJyb3JDbGFzc2VzID0gcmVxdWlyZSgnLi9jb21waWxlL2Vycm9yX2NsYXNzZXMnKTtcbkFqdi5WYWxpZGF0aW9uRXJyb3IgPSBlcnJvckNsYXNzZXMuVmFsaWRhdGlvbjtcbkFqdi5NaXNzaW5nUmVmRXJyb3IgPSBlcnJvckNsYXNzZXMuTWlzc2luZ1JlZjtcbkFqdi4kZGF0YU1ldGFTY2hlbWEgPSAkZGF0YU1ldGFTY2hlbWE7XG5cbnZhciBNRVRBX1NDSEVNQV9JRCA9ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA3L3NjaGVtYSc7XG5cbnZhciBNRVRBX0lHTk9SRV9PUFRJT05TID0gWyAncmVtb3ZlQWRkaXRpb25hbCcsICd1c2VEZWZhdWx0cycsICdjb2VyY2VUeXBlcycgXTtcbnZhciBNRVRBX1NVUFBPUlRfREFUQSA9IFsnL3Byb3BlcnRpZXMnXTtcblxuLyoqXG4gKiBDcmVhdGVzIHZhbGlkYXRvciBpbnN0YW5jZS5cbiAqIFVzYWdlOiBgQWp2KG9wdHMpYFxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgb3B0aW9uYWwgb3B0aW9uc1xuICogQHJldHVybiB7T2JqZWN0fSBhanYgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gQWp2KG9wdHMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEFqdikpIHJldHVybiBuZXcgQWp2KG9wdHMpO1xuICBvcHRzID0gdGhpcy5fb3B0cyA9IHV0aWwuY29weShvcHRzKSB8fCB7fTtcbiAgc2V0TG9nZ2VyKHRoaXMpO1xuICB0aGlzLl9zY2hlbWFzID0ge307XG4gIHRoaXMuX3JlZnMgPSB7fTtcbiAgdGhpcy5fZnJhZ21lbnRzID0ge307XG4gIHRoaXMuX2Zvcm1hdHMgPSBmb3JtYXRzKG9wdHMuZm9ybWF0KTtcblxuICB0aGlzLl9jYWNoZSA9IG9wdHMuY2FjaGUgfHwgbmV3IENhY2hlO1xuICB0aGlzLl9sb2FkaW5nU2NoZW1hcyA9IHt9O1xuICB0aGlzLl9jb21waWxhdGlvbnMgPSBbXTtcbiAgdGhpcy5SVUxFUyA9IHJ1bGVzKCk7XG4gIHRoaXMuX2dldElkID0gY2hvb3NlR2V0SWQob3B0cyk7XG5cbiAgb3B0cy5sb29wUmVxdWlyZWQgPSBvcHRzLmxvb3BSZXF1aXJlZCB8fCBJbmZpbml0eTtcbiAgaWYgKG9wdHMuZXJyb3JEYXRhUGF0aCA9PSAncHJvcGVydHknKSBvcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkgPSB0cnVlO1xuICBpZiAob3B0cy5zZXJpYWxpemUgPT09IHVuZGVmaW5lZCkgb3B0cy5zZXJpYWxpemUgPSBzdGFibGVTdHJpbmdpZnk7XG4gIHRoaXMuX21ldGFPcHRzID0gZ2V0TWV0YVNjaGVtYU9wdGlvbnModGhpcyk7XG5cbiAgaWYgKG9wdHMuZm9ybWF0cykgYWRkSW5pdGlhbEZvcm1hdHModGhpcyk7XG4gIGFkZERlZmF1bHRNZXRhU2NoZW1hKHRoaXMpO1xuICBpZiAodHlwZW9mIG9wdHMubWV0YSA9PSAnb2JqZWN0JykgdGhpcy5hZGRNZXRhU2NoZW1hKG9wdHMubWV0YSk7XG4gIGlmIChvcHRzLm51bGxhYmxlKSB0aGlzLmFkZEtleXdvcmQoJ251bGxhYmxlJywge21ldGFTY2hlbWE6IHtjb25zdDogdHJ1ZX19KTtcbiAgYWRkSW5pdGlhbFNjaGVtYXModGhpcyk7XG59XG5cblxuXG4vKipcbiAqIFZhbGlkYXRlIGRhdGEgdXNpbmcgc2NoZW1hXG4gKiBTY2hlbWEgd2lsbCBiZSBjb21waWxlZCBhbmQgY2FjaGVkICh1c2luZyBzZXJpYWxpemVkIEpTT04gYXMga2V5LiBbZmFzdC1qc29uLXN0YWJsZS1zdHJpbmdpZnldKGh0dHBzOi8vZ2l0aHViLmNvbS9lcG9iZXJlemtpbi9mYXN0LWpzb24tc3RhYmxlLXN0cmluZ2lmeSkgaXMgdXNlZCB0byBzZXJpYWxpemUuXG4gKiBAdGhpcyAgIEFqdlxuICogQHBhcmFtICB7U3RyaW5nfE9iamVjdH0gc2NoZW1hS2V5UmVmIGtleSwgcmVmIG9yIHNjaGVtYSBvYmplY3RcbiAqIEBwYXJhbSAge0FueX0gZGF0YSB0byBiZSB2YWxpZGF0ZWRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHZhbGlkYXRpb24gcmVzdWx0LiBFcnJvcnMgZnJvbSB0aGUgbGFzdCB2YWxpZGF0aW9uIHdpbGwgYmUgYXZhaWxhYmxlIGluIGBhanYuZXJyb3JzYCAoYW5kIGFsc28gaW4gY29tcGlsZWQgc2NoZW1hOiBgc2NoZW1hLmVycm9yc2ApLlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZShzY2hlbWFLZXlSZWYsIGRhdGEpIHtcbiAgdmFyIHY7XG4gIGlmICh0eXBlb2Ygc2NoZW1hS2V5UmVmID09ICdzdHJpbmcnKSB7XG4gICAgdiA9IHRoaXMuZ2V0U2NoZW1hKHNjaGVtYUtleVJlZik7XG4gICAgaWYgKCF2KSB0aHJvdyBuZXcgRXJyb3IoJ25vIHNjaGVtYSB3aXRoIGtleSBvciByZWYgXCInICsgc2NoZW1hS2V5UmVmICsgJ1wiJyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNjaGVtYU9iaiA9IHRoaXMuX2FkZFNjaGVtYShzY2hlbWFLZXlSZWYpO1xuICAgIHYgPSBzY2hlbWFPYmoudmFsaWRhdGUgfHwgdGhpcy5fY29tcGlsZShzY2hlbWFPYmopO1xuICB9XG5cbiAgdmFyIHZhbGlkID0gdihkYXRhKTtcbiAgaWYgKHYuJGFzeW5jICE9PSB0cnVlKSB0aGlzLmVycm9ycyA9IHYuZXJyb3JzO1xuICByZXR1cm4gdmFsaWQ7XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgdmFsaWRhdGluZyBmdW5jdGlvbiBmb3IgcGFzc2VkIHNjaGVtYS5cbiAqIEB0aGlzICAgQWp2XG4gKiBAcGFyYW0gIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgb2JqZWN0XG4gKiBAcGFyYW0gIHtCb29sZWFufSBfbWV0YSB0cnVlIGlmIHNjaGVtYSBpcyBhIG1ldGEtc2NoZW1hLiBVc2VkIGludGVybmFsbHkgdG8gY29tcGlsZSBtZXRhIHNjaGVtYXMgb2YgY3VzdG9tIGtleXdvcmRzLlxuICogQHJldHVybiB7RnVuY3Rpb259IHZhbGlkYXRpbmcgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gY29tcGlsZShzY2hlbWEsIF9tZXRhKSB7XG4gIHZhciBzY2hlbWFPYmogPSB0aGlzLl9hZGRTY2hlbWEoc2NoZW1hLCB1bmRlZmluZWQsIF9tZXRhKTtcbiAgcmV0dXJuIHNjaGVtYU9iai52YWxpZGF0ZSB8fCB0aGlzLl9jb21waWxlKHNjaGVtYU9iaik7XG59XG5cblxuLyoqXG4gKiBBZGRzIHNjaGVtYSB0byB0aGUgaW5zdGFuY2UuXG4gKiBAdGhpcyAgIEFqdlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IHNjaGVtYSBzY2hlbWEgb3IgYXJyYXkgb2Ygc2NoZW1hcy4gSWYgYXJyYXkgaXMgcGFzc2VkLCBga2V5YCBhbmQgb3RoZXIgcGFyYW1ldGVycyB3aWxsIGJlIGlnbm9yZWQuXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IE9wdGlvbmFsIHNjaGVtYSBrZXkuIENhbiBiZSBwYXNzZWQgdG8gYHZhbGlkYXRlYCBtZXRob2QgaW5zdGVhZCBvZiBzY2hlbWEgb2JqZWN0IG9yIGlkL3JlZi4gT25lIHNjaGVtYSBwZXIgaW5zdGFuY2UgY2FuIGhhdmUgZW1wdHkgYGlkYCBhbmQgYGtleWAuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IF9za2lwVmFsaWRhdGlvbiB0cnVlIHRvIHNraXAgc2NoZW1hIHZhbGlkYXRpb24uIFVzZWQgaW50ZXJuYWxseSwgb3B0aW9uIHZhbGlkYXRlU2NoZW1hIHNob3VsZCBiZSB1c2VkIGluc3RlYWQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IF9tZXRhIHRydWUgaWYgc2NoZW1hIGlzIGEgbWV0YS1zY2hlbWEuIFVzZWQgaW50ZXJuYWxseSwgYWRkTWV0YVNjaGVtYSBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkLlxuICogQHJldHVybiB7QWp2fSB0aGlzIGZvciBtZXRob2QgY2hhaW5pbmdcbiAqL1xuZnVuY3Rpb24gYWRkU2NoZW1hKHNjaGVtYSwga2V5LCBfc2tpcFZhbGlkYXRpb24sIF9tZXRhKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHNjaGVtYSkpe1xuICAgIGZvciAodmFyIGk9MDsgaTxzY2hlbWEubGVuZ3RoOyBpKyspIHRoaXMuYWRkU2NoZW1hKHNjaGVtYVtpXSwgdW5kZWZpbmVkLCBfc2tpcFZhbGlkYXRpb24sIF9tZXRhKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB2YXIgaWQgPSB0aGlzLl9nZXRJZChzY2hlbWEpO1xuICBpZiAoaWQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgaWQgIT0gJ3N0cmluZycpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdzY2hlbWEgaWQgbXVzdCBiZSBzdHJpbmcnKTtcbiAga2V5ID0gcmVzb2x2ZS5ub3JtYWxpemVJZChrZXkgfHwgaWQpO1xuICBjaGVja1VuaXF1ZSh0aGlzLCBrZXkpO1xuICB0aGlzLl9zY2hlbWFzW2tleV0gPSB0aGlzLl9hZGRTY2hlbWEoc2NoZW1hLCBfc2tpcFZhbGlkYXRpb24sIF9tZXRhLCB0cnVlKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cblxuLyoqXG4gKiBBZGQgc2NoZW1hIHRoYXQgd2lsbCBiZSB1c2VkIHRvIHZhbGlkYXRlIG90aGVyIHNjaGVtYXNcbiAqIG9wdGlvbnMgaW4gTUVUQV9JR05PUkVfT1BUSU9OUyBhcmUgYWx3YXkgc2V0IHRvIGZhbHNlXG4gKiBAdGhpcyAgIEFqdlxuICogQHBhcmFtIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgb2JqZWN0XG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5IG9wdGlvbmFsIHNjaGVtYSBrZXlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2tpcFZhbGlkYXRpb24gdHJ1ZSB0byBza2lwIHNjaGVtYSB2YWxpZGF0aW9uLCBjYW4gYmUgdXNlZCB0byBvdmVycmlkZSB2YWxpZGF0ZVNjaGVtYSBvcHRpb24gZm9yIG1ldGEtc2NoZW1hXG4gKiBAcmV0dXJuIHtBanZ9IHRoaXMgZm9yIG1ldGhvZCBjaGFpbmluZ1xuICovXG5mdW5jdGlvbiBhZGRNZXRhU2NoZW1hKHNjaGVtYSwga2V5LCBza2lwVmFsaWRhdGlvbikge1xuICB0aGlzLmFkZFNjaGVtYShzY2hlbWEsIGtleSwgc2tpcFZhbGlkYXRpb24sIHRydWUpO1xuICByZXR1cm4gdGhpcztcbn1cblxuXG4vKipcbiAqIFZhbGlkYXRlIHNjaGVtYVxuICogQHRoaXMgICBBanZcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY2hlbWEgc2NoZW1hIHRvIHZhbGlkYXRlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRocm93T3JMb2dFcnJvciBwYXNzIHRydWUgdG8gdGhyb3cgKG9yIGxvZykgYW4gZXJyb3IgaWYgaW52YWxpZFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBzY2hlbWEgaXMgdmFsaWRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVTY2hlbWEoc2NoZW1hLCB0aHJvd09yTG9nRXJyb3IpIHtcbiAgdmFyICRzY2hlbWEgPSBzY2hlbWEuJHNjaGVtYTtcbiAgaWYgKCRzY2hlbWEgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgJHNjaGVtYSAhPSAnc3RyaW5nJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJyRzY2hlbWEgbXVzdCBiZSBhIHN0cmluZycpO1xuICAkc2NoZW1hID0gJHNjaGVtYSB8fCB0aGlzLl9vcHRzLmRlZmF1bHRNZXRhIHx8IGRlZmF1bHRNZXRhKHRoaXMpO1xuICBpZiAoISRzY2hlbWEpIHtcbiAgICB0aGlzLmxvZ2dlci53YXJuKCdtZXRhLXNjaGVtYSBub3QgYXZhaWxhYmxlJyk7XG4gICAgdGhpcy5lcnJvcnMgPSBudWxsO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHZhciB2YWxpZCA9IHRoaXMudmFsaWRhdGUoJHNjaGVtYSwgc2NoZW1hKTtcbiAgaWYgKCF2YWxpZCAmJiB0aHJvd09yTG9nRXJyb3IpIHtcbiAgICB2YXIgbWVzc2FnZSA9ICdzY2hlbWEgaXMgaW52YWxpZDogJyArIHRoaXMuZXJyb3JzVGV4dCgpO1xuICAgIGlmICh0aGlzLl9vcHRzLnZhbGlkYXRlU2NoZW1hID09ICdsb2cnKSB0aGlzLmxvZ2dlci5lcnJvcihtZXNzYWdlKTtcbiAgICBlbHNlIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gdmFsaWQ7XG59XG5cblxuZnVuY3Rpb24gZGVmYXVsdE1ldGEoc2VsZikge1xuICB2YXIgbWV0YSA9IHNlbGYuX29wdHMubWV0YTtcbiAgc2VsZi5fb3B0cy5kZWZhdWx0TWV0YSA9IHR5cGVvZiBtZXRhID09ICdvYmplY3QnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBzZWxmLl9nZXRJZChtZXRhKSB8fCBtZXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzZWxmLmdldFNjaGVtYShNRVRBX1NDSEVNQV9JRClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gTUVUQV9TQ0hFTUFfSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICByZXR1cm4gc2VsZi5fb3B0cy5kZWZhdWx0TWV0YTtcbn1cblxuXG4vKipcbiAqIEdldCBjb21waWxlZCBzY2hlbWEgZnJvbSB0aGUgaW5zdGFuY2UgYnkgYGtleWAgb3IgYHJlZmAuXG4gKiBAdGhpcyAgIEFqdlxuICogQHBhcmFtICB7U3RyaW5nfSBrZXlSZWYgYGtleWAgdGhhdCB3YXMgcGFzc2VkIHRvIGBhZGRTY2hlbWFgIG9yIGZ1bGwgc2NoZW1hIHJlZmVyZW5jZSAoYHNjaGVtYS5pZGAgb3IgcmVzb2x2ZWQgaWQpLlxuICogQHJldHVybiB7RnVuY3Rpb259IHNjaGVtYSB2YWxpZGF0aW5nIGZ1bmN0aW9uICh3aXRoIHByb3BlcnR5IGBzY2hlbWFgKS5cbiAqL1xuZnVuY3Rpb24gZ2V0U2NoZW1hKGtleVJlZikge1xuICB2YXIgc2NoZW1hT2JqID0gX2dldFNjaGVtYU9iaih0aGlzLCBrZXlSZWYpO1xuICBzd2l0Y2ggKHR5cGVvZiBzY2hlbWFPYmopIHtcbiAgICBjYXNlICdvYmplY3QnOiByZXR1cm4gc2NoZW1hT2JqLnZhbGlkYXRlIHx8IHRoaXMuX2NvbXBpbGUoc2NoZW1hT2JqKTtcbiAgICBjYXNlICdzdHJpbmcnOiByZXR1cm4gdGhpcy5nZXRTY2hlbWEoc2NoZW1hT2JqKTtcbiAgICBjYXNlICd1bmRlZmluZWQnOiByZXR1cm4gX2dldFNjaGVtYUZyYWdtZW50KHRoaXMsIGtleVJlZik7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBfZ2V0U2NoZW1hRnJhZ21lbnQoc2VsZiwgcmVmKSB7XG4gIHZhciByZXMgPSByZXNvbHZlLnNjaGVtYS5jYWxsKHNlbGYsIHsgc2NoZW1hOiB7fSB9LCByZWYpO1xuICBpZiAocmVzKSB7XG4gICAgdmFyIHNjaGVtYSA9IHJlcy5zY2hlbWFcbiAgICAgICwgcm9vdCA9IHJlcy5yb290XG4gICAgICAsIGJhc2VJZCA9IHJlcy5iYXNlSWQ7XG4gICAgdmFyIHYgPSBjb21waWxlU2NoZW1hLmNhbGwoc2VsZiwgc2NoZW1hLCByb290LCB1bmRlZmluZWQsIGJhc2VJZCk7XG4gICAgc2VsZi5fZnJhZ21lbnRzW3JlZl0gPSBuZXcgU2NoZW1hT2JqZWN0KHtcbiAgICAgIHJlZjogcmVmLFxuICAgICAgZnJhZ21lbnQ6IHRydWUsXG4gICAgICBzY2hlbWE6IHNjaGVtYSxcbiAgICAgIHJvb3Q6IHJvb3QsXG4gICAgICBiYXNlSWQ6IGJhc2VJZCxcbiAgICAgIHZhbGlkYXRlOiB2XG4gICAgfSk7XG4gICAgcmV0dXJuIHY7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBfZ2V0U2NoZW1hT2JqKHNlbGYsIGtleVJlZikge1xuICBrZXlSZWYgPSByZXNvbHZlLm5vcm1hbGl6ZUlkKGtleVJlZik7XG4gIHJldHVybiBzZWxmLl9zY2hlbWFzW2tleVJlZl0gfHwgc2VsZi5fcmVmc1trZXlSZWZdIHx8IHNlbGYuX2ZyYWdtZW50c1trZXlSZWZdO1xufVxuXG5cbi8qKlxuICogUmVtb3ZlIGNhY2hlZCBzY2hlbWEocykuXG4gKiBJZiBubyBwYXJhbWV0ZXIgaXMgcGFzc2VkIGFsbCBzY2hlbWFzIGJ1dCBtZXRhLXNjaGVtYXMgYXJlIHJlbW92ZWQuXG4gKiBJZiBSZWdFeHAgaXMgcGFzc2VkIGFsbCBzY2hlbWFzIHdpdGgga2V5L2lkIG1hdGNoaW5nIHBhdHRlcm4gYnV0IG1ldGEtc2NoZW1hcyBhcmUgcmVtb3ZlZC5cbiAqIEV2ZW4gaWYgc2NoZW1hIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgc2NoZW1hcyBpdCBzdGlsbCBjYW4gYmUgcmVtb3ZlZCBhcyBvdGhlciBzY2hlbWFzIGhhdmUgbG9jYWwgcmVmZXJlbmNlcy5cbiAqIEB0aGlzICAgQWp2XG4gKiBAcGFyYW0gIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gc2NoZW1hS2V5UmVmIGtleSwgcmVmLCBwYXR0ZXJuIHRvIG1hdGNoIGtleS9yZWYgb3Igc2NoZW1hIG9iamVjdFxuICogQHJldHVybiB7QWp2fSB0aGlzIGZvciBtZXRob2QgY2hhaW5pbmdcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlU2NoZW1hKHNjaGVtYUtleVJlZikge1xuICBpZiAoc2NoZW1hS2V5UmVmIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgX3JlbW92ZUFsbFNjaGVtYXModGhpcywgdGhpcy5fc2NoZW1hcywgc2NoZW1hS2V5UmVmKTtcbiAgICBfcmVtb3ZlQWxsU2NoZW1hcyh0aGlzLCB0aGlzLl9yZWZzLCBzY2hlbWFLZXlSZWYpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHN3aXRjaCAodHlwZW9mIHNjaGVtYUtleVJlZikge1xuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICBfcmVtb3ZlQWxsU2NoZW1hcyh0aGlzLCB0aGlzLl9zY2hlbWFzKTtcbiAgICAgIF9yZW1vdmVBbGxTY2hlbWFzKHRoaXMsIHRoaXMuX3JlZnMpO1xuICAgICAgdGhpcy5fY2FjaGUuY2xlYXIoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICB2YXIgc2NoZW1hT2JqID0gX2dldFNjaGVtYU9iaih0aGlzLCBzY2hlbWFLZXlSZWYpO1xuICAgICAgaWYgKHNjaGVtYU9iaikgdGhpcy5fY2FjaGUuZGVsKHNjaGVtYU9iai5jYWNoZUtleSk7XG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hc1tzY2hlbWFLZXlSZWZdO1xuICAgICAgZGVsZXRlIHRoaXMuX3JlZnNbc2NoZW1hS2V5UmVmXTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICB2YXIgc2VyaWFsaXplID0gdGhpcy5fb3B0cy5zZXJpYWxpemU7XG4gICAgICB2YXIgY2FjaGVLZXkgPSBzZXJpYWxpemUgPyBzZXJpYWxpemUoc2NoZW1hS2V5UmVmKSA6IHNjaGVtYUtleVJlZjtcbiAgICAgIHRoaXMuX2NhY2hlLmRlbChjYWNoZUtleSk7XG4gICAgICB2YXIgaWQgPSB0aGlzLl9nZXRJZChzY2hlbWFLZXlSZWYpO1xuICAgICAgaWYgKGlkKSB7XG4gICAgICAgIGlkID0gcmVzb2x2ZS5ub3JtYWxpemVJZChpZCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9zY2hlbWFzW2lkXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3JlZnNbaWRdO1xuICAgICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW1vdmVBbGxTY2hlbWFzKHNlbGYsIHNjaGVtYXMsIHJlZ2V4KSB7XG4gIGZvciAodmFyIGtleVJlZiBpbiBzY2hlbWFzKSB7XG4gICAgdmFyIHNjaGVtYU9iaiA9IHNjaGVtYXNba2V5UmVmXTtcbiAgICBpZiAoIXNjaGVtYU9iai5tZXRhICYmICghcmVnZXggfHwgcmVnZXgudGVzdChrZXlSZWYpKSkge1xuICAgICAgc2VsZi5fY2FjaGUuZGVsKHNjaGVtYU9iai5jYWNoZUtleSk7XG4gICAgICBkZWxldGUgc2NoZW1hc1trZXlSZWZdO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qIEB0aGlzICAgQWp2ICovXG5mdW5jdGlvbiBfYWRkU2NoZW1hKHNjaGVtYSwgc2tpcFZhbGlkYXRpb24sIG1ldGEsIHNob3VsZEFkZFNjaGVtYSkge1xuICBpZiAodHlwZW9mIHNjaGVtYSAhPSAnb2JqZWN0JyAmJiB0eXBlb2Ygc2NoZW1hICE9ICdib29sZWFuJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NjaGVtYSBzaG91bGQgYmUgb2JqZWN0IG9yIGJvb2xlYW4nKTtcbiAgdmFyIHNlcmlhbGl6ZSA9IHRoaXMuX29wdHMuc2VyaWFsaXplO1xuICB2YXIgY2FjaGVLZXkgPSBzZXJpYWxpemUgPyBzZXJpYWxpemUoc2NoZW1hKSA6IHNjaGVtYTtcbiAgdmFyIGNhY2hlZCA9IHRoaXMuX2NhY2hlLmdldChjYWNoZUtleSk7XG4gIGlmIChjYWNoZWQpIHJldHVybiBjYWNoZWQ7XG5cbiAgc2hvdWxkQWRkU2NoZW1hID0gc2hvdWxkQWRkU2NoZW1hIHx8IHRoaXMuX29wdHMuYWRkVXNlZFNjaGVtYSAhPT0gZmFsc2U7XG5cbiAgdmFyIGlkID0gcmVzb2x2ZS5ub3JtYWxpemVJZCh0aGlzLl9nZXRJZChzY2hlbWEpKTtcbiAgaWYgKGlkICYmIHNob3VsZEFkZFNjaGVtYSkgY2hlY2tVbmlxdWUodGhpcywgaWQpO1xuXG4gIHZhciB3aWxsVmFsaWRhdGUgPSB0aGlzLl9vcHRzLnZhbGlkYXRlU2NoZW1hICE9PSBmYWxzZSAmJiAhc2tpcFZhbGlkYXRpb247XG4gIHZhciByZWN1cnNpdmVNZXRhO1xuICBpZiAod2lsbFZhbGlkYXRlICYmICEocmVjdXJzaXZlTWV0YSA9IGlkICYmIGlkID09IHJlc29sdmUubm9ybWFsaXplSWQoc2NoZW1hLiRzY2hlbWEpKSlcbiAgICB0aGlzLnZhbGlkYXRlU2NoZW1hKHNjaGVtYSwgdHJ1ZSk7XG5cbiAgdmFyIGxvY2FsUmVmcyA9IHJlc29sdmUuaWRzLmNhbGwodGhpcywgc2NoZW1hKTtcblxuICB2YXIgc2NoZW1hT2JqID0gbmV3IFNjaGVtYU9iamVjdCh7XG4gICAgaWQ6IGlkLFxuICAgIHNjaGVtYTogc2NoZW1hLFxuICAgIGxvY2FsUmVmczogbG9jYWxSZWZzLFxuICAgIGNhY2hlS2V5OiBjYWNoZUtleSxcbiAgICBtZXRhOiBtZXRhXG4gIH0pO1xuXG4gIGlmIChpZFswXSAhPSAnIycgJiYgc2hvdWxkQWRkU2NoZW1hKSB0aGlzLl9yZWZzW2lkXSA9IHNjaGVtYU9iajtcbiAgdGhpcy5fY2FjaGUucHV0KGNhY2hlS2V5LCBzY2hlbWFPYmopO1xuXG4gIGlmICh3aWxsVmFsaWRhdGUgJiYgcmVjdXJzaXZlTWV0YSkgdGhpcy52YWxpZGF0ZVNjaGVtYShzY2hlbWEsIHRydWUpO1xuXG4gIHJldHVybiBzY2hlbWFPYmo7XG59XG5cblxuLyogQHRoaXMgICBBanYgKi9cbmZ1bmN0aW9uIF9jb21waWxlKHNjaGVtYU9iaiwgcm9vdCkge1xuICBpZiAoc2NoZW1hT2JqLmNvbXBpbGluZykge1xuICAgIHNjaGVtYU9iai52YWxpZGF0ZSA9IGNhbGxWYWxpZGF0ZTtcbiAgICBjYWxsVmFsaWRhdGUuc2NoZW1hID0gc2NoZW1hT2JqLnNjaGVtYTtcbiAgICBjYWxsVmFsaWRhdGUuZXJyb3JzID0gbnVsbDtcbiAgICBjYWxsVmFsaWRhdGUucm9vdCA9IHJvb3QgPyByb290IDogY2FsbFZhbGlkYXRlO1xuICAgIGlmIChzY2hlbWFPYmouc2NoZW1hLiRhc3luYyA9PT0gdHJ1ZSlcbiAgICAgIGNhbGxWYWxpZGF0ZS4kYXN5bmMgPSB0cnVlO1xuICAgIHJldHVybiBjYWxsVmFsaWRhdGU7XG4gIH1cbiAgc2NoZW1hT2JqLmNvbXBpbGluZyA9IHRydWU7XG5cbiAgdmFyIGN1cnJlbnRPcHRzO1xuICBpZiAoc2NoZW1hT2JqLm1ldGEpIHtcbiAgICBjdXJyZW50T3B0cyA9IHRoaXMuX29wdHM7XG4gICAgdGhpcy5fb3B0cyA9IHRoaXMuX21ldGFPcHRzO1xuICB9XG5cbiAgdmFyIHY7XG4gIHRyeSB7IHYgPSBjb21waWxlU2NoZW1hLmNhbGwodGhpcywgc2NoZW1hT2JqLnNjaGVtYSwgcm9vdCwgc2NoZW1hT2JqLmxvY2FsUmVmcyk7IH1cbiAgY2F0Y2goZSkge1xuICAgIGRlbGV0ZSBzY2hlbWFPYmoudmFsaWRhdGU7XG4gICAgdGhyb3cgZTtcbiAgfVxuICBmaW5hbGx5IHtcbiAgICBzY2hlbWFPYmouY29tcGlsaW5nID0gZmFsc2U7XG4gICAgaWYgKHNjaGVtYU9iai5tZXRhKSB0aGlzLl9vcHRzID0gY3VycmVudE9wdHM7XG4gIH1cblxuICBzY2hlbWFPYmoudmFsaWRhdGUgPSB2O1xuICBzY2hlbWFPYmoucmVmcyA9IHYucmVmcztcbiAgc2NoZW1hT2JqLnJlZlZhbCA9IHYucmVmVmFsO1xuICBzY2hlbWFPYmoucm9vdCA9IHYucm9vdDtcbiAgcmV0dXJuIHY7XG5cblxuICAvKiBAdGhpcyAgIHsqfSAtIGN1c3RvbSBjb250ZXh0LCBzZWUgcGFzc0NvbnRleHQgb3B0aW9uICovXG4gIGZ1bmN0aW9uIGNhbGxWYWxpZGF0ZSgpIHtcbiAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gICAgdmFyIF92YWxpZGF0ZSA9IHNjaGVtYU9iai52YWxpZGF0ZTtcbiAgICB2YXIgcmVzdWx0ID0gX3ZhbGlkYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgY2FsbFZhbGlkYXRlLmVycm9ycyA9IF92YWxpZGF0ZS5lcnJvcnM7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNob29zZUdldElkKG9wdHMpIHtcbiAgc3dpdGNoIChvcHRzLnNjaGVtYUlkKSB7XG4gICAgY2FzZSAnYXV0byc6IHJldHVybiBfZ2V0JElkT3JJZDtcbiAgICBjYXNlICdpZCc6IHJldHVybiBfZ2V0SWQ7XG4gICAgZGVmYXVsdDogcmV0dXJuIF9nZXQkSWQ7XG4gIH1cbn1cblxuLyogQHRoaXMgICBBanYgKi9cbmZ1bmN0aW9uIF9nZXRJZChzY2hlbWEpIHtcbiAgaWYgKHNjaGVtYS4kaWQpIHRoaXMubG9nZ2VyLndhcm4oJ3NjaGVtYSAkaWQgaWdub3JlZCcsIHNjaGVtYS4kaWQpO1xuICByZXR1cm4gc2NoZW1hLmlkO1xufVxuXG4vKiBAdGhpcyAgIEFqdiAqL1xuZnVuY3Rpb24gX2dldCRJZChzY2hlbWEpIHtcbiAgaWYgKHNjaGVtYS5pZCkgdGhpcy5sb2dnZXIud2Fybignc2NoZW1hIGlkIGlnbm9yZWQnLCBzY2hlbWEuaWQpO1xuICByZXR1cm4gc2NoZW1hLiRpZDtcbn1cblxuXG5mdW5jdGlvbiBfZ2V0JElkT3JJZChzY2hlbWEpIHtcbiAgaWYgKHNjaGVtYS4kaWQgJiYgc2NoZW1hLmlkICYmIHNjaGVtYS4kaWQgIT0gc2NoZW1hLmlkKVxuICAgIHRocm93IG5ldyBFcnJvcignc2NoZW1hICRpZCBpcyBkaWZmZXJlbnQgZnJvbSBpZCcpO1xuICByZXR1cm4gc2NoZW1hLiRpZCB8fCBzY2hlbWEuaWQ7XG59XG5cblxuLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIGVycm9yIG1lc3NhZ2Ugb2JqZWN0cyB0byBzdHJpbmdcbiAqIEB0aGlzICAgQWp2XG4gKiBAcGFyYW0gIHtBcnJheTxPYmplY3Q+fSBlcnJvcnMgb3B0aW9uYWwgYXJyYXkgb2YgdmFsaWRhdGlvbiBlcnJvcnMsIGlmIG5vdCBwYXNzZWQgZXJyb3JzIGZyb20gdGhlIGluc3RhbmNlIGFyZSB1c2VkLlxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIG9wdGlvbmFsIG9wdGlvbnMgd2l0aCBwcm9wZXJ0aWVzIGBzZXBhcmF0b3JgIGFuZCBgZGF0YVZhcmAuXG4gKiBAcmV0dXJuIHtTdHJpbmd9IGh1bWFuIHJlYWRhYmxlIHN0cmluZyB3aXRoIGFsbCBlcnJvcnMgZGVzY3JpcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGVycm9yc1RleHQoZXJyb3JzLCBvcHRpb25zKSB7XG4gIGVycm9ycyA9IGVycm9ycyB8fCB0aGlzLmVycm9ycztcbiAgaWYgKCFlcnJvcnMpIHJldHVybiAnTm8gZXJyb3JzJztcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBzZXBhcmF0b3IgPSBvcHRpb25zLnNlcGFyYXRvciA9PT0gdW5kZWZpbmVkID8gJywgJyA6IG9wdGlvbnMuc2VwYXJhdG9yO1xuICB2YXIgZGF0YVZhciA9IG9wdGlvbnMuZGF0YVZhciA9PT0gdW5kZWZpbmVkID8gJ2RhdGEnIDogb3B0aW9ucy5kYXRhVmFyO1xuXG4gIHZhciB0ZXh0ID0gJyc7XG4gIGZvciAodmFyIGk9MDsgaTxlcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZSA9IGVycm9yc1tpXTtcbiAgICBpZiAoZSkgdGV4dCArPSBkYXRhVmFyICsgZS5kYXRhUGF0aCArICcgJyArIGUubWVzc2FnZSArIHNlcGFyYXRvcjtcbiAgfVxuICByZXR1cm4gdGV4dC5zbGljZSgwLCAtc2VwYXJhdG9yLmxlbmd0aCk7XG59XG5cblxuLyoqXG4gKiBBZGQgY3VzdG9tIGZvcm1hdFxuICogQHRoaXMgICBBanZcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIGZvcm1hdCBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB8RnVuY3Rpb259IGZvcm1hdCBzdHJpbmcgaXMgY29udmVydGVkIHRvIFJlZ0V4cDsgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBib29sZWFuICh0cnVlIHdoZW4gdmFsaWQpXG4gKiBAcmV0dXJuIHtBanZ9IHRoaXMgZm9yIG1ldGhvZCBjaGFpbmluZ1xuICovXG5mdW5jdGlvbiBhZGRGb3JtYXQobmFtZSwgZm9ybWF0KSB7XG4gIGlmICh0eXBlb2YgZm9ybWF0ID09ICdzdHJpbmcnKSBmb3JtYXQgPSBuZXcgUmVnRXhwKGZvcm1hdCk7XG4gIHRoaXMuX2Zvcm1hdHNbbmFtZV0gPSBmb3JtYXQ7XG4gIHJldHVybiB0aGlzO1xufVxuXG5cbmZ1bmN0aW9uIGFkZERlZmF1bHRNZXRhU2NoZW1hKHNlbGYpIHtcbiAgdmFyICRkYXRhU2NoZW1hO1xuICBpZiAoc2VsZi5fb3B0cy4kZGF0YSkge1xuICAgICRkYXRhU2NoZW1hID0gcmVxdWlyZSgnLi9yZWZzL2RhdGEuanNvbicpO1xuICAgIHNlbGYuYWRkTWV0YVNjaGVtYSgkZGF0YVNjaGVtYSwgJGRhdGFTY2hlbWEuJGlkLCB0cnVlKTtcbiAgfVxuICBpZiAoc2VsZi5fb3B0cy5tZXRhID09PSBmYWxzZSkgcmV0dXJuO1xuICB2YXIgbWV0YVNjaGVtYSA9IHJlcXVpcmUoJy4vcmVmcy9qc29uLXNjaGVtYS1kcmFmdC0wNy5qc29uJyk7XG4gIGlmIChzZWxmLl9vcHRzLiRkYXRhKSBtZXRhU2NoZW1hID0gJGRhdGFNZXRhU2NoZW1hKG1ldGFTY2hlbWEsIE1FVEFfU1VQUE9SVF9EQVRBKTtcbiAgc2VsZi5hZGRNZXRhU2NoZW1hKG1ldGFTY2hlbWEsIE1FVEFfU0NIRU1BX0lELCB0cnVlKTtcbiAgc2VsZi5fcmVmc1snaHR0cDovL2pzb24tc2NoZW1hLm9yZy9zY2hlbWEnXSA9IE1FVEFfU0NIRU1BX0lEO1xufVxuXG5cbmZ1bmN0aW9uIGFkZEluaXRpYWxTY2hlbWFzKHNlbGYpIHtcbiAgdmFyIG9wdHNTY2hlbWFzID0gc2VsZi5fb3B0cy5zY2hlbWFzO1xuICBpZiAoIW9wdHNTY2hlbWFzKSByZXR1cm47XG4gIGlmIChBcnJheS5pc0FycmF5KG9wdHNTY2hlbWFzKSkgc2VsZi5hZGRTY2hlbWEob3B0c1NjaGVtYXMpO1xuICBlbHNlIGZvciAodmFyIGtleSBpbiBvcHRzU2NoZW1hcykgc2VsZi5hZGRTY2hlbWEob3B0c1NjaGVtYXNba2V5XSwga2V5KTtcbn1cblxuXG5mdW5jdGlvbiBhZGRJbml0aWFsRm9ybWF0cyhzZWxmKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gc2VsZi5fb3B0cy5mb3JtYXRzKSB7XG4gICAgdmFyIGZvcm1hdCA9IHNlbGYuX29wdHMuZm9ybWF0c1tuYW1lXTtcbiAgICBzZWxmLmFkZEZvcm1hdChuYW1lLCBmb3JtYXQpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gY2hlY2tVbmlxdWUoc2VsZiwgaWQpIHtcbiAgaWYgKHNlbGYuX3NjaGVtYXNbaWRdIHx8IHNlbGYuX3JlZnNbaWRdKVxuICAgIHRocm93IG5ldyBFcnJvcignc2NoZW1hIHdpdGgga2V5IG9yIGlkIFwiJyArIGlkICsgJ1wiIGFscmVhZHkgZXhpc3RzJyk7XG59XG5cblxuZnVuY3Rpb24gZ2V0TWV0YVNjaGVtYU9wdGlvbnMoc2VsZikge1xuICB2YXIgbWV0YU9wdHMgPSB1dGlsLmNvcHkoc2VsZi5fb3B0cyk7XG4gIGZvciAodmFyIGk9MDsgaTxNRVRBX0lHTk9SRV9PUFRJT05TLmxlbmd0aDsgaSsrKVxuICAgIGRlbGV0ZSBtZXRhT3B0c1tNRVRBX0lHTk9SRV9PUFRJT05TW2ldXTtcbiAgcmV0dXJuIG1ldGFPcHRzO1xufVxuXG5cbmZ1bmN0aW9uIHNldExvZ2dlcihzZWxmKSB7XG4gIHZhciBsb2dnZXIgPSBzZWxmLl9vcHRzLmxvZ2dlcjtcbiAgaWYgKGxvZ2dlciA9PT0gZmFsc2UpIHtcbiAgICBzZWxmLmxvZ2dlciA9IHtsb2c6IG5vb3AsIHdhcm46IG5vb3AsIGVycm9yOiBub29wfTtcbiAgfSBlbHNlIHtcbiAgICBpZiAobG9nZ2VyID09PSB1bmRlZmluZWQpIGxvZ2dlciA9IGNvbnNvbGU7XG4gICAgaWYgKCEodHlwZW9mIGxvZ2dlciA9PSAnb2JqZWN0JyAmJiBsb2dnZXIubG9nICYmIGxvZ2dlci53YXJuICYmIGxvZ2dlci5lcnJvcikpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2xvZ2dlciBtdXN0IGltcGxlbWVudCBsb2csIHdhcm4gYW5kIGVycm9yIG1ldGhvZHMnKTtcbiAgICBzZWxmLmxvZ2dlciA9IGxvZ2dlcjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9pdGVtcyhpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xuICB2YXIgb3V0ID0gJyAnO1xuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJHZhbGlkID0gJ3ZhbGlkJyArICRsdmw7XG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcbiAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xuICAkaXQubGV2ZWwrKztcbiAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xuICB2YXIgJGlkeCA9ICdpJyArICRsdmwsXG4gICAgJGRhdGFOeHQgPSAkaXQuZGF0YUxldmVsID0gaXQuZGF0YUxldmVsICsgMSxcbiAgICAkbmV4dERhdGEgPSAnZGF0YScgKyAkZGF0YU54dCxcbiAgICAkY3VycmVudEJhc2VJZCA9IGl0LmJhc2VJZDtcbiAgb3V0ICs9ICd2YXIgJyArICgkZXJycykgKyAnID0gZXJyb3JzO3ZhciAnICsgKCR2YWxpZCkgKyAnOyc7XG4gIGlmIChBcnJheS5pc0FycmF5KCRzY2hlbWEpKSB7XG4gICAgdmFyICRhZGRpdGlvbmFsSXRlbXMgPSBpdC5zY2hlbWEuYWRkaXRpb25hbEl0ZW1zO1xuICAgIGlmICgkYWRkaXRpb25hbEl0ZW1zID09PSBmYWxzZSkge1xuICAgICAgb3V0ICs9ICcgJyArICgkdmFsaWQpICsgJyA9ICcgKyAoJGRhdGEpICsgJy5sZW5ndGggPD0gJyArICgkc2NoZW1hLmxlbmd0aCkgKyAnOyAnO1xuICAgICAgdmFyICRjdXJyRXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoO1xuICAgICAgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy9hZGRpdGlvbmFsSXRlbXMnO1xuICAgICAgb3V0ICs9ICcgIGlmICghJyArICgkdmFsaWQpICsgJykgeyAgICc7XG4gICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdhZGRpdGlvbmFsSXRlbXMnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGxpbWl0OiAnICsgKCRzY2hlbWEubGVuZ3RoKSArICcgfSAnO1xuICAgICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBOT1QgaGF2ZSBtb3JlIHRoYW4gJyArICgkc2NoZW1hLmxlbmd0aCkgKyAnIGl0ZW1zXFwnICc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiBmYWxzZSAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB7fSAnO1xuICAgICAgfVxuICAgICAgdmFyIF9fZXJyID0gb3V0O1xuICAgICAgb3V0ID0gJCRvdXRTdGFjay5wb3AoKTtcbiAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICBpZiAoaXQuYXN5bmMpIHtcbiAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gJyB2YWxpZGF0ZS5lcnJvcnMgPSBbJyArIChfX2VycikgKyAnXTsgcmV0dXJuIGZhbHNlOyAnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB2YXIgZXJyID0gJyArIChfX2VycikgKyAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7ICc7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICAkZXJyU2NoZW1hUGF0aCA9ICRjdXJyRXJyU2NoZW1hUGF0aDtcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICAgICAgb3V0ICs9ICcgZWxzZSB7ICc7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBhcnIxID0gJHNjaGVtYTtcbiAgICBpZiAoYXJyMSkge1xuICAgICAgdmFyICRzY2gsICRpID0gLTEsXG4gICAgICAgIGwxID0gYXJyMS5sZW5ndGggLSAxO1xuICAgICAgd2hpbGUgKCRpIDwgbDEpIHtcbiAgICAgICAgJHNjaCA9IGFycjFbJGkgKz0gMV07XG4gICAgICAgIGlmIChpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRzY2gsIGl0LlJVTEVTLmFsbCkpIHtcbiAgICAgICAgICBvdXQgKz0gJyAnICsgKCRuZXh0VmFsaWQpICsgJyA9IHRydWU7IGlmICgnICsgKCRkYXRhKSArICcubGVuZ3RoID4gJyArICgkaSkgKyAnKSB7ICc7XG4gICAgICAgICAgdmFyICRwYXNzRGF0YSA9ICRkYXRhICsgJ1snICsgJGkgKyAnXSc7XG4gICAgICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XG4gICAgICAgICAgJGl0LnNjaGVtYVBhdGggPSAkc2NoZW1hUGF0aCArICdbJyArICRpICsgJ10nO1xuICAgICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGggKyAnLycgKyAkaTtcbiAgICAgICAgICAkaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoRXhwcihpdC5lcnJvclBhdGgsICRpLCBpdC5vcHRzLmpzb25Qb2ludGVycywgdHJ1ZSk7XG4gICAgICAgICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRpO1xuICAgICAgICAgIHZhciAkY29kZSA9IGl0LnZhbGlkYXRlKCRpdCk7XG4gICAgICAgICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xuICAgICAgICAgIGlmIChpdC51dGlsLnZhck9jY3VyZW5jZXMoJGNvZGUsICRuZXh0RGF0YSkgPCAyKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAnICsgKGl0LnV0aWwudmFyUmVwbGFjZSgkY29kZSwgJG5leHREYXRhLCAkcGFzc0RhdGEpKSArICcgJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0ICs9ICcgdmFyICcgKyAoJG5leHREYXRhKSArICcgPSAnICsgKCRwYXNzRGF0YSkgKyAnOyAnICsgKCRjb2RlKSArICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgb3V0ICs9ICcgfSAgJztcbiAgICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICc7XG4gICAgICAgICAgICAkY2xvc2luZ0JyYWNlcyArPSAnfSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0eXBlb2YgJGFkZGl0aW9uYWxJdGVtcyA9PSAnb2JqZWN0JyAmJiBpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRhZGRpdGlvbmFsSXRlbXMsIGl0LlJVTEVTLmFsbCkpIHtcbiAgICAgICRpdC5zY2hlbWEgPSAkYWRkaXRpb25hbEl0ZW1zO1xuICAgICAgJGl0LnNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgJy5hZGRpdGlvbmFsSXRlbXMnO1xuICAgICAgJGl0LmVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy9hZGRpdGlvbmFsSXRlbXMnO1xuICAgICAgb3V0ICs9ICcgJyArICgkbmV4dFZhbGlkKSArICcgPSB0cnVlOyBpZiAoJyArICgkZGF0YSkgKyAnLmxlbmd0aCA+ICcgKyAoJHNjaGVtYS5sZW5ndGgpICsgJykgeyAgZm9yICh2YXIgJyArICgkaWR4KSArICcgPSAnICsgKCRzY2hlbWEubGVuZ3RoKSArICc7ICcgKyAoJGlkeCkgKyAnIDwgJyArICgkZGF0YSkgKyAnLmxlbmd0aDsgJyArICgkaWR4KSArICcrKykgeyAnO1xuICAgICAgJGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aEV4cHIoaXQuZXJyb3JQYXRoLCAkaWR4LCBpdC5vcHRzLmpzb25Qb2ludGVycywgdHJ1ZSk7XG4gICAgICB2YXIgJHBhc3NEYXRhID0gJGRhdGEgKyAnWycgKyAkaWR4ICsgJ10nO1xuICAgICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRpZHg7XG4gICAgICB2YXIgJGNvZGUgPSBpdC52YWxpZGF0ZSgkaXQpO1xuICAgICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xuICAgICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcbiAgICAgICAgb3V0ICs9ICcgJyArIChpdC51dGlsLnZhclJlcGxhY2UoJGNvZGUsICRuZXh0RGF0YSwgJHBhc3NEYXRhKSkgKyAnICc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xuICAgICAgfVxuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgICAgb3V0ICs9ICcgaWYgKCEnICsgKCRuZXh0VmFsaWQpICsgJykgYnJlYWs7ICc7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB9IH0gICc7XG4gICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICBvdXQgKz0gJyBpZiAoJyArICgkbmV4dFZhbGlkKSArICcpIHsgJztcbiAgICAgICAgJGNsb3NpbmdCcmFjZXMgKz0gJ30nO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRzY2hlbWEsIGl0LlJVTEVTLmFsbCkpIHtcbiAgICAkaXQuc2NoZW1hID0gJHNjaGVtYTtcbiAgICAkaXQuc2NoZW1hUGF0aCA9ICRzY2hlbWFQYXRoO1xuICAgICRpdC5lcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGg7XG4gICAgb3V0ICs9ICcgIGZvciAodmFyICcgKyAoJGlkeCkgKyAnID0gJyArICgwKSArICc7ICcgKyAoJGlkeCkgKyAnIDwgJyArICgkZGF0YSkgKyAnLmxlbmd0aDsgJyArICgkaWR4KSArICcrKykgeyAnO1xuICAgICRpdC5lcnJvclBhdGggPSBpdC51dGlsLmdldFBhdGhFeHByKGl0LmVycm9yUGF0aCwgJGlkeCwgaXQub3B0cy5qc29uUG9pbnRlcnMsIHRydWUpO1xuICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRpZHggKyAnXSc7XG4gICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRpZHg7XG4gICAgdmFyICRjb2RlID0gaXQudmFsaWRhdGUoJGl0KTtcbiAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XG4gICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcbiAgICAgIG91dCArPSAnICcgKyAoaXQudXRpbC52YXJSZXBsYWNlKCRjb2RlLCAkbmV4dERhdGEsICRwYXNzRGF0YSkpICsgJyAnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xuICAgIH1cbiAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgb3V0ICs9ICcgaWYgKCEnICsgKCRuZXh0VmFsaWQpICsgJykgYnJlYWs7ICc7XG4gICAgfVxuICAgIG91dCArPSAnIH0nO1xuICB9XG4gIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgb3V0ICs9ICcgJyArICgkY2xvc2luZ0JyYWNlcykgKyAnIGlmICgnICsgKCRlcnJzKSArICcgPT0gZXJyb3JzKSB7JztcbiAgfVxuICBvdXQgPSBpdC51dGlsLmNsZWFuVXBDb2RlKG91dCk7XG4gIHJldHVybiBvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZXNvbHZlID0gcmVxdWlyZSgnLi9yZXNvbHZlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBWYWxpZGF0aW9uOiBlcnJvclN1YmNsYXNzKFZhbGlkYXRpb25FcnJvciksXG4gIE1pc3NpbmdSZWY6IGVycm9yU3ViY2xhc3MoTWlzc2luZ1JlZkVycm9yKVxufTtcblxuXG5mdW5jdGlvbiBWYWxpZGF0aW9uRXJyb3IoZXJyb3JzKSB7XG4gIHRoaXMubWVzc2FnZSA9ICd2YWxpZGF0aW9uIGZhaWxlZCc7XG4gIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuICB0aGlzLmFqdiA9IHRoaXMudmFsaWRhdGlvbiA9IHRydWU7XG59XG5cblxuTWlzc2luZ1JlZkVycm9yLm1lc3NhZ2UgPSBmdW5jdGlvbiAoYmFzZUlkLCByZWYpIHtcbiAgcmV0dXJuICdjYW5cXCd0IHJlc29sdmUgcmVmZXJlbmNlICcgKyByZWYgKyAnIGZyb20gaWQgJyArIGJhc2VJZDtcbn07XG5cblxuZnVuY3Rpb24gTWlzc2luZ1JlZkVycm9yKGJhc2VJZCwgcmVmLCBtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgTWlzc2luZ1JlZkVycm9yLm1lc3NhZ2UoYmFzZUlkLCByZWYpO1xuICB0aGlzLm1pc3NpbmdSZWYgPSByZXNvbHZlLnVybChiYXNlSWQsIHJlZik7XG4gIHRoaXMubWlzc2luZ1NjaGVtYSA9IHJlc29sdmUubm9ybWFsaXplSWQocmVzb2x2ZS5mdWxsUGF0aCh0aGlzLm1pc3NpbmdSZWYpKTtcbn1cblxuXG5mdW5jdGlvbiBlcnJvclN1YmNsYXNzKFN1YmNsYXNzKSB7XG4gIFN1YmNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgU3ViY2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3ViY2xhc3M7XG4gIHJldHVybiBTdWJjbGFzcztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlc29sdmUgPSByZXF1aXJlKCcuL3Jlc29sdmUnKVxuICAsIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKVxuICAsIGVycm9yQ2xhc3NlcyA9IHJlcXVpcmUoJy4vZXJyb3JfY2xhc3NlcycpXG4gICwgc3RhYmxlU3RyaW5naWZ5ID0gcmVxdWlyZSgnZmFzdC1qc29uLXN0YWJsZS1zdHJpbmdpZnknKTtcblxudmFyIHZhbGlkYXRlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi4vZG90anMvdmFsaWRhdGUnKTtcblxuLyoqXG4gKiBGdW5jdGlvbnMgYmVsb3cgYXJlIHVzZWQgaW5zaWRlIGNvbXBpbGVkIHZhbGlkYXRpb25zIGZ1bmN0aW9uXG4gKi9cblxudmFyIHVjczJsZW5ndGggPSB1dGlsLnVjczJsZW5ndGg7XG52YXIgZXF1YWwgPSByZXF1aXJlKCdmYXN0LWRlZXAtZXF1YWwnKTtcblxuLy8gdGhpcyBlcnJvciBpcyB0aHJvd24gYnkgYXN5bmMgc2NoZW1hcyB0byByZXR1cm4gdmFsaWRhdGlvbiBlcnJvcnMgdmlhIGV4Y2VwdGlvblxudmFyIFZhbGlkYXRpb25FcnJvciA9IGVycm9yQ2xhc3Nlcy5WYWxpZGF0aW9uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGU7XG5cblxuLyoqXG4gKiBDb21waWxlcyBzY2hlbWEgdG8gdmFsaWRhdGlvbiBmdW5jdGlvblxuICogQHRoaXMgICBBanZcbiAqIEBwYXJhbSAge09iamVjdH0gc2NoZW1hIHNjaGVtYSBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gcm9vdCBvYmplY3Qgd2l0aCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcm9vdCBzY2hlbWEgZm9yIHRoaXMgc2NoZW1hXG4gKiBAcGFyYW0gIHtPYmplY3R9IGxvY2FsUmVmcyB0aGUgaGFzaCBvZiBsb2NhbCByZWZlcmVuY2VzIGluc2lkZSB0aGUgc2NoZW1hIChjcmVhdGVkIGJ5IHJlc29sdmUuaWQpLCB1c2VkIGZvciBpbmxpbmUgcmVzb2x1dGlvblxuICogQHBhcmFtICB7U3RyaW5nfSBiYXNlSWQgYmFzZSBJRCBmb3IgSURzIGluIHRoZSBzY2hlbWFcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB2YWxpZGF0aW9uIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGUoc2NoZW1hLCByb290LCBsb2NhbFJlZnMsIGJhc2VJZCkge1xuICAvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlLCBldmlsOiB0cnVlICovXG4gIC8qIGVzbGludCBuby1zaGFkb3c6IDAgKi9cbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBvcHRzID0gdGhpcy5fb3B0c1xuICAgICwgcmVmVmFsID0gWyB1bmRlZmluZWQgXVxuICAgICwgcmVmcyA9IHt9XG4gICAgLCBwYXR0ZXJucyA9IFtdXG4gICAgLCBwYXR0ZXJuc0hhc2ggPSB7fVxuICAgICwgZGVmYXVsdHMgPSBbXVxuICAgICwgZGVmYXVsdHNIYXNoID0ge31cbiAgICAsIGN1c3RvbVJ1bGVzID0gW107XG5cbiAgcm9vdCA9IHJvb3QgfHwgeyBzY2hlbWE6IHNjaGVtYSwgcmVmVmFsOiByZWZWYWwsIHJlZnM6IHJlZnMgfTtcblxuICB2YXIgYyA9IGNoZWNrQ29tcGlsaW5nLmNhbGwodGhpcywgc2NoZW1hLCByb290LCBiYXNlSWQpO1xuICB2YXIgY29tcGlsYXRpb24gPSB0aGlzLl9jb21waWxhdGlvbnNbYy5pbmRleF07XG4gIGlmIChjLmNvbXBpbGluZykgcmV0dXJuIChjb21waWxhdGlvbi5jYWxsVmFsaWRhdGUgPSBjYWxsVmFsaWRhdGUpO1xuXG4gIHZhciBmb3JtYXRzID0gdGhpcy5fZm9ybWF0cztcbiAgdmFyIFJVTEVTID0gdGhpcy5SVUxFUztcblxuICB0cnkge1xuICAgIHZhciB2ID0gbG9jYWxDb21waWxlKHNjaGVtYSwgcm9vdCwgbG9jYWxSZWZzLCBiYXNlSWQpO1xuICAgIGNvbXBpbGF0aW9uLnZhbGlkYXRlID0gdjtcbiAgICB2YXIgY3YgPSBjb21waWxhdGlvbi5jYWxsVmFsaWRhdGU7XG4gICAgaWYgKGN2KSB7XG4gICAgICBjdi5zY2hlbWEgPSB2LnNjaGVtYTtcbiAgICAgIGN2LmVycm9ycyA9IG51bGw7XG4gICAgICBjdi5yZWZzID0gdi5yZWZzO1xuICAgICAgY3YucmVmVmFsID0gdi5yZWZWYWw7XG4gICAgICBjdi5yb290ID0gdi5yb290O1xuICAgICAgY3YuJGFzeW5jID0gdi4kYXN5bmM7XG4gICAgICBpZiAob3B0cy5zb3VyY2VDb2RlKSBjdi5zb3VyY2UgPSB2LnNvdXJjZTtcbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH0gZmluYWxseSB7XG4gICAgZW5kQ29tcGlsaW5nLmNhbGwodGhpcywgc2NoZW1hLCByb290LCBiYXNlSWQpO1xuICB9XG5cbiAgLyogQHRoaXMgICB7Kn0gLSBjdXN0b20gY29udGV4dCwgc2VlIHBhc3NDb250ZXh0IG9wdGlvbiAqL1xuICBmdW5jdGlvbiBjYWxsVmFsaWRhdGUoKSB7XG4gICAgLyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIHZhciB2YWxpZGF0ZSA9IGNvbXBpbGF0aW9uLnZhbGlkYXRlO1xuICAgIHZhciByZXN1bHQgPSB2YWxpZGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGNhbGxWYWxpZGF0ZS5lcnJvcnMgPSB2YWxpZGF0ZS5lcnJvcnM7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvY2FsQ29tcGlsZShfc2NoZW1hLCBfcm9vdCwgbG9jYWxSZWZzLCBiYXNlSWQpIHtcbiAgICB2YXIgaXNSb290ID0gIV9yb290IHx8IChfcm9vdCAmJiBfcm9vdC5zY2hlbWEgPT0gX3NjaGVtYSk7XG4gICAgaWYgKF9yb290LnNjaGVtYSAhPSByb290LnNjaGVtYSlcbiAgICAgIHJldHVybiBjb21waWxlLmNhbGwoc2VsZiwgX3NjaGVtYSwgX3Jvb3QsIGxvY2FsUmVmcywgYmFzZUlkKTtcblxuICAgIHZhciAkYXN5bmMgPSBfc2NoZW1hLiRhc3luYyA9PT0gdHJ1ZTtcblxuICAgIHZhciBzb3VyY2VDb2RlID0gdmFsaWRhdGVHZW5lcmF0b3Ioe1xuICAgICAgaXNUb3A6IHRydWUsXG4gICAgICBzY2hlbWE6IF9zY2hlbWEsXG4gICAgICBpc1Jvb3Q6IGlzUm9vdCxcbiAgICAgIGJhc2VJZDogYmFzZUlkLFxuICAgICAgcm9vdDogX3Jvb3QsXG4gICAgICBzY2hlbWFQYXRoOiAnJyxcbiAgICAgIGVyclNjaGVtYVBhdGg6ICcjJyxcbiAgICAgIGVycm9yUGF0aDogJ1wiXCInLFxuICAgICAgTWlzc2luZ1JlZkVycm9yOiBlcnJvckNsYXNzZXMuTWlzc2luZ1JlZixcbiAgICAgIFJVTEVTOiBSVUxFUyxcbiAgICAgIHZhbGlkYXRlOiB2YWxpZGF0ZUdlbmVyYXRvcixcbiAgICAgIHV0aWw6IHV0aWwsXG4gICAgICByZXNvbHZlOiByZXNvbHZlLFxuICAgICAgcmVzb2x2ZVJlZjogcmVzb2x2ZVJlZixcbiAgICAgIHVzZVBhdHRlcm46IHVzZVBhdHRlcm4sXG4gICAgICB1c2VEZWZhdWx0OiB1c2VEZWZhdWx0LFxuICAgICAgdXNlQ3VzdG9tUnVsZTogdXNlQ3VzdG9tUnVsZSxcbiAgICAgIG9wdHM6IG9wdHMsXG4gICAgICBmb3JtYXRzOiBmb3JtYXRzLFxuICAgICAgbG9nZ2VyOiBzZWxmLmxvZ2dlcixcbiAgICAgIHNlbGY6IHNlbGZcbiAgICB9KTtcblxuICAgIHNvdXJjZUNvZGUgPSB2YXJzKHJlZlZhbCwgcmVmVmFsQ29kZSkgKyB2YXJzKHBhdHRlcm5zLCBwYXR0ZXJuQ29kZSlcbiAgICAgICAgICAgICAgICAgICArIHZhcnMoZGVmYXVsdHMsIGRlZmF1bHRDb2RlKSArIHZhcnMoY3VzdG9tUnVsZXMsIGN1c3RvbVJ1bGVDb2RlKVxuICAgICAgICAgICAgICAgICAgICsgc291cmNlQ29kZTtcblxuICAgIGlmIChvcHRzLnByb2Nlc3NDb2RlKSBzb3VyY2VDb2RlID0gb3B0cy5wcm9jZXNzQ29kZShzb3VyY2VDb2RlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnXFxuXFxuXFxuICoqKiBcXG4nLCBKU09OLnN0cmluZ2lmeShzb3VyY2VDb2RlKSk7XG4gICAgdmFyIHZhbGlkYXRlO1xuICAgIHRyeSB7XG4gICAgICB2YXIgbWFrZVZhbGlkYXRlID0gbmV3IEZ1bmN0aW9uKFxuICAgICAgICAnc2VsZicsXG4gICAgICAgICdSVUxFUycsXG4gICAgICAgICdmb3JtYXRzJyxcbiAgICAgICAgJ3Jvb3QnLFxuICAgICAgICAncmVmVmFsJyxcbiAgICAgICAgJ2RlZmF1bHRzJyxcbiAgICAgICAgJ2N1c3RvbVJ1bGVzJyxcbiAgICAgICAgJ2VxdWFsJyxcbiAgICAgICAgJ3VjczJsZW5ndGgnLFxuICAgICAgICAnVmFsaWRhdGlvbkVycm9yJyxcbiAgICAgICAgc291cmNlQ29kZVxuICAgICAgKTtcblxuICAgICAgdmFsaWRhdGUgPSBtYWtlVmFsaWRhdGUoXG4gICAgICAgIHNlbGYsXG4gICAgICAgIFJVTEVTLFxuICAgICAgICBmb3JtYXRzLFxuICAgICAgICByb290LFxuICAgICAgICByZWZWYWwsXG4gICAgICAgIGRlZmF1bHRzLFxuICAgICAgICBjdXN0b21SdWxlcyxcbiAgICAgICAgZXF1YWwsXG4gICAgICAgIHVjczJsZW5ndGgsXG4gICAgICAgIFZhbGlkYXRpb25FcnJvclxuICAgICAgKTtcblxuICAgICAgcmVmVmFsWzBdID0gdmFsaWRhdGU7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBzZWxmLmxvZ2dlci5lcnJvcignRXJyb3IgY29tcGlsaW5nIHNjaGVtYSwgZnVuY3Rpb24gY29kZTonLCBzb3VyY2VDb2RlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUuc2NoZW1hID0gX3NjaGVtYTtcbiAgICB2YWxpZGF0ZS5lcnJvcnMgPSBudWxsO1xuICAgIHZhbGlkYXRlLnJlZnMgPSByZWZzO1xuICAgIHZhbGlkYXRlLnJlZlZhbCA9IHJlZlZhbDtcbiAgICB2YWxpZGF0ZS5yb290ID0gaXNSb290ID8gdmFsaWRhdGUgOiBfcm9vdDtcbiAgICBpZiAoJGFzeW5jKSB2YWxpZGF0ZS4kYXN5bmMgPSB0cnVlO1xuICAgIGlmIChvcHRzLnNvdXJjZUNvZGUgPT09IHRydWUpIHtcbiAgICAgIHZhbGlkYXRlLnNvdXJjZSA9IHtcbiAgICAgICAgY29kZTogc291cmNlQ29kZSxcbiAgICAgICAgcGF0dGVybnM6IHBhdHRlcm5zLFxuICAgICAgICBkZWZhdWx0czogZGVmYXVsdHNcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZVJlZihiYXNlSWQsIHJlZiwgaXNSb290KSB7XG4gICAgcmVmID0gcmVzb2x2ZS51cmwoYmFzZUlkLCByZWYpO1xuICAgIHZhciByZWZJbmRleCA9IHJlZnNbcmVmXTtcbiAgICB2YXIgX3JlZlZhbCwgcmVmQ29kZTtcbiAgICBpZiAocmVmSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgX3JlZlZhbCA9IHJlZlZhbFtyZWZJbmRleF07XG4gICAgICByZWZDb2RlID0gJ3JlZlZhbFsnICsgcmVmSW5kZXggKyAnXSc7XG4gICAgICByZXR1cm4gcmVzb2x2ZWRSZWYoX3JlZlZhbCwgcmVmQ29kZSk7XG4gICAgfVxuICAgIGlmICghaXNSb290ICYmIHJvb3QucmVmcykge1xuICAgICAgdmFyIHJvb3RSZWZJZCA9IHJvb3QucmVmc1tyZWZdO1xuICAgICAgaWYgKHJvb3RSZWZJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIF9yZWZWYWwgPSByb290LnJlZlZhbFtyb290UmVmSWRdO1xuICAgICAgICByZWZDb2RlID0gYWRkTG9jYWxSZWYocmVmLCBfcmVmVmFsKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkUmVmKF9yZWZWYWwsIHJlZkNvZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlZkNvZGUgPSBhZGRMb2NhbFJlZihyZWYpO1xuICAgIHZhciB2ID0gcmVzb2x2ZS5jYWxsKHNlbGYsIGxvY2FsQ29tcGlsZSwgcm9vdCwgcmVmKTtcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgbG9jYWxTY2hlbWEgPSBsb2NhbFJlZnMgJiYgbG9jYWxSZWZzW3JlZl07XG4gICAgICBpZiAobG9jYWxTY2hlbWEpIHtcbiAgICAgICAgdiA9IHJlc29sdmUuaW5saW5lUmVmKGxvY2FsU2NoZW1hLCBvcHRzLmlubGluZVJlZnMpXG4gICAgICAgICAgICA/IGxvY2FsU2NoZW1hXG4gICAgICAgICAgICA6IGNvbXBpbGUuY2FsbChzZWxmLCBsb2NhbFNjaGVtYSwgcm9vdCwgbG9jYWxSZWZzLCBiYXNlSWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlbW92ZUxvY2FsUmVmKHJlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGxhY2VMb2NhbFJlZihyZWYsIHYpO1xuICAgICAgcmV0dXJuIHJlc29sdmVkUmVmKHYsIHJlZkNvZGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZExvY2FsUmVmKHJlZiwgdikge1xuICAgIHZhciByZWZJZCA9IHJlZlZhbC5sZW5ndGg7XG4gICAgcmVmVmFsW3JlZklkXSA9IHY7XG4gICAgcmVmc1tyZWZdID0gcmVmSWQ7XG4gICAgcmV0dXJuICdyZWZWYWwnICsgcmVmSWQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmVMb2NhbFJlZihyZWYpIHtcbiAgICBkZWxldGUgcmVmc1tyZWZdO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVwbGFjZUxvY2FsUmVmKHJlZiwgdikge1xuICAgIHZhciByZWZJZCA9IHJlZnNbcmVmXTtcbiAgICByZWZWYWxbcmVmSWRdID0gdjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVkUmVmKHJlZlZhbCwgY29kZSkge1xuICAgIHJldHVybiB0eXBlb2YgcmVmVmFsID09ICdvYmplY3QnIHx8IHR5cGVvZiByZWZWYWwgPT0gJ2Jvb2xlYW4nXG4gICAgICAgICAgICA/IHsgY29kZTogY29kZSwgc2NoZW1hOiByZWZWYWwsIGlubGluZTogdHJ1ZSB9XG4gICAgICAgICAgICA6IHsgY29kZTogY29kZSwgJGFzeW5jOiByZWZWYWwgJiYgISFyZWZWYWwuJGFzeW5jIH07XG4gIH1cblxuICBmdW5jdGlvbiB1c2VQYXR0ZXJuKHJlZ2V4U3RyKSB7XG4gICAgdmFyIGluZGV4ID0gcGF0dGVybnNIYXNoW3JlZ2V4U3RyXTtcbiAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgaW5kZXggPSBwYXR0ZXJuc0hhc2hbcmVnZXhTdHJdID0gcGF0dGVybnMubGVuZ3RoO1xuICAgICAgcGF0dGVybnNbaW5kZXhdID0gcmVnZXhTdHI7XG4gICAgfVxuICAgIHJldHVybiAncGF0dGVybicgKyBpbmRleDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVzZURlZmF1bHQodmFsdWUpIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gJycgKyB2YWx1ZTtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJldHVybiB1dGlsLnRvUXVvdGVkU3RyaW5nKHZhbHVlKTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuICdudWxsJztcbiAgICAgICAgdmFyIHZhbHVlU3RyID0gc3RhYmxlU3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgdmFyIGluZGV4ID0gZGVmYXVsdHNIYXNoW3ZhbHVlU3RyXTtcbiAgICAgICAgaWYgKGluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpbmRleCA9IGRlZmF1bHRzSGFzaFt2YWx1ZVN0cl0gPSBkZWZhdWx0cy5sZW5ndGg7XG4gICAgICAgICAgZGVmYXVsdHNbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdkZWZhdWx0JyArIGluZGV4O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVzZUN1c3RvbVJ1bGUocnVsZSwgc2NoZW1hLCBwYXJlbnRTY2hlbWEsIGl0KSB7XG4gICAgdmFyIHZhbGlkYXRlU2NoZW1hID0gcnVsZS5kZWZpbml0aW9uLnZhbGlkYXRlU2NoZW1hO1xuICAgIGlmICh2YWxpZGF0ZVNjaGVtYSAmJiBzZWxmLl9vcHRzLnZhbGlkYXRlU2NoZW1hICE9PSBmYWxzZSkge1xuICAgICAgdmFyIHZhbGlkID0gdmFsaWRhdGVTY2hlbWEoc2NoZW1hKTtcbiAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSAna2V5d29yZCBzY2hlbWEgaXMgaW52YWxpZDogJyArIHNlbGYuZXJyb3JzVGV4dCh2YWxpZGF0ZVNjaGVtYS5lcnJvcnMpO1xuICAgICAgICBpZiAoc2VsZi5fb3B0cy52YWxpZGF0ZVNjaGVtYSA9PSAnbG9nJykgc2VsZi5sb2dnZXIuZXJyb3IobWVzc2FnZSk7XG4gICAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjb21waWxlID0gcnVsZS5kZWZpbml0aW9uLmNvbXBpbGVcbiAgICAgICwgaW5saW5lID0gcnVsZS5kZWZpbml0aW9uLmlubGluZVxuICAgICAgLCBtYWNybyA9IHJ1bGUuZGVmaW5pdGlvbi5tYWNybztcblxuICAgIHZhciB2YWxpZGF0ZTtcbiAgICBpZiAoY29tcGlsZSkge1xuICAgICAgdmFsaWRhdGUgPSBjb21waWxlLmNhbGwoc2VsZiwgc2NoZW1hLCBwYXJlbnRTY2hlbWEsIGl0KTtcbiAgICB9IGVsc2UgaWYgKG1hY3JvKSB7XG4gICAgICB2YWxpZGF0ZSA9IG1hY3JvLmNhbGwoc2VsZiwgc2NoZW1hLCBwYXJlbnRTY2hlbWEsIGl0KTtcbiAgICAgIGlmIChvcHRzLnZhbGlkYXRlU2NoZW1hICE9PSBmYWxzZSkgc2VsZi52YWxpZGF0ZVNjaGVtYSh2YWxpZGF0ZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChpbmxpbmUpIHtcbiAgICAgIHZhbGlkYXRlID0gaW5saW5lLmNhbGwoc2VsZiwgaXQsIHJ1bGUua2V5d29yZCwgc2NoZW1hLCBwYXJlbnRTY2hlbWEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWxpZGF0ZSA9IHJ1bGUuZGVmaW5pdGlvbi52YWxpZGF0ZTtcbiAgICAgIGlmICghdmFsaWRhdGUpIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodmFsaWRhdGUgPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignY3VzdG9tIGtleXdvcmQgXCInICsgcnVsZS5rZXl3b3JkICsgJ1wiZmFpbGVkIHRvIGNvbXBpbGUnKTtcblxuICAgIHZhciBpbmRleCA9IGN1c3RvbVJ1bGVzLmxlbmd0aDtcbiAgICBjdXN0b21SdWxlc1tpbmRleF0gPSB2YWxpZGF0ZTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb2RlOiAnY3VzdG9tUnVsZScgKyBpbmRleCxcbiAgICAgIHZhbGlkYXRlOiB2YWxpZGF0ZVxuICAgIH07XG4gIH1cbn1cblxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgc2NoZW1hIGlzIGN1cnJlbnRseSBjb21waWxlZFxuICogQHRoaXMgICBBanZcbiAqIEBwYXJhbSAge09iamVjdH0gc2NoZW1hIHNjaGVtYSB0byBjb21waWxlXG4gKiBAcGFyYW0gIHtPYmplY3R9IHJvb3Qgcm9vdCBvYmplY3RcbiAqIEBwYXJhbSAge1N0cmluZ30gYmFzZUlkIGJhc2Ugc2NoZW1hIElEXG4gKiBAcmV0dXJuIHtPYmplY3R9IG9iamVjdCB3aXRoIHByb3BlcnRpZXMgXCJpbmRleFwiIChjb21waWxhdGlvbiBpbmRleCkgYW5kIFwiY29tcGlsaW5nXCIgKGJvb2xlYW4pXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ29tcGlsaW5nKHNjaGVtYSwgcm9vdCwgYmFzZUlkKSB7XG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgdmFyIGluZGV4ID0gY29tcEluZGV4LmNhbGwodGhpcywgc2NoZW1hLCByb290LCBiYXNlSWQpO1xuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCBjb21waWxpbmc6IHRydWUgfTtcbiAgaW5kZXggPSB0aGlzLl9jb21waWxhdGlvbnMubGVuZ3RoO1xuICB0aGlzLl9jb21waWxhdGlvbnNbaW5kZXhdID0ge1xuICAgIHNjaGVtYTogc2NoZW1hLFxuICAgIHJvb3Q6IHJvb3QsXG4gICAgYmFzZUlkOiBiYXNlSWRcbiAgfTtcbiAgcmV0dXJuIHsgaW5kZXg6IGluZGV4LCBjb21waWxpbmc6IGZhbHNlIH07XG59XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBzY2hlbWEgZnJvbSB0aGUgY3VycmVudGx5IGNvbXBpbGVkIGxpc3RcbiAqIEB0aGlzICAgQWp2XG4gKiBAcGFyYW0gIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgdG8gY29tcGlsZVxuICogQHBhcmFtICB7T2JqZWN0fSByb290IHJvb3Qgb2JqZWN0XG4gKiBAcGFyYW0gIHtTdHJpbmd9IGJhc2VJZCBiYXNlIHNjaGVtYSBJRFxuICovXG5mdW5jdGlvbiBlbmRDb21waWxpbmcoc2NoZW1hLCByb290LCBiYXNlSWQpIHtcbiAgLyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICB2YXIgaSA9IGNvbXBJbmRleC5jYWxsKHRoaXMsIHNjaGVtYSwgcm9vdCwgYmFzZUlkKTtcbiAgaWYgKGkgPj0gMCkgdGhpcy5fY29tcGlsYXRpb25zLnNwbGljZShpLCAxKTtcbn1cblxuXG4vKipcbiAqIEluZGV4IG9mIHNjaGVtYSBjb21waWxhdGlvbiBpbiB0aGUgY3VycmVudGx5IGNvbXBpbGVkIGxpc3RcbiAqIEB0aGlzICAgQWp2XG4gKiBAcGFyYW0gIHtPYmplY3R9IHNjaGVtYSBzY2hlbWEgdG8gY29tcGlsZVxuICogQHBhcmFtICB7T2JqZWN0fSByb290IHJvb3Qgb2JqZWN0XG4gKiBAcGFyYW0gIHtTdHJpbmd9IGJhc2VJZCBiYXNlIHNjaGVtYSBJRFxuICogQHJldHVybiB7SW50ZWdlcn0gY29tcGlsYXRpb24gaW5kZXhcbiAqL1xuZnVuY3Rpb24gY29tcEluZGV4KHNjaGVtYSwgcm9vdCwgYmFzZUlkKSB7XG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgZm9yICh2YXIgaT0wOyBpPHRoaXMuX2NvbXBpbGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjID0gdGhpcy5fY29tcGlsYXRpb25zW2ldO1xuICAgIGlmIChjLnNjaGVtYSA9PSBzY2hlbWEgJiYgYy5yb290ID09IHJvb3QgJiYgYy5iYXNlSWQgPT0gYmFzZUlkKSByZXR1cm4gaTtcbiAgfVxuICByZXR1cm4gLTE7XG59XG5cblxuZnVuY3Rpb24gcGF0dGVybkNvZGUoaSwgcGF0dGVybnMpIHtcbiAgcmV0dXJuICd2YXIgcGF0dGVybicgKyBpICsgJyA9IG5ldyBSZWdFeHAoJyArIHV0aWwudG9RdW90ZWRTdHJpbmcocGF0dGVybnNbaV0pICsgJyk7Jztcbn1cblxuXG5mdW5jdGlvbiBkZWZhdWx0Q29kZShpKSB7XG4gIHJldHVybiAndmFyIGRlZmF1bHQnICsgaSArICcgPSBkZWZhdWx0c1snICsgaSArICddOyc7XG59XG5cblxuZnVuY3Rpb24gcmVmVmFsQ29kZShpLCByZWZWYWwpIHtcbiAgcmV0dXJuIHJlZlZhbFtpXSA9PT0gdW5kZWZpbmVkID8gJycgOiAndmFyIHJlZlZhbCcgKyBpICsgJyA9IHJlZlZhbFsnICsgaSArICddOyc7XG59XG5cblxuZnVuY3Rpb24gY3VzdG9tUnVsZUNvZGUoaSkge1xuICByZXR1cm4gJ3ZhciBjdXN0b21SdWxlJyArIGkgKyAnID0gY3VzdG9tUnVsZXNbJyArIGkgKyAnXTsnO1xufVxuXG5cbmZ1bmN0aW9uIHZhcnMoYXJyLCBzdGF0ZW1lbnQpIHtcbiAgaWYgKCFhcnIubGVuZ3RoKSByZXR1cm4gJyc7XG4gIHZhciBjb2RlID0gJyc7XG4gIGZvciAodmFyIGk9MDsgaTxhcnIubGVuZ3RoOyBpKyspXG4gICAgY29kZSArPSBzdGF0ZW1lbnQoaSwgYXJyKTtcbiAgcmV0dXJuIGNvZGU7XG59XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX19saW1pdExlbmd0aChpdCwgJGtleXdvcmQsICRydWxlVHlwZSkge1xuICB2YXIgb3V0ID0gJyAnO1xuICB2YXIgJGx2bCA9IGl0LmxldmVsO1xuICB2YXIgJGRhdGFMdmwgPSBpdC5kYXRhTGV2ZWw7XG4gIHZhciAkc2NoZW1hID0gaXQuc2NoZW1hWyRrZXl3b3JkXTtcbiAgdmFyICRzY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArIGl0LnV0aWwuZ2V0UHJvcGVydHkoJGtleXdvcmQpO1xuICB2YXIgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy8nICsgJGtleXdvcmQ7XG4gIHZhciAkYnJlYWtPbkVycm9yID0gIWl0Lm9wdHMuYWxsRXJyb3JzO1xuICB2YXIgJGVycm9yS2V5d29yZDtcbiAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcbiAgdmFyICRpc0RhdGEgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWEgJiYgJHNjaGVtYS4kZGF0YSxcbiAgICAkc2NoZW1hVmFsdWU7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYScgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLmdldERhdGEoJHNjaGVtYS4kZGF0YSwgJGRhdGFMdmwsIGl0LmRhdGFQYXRoQXJyKSkgKyAnOyAnO1xuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcbiAgfSBlbHNlIHtcbiAgICAkc2NoZW1hVmFsdWUgPSAkc2NoZW1hO1xuICB9XG4gIHZhciAkb3AgPSAka2V5d29yZCA9PSAnbWF4TGVuZ3RoJyA/ICc+JyA6ICc8JztcbiAgb3V0ICs9ICdpZiAoICc7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgKCcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPSBcXCdudW1iZXJcXCcpIHx8ICc7XG4gIH1cbiAgaWYgKGl0Lm9wdHMudW5pY29kZSA9PT0gZmFsc2UpIHtcbiAgICBvdXQgKz0gJyAnICsgKCRkYXRhKSArICcubGVuZ3RoICc7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcgdWNzMmxlbmd0aCgnICsgKCRkYXRhKSArICcpICc7XG4gIH1cbiAgb3V0ICs9ICcgJyArICgkb3ApICsgJyAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnKSB7ICc7XG4gIHZhciAkZXJyb3JLZXl3b3JkID0gJGtleXdvcmQ7XG4gIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgkZXJyb3JLZXl3b3JkIHx8ICdfbGltaXRMZW5ndGgnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGxpbWl0OiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnIH0gJztcbiAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgIG91dCArPSAnICwgbWVzc2FnZTogXFwnc2hvdWxkIE5PVCBiZSAnO1xuICAgICAgaWYgKCRrZXl3b3JkID09ICdtYXhMZW5ndGgnKSB7XG4gICAgICAgIG91dCArPSAnbG9uZ2VyJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnc2hvcnRlcic7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB0aGFuICc7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ1xcJyArICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKyBcXCcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWEpO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgY2hhcmFjdGVyc1xcJyAnO1xuICAgIH1cbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICBvdXQgKz0gJyAsIHNjaGVtYTogICc7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWEpO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgICAgICAgICAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfSAnO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHt9ICc7XG4gIH1cbiAgdmFyIF9fZXJyID0gb3V0O1xuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChpdC5hc3luYykge1xuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgfVxuICBvdXQgKz0gJ30gJztcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG52YXIgREFURSA9IC9eKFxcZFxcZFxcZFxcZCktKFxcZFxcZCktKFxcZFxcZCkkLztcbnZhciBEQVlTID0gWzAsMzEsMjgsMzEsMzAsMzEsMzAsMzEsMzEsMzAsMzEsMzAsMzFdO1xudmFyIFRJTUUgPSAvXihcXGRcXGQpOihcXGRcXGQpOihcXGRcXGQpKFxcLlxcZCspPyh6fFsrLV1cXGRcXGQ6XFxkXFxkKT8kL2k7XG52YXIgSE9TVE5BTUUgPSAvXlthLXowLTldKD86W2EtejAtOS1dezAsNjF9W2EtejAtOV0pPyg/OlxcLlthLXowLTldKD86Wy0wLTlhLXpdezAsNjF9WzAtOWEtel0pPykqJC9pO1xudmFyIFVSSSA9IC9eKD86W2Etel1bYS16MC05K1xcLS5dKjopKD86XFwvP1xcLyg/Oig/OlthLXowLTlcXC0uX34hJCYnKCkqKyw7PTpdfCVbMC05YS1mXXsyfSkqQCk/KD86XFxbKD86KD86KD86KD86WzAtOWEtZl17MSw0fTopezZ9fDo6KD86WzAtOWEtZl17MSw0fTopezV9fCg/OlswLTlhLWZdezEsNH0pPzo6KD86WzAtOWEtZl17MSw0fTopezR9fCg/Oig/OlswLTlhLWZdezEsNH06KXswLDF9WzAtOWEtZl17MSw0fSk/OjooPzpbMC05YS1mXXsxLDR9Oil7M318KD86KD86WzAtOWEtZl17MSw0fTopezAsMn1bMC05YS1mXXsxLDR9KT86Oig/OlswLTlhLWZdezEsNH06KXsyfXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCwzfVswLTlhLWZdezEsNH0pPzo6WzAtOWEtZl17MSw0fTp8KD86KD86WzAtOWEtZl17MSw0fTopezAsNH1bMC05YS1mXXsxLDR9KT86OikoPzpbMC05YS1mXXsxLDR9OlswLTlhLWZdezEsNH18KD86KD86MjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KVxcLil7M30oPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCw1fVswLTlhLWZdezEsNH0pPzo6WzAtOWEtZl17MSw0fXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCw2fVswLTlhLWZdezEsNH0pPzo6KXxbVnZdWzAtOWEtZl0rXFwuW2EtejAtOVxcLS5ffiEkJicoKSorLDs9Ol0rKVxcXXwoPzooPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPyl8KD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9XXwlWzAtOWEtZl17Mn0pKikoPzo6XFxkKik/KD86XFwvKD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkqKSp8XFwvKD86KD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkrKD86XFwvKD86W2EtejAtOVxcLS5ffiEkJicoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkqKSopP3woPzpbYS16MC05XFwtLl9+ISQmJygpKissOz06QF18JVswLTlhLWZdezJ9KSsoPzpcXC8oPzpbYS16MC05XFwtLl9+ISQmJygpKissOz06QF18JVswLTlhLWZdezJ9KSopKikoPzpcXD8oPzpbYS16MC05XFwtLl9+ISQmJygpKissOz06QC8/XXwlWzAtOWEtZl17Mn0pKik/KD86Iyg/OlthLXowLTlcXC0uX34hJCYnKCkqKyw7PTpALz9dfCVbMC05YS1mXXsyfSkqKT8kL2k7XG52YXIgVVJJUkVGID0gL14oPzpbYS16XVthLXowLTkrXFwtLl0qOik/KD86XFwvP1xcLyg/Oig/OlthLXowLTlcXC0uX34hJCYnKCkqKyw7PTpdfCVbMC05YS1mXXsyfSkqQCk/KD86XFxbKD86KD86KD86KD86WzAtOWEtZl17MSw0fTopezZ9fDo6KD86WzAtOWEtZl17MSw0fTopezV9fCg/OlswLTlhLWZdezEsNH0pPzo6KD86WzAtOWEtZl17MSw0fTopezR9fCg/Oig/OlswLTlhLWZdezEsNH06KXswLDF9WzAtOWEtZl17MSw0fSk/OjooPzpbMC05YS1mXXsxLDR9Oil7M318KD86KD86WzAtOWEtZl17MSw0fTopezAsMn1bMC05YS1mXXsxLDR9KT86Oig/OlswLTlhLWZdezEsNH06KXsyfXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCwzfVswLTlhLWZdezEsNH0pPzo6WzAtOWEtZl17MSw0fTp8KD86KD86WzAtOWEtZl17MSw0fTopezAsNH1bMC05YS1mXXsxLDR9KT86OikoPzpbMC05YS1mXXsxLDR9OlswLTlhLWZdezEsNH18KD86KD86MjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KVxcLil7M30oPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCw1fVswLTlhLWZdezEsNH0pPzo6WzAtOWEtZl17MSw0fXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MCw2fVswLTlhLWZdezEsNH0pPzo6KXxbVnZdWzAtOWEtZl0rXFwuW2EtejAtOVxcLS5ffiEkJicoKSorLDs9Ol0rKVxcXXwoPzooPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPyl8KD86W2EtejAtOVxcLS5ffiEkJidcIigpKissOz1dfCVbMC05YS1mXXsyfSkqKSg/OjpcXGQqKT8oPzpcXC8oPzpbYS16MC05XFwtLl9+ISQmJ1wiKCkqKyw7PTpAXXwlWzAtOWEtZl17Mn0pKikqfFxcLyg/Oig/OlthLXowLTlcXC0uX34hJCYnXCIoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkrKD86XFwvKD86W2EtejAtOVxcLS5ffiEkJidcIigpKissOz06QF18JVswLTlhLWZdezJ9KSopKik/fCg/OlthLXowLTlcXC0uX34hJCYnXCIoKSorLDs9OkBdfCVbMC05YS1mXXsyfSkrKD86XFwvKD86W2EtejAtOVxcLS5ffiEkJidcIigpKissOz06QF18JVswLTlhLWZdezJ9KSopKik/KD86XFw/KD86W2EtejAtOVxcLS5ffiEkJidcIigpKissOz06QC8/XXwlWzAtOWEtZl17Mn0pKik/KD86Iyg/OlthLXowLTlcXC0uX34hJCYnXCIoKSorLDs9OkAvP118JVswLTlhLWZdezJ9KSopPyQvaTtcbi8vIHVyaS10ZW1wbGF0ZTogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY1NzBcbnZhciBVUklURU1QTEFURSA9IC9eKD86KD86W15cXHgwMC1cXHgyMFwiJzw+JVxcXFxeYHt8fV18JVswLTlhLWZdezJ9KXxcXHtbKyMuLzs/Jj0sIUB8XT8oPzpbYS16MC05X118JVswLTlhLWZdezJ9KSsoPzo6WzEtOV1bMC05XXswLDN9fFxcKik/KD86LCg/OlthLXowLTlfXXwlWzAtOWEtZl17Mn0pKyg/OjpbMS05XVswLTldezAsM318XFwqKT8pKlxcfSkqJC9pO1xuLy8gRm9yIHRoZSBzb3VyY2U6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2RwZXJpbmkvNzI5Mjk0XG4vLyBGb3IgdGVzdCBjYXNlczogaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL2RlbW8vdXJsLXJlZ2V4XG4vLyBAdG9kbyBEZWxldGUgY3VycmVudCBVUkwgaW4gZmF2b3VyIG9mIHRoZSBjb21tZW50ZWQgb3V0IFVSTCBydWxlIHdoZW4gdGhpcyBpc3N1ZSBpcyBmaXhlZCBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludC9pc3N1ZXMvNzk4My5cbi8vIHZhciBVUkwgPSAvXig/Oig/Omh0dHBzP3xmdHApOlxcL1xcLykoPzpcXFMrKD86OlxcUyopP0ApPyg/Oig/ITEwKD86XFwuXFxkezEsM30pezN9KSg/ITEyNyg/OlxcLlxcZHsxLDN9KXszfSkoPyExNjlcXC4yNTQoPzpcXC5cXGR7MSwzfSl7Mn0pKD8hMTkyXFwuMTY4KD86XFwuXFxkezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyXFxkfDNbMC0xXSkoPzpcXC5cXGR7MSwzfSl7Mn0pKD86WzEtOV1cXGQ/fDFcXGRcXGR8MlswMV1cXGR8MjJbMC0zXSkoPzpcXC4oPzoxP1xcZHsxLDJ9fDJbMC00XVxcZHwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVxcZD98MVxcZFxcZHwyWzAtNF1cXGR8MjVbMC00XSkpfCg/Oig/OlthLXpcXHV7MDBhMX0tXFx1e2ZmZmZ9MC05XSstPykqW2EtelxcdXswMGExfS1cXHV7ZmZmZn0wLTldKykoPzpcXC4oPzpbYS16XFx1ezAwYTF9LVxcdXtmZmZmfTAtOV0rLT8pKlthLXpcXHV7MDBhMX0tXFx1e2ZmZmZ9MC05XSspKig/OlxcLig/OlthLXpcXHV7MDBhMX0tXFx1e2ZmZmZ9XXsyLH0pKSkoPzo6XFxkezIsNX0pPyg/OlxcL1teXFxzXSopPyQvaXU7XG52YXIgVVJMID0gL14oPzooPzpodHRwW3NcXHUwMTdGXT98ZnRwKTpcXC9cXC8pKD86KD86W1xcMC1cXHgwOFxceDBFLVxceDFGIS1cXHg5RlxceEExLVxcdTE2N0ZcXHUxNjgxLVxcdTFGRkZcXHUyMDBCLVxcdTIwMjdcXHUyMDJBLVxcdTIwMkVcXHUyMDMwLVxcdTIwNUVcXHUyMDYwLVxcdTJGRkZcXHUzMDAxLVxcdUQ3RkZcXHVFMDAwLVxcdUZFRkVcXHVGRjAwLVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdW1xcdURDMDAtXFx1REZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0pKyg/OjooPzpbXFwwLVxceDA4XFx4MEUtXFx4MUYhLVxceDlGXFx4QTEtXFx1MTY3RlxcdTE2ODEtXFx1MUZGRlxcdTIwMEItXFx1MjAyN1xcdTIwMkEtXFx1MjAyRVxcdTIwMzAtXFx1MjA1RVxcdTIwNjAtXFx1MkZGRlxcdTMwMDEtXFx1RDdGRlxcdUUwMDAtXFx1RkVGRVxcdUZGMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXXxbXFx1RDgwMC1cXHVEQkZGXSg/IVtcXHVEQzAwLVxcdURGRkZdKXwoPzpbXlxcdUQ4MDAtXFx1REJGRl18XilbXFx1REMwMC1cXHVERkZGXSkqKT9AKT8oPzooPyExMCg/OlxcLlswLTldezEsM30pezN9KSg/ITEyNyg/OlxcLlswLTldezEsM30pezN9KSg/ITE2OVxcLjI1NCg/OlxcLlswLTldezEsM30pezJ9KSg/ITE5MlxcLjE2OCg/OlxcLlswLTldezEsM30pezJ9KSg/ITE3MlxcLig/OjFbNi05XXwyWzAtOV18M1swMV0pKD86XFwuWzAtOV17MSwzfSl7Mn0pKD86WzEtOV1bMC05XT98MVswLTldWzAtOV18MlswMV1bMC05XXwyMlswLTNdKSg/OlxcLig/OjE/WzAtOV17MSwyfXwyWzAtNF1bMC05XXwyNVswLTVdKSl7Mn0oPzpcXC4oPzpbMS05XVswLTldP3wxWzAtOV1bMC05XXwyWzAtNF1bMC05XXwyNVswLTRdKSl8KD86KD86KD86WzAtOUtTYS16XFx4QTEtXFx1RDdGRlxcdUUwMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0pKy0/KSooPzpbMC05S1NhLXpcXHhBMS1cXHVEN0ZGXFx1RTAwMC1cXHVGRkZGXXxbXFx1RDgwMC1cXHVEQkZGXSg/IVtcXHVEQzAwLVxcdURGRkZdKXwoPzpbXlxcdUQ4MDAtXFx1REJGRl18XilbXFx1REMwMC1cXHVERkZGXSkrKSg/OlxcLig/Oig/OlswLTlLU2EtelxceEExLVxcdUQ3RkZcXHVFMDAwLVxcdUZGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdKSstPykqKD86WzAtOUtTYS16XFx4QTEtXFx1RDdGRlxcdUUwMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0pKykqKD86XFwuKD86KD86W0tTYS16XFx4QTEtXFx1RDdGRlxcdUUwMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl0oPyFbXFx1REMwMC1cXHVERkZGXSl8KD86W15cXHVEODAwLVxcdURCRkZdfF4pW1xcdURDMDAtXFx1REZGRl0pezIsfSkpKSg/OjpbMC05XXsyLDV9KT8oPzpcXC8oPzpbXFwwLVxceDA4XFx4MEUtXFx4MUYhLVxceDlGXFx4QTEtXFx1MTY3RlxcdTE2ODEtXFx1MUZGRlxcdTIwMEItXFx1MjAyN1xcdTIwMkEtXFx1MjAyRVxcdTIwMzAtXFx1MjA1RVxcdTIwNjAtXFx1MkZGRlxcdTMwMDEtXFx1RDdGRlxcdUUwMDAtXFx1RkVGRVxcdUZGMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXXxbXFx1RDgwMC1cXHVEQkZGXSg/IVtcXHVEQzAwLVxcdURGRkZdKXwoPzpbXlxcdUQ4MDAtXFx1REJGRl18XilbXFx1REMwMC1cXHVERkZGXSkqKT8kL2k7XG52YXIgVVVJRCA9IC9eKD86dXJuOnV1aWQ6KT9bMC05YS1mXXs4fS0oPzpbMC05YS1mXXs0fS0pezN9WzAtOWEtZl17MTJ9JC9pO1xudmFyIEpTT05fUE9JTlRFUiA9IC9eKD86XFwvKD86W15+L118fjB8fjEpKikqJC87XG52YXIgSlNPTl9QT0lOVEVSX1VSSV9GUkFHTUVOVCA9IC9eIyg/OlxcLyg/OlthLXowLTlfXFwtLiEkJicoKSorLDs6PUBdfCVbMC05YS1mXXsyfXx+MHx+MSkqKSokL2k7XG52YXIgUkVMQVRJVkVfSlNPTl9QT0lOVEVSID0gL14oPzowfFsxLTldWzAtOV0qKSg/OiN8KD86XFwvKD86W15+L118fjB8fjEpKikqKSQvO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybWF0cztcblxuZnVuY3Rpb24gZm9ybWF0cyhtb2RlKSB7XG4gIG1vZGUgPSBtb2RlID09ICdmdWxsJyA/ICdmdWxsJyA6ICdmYXN0JztcbiAgcmV0dXJuIHV0aWwuY29weShmb3JtYXRzW21vZGVdKTtcbn1cblxuXG5mb3JtYXRzLmZhc3QgPSB7XG4gIC8vIGRhdGU6IGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzMzMzkjc2VjdGlvbi01LjZcbiAgZGF0ZTogL15cXGRcXGRcXGRcXGQtWzAtMV1cXGQtWzAtM11cXGQkLyxcbiAgLy8gZGF0ZS10aW1lOiBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzMzM5I3NlY3Rpb24tNS42XG4gIHRpbWU6IC9eKD86WzAtMl1cXGQ6WzAtNV1cXGQ6WzAtNV1cXGR8MjM6NTk6NjApKD86XFwuXFxkKyk/KD86enxbKy1dXFxkXFxkOlxcZFxcZCk/JC9pLFxuICAnZGF0ZS10aW1lJzogL15cXGRcXGRcXGRcXGQtWzAtMV1cXGQtWzAtM11cXGRbdFxcc10oPzpbMC0yXVxcZDpbMC01XVxcZDpbMC01XVxcZHwyMzo1OTo2MCkoPzpcXC5cXGQrKT8oPzp6fFsrLV1cXGRcXGQ6XFxkXFxkKSQvaSxcbiAgLy8gdXJpOiBodHRwczovL2dpdGh1Yi5jb20vbWFmaW50b3NoL2lzLW15LWpzb24tdmFsaWQvYmxvYi9tYXN0ZXIvZm9ybWF0cy5qc1xuICB1cmk6IC9eKD86W2Etel1bYS16MC05Ky0uXSo6KSg/OlxcLz9cXC8pP1teXFxzXSokL2ksXG4gICd1cmktcmVmZXJlbmNlJzogL14oPzooPzpbYS16XVthLXowLTkrLS5dKjopP1xcLz9cXC8pPyg/OlteXFxcXFxccyNdW15cXHMjXSopPyg/OiNbXlxcXFxcXHNdKik/JC9pLFxuICAndXJpLXRlbXBsYXRlJzogVVJJVEVNUExBVEUsXG4gIHVybDogVVJMLFxuICAvLyBlbWFpbCAoc291cmNlcyBmcm9tIGpzZW4gdmFsaWRhdG9yKTpcbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMDEzMjMvdXNpbmctYS1yZWd1bGFyLWV4cHJlc3Npb24tdG8tdmFsaWRhdGUtYW4tZW1haWwtYWRkcmVzcyNhbnN3ZXItODgyOTM2M1xuICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzIChzZWFyY2ggZm9yICd3aWxsZnVsIHZpb2xhdGlvbicpXG4gIGVtYWlsOiAvXlthLXowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0rQFthLXowLTldKD86W2EtejAtOS1dezAsNjF9W2EtejAtOV0pPyg/OlxcLlthLXowLTldKD86W2EtejAtOS1dezAsNjF9W2EtejAtOV0pPykqJC9pLFxuICBob3N0bmFtZTogSE9TVE5BTUUsXG4gIC8vIG9wdGltaXplZCBodHRwczovL3d3dy5zYWZhcmlib29rc29ubGluZS5jb20vbGlicmFyeS92aWV3L3JlZ3VsYXItZXhwcmVzc2lvbnMtY29va2Jvb2svOTc4MDU5NjgwMjgzNy9jaDA3czE2Lmh0bWxcbiAgaXB2NDogL14oPzooPzoyNVswLTVdfDJbMC00XVxcZHxbMDFdP1xcZFxcZD8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPykkLyxcbiAgLy8gb3B0aW1pemVkIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTM0OTcvcmVndWxhci1leHByZXNzaW9uLXRoYXQtbWF0Y2hlcy12YWxpZC1pcHY2LWFkZHJlc3Nlc1xuICBpcHY2OiAvXlxccyooPzooPzooPzpbMC05YS1mXXsxLDR9Oil7N30oPzpbMC05YS1mXXsxLDR9fDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7Nn0oPzo6WzAtOWEtZl17MSw0fXwoPzooPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoPzpcXC4oPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KD86KD86WzAtOWEtZl17MSw0fTopezV9KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsMn0pfDooPzooPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoPzpcXC4oPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KD86KD86WzAtOWEtZl17MSw0fTopezR9KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsM30pfCg/Oig/OjpbMC05YS1mXXsxLDR9KT86KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7M30oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw0fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsMn06KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7Mn0oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw1fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsM306KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MX0oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw2fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsNH06KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzo6KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsN30pfCg/Oig/OjpbMC05YS1mXXsxLDR9KXswLDV9Oig/Oig/OjI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSg/OlxcLig/OjI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSkpKD86JS4rKT9cXHMqJC9pLFxuICByZWdleDogcmVnZXgsXG4gIC8vIHV1aWQ6IGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzQxMjJcbiAgdXVpZDogVVVJRCxcbiAgLy8gSlNPTi1wb2ludGVyOiBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNjkwMVxuICAvLyB1cmkgZnJhZ21lbnQ6IGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I2FwcGVuZGl4LUFcbiAgJ2pzb24tcG9pbnRlcic6IEpTT05fUE9JTlRFUixcbiAgJ2pzb24tcG9pbnRlci11cmktZnJhZ21lbnQnOiBKU09OX1BPSU5URVJfVVJJX0ZSQUdNRU5ULFxuICAvLyByZWxhdGl2ZSBKU09OLXBvaW50ZXI6IGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL2RyYWZ0LWx1ZmYtcmVsYXRpdmUtanNvbi1wb2ludGVyLTAwXG4gICdyZWxhdGl2ZS1qc29uLXBvaW50ZXInOiBSRUxBVElWRV9KU09OX1BPSU5URVJcbn07XG5cblxuZm9ybWF0cy5mdWxsID0ge1xuICBkYXRlOiBkYXRlLFxuICB0aW1lOiB0aW1lLFxuICAnZGF0ZS10aW1lJzogZGF0ZV90aW1lLFxuICB1cmk6IHVyaSxcbiAgJ3VyaS1yZWZlcmVuY2UnOiBVUklSRUYsXG4gICd1cmktdGVtcGxhdGUnOiBVUklURU1QTEFURSxcbiAgdXJsOiBVUkwsXG4gIGVtYWlsOiAvXlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAKD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pPyQvaSxcbiAgaG9zdG5hbWU6IGhvc3RuYW1lLFxuICBpcHY0OiAvXig/Oig/OjI1WzAtNV18MlswLTRdXFxkfFswMV0/XFxkXFxkPylcXC4pezN9KD86MjVbMC01XXwyWzAtNF1cXGR8WzAxXT9cXGRcXGQ/KSQvLFxuICBpcHY2OiAvXlxccyooPzooPzooPzpbMC05YS1mXXsxLDR9Oil7N30oPzpbMC05YS1mXXsxLDR9fDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7Nn0oPzo6WzAtOWEtZl17MSw0fXwoPzooPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoPzpcXC4oPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KD86KD86WzAtOWEtZl17MSw0fTopezV9KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsMn0pfDooPzooPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoPzpcXC4oPzoyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KD86KD86WzAtOWEtZl17MSw0fTopezR9KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsM30pfCg/Oig/OjpbMC05YS1mXXsxLDR9KT86KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7M30oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw0fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsMn06KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7Mn0oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw1fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsM306KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzooPzpbMC05YS1mXXsxLDR9Oil7MX0oPzooPzooPzo6WzAtOWEtZl17MSw0fSl7MSw2fSl8KD86KD86OlswLTlhLWZdezEsNH0pezAsNH06KD86KD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKD86XFwuKD86MjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoPzo6KD86KD86KD86OlswLTlhLWZdezEsNH0pezEsN30pfCg/Oig/OjpbMC05YS1mXXsxLDR9KXswLDV9Oig/Oig/OjI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSg/OlxcLig/OjI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSkpKD86JS4rKT9cXHMqJC9pLFxuICByZWdleDogcmVnZXgsXG4gIHV1aWQ6IFVVSUQsXG4gICdqc29uLXBvaW50ZXInOiBKU09OX1BPSU5URVIsXG4gICdqc29uLXBvaW50ZXItdXJpLWZyYWdtZW50JzogSlNPTl9QT0lOVEVSX1VSSV9GUkFHTUVOVCxcbiAgJ3JlbGF0aXZlLWpzb24tcG9pbnRlcic6IFJFTEFUSVZFX0pTT05fUE9JTlRFUlxufTtcblxuXG5mdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzMzMzkjYXBwZW5kaXgtQ1xuICByZXR1cm4geWVhciAlIDQgPT09IDAgJiYgKHllYXIgJSAxMDAgIT09IDAgfHwgeWVhciAlIDQwMCA9PT0gMCk7XG59XG5cblxuZnVuY3Rpb24gZGF0ZShzdHIpIHtcbiAgLy8gZnVsbC1kYXRlIGZyb20gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzMzOSNzZWN0aW9uLTUuNlxuICB2YXIgbWF0Y2hlcyA9IHN0ci5tYXRjaChEQVRFKTtcbiAgaWYgKCFtYXRjaGVzKSByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIHllYXIgPSArbWF0Y2hlc1sxXTtcbiAgdmFyIG1vbnRoID0gK21hdGNoZXNbMl07XG4gIHZhciBkYXkgPSArbWF0Y2hlc1szXTtcblxuICByZXR1cm4gbW9udGggPj0gMSAmJiBtb250aCA8PSAxMiAmJiBkYXkgPj0gMSAmJlxuICAgICAgICAgIGRheSA8PSAobW9udGggPT0gMiAmJiBpc0xlYXBZZWFyKHllYXIpID8gMjkgOiBEQVlTW21vbnRoXSk7XG59XG5cblxuZnVuY3Rpb24gdGltZShzdHIsIGZ1bGwpIHtcbiAgdmFyIG1hdGNoZXMgPSBzdHIubWF0Y2goVElNRSk7XG4gIGlmICghbWF0Y2hlcykgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBob3VyID0gbWF0Y2hlc1sxXTtcbiAgdmFyIG1pbnV0ZSA9IG1hdGNoZXNbMl07XG4gIHZhciBzZWNvbmQgPSBtYXRjaGVzWzNdO1xuICB2YXIgdGltZVpvbmUgPSBtYXRjaGVzWzVdO1xuICByZXR1cm4gKChob3VyIDw9IDIzICYmIG1pbnV0ZSA8PSA1OSAmJiBzZWNvbmQgPD0gNTkpIHx8XG4gICAgICAgICAgKGhvdXIgPT0gMjMgJiYgbWludXRlID09IDU5ICYmIHNlY29uZCA9PSA2MCkpICYmXG4gICAgICAgICAoIWZ1bGwgfHwgdGltZVpvbmUpO1xufVxuXG5cbnZhciBEQVRFX1RJTUVfU0VQQVJBVE9SID0gL3R8XFxzL2k7XG5mdW5jdGlvbiBkYXRlX3RpbWUoc3RyKSB7XG4gIC8vIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzMzMzkjc2VjdGlvbi01LjZcbiAgdmFyIGRhdGVUaW1lID0gc3RyLnNwbGl0KERBVEVfVElNRV9TRVBBUkFUT1IpO1xuICByZXR1cm4gZGF0ZVRpbWUubGVuZ3RoID09IDIgJiYgZGF0ZShkYXRlVGltZVswXSkgJiYgdGltZShkYXRlVGltZVsxXSwgdHJ1ZSk7XG59XG5cblxuZnVuY3Rpb24gaG9zdG5hbWUoc3RyKSB7XG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMxMDM0I3NlY3Rpb24tMy41XG4gIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMxMTIzI3NlY3Rpb24tMlxuICByZXR1cm4gc3RyLmxlbmd0aCA8PSAyNTUgJiYgSE9TVE5BTUUudGVzdChzdHIpO1xufVxuXG5cbnZhciBOT1RfVVJJX0ZSQUdNRU5UID0gL1xcL3w6LztcbmZ1bmN0aW9uIHVyaShzdHIpIHtcbiAgLy8gaHR0cDovL2ptcndhcmUuY29tL2FydGljbGVzLzIwMDkvdXJpX3JlZ2V4cC9VUklfcmVnZXguaHRtbCArIG9wdGlvbmFsIHByb3RvY29sICsgcmVxdWlyZWQgXCIuXCJcbiAgcmV0dXJuIE5PVF9VUklfRlJBR01FTlQudGVzdChzdHIpICYmIFVSSS50ZXN0KHN0cik7XG59XG5cblxudmFyIFpfQU5DSE9SID0gL1teXFxcXF1cXFxcWi87XG5mdW5jdGlvbiByZWdleChzdHIpIHtcbiAgaWYgKFpfQU5DSE9SLnRlc3Qoc3RyKSkgcmV0dXJuIGZhbHNlO1xuICB0cnkge1xuICAgIG5ldyBSZWdFeHAoc3RyKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX211bHRpcGxlT2YoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcbiAgdmFyIG91dCA9ICcgJztcbiAgdmFyICRsdmwgPSBpdC5sZXZlbDtcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XG4gIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRrZXl3b3JkKTtcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcbiAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcbiAgdmFyICRpc0RhdGEgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWEgJiYgJHNjaGVtYS4kZGF0YSxcbiAgICAkc2NoZW1hVmFsdWU7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYScgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLmdldERhdGEoJHNjaGVtYS4kZGF0YSwgJGRhdGFMdmwsIGl0LmRhdGFQYXRoQXJyKSkgKyAnOyAnO1xuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcbiAgfSBlbHNlIHtcbiAgICAkc2NoZW1hVmFsdWUgPSAkc2NoZW1hO1xuICB9XG4gIG91dCArPSAndmFyIGRpdmlzaW9uJyArICgkbHZsKSArICc7aWYgKCc7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPT0gdW5kZWZpbmVkICYmICggdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnbnVtYmVyXFwnIHx8ICc7XG4gIH1cbiAgb3V0ICs9ICcgKGRpdmlzaW9uJyArICgkbHZsKSArICcgPSAnICsgKCRkYXRhKSArICcgLyAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnLCAnO1xuICBpZiAoaXQub3B0cy5tdWx0aXBsZU9mUHJlY2lzaW9uKSB7XG4gICAgb3V0ICs9ICcgTWF0aC5hYnMoTWF0aC5yb3VuZChkaXZpc2lvbicgKyAoJGx2bCkgKyAnKSAtIGRpdmlzaW9uJyArICgkbHZsKSArICcpID4gMWUtJyArIChpdC5vcHRzLm11bHRpcGxlT2ZQcmVjaXNpb24pICsgJyAnO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIGRpdmlzaW9uJyArICgkbHZsKSArICcgIT09IHBhcnNlSW50KGRpdmlzaW9uJyArICgkbHZsKSArICcpICc7XG4gIH1cbiAgb3V0ICs9ICcgKSAnO1xuICBpZiAoJGlzRGF0YSkge1xuICAgIG91dCArPSAnICApICAnO1xuICB9XG4gIG91dCArPSAnICkgeyAgICc7XG4gIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgnbXVsdGlwbGVPZicpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbXVsdGlwbGVPZjogJyArICgkc2NoZW1hVmFsdWUpICsgJyB9ICc7XG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBiZSBtdWx0aXBsZSBvZiAnO1xuICAgICAgaWYgKCRpc0RhdGEpIHtcbiAgICAgICAgb3V0ICs9ICdcXCcgKyAnICsgKCRzY2hlbWFWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJycgKyAoJHNjaGVtYVZhbHVlKSArICdcXCcnO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICBvdXQgKz0gJyAsIHNjaGVtYTogICc7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ3ZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcnICsgKCRzY2hlbWEpO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgICAgICAgICAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgfSAnO1xuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHt9ICc7XG4gIH1cbiAgdmFyIF9fZXJyID0gb3V0O1xuICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmIChpdC5hc3luYykge1xuICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgfVxuICBvdXQgKz0gJ30gJztcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVVJJID0gcmVxdWlyZSgndXJpLWpzJylcbiAgLCBlcXVhbCA9IHJlcXVpcmUoJ2Zhc3QtZGVlcC1lcXVhbCcpXG4gICwgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXG4gICwgU2NoZW1hT2JqZWN0ID0gcmVxdWlyZSgnLi9zY2hlbWFfb2JqJylcbiAgLCB0cmF2ZXJzZSA9IHJlcXVpcmUoJ2pzb24tc2NoZW1hLXRyYXZlcnNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZTtcblxucmVzb2x2ZS5ub3JtYWxpemVJZCA9IG5vcm1hbGl6ZUlkO1xucmVzb2x2ZS5mdWxsUGF0aCA9IGdldEZ1bGxQYXRoO1xucmVzb2x2ZS51cmwgPSByZXNvbHZlVXJsO1xucmVzb2x2ZS5pZHMgPSByZXNvbHZlSWRzO1xucmVzb2x2ZS5pbmxpbmVSZWYgPSBpbmxpbmVSZWY7XG5yZXNvbHZlLnNjaGVtYSA9IHJlc29sdmVTY2hlbWE7XG5cbi8qKlxuICogW3Jlc29sdmUgYW5kIGNvbXBpbGUgdGhlIHJlZmVyZW5jZXMgKCRyZWYpXVxuICogQHRoaXMgICBBanZcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjb21waWxlIHJlZmVyZW5jZSB0byBzY2hlbWEgY29tcGlsYXRpb24gZnVuY2l0b24gKGxvY2FsQ29tcGlsZSlcbiAqIEBwYXJhbSAge09iamVjdH0gcm9vdCBvYmplY3Qgd2l0aCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgcm9vdCBzY2hlbWEgZm9yIHRoZSBjdXJyZW50IHNjaGVtYVxuICogQHBhcmFtICB7U3RyaW5nfSByZWYgcmVmZXJlbmNlIHRvIHJlc29sdmVcbiAqIEByZXR1cm4ge09iamVjdHxGdW5jdGlvbn0gc2NoZW1hIG9iamVjdCAoaWYgdGhlIHNjaGVtYSBjYW4gYmUgaW5saW5lZCkgb3IgdmFsaWRhdGlvbiBmdW5jdGlvblxuICovXG5mdW5jdGlvbiByZXNvbHZlKGNvbXBpbGUsIHJvb3QsIHJlZikge1xuICAvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gIHZhciByZWZWYWwgPSB0aGlzLl9yZWZzW3JlZl07XG4gIGlmICh0eXBlb2YgcmVmVmFsID09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHRoaXMuX3JlZnNbcmVmVmFsXSkgcmVmVmFsID0gdGhpcy5fcmVmc1tyZWZWYWxdO1xuICAgIGVsc2UgcmV0dXJuIHJlc29sdmUuY2FsbCh0aGlzLCBjb21waWxlLCByb290LCByZWZWYWwpO1xuICB9XG5cbiAgcmVmVmFsID0gcmVmVmFsIHx8IHRoaXMuX3NjaGVtYXNbcmVmXTtcbiAgaWYgKHJlZlZhbCBpbnN0YW5jZW9mIFNjaGVtYU9iamVjdCkge1xuICAgIHJldHVybiBpbmxpbmVSZWYocmVmVmFsLnNjaGVtYSwgdGhpcy5fb3B0cy5pbmxpbmVSZWZzKVxuICAgICAgICAgICAgPyByZWZWYWwuc2NoZW1hXG4gICAgICAgICAgICA6IHJlZlZhbC52YWxpZGF0ZSB8fCB0aGlzLl9jb21waWxlKHJlZlZhbCk7XG4gIH1cblxuICB2YXIgcmVzID0gcmVzb2x2ZVNjaGVtYS5jYWxsKHRoaXMsIHJvb3QsIHJlZik7XG4gIHZhciBzY2hlbWEsIHYsIGJhc2VJZDtcbiAgaWYgKHJlcykge1xuICAgIHNjaGVtYSA9IHJlcy5zY2hlbWE7XG4gICAgcm9vdCA9IHJlcy5yb290O1xuICAgIGJhc2VJZCA9IHJlcy5iYXNlSWQ7XG4gIH1cblxuICBpZiAoc2NoZW1hIGluc3RhbmNlb2YgU2NoZW1hT2JqZWN0KSB7XG4gICAgdiA9IHNjaGVtYS52YWxpZGF0ZSB8fCBjb21waWxlLmNhbGwodGhpcywgc2NoZW1hLnNjaGVtYSwgcm9vdCwgdW5kZWZpbmVkLCBiYXNlSWQpO1xuICB9IGVsc2UgaWYgKHNjaGVtYSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdiA9IGlubGluZVJlZihzY2hlbWEsIHRoaXMuX29wdHMuaW5saW5lUmVmcylcbiAgICAgICAgPyBzY2hlbWFcbiAgICAgICAgOiBjb21waWxlLmNhbGwodGhpcywgc2NoZW1hLCByb290LCB1bmRlZmluZWQsIGJhc2VJZCk7XG4gIH1cblxuICByZXR1cm4gdjtcbn1cblxuXG4vKipcbiAqIFJlc29sdmUgc2NoZW1hLCBpdHMgcm9vdCBhbmQgYmFzZUlkXG4gKiBAdGhpcyBBanZcbiAqIEBwYXJhbSAge09iamVjdH0gcm9vdCByb290IG9iamVjdCB3aXRoIHByb3BlcnRpZXMgc2NoZW1hLCByZWZWYWwsIHJlZnNcbiAqIEBwYXJhbSAge1N0cmluZ30gcmVmICByZWZlcmVuY2UgdG8gcmVzb2x2ZVxuICogQHJldHVybiB7T2JqZWN0fSBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIHNjaGVtYSwgcm9vdCwgYmFzZUlkXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVTY2hlbWEocm9vdCwgcmVmKSB7XG4gIC8qIGpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgdmFyIHAgPSBVUkkucGFyc2UocmVmKVxuICAgICwgcmVmUGF0aCA9IF9nZXRGdWxsUGF0aChwKVxuICAgICwgYmFzZUlkID0gZ2V0RnVsbFBhdGgodGhpcy5fZ2V0SWQocm9vdC5zY2hlbWEpKTtcbiAgaWYgKE9iamVjdC5rZXlzKHJvb3Quc2NoZW1hKS5sZW5ndGggPT09IDAgfHwgcmVmUGF0aCAhPT0gYmFzZUlkKSB7XG4gICAgdmFyIGlkID0gbm9ybWFsaXplSWQocmVmUGF0aCk7XG4gICAgdmFyIHJlZlZhbCA9IHRoaXMuX3JlZnNbaWRdO1xuICAgIGlmICh0eXBlb2YgcmVmVmFsID09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZVJlY3Vyc2l2ZS5jYWxsKHRoaXMsIHJvb3QsIHJlZlZhbCwgcCk7XG4gICAgfSBlbHNlIGlmIChyZWZWYWwgaW5zdGFuY2VvZiBTY2hlbWFPYmplY3QpIHtcbiAgICAgIGlmICghcmVmVmFsLnZhbGlkYXRlKSB0aGlzLl9jb21waWxlKHJlZlZhbCk7XG4gICAgICByb290ID0gcmVmVmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWZWYWwgPSB0aGlzLl9zY2hlbWFzW2lkXTtcbiAgICAgIGlmIChyZWZWYWwgaW5zdGFuY2VvZiBTY2hlbWFPYmplY3QpIHtcbiAgICAgICAgaWYgKCFyZWZWYWwudmFsaWRhdGUpIHRoaXMuX2NvbXBpbGUocmVmVmFsKTtcbiAgICAgICAgaWYgKGlkID09IG5vcm1hbGl6ZUlkKHJlZikpXG4gICAgICAgICAgcmV0dXJuIHsgc2NoZW1hOiByZWZWYWwsIHJvb3Q6IHJvb3QsIGJhc2VJZDogYmFzZUlkIH07XG4gICAgICAgIHJvb3QgPSByZWZWYWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghcm9vdC5zY2hlbWEpIHJldHVybjtcbiAgICBiYXNlSWQgPSBnZXRGdWxsUGF0aCh0aGlzLl9nZXRJZChyb290LnNjaGVtYSkpO1xuICB9XG4gIHJldHVybiBnZXRKc29uUG9pbnRlci5jYWxsKHRoaXMsIHAsIGJhc2VJZCwgcm9vdC5zY2hlbWEsIHJvb3QpO1xufVxuXG5cbi8qIEB0aGlzIEFqdiAqL1xuZnVuY3Rpb24gcmVzb2x2ZVJlY3Vyc2l2ZShyb290LCByZWYsIHBhcnNlZFJlZikge1xuICAvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gIHZhciByZXMgPSByZXNvbHZlU2NoZW1hLmNhbGwodGhpcywgcm9vdCwgcmVmKTtcbiAgaWYgKHJlcykge1xuICAgIHZhciBzY2hlbWEgPSByZXMuc2NoZW1hO1xuICAgIHZhciBiYXNlSWQgPSByZXMuYmFzZUlkO1xuICAgIHJvb3QgPSByZXMucm9vdDtcbiAgICB2YXIgaWQgPSB0aGlzLl9nZXRJZChzY2hlbWEpO1xuICAgIGlmIChpZCkgYmFzZUlkID0gcmVzb2x2ZVVybChiYXNlSWQsIGlkKTtcbiAgICByZXR1cm4gZ2V0SnNvblBvaW50ZXIuY2FsbCh0aGlzLCBwYXJzZWRSZWYsIGJhc2VJZCwgc2NoZW1hLCByb290KTtcbiAgfVxufVxuXG5cbnZhciBQUkVWRU5UX1NDT1BFX0NIQU5HRSA9IHV0aWwudG9IYXNoKFsncHJvcGVydGllcycsICdwYXR0ZXJuUHJvcGVydGllcycsICdlbnVtJywgJ2RlcGVuZGVuY2llcycsICdkZWZpbml0aW9ucyddKTtcbi8qIEB0aGlzIEFqdiAqL1xuZnVuY3Rpb24gZ2V0SnNvblBvaW50ZXIocGFyc2VkUmVmLCBiYXNlSWQsIHNjaGVtYSwgcm9vdCkge1xuICAvKiBqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gIHBhcnNlZFJlZi5mcmFnbWVudCA9IHBhcnNlZFJlZi5mcmFnbWVudCB8fCAnJztcbiAgaWYgKHBhcnNlZFJlZi5mcmFnbWVudC5zbGljZSgwLDEpICE9ICcvJykgcmV0dXJuO1xuICB2YXIgcGFydHMgPSBwYXJzZWRSZWYuZnJhZ21lbnQuc3BsaXQoJy8nKTtcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBhcnQgPSBwYXJ0c1tpXTtcbiAgICBpZiAocGFydCkge1xuICAgICAgcGFydCA9IHV0aWwudW5lc2NhcGVGcmFnbWVudChwYXJ0KTtcbiAgICAgIHNjaGVtYSA9IHNjaGVtYVtwYXJ0XTtcbiAgICAgIGlmIChzY2hlbWEgPT09IHVuZGVmaW5lZCkgYnJlYWs7XG4gICAgICB2YXIgaWQ7XG4gICAgICBpZiAoIVBSRVZFTlRfU0NPUEVfQ0hBTkdFW3BhcnRdKSB7XG4gICAgICAgIGlkID0gdGhpcy5fZ2V0SWQoc2NoZW1hKTtcbiAgICAgICAgaWYgKGlkKSBiYXNlSWQgPSByZXNvbHZlVXJsKGJhc2VJZCwgaWQpO1xuICAgICAgICBpZiAoc2NoZW1hLiRyZWYpIHtcbiAgICAgICAgICB2YXIgJHJlZiA9IHJlc29sdmVVcmwoYmFzZUlkLCBzY2hlbWEuJHJlZik7XG4gICAgICAgICAgdmFyIHJlcyA9IHJlc29sdmVTY2hlbWEuY2FsbCh0aGlzLCByb290LCAkcmVmKTtcbiAgICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgICBzY2hlbWEgPSByZXMuc2NoZW1hO1xuICAgICAgICAgICAgcm9vdCA9IHJlcy5yb290O1xuICAgICAgICAgICAgYmFzZUlkID0gcmVzLmJhc2VJZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHNjaGVtYSAhPT0gdW5kZWZpbmVkICYmIHNjaGVtYSAhPT0gcm9vdC5zY2hlbWEpXG4gICAgcmV0dXJuIHsgc2NoZW1hOiBzY2hlbWEsIHJvb3Q6IHJvb3QsIGJhc2VJZDogYmFzZUlkIH07XG59XG5cblxudmFyIFNJTVBMRV9JTkxJTkVEID0gdXRpbC50b0hhc2goW1xuICAndHlwZScsICdmb3JtYXQnLCAncGF0dGVybicsXG4gICdtYXhMZW5ndGgnLCAnbWluTGVuZ3RoJyxcbiAgJ21heFByb3BlcnRpZXMnLCAnbWluUHJvcGVydGllcycsXG4gICdtYXhJdGVtcycsICdtaW5JdGVtcycsXG4gICdtYXhpbXVtJywgJ21pbmltdW0nLFxuICAndW5pcXVlSXRlbXMnLCAnbXVsdGlwbGVPZicsXG4gICdyZXF1aXJlZCcsICdlbnVtJ1xuXSk7XG5mdW5jdGlvbiBpbmxpbmVSZWYoc2NoZW1hLCBsaW1pdCkge1xuICBpZiAobGltaXQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkIHx8IGxpbWl0ID09PSB0cnVlKSByZXR1cm4gY2hlY2tOb1JlZihzY2hlbWEpO1xuICBlbHNlIGlmIChsaW1pdCkgcmV0dXJuIGNvdW50S2V5cyhzY2hlbWEpIDw9IGxpbWl0O1xufVxuXG5cbmZ1bmN0aW9uIGNoZWNrTm9SZWYoc2NoZW1hKSB7XG4gIHZhciBpdGVtO1xuICBpZiAoQXJyYXkuaXNBcnJheShzY2hlbWEpKSB7XG4gICAgZm9yICh2YXIgaT0wOyBpPHNjaGVtYS5sZW5ndGg7IGkrKykge1xuICAgICAgaXRlbSA9IHNjaGVtYVtpXTtcbiAgICAgIGlmICh0eXBlb2YgaXRlbSA9PSAnb2JqZWN0JyAmJiAhY2hlY2tOb1JlZihpdGVtKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICBpZiAoa2V5ID09ICckcmVmJykgcmV0dXJuIGZhbHNlO1xuICAgICAgaXRlbSA9IHNjaGVtYVtrZXldO1xuICAgICAgaWYgKHR5cGVvZiBpdGVtID09ICdvYmplY3QnICYmICFjaGVja05vUmVmKGl0ZW0pKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5cbmZ1bmN0aW9uIGNvdW50S2V5cyhzY2hlbWEpIHtcbiAgdmFyIGNvdW50ID0gMCwgaXRlbTtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc2NoZW1hKSkge1xuICAgIGZvciAodmFyIGk9MDsgaTxzY2hlbWEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGl0ZW0gPSBzY2hlbWFbaV07XG4gICAgICBpZiAodHlwZW9mIGl0ZW0gPT0gJ29iamVjdCcpIGNvdW50ICs9IGNvdW50S2V5cyhpdGVtKTtcbiAgICAgIGlmIChjb3VudCA9PSBJbmZpbml0eSkgcmV0dXJuIEluZmluaXR5O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICBpZiAoa2V5ID09ICckcmVmJykgcmV0dXJuIEluZmluaXR5O1xuICAgICAgaWYgKFNJTVBMRV9JTkxJTkVEW2tleV0pIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW0gPSBzY2hlbWFba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09ICdvYmplY3QnKSBjb3VudCArPSBjb3VudEtleXMoaXRlbSkgKyAxO1xuICAgICAgICBpZiAoY291bnQgPT0gSW5maW5pdHkpIHJldHVybiBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufVxuXG5cbmZ1bmN0aW9uIGdldEZ1bGxQYXRoKGlkLCBub3JtYWxpemUpIHtcbiAgaWYgKG5vcm1hbGl6ZSAhPT0gZmFsc2UpIGlkID0gbm9ybWFsaXplSWQoaWQpO1xuICB2YXIgcCA9IFVSSS5wYXJzZShpZCk7XG4gIHJldHVybiBfZ2V0RnVsbFBhdGgocCk7XG59XG5cblxuZnVuY3Rpb24gX2dldEZ1bGxQYXRoKHApIHtcbiAgcmV0dXJuIFVSSS5zZXJpYWxpemUocCkuc3BsaXQoJyMnKVswXSArICcjJztcbn1cblxuXG52YXIgVFJBSUxJTkdfU0xBU0hfSEFTSCA9IC8jXFwvPyQvO1xuZnVuY3Rpb24gbm9ybWFsaXplSWQoaWQpIHtcbiAgcmV0dXJuIGlkID8gaWQucmVwbGFjZShUUkFJTElOR19TTEFTSF9IQVNILCAnJykgOiAnJztcbn1cblxuXG5mdW5jdGlvbiByZXNvbHZlVXJsKGJhc2VJZCwgaWQpIHtcbiAgaWQgPSBub3JtYWxpemVJZChpZCk7XG4gIHJldHVybiBVUkkucmVzb2x2ZShiYXNlSWQsIGlkKTtcbn1cblxuXG4vKiBAdGhpcyBBanYgKi9cbmZ1bmN0aW9uIHJlc29sdmVJZHMoc2NoZW1hKSB7XG4gIHZhciBzY2hlbWFJZCA9IG5vcm1hbGl6ZUlkKHRoaXMuX2dldElkKHNjaGVtYSkpO1xuICB2YXIgYmFzZUlkcyA9IHsnJzogc2NoZW1hSWR9O1xuICB2YXIgZnVsbFBhdGhzID0geycnOiBnZXRGdWxsUGF0aChzY2hlbWFJZCwgZmFsc2UpfTtcbiAgdmFyIGxvY2FsUmVmcyA9IHt9O1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdHJhdmVyc2Uoc2NoZW1hLCB7YWxsS2V5czogdHJ1ZX0sIGZ1bmN0aW9uKHNjaCwganNvblB0ciwgcm9vdFNjaGVtYSwgcGFyZW50SnNvblB0ciwgcGFyZW50S2V5d29yZCwgcGFyZW50U2NoZW1hLCBrZXlJbmRleCkge1xuICAgIGlmIChqc29uUHRyID09PSAnJykgcmV0dXJuO1xuICAgIHZhciBpZCA9IHNlbGYuX2dldElkKHNjaCk7XG4gICAgdmFyIGJhc2VJZCA9IGJhc2VJZHNbcGFyZW50SnNvblB0cl07XG4gICAgdmFyIGZ1bGxQYXRoID0gZnVsbFBhdGhzW3BhcmVudEpzb25QdHJdICsgJy8nICsgcGFyZW50S2V5d29yZDtcbiAgICBpZiAoa2V5SW5kZXggIT09IHVuZGVmaW5lZClcbiAgICAgIGZ1bGxQYXRoICs9ICcvJyArICh0eXBlb2Yga2V5SW5kZXggPT0gJ251bWJlcicgPyBrZXlJbmRleCA6IHV0aWwuZXNjYXBlRnJhZ21lbnQoa2V5SW5kZXgpKTtcblxuICAgIGlmICh0eXBlb2YgaWQgPT0gJ3N0cmluZycpIHtcbiAgICAgIGlkID0gYmFzZUlkID0gbm9ybWFsaXplSWQoYmFzZUlkID8gVVJJLnJlc29sdmUoYmFzZUlkLCBpZCkgOiBpZCk7XG5cbiAgICAgIHZhciByZWZWYWwgPSBzZWxmLl9yZWZzW2lkXTtcbiAgICAgIGlmICh0eXBlb2YgcmVmVmFsID09ICdzdHJpbmcnKSByZWZWYWwgPSBzZWxmLl9yZWZzW3JlZlZhbF07XG4gICAgICBpZiAocmVmVmFsICYmIHJlZlZhbC5zY2hlbWEpIHtcbiAgICAgICAgaWYgKCFlcXVhbChzY2gsIHJlZlZhbC5zY2hlbWEpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaWQgXCInICsgaWQgKyAnXCIgcmVzb2x2ZXMgdG8gbW9yZSB0aGFuIG9uZSBzY2hlbWEnKTtcbiAgICAgIH0gZWxzZSBpZiAoaWQgIT0gbm9ybWFsaXplSWQoZnVsbFBhdGgpKSB7XG4gICAgICAgIGlmIChpZFswXSA9PSAnIycpIHtcbiAgICAgICAgICBpZiAobG9jYWxSZWZzW2lkXSAmJiAhZXF1YWwoc2NoLCBsb2NhbFJlZnNbaWRdKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaWQgXCInICsgaWQgKyAnXCIgcmVzb2x2ZXMgdG8gbW9yZSB0aGFuIG9uZSBzY2hlbWEnKTtcbiAgICAgICAgICBsb2NhbFJlZnNbaWRdID0gc2NoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuX3JlZnNbaWRdID0gZnVsbFBhdGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgYmFzZUlkc1tqc29uUHRyXSA9IGJhc2VJZDtcbiAgICBmdWxsUGF0aHNbanNvblB0cl0gPSBmdWxsUGF0aDtcbiAgfSk7XG5cbiAgcmV0dXJuIGxvY2FsUmVmcztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1pc3NpbmdSZWZFcnJvciA9IHJlcXVpcmUoJy4vZXJyb3JfY2xhc3NlcycpLk1pc3NpbmdSZWY7XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZUFzeW5jO1xuXG5cbi8qKlxuICogQ3JlYXRlcyB2YWxpZGF0aW5nIGZ1bmN0aW9uIGZvciBwYXNzZWQgc2NoZW1hIHdpdGggYXN5bmNocm9ub3VzIGxvYWRpbmcgb2YgbWlzc2luZyBzY2hlbWFzLlxuICogYGxvYWRTY2hlbWFgIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgc2NoZW1hIHVyaSBhbmQgcmV0dXJucyBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCB0aGUgc2NoZW1hLlxuICogQHRoaXMgIEFqdlxuICogQHBhcmFtIHtPYmplY3R9ICAgc2NoZW1hIHNjaGVtYSBvYmplY3RcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIG1ldGEgb3B0aW9uYWwgdHJ1ZSB0byBjb21waWxlIG1ldGEtc2NoZW1hOyB0aGlzIHBhcmFtZXRlciBjYW4gYmUgc2tpcHBlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYW4gb3B0aW9uYWwgbm9kZS1zdHlsZSBjYWxsYmFjaywgaXQgaXMgY2FsbGVkIHdpdGggMiBwYXJhbWV0ZXJzOiBlcnJvciAob3IgbnVsbCkgYW5kIHZhbGlkYXRpbmcgZnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtQcm9taXNlfSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCBhIHZhbGlkYXRpbmcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVBc3luYyhzY2hlbWEsIG1ldGEsIGNhbGxiYWNrKSB7XG4gIC8qIGVzbGludCBuby1zaGFkb3c6IDAgKi9cbiAgLyogZ2xvYmFsIFByb21pc2UgKi9cbiAgLyoganNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICh0eXBlb2YgdGhpcy5fb3B0cy5sb2FkU2NoZW1hICE9ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdvcHRpb25zLmxvYWRTY2hlbWEgc2hvdWxkIGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAodHlwZW9mIG1ldGEgPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gbWV0YTtcbiAgICBtZXRhID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIHAgPSBsb2FkTWV0YVNjaGVtYU9mKHNjaGVtYSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNjaGVtYU9iaiA9IHNlbGYuX2FkZFNjaGVtYShzY2hlbWEsIHVuZGVmaW5lZCwgbWV0YSk7XG4gICAgcmV0dXJuIHNjaGVtYU9iai52YWxpZGF0ZSB8fCBfY29tcGlsZUFzeW5jKHNjaGVtYU9iaik7XG4gIH0pO1xuXG4gIGlmIChjYWxsYmFjaykge1xuICAgIHAudGhlbihcbiAgICAgIGZ1bmN0aW9uKHYpIHsgY2FsbGJhY2sobnVsbCwgdik7IH0sXG4gICAgICBjYWxsYmFja1xuICAgICk7XG4gIH1cblxuICByZXR1cm4gcDtcblxuXG4gIGZ1bmN0aW9uIGxvYWRNZXRhU2NoZW1hT2Yoc2NoKSB7XG4gICAgdmFyICRzY2hlbWEgPSBzY2guJHNjaGVtYTtcbiAgICByZXR1cm4gJHNjaGVtYSAmJiAhc2VsZi5nZXRTY2hlbWEoJHNjaGVtYSlcbiAgICAgICAgICAgID8gY29tcGlsZUFzeW5jLmNhbGwoc2VsZiwgeyAkcmVmOiAkc2NoZW1hIH0sIHRydWUpXG4gICAgICAgICAgICA6IFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cblxuICBmdW5jdGlvbiBfY29tcGlsZUFzeW5jKHNjaGVtYU9iaikge1xuICAgIHRyeSB7IHJldHVybiBzZWxmLl9jb21waWxlKHNjaGVtYU9iaik7IH1cbiAgICBjYXRjaChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIE1pc3NpbmdSZWZFcnJvcikgcmV0dXJuIGxvYWRNaXNzaW5nU2NoZW1hKGUpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGxvYWRNaXNzaW5nU2NoZW1hKGUpIHtcbiAgICAgIHZhciByZWYgPSBlLm1pc3NpbmdTY2hlbWE7XG4gICAgICBpZiAoYWRkZWQocmVmKSkgdGhyb3cgbmV3IEVycm9yKCdTY2hlbWEgJyArIHJlZiArICcgaXMgbG9hZGVkIGJ1dCAnICsgZS5taXNzaW5nUmVmICsgJyBjYW5ub3QgYmUgcmVzb2x2ZWQnKTtcblxuICAgICAgdmFyIHNjaGVtYVByb21pc2UgPSBzZWxmLl9sb2FkaW5nU2NoZW1hc1tyZWZdO1xuICAgICAgaWYgKCFzY2hlbWFQcm9taXNlKSB7XG4gICAgICAgIHNjaGVtYVByb21pc2UgPSBzZWxmLl9sb2FkaW5nU2NoZW1hc1tyZWZdID0gc2VsZi5fb3B0cy5sb2FkU2NoZW1hKHJlZik7XG4gICAgICAgIHNjaGVtYVByb21pc2UudGhlbihyZW1vdmVQcm9taXNlLCByZW1vdmVQcm9taXNlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNjaGVtYVByb21pc2UudGhlbihmdW5jdGlvbiAoc2NoKSB7XG4gICAgICAgIGlmICghYWRkZWQocmVmKSkge1xuICAgICAgICAgIHJldHVybiBsb2FkTWV0YVNjaGVtYU9mKHNjaCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoIWFkZGVkKHJlZikpIHNlbGYuYWRkU2NoZW1hKHNjaCwgcmVmLCB1bmRlZmluZWQsIG1ldGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2NvbXBpbGVBc3luYyhzY2hlbWFPYmopO1xuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHJlbW92ZVByb21pc2UoKSB7XG4gICAgICAgIGRlbGV0ZSBzZWxmLl9sb2FkaW5nU2NoZW1hc1tyZWZdO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRlZChyZWYpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3JlZnNbcmVmXSB8fCBzZWxmLl9zY2hlbWFzW3JlZl07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdlbmVyYXRlX3JlcXVpcmVkKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XG4gIHZhciAkdmFsaWQgPSAndmFsaWQnICsgJGx2bDtcbiAgdmFyICRpc0RhdGEgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWEgJiYgJHNjaGVtYS4kZGF0YSxcbiAgICAkc2NoZW1hVmFsdWU7XG4gIGlmICgkaXNEYXRhKSB7XG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYScgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLmdldERhdGEoJHNjaGVtYS4kZGF0YSwgJGRhdGFMdmwsIGl0LmRhdGFQYXRoQXJyKSkgKyAnOyAnO1xuICAgICRzY2hlbWFWYWx1ZSA9ICdzY2hlbWEnICsgJGx2bDtcbiAgfSBlbHNlIHtcbiAgICAkc2NoZW1hVmFsdWUgPSAkc2NoZW1hO1xuICB9XG4gIHZhciAkdlNjaGVtYSA9ICdzY2hlbWEnICsgJGx2bDtcbiAgaWYgKCEkaXNEYXRhKSB7XG4gICAgaWYgKCRzY2hlbWEubGVuZ3RoIDwgaXQub3B0cy5sb29wUmVxdWlyZWQgJiYgaXQuc2NoZW1hLnByb3BlcnRpZXMgJiYgT2JqZWN0LmtleXMoaXQuc2NoZW1hLnByb3BlcnRpZXMpLmxlbmd0aCkge1xuICAgICAgdmFyICRyZXF1aXJlZCA9IFtdO1xuICAgICAgdmFyIGFycjEgPSAkc2NoZW1hO1xuICAgICAgaWYgKGFycjEpIHtcbiAgICAgICAgdmFyICRwcm9wZXJ0eSwgaTEgPSAtMSxcbiAgICAgICAgICBsMSA9IGFycjEubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKGkxIDwgbDEpIHtcbiAgICAgICAgICAkcHJvcGVydHkgPSBhcnIxW2kxICs9IDFdO1xuICAgICAgICAgIHZhciAkcHJvcGVydHlTY2ggPSBpdC5zY2hlbWEucHJvcGVydGllc1skcHJvcGVydHldO1xuICAgICAgICAgIGlmICghKCRwcm9wZXJ0eVNjaCAmJiBpdC51dGlsLnNjaGVtYUhhc1J1bGVzKCRwcm9wZXJ0eVNjaCwgaXQuUlVMRVMuYWxsKSkpIHtcbiAgICAgICAgICAgICRyZXF1aXJlZFskcmVxdWlyZWQubGVuZ3RoXSA9ICRwcm9wZXJ0eTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyICRyZXF1aXJlZCA9ICRzY2hlbWE7XG4gICAgfVxuICB9XG4gIGlmICgkaXNEYXRhIHx8ICRyZXF1aXJlZC5sZW5ndGgpIHtcbiAgICB2YXIgJGN1cnJlbnRFcnJvclBhdGggPSBpdC5lcnJvclBhdGgsXG4gICAgICAkbG9vcFJlcXVpcmVkID0gJGlzRGF0YSB8fCAkcmVxdWlyZWQubGVuZ3RoID49IGl0Lm9wdHMubG9vcFJlcXVpcmVkLFxuICAgICAgJG93blByb3BlcnRpZXMgPSBpdC5vcHRzLm93blByb3BlcnRpZXM7XG4gICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgIG91dCArPSAnIHZhciBtaXNzaW5nJyArICgkbHZsKSArICc7ICc7XG4gICAgICBpZiAoJGxvb3BSZXF1aXJlZCkge1xuICAgICAgICBpZiAoISRpc0RhdGEpIHtcbiAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdlNjaGVtYSkgKyAnID0gdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnOyAnO1xuICAgICAgICB9XG4gICAgICAgIHZhciAkaSA9ICdpJyArICRsdmwsXG4gICAgICAgICAgJHByb3BlcnR5UGF0aCA9ICdzY2hlbWEnICsgJGx2bCArICdbJyArICRpICsgJ10nLFxuICAgICAgICAgICRtaXNzaW5nUHJvcGVydHkgPSAnXFwnICsgJyArICRwcm9wZXJ0eVBhdGggKyAnICsgXFwnJztcbiAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xuICAgICAgICAgIGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aEV4cHIoJGN1cnJlbnRFcnJvclBhdGgsICRwcm9wZXJ0eVBhdGgsIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdmFsaWQpICsgJyA9IHRydWU7ICc7XG4gICAgICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICAgICAgb3V0ICs9ICcgaWYgKHNjaGVtYScgKyAoJGx2bCkgKyAnID09PSB1bmRlZmluZWQpICcgKyAoJHZhbGlkKSArICcgPSB0cnVlOyBlbHNlIGlmICghQXJyYXkuaXNBcnJheShzY2hlbWEnICsgKCRsdmwpICsgJykpICcgKyAoJHZhbGlkKSArICcgPSBmYWxzZTsgZWxzZSB7JztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyBmb3IgKHZhciAnICsgKCRpKSArICcgPSAwOyAnICsgKCRpKSArICcgPCAnICsgKCR2U2NoZW1hKSArICcubGVuZ3RoOyAnICsgKCRpKSArICcrKykgeyAnICsgKCR2YWxpZCkgKyAnID0gJyArICgkZGF0YSkgKyAnWycgKyAoJHZTY2hlbWEpICsgJ1snICsgKCRpKSArICddXSAhPT0gdW5kZWZpbmVkICc7XG4gICAgICAgIGlmICgkb3duUHJvcGVydGllcykge1xuICAgICAgICAgIG91dCArPSAnICYmICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgJyArICgkdlNjaGVtYSkgKyAnWycgKyAoJGkpICsgJ10pICc7XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICc7IGlmICghJyArICgkdmFsaWQpICsgJykgYnJlYWs7IH0gJztcbiAgICAgICAgaWYgKCRpc0RhdGEpIHtcbiAgICAgICAgICBvdXQgKz0gJyAgfSAgJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyAgaWYgKCEnICsgKCR2YWxpZCkgKyAnKSB7ICAgJztcbiAgICAgICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xuICAgICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdyZXF1aXJlZCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJyB9ICc7XG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJyc7XG4gICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIG91dCArPSAnaXMgYSByZXF1aXJlZCBwcm9wZXJ0eSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvdXQgKz0gJ3Nob3VsZCBoYXZlIHJlcXVpcmVkIHByb3BlcnR5IFxcXFxcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcXFxcXCcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgb3V0ICs9ICcgfSAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xuICAgICAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChpdC5hc3luYykge1xuICAgICAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyB9IGVsc2UgeyAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcgaWYgKCAnO1xuICAgICAgICB2YXIgYXJyMiA9ICRyZXF1aXJlZDtcbiAgICAgICAgaWYgKGFycjIpIHtcbiAgICAgICAgICB2YXIgJHByb3BlcnR5S2V5LCAkaSA9IC0xLFxuICAgICAgICAgICAgbDIgPSBhcnIyLmxlbmd0aCAtIDE7XG4gICAgICAgICAgd2hpbGUgKCRpIDwgbDIpIHtcbiAgICAgICAgICAgICRwcm9wZXJ0eUtleSA9IGFycjJbJGkgKz0gMV07XG4gICAgICAgICAgICBpZiAoJGkpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgfHwgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciAkcHJvcCA9IGl0LnV0aWwuZ2V0UHJvcGVydHkoJHByb3BlcnR5S2V5KSxcbiAgICAgICAgICAgICAgJHVzZURhdGEgPSAkZGF0YSArICRwcm9wO1xuICAgICAgICAgICAgb3V0ICs9ICcgKCAoICcgKyAoJHVzZURhdGEpICsgJyA9PT0gdW5kZWZpbmVkICc7XG4gICAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgfHwgISBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoJyArICgkZGF0YSkgKyAnLCBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eUtleSkpICsgJ1xcJykgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSAnKSAmJiAobWlzc2luZycgKyAoJGx2bCkgKyAnID0gJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKGl0Lm9wdHMuanNvblBvaW50ZXJzID8gJHByb3BlcnR5S2V5IDogJHByb3ApKSArICcpICkgJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICcpIHsgICc7XG4gICAgICAgIHZhciAkcHJvcGVydHlQYXRoID0gJ21pc3NpbmcnICsgJGx2bCxcbiAgICAgICAgICAkbWlzc2luZ1Byb3BlcnR5ID0gJ1xcJyArICcgKyAkcHJvcGVydHlQYXRoICsgJyArIFxcJyc7XG4gICAgICAgIGlmIChpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkpIHtcbiAgICAgICAgICBpdC5lcnJvclBhdGggPSBpdC5vcHRzLmpzb25Qb2ludGVycyA/IGl0LnV0aWwuZ2V0UGF0aEV4cHIoJGN1cnJlbnRFcnJvclBhdGgsICRwcm9wZXJ0eVBhdGgsIHRydWUpIDogJGN1cnJlbnRFcnJvclBhdGggKyAnICsgJyArICRwcm9wZXJ0eVBhdGg7XG4gICAgICAgIH1cbiAgICAgICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xuICAgICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdyZXF1aXJlZCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJyB9ICc7XG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJyc7XG4gICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIG91dCArPSAnaXMgYSByZXF1aXJlZCBwcm9wZXJ0eSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvdXQgKz0gJ3Nob3VsZCBoYXZlIHJlcXVpcmVkIHByb3BlcnR5IFxcXFxcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcXFxcXCcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgb3V0ICs9ICcgfSAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xuICAgICAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICAgICAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChpdC5hc3luYykge1xuICAgICAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyB9IGVsc2UgeyAnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoJGxvb3BSZXF1aXJlZCkge1xuICAgICAgICBpZiAoISRpc0RhdGEpIHtcbiAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkdlNjaGVtYSkgKyAnID0gdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnOyAnO1xuICAgICAgICB9XG4gICAgICAgIHZhciAkaSA9ICdpJyArICRsdmwsXG4gICAgICAgICAgJHByb3BlcnR5UGF0aCA9ICdzY2hlbWEnICsgJGx2bCArICdbJyArICRpICsgJ10nLFxuICAgICAgICAgICRtaXNzaW5nUHJvcGVydHkgPSAnXFwnICsgJyArICRwcm9wZXJ0eVBhdGggKyAnICsgXFwnJztcbiAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xuICAgICAgICAgIGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aEV4cHIoJGN1cnJlbnRFcnJvclBhdGgsICRwcm9wZXJ0eVBhdGgsIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCR2U2NoZW1hKSArICcgJiYgIUFycmF5LmlzQXJyYXkoJyArICgkdlNjaGVtYSkgKyAnKSkgeyAgdmFyIGVyciA9ICAgJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdyZXF1aXJlZCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJyB9ICc7XG4gICAgICAgICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCcnO1xuICAgICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgb3V0ICs9ICdpcyBhIHJlcXVpcmVkIHByb3BlcnR5JztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXQgKz0gJ3Nob3VsZCBoYXZlIHJlcXVpcmVkIHByb3BlcnR5IFxcXFxcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcXFxcXCcnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG91dCArPSAnXFwnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7IH0gZWxzZSBpZiAoJyArICgkdlNjaGVtYSkgKyAnICE9PSB1bmRlZmluZWQpIHsgJztcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJyBmb3IgKHZhciAnICsgKCRpKSArICcgPSAwOyAnICsgKCRpKSArICcgPCAnICsgKCR2U2NoZW1hKSArICcubGVuZ3RoOyAnICsgKCRpKSArICcrKykgeyBpZiAoJyArICgkZGF0YSkgKyAnWycgKyAoJHZTY2hlbWEpICsgJ1snICsgKCRpKSArICddXSA9PT0gdW5kZWZpbmVkICc7XG4gICAgICAgIGlmICgkb3duUHJvcGVydGllcykge1xuICAgICAgICAgIG91dCArPSAnIHx8ICEgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgJyArICgkdlNjaGVtYSkgKyAnWycgKyAoJGkpICsgJ10pICc7XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICcpIHsgIHZhciBlcnIgPSAgICc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdyZXF1aXJlZCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJyB9ICc7XG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJyc7XG4gICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIG91dCArPSAnaXMgYSByZXF1aXJlZCBwcm9wZXJ0eSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvdXQgKz0gJ3Nob3VsZCBoYXZlIHJlcXVpcmVkIHByb3BlcnR5IFxcXFxcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcXFxcXCcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgb3V0ICs9ICcgfSAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgfSB9ICc7XG4gICAgICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICAgICAgb3V0ICs9ICcgIH0gICc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBhcnIzID0gJHJlcXVpcmVkO1xuICAgICAgICBpZiAoYXJyMykge1xuICAgICAgICAgIHZhciAkcHJvcGVydHlLZXksIGkzID0gLTEsXG4gICAgICAgICAgICBsMyA9IGFycjMubGVuZ3RoIC0gMTtcbiAgICAgICAgICB3aGlsZSAoaTMgPCBsMykge1xuICAgICAgICAgICAgJHByb3BlcnR5S2V5ID0gYXJyM1tpMyArPSAxXTtcbiAgICAgICAgICAgIHZhciAkcHJvcCA9IGl0LnV0aWwuZ2V0UHJvcGVydHkoJHByb3BlcnR5S2V5KSxcbiAgICAgICAgICAgICAgJG1pc3NpbmdQcm9wZXJ0eSA9IGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eUtleSksXG4gICAgICAgICAgICAgICR1c2VEYXRhID0gJGRhdGEgKyAkcHJvcDtcbiAgICAgICAgICAgIGlmIChpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoKCRjdXJyZW50RXJyb3JQYXRoLCAkcHJvcGVydHlLZXksIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSAnIGlmICggJyArICgkdXNlRGF0YSkgKyAnID09PSB1bmRlZmluZWQgJztcbiAgICAgICAgICAgIGlmICgkb3duUHJvcGVydGllcykge1xuICAgICAgICAgICAgICBvdXQgKz0gJyB8fCAhIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCgnICsgKCRkYXRhKSArICcsIFxcJycgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJHByb3BlcnR5S2V5KSkgKyAnXFwnKSAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0ICs9ICcpIHsgIHZhciBlcnIgPSAgICc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ3JlcXVpcmVkJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBtaXNzaW5nUHJvcGVydHk6IFxcJycgKyAoJG1pc3NpbmdQcm9wZXJ0eSkgKyAnXFwnIH0gJztcbiAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCcnO1xuICAgICAgICAgICAgICAgIGlmIChpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnaXMgYSByZXF1aXJlZCBwcm9wZXJ0eSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnc2hvdWxkIGhhdmUgcmVxdWlyZWQgcHJvcGVydHkgXFxcXFxcJycgKyAoJG1pc3NpbmdQcm9wZXJ0eSkgKyAnXFxcXFxcJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dCArPSAnXFwnICc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgICAgICAgIG91dCArPSAnICwgc2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKCRzY2hlbWFQYXRoKSArICcgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb3V0ICs9ICcgfSAnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcge30gJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSAnOyAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTsgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTsgZXJyb3JzKys7IH0gJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaXQuZXJyb3JQYXRoID0gJGN1cnJlbnRFcnJvclBhdGg7XG4gIH0gZWxzZSBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgIG91dCArPSAnIGlmICh0cnVlKSB7JztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9kZXBlbmRlbmNpZXMoaXQsICRrZXl3b3JkLCAkcnVsZVR5cGUpIHtcbiAgdmFyIG91dCA9ICcgJztcbiAgdmFyICRsdmwgPSBpdC5sZXZlbDtcbiAgdmFyICRkYXRhTHZsID0gaXQuZGF0YUxldmVsO1xuICB2YXIgJHNjaGVtYSA9IGl0LnNjaGVtYVska2V5d29yZF07XG4gIHZhciAkc2NoZW1hUGF0aCA9IGl0LnNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRrZXl3b3JkKTtcbiAgdmFyICRlcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvJyArICRrZXl3b3JkO1xuICB2YXIgJGJyZWFrT25FcnJvciA9ICFpdC5vcHRzLmFsbEVycm9ycztcbiAgdmFyICRkYXRhID0gJ2RhdGEnICsgKCRkYXRhTHZsIHx8ICcnKTtcbiAgdmFyICRlcnJzID0gJ2VycnNfXycgKyAkbHZsO1xuICB2YXIgJGl0ID0gaXQudXRpbC5jb3B5KGl0KTtcbiAgdmFyICRjbG9zaW5nQnJhY2VzID0gJyc7XG4gICRpdC5sZXZlbCsrO1xuICB2YXIgJG5leHRWYWxpZCA9ICd2YWxpZCcgKyAkaXQubGV2ZWw7XG4gIHZhciAkc2NoZW1hRGVwcyA9IHt9LFxuICAgICRwcm9wZXJ0eURlcHMgPSB7fSxcbiAgICAkb3duUHJvcGVydGllcyA9IGl0Lm9wdHMub3duUHJvcGVydGllcztcbiAgZm9yICgkcHJvcGVydHkgaW4gJHNjaGVtYSkge1xuICAgIHZhciAkc2NoID0gJHNjaGVtYVskcHJvcGVydHldO1xuICAgIHZhciAkZGVwcyA9IEFycmF5LmlzQXJyYXkoJHNjaCkgPyAkcHJvcGVydHlEZXBzIDogJHNjaGVtYURlcHM7XG4gICAgJGRlcHNbJHByb3BlcnR5XSA9ICRzY2g7XG4gIH1cbiAgb3V0ICs9ICd2YXIgJyArICgkZXJycykgKyAnID0gZXJyb3JzOyc7XG4gIHZhciAkY3VycmVudEVycm9yUGF0aCA9IGl0LmVycm9yUGF0aDtcbiAgb3V0ICs9ICd2YXIgbWlzc2luZycgKyAoJGx2bCkgKyAnOyc7XG4gIGZvciAodmFyICRwcm9wZXJ0eSBpbiAkcHJvcGVydHlEZXBzKSB7XG4gICAgJGRlcHMgPSAkcHJvcGVydHlEZXBzWyRwcm9wZXJ0eV07XG4gICAgaWYgKCRkZXBzLmxlbmd0aCkge1xuICAgICAgb3V0ICs9ICcgaWYgKCAnICsgKCRkYXRhKSArIChpdC51dGlsLmdldFByb3BlcnR5KCRwcm9wZXJ0eSkpICsgJyAhPT0gdW5kZWZpbmVkICc7XG4gICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcbiAgICAgICAgb3V0ICs9ICcgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHkpKSArICdcXCcpICc7XG4gICAgICB9XG4gICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICBvdXQgKz0gJyAmJiAoICc7XG4gICAgICAgIHZhciBhcnIxID0gJGRlcHM7XG4gICAgICAgIGlmIChhcnIxKSB7XG4gICAgICAgICAgdmFyICRwcm9wZXJ0eUtleSwgJGkgPSAtMSxcbiAgICAgICAgICAgIGwxID0gYXJyMS5sZW5ndGggLSAxO1xuICAgICAgICAgIHdoaWxlICgkaSA8IGwxKSB7XG4gICAgICAgICAgICAkcHJvcGVydHlLZXkgPSBhcnIxWyRpICs9IDFdO1xuICAgICAgICAgICAgaWYgKCRpKSB7XG4gICAgICAgICAgICAgIG91dCArPSAnIHx8ICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgJHByb3AgPSBpdC51dGlsLmdldFByb3BlcnR5KCRwcm9wZXJ0eUtleSksXG4gICAgICAgICAgICAgICR1c2VEYXRhID0gJGRhdGEgKyAkcHJvcDtcbiAgICAgICAgICAgIG91dCArPSAnICggKCAnICsgKCR1c2VEYXRhKSArICcgPT09IHVuZGVmaW5lZCAnO1xuICAgICAgICAgICAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgIG91dCArPSAnIHx8ICEgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpKSArICdcXCcpICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gJykgJiYgKG1pc3NpbmcnICsgKCRsdmwpICsgJyA9ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZyhpdC5vcHRzLmpzb25Qb2ludGVycyA/ICRwcm9wZXJ0eUtleSA6ICRwcm9wKSkgKyAnKSApICc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG91dCArPSAnKSkgeyAgJztcbiAgICAgICAgdmFyICRwcm9wZXJ0eVBhdGggPSAnbWlzc2luZycgKyAkbHZsLFxuICAgICAgICAgICRtaXNzaW5nUHJvcGVydHkgPSAnXFwnICsgJyArICRwcm9wZXJ0eVBhdGggKyAnICsgXFwnJztcbiAgICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xuICAgICAgICAgIGl0LmVycm9yUGF0aCA9IGl0Lm9wdHMuanNvblBvaW50ZXJzID8gaXQudXRpbC5nZXRQYXRoRXhwcigkY3VycmVudEVycm9yUGF0aCwgJHByb3BlcnR5UGF0aCwgdHJ1ZSkgOiAkY3VycmVudEVycm9yUGF0aCArICcgKyAnICsgJHByb3BlcnR5UGF0aDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgJCRvdXRTdGFjayA9ICQkb3V0U3RhY2sgfHwgW107XG4gICAgICAgICQkb3V0U3RhY2sucHVzaChvdXQpO1xuICAgICAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ2RlcGVuZGVuY2llcycpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgcHJvcGVydHk6IFxcJycgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJHByb3BlcnR5KSkgKyAnXFwnLCBtaXNzaW5nUHJvcGVydHk6IFxcJycgKyAoJG1pc3NpbmdQcm9wZXJ0eSkgKyAnXFwnLCBkZXBzQ291bnQ6ICcgKyAoJGRlcHMubGVuZ3RoKSArICcsIGRlcHM6IFxcJycgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJGRlcHMubGVuZ3RoID09IDEgPyAkZGVwc1swXSA6ICRkZXBzLmpvaW4oXCIsIFwiKSkpICsgJ1xcJyB9ICc7XG4gICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBoYXZlICc7XG4gICAgICAgICAgICBpZiAoJGRlcHMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICdwcm9wZXJ0eSAnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRkZXBzWzBdKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvdXQgKz0gJ3Byb3BlcnRpZXMgJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkZGVwcy5qb2luKFwiLCBcIikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSAnIHdoZW4gcHJvcGVydHkgJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHkpKSArICcgaXMgcHJlc2VudFxcJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXQub3B0cy52ZXJib3NlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9ICcge30gJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgX19lcnIgPSBvdXQ7XG4gICAgICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XG4gICAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJyApIHsgJztcbiAgICAgICAgdmFyIGFycjIgPSAkZGVwcztcbiAgICAgICAgaWYgKGFycjIpIHtcbiAgICAgICAgICB2YXIgJHByb3BlcnR5S2V5LCBpMiA9IC0xLFxuICAgICAgICAgICAgbDIgPSBhcnIyLmxlbmd0aCAtIDE7XG4gICAgICAgICAgd2hpbGUgKGkyIDwgbDIpIHtcbiAgICAgICAgICAgICRwcm9wZXJ0eUtleSA9IGFycjJbaTIgKz0gMV07XG4gICAgICAgICAgICB2YXIgJHByb3AgPSBpdC51dGlsLmdldFByb3BlcnR5KCRwcm9wZXJ0eUtleSksXG4gICAgICAgICAgICAgICRtaXNzaW5nUHJvcGVydHkgPSBpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpLFxuICAgICAgICAgICAgICAkdXNlRGF0YSA9ICRkYXRhICsgJHByb3A7XG4gICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIGl0LmVycm9yUGF0aCA9IGl0LnV0aWwuZ2V0UGF0aCgkY3VycmVudEVycm9yUGF0aCwgJHByb3BlcnR5S2V5LCBpdC5vcHRzLmpzb25Qb2ludGVycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gJyBpZiAoICcgKyAoJHVzZURhdGEpICsgJyA9PT0gdW5kZWZpbmVkICc7XG4gICAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgfHwgISBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoJyArICgkZGF0YSkgKyAnLCBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eUtleSkpICsgJ1xcJykgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSAnKSB7ICB2YXIgZXJyID0gICAnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgICAgaWYgKGl0LmNyZWF0ZUVycm9ycyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdkZXBlbmRlbmNpZXMnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IHByb3BlcnR5OiBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eSkpICsgJ1xcJywgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJywgZGVwc0NvdW50OiAnICsgKCRkZXBzLmxlbmd0aCkgKyAnLCBkZXBzOiBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRkZXBzLmxlbmd0aCA9PSAxID8gJGRlcHNbMF0gOiAkZGVwcy5qb2luKFwiLCBcIikpKSArICdcXCcgfSAnO1xuICAgICAgICAgICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBoYXZlICc7XG4gICAgICAgICAgICAgICAgaWYgKCRkZXBzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICBvdXQgKz0gJ3Byb3BlcnR5ICcgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJGRlcHNbMF0pKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgb3V0ICs9ICdwcm9wZXJ0aWVzICcgKyAoaXQudXRpbC5lc2NhcGVRdW90ZXMoJGRlcHMuam9pbihcIiwgXCIpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dCArPSAnIHdoZW4gcHJvcGVydHkgJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHkpKSArICcgaXMgcHJlc2VudFxcJyAnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG91dCArPSAnIH0gJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyB9ICc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyB9ICAgJztcbiAgICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICAgICAgb3V0ICs9ICcgZWxzZSB7ICc7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGl0LmVycm9yUGF0aCA9ICRjdXJyZW50RXJyb3JQYXRoO1xuICB2YXIgJGN1cnJlbnRCYXNlSWQgPSAkaXQuYmFzZUlkO1xuICBmb3IgKHZhciAkcHJvcGVydHkgaW4gJHNjaGVtYURlcHMpIHtcbiAgICB2YXIgJHNjaCA9ICRzY2hlbWFEZXBzWyRwcm9wZXJ0eV07XG4gICAgaWYgKGl0LnV0aWwuc2NoZW1hSGFzUnVsZXMoJHNjaCwgaXQuUlVMRVMuYWxsKSkge1xuICAgICAgb3V0ICs9ICcgJyArICgkbmV4dFZhbGlkKSArICcgPSB0cnVlOyBpZiAoICcgKyAoJGRhdGEpICsgKGl0LnV0aWwuZ2V0UHJvcGVydHkoJHByb3BlcnR5KSkgKyAnICE9PSB1bmRlZmluZWQgJztcbiAgICAgIGlmICgkb3duUHJvcGVydGllcykge1xuICAgICAgICBvdXQgKz0gJyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoJyArICgkZGF0YSkgKyAnLCBcXCcnICsgKGl0LnV0aWwuZXNjYXBlUXVvdGVzKCRwcm9wZXJ0eSkpICsgJ1xcJykgJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnKSB7ICc7XG4gICAgICAkaXQuc2NoZW1hID0gJHNjaDtcbiAgICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGggKyBpdC51dGlsLmdldFByb3BlcnR5KCRwcm9wZXJ0eSk7XG4gICAgICAkaXQuZXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoICsgJy8nICsgaXQudXRpbC5lc2NhcGVGcmFnbWVudCgkcHJvcGVydHkpO1xuICAgICAgb3V0ICs9ICcgICcgKyAoaXQudmFsaWRhdGUoJGl0KSkgKyAnICc7XG4gICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XG4gICAgICBvdXQgKz0gJyB9ICAnO1xuICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgICAgb3V0ICs9ICcgaWYgKCcgKyAoJG5leHRWYWxpZCkgKyAnKSB7ICc7XG4gICAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyAgICcgKyAoJGNsb3NpbmdCcmFjZXMpICsgJyBpZiAoJyArICgkZXJycykgKyAnID09IGVycm9ycykgeyc7XG4gIH1cbiAgb3V0ID0gaXQudXRpbC5jbGVhblVwQ29kZShvdXQpO1xuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjaGVtYU9iamVjdDtcblxuZnVuY3Rpb24gU2NoZW1hT2JqZWN0KG9iaikge1xuICB1dGlsLmNvcHkob2JqLCB0aGlzKTtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2VuZXJhdGVfX2xpbWl0KGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZXJyb3JLZXl3b3JkO1xuICB2YXIgJGRhdGEgPSAnZGF0YScgKyAoJGRhdGFMdmwgfHwgJycpO1xuICB2YXIgJGlzRGF0YSA9IGl0Lm9wdHMuJGRhdGEgJiYgJHNjaGVtYSAmJiAkc2NoZW1hLiRkYXRhLFxuICAgICRzY2hlbWFWYWx1ZTtcbiAgaWYgKCRpc0RhdGEpIHtcbiAgICBvdXQgKz0gJyB2YXIgc2NoZW1hJyArICgkbHZsKSArICcgPSAnICsgKGl0LnV0aWwuZ2V0RGF0YSgkc2NoZW1hLiRkYXRhLCAkZGF0YUx2bCwgaXQuZGF0YVBhdGhBcnIpKSArICc7ICc7XG4gICAgJHNjaGVtYVZhbHVlID0gJ3NjaGVtYScgKyAkbHZsO1xuICB9IGVsc2Uge1xuICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWE7XG4gIH1cbiAgdmFyICRpc01heCA9ICRrZXl3b3JkID09ICdtYXhpbXVtJyxcbiAgICAkZXhjbHVzaXZlS2V5d29yZCA9ICRpc01heCA/ICdleGNsdXNpdmVNYXhpbXVtJyA6ICdleGNsdXNpdmVNaW5pbXVtJyxcbiAgICAkc2NoZW1hRXhjbCA9IGl0LnNjaGVtYVskZXhjbHVzaXZlS2V5d29yZF0sXG4gICAgJGlzRGF0YUV4Y2wgPSBpdC5vcHRzLiRkYXRhICYmICRzY2hlbWFFeGNsICYmICRzY2hlbWFFeGNsLiRkYXRhLFxuICAgICRvcCA9ICRpc01heCA/ICc8JyA6ICc+JyxcbiAgICAkbm90T3AgPSAkaXNNYXggPyAnPicgOiAnPCcsXG4gICAgJGVycm9yS2V5d29yZCA9IHVuZGVmaW5lZDtcbiAgaWYgKCRpc0RhdGFFeGNsKSB7XG4gICAgdmFyICRzY2hlbWFWYWx1ZUV4Y2wgPSBpdC51dGlsLmdldERhdGEoJHNjaGVtYUV4Y2wuJGRhdGEsICRkYXRhTHZsLCBpdC5kYXRhUGF0aEFyciksXG4gICAgICAkZXhjbHVzaXZlID0gJ2V4Y2x1c2l2ZScgKyAkbHZsLFxuICAgICAgJGV4Y2xUeXBlID0gJ2V4Y2xUeXBlJyArICRsdmwsXG4gICAgICAkZXhjbElzTnVtYmVyID0gJ2V4Y2xJc051bWJlcicgKyAkbHZsLFxuICAgICAgJG9wRXhwciA9ICdvcCcgKyAkbHZsLFxuICAgICAgJG9wU3RyID0gJ1xcJyArICcgKyAkb3BFeHByICsgJyArIFxcJyc7XG4gICAgb3V0ICs9ICcgdmFyIHNjaGVtYUV4Y2wnICsgKCRsdmwpICsgJyA9ICcgKyAoJHNjaGVtYVZhbHVlRXhjbCkgKyAnOyAnO1xuICAgICRzY2hlbWFWYWx1ZUV4Y2wgPSAnc2NoZW1hRXhjbCcgKyAkbHZsO1xuICAgIG91dCArPSAnIHZhciAnICsgKCRleGNsdXNpdmUpICsgJzsgdmFyICcgKyAoJGV4Y2xUeXBlKSArICcgPSB0eXBlb2YgJyArICgkc2NoZW1hVmFsdWVFeGNsKSArICc7IGlmICgnICsgKCRleGNsVHlwZSkgKyAnICE9IFxcJ2Jvb2xlYW5cXCcgJiYgJyArICgkZXhjbFR5cGUpICsgJyAhPSBcXCd1bmRlZmluZWRcXCcgJiYgJyArICgkZXhjbFR5cGUpICsgJyAhPSBcXCdudW1iZXJcXCcpIHsgJztcbiAgICB2YXIgJGVycm9yS2V5d29yZCA9ICRleGNsdXNpdmVLZXl3b3JkO1xuICAgIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgICBvdXQgPSAnJzsgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCRlcnJvcktleXdvcmQgfHwgJ19leGNsdXNpdmVMaW1pdCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHt9ICc7XG4gICAgICBpZiAoaXQub3B0cy5tZXNzYWdlcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgLCBtZXNzYWdlOiBcXCcnICsgKCRleGNsdXNpdmVLZXl3b3JkKSArICcgc2hvdWxkIGJlIGJvb2xlYW5cXCcgJztcbiAgICAgIH1cbiAgICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcbiAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnIH0gJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcge30gJztcbiAgICB9XG4gICAgdmFyIF9fZXJyID0gb3V0O1xuICAgIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XG4gICAgaWYgKCFpdC5jb21wb3NpdGVSdWxlICYmICRicmVha09uRXJyb3IpIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICAgIG91dCArPSAnIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoWycgKyAoX19lcnIpICsgJ10pOyAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyB9IGVsc2UgaWYgKCAnO1xuICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICBvdXQgKz0gJyAoJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9IFxcJ251bWJlclxcJykgfHwgJztcbiAgICB9XG4gICAgb3V0ICs9ICcgJyArICgkZXhjbFR5cGUpICsgJyA9PSBcXCdudW1iZXJcXCcgPyAoICgnICsgKCRleGNsdXNpdmUpICsgJyA9ICcgKyAoJHNjaGVtYVZhbHVlKSArICcgPT09IHVuZGVmaW5lZCB8fCAnICsgKCRzY2hlbWFWYWx1ZUV4Y2wpICsgJyAnICsgKCRvcCkgKyAnPSAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnKSA/ICcgKyAoJGRhdGEpICsgJyAnICsgKCRub3RPcCkgKyAnPSAnICsgKCRzY2hlbWFWYWx1ZUV4Y2wpICsgJyA6ICcgKyAoJGRhdGEpICsgJyAnICsgKCRub3RPcCkgKyAnICcgKyAoJHNjaGVtYVZhbHVlKSArICcgKSA6ICggKCcgKyAoJGV4Y2x1c2l2ZSkgKyAnID0gJyArICgkc2NoZW1hVmFsdWVFeGNsKSArICcgPT09IHRydWUpID8gJyArICgkZGF0YSkgKyAnICcgKyAoJG5vdE9wKSArICc9ICcgKyAoJHNjaGVtYVZhbHVlKSArICcgOiAnICsgKCRkYXRhKSArICcgJyArICgkbm90T3ApICsgJyAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICkgfHwgJyArICgkZGF0YSkgKyAnICE9PSAnICsgKCRkYXRhKSArICcpIHsgdmFyIG9wJyArICgkbHZsKSArICcgPSAnICsgKCRleGNsdXNpdmUpICsgJyA/IFxcJycgKyAoJG9wKSArICdcXCcgOiBcXCcnICsgKCRvcCkgKyAnPVxcJzsgJztcbiAgICBpZiAoJHNjaGVtYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAkZXJyb3JLZXl3b3JkID0gJGV4Y2x1c2l2ZUtleXdvcmQ7XG4gICAgICAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAkZXhjbHVzaXZlS2V5d29yZDtcbiAgICAgICRzY2hlbWFWYWx1ZSA9ICRzY2hlbWFWYWx1ZUV4Y2w7XG4gICAgICAkaXNEYXRhID0gJGlzRGF0YUV4Y2w7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciAkZXhjbElzTnVtYmVyID0gdHlwZW9mICRzY2hlbWFFeGNsID09ICdudW1iZXInLFxuICAgICAgJG9wU3RyID0gJG9wO1xuICAgIGlmICgkZXhjbElzTnVtYmVyICYmICRpc0RhdGEpIHtcbiAgICAgIHZhciAkb3BFeHByID0gJ1xcJycgKyAkb3BTdHIgKyAnXFwnJztcbiAgICAgIG91dCArPSAnIGlmICggJztcbiAgICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICAgIG91dCArPSAnICgnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mICcgKyAoJHNjaGVtYVZhbHVlKSArICcgIT0gXFwnbnVtYmVyXFwnKSB8fCAnO1xuICAgICAgfVxuICAgICAgb3V0ICs9ICcgKCAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnID09PSB1bmRlZmluZWQgfHwgJyArICgkc2NoZW1hRXhjbCkgKyAnICcgKyAoJG9wKSArICc9ICcgKyAoJHNjaGVtYVZhbHVlKSArICcgPyAnICsgKCRkYXRhKSArICcgJyArICgkbm90T3ApICsgJz0gJyArICgkc2NoZW1hRXhjbCkgKyAnIDogJyArICgkZGF0YSkgKyAnICcgKyAoJG5vdE9wKSArICcgJyArICgkc2NoZW1hVmFsdWUpICsgJyApIHx8ICcgKyAoJGRhdGEpICsgJyAhPT0gJyArICgkZGF0YSkgKyAnKSB7ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgkZXhjbElzTnVtYmVyICYmICRzY2hlbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAkZXhjbHVzaXZlID0gdHJ1ZTtcbiAgICAgICAgJGVycm9yS2V5d29yZCA9ICRleGNsdXNpdmVLZXl3b3JkO1xuICAgICAgICAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAkZXhjbHVzaXZlS2V5d29yZDtcbiAgICAgICAgJHNjaGVtYVZhbHVlID0gJHNjaGVtYUV4Y2w7XG4gICAgICAgICRub3RPcCArPSAnPSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoJGV4Y2xJc051bWJlcikgJHNjaGVtYVZhbHVlID0gTWF0aFskaXNNYXggPyAnbWluJyA6ICdtYXgnXSgkc2NoZW1hRXhjbCwgJHNjaGVtYSk7XG4gICAgICAgIGlmICgkc2NoZW1hRXhjbCA9PT0gKCRleGNsSXNOdW1iZXIgPyAkc2NoZW1hVmFsdWUgOiB0cnVlKSkge1xuICAgICAgICAgICRleGNsdXNpdmUgPSB0cnVlO1xuICAgICAgICAgICRlcnJvcktleXdvcmQgPSAkZXhjbHVzaXZlS2V5d29yZDtcbiAgICAgICAgICAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAkZXhjbHVzaXZlS2V5d29yZDtcbiAgICAgICAgICAkbm90T3AgKz0gJz0nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRleGNsdXNpdmUgPSBmYWxzZTtcbiAgICAgICAgICAkb3BTdHIgKz0gJz0nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgJG9wRXhwciA9ICdcXCcnICsgJG9wU3RyICsgJ1xcJyc7XG4gICAgICBvdXQgKz0gJyBpZiAoICc7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJyAoJyArICgkc2NoZW1hVmFsdWUpICsgJyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiAnICsgKCRzY2hlbWFWYWx1ZSkgKyAnICE9IFxcJ251bWJlclxcJykgfHwgJztcbiAgICAgIH1cbiAgICAgIG91dCArPSAnICcgKyAoJGRhdGEpICsgJyAnICsgKCRub3RPcCkgKyAnICcgKyAoJHNjaGVtYVZhbHVlKSArICcgfHwgJyArICgkZGF0YSkgKyAnICE9PSAnICsgKCRkYXRhKSArICcpIHsgJztcbiAgICB9XG4gIH1cbiAgJGVycm9yS2V5d29yZCA9ICRlcnJvcktleXdvcmQgfHwgJGtleXdvcmQ7XG4gIHZhciAkJG91dFN0YWNrID0gJCRvdXRTdGFjayB8fCBbXTtcbiAgJCRvdXRTdGFjay5wdXNoKG91dCk7XG4gIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoaXQuY3JlYXRlRXJyb3JzICE9PSBmYWxzZSkge1xuICAgIG91dCArPSAnIHsga2V5d29yZDogXFwnJyArICgkZXJyb3JLZXl3b3JkIHx8ICdfbGltaXQnKSArICdcXCcgLCBkYXRhUGF0aDogKGRhdGFQYXRoIHx8IFxcJ1xcJykgKyAnICsgKGl0LmVycm9yUGF0aCkgKyAnICwgc2NoZW1hUGF0aDogJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRlcnJTY2hlbWFQYXRoKSkgKyAnICwgcGFyYW1zOiB7IGNvbXBhcmlzb246ICcgKyAoJG9wRXhwcikgKyAnLCBsaW1pdDogJyArICgkc2NoZW1hVmFsdWUpICsgJywgZXhjbHVzaXZlOiAnICsgKCRleGNsdXNpdmUpICsgJyB9ICc7XG4gICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJ3Nob3VsZCBiZSAnICsgKCRvcFN0cikgKyAnICc7XG4gICAgICBpZiAoJGlzRGF0YSkge1xuICAgICAgICBvdXQgKz0gJ1xcJyArICcgKyAoJHNjaGVtYVZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnJyArICgkc2NoZW1hVmFsdWUpICsgJ1xcJyc7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpdC5vcHRzLnZlcmJvc2UpIHtcbiAgICAgIG91dCArPSAnICwgc2NoZW1hOiAgJztcbiAgICAgIGlmICgkaXNEYXRhKSB7XG4gICAgICAgIG91dCArPSAndmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXQgKz0gJycgKyAoJHNjaGVtYSk7XG4gICAgICB9XG4gICAgICBvdXQgKz0gJyAgICAgICAgICwgcGFyZW50U2NoZW1hOiB2YWxpZGF0ZS5zY2hlbWEnICsgKGl0LnNjaGVtYVBhdGgpICsgJyAsIGRhdGE6ICcgKyAoJGRhdGEpICsgJyAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyB9ICc7XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcge30gJztcbiAgfVxuICB2YXIgX19lcnIgPSBvdXQ7XG4gIG91dCA9ICQkb3V0U3RhY2sucG9wKCk7XG4gIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKGl0LmFzeW5jKSB7XG4gICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICcgdmFsaWRhdGUuZXJyb3JzID0gWycgKyAoX19lcnIpICsgJ107IHJldHVybiBmYWxzZTsgJztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb3V0ICs9ICcgdmFyIGVyciA9ICcgKyAoX19lcnIpICsgJzsgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07IGVsc2UgdkVycm9ycy5wdXNoKGVycik7IGVycm9ycysrOyAnO1xuICB9XG4gIG91dCArPSAnIH0gJztcbiAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICBvdXQgKz0gJyBlbHNlIHsgJztcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZW5lcmF0ZV9wcm9wZXJ0aWVzKGl0LCAka2V5d29yZCwgJHJ1bGVUeXBlKSB7XG4gIHZhciBvdXQgPSAnICc7XG4gIHZhciAkbHZsID0gaXQubGV2ZWw7XG4gIHZhciAkZGF0YUx2bCA9IGl0LmRhdGFMZXZlbDtcbiAgdmFyICRzY2hlbWEgPSBpdC5zY2hlbWFbJGtleXdvcmRdO1xuICB2YXIgJHNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgaXQudXRpbC5nZXRQcm9wZXJ0eSgka2V5d29yZCk7XG4gIHZhciAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnLycgKyAka2V5d29yZDtcbiAgdmFyICRicmVha09uRXJyb3IgPSAhaXQub3B0cy5hbGxFcnJvcnM7XG4gIHZhciAkZGF0YSA9ICdkYXRhJyArICgkZGF0YUx2bCB8fCAnJyk7XG4gIHZhciAkZXJycyA9ICdlcnJzX18nICsgJGx2bDtcbiAgdmFyICRpdCA9IGl0LnV0aWwuY29weShpdCk7XG4gIHZhciAkY2xvc2luZ0JyYWNlcyA9ICcnO1xuICAkaXQubGV2ZWwrKztcbiAgdmFyICRuZXh0VmFsaWQgPSAndmFsaWQnICsgJGl0LmxldmVsO1xuICB2YXIgJGtleSA9ICdrZXknICsgJGx2bCxcbiAgICAkaWR4ID0gJ2lkeCcgKyAkbHZsLFxuICAgICRkYXRhTnh0ID0gJGl0LmRhdGFMZXZlbCA9IGl0LmRhdGFMZXZlbCArIDEsXG4gICAgJG5leHREYXRhID0gJ2RhdGEnICsgJGRhdGFOeHQsXG4gICAgJGRhdGFQcm9wZXJ0aWVzID0gJ2RhdGFQcm9wZXJ0aWVzJyArICRsdmw7XG4gIHZhciAkc2NoZW1hS2V5cyA9IE9iamVjdC5rZXlzKCRzY2hlbWEgfHwge30pLFxuICAgICRwUHJvcGVydGllcyA9IGl0LnNjaGVtYS5wYXR0ZXJuUHJvcGVydGllcyB8fCB7fSxcbiAgICAkcFByb3BlcnR5S2V5cyA9IE9iamVjdC5rZXlzKCRwUHJvcGVydGllcyksXG4gICAgJGFQcm9wZXJ0aWVzID0gaXQuc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzLFxuICAgICRzb21lUHJvcGVydGllcyA9ICRzY2hlbWFLZXlzLmxlbmd0aCB8fCAkcFByb3BlcnR5S2V5cy5sZW5ndGgsXG4gICAgJG5vQWRkaXRpb25hbCA9ICRhUHJvcGVydGllcyA9PT0gZmFsc2UsXG4gICAgJGFkZGl0aW9uYWxJc1NjaGVtYSA9IHR5cGVvZiAkYVByb3BlcnRpZXMgPT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMoJGFQcm9wZXJ0aWVzKS5sZW5ndGgsXG4gICAgJHJlbW92ZUFkZGl0aW9uYWwgPSBpdC5vcHRzLnJlbW92ZUFkZGl0aW9uYWwsXG4gICAgJGNoZWNrQWRkaXRpb25hbCA9ICRub0FkZGl0aW9uYWwgfHwgJGFkZGl0aW9uYWxJc1NjaGVtYSB8fCAkcmVtb3ZlQWRkaXRpb25hbCxcbiAgICAkb3duUHJvcGVydGllcyA9IGl0Lm9wdHMub3duUHJvcGVydGllcyxcbiAgICAkY3VycmVudEJhc2VJZCA9IGl0LmJhc2VJZDtcbiAgdmFyICRyZXF1aXJlZCA9IGl0LnNjaGVtYS5yZXF1aXJlZDtcbiAgaWYgKCRyZXF1aXJlZCAmJiAhKGl0Lm9wdHMuJGRhdGEgJiYgJHJlcXVpcmVkLiRkYXRhKSAmJiAkcmVxdWlyZWQubGVuZ3RoIDwgaXQub3B0cy5sb29wUmVxdWlyZWQpIHZhciAkcmVxdWlyZWRIYXNoID0gaXQudXRpbC50b0hhc2goJHJlcXVpcmVkKTtcbiAgb3V0ICs9ICd2YXIgJyArICgkZXJycykgKyAnID0gZXJyb3JzO3ZhciAnICsgKCRuZXh0VmFsaWQpICsgJyA9IHRydWU7JztcbiAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XG4gICAgb3V0ICs9ICcgdmFyICcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICcgPSB1bmRlZmluZWQ7JztcbiAgfVxuICBpZiAoJGNoZWNrQWRkaXRpb25hbCkge1xuICAgIGlmICgkb3duUHJvcGVydGllcykge1xuICAgICAgb3V0ICs9ICcgJyArICgkZGF0YVByb3BlcnRpZXMpICsgJyA9ICcgKyAoJGRhdGFQcm9wZXJ0aWVzKSArICcgfHwgT2JqZWN0LmtleXMoJyArICgkZGF0YSkgKyAnKTsgZm9yICh2YXIgJyArICgkaWR4KSArICc9MDsgJyArICgkaWR4KSArICc8JyArICgkZGF0YVByb3BlcnRpZXMpICsgJy5sZW5ndGg7ICcgKyAoJGlkeCkgKyAnKyspIHsgdmFyICcgKyAoJGtleSkgKyAnID0gJyArICgkZGF0YVByb3BlcnRpZXMpICsgJ1snICsgKCRpZHgpICsgJ107ICc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSAnIGZvciAodmFyICcgKyAoJGtleSkgKyAnIGluICcgKyAoJGRhdGEpICsgJykgeyAnO1xuICAgIH1cbiAgICBpZiAoJHNvbWVQcm9wZXJ0aWVzKSB7XG4gICAgICBvdXQgKz0gJyB2YXIgaXNBZGRpdGlvbmFsJyArICgkbHZsKSArICcgPSAhKGZhbHNlICc7XG4gICAgICBpZiAoJHNjaGVtYUtleXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICgkc2NoZW1hS2V5cy5sZW5ndGggPiA4KSB7XG4gICAgICAgICAgb3V0ICs9ICcgfHwgdmFsaWRhdGUuc2NoZW1hJyArICgkc2NoZW1hUGF0aCkgKyAnLmhhc093blByb3BlcnR5KCcgKyAoJGtleSkgKyAnKSAnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBhcnIxID0gJHNjaGVtYUtleXM7XG4gICAgICAgICAgaWYgKGFycjEpIHtcbiAgICAgICAgICAgIHZhciAkcHJvcGVydHlLZXksIGkxID0gLTEsXG4gICAgICAgICAgICAgIGwxID0gYXJyMS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgd2hpbGUgKGkxIDwgbDEpIHtcbiAgICAgICAgICAgICAgJHByb3BlcnR5S2V5ID0gYXJyMVtpMSArPSAxXTtcbiAgICAgICAgICAgICAgb3V0ICs9ICcgfHwgJyArICgka2V5KSArICcgPT0gJyArIChpdC51dGlsLnRvUXVvdGVkU3RyaW5nKCRwcm9wZXJ0eUtleSkpICsgJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCRwUHJvcGVydHlLZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIgYXJyMiA9ICRwUHJvcGVydHlLZXlzO1xuICAgICAgICBpZiAoYXJyMikge1xuICAgICAgICAgIHZhciAkcFByb3BlcnR5LCAkaSA9IC0xLFxuICAgICAgICAgICAgbDIgPSBhcnIyLmxlbmd0aCAtIDE7XG4gICAgICAgICAgd2hpbGUgKCRpIDwgbDIpIHtcbiAgICAgICAgICAgICRwUHJvcGVydHkgPSBhcnIyWyRpICs9IDFdO1xuICAgICAgICAgICAgb3V0ICs9ICcgfHwgJyArIChpdC51c2VQYXR0ZXJuKCRwUHJvcGVydHkpKSArICcudGVzdCgnICsgKCRrZXkpICsgJykgJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG91dCArPSAnICk7IGlmIChpc0FkZGl0aW9uYWwnICsgKCRsdmwpICsgJykgeyAnO1xuICAgIH1cbiAgICBpZiAoJHJlbW92ZUFkZGl0aW9uYWwgPT0gJ2FsbCcpIHtcbiAgICAgIG91dCArPSAnIGRlbGV0ZSAnICsgKCRkYXRhKSArICdbJyArICgka2V5KSArICddOyAnO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgJGN1cnJlbnRFcnJvclBhdGggPSBpdC5lcnJvclBhdGg7XG4gICAgICB2YXIgJGFkZGl0aW9uYWxQcm9wZXJ0eSA9ICdcXCcgKyAnICsgJGtleSArICcgKyBcXCcnO1xuICAgICAgaWYgKGl0Lm9wdHMuX2Vycm9yRGF0YVBhdGhQcm9wZXJ0eSkge1xuICAgICAgICBpdC5lcnJvclBhdGggPSBpdC51dGlsLmdldFBhdGhFeHByKGl0LmVycm9yUGF0aCwgJGtleSwgaXQub3B0cy5qc29uUG9pbnRlcnMpO1xuICAgICAgfVxuICAgICAgaWYgKCRub0FkZGl0aW9uYWwpIHtcbiAgICAgICAgaWYgKCRyZW1vdmVBZGRpdGlvbmFsKSB7XG4gICAgICAgICAgb3V0ICs9ICcgZGVsZXRlICcgKyAoJGRhdGEpICsgJ1snICsgKCRrZXkpICsgJ107ICc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9ICcgJyArICgkbmV4dFZhbGlkKSArICcgPSBmYWxzZTsgJztcbiAgICAgICAgICB2YXIgJGN1cnJFcnJTY2hlbWFQYXRoID0gJGVyclNjaGVtYVBhdGg7XG4gICAgICAgICAgJGVyclNjaGVtYVBhdGggPSBpdC5lcnJTY2hlbWFQYXRoICsgJy9hZGRpdGlvbmFsUHJvcGVydGllcyc7XG4gICAgICAgICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xuICAgICAgICAgICQkb3V0U3RhY2sucHVzaChvdXQpO1xuICAgICAgICAgIG91dCA9ICcnOyAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB7IGtleXdvcmQ6IFxcJycgKyAoJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJykgKyAnXFwnICwgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCBcXCdcXCcpICsgJyArIChpdC5lcnJvclBhdGgpICsgJyAsIHNjaGVtYVBhdGg6ICcgKyAoaXQudXRpbC50b1F1b3RlZFN0cmluZygkZXJyU2NoZW1hUGF0aCkpICsgJyAsIHBhcmFtczogeyBhZGRpdGlvbmFsUHJvcGVydHk6IFxcJycgKyAoJGFkZGl0aW9uYWxQcm9wZXJ0eSkgKyAnXFwnIH0gJztcbiAgICAgICAgICAgIGlmIChpdC5vcHRzLm1lc3NhZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJyc7XG4gICAgICAgICAgICAgIGlmIChpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICBvdXQgKz0gJ2lzIGFuIGludmFsaWQgYWRkaXRpb25hbCBwcm9wZXJ0eSc7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0ICs9ICdzaG91bGQgTk9UIGhhdmUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBvdXQgKz0gJ1xcJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgICAgICBvdXQgKz0gJyAsIHNjaGVtYTogZmFsc2UgLCBwYXJlbnRTY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoaXQuc2NoZW1hUGF0aCkgKyAnICwgZGF0YTogJyArICgkZGF0YSkgKyAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gJyB9ICc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBfX2VyciA9IG91dDtcbiAgICAgICAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICAgICAgICAgIGlmICghaXQuY29tcG9zaXRlUnVsZSAmJiAkYnJlYWtPbkVycm9yKSB7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICAgIGlmIChpdC5hc3luYykge1xuICAgICAgICAgICAgICBvdXQgKz0gJyB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFsnICsgKF9fZXJyKSArICddKTsgJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgJGVyclNjaGVtYVBhdGggPSAkY3VyckVyclNjaGVtYVBhdGg7XG4gICAgICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgICAgICAgIG91dCArPSAnIGJyZWFrOyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgkYWRkaXRpb25hbElzU2NoZW1hKSB7XG4gICAgICAgIGlmICgkcmVtb3ZlQWRkaXRpb25hbCA9PSAnZmFpbGluZycpIHtcbiAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkZXJycykgKyAnID0gZXJyb3JzOyAgJztcbiAgICAgICAgICB2YXIgJHdhc0NvbXBvc2l0ZSA9IGl0LmNvbXBvc2l0ZVJ1bGU7XG4gICAgICAgICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gdHJ1ZTtcbiAgICAgICAgICAkaXQuc2NoZW1hID0gJGFQcm9wZXJ0aWVzO1xuICAgICAgICAgICRpdC5zY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArICcuYWRkaXRpb25hbFByb3BlcnRpZXMnO1xuICAgICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvYWRkaXRpb25hbFByb3BlcnRpZXMnO1xuICAgICAgICAgICRpdC5lcnJvclBhdGggPSBpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkgPyBpdC5lcnJvclBhdGggOiBpdC51dGlsLmdldFBhdGhFeHByKGl0LmVycm9yUGF0aCwgJGtleSwgaXQub3B0cy5qc29uUG9pbnRlcnMpO1xuICAgICAgICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRrZXkgKyAnXSc7XG4gICAgICAgICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRrZXk7XG4gICAgICAgICAgdmFyICRjb2RlID0gaXQudmFsaWRhdGUoJGl0KTtcbiAgICAgICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XG4gICAgICAgICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcbiAgICAgICAgICAgIG91dCArPSAnICcgKyAoaXQudXRpbC52YXJSZXBsYWNlKCRjb2RlLCAkbmV4dERhdGEsICRwYXNzRGF0YSkpICsgJyAnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvdXQgKz0gJyBpZiAoIScgKyAoJG5leHRWYWxpZCkgKyAnKSB7IGVycm9ycyA9ICcgKyAoJGVycnMpICsgJzsgaWYgKHZhbGlkYXRlLmVycm9ycyAhPT0gbnVsbCkgeyBpZiAoZXJyb3JzKSB2YWxpZGF0ZS5lcnJvcnMubGVuZ3RoID0gZXJyb3JzOyBlbHNlIHZhbGlkYXRlLmVycm9ycyA9IG51bGw7IH0gZGVsZXRlICcgKyAoJGRhdGEpICsgJ1snICsgKCRrZXkpICsgJ107IH0gICc7XG4gICAgICAgICAgaXQuY29tcG9zaXRlUnVsZSA9ICRpdC5jb21wb3NpdGVSdWxlID0gJHdhc0NvbXBvc2l0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkaXQuc2NoZW1hID0gJGFQcm9wZXJ0aWVzO1xuICAgICAgICAgICRpdC5zY2hlbWFQYXRoID0gaXQuc2NoZW1hUGF0aCArICcuYWRkaXRpb25hbFByb3BlcnRpZXMnO1xuICAgICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvYWRkaXRpb25hbFByb3BlcnRpZXMnO1xuICAgICAgICAgICRpdC5lcnJvclBhdGggPSBpdC5vcHRzLl9lcnJvckRhdGFQYXRoUHJvcGVydHkgPyBpdC5lcnJvclBhdGggOiBpdC51dGlsLmdldFBhdGhFeHByKGl0LmVycm9yUGF0aCwgJGtleSwgaXQub3B0cy5qc29uUG9pbnRlcnMpO1xuICAgICAgICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRrZXkgKyAnXSc7XG4gICAgICAgICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRrZXk7XG4gICAgICAgICAgdmFyICRjb2RlID0gaXQudmFsaWRhdGUoJGl0KTtcbiAgICAgICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XG4gICAgICAgICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcbiAgICAgICAgICAgIG91dCArPSAnICcgKyAoaXQudXRpbC52YXJSZXBsYWNlKCRjb2RlLCAkbmV4dERhdGEsICRwYXNzRGF0YSkpICsgJyAnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCEnICsgKCRuZXh0VmFsaWQpICsgJykgYnJlYWs7ICc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpdC5lcnJvclBhdGggPSAkY3VycmVudEVycm9yUGF0aDtcbiAgICB9XG4gICAgaWYgKCRzb21lUHJvcGVydGllcykge1xuICAgICAgb3V0ICs9ICcgfSAnO1xuICAgIH1cbiAgICBvdXQgKz0gJyB9ICAnO1xuICAgIGlmICgkYnJlYWtPbkVycm9yKSB7XG4gICAgICBvdXQgKz0gJyBpZiAoJyArICgkbmV4dFZhbGlkKSArICcpIHsgJztcbiAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICB9XG4gIH1cbiAgdmFyICR1c2VEZWZhdWx0cyA9IGl0Lm9wdHMudXNlRGVmYXVsdHMgJiYgIWl0LmNvbXBvc2l0ZVJ1bGU7XG4gIGlmICgkc2NoZW1hS2V5cy5sZW5ndGgpIHtcbiAgICB2YXIgYXJyMyA9ICRzY2hlbWFLZXlzO1xuICAgIGlmIChhcnIzKSB7XG4gICAgICB2YXIgJHByb3BlcnR5S2V5LCBpMyA9IC0xLFxuICAgICAgICBsMyA9IGFycjMubGVuZ3RoIC0gMTtcbiAgICAgIHdoaWxlIChpMyA8IGwzKSB7XG4gICAgICAgICRwcm9wZXJ0eUtleSA9IGFycjNbaTMgKz0gMV07XG4gICAgICAgIHZhciAkc2NoID0gJHNjaGVtYVskcHJvcGVydHlLZXldO1xuICAgICAgICBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoLCBpdC5SVUxFUy5hbGwpKSB7XG4gICAgICAgICAgdmFyICRwcm9wID0gaXQudXRpbC5nZXRQcm9wZXJ0eSgkcHJvcGVydHlLZXkpLFxuICAgICAgICAgICAgJHBhc3NEYXRhID0gJGRhdGEgKyAkcHJvcCxcbiAgICAgICAgICAgICRoYXNEZWZhdWx0ID0gJHVzZURlZmF1bHRzICYmICRzY2guZGVmYXVsdCAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICRpdC5zY2hlbWEgPSAkc2NoO1xuICAgICAgICAgICRpdC5zY2hlbWFQYXRoID0gJHNjaGVtYVBhdGggKyAkcHJvcDtcbiAgICAgICAgICAkaXQuZXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoICsgJy8nICsgaXQudXRpbC5lc2NhcGVGcmFnbWVudCgkcHJvcGVydHlLZXkpO1xuICAgICAgICAgICRpdC5lcnJvclBhdGggPSBpdC51dGlsLmdldFBhdGgoaXQuZXJyb3JQYXRoLCAkcHJvcGVydHlLZXksIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcbiAgICAgICAgICAkaXQuZGF0YVBhdGhBcnJbJGRhdGFOeHRdID0gaXQudXRpbC50b1F1b3RlZFN0cmluZygkcHJvcGVydHlLZXkpO1xuICAgICAgICAgIHZhciAkY29kZSA9IGl0LnZhbGlkYXRlKCRpdCk7XG4gICAgICAgICAgJGl0LmJhc2VJZCA9ICRjdXJyZW50QmFzZUlkO1xuICAgICAgICAgIGlmIChpdC51dGlsLnZhck9jY3VyZW5jZXMoJGNvZGUsICRuZXh0RGF0YSkgPCAyKSB7XG4gICAgICAgICAgICAkY29kZSA9IGl0LnV0aWwudmFyUmVwbGFjZSgkY29kZSwgJG5leHREYXRhLCAkcGFzc0RhdGEpO1xuICAgICAgICAgICAgdmFyICR1c2VEYXRhID0gJHBhc3NEYXRhO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgJHVzZURhdGEgPSAkbmV4dERhdGE7XG4gICAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgkaGFzRGVmYXVsdCkge1xuICAgICAgICAgICAgb3V0ICs9ICcgJyArICgkY29kZSkgKyAnICc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICgkcmVxdWlyZWRIYXNoICYmICRyZXF1aXJlZEhhc2hbJHByb3BlcnR5S2V5XSkge1xuICAgICAgICAgICAgICBvdXQgKz0gJyBpZiAoICcgKyAoJHVzZURhdGEpICsgJyA9PT0gdW5kZWZpbmVkICc7XG4gICAgICAgICAgICAgIGlmICgkb3duUHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIG91dCArPSAnIHx8ICEgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpKSArICdcXCcpICc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb3V0ICs9ICcpIHsgJyArICgkbmV4dFZhbGlkKSArICcgPSBmYWxzZTsgJztcbiAgICAgICAgICAgICAgdmFyICRjdXJyZW50RXJyb3JQYXRoID0gaXQuZXJyb3JQYXRoLFxuICAgICAgICAgICAgICAgICRjdXJyRXJyU2NoZW1hUGF0aCA9ICRlcnJTY2hlbWFQYXRoLFxuICAgICAgICAgICAgICAgICRtaXNzaW5nUHJvcGVydHkgPSBpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpO1xuICAgICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgaXQuZXJyb3JQYXRoID0gaXQudXRpbC5nZXRQYXRoKCRjdXJyZW50RXJyb3JQYXRoLCAkcHJvcGVydHlLZXksIGl0Lm9wdHMuanNvblBvaW50ZXJzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkZXJyU2NoZW1hUGF0aCA9IGl0LmVyclNjaGVtYVBhdGggKyAnL3JlcXVpcmVkJztcbiAgICAgICAgICAgICAgdmFyICQkb3V0U3RhY2sgPSAkJG91dFN0YWNrIHx8IFtdO1xuICAgICAgICAgICAgICAkJG91dFN0YWNrLnB1c2gob3V0KTtcbiAgICAgICAgICAgICAgb3V0ID0gJyc7IC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgICAgICAgIGlmIChpdC5jcmVhdGVFcnJvcnMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgeyBrZXl3b3JkOiBcXCcnICsgKCdyZXF1aXJlZCcpICsgJ1xcJyAsIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgXFwnXFwnKSArICcgKyAoaXQuZXJyb3JQYXRoKSArICcgLCBzY2hlbWFQYXRoOiAnICsgKGl0LnV0aWwudG9RdW90ZWRTdHJpbmcoJGVyclNjaGVtYVBhdGgpKSArICcgLCBwYXJhbXM6IHsgbWlzc2luZ1Byb3BlcnR5OiBcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcJyB9ICc7XG4gICAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMubWVzc2FnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICBvdXQgKz0gJyAsIG1lc3NhZ2U6IFxcJyc7XG4gICAgICAgICAgICAgICAgICBpZiAoaXQub3B0cy5fZXJyb3JEYXRhUGF0aFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSAnaXMgYSByZXF1aXJlZCBwcm9wZXJ0eSc7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gJ3Nob3VsZCBoYXZlIHJlcXVpcmVkIHByb3BlcnR5IFxcXFxcXCcnICsgKCRtaXNzaW5nUHJvcGVydHkpICsgJ1xcXFxcXCcnO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgb3V0ICs9ICdcXCcgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGl0Lm9wdHMudmVyYm9zZSkge1xuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgLCBzY2hlbWE6IHZhbGlkYXRlLnNjaGVtYScgKyAoJHNjaGVtYVBhdGgpICsgJyAsIHBhcmVudFNjaGVtYTogdmFsaWRhdGUuc2NoZW1hJyArIChpdC5zY2hlbWFQYXRoKSArICcgLCBkYXRhOiAnICsgKCRkYXRhKSArICcgJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0ICs9ICcgfSAnO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dCArPSAnIHt9ICc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFyIF9fZXJyID0gb3V0O1xuICAgICAgICAgICAgICBvdXQgPSAkJG91dFN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICBpZiAoIWl0LmNvbXBvc2l0ZVJ1bGUgJiYgJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgICAgICAgIGlmIChpdC5hc3luYykge1xuICAgICAgICAgICAgICAgICAgb3V0ICs9ICcgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihbJyArIChfX2VycikgKyAnXSk7ICc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnIHZhbGlkYXRlLmVycm9ycyA9IFsnICsgKF9fZXJyKSArICddOyByZXR1cm4gZmFsc2U7ICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dCArPSAnIHZhciBlcnIgPSAnICsgKF9fZXJyKSArICc7ICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdOyBlbHNlIHZFcnJvcnMucHVzaChlcnIpOyBlcnJvcnMrKzsgJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkZXJyU2NoZW1hUGF0aCA9ICRjdXJyRXJyU2NoZW1hUGF0aDtcbiAgICAgICAgICAgICAgaXQuZXJyb3JQYXRoID0gJGN1cnJlbnRFcnJvclBhdGg7XG4gICAgICAgICAgICAgIG91dCArPSAnIH0gZWxzZSB7ICc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgICAgICAgIG91dCArPSAnIGlmICggJyArICgkdXNlRGF0YSkgKyAnID09PSB1bmRlZmluZWQgJztcbiAgICAgICAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnIHx8ICEgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpKSArICdcXCcpICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dCArPSAnKSB7ICcgKyAoJG5leHRWYWxpZCkgKyAnID0gdHJ1ZTsgfSBlbHNlIHsgJztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvdXQgKz0gJyBpZiAoJyArICgkdXNlRGF0YSkgKyAnICE9PSB1bmRlZmluZWQgJztcbiAgICAgICAgICAgICAgICBpZiAoJG93blByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICAgIG91dCArPSAnICYmICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCcgKyAoJGRhdGEpICsgJywgXFwnJyArIChpdC51dGlsLmVzY2FwZVF1b3RlcygkcHJvcGVydHlLZXkpKSArICdcXCcpICc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dCArPSAnICkgeyAnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvdXQgKz0gJyAnICsgKCRjb2RlKSArICcgfSAnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnO1xuICAgICAgICAgICRjbG9zaW5nQnJhY2VzICs9ICd9JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoJHBQcm9wZXJ0eUtleXMubGVuZ3RoKSB7XG4gICAgdmFyIGFycjQgPSAkcFByb3BlcnR5S2V5cztcbiAgICBpZiAoYXJyNCkge1xuICAgICAgdmFyICRwUHJvcGVydHksIGk0ID0gLTEsXG4gICAgICAgIGw0ID0gYXJyNC5sZW5ndGggLSAxO1xuICAgICAgd2hpbGUgKGk0IDwgbDQpIHtcbiAgICAgICAgJHBQcm9wZXJ0eSA9IGFycjRbaTQgKz0gMV07XG4gICAgICAgIHZhciAkc2NoID0gJHBQcm9wZXJ0aWVzWyRwUHJvcGVydHldO1xuICAgICAgICBpZiAoaXQudXRpbC5zY2hlbWFIYXNSdWxlcygkc2NoLCBpdC5SVUxFUy5hbGwpKSB7XG4gICAgICAgICAgJGl0LnNjaGVtYSA9ICRzY2g7XG4gICAgICAgICAgJGl0LnNjaGVtYVBhdGggPSBpdC5zY2hlbWFQYXRoICsgJy5wYXR0ZXJuUHJvcGVydGllcycgKyBpdC51dGlsLmdldFByb3BlcnR5KCRwUHJvcGVydHkpO1xuICAgICAgICAgICRpdC5lcnJTY2hlbWFQYXRoID0gaXQuZXJyU2NoZW1hUGF0aCArICcvcGF0dGVyblByb3BlcnRpZXMvJyArIGl0LnV0aWwuZXNjYXBlRnJhZ21lbnQoJHBQcm9wZXJ0eSk7XG4gICAgICAgICAgaWYgKCRvd25Qcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyAnICsgKCRkYXRhUHJvcGVydGllcykgKyAnID0gJyArICgkZGF0YVByb3BlcnRpZXMpICsgJyB8fCBPYmplY3Qua2V5cygnICsgKCRkYXRhKSArICcpOyBmb3IgKHZhciAnICsgKCRpZHgpICsgJz0wOyAnICsgKCRpZHgpICsgJzwnICsgKCRkYXRhUHJvcGVydGllcykgKyAnLmxlbmd0aDsgJyArICgkaWR4KSArICcrKykgeyB2YXIgJyArICgka2V5KSArICcgPSAnICsgKCRkYXRhUHJvcGVydGllcykgKyAnWycgKyAoJGlkeCkgKyAnXTsgJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0ICs9ICcgZm9yICh2YXIgJyArICgka2V5KSArICcgaW4gJyArICgkZGF0YSkgKyAnKSB7ICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKGl0LnVzZVBhdHRlcm4oJHBQcm9wZXJ0eSkpICsgJy50ZXN0KCcgKyAoJGtleSkgKyAnKSkgeyAnO1xuICAgICAgICAgICRpdC5lcnJvclBhdGggPSBpdC51dGlsLmdldFBhdGhFeHByKGl0LmVycm9yUGF0aCwgJGtleSwgaXQub3B0cy5qc29uUG9pbnRlcnMpO1xuICAgICAgICAgIHZhciAkcGFzc0RhdGEgPSAkZGF0YSArICdbJyArICRrZXkgKyAnXSc7XG4gICAgICAgICAgJGl0LmRhdGFQYXRoQXJyWyRkYXRhTnh0XSA9ICRrZXk7XG4gICAgICAgICAgdmFyICRjb2RlID0gaXQudmFsaWRhdGUoJGl0KTtcbiAgICAgICAgICAkaXQuYmFzZUlkID0gJGN1cnJlbnRCYXNlSWQ7XG4gICAgICAgICAgaWYgKGl0LnV0aWwudmFyT2NjdXJlbmNlcygkY29kZSwgJG5leHREYXRhKSA8IDIpIHtcbiAgICAgICAgICAgIG91dCArPSAnICcgKyAoaXQudXRpbC52YXJSZXBsYWNlKCRjb2RlLCAkbmV4dERhdGEsICRwYXNzRGF0YSkpICsgJyAnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB2YXIgJyArICgkbmV4dERhdGEpICsgJyA9ICcgKyAoJHBhc3NEYXRhKSArICc7ICcgKyAoJGNvZGUpICsgJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgICAgb3V0ICs9ICcgaWYgKCEnICsgKCRuZXh0VmFsaWQpICsgJykgYnJlYWs7ICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dCArPSAnIH0gJztcbiAgICAgICAgICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgICAgICAgICAgb3V0ICs9ICcgZWxzZSAnICsgKCRuZXh0VmFsaWQpICsgJyA9IHRydWU7ICc7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dCArPSAnIH0gICc7XG4gICAgICAgICAgaWYgKCRicmVha09uRXJyb3IpIHtcbiAgICAgICAgICAgIG91dCArPSAnIGlmICgnICsgKCRuZXh0VmFsaWQpICsgJykgeyAnO1xuICAgICAgICAgICAgJGNsb3NpbmdCcmFjZXMgKz0gJ30nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoJGJyZWFrT25FcnJvcikge1xuICAgIG91dCArPSAnICcgKyAoJGNsb3NpbmdCcmFjZXMpICsgJyBpZiAoJyArICgkZXJycykgKyAnID09IGVycm9ycykgeyc7XG4gIH1cbiAgb3V0ID0gaXQudXRpbC5jbGVhblVwQ29kZShvdXQpO1xuICByZXR1cm4gb3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcnVsZU1vZHVsZXMgPSByZXF1aXJlKCcuLi9kb3RqcycpXG4gICwgdG9IYXNoID0gcmVxdWlyZSgnLi91dGlsJykudG9IYXNoO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJ1bGVzKCkge1xuICB2YXIgUlVMRVMgPSBbXG4gICAgeyB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIHJ1bGVzOiBbIHsgJ21heGltdW0nOiBbJ2V4Y2x1c2l2ZU1heGltdW0nXSB9LFxuICAgICAgICAgICAgICAgeyAnbWluaW11bSc6IFsnZXhjbHVzaXZlTWluaW11bSddIH0sICdtdWx0aXBsZU9mJywgJ2Zvcm1hdCddIH0sXG4gICAgeyB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJ1bGVzOiBbICdtYXhMZW5ndGgnLCAnbWluTGVuZ3RoJywgJ3BhdHRlcm4nLCAnZm9ybWF0JyBdIH0sXG4gICAgeyB0eXBlOiAnYXJyYXknLFxuICAgICAgcnVsZXM6IFsgJ21heEl0ZW1zJywgJ21pbkl0ZW1zJywgJ2l0ZW1zJywgJ2NvbnRhaW5zJywgJ3VuaXF1ZUl0ZW1zJyBdIH0sXG4gICAgeyB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHJ1bGVzOiBbICdtYXhQcm9wZXJ0aWVzJywgJ21pblByb3BlcnRpZXMnLCAncmVxdWlyZWQnLCAnZGVwZW5kZW5jaWVzJywgJ3Byb3BlcnR5TmFtZXMnLFxuICAgICAgICAgICAgICAgeyAncHJvcGVydGllcyc6IFsnYWRkaXRpb25hbFByb3BlcnRpZXMnLCAncGF0dGVyblByb3BlcnRpZXMnXSB9IF0gfSxcbiAgICB7IHJ1bGVzOiBbICckcmVmJywgJ2NvbnN0JywgJ2VudW0nLCAnbm90JywgJ2FueU9mJywgJ29uZU9mJywgJ2FsbE9mJywgJ2lmJyBdIH1cbiAgXTtcblxuICB2YXIgQUxMID0gWyAndHlwZScsICckY29tbWVudCcgXTtcbiAgdmFyIEtFWVdPUkRTID0gW1xuICAgICckc2NoZW1hJywgJyRpZCcsICdpZCcsICckZGF0YScsICd0aXRsZScsXG4gICAgJ2Rlc2NyaXB0aW9uJywgJ2RlZmF1bHQnLCAnZGVmaW5pdGlvbnMnLFxuICAgICdleGFtcGxlcycsICdyZWFkT25seScsICd3cml0ZU9ubHknLFxuICAgICdjb250ZW50TWVkaWFUeXBlJywgJ2NvbnRlbnRFbmNvZGluZycsXG4gICAgJ2FkZGl0aW9uYWxJdGVtcycsICd0aGVuJywgJ2Vsc2UnXG4gIF07XG4gIHZhciBUWVBFUyA9IFsgJ251bWJlcicsICdpbnRlZ2VyJywgJ3N0cmluZycsICdhcnJheScsICdvYmplY3QnLCAnYm9vbGVhbicsICdudWxsJyBdO1xuICBSVUxFUy5hbGwgPSB0b0hhc2goQUxMKTtcbiAgUlVMRVMudHlwZXMgPSB0b0hhc2goVFlQRVMpO1xuXG4gIFJVTEVTLmZvckVhY2goZnVuY3Rpb24gKGdyb3VwKSB7XG4gICAgZ3JvdXAucnVsZXMgPSBncm91cC5ydWxlcy5tYXAoZnVuY3Rpb24gKGtleXdvcmQpIHtcbiAgICAgIHZhciBpbXBsS2V5d29yZHM7XG4gICAgICBpZiAodHlwZW9mIGtleXdvcmQgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIGtleSA9IE9iamVjdC5rZXlzKGtleXdvcmQpWzBdO1xuICAgICAgICBpbXBsS2V5d29yZHMgPSBrZXl3b3JkW2tleV07XG4gICAgICAgIGtleXdvcmQgPSBrZXk7XG4gICAgICAgIGltcGxLZXl3b3Jkcy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgQUxMLnB1c2goayk7XG4gICAgICAgICAgUlVMRVMuYWxsW2tdID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBBTEwucHVzaChrZXl3b3JkKTtcbiAgICAgIHZhciBydWxlID0gUlVMRVMuYWxsW2tleXdvcmRdID0ge1xuICAgICAgICBrZXl3b3JkOiBrZXl3b3JkLFxuICAgICAgICBjb2RlOiBydWxlTW9kdWxlc1trZXl3b3JkXSxcbiAgICAgICAgaW1wbGVtZW50czogaW1wbEtleXdvcmRzXG4gICAgICB9O1xuICAgICAgcmV0dXJuIHJ1bGU7XG4gICAgfSk7XG5cbiAgICBSVUxFUy5hbGwuJGNvbW1lbnQgPSB7XG4gICAgICBrZXl3b3JkOiAnJGNvbW1lbnQnLFxuICAgICAgY29kZTogcnVsZU1vZHVsZXMuJGNvbW1lbnRcbiAgICB9O1xuXG4gICAgaWYgKGdyb3VwLnR5cGUpIFJVTEVTLnR5cGVzW2dyb3VwLnR5cGVdID0gZ3JvdXA7XG4gIH0pO1xuXG4gIFJVTEVTLmtleXdvcmRzID0gdG9IYXNoKEFMTC5jb25jYXQoS0VZV09SRFMpKTtcbiAgUlVMRVMuY3VzdG9tID0ge307XG5cbiAgcmV0dXJuIFJVTEVTO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor/vendor.json-schema"],{

/***/ "jYNx":
/*!**************************************************!*\
  !*** ./node_modules/json-schema/lib/validate.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * JSONSchema Validator - Validates JavaScript objects using JSON Schemas
 *	(http://www.json.com/json-schema-proposal/)
 *
 * Copyright (c) 2007 Kris Zyp SitePen (www.sitepen.com)
 * Licensed under the MIT (MIT-LICENSE.txt) license.
To use the validator call the validate function with an instance object and an optional schema object.
If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating),
that schema will be used to validate and the schema parameter is not necessary (if both exist,
both validations will occur).
The validate method will return an array of validation errors. If there are no errors, then an
empty list will be returned. A validation error will have two properties:
"property" which indicates which property had the error
"message" which indicates what the error was
 */
(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return factory();
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {// setup primitive classes to be JSON Schema types
var exports = validate
exports.Integer = {type:"integer"};
var primitiveConstructors = {
	String: String,
	Boolean: Boolean,
	Number: Number,
	Object: Object,
	Array: Array,
	Date: Date
}
exports.validate = validate;
function validate(/*Any*/instance,/*Object*/schema) {
		// Summary:
		//  	To use the validator call JSONSchema.validate with an instance object and an optional schema object.
		// 		If a schema is provided, it will be used to validate. If the instance object refers to a schema (self-validating),
		// 		that schema will be used to validate and the schema parameter is not necessary (if both exist,
		// 		both validations will occur).
		// 		The validate method will return an object with two properties:
		// 			valid: A boolean indicating if the instance is valid by the schema
		// 			errors: An array of validation errors. If there are no errors, then an
		// 					empty list will be returned. A validation error will have two properties:
		// 						property: which indicates which property had the error
		// 						message: which indicates what the error was
		//
		return validate(instance, schema, {changing: false});//, coerce: false, existingOnly: false});
	};
exports.checkPropertyChange = function(/*Any*/value,/*Object*/schema, /*String*/property) {
		// Summary:
		// 		The checkPropertyChange method will check to see if an value can legally be in property with the given schema
		// 		This is slightly different than the validate method in that it will fail if the schema is readonly and it will
		// 		not check for self-validation, it is assumed that the passed in value is already internally valid.
		// 		The checkPropertyChange method will return the same object type as validate, see JSONSchema.validate for
		// 		information.
		//
		return validate(value, schema, {changing: property || "property"});
	};
var validate = exports._validate = function(/*Any*/instance,/*Object*/schema,/*Object*/options) {

	if (!options) options = {};
	var _changing = options.changing;

	function getType(schema){
		return schema.type || (primitiveConstructors[schema.name] == schema && schema.name.toLowerCase());
	}
	var errors = [];
	// validate a value against a property definition
	function checkProp(value, schema, path,i){

		var l;
		path += path ? typeof i == 'number' ? '[' + i + ']' : typeof i == 'undefined' ? '' : '.' + i : i;
		function addError(message){
			errors.push({property:path,message:message});
		}

		if((typeof schema != 'object' || schema instanceof Array) && (path || typeof schema != 'function') && !(schema && getType(schema))){
			if(typeof schema == 'function'){
				if(!(value instanceof schema)){
					addError("is not an instance of the class/constructor " + schema.name);
				}
			}else if(schema){
				addError("Invalid schema/property definition " + schema);
			}
			return null;
		}
		if(_changing && schema.readonly){
			addError("is a readonly field, it can not be changed");
		}
		if(schema['extends']){ // if it extends another schema, it must pass that schema as well
			checkProp(value,schema['extends'],path,i);
		}
		// validate a value against a type definition
		function checkType(type,value){
			if(type){
				if(typeof type == 'string' && type != 'any' &&
						(type == 'null' ? value !== null : typeof value != type) &&
						!(value instanceof Array && type == 'array') &&
						!(value instanceof Date && type == 'date') &&
						!(type == 'integer' && value%1===0)){
					return [{property:path,message:(typeof value) + " value found, but a " + type + " is required"}];
				}
				if(type instanceof Array){
					var unionErrors=[];
					for(var j = 0; j < type.length; j++){ // a union type
						if(!(unionErrors=checkType(type[j],value)).length){
							break;
						}
					}
					if(unionErrors.length){
						return unionErrors;
					}
				}else if(typeof type == 'object'){
					var priorErrors = errors;
					errors = [];
					checkProp(value,type,path);
					var theseErrors = errors;
					errors = priorErrors;
					return theseErrors;
				}
			}
			return [];
		}
		if(value === undefined){
			if(schema.required){
				addError("is missing and it is required");
			}
		}else{
			errors = errors.concat(checkType(getType(schema),value));
			if(schema.disallow && !checkType(schema.disallow,value).length){
				addError(" disallowed value was matched");
			}
			if(value !== null){
				if(value instanceof Array){
					if(schema.items){
						var itemsIsArray = schema.items instanceof Array;
						var propDef = schema.items;
						for (i = 0, l = value.length; i < l; i += 1) {
							if (itemsIsArray)
								propDef = schema.items[i];
							if (options.coerce)
								value[i] = options.coerce(value[i], propDef);
							errors.concat(checkProp(value[i],propDef,path,i));
						}
					}
					if(schema.minItems && value.length < schema.minItems){
						addError("There must be a minimum of " + schema.minItems + " in the array");
					}
					if(schema.maxItems && value.length > schema.maxItems){
						addError("There must be a maximum of " + schema.maxItems + " in the array");
					}
				}else if(schema.properties || schema.additionalProperties){
					errors.concat(checkObj(value, schema.properties, path, schema.additionalProperties));
				}
				if(schema.pattern && typeof value == 'string' && !value.match(schema.pattern)){
					addError("does not match the regex pattern " + schema.pattern);
				}
				if(schema.maxLength && typeof value == 'string' && value.length > schema.maxLength){
					addError("may only be " + schema.maxLength + " characters long");
				}
				if(schema.minLength && typeof value == 'string' && value.length < schema.minLength){
					addError("must be at least " + schema.minLength + " characters long");
				}
				if(typeof schema.minimum !== undefined && typeof value == typeof schema.minimum &&
						schema.minimum > value){
					addError("must have a minimum value of " + schema.minimum);
				}
				if(typeof schema.maximum !== undefined && typeof value == typeof schema.maximum &&
						schema.maximum < value){
					addError("must have a maximum value of " + schema.maximum);
				}
				if(schema['enum']){
					var enumer = schema['enum'];
					l = enumer.length;
					var found;
					for(var j = 0; j < l; j++){
						if(enumer[j]===value){
							found=1;
							break;
						}
					}
					if(!found){
						addError("does not have a value in the enumeration " + enumer.join(", "));
					}
				}
				if(typeof schema.maxDecimal == 'number' &&
					(value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))){
					addError("may only have " + schema.maxDecimal + " digits of decimal places");
				}
			}
		}
		return null;
	}
	// validate an object against a schema
	function checkObj(instance,objTypeDef,path,additionalProp){

		if(typeof objTypeDef =='object'){
			if(typeof instance != 'object' || instance instanceof Array){
				errors.push({property:path,message:"an object is required"});
			}
			
			for(var i in objTypeDef){ 
				if(objTypeDef.hasOwnProperty(i)){
					var value = instance[i];
					// skip _not_ specified properties
					if (value === undefined && options.existingOnly) continue;
					var propDef = objTypeDef[i];
					// set default
					if(value === undefined && propDef["default"]){
						value = instance[i] = propDef["default"];
					}
					if(options.coerce && i in instance){
						value = instance[i] = options.coerce(value, propDef);
					}
					checkProp(value,propDef,path,i);
				}
			}
		}
		for(i in instance){
			if(instance.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && objTypeDef && !objTypeDef[i] && additionalProp===false){
				if (options.filter) {
					delete instance[i];
					continue;
				} else {
					errors.push({property:path,message:(typeof value) + "The property " + i +
						" is not defined in the schema and the schema does not allow additional properties"});
				}
			}
			var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
			if(requires && !(requires in instance)){
				errors.push({property:path,message:"the presence of the property " + i + " requires that " + requires + " also be present"});
			}
			value = instance[i];
			if(additionalProp && (!(objTypeDef && typeof objTypeDef == 'object') || !(i in objTypeDef))){
				if(options.coerce){
					value = instance[i] = options.coerce(value, additionalProp);
				}
				checkProp(value,additionalProp,path,i);
			}
			if(!_changing && value && value.$schema){
				errors = errors.concat(checkProp(value,value.$schema,path,i));
			}
		}
		return errors;
	}
	if(schema){
		checkProp(instance,schema,'',_changing || '');
	}
	if(!_changing && instance && instance.$schema){
		checkProp(instance,instance.$schema,'','');
	}
	return {valid:!errors.length,errors:errors};
};
exports.mustBeValid = function(result){
	//	summary:
	//		This checks to ensure that the result is valid and will throw an appropriate error message if it is not
	// result: the result returned from checkPropertyChange or validate
	if(!result.valid){
		throw new TypeError(result.errors.map(function(error){return "for property " + error.property + ': ' + error.message;}).join(", \n"));
	}
}

return exports;
}));


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbi1zY2hlbWEvbGliL3ZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUEwQztBQUNsRDtBQUNBLFFBQVEsaUNBQU8sRUFBRSxtQ0FBRTtBQUNuQjtBQUNBLFNBQVM7QUFBQSxvR0FBQztBQUNWLEtBQUssTUFBTSxFQVFOO0FBQ0wsQ0FBQyxvQkFBb0I7QUFDckI7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsZ0JBQWdCLEVBQUUsdUNBQXVDO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyxpQ0FBaUM7QUFDbkU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsOEJBQThCO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLHNGQUFzRjtBQUNwRztBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCLE1BQU07QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsaUNBQWlDO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQiw4Q0FBOEM7QUFDL0Q7O0FBRUEsNEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsa0JBQWtCO0FBQ2xCLDBGQUEwRjtBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiw4R0FBOEc7QUFDL0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsZ0VBQWdFO0FBQ3hIO0FBQ0E7O0FBRUE7QUFDQSxDQUFDIiwiZmlsZSI6ImJ1aWxkL3ZlbmRvci92ZW5kb3IuanNvbi1zY2hlbWEuODJhNjQ0ZTg4OTJlMmU1Mjk0MGIuY2h1bmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogSlNPTlNjaGVtYSBWYWxpZGF0b3IgLSBWYWxpZGF0ZXMgSmF2YVNjcmlwdCBvYmplY3RzIHVzaW5nIEpTT04gU2NoZW1hc1xyXG4gKlx0KGh0dHA6Ly93d3cuanNvbi5jb20vanNvbi1zY2hlbWEtcHJvcG9zYWwvKVxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDcgS3JpcyBaeXAgU2l0ZVBlbiAod3d3LnNpdGVwZW4uY29tKVxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIChNSVQtTElDRU5TRS50eHQpIGxpY2Vuc2UuXHJcblRvIHVzZSB0aGUgdmFsaWRhdG9yIGNhbGwgdGhlIHZhbGlkYXRlIGZ1bmN0aW9uIHdpdGggYW4gaW5zdGFuY2Ugb2JqZWN0IGFuZCBhbiBvcHRpb25hbCBzY2hlbWEgb2JqZWN0LlxyXG5JZiBhIHNjaGVtYSBpcyBwcm92aWRlZCwgaXQgd2lsbCBiZSB1c2VkIHRvIHZhbGlkYXRlLiBJZiB0aGUgaW5zdGFuY2Ugb2JqZWN0IHJlZmVycyB0byBhIHNjaGVtYSAoc2VsZi12YWxpZGF0aW5nKSxcclxudGhhdCBzY2hlbWEgd2lsbCBiZSB1c2VkIHRvIHZhbGlkYXRlIGFuZCB0aGUgc2NoZW1hIHBhcmFtZXRlciBpcyBub3QgbmVjZXNzYXJ5IChpZiBib3RoIGV4aXN0LFxyXG5ib3RoIHZhbGlkYXRpb25zIHdpbGwgb2NjdXIpLlxyXG5UaGUgdmFsaWRhdGUgbWV0aG9kIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHZhbGlkYXRpb24gZXJyb3JzLiBJZiB0aGVyZSBhcmUgbm8gZXJyb3JzLCB0aGVuIGFuXHJcbmVtcHR5IGxpc3Qgd2lsbCBiZSByZXR1cm5lZC4gQSB2YWxpZGF0aW9uIGVycm9yIHdpbGwgaGF2ZSB0d28gcHJvcGVydGllczpcclxuXCJwcm9wZXJ0eVwiIHdoaWNoIGluZGljYXRlcyB3aGljaCBwcm9wZXJ0eSBoYWQgdGhlIGVycm9yXHJcblwibWVzc2FnZVwiIHdoaWNoIGluZGljYXRlcyB3aGF0IHRoZSBlcnJvciB3YXNcclxuICovXHJcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhY3RvcnkoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgICAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcclxuICAgICAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcclxuICAgICAgICAvLyBsaWtlIE5vZGUuXHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xyXG4gICAgICAgIHJvb3QuanNvblNjaGVtYSA9IGZhY3RvcnkoKTtcclxuICAgIH1cclxufSh0aGlzLCBmdW5jdGlvbiAoKSB7Ly8gc2V0dXAgcHJpbWl0aXZlIGNsYXNzZXMgdG8gYmUgSlNPTiBTY2hlbWEgdHlwZXNcclxudmFyIGV4cG9ydHMgPSB2YWxpZGF0ZVxyXG5leHBvcnRzLkludGVnZXIgPSB7dHlwZTpcImludGVnZXJcIn07XHJcbnZhciBwcmltaXRpdmVDb25zdHJ1Y3RvcnMgPSB7XHJcblx0U3RyaW5nOiBTdHJpbmcsXHJcblx0Qm9vbGVhbjogQm9vbGVhbixcclxuXHROdW1iZXI6IE51bWJlcixcclxuXHRPYmplY3Q6IE9iamVjdCxcclxuXHRBcnJheTogQXJyYXksXHJcblx0RGF0ZTogRGF0ZVxyXG59XHJcbmV4cG9ydHMudmFsaWRhdGUgPSB2YWxpZGF0ZTtcclxuZnVuY3Rpb24gdmFsaWRhdGUoLypBbnkqL2luc3RhbmNlLC8qT2JqZWN0Ki9zY2hlbWEpIHtcclxuXHRcdC8vIFN1bW1hcnk6XHJcblx0XHQvLyAgXHRUbyB1c2UgdGhlIHZhbGlkYXRvciBjYWxsIEpTT05TY2hlbWEudmFsaWRhdGUgd2l0aCBhbiBpbnN0YW5jZSBvYmplY3QgYW5kIGFuIG9wdGlvbmFsIHNjaGVtYSBvYmplY3QuXHJcblx0XHQvLyBcdFx0SWYgYSBzY2hlbWEgaXMgcHJvdmlkZWQsIGl0IHdpbGwgYmUgdXNlZCB0byB2YWxpZGF0ZS4gSWYgdGhlIGluc3RhbmNlIG9iamVjdCByZWZlcnMgdG8gYSBzY2hlbWEgKHNlbGYtdmFsaWRhdGluZyksXHJcblx0XHQvLyBcdFx0dGhhdCBzY2hlbWEgd2lsbCBiZSB1c2VkIHRvIHZhbGlkYXRlIGFuZCB0aGUgc2NoZW1hIHBhcmFtZXRlciBpcyBub3QgbmVjZXNzYXJ5IChpZiBib3RoIGV4aXN0LFxyXG5cdFx0Ly8gXHRcdGJvdGggdmFsaWRhdGlvbnMgd2lsbCBvY2N1cikuXHJcblx0XHQvLyBcdFx0VGhlIHZhbGlkYXRlIG1ldGhvZCB3aWxsIHJldHVybiBhbiBvYmplY3Qgd2l0aCB0d28gcHJvcGVydGllczpcclxuXHRcdC8vIFx0XHRcdHZhbGlkOiBBIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgaW5zdGFuY2UgaXMgdmFsaWQgYnkgdGhlIHNjaGVtYVxyXG5cdFx0Ly8gXHRcdFx0ZXJyb3JzOiBBbiBhcnJheSBvZiB2YWxpZGF0aW9uIGVycm9ycy4gSWYgdGhlcmUgYXJlIG5vIGVycm9ycywgdGhlbiBhblxyXG5cdFx0Ly8gXHRcdFx0XHRcdGVtcHR5IGxpc3Qgd2lsbCBiZSByZXR1cm5lZC4gQSB2YWxpZGF0aW9uIGVycm9yIHdpbGwgaGF2ZSB0d28gcHJvcGVydGllczpcclxuXHRcdC8vIFx0XHRcdFx0XHRcdHByb3BlcnR5OiB3aGljaCBpbmRpY2F0ZXMgd2hpY2ggcHJvcGVydHkgaGFkIHRoZSBlcnJvclxyXG5cdFx0Ly8gXHRcdFx0XHRcdFx0bWVzc2FnZTogd2hpY2ggaW5kaWNhdGVzIHdoYXQgdGhlIGVycm9yIHdhc1xyXG5cdFx0Ly9cclxuXHRcdHJldHVybiB2YWxpZGF0ZShpbnN0YW5jZSwgc2NoZW1hLCB7Y2hhbmdpbmc6IGZhbHNlfSk7Ly8sIGNvZXJjZTogZmFsc2UsIGV4aXN0aW5nT25seTogZmFsc2V9KTtcclxuXHR9O1xyXG5leHBvcnRzLmNoZWNrUHJvcGVydHlDaGFuZ2UgPSBmdW5jdGlvbigvKkFueSovdmFsdWUsLypPYmplY3QqL3NjaGVtYSwgLypTdHJpbmcqL3Byb3BlcnR5KSB7XHJcblx0XHQvLyBTdW1tYXJ5OlxyXG5cdFx0Ly8gXHRcdFRoZSBjaGVja1Byb3BlcnR5Q2hhbmdlIG1ldGhvZCB3aWxsIGNoZWNrIHRvIHNlZSBpZiBhbiB2YWx1ZSBjYW4gbGVnYWxseSBiZSBpbiBwcm9wZXJ0eSB3aXRoIHRoZSBnaXZlbiBzY2hlbWFcclxuXHRcdC8vIFx0XHRUaGlzIGlzIHNsaWdodGx5IGRpZmZlcmVudCB0aGFuIHRoZSB2YWxpZGF0ZSBtZXRob2QgaW4gdGhhdCBpdCB3aWxsIGZhaWwgaWYgdGhlIHNjaGVtYSBpcyByZWFkb25seSBhbmQgaXQgd2lsbFxyXG5cdFx0Ly8gXHRcdG5vdCBjaGVjayBmb3Igc2VsZi12YWxpZGF0aW9uLCBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIHBhc3NlZCBpbiB2YWx1ZSBpcyBhbHJlYWR5IGludGVybmFsbHkgdmFsaWQuXHJcblx0XHQvLyBcdFx0VGhlIGNoZWNrUHJvcGVydHlDaGFuZ2UgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBzYW1lIG9iamVjdCB0eXBlIGFzIHZhbGlkYXRlLCBzZWUgSlNPTlNjaGVtYS52YWxpZGF0ZSBmb3JcclxuXHRcdC8vIFx0XHRpbmZvcm1hdGlvbi5cclxuXHRcdC8vXHJcblx0XHRyZXR1cm4gdmFsaWRhdGUodmFsdWUsIHNjaGVtYSwge2NoYW5naW5nOiBwcm9wZXJ0eSB8fCBcInByb3BlcnR5XCJ9KTtcclxuXHR9O1xyXG52YXIgdmFsaWRhdGUgPSBleHBvcnRzLl92YWxpZGF0ZSA9IGZ1bmN0aW9uKC8qQW55Ki9pbnN0YW5jZSwvKk9iamVjdCovc2NoZW1hLC8qT2JqZWN0Ki9vcHRpb25zKSB7XHJcblxyXG5cdGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xyXG5cdHZhciBfY2hhbmdpbmcgPSBvcHRpb25zLmNoYW5naW5nO1xyXG5cclxuXHRmdW5jdGlvbiBnZXRUeXBlKHNjaGVtYSl7XHJcblx0XHRyZXR1cm4gc2NoZW1hLnR5cGUgfHwgKHByaW1pdGl2ZUNvbnN0cnVjdG9yc1tzY2hlbWEubmFtZV0gPT0gc2NoZW1hICYmIHNjaGVtYS5uYW1lLnRvTG93ZXJDYXNlKCkpO1xyXG5cdH1cclxuXHR2YXIgZXJyb3JzID0gW107XHJcblx0Ly8gdmFsaWRhdGUgYSB2YWx1ZSBhZ2FpbnN0IGEgcHJvcGVydHkgZGVmaW5pdGlvblxyXG5cdGZ1bmN0aW9uIGNoZWNrUHJvcCh2YWx1ZSwgc2NoZW1hLCBwYXRoLGkpe1xyXG5cclxuXHRcdHZhciBsO1xyXG5cdFx0cGF0aCArPSBwYXRoID8gdHlwZW9mIGkgPT0gJ251bWJlcicgPyAnWycgKyBpICsgJ10nIDogdHlwZW9mIGkgPT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICcuJyArIGkgOiBpO1xyXG5cdFx0ZnVuY3Rpb24gYWRkRXJyb3IobWVzc2FnZSl7XHJcblx0XHRcdGVycm9ycy5wdXNoKHtwcm9wZXJ0eTpwYXRoLG1lc3NhZ2U6bWVzc2FnZX0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCh0eXBlb2Ygc2NoZW1hICE9ICdvYmplY3QnIHx8IHNjaGVtYSBpbnN0YW5jZW9mIEFycmF5KSAmJiAocGF0aCB8fCB0eXBlb2Ygc2NoZW1hICE9ICdmdW5jdGlvbicpICYmICEoc2NoZW1hICYmIGdldFR5cGUoc2NoZW1hKSkpe1xyXG5cdFx0XHRpZih0eXBlb2Ygc2NoZW1hID09ICdmdW5jdGlvbicpe1xyXG5cdFx0XHRcdGlmKCEodmFsdWUgaW5zdGFuY2VvZiBzY2hlbWEpKXtcclxuXHRcdFx0XHRcdGFkZEVycm9yKFwiaXMgbm90IGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy9jb25zdHJ1Y3RvciBcIiArIHNjaGVtYS5uYW1lKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1lbHNlIGlmKHNjaGVtYSl7XHJcblx0XHRcdFx0YWRkRXJyb3IoXCJJbnZhbGlkIHNjaGVtYS9wcm9wZXJ0eSBkZWZpbml0aW9uIFwiICsgc2NoZW1hKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmKF9jaGFuZ2luZyAmJiBzY2hlbWEucmVhZG9ubHkpe1xyXG5cdFx0XHRhZGRFcnJvcihcImlzIGEgcmVhZG9ubHkgZmllbGQsIGl0IGNhbiBub3QgYmUgY2hhbmdlZFwiKTtcclxuXHRcdH1cclxuXHRcdGlmKHNjaGVtYVsnZXh0ZW5kcyddKXsgLy8gaWYgaXQgZXh0ZW5kcyBhbm90aGVyIHNjaGVtYSwgaXQgbXVzdCBwYXNzIHRoYXQgc2NoZW1hIGFzIHdlbGxcclxuXHRcdFx0Y2hlY2tQcm9wKHZhbHVlLHNjaGVtYVsnZXh0ZW5kcyddLHBhdGgsaSk7XHJcblx0XHR9XHJcblx0XHQvLyB2YWxpZGF0ZSBhIHZhbHVlIGFnYWluc3QgYSB0eXBlIGRlZmluaXRpb25cclxuXHRcdGZ1bmN0aW9uIGNoZWNrVHlwZSh0eXBlLHZhbHVlKXtcclxuXHRcdFx0aWYodHlwZSl7XHJcblx0XHRcdFx0aWYodHlwZW9mIHR5cGUgPT0gJ3N0cmluZycgJiYgdHlwZSAhPSAnYW55JyAmJlxyXG5cdFx0XHRcdFx0XHQodHlwZSA9PSAnbnVsbCcgPyB2YWx1ZSAhPT0gbnVsbCA6IHR5cGVvZiB2YWx1ZSAhPSB0eXBlKSAmJlxyXG5cdFx0XHRcdFx0XHQhKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgJiYgdHlwZSA9PSAnYXJyYXknKSAmJlxyXG5cdFx0XHRcdFx0XHQhKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSAmJiB0eXBlID09ICdkYXRlJykgJiZcclxuXHRcdFx0XHRcdFx0ISh0eXBlID09ICdpbnRlZ2VyJyAmJiB2YWx1ZSUxPT09MCkpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIFt7cHJvcGVydHk6cGF0aCxtZXNzYWdlOih0eXBlb2YgdmFsdWUpICsgXCIgdmFsdWUgZm91bmQsIGJ1dCBhIFwiICsgdHlwZSArIFwiIGlzIHJlcXVpcmVkXCJ9XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZSBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRcdHZhciB1bmlvbkVycm9ycz1bXTtcclxuXHRcdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCB0eXBlLmxlbmd0aDsgaisrKXsgLy8gYSB1bmlvbiB0eXBlXHJcblx0XHRcdFx0XHRcdGlmKCEodW5pb25FcnJvcnM9Y2hlY2tUeXBlKHR5cGVbal0sdmFsdWUpKS5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZih1bmlvbkVycm9ycy5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdW5pb25FcnJvcnM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fWVsc2UgaWYodHlwZW9mIHR5cGUgPT0gJ29iamVjdCcpe1xyXG5cdFx0XHRcdFx0dmFyIHByaW9yRXJyb3JzID0gZXJyb3JzO1xyXG5cdFx0XHRcdFx0ZXJyb3JzID0gW107XHJcblx0XHRcdFx0XHRjaGVja1Byb3AodmFsdWUsdHlwZSxwYXRoKTtcclxuXHRcdFx0XHRcdHZhciB0aGVzZUVycm9ycyA9IGVycm9ycztcclxuXHRcdFx0XHRcdGVycm9ycyA9IHByaW9yRXJyb3JzO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoZXNlRXJyb3JzO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gW107XHJcblx0XHR9XHJcblx0XHRpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKXtcclxuXHRcdFx0aWYoc2NoZW1hLnJlcXVpcmVkKXtcclxuXHRcdFx0XHRhZGRFcnJvcihcImlzIG1pc3NpbmcgYW5kIGl0IGlzIHJlcXVpcmVkXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZXJyb3JzID0gZXJyb3JzLmNvbmNhdChjaGVja1R5cGUoZ2V0VHlwZShzY2hlbWEpLHZhbHVlKSk7XHJcblx0XHRcdGlmKHNjaGVtYS5kaXNhbGxvdyAmJiAhY2hlY2tUeXBlKHNjaGVtYS5kaXNhbGxvdyx2YWx1ZSkubGVuZ3RoKXtcclxuXHRcdFx0XHRhZGRFcnJvcihcIiBkaXNhbGxvd2VkIHZhbHVlIHdhcyBtYXRjaGVkXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHZhbHVlICE9PSBudWxsKXtcclxuXHRcdFx0XHRpZih2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRcdGlmKHNjaGVtYS5pdGVtcyl7XHJcblx0XHRcdFx0XHRcdHZhciBpdGVtc0lzQXJyYXkgPSBzY2hlbWEuaXRlbXMgaW5zdGFuY2VvZiBBcnJheTtcclxuXHRcdFx0XHRcdFx0dmFyIHByb3BEZWYgPSBzY2hlbWEuaXRlbXM7XHJcblx0XHRcdFx0XHRcdGZvciAoaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyBpICs9IDEpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbXNJc0FycmF5KVxyXG5cdFx0XHRcdFx0XHRcdFx0cHJvcERlZiA9IHNjaGVtYS5pdGVtc1tpXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5jb2VyY2UpXHJcblx0XHRcdFx0XHRcdFx0XHR2YWx1ZVtpXSA9IG9wdGlvbnMuY29lcmNlKHZhbHVlW2ldLCBwcm9wRGVmKTtcclxuXHRcdFx0XHRcdFx0XHRlcnJvcnMuY29uY2F0KGNoZWNrUHJvcCh2YWx1ZVtpXSxwcm9wRGVmLHBhdGgsaSkpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihzY2hlbWEubWluSXRlbXMgJiYgdmFsdWUubGVuZ3RoIDwgc2NoZW1hLm1pbkl0ZW1zKXtcclxuXHRcdFx0XHRcdFx0YWRkRXJyb3IoXCJUaGVyZSBtdXN0IGJlIGEgbWluaW11bSBvZiBcIiArIHNjaGVtYS5taW5JdGVtcyArIFwiIGluIHRoZSBhcnJheVwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKHNjaGVtYS5tYXhJdGVtcyAmJiB2YWx1ZS5sZW5ndGggPiBzY2hlbWEubWF4SXRlbXMpe1xyXG5cdFx0XHRcdFx0XHRhZGRFcnJvcihcIlRoZXJlIG11c3QgYmUgYSBtYXhpbXVtIG9mIFwiICsgc2NoZW1hLm1heEl0ZW1zICsgXCIgaW4gdGhlIGFycmF5XCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1lbHNlIGlmKHNjaGVtYS5wcm9wZXJ0aWVzIHx8IHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcyl7XHJcblx0XHRcdFx0XHRlcnJvcnMuY29uY2F0KGNoZWNrT2JqKHZhbHVlLCBzY2hlbWEucHJvcGVydGllcywgcGF0aCwgc2NoZW1hLmFkZGl0aW9uYWxQcm9wZXJ0aWVzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHNjaGVtYS5wYXR0ZXJuICYmIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyAmJiAhdmFsdWUubWF0Y2goc2NoZW1hLnBhdHRlcm4pKXtcclxuXHRcdFx0XHRcdGFkZEVycm9yKFwiZG9lcyBub3QgbWF0Y2ggdGhlIHJlZ2V4IHBhdHRlcm4gXCIgKyBzY2hlbWEucGF0dGVybik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHNjaGVtYS5tYXhMZW5ndGggJiYgdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnICYmIHZhbHVlLmxlbmd0aCA+IHNjaGVtYS5tYXhMZW5ndGgpe1xyXG5cdFx0XHRcdFx0YWRkRXJyb3IoXCJtYXkgb25seSBiZSBcIiArIHNjaGVtYS5tYXhMZW5ndGggKyBcIiBjaGFyYWN0ZXJzIGxvbmdcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHNjaGVtYS5taW5MZW5ndGggJiYgdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnICYmIHZhbHVlLmxlbmd0aCA8IHNjaGVtYS5taW5MZW5ndGgpe1xyXG5cdFx0XHRcdFx0YWRkRXJyb3IoXCJtdXN0IGJlIGF0IGxlYXN0IFwiICsgc2NoZW1hLm1pbkxlbmd0aCArIFwiIGNoYXJhY3RlcnMgbG9uZ1wiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZW9mIHNjaGVtYS5taW5pbXVtICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHZhbHVlID09IHR5cGVvZiBzY2hlbWEubWluaW11bSAmJlxyXG5cdFx0XHRcdFx0XHRzY2hlbWEubWluaW11bSA+IHZhbHVlKXtcclxuXHRcdFx0XHRcdGFkZEVycm9yKFwibXVzdCBoYXZlIGEgbWluaW11bSB2YWx1ZSBvZiBcIiArIHNjaGVtYS5taW5pbXVtKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodHlwZW9mIHNjaGVtYS5tYXhpbXVtICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHZhbHVlID09IHR5cGVvZiBzY2hlbWEubWF4aW11bSAmJlxyXG5cdFx0XHRcdFx0XHRzY2hlbWEubWF4aW11bSA8IHZhbHVlKXtcclxuXHRcdFx0XHRcdGFkZEVycm9yKFwibXVzdCBoYXZlIGEgbWF4aW11bSB2YWx1ZSBvZiBcIiArIHNjaGVtYS5tYXhpbXVtKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoc2NoZW1hWydlbnVtJ10pe1xyXG5cdFx0XHRcdFx0dmFyIGVudW1lciA9IHNjaGVtYVsnZW51bSddO1xyXG5cdFx0XHRcdFx0bCA9IGVudW1lci5sZW5ndGg7XHJcblx0XHRcdFx0XHR2YXIgZm91bmQ7XHJcblx0XHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgbDsgaisrKXtcclxuXHRcdFx0XHRcdFx0aWYoZW51bWVyW2pdPT09dmFsdWUpe1xyXG5cdFx0XHRcdFx0XHRcdGZvdW5kPTE7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKCFmb3VuZCl7XHJcblx0XHRcdFx0XHRcdGFkZEVycm9yKFwiZG9lcyBub3QgaGF2ZSBhIHZhbHVlIGluIHRoZSBlbnVtZXJhdGlvbiBcIiArIGVudW1lci5qb2luKFwiLCBcIikpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0eXBlb2Ygc2NoZW1hLm1heERlY2ltYWwgPT0gJ251bWJlcicgJiZcclxuXHRcdFx0XHRcdCh2YWx1ZS50b1N0cmluZygpLm1hdGNoKG5ldyBSZWdFeHAoXCJcXFxcLlswLTlde1wiICsgKHNjaGVtYS5tYXhEZWNpbWFsICsgMSkgKyBcIix9XCIpKSkpe1xyXG5cdFx0XHRcdFx0YWRkRXJyb3IoXCJtYXkgb25seSBoYXZlIFwiICsgc2NoZW1hLm1heERlY2ltYWwgKyBcIiBkaWdpdHMgb2YgZGVjaW1hbCBwbGFjZXNcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9XHJcblx0Ly8gdmFsaWRhdGUgYW4gb2JqZWN0IGFnYWluc3QgYSBzY2hlbWFcclxuXHRmdW5jdGlvbiBjaGVja09iaihpbnN0YW5jZSxvYmpUeXBlRGVmLHBhdGgsYWRkaXRpb25hbFByb3Ape1xyXG5cclxuXHRcdGlmKHR5cGVvZiBvYmpUeXBlRGVmID09J29iamVjdCcpe1xyXG5cdFx0XHRpZih0eXBlb2YgaW5zdGFuY2UgIT0gJ29iamVjdCcgfHwgaW5zdGFuY2UgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0ZXJyb3JzLnB1c2goe3Byb3BlcnR5OnBhdGgsbWVzc2FnZTpcImFuIG9iamVjdCBpcyByZXF1aXJlZFwifSk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGZvcih2YXIgaSBpbiBvYmpUeXBlRGVmKXsgXHJcblx0XHRcdFx0aWYob2JqVHlwZURlZi5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBpbnN0YW5jZVtpXTtcclxuXHRcdFx0XHRcdC8vIHNraXAgX25vdF8gc3BlY2lmaWVkIHByb3BlcnRpZXNcclxuXHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuZXhpc3RpbmdPbmx5KSBjb250aW51ZTtcclxuXHRcdFx0XHRcdHZhciBwcm9wRGVmID0gb2JqVHlwZURlZltpXTtcclxuXHRcdFx0XHRcdC8vIHNldCBkZWZhdWx0XHJcblx0XHRcdFx0XHRpZih2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHByb3BEZWZbXCJkZWZhdWx0XCJdKXtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSBpbnN0YW5jZVtpXSA9IHByb3BEZWZbXCJkZWZhdWx0XCJdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jb2VyY2UgJiYgaSBpbiBpbnN0YW5jZSl7XHJcblx0XHRcdFx0XHRcdHZhbHVlID0gaW5zdGFuY2VbaV0gPSBvcHRpb25zLmNvZXJjZSh2YWx1ZSwgcHJvcERlZik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjaGVja1Byb3AodmFsdWUscHJvcERlZixwYXRoLGkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yKGkgaW4gaW5zdGFuY2Upe1xyXG5cdFx0XHRpZihpbnN0YW5jZS5oYXNPd25Qcm9wZXJ0eShpKSAmJiAhKGkuY2hhckF0KDApID09ICdfJyAmJiBpLmNoYXJBdCgxKSA9PSAnXycpICYmIG9ialR5cGVEZWYgJiYgIW9ialR5cGVEZWZbaV0gJiYgYWRkaXRpb25hbFByb3A9PT1mYWxzZSl7XHJcblx0XHRcdFx0aWYgKG9wdGlvbnMuZmlsdGVyKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgaW5zdGFuY2VbaV07XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZXJyb3JzLnB1c2goe3Byb3BlcnR5OnBhdGgsbWVzc2FnZToodHlwZW9mIHZhbHVlKSArIFwiVGhlIHByb3BlcnR5IFwiICsgaSArXHJcblx0XHRcdFx0XHRcdFwiIGlzIG5vdCBkZWZpbmVkIGluIHRoZSBzY2hlbWEgYW5kIHRoZSBzY2hlbWEgZG9lcyBub3QgYWxsb3cgYWRkaXRpb25hbCBwcm9wZXJ0aWVzXCJ9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHJlcXVpcmVzID0gb2JqVHlwZURlZiAmJiBvYmpUeXBlRGVmW2ldICYmIG9ialR5cGVEZWZbaV0ucmVxdWlyZXM7XHJcblx0XHRcdGlmKHJlcXVpcmVzICYmICEocmVxdWlyZXMgaW4gaW5zdGFuY2UpKXtcclxuXHRcdFx0XHRlcnJvcnMucHVzaCh7cHJvcGVydHk6cGF0aCxtZXNzYWdlOlwidGhlIHByZXNlbmNlIG9mIHRoZSBwcm9wZXJ0eSBcIiArIGkgKyBcIiByZXF1aXJlcyB0aGF0IFwiICsgcmVxdWlyZXMgKyBcIiBhbHNvIGJlIHByZXNlbnRcIn0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhbHVlID0gaW5zdGFuY2VbaV07XHJcblx0XHRcdGlmKGFkZGl0aW9uYWxQcm9wICYmICghKG9ialR5cGVEZWYgJiYgdHlwZW9mIG9ialR5cGVEZWYgPT0gJ29iamVjdCcpIHx8ICEoaSBpbiBvYmpUeXBlRGVmKSkpe1xyXG5cdFx0XHRcdGlmKG9wdGlvbnMuY29lcmNlKXtcclxuXHRcdFx0XHRcdHZhbHVlID0gaW5zdGFuY2VbaV0gPSBvcHRpb25zLmNvZXJjZSh2YWx1ZSwgYWRkaXRpb25hbFByb3ApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGVja1Byb3AodmFsdWUsYWRkaXRpb25hbFByb3AscGF0aCxpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighX2NoYW5naW5nICYmIHZhbHVlICYmIHZhbHVlLiRzY2hlbWEpe1xyXG5cdFx0XHRcdGVycm9ycyA9IGVycm9ycy5jb25jYXQoY2hlY2tQcm9wKHZhbHVlLHZhbHVlLiRzY2hlbWEscGF0aCxpKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBlcnJvcnM7XHJcblx0fVxyXG5cdGlmKHNjaGVtYSl7XHJcblx0XHRjaGVja1Byb3AoaW5zdGFuY2Usc2NoZW1hLCcnLF9jaGFuZ2luZyB8fCAnJyk7XHJcblx0fVxyXG5cdGlmKCFfY2hhbmdpbmcgJiYgaW5zdGFuY2UgJiYgaW5zdGFuY2UuJHNjaGVtYSl7XHJcblx0XHRjaGVja1Byb3AoaW5zdGFuY2UsaW5zdGFuY2UuJHNjaGVtYSwnJywnJyk7XHJcblx0fVxyXG5cdHJldHVybiB7dmFsaWQ6IWVycm9ycy5sZW5ndGgsZXJyb3JzOmVycm9yc307XHJcbn07XHJcbmV4cG9ydHMubXVzdEJlVmFsaWQgPSBmdW5jdGlvbihyZXN1bHQpe1xyXG5cdC8vXHRzdW1tYXJ5OlxyXG5cdC8vXHRcdFRoaXMgY2hlY2tzIHRvIGVuc3VyZSB0aGF0IHRoZSByZXN1bHQgaXMgdmFsaWQgYW5kIHdpbGwgdGhyb3cgYW4gYXBwcm9wcmlhdGUgZXJyb3IgbWVzc2FnZSBpZiBpdCBpcyBub3RcclxuXHQvLyByZXN1bHQ6IHRoZSByZXN1bHQgcmV0dXJuZWQgZnJvbSBjaGVja1Byb3BlcnR5Q2hhbmdlIG9yIHZhbGlkYXRlXHJcblx0aWYoIXJlc3VsdC52YWxpZCl7XHJcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKHJlc3VsdC5lcnJvcnMubWFwKGZ1bmN0aW9uKGVycm9yKXtyZXR1cm4gXCJmb3IgcHJvcGVydHkgXCIgKyBlcnJvci5wcm9wZXJ0eSArICc6ICcgKyBlcnJvci5tZXNzYWdlO30pLmpvaW4oXCIsIFxcblwiKSk7XHJcblx0fVxyXG59XHJcblxyXG5yZXR1cm4gZXhwb3J0cztcclxufSkpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9
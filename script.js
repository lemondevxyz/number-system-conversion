// i really do this because vim doesn't indent the first line of embedded javascript.
"use strict";
// array of number systems
var nsarr = ["binary", "octal", "decimal", "hexadecimal"];
var bases = {
	"binary": 2,
	"octal": 8,
	"decimal": 10,
	"hex": 16,
}
// map of string against array of allowed characters;
var allowed_keys = {
	"binary": ["0", "1"],
	"octal": ["0", "1", "2", "3", "4", "5", "6", "7"],
	"decimal": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
	"hexadecimal": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"],
}
// prototype to replace a character at index
String.prototype.replaceAt = function (index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
// remove extra zeros on the left
String.prototype.removeZeros = function() {
	return this.replace(/^0+/, '');
}
// toBase replaces 10, and above with letters
String.prototype.toBase = function(base) {
	var str = this;

	for(var i=0; i < _alphabet.length;i++) {
		if(i+10 == base) {
			break
		}

		var pattern = RegExp((i+10).toString(), "g");
		str = str.replace(pattern, _alphabet[i])
	}

	return str;
}
// splitN
String.prototype.splitN = function(n) {
	var chunks = [];
	for (var i = 0, charsLength = this.length; i < charsLength; i += n) {
		chunks.push(this.substring(i, i + n));
	}
	return chunks;
}
// prototype to reorder array
Array.prototype.move = function (from, to) {
	this.splice(to, 0, this.splice(from, 1)[0]);
};
// binary to whatever
function base_to_base(str, from, to) {
	var num = parseInt(str, from);
	//var str = num.toString(to);
	return num.toString(to).toUpperCase();
}
// shoutout to all my go-developers
function main() {
	// copy the array
	var prev = JSON.parse(JSON.stringify(nsarr));
	return {
		prev,
		// the value of prev
		actualSelectedPrev: nsarr[0],
		get selectedPrev() {
			return this.actualSelectedPrev
		},
		set selectedPrev(val) {
			this.actualSelectedPrev = val;
			this.num = null;
		},
		// returns the array of possible number system transitions
		next() {
			// copy array
			var arr = JSON.parse(JSON.stringify(this.prev));
			// index to remove
			var spl = 0
			for (var i = 0; i < prev.length; i++) {
				var v = prev[i];
				if (v == this.selectedPrev) {
					spl = i;
					break
				}
			}
			arr.splice(spl, 1);

			return arr
		},
		// the value of next
		selectedNext: nsarr[1],
		// bind input to num variable
		set num(val) {
			if (val == null || val.length == 0) {
				this.actualBinary = null;
				this.actualOctal = null;
				this.actualDecimal = null;
				this.actualHexadecimal = null;
				return;
			}

			val = val.removeZeros();

			this.actualBinary = val;
			this.actualOctal = binary_to_octal(val);
			this.actualDecimal = binary_to_decimal(val);
			this.actualHexadecimal = binary_to_hex(val);

		},

		// inputs
		actualBinary: "",
		set binary(val) {
			this.num = val;
		},
		get binary() {
			return this.actualBinary
		},

		actualOctal: "",
		set octal(val) {
			this.num = octal_to_binary(val);
		},
		get octal() {
			return this.actualOctal
		},

		actualDecimal: "",
		set decimal(val) {
			this.num = decimal_to_binary(val);
		},
		get decimal() {
			return this.actualDecimal
		},

		actualHexadecimal: "",
		set hexadecimal(val) {
			this.num = hex_to_binary(val);
		},
		get hexadecimal() {
			return this.actualHexadecimal
		},
		// function to check if a key is illegal or not
		validChar: function (e, name) {
			//if(e.key == )
			// array to compare key with
			var compare = allowed_keys[name];
			// doesn't exist
			if (compare === null || compare == undefined) {
				e.preventDefault();
				e.stopPropagation();
				console.log("compare does not exist")
				return
			}
			// uncomment to debug
			// console.log(compare)
			// do not add onto null
			if (this.num === null) {
				this.num = "";
			}

			var low = e.key.toLowerCase();
			var upp = e.key.toUpperCase();

			for (var i = 0; i < compare.length; i++) {
				var key = compare[i];
				// uncomment to debug
				// console.log(key);
				if (key === low || key === upp) {
					// in-case it's big letter
					return
				}
			}

			e.preventDefault();
			e.stopPropagation();
		},
		// function to calculate result
	}
}

// i really do this because vim doesn't indent the first line of embedded javascript.
"use strict";
// TODO:
// - support dots for binary
// - convert from octal to all number systems
// - convert from decimal to all number systems
// - convert from hexadecimal to all number systems
// array of number systems
var nsarr = ["bits", "binary", "octal", "decimal", "hexadecimal"];
// map of string against array of allowed characters;
var allowed_keys = {
	"bits": ["0", "1", "."],
	"binary": ["0", "1", "2", "3", "."],
	"octal": ["0", "1", "2", "3", "4", "5", "6", "7", "."],
	"decimal": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "."],
	"hexadecimal": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "."],
}
// prototype to replace a character at index
String.prototype.replaceAt = function (index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
// prototype to reorder array
Array.prototype.move = function (from, to) {
	this.splice(to, 0, this.splice(from, 1)[0]);
};
function get_octal_from_number(num) {
	if (num > 7) {
		return num + 2
	}

	return num
}
// conversion
function decimal_to_hexadecimal(str) {
	var dec = allowed_keys["decimal"];
	var hex = allowed_keys["hexadecimal"];

	for (var i = 10; i < hex.length - 1; i++) {
		str = str.replace(new RegExp(dec[i], 'g'), hex[i]);
	}

	return str
}
function hexadecimal_to_decimal(str) {
	var dec = allowed_keys["decimal"];
	var hex = allowed_keys["hexadecimal"];

	for (var i = 10; i < hex.length - 1; i++) {
		str = str.replace(new RegExp(hex[i], 'g'), dec[i]);
	}

	return str
}
// custom mod function, to treat negative numbers.
function mod(n, m) {
	return ((n % m) + m) % m;
}
// add to the right for base
function binary_repeat(code, base) {
	var str = code.toString();
	var spl = str.split(".");
	if (spl.length > 1) {
		// there is dot
		var part1 = spl[0];
		var part2 = spl[1];

		var part1 = '0'.repeat(mod(part1.length * -1, base)) + part1;
		var part2 = '0'.repeat(mod(part2.length * -1, base)) + part2;

		var str = part1 + '.' + part2;
		return str
	}
	// bad input
	return '0'.repeat(mod(str.length * -1, base)) + str;
}
// binary to whatever
// just supply the code
function binary_to_whatever(code, base) {

	var str = binary_repeat(code, base);
	var ret = '';

	for (var i = 0; i < str.length; i += base) {
		var val = 0;
		var y = base - 1

		if (str[i] === ".") {
			i++
			i -= base
			ret += ".";
			continue
		}

		for (var j = 0; j < base; j++) {
			if (str[i + j] === '1') {
				val += Math.pow(2, y)
			}
			y--;
		}
		ret += val.toString();
	}

	// remove all 0 at the start of string
	// https://stackoverflow.com/questions/4564414/delete-first-character-of-a-string-in-javascript
	while (ret.charAt(0) === '0') {
		ret = ret.substring(1)
	}

	return ret
}

// num is int
function get_binary_from_number(num, base) {
	if (num > Math.pow(2, base + 1)) {
		return Number.NaN;
	}

	var numbers = [];
	for (var i = 0; i < base; i++) {
		numbers.push(Math.pow(2, i));
	}

	// loop over the numbers we have
	var exists = {};
	loop:
	for (var i = 0; i < numbers.length; i++) {

		var v = numbers[i];
		var val = v;

		exists[v] = true;

		if (val === num) {
			break loop
		}

		var newarr = JSON.parse(JSON.stringify(numbers));
		// 1 2 4 8 becomes:
		// 2 4 8 1
		newarr.push(newarr.shift());
		// do stuff idk
		for (var j = 0; j < numbers.length - 1; j++) {
			// 2 4 8 1 becomes:
			// 4 8 1
			for (var k = 0; k < newarr.length; k++) {
				var nv = newarr[k];
				if (nv === v || exists[nv] !== undefined) {
					continue
				}

				val += nv
				exists[nv] = true
				if (val > num) {
					exists = {}
					exists[v] = true
					val = v
					break
				} else if (val == num) {
					break loop
				}
			}
			newarr.shift();
		}

		exists = {};
	}

	var str = '0'.repeat(base);
	for (var i = 0; i < numbers.length; i++) {
		var v = numbers[i]
		var b = exists[v];
		if (b === true) {
			var oppo = (numbers.length - 1) - i;
			// 0 becomes 3
			// 3 becomes 0
			str = str.replaceAt(oppo, "1");
		}
	}

	return str
}
// turns octal, decimal, hexadecimal into binary
function whatever_to_binary(code, base) {

	if (code === null) { return "" }
	var str = code.toString();

	var dec = allowed_keys["decimal"];
	var hex = allowed_keys["hexadecimal"];
	var oct = allowed_keys["octal"];

	// turn decimal into hexadecimal
	if (base == 4) {
		str = decimal_to_hexadecimal(str)
	}

	var newstr = "";
	for (var i = 0; i < str.length; i++) {
		var v = hexadecimal_to_decimal(str[i]);
		if (str[i] == ".") {
			newstr += ".";
		} else {
			newstr += get_binary_from_number(parseInt(v), base);
		}
	}

	return newstr

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
			if (val === null || val === "") {
				this.actualBits = null;
				this.actualBinary = null;
				this.actualOctal = null;
				this.actualDecimal = null;
				this.actualHexadecimal = null;
				return
			}

			var binary = binary_to_whatever(val, 2);
			var octal = binary_to_whatever(val, 3);
			var decimal = binary_to_whatever(val, 4);
			var hexadecimal = decimal_to_hexadecimal(decimal);

			this.actualNum = val;
			if (this.binary !== binary) {
				this.actualBinary = binary;
			}
			if (this.octal !== octal) {
				this.actualOctal = octal;
			}
			if (this.decimal !== decimal) {
				this.actualDecimal = decimal;
			}
			if (this.hexadecimal !== hexadecimal) {
				this.actualHexadecimal = hexadecimal;
			}
			if (this.bits !== val) {
				this.actualBits = val;
			}
		},
		// inputs
		// inputs
		actualBits: "",
		set bits(val) {
			this.actualBits = val;
			this.num = val;
		},
		get bits() {
			return this.actualBits
		},

		actualBinary: "",
		set binary(val) {
			this.actualBinary = val;
			this.num = whatever_to_binary(val, 2);
		},
		get binary() {
			return this.actualBinary
		},

		actualOctal: "",
		set octal(val) {
			this.actualOctal = val
			this.num = whatever_to_binary(val, 3);
		},
		get octal() {
			return this.actualOctal
		},

		actualDecimal: "",
		set decimal(val) {
			this.actualDecimal = val
			this.num = whatever_to_binary(val, 4);
		},
		get decimal() {
			return this.actualDecimal
		},

		actualHexadecimal: "",
		set hexadecimal(val) {
			val = val.toUpperCase()
			this.actualHexadecimal = val;
			this.num = whatever_to_binary(val, 4);
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


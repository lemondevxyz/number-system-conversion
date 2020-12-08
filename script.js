// i really do this because vim doesn't indent the first line of embedded javascript.
"use strict";
// TODO:
// - support dots for binary
// - convert from octal to all number systems
// - convert from decimal to all number systems
// - convert from hexadecimal to all number systems
// array of number systems
var nsarr = ["bits", "binary", "octal", "decimal", "hexadecimal"];
var bases = {
	"bits": 2,
	"binary": 4,
	"octal": 8,
	"decimal": 10,
	"hexadecimal": 16,
}
// map of string against array of allowed characters;
var allowed_keys = {
	"bits": ["0", "1", "."],
	"binary": ["0", "1", "2", "3", "."],
	"octal": ["0", "1", "2", "3", "4", "5", "6", "7", "."],
	"decimal": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."],
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
			var x = val.num;
			var name = val.name;

			if(isNaN(x) && name !== "hexadecimal") {
				this.actualBits = null;
				this.actualBinary = null;
				this.actualOctal = null;
				this.actualDecimal = null;
				this.actualHexadecimal = null;
				return;
			}

			if(name !== "bits") {
				this.actualBits = base_to_base(x, bases[name], bases["bits"]);
			}

			if(name !== "binary") {
				this.actualBinary = base_to_base(x, bases[name], bases["binary"])
			}

			if(name !== "octal") {
				this.actualOctal = base_to_base(x, bases[name], bases["octal"])
			}

			if(name !== "decimal") {
				this.actualDecimal = base_to_base(x, bases[name], bases["decimal"])
			}

			if(name !== "hexadecimal") {
				this.actualHexadecimal = base_to_base(x, bases[name], bases["hexadecimal"])
			}

		},
		// inputs
		// inputs
		actualBits: "",
		set bits(val) {
			this.actualBits = val;
			this.num = {
				num: val,
				name: "binary",
			};
		},
		get bits() {
			return this.actualBits
		},

		actualBinary: "",
		set binary(val) {
			this.actualBinary = val;
			this.num = {
				num: val,
				name: "binary",
			};
		},
		get binary() {
			return this.actualBinary
		},

		actualOctal: "",
		set octal(val) {
			this.actualOctal = val
			this.num = {
				num: val,
				name: "octal",
			};
		},
		get octal() {
			return this.actualOctal
		},

		actualDecimal: "",
		set decimal(val) {
			this.actualDecimal = val
			this.num = {
				num: val,
				name: "decimal",
			};
		},
		get decimal() {
			return this.actualDecimal
		},

		actualHexadecimal: "",
		set hexadecimal(val) {
			this.actualHexadecimal = val;
			this.num = {
				num: val,
				name: "hexadecimal",
			};
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


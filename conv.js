"use strict";
//
function binary_repeat(code, base) {
	base = Math.log2(base);

	var str = code.toString();
	var spl = str.split(".");
	if (spl.length > 1) {
		// there is dot
		var part1 = spl[0];
		var part2 = spl[1];

		var rep1 = part1.length%base;
		var rep2 = part2.length%base;
		if(rep1 > 0) {
			rep1 = base - rep1;
		}
		if(rep2 > 0) {
			rep2 = base - rep2;
		}

		var part1 = '0'.repeat(rep1) + part1;
		var part2 = '0'.repeat(rep2) + part2;

		var str = part1 + '.' + part2;
		return str
	}
	// bad input
	var rep = str.length%base;
	if(rep > 0) {
		rep = base - rep; 
	}

	return '0'.repeat(rep) + str;
}

function sum_binary(one, two) {
	var res = one;

	for(var i=0; i < one.length; i++) {
		var h = one[i]
		var w = two[i];
		if(h == "1" || w == "1") {
			res = res.replaceAt(i, "1");
		}
	}

	return res
}

function calculate_patterns(base) {
	base = Math.log2(base);

	// 1 / 0.5 = 2
	// 2 / 1 = 2
	// 4 / 2 = 2
	// etc etc....
	var div = 0.5;

	var str = "0".repeat(base);
	// no-need to repeat string everytime we find a 2^i 
	var tem = str;
	var pos = base;
	var j = 0;

	// record of all numbers to binary
	var cs = {};

	for(var i=1; i < Math.pow(base, 2); i++) {
		if((i / div) == 2) {
			div = i;
			pos--;

			tem = str;
			tem = tem.replaceAt(pos, "1");

			cs[i] = tem;

			j = 0;
		} else {
			j++;
			cs[i] = sum_binary(tem, cs[j]);
		}
	}

	return cs
}

const _alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// bases of 2^x
function base_to_binary(val, patterns) {
	var str = "";

	for(var i=0; i < val.length; i++) {
		var v = val[i];
		var num = v;
		// letter
		if(v < '1' || v > '9') {	
			num = 0;
			for(; num < _alphabet.length;num++) {
				if(v == _alphabet[num]) {
					break
				}
			}

			num += 10;
		}

		str += patterns[num];
	}

	return str
}

function binary_to_base(base, str, patterns) {
	str = binary_repeat(str, base);
	base = Math.log2(base);

	var slice = str.splitN(base)

	str = "";
	for(var i=0; i < slice.length;i++) {
		var want = slice[i];
		for(var x in patterns) {
			var have = patterns[x];
			if(want === have) {
				str += x;
				break
			}
		}
	}

	return str
}

// cache
var _hexes = calculate_patterns(bases["hex"]);
function hex_to_binary(val) {
	return base_to_binary(val, _hexes);
}
function binary_to_hex(val) {
	val = binary_to_base(bases["hex"], val, _hexes);
	return val.toBase(bases["hex"]);
}
// cache
var _octals = calculate_patterns(bases["octal"]);
function octal_to_binary(val) {
	return base_to_binary(val, _octals);
}
function binary_to_octal(val) {
	return binary_to_base(bases["octal"], val, _octals);
}
// decimals
function decimal_to_binary(val) {
	return parseInt(val).toString(bases["binary"])
}

function binary_to_decimal(val) {
	return parseInt(val, bases["binary"]).toString(bases["decimal"]);
}

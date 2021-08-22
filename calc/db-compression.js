var compressedDB, decompressedDB
var userDBdefault = []
var offlineMode = true

var dbReq = new XMLHttpRequest()
dbReq.open("GET", "./calc/default.db", true)
dbReq.responseType = "arraybuffer"

dbReq.onload = function (oEvent) {
	console.log("default.db")
	var byteArray = new Uint8Array(dbReq.response);
	LZMAdecompressDB(byteArray)
}
setTimeout(function() {dbReq.send(null)}, 1000) // load default database

function LZMAcompressDB(strDB) {
	var start_time,
	data_to_compress = prepare_data(strDB);
	start_time = (new Date).getTime();
	
	// compression level 1-9
	LZMA.compress(data_to_compress, 1, function (result) {
		console.log("Done! "+ format_time((new Date).getTime() - start_time));
		
		if (result === false) {
			console.log("An error occurred during compression.");
			return;
		}
		
		compressedDB = convert_to_formated_hex(result);
	}, function progress(percent) {
		console.log("Compressing..." + Math.round(percent * 100) + "%");
	});
}

function LZMAdecompressDB(strDB) {
	// var byte_arr = convert_formated_hex_to_bytes(strDB),
	var byte_arr = strDB,
		decompressed,
		start_time;
	
	if (byte_arr === false) {
		console.log("Invalid compressed input.");
		return false;
	}
	
	start_time = (new Date).getTime();
	
	LZMA.decompress(byte_arr, function (result) {
		console.log("Done! " + format_time((new Date).getTime() - start_time));
		
		if (result === false) {
			alert("An error occurred during decompression.");
			return;
		}
		
		if (is_array(result)) {
			decompressedDB = JSON.stringify(result);
		} else {
			decompressedDB = result;
		}

		userDBdefault = decompressedDB.split('\n') // string to array (default database)
		offlineMode = false

	}, function progress(percent) {
		///NOTE: If "percent" is -1, that means that it is not possible to calculate the percent, so you'll just have to wait.
		///	  Also, the progress function will not be fired again.
		console.log("Decompressing..." + (percent === -1 ? "" : Math.round(percent * 100) + "%"));
	});
}

function format_time(time) {
	if (time > 1000) {
		return (time / 1000) + " sec";
	}
	return time + " ms";
}

function is_array(input) {
	return input && typeof input === "object" && (input instanceof Array || (input.buffer && input.buffer instanceof ArrayBuffer));
}

function prepare_data(str)
{
	var arr;
	// if the string is a JSON array, use that (allows to compress a byte array)
	if (str[0] === "[" && str.slice(-1) === "]") {
		try {
			arr = JSON.parse(str);
		} catch (e) {}
	}
	if (arr) {
		return arr;
	}
	return str;
}

function convert_formated_hex_to_bytes(hex_str) {
	var count = 0,
		hex_arr,
		hex_data = [],
		hex_len,
		i;
	
	if (hex_str.trim() === "") {
		return [];
	}
	
	// check for invalid hex characters
	if (/[^0-9a-fA-F\s]/.test(hex_str)) {
		return false;
	}
	
	hex_arr = hex_str.split(/([0-9a-fA-F]+)/g);
	hex_len = hex_arr.length;
	
	for (i = 0; i < hex_len; ++i) {
		if (hex_arr[i].trim() === "") {
			continue;
		}
		hex_data[count++] = parseInt(hex_arr[i], 16);
	}
	
	return hex_data;
}

function convert_to_formated_hex(byte_arr) {
	var hex_str = "",
		i,
		len,
		tmp_hex;
	
	if (!is_array(byte_arr)) {
		return false;
	}
	
	len = byte_arr.length;
	
	for (i = 0; i < len; ++i) {
		if (byte_arr[i] < 0) {
			byte_arr[i] = byte_arr[i] + 256;
		}
		tmp_hex = byte_arr[i].toString(16);
		
		// Add leading zero
		if (tmp_hex.length === 1) {
			tmp_hex = "0" + tmp_hex;
		}
		
		if ((i + 1) % 16 === 0) {
			tmp_hex += "\n";
		} else {
			tmp_hex += " ";
		}
		
		hex_str += tmp_hex;
	}
	
	return hex_str.trim();
}
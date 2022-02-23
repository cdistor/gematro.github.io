var pArr = [] // used to match numerical values
var mArr = [] // phrases returned by the match function
var gemArr = [] // phrase values for enabled ciphers
var gemArrCiph = [] // enabled ciphers indices
var numericalMode // boolean flag, match numbers instead of phrase gematria

var userDB = [] // imported database
var userDBlive = [] // imported live database (phrases only)
var queryResult = [] // matching phrases
var precalcDBLoaded = false // if precalculated database is loaded, disable cipher rearrangement

$(document).ready(function(){
	// Scroll inside table
	$("body").on("wheel", "#QueryTable", function (event) {
		st = $("#QueryTable").data("startpos")
		n = $("#QueryTable").data("dispitems")

		if (event.originalEvent.deltaY < 0) { // down -100, up 100
			if (st-dbScrollItems >= 0) {
				$("#queryArea").html() // clear previous table
				updateDatabaseQueryTable(st-dbScrollItems, n) // redraw table at new position
			}
		} else { // scroll up
			if (st+dbPageItems < queryResult.length) {
				$("#queryArea").html() // clear previous table
				updateDatabaseQueryTable(st+dbScrollItems, n) // redraw table at new position
			}
		}
	});

	// Up and Down arrow keys, List table
	$("body").on("keydown", "#queryPosInput", function (e) {
		// step="'+dbPageItems+'" min="0" max="'+queryResult.length+'"
		if (e.which == 38) queryShowPrevPage() // Up
		if (e.which == 40) queryShowNextPage() // Down
	});

	// Enter query starting position
	$("body").on("change", "#queryPosInput", function () {
		st = Number( $(this).val().replace(/[^\d]/g, '') ) // remove anything that is not a digit
		if ( isNaN(st) ) return // non numerical input
		if (st < 0) {
			st = 0
			$(this).val(0)
		} else if (st >= queryResult.length) {
			st = queryResult.length - (queryResult.length % dbPageItems) // last page
			if (queryResult.length % dbPageItems == 0) st -= dbPageItems // if total is divisible, no pagination for last element
			$(this).val(st);
		}
		n = $("#QueryTable").data("dispitems")
		$("#queryArea").html() // clear previous table
		updateDatabaseQueryTable(st, n) // redraw table at new position
	});

	// Change of scrollbar position
	$("body").on("input", "#queryScrollbar", function () {
		st = $(this).val() * dbPageItems
		n = $("#QueryTable").data("dispitems")
		$("#queryArea").html() // clear previous table
		updateDatabaseQueryTableScrollbar(st, n) // update only the table at new position
	});

	// Click on minimize button
	$("body").on("click", "#queryMinBtn", function () {
		$("#queryArea").toggleClass("minimizeQuery")
	});
});

function queryDatabase() {
	var cVal
	if(sVal() == "" || sVal() == 0) return // empty input

	if (liveDatabaseMode == true) calcLiveDatabase(userDBlive) // calculate gematria for live database for enabled ciphers

	$("#calcMain").addClass("splitInterface") // split screen

	if (document.getElementById("queryArea") == null) { // create div if it doesn't exist
		var o = '<div id="queryArea"></div>'
		$(o).appendTo('body');
	}
	
	mArr = [] // array with matching phrases from database
	gemArr = [] // gematria of current phrase for enabled ciphers
	gemArrCiph = [] // indices of enabled ciphers

	numericalMode = NumberArray() // boolean

	var num_index = 0 // numerical array
	for (i = 0; i < cipherList.length; i++) {
		if (cipherList[i].enabled) {
			if (!numericalMode) {
				val = cipherList[i].calcGematria(sVal())
				if (val == 0) val = "n/a"
				gemArr.push(val) // value for current phrase in each enabled cipher
			} else { // numerical mode
				if (num_index < pArr.length) { gemArr.push(pArr[num_index]); num_index++ } // assign first number to first enabled cipher
				else { gemArr.push(0) } // if more ciphers than numbers push zero
			}
			gemArrCiph.push(i) // corresponding cipher index
		}
	}
	// console.log(gemArr)
	// console.log(gemArrCiph)
	if (optFiltCrossCipherMatch) { searchDBcrossCipher() }
	else if (optFiltSameCipherMatch) { searchDBsameCipher() }
	
	// console.log(queryResult)
	
	// var longestPhr = 0; var tmp
	// for (i = 0; i < queryResult.length; i++) {
	// 	tmp = queryResult[i][1].length
	// 	if (tmp > longestPhr) longestPhr = tmp
	// }
	// var tWidth = longestPhr*11 + 58*gemArrCiph.length // 2x1px outer borders + phrase cell and amount of ciphers

	var tWidth = 202 + 58*gemArrCiph.length // 2x1px outer borders + phrase cell and amount of ciphers
	$("#queryArea").css("min-width", tWidth) // set initial/minimal width for the table
	$("#queryArea").css("width", tWidth) // set initial/minimal width for the table
	/*var o = 'min-width:'+tWidth+';width:'+tWidth+';'
	$("#queryArea").attr("style", o) // set minimal/initial width for the table*/
	updateDatabaseQueryTable(0,dbPageItems)
}

function clearDatabaseQueryTable() {
	$("#calcMain").removeClass("splitInterface")
	$("#queryArea").remove() // remove element from page
	queryResult = [] // clear
}

function searchDBcrossCipher() { // populate "queryResult" array with matching phrases
	var p, m, n
	queryResult = [] // reset matching phrases
	var tmpArr = [] // one phrase with score and gematria
	var tmpVal = 0 // current phrase value
	var gemArrCiphUsed = [...gemArrCiph]
	if (liveDatabaseMode == true) { // 0,1,2...
		len = gemArrCiph.length
		gemArrCiphUsed = []
		for (n = 0; n < len; n++) {
			gemArrCiphUsed.push(n)
		}
	}
	// take phrase, take cipher, all values match in cipher add score, build string, next phrase, then sort by score
	for (p = 0; p < userDB.length; p++) { // for each phrase in database
		tmpArr = [0, userDB[p][0]] // reset, set score[0], phrase[1]
		for (m = 0; m < gemArrCiphUsed.length; m++) { // for each enabled cipher index
			tmpVal = Number(userDB[p][gemArrCiphUsed[m]+1]) // value for that phrase (+1 because [0] contains phrase), string to number
			tmpArr.push(tmpVal) // first add values irrelevant of match validity
			for (n = 0; n < gemArr.length; n++) { // for each gematria value (cross cipher)
				if (tmpVal == gemArr[m]) { 
					// tmpArr[0] += gemArr[n] * 10 // add score for a matching value, same cipher
					tmpArr[0] += 10 + 0.00001*tmpVal // add score for a matching value, same cipher
					n = gemArr.length // exit innermost loop (score is added once for same cross cipher values)
				} else if (tmpVal == gemArr[n]) {
					// tmpArr[0] += gemArr[n] // cross cipher
					tmpArr[0] += 1 + 0.00001*tmpVal // cross cipher
					n = gemArr.length // exit innermost loop
				}
			}
		}
		if (tmpArr[0] > 0) queryResult.push(tmpArr) // if total score is more than zero, add phrase to array
	}
	queryResult.sort(function(a, b) { // sort by score (descending)
		return b[0] - a[0]; // sort based on index 0 values ("freq" is array of arrays), (b-a) descending order, (a-b) ascending
	});
}

function searchDBsameCipher() { // populate "queryResult" array with matching phrases
	var p, m, n
	queryResult = [] // reset matching phrases
	var tmpArr = [] // one phrase with score and gematria
	var tmpVal = 0 // current phrase value
	var gemArrCiphUsed = [...gemArrCiph]
	if (liveDatabaseMode == true) { // 0,1,2...
		len = gemArrCiph.length
		gemArrCiphUsed = []
		for (n = 0; n < len; n++) {
			gemArrCiphUsed.push(n)
		}
	}
	// take phrase, take cipher, all values match in cipher add score, build string, next phrase, then sort by score
	for (p = 0; p < userDB.length; p++) { // for each phrase in database
		tmpArr = [0, userDB[p][0]] // reset, set score[0], phrase[1]
		for (m = 0; m < gemArrCiphUsed.length; m++) { // for each enabled cipher index
			tmpVal = Number(userDB[p][gemArrCiphUsed[m]+1]) // value for that phrase (+1 because [0] contains phrase), string to number
			tmpArr.push(tmpVal) // first add values irrelevant of match validity
			if (tmpVal == gemArr[m]) {
				// tmpArr[0] += gemArr[m] // same cipher, add score
				tmpArr[0] += 1 + 0.00001*gemArr[m] // same cipher, add score
			}
		}
		if (tmpArr[0] > 0) queryResult.push(tmpArr) // if total score is more than zero, add phrase to array
	}
	queryResult.sort(function(a, b) { // sort by score (descending)
		return b[0] - a[0]; // sort based on index 0 values ("freq" is array of arrays), (b-a) descending order, (a-b) ascending
	});
}

function updateDatabaseQueryTableScrollbar(stPos = 0, dItems) { // starting position, total displayed items
	var ms, x, y, mCross, mSame, curCiph

	// stPos - starting position
	// dbPageItems - number of phrases in one section
	var nextBlock = stPos+dbPageItems // position for next section
	if (nextBlock > queryResult.length) nextBlock = queryResult.length // out of bounds
	var valPos = 2 // used to retrive gematria from "gemArr" (no recalculation, [0] - score, [1] - phrase)
	var firstPhrase = true // display cipher names before the first phrase
	var tmpComment, commentMatch, dispPhrase // temporary variables to display comments [...]

	var curPos = stPos // current position begins with starting index
	var endPos = stPos + dItems // ending position
	if (curPos < 0) curPos = 0 // out of bounds
	if (endPos > queryResult.length) { // last page
		endPos = queryResult.length
		stPos = queryResult.length - dItems
		curPos = queryResult.length - dItems
	}

	$("#queryArea").removeClass("minimizeQuery") // unhide query area

	$('#QueryTable').data('startpos', stPos); // update table index
	$('#QueryTable').data('dispitems', dItems);

	ms = '<tbody>'
	for (x = curPos; x < endPos; x++) { // for phrases within range

		if (firstPhrase) { // open row on the first phrase
			firstPhrase = false
			ms += '<tr class="cH"><td class="mPQ">'
			ms += queryResult.length+' matches'
			ms += '<br><br>'
			ms += '<div style="display: inline-flex;">'
			ms += '<input class="queryPageBtn" id="queryPrevPageBtn" type="button" value="<" onclick="queryShowPrevPage()">'
			ms += '<input id="queryPosInput" type="tel" autocomplete="off" value="'+curPos+'">'
			ms += '<input class="queryPageBtn" id="queryNextPageBtn" type="button" value=">" onclick="queryShowNextPage()">'
			ms += '</div>'
			ms += '<br>-'
			ms += '<br>'+nextBlock
			ms += '</td>'
			for (z = 0; z < gemArrCiph.length; z++) { // use compact layout
				curCiph = cipherList[ gemArrCiph[z] ]
				// ms += '<td class="hCVQ"><span class="hCV2" style="color: hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / 1);">'+curCiph.cipherName.replace(/ /g, "<br>")+'</span></td>' // color of cipher displayed in the table
				ms += '<td class="hCVQ" style="height: '+calcCipherNameHeightPx(curCiph.cipherName)+'px;"><span class="hCV2" style="color: hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / 1);">'
				ms += curCiph.cipherName+'</span></td>' // color of cipher displayed in the table
			}
			ms += "</tr>"
			curPos += dbPageItems
		}

		if (optAllowPhraseComments) {
			tmpComment = "" // reset
			commentMatch = queryResult[x][1].match(/\[.+\]/g) // find comment
			if (commentMatch !== null) {
				tmpComment = commentMatch[0]
			}
			// comment first, phrase without comment and leading/trailing spaces
			dispPhrase = '<span class="pCHT">'+tmpComment+'</span>' + queryResult[x][1].replace(/\[.+\]/g, '').trim()
		} else {
			dispPhrase = queryResult[x][1]
		}
		ms += '<tr><td class="hPQ" data-ind="'+x+'">' + dispPhrase + '</td>' // phrase at index 1

		valPos = 2 // reset position for new phrase
		for (y = 0; y < gemArrCiph.length; y++) { // gemArrCiph contains indices of ciphers used for query
			curCiph = cipherList[ gemArrCiph[y] ]

			if (liveDatabaseMode == true) {
				gemVal = curCiph.calcGematria(queryResult[x][1]) // recalculate displayed value
			} else {
				gemVal = queryResult[x][valPos] // value only
			}
			if (gemVal == 0) gemVal = "-"
			valPos++ // increment value position

			// mSame - same cipher match, mCross - cross cipher match
			if ( gemVal == gemArr[y] ) {mSame = true} else {mSame = false} // if value is at the same index (meaning same cipher)
			if (gemArr.indexOf(gemVal) > -1) {mCross = true} else {mCross = false}

			ms += '<td class="tCQ">' // use instead of .tC to disable highlighting/blinking/hide effects on click

			if (mSame) { ms += '<span style="color: hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / 1);"' }
			else if (!mSame && mCross) { ms += '<span style="color: hsl(0deg 0% 50% / 1);"' }
			else if (!mSame && !mCross) { ms += '<span style="color: hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alphaHlt+');"' }
			ms += ' class="gVQ"> '+gemVal+' </span></td>' // number properties are available
		}
		ms += '</tr>'
	}

	ms += '</tbody>'
	document.getElementById("QueryTable").innerHTML = ms
	if (navigator.maxTouchPoints <= 1) document.getElementById("queryPosInput").focus() // restore focus on desktop devices
}

function updateDatabaseQueryTable(stPos = 0, dItems) { // starting position, total displayed items
	var ms, x, y, mCross, mSame, curCiph

	// stPos - starting position
	// dbPageItems - number of phrases in one section
	var nextBlock = stPos+dbPageItems // position for next section
	if (nextBlock > queryResult.length) nextBlock = queryResult.length // out of bounds
	var valPos = 2 // used to retrive gematria from "gemArr" (no recalculation, [0] - score, [1] - phrase)
	var firstPhrase = true // display cipher names before the first phrase
	var tmpComment, commentMatch, dispPhrase // temporary variables to display comments [...]

	var curPos = stPos // current position begins with starting index
	var endPos = stPos + dItems // ending position
	if (curPos < 0) curPos = 0 // out of bounds
	if (endPos > queryResult.length) endPos = queryResult.length

	$("#queryArea").removeClass("minimizeQuery") // unhide query area

	sliderMax = Math.floor(queryResult.length/dbPageItems)
	if (queryResult.length % dbPageItems == 0) sliderMax -= 1 // if total is divisible, no pagination for last element
	curSliderPos = Math.round(curPos/dbPageItems)
	ms = '<span class="minimizeLabel">Click to minimize</span>'
	ms += '<div id="queryMinBtn">_</div>' // minimize button
	ms += '<input type="range" min="0" max="'+sliderMax+'" value="'+curSliderPos+'" class="qSlider" id="queryScrollbar">' // slider/scrollbar
	ms += '<table id="QueryTable" class="HistoryTable" data-startpos='+stPos+' data-dispitems='+dItems+'>'
	ms += '<tbody>'

	for (x = curPos; x < endPos; x++) { // for phrases within range

		if (firstPhrase) { // open row on the first phrase
			firstPhrase = false
			ms += '<tr class="cH"><td class="mPQ">'
			ms += queryResult.length+' matches'
			ms += '<br><br>'
			ms += '<div style="display: inline-flex;">'
			ms += '<input class="queryPageBtn" id="queryPrevPageBtn" type="button" value="<" onclick="queryShowPrevPage()">'
			ms += '<input id="queryPosInput" type="tel" autocomplete="off" value="'+curPos+'">'
			ms += '<input class="queryPageBtn" id="queryNextPageBtn" type="button" value=">" onclick="queryShowNextPage()">'
			ms += '</div>'
			ms += '<br>-'
			ms += '<br>'+nextBlock
			ms += '</td>'
			for (z = 0; z < gemArrCiph.length; z++) { // use compact layout
				curCiph = cipherList[ gemArrCiph[z] ]
				// ms += '<td class="hCVQ"><span class="hCV2" style="color: hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / 1);">'+curCiph.cipherName.replace(/ /g, "<br>")+'</span></td>' // color of cipher displayed in the table
				ms += '<td class="hCVQ" style="height: '+calcCipherNameHeightPx(curCiph.cipherName)+'px;"><span class="hCV2" style="color: hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / 1);">'
				ms += curCiph.cipherName+'</span></td>' // color of cipher displayed in the table
			}
			ms += "</tr>"
			curPos += dbPageItems
		}

		if (optAllowPhraseComments) {
			tmpComment = "" // reset
			commentMatch = queryResult[x][1].match(/\[.+\]/g) // find comment
			if (commentMatch !== null) {
				tmpComment = commentMatch[0]
			}
			// comment first, phrase without comment and leading/trailing spaces
			dispPhrase = '<span class="pCHT">'+tmpComment+'</span>' + queryResult[x][1].replace(/\[.+\]/g, '').trim()
		} else {
			dispPhrase = queryResult[x][1]
		}
		ms += '<tr><td class="hPQ" data-ind="'+x+'">' + dispPhrase + '</td>' // phrase at index 1

		valPos = 2 // reset position for new phrase
		for (y = 0; y < gemArrCiph.length; y++) { // gemArrCiph contains indices of ciphers used for query
			curCiph = cipherList[ gemArrCiph[y] ]

			if (liveDatabaseMode == true) {
				gemVal = curCiph.calcGematria(queryResult[x][1]) // recalculate displayed value
			} else {
				gemVal = queryResult[x][valPos] // value only
			}
			if (gemVal == 0) gemVal = "-"
			valPos++ // increment value position

			// mSame - same cipher match, mCross - cross cipher match
			if ( gemVal == gemArr[y] ) {mSame = true} else {mSame = false} // if value is at the same index (meaning same cipher)
			if (gemArr.indexOf(gemVal) > -1) {mCross = true} else {mCross = false}

			ms += '<td class="tCQ">' // use instead of .tC to disable highlighting/blinking/hide effects on click

			if (mSame) { ms += '<span style="color: hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / 1);"' }
			else if (!mSame && mCross) { ms += '<span style="color: hsl(0deg 0% 50% / 1);"' }
			else if (!mSame && !mCross) { ms += '<span style="color: hsl('+curCiph.H+' '+curCiph.S+'% '+curCiph.L+'% / '+alphaHlt+');"' }
			ms += ' class="gVQ"> '+gemVal+' </span></td>' // number properties are available
		}
		ms += '</tr>'
	}

	ms += '</tbody></table>'
	document.getElementById("queryArea").innerHTML = ms
	if (navigator.maxTouchPoints <= 1) document.getElementById("queryPosInput").focus() // restore focus on desktop devices
}

function NumberArray() {
	var x, isNum
	pArr = sVal().split(" ")
	isNum = true
	for (x = 0; x < pArr.length; x++) {
		if (isNaN(pArr[x])) { // is not a number
			isNum = false
			break;
		} else {
			pArr[x] = Number(pArr[x])
		}
	}
	return isNum
}

function queryShowPrevPage() {
	st = Number( document.getElementById('queryPosInput').value ) - dbPageItems
	if (st < 0) {
		st = 0
		$(this).val(0)
	}
	n = $("#QueryTable").data("dispitems")
	$("#queryArea").html() // clear previous table
	updateDatabaseQueryTable(st, n) // redraw table at new position
	if (navigator.maxTouchPoints <= 1) document.getElementById("queryPosInput").focus() // restore focus on desktop devices
}

function queryShowNextPage() {
	st = Number( document.getElementById('queryPosInput').value ) + dbPageItems
	if (st >= queryResult.length) {
		st = queryResult.length - (queryResult.length % dbPageItems) // last page
		if (queryResult.length % dbPageItems == 0) st -= dbPageItems // if total is divisible, no pagination for last element
		$(this).val(st);
	}
	n = $("#QueryTable").data("dispitems")
	$("#queryArea").html() // clear previous table
	updateDatabaseQueryTable(st, n) // redraw table at new position
	if (navigator.maxTouchPoints <= 1) document.getElementById("queryPosInput").focus() // restore focus on desktop devices
}

function unloadDatabase() {
	clearDatabaseQueryTable()
	var curCiphArr = [] // save currently enabled cipher names (database)
	for (var n = 0; n < cipherList.length; n++) {
		if (curCiphArr.indexOf(cipherList[n].cipherName) == -1 && cipherList[n].enabled) {
			curCiphArr.push(cipherList[n].cipherName)
		}
	}
	updateTables() // update

	if (!liveDatabaseMode) { // restore ciphers only when precalculated database is unloaded
		cipherList = [...cipherListSaved] // restore initial ciphers
		interfaceHue = interfaceHueDefault // restore hue
		interfaceLit = interfaceLitDefault // restore saturation
		interfaceSat = interfaceSatDefault // restore lightness
		fontHue = fontHueDefault
		fontLit = fontLitDefault
		fontSat = fontSatDefault
		coderainHue = coderainHueDefault
		coderainLit = coderainLitDefault
		coderainSat = coderainSatDefault
		optGradientCharts = optGradientChartsDefault // restore gradient charts
		$('#showExtraCiphOption').removeClass('hideValue') // show "Show Extra Ciphers" option
	}
	userDB = [] // clear previous DB
	userDBlive = [] // clear live DB

	document.getElementById("calcOptionsPanel").innerHTML = "" // clear menu panel
	initCalc() // reinit
	defaultCipherArray = [...defaultCipherArraySaved] // restore default ciphers choice
	disableAllCiphers()

	for (n = 0; n < cipherList.length; n++) { //enable previous ciphers choice if available (from database)
		if (curCiphArr.indexOf(cipherList[n].cipherName) > -1) {
			cipherList[n].enabled = true
			cur_chkbox = document.getElementById("cipher_chkbox"+n)
			if (cur_chkbox !== null) cur_chkbox.checked = true // update checkbox if present
		}
	}
	updateTables() // update tables
	updateInterfaceColor() // update interface color

	$("#queryDBbtn").addClass("hideValue") // hide query button
	$("#clearDBqueryBtn").addClass("hideValue") // clear button
	$("#unloadDBBtn").addClass("hideValue") // unload database button
	$("#btn-export-db-query").addClass("hideValue") // export button
	$("#edCiphBtn").removeClass("hideValue") // show "Edit Ciphers"
	$("#liveDBOption").removeClass("hideValue") // show "Live Database Mode"

	closeAllOpenedMenus() // close "Edit Ciphers"
	precalcDBLoaded = false // precalculated database unloaded, enable cipher rearrangement
	liveDatabaseMode = true // restore live database mode

	console.log("Database unloaded!")
	var alertDiv = $('<div />').appendTo('body');
	alertDiv.attr('id', 'dbAlert');
	alertDiv.html("<span>Database unloaded!</span>")
	setTimeout(function() {
		alertDiv.remove()
	}, 1000)
	return
}

function calcLiveDatabase(arr) {
	var i, n
	var tmpArr = []
	userDB = [] // reset database values
	for (i = 0; i < arr.length; i++) {
		tmpArr = [] // reset
		tmpArr.push(arr[i]) // add phrase
		for (n = 0; n < cipherList.length; n++) {
			if (cipherList[n].enabled) {
				tmpArr.push(cipherList[n].calcGematria(arr[i])) // gematria value for each enabled cipher
			}
		}
		userDB.push(tmpArr) // add row with phrase and gematria for enabled ciphers
	}
}

function db_PhrLenStats(column = 1) { // phrase length statistics inside current database, column can be value[0] or matches[1]
	var pLenArr = [] // phrase length array
	var db = []
	if (precalcDBLoaded) {
		db = userDB // precalculated database
		for (i = 0; i < db.length; i++) {
			pLenArr.push(db[i][0].length) // read length of each phrase
		}
	} else {
		db = userDBlive // live database
		for (i = 0; i < db.length; i++) {
			pLenArr.push(db[i].length) // read length of each phrase
		}
	}
	var pStat = countMatches(pLenArr) // number of matches[1] for each value[0]
	pStat.sort(function(a, b) { // sort by score (descending)
		return b[column] - a[column]; // sort based on index 1 values, (b-a) descending order, (a-b) ascending
	});
	var res = ""
	for (i = 0; i < pStat.length; i++) {
		res += pStat[i][0]+','+pStat[i][1]+'\n'
	}
	res = res.slice(0,-1) // remove last new line
	copy(res)
	console.log("Copied to clipboard!")
}

function db_CopyPhrOfLen(low, up) { // copy phrases of length within range (inclusive) from database
	var pLenArr = [] // phrase length array
	var db = []
	if (precalcDBLoaded) {
		db = userDB // precalculated database
		for (i = 0; i < db.length; i++) {
			if (db[i][0].length >= low && db[i][0].length <= up) pLenArr.push(db[i][0]) // load phrase
		}
	} else {
		db = userDBlive // live database
		for (i = 0; i < db.length; i++) {
			if (db[i].length >= low && db[i].length <= up) pLenArr.push(db[i]) // load phrase
		}
	}
	var res = ""
	for (i = 0; i < pLenArr.length; i++) {
		res += pLenArr[i]+'\n'
	}
	res = res.slice(0,-1) // remove last new line
	copy(res)
	console.log("Copied to clipboard!")
}

function db_CopyWordRange(low, up) { // copy phrases that have specific amount of words within range (inclusive) from database
	var pLenArr = [] // phrase length array
	var tmp = []
	var db = []
	if (precalcDBLoaded) {
		db = userDB // precalculated database
		for (i = 0; i < db.length; i++) {
			tmp = db[i][0].split(' ')
			if (tmp.length >= low && tmp.length <= up) pLenArr.push(db[i][0]) // load phrase
		}
	} else {
		db = userDBlive // live database
		for (i = 0; i < db.length; i++) {
			tmp = db[i].split(' ')
			if (tmp.length >= low && tmp.length <= up) pLenArr.push(db[i]) // load phrase
		}
	}
	var res = ""
	for (i = 0; i < pLenArr.length; i++) {
		res += pLenArr[i]+'\n'
	}
	res = res.slice(0,-1) // remove last new line
	copy(res)
	console.log("Copied to clipboard!")
}

function db_ConvertProperCase() { // convert current database to Proper Case
	var i, n; var tmp = []; var tStr = ''; var out = 'CREATE_GEMATRO_DB\n'
	var db = []
	if (precalcDBLoaded) {
		db = userDB // precalculated database
	} else {
		db = userDBlive // live database
	}
	for (i = 0; i < db.length; i++) {
		tStr = ''
		if (precalcDBLoaded) { // current phrase to separate words
			tmp = db[i][0].split(' ')
		} else {
			tmp = db[i].split(' ')
		}
		for (n = 0; n < tmp.length; n++) { // build string, each first letter is capitalized
			tStr += tmp[n].substring(0,1).toUpperCase() + tmp[n].substring(1,tmp[n].length).toLowerCase() + ' '
		}
		out += tStr.trim() + '\n'
	}
	out = 'data:text/plain;charset=utf-8,'+encodeURIComponent(out.slice(0,-1)) // format as text file, remove last new line
	download("GEMATRO_DB_PROPER_CASE_"+getTimestamp()+".txt", out); // download file
}

function createDictFromFile(file) {
	var i; var reader = new FileReader()
	var sb = "" // string builder
	reader.onload = (event) => { // actions to perform after file is read
		file = event.target.result // full file contents
		// new line, tabs, sequential spaces, sequential dash, remove punctuation and numbers
		file = file.replace(/\r\n|\n/g, ' ').replace(/\t/g, ' ').replace(/ +/g, ' ').replace(/\-+/g, '-').replace(/[.,\/#!$%\^&\*;:{}=_`~()"\?\|@\(\)\[\]/<>0123456789]/g, '')
		var wordList = file.split(' ') // to string array, space as separator
		
		var uniqueList = []
		var lowercaseList = []
		for (i = 0; i < wordList.length; i++) {
			if (lowercaseList.indexOf(wordList[i].toLowerCase()) == -1 && wordList[i].length > 0) {
				lowercaseList.push(wordList[i].toLowerCase()) // avoid "word" and "Word" duplicates
				uniqueList.push(wordList[i])
			}
		}
		uniqueList.sort( (a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}) ) // sort ascending, case insensitive
		if (uniqueList.indexOf('-') > -1) uniqueList.splice(uniqueList.indexOf('-'), 1) // remove '-'

		var o = ''
		for (i = 0; i < uniqueList.length; i++) {
			o += uniqueList[i]+'\n'
		}
		o = 'data:text/plain;charset=utf-8,'+encodeURIComponent('CREATE_GEMATRO_DB\n' + o.slice(0,-1)) // format as text file
		download("GEMATRO_DB_DICT_"+getTimestamp()+".txt", o); // download file
	}
	reader.onerror = (event) => {
		alert(event.target.error.name)
	};
	reader.readAsText(file) // issue command to start reading file
}
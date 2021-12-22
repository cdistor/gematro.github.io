// ======================== Quickstart Guide ========================

function closePanel(el) {
	$('#darkOverlay').remove();
	$(el).remove();
	$('body').removeClass('noScroll') // restore scrolling
}

function displayQuickstartGuide() {
	$('<div id="darkOverlay" onclick="closePanel(&quot;.quickGuide&quot;)"></div>').appendTo('body'); // overlay

	var o = '<div class="quickGuide">'
	o += '<p><span class="qgBold2">Quickstart Guide</p>'

	o += '<hr class="numPropSeparator">'

	o += '<ul><li><a class="qgLink" href="https://gematriaresearch.blogspot.com/">https://gematriaresearch.blogspot.com/</a><br><span class="qgNote">History of neglected ciphers and methods used in the practice of gematria</span></li></ul>'
	
	o += '<hr class="numPropSeparator">'

	o += '<p class="qgMedium">Phrase Box - enter any word, phrase or number</p>\n<ul><li><span class="qgBold">"Enter"</span> - add phrase to history table</li><li><span class="qgBold">"Up"</span> and <span class="qgBold">"Down"</span> arrow keys - select phrase from history table<br>Press <span class="qgBold">"Down"</span> to select previously entered phrase</li><li><span class="qgBold">"Delete"</span> - delete current phrase from history table</li><li>Additional Shortcuts:<br><span class="qgBold">"Home"</span> - clear history table<br><span class="qgBold">"End"</span> - shortcut for <span class="qgBold">"Enter As Words"</span> function</li></ul>'

	o += '<p class="qgMedium">Highlight Box - enter space delimited numbers</p>\n<ul><li><span class="qgBold">"Enter"</span> - activate filter (remove nonmatching phrases and ciphers)</li><li><span class="qgBold">"Delete"</span> - clear box contents (does not reset filter)<br><span class="qgNote">Note: Reset filter with an "X" button near the box</span></li><li>Additional Shortcuts:<br><span class="qgBold">"Insert"</span> - find all available matches<br><span class="qgBold">"Ctrl + Delete"</span> - reset filter and revert to initial history state<br><span class="qgNote">Note: History table is recalculated on each keystroke</span></li></ul>'

	o += '<p class="qgMedium">Enabled Ciphers Table</p>\n<ul><li><span class="qgBold">"Left Click"</span> on cipher name - choose cipher, display detailed word breakdown</li><li><span class="qgBold">"Right Click"</span> on cipher name - disable cipher</li><li><span class="qgBold">"Ctrl + Right Click"</span> on cipher name - reorder ciphers, select the same cipher to cancel</li><li><span class="qgBold">"Left Click"</span> on number - show number properties</li><li><span class="qgBold">"Right Click"</span> on number - show additional number properties</li></ul>'

	o += '<p class="qgMedium">Number Properties</p>\n<ul><li><span class="qgBold">"Ctrl"</span> key pressed, mouse over number - show number properties</li><li><span class="qgBold">"Shift"</span> key pressed, mouse over number - show additional number properties</li><li>All properties are supported only for values up to 10 million</li><li>Drag cursor across the tooltip to close it<br>Mobile devices - click on the tooltip first, then click outside to close<br><span class="qgNote">Note: Number Properties are available inside Enabled Ciphers Table and History Table</span></li></ul>'

	o += '<p class="qgMedium">Cipher Chart</p>\n<ul><li><span class="qgBold">"Left Click"</span> on letters/values to highlight cells</li></ul>'

	o += '<p class="qgMedium">History Table</p><ul><li><span class="qgBold">"Left Click"</span> on value - toggle blinking effect (temporary)</li><li><span class="qgBold">"Right Click"</span> on value - toggle cell visibility (temporary)</li><li><span class="qgBold">"Shift + Left Click"</span> on cipher name - disable cipher</li><li><span class="qgBold">"Shift + Left Click"</span> on phrase - delete phrase from history</li><li><span class="qgBold">"Ctrl + Left Click"</span> on phrase - load phrase into <span class="qgBold">Phrase Box</span></li><li><span class="qgBold">"Ctrl + Right Click"</span> on phrase - reorder phrases, select the same phrase to cancel</li><li><span class="qgBold">"Ctrl + Left Click"</span> on value (cell) - toggle highlighting for number<br>Highlighter always recalculates table, temporary effects are removed<br><span class="qgNote">Note: Click on cell, not on the number itself, otherwise you will open number properties</span></li></ul>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Options</p>'

	o += '<ul><li><span class="qgBold">"Number Calculation"</span><ul><li>Full (123 = 123) - <span class="qgBold">default</span></li><li>Reduced (123 = 1+2+3 = 6)</li><li>Off</li></ul></li>'

	o += '<li><span class="qgBold">Highlighter</span> has two different modes:<ul><li><span class="qgBold">"Cross Cipher Match"</span></li><li><span class="qgBold">"Same Cipher Match"</span><br><span class="qgNote">Note: If there is just one value, only "Cross Cipher Match" will pick that</span></li></ul></li>'

	o += '<li><span class="qgBold">"Show Only Matching"</span> - when highlighter is active, sets opacity of nonmatching values to zero</li>'

	o += '<li><span class="qgBold">"Compact History"</span> - use vertical cipher names inside history table</li>'
	o += '<li><span class="qgBold">"Tiny History"</span> - no cipher names, seamless history table</li>'

	o += '<li><span class="qgBold">"Show Extra Ciphers"</span> - toggle <span class="qgBold">"Extra"</span> category with experimental ciphers</li>'
	o += '<li><span class="qgBold">"Ignore Comments [...]"</span> - exclude any text inside square brackets from gematria calculation<br><span class="qgNote">Note: Comments are preserved on export/import</span></li>'
	o += '<li><span class="qgBold">"Live Database Mode"</span> - disable this option to generate a precalculated database on file import<br><span class="qgNote">Note: More information is available in the "Databases" section of this guide</span></li>'
	
	o += '<li><span class="qgBold">"Phrases on DB page"</span> - specify the amount of phrases on one page of <span class="qgBold">Database</span> query results</span></li>'
	o += '<li><span class="qgBold">"Scroll DB by lines"</span> - set scrolling speed inside <span class="qgBold">Database</span> query results</span></li>'

	o += '<li><span class="qgBold">"Letter/Word Count"</span> - show number of recognized (by current cipher) letters and words</li>'
	o += '<li><span class="qgBold">"Simple Result"</span> - display gematria of current phrase in text format</li>'
	o += '<li><span class="qgBold">"Word Breakdown"</span> - show detailed breakdown for current phrase</li>'
	o += '<li><span class="qgBold">"Cipher Chart"</span> - show a table of correspondences between letters and values for current cipher</li>'

	o += '<li><span class="qgBold">"Gradient Charts"</span> - toggle fill style for <span class="qgBold">"Word Breakdown"</span> and <span class="qgBold">"Cipher Chart"</span></li>'

	o += '<li><span class="qgBold">"Switch Ciphers (CSV)"</span> - enable previously selected ciphers on history file import</li>'
	o += '<li><span class="qgBold">"Matrix Code Rain"</span> - use dynamic background</li></ul>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Features</p>'

	o += '<p class="qgMedium">Date Calculator</p>\n<ul><li>Calculate interval between two dates according to Gregorian calendar, supports <span class="qgBold">Add/Subtract</span> mode<br><span class="qgNote">Note: Make sure to consult timeanddate.com or other websites for precise calculations for old dates or other calendars (e.g. Julian)</span></li><li><span class="qgBold">Left Click</span> on <span class="qgBold">"From"</span> or <span class="qgBold">"to"</span> label to set a custom date description</li><li><span class="qgBold">Left Click</span> to highlight line with date durations</li><li><span class="qgBold">Right Click</span> to remove line with date durations</li><span class="qgNote">Note: Toggle "Include End Date" checkbox to bring the removed lines back</span></li><li>You can <span class="qgBold">import</span> a text file to calculate durations between multiple dates at once.<br>One date per line, <span class="qgBold">M/D/YYYY</span> format, comments are optional:<br><br>GEMATRO_DATES<br>1/28/2006 [comment]<br>11/7/1968 [comment]</li></ul>'

	o += '<p class="qgMedium">Color Controls</p>\n<ul><li>Change cipher colors (<span class="qgBold">HSL</span> - Hue, Saturation, Lightness)</li><li>Make sure to <span class="qgBold">"Export Ciphers"</span> before you make any modifications inside <span class="qgBold">"Edit Ciphers"</span> menu</li></ul>'

	o += '<p class="qgMedium">Edit Ciphers</p>\n<ul><li><span class="qgBold">"Left Click"</span> on cipher name in Enabled Ciphers Table to edit existing cipher or make a new one based on existing one</li><li>Cipher names are unique; if name matches, it means an existing cipher is modified</li><li>Existing cipher can be moved to a different category (it will be added as last item in that category)</li><li>Any cipher category can be created</li><li>Cells with individual letters or values can be modified</li><li><span class="qgBold">Unicode</span> characters are supported</li><li>Color controls are reset on any change in <span class="qgBold">"Edit Ciphers"</span> menu</li></ul>'

	o += '<p><span class="qgBold">"Find Matches"</span> - populate <span class="qgBold">Highlight Box</span> with numbers that match at least twice</p>'
	o += '<p><span class="qgBold">"Enter As Words"</span> - read text from <span class="qgBold">Phrase Box</span> one word at a time until a certain phrase length is reached, then move on to the next starting word, process is repeated until all words are entered into history table</p>'
	o += '<p><span class="qgBold">"Clear History"</span> - remove all entries from history table</p>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Export</p>'

	o += '<ul><li><span class="qgBold">"Print Cipher Chart", etc</span> - render correspondent element as an image (PNG), image preview is opened first<br><span class="qgNote">Note: If text or table are misaligned, click "Refresh" button to generate a new image</span></li>'

	o += '<li><span class="qgBold">"Import File"</span> - import a <span class="qgBold">.txt</span> file (one phrase per line), previously exported CSV history, exported matches or user ciphers<br><span class="qgNote">Note: You can also drag and drop file into Phrase Box</span></li>'

	o += '<li><span class="qgBold">"Create Database (TXT)"</span> - convert a <span class="qgBold">.txt</span> file into <span class="qgBold">Live Database</span> format<br><span class="qgNote">Note: Database contains unique words which are sorted by alphabetical order</span></li>'

	o += '<li><span class="qgBold">"Export History (CSV)"</span> - export phrases from current history table as a CSV file, semicolon is used as separator, first row contains cipher names</li>'

	o += '<li><span class="qgBold">"Export Matches (TXT)"</span> - export all available matches from current history table as a text file, current highlighter mode (<span class="qgBold">"Cross Cipher Match"</span> or <span class="qgBold">"Same Cipher Match"</span>) is used during export<br><span class="qgNote">Note: Matches can be imported back into calculator</span></li>'

	o += '<li><span class="qgBold">"Export Ciphers"</span> - ciphers active at the time of export will become the new default ones on next import, file can have any name or extension<br><span class="qgNote">Note: You can edit file manually with a text editor, make sure to keep formatting<br>Any changes made to options or menu settings are saved as well<br>If you want to permanently change ciphers, you can download an offline version of calculator from GitHub repository and replace "ciphers.js" file inside "calc" directory<br>Online and offline versions are identical</span></li></ul>'

	o += '<hr class="numPropSeparator">'
	o += '<p><span class="qgBold2">Databases</p>'

	o += '<ul><li>Import a properly formatted TXT file to enable database query. <span class="qgBold">Live Database Mode</span> is used by default, however <span class="qgBold">GEMATRO</span> can generate a precalculated database as well<br><span class="qgNote">Note: File should contain one phrase per line, the first line must be<br>CREATE_GEMATRO_DB</span></li>'

	o += '<li><span class="qgBold">"Ignore Comments [...]"</span> flag affects database generation<br><span class="qgNote">Note: When database is loaded, calculator should use the same mode of "Ignore Comments [...]" as at the moment of database generation, otherwise values inside database and calculator will differ. The same is valid for number calculation settings</span></li>'

	o += '<li>Precalculated database can be generated when <span class="qgBold">"Live Database Mode"</span> is disabled. Database will have values only for currently selected ciphers. Those ciphers are stored inside the database as well.<br><span class="qgNote">Note: When precalculated database is loaded, calculator will allow to use only those ciphers which are available inside that database<br>For example, if you load a database that contains values only for English Ordinal cipher, English Ordinal becomes the only available cipher for any calculations until you unload the database. "Live Database Mode" calculates all values on the fly and can work with any ciphers, however this mode is slower and there is no separate file with precalculated gematria values</span></li>'

	o += '<li>After you import a properly formatted text file for database generation, calculation will start immediately and a dialogue that offers to save new precalculated database will appear<br><span class="qgNote">Note: Process may take some time, please be patient</span></li>'

	o += '<li>When a database is imported, new elements become available:<ul><li><span class="qgBold">"Query"</span> - match current phrase or number against database</li><li><span class="qgBold">"Clear DB Query" (Features)</span> - close current <span class="qgBold">Query Table</span> and switch back to centered interface</li><li><span class="qgBold">"Unload Database" (Features)</span> - unload database and restore initial ciphers; <span class="qgBold">History Table</span> is preserved</li><li><span class="qgBold">"Export DB Query (CSV)" (Export)</span> - save matching phrases from database as a CSV file</li></ul>'

	o += '<li><span class="qgBold">"Cipher Edit"</span> (and rearrangement) is not available when a precalculated database is loaded</li>'

	o += '<li>Current highlighter mode (<span class="qgBold">"Cross Cipher Match"</span> or <span class="qgBold">"Same Cipher Match"</span>) controls database query<br><span class="qgNote">Note: "Show Only Matching" option hides nonmatching values as well</span></li>'

	o += '<li>Query is based on current cipher selection; there is no limit for the amount of enabled ciphers</li>'

	o += '<li>Input any phrase into the <span class="qgBold">"Phrase Box"</span> and press <span class="qgBold">"Query"</span> button to match against currently loaded database</li><li>Numerical input is supported, several numbers are recognized as well:<br><span class="qgBold">74 0 142</span><br><span class="qgNote">Note: In the example above, the first enabled cipher will be matched against 74 and the third cipher will be matched against 142</span></li></ul>'

	o += '<p class="qgMedium">Query Table</p>\n'

	o += '<ul><li>Use <span class="qgBold">"Up"</span> and <span class="qgBold">"Down"</span> arrow keys to scroll one page at a time or use the mouse wheel</li><li>A horizontal scroll bar above the table can be used for navigation as well or you can input the exact position inside the box with index<br><span class="qgNote">Note: Up/Down arrow keys work only when input is focused inside textbox with current index</span></li>'

	o += '<li>Drag the bottom-right corner of the <span class="qgBold">Query Table</span> to resize it<br><span class="qgNote">Hint: Extend the table in case if long phrases do not fit on one line</span></li>'

	o += '<li><span class="qgBold">"Ctrl + Left Click"</span> on phrase - load phrase from <span class="qgBold">Query Table</span> into <span class="qgBold">Phrase Box</span> and add it to <span class="qgBold">History Table</span></li>'

	o += '<li><span class="qgBold">"Left Click"</span> on button in the top right corner to temporarily minimize the table if it obstructs the interface (left click again to bring the table back)<br><span class="qgNote">Hint: You can zoom out the page if too many ciphers are active</span></ul>'

	o += '</div>'

	$(o).appendTo('body'); // guide
	$('body').addClass('noScroll') // prevent scrolling
}
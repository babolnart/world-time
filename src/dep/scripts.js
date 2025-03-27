document.addEventListener(
	"DOMContentLoaded",
	function () {
		renderTZcards();
	},
	false
);

/************************************
 ****** DATE AND TIME FUNCTIONS *****
 ************************************/

function calcHour(offset) {
	//get time stamp now
	d = new Date();

	//based on the time stamp calculate the offset
	utc = d.getTime() + d.getTimezoneOffset() * 60000;

	//result is a new date
	nd = new Date(utc + 3600000 * offset);

	var hh = nd.getHours();

	if (hh >= 13) {
		hh -= 12;
	}
	if (hh < 1) {
		hh = 12;
	}

	/* Disable this if you don't want a 0 prefix
  if (hh < 10) {
    hh = "0" + hh;
  }
*/
	return hh;
}

function calcMins(offset) {
	//get time stamp now
	d = new Date();

	//based on the time stamp calculate the offset
	utc = d.getTime() + d.getTimezoneOffset() * 60000;

	//result is a new date
	nd = new Date(utc + 3600000 * offset);

	var mins = nd.getMinutes();
	if (mins < 10) {
		mins = "0" + mins;
	}

	/* activate this if you need a colon to separate the mins from the hours
  mins = ":" + mins; 
  */
	return mins;
}

function calcAMPM(offset) {
	//get time stamp now
	d = new Date();

	//based on the time stamp calculate the offset
	utc = d.getTime() + d.getTimezoneOffset() * 60000;

	//result is a new date
	nd = new Date(utc + 3600000 * offset);

	var hh = nd.getHours();
	var ap = hh >= 12 ? "PM" : "AM";

	return ap;
}

function calcMonth(offset) {
	//get time stamp now
	d = new Date();

	//based on the time stamp calculate the offset
	utc = d.getTime() + d.getTimezoneOffset() * 60000;

	//result is a new date
	nd = new Date(utc + 3600000 * offset);

	var monthNames = [
		"JAN",
		"FEB",
		"MAR",
		"APR",
		"MAY",
		"JUN",
		"JUL",
		"AUG",
		"SEP",
		"OCT",
		"NOV",
		"DEC",
	];

	var mmm = monthNames[nd.getMonth()];

	return mmm;
}

function calcDate(offset) {
	//get time stamp now
	d = new Date();

	//based on the time stamp calculate the offset
	utc = d.getTime() + d.getTimezoneOffset() * 60000;

	//result is a new date
	nd = new Date(utc + 3600000 * offset);

	var dd = nd.getDate();
	if (dd < 10) {
		dd = "0" + dd;
	}

	return dd;
}


function getCurrentTimeWithDST(offset) {
    const now = new Date();

    // Get current year
    const year = now.getFullYear();

    // Define DST start and end dates (for example, US DST rules)
    const dstStart = new Date(year, 2, 8); // 2 = March, 8 = second Sunday
    dstStart.setDate(8 - dstStart.getDay()); // Adjust to the second Sunday in March

    const dstEnd = new Date(year, 10, 1); // 10 = November, 1 = first Sunday
    dstEnd.setDate(1 + (7 - dstEnd.getDay()) % 7); // Adjust to the first Sunday in November

    // Determine if current time is in DST
    const isDST = now >= dstStart && now < dstEnd;

    // Adjust offset for DST
    const adjustedOffset = offset + (isDST ? 1 : 0);

    // Calculate the local time based on the adjusted offset
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + adjustedOffset * 3600000);

    return localTime;
}




function calcDOTW(offset) {
	//get time stamp now
	d = new Date();

	//based on the time stamp calculate the offset
	utc = d.getTime() + d.getTimezoneOffset() * 60000;

	//result is a new date
	nd = new Date(utc + 3600000 * offset);

	var WeekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

	var dotw = WeekdayNames[nd.getDay()];

	return dotw;
}

/****************************
 ****** OBJECT RENDERER ******
 *****************************/

function renderObject(htmtype, objid, objclass, parentid, objvalue) {
	/*to render object, do the following:
  - specify the HTML TYPE (htmtype)
  - assign an OBJECTID (objid)
  - assign a CLASS (objclass)
  - define the parent by specifying the parent object (parentid)
  - output the value (objvalue)
    */

	var htmlobject = document.createElement(htmtype);

	htmlobject.className = objclass;
	htmlobject.id = objid;
	htmlobject.innerHTML = objvalue;

	document.getElementById(parentid).appendChild(htmlobject);
}
/*we need to render this card multiple times
<div class="timezone-card">
  <div class="timezone-region">LOCAL</div>
  <div class="timezone-hour">10</div>
  <div class="timezone-ticker">:</div>
  <div class="timezone-minutes">42</div>
  <div class="timezone-ampm">am</div>
  <div class="timezone-month">JAN</div>
  <div class="timezone-date">16</div>
  <div class="timezone-day">SAT</div>
</div>

*/
function renderTZcards() {
	var i = 0;
	var ctr = i + 1;

	/*objQty is directly proportional to the quantity of regions and offsets
  Please see settings.js for more information
  */

	/*to render object, do the following:
  - specify the HTML TYPE (htmtype)
  - assign an OBJECTID (objid)
  - assign a CLASS (objclass)
  - define the parent by specifying the parent object (parentid)
  - output the value (objvalue)

  renderObject(htmtype, objid, objclass, parentid, objvalue)
    */
	var parentcard = "world-time-container";
	var cardclass = "timezone-card";
	var cardID = "TZcard";
	var calendarBoxID = "calendar-box";
	var clockboxID = "clockbox";
	var clockboxclass = "clock-box";
	var monthdateboxID = "month-date-box";
	var regionID = "region";
	var regionclass = "timezone-region";

	for (i = 0; i < objQty; i++) {
		renderObject("div", cardID + ctr, cardclass, parentcard, "");
		renderObject("div", calendarBoxID + ctr, "daydetails", "TZcard" + ctr, "");
		renderObject(
			"div",
			clockboxID + ctr,
			clockboxclass,
			calendarBoxID + ctr,
			""
		);
		renderObject(
			"div",
			"hour" + ctr,
			"timezone-hour clock",
			clockboxID + ctr,
			calcHour(offset[i])
		);
		renderObject(
			"div",
			"ticker" + ctr,
			"timezone-ticker clock",
			clockboxID + ctr,
			":"
		);
		renderObject(
			"div",
			"mins" + ctr,
			"timezone-minutes clock",
			clockboxID + ctr,
			calcMins(offset[i])
		);
		renderObject(
			"div",
			"ampm" + ctr,
			"timezone-ampm clock",
			clockboxID + ctr,
			calcAMPM(offset[i])
		);

		renderObject(
			"div",
			"dotw" + ctr,
			"timezone-day",
			calendarBoxID + ctr,
			calcDOTW(offset[i])
		);

		renderObject(
			"div",
			monthdateboxID + ctr,
			"month-date-box",
			calendarBoxID + ctr,
			""
		);
		renderObject(
			"div",
			"month" + ctr,
			"timezone-month",
			monthdateboxID + ctr,
			calcMonth(offset[i])
		);
		renderObject(
			"div",
			"date" + ctr,
			"timezone-date",
			monthdateboxID + ctr,
			calcDate(offset[i])
		);
		renderObject("div", regionID + ctr, regionclass, cardID + ctr, regions[i]);
		ctr++;
	}
	refreshDateTime();
}

function refreshDateTime() {
	/*objQty is directly proportional to the quantity of regions and offsets
  Please see settings.js for more information
  */

	for (i = 0; i < objQty; i++) {
		var ctr = i + 1;

		var refRegion = "region" + String(ctr);
		var refHour = "hour" + String(ctr);
		var refTicker = "ticker" + String(ctr);
		var refMins = "mins" + String(ctr);
		var refAmPm = "ampm" + String(ctr);
		var refMonth = "month" + String(ctr);
		var refDate = "date" + String(ctr);
		var refDOTW = "dotw" + String(ctr);

		/*calcDST is compensating for offset and if DST is active on that particular timezone
  offset is found on settings.js
  isDST is a true or false statement. if 0 then false, if true then 1
  */
		var calcDST = Number(offset[i]) + Number(isDST[i]);
		switch (isDST[i]) {
			case "1":
				document.getElementById(refRegion).innerHTML = regions[i] + " dst";
				document.getElementById(refRegion).style.pointerEvents = "none";
		}

		document.getElementById(refHour).innerHTML = calcHour(calcDST);
		document.getElementById(refMins).innerHTML = calcMins(calcDST);
		document.getElementById(refAmPm).innerHTML = calcAMPM(calcDST);
		document.getElementById(refMonth).innerHTML = calcMonth(calcDST);
		document.getElementById(refDate).innerHTML = calcDate(calcDST);
		document.getElementById(refDOTW).innerHTML = calcDOTW(calcDST);

		var ticks = document.getElementById(refTicker).innerHTML;

		if (ticks == ":") {
			document.getElementById(refTicker).innerHTML = " ";
		} else {
			document.getElementById(refTicker).innerHTML = ":";
		}

		ctr++;
	}

	setTimeout("refreshDateTime()", 500);
}

function br2nl(str) {
	return str.replace(/<br\s*\/?>/gm, "\n");
}

// UPPERCASE, LOWERCASE, TITLECASE STRING MANAGEMENT
// This one cannot cater to "Can't" (it turns it to "Can'T") but can cater to "O'Brien"
function toTitleCase(str) {
	return str.replace(/\w+/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

// This one cater's Can't but cannot cater to O'brien and has issues with trailing spaces
/*
function toTitleCase(str) {
  return str.split(/\s+/).map(function (word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}
*/

/*---------------------------------------------------------------------------------
this function replaces 'linebreaks' with linebreaks + '- ' (adds a dash and a space)
----------------------------------------------------------------------------------*/
function replace_linebreaks(str) {
	return str.replace(/[\r\n]+/gm, "\r\n• ");
}

/*---------------------------------------------------------------------------------
this function formats phone numbers
----------------------------------------------------------------------------------*/
function formatPhoneNumber(phoneNumberString) {
	var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
	var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
	if (match) {
		return "(" + match[1] + ") " + match[2] + "-" + match[3];
	}
	return null;
}

/*---------------------------------------------------------------------------------
copies element content to clipboard
----------------------------------------------------------------------------------*/
function copy(el) {
	SelectAll(el); // selects contents of preview
	document.execCommand("Copy", false, null); // copies it to clipboard (requires Chrome v.42++)
}

/*---------------------------------------------------------------------------------
function highlights and selects the value inside a textarea
----------------------------------------------------------------------------------*/
function SelectAll(id) {
	document.getElementById(id).focus(); //focuses on the defined element. this case it's the textarea called 'preview'
	document.getElementById(id).select(); // selects the value of the field or element
}

/*---------------------------------------------------------------------------------
replaces BR to N/
----------------------------------------------------------------------------------*/
function br2nl(str) {
	return str.replace(/<br\s*\/?>/gm, "\n");
}

function storeDocs() {}

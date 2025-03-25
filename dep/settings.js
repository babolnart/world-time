/************************************
**********TIMEZONE SETTINGS**********

objQty - number of timezone cards
offset - an array of timezone offsets per timezone card region
region - string name of the region (this does not auto adjust the name)
isDST - is a (1)true or (0)false statement to say whether the particular region is in daylight saving time

NOTE: US Daylight Saving Time starts at 2:00AM (1:59AM >>> 3:00AM) on the 2nd Sunday of March and ends at 2:00AM (1:59AM to 1:00AM) on the 1st Sunday of November
FOR FUTURE USE
************************************/
objQty = 11;
offset = ["+8", "-8", "-7", "-6", "-5", "0", "+1", "+2", "+3", "+9"];
isDST = ["0", "1", "1", "1", "1", "0", "0", "0", "0", "0"];
regions = [
  "local",
  "pacific",
  "mountain",
  "central",
  "eastern",
  "london",
  "paris",
  "kyiv",
  "moscow",
  "tokyo, seoul",
];

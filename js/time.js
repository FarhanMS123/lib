function getDates(date){
	var m = [31,(year % 4 == 0 ? 29 : 28),31,30,31,30,31,31,30,31,30,31];
	var year = date.getFullYear();
	var month = (year * 12) + date.getMonth() + 1;
	var day = ((year - 1) * 365) + (((year - 1) - ((year - 1) % 4)) / 4) + date.getDate();
	if(date.getMonth() + 1 > 1){
		for(i=0; i<date.getMonth() - 1; i++){
			day += m[i]
		}
	}
	var hour = (day * 24) + date.getHours();
	var minute = (hour * 60) + date.getMinutes();
	var second = minute * 60 + date.getSeconds();
	var ms = (second * 1000) + date.getMilliseconds()
	return {year: year, mon: month, day: day, hour:hour, sec:second, ms: ms};
}
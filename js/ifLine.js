/*
ifLine([statement, value_true], [statement, value_true], [sm, vt], ... , [sm, vt]); //will return one of value_true or false
-----------------------------------------------------------------------------------------------------------------------------
ifLine([false, 3], [false, 4], [true, 5], [false, 6], [true, 7]); //return 5
ifLine([false, 3], [false, 4], [false, 5], [false, 6], [false, 7]); //return false
*/

function ifLine(){
	arguments = Array.prototype.slice.call(arguments);
	var i;
	for(i=0;i<arguments.length;i++){
		if((/(null|undefined)/ig).test(arguments[i])) continue;
		if(arguments[i].constructor == Array) if(arguments[i][0] == true) return arguments[i][1];
	}
	return false;
}

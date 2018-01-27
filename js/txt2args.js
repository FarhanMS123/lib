function kickMid(arr, index){
	var dt = []; var i;
	for(i=0;i<arr.length;i++){
		if(i==index) continue;
		dt.push(arr[i])
	}
	return dt;
}

function splitArgs(arg){
	var full = arg.split(" ");
	var u=-1, x=[], l="", i=undefined;
	for(i=0;i<full.length;i++){
		if(u>-1){
			full[u] += ` ${full[i]}`;
			x.push(i);
		}
		if(u == -1 && (full[i].slice(0,1) == "\"" || full[i].slice(0,1) == "\'")){
			u=i;
			l=full[i].slice(0,1);
			full[i] = full[i].slice(1);
		}
		if(u > -1 && full[i].slice(-1) == l){
			full[u] = full[u].slice(0, -1);
			u=-1;
		}
	}
	var i = undefined;
	for(i=x.length - 1;i>-1;i--){
		full = kickMid(full, x[i]);
	}
	return full;
}

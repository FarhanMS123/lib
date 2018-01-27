function kickMid(arr, index){
	var dt = []; var i;
	for(i=0;i<arr.length;i++){
		if(i==index) continue;
		dt.push(arr[i])
	}
	return dt;
}

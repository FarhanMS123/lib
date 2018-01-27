/*
  a -> array = [0,20,40,60,80,100];
  x -> number as coordinates = 0.3
  return 30
*/

function range(a, x){
	if(typeof a != "object") throw Error("first arguments should an array");
	if(a.constructor != Array) throw Error("first arguments should an array");
	if(a.length<=1) return NaN;
	//0, 1/a_length, 2*(1/a_length), 3*(1/a_length), ...
	//                     0<=x<=1
	if(x==0) return a[0];
	var spr = 1/(a.length-1);
	var i = Math.ceil(x / spr);
	return a[i-1] + ((a[i]-a[i-1]) * (x - (spr * (i-1)))/spr);
}

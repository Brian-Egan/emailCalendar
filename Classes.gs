//Array.prototype.isNull = function (){
//    return this.join().replace(/,/g,'').length === 0;
//};


Date.prototype.addHours= function(h){
  var nD = new Date(this);
  nD.setHours(this.getHours()+h);
  return nD;
}


Date.prototype.addMonths= function(h){
  var nD = new Date(this);
    nD.setMonth(this.getMonth()+h);
    return nD;
}
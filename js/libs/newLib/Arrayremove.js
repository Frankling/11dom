/**
 * Created by DELL on 2015/10/14.
 */
Array.prototype.indexOf= function (val) {
    for(var i=0;i<this.length;i++){
        if(this[i]==val) return i;
    }
    return -1;
};
Array.prototype.remove= function (val) {
    var index=this.indexOf(val);
    if(index>-1){
        this.splice(index,1);
    }
};
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
function imageBackground(imageID,number){

    if("undefined" !== typeof $(imageID)[0]){
        $(imageID)[0].style.background=$(number)[0].value;

    }

}


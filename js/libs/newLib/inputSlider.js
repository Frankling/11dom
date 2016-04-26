/**
 * Created by DELL on 2016/2/26.
 */
$(function(){
    if(navigator.appVersion.indexOf("AppleWebKit")>-1){
        $('input[type="range"]').css('height','8px');
        $('input[type="range"]').on('input', function () {
            this.min = this.min?  this.min:0;
            this.max = this.max? this.max:100;
            // console.log(this.max);
            var percent = Math.ceil(((this.value - this.min||0) / (this.max - this.min||0)) * 100);
            // console.log(percent);
            $(this).css('background','-webkit-linear-gradient(left, #6f931e 0%,#c1f257 ' + percent + '%, #1e1f22 ' + percent + '%)');
            if($(this).attr('id')=='novalue'){
                $(this).css('background','-webkit-linear-gradient(left, #666 0%, #666 ' + percent + '%, #666 ' + percent + '%)');


            }
        });

    }
    $('input[type="range"]').trigger("input");
    $(".title")[0].click();


    UIColorPicker.init();
});

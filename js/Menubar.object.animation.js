/**
 * Created by asforever on 2016/7/8.
 */
Menubar.object.animation = function ( editor ) {
    var animationAttributes = new UI.Panel();
    //材质
    var animationHeader = new UI.createDiv('attrHeader', animationAttributes, '动画');
    var listOfanimationHidden = new UI.createDiv('attrTriPng', animationHeader);
    var listOfanimationHelp = new UI.createDiv('attrHelp', animationHeader);

    animationHeader.onClick(function () {
        var left=window.innerWidth-document.getElementById("viewport").offsetWidth;
        document.getElementById("animationEditor").style.left = left+"px";
        if (animationBody.dom.style.display == "none") {
            animationBody.dom.style.display = "block";
            document.getElementById("animationEditor").style.display = "block";
            $(".hiddenList").css("display","block");

            listOfanimationHidden.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            animationBody.dom.style.display = "none";
            document.getElementById("animationEditor").style.display = "none";
            $(".hiddenList").css("display","none");
            listOfanimationHidden.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var animationBody = new UI.createDiv('Attr_Content', animationAttributes);
    animationBody.dom.style.display = "none";

    $(".panel-close,.title").ready(function(){


        $(".panel-close,.title").bind("click",function(){

            $("#animationEditor").css("display","none");
            $(animationBody.dom).css("display","none");
            $(".hiddenList").css("display","none");
            $(listOfanimationHidden.dom).css("background-image","url('image/jiantou-you.png')");

        });
    });




    return animationAttributes;
};


/**
 * Created by asforever on 2016/6/16.
 */
var eventUI = function (editor) {
    var eventAttributes = new UI.Panel();
    //材质
    var eventHeader = new UI.createDiv('attrHeader', eventAttributes, '事件');
    var listOfEventHidden = new UI.createDiv('attrTriPng', eventHeader);
    var listOfEventHelp = new UI.createDiv('attrHelp', eventHeader);

    eventHeader.onClick(function () {
        var left=window.innerWidth-document.getElementById("viewport").offsetWidth;
        document.getElementById("eventOptions").style.left = left+"px";
        if (eventBody.dom.style.display == "none") {
            eventBody.dom.style.display = "block";
            document.getElementById("eventOptions").style.display = "block";
            $(".hiddenList").css("display","block");

            listOfEventHidden.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            eventBody.dom.style.display = "none";
            document.getElementById("eventOptions").style.display = "none";
            $(".hiddenList").css("display","none");
            listOfEventHidden.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var eventBody = new UI.createDiv('Attr_Content', eventAttributes);
    eventBody.dom.style.display = "none";




    return eventAttributes;
};
(function(){
    var container = new UI.Panel();
    container.setId("eventEditor");
    var options = new UI.Panel();
    options.setClass( 'options' );
    options.setId("eventOptions");
    var eventHeader = new UI.Panel();
    eventHeader.setClass( 'libHeader' );
    options.add( eventHeader );

    var eventBody = new UI.Panel();
    eventBody.setClass( 'libBody' );
    options.add( eventBody);
    container.add(options);
    document.body.appendChild(container.dom);


})();
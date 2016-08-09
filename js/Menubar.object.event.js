/**
 * Created by asforever on 2016/6/16.
 */
var eventUI = function (editor) {
    var eventAttributes = new UI.Panel();
    //事件
    var eventHeader = new UI.createDiv('attrHeader', eventAttributes, '事件');
    var listOfEventHidden = new UI.createDiv('attrTriPng', eventHeader);
    listOfEventHidden.dom.style.backgroundImage = "url('image/jiantou-you.png')";
    var listOfEventHelp = new UI.createDiv('attrHelp', eventHeader);

    eventHeader.onClick(function () {
        if($("#"+editor.scene.uuid+" .selected")[0] == undefined){
            alert("请先选择一个物体！");
            return;
        }

        var left=window.innerWidth-document.getElementById("viewport").offsetWidth;
        document.getElementById("eventOptions").style.left = left+"px";
        if (eventBody.dom.style.display == "none") {
            eventBody.dom.style.display = "block";
            document.getElementById("eventOptions").style.display = "block";
            $(".hiddenList").css("display","block");
            listOfEventHidden.dom.style.backgroundImage = "url('image/jiantou.png')";

            if(isDraw == true) initDrawLine();
        } else {
            eventBody.dom.style.display = "none";
            document.getElementById("eventOptions").style.display = "none";
            $(".hiddenList").css("display","none");
            listOfEventHidden.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var eventBody = new UI.createDiv('Attr_Content', eventAttributes);
    eventBody.dom.style.display = "none";

    var Event = new UI.createDiv("Event_attrRow",eventBody,"事件盒子");
    Event.setId("Event_attrRow");

    var isMove = false;
    var clickDiv;
    var diff_X1,diff_Y1,diff_X2,diff_Y2;
    function down(e){
        var div = event.srcElement;
        var oEvent = e || window.event;
        var xx = oEvent.clientX;
        var yy = oEvent.clientY;
        if(div.className == "Event_attrRow"){
            isMove = true;
            clickDiv = div;

            var divClone = clickDiv.cloneNode(true);
            divClone.id = clickDiv.id + "_clone";
            divClone.className = "Event_attrRowClone";
            document.body.appendChild(divClone);
        }

        if(div.className == "eventFrameName"){
            isMove = true;
            clickDiv = div.parentNode.parentNode;

            diff_X1  = xx - parseInt(clickDiv.style.left.replace(/[^0-9]/,""));
            diff_Y1  = yy - parseInt(clickDiv.style.top.replace(/[^0-9]/,""));
        }
        if(div.className == "attHeader"){
            isMove = true;
            clickDiv = div.parentNode;

            diff_X2  = xx - parseInt(clickDiv.style.left.replace(/[^0-9]/,""));
            diff_Y2  = yy - parseInt(clickDiv.style.top.replace(/[^0-9]/,""));
        }
    }
    function move(e){
        e.preventDefault();
        var oEvent = e || window.event;
        var xx = oEvent.clientX;
        var yy = oEvent.clientY;
        if(isMove) {
            if(clickDiv.className == "Event_attrRow") {
                $('#' + clickDiv.id + "_clone").css({top: yy, left: xx});
            }
            if(clickDiv.className == "eventFrame") {
                $('#'+clickDiv.id).css({top: yy-diff_Y1, left: xx-diff_X1});
                changePathPosition();
            }
            if(clickDiv.className == "eventAttribute") {
                $('#'+clickDiv.id).css({top: yy-diff_Y2, left: xx-diff_X2});
            }
        }
    }
    function up(e){
        isMove = false;
        if(clickDiv != undefined) {
            if(clickDiv.className == "Event_attrRow") {
                document.body.removeChild(document.getElementById(clickDiv.id + "_clone"));
                var oEvent = e || window.event;
                var xx = oEvent.clientX;
                var yy = oEvent.clientY;
                if (xx >= 350) {
                    var div = $("#" + editor.scene.uuid + " .selected")[0];
                    var text = div.childNodes[0].childNodes[1].innerHTML;
                    createEventFrame((xx-350)+"px",(yy-40)+"px", editor.selected[div.id], text+"事件");
                }
            }
            clickDiv = undefined;
        }
    }
    document.addEventListener("mousedown",down);
    document.addEventListener("mousemove",move);
    document.addEventListener("mouseup",up);

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

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');
    eventBody.dom.appendChild(svg);
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill','none');
    path.setAttribute('d','M100 100 L200 200');
    path.style.stroke = "#0000ff";
    path.style.opacity = "0";
    svg.appendChild(path);

    var isDraw = false;
    var startDiv;
    var M_X,M_Y;
    function down(e){
        var div = event.srcElement;
        if(div.className == "eventOut" && div.getAttribute("link")==null){
            isDraw = true;
            startDiv = div;
            var xx = div.getBoundingClientRect().left;
            var yy = div.getBoundingClientRect().top;
            M_X = xx-350;
            M_Y = yy-60;
        }
    }
    function move(e){
        e.preventDefault();
        var oEvent = e || window.event;
        var xx = oEvent.clientX;
        var yy = oEvent.clientY;
        if(isDraw) {
            path.style.opacity = "1";
            path.setAttribute('d', 'M' + M_X + " " + M_Y + ' L' + (xx-350) + " " + (yy-60));
        }
    }
    function up(e){
        isDraw = false;
        path.style.opacity = "0";
        var xx = event.srcElement.getBoundingClientRect().left - 365;
        var yy = event.srcElement.getBoundingClientRect().top -60;
        if(startDiv != undefined) {
            if (startDiv.className == "eventOut" && event.srcElement.className == "eventIn") {
                if(startDiv.getAttribute("link")==null && event.srcElement.getAttribute("link")==null) {
                    var numArray = [];
                    var count = 1;
                    function getTextNum(text){
                        var value = text.replace(/[^0-9]/ig, "");
                        if (value != NaN) {
                            numArray.push(parseInt(value));  //加入数组
                            numArray.sort(compare);  //数组排序
                        }
                    }
                    function compare(value1, value2) {
                        if (value1 < value2) return -1;
                        else if (value1 > value2) return 1;
                        else return 0;
                    }
                    if (document.getElementsByTagName("svg")[0].childNodes[1]) {
                        var paths = document.getElementsByTagName("svg")[0].childNodes;
                        for(var i=0;i<paths.length;i++){
                            getTextNum(paths[i].id);
                        }

                        if(numArray.length>0) count = numArray[numArray.length - 1] + 1;
                    }
                    drawLine("path"+count,startDiv,event.srcElement,M_X,M_Y,xx,yy);
                }
            }
            startDiv = undefined;
        }
    }
    document.addEventListener("mousedown",down);
    document.addEventListener("mousemove",move);
    document.addEventListener("mouseup",up);

    var eventAttribute = new UI.createDiv("eventAttribute",eventBody);
    eventAttribute.setId('eventAttribute');
    eventAttribute.dom.style.display = "none";
    eventAttribute.dom.style.top = "100px";
    eventAttribute.dom.style.left = "700px";
    var attHeader = new UI.createDiv("attHeader",eventAttribute,"事件属性");
    var attHeaderClose=new UI.createDiv('attHeaderClose',attHeader);
    attHeaderClose.onClick(function(){
        eventAttribute.dom.style.display="none"
    });
    var attHeaderHidden = new UI.createDiv('attHeaderHidden',attHeader);
    attHeaderHidden.onClick(function(){
        if( attOption.dom.style.display=="none") {
            attOption.dom.style.display="block";
            attHeader.dom.style.borderRadius = "5px 5px 0 0";
        }
        else {
            attOption.dom.style.display="none";
            attHeader.dom.style.borderRadius = "5px";
        }
    });
    var attOption = new UI.createDiv("attOption",eventAttribute);

    createAttributeContext(attOption);

})();
var isDraw = true;
function initDrawLine(){
    var allEventOut = document.getElementsByClassName("eventOut");
    for(var i=0;i<allEventOut.length;i++){
        if(allEventOut[i].getAttribute("link")){
            var id = allEventOut[i].getAttribute("link");
            var allEventIn = document.getElementsByClassName("eventIn");
            for(var j=0;j<allEventIn.length;j++) {
                if (allEventIn[j].getAttribute("link") && allEventIn[j].getAttribute("link") == id) {
                    var start_X = allEventOut[i].getBoundingClientRect().left - 350;
                    var start_Y = allEventOut[i].getBoundingClientRect().top - 60;
                    var end_X = allEventIn[j].getBoundingClientRect().left - 365;
                    var end_Y = allEventIn[j].getBoundingClientRect().top - 60;
                    drawLine(id, allEventOut[i], allEventIn[j], start_X, start_Y, end_X, end_Y);
                }
            }
        }
    }
    isDraw = false;
}
function drawLine(pathId,startDiv,endDiv,start_X,start_Y,end_X,end_Y){
    var C_X1 = start_X + 150, C_Y1 = start_Y;
    var C_X2 = end_X-80, C_Y2 = end_Y;
    var svg = document.getElementsByTagName("svg")[0];

    var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.id = pathId;
    path2.setAttribute('fill', 'none');
    path2.setAttribute('d','M'+(start_X+50)+" "+start_Y+' C'+" "+C_X1+" "+C_Y1+" "+ C_X2+" "+C_Y2+" "+end_X+" "+end_Y);
    path2.style.stroke = "#00ff00";
    svg.appendChild(path2);

    startDiv.setAttribute("link", path2.id);
    endDiv.setAttribute("link", path2.id);
    var frameId1 = startDiv.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    var objId1 = frameId1.substr(0, 36);
    var type1 = startDiv.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML;
    var num1 = 0;
    var div1 = startDiv.parentNode.parentNode.childNodes;
    for(var i=0;i<div1.length;i++){
        if(div1[i] == startDiv.parentNode) num1=i;
    }

    var frameId2 = endDiv.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    var objId2 = frameId2.substr(0, 36);
    var type2 = endDiv.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML;
    var num2 = 0;
    var div2 = endDiv.parentNode.parentNode.childNodes;
    for(var j=0;j<div2.length;j++){
        if(div2[j] == endDiv.parentNode) num2=j;
    }
    editor.eventObj[objId2].event.lib[type2].children[num2].last=editor.eventObj[objId1].event.lib[type1].children[num1];
    editor.eventObj[objId1].event.lib[type1].children[num1].next=editor.eventObj[objId2].event.lib[type2].children[num2];
    editor.attibuteArr[objId1][type1][startDiv.parentNode.childNodes[3].innerHTML].outLink = path2.id;
    editor.attibuteArr[objId2][type2][endDiv.parentNode.childNodes[3].innerHTML].inLink = path2.id;

}
function createEventFrame(left,top,obj,frameName,lib){
    if(document.getElementById(obj.uuid+"-eventFrame")) return;

    //var obj = editor.selected[id];
    obj.event = new eventSystem.event(obj);
    editor.eventObj[obj.uuid] = obj;
    editor.attibuteArr[obj.uuid] = {};
    var eventBody = document.getElementById("eventOptions").childNodes[1];
    var eventFrame = new UI.Panel();
    eventFrame.setClass("eventFrame");
    eventFrame.setId(obj.uuid+"-eventFrame");
    eventFrame.dom.style.border = "1px solid #838383";
    eventFrame.dom.style.left = left;
    eventFrame.dom.style.top = top;
    eventBody.appendChild(eventFrame.dom);
    eventFrame.onClick(function(){
        var allFrame = document.getElementsByClassName("eventFrame");
        for(var i= 0;i<allFrame.length;i++){
            allFrame[i].style.border = "none";
        }
        eventFrame.dom.style.border = "1px solid #BBA11E";
    });

    var eventFrameHead = new UI.createDiv('eventFrameHead', eventFrame );
    var eventFrameClose = new UI.createDiv('eventFrameClose', eventFrameHead, "×");
    var eventFrameName = new UI.createDiv('eventFrameName', eventFrameHead, frameName);
    eventFrameName.dom.style.paddingLeft = "20px";
    eventFrameClose.onClick(function(){
        var allEventOut = $("#"+eventFrame.dom.id+" .eventOut");
        if(allEventOut.length>0){
            for(var i=0;i<allEventOut.length;i++){
                if(allEventOut[i].getAttribute("link") != null) removePath("eventOut",allEventOut[i]);
            }
        }
        var allEventIn = $("#"+eventFrame.dom.id+" .eventIn");
        if(allEventIn.length>0){
            for(var j=0;j<allEventIn.length;j++){
                if(allEventIn[j].getAttribute("link") != null) removePath("eventIn",allEventIn[j]);
            }
        }

        var allEvent = $("#"+eventFrame.dom.id+" .Event");
        if(allEvent.length>0){
            for(var m=0;m<allEvent.length;m++){
                var eventType = allEvent[m].parentNode.parentNode.childNodes[0].childNodes[1].innerHTML;
                var eventName = allEvent[m].childNodes[3].innerHTML;
                closeEventAttribute(eventType,eventName);
            }
        }
        eventBody.removeChild(eventFrame.dom);
        delete editor.eventObj[obj.uuid].event;
    });
    var eventFrameBody = new UI.createDiv('eventFrameBody', eventFrame);
    function createEventList(type,text){
        editor.attibuteArr[obj.uuid][type] = {};
        var eventListContent = new UI.createDiv("eventListContent",eventFrameBody);
        var eventList = new UI.createDiv("eventList",eventListContent);
        eventList.dom.style.height = "30px";
        var eventListAdd = new UI.createDiv('eventListAdd', eventList, "＋");
        eventListAdd.dom.style.fontSize = "14px";
        eventListAdd.dom.style.fontWeight = "bold";
        var eventListName = new UI.createDiv('eventListName', eventList, text);
        eventListName.dom.style.width = "auto";
        eventListName.dom.style.textAlign = "left";
        eventListName.dom.style.marginLeft = "5px";
        var eventContent = new UI.createDiv("eventContent",eventListContent);
        eventListAdd.onClick(function(){
            try {
                var name = prompt('请输入子事件名称！', '').replace(/(^\s*)|(\s*$)/g, "");
                if (name) {
                    var allEvent = eventContent.dom.childNodes;
                    if (allEvent.length > 0) {
                        for (var i = 0; i < allEvent.length; i++) {
                            if (allEvent[i].childNodes[3].innerHTML == name) {
                                alert("当前类型已存在该名称！");
                                return;
                            }
                        }
                    }

                    addEvent(name);
                    editor.attibuteArr[obj.uuid][type][name].inLink = "no";
                    editor.attibuteArr[obj.uuid][type][name].outLink = "no";
                }
                else alert("子事件名称未输入！");
            }catch(e){}
        });

        if(lib != undefined){
            for(var i in lib){
                if(type == i){
                    for(var j in lib[i]){

                        addEvent(j,"init");
                        editor.attibuteArr[obj.uuid][i][j].inLink = lib[i][j].inLink;
                        editor.attibuteArr[obj.uuid][i][j].outLink = lib[i][j].outLink;
                    }
                }
            }

        }

        function addEvent(name,addType){
            editor.attibuteArr[obj.uuid][type][name] = {};
            var Event = new UI.createDiv("Event", eventContent);
            Event.dom.style.height = "20px";
            var eventIn = new UI.createDiv('eventIn', Event, "•in");
            eventIn.dom.style.marginLeft = "15px";
            var eventDel = new UI.createDiv('eventDel', Event, "－");
            var eventOut = new UI.createDiv('eventOut', Event, "out•");
            eventOut.dom.style.float = "right";
            eventOut.dom.style.marginRight = "15px";
            var eventName = new UI.createDiv('eventName', Event, name);
            eventName.onClick(function () {
                changeAttributeValue(name, text, obj);
            });
            eventDel.onClick(function () {
                if (eventIn.dom.getAttribute("link") != null) removePath("eventIn", eventIn.dom);
                if (eventOut.dom.getAttribute("link") != null) removePath("eventOut", eventOut.dom);

                var count = 0;
                var div = Event.dom.parentNode.childNodes;
                for (var j = 0; j < div.length; j++) {
                    if (div[j] == Event.dom) count = j + 1;
                }
                editor.eventObj[obj.uuid].event.lib[type].children.splice(count - 1, count);
                eventContent.dom.removeChild(Event.dom);

                closeEventAttribute(text, name);
                changePathPosition();
            });
            if(type == "moveEvent") {
                if(addType == undefined) {
                    editor.attibuteArr[obj.uuid][type][name].position = {
                        //x: obj.position.x + ( obj.getWorldPosition().x - obj.position.x),
                        //y: obj.position.y + ( obj.getWorldPosition().y - obj.position.y),
                        //z: obj.position.z + ( obj.getWorldPosition().z - obj.position.z)
                        x: 0, y: 0, z: 0
                    };
                    editor.attibuteArr[obj.uuid][type][name].rotation = {
                        //x: (obj.rotation.x + (obj.getWorldRotation().x - obj.rotation.x)) / (Math.PI / 180),
                        //y: (obj.rotation.y + (obj.getWorldRotation().y - obj.rotation.y)) / (Math.PI / 180),
                        //z: (obj.rotation.z + (obj.getWorldRotation().z - obj.rotation.z)) / (Math.PI / 180)
                        x: 0, y: 0, z: 0
                    };
                    editor.attibuteArr[obj.uuid][type][name].scale = {
                        //x: obj.scale.x,
                        //y: obj.scale.y,
                        //z: obj.scale.z
                        x: 1, y: 1, z: 1
                    };
                }
                else{
                    editor.attibuteArr[obj.uuid][type][name].position = {
                        x: lib[type][name].position.x,
                        y: lib[type][name].position.y,
                        z: lib[type][name].position.z
                        //x: 0, y: 0, z: 0
                    };
                    editor.attibuteArr[obj.uuid][type][name].rotation = {
                        x: lib[type][name].rotation.x,
                        y: lib[type][name].rotation.y,
                        z: lib[type][name].rotation.z
                        //x: 0, y: 0, z: 0
                    };
                    editor.attibuteArr[obj.uuid][type][name].scale = {
                        x: lib[type][name].scale.x,
                        y: lib[type][name].scale.y,
                        z: lib[type][name].scale.z
                        //x: 0, y: 0, z: 0
                    };
                }
            }
            if(type == "materialEvent") {
                if(addType == undefined) {
                    editor.attibuteArr[obj.uuid][type][name].color = "#FFFFFF";
                    $("#eventAttribute .UV_color_panel")[0].style.display = "none";
                }
                else{
                    editor.attibuteArr[obj.uuid][type][name].color = lib[type][name].color;
                }
            }
            changeAttributeValue(name, text, obj);
            changePathPosition();

            if(addType != undefined){
                if(lib[type][name].inLink != "no") eventIn.dom.setAttribute("link", lib[type][name].inLink);
                if(lib[type][name].outLink != "no")eventOut.dom.setAttribute("link", lib[type][name].outLink);


            }
            var attribute = editor.attibuteArr[obj.uuid][type][name];
            obj.event.addAttribute(type, attribute);
        }
        return eventListContent;
    }

    var mouseEvent = createEventList("mouseEvent","mouseEvent");
    var moveEvent = createEventList("moveEvent","moveEvent");
    var materialEvent = createEventList("materialEvent","materialEvent");
    materialEvent.dom.style.borderRadius = "0 0 5px 5px";
    materialEvent.dom.style.paddingBottom = "6px";

}
function createAttributeContext(attOption){
    var att_eventName = new UI.createDiv("att",attOption,"事件名称：");
    var att_eventName_text = new UI.createDiv("att_text",att_eventName,"事件名称");

    var att_belongType = new UI.createDiv("att",attOption,"所属类型：");
    var att_belongType_text = new UI.createDiv("att_text",att_belongType,"所属类型");

    var att_eventObj = new UI.createDiv("att",attOption,"所属物体：");
    var att_eventObj_text = new UI.createDiv("att_text",att_eventObj,"所属物体");

    function getData(){
        var length = att_eventObj_text.dom.id.length;
        var objUuid = att_eventObj_text.dom.id.slice(0,length-5);
        var type = att_belongType_text.dom.innerHTML;
        var name = att_eventName_text.dom.innerHTML;
        return [objUuid,type,name];
    }

    var att_eventMoveContent = new UI.createDiv('',attOption);
    var att_eventPosition = new UI.createDiv('att',att_eventMoveContent,"物体移动：");
    var att_eventPosition_text = new UI.createDiv('att_text',att_eventPosition);
    new UI.createDiv('att_text_text',att_eventPosition_text,'X:');
    var tX = new UI.createDiv('att_text_input',att_eventPosition_text,null,'n');
    new UI.createDiv('att_text_text',att_eventPosition_text,'Y:');
    var tY = new UI.createDiv('att_text_input',att_eventPosition_text,null,'n');
    new UI.createDiv('att_text_text',att_eventPosition_text,'Z:');
    var tZ = new UI.createDiv('att_text_input',att_eventPosition_text,null,'n');
    tX.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].position.x = parseInt(tX.dom.value);
    });
    tY.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].position.y = parseInt(tY.dom.value);
    });
    tZ.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].position.z = parseInt(tZ.dom.value);
    });

    var att_eventRotation = new UI.createDiv('att',att_eventMoveContent,"物体旋转：");
    var att_eventRotation_text = new UI.createDiv('att_text',att_eventRotation);
    new UI.createDiv('att_text_text',att_eventRotation_text,'X:');
    var rX = new UI.createDiv('att_text_input',att_eventRotation_text,null,'n');
    new UI.createDiv('att_text_text',att_eventRotation_text,'Y:');
    var rY = new UI.createDiv('att_text_input',att_eventRotation_text,null,'n');
    new UI.createDiv('att_text_text',att_eventRotation_text,'Z:');
    var rZ = new UI.createDiv('att_text_input',att_eventRotation_text,null,'n');
    rX.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].rotation.x = parseInt(rX.dom.value);
    });
    rY.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].rotation.y = parseInt(rY.dom.value);
    });
    rZ.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].rotation.z = parseInt(rZ.dom.value);
    });

    var att_eventScale = new UI.createDiv('att',att_eventMoveContent,"物体缩放：");
    var att_eventScale_text = new UI.createDiv('att_text',att_eventScale);
    new UI.createDiv('att_text_text',att_eventScale_text,'X:');
    var sX = new UI.createDiv('att_text_input',att_eventScale_text,null,'n');
    new UI.createDiv('att_text_text',att_eventScale_text,'Y:');
    var sY = new UI.createDiv('att_text_input',att_eventScale_text,null,'n');
    new UI.createDiv('att_text_text',att_eventScale_text,'Z:');
    var sZ = new UI.createDiv('att_text_input',att_eventScale_text,null,'n');
    sX.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].scale.x = parseInt(sX.dom.value);
    });
    sY.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].scale.y = parseInt(sY.dom.value);
    });
    sZ.onChange(function(){
        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].scale.z = parseInt(sZ.dom.value);
    });

    var att_eventType_content = new UI.createDiv("eventTypeContent",attOption);
    var att_eventType = new UI.createDiv("att",att_eventType_content,"事件类型：");

    var Span_cp = new UI.createDiv("cp",att_eventType,"down","sp");
    Span_cp.dom.id  = "eventTypeList";
    Span_cp.dom.style.marginRight = "36px";
    //Span_cp.dom.style.display="none";
    var Span_blk = new UI.createDiv("blk",Span_cp,"","sp");
    var Span_triangle = new UI.createDiv("triangle",Span_blk,"","sp");
    var ul = new UI.createDiv("ul",att_eventType_content,"","u");
    ul.dom.style.display="none";
    ul.dom.style.marginRight = "41px";
    ul.dom.style.marginBottom = "5px";
    ul.dom.style.marginTop = "-3px";
    Span_cp.onClick(function(e){
        if(ul.dom.style.display=="none"){
            ul.dom.style.display="block";
            att_eventType_content.dom.style.height = "120px";
            if (e.stopPropagation) e.stopPropagation();
            else e.cancelBubble = true;

            //创建li
            var liNames = ["down","move","up"];
            for(var i=0;i<liNames.length;i++) {
                var li = new UI.createDiv("li", ul, liNames[i], "l");
                li.onClick(function () {
                    Span_cp.dom.removeChild(Span_cp.dom.firstChild);
                    var text = document.createTextNode(event.srcElement.innerHTML);
                    Span_cp.dom.insertBefore(text, Span_cp.dom.firstChild);

                    var length = att_eventObj_text.dom.id.length;
                    var objUuid = att_eventObj_text.dom.id.slice(0,length-5);
                    var type = att_belongType_text.dom.innerHTML;
                    var name = att_eventName_text.dom.innerHTML;
                    editor.attibuteArr[objUuid][type][name].eventType = event.srcElement.innerHTML;
                    hideUl();
                })
            }
        }
        else hideUl();

    });
    //隐藏Ul
    function hideUl(){
        ul.dom.style.display="none";
        att_eventType_content.dom.style.height = "30px";
        //移除li
        while(ul.dom.hasChildNodes()) //当ul下还存在子节点时 循环继续
        {
            ul.dom.removeChild(ul.dom.firstChild);
        }
    }

    var att_eventMaterialContent = new UI.createDiv("",attOption);
    var att_eventMaterial = new UI.createDiv("att",att_eventMaterialContent,"材质颜色：");
    var att_eventMaterial_text = new UI.createDiv("att_text",att_eventMaterial,"#000000");
    att_eventMaterial_text.dom.style.width = "60px";
    att_eventMaterial_text.dom.style.textAlign = "center";
    att_eventMaterial_text.dom.style.marginRight = "120px";
    att_eventMaterial_text.dom.style.color = "#000000";
    att_eventMaterial_text.dom.style.backgroundColor = "#FFFFFF";
    att_eventMaterial_text.dom.onmouseover=function(){
        att_eventMaterial_text.dom.style.cursor = "pointer";
    };
    var mColorOption = new UI.createDiv('UV_color_panel',att_eventMaterialContent);
    mColorOption.dom.style.marginTop = "3px";
    var mColor = UI.createDiv('ui-color-picker',mColorOption);
    mColor.dom.style.backgroundColor = "#555555";
    mColorOption.dom.style.display='none';
    att_eventMaterial_text.onClick(function(){
        if(mColorOption.dom.style.display=='none'){
            mColorOption.dom.style.display='block';
            att_eventMaterialContent.dom.style.height = "150px";
        }
        else{
            mColorOption.dom.style.display='none';
            att_eventMaterialContent.dom.style.height = "30px";
        }
    });
    $(mColor.dom).attr("value","#FFFFFF");
    $(mColor.dom).on("click",function(){
        var value = mColor.dom.getAttribute("value");
        att_eventMaterial_text.dom.innerHTML = value;

        var info = getData();
        editor.attibuteArr[info[0]][info[1]][info[2]].color = value;
    });
}
function changeAttributeValue(name,type,obj){
    var eventAttribute = document.getElementById("eventAttribute");
    if(eventAttribute.style.display != "block"){
        eventAttribute.style.display = "block";
    }
    var attOption = eventAttribute.childNodes[1];
    var nameDiv = attOption.childNodes[0].childNodes[1];
    nameDiv.innerHTML = name;
    var typeDiv = attOption.childNodes[1].childNodes[1];
    typeDiv.innerHTML = type;
    var objNameDiv = attOption.childNodes[2].childNodes[1];
    objNameDiv.id = obj.uuid+"-name";
    objNameDiv.innerHTML = obj.name;

    editor.attibuteArr[obj.uuid][type][name].name = name;
    editor.attibuteArr[obj.uuid][type][name].type = type;
    editor.attibuteArr[obj.uuid][type][name].objName = obj.name;

    var att_eventMoveContent = attOption.childNodes[3];
    if(type=="moveEvent") {
        att_eventMoveContent.style.display = "block";
        var positionDiv = att_eventMoveContent.childNodes[0].childNodes[1];
        positionDiv.childNodes[1].value = editor.attibuteArr[obj.uuid][type][name].position.x;
        positionDiv.childNodes[3].value = editor.attibuteArr[obj.uuid][type][name].position.y;
        positionDiv.childNodes[5].value = editor.attibuteArr[obj.uuid][type][name].position.z;
        var rotationDiv = att_eventMoveContent.childNodes[1].childNodes[1];
        rotationDiv.childNodes[1].value = editor.attibuteArr[obj.uuid][type][name].rotation.x;
        rotationDiv.childNodes[3].value = editor.attibuteArr[obj.uuid][type][name].rotation.y;
        rotationDiv.childNodes[5].value = editor.attibuteArr[obj.uuid][type][name].rotation.z;
        var scaleDiv = att_eventMoveContent.childNodes[2].childNodes[1];
        scaleDiv.childNodes[1].value = editor.attibuteArr[obj.uuid][type][name].scale.x;
        scaleDiv.childNodes[3].value = editor.attibuteArr[obj.uuid][type][name].scale.y;
        scaleDiv.childNodes[5].value = editor.attibuteArr[obj.uuid][type][name].scale.z;
    }
    else att_eventMoveContent.style.display = "none";

    var eventType = attOption.childNodes[4];
    if(type=="mouseEvent") {
        eventType.style.display = "block";
        eventType.childNodes[0].childNodes[1].childNodes[0].nodeValue = editor.attibuteArr[obj.uuid][type][name].eventType;
        if(eventType.childNodes[0].childNodes[1].childNodes[0].nodeValue=="undefined"){
            eventType.childNodes[0].childNodes[1].childNodes[0].nodeValue = "down";
            editor.attibuteArr[obj.uuid][type][name].eventType = "down";
        }
    }
    else eventType.style.display = "none";

    var eventColor = attOption.childNodes[5];
    if(type=="materialEvent") {
        eventColor.style.display = "block";
        eventColor.childNodes[0].childNodes[1].innerHTML = editor.attibuteArr[obj.uuid][type][name].color;
    }
    else eventColor.style.display = "none";
}
function changePathPosition(){
    var paths = document.getElementsByTagName("path");
    if(paths.length > 1){
        for(var i=1;i<paths.length;i++){
            var text = paths[i].id;
            var eventInDiv,eventOutDiv;
            var allEventOut = document.getElementsByClassName("eventOut");
            for(var m=0;m<allEventOut.length;m++){
                if(allEventOut[m].getAttribute("link") != null && allEventOut[m].getAttribute("link")==text){
                    eventOutDiv = allEventOut[m];
                }
            }
            var allEventIn = document.getElementsByClassName("eventIn");
            for(var n=0;n<allEventIn.length;n++){
                if(allEventIn[n].getAttribute("link") != null && allEventIn[n].getAttribute("link")==text){
                    eventInDiv = allEventIn[n];
                }
            }
            if(eventInDiv != undefined && eventOutDiv != undefined){
                var out_X = eventOutDiv.getBoundingClientRect().left - 350;
                var out_Y = eventOutDiv.getBoundingClientRect().top - 60;
                var in_X = eventInDiv.getBoundingClientRect().left - 365;
                var in_Y = eventInDiv.getBoundingClientRect().top - 60;
                var C_X1 = out_X+150;
                var C_Y1 = out_Y;
                var C_X2 = in_X-80;
                var C_Y2 = in_Y;
                paths[i].setAttribute('d', 'M' + (out_X+50) + " " + out_Y + ' C' + " " + C_X1 + " " + C_Y1 + " " + C_X2 + " " + C_Y2 + " " + in_X + " " + in_Y);
            }
        }
    }
}
function removePath(iType,typeDiv){
    var id = typeDiv.getAttribute("link");
    if(document.getElementById(id)) {
        var svg = document.getElementsByTagName("svg")[0];
        svg.removeChild(document.getElementById(id));
        var disEvent;
        if(iType == "eventOut") disEvent = document.getElementsByClassName("eventIn");
        if(iType == "eventIn") disEvent = document.getElementsByClassName("eventOut");
        for(var v=0;v<disEvent.length;v++){
            if(disEvent[v].getAttribute("link") != null && disEvent[v].getAttribute("link")==id){
                disEvent[v].removeAttribute("link");
                var frameId = disEvent[v].parentNode.parentNode.parentNode.parentNode.parentNode.id;
                var objId = frameId.substr(0, 36);
                var type = disEvent[v].parentNode.parentNode.parentNode.childNodes[0].childNodes[1].innerHTML;
                var num = 0;
                var div = disEvent[v].parentNode.parentNode.childNodes;
                for(var u=0;u<div.length;u++){
                    if(div[u] == disEvent[v].parentNode) num=u;
                }
                if(iType == "eventOut") editor.eventObj[objId].event.lib[type].children[num].last=null;
                if(iType == "eventIn") editor.eventObj[objId].event.lib[type].children[num].next=null;
            }
        }
    }
}
function closeEventAttribute(type,name){
    var eventAttribute = document.getElementById("eventAttribute");
    var attOption = eventAttribute.childNodes[1];
    var nameDivText = attOption.childNodes[0].childNodes[1].innerHTML;
    var typeDivText = attOption.childNodes[1].childNodes[1].innerHTML;
    if(nameDivText == name && typeDivText == type){
        eventAttribute.style.display = "none";
    }
}
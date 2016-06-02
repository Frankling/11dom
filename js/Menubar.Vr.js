var arr = [],camerV = {};
var arrNum;
var pointArr = [];
var pointNum = 0;
var rotatinCamer = new THREE.Vector3();

Menubar.Vr = function (editor) {

    var viewport= document.getElementById("viewport");

    var container = new UI.Panel().setClass('menu');
    var menuName = new UI.createDiv('title',container);
    menuName.dom.style.backgroundImage="url('image/vr.png')";
    menuName.onClick(function () {
        if(sidePanel.dom.style.display=="inline-block"){
            sidePanel.dom.style.display="none";
            return
        }
        $(".side_panel").css("display","none");
        sidePanel.dom.style.display="inline-block";
    });

    var sidePanel = new UI.createDiv('side_panel',container);
    sidePanel.setTop('40px');

    var panelHeader = new UI.createDiv('panel-header',sidePanel,'场景列表');
    var panelClose = new UI.createDiv('panel-close',panelHeader);
    panelClose.onClick(function(){
        sidePanel.dom.style.display="none";
    });
    var attributeList =new UI.createDiv('attributeList',sidePanel);
    attributeList.dom.style.height="calc(100% - 62px)";

    //2D background setup
    var bgAttr = new UI.createDiv('',attributeList);
    var bgHeader = new UI.createDiv('attrHeader',bgAttr,'全局');
    var bgHiddenArrow = new UI.createDiv('attrTriPng',bgHeader);
    var bgHelp = new UI.createDiv('attrHelp',bgHeader);

    bgHeader.onClick(function () {
        if (bgContent.dom.style.display == "none") {
            bgContent.dom.style.display = "block";
            bgHiddenArrow.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            bgContent.dom.style.display = "none";
            bgHiddenArrow.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });

    var bgContent = new UI.createDiv('Attr_Content',bgAttr);
    var open3D = new  UI.createDiv('attrRow',bgContent);
    new UI.createDiv('text',open3D,'3D');
    var _3dSwitch=new  UI.createDiv('OffButton',open3D);
    _3dSwitch.onClick(function () {
        if (_3dSwitch.dom.className === "OffButton") {
            _3dSwitch.setClass("onButton");
            editor.enable2D=false;
        } else {
            _3dSwitch.setClass("OffButton");
            editor.enable2D = true;
        }
        editor.allObject3D.traverse(function(child){
            if (child instanceof THREE.Mesh) {
                if (child.material) {
                    if(child.material.envMap){
                        if (child.material.envMap.mapping == 302 || child.material.envMap.mapping == 304) {
                            editor.signals.envmappingChange.dispatch(child.material, 302);
                        }
                        if (child.material.envMap.mapping == 301 || child.material.envMap.mapping == 305) {
                            editor.signals.envmappingChange.dispatch(child.material, 301);
                        }
                    }
                    child.material.needsUpdate = true;
                    editor.signals.sceneGraphChanged.dispatch();
                }
            }
        });
        editor.signals.sceneGraphChanged.dispatch();
        editor.onToggleShaders(editor.composer);
    });


    //=================天空盒========================

    var skyBoxAttr = new UI.createDiv('',attributeList);
    var skyBoxHeader = new UI.createDiv('attrHeader',skyBoxAttr,'天空盒');
    var skyBoxHiddenArrow = new UI.createDiv('attrTriPng',skyBoxHeader);
    var skyBoxHelp = new UI.createDiv('attrHelp',skyBoxHeader);

    skyBoxHeader.onClick(function () {
        if (skyBoxContent.dom.style.display == "none") {
            skyBoxContent.dom.style.display = "block";
            skyBoxHiddenArrow.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            skyBoxContent.dom.style.display = "none";
            skyBoxHiddenArrow.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });

    var skyBoxContent = new UI.createDiv('Attr_Content',skyBoxAttr);

    //天空盒列表
    var skyBoxListContent = new UI.createDiv('ListContent',skyBoxContent,"",'tb');
    var skyBoxListContentTr1 = new UI.createDiv('ListContentTr1', skyBoxListContent, "", 'tr');

    var addSkyBoxContent= new UI.createDiv('panel-footer',skyBoxContent);

    //"添加天空盒"按钮
    var addSkyBox =  new UI.createDiv('free-group',addSkyBoxContent,'添加天空盒','b');
    addSkyBox.dom.style.width="140px";
    addSkyBox.dom.style.marginRight = "80px";
    addSkyBox.onClick(function(){
        var reply = judgeHotSpotCount();
        if(reply =="no"){
            alert("请先确定热点位置！");
        }
        else creatSkyBoxTableDiv(skyBoxListContentTr1);
    });

    //设置自动命名的编号数字
    function setNameNum(nameType){
        var numArray = [];
        if ($(".skyBoxListContentTd")) {
            //console.log(nameType);
            var allTd = document.getElementsByClassName("skyBoxListContentTd");
            for (var i = 0; i < allTd.length; i++) {
                if (nameType == "boxName") {
                    var text = allTd[i].childNodes[0].innerHTML;
                    if (text.slice(0, 3) == "天空盒") {
                        getTextNum(text);
                    }
                }
                if(nameType == "hotName"){
                    var allHotTd = allTd[i].childNodes[6].childNodes[0].childNodes[0].childNodes;
                    //console.log(allHotTd.length);
                    for (var j = 0; j < allHotTd.length; j++) {
                        //console.log(allHotTd[j].childNodes[0]);
                        var HotText = allHotTd[j].childNodes[0].innerHTML;
                        if (HotText.slice(0, 2) == "热点") {
                            getTextNum(HotText);
                        }
                    }
                }
            }
        }

        function getTextNum(text){
            var value = text.replace(/[^0-9]/ig, "");  //获取文本中的数字
            if (value != NaN) {
                numArray.push(parseInt(value));  //加入数组
                numArray.sort(compare);  //数组排序
            }
        }

        function compare(value1, value2) {
            if (value1 < value2) {
                return -1;
            } else if (value1 > value2) {
                return 1;
            } else {
                return 0;
            }
        }

        var count;
        if(nameType == "boxName") {
            if (numArray.length > 0) {
                //if($(".skyBoxListContentTd").length==1){
                //
                //}
                if (numArray.length == $(".skyBoxListContentTd").length) {
                    if (numArray.length > numArray[numArray.length - 1]) count = numArray.length + 1;
                    else count = numArray[numArray.length - 1] + 1;
                }
                //else if()
                else {
                    //var rent = $(".skyBoxListContentTd").length - numArray.length;
                    //if (numArray.length > numArray[numArray.length - 1])
                    count = $(".skyBoxListContentTd").length + 1;
                    //else count = numArray[numArray.length - 1] + rent;
                }

            }
            else count = $(".skyBoxListContentTd").length + 1;
        }
        else if(nameType == "hotName"){
            if (numArray.length > 0) {
                if (numArray.length > numArray[numArray.length - 1]) count = numArray.length + 1;
                else count = numArray[numArray.length - 1] + 1;
            }
            else count = 1;
        }
        return count;
    }

    //重命名
    reName = function(div,parent,type){
        var oldName = div.innerHTML;
        var inputDiv = document.createElement("input");
        inputDiv.className = "inputDiv";
        inputDiv.style.float = "left";
        inputDiv.offsetWidth = 10;
        inputDiv.value = div.innerHTML;
        inputDiv.focus();
        parent.dom.replaceChild(inputDiv,div);

        inputDiv.onblur = function(){
            div.innerHTML = inputDiv.value;
            parent.dom.replaceChild(div,inputDiv);
            if(type == "box"){

                updateName("cp",oldName,div.innerHTML);
                updateName("hotSpotLabelBody",oldName,div.innerHTML);
            }

        };


        //document.onkeydown = function(event){
        //    var e = event || window.event || arguments.callee.caller.arguments[0];
        //    if( e && e.keyCode == 13){
        //        div.innerHTML = inputDiv.value;
        //        parent.dom.replaceChild(div,inputDiv);
        //    }
        //};
    };

    function updateName(DivClassname,oldText,newText){
        if($("."+DivClassname)){
            var divs = document.getElementsByClassName(DivClassname);
            for(var i=0;i<divs.length;i++){
                function getInnerText(element){
                    return (typeof element.textContent == "string") ?element.textContent : element.innerText;
                }
                var a= getInnerText(divs[i]);
                if(a == oldText){
                    divs[i].removeChild(divs[i].firstChild);
                    var text = document.createTextNode(newText);
                    divs[i].insertBefore(text,divs[i].firstChild);
                }
            }
        }
    }

    //设置环境值
    function setEnvValue(value){
        editor.lightGlobal.intensity = value/50;
        editor.signals.sceneGraphChanged.dispatch();
    }
    //设置雾效值
    function setFogValue(value){
        editor.sceneGlobal.fog.density = value/1000000;
        editor.scene.fog.density = value/100000;
        editor.signals.sceneGraphChanged.dispatch();
    }
//创建重复天空盒子==================================================================================================
    creatSkyBoxTableDiv = function (Parent) {

        var count = setNameNum("boxName");

        //创建块==============
        var skyBoxListContentTd = new UI.createDiv('skyBoxListContentTd', Parent, "", 'td');
        skyBoxListContentTd.dom.id = "skyBoxListContentTd"+count;

        var skyBoxName = new UI.createDiv('skyBoxName', skyBoxListContentTd,'天空盒'+count);
        skyBoxName.dom.id = "boxName"+count;
        skyBoxName.dom.ondblclick = function(){
            var oldName = skyBoxName.dom.innerHTML;
            //console.log(oldName);
            reName(this,skyBoxListContentTd,"box");
            //console.log(skyBoxName.dom.innerHTML);
        };
        //删除块==============
        var skyBoxDelete = new UI.createDiv('skyBoxDelete',skyBoxListContentTd);
        skyBoxDelete.onClick(function(){
            var reply = judgeHotSpotCount();
            if(reply =="no"){
                alert("请先确定热点位置！");
            }
            else{
                var skyboxs = document.getElementsByClassName("skyBoxListContentTd");
                if(skyboxs.length==1){
                    alert("最后一个天空盒不可删除！");
                    return;
                }
                //删除热点
                var allHotTd = skyBoxListContentTd.dom.childNodes[6].childNodes[0].childNodes[0].childNodes;
                for (var m = 0; m < allHotTd.length; m++) {
                    var id = allHotTd[m].id;
                    var n = id.replace(/[^0-9]/ig, "");
                    if($("#hotSpotLabelBody"+n)){
                        var hotspotId = document.getElementById("hotSpotLabelBody"+n).parentNode.id;
                        removeLabel(editor,hotspotId);
                        delete pointArr[n-1];
                        //delete camerV[n-1];
                        //console.log(camerV);
                        //console.log(pointArr);
                    }
                }

                //更改热点对象
                var skyBoxName1 = document.getElementsByClassName("skyBoxName")[0];
                updateName("cp", skyBoxName.dom.innerHTML, skyBoxName1.innerHTML);
                updateName("hotSpotLabelBody", skyBoxName.dom.innerHTML, skyBoxName1.innerHTML);

                Parent.dom.removeChild(skyBoxListContentTd.dom);
                viewport.removeChild(skyBoxPanel.dom);
                if(arr[c]) arr[c]="";
                for( var j=0;j<arr.length;j++){
                    if(arr[j] || arr[j]!=""){
                        editor.CreatSkybox(arr[j]);
                        arrNum = j;
                        hideHotSpot(j+1);
                        return;
                    }
                }

            }
        });

        //环境
        var bgPic = new  UI.createDiv('attrRow',skyBoxListContentTd);
        new UI.createDiv('text',bgPic,'环境');
        var bgBox = new UI.createDiv('box2',bgPic);
        var bgBoxImg = new UI.createDiv('butImg',bgBox);

        bgBox.onClick(function(event){
            $(bg_color_container.dom).toggle();
        });
        var bg_color_container = new UI.createDiv('UV_color',skyBoxListContentTd);
        var bgColorTitle = new UI.createDiv('tab',bg_color_container);
        var bgTitle = new UI.createDiv('text',bgColorTitle,'贴图');
        var colorTitle = new UI.createDiv('text',bgColorTitle,'颜色');
        bgTitle.dom.style.backgroundColor="#000";
        bgTitle.onClick(function(){
            bgTitle.dom.style.background='#000';
            colorTitle.dom.style.background='#232323';
            bgPanel.dom.style.display = "block";
            colorPanel.dom.style.display = "none";
        });
        colorTitle.onClick(function(){
            colorTitle.dom.style.background='#000';
            bgTitle.dom.style.background='#232323';
            colorPanel.dom.style.display = "block";
            bgPanel.dom.style.display = "none";
        });

        var bgPanel = new UI.createDiv('UV_color_panel',bg_color_container);
        var bgImgArea = new UI.createDiv('imgArea',bgPanel);
        var bgLib = new UI.createDiv('option',bgPanel,'库');
        var bgDiy = new UI.createDiv('option',bgPanel,'自定义');
        var colorPanel = new UI.createDiv('UV_color_panel',bg_color_container);
        var lightColor = UI.createDiv('ui-color-picker',colorPanel);
        UIColorPicker.add(lightColor.dom);
        lightColor.onClick(function(){

            //var color= lightColor.dom.getAttribute("value").substring(1);
            //editor.lightGlobal.color.setHex("0x"+color);
            //editor.signals.sceneGraphChanged.dispatch();
        });

        colorPanel.dom.style.display='none';
        bgImgArea.onClick(function(){
            skyBoxPanel.dom.style.display = "block";
        });
        bgDiy.onClick(function(){
            skyBoxPanel.dom.style.display = "block";
        });
        var bgUpload =  new UI.createDiv('bgUpload',bgPanel,null,'i');
        bgUpload.dom.type = "file";
        bgUpload.dom.style.display = "none";
        bgUpload.onChange(function(event){
            var fileName = document.getElementsByClassName("bgUpload")[0].value;
            var extension = fileName.split('.').pop().toLowerCase();
            if ((extension == 'jpg' || extension == 'png') && extension) {
                var reader = new FileReader();
                reader.onload = function() {
                    var contents = reader.result;
                    bgImgArea.dom.style.backgroundImage = "url(" + contents + ")";
                    bgImgArea.dom.style.backgroundSize = "120px 100px";
                    bgBoxImg.dom.style.backgroundImage = "url(" + contents + ")";
                    bgImgArea.dom.style.backgroundSize = "120px 100px";
                    editor.planbox.material.map.image.src = contents;
                    editor.planbox.material.map.needsUpdate = true;
                    /* for(var i in editor.alladdenvMap){
                     var mesh=editor.scene.getObjectById(editor.alladdenvMap[i]);
                     if (mesh instanceof THREE.Mesh) {
                     if (mesh.material) {
                     if (mesh.material.envMap.mapping == 302 || mesh.material.envMap.mapping == 304) {
                     editor.signals.envmappingChange.dispatch(mesh.material, 302);
                     }
                     if (mesh.material.envMap.mapping == 301 || mesh.material.envMap.mapping == 305) {
                     editor.signals.envmappingChange.dispatch(mesh.material, 301);
                     }
                     mesh.material.needsUpdate = true;
                     editor.signals.sceneGraphChanged.dispatch();
                     }
                     }

                     }*/
                    editor.signals.sceneGraphChanged.dispatch();
                };
                reader.readAsDataURL(event.target.files[0]);
                editor.signals.sceneGraphChanged.dispatch();

            }
        });
        var bgBars=new  UI.createDiv('range',bgPic);
        var bgLightRange = new  UI.createDiv('',bgBars,null,'i');
        bgLightRange.dom.id = "LightRange"+count;
        bgLightRange.dom.type="range";
        bgLightRange.dom.value="50";
        $(bgLightRange.dom).on("input change",function(){
            bgLightValue.setValue(bgLightRange.dom.value);
            if(count == (arrNum+1)) setEnvValue(bgLightRange.dom.value);
        });

        var bgLightValue = new UI.createDiv('value',bgPic,null,'i');
        bgLightValue.dom.value="50";
        $(bgLightValue.dom).on("input change",function(){
            bgLightRange.dom.value=Number(bgLightValue.dom.value)||0;
            $('input[type="range"]').trigger("input");
        });

        editor.signals.initTHREE.initBackground.add(function(){
            if (editor.enable2D) {
                _3dSwitch.setClass("OffButton");
            } else {
                _3dSwitch.setClass("onButton");
            }

            bgLightRange.dom.value=parseFloat(dataBase.background.lightGlobalI)*50;
            $('input[type="range"]').trigger("input");
        });


        //雾效
        var scenariosFog = new UI.createDiv("attrRow",skyBoxListContentTd);
        var fogText = new UI.createDiv("text",scenariosFog,"雾效");
        var fogAddTwo = new UI.createDiv("box2",scenariosFog);
        fogAddTwo.onClick(function(){
            $(FogPalette.dom).toggle();
        });
        var fogAdd = new UI.createDiv("butImg",fogAddTwo);

        var FogLevelStyle = new UI.createDiv("range",scenariosFog);
        var FogLevel = new UI.createDiv("",FogLevelStyle,null,"i").setValue("0");
        FogLevel.dom.id = "FogLevel"+count;
        FogLevel.dom.type = "range";
        FogLevel.dom.oninput = function () {
            FogLevelText.setValue(FogLevel.dom.value);
            if(count == (arrNum+1)) setFogValue(FogLevel.dom.value);
        };

        var FogLevelText = new UI.createDiv("value",scenariosFog,null,"i").setValue("0");
        FogLevelText.dom.oninput = (function () {
            FogLevel.setValue(FogLevelText.dom.value);
            $(FogLevel.dom).trigger("input");
        });

        //雾效-弹出框
        var FogPalette = new UI.createDiv("UV_color",skyBoxListContentTd);
        FogPalette.dom.style.display = "none";

        var FogTitleChoose = new UI.createDiv("tab",FogPalette);

        var FogColorPickerTitle = new UI.createDiv("text",FogTitleChoose,"颜色");

        /*默认颜色按钮背景颜色*/
        FogColorPickerTitle.dom.style.backgroundColor="#000";
        var FogBackgroundBodyChoose = new UI.createDiv("UV_color_panel",FogPalette);

        var FogColorPickerChoose = new UI.createDiv("ui-color-picker",FogBackgroundBodyChoose);
        UIColorPicker.add(FogColorPickerChoose.dom);

        FogBackgroundBodyChoose.onClick(function( event ){
            var color=FogColorPickerChoose.dom.getAttribute("value");
            editor.sceneGlobal.fog.color .setHex("0x"+color);
            editor.scene.fog.color .setHex("0x"+color);
            editor.signals.sceneGraphChanged.dispatch();
            fogAdd.dom.style.backgroundColor = "#"+color;
        });

        //获取id编号数字
        var num;
        if($(".skyBoxListContentTd")){
            var alltd = document.getElementsByClassName("skyBoxListContentTd");
            var text = alltd[alltd.length-1].id;
            num = text.replace(/[^0-9]/ig, "");
        }

        //3D天空盒自定义弹出面板
        var skyBoxPanel = new UI.Panel().setClass('skyBoxPanel');
        skyBoxPanel.dom.style.display = "none";
        skyBoxPanel.setId("skyBoxPanel"+num);
        document.getElementById("viewport").appendChild(skyBoxPanel.dom);

        var SkyBoxUp = new UI.createDiv('skyBoxOption',skyBoxPanel,'SkyBoxUp');
        SkyBoxUp.onClick(function(){
            SkyBoxUpUpload.dom.click();
        });

        var SkyBoxUpUpload = new UI.createDiv('fileUpload',SkyBoxUp,null,'i');
        SkyBoxUpUpload.dom.type = "file";
        SkyBoxUpUpload.onChange(function(e){
            editor.UploadSkybox(SkyBoxUp,2,e);
        });
        var SkyBoxDn =  new UI.createDiv('skyBoxOption',skyBoxPanel,'SkyBoxDn');
        SkyBoxDn.setTop("260px");
        SkyBoxDn.onClick(function(){
            SkyBoxDnUpload.dom.click();
        });

        var SkyBoxDnUpload = new UI.createDiv('fileUpload',SkyBoxDn,null,'i');
        SkyBoxDnUpload.dom.type = "file";
        SkyBoxDnUpload.onChange(function(e){
            editor.UploadSkybox(SkyBoxDn,3,e);
        });

        var SkyBoxFr = new UI.createDiv('skyBoxOption',skyBoxPanel,'SkyBoxFr');
        SkyBoxFr.setTop(  "140px"  );
        SkyBoxFr.setLeft( "380px" );
        SkyBoxFr.onClick(function(){
            SkyBoxFrUpload.dom.click();
        });
        var SkyBoxFrUpload =  new UI.createDiv('fileUpload',SkyBoxFr,null,'i');
        SkyBoxFrUpload.dom.type = "file";
        SkyBoxFrUpload.onChange(function(e){
            editor.UploadSkybox(SkyBoxFr,5,e);
        });

        var SkyBoxBk =  new UI.createDiv('skyBoxOption',skyBoxPanel,'SkyBoxBk');
        SkyBoxBk.setTop(  "140px"  );
        SkyBoxBk.onClick(function(){
            SkyBoxBkUpload.dom.click();
        });

        var SkyBoxBkUpload = new UI.createDiv('fileUpload',SkyBoxBk,null,'i');
        SkyBoxBkUpload.dom.type = "file";
        SkyBoxBkUpload.onChange(function(e){
            editor.UploadSkybox(SkyBoxBk,4,e);
        });

        var SkyBoxLf = new UI.createDiv('skyBoxOption',skyBoxPanel,'SkyBoxLf');
        SkyBoxLf.setTop(  "140px"  );
        SkyBoxLf.setLeft( "20px" );
        SkyBoxLf.onClick(function(){
            SkyBoxLfUpload.dom.click();
        });

        var SkyBoxLfUpload = new UI.createDiv('fileUpload',SkyBoxLf,null,'i');
        SkyBoxLfUpload.dom.type = "file";
        SkyBoxLfUpload.onChange(function(e){
            editor.UploadSkybox(SkyBoxLf,1,e);
        });

        var SkyBoxRt =  new UI.createDiv('skyBoxOption',skyBoxPanel,'SkyBoxRt');
        SkyBoxRt.setTop(  "140px"  );
        SkyBoxRt.setLeft( "260px" );
        SkyBoxRt.onClick(function(){
            SkyBoxRtUpload.dom.click();
        });

        var SkyBoxRtUpload = new UI.createDiv('fileUpload',SkyBoxRt,null,'i');
        SkyBoxRtUpload.dom.type = "file";
        SkyBoxRtUpload.onChange(function(e){
            editor.UploadSkybox(SkyBoxRt,0,e);
        });

        function getCount(divID){
            if($(".skyBoxPanel")){
                var allskyBoxPanel = document.getElementsByClassName("skyBoxPanel");

                for(var i=0;i<allskyBoxPanel.length;i++){
                    if(allskyBoxPanel[i].id == divID){
                        var value = allskyBoxPanel[i].id.replace(/[^0-9]/ig, "");
                        //console.log(value-1);
                        return (value-1);
                    }
                }
            }
        }

        var c = getCount(skyBoxPanel.dom.id);
        var SkyBoxSure = new UI.createDiv('SkyBoxSureNo',skyBoxPanel,'创建');
        SkyBoxSure.onClick(function(){
            arr[c] = [];
            if(editor.materialsri.length == 6){
                for(var i= 0 ;i<6;i++){
                    arr[c][i] = editor.materialsri[i];
                }

                setNoBackgroundImage();
                bgImgArea.dom.style.backgroundImage = "url("+ arr[c][5] +")";
                bgImgArea.dom.style.backgroundSize = "120px 100px";
                skyBoxPanel.dom.style.display = "none";
                editor.materialsri.length =0;
            }
            else{
                //setNoBackgroundImage();
                alert("请上传满足6张图");
            }
            for( var j=0;j<arr.length;j++){
                if(arr[j] || arr[j]!=""){
                    editor.CreatSkybox(arr[j]);
                    arrNum = j;
                    hideHotSpot(j+1);
                    return;
                }
            }
        });

        function setNoBackgroundImage(){
            SkyBoxUp.dom.style.backgroundImage = "none";
            SkyBoxDn.dom.style.backgroundImage = "none";
            SkyBoxFr.dom.style.backgroundImage = "none";
            SkyBoxBk.dom.style.backgroundImage = "none";
            SkyBoxLf.dom.style.backgroundImage = "none";
            SkyBoxRt.dom.style.backgroundImage = "none";
        }

        var SkyBoxNo = new UI.createDiv('SkyBoxSureNo',skyBoxPanel,'关闭');
        SkyBoxNo.setLeft( "440px" );
        SkyBoxNo.onClick(function(){
            skyBoxPanel.dom.style.display = "none";
            setNoBackgroundImage();
        });

        var hotSpotContent = new UI.createDiv('Attr_Content',skyBoxListContentTd);
        //hotSpotContent.dom.style.float = "left";
        //热点列表
        var hotSpotListContent = new UI.createDiv('ListContent',hotSpotContent,"",'tb');
        var hotSpotListContentTr1 = new UI.createDiv('ListContentTr1', hotSpotListContent, "", 'tr');

        //"添加热点"按钮
        var addHotSpot =  new UI.createDiv('free-group',hotSpotContent,'添加热点','b');
        addHotSpot.dom.style.width="100px";
        addHotSpot.dom.style.marginRight = "85px";
        addHotSpot.dom.style.marginBottom = "5px";
        //addHotSpot.onClick(function(){
        //    if(addButtonContent.dom.style.display == "none"){
        //        addButtonContent.dom.style.display = "block";
        //    }
        //    else{
        //        addButtonContent.dom.style.display = "none";
        //    }
        //});

        //var addButtonContent =  new UI.createDiv('addButtonContent',hotSpotContent);
        //addButtonContent.dom.style.display = "none";
        //
        //var defaultHotSpot =  new UI.createDiv('free-group',addButtonContent,'默认热点','b');
        //defaultHotSpot.dom.style.width="120px";
        //defaultHotSpot.dom.style.marginLeft = "10px";
        //defaultHotSpot.dom.style.marginBottom = "5px";
        //defaultHotSpot.dom.style.float = "left";
        //
        //var definedHotSpot =  new UI.createDiv('free-group',addButtonContent,'自定义热点','b');
        //definedHotSpot.dom.style.width="120px";
        //definedHotSpot.dom.style.marginRight = "10px";
        //definedHotSpot.dom.style.marginBottom = "5px";
        //definedHotSpot.dom.style.float = "right";
        addHotSpot.onClick(function(){
            if(editor.enable2D == false){
                var reply = judgeHotSpotCount();
                if(reply =="no"){
                    alert("请先确定热点位置！");
                }
                else{
                    var allskyTd = document.getElementsByClassName("skyBoxListContentTd");
                    for(var i=0;i<allskyTd.length;i++){
                        var n = allskyTd[i].id.replace(/[^0-9]/ig, "");
                        if(!arr[n-1]){
                            alert("您还有天空盒图片未上传！");
                            return;
                        }
                    }

                    createHotSpotTableDiv(hotSpotListContentTr1);
                    viewport.style.cursor="cell";
                    viewport.addEventListener("mousedown",addLabel,false);
                    viewport.addEventListener("mouseup",cancelAddLabel,false);
                }
            }
            else alert("请先开启3D开关！");
        });
    };

    //热点列表
    createHotSpotTableDiv = function(Parent){
        var count;
        if($(".hotSpotListContentTd")) count = setNameNum("hotName");
        else count=1;

        editor.camerVNum = count-1;
        pointNum = count-1;
        //创建块==============
        var hotSpotListContentTd = new UI.createDiv('hotSpotListContentTd', Parent, "", 'td');
        hotSpotListContentTd.dom.id = "hotSpotListContentTd"+count;
        var hotSpotName = new UI.createDiv('hotSpotName', hotSpotListContentTd,'热点'+count);
        hotSpotName.dom.ondblclick = function(){
            //reName(this,hotSpotListContentTd,"hotSpot");
        };

        //删除块==============
        var hotSpotDelete = new UI.createDiv('skyBoxDelete',hotSpotListContentTd);
        hotSpotDelete.onClick(function(){
            var reply = judgeHotSpotCount();
            if(reply =="no"){
                alert("请先确定热点位置！");
            }
            else{
                Parent.dom.removeChild(hotSpotListContentTd.dom);

                var n = hotSpotListContentTd.dom.id.replace(/[^0-9]/ig, "");
                if($("#hotSpotLabelBody"+n)){
                    var hotspotId = document.getElementById("hotSpotLabelBody"+n).parentNode.id;
                    removeLabel(editor,hotspotId);
                    delete pointArr[n-1];
                    //delete camerV[n-1];
                    //console.log(camerV);
                    //console.log(pointArr);
                }
            }
        });

        //选择图标
        var SelectIconContent = new UI.createDiv('SelectIconContent',hotSpotListContentTd);

        var SelectIconName = new UI.createDiv('SelectIconName', SelectIconContent,'选择热点图标');
        SelectIconName.dom.style.marginLeft = "15px";
        var IconContent = new UI.createDiv('IconContent', SelectIconContent);
        //SelectIconName.dom.style.marginLeft = "15px";
        for(var i=0;i<6;i++){
            var IconImg = new UI.createDiv('IconImg', IconContent);
            IconImg.dom.id = "IconImg"+count+(i+1);
            IconImg.dom.style.backgroundImage = "url('image/gif/new_spotd"+(i+1)+"_gif.png')";
            document.getElementById("IconImg"+count+1).style.border = "1px solid #00ff00";
            IconImg.onClick(function(){
                var reply = judgeHotSpotCount();
                if(reply =="no"){
                    alert("请先确定热点位置！");
                }
                else{
                    var id = event.srcElement.id;
                    var idd = id.substring(8,9);
                    document.getElementById(id).style.border = "1px solid #00ff00";
                    document.getElementById("hotSpotLabelImg"+count).style.backgroundImage = "url('image/gif/new_spotd"+idd+"_gif.png')";
                    var allIcon = document.getElementsByClassName("IconImg");
                    for(var j=0;j<allIcon.length;j++){
                        if(allIcon[j].id.substring(7,8)==id.substring(7,8) && allIcon[j].id !=id){
                            allIcon[j].style.border = "none";
                        }
                    }
                }

            })
        }

        var IsLinkContent = new UI.createDiv('scltDiv',hotSpotListContentTd);
        var IslinkName = new UI.createDiv('hotSpotName', IsLinkContent,'链接天空盒');
        IslinkName.dom.style.marginLeft = "15px";

        var linkSwitch=new  UI.createDiv('closeLink',IsLinkContent);
        linkSwitch.onClick(function () {
            if (linkSwitch.dom.className === "closeLink") {
                var reply = judgeHotSpotCount();
                if(reply =="no"){
                    alert("请先确定热点位置！");
                }
                else{
                    linkSwitch.setClass("openLink");

                    hotSpotListContentTd.dom.removeChild(document.getElementById("InputContent"+count));
                    hotSpotListContentTd.dom.removeChild(document.getElementById("InputUrlContent"+count));

                    createLink();
                }
            } else {
                linkSwitch.setClass("closeLink");

                hotSpotListContentTd.dom.removeChild(document.getElementById("linkContent"+count));

                createInput();
                var hotSpotLabel = document.getElementById("hotSpotLabelBody"+count);
                hotSpotLabel.innerHTML = "请输入内容";

                //var hotspot = hotSpotLabel.parentNode;
                //var a = document.createElement("a");
                //a.href = "http://www.11dom.com/index.php?s=/Models/Index/modelsContentDetail/id/313.html";
                //a.target = "_blank";
                //hotspot.appendChild(a);
                //var img = hotspot.childNodes[1];
                //a.appendChild(img);
            }
        });

        createInput();

        function createLink(){
            var linkContent = new UI.createDiv('scltDiv',hotSpotListContentTd);
            linkContent.dom.id = "linkContent"+count;

            var linkSkyBoxName = new UI.createDiv('hotSpotName', linkContent,'请选择：');
            linkSkyBoxName.dom.style.marginLeft = "25px";

            var Span_cp = new UI.createDiv("cp",linkContent,"--请选择天空盒--","sp");
            Span_cp.dom.id = "slct"+count;
            Span_cp.dom.style.marginRight = "10px";
            Span_cp.dom.style.marginTop = "6px";

            var Span_blk = new UI.createDiv("blk",Span_cp,"","sp");
            var Span_triangle = new UI.createDiv("triangle",Span_blk,"","sp");

            var ul = new UI.createDiv("",linkContent,"","u");
            ul.dom.id = "list";
            ul.dom.style.marginRight = "10px";
            ul.dom.style.marginBottom = "5px";

            Span_cp.onClick(function(e){

                if(ul.dom.style.display==""){
                    ul.dom.style.display="block";
                    if (e.stopPropagation){
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true;
                    }

                    //创建li
                    var allSkyBoxNames = document.getElementsByClassName("skyBoxName");
                    for (var i = 0; i < allSkyBoxNames.length; i++) {
                        var liName = allSkyBoxNames[i].innerHTML;
                        var li = new UI.createDiv("li", ul, liName, "l");
                        li.onClick(function(){
                            Span_cp.dom.removeChild(Span_cp.dom.firstChild);
                            var text = document.createTextNode(event.srcElement.innerHTML);
                            Span_cp.dom.insertBefore(text,Span_cp.dom.firstChild);
                            Span_cp.dom.style.textAlign = "center";

                            //console.log(event.srcElement.innerHTML);
                            changeHotSpot(hotSpotListContentTd.dom.id, event.srcElement.innerHTML);
                            hideUl();
                        })
                    }
                }
                else{
                    hideUl();
                }

            });

            //隐藏Ul
            function hideUl(){
                ul.dom.style.display="";
                //移除li
                while(ul.dom.hasChildNodes()) //当ul下还存在子节点时 循环继续
                {
                    ul.dom.removeChild(ul.dom.firstChild);
                }
            }
            document.addEventListener("click",function(event){
                if(event.srcElement.id =="list" || event.srcElement.className =="free-group")  hideUl();
            },true);
        }

        function createInput(){
            var InputContent = new UI.createDiv('scltDiv',hotSpotListContentTd);
            //InputContent.dom.style.display = "block";
            InputContent.dom.id = "InputContent"+count;
            var InputName = new UI.createDiv('hotSpotName', InputContent,'请输入内容');
            InputName.dom.style.marginLeft = "30px";
            var Input = new UI.createDiv('input', InputContent,'','i');
            Input.dom.type = "text";
            Input.dom.id = "Input"+count;
            Input.dom.value = "请输入内容";
            Input.dom.onblur = function(){
                //var hotspotName = document.getElementById("hotSpotLabelBody"+count).innerHTML;
                changeHotSpot(hotSpotListContentTd.dom.id,Input.dom.value);

            };


            var InputUrlContent = new UI.createDiv('scltDiv',hotSpotListContentTd);
            InputUrlContent.dom.id = "InputUrlContent"+count;
            var InputUrlName = new UI.createDiv('hotSpotName', InputUrlContent,'请输入网址：');
            InputUrlName.dom.style.marginLeft = "30px";
            //var InputUrl = new UI.createDiv('inputUrl', InputUrlContent,'','i');
            //InputUrl.dom.type = "url";
            //InputUrl.dom.id = "InputUrl"+count;
            //InputUrl.dom.value = "请输入网址";
            //InputUrl.dom.style.marginLeft = "40px";
            //InputUrl.dom.onblur = function(){
            //
            //};
            var InputUrl = document.createElement("textarea");
            InputUrl.className = 'inputUrl';
            InputUrl.id = "InputUrl"+count;
            InputUrl.wrap="virtual";
            InputUrl.style.border = "none";
            InputUrl.value = "http://www.11dom.com/index.php?s=/Models/Index/modelsContentDetail/id/441.html";
            InputUrl.style.marginLeft = "40px";
            InputUrlContent.dom.appendChild(InputUrl);
        }

        //更换热点名字
        function changeHotSpot(PPPid,name){
            var num = PPPid.replace(/[^0-9]/ig, "");
            var nameDiv = document.getElementById("hotSpotLabelBody"+num);
            nameDiv.innerHTML = name;
        }

    };

    //判断热点个数是否与热点列表的个数一样
    var judgeHotSpotCount = function(){
        var hotSpotCount = document.getElementsByClassName("hotSpotLabelBody").length;
        var hotSpotTdCount = document.getElementsByClassName("hotSpotListContentTd").length;
        if(hotSpotCount < hotSpotTdCount) {
            return "no";
        }
        else {
            return "yes";
        }
    };
    var addLabel=function(e){
        var button=e.button;
        document.body.style.cursor="points";
        if(button==0){
            var intersects=editor.getIntersects(e,[editor.skybox]);
            if(intersects.length>0 && intersects[0].object===editor.skybox){
                var startPoint=intersects[0].point;
                //startPoint.x = -startPoint.x;
                createHotSpot(intersects[0].object,startPoint,editor.camera);
                pointArr[pointNum] = startPoint;
            }
        }
    };
    var cancelAddLabel=function(){
        viewport.style.cursor="default";

        //camerV[editor.camerVNum] = rotatinCamer;
        //camerV.model.push(rotatinCamer);
        //camerV.arrt = obj.uuid;
        //console.log(rotatinCamer);
        //console.log(camerV[pointNum].x);
        viewport.removeEventListener("mousedown",addLabel,false);
        viewport.removeEventListener("mouseup",cancelAddLabel,false);
        viewport.focus();
    };
    var createHotSpot = function(mesh,point,camera){
        //console.log(point);
        var projector=new THREE.Projector();
        var label;
        var label2d;

        var count;
        if($(".hotSpotListContentTd")) count = setNameNum("hotName")-1;
        else count=1;

        var createSprite=function(){

            var map = new THREE.TextureLoader().load( "image/label.png" );
            var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
            var sprite=new THREE.Sprite(material);
            sprite.display="block";

            return sprite;
        };

        var createHotSpotLabel=function(){
            var hotSpotLabel=new UI.Panel();
            hotSpotLabel.setClass("hotSpotLabel");
            hotSpotLabel.dom.style.display="block";
            var hotSpotLabelBody=new UI.createDiv('hotSpotLabelBody',hotSpotLabel,"请输入内容");
            hotSpotLabelBody.dom.id = "hotSpotLabelBody"+count;

            var hotSpotLabelImg = UI.createDiv('hotSpotLabelImg',hotSpotLabel);
            hotSpotLabelImg.dom.id = "hotSpotLabelImg"+count;
            if($("#hotSpotListContentTd"+count).childNodes){
                var length = document.getElementById("hotSpotListContentTd"+count).childNodes.length;
                var allIcon = document.getElementById("hotSpotListContentTd"+count).childNodes[length-1].childNodes[1].childNodes;
                for(var n=0;n<allIcon.length;n++){
                    if(allIcon[n].style.borderWidth !=""){
                        hotSpotLabelImg.dom.style.backgroundImage = "url('image/gif/new_spotd"+(n+1)+"_gif.png')";
                    }
                }
            }


            return hotSpotLabel;
        };

        var merge=function(){
            label2d=createHotSpotLabel();
            label=createSprite();
            //label.scale.x=label.scale.y=label.scale.z=1000;

            var distance=point.distanceTo(camera.position);
            //console.log(distance);
            var realy=new THREE.Vector3(camera.position.x/distance,camera.position.y/distance,camera.position.z/distance);
            label.position.copy(new THREE.Vector3().copy(point).add(realy).sub(mesh.getWorldPosition()));
            //console.log(mesh.getWorldPosition())
            label2d.setId(label.uuid+"V");
            editor.camerVNuB[label.uuid+"T"] = new THREE.Vector2();
            editor.camerVNuB[label.uuid+"T"].x = editor.camera.rotation.x;
            editor.camerVNuB[label.uuid+"T"].y = editor.camera.rotation.y;
            label2d.dom.onclick = function(){

                var nu = label2d.dom.childNodes[0].id.replace(/[^0-9]/ig, "");
                var className = document.getElementById("hotSpotListContentTd"+nu).childNodes[3].childNodes[1].className;
                if(className == "closeLink"){
                    var href = document.getElementById("hotSpotListContentTd"+nu).childNodes[5].childNodes[1].value;
                    console.log(href);
                    window.open(href,'','height=500,width=1100,top=100,left=100');
                }
                else{
                    var cp = document.getElementById("hotSpotListContentTd"+nu).childNodes[4].childNodes[1];
                    if(cp.innerHTML.substring(3,9) == "请选择天空盒"){
                        alert("请选择需要链接的天空盒！");
                        return;
                    }

                    var allSkyName = document.getElementsByClassName("skyBoxName");
                    for(var i=0;i<allSkyName.length;i++){
                        if(allSkyName[i].innerHTML == label2d.dom.childNodes[0].innerHTML){
                            var num =allSkyName[i].id.replace(/[^0-9]/ig, "");

                            editor.CreatSkybox(arr[num - 1]);
                            updateHotSpotPosition(label);
                            arrNum = num - 1;


                            var env = document.getElementById("LightRange"+num);
                            setEnvValue(env.value);

                            var fog = document.getElementById("FogLevel"+num);
                            setFogValue(fog.value);

                            hideHotSpot(num);
                            return;
                        }

                    }
                }
            };

            projector.projectVector(point,camera);
            var left = ( point.x + 1) / 2 * viewport.offsetWidth;
            var top = ( -point.y + 1) / 2 * viewport.offsetHeight;
            var topDiv=0,leftDiv=0;
            label2d.dom.style.top=top+topDiv+"px";
            label2d.dom.style.left=left+leftDiv+"px";
            
            mesh.add(label);
            viewport.appendChild(label2d.dom);
            editor.labels2[label.uuid]=label;
            editor.signals.addLabel.dispatch(label);

            updateHotSpotPosition(editor.labels2[label.uuid],editor.camerVNum);
        };
        merge();

        if($(".hotSpotLabelBody")) hideHotSpot(arrNum+1);
    };

    //隐藏热点
    function hideHotSpot(num){
        var curId = "skyBoxListContentTd"+num;
        var allHotSpots = document.getElementsByClassName("hotSpotListContentTd");
        for(var i=0;i<allHotSpots.length;i++){
            var id=allHotSpots[i].parentNode.parentNode.parentNode.parentNode.id;
            var co = allHotSpots[i].id.replace(/[^0-9]/ig, "");
            //console.log(document.getElementById("hotSpotLabelBody"+co).parentNode);
            if($("hotSpotLabelBody"+co)) {
                if(id != curId) {
                    document.getElementById("hotSpotLabelBody"+co).parentNode.style.display="none";
                }

                else  document.getElementById("hotSpotLabelBody"+co).parentNode.style.display="block";
            }
        }

    }

    //移除热点
    var removeLabel=function(editor,labelID){
        var l=labelID.length-1;
        var str=labelID.substring(0,l);

        delete editor.labels2[str];
        editor.signals.removeLabel.dispatch(editor.labels2[str]);
        document.getElementById("viewport").removeChild(document.getElementById(labelID));
        editor.removeObject(editor.labels2[str]);
    };

    return container;
};

//更新热点位置
var updateHotSpotPosition=function(obj){
    obj.material.opacity = 0;
    //editor.skybox.scale.x = -1;
    obj.position.x = - obj.position.x;
    var viewport=document.getElementById("viewport");
    var projector=new THREE.Projector();
    var point=obj.getWorldPosition();
    var point2d=new THREE.Vector3().copy(point);
    projector.projectVector(point2d,editor.camera);
    var children= document.getElementById(obj.uuid+"V");
    obj.position.copy(new THREE.Vector3().copy(point).sub(obj.parent.getWorldPosition()));
    var num = children.childNodes[0].id.replace(/[^0-9]/ig, "");
    var skyboxId = document.getElementById("hotSpotListContentTd"+num).parentNode.parentNode.parentNode.parentNode.id;
    var co = skyboxId.replace(/[^0-9]/ig, "");
    if(co == (arrNum+1)){
        //console.log(editor.camerVNuB[obj.uuid+"T"].x);
        var x = Math.abs(editor.camera.rotation.x - editor.camerVNuB[obj.uuid+"T"].x);
        var y = Math.abs(editor.camera.rotation.y - editor.camerVNuB[obj.uuid+"T"].y);
        var _x = 2*Math.PI - x ;
        var _y = 2*Math.PI - y ;
        if(_x < x) x = _x;
        if(_y < y) y = _y;
        if (x < 2 && y < 2 ) {
            children.style.display = "block";
            var left = ( point2d.x + 1 ) / 2 * viewport.offsetWidth;
            var top  = ( -point2d.y + 1 ) / 2 * viewport.offsetHeight;
            var topDiv = 25, leftDiv = 0;
            children.style.left = left + leftDiv + "px";
            children.style.top  = top + topDiv + "px";
        } else {
            children.style.display = "none";
        }
    }

};
Menubar.Vr = function (editor) {

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


    var bgPic = new  UI.createDiv('attrRow',bgContent);
    new UI.createDiv('text',bgPic,'环境');
    var bgBox = new UI.createDiv('box2',bgPic);
    var bgBoxImg = new UI.createDiv('butImg',bgBox);
    bgBox.onClick(function(){
        $(bg_color_container.dom).toggle();
    });
    var bg_color_container = new UI.createDiv('UV_color',bgContent);
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
    lightColor.onClick(function(){
        var color= lightColor.dom.getAttribute("value").substring(1);
        editor.lightGlobal.color.setHex("0x"+color);
        editor.signals.sceneGraphChanged.dispatch();
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
    bgLightRange.dom.type="range";
    bgLightRange.dom.value="50";
    $(bgLightRange.dom).on("input change",function(){
        bgLightValue.setValue(bgLightRange.dom.value);
        editor.lightGlobal.intensity = bgLightRange.dom.value/50;
        editor.signals.sceneGraphChanged.dispatch();
    });

    var bgLightValue = new UI.createDiv('value',bgPic,null,'i');
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
    //3D天空盒自定义弹出面板
    var skyBoxPanel = new UI.Panel().setClass('skyBoxPanel');
    skyBoxPanel.dom.style.display = "none";
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

    var SkyBoxSure = new UI.createDiv('SkyBoxSureNo',skyBoxPanel,'创建');
    SkyBoxSure.onClick(function(){
        if(editor.materialsri.length == 6){
            editor.CreatSkybox();
            bgImgArea.dom.style.backgroundImage = "url("+ editor.materialsri[5] +")";
            bgImgArea.dom.style.backgroundSize = "120px 100px";
            skyBoxPanel.dom.style.display = "none";
        }
        else alert("请上传满足6张图");
    });

    var SkyBoxNo = new UI.createDiv('SkyBoxSureNo',skyBoxPanel,'关闭');
    SkyBoxNo.setLeft( "440px" );
    SkyBoxNo.onClick(function(){
        skyBoxPanel.dom.style.display = "none";
    });
    //雾效
    var scenariosFog = new UI.createDiv("attrRow",bgContent);
    var fogText = new UI.createDiv("text",scenariosFog,"雾效");
    var fogAddTwo = new UI.createDiv("box2",scenariosFog);
    fogAddTwo.onClick(function(){
        $(FogPalette.dom).toggle();
    });
    var fogAdd = new UI.createDiv("butImg",fogAddTwo);

    var FogLevelStyle = new UI.createDiv("range",scenariosFog);
    var FogLevel = new UI.createDiv("",FogLevelStyle,null,"i").setValue("0");
    FogLevel.dom.type = "range";
    FogLevel.dom.oninput = function () {
        FogLevelText.setValue(FogLevel.dom.value);
        editor.sceneGlobal.fog.density = FogLevel.dom.value/1000000;
        editor.scene.fog.density = FogLevel.dom.value/100000;
        editor.signals.sceneGraphChanged.dispatch();
    };

    var FogLevelText = new UI.createDiv("value",scenariosFog,null,"i").setValue("50");
    FogLevelText.dom.oninput = (function () {
        FogLevel.setValue(FogLevelText.dom.value);
        $(FogLevel.dom).trigger("input");
    });

    //雾效-弹出框
    var FogPalette = new UI.createDiv("UV_color",bgContent);
    FogPalette.dom.style.display = "none";

    var FogTitleChoose = new UI.createDiv("tab",FogPalette);

    var FogColorPickerTitle = new UI.createDiv("text",FogTitleChoose,"颜色");

    /*默认颜色按钮背景颜色*/
    FogColorPickerTitle.dom.style.backgroundColor="#000";
    var FogBackgroundBodyChoose = new UI.createDiv("UV_color_panel",FogPalette);

    var FogColorPickerChoose = new UI.createDiv("ui-color-picker",FogBackgroundBodyChoose);
    FogBackgroundBodyChoose.onClick(function( event ){
        var color=FogColorPickerChoose.dom.getAttribute("value").substring(1);
        editor.sceneGlobal.fog.color .setHex("0x"+color);
        editor.scene.fog.color .setHex("0x"+color);
        editor.signals.sceneGraphChanged.dispatch();
        fogAdd.dom.style.backgroundColor = "#"+color;
    });

    return container;
};

Menubar.scenarios = function (editor) {

    var container = new UI.Panel().setClass('menu');
    var menuName = new UI.createDiv('title',container);
    menuName.dom.style.backgroundImage="url('image/scenarios.png')";
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
    var bgPic = new  UI.createDiv('attrRow',bgContent);
    new UI.createDiv('text',bgPic,'背景');
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
        editor.lightBG.color.setHex("0x"+color);
        editor.signals.sceneGraphChanged.dispatch();
    });

    colorPanel.dom.style.display='none';
    bgImgArea.onClick(function(){
        bgUpload.dom.click();
    });
    bgDiy.onClick(function(){
        bgUpload.dom.click();
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
            };
            reader.readAsDataURL(event.target.files[0]);
            editor.signals.sceneGraphChanged.dispatch();

        }
    });
    //bgUpload.setClass('ScenariosInput');
    //ChartletPickerChoose.add(CustomChooseUpload);

    var bgBars=new  UI.createDiv('range',bgPic);
    var bgLightRange = new  UI.createDiv('',bgBars,null,'i');
    bgLightRange.dom.type="range";
    bgLightRange.dom.value="50";
    $(bgLightRange.dom).on("input change",function(){
        bgLightValue.setValue(bgLightRange.dom.value);
        editor.lightBG.intensity = bgLightRange.dom.value/50;
        editor.signals.sceneGraphChanged.dispatch();
    });

    var bgLightValue = new UI.createDiv('value',bgPic,null,'i');
    bgLightValue.dom.value="50";
    $(bgLightValue.dom).on("input change",function(){
        bgLightRange.dom.value=Number(bgLightValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });
    editor.signals.initTHREE.initBackground.add(function(){

        bgLightRange.dom.value=parseFloat(dataBase.background.lightBGI)*50;
        $('input[type="range"]').trigger("input");
    });
    /*================== camera setup=======================================================*/

    var cameraAttr = new UI.createDiv('',attributeList);
    var cameraHeader = new UI.createDiv('attrHeader',cameraAttr,'相机');
    var cameraHiddenArrow = new UI.createDiv('attrTriPng',cameraHeader);
    var cameraHelp = new UI.createDiv('attrHelp',cameraHeader);
    cameraHeader.onClick(function () {
        if (cameraContent.dom.style.display == "none") {
            cameraContent.dom.style.display = "block";
            cameraHiddenArrow.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            cameraContent.dom.style.display = "none";
            cameraHiddenArrow.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var cameraContent = new UI.createDiv('Attr_Content',cameraAttr);
    var cameraType = new UI.createDiv('row_container',cameraContent);
    var rotateCamera = new UI.createDiv('triElement',cameraType,'旋转相机',"b");
    var roamingCamera = new UI.createDiv('triElement',cameraType,'漫游相机',"b");
    var flyingCamera = new  UI.createDiv('triElement',cameraType,'飞行相机',"b");

    rotateCamera.onClick(function(){
        rCameraAttr.dom.style.display='block';
        pCameraAttr.dom.style.display='none';
        fCameraAttr.dom.style.display='none';
        rDampingFactorSwitch.setClass("OffButton");
        rLimitSwitch.setClass("OffButton");
        rPerspectiveSwitch.setClass("OffButton");
        editor.requestLoop = false;
        editor.CameraControls(1);
        editor.signals.sceneGraphChanged.dispatch();
    });
    roamingCamera.onClick(function(){
        pCameraAttr.dom.style.display='block';
        rCameraAttr.dom.style.display='none';
        fCameraAttr.dom.style.display='none';
        pPerspectiveSwitch.setClass("OffButton");
        pSpeedSwitch.setClass("OffButton");
        pHeightSwitch.setClass("OffButton");
        for(var i in editor.traceCamera) {
            delete editor.traceCamera[i];
        }
        editor.requestLoop = true;

        editor.CameraControls(2);
        editor.RenderLoop();
    });
    flyingCamera.onClick(function(){
        fCameraAttr.dom.style.display='block';
        pCameraAttr.dom.style.display='none';
        rCameraAttr.dom.style.display='none';
        fPerspectiveSwitch.setClass("OffButton");
        fSpeedSwitch.setClass("OffButton");
        //pHeightSwitch.setClass("OffButton");
        for(var i in editor.traceCamera) {
            delete editor.traceCamera[i];
        }
        editor.requestLoop = true;
        editor.CameraControls(3);
        editor.RenderLoop();
    });

    var rCameraAttr = new UI.createDiv('',cameraContent);
    //旋转相机-视角
    var rPerspective = new  UI.createDiv('attrRow',rCameraAttr);
    new UI.createDiv('text',rPerspective,'视角');

    var rPerspectiveSwitch=new  UI.createDiv('OffButton',rPerspective);
    rPerspectiveSwitch.setId("rFov");
    rPerspectiveSwitch.onClick(function(){
        if (rPerspectiveSwitch.dom.className === "OffButton") {
            rPerspectiveSwitch.setClass("onButton");
            editor.camera.fov = parseInt(rPerspectiveRange.dom.value);
            editor.camera.updateProjectionMatrix();
        } else {
            rPerspectiveSwitch.setClass("OffButton");
            editor.camera.fov = 45;
            editor.camera.updateProjectionMatrix();
        }
        editor.signals.sceneGraphChanged.dispatch();
    });
    var rPerspectiveBars=new  UI.createDiv('range',rPerspective);
    var rPerspectiveRange = new  UI.createDiv('',rPerspectiveBars,null,'i');
    rPerspectiveRange.dom.type="range";
    rPerspectiveRange.dom.value="50";
    $(rPerspectiveRange.dom).on("input change",function(){
        rPerspectiveValue.setValue(rPerspectiveRange.dom.value);
        if (rPerspectiveSwitch.dom.className === "onButton")
            editor.camera.fov = parseInt(rPerspectiveRange.dom.value);
        editor.camera.updateProjectionMatrix();
        editor.signals.sceneGraphChanged.dispatch();
    });
    var rPerspectiveValue = new UI.createDiv('value',rPerspective,null,'i');
    $(rPerspectiveValue.dom).on("input change",function(){
        rPerspectiveRange.dom.value=Number(rPerspectiveValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });
    //旋转相机-限制
    var rLimit = new  UI.createDiv('attrRow',rCameraAttr);
    new UI.createDiv('text',rLimit,'限制');

    var rLimitSwitch=new  UI.createDiv('OffButton',rLimit);
    rLimitSwitch.setId("rLimit");
    rLimitSwitch.onClick(function(){
        if (rLimitSwitch.dom.className === "OffButton") {
            rLimitSwitch.setClass("onButton");
            editor.CameraControlsGloba(rLimitRange.dom.value,"OrbitLimit");
        } else {
            rLimitSwitch.setClass("OffButton");
            editor.CameraControlsGloba(0,"OrbitLimit");
        }
    });
    var rLimitBars=new  UI.createDiv('range',rLimit);
    var rLimitRange = new  UI.createDiv('',rLimitBars,null,'i');
    rLimitRange.dom.type="range";
    rLimitRange.dom.value="0";
    $(rLimitRange.dom).on("input change",function(){
        rLimitValue.setValue(rLimitRange.dom.value);
        if(rLimitSwitch.dom.className === "onButton")
            editor.CameraControlsGloba(rLimitRange.dom.value,"OrbitLimit");
    });
    var rLimitValue = new UI.createDiv('value',rLimit,null,'i');
    $(rLimitValue.dom).on("input change",function(){
        rLimitRange.dom.value=Number(rLimitValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });

    //旋转相机-阻力
    var rDampingFactor = new  UI.createDiv('attrRow',rCameraAttr);
    new UI.createDiv('text',rDampingFactor,'阻力');
    var rDampingFactorSwitch=new  UI.createDiv('OffButton',rDampingFactor);
    rDampingFactorSwitch.setId("rResistance");
    rDampingFactorSwitch.onClick(function(){
        if (rDampingFactorSwitch.dom.className === "OffButton") {
            rDampingFactorSwitch.setClass("onButton");
            rDampingFactorRange.setValue(editor.controls.dampingFactor*100);
            $('input[type="range"]').trigger("input");
            editor.controls.removeEventListener('change',editor.RenderLoop,false);
            editor.controls.enableDamping = true;
            editor.requestLoop = true;
            editor.RenderLoop();

        } else {
            rDampingFactorSwitch.setClass("OffButton");
            editor.controls.enableDamping = false;
            editor.requestLoop = false;
            editor.controls.addEventListener('change',editor.RenderLoop,false);
        }
    });
    var rDampingFactorBars=new  UI.createDiv('range',rDampingFactor);
    var rDampingFactorRange = new  UI.createDiv('',rDampingFactorBars,null,'i');
    rDampingFactorRange.dom.type="range";
    rDampingFactorRange.dom.value="0";
    $(rDampingFactorRange.dom).on("input change",function(){
        rDampingFactorValue.setValue(rDampingFactorRange.dom.value);
        editor.controls.dampingFactor = rDampingFactorRange.dom.value/100;
    });
    var rDampingFactorValue = new UI.createDiv('value',rDampingFactor,null,'i');
    $(rDampingFactorValue.dom).on("input change",function(){
        rDampingFactorRange.dom.value=Number(rDampingFactorValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });

    var pCameraAttr = new UI.createDiv('',cameraContent);
    pCameraAttr.dom.style.display='none';
    //漫游相机-视角
    var pPerspective = new  UI.createDiv('attrRow',pCameraAttr);
    new UI.createDiv('text',pPerspective,'视角');
    var pPerspectiveSwitch=new  UI.createDiv('OffButton',pPerspective);
    pPerspectiveSwitch.setId("pFov");
    pPerspectiveSwitch.onClick(function(){
        if (pPerspectiveSwitch.dom.className === "OffButton") {
            pPerspectiveSwitch.setClass("onButton");
            editor.camera.fov = parseInt(pPerspectiveRange.dom.value);
        } else {
            pPerspectiveSwitch.setClass("OffButton");
            editor.camera.fov = 45;
        }
        editor.camera.updateProjectionMatrix();
    });
    var pPerspectiveBars=new  UI.createDiv('range',pPerspective);
    var pPerspectiveRange = new  UI.createDiv('',pPerspectiveBars,null,'i');
    pPerspectiveRange.dom.type="range";
    pPerspectiveRange.dom.value="50";
    $(pPerspectiveRange.dom).on("input change",function(){
        pPerspectiveValue.setValue(pPerspectiveRange.dom.value);
        if (pPerspectiveSwitch.dom.className === "onButton")
            editor.camera.fov = parseInt(pPerspectiveRange.dom.value);
        editor.camera.updateProjectionMatrix();
    });
    var pPerspectiveValue = new UI.createDiv('value',pPerspective,null,'i');
    $(pPerspectiveValue.dom).on("input change",function(){
        pPerspectiveRange.dom.value=Number(pPerspectiveValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });
    //漫游相机-速度
    var pSpeed = new  UI.createDiv('attrRow',pCameraAttr);
    new UI.createDiv('text',pSpeed,'速度');
    var pSpeedSwitch=new  UI.createDiv('OffButton',pSpeed);
    pSpeedSwitch.setId("pSpeed");
    pSpeedSwitch.onClick(function(){
        if (pSpeedSwitch.dom.className === "OffButton") {
            pSpeedSwitch.setClass("onButton");
            editor.controls.fast = (pSpeedRange.dom.value)/100;
        } else {
            pSpeedSwitch.setClass("OffButton");
            editor.controls.fast = 0.1;
        }
    });
    var pSpeedBars=new  UI.createDiv('range',pSpeed);
    var pSpeedRange = new  UI.createDiv('',pSpeedBars,null,'i');
    pSpeedRange.dom.type="range";
    pSpeedRange.dom.value="50";
    $(pSpeedRange.dom).on("input change",function(){
        pSpeedValue.setValue(pSpeedRange.dom.value);
        if (pSpeedSwitch.dom.className === "onButton"){
            editor.controls.fast = (pSpeedRange.dom.value)/100;
        }
    });
    var pSpeedValue = new UI.createDiv('value',pSpeed,null,'i');
    $(pSpeedValue.dom).on("input change",function(){
        pSpeedRange.dom.value=Number(pSpeedValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });

    //漫游相机-身高
    var pHeight = new  UI.createDiv('attrRow',pCameraAttr);
    new UI.createDiv('text',pHeight,'身高');
    var pHeightSwitch=new  UI.createDiv('OffButton',pHeight);
    pHeightSwitch.setId("pHight");
    pHeightSwitch.onClick(function(){
        if (pHeightSwitch.dom.className === "OffButton") {
            pHeightSwitch.setClass("onButton");
            editor.controls.height = 10;
        } else {
            pHeightSwitch.setClass("OffButton");
            editor.controls.height = pHeightRange.dom.value;
        }
    });
    var pHeightBars=new  UI.createDiv('range',pHeight);
    var pHeightRange = new  UI.createDiv('',pHeightBars,null,'i');
    pHeightRange.dom.type="range";
    pHeightRange.dom.value="10";
    $(pHeightRange.dom).on("input change",function(){
        pHeightValue.setValue(pHeightRange.dom.value);
        if (pHeightSwitch.dom.className === "onButton"){
            editor.controls.height = pHeightRange.dom.value;
        }
    });
    var pHeightValue = new UI.createDiv('value',pHeight,null,'i');
    $(pHeightValue.dom).on("input change",function(){
        pHeightRange.dom.value=Number(pHeightValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });

    var fCameraAttr = new UI.createDiv('',cameraContent);
    fCameraAttr.dom.style.display='none';
    //飞行相机-视角
    var fPerspective = new  UI.createDiv('attrRow',fCameraAttr);
    new UI.createDiv('text',fPerspective,'视角');
    var fPerspectiveSwitch=new  UI.createDiv('OffButton',fPerspective);
    fPerspectiveSwitch.setId("fFov");
    fPerspectiveSwitch.onClick(function(){
        if (fPerspectiveSwitch.dom.className === "OffButton") {
            fPerspectiveSwitch.setClass("onButton");
            editor.camera.fov = parseInt(fPerspectiveRange.dom.value);
        } else {
            fPerspectiveSwitch.setClass("OffButton");
            editor.camera.fov = 45;
        }
        editor.camera.updateProjectionMatrix();
    });

    var fPerspectiveBars=new  UI.createDiv('range',fPerspective);
    var fPerspectiveRange = new  UI.createDiv('',fPerspectiveBars,null,'i');
    fPerspectiveRange.dom.type="range";
    fPerspectiveRange.dom.value="50";
    $(fPerspectiveRange.dom).on("input change",function(){
        fPerspectiveValue.setValue(fPerspectiveRange.dom.value);
        if (fPerspectiveSwitch.dom.className === "onButton")
            editor.camera.fov = parseInt(fPerspectiveRange.dom.value);
        editor.camera.updateProjectionMatrix();
    });
    var fPerspectiveValue = new UI.createDiv('value',fPerspective,null,'i');
    $(fPerspectiveValue.dom).on("input change",function(){
        fPerspectiveRange.dom.value=Number(fPerspectiveValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });
    //飞行相机-速度
    var fSpeed = new  UI.createDiv('attrRow',fCameraAttr);
    new UI.createDiv('text',fSpeed,'速度');
    var fSpeedSwitch=new  UI.createDiv('OffButton',fSpeed);
    fSpeedSwitch.setId("fSpeed");
    fSpeedSwitch.onClick(function(){
        if (fSpeedSwitch.dom.className === "OffButton") {
            fSpeedSwitch.setClass("onButton");
            editor.controls.rollSpeed = (fSpeedRange.dom.value/300);
        } else {
            fSpeedSwitch.setClass("OffButton");
            editor.controls.rollSpeed = 0.01;
        }
        editor.camera.updateProjectionMatrix();
    });
    var fSpeedBars=new  UI.createDiv('range',fSpeed);
    var fSpeedRange = new  UI.createDiv('',fSpeedBars,null,'i');
    fSpeedRange.dom.type="range";
    fSpeedRange.dom.value="50";
    $(fSpeedRange.dom).on("input change",function(){
        fSpeedValue.setValue(fSpeedRange.dom.value);
        if (fSpeedSwitch.dom.className === "onButton")
            editor.controls.rollSpeed = (fSpeedRange.dom.value/300);
    });
    var fSpeedValue = new UI.createDiv('value',fSpeed,null,'i');
    $(fSpeedValue.dom).on("input change",function(){
        fSpeedRange.dom.value=Number(fSpeedValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });

    //飞行相机-身高
    /* var fHeight = new  UI.createDiv('attrRow',fCameraAttr);
     new UI.createDiv('text',fHeight,'高度');
     var fHeightSwitch=new  UI.createDiv('OffButton',fHeight);
     var fHeightBars=new  UI.createDiv('range',fHeight);
     var fHeightRange = new  UI.createDiv('',fHeightBars,null,'i');
     fHeightRange.dom.type="range";
     fHeightRange.dom.value="0";
     $(fHeightRange.dom).on("input change",function(){
     fHeightValue.setValue(fHeightRange.dom.value);
     });
     var fHeightValue = new UI.createDiv('value',fHeight,null,'i');
     $(fHeightValue.dom).on("input change",function(){
     fHeightRange.dom.value=Number(fHeightValue.dom.value)||0;
     $('input[type="range"]').trigger("input");
     });*/
    editor.signals.initTHREE.initGlobalControls.add(function(){
        var atr1=eval(dataBase.controls.atr1);
        var atr2=eval(dataBase.controls.atr2);
        var atr3=eval(dataBase.controls.atr3);
        if(dataBase.controls.type=="1"){
            rCameraAttr.dom.style.display='block';
            if(atr1[1]){
                rPerspectiveSwitch.setClass("onButton");
                rPerspectiveValue.setValue(atr1[0]);
                $(rPerspectiveValue.dom).trigger("input");
            }
            if(atr2[1]){
                rLimitSwitch.setClass('onButton');
                rLimitValue.setValue(atr2[0]);
                $(rLimitValue.dom).trigger("input");
            }
            if(atr3[1]){
                rDampingFactorSwitch.setClass('onButton');
                rDampingFactorValue.setValue(atr3[0]);
                $(rDampingFactorValue.dom).trigger("input");
            }
        }
        if(dataBase.controls.type=="2"){
            pCameraAttr.dom.style.display='block';
            rCameraAttr.dom.style.display='none';
            if(atr1[1]){
                pPerspectiveSwitch.setClass("onButton");
                pPerspectiveValue.setValue(atr1[0]);
                $(pPerspectiveValue.dom).trigger("input");
            }
            if(atr2[1]){
                pSpeedSwitch.setClass("onButton");
                pSpeedValue.setValue(atr2[0]);
                $(pSpeedValue.dom).trigger("input");
            }
            if(atr3[1]){
                pHeightSwitch.setClass("onButton");
                pHeightValue.setValue(atr3[0]);
                $(pHeightValue.dom).trigger("input");
            }
        }
        if(dataBase.controls.type=="3"){
            fCameraAttr.dom.style.display='block';
            rCameraAttr.dom.style.display='none';
            if(atr1[1]){
                fPerspectiveSwitch.setClass("onButton");
                fPerspectiveValue.setValue(atr1[0]);
                $(fPerspectiveValue.dom).trigger("input");
            }
            if(atr2[1]){
                fSpeedSwitch.setClass("onButton");
                fSpeedValue.setValue(atr2[0]*300);
                $(fSpeedValue.dom).trigger("input");
            }
        }
    });
    /*================== filter setup=======================================================*/
    var filterAttr = new UI.createDiv('',attributeList);
    var filterHeader = new UI.createDiv('attrHeader',filterAttr,'滤镜');
    var filterHiddenArrow = new UI.createDiv('attrTriPng',filterHeader);
    var filterHelp = new UI.createDiv('attrHelp',filterHeader);
    filterHeader.onClick(function () {
        if (filterContent.dom.style.display == "none") {
            filterContent.dom.style.display = "block";
            filterHiddenArrow.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            filterContent.dom.style.display = "none";
            filterHiddenArrow.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var filterContent = new UI.createDiv('Attr_Content',filterAttr);

    //复古
    var restore = new  UI.createDiv('attrRow',filterContent);
    new UI.createDiv('text',restore,'复古');
    var restoreSwitch=new  UI.createDiv('OffButton',restore);
    restoreSwitch.onClick(function(){
        if (restoreSwitch.dom.className === "OffButton") {
            restoreSwitch.setClass("onButton");
            editor.composer.Restoring[1]=true;
        } else {
            restoreSwitch.setClass("OffButton");
            editor.composer.Restoring[1]=false;
        }
        editor.onToggleShaders(editor.composer);
    });
    var restoreBars=new  UI.createDiv('range',restore);
    var restoreRange = new  UI.createDiv('',restoreBars,null,'i');
    restoreRange.dom.type="range";
    restoreRange.dom.value="0";
    $(restoreRange.dom).on("input change",function(){
        restoreValue.setValue(restoreRange.dom.value);
        editor.composer.Restoring.setValue(restoreRange.dom.value);
    });
    var restoreValue = new UI.createDiv('value',restore,null,'i');
    $(restoreValue.dom).on("input change",function(){
        restoreRange.dom.value=Number(restoreValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
        editor.composer.Restoring.setValue(restoreValue.dom.value);

    });

    //白幕
    var vignetteLight = new  UI.createDiv('attrRow',filterContent);
    new UI.createDiv('text',vignetteLight,'白幕');
    var vignetteLightSwitch=new  UI.createDiv('OffButton',vignetteLight);

    vignetteLightSwitch.onClick(function () {
        if (vignetteLightSwitch.dom.className === "OffButton") {
            vignetteLightSwitch.setClass("onButton");
            editor.composer.WhiteCurtain[1]=true;
        } else {
            vignetteLightSwitch.setClass("OffButton");
            editor.composer.WhiteCurtain[1]=false;
        }
        editor.onToggleShaders(editor.composer);
    });
    var vignetteLightBars=new  UI.createDiv('range',vignetteLight);
    var vignetteLightRange = new  UI.createDiv('',vignetteLightBars,null,'i');
    vignetteLightRange.dom.type="range";
    vignetteLightRange.dom.value="0";
    $(vignetteLightRange.dom).on("input change",function(){
        vignetteLightValue.setValue(vignetteLightRange.dom.value);
        editor.composer.WhiteCurtain.setValue(vignetteLightValue.dom.value);
    });

    var vignetteLightValue = new UI.createDiv('value',vignetteLight,null,'i');
    $(vignetteLightValue.dom).on("input change",function(){
        vignetteLightRange.dom.value=Number(vignetteLightValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
        editor.composer.WhiteCurtain.setValue(vignetteLightValue.dom.value);
    });

    //黑夜
    var vignetteDark = new  UI.createDiv('attrRow',filterContent);
    new UI.createDiv('text',vignetteDark,'黑夜');
    var vignetteDarkSwitch=new  UI.createDiv('OffButton',vignetteDark);
    vignetteDarkSwitch.onClick(function () {
        if (vignetteDarkSwitch.dom.className === "OffButton") {
            vignetteDarkSwitch.setClass("onButton");
            editor.composer.DarkNight[1]=true;
        } else {
            vignetteDarkSwitch.setClass("OffButton");
            editor.composer.DarkNight[1]=false;
        }
        editor.onToggleShaders(editor.composer);
    });
    var vignetteDarkBars=new  UI.createDiv('range',vignetteDark);
    var vignetteDarkRange = new  UI.createDiv('',vignetteDarkBars,null,'i');
    vignetteDarkRange.dom.type="range";
    vignetteDarkRange.dom.value="0";
    $(vignetteDarkRange.dom).on("input change",function(){
        vignetteDarkValue.setValue(vignetteDarkRange.dom.value);
        editor.composer.DarkNight.setValue(vignetteDarkRange.dom.value);
    });

    var vignetteDarkValue = new UI.createDiv('value',vignetteDark,null,'i');
    $(vignetteDarkValue.dom).on("input change",function(){
        vignetteDarkRange.dom.value=Number(vignetteDarkValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
        editor.composer.DarkNight.setValue(vignetteDarkValue.dom.value);

    });

    //像素
    var pixel = new  UI.createDiv('attrRow',filterContent);
    new UI.createDiv('text',pixel,'像素');
    var pixelSwitch=new  UI.createDiv('OffButton',pixel);
    pixelSwitch.onClick(function () {
        if (pixelSwitch.dom.className === "OffButton") {
            pixelSwitch.setClass("onButton");
            editor.composer.Pixel[1]=true;
        } else {
            pixelSwitch.setClass("OffButton");
            editor.composer.Pixel[1]=false;
        }
        editor.onToggleShaders(editor.composer);
    });
    var pixelBars=new  UI.createDiv('range',pixel);
    var pixelRange = new  UI.createDiv('',pixelBars,null,'i');
    pixelRange.dom.type="range";
    pixelRange.dom.value="0";
    $(pixelRange.dom).on("input change",function(){
        pixelValue.setValue(pixelRange.dom.value);
        editor.composer.Pixel.setValue(pixelRange.dom.value);
    });

    var pixelValue = new UI.createDiv('value',pixel,null,'i');
    $(pixelValue.dom).on("input change",function(){
        pixelRange.dom.value=Number(pixelValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
        editor.composer.Pixel.setValue(pixelValue.dom.value);

    });

    //发光
    var Luminous = new  UI.createDiv('attrRow',filterContent);
    new UI.createDiv('text',Luminous,'发光');
    var LuminousSwitch=new  UI.createDiv('OffButton',Luminous);
    LuminousSwitch.onClick(function () {
        if (LuminousSwitch.dom.className === "OffButton") {
            LuminousSwitch.setClass("onButton");
            editor.composer.Luminous[1]=true;
        } else {
            LuminousSwitch.setClass("OffButton");
            editor.composer.Luminous[1]=false;
        }
        editor.onToggleShaders(editor.composer);
    });
    var LuminousBars=new  UI.createDiv('range',Luminous);
    var LuminousRange = new  UI.createDiv('',LuminousBars,null,'i');
    LuminousRange.dom.type="range";
    LuminousRange.dom.value="0";
    $(LuminousRange.dom).on("input change",function(){
        LuminousValue.setValue(LuminousRange.dom.value);
        editor.composer.Luminous.setValue(LuminousRange.dom.value);
    });
    var LuminousValue = new UI.createDiv('value',Luminous,null,'i');
    $(LuminousValue.dom).on("input change",function(){
        LuminousRange.dom.value=Number(LuminousValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });
    //init
    editor.signals.initTHREE.initComposer.add(function () {
        editor.composer.DarkNight[1]? vignetteDarkSwitch.setClass("onButton"):vignetteDarkSwitch.setClass("OffButton");
        editor.composer.WhiteCurtain[1]?vignetteLightSwitch.setClass("onButton"):vignetteLightSwitch.setClass("OffButton");
        editor.composer.Restoring[1]?restoreSwitch.setClass("onButton"):restoreSwitch.setClass("OffButton");
        editor.composer.Pixel[1]?pixelSwitch.setClass("onButton"):pixelSwitch.setClass("OffButton");
        editor.composer.Luminous[1]?LuminousSwitch.setClass("onButton"):LuminousSwitch.setClass("OffButton");

        restoreRange.setValue(dataBase.composer.RestoringV);
        $(restoreRange.dom).trigger("input");
        vignetteLightRange.setValue(dataBase.composer.WhiteCurtainV);
        $(vignetteLightRange.dom).trigger("input");
        vignetteDarkRange.setValue(dataBase.composer.DarkNightV);
        $(vignetteDarkRange.dom).trigger("input");
        pixelRange.setValue(dataBase.composer.PixelV);
        $(pixelRange.dom).trigger("input");
        LuminousRange.setValue(dataBase.composer.LuminousV);
        $(LuminousRange.dom).trigger("input");
    });
    /*================== audio setup=======================================================*/
    var audioAttr = new UI.createDiv('',attributeList);
    var audioHeader = new UI.createDiv('attrHeader',audioAttr,'音效');
    var audioHiddenArrow = new UI.createDiv('attrTriPng',audioHeader);
    var audioHelp = new UI.createDiv('attrHelp',audioHeader);
    audioHeader.onClick(function () {
        if (audioContent.dom.style.display == "none") {
            audioContent.dom.style.display = "block";
            audioHiddenArrow.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            audioContent.dom.style.display = "none";
            audioHiddenArrow.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var audioContent = new UI.createDiv('Attr_Content',audioAttr);

    //source
    var source = new  UI.createDiv('attrRow',audioContent);
    new UI.createDiv('text',source,'来源');
    var sourceSwitch=new  UI.createDiv('OffButton',source);
    sourceSwitch.onClick(function(){
        if (sourceSwitch.dom.className === "OffButton") {
            audio.play();
            audio.volume = volumeValue.dom.value/100;
            sourceSwitch.setClass("onButton");
            volumeSwitch.setClass("onButton");
        } else {
            audio.pause();
            audio.volume = 0;
            sourceSwitch.setClass("OffButton");
            volumeSwitch.setClass("OffButton");
        }
    });
    var sourceName = new UI.createDiv('audioText',source,"");
    var audio = document.createElement("audio");
    var SourceLevel = new UI.createDiv('fileUpload',source,null,'i');
    SourceLevel.dom.type = "file";
    var SourceLevelStyle = new UI.createDiv('uploadStyle',source);
    SourceLevelStyle.onClick(function () {
        SourceLevel.dom.click();
    });

    SourceLevel.onChange(function (e) {
        sourceName.setTextContent(SourceLevel.dom.value);
        var file = e.target.files[0],
            src = window.createObjectURL && window.createObjectURL(file) ||
                window.URL && window.URL.createObjectURL(file) ||
                window.webkitURL && window.webkitURL.createObjectURL(file);
        if (/^audio/i.test(file.type)) {
            audio.style.display = 'block';
            audio.src = src;
            if(volumeSwitch.dom.className === "onButton")
                audio.volume = volumeValue.dom.value/100;
            else audio.volume = 0;
        } else {
            audio.pause();
            audio.style.display = 'none';
            alert("请选择音乐文件！");
        }
    });
    //volume
    var volume = new  UI.createDiv('attrRow',audioContent);
    new UI.createDiv('text',volume,'音量');
    var volumeSwitch=new  UI.createDiv('OffButton',volume);
    volumeSwitch.onClick(function(){
        if (volumeSwitch.dom.className === "OffButton"
            && sourceSwitch.dom.className === "onButton") {
            volumeSwitch.setClass("onButton");
            audio.volume = volumeValue.dom.value/100;
        } else {
            volumeSwitch.setClass("OffButton");
            audio.volume = 0;
        }
    });
    var volumeBars=new  UI.createDiv('range',volume);
    var volumeRange = new  UI.createDiv('',volumeBars,null,'i');
    volumeRange.dom.type="range";
    volumeRange.dom.value="0";
    $(volumeRange.dom).on("input change",function(){
        volumeValue.setValue(volumeRange.dom.value);
        if(volumeSwitch.dom.className === "onButton"){
            audio.volume = volumeValue.dom.value/100;
        }
    });

    var volumeValue = new UI.createDiv('value',volume,null,'i');
    $(volumeValue.dom).on("input change",function(){
        volumeRange.dom.value=Number(volumeValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
        if(volumeSwitch.dom.className === "onButton"){
            audio.volume = volumeValue.dom.value/100;
        }
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
        editor.sceneGlobal.fog.color.setHex("0x"+color);
        editor.scene.fog.color.setHex("0x"+color);
        editor.signals.sceneGraphChanged.dispatch();
        fogAdd.dom.style.backgroundColor = "#"+color;
    });
    return container;
};
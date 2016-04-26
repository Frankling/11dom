/**
 * Created by DELL on 2016/1/8.
 */
Menubar.light = function ( editor ) {
    var container = new UI.Panel().setClass('menu');
    var menuName = new UI.createDiv('title',container);
    menuName.dom.style.backgroundImage="url('image/light.png')";
    menuName.onClick(function(){
        if(sidePanel.dom.style.display=="inline-block"){
            sidePanel.dom.style.display="none";
            return
        }
        $(".side_panel").css("display","none");
        sidePanel.dom.style.display="inline-block";
    });
    var sidePanel = new UI.createDiv('side_panel',container);
    sidePanel.setTop('40px');
    var Light_List = new UI.createDiv('list_container',sidePanel);
    var panelHeader = new UI.createDiv('panel-header',Light_List,"灯光列表");
    var panelClose = new UI.createDiv('panel-close',panelHeader);
    panelClose.onClick(function(){
        sidePanel.dom.style.display="none"
    });
    var panelHidden=new UI.createDiv('panel-hidden',panelHeader);
    panelHidden.onClick(function(){
        if( listContent.dom.style.display=="none"){
            listContent.dom.style.display="block";
            panelFooter.dom.style.display="block";
        }else{
            listContent.dom.style.display="none";
            panelFooter.dom.style.display="none";
        }
    });

    var listContent = new UI.createDiv('content',Light_List);
    var panelFooter= new UI.createDiv('panel-footer',Light_List);

    //container for add and delete light button
    var row_container = new UI.createDiv('row_container',panelFooter);
    var ADD_Light = new  UI.createDiv('twoElement',row_container,'添加灯光');
    var Del_Light = new  UI.createDiv('twoElement',row_container,'删除灯光');
    var attributeList =new UI.createDiv('attributeList',sidePanel);

    var light_type = new UI.createDiv('row_container',attributeList);
    light_type.dom.style.display="none";
    var light_type_1 = new UI.createDiv('triElement',light_type,'方向光',"b");
    var light_type_2 = new UI.createDiv('triElement',light_type,'聚光灯',"b");
    var light_type_3 = new  UI.createDiv('triElement',light_type,'泛光灯',"b");

    //create sprite material for light
    var map = new THREE.TextureLoader().load( "image/gizmo-light.png" );
    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
    function addLight(type,count){
        light_type.dom.style.display="";
        var color = 0xffffff;
        var light,name;
        switch(type){
            case "d":
                light = new THREE.DirectionalLight( color );
                name = "DirectionalLight ";
                break;
            case "s":
                light = new THREE.SpotLight( color );
                name = "SpotLight ";
                light.distance=50;
                break;
            case "p":
                light = new THREE.PointLight( color );
                name = "PointLight ";
                light.distance=50;
                break;
            default :
                light = new THREE.AmbientLight(0x545454,1.8);
                name = "AmbientLight";
        }
        var object =new THREE.LightObject();
        var light_sprite = new THREE.Sprite( material );
        light_sprite.scale.x= light_sprite.scale.y= light_sprite.scale.z=20;
        object.name = name + (  count );
        object.add(light_sprite);
        object.add(light);
        editor.addObject( object,editor.scene);
        editor.allObject3D.children.push(object);
        editor.signals.sceneGraphChanged.dispatch();

    }
    //add directional light

  //  var dLightCount=0,sLightCount=0,pLightCount=0;
    light_type_1.onClick(function(){
        addLight("d", ++dataBase.lightCount.directionC);
    });
    //add spot light
    light_type_2.onClick(function(){
        addLight("s",++dataBase.lightCount.spotC);
    });
    //add hemisphere lihgt
    light_type_3.onClick(function(){
        addLight("p", ++dataBase.lightCount.hemisphereC);
    });
    ADD_Light.onClick(function(){
        $(light_type.dom).toggle();
    });
    //delete the light which selected
    Del_Light.onClick(function(){
        var id=$(".selected")[0].id;
        if(editor.selected[id].children[1] instanceof THREE.AmbientLight) return;
        lAttrHeader.setTextContent('灯光属性');
        lAttrContent.dom.style.display="none";
        editor.removeObject( editor.selected[id]);
        editor.signals.sceneGraphChanged.dispatch();
    });
    //container for light attribute
    var light_Attr = new UI.createDiv('',attributeList);
    var lAttrHeader=new UI.createDiv('attrHeader',light_Attr,'灯光属性');
    var listOfMaterialHidden = new UI.createDiv('attrTriPng',lAttrHeader);
    listOfMaterialHidden.dom.style.backgroundImage = "url('image/jiantou-you.png')";
    var attrHelp = new UI.createDiv('attrHelp',lAttrHeader);

    lAttrHeader.onClick(function () {
        if (lAttrContent.dom.style.display == "none") {
            lAttrContent.dom.style.display = "block";
            listOfMaterialHidden.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            lAttrContent.dom.style.display = "none";
            listOfMaterialHidden.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });

    var lAttrContent = new UI.createDiv('Attr_Content',light_Attr);
    lAttrContent.dom.style.display ="none";

    //add row container for color and intensity attribute
    var Attr_Color_Intensity = new  UI.createDiv('attrRow',lAttrContent);
    new UI.createDiv('text',Attr_Color_Intensity,'颜色');
    var color_box = new UI.createDiv('box',Attr_Color_Intensity,null,'b');
    color_box.onClick(function(){
        $(lightColor.dom).toggle()
    });

    var lightBars=new  UI.createDiv('range',Attr_Color_Intensity);

    var lightIntensityRange = new  UI.createDiv('',lightBars,null,'i');
    lightIntensityRange.dom.type="range";
    lightIntensityRange.dom.value="0";
    $(lightIntensityRange.dom).on("input change",function(){
        lightIntensityValue.setValue(lightIntensityRange.dom.value);
        try{
            editor.scene.getObjectByName(lAttrHeader.dom.innerHTML).children[1].intensity =Number(lightIntensityRange.dom.value)/25;
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        }catch(e){}
    });
    var lightIntensityValue = new UI.createDiv('value',Attr_Color_Intensity,null,'i');
    $(lightIntensityValue.dom).on("input change",function(){
        lightIntensityRange.dom.value=Number(lightIntensityValue.dom.value)||0;
        $(lightIntensityRange.dom).trigger("input");
    });
    var lightColor = UI.createDiv('ui-color-picker',lAttrContent);
    lightColor.dom.style.display = "none";
    lightColor.dom.style.paddingLeft = "43px";
    lightColor.onClick(function(){
        var color = lightColor.dom.getAttribute("value");
        color_box.dom.style.backgroundColor=color;
        try{
            editor.scene.getObjectByName(lAttrHeader.dom.innerHTML).children[1].color = new THREE.Color(color);
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        }catch(e){}
    });


    //row container for spot light cover range

    var cover_Range = new UI.createDiv('attrRow',lAttrContent);
    cover_Range.dom.style.display="none";
    new UI.createDiv('text',cover_Range,'范围');
    var coverBars=new UI.createDiv('range',cover_Range);

    var coverRange = new UI.createDiv('',coverBars,null,'i');
    coverRange.dom.type="range";
    coverRange.dom.value="0";
    $(coverRange.dom).on("input change",function(){
        coverRangeValue.setValue(coverRange.dom.value);
        try{
            editor.scene.getObjectByName(lAttrHeader.dom.innerHTML).children[1].angle =Number(coverRangeValue.dom.value)*Math.PI/200;
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();

        }catch(e){}
    });
    var coverRangeValue = new UI.createDiv('value',cover_Range,null,'i');
    $(coverRangeValue.dom).on("input change",function(){
        coverRange.dom.value=Number(coverRangeValue.dom.value)||0;
        $(coverRange.dom).trigger("input");
    });
    //spotLight distance property
    var Distance_Range = new UI.createDiv('attrRow',lAttrContent);
    Distance_Range.dom.style.display="none";
    new UI.createDiv('text',Distance_Range,'距离');
    var distanceBars= new UI.createDiv('range',Distance_Range);


    var distanceRange = new UI.createDiv('',distanceBars,null,'i');
    distanceRange.dom.type="range";
    distanceRange.dom.value="0";
    $(distanceRange.dom).on("input change",function(){
        distanceRangeValue.setValue(distanceRange.dom.value);
        try{
            editor.scene.getObjectByName(lAttrHeader.dom.innerHTML).children[1].distance= Number(distanceRangeValue.dom.value)==0 ? 0.1: Number(distanceRangeValue.dom.value)*2;
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        }catch(e){}
    });
    var distanceRangeValue = new UI.createDiv('value',Distance_Range,null,'i');
    $(distanceRangeValue.dom).on("input change",function(){
        distanceRange.dom.value=Number(distanceRangeValue.dom.value)||0;
        $(distanceRange.dom).trigger("input");
    });
    //spotLight decay property
    var Decay_Range = new UI.createDiv('attrRow',lAttrContent);
    Decay_Range.dom.style.display="none";
    new UI.createDiv('text',Decay_Range,'衰减');
    var decayBars=new UI.createDiv('range',Decay_Range);


    var decayRange = new UI.createDiv('',decayBars,null,'i');
    decayRange.dom.type="range";
    decayRange.dom.value="0";
    $(decayRange.dom).on("input change",function(){
        decayRangeValue.setValue(decayRange.dom.value);
        try{
            editor.scene.getObjectByName(lAttrHeader.dom.innerHTML).children[1].decay= Number(decayRangeValue.dom.value)/100;
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        }catch(e){}
    });
    var decayRangeValue = new UI.createDiv('value',Decay_Range,null,'i');
    $(decayRangeValue.dom).on("input change",function(){
        decayRange.dom.value=Number(decayRangeValue.dom.value)||0;
        $(decayRange.dom).trigger("input");
    });
    //light target info
    var light_Target= new UI.createDiv('attrRow',lAttrContent);
    new UI.createDiv('text',light_Target,'目标');
    var targetX = new UI.createDiv('light_target',light_Target,null,'n');
    var targetY = new UI.createDiv('light_target',light_Target,null,'n');
    var targetZ = new UI.createDiv('light_target',light_Target,null,'n');

    $(targetX.dom).on("input change",function(){
        try{
            editor.scene.getObjectByName(Attr_Header.dom.innerHTML).children[1].target.position.x =Number(targetX.dom.value);
            editor.scene.getObjectByName(Attr_Header.dom.innerHTML).children[1].target.updateMatrixWorld();
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();

        }catch(e){}
    });
    $(targetY.dom).on("input change",function(){
        try{
            editor.scene.getObjectByName(Attr_Header.dom.innerHTML).children[1].target.position.y =Number(targetY.dom.value);
            editor.scene.getObjectByName(Attr_Header.dom.innerHTML).children[1].target.updateMatrixWorld();
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();

        }catch(e){}
    });
    $(targetZ.dom).on("input change",function(){
        try{
            editor.scene.getObjectByName(Attr_Header.dom.innerHTML).children[1].target.position.z =Number(targetZ.dom.value);
            editor.scene.getObjectByName(Attr_Header.dom.innerHTML).children[1].target.updateMatrixWorld();
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        }catch(e){}
    });
    //光线跟踪
    var trackLight= new UI.createDiv('attrRow',lAttrContent);
    new UI.createDiv('text',trackLight,'光线跟踪');
    var trackSwitch=new  UI.createDiv('OffButton',trackLight);

    function loop(){
        editor.signals.sceneGraphChanged.dispatch();
        if(Object.keys(editor.traceCamera).length) requestAnimationFrame(loop);
    }
    editor.signals.initTHREE.initTraceCamera.add(loop)
    trackSwitch.onClick(function(){

        var obj = editor.selected;
        for(var i in obj){
            if(obj[i].type=="LightObject"){
                var name = editor.selected[i].uuid
                if (trackSwitch.dom.className === "OffButton") {
                    trackSwitch.setClass("onButton");
                    var project = new THREE.Projector();
                    var position = new THREE.Vector3();
                    position.copy(obj[i].position);
                    project.projectVector(position,editor.camera);
                    editor.traceCamera[name] = position;

                } else {
                    trackSwitch.setClass("OffButton");
                    delete editor.traceCamera[name];
                }
            }

        }
        loop();
    });
    attributeList.add(new Share.Table(editor));

    editor.signals.objectAdded.add( function ( object ) {
        if(object.children[1] instanceof THREE.Light){
            var listOfObject3D = new UI.Panel();
            listOfObject3D.setClass(" listOfObject3D");
            listOfObject3D.setId(object.uuid);
            listOfObject3D.dom.tabIndex="1";
            listOfObject3D.dom.innerHTML=object.name;
            listContent.add( listOfObject3D  );
            listOfObject3D.onClick(function(){
                editor.select(object);
            })
        }
    });
    editor.signals.objectRemove.add(function(object){
        var id = object.uuid;
        $("#"+id).remove();
    });
    editor.signals.selectChanged.add(function(object){

        if(object.children[1] instanceof THREE.Light) {
            lAttrContent.dom.style.display="block";
            lAttrHeader.setTextContent(object.name);
            if(!editor.traceCamera[object.uuid]){
                trackSwitch.setClass("OffButton");
            }else{
                trackSwitch.setClass("onButton");
            }
            var color = "#"+object.children[1].color.getHexString();
            $(lightColor.dom).attr("value",color).click();
            lightIntensityRange.setValue(object.children[1].intensity*25);
            if(object.children[1] instanceof THREE.SpotLight){
                cover_Range.dom.style.display = "block";
                coverRange.setValue(object.children[1].angle*2*100/Math.PI);
                Distance_Range.dom.style.display="block";
                distanceRange.setValue(object.children[1].distance/2);
                Decay_Range.dom.style.display="block";
                decayRange.setValue(object.children[1].decay*100);
            }else{
                cover_Range.dom.style.display = "none";
                Distance_Range.dom.style.display="none";
                Decay_Range.dom.style.display="none";
            }
            if(object.children[1] instanceof THREE.PointLight){
                light_Target.dom.style.display="none";
                Decay_Range.dom.style.display="block";
                Distance_Range.dom.style.display="block";
                distanceRange.setValue(object.children[1].distance/2);
                decayRange.setValue(object.children[1].decay*100);
            }else if(!(object.children[1] instanceof THREE.AmbientLight)){
                light_Target.dom.style.display="block";
                targetX.setValue(object.children[1].target.position.x);
                targetY.setValue(object.children[1].target.position.y);
                targetZ.setValue(object.children[1].target.position.z);
            }
            if(object.children[1] instanceof THREE.AmbientLight){
                light_Target.dom.style.display="none";
            }
            $('input[type="range"]').trigger("input");
        }else{
            lAttrContent.dom.style.display="none";

        }
    });
    setTimeout(addLight('',''),100);
    return container;
};
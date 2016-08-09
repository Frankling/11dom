/**
 * Created by DELL on 2016/1/8.
 */
var Tool= function ( editor ) {

    var container = new UI.Panel();
    container.setId("tool");

    var loge = new UI.Panel();
    loge.setClass( 'loge' );
    container.add( loge );

    var tool = new UI.Panel();
    tool.setClass( 'tool' );
    container.add( tool);

    var toolMove= new UI.Panel();
    toolMove.setClass( 'toolList' );
    tool.add( toolMove);
    //     toolList 背景图片
    toolMove.dom.style.backgroundImage="url('image/toolmove.png')";
    toolMove.onClick(function(){
        editor.signals.selectTransform.dispatch( "translate");
        //        点击后更改绿色背景颜�
        for(var i=0;i<this.dom.parentNode.childNodes.length;i++){
            this.dom.parentNode.childNodes[i].style.backgroundColor="#343434";
        }
        this.dom.style.backgroundColor="green";
    });

    var toolRotate= new UI.Panel();
    toolRotate.setClass( 'toolList' );
    tool.add( toolRotate);
    //     toolList 背景图片
    toolRotate.dom.style.backgroundImage="url('image/toolRotate.png')";
    toolRotate.onClick(function(){
        editor.signals.selectTransform.dispatch( "rotate");
        //      点击后更改绿色背景颜�
        for(var i=0;i<this.dom.parentNode.childNodes.length;i++){
            this.dom.parentNode.childNodes[i].style.backgroundColor="#343434";
        }
        this.dom.style.backgroundColor="green";
    });

    var toolScale= new UI.Panel();
    toolScale.setClass( 'toolList' );
    tool.add( toolScale);
//     toolList 背景图片
    toolScale.dom.style.backgroundImage="url('image/toolScale.png')";

    toolScale.onClick(function(){
        editor.signals.selectTransform.dispatch( "scale");
        //        点击后更改绿色背景颜�
        for(var i=0;i<this.dom.parentNode.childNodes.length;i++){

            this.dom.parentNode.childNodes[i].style.backgroundColor="#343434";
        }
        this.dom.style.backgroundColor="green";
    });

    var toolCenter= new UI.Panel();
    toolCenter.setClass( 'toolList' );
    tool.add( toolCenter);
//     toolList 背景图片
    toolCenter.dom.style.backgroundImage="url('image/toolCenter.png')";

    toolCenter.onClick(function(){
        editor.resetAxis();
        //        点击后更改绿色背景颜�
        for(var i=0;i<this.dom.parentNode.childNodes.length;i++){
            this.dom.parentNode.childNodes[i].style.backgroundColor="#343434";
        }
        this.dom.style.backgroundColor="green";
    });

    var gridVis= new UI.Panel();
    gridVis.setClass( 'toolList' );
    tool.add( gridVis);
//     toolList 背景图片
    gridVis.dom.style.backgroundImage="url('image/6.png')";

    gridVis.onClick(function(){

        editor.Grid.visible=!editor.Grid.visible;
        editor.signals.sceneGraphChanged.dispatch();
        //        点击后更改绿色背景颜�
        for(var i=0;i<this.dom.parentNode.childNodes.length;i++){
            this.dom.parentNode.childNodes[i].style.backgroundColor="#343434";
        }
        this.dom.style.backgroundColor="green";
    });
    var resetCamera= new UI.Panel();
    resetCamera.setClass( 'toolList' );
    tool.add( resetCamera);
    resetCamera.dom.style.backgroundImage="url('image/resetCamera.png')";
    resetCamera.onClick(function(){

        editor.requestLoop=false;
        editor.CameraControls(1);

       //ditor.camera.position.copy(new THREE.Vector3(20,20,200));
       //ditor.controls.object.updateProjectionMatrix();
       //ditor.controls.update();
        editor.signals.sceneGraphChanged.dispatch();

    });

    var smoth= new UI.Panel();
    smoth.setClass( 'toolList' );
    tool.add( smoth);
    smoth.dom.style.backgroundImage="url('image/resetCamera.png')";
    smoth.onClick(function(){
        var selected=editor.selected;
     //   for(var i in selected){
            var geo=new THREE.BoxGeometry(100,100,100,3,3,3);
            var box=new THREE.Mesh(geo,new THREE.MeshBasicMaterial());

            var geo1=geo.clone();
            var modifier = new THREE.SubdivisionModifier(2);
            modifier.modify(geo1);
            var mesh=new THREE.Mesh(geo1,new THREE.MeshBasicMaterial());

            mesh.position.copy(new THREE.Vector3(10,10,10));
            editor.addObject(mesh);
       // }


    });

    var save = new UI.Panel();
    save.setClass( 'save' );
    container.add( save );

    var saveList = new UI.Panel();
    saveList.setClass( 'saveList' );
    saveList.setTextContent("保存");
    save.add( saveList );
    saveList.onClick(function(){

        //controls
        var getBool=function(_div){
            if(document.getElementById(_div).className=="onButton"){
                return true;
            }else{
                return false;
            }
        };

        if(editor.controls.type=="OrbitControls"){
            dataBase.controls.type="1";
            dataBase.controls.atr1="["+[editor.camera.fov,getBool("rFov")].toString()+"]";
            dataBase.controls.atr2="["+[(Math.PI-editor.controls.maxPolarAngle) *200/Math.PI,getBool("rLimit")].toString()+"]";
            dataBase.controls.atr3="["+[(editor.controls.dampingFactor*100),getBool("rResistance")].toString()+"]";

        }else if(editor.controls.type=="FirstPersonControls"){
            dataBase.controls.type="2";
            dataBase.controls.atr1="["+[editor.camera.fov,getBool("pFov")].toString()+"]";
            dataBase.controls.atr2="["+[editor.controls.lookSpeed  *2000,getBool("pSpeed")].toString()+"]";
            dataBase.controls.atr3="["+[50,getBool("pHight")].toString()+"]";

        }else if(editor.controls.type=="FlyControls"){
            dataBase.controls.type="3";
            dataBase.controls.atr1="["+[editor.camera.fov,getBool("fFov")].toString()+"]";
            //dataBase.controls.atr2=undefined;
            dataBase.controls.atr2="["+[editor.controls.rollSpeed,getBool("fSpeed")].toString()+"]";

        }
       //dataBase.camera.position.x=editor.camera.position.x
       //dataBase.camera.position.y=editor.camera.position.y
       //dataBase.camera.position.z=editor.camera.position.z
        //sprite��
        dataBase.labels={};
        var label=editor.labels;
        for(var i in label){
            var labelS=label[i].children[0];
            dataBase.labels[i]={};
            dataBase.labels[i].title          =labelS.title;
            dataBase.labels[i].cameraPosition=labelS.cameraPosition;
            dataBase.labels[i].normal={x:labelS.normal.x,y:labelS.normal.y,z:labelS.normal.z};
        }

        dataBase.camera = editor.camera;
        dataBase.cameracontrols = editor.controls;

        dataBase.skyboxList={};
        var skyBoxList = document.getElementsByClassName("skyBoxListContentTd");
        for(var s=0;s<skyBoxList.length;s++){
            var hotTdIdArr =[];
            dataBase.skyboxList[s] ={};
            dataBase.skyboxList[s].camera = editor.camera;
            dataBase.skyboxList[s].CurArrNum = arrNum;
            dataBase.skyboxList[s].skyboxArr = arr;
            dataBase.skyboxList[s].skyboxId = skyBoxList[s].id;
            dataBase.skyboxList[s].skyboxName = skyBoxList[s].childNodes[0].innerHTML;
            var hotTd = skyBoxList[s].childNodes[6].childNodes[0].childNodes[0].childNodes;
            for(var t=0;t<hotTd.length;t++){
                hotTdIdArr[t] = hotTd[t].id;
            }
            dataBase.skyboxList[s].hotListId = hotTdIdArr;
            console.log(hotTdIdArr);
            dataBase.skyboxList[s].envValue = skyBoxList[s].childNodes[2].childNodes[3].value;
            dataBase.skyboxList[s].fogValue = skyBoxList[s].childNodes[4].childNodes[3].value;
            dataBase.skyboxList[s].fogColor = skyBoxList[s].childNodes[5].childNodes[1].childNodes[0].childNodes[5].childNodes[1].value;
        }

        dataBase.hotSpotLabels={};
        var label2 = editor.labels2;
        for(var j in label2 ){
            var labelChild = document.getElementById(label2[j].uuid+"V");
            var num = labelChild.childNodes[0].id.replace(/[^0-9]/ig, "");
            var hotSpotListContentTd = document.getElementById("hotSpotListContentTd"+num);
            dataBase.hotSpotLabels[j]={};
            if(hotSpotListContentTd.childNodes[5]){
                dataBase.hotSpotLabels[j].url = hotSpotListContentTd.childNodes[5].childNodes[1].value;
            }
            dataBase.hotSpotLabels[j].camerVNuB = editor.camerVNuB[label2[j].uuid+"T"];
            dataBase.hotSpotLabels[j].startPoint = pointArr[num-1];
            dataBase.hotSpotLabels[j].boxId = hotSpotListContentTd.parentNode.parentNode.parentNode.parentNode.id;
            dataBase.hotSpotLabels[j].IsLink = hotSpotListContentTd.childNodes[3].childNodes[1].className;
            dataBase.hotSpotLabels[j].display = labelChild.style.display;
            dataBase.hotSpotLabels[j].text = labelChild.childNodes[0].innerHTML;
            dataBase.hotSpotLabels[j].textId = labelChild.childNodes[0].id;
            var Icon = hotSpotListContentTd.childNodes[2].childNodes[1].childNodes;
            for(var v=0;v<Icon.length;v++){
                if(Icon[v].style.border == "1px solid rgb(0, 255, 0)"){
                    dataBase.hotSpotLabels[j].backgroundImage = Icon[v].style.backgroundImage;
                }
            }
        }

        dataBase.events = {};
        var eventObj = editor.eventObj;
        for(var i in eventObj){
            if(eventObj[i].event){
                var events = eventObj[i].event;
                dataBase.events[i]={};
                dataBase.events[i].frameName = document.getElementById(i+"-eventFrame").childNodes[0].childNodes[1].innerHTML;
                dataBase.events[i].frameLeft = document.getElementById(i+"-eventFrame").style.left;
                dataBase.events[i].frameTop = document.getElementById(i+"-eventFrame").style.top;
                for(var m in editor.attibuteArr[i]){
                    dataBase.events[i][m] = {};
                    for(var n in editor.attibuteArr[i][m]){
                        dataBase.events[i][m][n] = {};
                        dataBase.events[i][m][n].name = editor.attibuteArr[i][m][n].name;
                        dataBase.events[i][m][n].inLink = editor.attibuteArr[i][m][n].inLink;
                        dataBase.events[i][m][n].outLink = editor.attibuteArr[i][m][n].outLink;
                        if(m == "mouseEvent"){
                            dataBase.events[i][m][n].eventType = editor.attibuteArr[i][m][n].eventType;
                        }
                        if(m == "moveEvent"){
                            dataBase.events[i][m][n].position = editor.attibuteArr[i][m][n].position;
                            dataBase.events[i][m][n].rotation = editor.attibuteArr[i][m][n].rotation;
                            dataBase.events[i][m][n].scale = editor.attibuteArr[i][m][n].scale;
                        }
                        if(m == "materialEvent"){
                            dataBase.events[i][m][n].color = editor.attibuteArr[i][m][n].color;
                        }
                    }
                }

            }
        }

        //composer

       dataBase.composer.DarkNight=editor.composer.DarkNight[1];
       dataBase.composer.DarkNightV=editor.composer.DarkNight.getValue();
       dataBase.composer.Luminous=editor.composer.Luminous[1];
       dataBase.composer.LuminousV=editor.composer.Luminous.getValue();
       dataBase.composer.Pixel=editor.composer.Pixel[1];
       dataBase.composer.PixelV=editor.composer.Pixel.getValue();
       dataBase.composer.Restoring=editor.composer.Restoring[1];
       dataBase.composer.RestoringV=editor.composer.Restoring.getValue();
       dataBase.composer.WhiteCurtain=editor.composer.WhiteCurtain[1];
       dataBase.composer.WhiteCurtainV=editor.composer.WhiteCurtain.getValue();
        //background

        dataBase.background.enable2D=editor.enable2D;
       // dataBase.background.enableBG=editor.enableBG;
        dataBase.background.fogColor=editor.sceneGlobal.fog.color.getHexString();
        dataBase.background.fogInten=editor.sceneGlobal.fog.density;
        dataBase.background.lightBGC=editor.lightBG.color.getHexString();
        dataBase.background.lightBGI= editor.lightBG.intensity;
        dataBase.background.lightGlobalC= editor.lightGlobal.color.getHexString();
        dataBase.background.lightGlobalI=editor.lightGlobal.intensity;



        var AmbientLight= editor.scene.getObjectByName("AmbientLight");
        var AmbientLightC=AmbientLight.children[1]
        dataBase.AmbientLight.color=AmbientLightC.color.getHexString();
        dataBase.AmbientLight.intensity=AmbientLightC.intensity;
        editor.scene.remove(AmbientLight);
        dataBase.traceCamera={};
        for(var i in editor.traceCamera){
            dataBase.traceCamera[i]=editor.traceCamera[i];
        }


        //var scene =editor.scene.toJSON();

       //var scene1= JSON.stringify(scene);
        //var scene1= JSON.stringify(scene);
        /*gz.enGz(scene,function(dd) {
    // console.log('压缩后：'+ (dd.length/1024/1024) + 'Mb');

           // saveAs(new Blob([dd]  ,{type: "Int8Array"}),"scene.json");

       //},function(a){

       //    console.log( (a*100|0) + '%');

        });*/

       // editor.scene.traverse(function(child){
       //     if(child instanceof THREE.Mesh){
       //         var exporter = new THREE.OBJExporter();
       //         var l=exporter.parse( child );
       //         saveAs(new Blob([l]  ,{type: "text/plain;charset=utf-8"}),child.uuid+".obj");
       //     }
       // },true);


        var scene = editor.scene.toJSON();

        var scene1= JSON.stringify(scene);
        var sceneBG = editor.planbox.toJSON();
        var sceneBG1= JSON.stringify(sceneBG);
        var sceneGlobal = editor.skybox.toJSON();
        var sceneGlobal1= JSON.stringify(sceneGlobal );
        var data1= JSON.stringify(dataBase);
        editor.animationToJSON();
        saveAs(new Blob([scene1]  ,{type: "text/plain;charset=utf-8"}),"scene.json");
        saveAs(new Blob([sceneBG1]  ,{type: "text/plain;charset=utf-8"}),"sceneBG.json");
        saveAs(new Blob([data1]  ,{type: "text/plain;charset=utf-8"}),"dataBase.json");
        saveAs(new Blob([sceneGlobal1]  ,{type: "text/plain;charset=utf-8"}),"sceneGlobal.json");
        editor.scene.add(AmbientLight);

    });


    return container;

};
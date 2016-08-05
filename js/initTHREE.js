/**
 * Created by asforever on 2016/3/23.
 */

//$(document).ready(function(){

    var initTHREE=function(editor){
        var signals=editor.signals.initTHREE;

        this.initGlobalControls=function(){
            editor.CameraControls(eval(dataBase.controls.type));
            var atr1=eval(dataBase.controls.atr1);
            var atr2=eval(dataBase.controls.atr2);
            var atr3=eval(dataBase.controls.atr3);

            if(dataBase.controls.type=="1"){
                editor.requestLoop=false;
                if(atr1[1]){
                    editor.camera.fov=atr1[0];
                }
                if(atr2[1]){
                  //  editor.controls.minPolarAngle =atr2[0] * Math.PI / 200;

                    editor.controls.maxPolarAngle =Math.PI -(atr2[0] * Math.PI / 200);
                }
                if(atr3[1]){
                    editor.controls.enableDamping=true;
                    editor.controls.dampingFactor = atr3[0]/100;
                }
            }
            if(dataBase.controls.type=="2"){
                editor.requestLoop=true;
                editor.RenderLoop()

                if(atr1[1]){
                    editor.camera.fov=atr1[0];

                }
                if(atr2[1]){
                    editor.controls.lookSpeed = (atr2[0])/2000;
                    editor.controls.movementSpeed = (atr2[0])/10;
                }
                if(atr3[1]){

                }
            }
            if(dataBase.controls.type=="3"){
                editor.requestLoop=true;
                editor.RenderLoop()
                if(atr1[1]){
                    editor.camera.fov=atr1[0];
                }
                if(atr2[1]){
                    editor.controls.rollSpeed =atr3[0];
                }

            }

            editor.camera.updateProjectionMatrix();
            signals.initGlobalControls.dispatch();
        };
        this.initBackground=function(){
            editor.enable2D =eval(dataBase.background.enable2D);
           // editor.bgType = dataBase.background.bgType;
            editor.lightBG.color.setHex("0x"+dataBase.background.lightBGC);
            editor.lightGlobal.color.setHex("0x"+dataBase.background.lightGlobalC);
            editor.lightBG.intensity=dataBase.background.lightBGI;
            editor.lightGlobal.intensity=dataBase.background.lightGlobalI;
            editor.sceneGlobal.fog.color.setHex("0x"+dataBase.background.fogColor);
           // editor.sceneGlobal.fog.density=dataBase.background.fogInten;
            signals.initBackground.dispatch();
        };
        this.initComposer=function(){

            editor.composer.DarkNight[1] =eval(dataBase.composer.DarkNight);
            editor.composer.WhiteCurtain[1] =eval(dataBase.composer.WhiteCurtain);
            editor.composer.Restoring[1] =eval(dataBase.composer.Restoring);
            editor.composer.Pixel[1] =eval(dataBase.composer.Pixel);
            editor.composer.Luminous[1] =eval(dataBase.composer.Luminous);

            editor.composer.DarkNight.setValue(dataBase.composer.DarkNightV);
            editor.composer.WhiteCurtain.setValue(dataBase.composer.WhiteCurtainV);
            editor.composer.Restoring.setValue(dataBase.composer.RestoringV);
            editor.composer.Pixel.setValue(dataBase.composer.PixelV);
            editor.composer.Luminous.setValue(dataBase.composer.LuminousV);

            editor.onToggleShaders(editor.composer);
            signals.initComposer.dispatch();
        };
        this.initTraceCamera=function(){
        var d=dataBase.traceCamera;
            for(var i in  d){
                editor.traceCamera[i]=d[i];
                editor.signals.initTHREE.initTraceCamera.dispatch();
            }
        };
        this.initAmbientLight=function(){
            var AmbientLight= editor.scene.getObjectByName("AmbientLight").children[1];
            AmbientLight.color.setHex("0x"+dataBase.AmbientLight.color);
            AmbientLight.intensity=dataBase.AmbientLight.intensity;
        };
        this.initLabel=function(){
              var object=editor.allObject3D;

             object.traverse(function(child){
              //    console.log(child);

                  if(dataBase.labels.hasOwnProperty(child.uuid)){

                     var i=child.uuid;
                    // var enableLine=dataBase.labels[i].enableLine;
                   //  var lineHeight=dataBase.labels[i].lineHeight;
                     var title=dataBase.labels[i].title;
                    // var cssType=dataBase.labels[i].cssType;
                     var cameraPosition=dataBase.labels[i].cameraPosition;
                     var normalO=dataBase.labels[i].normal;
                      var normal=new THREE.Vector3(normalO.x,normalO.y,normalO.z);
                     //var display=dataBase.labels[i].display;
                     // var ROrL=dataBase.labels[i].ROrL;


                     labelObject.createLabel(undefined,child.parent.getWorldPosition(),child,normal);
                    // labelObject.updateLabelsAtt({obj:child,cssType:cssType,enableLine:enableLine,lineHeight:lineHeight,title:title,cameraPosition:cameraPosition,display:display,ROrL:ROrL});
                     labelObject.updateLabelsAtt({obj:child,title:title,cameraPosition:cameraPosition,normal:normal});
                     labelObject.updateNowPosition(child.parent);

                  }

              },true)
            }

    };
    (function(){

        var _initTHREE=new initTHREE(editor);
        var loader = new THREE.XHRLoader();
        loader.load(sceneFile, function ( text ) {
         //  var t=text;
         //  var l=t.split(",");
         //  console.log(l)
         //  var haha=[];
         //  for(var i=0;i<l.length;i++){
         //      haha.push(parseInt(l[i]))
         //  }

           // var date1=new Date();  //开始时间

          //  gz.unGz(haha,function(a){
              // var date2=new Date();    //结束时间
              // var date3=date2.getTime()-date1.getTime()
               // console.log(date3)
            editor.fromJSON( JSON.parse(text),editor.scene) ;

            editor.signals.sceneGraphChanged.dispatch();
            //})


        });
        loader.load(dataBaseFile, function ( text ) {
            dataBase=JSON.parse(text);
            editor.loadEndV++;
            editor.loadEnd();
            _initTHREE.initGlobalControls();
            _initTHREE.initBackground();
            _initTHREE.initComposer();
            _initTHREE.initAmbientLight();

        });

        loader.load( sceneGlobalFile, function ( text ) {

            var loader = new THREE.ObjectLoader();
            editor.skybox=loader.parse( JSON.parse(text) );
            editor.skybox.scale.x=-1;
            editor.skybox.material.side=1;
            editor.sceneGlobal.add(editor.skybox);
            editor.signals.sceneGraphChanged.dispatch();

        });

       loader.load(sceneBGFile, function ( text ) {
           var loader = new THREE.ObjectLoader();
           editor.planbox = loader.parse(JSON.parse(text));
           editor.planbox.material.depthTest = false;
           editor.planbox.scale.set(2 * window.innerWidth, 2 * window.innerHeight, 1);

           editor.sceneBG.add(editor.planbox);
           editor.signals.sceneGraphChanged.dispatch();

       });

        loader.load("js/libs/newLib/shaders.xml", function ( text ) {
            xmlDoc=text;
            editor.signals.sceneGraphChanged.dispatch();
        });
        editor.signals.loadEnd.add(function(){
            _initTHREE.initTraceCamera();
            _initTHREE.initLabel();
            editor.signals.sceneGraphChanged.dispatch();
        })


    })();

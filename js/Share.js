/**
 * Created by DELL on 2016/1/29.
 */

var Share=function(editor){
    this.Table=function(){
        var container = new UI.Panel();
        /*位置*/
        var transformHeader = new UI.createDiv('attrHeader',container,'位置');
        var transformBody = new UI.createDiv('Attr_Content',container);
        /*物体-三角形图标*/
        var listOfTransformHidden = new UI.createDiv('attrTriPng',transformHeader);
        transformHeader.onClick(function () {
            if (transformBody.dom.style.display == "none") {
                transformBody.dom.style.display = "block";
                listOfTransformHidden.dom.style.backgroundImage="url('image/jiantou.png')";
            } else {
                transformBody.dom.style.display = "none";
                listOfTransformHidden.dom.style.backgroundImage="url('image/jiantou-you.png')";
            }
        });
        var listOfTransformHelper = new UI.createDiv('attrHelp',transformHeader);

        var transformRow = new UI.createDiv('attrRow',transformBody);
        new UI.createDiv('text',transformRow,'移动');
        var tX = new UI.createDiv('light_target',transformRow,null,'n');
        var tY = new UI.createDiv('light_target',transformRow,null,'n');
        var tZ = new UI.createDiv('light_target',transformRow,null,'n');

        tX.onChange(function(){
            for(var i in editor.selected){
                if("undefined"!==typeof editor.selected[i]){
                    // var worldPositionX=editor.getWorldPosition(editor.selected[i]).x;
                    var worldPositionX=editor.selected[i].getWorldPosition().x;
                    var worldPositionX1=editor.selected[i].position.x;
                    editor.selected[i].position.x= this.dom.value-( worldPositionX-worldPositionX1);
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });
        tY.onChange(function(){
            for(var i in editor.selected){
                if("undefined"!==typeof editor.selected[i]){
                    // var worldPositionY=editor.getWorldPosition(editor.selected[i]).y;
                    var worldPositionY=editor.selected[i].getWorldPosition().y;
                    var worldPositionY1=editor.selected[i].position.y;
                    editor.selected[i].position.y= this.dom.value-( worldPositionY-worldPositionY1);
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });
        tZ.onChange(function(){
            for(var i in editor.selected){
                if("undefined"!==typeof editor.selected[i]){
                    // var worldPositionZ=editor.getWorldPosition(editor.selected[i]).z;

                    var worldPositionZ=editor.selected[i].getWorldPosition().z;
                    var worldPositionZ1=editor.selected[i].position.z;
                    editor.selected[i].position.z= this.dom.value-( worldPositionZ-worldPositionZ1);
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });

        var rotateRow = new UI.createDiv('attrRow',transformBody);
        new UI.createDiv('text',rotateRow,'旋转');
        var rX = new UI.createDiv('light_target',rotateRow,null,'n');
        var rY = new UI.createDiv('light_target',rotateRow,null,'n');
        var rZ = new UI.createDiv('light_target',rotateRow,null,'n');

        rX.onChange(function(){
            for(var i in editor.selected){
                if("undefined"!==typeof editor.selected[i]){
                    var worldRotationX= editor.selected[i].getWorldRotation().x;
                    var offsetRX=worldRotationX- editor.selected[i].rotation.x;
                    editor.selected[i].rotation.x= this.dom.value*Math.PI/180-offsetRX;
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });
        rY.onChange(function(){
            for(var i in editor.selected){
                if("undefined"!==typeof editor.selected[i]){
                    var worldRotationY= editor.selected[i].getWorldRotation().y
                    var offsetRY=worldRotationY- editor.selected[i].rotation.y;
                    editor.selected[i].rotation.y= this.dom.value*Math.PI/180-offsetRY;
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });
        rZ.onChange(function(){
            for(var i in editor.selected){
                if("undefined"!==typeof editor.selected[i]){
                    var worldRotationZ= editor.selected[i].getWorldRotation().z
                    var offsetRZ=worldRotationZ- editor.selected[i].rotation.z;
                    editor.selected[i].rotation.z= this.dom.value*Math.PI/180-offsetRZ;
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });

        var scaleRow = new UI.createDiv('attrRow',transformBody);
        new UI.createDiv('text',scaleRow,'缩放');
        var sX = new UI.createDiv('light_target',scaleRow,null,'n');
        var sY = new UI.createDiv('light_target',scaleRow,null,'n');
        var sZ = new UI.createDiv('light_target',scaleRow,null,'n');

        sX.onChange(function(){
            for(var i in editor.selected){
                if("undefined"!==typeof editor.selected[i]){
                    if(this.dom.value<0.001)this.dom.value=0.001;
                    var worldScaleX= editor.selected[i].getWorldScale().x;
                    var offsetSX= worldScaleX/editor.selected[i].scale.x;
                    editor.selected[i].scale.x= this.dom.value/offsetSX;
                    console.log(offsetSX);
                    console.log(this.dom.value);
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });
        sY.onChange(function(){
            for(var i in editor.selected){
                if(this.dom.value<0.001)this.dom.value=0.001;
                if("undefined"!==typeof editor.selected[i]){
                    var worldScaleY= editor.selected[i].getWorldScale().y;
                    var offsetSY= worldScaleY/editor.selected[i].scale.y;
                    editor.selected[i].scale.y= this.dom.value/offsetSY;
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });
        sZ.onChange(function(){
            for(var i in editor.selected){
                if(this.dom.value<0.001)this.dom.value=0.001;
                if("undefined"!==typeof editor.selected[i]){
                    var worldScaleZ= editor.selected[i].getWorldScale().z;
                    var offsetSZ= worldScaleZ/editor.selected[i].scale.z;
                    editor.selected[i].scale.z= this.dom.value/offsetSZ;
                    editor.selected[i].updateMatrixWorld();
                }
            }
            editor.signals.selectTransform.dispatch();
            editor.signals.sceneGraphChanged.dispatch();
        });

        editor.signals.selectTransform.add(function(){
            for(var i in  editor.selected){
                //var vectorM= editor.getWorldPosition(editor.selected[i]);
                var vectorM=editor.selected[i].getWorldPosition();
                var vectorR= editor.selected[i].getWorldRotation();
                var vectorS= editor.selected[i].getWorldScale();
                tX.setValue( vectorM.x);
                tY.setValue( vectorM.y);
                tZ.setValue( vectorM.z);

                rX.setValue( vectorR.x*180/Math.PI);
                rY.setValue( vectorR.y*180/Math.PI);
                rZ.setValue( vectorR.z*180/Math.PI);

                sX.setValue( vectorS.x);
                sY.setValue( vectorS.y);
                sZ.setValue( vectorS.z);

            }
        });
        return container;
    };
//按钮（2种选择）
    this.KindsButton=function(){

        var buttons=new UI.Panel();
        buttons.setClass( 'KindsButton' );

        var butimg=new UI.Canvas();
        butimg.setClass('butimg');
        buttons.add(butimg);
        return buttons;

    };

//按钮（1种选择）
    this.OneButton=function(){
        var buttons=new UI.Panel();
        buttons.setClass( 'oneButton' );
        return buttons;
    };

//开关
    this.OnorOffButton=function(){

        var buttons=new UI.Panel().setClass('OffButton');
        buttons.onClick(function(){
            if($(buttons.dom).hasClass('OffButton')){
                $(buttons.dom).addClass('OnButton').removeClass('OffButton');
            }else{
                $(buttons.dom).addClass('OffButton').removeClass('OnButton');
            }
        });
        return buttons;
    };


//贴图面板
    this.Textureoption=function(type){
        var textureoption=new UI.Panel().setClass('UV_color_panel');
        var canvas=new UI.Canvas().setClass('imgArea');
        var context =canvas.dom.getContext( '2d' );
        textureoption.add(canvas);
        var textureinput=new UI.Input();
        textureinput.dom.type="file";
        var addmaterial=function(type,texture){
            //console.log(type,texture)
            var material;
            for(var i in editor.selected){
                editor.selected[i].traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        if (child.material) {
                            material = child.material;
                            // console.log(child.material);
                            if (type == 'map') {
                                material.map = texture;
                            }
                            if (type == 'lightmap') {
                                material.lightMap = texture;
                            }
                            if (type == 'specularmap') {
                                material.specularMap= texture;
                            }
                            if (type == 'bumpmap') {
                                material.bumpMap= texture;
                            }
                            if (type == 'normalmap') {
                                material.normalMap= texture;
                            }
                            if (type == 'alphamap') {
                                material.alphaMap= texture;
                                material.transparent=true;
                            }
                            if (type == 'emissivemap') {
                                material.emissiveMap= texture;
                            }
                            inputvalueU.dom.value=texture.offset.height;
                            inputvalueV.dom.value=texture.offset.width;
                            material.needsUpdate = true;
                            editor.signals.sceneGraphChanged.dispatch();
                        }
                    }
                })
            }
        };
        var loadImg=function(file){
            var reader = new FileReader();
            reader.addEventListener( 'load', function ( event ) {
                var image = document.createElement( 'img' );
                image.addEventListener( 'load', function( event ) {
                    var texture= new THREE.Texture(this);
                    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
                    texture.repeat.set(1,1);
                    texture.sourceFile = file.name;
                    texture.needsUpdate = true;
                    addmaterial(type,texture);
                    context.drawImage( image, 0, 0, canvas.dom.width, canvas.dom.height);
                }, false );
                image.src = event.target.result;
                textureoption.dom.setAttribute("img",event.target.result);
                $(textureoption.dom).trigger('change');

            }, false );
            reader.readAsDataURL( file );
        };
        textureinput.onChange(function(event){
            console.log("onchange")
            loadImg(event.target.files[ 0 ]);
        });
        canvas.onClick(function(){
            textureinput.dom.click();
        });

        var textureTable=new UI.Table().setClass('colorTable');
        textureoption.add(textureTable);
        //U
        var textureTrofU=new UI.Tr().setClass('colorTR');
        textureTable.add(textureTrofU);



        var TrTextofU=new UI.Td().setClass('colorTD').setTextContent('U');
        textureTrofU.add(TrTextofU);
        var TrValueofU=new UI.Td().setClass('colorTD');
        textureTrofU.add(TrValueofU);

        var inputvalueU = new UI.Number(0).setClass('inputnumber');
        TrValueofU.add(inputvalueU);

        //V
        var textureTrofV=new UI.Tr().setClass('colorTR');
        textureTable.add(textureTrofV);


        var TrTextofV=new UI.Td().setClass('colorTD').setTextContent('V');
        textureTrofV.add(TrTextofV);
        var TrValueofV=new UI.Td().setClass('colorTD');
        textureTrofV.add(TrValueofV);

        var inputvalueV =  new UI.Number(0).setClass('inputnumber');
        TrValueofV.add(inputvalueV);
        //repeat
        var textureRepeat=new UI.Tr().setClass('colorTR');
        textureTable.add(textureRepeat);

        var TrTextofrepeat=new UI.Td().setClass('colorTD').setTextContent('重复');
        textureRepeat.add(TrTextofrepeat);
        var Trofrepeat=new UI.Td().setClass('colorTD');
        textureRepeat.add( Trofrepeat);

        var inputRepeat =  new UI.Number(1).setClass('inputnumber');
        Trofrepeat.add(inputRepeat);
        //取消贴图
        var DelectButton=new UI.Panel().setTextContent("取消贴图");
        $(DelectButton.dom).addClass('deletebutton');
        textureTable.add(DelectButton);
        DelectButton.onClick(function(){
            textureoption.dom.setAttribute("img","");
            $(textureoption.dom).trigger('change');
            textureinput.dom.value = "";
            for(var i in editor.selected){
                editor.selected[i].traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        if (child.material) {
                            switch(type){
                                case 'map':
                                    child.material.map=null;
                                    break;
                                case 'lightmap':
                                    child.material.lightMap=null;
                                    break;
                                case 'specularmap':
                                    child.material.specularMap=null;
                                    break;
                                case 'bumpmap':
                                    child.material.bumpMap=null;
                                    break;
                                case 'normalmap':
                                    child.material.normalMap=null;
                                    break;
                                case 'alphamap':
                                    child.material.alphaMap=null;
                                    break;
                                case 'emissivemap':
                                    child.material.emissiveMap=null;
                                    break;
                            }
                            context.clearRect( 0, 0, canvas.dom.width, canvas.dom.height);
                            child.material.needsUpdate=true;
                        }
                    }
                })
            }
            editor.signals.sceneGraphChanged.dispatch();
        });

        var setUV=function(){
            console.log(1)
            for(var i in editor.selected){
                editor.selected[i].traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        if (child.material) {
                            switch(type){
                                case 'map':
                                    child.material.map.offset.height=inputvalueU.dom.value;
                                    child.material.map.offset.width=inputvalueV.dom.value;
                                    child.material.map.repeat.set(inputRepeat.dom.value,inputRepeat.dom.value);
                                    break;
                                case 'lightmap':
                                    child.material.lightMap.offset.height=inputvalueU.dom.value;
                                    child.material.lightMap.offset.width=inputvalueV.dom.value;
                                    child.material.lightMap.repeat.set(inputRepeat.dom.value,inputRepeat.dom.value);
                                    break;
                                case 'specularmap':
                                    child.material.specularMap.offset.height=inputvalueU.dom.value;
                                    child.material.specularMap.offset.width=inputvalueV.dom.value;
                                    child.material.specularMap.repeat.set(inputRepeat.dom.value,inputRepeat.dom.value);
                                    break;
                                case 'bumpmap':
                                    child.material.bumpMap.offset.height=inputvalueU.dom.value;
                                    child.material.bumpMap.offset.width=inputvalueV.dom.value;
                                    child.material.bumpMap.repeat.set(inputRepeat.dom.value,inputRepeat.dom.value);
                                    break;
                                case 'normalmap':
                                    child.material.normalMap.offset.height=inputvalueU.dom.value;
                                    child.material.normalMap.offset.width=inputvalueV.dom.value;
                                    child.material.normalMap.repeat.set(inputRepeat.dom.value,inputRepeat.dom.value);
                                    break;
                                case 'alphamap':
                                    child.material.alphaMap.offset.height=inputvalueU.dom.value;
                                    child.material.alphaMap.offset.width=inputvalueV.dom.value;
                                    child.material.alphaMap.repeat.set(inputRepeat.dom.value,inputRepeat.dom.value);
                                    break;
                                case 'emissivemap':
                                    child.material.emissiveMap.offset.height=inputvalueU.dom.value;
                                    child.material.emissiveMap.offset.width=inputvalueV.dom.value;
                                    child.material.emissiveMap.repeat.set(inputRepeat.dom.value,inputRepeat.dom.value);
                                    break;
                            }
                            child.material.needsUpdate=true;
                        }
                    }
                })
            }
            editor.signals.sceneGraphChanged.dispatch();
        }
        inputvalueU.onChange(setUV);
        inputvalueV.onChange(setUV);
        inputRepeat.onChange(setUV);

        return textureoption;

    };
}
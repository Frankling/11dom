/**
 * Created by DELL on 2016/2/16.
 */
var Material = function (editor) {
    var materialAttributes = new UI.Panel();
    //材质
    var materialHeader = new UI.createDiv('attrHeader',materialAttributes,'材质');
    var listOfMaterialHidden = new UI.createDiv('attrTriPng',materialHeader);
    var listOfMaterialHelp =new UI.createDiv('attrHelp',materialHeader);

    materialHeader.onClick(function () {
        if (materialBody.dom.style.display == "none") {
            materialBody.dom.style.display = "block";
            listOfMaterialHidden.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            materialBody.dom.style.display = "none";
            listOfMaterialHidden.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var materialBody = new UI.createDiv('Attr_Content',materialAttributes);
    materialBody.dom.style.display="none";


    //材质库
    var materialLibrary = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',materialLibrary,'类型');

    var materialClass = new UI.createDiv('selectBox',materialLibrary,null,'s');
    materialClass.setOptions( {
        // 'LineBasicMaterial': '直线基础材质',
        // 'LineDashedMaterial': '虚线材质',
        // 'MeshDepthMaterial': '网格深度材质',
        // 'MeshNormalMaterial': '网格法向材质',
        // 'ShaderMaterial': '着色器材质',
        // 'SpriteMaterial': '点精灵材质',
        'MeshLambertMaterial': '网格朗伯材质',
        'MeshPhongMaterial': '网格Phong材质',
        'MeshStandardMaterial': '网格标准材质'

    } ).setValue('MeshStandardMaterial').onChange(setMaterialType);
    var mLibraryButton = new UI.createDiv('option',materialLibrary,'材质库');
    mLibraryButton.dom.style.marginTop='9px';

//1.纹理=================================================================================================
    var mMapRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mMapRow,'纹理');

    //展开按钮
    var mMapImageArrows = new UI.createDiv('box2',mMapRow);
    var mMapBoxImg = new UI.createDiv('butImg',mMapImageArrows);
    mMapImageArrows.onClick(function(){
        $(mMapOption.dom).toggle();
    });
    //滑块
    var mMapBars=new  UI.createDiv('range',mMapRow);
    var mRange = new  UI.createDiv('',mMapBars,null,'i');
    mRange.dom.type = "range";
    mRange.dom.value = "100";
    $(mRange.dom).on("input change",function(){
        mMapInput.setValue(mRange.dom.value);
        var colorkd = new THREE.Color();
        colorkd.setHex(parseInt(mColor.dom.getAttribute("value").substr( 1 ), 16 ));
        colorkd.multiplyScalar(mRange.dom.value/100);
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        child.material.color.copy(colorkd);
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();
    });
    var mMapInput = new UI.createDiv('value',mMapRow,null,'i');
    $(mMapInput.dom).on("input change",function(){
        mRange.dom.value=Number(mMapInput.dom.value)||0;
        $(mRange.dom).trigger("input");
    });
    var mMapOption = new UI.createDiv('UV_color',materialBody);
    var mMapTitle = new UI.createDiv('tab',mMapOption);
    var mMapTextureBut = new UI.createDiv('text',mMapTitle,'贴图');
    var mMapColorBut = new UI.createDiv('text',mMapTitle,'颜色');

    mMapTextureBut.dom.style.backgroundColor="#000";
    mMapTextureBut.onClick(function(){
        mMapTextureBut.dom.style.background='#000';
        mMapColorBut.dom.style.background='#232323';
        mTextureOption.dom.style.display = "block";
        mColorOption.dom.style.display = "none";
    });
    mMapColorBut.onClick(function(){
        mMapColorBut.dom.style.background='#000';
        mMapTextureBut.dom.style.background='#232323';
        mColorOption.dom.style.display = "block";
        mTextureOption.dom.style.display = "none";
    });

    //贴图面板
    var mTextureOption = new Share.Textureoption('map');
    mMapOption.add(mTextureOption);
    //颜色面板
    var mColorOption = new UI.createDiv('UV_color_panel',mMapOption);
    var mColor = UI.createDiv('ui-color-picker',mColorOption);
    mColorOption.dom.style.display='none';
    $(mColor.dom).attr("value","#ffffff");
    $(mColor.dom).on("click",function(){
        //mapcontext.fillStyle=mapcolor.dom.getAttribute("value");
        //mapcontext.fillRect(0,0,mapcanvas.width,mapcanvas.height);
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(child.material.color!==undefined&&child.material.color.getHex()!==parseInt(mColor.dom.getAttribute("value").substr( 1 ), 16 )){
                           child.material.color.setHex(parseInt(mColor.dom.getAttribute("value").substr( 1 ), 16 ));
                        }
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();
    });

//2.光照=================================================================================================
    var mLightRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mLightRow,'光照');

    //展开按钮
    var mLightImageArrows = new UI.createDiv('box2',mLightRow);
    var mLightBoxImg = new UI.createDiv('butImg',mLightImageArrows);
    mLightImageArrows.onClick(function(){
        $(mLightOption.dom).toggle();
    });
    //滑块
    var materiallightmapbars=new  UI.createDiv('range',mLightRow);
    var materiallightmaprange = new  UI.createDiv('',materiallightmapbars,null,'i');
    materiallightmaprange.dom.type = "range";
    materiallightmaprange.dom.value = "0";
    materiallightmaprange.setId('novalue');
    //$(materiallightmaprange.dom).on("input change",function(){
    //    materiallightmapinput.setValue(materiallightmaprange.dom.value);
    //    //editor.lightGlobal.intensity = bgLightRange.dom.value/50;
    //    //editor.signals.sceneGraphChanged.dispatch();
    //});
    //滑块值
    var materiallightmapinput = new UI.createDiv('value',mLightRow,null,'i');
    materiallightmapinput.dom.value="null";
   /* $(materiallightmapinput.dom).on("input change",function(){
        materiallightmaprange.dom.value=Number(materiallightmapinput.dom.value)||0;
        $(materiallightmaprange.dom).trigger("input");
    });*/
    //隐藏颜色/纹理面板
    var mLightOption = new UI.createDiv('UV_color',materialBody);
    mLightOption.dom.style.height="132px";
    //贴图面板
    var mLightTextureOption = new Share.Textureoption('lightmap').setMarginTop('10px');
    mLightOption.add(mLightTextureOption);
//3.高光=================================================================================================
    var mSpecularMapRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mSpecularMapRow,'高光');
    //展开按钮
    var mSpecularMapArrows = new UI.createDiv('box2',mSpecularMapRow);
    var mSpecularMapImg = new UI.createDiv('butImg',mSpecularMapArrows);
    mSpecularMapArrows.onClick(function(){
        $(mSpecularMapOption.dom).toggle();
    });
    //滑块
    var materialspecularmapbars=new  UI.createDiv('range',mSpecularMapRow);
    var materialspecularmaprange = new  UI.createDiv('',materialspecularmapbars,null,'i');
    materialspecularmaprange.dom.type = "range";
    materialspecularmaprange.dom.value = "0";
    $(materialspecularmaprange.dom).on("input change",function(){
        materialspecularmapinput.setValue(materialspecularmaprange.dom.value);
        materialspecularmapinput.setValue(materialspecularmaprange.dom.value);
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(child.material.shininess!==undefined&&child.material.shininess!==materialspecularmaprange.dom.value/100) {
                            child.material.shininess = materialspecularmaprange.dom.value;
                        }
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();

    });
    //滑块值
    var materialspecularmapinput = new UI.createDiv('value',mSpecularMapRow,null,'i');
    $(materialspecularmapinput.dom).on("input change",function(){
        materialspecularmaprange.dom.value=Number(materialspecularmapinput.dom.value)||0;
        $(materialspecularmaprange.dom).trigger("input");
    });
    //隐藏颜色/纹理面板
    var mSpecularMapOption = new UI.createDiv('UV_color',materialBody);
    var mSpecularMapTitle = new UI.createDiv('tab',mSpecularMapOption);
    var mSpecularMapTextureBut = new UI.createDiv('text',mSpecularMapTitle,'贴图');
    var mSpecularMapColorBut = new UI.createDiv('text',mSpecularMapTitle,'颜色');

    mSpecularMapTextureBut.dom.style.backgroundColor="#000";
    mSpecularMapTextureBut.onClick(function(){
        mSpecularMapTextureBut.dom.style.background='#000';
        mSpecularMapColorBut.dom.style.background='#232323';
        mSpecularTextureOption.dom.style.display = "block";
        mSpecularColorOption.dom.style.display = "none";
    });
    mSpecularMapColorBut.onClick(function(){
        mSpecularMapColorBut.dom.style.background='#000';
        mSpecularMapTextureBut.dom.style.background='#232323';
        mSpecularColorOption.dom.style.display = "block";
        mSpecularTextureOption.dom.style.display = "none";
    });
    //贴图面板
    var mSpecularTextureOption = new Share.Textureoption('specularmap');
    mSpecularMapOption.add(mSpecularTextureOption);
    //颜色面板
    var mSpecularColorOption = new UI.createDiv('UV_color_panel',mSpecularMapOption);
    var mSpecularColor = UI.createDiv('ui-color-picker',mSpecularColorOption);
    mSpecularColorOption.dom.style.display='none';
    $(mSpecularColor.dom).on("click",function(){
        //specularcontext.fillStyle=specularcolor.dom.getAttribute("value");
        //specularcontext.fillRect(0,0,specularcanvas.width,specularcanvas.height);
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(child.material.specular!==undefined&&child.material.specular.getHex()!==parseInt( mSpecularColor.dom.getAttribute("value").substr( 1 ), 16 )){
                            child.material.specular.setHex(parseInt(mSpecularColor.dom.getAttribute('value').substr( 1 ), 16 ));
                        }
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();
    });
//4.凹凸=================================================================================================
    var mBumpMapRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mBumpMapRow,'凹凸');
    //展开按钮
    var mBumpMapArrows = new UI.createDiv('box2',mBumpMapRow);
    var mBumpMapImg = new UI.createDiv('butImg',mBumpMapArrows);
    mBumpMapArrows.onClick(function(){
        $(mBumpMapOption.dom).toggle();
    });
    //滑块
    var materialbumpmapbars=new  UI.createDiv('range',mBumpMapRow);
    var materialbumpmaprange = new  UI.createDiv('',materialbumpmapbars,null,'i');
    materialbumpmaprange.dom.type = "range";
    materialbumpmaprange.dom.value = "0";
    $(materialbumpmaprange.dom).on("input change",function(){
        materialbumpmapinput.setValue(materialbumpmaprange.dom.value);
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(child.material.bumpScale!==undefined&&child.material.bumpScale!==materialbumpmaprange.dom.value/100){
                            child.material.bumpScale=materialbumpmaprange.dom.value/100;
                        }
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();
    });
    //滑块值
    var materialbumpmapinput = new UI.createDiv('value',mBumpMapRow,null,'i');
    $(materialbumpmapinput.dom).on("input change",function(){
        materialbumpmaprange.dom.value=Number(materialbumpmapinput.dom.value)||0;
        $(materialbumpmaprange.dom).trigger("input");
    });
    //隐藏颜色/纹理面板
    var mBumpMapOption = new UI.createDiv('UV_color',materialBody);
    var mBumpMapTitle = new UI.createDiv('tab',mBumpMapOption);
    var mBumpMapTextureBut = new UI.createDiv('text',mBumpMapTitle,'凹凸');
    var mBumpMapNormalBut = new UI.createDiv('text',mBumpMapTitle,'法线');

    mBumpMapTextureBut.dom.style.backgroundColor="#000";
    mBumpMapTextureBut.onClick(function(){
        mBumpMapTextureBut.dom.style.background='#000';
        mBumpMapNormalBut.dom.style.background='#232323';
        materialbumptextureoption.dom.style.display = "block";
        materialnormaltextureoption.dom.style.display = "none";
    });
    mBumpMapNormalBut.onClick(function(){
        mBumpMapNormalBut.dom.style.background='#000';
        mBumpMapTextureBut.dom.style.background='#232323';
        materialnormaltextureoption.dom.style.display = "block";
        materialbumptextureoption.dom.style.display = "none";
    });
    //凹凸面板
    var materialbumptextureoption = new Share.Textureoption('bumpmap');
    mBumpMapOption.add(materialbumptextureoption);
    //凹凸面板
    var materialnormaltextureoption = new Share.Textureoption('normalmap');
    mBumpMapOption.add(materialnormaltextureoption);
    materialnormaltextureoption.dom.style.display='none';

 //5.透明=================================================================================================
    var mAlphaMapRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mAlphaMapRow,'透明');
    //展开按钮
    var mAlphaMapImageArrows = new UI.createDiv('box2',mAlphaMapRow);
    var mAlphaMapImage = new UI.createDiv('butImg',mAlphaMapImageArrows);
    mAlphaMapImageArrows.onClick(function(){
        $(mAlphaMapOption.dom).toggle();
    });

    //滑块
    var materialalphamapbars=new  UI.createDiv('range',mAlphaMapRow);
    var materialalphamaprange = new  UI.createDiv('',materialalphamapbars,null,'i');
    materialalphamaprange.dom.type = "range";
    materialalphamaprange.dom.value = "100";
    $(materialalphamaprange.dom).on("input change",function(){
        materialalphamapinput.setValue(materialalphamaprange.dom.value);
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(child.material.opacity!==undefined&&child.material.opacity!==materialalphamaprange.dom.value/100){
                            child.material.transparent=true;
                            child.material.opacity=materialalphamaprange.dom.value/100;
                            child.material.needsUpdate=true;
                        }
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();
    });

    //滑块值
    var materialalphamapinput = new UI.createDiv('value',mAlphaMapRow,null,'i');
    $(materialalphamapinput.dom).on("input change",function(){
        materialalphamaprange.dom.value=Number(materialalphamapinput.dom.value)||0;
        $(materialalphamaprange.dom).trigger("input");
    });
    //隐藏颜色/纹理面板
    var mAlphaMapOption = new UI.createDiv('UV_color',materialBody);
    mAlphaMapOption.dom.style.height="132px";

    //透明混合面板
    var mAlphaTextureOption = new Share.Textureoption('alphamap').setMarginTop('10px');
    mAlphaMapOption.add(mAlphaTextureOption);
//6.自光=================================================================================================
    var mEmissiveRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mEmissiveRow,'自光');

    //展开按钮
    var mEmissiveImageArrows = new UI.createDiv('box2',mEmissiveRow);
    var mEmissiveImage = new UI.createDiv('butImg',mEmissiveImageArrows);
    mEmissiveImageArrows.onClick(function(){
        $(mEmissiveOptions.dom).toggle();
    });
    //滑块
    var mEmissiveBars=new  UI.createDiv('range',mEmissiveRow);
    var mEmissiveRange = new  UI.createDiv('',mEmissiveBars,null,'i');
    mEmissiveRange.dom.type = "range";
    mEmissiveRange.dom.value = "0";
    mEmissiveRange.setId('novalue');
    //滑块值
    var mEmissiveInput = new UI.createDiv('value',mEmissiveRow,null,'i');
    mEmissiveInput.dom.value= 'null';
    //隐藏颜色/纹理面板
    var mEmissiveOptions = new UI.createDiv('UV_color',materialBody);
    var mEmissiveTitle = new UI.createDiv('tab',mEmissiveOptions);
    var mEmissiveTextureBut = new UI.createDiv('text',mEmissiveTitle,'贴图');
    var mEmissiveColorBut = new UI.createDiv('text',mEmissiveTitle,'颜色');
    mEmissiveTextureBut.dom.style.backgroundColor="#000";
    mEmissiveTextureBut.onClick(function(){
        mEmissiveTextureBut.dom.style.background='#000';
        mEmissiveColorBut.dom.style.background='#232323';
        mEmissiveMapOption.dom.style.display = "block";
        mEmissiveColorOption.dom.style.display = "none";
    });
    mEmissiveColorBut.onClick(function(){
        mEmissiveColorBut.dom.style.background='#000';
        mEmissiveTextureBut.dom.style.background='#232323';
        mEmissiveColorOption.dom.style.display = "block";
        mEmissiveMapOption.dom.style.display = "none";
    });
    //贴图面板
    var mEmissiveMapOption = new Share.Textureoption('emissivemap');
    mEmissiveOptions.add(mEmissiveMapOption);

    //颜色面板
    var mEmissiveColorOption = new UI.createDiv('UV_color_panel',mEmissiveOptions);
    var mEmissiveColor = UI.createDiv('ui-color-picker',mEmissiveColorOption);
    mEmissiveColorOption.dom.style.display='none';

    $(mEmissiveColor.dom).on("click",function(){
        //emissivecontext.fillStyle=emissivecolor.dom.getAttribute("value");
        //emissivecontext.fillRect(0,0,emissivecanvas.width,emissivecanvas.height);
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(child.material.emissive!==undefined&&child.material.emissive.getHex()!==parseInt( mEmissiveColor.dom.getAttribute("value").substr( 1 ), 16 )){
                            child.material.emissive.setHex(parseInt(mEmissiveColor.dom.getAttribute('value').substr( 1 ), 16 ));
                        }
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();
    });
//7.光泽=============================================================================================
    var mGlossRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mGlossRow,'光泽');
    var mGlossSwitch=new  UI.createDiv('OffButton',mGlossRow);
    mGlossSwitch.onClick(function () {
        if (mGlossSwitch.dom.className === "OffButton") {
            mGlossSwitch.setClass("onButton");
        } else {
            mGlossSwitch.setClass("OffButton");
            mGlossRange.dom.value=0;
            $(mGlossRange.dom).trigger("input");

        }
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(mGlossSwitch.dom.className === "onButton"){
                            if(child.material.roughness!==undefined&&child.material.roughness!==mGlossRange.dom.value/100) {
                                child.material.roughness = mGlossRange.dom.value / 100;
                            }
                        }else{
                            child.material.roughness = 0;
                        }
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();
    });
    //滑块
    var mGlossBars=new  UI.createDiv('range',mGlossRow);
    var mGlossRange = new  UI.createDiv('',mGlossBars,null,'i');
    mGlossRange.dom.type = "range";
    mGlossRange.dom.value = "50";
    $(mGlossRange.dom).on("input change",function(){
        mGlossInput.setValue(mGlossRange.dom.value);
        if(mGlossSwitch.dom.className === "onButton"){
            for(var i in editor.selected){
                editor.selected[i].traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        if (child.material) {
                            if(child.material.roughness!==undefined&&child.material.roughness!==mGlossRange.dom.value/100) {
                                child.material.roughness = mGlossRange.dom.value/100;
                            }
                        }
                    }
                })
            }
            editor.signals.sceneGraphChanged.dispatch();
        }
    });
    //滑块值
    var mGlossInput = new UI.createDiv('value',mGlossRow,null,'i');
    $(mGlossInput.dom).on("input change",function(){
        mGlossRange.dom.value=Number(mGlossInput.dom.value)||0;
        $(mGlossRange.dom).trigger("input");
    });
//8.金属=============================================================================================
    var mMetalRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mMetalRow,'金属');
    var mMetalSwitch=new  UI.createDiv('OffButton',mMetalRow);
    mMetalSwitch.onClick(function () {
        if (mMetalSwitch.dom.className === "OffButton") {
            mMetalSwitch.setClass("onButton");
        } else {
            mMetalSwitch.setClass("OffButton");
            mMetalRange.dom.value=0;
            $(mMetalRange.dom).trigger("input");

        }
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(mMetalSwitch.dom.className === "onButton"){
                            if(child.material.metalness!==undefined&&child.material.metalness!==mMetalRange.dom.value/100) {
                                child.material.metalness = mMetalRange.dom.value / 100;
                            }
                        }else{
                            child.material.metalness = 0;
                        }
                    }
                }
            })
        }
        editor.signals.sceneGraphChanged.dispatch();
    });

    //滑块
    var mMetalBars=new  UI.createDiv('range',mMetalRow);
    var mMetalRange = new  UI.createDiv('',mMetalBars,null,'i');
    mMetalRange.dom.type = "range";
    mMetalRange.dom.value = "50";
    $(mMetalRange.dom).on("input change",function(){
        mMetalInput.setValue(mMetalRange.dom.value);
        if(mMetalSwitch.dom.className === "onButton") {
            for (var i in editor.selected) {
                editor.selected[i].traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        if (child.material) {
                            if (child.material.metalness !== undefined && child.material.metalness !== mMetalRange.dom.value / 100) {
                                child.material.metalness = mMetalRange.dom.value / 100;
                            }
                        }
                    }
                })
            }
            editor.signals.sceneGraphChanged.dispatch();
        }
    });

    //滑块值
    var mMetalInput = new UI.createDiv('value',mMetalRow,null,'i');
    $(mMetalInput.dom).on("input change",function(){
        mMetalRange.dom.value=Number(mMetalInput.dom.value)||0;
        $(mMetalRange.dom).trigger("input");
    });

//9.反射=============================================================================================
    var mReflectionRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mReflectionRow,'反射');
    var mReflectionSwitch=new  UI.createDiv('OffButton',mReflectionRow);
    mReflectionSwitch.onClick(function () {
        if (mReflectionSwitch.dom.className === "OffButton") {
            mReflectionSwitch.setClass("onButton");
        } else {
            mReflectionSwitch.setClass("OffButton");
            //mMetalRange.dom.value=0;
            //$(mMetalRange.dom).trigger("input");

        }
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(mReflectionSwitch.dom.className === "onButton"){
                           // if(child.material.envMap)editor.alladdenvMap.remove(child.id);
                            editor.signals.envmappingChange.dispatch(child.material,301);
                            if(child.material.reflectivity!==undefined&&child.material.reflectivity!==mReflectionRange.dom.value/100) {
                                child.material.reflectivity= mReflectionRange.dom.value / 100;
                            }
                            mRefractionSwitch.setClass("OffButton");
                            //$(materialrefractionimagearrows.dom).removeClass('OnButtons').addClass('OffButtons');
                            //isRefraction=false;
                            //console.log(child.uuid)
                            //editor.alladdenvMap.push(child.id);
                        }else{
                            child.material.envMap=null;
                           // editor.alladdenvMap.remove(child.id);
                        }
                        child.material.needsUpdate=true;
                        //console.log(editor.alladdenvMap)
                    }
                }
                editor.signals.sceneGraphChanged.dispatch();
            })
        }
    });

    //滑块
    var mReflectionBars=new  UI.createDiv('range',mReflectionRow);
    var mReflectionRange = new  UI.createDiv('',mReflectionBars,null,'i');
    mReflectionRange.dom.type = "range";
    mReflectionRange.dom.value = "100";
    $(mReflectionRange.dom).on("input change",function(){
        mReflectionInput.setValue(mReflectionRange.dom.value);
        if(mReflectionSwitch.dom.className === "onButton"){
            for(var i in editor.selected){
                editor.selected[i].traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        if (child.material) {
                            if(child.material.reflectivity!==undefined&&child.material.reflectivity!==mReflectionRange.dom.value/100) {
                                child.material.reflectivity =mReflectionRange.dom.value/100;
                            }
                            if(child.material.envMapIntensity!==undefined&&child.material.envMapIntensity!==mReflectionRange.dom.value/100) {
                                child.material.envMapIntensity =mReflectionRange.dom.value/100;
                            }
                        }
                    }
                })
            }
            editor.signals.sceneGraphChanged.dispatch();
        }
    });

    //滑块值
    var mReflectionInput = new UI.createDiv('value',mReflectionRow,null,'i');
    $(mReflectionInput.dom).on("input change",function(){
        mReflectionRange.dom.value=Number(mReflectionInput.dom.value)||0;
        $(mReflectionRange.dom).trigger("input");
    });
 //10.折射=============================================================================================
    var mRefractionRow = new UI.createDiv('attrRow',materialBody);
    new UI.createDiv('text',mRefractionRow,'折射');

    //开关
    var mRefractionSwitch=new  UI.createDiv('OffButton',mRefractionRow);
    mRefractionSwitch.onClick(function () {
        debugger
        if (mRefractionSwitch.dom.className === "OffButton") {
            mRefractionSwitch.setClass("onButton");
        } else {
            mRefractionSwitch.setClass("OffButton");
        }
        for(var i in editor.selected){
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        if(mRefractionSwitch.dom.className === "onButton"){
                           // if(child.material.envMap)editor.alladdenvMap.remove(child);
                            editor.signals.envmappingChange.dispatch(child.material,302);
                            child.material.reflectivity=1;
                            if(child.material.refractionRatio!==undefined&&child.material.refractionRatio!==mRefractionRange.dom.value/100) {
                                child.material.refractionRatio= mRefractionRange.dom.value / 100;
                            }
                            mReflectionSwitch.setClass("OffButton");

                        }else{
                            child.material.envMap=null;
                          //  child.material.envMap.dispose();

                        }

                        child.material.needsUpdate=true;
                        editor.signals.sceneGraphChanged.dispatch();
                    }
                }

            })
        }
    });
    //滑块
    var mRefractionBars=new  UI.createDiv('range',mRefractionRow);
    var mRefractionRange = new  UI.createDiv('',mRefractionBars,null,'i');
    mRefractionRange.dom.type = "range";
    mRefractionRange.dom.value = "98";
    $(mRefractionRange.dom).on("input change",function(){
        mRefractionInput.setValue(mRefractionRange.dom.value);
        if(mRefractionSwitch.dom.className === "onButton"){
            for(var i in editor.selected){
                editor.selected[i].traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        if (child.material) {
                            if(child.material.refractionRatio!==undefined&&child.material.refractionRatio!==mRefractionRange.dom.value/100) {
                                child.material.refractionRatio =mRefractionRange.dom.value/100;
                                editor.signals.sceneGraphChanged.dispatch();
                            }
                        }
                    }
                })
            }
        }
    });

    //滑块值
    var mRefractionInput = new UI.createDiv('value',mRefractionRow,null,'i');
    $(mRefractionInput.dom).on("input change",function(){
        mRefractionRange.dom.value=Number(mRefractionInput.dom.value)||0;
        $(mRefractionRange.dom).trigger("input");
    });


       //贴图画布
    var mTextureCanvas=mTextureOption.dom.children[0];
    var mTextureContext=mTextureCanvas.getContext('2d');

    var lMapTextureCanvas= mLightTextureOption.dom.children[0];
    var lMapTextureContext=lMapTextureCanvas.getContext('2d');

    var sTextureCanvas= mSpecularTextureOption.dom.children[0];
    var sTextureContext=sTextureCanvas.getContext('2d');

    var bMapTextureCanvas= materialbumptextureoption.dom.children[0];
    var bMapTextureContext= bMapTextureCanvas.getContext('2d');

    var nMapTextureCanvas= materialnormaltextureoption.dom.children[0];
    var nMapTextureContext=nMapTextureCanvas.getContext('2d');

    var mAlphaTextureCanvas= mAlphaTextureOption.dom.children[0];
    var mAlphaTextureContext=mAlphaTextureCanvas.getContext('2d');

    var mEmissiveTextureCanvas=mEmissiveMapOption.dom.children[0];
    var mEmissiveTextureContext= mEmissiveTextureCanvas.getContext('2d');

    $(mTextureOption.dom).on('change',function(){
        mMapBoxImg.dom.style.backgroundImage ="url(" + mTextureOption.dom.getAttribute("img")+ ")";
    });
    $(mLightTextureOption.dom).on('change',function(){
        mLightBoxImg.dom.style.backgroundImage ="url(" + mLightTextureOption.dom.getAttribute("img")+ ")";
    });
    $(mSpecularTextureOption.dom).on('change',function(){
        mSpecularMapImg.dom.style.backgroundImage ="url(" + mSpecularTextureOption.dom.getAttribute("img")+ ")";
    });
    $(materialbumptextureoption.dom).on('change',function(){
        mBumpMapImg.dom.style.backgroundImage ="url(" + materialbumptextureoption.dom.getAttribute("img")+ ")";
    });
    $(mAlphaTextureOption.dom).on('change',function(){
        mAlphaMapImage.dom.style.backgroundImage ="url(" + mAlphaTextureOption.dom.getAttribute("img")+ ")";
    });
    $(mEmissiveMapOption.dom).on('change',function(){
        mEmissiveImage.dom.style.backgroundImage ="url(" + mEmissiveMapOption.dom.getAttribute("img")+ ")";
    });
//      /*  //纹理
//        var mapcanvas=materialmapimagearrows.dom.children[0];
//        var mapcontext=mapcanvas.getContext('2d');
//
//        var maptexturecanvas=materialtextureoption.dom.children[0];
//        var maptexturecontext=maptexturecanvas.getContext('2d');
//        //光照
//        var lightmapcanvas=materiallightmapimagearrows.dom.children[0];
//        var lightmapcontext=lightmapcanvas.getContext('2d');
//
//        var lightmaptexturecanvas= materiallighttextureoption.dom.children[0];
//        var lightmaptexturecontext=lightmaptexturecanvas.getContext('2d');
//        //高光
//        var specularcanvas=materialspecularmapimagearrows.dom.children[0];
//        var specularcontext=specularcanvas.getContext('2d');
//
//        var speculartexturecanvas= materialspeculartextureoption.dom.children[0];
//        var speculartexturecontext=speculartexturecanvas.getContext('2d');
//        //凹凸
//        var bumpmapcanvas=materialbumpmapimagearrows.dom.children[0];
//        var bumpmapcontext=bumpmapcanvas.getContext('2d');
//
//        var bumpmaptexturecanvas= materialbumptextureoption.dom.children[0];
//        var bumpmaptexturecontext= bumpmaptexturecanvas.getContext('2d');
//
//        var normalmaptexturecanvas= materialnormaltextureoption.dom.children[0];
//        var normalmaptexturecontext=normalmaptexturecanvas.getContext('2d');
//        //透明
//        var alphacanvas=materialalphamapimagearrows.dom.children[0];
//        var alphacontext= alphacanvas.getContext('2d');
//
//        var alphamaptexturecanvas= materialalphatextureoption.dom.children[0];
//        var alphamaptexturecontext=alphamaptexturecanvas.getContext('2d');
//        //自光
//        var emissivecanvas=emissivebut.dom.children[0];
//        var emissivecontext= emissivecanvas.getContext('2d');
//
//        var emissivemapcanvas=materialemissivemap.dom.children[0];
//        var emissivemapcontext= emissivemapcanvas.getContext('2d');*/
//===============================================================================================================

        $(function () {
            //kindsbutton点击
            $('.box2').click(function (e) {
               // var index = $(this).parent().parent().find('.box2').index(this);
                //$(this).parent().parent().find('.UV_color').eq(index).toggle();
                var ev = e || window.event;
                if(ev.stopPropagation){
                    ev.stopPropagation();
                }
                else if(window.event){
                    window.event.cancelBubble = true;//兼容IE
                }
            });
            document.onclick = function(){
                $(".UV_color").hide();

            };
            $(".UV_color").click(function(e){
                var ev = e || window.event;
                if(ev.stopPropagation){
                    ev.stopPropagation();
                }
                else if(window.event){
                    window.event.cancelBubble = true;//兼容IE

                }
            });
            /* //onebutton点击
            $('.oneButton').click(function (e) {
                var index = $(this).parent().parent().find('.oneButton').index(this);
                $(this).parent().parent().find('.materialmapoption').eq(index).toggle();
                var ev = e || window.event;
                if(ev.stopPropagation){
                    ev.stopPropagation();
                }
                else if(window.event){
                    window.event.cancelBubble = true;//兼容IE
                }

            });
            document.onclick = function(){
                $(".UV_color").hide();

            };
            $(".materialmapoption").click(function(e){
                var ev = e || window.event;
                if(ev.stopPropagation){
                    ev.stopPropagation();
                }
                else if(window.event){
                    window.event.cancelBubble = true;//兼容IE

                }
            });
            //贴图、颜色切换
            for(var index=0;index<8;index+=2){
                $('.materialtexturebut').eq(index).addClass('butdown');
            }
            $('.materialtexturebut').click(function () {
                $(this).addClass('butdown').siblings().removeClass('butdown');
                var index =$(this).parent().parent().find('.materialtexturebut').index(this);
                $(this).parent().parent().find('.coloroption').eq(index).show().siblings().hide();
                $('.materialtexturetab').show();
            })*/

        });
    //材质列表
    function setMaterialType() {
        //  var material;
        // var materialtype;
        /* switch (materialClass.getValue()) {
         case 'MeshLambertMaterial':
         materialtype = new THREE.MeshLambertMaterial();
         break;
         case 'MeshPhongMaterial':
         materialtype = new THREE.MeshPhongMaterial();
         break;
         case 'MeshStandardMaterial':
         materialtype = new THREE.MeshStandardMaterial();
         break;
         }*/

        for (var i in editor.selected) {
            editor.selected[i].traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        var materialtype;
                        switch (materialClass.getValue()){
                            case 'MeshLambertMaterial':
                                materialtype = new THREE.MeshLambertMaterial();
                                break;
                            case 'MeshPhongMaterial':
                                materialtype = new THREE.MeshPhongMaterial();
                                break;
                            case 'MeshStandardMaterial':
                                materialtype = new THREE.MeshStandardMaterial();
                                break;
                        }
                        if(child.material.envMap){
                            materialtype.envMap  = child.material.envMap;
                        }
                        setRowVisibility(materialtype);
                        child.material = materialtype;
                        MaterialUpdate (child.material);
                        editor.signals.sceneGraphChanged.dispatch();
                    }

                }
            })
        }
    }
    //选项显示
    function setRowVisibility(material){
        mMapRow.dom.style.display =  material.map !== undefined ? 'block' : 'none';
        mLightRow.dom.style.display = material.lightMap !== undefined ? 'block' : 'none';
        mSpecularMapRow.dom.style.display = material.specular !== undefined ? 'block' : 'none';
        mBumpMapRow.dom.style.display =  material.bumpMap !== undefined ? 'block' : 'none';
        mAlphaMapRow.dom.style.display = material.alphaMap !== undefined ? 'block' : 'none';
        mEmissiveRow.dom.style.display = material.emissive !== undefined ? 'block' : 'none';
        mGlossRow.dom.style.display =  material.roughness !== undefined ? 'block' : 'none';
        mMetalRow.dom.style.display =  material.metalness !== undefined ? 'block' : 'none';
        mReflectionRow.dom.style.display =  material.reflectivity !== undefined||material.envMapIntensity ? 'block' : 'none';
        mRefractionRow.dom.style.display =  material.refractionRatio !== undefined ? 'block' : 'none';
    }
    //材质更改显示值
    function MaterialUpdate (material) {
      // var material = null;
      // for(var i in editor.selected){
      //     editor.selected[i].traverse(function(child) {
      //         if (child instanceof THREE.Mesh) {
      //             if (child.material) {
      //                 //child.material.needsUpdate=true;
      //                 material=child.material;
      //                 setRowVisibility(child.material);
      //             }
      //         }
      //     })
      // }
        if(material){
            if(material.envMap){
                if (material.envMap.mapping==302||material.envMap.mapping==304) {
                    mReflectionSwitch.setClass("OffButton");
                    mRefractionSwitch.setClass("onButton");

                    //isRefraction=true;
                    //isReflection=false;
                    //$(materialrefractionimagearrows.dom).removeClass('OffButtons').addClass('OnButtons');
                    //$(materialreflectionimagearrows.dom).addClass('OffButtons');
                }
                if (material.envMap.mapping==301||material.envMap.mapping==305) {
                    //isReflection=true;
                    //isRefraction=false;
                    mRefractionSwitch.setClass("OffButton");
                    mReflectionSwitch.setClass("onButton");

                    //$( materialreflectionimagearrows.dom).removeClass('OffButtons').addClass('OnButtons');
                    //$(materialrefractionimagearrows.dom).addClass('OffButtons');
                }
            }
            else{
                mReflectionSwitch.setClass("OffButton");
                mRefractionSwitch.setClass("OffButton");
                //isRefraction=false;
                //$(materialrefractionimagearrows.dom).addClass('OffButtons');
                //$(materialreflectionimagearrows.dom).addClass('OffButtons');
            }
            materialClass.setValue(material.type);
            if(mRange.dom.value!=='100') {
                mRange.dom.value=100;
                $(mRange.dom).trigger("input");
            }

            if(material.color!==undefined){
                $(mColor.dom).attr("value","#"+material.color.getHexString()).click();
            }
            if(material.map!==undefined&&material.map!==null){
                //console.log(material.map.image)
                mMapBoxImg.dom.style.backgroundImage ="url(" + material.map.image.src + ")";
                mTextureContext.drawImage(material.map.image, 0, 0, mTextureCanvas.width, mTextureCanvas.height);
                mTextureOption.dom.querySelectorAll('input')[0].value=material.map.offset.height;
                mTextureOption.dom.querySelectorAll('input')[1].value=material.map.offset.width;
                mTextureOption.dom.querySelectorAll('input')[2].value=material.map.repeat.x;
                mMapTextureBut.dom.click();
            }else{
                //mMapBoxImg.dom.style.backgroundImage="";
                //mapcontext.fillStyle="#"+material.color.getHexString();
                //mapcontext.fillRect(0,0,mapcanvas.width, mapcanvas.height);
                //mTextureContext.fillStyle="#171717";
                //mTextureContext.fillRect(0,0,mTextureCanvas.width, mTextureCanvas.height);
                //mTextureOption.dom.setAttribute("img","");
                mTextureOption.dom.querySelector('div').click();
                //$(mTextureOption.dom).trigger("change");
                mMapColorBut.dom.click();
            }
            if(material.lightMap!==undefined&&material.lightMap!==null){
                mLightBoxImg.dom.style.backgroundImage ="url(" + material.lightMap.image.src + ")";
                lMapTextureContext.drawImage(material.lightMap.image, 0, 0, lMapTextureCanvas.width, lMapTextureCanvas.height);
                mLightTextureOption.dom.querySelectorAll('input')[0].value=material.lightMap.offset.height;
                mLightTextureOption.dom.querySelectorAll('input')[1].value=material.lightMap.offset.width;
                mLightTextureOption.dom.querySelectorAll('input')[2].value=material.lightMap.repeat.x;
            }else{
                mLightTextureOption.dom.querySelector('div').click();
                //mLightBoxImg.dom.style.backgroundImage="";
                //lightmapcontext.fillStyle="#171717";
                //lightmapcontext.fillRect(0,0, lightmapcanvas.width,  lightmapcanvas.height);
                // lMapTextureContext.fillStyle="#171717";
                // lMapTextureContext.fillRect(0,0,lMapTextureCanvas.width, lMapTextureCanvas.height);
            }
            if(material.shininess!==undefined){
                materialspecularmaprange.setValue(material.shininess);
                $( materialspecularmaprange.dom).trigger("input");
            }
            if(material.specular!==undefined){
                $(mSpecularColor.dom).attr("value","#"+material.specular.getHexString()).click();
            }
            if(material.specularMap!==undefined&&material.specularMap!==null){
                mSpecularMapImg.dom.style.backgroundImage ="url(" + material.specularMap.image.src+ ")";
                //specularcontext.drawImage(material.specularMap.image, 0, 0, specularcanvas.width, specularcanvas.height);
                sTextureContext.drawImage(material.specularMap.image, 0, 0, sTextureCanvas.width, sTextureCanvas.height);
                mSpecularTextureOption.dom.querySelectorAll('input')[0].value=material.specularMap.offset.height;
                mSpecularTextureOption.dom.querySelectorAll('input')[1].value=material.specularMap.offset.width;
                mSpecularTextureOption.dom.querySelectorAll('input')[2].value=material.specularMap.repeat.x;
                mSpecularMapTextureBut.dom.click();
            }else if(material.specular!==undefined){
                mSpecularTextureOption.dom.querySelector('div').click();
                //mSpecularMapImg.dom.style.backgroundImage="";
                //specularcontext.fillStyle="#"+material.specular.getHexString();
                //specularcontext.fillRect(0,0,specularcanvas.width, specularcanvas.height);
                //sTextureContext.fillStyle="#171717";
                // sTextureContext.fillRect(0,0,sTextureCanvas.width, sTextureCanvas.height);
                mSpecularMapColorBut.dom.click();
            }
            if(material.bumpScale!==undefined){
                materialbumpmaprange.setValue(material.bumpScale*100);
                $(materialbumpmaprange.dom).trigger("input");
            }
            if(material.bumpMap!==undefined&&material.bumpMap!==null){
                mBumpMapImg.dom.style.backgroundImage= "url(" + material.bumpMap.image.src+ ")";
                //bumpmapcontext.drawImage(material.bumpMap.image, 0, 0, bumpmapcanvas.width, bumpmapcanvas.height);
                bMapTextureContext.drawImage(material.bumpMap.image, 0, 0, bMapTextureCanvas.width, bMapTextureCanvas.height);
                materialbumptextureoption.dom.querySelectorAll('input')[0].value=material.bumpMap.offset.height;
                materialbumptextureoption.dom.querySelectorAll('input')[1].value=material.bumpMap.offset.width;
                materialbumptextureoption.dom.querySelectorAll('input')[2].value=material.bumpMap.repeat.x;
                mBumpMapTextureBut.dom.click();
            }
            else if(material.normalMap!==undefined&&material.normalMap!==null){
                mBumpMapImg.dom.style.backgroundImage= "url(" + material.normalMap.image.src+ ")";
                //bumpmapcontext.drawImage(material.normalMap.image, 0, 0, bumpmapcanvas.width, bumpmapcanvas.height);
                nMapTextureContext.drawImage(material.normalMap.image, 0, 0, nMapTextureCanvas.width, nMapTextureCanvas.height);
                materialnormaltextureoption.dom.querySelectorAll('input')[0].value=material.normalMap.offset.height;
                materialnormaltextureoption.dom.querySelectorAll('input')[1].value=material.normalMap.offset.width;
                materialnormaltextureoption.dom.querySelectorAll('input')[2].value=material.normalMap.repeat.x;
                mBumpMapNormalBut.dom.click();
            }else{
                //mBumpMapImg.dom.style.backgroundImage="";
                //bumpmapcontext.fillStyle="#171717";
                //bumpmapcontext.fillRect(0,0,specularcanvas.width, specularcanvas.height);
                // bMapTextureContext.fillStyle="#171717";
                //bMapTextureContext.fillRect(0,0,bMapTextureCanvas.width, bMapTextureCanvas.height);
                //nMapTextureContext.fillStyle="#171717";
                //nMapTextureContext.fillRect(0,0,nMapTextureCanvas.width, nMapTextureCanvas.height);
                materialbumptextureoption.dom.querySelector('div').click();
                materialnormaltextureoption.dom.querySelector('div').click();
            }
            if(material.alphaMap!==undefined&&material.alphaMap!==null){
                mAlphaMapImage.dom.style.backgroundImage= "url(" + material.alphaMap.image.src+ ")";

                //alphacontext.drawImage(material.alphaMap.image, 0, 0, alphacanvas.width, alphacanvas.height);
                mAlphaTextureContext.drawImage(material.alphaMap.image, 0, 0, mAlphaTextureCanvas.width, mAlphaTextureCanvas.height);
                mAlphaTextureOption.dom.querySelectorAll('input')[0].value=material.alphaMap.offset.height;
                mAlphaTextureOption.dom.querySelectorAll('input')[1].value=material.alphaMap.offset.width;
                mAlphaTextureOption.dom.querySelectorAll('input')[2].value=material.alphaMap.repeat.x;
            }else{
                mAlphaTextureOption.dom.querySelector('div').click();
                //mAlphaMapImage.dom.style.backgroundImage="";
                //alphacontext.fillStyle="#171717";
                //alphacontext.fillRect(0,0,alphacanvas.width,alphacanvas.height);
                // mAlphaTextureContext.fillStyle="#171717";
                // mAlphaTextureContext.fillRect(0,0,mAlphaTextureCanvas.width, mAlphaTextureCanvas.height);
            }
            if(material.opacity!==undefined){
                materialalphamaprange.setValue(material.opacity*100);
                $( materialalphamaprange.dom).trigger("input");
            }
            if(material.emissiveMap!==undefined&&material.emissiveMap!==null){
                mEmissiveImage.dom.style.backgroundImage= "url(" + material.emissiveMap.image.src+ ")";
                //emissivecontext.drawImage(material.emissiveMap.image, 0, 0,  emissivecanvas.width,  emissivecanvas.height);
                mEmissiveTextureContext.drawImage(material.emissiveMap.image, 0, 0,  mEmissiveTextureCanvas.width,  mEmissiveTextureCanvas.height);
                mEmissiveMapOption.dom.querySelectorAll('input')[0].value=material.emissiveMap.offset.height;
                mEmissiveMapOption.dom.querySelectorAll('input')[1].value=material.emissiveMap.offset.width;
                mEmissiveMapOption.dom.querySelectorAll('input')[2].value=material.emissiveMap.repeat.x;
                mEmissiveTextureBut.dom.click();
            }else if(material.emissive!==undefined){
                mEmissiveMapOption.dom.querySelector('div').click();
                // mEmissiveImage.dom.style.backgroundImage ="";
                //emissivecontext.fillStyle='#'+material.emissive.getHexString();
                //emissivecontext.fillRect(0,0,emissivecanvas.width, emissivecanvas.height);
                // mEmissiveTextureContext.fillStyle='#'+material.emissive.getHexString();
                // mEmissiveTextureContext.fillRect(0,0,mEmissiveTextureCanvas.width,  mEmissiveTextureCanvas.height);
                mEmissiveColorBut.dom.click();
            }
            if(material.emissive!==undefined){
                $(mEmissiveColor.dom).attr("value","#"+material.emissive.getHexString()).click();
            }
            if(material.roughness!==undefined){
                mGlossRange.setValue(material.roughness*100);
                $(mGlossRange.dom).trigger("input");
                if( mGlossRange.getValue() == "0"){
                    mGlossSwitch.setClass("OffButton");
                }else{
                    mGlossSwitch.setClass("onButton");
                }
            }
            if(material.metalness!==undefined){
                mMetalRange.setValue(material.metalness*100);
                $(mMetalRange.dom).trigger("input");
                if( mMetalRange.getValue() == "0"){
                    mMetalSwitch.setClass("OffButton");
                }else{
                    mMetalSwitch.setClass("onButton");
                }
            }
            if(material.reflectivity!==undefined){
                mReflectionRange.setValue(material.reflectivity*100);
                $( mReflectionRange.dom).trigger("input");
            }
            if(material.refractionRatio!==undefined){
                mRefractionRange.setValue(material.refractionRatio*100);
                $(mRefractionRange.dom).trigger("input");
            }
        }
    }
    editor.signals.selectChanged.add(function(object){

        var material = null;
        for(var i in editor.selected){
            if(editor.selected[i] instanceof THREE.LightObject){
                materialBody.dom.style.display="none";
                break;
            }
            materialBody.dom.style.display="block";
            editor.selected[i].traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (child.material) {
                        //child.material.needsUpdate=true;
                        material=child.material;
                        setRowVisibility(child.material);
                    }
                }
            })
        }
        MaterialUpdate (material);
    });

    return materialAttributes;

};
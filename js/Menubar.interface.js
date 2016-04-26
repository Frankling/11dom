/**
 * Created by asforever on 2016/3/31.
 */
/**
 * Created by DELL on 2016/1/8.
 */

/*4-18*/
Menubar.interface = function ( editor ) {
    var label2d=new UI.Panel();
    label2d.setClass("label2d");
    var labelHead= new UI.createDiv('labelHead',label2d);
    var labelBody=new UI.createDiv('labelBody',label2d);
    var drawLine=function(){
        var lineDiv=document.createElement("canvas");
        lineDiv.style.height="50px";
        lineDiv.style.width="100px";
        var lineContext = lineDiv.getContext( '2d' );
        lineContext.strokeStyle = "blue";
        lineContext.lineWidth = 3;
        lineContext.beginPath();
        lineContext.moveTo(0,150);
        lineContext.lineTo(300,0);
        lineContext.stroke();
        return lineDiv;
    };
    var refreshLabelDom=function(){
        editor.label
    };





    var container = new UI.Panel().setClass('menu');
    var menuName = new UI.createDiv('title',container);
    menuName.dom.style.backgroundImage="url('image/object.png')";
    container.add( menuName );
    menuName.onClick(function(){
        if(sidePanel.dom.style.display=="inline-block"){
            sidePanel.dom.style.display="none";
            return
        }
        $(".side_panel").css("display","none");
        sidePanel.dom.style.display="inline-block";
    });

    var sidePanel = UI.createDiv('side_panel',container);
    sidePanel.setTop('40px');

    var listContainer = new UI.createDiv('list_container',sidePanel);
    var panelHeader=UI.createDiv('panel-header',listContainer,'控制栏');

    var panelClose=new UI.createDiv('panel-close',panelHeader);
    panelClose.onClick(function(){
        sidePanel.dom.style.display="none"
    });
    var panelHidden = new UI.createDiv('panel-hidden',panelHeader);

    panelHidden.onClick(function(){
        if( listContent.dom.style.display=="none"){
            listContent.dom.style.display="block";
            panelFooter.dom.style.display="block";
        }else{
            listContent.dom.style.display="none";
            panelFooter.dom.style.display="none";
        }
    });


    var listDown=function(e){
        var id=event.target.id;
        for(var i in editor.labels){
            if(id==i){
                editor.select(editor.labels[i]);
            }
        }

    };
    var listContent = new UI.createDiv('content',listContainer);
    listContent.dom.addEventListener("mousedown",listDown,false)

    var addLabelFun=function(e){
        var button=e.button;
        if(button==0){
            var intersects=editor.getIntersects(e);
            if(intersects.length>0&& intersects[0].object instanceof THREE.Mesh){
                var start=intersects[0].point;
                var map = new THREE.TextureLoader().load( "image/gizmo-light.png" );
                var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
                var sprite=new THREE.Sprite(material);
                sprite.position.copy(start.sub( intersects[0].object.getWorldPosition()));
                sprite.position.multiply(new THREE.Vector3(1.1,1.1,1.1));
               //var vectorStart=new THREE.Vector3(0,0,0);
               //var vectorEnd=new THREE.Vector3(10,10,10);
               //var geo=new THREE.Geometry();
               //geo.vertices.push(vectorStart);
               //geo.vertices.push(vectorEnd);
               //var line=new THREE.Line(geo);
               //sprite.add(line);
                intersects[0].object.add(sprite);

                var _div=label2d.dom.cloneNode(true);
                _div.appendChild(drawLine());
                var top= e.offsetY;//-(v.y-1)/2*parseInt($(document.getElementById("viewport")).css("height"))-190;
                var left=e.offsetX;//(v.x+1)/2*parseInt($(document.getElementById("viewport")).css("width"))-100;
                _div.style.left=left+5+"px";
                _div.style.top=top-90+"px";
                var id=sprite.uuid;
                _div.id=id;
                editor.labels[id]=sprite;
                document.getElementById("viewport").appendChild(_div);
                var list=new UI.createDiv("listOfObject3D",listContent,id);
                list.dom.style.width="200px";
                list.dom.style.height="16px";
                editor.signals.sceneGraphChanged.dispatch();
                document.body.style.cursor="points";
            }
        }

    };
    var cancelAddLabel=function(e){

        var button=e.button;
        if(button==2){
            document.getElementById("viewport").style.cursor="default";
            document.getElementById("viewport").removeEventListener("mousedown",addLabelFun,false);
            document.removeEventListener("mousedown",cancelAddLabel,false);
            document.getElementById("viewport").focus();
        }

    };
    var removeLabelFun=function(e){
        var button=e.button;
        if(button==0){
            var labelArr=[];
            var labels= editor.labels;
            for(var i in labels){
                labelArr.push(labels[i]);
            }
            var intersects=editor.getIntersects(e,labelArr);
            if(intersects.length>0){
                var obj=intersects[0].object;
                obj.parent.remove(obj);
                document.getElementById("viewport").removeChild(document.getElementById(obj.uuid));
                delete editor.labels[obj.uuid];
                editor.signals.sceneGraphChanged.dispatch();
            }
        }

    };
    var cancelRemoveLabel=function(e){

        var button=e.button;
        if(button==2){
            document.getElementById("viewport").style.cursor="default";
            document.getElementById("viewport").removeEventListener("mousedown",removeLabelFun,false);
            document.removeEventListener("mousedown",cancelRemoveLabel,false);
            document.getElementById("viewport").focus();
        }

    };

    var panelFooter= new UI.createDiv('panel-footer',listContainer);
    var makeGroup=  new UI.createDiv('free-group',panelFooter,'删除标签','b');
    makeGroup.dom.style.width="140px"
    makeGroup.onClick(function(){
        document.getElementById("viewport").style.cursor="pointer";
        document.getElementById("viewport").addEventListener("mousedown",removeLabelFun,false);
        document.addEventListener("mousedown",cancelRemoveLabel,false);
    });
    var freeGroup=  new UI.createDiv('free-group',panelFooter,'添加标签','b');
    freeGroup.dom.style.width="140px"
    freeGroup.onClick(function(){
        document.getElementById("viewport").style.cursor="cell";
        document.getElementById("viewport").addEventListener("mousedown",addLabelFun,false);
        document.addEventListener("mousedown",cancelAddLabel,false);
    });



//attr
    var attributeList =new UI.createDiv('attributeList',sidePanel);
    attributeList.dom.style.height="calc(100% - 62px)";
    //attrChild1
    var bgAttrGlobal = new UI.createDiv('',attributeList);
    var bgHeaderGlobal = new UI.createDiv('attrHeader',bgAttrGlobal,'全局');
    var bgHiddenArrowGlobal = new UI.createDiv('attrTriPng',bgHeaderGlobal);
    var bgHelpGlobal = new UI.createDiv('attrHelp',bgHeaderGlobal);
    var bgContentGlobal = new UI.createDiv('Attr_Content',bgAttrGlobal);
    var bgPic = new  UI.createDiv('attrRow',bgContentGlobal);
    new UI.createDiv('text',bgPic,'线条');
    var bgBox = new UI.createDiv('OffButton',bgPic);
    bgBox.onClick(function(){
        if (bgBox.dom.className === "OffButton") {
            bgBox.setClass("onButton");

        } else {
            bgBox.setClass("OffButton");

        }
    });

    var rDampingFactorBars=new  UI.createDiv('range',bgPic);
    var rDampingFactorRange = new  UI.createDiv('',rDampingFactorBars,null,'i');
    rDampingFactorRange.dom.type="range";
    rDampingFactorRange.dom.value="0";
    $(rDampingFactorRange.dom).on("input change",function(){
        rDampingFactorValue.setValue(rDampingFactorRange.dom.value);

    });
    var rDampingFactorValue = new UI.createDiv('value',bgPic,null,'i');
    $(rDampingFactorValue.dom).on("input change",function(){
        rDampingFactorRange.dom.value=Number(rDampingFactorValue.dom.value)||0;
        $('input[type="range"]').trigger("input");
    });

    var pCameraAttr = new UI.createDiv('',bgPic);
    pCameraAttr.dom.style.display='none';

    bgHeaderGlobal.onClick(function () {
        if (bgContentGlobal.dom.style.display == "none") {
            bgContentGlobal.dom.style.display = "block";
            bgHiddenArrowGlobal.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            bgContentGlobal.dom.style.display = "none";
            bgHiddenArrowGlobal.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var materialLibrary = new UI.createDiv('attrRow',bgContentGlobal);
    new UI.createDiv('text',materialLibrary,'类型');

    var materialClass = new UI.createDiv('selectBox',materialLibrary,null,'s');
    materialClass.dom.style.width="215px"
    materialClass.setOptions( {
        'MeshLambertMaterial': '网格朗伯材质',
        'MeshPhongMaterial': '网格Phong材质',


    } ).setValue('MeshStandardMaterial')

    //attrChild2
    var bgAttrPart = new UI.createDiv('',attributeList);
    var bgHeaderPart = new UI.createDiv('attrHeader',bgAttrPart,'全局');
    var bgHiddenArrowPart = new UI.createDiv('attrTriPng',bgHeaderPart);
    var bgHelpPart = new UI.createDiv('attrHelp',bgHeaderPart);
    var bgContentPart = new UI.createDiv('Attr_Content',bgAttrPart);

    bgHeaderPart.onClick(function () {
        if (bgContentPart.dom.style.display == "none") {
            bgContentPart.dom.style.display = "block";
            bgHiddenArrowPart.dom.style.backgroundImage = "url('image/jiantou.png')";
        } else {
            bgContentPart.dom.style.display = "none";
            bgHiddenArrowPart.dom.style.backgroundImage = "url('image/jiantou-you.png')";
        }
    });
    var getCPP = new UI.createDiv('attrRow',bgContentPart);
    var getCP=  new UI.createDiv('free-group',getCPP,'解放组','b');
    getCP.dom.style.marginRight="18px";
    getCP.dom.style.width="250px";

    var libelTitle = new UI.createDiv('attrRow',bgContentPart);
    new UI.createDiv('text',libelTitle,'类型');
    new UI.createDiv('labelTitle',libelTitle,undefined,"i").setValue("");

    var labelContent =new UI.createDiv('labelTitle',bgContentPart,undefined,"i");
    labelContent.setValue("");
    labelContent.dom.style.width="250px";
    labelContent.dom.style.height="150px";


    return container;
 /*   var container = new UI.Panel().setClass('menu');
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

    var panelHeader = new UI.createDiv('panel-header',sidePanel,'界面');
    var panelClose = new UI.createDiv('panel-close',panelHeader);
    panelClose.onClick(function(){
        sidePanel.dom.style.display="none";
    });
    var attributeList =new UI.createDiv('attributeList',sidePanel);
    attributeList.dom.style.height="calc(100% - 62px)";

    var bgAttr = new UI.createDiv('',attributeList);
    var bgHeader = new UI.createDiv('attrHeader',bgAttr,'标签');
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
    var bgContent   = new UI.createDiv('Attr_Content',bgAttr);
    var editorBg    = new UI.createDiv('editorBg ',  bgContent);
    var addLabel    = new UI.createDiv('labelEditor',editorBg );
    var moveLabel   = new UI.createDiv('labelEditor',editorBg );
    var removeLabel = new UI.createDiv('labelEditor',editorBg );
    var label2d=new UI.Panel();
    label2d.setClass("label2d");
    var labelHead= new UI.createDiv('labelHead',label2d);
    var labelBody=new UI.createDiv('labelBody',label2d);


    var addlabelFun=function(e){
        var button=e.button;
        if(button==0){
            var intersects=editor.getIntersects(e);
            if(intersects.length>0&& intersects[0].object instanceof THREE.Mesh){
                var map = new THREE.TextureLoader().load( "image/gizmo-light.png" );
                var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
                var sprite=new THREE.Sprite(material);
                sprite.position.copy(intersects[0].point.sub( intersects[0].object.getWorldPosition()));
                sprite.position.multiply(new THREE.Vector3(1.1,1.1,1.1));
                intersects[0].object.add(sprite);

                var _div=label2d.dom.cloneNode(true);
                var top= e.offsetY-150;//-(v.y-1)/2*parseInt($(document.getElementById("viewport")).css("height"))-190;
                var left=e.offsetX-100;//(v.x+1)/2*parseInt($(document.getElementById("viewport")).css("width"))-100;
                _div.style.left=left+"px";
                _div.style.top=top+"px";
                var id=sprite.uuid;
                _div.id=id;
                editor.labels[id]=sprite;
                document.getElementById("viewport").appendChild(_div);
                editor.signals.sceneGraphChanged.dispatch();
                document.body.style.cursor="points";
            }
        }

    };
    var cancelAddlabel=function(e){

        var button=e.button;
        if(button==2){
            document.getElementById("viewport").style.cursor="default";
            document.getElementById("viewport").removeEventListener("mousedown",addlabelFun,false);
            document.removeEventListener("mousedown",cancelAddlabel,false);
            document.getElementById("viewport").focus();
        }

    };

    addLabel.onClick(function(){
        document.getElementById("viewport").style.cursor="cell";
        document.getElementById("viewport").addEventListener("mousedown",addlabelFun,false);
        document.addEventListener("mousedown",cancelAddlabel,false);
    });
    return container;*/
};
/*end*/
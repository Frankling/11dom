/**
 * Created by asforever on 2016/3/31.
 */
/**
 * Created by DELL on 2016/1/8.
 */

/*4-18*/
Menubar.interface = function ( editor ) {
    var projector=new THREE.Projector();
    var viewport= document.getElementById("viewport");
    var selected;
    var label2d=new UI.Panel();
    label2d.setClass("label2d");
   // var labelHead= new UI.createDiv('labelHead',label2d);
    var labelBody=new UI.createDiv('labelBody',label2d);
    var labelBodyI=new UI.createDiv('',labelBody,"un","t");
    var drawLine=function(){
        var lineDiv=document.createElement("canvas");
        lineDiv.className="label2dCanvas";
        lineDiv.style.display="none";
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

    var selectSprit=function(sprite){
        var labels=editor.labels;
        for(var i in labels){
            labels[i].material.color.b=1;
        }
        sprite.material.color.b=0;
        selected=sprite;
        var child=document.getElementById(selected.uuid+"V");
        if(child.children[1].style.display=="block"){
            bgBox.setClass("onButton");
            var value=parseFloat(child.children[1].style.height);
            rDampingFactorRange.setValue(value);
            $(rDampingFactorRange.dom).trigger("input");
        }else{
            bgBox.setClass("OffButton");
        }
        editor.signals.sceneGraphChanged.dispatch();
    };

    var listDown=function(e){
        var id=event.target.id;
        //for(var i in editor.labels){
        //    if(id==i){
        if(editor.labels.hasOwnProperty(id)){
            editor.select(editor.labels[id]);
        }

       //     }
       // }

    };

    var listContent = new UI.createDiv('content',listContainer);
    listContent.setId("labelContent");
    listContent.dom.addEventListener("mousedown",listDown,false);

    var addLabelFun=function(e){
        var bool=$(".label2d canvas").css("display")=="none";
        var labels=editor.labels;
        var type=materialClass.dom.selectedIndex==0?false:true;
        var button=e.button;
        document.body.style.cursor="points";
        if(button==0){
            var intersects=editor.getIntersects(e);
            if(intersects.length>0&& intersects[0].object instanceof THREE.Mesh){
                var start=intersects[0].point;
                var map = new THREE.TextureLoader().load( "image/label.png" );
                var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
                var sprite=new THREE.Sprite(material);
                sprite.position.copy(start.sub( intersects[0].object.getWorldPosition()));
                sprite.position.multiply(new THREE.Vector3(1.1,1.1,1.1));

                intersects[0].object.add(sprite);

                if(!editor.labels[sprite.uuid]) editor.labels[sprite.uuid]=sprite;
                editor.refreshLabelUI(sprite,bool,"",type,0);
              //var _div=label2d.dom.cloneNode(true);
              //_div.appendChild(drawLine());
              //var top= e.offsetY;//-(v.y-1)/2*parseInt($(document.getElementById("viewport")).css("height"))-190;
              //var left=e.offsetX;//(v.x+1)/2*parseInt($(document.getElementById("viewport")).css("width"))-100;
              //_div.style.left=left+5+"px";
              //_div.style.top=top-15+"px";
              //var id=sprite.uuid;
              //_div.id=id+"V";

              // viewport.appendChild(_div);
              // var list=new UI.createDiv("listOfObject3D",listContent,id);
              // list.setId(id);
              // list.dom.style.height="16px";
                editor.signals.addLabel.dispatch(sprite);
                editor.signals.sceneGraphChanged.dispatch();

            }
        }

    };
    var cancelAddLabel=function(e){

        var button=e.button;
        if(button==2){
            viewport.style.cursor="default";
            viewport.removeEventListener("mousedown",addLabelFun,false);
            document.removeEventListener("mousedown",cancelAddLabel,false);
            viewport.focus();
        }

    };
   /* var removeLabelFun=function(e){
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
                viewport.removeChild(document.getElementById(obj.uuid+"V"));
                delete editor.labels[obj.uuid];
                listContent.dom.removeChild(document.getElementById(obj.uuid));
                editor.signals.sceneGraphChanged.dispatch();
            }
        }

    };
    var cancelRemoveLabel=function(e){

        var button=e.button;
        if(button==2){
            viewport.style.cursor="default";
            viewport.removeEventListener("mousedown",removeLabelFun,false);
            document.removeEventListener("mousedown",cancelRemoveLabel,false);
            viewport.focus();
        }

    };*/

    var panelFooter= new UI.createDiv('panel-footer',listContainer);

    var makeGroup=  new UI.createDiv('free-group',panelFooter,'删除标签','b');

    makeGroup.dom.style.width="140px";

    makeGroup.onClick(function(){

        if(selected){


           // selected.parent.remove(selected);

            viewport.removeChild(document.getElementById(selected.uuid+"V"));

            delete editor.labels[selected.uuid];

            listContent.dom.removeChild(document.getElementById(selected.uuid));

            editor.removeObject(selected);
          //  editor.signals.sceneGraphChanged.dispatch();

        }
       //document.getElementById("viewport").style.cursor="pointer";
       //document.getElementById("viewport").addEventListener("mousedown",removeLabelFun,false);
       //document.addEventListener("mousedown",cancelRemoveLabel,false);
    });
    var freeGroup=  new UI.createDiv('free-group',panelFooter,'添加标签','b');
    freeGroup.dom.style.width="140px"
    freeGroup.onClick(function(){
        viewport.style.cursor="cell";
        viewport.addEventListener("mousedown",addLabelFun,false);
        document.addEventListener("mousedown",cancelAddLabel,false);
    });

    editor.signals.refreshLabelUI.add(function(label,bool,title,type,length){

        var _div = label2d.dom.cloneNode(true);
        if(type){
            _div.children[0].style.height="100px";
        }else{
            _div.children[0].style.height="17px";
        }
        _div.appendChild(drawLine());
        _div.id=label.uuid+"V";
        var v = new THREE.Vector3().copy(label.getWorldPosition());
        projector.projectVector(v, editor.camera);
        var left = ( v.x + 1) / 2 * viewport.offsetWidth;
        var top = ( -v.y + 1) / 2 * viewport.offsetHeight;

        var topDiv=parseInt(_div.children[0].style.height);
        if (bool) {
            bgBox.setClass("OffButton");

            _div.style.left = left + 5 + "px";
            _div.style.top = top - 10-topDiv/2 + "px";

        } else {

            bgBox.setClass("onButton");
            var width=parseFloat(_div.children[1].style.width);
            _div.children[0].style.marginLeft=width+"px";
            _div.children[1].style.display="block";

            var height = length;
            _div.style.left = left + 5 + "px";
            _div.style.top = top -20- topDiv - height + "px";
           // console.log( $(".label2d canvas"))
        }
        var list=new UI.createDiv("listOfObject3D",listContent,label.uuid);
        list.setId(label.uuid);
        list.dom.style.height="16px";
        _div.children[0].children[0].value=title;
        viewport.appendChild(_div);

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
            $(".label2d canvas").css("display","block");
        } else {
            bgBox.setClass("OffButton");
            $(".label2d canvas").css("display","none");
        }

        var labels=editor.labels;
        var width= parseFloat($(".label2d canvas").css("width"));
        for(var i in labels){
            var child=document.getElementById(i+"V");
            var height=parseFloat(child.children[1].style.height);
            var position=labels[i].getWorldPosition();
            var v=new THREE.Vector3().copy( position);
            projector.projectVector( v, editor.camera);
            var left=( v.x+1)/2*viewport.offsetWidth;
            var top=( -v.y+1)/2*viewport.offsetHeight;
            var topDiv=parseInt($(".labelBody")[0].style.height);
            if (bgBox.dom.className === "OffButton") {
                child.style.top =top - 10-topDiv/2 + "px";
                $(".label2d div").css("marginLeft","0px");
            }else{
                child.style.top =top - 20 - topDiv - height + "px";
                $(".label2d div").css("marginLeft",width);

            }

        }




    });

    var rDampingFactorBars=new  UI.createDiv('range',bgPic);
    var rDampingFactorRange = new  UI.createDiv('',rDampingFactorBars,null,'i');
    rDampingFactorRange.dom.type="range";
    rDampingFactorRange.dom.value="0";
    $(rDampingFactorRange.dom).on("input change",function(){
        rDampingFactorValue.setValue(rDampingFactorRange.dom.value);
        var labels=editor.labels;
        if($(".label2d canvas").css("display")=="block"){
            for(var i in labels){
                var child=document.getElementById(i+"V");

                var width=parseFloat(child.children[1].style.width);
                var height=parseFloat(child.children[1].style.height);
                var position=labels[i].getWorldPosition();
                var v=new THREE.Vector3().copy( position);
                projector.projectVector( v, editor.camera);
                var top=( -v.y+1)/2*viewport.offsetHeight;


                child.children[1].style.height=this.value+"px";
                child.children[1].style.width=this.value*2+"px";
                child.children[0].style.marginLeft=width+"px";
                child.children[0].style.marginLeft=width+"px";
                var topDiv=parseInt($(".labelBody")[0].style.height);
                child.style.top=top - 20 - topDiv  -this.value+ "px";
            }

        }







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


    var changeType=function(){

        var value=this.dom.selectedIndex;
        switch (value){
            case 0:
                $(".labelBody").css("height","17px");
             //   $(".labelBody").css("margin-top","0px");
                break;
            case 1:
                $(".labelBody").css("height","100px");
             //   $(".labelBody").css("margin-top","-83px");
                break;
        }

    };
    var materialClass = new UI.createDiv('selectBox',materialLibrary,null,'s');
    materialClass.dom.style.width="215px"
    materialClass.setOptions( {
        'standard': '标准',
        'leval': '升级',
    } ).setValue('standard').onChange(changeType);

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
    var getCP=  new UI.createDiv('free-group',getCPP,'获取当前相机位置','b');
    getCP.onClick(function(){
        if(selected){
            var target=editor.controls.target;
            var position=editor.camera.position;
            var TX=target.x;
            var TY=target.y;
            var TZ=target.z;

            var PX=position.x;
            var PY=position.y;
            var PZ=position.z;

           //if(dataBase.labels.hasOwnProperty( selected.uuid))
           selected.cameraPosition={TX:TX,TY:TY,TZ:TZ,PX:PX,PY:PY,PZ:PZ};
            console.log(selected);
        }

    });
    getCP.dom.style.marginRight="18px";
    getCP.dom.style.width="250px";

    var libelTitle = new UI.createDiv('attrRow',bgContentPart);
    new UI.createDiv('text',libelTitle,'标题');
    var titleText=new UI.createDiv('labelTitle',libelTitle,undefined,"i").setValue("");
    $(titleText.dom).on("input change",function(){
       var labels=editor.labels;
       for(var i in labels){
           var point=labels[i].getWorldPosition();
           var point2d=new THREE.Vector3().copy(point);
           projector.projectVector(point2d,editor.camera);
           updateLabelPosition(labels[i],viewport,point,point2d);
       }
       if(selected)document.getElementById(selected.uuid+"V").children[0].children[0].value=this.value;
    });

    var labelContent =new UI.createDiv('labelTitle',bgContentPart,undefined,"i");
    labelContent.setValue("");
    labelContent.dom.style.width="250px";
    labelContent.dom.style.height="150px";
    editor.signals.selectChanged.add(function(object){
        if(editor.labels.hasOwnProperty(object.uuid)){
            selected=object;
            var child=document.getElementById(selected.uuid+"V");
            if(child.children[1].style.display=="block"){
                bgBox.setClass("onButton");
                var value=parseFloat(child.children[1].style.height);
                rDampingFactorRange.setValue(value);
                $(rDampingFactorRange.dom).trigger("input");
            }else{
                bgBox.setClass("OffButton");
            }
        }
    });

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
/**
 * Created by DELL on 2016/1/8.
 */
Menubar.object = function ( editor ) {
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



    var listContent = new UI.createDiv('content',listContainer);
    listContent.setId(editor.scene.uuid);
    listContent.dom.obj=editor.scene;
    editor.divToMove(listContent.dom);


    var panelFooter= new UI.createDiv('panel-footer',listContainer);
    var freeGroup=  new UI.createDiv('free-group',panelFooter,'解放组','b');
    freeGroup.onClick(function(){
        var d=editor.selected,i;
        for(i in d){
            if(d[i].type=="Object3D"||d[i].type=="Group"){
                var id=d[i].uuid;
                var cid;
                var a=[];
                var selectedNode= document.getElementById(id);
                var parentNode= document.getElementById(id).parentNode;
                d[i].traverse(function(child){
                    if(child.type=="Mesh"){
                        a.push(child);
                    }
                });
                var len = a.length;
                while(len){
                    cid=a[len-1].uuid;
                    parentNode.appendChild(document.getElementById(cid));
                    document.getElementById(cid).style.display="block";
                    d[i].parent.add(a[len-1]);
                    editor.allObject3D.children.push(a[len-1]);
                    len--;
                }
                d[i].parent.remove(d[i]);
                parentNode.removeChild(selectedNode);
            }
        }
        editor.selectClear();
        editor.signals.sceneGraphChanged.dispatch();
    });

    var makeGroup=  new UI.createDiv('free-group',panelFooter,'创建组','b');
    makeGroup.onClick(function(){
        var object=new THREE.Object3D();
        object.name="group";
        editor.allObject3D.children.push(object);
        editor.addObject(object,editor.scene);
    });

    var deleteObject = new UI.createDiv('free-group',panelFooter,'删除物体','b');
    deleteObject.onClick(function(){
        for(var i in editor.selected){
            editor.removeObject(editor.selected[i]);
        }
    });

    var uploadFile= new UI.createDiv('fileUpload',panelFooter,null,'i');
    uploadFile.dom.type="file";

    uploadFile.onChange( function () {
        editor.loader.loadFile( uploadFile.dom.files[ 0 ] );
       // pathImport(editor,"model/obj/port.obj","model/obj/port.obj");
    } );

    var upload=UI.createDiv('upload',panelFooter,'上传物体');
    upload.add( uploadFile );
    upload.onClick(function(){
        uploadFile.dom.value="";
        uploadFile.dom.click();
    });

    editor.signals.objectAdded.add( function ( object,parent ) {
        if(object.type=="LightObject"){
            return;
        }
        editor.refreshUI([object],parent);
    });
//==============================================================================================================
    var attributeList = new UI.Panel();
    attributeList.setClass( 'attributeList' );
    attributeList.add(new Material(editor));
    attributeList.add(new Share.Table(editor));
//gai==============================================================================================================
    var transformAttributes = new UI.Panel();
    transformAttributes.setClass( 'mainAttributes' );
    attributeList.add( transformAttributes);

    var transformHeader = new UI.Panel();
    transformHeader.setTextContent("其他");
    transformHeader.setClass( 'attrHeader' );
    transformAttributes.add( transformHeader);

    var listOfTransformHidden = new UI.Panel();
    listOfTransformHidden.setClass('attrTriPng');
    transformHeader.add(listOfTransformHidden);

    transformHeader.onClick(function () {
        if (transformBody.dom.style.display == "none") {
            transformBody.dom.style.display = "block";
            listOfTransformHidden.dom.style.backgroundImage="url('image/jiantou.png')";
        } else {
            transformBody.dom.style.display = "none";
            listOfTransformHidden.dom.style.backgroundImage="url('image/jiantou-you.png')";
        }
    });

    var listOfTransformHelper = new UI.Panel();
    listOfTransformHelper.setClass('attrHelp');
    transformHeader.add(listOfTransformHelper);

    var transformBody = new UI.Panel();
    transformBody.setClass('Attr_Content' );
    transformAttributes.add(transformBody);

    var attrRow1 =new  UI.createDiv('attrRow',transformBody);
    var text11   =new UI.createDiv('text',attrRow1,"反转");
    var button11 =new  UI.createDiv('OffButton',attrRow1);
    var text12   =new UI.createDiv('text',attrRow1,"碰撞");
    var button12 =new  UI.createDiv('OffButton',attrRow1);
    var text13   =new UI.createDiv('text',attrRow1,"双面");
    var button13 =new  UI.createDiv('OffButton',attrRow1);

    var attrRow2 =new  UI.createDiv('attrRow',transformBody);
    var text21   =new UI.createDiv('text',attrRow2,"线框");
    var button21 =new  UI.createDiv('OffButton',attrRow2);
    var text22   =new UI.createDiv('text',attrRow2,"阴影");
    var button22 =new  UI.createDiv('OffButton',attrRow2);
    var text23   =new UI.createDiv('text',attrRow2,"广告");
    var button23 =new  UI.createDiv('OffButton',attrRow2);
    button11.dom.style.width="35px";
    button12.dom.style.width="35px";
    button13.dom.style.width="35px";
    button21.dom.style.width="35px";
    button22.dom.style.width="35px";
    button23.dom.style.width="35px";

    transformBody.onClick(function(e){
        var s=editor.selected;
        var div=e.target;
        if( !(div.className=="OffButton"|| div.className=="onButton")){
            return;
        }
        var text=div.previousSibling.innerHTML;
        var type=(div.className =="onButton");
        if(type){
            div.className="OffButton";
        }else{
            div.className="onButton";
        }
        for(var i in s){

            switch (text){
                case "反转":
                    if(type) s[i].material.side=0;
                    else     s[i].material.side=1;
                    break;
                case "碰撞":
                    break;
                case "双面":
                    if(type) s[i].material.side=0;
                    else     s[i].material.side=2;

                    break;
                case "线框":
                    if(type) s[i].material.wireframe=false;
                    else     s[i].material.wireframe=true;
                    break;
                case "阴影":
                    break;
                case "平滑":

                    break;
            }
        }
        editor.signals.sceneGraphChanged.dispatch();

    });
    editor.signals.selectChanged.add(function(){
        var s=editor.selected;
        for(var i in s){
            if(s[i] instanceof THREE.Mesh){
                button11.setClass(s[i].material.side==1?"onButton":"OffButton");
                button12.setClass("OffButton");
                button13.setClass(s[i].material.side==2?"onButton":"OffButton");
                button21.setClass(s[i].material.wireframe?"onButton":"OffButton");
                button22.setClass("OffButton");
                button23.setClass("OffButton");
            }

        }


    });

    sidePanel.add(attributeList);
    return container;
};
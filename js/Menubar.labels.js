/**
 * Created by asforever on 2016/3/31.
 */
/**
 * Created by DELL on 2016/1/8.
 */

/*4-18*/
Menubar.labels = function ( editor ) {
    var viewport=document.getElementById("viewport");
    var container = new UI.Panel().setClass('menu');
    var menuName = new UI.createDiv('title',container);
    menuName.dom.style.backgroundImage="url('image/labelTitle.png')";
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



    var listContent = new UI.createDiv('content',listContainer);
    listContent.setId("labelContent");


    var panelFooter= new UI.createDiv('panel-footer',listContainer);

    var makeGroup=  new UI.createDiv('free-group',panelFooter,'删除标签','b');

    makeGroup.dom.style.width="140px";

    makeGroup.onClick(function(){
        var selected=editor.selected;
        var labels=editor.labels;
        for(var i in selected){
            if(labels.hasOwnProperty( i)){
                removeLabel(editor,labels[i],viewport);
            }

        }
    });
    var addLabelFun=function(e){
        if(e.button==0){
            var camera=editor.camera;
            var labels=editor.labels;
            var bool;
            var intersects=editor.getIntersects(e);
            for(var i in labels){
                var cssType   =labels[i].cssType;
                var enableLine=labels[i].enableLine;
                var lineHeight=labels[i].lineHeight;
                break;
            }

            if(intersects.length>0){
                var point=intersects[0].point;
                var object=intersects[0].object;
                createLabel(editor,viewport,camera,object,point);
                for(var i in labels){
                    updateLabelsAtt({
                        obj:labels[i],
                        cssType:cssType,
                        enableLine:enableLine,
                        lineHeight:lineHeight
                    });
                    updateNowPosition(editor,labels[i]);
                }

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
    var freeGroup=  new UI.createDiv('free-group',panelFooter,'添加标签','b');
    freeGroup.dom.style.width="140px"
    freeGroup.onClick(function(){
        viewport.style.cursor="cell";
        viewport.addEventListener("mousedown",addLabelFun,false);
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
        var labels=editor.labels;
        if (bgBox.dom.className === "OffButton") {
            bgBox.setClass("onButton");
            for(var i in labels){
                updateLabelsAtt({obj:labels[i],enableLine:true});
                updateNowPosition(editor,labels[i]);
            }

        } else {
            bgBox.setClass("OffButton");
            for(var i in labels){
                updateLabelsAtt({obj:labels[i],enableLine:false});
                updateNowPosition(editor,labels[i]);
            }
            $(".label2d canvas").css("display","none");
        }

    });

    var rDampingFactorBars=new  UI.createDiv('range',bgPic);
    var rDampingFactorRange = new  UI.createDiv('',rDampingFactorBars,null,'i');
    rDampingFactorRange.dom.type="range";
    rDampingFactorRange.dom.value="0";
    $(rDampingFactorRange.dom).on("input change",function(){

        rDampingFactorValue.setValue(rDampingFactorRange.dom.value);
        var labels=editor.labels;
        for(var i in labels){
            updateLabelsAtt({obj:labels[i],lineHeight:parseInt(this.value)});
            updateNowPosition(editor,labels[i]);
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
    materialLibrary.dom.style.display="none";
    new UI.createDiv('text',materialLibrary,'类型');


    var changeType=function(){
        var labels=editor.labels;
        var value=this.dom.selectedIndex;
        var typeFun=function(cssType){
            for(var i in labels){
                updateLabelsAtt({obj:labels[i],cssType:cssType})
                updateNowPosition(editor,labels[i]);
            }
        }
        switch (value){
            case 0:
                typeFun("standard");
                break;
            case 1:
                typeFun("leval");
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
        var selected=editor.selected;
        var labels=editor.labels;
        var target=editor.controls.target;
        var position=editor.camera.position;
        var TX=target.x;
        var TY=target.y;
        var TZ=target.z;

        var PX=position.x;
        var PY=position.y;
        var PZ=position.z;

        var cameraPosition={TX:TX,TY:TY,TZ:TZ,PX:PX,PY:PY,PZ:PZ};
        for(var i in selected){
            if(labels.hasOwnProperty( i)){
                updateLabelsAtt({
                    obj:labels[i],
                    cameraPosition:cameraPosition,
                });
            }

        }
    });

    getCP.dom.style.marginRight="18px";
    getCP.dom.style.width="250px";

    var libelTitle = new UI.createDiv('attrRow',bgContentPart);
    new UI.createDiv('text',libelTitle,'标题');
    var titleText=new UI.createDiv('labelTitle',libelTitle,undefined,"i").setValue("");
    $(titleText.dom).on("input change",function(){
        var selected=editor.selected;
        var labels=editor.labels;
        for(var i in selected){
            if(labels.hasOwnProperty( i)){

                updateLabelsAtt({
                    obj:labels[i],
                    title:this.value,
                });
            }

        }
    });

    var labelContent =new UI.createDiv('labelTitle',bgContentPart,undefined,"i");
    labelContent.setValue("");
    labelContent.dom.style.width="250px";
    labelContent.dom.style.height="150px";
    labelContent.dom.style.display="none";

    return container;

};

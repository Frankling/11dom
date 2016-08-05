/**
 * Created by asforever on 2016/7/8.
 */

(function(dom,editor){
    var keyAnimationObj=function(container){

        this.isPlay=undefined;
        this.currentFrame=0;
        this.allTime=2.0;
        this.keyLength=100;
        this.dom=this.createDom();
        this.selectedFrame=[];
        this.init(container);
    };

    keyAnimationObj.prototype={

        init:function(container){
            container.appendChild(this.dom);
            this.dom.addEventListener("mousedown",this.setDom.bind(this),false);
        },
        toJSON:function(){


            var data='[';
            var animations=THREE.AnimationHandler.animations;
            var al=animations.length;
            for(var i=0;i<al;i++){
                data+=animations[i].toJSON();
                if(i!=al-1)data+=",";
            }
            data+=']';
            saveAs(new Blob([data]  ,{type: "text/plain;charset=utf-8"}),"animationData.json");
            return data;
        },
        JSONLoad:function(url,editor){
            var scope=this;
            var loader=new THREE.XHRLoader();

            loader.load(url,function(text){

                var datas=JSON.parse(text);
                var l=datas.length;
                for(var i=0;i<l;i++){
                    var data=datas[i];
                    var hierarchy=data.hierarchy;
                    var hl=hierarchy.length
                    for(var j =0;j<hl;j++){
                        var keys=hierarchy[j].keys;
                        var kl=keys.length;
                        for(var m=0;m<kl;m++){
                            var index= keys[m].index;
                            var w=  keys[m].rot._w;
                            var x=  keys[m].rot._x;
                            var y=  keys[m].rot._y;
                            var z=  keys[m].rot._z;
                            keys[m].rot=new THREE.Quaternion(x,y, z,w);
                            keys[index]=keys[m];
                            keys[m]=undefined;
                            delete keys[m];
                        }
                    }
                    var root=editor.scene.getObjectByUuid(data.root);

                    scope.addFrame(root,data)
                }
            })
        },
        createData:function(root){

            var hierarchys=[];
            var index=this.currentFrame;
            var allTime= this.allTime;
            var keys=[];
            var hierarchy= {
                "parent" : 0, //root
                "keys"   : keys
            };
            hierarchys.push(hierarchy);
            return {
                "name"      : root.name+"-animation",
                "fps"       : 25,
                "length"    : this.allTime,
                "hierarchy" : hierarchys
            };
        },
        deleteFrame:function(){
            var keyLength=this.keyLength;
            var index=this.currentFrame;
            var allTime= this.allTime;
            var keyLengthAdd=keyLength+1;
            var time=(allTime/keyLengthAdd)*index;
            var selectedFrameDom=this.selectedFrame;


            var animations=THREE.AnimationHandler.animations;
            var al=animations.length;
            for(var i=0;i<al;i++){
                var hierarchy=animations[i].data.hierarchy;
                var hl=hierarchy.length;
                for(var j=0;j<hl;j++){
                    var keys=hierarchy[j].keys;
                    var kl=keys.length
                    for(var m=0;m<kl;m++){
                      var sl=selectedFrameDom.length;
                      while(sl){
                          sl-- ;
                          if(keys[m]==selectedFrameDom[sl].obj){

                              selectedFrameDom[sl].parentNode.removeChild(selectedFrameDom[sl]);
                              delete keys[m];

                          }
                      }
                    }
                }


                animations[i].reset();
                if(  animations[i]){
                    animations[i].currentTime=time;
                }
                this.update(0);


            }
             this.selectedFrame=[];
        },
        selectFrame:function(frameDom,editor){

            if(!editor.keyCode["ctrl"]) {
                $('.frameDom').css('background-color','#868686');
                this.selectedFrame=[];
            }
            frameDom.style.backgroundColor='#123456'
            if(this.selectedFrame.indexOf(frameDom)==-1)  this.selectedFrame.push(frameDom);



        },
        clearSelected:function(){
            $('.frameDom').css('background-color','#868686');
            this.selectedFrame=[];
        },
        addFrame:function(object,data){

            var scope=this;
            var currentFrame=this.currentFrame;
            var Ancestor;
            var keyLength=this.keyLength;

            var needCreate=true;
            var  Animations=THREE.AnimationHandler.animations;
            var l=Animations.length;
            for(var Ai=0;Ai<l;Ai++){
                if(Animations[Ai].root== object){
                    needCreate=false;
                    break;
                }
            }
            if(needCreate){
                var _data=data?data:scope.createData(object);

                var animation= new THREE.Animation( object,_data);
                animation.loop=true;
                animation.play();

                var keys=animation.data.hierarchy[0].keys;
                var kl=keys.length;
                for(var ii in keys){

                    if(ii=='remove')continue;
                    scope.addFrameDom(animation,keys[ii].index)
                }
                if(kl>0){
                    $('.frameDom').css('display','none');
                    return;
                }
            }

            var index=this.currentFrame;
            var allTime= this.allTime;
            var keyLengthAdd=keyLength+1;
            var time=(allTime/keyLengthAdd)*index;
            var positon=[object.position.x,object.position.y,object.position.z];
            var quaternion=new THREE.Quaternion().copy(object.quaternion);
            var scale=[object.scale.x,object.scale.y,object.scale.z];
            Animations[Ai].data.hierarchy[0].keys[this.currentFrame]={
                "index":index,
                "time":time,
                "pos" :positon,
                "rot" :quaternion,
                "scl" :scale
            };
            Animations[Ai].reset();
            Animations[Ai].currentTime=time;
            this.update(0);
            this.addFrameDom(Animations[Ai],currentFrame)




        },
        addFrameDom:function(animation,currentFrame){
            var frameDomP=this.dom.getElementsByClassName("animationBody")[0];
            var frameDom=document.createElement('div');
            var keyLength=this.keyLength;
            frameDom.className='frameDom';
            frameDomP.appendChild(frameDom);
            var scaleLeft=100/keyLength;
            var marginLeft=currentFrame*scaleLeft;
            frameDom.style.left=marginLeft+"%";
            frameDom.obj=animation.data.hierarchy[0].keys[currentFrame];
            $(frameDom).attr("name", animation.root.uuid+"Frame");
        },
        update:function(delta){

            var allTime= this.allTime;
            var keyLength=this.keyLength+1;
            var time=(allTime/keyLength)*delta;
            THREE.AnimationHandler.update(time);
            editor.signals.sceneGraphChanged.dispatch();
        },
        createDom:function(x,y,width,height){
            var scope=this;

            var container = new UI.Panel();
            container.setId("animationEditor");

            var animationOption=new UI.createDiv( 'animationOption',container);


            var leftMenu = new UI.createDiv( 'leftMenu',animationOption);
            var playMenu=  new UI.createDiv( 'playMenu',leftMenu);
            var playLast=  new UI.createDiv( 'playLast',playMenu);
            var playNow=   new UI.createDiv( 'playNow',playMenu);
            var playNext=  new UI.createDiv( 'playNext',playMenu);
            var keyMenu=  new UI.createDiv( 'keyMenu',leftMenu);
            var setKey=  new UI.createDiv( 'setKey',keyMenu);
            setKey.onClick(function(){
                var selected=editor.selected;
                for(var i in selected){
                    scope.addFrame(selected[i]);
                }

            });
            var otherMenu = new UI.createDiv( 'otherMenu',animationOption);
            var otherTop= new UI.createDiv( 'otherTop',otherMenu);
            var otherBottom= new UI.createDiv( 'otherBottom',otherMenu);
            var otherBottom1= new UI.createDiv( 'otherBottom1',otherMenu);
            var rightMenu = new UI.createDiv( 'rightMenu',animationOption);

            var animationHeader = new UI.createDiv( 'animationHeader',rightMenu);
            var animationScroll = new UI.createDiv( 'animationScroll',animationHeader);

            var animationBody = new UI.createDiv('animationBody',rightMenu);

            var animationBodyB = new UI.Table();
            animationBodyB.setClass('animationBodyB')
            animationBody.add(animationBodyB);
         // animationBody.setClass('animationBody');
         // rightMenu.add(animationBody);


            var tdL=scope.keyLength/5;
            for(var i=0;i<tdL;i++){
                var td= new UI.Td();
                td.setClass('animationBodyTd');
                animationBodyB.add(td);
            }

            return container.dom
        },
        setDom:function(e){
            var keyLength=this.keyLength;
            var targetDom=$(".animationScroll");
            if(e.type!="mousedown"){
                this.currentFrame=e;
                var scale=100/keyLength;
                var marginLeft=e*scale;
                targetDom[0].style.marginLeft=marginLeft+"%";
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            if(e.button==2){
                this.clearSelected();
            }else if(e.button==0){

                var scope=this;
                var target      = e.target;
                var parentDom=$("#animationEditor");
                var parentLeft  =parseFloat(parentDom.css("left"));
                var parentWidth =parseFloat(parentDom.css("width"));
                var scrollWidth =parseFloat(targetDom.css("width"));
                var offsetX     =e.offsetX;
                var moveTime    =0;
                var minX        =parentLeft+offsetX+100;
                var maxX        =parentLeft+parentWidth+offsetX-30;
                var time=this.allTime*1000/(this.keyLength+1);
                var className=target.className;


                var scrollMove=function(e){
                    e.preventDefault();
                    moveTime++;

                    if(moveTime>1){

                        var left;
                        var mouseX= e.clientX;
                        if(mouseX<minX)             left=0;
                        if(mouseX>=minX&&mouseX<maxX)left=(mouseX-100-parentLeft-offsetX)/(parentWidth-100-30);
                        if(mouseX>=maxX)             left=1;

                        var scale=100/keyLength;

                        var currentFrame=parseInt(left*100/scale);
                        var marginLeft=currentFrame*scale;


                        if(className=="animationScroll"){
                            var lastFrame=scope.currentFrame;
                            scope.currentFrame=currentFrame;
                            var delta=currentFrame-lastFrame;
                            scope.update(delta);
                            target.style.marginLeft=marginLeft+"%";
                        }else{
                            target.style.left=marginLeft+"%";

                        }


                    }

                };
                var scrollUp=function(){
                    moveTime=0;
                    window.removeEventListener("mousemove",scrollMove,false);
                    window.removeEventListener("mouseup",scrollUp,false);
                };



                if(className=="playNow"){
                    if(!scope.isPlay){
                        target.style.backgroundImage="url('image/pause.png')";
                        scope.isPlay=setInterval(function(){
                            scope.currentFrame++;
                            scope.currentFrame%=(scope.keyLength+1);
                            scope.update(1);
                            scope.setDom(scope.currentFrame);
                        },time);
                    }else{
                        target.style.backgroundImage="url('image/playNow.png')";
                        clearInterval(scope.isPlay);
                        scope.isPlay=undefined;
                    }



                }else if(className=="animationScroll"||className=="frameDom"){
                    if(className=="frameDom"){

                        scope.selectFrame(target,editor);
                    }

                    window.addEventListener("mousemove",scrollMove,false);
                    window.addEventListener("mouseup",scrollUp,false);

                }else if(className=="playNext"){
                    scope.currentFrame++;
                    scope.currentFrame%=(scope.keyLength+1);
                    scope.update(1);
                    scope.setDom(scope.currentFrame);
                }else if(className=="playLast"){
                    scope.currentFrame--;
                    scope.currentFrame%=(scope.keyLength+1);
                    if( scope.currentFrame<0){
                        scope.currentFrame+=(this.keyLength+1);
                    }
                    scope.update(-1);
                    scope.setDom(scope.currentFrame);
                }

            }



        }

    };
   var animationNew = new keyAnimationObj(dom);


    editor.deleteFrame= animationNew.deleteFrame.bind(animationNew);
    editor.animationToJSON=animationNew.toJSON;
    editor.signals.loadEnd.add(function(){
        animationNew.JSONLoad("model/animationData.json",editor);
    });

    editor.signals.selectChanged.add(function(object){
        if(!editor.keyCode["ctrl"]){
            $('.frameDom').css('display','none');
        }
        var name=object.uuid+"Frame";
        $('[name*='+name+']').css('display','block');

    });
    editor.signals.selectClear.add(function(object){
        $('.frameDom').css('display','none');
        animationNew.clearSelected();


    });

}(document.body,editor));



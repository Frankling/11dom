/**
 * Created by asforever on 2016/3/24.
 */
var composer=function(editor){

    var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
    var renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, parameters );
    this.renderPassBG = new THREE.RenderPass(editor.sceneBG, editor.cameraBG);
    //‰÷»æ
    this.composer = new THREE.EffectComposer( editor.renderer , renderTarget);
    //‰÷»æ
    this.renderPass = new THREE.RenderPass( editor.scene, editor.camera );
    this.renderPass1 = new THREE.RenderPass( editor.sceneGlobal, editor.camera );
    //‰÷»æ
    this.ShaderPass = new THREE.ShaderPass( THREE.CopyShader );


    //∫⁄“π
    this.DarkNight = [new THREE.ShaderPass( THREE.VignetteShader ),false];
    this.DarkNight.setValue=function(value){

        this[0].uniforms["offset"].value = value / 20;

        editor.signals.sceneGraphChanged.dispatch();
    };
    this.DarkNight.getValue=function(value){

        return this[0].uniforms["offset"].value;

    };
    //∞◊ƒΩ
    this.WhiteCurtain = [new THREE.ShaderPass( THREE.VignetteShader ),false];
    this.WhiteCurtain.setValue=function(value){
        this[0].uniforms["darkness"].value =- value / 15;
        editor.signals.sceneGraphChanged.dispatch();
    };
    this.WhiteCurtain.getValue=function(value){
        return -this[0].uniforms["darkness"].value*15;
    };

    //∏¥π≈
    this.Restoring = [new THREE.ShaderPass( THREE.SepiaShader ),false];
    this.Restoring.setValue=function(value){
        this[0].uniforms["amount"].value =Math.pow(((100 - value * 2) / 100), 3);
        editor.signals.sceneGraphChanged.dispatch();
    };
    this.Restoring.getValue=function(value){
        return (100-(Math.sqrt(this[0].uniforms["amount"].value)*100))/2;
    };
    //œÒÀÿªØ
    this.Pixel = [new THREE.DotScreenPass( new THREE.Vector2(0,0),0.5,0.8 ),false];
    this.Pixel.setValue=function(value){
        this[0].uniforms["angle"].value = value / 100;
        editor.signals.sceneGraphChanged.dispatch();
    };
    this.Pixel.getValue=function(value){
        return this[0].uniforms["angle"].value*100 ;
    };
    //◊‘∑¢π‚
    this.Luminous = [new THREE.BloomPass(  ),false];
    this.Luminous.setValue=function(value){
        this[0].copyUniforms["opacity"].value = value / 50;
        editor.signals.sceneGraphChanged.dispatch();
    };
    this.Luminous.getValue=function(value){
        return this[0].copyUniforms["opacity"].value*50;

    };


    //Ãÿ–ß¿‡–Õ
    this.clear = function(){
        this.DarkNight[1]=false;
        this.WhiteCurtain[1]=false;
        this.Restoring[1]=false;
        this.Pixel[1]=false;
        this.Luminous[1]=false;
    };
    this.enable=function(){
        return this.DarkNight[1]|| this.WhiteCurtain[1]||this.Restoring[1]|| this.Pixel[1]||this.Luminous[1];
    }


};
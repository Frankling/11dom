/**
 * @author mrdoob / http://mrdoob.com/
 */

var Loader = function ( editor ) {

	var scope = this;
	var signals = editor.signals;

	this.texturePath = '';

	this.loadFile = function ( file ) {

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		switch ( extension ) {

			case 'amf':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.AMFLoader();
					var amfobject = loader.parse( event.target.result );

					editor.addObject( amfobject );
					editor.select( amfobject );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'awd':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.AWDLoader();
					var scene = loader.parse( event.target.result );

					editor.setScene( scene );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'babylon':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.BabylonLoader();
					var scene = loader.parse( json );

					editor.setScene( scene );

				}, false );
				reader.readAsText( file );

				break;

			case 'babylonmeshdata':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.BabylonLoader();

					var geometry = loader.parseGeometry( json );
					var material = new THREE.MeshPhongMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );
				reader.readAsText( file );

				break;

			case 'ctm':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var data = new Uint8Array( event.target.result );

					var stream = new CTM.Stream( data );
					stream.offset = 0;

					var loader = new THREE.CTMLoader();
					loader.createModel( new CTM.File( stream ), function( geometry ) {

						geometry.sourceType = "ctm";
						geometry.sourceFile = file.name;

						var material = new THREE.MeshPhongMaterial();

						var mesh = new THREE.Mesh( geometry, material );
						mesh.name = filename;

						editor.addObject( mesh );
						editor.select( mesh );

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'dae':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var animate=function(kfAnimation){

						return function(){
							kfAnimation.play(500);
							var decal=10;
							var time=0;
							var timeLength=kfAnimation.data.length*1000;
							console.log(kfAnimation);
							var update=function(){
								if(time<=timeLength){
									kfAnimation.update(decal);
									editor.signals.sceneGraphChanged.dispatch();
									time+=decal;
									requestAnimationFrame(update);
								}else{
									kfAnimation.stop();
								}
							}
							update();

						}
					};

					var contents = event.target.result;
					var loader = new THREE.ColladaLoader();
					var collada = loader.parse( contents ,function(child){

						var kfAnimations=[];
					//	var allTime;
						var animations = child.animations;
						console.log(animations[0]);
						var scene=child.scene;
						scene.scale.x=scene.scale.y=scene.scale.z=8;
						var l=animations.length;

						for(var j = 0; j < l; ++j ){
							var animation = animations[ j ];
						//	allTime=Math.max(allTime||0,animation.length);
							var kfAnimation=new THREE.KeyFrameAnimation( animation )
							console.log(kfAnimation);
							kfAnimations.push(kfAnimation);

						//	kfAnimation.loop=true;
							//kfAnimation.play();
							var hierarchy=kfAnimation.hierarchy;
							var hl=kfAnimation.hierarchy.length;
							for(var i=0;i<hl;i++){
								hierarchy[i].animate=animate(kfAnimation);
							}

						}



					/*	var animate=function(a,b){
							//for(var i=0;i<l;i++){
							//	kfAnimations[i].update(10);
							//}
							editor.signals.sceneGraphChanged.dispatch();

							requestAnimationFrame(animate)
						}
						animate();*/
				//		console.log(kfAnimations);
			/*			var start=function(){
							for ( var i = 0; i < l; ++i ) {

								var kfAnimation = kfAnimations[i];


								var hl=kfAnimation.hierarchy.length;
/!*
								for( var h = 0; h < hl; h++ ){
									var keys = kfAnimation.data.hierarchy[ h ].keys;
									var sids = kfAnimation.data.hierarchy[ h ].sids;
									var obj = kfAnimation.hierarchy[ h ];

									if(keys.length&&sids){
										for ( var s = 0; s < sids.length; s++ ) {

											var sid = sids[ s ];
											var next = kfAnimation.getNextKeyWith( sid, h, 0 );

											if ( next ) next.apply( sid );

										}
										obj.matrixAutoUpdate = false;
										kfAnimation.data.hierarchy[ h ].node.updateMatrix();
										obj.matrixWorldNeedsUpdate = true;
									}
								}*!/
								kfAnimation.loop = false;
							kfAnimation.play();
						}
					};
					start();


					var animate=function(a){

							var delay=10;
							if ( progress >= 0 && progress < allTime*1000 ) {
								for (var i = 0; i < kfAnimations.length; ++i) {
									kfAnimations[i].update(delay);
								}
							}else  if ( progress >= allTime*1000 ){
								for ( var i = 0; i < kfAnimations.length; ++i ) {

									kfAnimations[ i ].stop();

								}

								progress = 0;
								start();
							}
							progress+=delay;
							editor.signals.sceneGraphChanged.dispatch();
							requestAnimationFrame(animate);

						};
						animate(0);*/
						scene.name = filename;
						editor.addObject(scene );
						editor.select(scene );
					});



				}, false );
				reader.readAsText( file );

				break;

			case 'js':
			case 'json':

			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					// 2.0

					if ( contents.indexOf( 'postMessage' ) !== -1 ) {

						var blob = new Blob( [ contents ], { type: 'text/javascript' } );
						var url = URL.createObjectURL( blob );

						var worker = new Worker( url );

						worker.onmessage = function ( event ) {

							event.data.metadata = { version: 2 };
							handleJSON( event.data, file, filename );

						};

						worker.postMessage( Date.now() );

						return;

					}

					// >= 3.0

					var data;

					try {

						data = JSON.parse( contents );

					} catch ( error ) {

						alert( error );
						return;

					}

					handleJSON( data, file, filename );

				}, false );
				reader.readAsText( file );

				break;


				case 'kmz':

					var reader = new FileReader();
					reader.addEventListener( 'load', function ( event ) {

						var loader = new THREE.KMZLoader();
						var collada = loader.parse( event.target.result );

						collada.scene.name = filename;

						editor.addObject( collada.scene );
						editor.select( collada.scene );

					}, false );
					reader.readAsArrayBuffer( file );

					break;

				case 'md2':

					var reader = new FileReader();
					reader.addEventListener( 'load', function ( event ) {

						var contents = event.target.result;

						var geometry = new THREE.MD2Loader().parse( contents );
						console.log(geometry);
						var material = new THREE.MeshPhongMaterial( {
							morphTargets: true,
							morphNormals: true
						} );

						var mesh = new THREE.Mesh( geometry, material );
						mesh.mixer = new THREE.AnimationMixer( mesh )
						mesh.name = filename;

						editor.addObject( mesh );
						editor.select( mesh );

					}, false );
					reader.readAsArrayBuffer( file );

					break;

			case 'obj':
				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {
					var contents = event.target.result;
					var object = new THREE.OBJLoader().parse( contents );

					object.name=filename;
					object=editor.dissectionObject(object);
					//object.component="mainObject";
					editor.allObject3D.children.push(object);
					//editor.centerObject(object);
					editor.addObject( object,editor.scene );
					editor.select( object );
				}, false );
				reader.readAsText( file );
				break;

/*		case 'obj':

			var reader = new FileReader();
			reader.addEventListener( 'load', function ( event ) {

				var contents = event.target.result;
				var object = new THREE.OBJMTLLoader().parse( contents );

              object.name=filename;
              object=editor.dissectionObject(object);
              object.component="mainObject"

              editor.allObject3D.children.push(object);
              editor.centerObject(object);
				editor.addObject( object );
				editor.select( object );
			}, false );
			reader.readAsText( file );

			break;*/

			case 'ply':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.PLYLoader().parse( contents );
					geometry.sourceType = "ply";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshPhongMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );
				reader.readAsText( file );

				break;

			case 'stl':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.STLLoader().parse( contents );
					geometry.sourceType = "stl";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshPhongMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );

				if ( reader.readAsBinaryString !== undefined ) {

					reader.readAsBinaryString( file );

				} else {

					reader.readAsArrayBuffer( file );

				}

				break;

			/*
			case 'utf8':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.UTF8Loader().parse( contents );
					var material = new THREE.MeshLambertMaterial();

					var mesh = new THREE.Mesh( geometry, material );

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );
				reader.readAsBinaryString( file );

				break;
			*/

			case 'vtk':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.VTKLoader().parse( contents );
					geometry.sourceType = "vtk";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshPhongMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.addObject( mesh );
					editor.select( mesh );

				}, false );
				reader.readAsText( file );

				break;

			case 'wrl':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var result = new THREE.VRMLLoader().parse( contents );

					editor.setScene( result );

				}, false );
				reader.readAsText( file );

				break;

			default:

				alert( 'Unsupported file format (' + extension +  ').' );

				break;

		}

	}

	var handleJSON = function ( data, file, filename ) {

		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.version === undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		if ( data.metadata.type === 'BufferGeometry' ) {

			var loader = new THREE.BufferGeometryLoader();
			var result = loader.parse( data );

			var mesh = new THREE.Mesh( result );

			editor.addObject( mesh );
			editor.select( mesh );

		} else if ( data.metadata.type.toLowerCase() === 'geometry' ) {

			var loader = new THREE.JSONLoader();
			loader.setTexturePath( scope.texturePath );

			var result = loader.parse( data );

			var geometry = result.geometry;
			var material;

			if ( result.materials !== undefined ) {

				if ( result.materials.length > 1 ) {

					material = new THREE.MeshFaceMaterial( result.materials );

				} else {

					material = result.materials[ 0 ];

				}

			} else {

				material = new THREE.MeshPhongMaterial();

			}

			geometry.sourceType = "ascii";
			geometry.sourceFile = file.name;

			var mesh;

			if ( geometry.animation && geometry.animation.hierarchy ) {

				mesh = new THREE.SkinnedMesh( geometry, material );

			} else {

				mesh = new THREE.Mesh( geometry, material );

			}

			mesh.name = filename;

			editor.addObject( mesh );
			editor.select( mesh );

		} else if ( data.metadata.type.toLowerCase() === 'object' ) {

			var loader = new THREE.ObjectLoader();
			loader.setTexturePath( scope.texturePath );

			var result = loader.parse( data );

			if ( result instanceof THREE.Scene ) {

				editor.setScene( result );

			} else {

				editor.addObject( result );
				editor.select( result );

			}

		} else if ( data.metadata.type.toLowerCase() === 'scene' ) {

			// DEPRECATED

			var loader = new THREE.SceneLoader();
			loader.parse( data, function ( result ) {

				editor.setScene( result.scene );

			}, '' );

		}

	};

}

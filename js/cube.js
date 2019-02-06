// *********************************************
// C code for creating shader and fragment shaders
// will be compiled below

var vertexShaderSourceCode = [
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main()',
  '{',
  ' fragColor = vertColor;',
  ' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
  '}'
].join('\n');

var fragmentShaderSourceCode = [
  'precision mediump float;',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{',
  ' gl_FragColor = vec4(fragColor, 1.0);',
  '}'
].join('\n');

// *********************************************

var initDemo = function() {
  var canvas = document.getElementById('drawingcanvas');
  var gl = canvas.getContext('webgl');

  // Checking if browser supports webGl
  if(!gl){
    console.log('webgl not supported, using experimental-webgl');
    gl = canvas.getContext('experimental-webgl');

    if(!gl){
      alert('WebGl not supported on this browser');
    }
  }

  // clearing canvas
  gl.clearColor(0.1, 0.2, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);


  // Insatiating shaders
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // adding the above source code to each shader
  gl.shaderSource(vertexShader, vertexShaderSourceCode);
  gl.shaderSource(fragmentShader, fragmentShaderSourceCode);

  // compiling shaders with exception
  gl.compileShader(vertexShader);
  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('Error compiling vertex shader', gl.getShaderInfoLog(vertexShader));
    return;
  }

  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('Error compiling fragment shader', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  // creating program and attaching shaders, checking if they are linked
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program', gl.getProgramInfoLog(program));
    return;
  }

  gl.validateProgram(program);
  if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('Error validating program', gl.getProgramInfoLog(program));
    return;
  }

  // Create shape vertices and indeces
  var cubeVertices =
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,    0.0, 1.0, 1.0,
		1.0, 1.0, 1.0,     0.0, 1.0, 0.0,
		1.0, 1.0, -1.0,    1.0, 1.0, 0.0,

		// Left
		-1.0, 1.0, 1.0,    0.0, 1.0, 1.0,
		-1.0, -1.0, 1.0,   0.0, 0.0, 1.0,
		-1.0, -1.0, -1.0,  1.0, 0.0, 1.0,
		-1.0, 1.0, -1.0,   1.0, 1.0, 1.0,

		// Right
		1.0, 1.0, 1.0,    0.0, 1.0, 0.0,
		1.0, -1.0, 1.0,   0.0, 0.0, 0.0,
		1.0, -1.0, -1.0,  1.0, 0.0, 0.0,
		1.0, 1.0, -1.0,   1.0, 1.0, 0.0,

		// Front
		1.0, 1.0, 1.0,    0.0, 1.0, 0.0,
		1.0, -1.0, 1.0,    0.0, 0.0, 0.0,
		-1.0, -1.0, 1.0,    0.0, 0.0, 1.0,
		-1.0, 1.0, 1.0,    0.0, 1.0, 1.0,

		// Back
		1.0, 1.0, -1.0,    1.0, 1.0, 0.0,
		1.0, -1.0, -1.0,     1.0, 0.0, 0.0,
		-1.0, -1.0, -1.0,     1.0, 0.0, 1.0,
		-1.0, 1.0, -1.0,    1.0, 1.0, 1.0,

		// Bottom
		-1.0, -1.0, -1.0,   1.0, 0.0, 1.0,
		-1.0, -1.0, 1.0,    0.0, 0.0, 1.0,
		1.0, -1.0, 1.0,     0.0, 0.0, 0.0,
		1.0, -1.0, -1.0,    1.0, 0.0, 0.0,
	];

  var cubeIndices =
  [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23
  ];

  // Creating and binding buffers
  var cubeVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

  var cubeIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

  // Creating and enabling attributes
  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    positionAttribLocation, // attribute location
    3, // number of elements in attribute
    gl.FLOAT, //type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of vertices
    0 // offset of vertex in array
  );

  gl.vertexAttribPointer(
    colorAttribLocation, // attribute location
    3, // number of elements in attribute
    gl.FLOAT, //type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of vertices
    3 * Float32Array.BYTES_PER_ELEMENT // offset of vertex in array
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  // program binded here for later use in location
  gl.useProgram(program);

  var mWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  var mViewUniformLocation = gl.getUniformLocation(program, 'mView');
  var mProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  // Matrices instatiation and binding for viewport
  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);

  glMatrix.mat4.identity(worldMatrix);
  glMatrix.mat4.lookAt(viewMatrix, [0, 0, -6], [0, 0, 0], [0, 1, 0]);
  glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(mWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(mViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(mProjUniformLocation, gl.FALSE, projMatrix);

  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);

  // Rendering
  var angle = 0;
  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);

  // Rendering loop to simulate rotation
  var loop = function() {
    angle = performance.now() / 1000 / 4 * 2 * Math.PI;
    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 2, [1, 0, 0]);
    glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
    gl.uniformMatrix4fv(mWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.1, 0.2, 0.2, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0)

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};

// *********************************************
// C code for creating shader and fragment shaders
// will be compiled below

var vertexShaderSourceCode = [
  'precision mediump float;',
  '',
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  '',
  'void main()',
  '{',
  ' fragColor = vertColor;',
  ' gl_Position = vec4(vertPosition, 0.0, 1.0);',
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

  // Create shape vertices
  var vertices = [
    // x, y           R,G,B
    -0.6,  0.7,        1.0, 0.0, 1.0,
    -0.5, -0.5,       0.8, 1.0, 0.1,
    0.5,  0.5,        0.3, 0.5, 1.0
  ];

  // Creating and binding buffer
  var vertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Creating and enabling attributes
  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    positionAttribLocation, // attribute location
    2, // number of elements in attribute
    gl.FLOAT, //type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of vertices
    0 // offset of vertex in array
  );

  gl.vertexAttribPointer(
    colorAttribLocation, // attribute location
    3, // number of elements in attribute
    gl.FLOAT, //type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of vertices
    2 * Float32Array.BYTES_PER_ELEMENT // offset of vertex in array
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  // Rendering
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw triangles, skip 0, draw 3
};

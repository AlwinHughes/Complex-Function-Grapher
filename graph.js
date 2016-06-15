var raw_data = [];
var im_range = Array(2);
var re_range = Array(2);

var resolution = 50;  // number of datapoints will be steps*steps
var re_step;
var im_step;

var use_y_cartesian = true;
var use_x_cartesian = true;

var z_data;
var f_of_x;
var value;

var re_data;
var im_data;

var vari_A;
var vari_A_range = Array(2);
var vari_A_res;
var vari_A_step;

var xval;
var yval;

var id;
function calculate () {
  console.log("calculate");
  console.log("grid "+document.getElementById("grid").checked);
  console.log("perspect "+document.getElementById("perspective").checked);

  id = 0;
  re_range[0] = parseFloat(document.getElementById("re_low").value);
  re_range[1] = parseFloat(document.getElementById("re_high").value);
  im_range[0] = parseFloat(document.getElementById("im_low").value);
  im_range[1] = parseFloat(document.getElementById("im_high").value);
  f_of_x = document.getElementById("f(x)").value;
  resolution = parseInt(document.getElementById("resolution").value);
  vari_A_range[0] = parseFloat(document.getElementById("a_low"));
  vari_A_range[1] = parseFloat(document.getElementById("a_high"));
  vari_A_res = parseFloat(document.getElementById("a_res"));


  if(re_range[0]>=re_range[1]){
    alert("Second re range must be greater than first");
    return;
  }
  if(im_range[0]>=im_range[1]){
    alert("Second im range must be greater than first");
    return;
  }
  if(resolution<=1){
    alert("resolution must be greater than 1");
  }
  if(f_of_x===""){
    return;
  }

  re_step = (re_range[1]-re_range[0])/resolution;
  im_step = (im_range[1]-im_range[0])/resolution;
  if(vari_A_range[0]<vari_A_range[1]){
    vari_A_step = (vari_A_range[1]-vari_A_range[0])/vari_A_res;
  }

  z_data = new vis.DataSet();
  var temp;

  var number;

  re_data = new vis.DataSet();
  im_data = new vis.DataSet();

  for(var i = 0; re_range[0] + i*re_step <=re_range[1]; i++ ){// real part
    
    for(var j = 0; im_range[0] + j*im_step<=im_range[1]; j++){// imaginary part
      
      number = math.eval( f_of_x.replace(/x/g,"("+(re_range[0] + i*re_step )+ ((im_range[0] + j*im_step) != 0 ? "+" +(im_range[0] + j*im_step)+"i": "" ) + ")"));
      
      if(math.equal(number,1e309)){//checking for infinity as evaluating close number
        number = math.eval(f_of_x.replace(/x/g,"("+(re_range[0] + i*re_step + re_step/100 )+ ((im_range[0] + j*im_step) != 0 ? "+" +(im_range[0] + j*im_step +im_step/100)+"i": "" ) + ")"))
      }
      if(math.typeof(number) != 'Complex'){
        number = math.complex(number,0);
      }

      
      xval = (re_range[0] + i*re_step);
      yval = (im_range[0] + j*im_step);
    
      if(!use_x_cartesian){
        var temp = math.complex(xval,yval);
        xval = temp.toPolar().r;
        yval = temp.toPolar().phi;
      }
      if(use_y_cartesian){
        re_data.add({
          id: id,
          x: xval,
          y: yval,
          z: number.re
        });

        im_data.add({
          id: id,
          x: xval,
          y: yval,
          z: number.im
        })  
      }else{
        number = number.toPolar();  
        
        re_data.add({
          id: id,
          x: xval,
          y: yval,
          z: number.r
        });

        im_data.add({
          id: id,
          x: xval,
          y: yval,
          z: number.phi
        }) 
      }
      id++;
    }    
  }
  console.log(re_data);
  console.log("draw re");
  drawGraph(re_data,"re_graph");
  console.log("draw im");
  drawGraph(im_data,"im_graph");
}

function drawGraph(data,graph){
  var zLabel;
  if(use_y_cartesian){
    if(graph==="re_graph"){
      zLabel ="Re(y)";
    }else{
      zLabel = "Im(y)";
    }
  }else{
    if(graph ==="re_graph"){
      zLabel = "|y|"
    }else{
      zLabel = "arg(y)"
    }
  }
  console.log(use_x_cartesian);
  var options = {
      width:  '500px',
      height: '552px',
      style: document.getElementById("display_type").options[document.getElementById("display_type").selectedIndex].value,
      showPerspective: document.getElementById("perspective").checked,
      showGrid: document.getElementById("grid").checked,
      showShadow: !document.getElementById("surface_grid").checked,
      keepAspectRatio: !document.getElementById("ratio").checked,
      verticalRatio: 0.5,
      xLabel: use_x_cartesian ? "Re(x)" : "|x|",
      yLabel: use_x_cartesian ? "Im(x)" : "arg(x)",
      zLabel: zLabel
    }

  var graph3d = new vis.Graph3d(document.getElementById(graph), data, options);
}

function switchYToCartesian() {
  if(!use_y_cartesian){
    document.getElementById("re_desc").innerHTML = "\\(z\\) axis contains \\(Re(y)\\) ";
    document.getElementById("im_desc").innerHTML = "\\(z\\) axis contains \\(Im(y)\\) ";
    document.getElementById("im_title").innerHTML = "Imaginary";
    document.getElementById("re_title").innerHTML = "Real";
    use_y_cartesian = true;
    MathJax.Hub.Typeset();
    calculate();
  }
}

function switchYToModArg() {
  if(use_y_cartesian){
    document.getElementById("re_desc").innerHTML = "\\(z\\) axis contains \\(|y|\\) ";
    document.getElementById("im_desc").innerHTML = "\\(z\\) axis contains \\(arg(y)\\) ";
    document.getElementById("im_title").innerHTML = "Argument";
    document.getElementById("re_title").innerHTML = "Modulous";
    use_y_cartesian = false;
    MathJax.Hub.Typeset();
    calculate();  
  }
  
}

function switchXToCartesian() {
  if(!use_x_cartesian){ 
    document.getElementById("x_desc").innerHTML = "\\(x\\) axis contains \\(Re(x)\\) component, \\(y\\) axis conatins \\(Im(x)\\) component"
    use_x_cartesian = true;
    MathJax.Hub.Typeset();
    calculate();
  }
}

function switchXToModArg() {
  if(use_x_cartesian){
    document.getElementById("x_desc").innerHTML = "\\(x\\) axis contains \\(|x|\\) , \\(y\\) axis conatins \\(arg(x)\\) "
    use_x_cartesian = false;
    MathJax.Hub.Typeset();
    calculate();
  }
}
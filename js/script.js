var ELEC = math.eval('1.6*10^(-10)')
var C = math.eval('3*10^8')
var R = 1
var BETA = 0.9999
var LPI = 0
var LSIGMA = 1
var E = 1
var H = 1
var mc2 = math.eval('9.109*10^-31')*C*C 
var omegaCrit = 10000
var omega0 = 1;
var deltaPsi;
var teta0;
jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
};
$el = $("#el")
$el.draggable({axis:"y",
        containment:".main",
        scroll:false,
        drag: function(){
            t = $el.offset().top;
            a = Math.atan(($el.offset().top-$(".source").offset().top)/
                ($el.offset().left-$(".source").offset().left))
            $el.rotate(a*180/3.14);
            $("#teta").val(a+math.pi/2);
        },
        stop: function(){
        	calcAll();
        },
	});

function w(teta, freq){ 
    var g = 1 - Jmat.pow(BETA*Jmat.sin(teta), 2)
    var c = freq * Jmat.pow(g, 3/2)/3
    var a = LSIGMA * BETA *g* (Jmat.besselk(2/3, c))
    var b = LPI *(1/Jmat.tan(teta))* (Jmat.besselk(0.333333333, c))
    var y = ELEC*ELEC * C * BETA*BETA*freq*freq / (2 * math.PI * R*R)
    return y*Jmat.pow(Jmat.abs(b+a).re,2)
};

function PState(teta, freq){ 
    var g = 1 - Jmat.pow(BETA*Jmat.sin(teta), 2)
    
    var psi = BETA*math.cos(teta)/math.sqrt(1-BETA*BETA)
    var c = freq * Jmat.pow(g, 3/2)/3
	var Ws = psi/psi*Jmat.pow((Jmat.besselk(0.66666666, c)),2)
	var Wp = psi*psi/(1+psi*psi)*(Jmat.besselk(0.33333333, c))
	console.log(g,psi,c,Ws,Wp)
    return (Ws-Wp)/(Ws+Wp)
};

function calcFreq(){
    var 
        container = document.getElementById('graphWfreq'),
        data, graph, i;
    data = []
    var step = math.ceil(omegaCrit/100)
    for(i=1.0; i<omegaCrit; i+=step){
        data.push([i, w(teta0, i)]);
    }
    graph = Flotr.draw(container, [data],{
        xaxis: {
            title: 'freq'
        },
        yaxis: {
            title: 'W'
        }
    });
};

function calcP(){
    var 
        container = document.getElementById('graphPolarState'),
        data, graph, i;
    data = []
    var step = math.ceil(omegaCrit/10)
    for(i=1.0; i<omegaCrit; i+=step){
        data.push([i, PState(teta0, i)]);
    }
    graph = Flotr.draw(container, [data],{
        xaxis: {
            title: 'Teta'
        },
        yaxis: {
            title: 'Ws/Wp'
        }
    });
};
function calcTeta(){
    var 
        container = document.getElementById('graphWteta'),
        data, graph, i;
    data = []
    for(i=math.PI/2-3*deltaPsi; i<math.PI/2+3*deltaPsi; i+=deltaPsi/30){
        data.push([i, w(i, omegaCrit)]);
    }
    graph = Flotr.draw(container, [data],{
        xaxis: {
            title: 'theta'
        }
    });
};

var intervalId
function controlAnim(){
clearInterval(intervalId)
var f = 0;
intervalId = setInterval(function() { 
	f += 0.2*BETA;
	$("#electron").offset({left:70*Jmat.sin(f)+$(".source").offset().left
        + 50, top:20*Jmat.cos(f)+$(".source").offset().top+50});
    }, 50)
}

function calcAll(){
    BETA = parseFloat(document.getElementById('beta').value);
    LPI = parseFloat(document.getElementById('lpi').value);
    LSIGMA = parseFloat(document.getElementById('lsigma').value);
    H = parseFloat(document.getElementById('H').value);
    E = mc2/math.pow(1-BETA*BETA,1/2)
    R = BETA*E/(ELEC*H)
    teta0 = parseFloat($("#teta").val());
    omega0 = ELEC*H*C/E
    omegaCrit = math.floor(math.pow(E/mc2, 3)*C/R/1000000000)
    deltaPsi = mc2/E
    var Wklas = 2/3 * ELEC*ELEC*C*Jmat.pow(BETA*E/mc2,4)/(R*R)
    $("#Pstate").html(PState(teta0,omegaCrit).toPrecision(2).replace("e+", "*10<sup>")+"</sup>")
    $("#Energy").html(E.toPrecision(2).replace("e+", "*10<sup>")+"</sup>")
    $("#R").html(R.toPrecision(2).replace("e+", "*10<sup>")+"</sup>")
    $("#Wklas").html(Wklas.toPrecision(2).replace("e+", "*10<sup>")+"</sup>")
    $("#deltaPsi").html(deltaPsi.toPrecision(2).replace("e+", "*10<sup>")+"</sup>")
    $("#omega0").html(omega0.toPrecision(2).replace("e+", "*10<sup>")+"</sup>")
    $("#omegaCrit").html(omegaCrit.toPrecision(2).replace("e+", "*10<sup>")+"</sup>")
    calcFreq()
    calcTeta()
    calcP()
    controlAnim()
};
calcAll()

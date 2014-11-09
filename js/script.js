var ELEC = math.eval('1.6*10^(-19)')
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

function w(teta, freq, lpi, lsigma){ 
    var g = 1 - Jmat.pow(BETA*Jmat.sin(teta), 2)
    var c = freq * Jmat.pow(g, 3/2)/3
    var a = lsigma * BETA *g* (Jmat.besselk(2/3, c))
    var b = lpi *(1/Jmat.tan(teta))* (Jmat.besselk(0.333333333, c))
    var y =   C * BETA*BETA*freq*freq / (2 * math.PI * R*R)
    return y*Jmat.pow(Jmat.abs(b+a).re,2)
};

function PState(teta, freq){ 
    var g = 1 - Jmat.pow(BETA*Jmat.sin(teta), 2)
    var psi = BETA*math.cos(teta)/math.sqrt(1-BETA*BETA)
    var c = freq * Jmat.pow(g, 3/2)/3
	var Ws = psi/psi*Jmat.pow((Jmat.besselk(0.6666666666666, c)),2)
	var Wp = psi*psi/(1+psi*psi)*(Jmat.besselk(0.3333333333333, c))
    return (Ws-Wp)/(Ws+Wp)
};

function calcFreq(){
    var 
        container = document.getElementById('graphWfreq'),
        data, graph, i;
    data = []
    var step = math.ceil(omegaCrit/30)
    var max = -100;
    for(i=1.0; i<2*omegaCrit; i+=step){
        a = w(teta0, i, LPI, LSIGMA)
        data.push([i, a]);
        if(a>max) max = a;
    }
    ticksY = createTicks(0, max)
    ticks= createTicks(0, omegaCrit*2);
    graph = Flotr.draw(container, [data],{
        xaxis: {
            title: '&#969;',
            ticks: ticks
        },
        yaxis: {
            ticks: ticksY
        }
    });
};

function createTicks(start, end){
    ticks = []
    for(i = start; i < end; i+=end/4)
       ticks.push([i,toNormalNumber(i)])
    return ticks;
}

function calcFreqNoPol(){
    var 
        container = document.getElementById('graphWfreqNoPol'),
        data, graph, i;
    data = []
    var step = math.ceil(omegaCrit/30)
    var max = -100;
    for(i=1.0; i<2*omegaCrit; i+=step){
        a = w(teta0, i, 1, 0)+w(teta0, i, 0, 1);
        data.push([i, a]);
        if(a>max) max = a;
    }
    ticksY = createTicks(0, max)
    ticks= createTicks(0, 2*omegaCrit);
    graph = Flotr.draw(container, [data],{
        xaxis: {
            title: '&#969;',
            ticks: ticks
        },
        yaxis: {
            ticks: ticksY
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
    ticks= createTicks(0, omegaCrit*2);
    graph = Flotr.draw(container, [data],{
        xaxis: {
            title: '&omega;',
            ticks: ticks
        },
        yaxis: {
            ticks: [1, 0, -1]
        }
    });
};
function calcTeta(){
    var 
        container = document.getElementById('graphWteta'),
        data, graph, i;
    data = []
    var max = -100;
    for(i=math.PI/2-3*deltaPsi; i<math.PI/2+3*deltaPsi; i+=deltaPsi/30){
        a = w(i, omegaCrit, LPI, LSIGMA);
        data.push([i, a]);
        if(a>max) max = a;
    }
    ticksY = createTicks(0, max)
    ticks= [];
    ticks.push([math.PI/2, "\u03c0/2"])
    ticks.push([math.PI/2-2*deltaPsi, "\u03c0/2-2&delta;&#968;"])
    ticks.push([math.PI/2+2*deltaPsi, "\u03c0/2+2&delta;&#968;"])
    graph = Flotr.draw(container, [data],{
        xaxis: {
            title: '&theta;',
            ticks: ticks,
        },
        yaxis: {
            ticks: ticksY
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
    E = parseFloat(document.getElementById('Energy').value);
    LPI = parseFloat(document.getElementById('lpi').value);
    LSIGMA = parseFloat(document.getElementById('lsigma').value);
    H = parseFloat(document.getElementById('H').value);
    E = E *1.6*math.pow(10,-19+6)//+6 because MeV insteat eV
    BETA = math.pow(1-math.pow(mc2/E, 2),1/2)
    R = BETA*E/(ELEC*H)
    teta0 = parseFloat($("#teta").val());
    omega0 = ELEC*H*C/E
    omegaCrit = (math.pow(E/mc2, 3)*4)
    deltaPsi = mc2/E
    var Wklas = 2/3 * ELEC*ELEC*C*Jmat.pow(E/mc2,4)/(R*R)
    $("#Pstate").html(toNormalNumber(PState(teta0,omegaCrit)))
    $("#Beta").html(BETA)
    $("#R").html(toNormalNumber(R))
    $("#Wklas").html(toNormalNumber(Wklas))
    $("#deltaPsi").html(toNormalNumber(deltaPsi))
    $("#omega0").html(toNormalNumber(omega0))
    $("#omegaCrit").html(toNormalNumber(omegaCrit))
    calcFreq()
    calcTeta()
    calcP()
    controlAnim()
    calcFreqNoPol()
};
function toNormalNumber(num){
    return num.toPrecision(2).replace("e+", "&#8901;10<sup>")+"</sup>"
};
calcAll()

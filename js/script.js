var ELEC = math.eval('1.6*10^(-19)')
var C = math.eval('3*10^8')
var mc2 = math.eval('9.109*10^-31')*C*C 
var R, BETA, E, H, omegaCrit, omega0, deltaPsi,teta0;
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
        graph, i;
    dataPI = []
    dataSIGMA = []
    var step = math.ceil(omegaCrit/30)
    var max = -100;
    var max2 = -100;
    for(i=1.0; i<2*omegaCrit; i+=step){
        a = w(teta0, i, 1, 0)
        b = w(teta0, i, 0, 1)
        dataPI.push([i, a]);
        dataSIGMA.push([i, b]);
        if(a>max) max = a;
        if(b>max2) max2 = b;
    }
    ticksY = createTicks(0, max)
    ticksY2 = createTicks(0,max2)
    ticks= createTicks(0, omegaCrit*2);
    graph = Flotr.draw(container, [{
            data: dataPI,
            label: '&pi;'
        }, { 
            data:dataSIGMA,
            label: '&sigma;',
          yaxis: 2
        }], {
        xaxis: {
            title: '&#969;',
            ticks: ticks
        },
        yaxis: {
            ticks: ticksY
        },
        y2axis: {
            ticks: ticksY2
        },
        legend:{
            position: 'ne'
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
    var step = math.ceil(omegaCrit/30)
    for(i=1.0; i<2*omegaCrit; i+=step){
        data.push([i, PState(teta0, i)]);
    }
    dataCrit = [[omegaCrit, PState(teta0,omegaCrit)]]
    ticks= createTicks(0, omegaCrit*2);
    graph = Flotr.draw(container, [
        {
            data: data
        }, {
            data: dataCrit, 
            points: {
                show: true
            },
            label: 'P(&omega;<sub>кр</sub>) = '+ toNormalNumber(PState(teta0,omegaCrit))
        }
        ],{
        xaxis: {
            title: '&omega;',
            ticks: ticks
        },
        yaxis: {
            min: -1,
            max: 1,
            ticks: [1, 0, -1],
            autoscale: false,
        },
        legend:{
            position: 'ne'
        }
    });
};
function calcTeta(){
    var 
        container = document.getElementById('graphWteta'),
        data, graph, i;
    dataPI = []
    dataSIGMA = []
    var max = -100
    var max2 = -100
    for(i=math.PI/2-3*deltaPsi; i<math.PI/2+3*deltaPsi; i+=deltaPsi/30){
        a = w(i, omegaCrit, 1, 0);
        b = w(i, omegaCrit, 0, 1);
        dataPI.push([i, a]);
        dataSIGMA.push([i, b]);
        if(a>max) max = a;
        if(b>max2) max2 = b;
    }
    ticksY = createTicks(0, max)
    ticksY2 = createTicks(0,max2)
    ticks= [];
    ticks.push([math.PI/2, "\u03c0/2"])
    ticks.push([math.PI/2-2*deltaPsi, "\u03c0/2-2&delta;&#968;"])
    ticks.push([math.PI/2+2*deltaPsi, "\u03c0/2+2&delta;&#968;"])
    graph = Flotr.draw(container, [{
            data: dataPI,
            label: '&pi;'
        }, { 
            data:dataSIGMA,
            label: '&sigma;',
          yaxis: 2
        }], {
        xaxis: {
            title: '&theta;',
            ticks: ticks,
        },
        yaxis: {
            ticks: ticksY
        },
        y2axis: {
            ticks: ticksY2
        },
    });
};

var intervalId
function controlAnim(){
    clearInterval(intervalId)
    var f = 0;
    intervalId = setInterval(function() { 
        f += 0.2*BETA;
        $("#electron").offset({left:$('.source').width()*(0.46*Jmat.sin(f)+0.48)+$(".source").offset().left, 
            top:$('.source').height()*(Jmat.cos(f)*0.27+0.5)+$(".source").offset().top});
    }, 50)
}

function calcAll(){
    E = parseFloat(document.getElementById('Energy').value);
    H = parseFloat(document.getElementById('H').value);
    E = E *1.6*math.pow(10,-19+6)//+6 because MeV insteat eV
    BETA = math.pow(1-math.pow(mc2/E, 2),1/2)
    R = BETA*E/(ELEC*H)
    teta0 = parseFloat($("#teta").val());
    omega0 = ELEC*H*C/E
    omegaCrit = (math.pow(E/mc2, 3)*4)
    deltaPsi = mc2/E
    var Wklas = 2/3 * ELEC*ELEC*C*Jmat.pow(E/mc2,4)/(R*R)
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
function resize(){
    a = $('#graphWfreq, #graphWteta, #graphPolarState, #graphWfreqNoPol, .main')
    height = $(window).height()
    console.log(height)
    if($(window).width()>970)  a.height(height/3) 
    else {a.height($(window).width()/2)}
    a.css({'width': '100%'})
    calcAll()
}
resize()
$(window).resize(function(){resize()})
calcAll()

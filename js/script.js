var ELEC = math.eval('1.6*10^(-10)')
var C = math.eval('3*10^8')
var R = 1
var BETA = 0.9999
var LPI = 0
var LSIGMA = 1
function w(teta, freq){ 
    var g = 1 - Jmat.pow(BETA*math.sin(teta), 2)
    var c = freq * Jmat.pow(g, 3/2)/3
    var a = LSIGMA * BETA *g* (Jmat.besselk(2/3, c))
    var b = LPI *(1/Jmat.tan(teta))* (Jmat.besselk(0.333333333, c))
    var y = ELEC*ELEC * C * BETA*BETA*freq*freq / (2 * math.PI * R*R)
    return y*math.pow(Jmat.abs(b+a).re,2)
};
function calcFreq(){
    var teta0 = parseFloat(document.getElementById('freq').value);
    var 
        container = document.getElementById('graphWfreq'),
        data, graph, i;
    data = []
    var omeg = math.floor(math.pow(1-BETA*BETA, -3/2))/10
    for(i=1.0; i<omeg*100; i+=omeg){
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
function calcTeta(){
    var freq = parseFloat(document.getElementById('teta').value);
    var 
        container = document.getElementById('graphWteta'),
        data, graph, i, ticks;
    ticks = [
        [0,"0"],
        [math.pi/3, "pi/3"],
        [2*math.pi/3, "2pi/3"],
        [math.pi, "pi"],
        [4*math.pi/3, "4pi/3"],
        [5*math.pi/3, "5pi/3"]
    ]
    data = []
    for(i=0; i<math.PI*2; i+=0.01){
        data.push([i, w(i, freq)]);
    }
    graph = Flotr.draw(container, [data],{
        radar: {show: true},
        grid:{
            circular: true,
            minorHorizontalLines: true
        },
        xaxis: {
            ticks: ticks,
            title: 'teta'
        }
    });
};
function calcAll(){
    BETA = parseFloat(document.getElementById('beta').value);
    LPI = parseFloat(document.getElementById('lpi').value);
    LSIGMA = parseFloat(document.getElementById('lsigma').value);
    calcFreq()
    calcTeta()
};
calcAll()

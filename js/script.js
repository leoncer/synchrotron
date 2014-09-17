var ELEC = math.eval('1.6*10^(-3)')
var C = math.eval('3*10^8')
var R = 1
var BETA = 0.91
var ENERGY = 10000
var LPI = math.eval('1/2^(1/2)')
var LSIGMA = math.eval('1/2^(1/2)')
function w(teta, freq){ 
    var a = LSIGMA * BETA * (besselj(freq*BETA*math.sin(teta), freq+1)
                         + besselj(freq*BETA*math.sin(teta), freq-1))/2
    var b = LPI * (math.cot(teta))*besselj(freq*BETA*math.sin(teta), freq)
    var y = ELEC*ELEC * C * BETA*BETA*freq*freq / (2 * math.PI * R*R)
    return y*(b+a)*(b+a)
};
function calcFreq(){
    var teta0 = parseFloat(document.getElementById('freq').value);
    var 
        container = document.getElementById('graphWfreq'),
        data, graph, i;
    data = []
    for(i=1.0; i<110.0; i+=1){
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
calcFreq();
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
    for(i=0; i<math.pi*2; i+=0.01){
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
calcTeta();

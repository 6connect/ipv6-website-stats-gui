const Chart = require('chart.js');

let lastupdate = Date.now();

const addData = (chart, label, data, color) => {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
        dataset.backgroundColor.push(color);
    });
}

const clearData = (chart) => {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
        dataset.backgroundColor = [];
    });
}

const messageListener = (message) => {
    const data = JSON.parse(message.data);
    if (data[0] === 'stats') {
        lastupdate = Date.now();
        console.log(data[1]);
        clearData(ipvBreakdownchart);
        addData(ipvBreakdownchart, 'IPv4', data[1].ipv4.mobile+data[1].ipv4.tablet+data[1].ipv4.desktop, "rgb(255, 99, 132)");
        addData(ipvBreakdownchart, 'IPv6', data[1].ipv6.mobile+data[1].ipv6.tablet+data[1].ipv6.desktop, "rgb(54, 162, 235)");
        ipvBreakdownchart.update();

        clearData(ipv4chart);
        addData(ipv4chart, 'Mobile', data[1].ipv4.mobile, "rgb(255, 99, 132)");
        addData(ipv4chart, 'Tablet', data[1].ipv4.tablet, "rgb(54, 162, 235)");
        addData(ipv4chart, 'Desktop', data[1].ipv4.desktop, "rgb(255, 205, 86)");
        ipv4chart.update();

        clearData(ipv6chart);
        addData(ipv6chart, 'Mobile', data[1].ipv6.mobile, "rgb(255, 99, 132)");
        addData(ipv6chart, 'Tablet', data[1].ipv6.tablet, "rgb(54, 162, 235)");
        addData(ipv6chart, 'Desktop', data[1].ipv6.desktop, "rgb(255, 205, 86)");
        ipv6chart.update();
    } else {
        console.log(data);
    }
}
const init = (socket) => {
    socket.onmessage = messageListener
}

const ipvBreakdowncanvas = document.createElement('canvas');
const ipvBreakdowncanvasContainer = document.createElement('div');
ipvBreakdowncanvasContainer.appendChild(document.createTextNode('IPv4 vs IPv6'))
ipvBreakdowncanvasContainer.appendChild(ipvBreakdowncanvas);
ipvBreakdowncanvas.classList.add('ipvBreakdowncanvas');
ipvBreakdowncanvasContainer.classList.add('full');
const ipvBreakdownctx = ipvBreakdowncanvas.getContext('2d');
const ipvBreakdownchart = new Chart(ipvBreakdownctx, {
    "type":"doughnut",
    "data": {
        "labels":[],
        "datasets": [
            {
                "data":[],
                "backgroundColor":[]
            }
        ]
    }
});

const ipv4canvas = document.createElement('canvas');
const ipv4canvasContainer = document.createElement('div');
ipv4canvasContainer.appendChild(document.createTextNode('IPv4'))
ipv4canvasContainer.appendChild(ipv4canvas);
ipv4canvas.classList.add('ipv4canvas');
ipv4canvasContainer.classList.add('half');
const ipv4ctx = ipv4canvas.getContext('2d');
const ipv4chart = new Chart(ipv4ctx, {
    "type":"doughnut",
    "data": {
        "labels":[],
        "datasets": [
            {
                "data":[],
                "backgroundColor":[]
            }
        ]
    }
});

const ipv6canvas = document.createElement('canvas');
const ipv6canvasContainer = document.createElement('div');
ipv6canvasContainer.appendChild(document.createTextNode('IPv6'))
ipv6canvasContainer.appendChild(ipv6canvas);
ipv6canvas.classList.add('ipv6canvas');
ipv6canvasContainer.classList.add('half');
const ipv6ctx = ipv6canvas.getContext('2d');
const ipv6chart = new Chart(ipv6ctx, {
    "type":"doughnut",
    "data": {
        "labels":[],
        "datasets": [
            {
                "data":[],
                "backgroundColor":[]
            }
        ]
    }
});

window.addEventListener("load", ()=>{
    document.body.appendChild(ipvBreakdowncanvasContainer);
    document.body.appendChild(ipv4canvasContainer);
    document.body.appendChild(ipv6canvasContainer);

    const url = 'wss://ipv6.'+window.location.host;
    let socket = new WebSocket(url);
    init(socket);

    setInterval(function () {
        if (socket.readyState === 3) {
            document.getElementById("serverstatus").className = "offline";
            socket = new WebSocket(url);
            init(socket);
        } else if(socket.readyState === 1) {
            document.getElementById("serverstatus").className = "online";
        }
    }, 1000);
});

setInterval(()=>{
    document.getElementById('lastupdate').textContent = Math.round((Date.now() - lastupdate)/1000)+" seconds ago";
}, 1000)
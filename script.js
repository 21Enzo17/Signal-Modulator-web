

// Funciones de codificación de señales
function nrz_l(data, start_level) {
    let encoded = [start_level, start_level,start_level];
    for (let bit of data) {
        encoded.push(bit === '0' ? 1 : -1);
        encoded.push(bit === '0' ? 1 : -1);
    }
    return encoded;
}

function nrz_i(data, start_level) {
    let level = start_level;
    let encoded = [level, level, level];
    for (let bit of data) {
        if (bit === '1') {
            level = -level;
        }
        encoded.push(level);
        encoded.push(level);
    }
    return encoded;
}

function manchester(data, start_level) {
    let encoded = [];
    for (let bit of data) {
        if (bit === '1') {
            encoded.push(1, -1);
        } else {
            encoded.push(-1, 1);
        }
    }
    return encoded.map(val => val * start_level);  // Multiplica por el nivel inicial para ajustar la posición en el gráfico
}

function diff_manchester(data, start_level) {
    let level = start_level;
    let encoded = [];
    for (let bit of data) {
        if (bit === '1') {
            level = -level;
        }
        encoded.push(level, -level);
    }
    return encoded;
}
// Función para trazar la señal nrz
function plot_signal(signal, data, title) {
    let x = Array.from({length: signal.length}, (_, i) => Math.floor(i / 2) + 1);  // Agrega 1 a los valores de x
    let trace1 = {
        x: x,
        y: signal.map(val => val ),  
        mode: 'lines',
        type: 'scatter',
        name: 'Signal',
        hoverinfo: 'none',
        line:{
            width: 4
        }
    };

    let trace2 = {
        x: x.filter((_, i) => i % 2 === 0).map(val => val + 1.5),  // Agrega 0.5 a los valores de x
        y: Array(data.length).fill(-1.5),  // Coloca los números un poco debajo de la onda
        mode: 'text',
        type: 'scatter',
        text: data.split(''),  // Divide los datos en bits
        hoverinfo: 'none',
        showlegend: false
    };

    let layout = {
        title: title,
        xaxis: {
            title: 'Tiempo',
            showgrid: true,
            zeroline: false,  // Desactiva la línea del eje x predeterminada
            gridwidth: 2,
            scaleanchor: "y",
            range: [0, signal.length / 2 + 2],  // Ajusta el rango del eje x para agregar espacio a la derecha
            tickvals: Array.from({length: Math.ceil(signal.length / 2)}, (_, i) => i + 1),  // Agrega 1 a los valores de x
            fixedrange: true
        },
        yaxis: {
            title: 'Amplitud',
            showline: true,
            zeroline: false,
            gridwidth: 2,
            range: [-3, 3],  // Ajusta el rango del eje y para mover el eje x hacia abajo
            fixedrange: true
        },
        shapes: [{  // Añade una línea en y = -3
            type: 'line',
            xref: 'paper',
            x0: 0,
            y0: -3,
            x1: 1,
            y1: -3,
            line: {
                color: 'black',
                width: 2
            }
        }],
        autosize: true,
        margin: {
            l: 50,  // Añade espacio a la izquierda
            r: 50,  // Añade espacio a la derecha
            b: 50,
            t: 50,
            pad: 10
        },
        staticPlot: true,
        showlegend: false
    };
    Plotly.newPlot('myDiv', [trace1, trace2], layout, {displayModeBar: false});
}

// Función para trazar la señal manchester
function plot_signal_manchester(signal, data, title) {
    let x = [];
    for (let i = 0; i < signal.length; i++) {
        x.push(i / 2 + 1, i / 2 + 1.5);  // Agrega 1 a los valores de x
    }

    let y = [];
    for (let i = 0; i < signal.length; i++) {
        y.push(signal[i], signal[i] );  
    }

    let trace1 = {
        x: x,
        y: y,
        mode: 'lines',
        type: 'scatter',
        name: 'Signal',
        hoverinfo: 'none',
        line:{
            width: 4
        }
    };

    let trace2 = {
        x: Array.from({length: data.length}, (_, i) => i + 1 + 0.5),  // Coloca los números en los intervalos de tiempo completos
        y: Array(data.length).fill(-1.5),  // Coloca los números un poco debajo de la onda
        mode: 'text',
        type: 'scatter',
        text: data.split(''),  // Divide los datos en bits
        hoverinfo: 'none',
        showlegend: false
    };

    let layout = {
        title: title,
        xaxis: {
            title: 'Tiempo',
            showgrid: true,
            zeroline: false,  // Desactiva la línea del eje x predeterminada
            gridwidth: 2,
            scaleanchor: "y",
            range: [0, (Math.ceil(signal.length)/2) +1],  // Ajusta el rango del eje x para incluir el último valor
            tickvals: Array.from({length: Math.ceil(signal.length / 2) + 1}, (_, i) => i + 1),  // Agrega 1 a los valores de x
            fixedrange: true
        },
        yaxis: {
            title: 'Amplitud',
            showline: true,
            zeroline: false,
            gridwidth: 4,
            range: [-3, 3],  // Ajusta el rango del eje y para mover el eje x hacia abajo
            fixedrange: true
        },
        shapes: [{  // Añade una línea en y = -3
            type: 'line',
            xref: 'paper',
            x0: 0,
            y0: -3,
            x1: 1,
            y1: -3,
            line: {
                color: 'black',
                width: 2
            }
        }],
        autosize: true,
        margin: {
            l: 50,  // Añade espacio a la izquierda
            r: 50,  // Añade espacio a la derecha
            b: 50,
            t: 50,
            pad: 10
        },
        staticPlot: true,
        showlegend: false
    };
    Plotly.newPlot('myDiv', [trace1, trace2], layout, {displayModeBar: false});
}

let isGraphDrawn = false;

// Función que se llama cuando se hace clic en el botón "Dibujar"
function drawSignal() {
    let data = document.getElementById('data').value;
    let startLevel = parseInt(document.getElementById('startLevel').value);
    let waveType = document.getElementById('waveType').value;

    // Verifica si los datos están vacíos
    if (!data) {
        showAlert('Por favor, ingrese los datos.');
        return;
    }

    // Verifica si los datos contienen solo 0 y 1
    if (!/^[01]+$/.test(data)) {
        showAlert('Los datos solo pueden contener 0 y 1.');
        return;
    }

    let signal;
    switch (waveType) {
        case 'NRZ-L':
            signal = nrz_l(data, startLevel);
            break;
        case 'NRZ-I':
            signal = nrz_i(data, startLevel);
            let nrziAlert = document.getElementById('nrzi-alert');
            if (nrziAlert) {
                nrziAlert.style.display = 'block';
            }
            break;
        case 'Manchester':
            signal = manchester(data, startLevel);
            break;
        case 'Manchester Diferencial':
            signal = diff_manchester(data, startLevel);
            break;
    }
    Plotly.purge('myDiv');
    if (waveType === 'Manchester' || waveType === 'Manchester Diferencial') {
        plot_signal_manchester(signal, data, waveType);
    } else {
        plot_signal(signal, data, waveType);
    }
    isGraphDrawn = true; 
}

// Función que se llama cuando se hace clic en el botón "Exportar"
// Función que se llama cuando se hace clic en el botón "Exportar"
function exportGraph(size) {
    if (!isGraphDrawn) {
        showAlert('Por favor, dibuje el gráfico antes de exportarlo.');
        return;
    }
    let width = size.split('x')[0];
    let height = size.split('x')[1];
    let data = document.getElementById('data').value;
    let waveType = document.getElementById('waveType').value;

    let imageName = waveType.replace(/\s/g, '') + '-' + data + '.png';  // Elimina los espacios en blanco del tipo de onda y añade los datos

    Plotly.toImage('myDiv', {format: 'png', width: width, height: height}).then(function(dataUrl) {
        let link = document.createElement('a');
        link.download = imageName;
        link.href = dataUrl;
        link.click();
    });
}

function showAlert(message) {
    let alertElement = document.getElementById('alert');
    let alertMessageElement = document.getElementById('alert-message');

    alertMessageElement.textContent = message;
    alertElement.style.display = 'block';
}


// Agrega un evento de clic al botón "Dibujar" después de que se haya cargado el DOM
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('drawButton').addEventListener('click', drawSignal);

    // Agrega un controlador de eventos para las opciones del menú desplegable
    Array.from(document.querySelectorAll('.dropdown-menu a')).forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.preventDefault(); // Previene la acción por defecto del enlace
            let size = this.getAttribute('data-size');
            let exportButton = document.getElementById('exportButton');
            exportButton.textContent = 'Exportar (' + size + ')';
            exportButton.setAttribute('data-size', size);
            exportGraph(size);
        });
    });

    // Agrega un controlador de eventos para el botón de exportación
    document.getElementById('exportButton').addEventListener('click', function() {
        let size = this.getAttribute('data-size');
        exportGraph(size);
    });
});
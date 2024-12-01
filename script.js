function encode(input) {
    if (!/^[01]+$/.test(input)) {
        return "Entrada no válida. Por favor, ingrese solo valores binarios (0 y 1).";
    }

    const inputLength = input.length;

    let p = 0;
    while (Math.pow(2, p) < inputLength + p + 1) {
        p++;
    }

    const encoded = Array(inputLength + p).fill('0');
    let j = 0;

    for (let i = 0; i < encoded.length; i++) {
        if (isPowerOfTwo(i + 1)) {
            encoded[i] = '0';
        } else {
            encoded[i] = input[j++];
        }
    }

    for (let i = 0; i < p; i++) {
        const posicionParidad = Math.pow(2, i);
        encoded[posicionParidad - 1] = calculoParidad(encoded, posicionParidad);
    }

    mostrarTablaHamming(encoded, p);

    return encoded.join('');
}

function mostrarTablaHamming(encoded, p) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = '';  
    let paridadCount = 0;

    for (let i = 0; i < encoded.length; i++) {
        const row = document.createElement("tr");

        const posCell = document.createElement("td");
        posCell.textContent = i + 1; 
        row.appendChild(posCell);

        const binarioCell = document.createElement("td");
        if (isPowerOfTwo(i + 1)) {
            binarioCell.textContent = `P${Math.log2(i + 1) + 1}`;  
        } else {
            binarioCell.textContent = encoded[i];  
        }
        row.appendChild(binarioCell);

        const tipoCell = document.createElement("td");
        if (isPowerOfTwo(i + 1)) {
            tipoCell.textContent = 'Paridad';
            paridadCount++;
        } else {
            tipoCell.textContent = 'Dato';
        }
        row.appendChild(tipoCell);

        const controlaCell = document.createElement("td");
        if (isPowerOfTwo(i + 1)) {
            const controla = obtenerControla(i + 1, encoded.length);
            controlaCell.textContent = controla.join(", ");
        } else {
            controlaCell.textContent = '-';
        }
        row.appendChild(controlaCell);

        tableBody.appendChild(row);
    }

    document.getElementById("paridadCount").textContent = `Cantidad de bits de paridad: ${paridadCount}`;

    document.getElementById("hammingTable").style.display = "block";
}

function isPowerOfTwo(n) {
    return (n & (n - 1)) === 0;
}

function calculoParidad(encoded, posicionParidad) {
    let contador = 0;
    for (let j = 1; j <= encoded.length; j++) {
        if ((j & posicionParidad) !== 0 && encoded[j - 1] === '1') {
            contador++;
        }
    }
    return contador % 2 === 0 ? '0' : '1';
}

function obtenerControla(posicion, longitud) {
    const controla = [];
    for (let i = 1; i <= longitud; i++) {
        if ((i & posicion) !== 0) {
            controla.push(i);
        }
    }
    return controla;
}

function detectorYCorrector(input) {
    if (!/^[01]+$/.test(input)) {
        return "Entrada no válida. Por favor, ingrese solo valores binarios (0 y 1).";
    }

    const n = input.length;
    let errorPos = 0;

    for (let i = 0; Math.pow(2, i) <= n; i++) {
        const posicionParidad = Math.pow(2, i);
        const paridadCalculada = calculoParidad(input.split(''), posicionParidad);
        const paridadRecibida = input[posicionParidad - 1];

        if (paridadCalculada !== paridadRecibida) {
            errorPos += posicionParidad;
        }
    }

    mostrarTablaHammingDetect(input.split(''), errorPos);

    if (errorPos !== 0) {
        const corregido = input.split('');
        corregido[errorPos - 1] = corregido[errorPos - 1] === '0' ? '1' : '0';
        return `Error detectado en la posición ${errorPos}. Código corregido: ${corregido.join('')}`;
    } else {
        return "No se detectaron errores.";
    }
}

function mostrarTablaHammingDetect(encoded, errorPos) {
    const tableBodyDetect = document.getElementById("tableBodyDetect");
    tableBodyDetect.innerHTML = ''; 

    for (let i = 0; i < encoded.length; i++) {
        const row = document.createElement("tr");

        const posCell = document.createElement("td");
        posCell.textContent = i + 1;
        row.appendChild(posCell);

        const binarioCell = document.createElement("td");
        if (isPowerOfTwo(i + 1)) {
            binarioCell.textContent = `P${Math.log2(i + 1) + 1}`;  
        } else {
            binarioCell.textContent = encoded[i];  // Mostrar bit de dato
        }
        row.appendChild(binarioCell);

        const tipoCell = document.createElement("td");
        tipoCell.textContent = isPowerOfTwo(i + 1) ? 'Paridad' : 'Dato';
        row.appendChild(tipoCell);

        const controlaCell = document.createElement("td");
        if (isPowerOfTwo(i + 1)) {
            const controla = obtenerControla(i + 1, encoded.length);
            controlaCell.textContent = controla.join(", ");
        } else {
            controlaCell.textContent = '-';
        }

        if (i === errorPos - 1) {
            row.classList.add('error');  // Marcar la fila con error
        }

        row.appendChild(controlaCell);
        tableBodyDetect.appendChild(row);
    }

    document.getElementById("hammingTableDetect").style.display = "block";
}

document.getElementById('encodeButton').addEventListener('click', function () {
    const input = document.getElementById('inputData').value;
    const encoded = encode(input);
    document.getElementById('output').textContent = `Secuencia codificada: ${encoded}`;
    document.getElementById('outputContainer').style.display = "block";
});

document.getElementById('detectButton').addEventListener('click', function () {
    const input = document.getElementById('detectInput').value;
    const detectResult = detectorYCorrector(input);
    document.getElementById('detectOutput').textContent = detectResult;
    document.getElementById('detectOutputContainer').style.display = "block";
});

const infoLink = document.getElementById('infoLink');
infoLink.addEventListener('click', (event) => {
    event.preventDefault(); 
    window.open('manual/ManualUsuario.pdf', '_blank');
});
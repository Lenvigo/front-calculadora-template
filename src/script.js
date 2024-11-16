// Variables para almacenar el valor y la operación actual
let currentInput = "0";
let currentOperation = "";

// Función para actualizar el display
function updateDisplay() {
    document.getElementById("display").innerText = currentInput;
}

// Evento de los botones de números
document.querySelectorAll('[data-num]').forEach(button => {
    button.addEventListener('click', () => {
        if (currentInput === "0") {
            currentInput = button.dataset.num;
        } else {
            currentInput += button.dataset.num;
        }
        updateDisplay();
    });
});

// Evento de los botones de operaciones
document.querySelectorAll('[data-op]').forEach(button => {
    button.addEventListener('click', () => {
        currentOperation = button.dataset.op;
        currentInput += ` ${currentOperation} `;
        updateDisplay();
    });
});

// Función para realizar la operación localmente
function calculateLocal() {
    const [num1, op, num2] = currentInput.split(' ');

    let result = 0;
    switch (op) {
        case "+":
            result = parseFloat(num1) + parseFloat(num2);
            break;
        case "-":
            result = parseFloat(num1) - parseFloat(num2);
            break;
        case "*":
            result = parseFloat(num1) * parseFloat(num2);
            break;
        case "/":
            result = parseFloat(num1) / parseFloat(num2);
            break;
        default:
            result = "Error";
    }
    document.getElementById("local-result-display").innerText = result.toFixed(3);
    return result.toFixed(3);
}

// Llamada a la API para obtener el resultado
async function getApiResult() {
    const [num1, op, num2] = currentInput.split(' ');

    // Construir la URL de la API según la operación
    const url = `http://127.0.0.1:8000/${op}/?num1=${num1}&num2=${num2}`;

    try {
        // Enviar la solicitud a la API
        const response = await fetch(url);

        // Verificar si la respuesta fue exitosa (código 2xx)
        if (!response.ok) {
            // Si la respuesta no es ok, mostramos un mensaje de error
            throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        // Parsear la respuesta JSON
        const data = await response.json();

        // Mostrar el resultado de la API en el div correspondiente
        document.getElementById("api-result-display").innerText = `Resultado de la API: ${parseFloat(data.resultado).toFixed(3)}`;
    } catch (error) {
        // Si ocurre un error en la conexión o en la respuesta, mostramos un mensaje en la modal
        let errorMessage = error.message;

        // Si el error es de conexión, se muestra un mensaje diferente
        if (error.message.includes("Failed to fetch")) {
            errorMessage = "Error en la conexión a la API. Verifica la conexión o el servidor.";
        }

        // Coloca el mensaje de error en la modal
        document.getElementById("error-message").innerText = errorMessage;

        // Mostrar la modal con el error
        const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
        errorModal.show();
    }
}


// Evento de igual para calcular ambos resultados
document.getElementById("equals").addEventListener('click', () => {
    const localResult = calculateLocal();
    getApiResult();  // Llamar a la API y mostrar el resultado
    currentInput = "0";
    updateDisplay();
});

document.getElementById("clear").addEventListener('click', () => {
    currentInput = "0";
    updateDisplay();
    document.getElementById("local-result-display").innerText = "0";
    document.getElementById("api-result-display").innerText = "0";
});
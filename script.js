// CONFIGURACIÓN DE TU BACKEND API REST
const API_BASE_URL = 'http://localhost:5000/api'; // Ajusta la URL de tu backend real

// Elementos de la interfaz
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const processBtn = document.getElementById('process-btn');
const loader = document.getElementById('loader');
const receiptForm = document.getElementById('receipt-form');
const saveBtn = document.getElementById('save-btn');
const formAlert = document.getElementById('form-alert');
const recordsBody = document.getElementById('records-body');
const refreshBtn = document.getElementById('refresh-btn');

let selectedFile = null;

// --- EVENTOS DE CARGA DE ARCHIVOS (Drag and Drop) ---

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

['dragleave', 'dragend'].forEach(type => {
    dropZone.addEventListener(type, () => {
        dropZone.classList.remove('drag-over');
    });
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showAlert('Solo se permiten archivos de imagen.', 'error');
        return;
    }
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
    
    // Reseteamos el formulario y estados
    receiptForm.reset();
    saveBtn.disabled = true;
    formAlert.classList.add('hidden');
}

// --- PROCESAMIENTO OCR / IA (ENVÍO A BACKEND O LOCAL) ---

processBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    showLoader(true);
    formAlert.classList.add('hidden');

    try {
        // ENFOQUE 1: Envío real al Backend (Descomenta estas líneas cuando tu API esté lista)
        /*
        const formData = new FormData();
        formData.append('receipt', selectedFile);
        
        const response = await fetch(`${API_BASE_URL}/receipts/process`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Error al procesar con el servidor');
        const data = await response.json();
        fillFormFields(data);
        */

        // ENFOQUE 2: Procesamiento Local con Tesseract.js (Asistencia inmediata)
        const result = await Tesseract.recognize(selectedFile, 'spa');
        const text = result.data.text;
        
        const extractedData = parseReceiptText(text);
        fillFormFields(extractedData);
        showAlert('Procesamiento completado. Revisa y corrige la información si es necesario.', 'success');

    } catch (error) {
        console.error(error);
        showAlert('Error al extraer la información. Por favor, rellena los campos manualmente.', 'warning');
        saveBtn.disabled = false; // Permitimos que rellene a mano
    } finally {
        showLoader(false);
    }
});

// Algoritmo de RegEx para parsear texto de boleta en el cliente (IA asistida)
function parseReceiptText(text) {
    console.log("Texto extraído por OCR:\n", text);
    
    const data = {
        commerce: '',
        date: '',
        total: '',
        items: '',
        payment: 'Otro'
    };

    // Intentar obtener el comercio (primera línea no vacía por lo general)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 0) data.commerce = lines[0];

    // Buscar fecha (Formatos: DD/MM/AAAA, DD-MM-AAAA, AAAA-MM-DD)
    const dateRegex = /(\d{2}[-/]\d{2}[-/]\d{4})|(\d{4}[-/]\d{2}[-/]\d{2})/;
    const foundDate = text.match(dateRegex);
    if (foundDate) {
        // Normalizar fecha al formato YYYY-MM-DD
        const parts = foundDate[0].split(/[-/]/);
        if (parts[0].length === 4) {
            data.date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        } else {
            data.date = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }

    // Buscar total (palabras clave: TOTAL, NETO, VALOR, $, CLP)
    const totalRegex = /(?:total|monto|pagar|neto|clp)?\s*[\$]?\s*(\d+[\.,]\d{3}|\d+)/i;
    const matches = text.match(totalRegex);
    if (matches) {
        // Limpiamos puntos de miles para convertir a número plano
        const numStr = matches[1].replace(/\./g, '').replace(',', '.');
        data.total = parseFloat(numStr) || '';
    }

    // Buscar medio de pago
    if (/tarjeta|debito|credito|visa|mastercard|redcompra/i.test(text)) {
        data.payment = 'Tarjeta de Débito';
    } else if (/efectivo|cash/i.test(text)) {
        data.payment = 'Efectivo';
    }

    // Almacenamos texto crudo estructurado para el campo items
    data.items = lines.slice(1, 5).join(', '); // Un extracto de las primeras líneas

    return data;
}

function fillFormFields(data) {
    document.getElementById('field-commerce').value = data.commerce || '';
    document.getElementById('field-date').value = data.date || '';
    document.getElementById('field-items').value = data.items || '';
    document.getElementById('field-total').value = data.total || '';
    document.getElementById('field-payment').value = data.payment || 'Otro';

    // Validación de completitud
    checkDataCompleteness();
    saveBtn.disabled = false;
}

function checkDataCompleteness() {
    const commerce = document.getElementById('field-commerce').value;
    const date = document.getElementById('field-date').value;
    const total = document.getElementById('field-total').value;

    if (!commerce || !date || !total) {
        showAlert('Información incompleta detectada. Puedes completarla manualmente antes de guardar.', 'warning');
    }
}

// --- GUARDAR Y CONSULTAR (OPERACIONES API REST) ---

receiptForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const record = {
        commerce: document.getElementById('field-commerce').value,
        date: document.getElementById('field-date').value,
        payment: document.getElementById('field-payment').value,
        items: document.getElementById('field-items').value,
        total: parseFloat(document.getElementById('field-total').value)
    };

    try {
        // ENFOQUE 1: Petición real POST al Backend
        /*
        const response = await fetch(`${API_BASE_URL}/receipts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        });
        if (!response.ok) throw new Error('Error al guardar');
        */

        // ENFOQUE 2: Almacenamiento Local (Simulación robusta)
        saveLocalRecord(record);
        
        showAlert('¡Boleta registrada y sincronizada con éxito!', 'success');
        receiptForm.reset();
        previewContainer.classList.add('hidden');
        selectedFile = null;
        saveBtn.disabled = true;
        
        loadRecords();

    } catch (error) {
        showAlert('No se pudo guardar la información en el servidor.', 'error');
    }
});

// Cargar registros desde la API o LocalStorage
async function loadRecords() {
    try {
        // ENFOQUE 1: Consulta real GET al Backend
        /*
        const response = await fetch(`${API_BASE_URL}/receipts`);
        const records = await response.json();
        */

        // ENFOQUE 2: Carga local
        const records = JSON.parse(localStorage.getItem('receipts') || '[]');
        renderTable(records);

    } catch (error) {
        console.error("Error al cargar registros:", error);
    }
}

function renderTable(records) {
    if (records.length === 0) {
        recordsBody.innerHTML = `<tr><td colspan="6" class="empty-state">No hay registros guardados aún.</td></tr>`;
        return;
    }

    recordsBody.innerHTML = records.map(rec => {
        // Manejo de errores e información incompleta visualmente
        const isIncomplete = !rec.commerce || !rec.date || !rec.total;
        const statusBadge = isIncomplete 
            ? '<span class="badge incomplete">Incompleto</span>' 
            : '<span class="badge complete">Completo</span>';

        return `
            <tr>
                <td>${rec.date || '<i>Sin fecha</i>'}</td>
                <td><strong>${rec.commerce || '<i>Desconocido</i>'}</strong></td>
                <td>${rec.items || '<i>Sin detalles</i>'}</td>
                <td>${rec.payment}</td>
                <td>$${parseFloat(rec.total || 0).toLocaleString()}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

// Sincronización Manual
refreshBtn.addEventListener('click', loadRecords);

// --- UTILIDADES ---

function showLoader(show) {
    if (show) {
        loader.classList.remove('hidden');
        receiptForm.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
        receiptForm.classList.remove('hidden');
    }
}

function showAlert(message, type) {
    formAlert.textContent = message;
    formAlert.className = `alert ${type}`;
    formAlert.classList.remove('hidden');
}

function saveLocalRecord(record) {
    const records = JSON.parse(localStorage.getItem('receipts') || '[]');
    records.unshift(record); // Lo insertamos al inicio
    localStorage.setItem('receipts', JSON.stringify(records));
}

// Inicializar la tabla al cargar la página
window.addEventListener('DOMContentLoaded', loadRecords);
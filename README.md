# 🧾 SmartReceipt - Extractor Inteligente de Boletas con OCR

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tesseract.js](https://img.shields.io/badge/Tesseract.js-OCR-green?style=for-the-badge)

SmartReceipt es una aplicación web que utiliza **OCR (Reconocimiento Óptico de Caracteres)** mediante **Tesseract.js** para extraer automáticamente la información contenida en fotografías de boletas o comprobantes de compra.

El sistema permite analizar una imagen, identificar datos relevantes como comercio, fecha, monto total y medio de pago, para posteriormente almacenarlos en una base de datos o, de forma local, mediante **LocalStorage**.

---

# 🚀 Características

- 📷 Carga de imágenes mediante Drag & Drop.
- 🖼 Vista previa de la boleta.
- 🤖 Extracción automática de texto mediante OCR.
- 🏪 Detección del comercio.
- 📅 Detección automática de fecha.
- 💳 Identificación del medio de pago.
- 💰 Obtención del monto total.
- 📝 Registro del detalle de la compra.
- 💾 Almacenamiento en LocalStorage.
- 🌐 Preparado para conectarse a una API REST.
- 📊 Historial de boletas guardadas.

---

# 📂 Estructura del Proyecto

```
SmartReceipt/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

# 📄 Archivos

## 📌 index.html

Contiene toda la estructura de la aplicación.

Incluye:

- Dashboard
- Área Drag & Drop
- Vista previa
- Formulario editable
- Tabla de registros
- Loader
- Alertas

También importa:

- FontAwesome
- Tesseract.js
- style.css
- script.js

---

## 🎨 style.css

Archivo encargado del diseño de la interfaz.

Incluye:

- Responsive Design
- Dashboard en Grid
- Cards
- Botones
- Loader animado
- Alertas
- Tabla de registros
- Variables CSS
- Tema moderno

---

## ⚙ script.js

Contiene toda la lógica de la aplicación.

Funciones principales:

### 📥 Carga de imágenes

- Drag & Drop
- Explorador de archivos
- Vista previa

---

### 🤖 OCR

Utiliza:

```
Tesseract.js
```

para obtener el texto de la imagen.

---

### 🧠 Procesamiento Inteligente

Mediante expresiones regulares identifica:

- Comercio
- Fecha
- Total
- Medio de pago

---

### 📋 Autocompletado

Los datos encontrados se cargan automáticamente en el formulario.

---

### 💾 Guardado

Actualmente soporta dos modos:

### LocalStorage

Ideal para pruebas.

```
localStorage.setItem(...)
```

### API REST

Preparado para consumir:

```
POST /api/receipts
GET  /api/receipts
```

Solo es necesario habilitar las líneas comentadas.

---

### 📊 Historial

Los registros se muestran automáticamente en una tabla.

Cada registro posee un estado:

- ✅ Completo
- ⚠ Incompleto

---

# 🧠 Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES6
- Tesseract.js
- FontAwesome

---

# 📦 Instalación

Clonar el proyecto

```bash
git clone https://github.com/TU_USUARIO/SmartReceipt.git
```

Entrar al proyecto

```bash
cd SmartReceipt
```

Abrir

```
index.html
```

en cualquier navegador moderno.

No requiere instalación de dependencias.

---

# 🌐 Conexión con Backend

El proyecto ya está preparado para conectarse con un Backend.

Modificar en:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Por ejemplo:

```javascript
const API_BASE_URL = 'https://midominio.cl/api';
```

Endpoints esperados:

### Procesar OCR

```
POST /receipts/process
```

### Guardar

```
POST /receipts
```

### Obtener registros

```
GET /receipts
```

---

# 📸 Flujo de funcionamiento

```
Usuario

     │

     ▼

Sube imagen

     │

     ▼

Vista previa

     │

     ▼

OCR (Tesseract.js)

     │

     ▼

Extracción de datos

     │

     ▼

Formulario editable

     │

     ▼

Guardar

     │

     ▼

LocalStorage / Base de Datos

     │

     ▼

Historial
```

---

# 🔮 Mejoras futuras

- Firebase Firestore
- Firebase Authentication
- Google Login
- OCR mediante IA (OpenAI Vision)
- Exportar Excel
- Exportar PDF
- Dashboard estadístico
- Clasificación automática de gastos
- Reconocimiento de facturas electrónicas
- Panel administrativo
- API Node.js + Express
- MongoDB / PostgreSQL
- Docker
- Deploy en Vercel

---

# 📱 Compatibilidad

✔ Chrome

✔ Edge

✔ Firefox

✔ Opera

✔ Brave

✔ Navegadores móviles

---

# 👨‍💻 Autor

**Bernardo Rodríguez Rodríguez**

Ingeniero Civil Industrial

Ingeniero en Prevención de Riesgos

Especialista en Automatización, IA y Transformación Digital.

---

# 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT.

Puedes usarlo, modificarlo y distribuirlo libremente.

---

## ⭐ Si este proyecto te resulta útil

No olvides dejar una ⭐ en el repositorio de GitHub.

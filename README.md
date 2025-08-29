# Secure Password Generator - Extensión para Chrome

[Captura](https://i.imgur.com/CEZE2Q5.png) 

Un generador de contraseñas seguro, moderno y de código abierto que se ejecuta como una extensión en tu navegador. Creado con un enfoque en la seguridad, la privacidad y una excelente experiencia de usuario. Esta herramienta genera contraseñas complejas, memorables y códigos PIN directamente en tu dispositivo, asegurando que tus claves nunca salgan de tu navegador.

---

## ✨ Características Principales

* **Tres Modos de Generación:**
    * `Aleatorio`: Crea contraseñas robustas con una mezcla personalizable de mayúsculas, minúsculas, números y símbolos.
    * `Memorizable`: Genera frases de contraseña (passphrases) fáciles de recordar pero difíciles de descifrar, basadas en palabras.
    * `PIN`: Crea códigos PIN numéricos de longitud variable.
* **Métricas de Seguridad Avanzadas:**
    * **Medidor de Fuerza Visual:** Evalúa la complejidad de tu contraseña en tiempo real.
    * **Cálculo de Entropía:** Mide la aleatoriedad real de tu contraseña en bits.
    * **Estimación de Tiempo de Crackeo:** Calcula cuánto tiempo tomaría a un atacante descifrar tu contraseña mediante fuerza bruta.
* **100% Seguro y Privado:**
    * Todas las contraseñas se generan **localmente en tu navegador** utilizando la API `window.crypto` para una aleatoriedad criptográficamente segura.
    * Ninguna contraseña o dato es transmitido o almacenado fuera de tu dispositivo.
* **Utilidades Adicionales:**
    * **Historial Local:** Guarda tus últimas contraseñas generadas para un acceso rápido (con opción de exportar a `.csv`).
    * **Código QR:** Transfiere de forma segura una contraseña a tu móvil escaneando un código QR.
    * **Soporte Multilingüe:** Interfaz disponible en Español e Inglés.
    * **Tema Claro y Oscuro:** Se adapta a las preferencias de tu sistema.

---

## 🚀 Instalación

Tienes dos formas de instalar y usar esta extensión:

### 1. Desde la Chrome Web Store (Próximamente)

*Una vez que tu extensión sea publicada, podrás añadir el enlace aquí para una instalación sencilla.*

`[Enlace a la Chrome Web Store]`

### 2. Instalación Local (Para Desarrolladores)

Si deseas probar la versión de desarrollo:

1.  **Descarga o clona este repositorio:**
    ```bash
    git clone [https://github.com/kevinphurtado/generadorcontrasena.git](https://github.com/kevinphurtado/generadorcontrasena.git)
    ```
2.  Abre Google Chrome y ve a la página de extensiones: `chrome://extensions`.
3.  Activa el **"Modo de desarrollador"** en la esquina superior derecha.
4.  Haz clic en **"Cargar descomprimida"**.
5.  Selecciona la carpeta del proyecto que clonaste.
6.  ¡Listo! El ícono de la extensión aparecerá en tu barra de herramientas.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido desde cero con un enfoque en la simplicidad y el rendimiento, utilizando tecnologías web estándar:

* **HTML5:** Para la estructura semántica del contenido.
* **CSS3:** Para el diseño y la tematización (claro/oscuro) utilizando variables CSS.
* **JavaScript (ES6+):** Lógica de la aplicación sin dependencias de frameworks (`Vanilla JS`).
* **Web Crypto API:** Se utiliza `window.crypto.getRandomValues()` para garantizar una generación de números aleatorios criptográficamente segura, fundamental para la creación de contraseñas robustas.

---

## 👨‍💻 Autor

Diseñado y desarrollado por **Kevin Hurtado**.

* **Portafolio:** [chococreativo.com.co/proyectos](https://chococreativo.com.co/proyectos)
* **GitHub:** [@kevinphurtado](https://github.com/kevinphurtado)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

# miGenApp - Generador y Verificador de Contraseñas

**[Ver Demo en Vivo](https://migenapp.lat)**

miGenApp es una herramienta web todo-en-uno diseñada para ayudarte a crear y verificar la seguridad de tus contraseñas. Su principal característica es la privacidad: **todas las operaciones se realizan 100% en tu navegador**. Ninguna contraseña o dato sensible es enviado a un servidor.

![Captura de pantalla de miGenApp](https://i.imgur.com/fYL1kQv.png)

---

## ✨ Características Principales

### 🔐 Módulo Generador
* **Generador Aleatorio:** Crea contraseñas criptográficamente seguras (`window.crypto`) con control total sobre la longitud y el set de caracteres (mayúsculas, minúsculas, números y símbolos).
* **Generador Memorizable:** Genera frases de contraseña fáciles de recordar (usando listas de palabras en español e inglés), con opciones para capitalizar, añadir números, símbolos y separadores.
* **Generador de PIN:** Crea códigos PIN numéricos de longitud variable.
* **Análisis de Fortaleza:** Mide la entropía y el tiempo estimado de crackeo de la contraseña generada en tiempo real.
* **Código QR:** Genera un código QR de tu contraseña para transferirla fácilmente a un dispositivo móvil.

### 🛡️ Módulo Verificador
* **Análisis Local:** Revisa la fortaleza de cualquier contraseña basándose en criterios clave (longitud, mayúsculas, números, etc.).
* **Comprobación de Filtraciones (Pwned Passwords):** Utiliza la API de 'Have I Been Pwned' de forma 100% segura y anónima (usando **k-Anonymity**) para verificar si tu contraseña ha sido expuesta en una filtración de datos pública.

### 🚀 Generales
* **Privacidad Total:** Todo se ejecuta en el navegador. Las contraseñas nunca abandonan tu dispositivo.
* **Historial Cifrado (AES):** Guarda tus contraseñas generadas en un historial local, protegido y cifrado con una **Clave Maestra** personal que solo tú conoces.
* **Modo Oscuro/Claro:** Interfaz moderna y adaptable a las preferencias de tu sistema o con un botón de cambio manual.
* **Multilenguaje:** Soporte completo para **Español** e **Inglés** en toda la interfaz.
* **Diseño Responsivo:** Funciona perfectamente en computadoras de escritorio, tablets y dispositivos móviles.

---

## 💻 Tech Stack

Este proyecto es una aplicación estática (JAMstack) construida sin *frameworks* de JavaScript, enfocada en la velocidad y la seguridad.

* **HTML5**
* **CSS3 Moderno:** (Variables CSS, Flexbox, Grid, Animaciones)
* **JavaScript (Vanilla JS - ES6+):** Todo el código es JavaScript puro y modular.
* **CryptoJS:** Utilizado para el cifrado AES del historial y el hashing SHA-256 de la clave maestra.
* **APIs del Navegador:**
    * `window.crypto`: Para la generación segura de números aleatorios.
    * `fetch`: Para la consulta a la API de Pwned Passwords.
* **Font Awesome:** Para la iconografía de la interfaz.

---

## 🚀 Cómo Empezar

No se requiere instalación de dependencias ni un proceso de compilación.

1.  Descarga o clona este repositorio.
2.  Abre el archivo `index.html` en tu navegador web.

Para probar todas las funcionalidades (especialmente la API de Pwned Passwords, que puede ser bloqueada por CORS en un entorno `file:///`), se recomienda servir los archivos desde un servidor local. La forma más fácil es usando la extensión **"Live Server"** en VS Code.

---

## 👤 Autor

* **Kevin Hurtado** (Chocó Creativo)
* **GitHub:** [@kevinphurtado](https://github.com/kevinphurtado)
* **Portafolio:** [chococreativo.com.co](https://chococreativo.com.co/proyectos)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

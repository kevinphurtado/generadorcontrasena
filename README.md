# Generador y verificador de contraseñas

Una aplicación web ligera que genera contraseñas aleatorias, frases memorizables y PIN seguros directamente en tu navegador. También permite verificar la fortaleza de tus claves y, de forma opcional, comprobar si han aparecido en filtraciones conocidas mediante la API pública de *Have I Been Pwned*.

La herramienta está pensada para funcionar completamente sin servicios de terceros: todos los cálculos se ejecutan en el cliente y no se cargan scripts de analítica o publicidad.

## ✨ Características principales

- **Tres modos de generación:** aleatorio, frase memorizable y PIN.
- **Personalización completa:** ajusta longitud, conjuntos de caracteres y separadores para adaptarte a diferentes políticas de seguridad.
- **Historial local:** guarda las contraseñas que copias y permite exportarlas a CSV o limpiar el historial en un clic.
- **Interfaz bilingüe (ES/EN):** cambia de idioma al instante; las traducciones se cargan desde archivos JSON independientes.
- **Accesible por diseño:** controles con texto descriptivo, atajos visuales y mensajes con `aria-live`.
- **Verificador con comprobación opcional de filtraciones:** habilítalo sólo cuando lo necesites; la comprobación usa k-anonymity y nunca envía la contraseña en texto claro.
- **Tema claro/oscuro persistente** guardado en `localStorage`.

## 🧰 Requisitos

- Node.js >= 18 para ejecutar las pruebas automatizadas.
- Un navegador moderno (Chrome, Firefox, Edge o Safari) para usar la aplicación.

## 🚀 Puesta en marcha

### Servir la aplicación

1. Clona el repositorio y entra a la carpeta:
   ```bash
   git clone https://github.com/kevinphurtado/generadorcontrasena.git
   cd generadorcontrasena
   ```
2. Sirve la carpeta como un sitio estático. Puedes usar `npm run preview` que levanta un servidor HTTP mínimo:
   ```bash
   npm run preview
   ```
3. Abre `http://localhost:4173` en tu navegador.

> También puedes utilizar cualquier otro servidor estático (`python -m http.server`, `serve`, `http-server`, etc.).

### Ejecutar pruebas

Se incluyen pruebas unitarias usando el *test runner* nativo de Node (`node --test`) para validar la lógica de generación y comprobación de contraseñas:

```bash
npm test
```

## 🗂️ Estructura del proyecto

```
├── index.html            # Entrada principal (solo carga CSS y JS modular)
├── style.css             # Estilos globales, con soporte light/dark
├── js/
│   ├── main.js           # Punto de entrada que orquesta vistas y estado
│   ├── state.js          # Gestión de estado y sincronización con localStorage
│   ├── generator.js      # Lógica de la vista de generación de contraseñas
│   ├── verifier.js       # Lógica de la vista de verificación
│   ├── modals.js         # Gestión accesible de modales
│   ├── i18n.js           # Carga de traducciones JSON y utilidades i18n
│   └── lib/
│       ├── passwordGenerator.js
│       └── passwordVerifier.js
├── translations/         # Archivos JSON con textos en español e inglés
└── tests/                # Pruebas unitarias (Vitest)
```

## 🤝 Cómo contribuir

1. Crea un *fork* del repositorio.
2. Genera una rama descriptiva (`feature/mejora-accesibilidad`).
3. Realiza tus cambios siguiendo estas pautas:
   - Mantén el código en ES Modules sin dependencias innecesarias.
   - No introduzcas scripts externos que comprometan la privacidad.
   - Asegúrate de ejecutar `npm test` antes de abrir un pull request.
4. Envía tu PR describiendo claramente la mejora.

## 📄 Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE). ¡Si lo encuentras útil, comparte el repositorio o envía tus mejoras!

# Propuestas de mejora para el generador de contraseñas

Esta lista resume oportunidades de mejora detectadas tras revisar la estructura actual del proyecto.

## 1. Accesibilidad y semántica
- Añadir etiquetas `aria-label` o `aria-describedby` a los controles que solo muestran un icono (por ejemplo, los botones de idioma, tema o acciones del generador) para que los lectores de pantalla puedan anunciarlos correctamente. Actualmente dependen únicamente de iconos `<i>` sin texto descriptivo visible ni atributos accesibles.【F:index.html†L32-L51】【F:index.html†L72-L92】
- Proporcionar alternativas de texto para los iconos y reorganizar el contenido del `<footer>` para asegurar una jerarquía semántica clara, ya que hoy solo hay elementos de párrafo y enlaces sin encabezados que guíen el contenido para tecnologías asistivas.【F:index.html†L52-L92】

## 2. Rendimiento y privacidad
- Revisar la necesidad de cargar scripts externos de análisis y publicidad (`Google Analytics` y `AdSense`). Además de añadir peso extra, pueden entrar en conflicto con la promesa de privacidad al ejecutar código de terceros dentro de la aplicación.【F:index.html†L12-L28】
- Permitir una versión "auto hospedada" que funcione sin dependencias de red (p. ej. empaquetando fuentes o iconos localmente) para facilitar el uso en entornos sin conexión o con políticas de seguridad estrictas.【F:index.html†L8-L15】

## 3. Modularidad y mantenibilidad del JavaScript
- Extraer las traducciones a archivos JSON independientes y cargar solo el idioma necesario. El objeto `translations` contiene cadenas muy extensas dentro de `script.js`, lo que dificulta el mantenimiento y la contribución externa.【F:script.js†L25-L104】
- Dividir `script.js` en módulos más pequeños (por ejemplo: `estado`, `generador`, `verificador`, `traducciones`) para mejorar la legibilidad y posibilitar pruebas unitarias de cada componente.【F:script.js†L1-L200】

## 4. Experiencia de usuario
- Añadir retroalimentación visual cuando se copian contraseñas o se generan nuevas, más allá del mensaje flotante actual, y permitir personalizar la duración del aviso para usuarios que necesiten confirmaciones más largas.【F:index.html†L94-L96】【F:script.js†L1-L200】
- Implementar validaciones visibles cuando el usuario deshabilita todas las opciones de caracteres en el modo aleatorio o introduce un PIN fuera de los límites permitidos, evitando estados inválidos sin explicación.【F:script.js†L62-L154】

## 5. Calidad y pruebas
- Incluir pruebas automatizadas (p. ej. con Vitest o Jest) para verificar la generación de contraseñas, cálculo de entropía y lógica del verificador. Actualmente no existe infraestructura de pruebas automatizadas en el repositorio.【F:script.js†L1-L200】
- Configurar un pipeline de integración continua (GitHub Actions) que ejecute linters y pruebas para asegurar la calidad en cada cambio.

## 6. Documentación
- Ampliar el `README` con instrucciones específicas para ejecutar el proyecto como aplicación web (por ejemplo, servirlo con `npm`/`vite` o un servidor estático) y detallar los permisos requeridos al empaquetarlo como extensión.【F:README.md†L5-L73】
- Añadir un apartado de "Contribución" que describa cómo proponer cambios y estándares de código, incentivando la participación de la comunidad.【F:README.md†L5-L73】

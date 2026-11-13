# Página personal de Armando Q. Angulo Chavira

Sitio estático bilingüe en español e inglés, preparado para GitHub Pages. El diseño conserva la paleta ejecutiva en blanco, negro y grises, con la fotografía y los logotipos institucionales a color. No requiere backend ni servicios de pago.

## Actualizar el sitio desde el navegador

El archivo `site-manager.html` funciona como un administrador sencillo para el contenido de las páginas. No aparece en el menú principal; conviene guardar la dirección en favoritos.

Desde el administrador puedes editar:

- Perfil, enlaces académicos, membresías y textos de inicio.
- Portada con perfil, trayectoria académica y métodos.
- Publicaciones, con año, etiquetas, resumen, BibTeX, DOI/PDF y filtros de primer autor y autor de correspondencia.
- Proyectos, presentaciones, divulgación, docencia, miembros del grupo y colaboradores.
- Recursos públicos y entradas del blog.

En cada lista puedes agregar registros, corregirlos, eliminarlos y cambiar su orden. Los campos bilingües se editan en español e inglés. Puedes subir archivos permitidos desde los registros; el archivo se agrega al mismo commit que los datos.

### Primera instalación

1. Descarga el ZIP actualizado y reemplaza en GitHub los archivos del sitio con esta versión.
2. Espera a que GitHub Pages publique los cambios.
3. Abre `site-manager.html` en la dirección de tu sitio y guarda esa página en favoritos.

Esta carga inicial todavía se hace desde GitHub. Después, las ediciones de contenido se pueden enviar directamente desde el administrador.

### Crear y usar el token de GitHub

1. En el administrador, abre **Conectar GitHub por primera vez** y sigue el enlace para crear un token *fine-grained*.
2. Limita el token al repositorio de esta página, ponle vencimiento y concede **Contents: Read and write**.
3. Pega el token en el administrador y pulsa **Conectar**.
4. Edita todas las secciones que necesites y pulsa **Guardar cambios y hacer commit**.

El token se conserva solo en la memoria de la pestaña y se borra al cerrar o recargar. No se guarda en el sitio, el repositorio ni el borrador local. Si abres el editor de recursos privados, tendrás que conectarlo también; el token no pasa de una página a otra. Cuando termine el commit, GitHub Pages publica la actualización automáticamente.

Los borradores de texto se guardan en el almacenamiento local del navegador para que puedas volver a ellos. Los archivos que selecciones para subir se conservan temporalmente en memoria hasta hacer el commit; no recargues la pestaña antes de guardarlos. El editor acepta PDF, CSV, XLSX, DOCX, PPTX, PNG, JPG y WebP de hasta 12 MB por archivo.

## Archivos públicos y recursos personales

Todo archivo subido al administrador público, como fotos, PDFs o bases de datos, queda publicado en el repositorio y puede ser accesible para cualquiera. Sube solo material que tengas permiso de compartir.

`resource-editor.html` permite guardar notas y enlaces personales en `data/private-resources.enc.json`. El cifrado AES-GCM y la derivación de clave PBKDF2 ocurren en el navegador antes del commit; solo el archivo cifrado se envía a GitHub. Puedes guardar los cambios directamente desde esa página o descargar el archivo cifrado como respaldo. La frase de paso no se transmite ni se guarda en el sitio; consérvala de forma segura porque no puede recuperarse si se pierde.

El almacén cifrado sirve para notas y enlaces, no para contraseñas ni como sustituto de almacenamiento privado. Los permisos de Drive u otro destino siguen siendo los que protegen el documento enlazado. Para comprobantes, expedientes y documentos sensibles, conserva los archivos en una carpeta privada y guarda solo un enlace con acceso restringido.

## Vista previa local

Desde esta carpeta, inicia un servidor estático (por ejemplo, `python -m http.server 8000`) y abre `http://localhost:8000`. Las páginas usan archivos JSON y Web Crypto, por lo que deben servirse por HTTP/HTTPS. GitHub Pages ya funciona con HTTPS.

## Archivos principales

- `index.html`, `style.css`, `main.js`: presentación, estilos, idioma y tema.
- `data/site-content.json`: textos bilingües y listas públicas administrables.
- `data/publications.json`, `publications.html`, `publications.js`: publicaciones y filtros.
- `site-manager.html`, `site-manager.js`: editor de contenido público.
- `github-publisher.js`: commits hechos desde el navegador usando el token introducido en esa pestaña.
- `resource-editor.html`, `resource-editor.js`, `vault-crypto.js`: edición y cifrado de recursos personales.
- `data/private-resources.enc.json`: almacén cifrado publicado.
- `img/`, `files/`, `uploads/`: imágenes, materiales existentes y nuevos archivos subidos.

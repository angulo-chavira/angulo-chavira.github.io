# Página personal de Armando Q. Angulo Chavira

Sitio estático bilingüe en español e inglés, preparado para GitHub Pages. El diseño usa una paleta en blanco, negro y grises; el tema claro/oscuro se puede cambiar desde el encabezado. No utiliza backend ni servicios de pago.

## Actualizar publicaciones sin editar el código del sitio

1. Abre `site-manager.html` en el sitio publicado. La página no aparece en el menú; guárdala en favoritos.
2. Agrega o actualiza el registro. El borrador se guarda solo en el almacenamiento local de ese navegador.
3. Descarga `publications.json`.
4. En GitHub, reemplaza `data/publications.json` por el archivo descargado y confirma el cambio.

La página pública de publicaciones permite buscar y filtrar por año, tema, primer autor y autor de correspondencia. Los resúmenes, etiquetas y roles de autoría se pueden completar en el administrador. El archivo JSON será público: no incluyas datos privados.

## Recursos personales cifrados

`private-resources.html` es una página fuera del menú y protegida por una frase de paso. `resource-editor.html` permite crear o actualizar el contenido. Guarda enlaces y notas personales; deja documentos, comprobantes y datos sensibles en tu almacenamiento privado.

### Primera configuración

1. Abre `resource-editor.html` en el sitio publicado.
2. Crea una frase de paso larga (la herramienta exige al menos 14 caracteres) y conserva una copia segura. No hay recuperación si se pierde.
3. Agrega recursos y descarga `private-resources.enc.json`.
4. En GitHub, reemplaza `data/private-resources.enc.json` por el archivo descargado.
5. Abre `private-resources.html` y escribe tu frase de paso para consultar los recursos.

Para actualizar la lista, abre el editor, desbloquea con la misma frase, modifica los registros, descarga el nuevo archivo cifrado y reemplaza el archivo de datos en GitHub.

El cifrado AES-GCM y la derivación de clave PBKDF2 se realizan dentro del navegador; la frase de paso no se transmite ni se guarda en el sitio. El repositorio sí contiene el archivo cifrado, así que elige una frase que no pueda adivinarse. Si guardas un enlace privado, protege también el destino con los permisos de Drive u otro servicio: cifrar la lista no cambia los permisos del documento al que apunta.

## Vista previa local

Desde esta carpeta, inicia un servidor estático (por ejemplo, `python -m http.server 8000`) y abre `http://localhost:8000`. La página necesita servirse por HTTP/HTTPS para cargar sus archivos JSON y usar Web Crypto. GitHub Pages funciona por HTTPS.

## Archivos principales

- `index.html`, `style.css`, `main.js`: presentación, estilos, idioma y tema.
- `publications.html`, `publications.js`, `data/publications.json`: catálogo y filtros.
- `site-manager.html`, `site-manager.js`: editor local de los datos públicos de publicaciones.
- `private-resources.html`, `private-resources.js`: lectura del espacio cifrado.
- `resource-editor.html`, `resource-editor.js`, `vault-crypto.js`: edición y cifrado de recursos privados.
- `data/private-resources.enc.json`: solo contiene el almacén cifrado publicado.
- `img/`, `files/`: imágenes y archivos que ya formaban parte del sitio original.

Las demás páginas conservan sus contenidos actuales. Sus textos fijos todavía se editan en los archivos HTML correspondientes.

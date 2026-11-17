# Verificación de la actualización

Comprobaciones terminadas el 17 de noviembre de 2026.

## Datos y exportación

- ANEW: 1,028 filas y 30 columnas leídas desde el CSV original. Se conserva la primera columna sin nombre bajo la etiqueta `source_row`.
- Oraciones: 2,925 contextos, 33,147 combinaciones de contexto y respuesta, y 157,801 observaciones válidas. La agregación JavaScript se comparó con una extracción independiente de las celdas del Excel: mismos IDs, textos, denominadores, frecuencias y respuestas; probabilidades y entropía coinciden con tolerancia de 1e-12.
- Lectura de CSV comprobada con BOM, campos entre comillas, saltos de línea dentro de campos, valores faltantes y ceros. Se rechazan encabezados duplicados. La búsqueda opcional sin tildes conserva la diferencia entre `n` y `ñ`.
- La descarga real de una consulta de lista conserva el orden de cuatro entradas, una repetición y una entrada no encontrada.
- Se descargaron Excel y ZIP desde el navegador. Sus archivos internos son legibles y sus recuentos coinciden con la selección.
- El Excel exportado se validó como archivo OOXML, con texto Unicode y valores de texto que comienzan con `=` almacenados como texto, sin fórmulas ejecutables.

## Interfaz

- Consulta, filtros, selección, detalle y descarga revisados en el navegador.
- Vistas de 360 y 390 píxeles comprobadas sin desbordamiento horizontal de la página; resultados en tarjetas. Se verificó una ficha ANEW y una ficha de oraciones.
- Idioma español/inglés y colores del modo oscuro revisados.
- Enlace de publicación a su base, ficha de proyecto y sección de colaboración para estudiantes revisados.
- El administrador leyó los dos archivos originales y preparó 1,028 registros ANEW y 2,925 contextos de oraciones.

## Guardado del administrador

Prueba con una implementación simulada de GitHubPublisher, sin usar credenciales ni enviar commits reales:

- Reemplazar el CSV reúne el archivo, la consulta comprimida y `site-content.json` en una sola llamada de commit.
- Se mantienen la foto actual, las afiliaciones, el correo y las etiquetas personalizadas del explorador.
- No se envía `publications.json` cuando no hay cambios en publicaciones.
- Los IDs de explorador repetidos y los formatos ANEW incompletos detienen el envío antes del commit.

## Alcance de la verificación

Se comprobó la sintaxis de los JavaScript modificados. Los JSON de contenido y publicaciones del sitio se mantienen idénticos a la base de trabajo y se excluyen del paquete de actualización.

No se publicó esta actualización ni se probó un commit con el token real del usuario. La comprobación en móvil se realizó con vistas del navegador a esos anchos, no en el teléfono físico. El paso final es incorporar los archivos al repositorio y esperar el despliegue de GitHub Pages.

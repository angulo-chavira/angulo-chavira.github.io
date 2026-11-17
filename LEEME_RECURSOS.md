# Actualización de recursos · versión 1

Esta actualización añade consultas interactivas a las dos bases que ya están publicadas en el sitio. Es un paquete de archivos para incorporar al repositorio existente de GitHub Pages; no publica cambios por sí solo.

## Instalación

1. Descomprime `actualizacion-recursos-v1.zip`.
2. Copia su contenido a la raíz del repositorio del sitio. Combina las carpetas `data` y `vendor` y reemplaza los archivos incluidos. No sustituyas toda la carpeta `data` por la del ZIP.
3. Haz commit y sube los cambios a GitHub como de costumbre.
4. Cuando termine el despliegue de GitHub Pages, recarga la página. En **Recursos**, cada base tendrá el enlace **Consultar base**.

El paquete conserva los archivos `data/site-content.json` y `data/publications.json` que ya tengas en tu repositorio: no incluye copias para reemplazarlos. Tampoco reemplaza tus fotos, logos o archivos originales de las bases. El `style.css` incluido conserva la versión del sitio revisada al comenzar esta implementación y añade la hoja de estilos del explorador.

Si modificaste el código de alguno de los archivos incluidos después de comenzar este trabajo, revisa esas diferencias antes de reemplazarlo. Los cambios de contenido que guardas desde el administrador se mantienen en los JSON existentes.

## Primer uso

Las bases existentes se reconocen por sus rutas actuales:

| Recurso | Archivo existente | ID del explorador |
| --- | --- | --- |
| ANEW en español de México | `files/ANEW_mexican_word_average.csv` | `anew-mx` |
| Completamiento de oraciones | `files/corpus_data_clean5.xlsx` | `cloze-mx` |

Los enlaces directos son `resource.html?id=anew-mx` y `resource.html?id=cloze-mx`, dentro del mismo sitio. Conserva los originales en esas rutas para que las descargas sigan funcionando.

## Qué puede hacer quien consulta

- Buscar palabras, contextos o respuestas, con una opción para ignorar tildes conservando la diferencia entre `n` y `ñ`.
- Filtrar valores numéricos, ordenar, elegir columnas y seleccionar registros de distintas páginas.
- Pegar una lista o cargar un TXT/CSV. La exportación de la lista conserva su orden, sus repeticiones y las entradas no encontradas. El CSV debe tener encabezado; se consulta su primera columna.
- Descargar resultados filtrados, la selección o la base de consulta completa en CSV o Excel.
- Descargar un ZIP con los datos, la ficha de consulta, la cita BibTeX y un ejemplo de lectura en R.
- Abrir la ficha de cada registro, consultar el diccionario de variables y descargarlo.
- Explorar valencia y activación en ANEW o las distribuciones y completamientos de las oraciones.
- Copiar un enlace con filtros, orden y columnas. La lista pegada no se incluye en el enlace; se registra en la ficha de la exportación cuando está activa.

La interfaz funciona en español e inglés y conserva las palabras y respuestas originales de los datos. En pantallas pequeñas, los resultados se muestran como tarjetas.

## Editar desde el administrador

1. Abre tu administrador habitual y entra en **Recursos públicos**.
2. Abre el registro de la base y despliega **Explorador de datos**.
3. Desde ahí puedes activar la consulta y editar su ID, título breve, resumen, versión, estructura, columna principal, artículo, cita BibTeX, notas y condiciones de uso.
4. En **Variables, etiquetas y filtros** puedes modificar los nombres visibles, definiciones, tipos, columnas iniciales y filtros numéricos.
5. Guarda mediante el commit habitual del administrador. El primer guardado incorpora los valores iniciales del explorador a los datos del sitio.

Para actualizar una base, sube el archivo nuevo en **Archivo para descargar**. Usa **Leer columnas y preparar consulta** para revisar su estructura antes de guardar. Al hacer commit, el administrador reúne el original, la copia de consulta comprimida y la configuración en una sola operación.

Si reemplazas un archivo directamente desde GitHub y conservas exactamente su nombre, vuelve al administrador, pulsa **Leer columnas y preparar consulta** y guarda un commit. Así regeneras la copia de consulta y su huella SHA-256.

La estructura **Tabla general (CSV)** admite nuevas tablas CSV. La estructura **ANEW (CSV)** valida las columnas necesarias para esa base. La estructura **Completamiento (Excel con Unified e IDs)** requiere el formato de hojas del Excel actual; un libro con otra organización necesita una adaptación específica.

## Mejoras de la página general

- Las publicaciones relacionadas con las bases muestran el acceso **Consultar datos**.
- Los proyectos tienen una ficha desplegable con estado, métodos y contacto. Desde el administrador puedes añadir pregunta, avances, equipo, IDs de recursos y enlaces a publicaciones.
- En **Estudiantes** aparece **Trabajar conmigo**, con texto editable desde esa misma sección del administrador para servicio social, tesis y voluntariado.

## Cálculo de la consulta de oraciones

El Excel original se conserva como referencia. La tabla de consulta se calcula a partir de `Unified`, alineada por coordenada de celda con `ID_responses`, y utiliza únicamente los identificadores de `ID_selected`. Se excluyen valores vacíos, `NA`, `na` y `NaN`.

- `N`: respuestas válidas alineadas de cada contexto.
- `Probability`: frecuencia del completamiento dividida entre `N`.
- `Cloze_max`: mayor probabilidad observada en el contexto.
- `Entropy_bits`: `-sum(p * log2(p))`.
- `Surprisal_bits`: `-log2(p)` para cada respuesta observada, sin suavizado.

Se preservan los IDs originales y sus huecos, y los contextos repetidos con IDs distintos. La vista resumida muestra un completamiento cuando hay empate; la ficha conserva todas las alternativas. La procedencia se puede consultar en Documentación y se incluye en las fichas de exportación.

Las exportaciones conservan los valores disponibles sin el redondeo usado en pantalla. Los códigos de categorías y la frecuencia de ANEW se mantienen como están en el archivo: no se inventan etiquetas ni unidades que el CSV no especifica.

## Archivos y comprobaciones

`MANIFIESTO_RECURSOS.json` enumera los archivos de esta actualización y sus huellas SHA-256. `VALIDACION_RECURSOS.md` describe las verificaciones realizadas y sus límites.

Los archivos `fflate.min.js` y su licencia MIT se incluyen en `vendor` para leer y escribir ZIP, GZIP y Excel sin depender de un servicio de procesamiento externo. Las consultas se ejecutan en el navegador del visitante.

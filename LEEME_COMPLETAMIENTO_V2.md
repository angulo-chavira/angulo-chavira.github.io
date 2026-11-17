# Normas de completamiento · actualización 2

Esta actualización se instala sobre la primera versión de los exploradores de recursos, que ya está en el sitio. Amplía el recurso de completamiento y corrige el cursor de las ventanas de detalle de ambos exploradores.

## Subir desde GitHub

1. Descomprime **actualizacion-completamiento-v2.zip**.
2. Abre la página principal de tu repositorio, donde están index.html y style.css.
3. Pulsa **Add file → Upload files**.
4. Arrastra el contenido de la carpeta descomprimida. Los cuatro archivos de código van directamente en la raíz:
   - resource.html
   - resource-explorer.js
   - resource-explorer.css
   - cloze-workbench.js
5. Escribe un mensaje de commit, por ejemplo «Ampliar normas de completamiento y corregir cursor», y guarda en la rama habitual del sitio.
6. Cuando termine el despliegue de GitHub Pages, abre **Recursos → Completamiento de oraciones → Consultar base**. Recarga con **Ctrl + Shift + R** si sigues viendo la versión anterior.

En este ZIP todos los archivos están en la raíz: no hay carpetas que combinar. Los otros tres archivos son las instrucciones, la validación y el manifiesto; puedes conservarlos también en el repositorio.

Los originales de las bases, las fotos y los JSON de contenido del sitio se mantienen. La versión de la base sigue siendo la misma: esta actualización cambia las herramientas de consulta.

## Palabra final

Escribe una respuesta completa, por ejemplo «abejas». La búsqueda recorre todos los contextos, incluyendo aquellos donde esa respuesta no fue la más frecuente.

- Consulta frecuencia, denominador válido, probabilidad y sorpresa de esa respuesta, junto con la entropía del contexto.
- Filtra la probabilidad entre límites de 0 a 1 y ordena las coincidencias.
- Puedes ignorar tildes, manteniendo la diferencia entre n y ñ. Las variantes observadas se conservan como filas separadas.
- Abre una ficha, añade un contexto al comparador o guarda la pareja contexto/respuesta en la lista activa.
- Exporta todas las coincidencias en CSV.

Esta búsqueda usa toda la base y sus propios límites de probabilidad. Los filtros de la pestaña Consultar se usan por separado para explorar contextos y construir listas.

## Comparar

Usa **Comparar** junto a una oración para añadir hasta cuatro contextos.

- Se muestran el contexto, N, cierre máximo, entropía y sus respuestas más frecuentes.
- Escribe una palabra para consultar su probabilidad y sorpresa en todos los contextos comparados.
- Despliega **Comparar todas las respuestas** para ver la tabla conjunta.
- Exporta las respuestas observadas de los contextos comparados en CSV.

Una respuesta no observada se señala como tal. Su ausencia en la muestra no se presenta como una probabilidad poblacional de cero.

## Mis listas

Puedes guardar hasta 20 listas por proyecto y cambiar sus nombres. Se guardan automáticamente en el navegador que estás usando, sin iniciar sesión.

Para añadir estímulos:

- Usa **Añadir a lista** junto a una oración o una coincidencia por palabra.
- En **Consultar**, selecciona registros y luego pulsa **Añadir mi selección de Consultar** desde Mis listas. Esta opción usa la respuesta más frecuente.
- Para generar una lista desde criterios, configura primero los filtros de Consultar y después indica la cantidad, el método y la semilla en el constructor.

El método aleatorio conserva su semilla, los candidatos y los IDs elegidos en la ficha del paquete. También puedes tomar los primeros registros del orden actual. La opción de excluir contextos usados evita reutilizarlos en cualquiera de tus listas durante la construcción automática.

Las incorporaciones manuales permiten guardar distintas respuestas de un mismo contexto. Se evita repetir exactamente la misma pareja contexto/respuesta dentro de una lista.

El resumen muestra media, mínimo y máximo de la probabilidad objetivo, la entropía y N. Es descriptivo; la herramienta no establece equivalencia estadística entre listas.

Puedes quitar estímulos, cambiar su orden, eliminar listas y restaurar la última lista eliminada durante la sesión. Exporta la lista activa en:

- **CSV**: tabla con orden, contexto, palabra objetivo y medidas.
- **Excel**: datos y ficha de consulta.
- **ZIP**: estímulos, ficha, proyecto de listas, cita BibTeX y ejemplo de lectura en R.

Pulsa **Guardar proyecto (.json)** para tener un respaldo. **Abrir proyecto (.json)** incorpora sus listas como listas adicionales; conserva sus estímulos y el historial de construcción. Ese archivo también permite llevar las listas a otro navegador o computadora. Conviene guardarlo antes de borrar los datos del navegador.

## Interpretación de las medidas

La probabilidad y la sorpresa de la palabra objetivo corresponden a la pareja contexto/respuesta seleccionada, aunque esa palabra no sea la respuesta dominante. La entropía y el cierre máximo describen el contexto.

Los valores se redondean en pantalla; los archivos conservan la precisión disponible. Si una fuente posterior ya no contiene un contexto o una respuesta guardada, la herramienta lo señala. Las respuestas no observadas tienen medidas vacías, no cero ni infinito; los IDs de contexto ausentes permanecen en el proyecto y se omiten de las exportaciones de datos.

## Ventanas de detalle

El cursor decorativo del sitio queda debajo de la capa de los diálogos nativos. La actualización utiliza el cursor normal dentro de esas ventanas y oculta temporalmente el decorativo. Se pueden usar sus botones y desplazar el contenido; la página de fondo permanece fija mientras la ventana está abierta.

**VALIDACION_COMPLETAMIENTO_V2.md** resume las comprobaciones. **MANIFIESTO_COMPLETAMIENTO_V2.json** identifica los archivos y sus huellas SHA-256.

# Verificación · completamiento 2

Comprobaciones terminadas el 17 de noviembre de 2026.

## Ventanas y navegación

- Se reprodujo el problema original: el estilo computado del diálogo y sus botones era cursor: none.
- Con la corrección, el diálogo usa auto, los botones usan pointer y el cursor decorativo queda oculto mientras está abierto.
- Se accionaron con el mouse los botones de selección, comparación y cierre del diálogo.
- Se verificó que una respuesta alternativa conserve su identidad y el resaltado después de cambiar la selección en la ficha.
- Se revisaron las vistas de 360 y 390 píxeles. La búsqueda, comparación y listas no desbordan horizontalmente la página; el diálogo cabe en el ancho disponible.
- Se comprobó que el explorador ANEW sigue abriendo y cerrando fichas con el cursor correcto.
- Idioma español/inglés y tema claro/oscuro revisados.

## Búsquedas y medidas

- La consulta de abejas devuelve seis coincidencias en seis contextos.
- Para a1, muestra 53/53, p = 1, sorpresa = 0 y entropía = 0.
- La comparación con a2 conserva su p = 38/53 y sus respuestas alternativas.
- Una respuesta ausente se presenta como «no observada».
- Las pruebas de funciones verificaron coincidencias con y sin tildes, preservación de ñ, métricas de una respuesta no dominante y medidas nulas para respuestas no observadas.
- La selección aleatoria produce los mismos IDs con los mismos candidatos y semilla, sin duplicados. Cambiar la semilla cambia la muestra.
- El límite de cuatro contextos del comparador se comprobó en la interfaz.

## Listas, persistencia y archivos

- Se añadió casa como respuesta alternativa de a2268, con p = 1/67. La exportación conserva esa probabilidad y no la confunde con el cierre máximo del contexto.
- Se generaron dos estímulos desde los filtros de Consultar y se guardó la semilla prueba-2026.
- Las listas permanecieron después de recargar. Se importó un respaldo como listas adicionales.
- Se descargaron CSV de palabra final y comparación, además de Excel y ZIP de una lista.
- El CSV de palabra final contiene sus seis coincidencias. El de comparación contiene las once respuestas observadas de a1 y a2; sus frecuencias y probabilidades suman los denominadores esperados.
- El ZIP conserva los tres estímulos en su orden, la probabilidad completa, el proyecto y la receta de construcción con los IDs elegidos.
- El Excel tiene tres filas de datos, XML legible y ninguna fórmula ejecutable.
- La importación valida el recurso y la estructura, conserva el historial y elimina duplicados de la misma pareja contexto/respuesta.

## Alcance

Los JavaScript modificados pasaron la comprobación de sintaxis y las pruebas de funciones. No se modifica el cálculo de la base que se validó en la primera versión. Los archivos de datos y los JSON de contenido se excluyen de esta actualización.

La revisión móvil utiliza vistas del navegador a esos anchos, no un teléfono físico. Este paquete no se ha publicado en GitHub: debe subirse al repositorio existente.

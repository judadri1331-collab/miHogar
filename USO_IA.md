# Uso de IA en el proyecto

Este documento describe como se uso inteligencia artificial como apoyo durante el desarrollo y documentacion de `misFinanzas`.

## Resumen

La IA se utilizo como herramienta de asistencia para estructurar, revisar y documentar el proyecto. La aplicacion no integra servicios de IA en tiempo real y no envia los datos financieros del usuario a modelos externos.

## Areas donde se uso IA

- Propuesta de organizacion modular del frontend.
- Separacion de responsabilidades entre modelos, servicios, renderers y utilidades.
- Apoyo en la definicion de validaciones de formularios.
- Revision de riesgos basicos de seguridad en entradas de usuario.
- Apoyo en la redaccion de documentacion tecnica.
- Sugerencias para mejorar claridad, mantenibilidad y experiencia de usuario.

## Uso en validaciones

El archivo `js/utils/validators.js` incluye una referencia explicita al apoyo de IA:

```js
// Validaciones reforzadas con apoyo de IA: se combinan reglas semanticas,
// regex y rechazo de patrones peligrosos antes de guardar en localStorage.
```

En esta parte, la IA ayudo a definir una estrategia de validacion antes de guardar datos en `localStorage`.

Las validaciones incluyen:

- Sanitizacion de texto.
- Rechazo de HTML o codigo ejecutable.
- Validacion de nombres y parentescos.
- Validacion de descripciones.
- Validacion de fechas reales en formato `YYYY-MM-DD`.
- Validacion de montos numericos.
- Restriccion de opciones permitidas en selectores.

## Decisiones apoyadas por IA

La IA apoyo decisiones como:

- Usar una arquitectura simple para una app estatica sin backend.
- Mantener los datos en `localStorage`.
- Separar entidades de dominio en `js/models/`.
- Separar logica de negocio y persistencia en `js/services/`.
- Separar renderizado de interfaz en `js/ui/`.
- Centralizar categorias, tipos de ingreso y metodos de pago en `js/utils/constants.js`.
- Escapar contenido ingresado por usuarios antes de insertarlo en HTML.

## Que no hace la IA en la aplicacion

La aplicacion no usa IA durante su ejecucion normal.

En particular:

- No llama a APIs de IA.
- No analiza automaticamente los gastos del usuario con modelos externos.
- No genera recomendaciones financieras personalizadas.
- No envia ingresos, egresos, integrantes ni presupuestos a servicios externos.
- No toma decisiones automaticas sobre el presupuesto familiar.

## Privacidad

Los datos ingresados por el usuario se guardan en el navegador mediante `localStorage`.

El uso de IA corresponde al proceso de desarrollo y documentacion, no al funcionamiento interno de la app en produccion.

## Control humano

Las sugerencias generadas con apoyo de IA deben ser revisadas por una persona antes de considerarse definitivas.

El desarrollador o equipo responsable mantiene el control sobre:

- La aceptacion del codigo.
- La revision funcional.
- La revision de seguridad.
- La documentacion final.
- Las decisiones de alcance del proyecto.

## Ejemplos de prompts utiles

Algunos ejemplos de solicitudes que podrian haberse usado como apoyo:

```text
Ayudame a estructurar una app web estatica de finanzas familiares con HTML, CSS y JavaScript.
```

```text
Propone validaciones seguras para formularios de ingresos y egresos guardados en localStorage.
```

```text
Revisa esta estructura de carpetas y sugiere una documentacion README clara para usuarios y desarrolladores.
```

```text
Ayudame a explicar de forma transparente como se uso IA durante el desarrollo del proyecto.
```

## Alcance recomendado

Este documento debe mantenerse actualizado si en el futuro se incorpora IA dentro de la aplicacion, por ejemplo para generar recomendaciones, clasificar gastos o analizar patrones financieros.

Si eso ocurre, se deberia documentar:

- Que proveedor o modelo se usa.
- Que datos se envian.
- Con que finalidad se procesan.
- Como se informa al usuario.
- Como se protege la privacidad de la informacion financiera.

# misFinanzas

Aplicacion web familiar para controlar ingresos, egresos y presupuestos mensuales en pesos chilenos (CLP).

El proyecto funciona como una app estatica en el navegador. No requiere backend, base de datos ni proceso de compilacion. Los datos se guardan localmente mediante `localStorage`.

## Caracteristicas

- Configuracion de integrantes familiares.
- Registro, edicion y eliminacion de ingresos.
- Registro, edicion y eliminacion de egresos.
- Filtros por mes, integrante, tipo de ingreso, categoria de egreso y metodo de pago.
- Presupuesto mensual por categoria.
- Alertas cuando una categoria alcanza o supera el 80% de su presupuesto.
- Dashboard con ingresos totales, egresos totales, balance y porcentaje de ahorro.
- Graficos de distribucion de egresos e ingresos vs egresos de los ultimos 6 meses.
- Top 5 de egresos mas altos del mes seleccionado.
- Interfaz responsive para escritorio y dispositivos moviles.

## Tecnologias usadas

- HTML5.
- CSS modular.
- JavaScript con ES Modules.
- `localStorage` para persistencia local.
- Chart.js para graficos.
- Font Awesome para iconos.
- Google Fonts para tipografias.

Las dependencias visuales se cargan desde CDN en `index.html`.

## Estructura del proyecto

```text
.
|-- assets/
|   `-- favicon.svg
|-- css/
|   |-- reset.css
|   |-- variables.css
|   |-- layout.css
|   |-- components.css
|   `-- responsive.css
|-- js/
|   |-- app.js
|   |-- models/
|   |-- services/
|   |-- ui/
|   `-- utils/
`-- index.html
```

## Carpetas principales

- `index.html`: contiene la estructura principal de la interfaz, tabs, modales y enlaces a estilos/scripts.
- `css/`: agrupa estilos base, variables, layout, componentes y reglas responsive.
- `js/app.js`: inicializa la aplicacion, conecta eventos y coordina servicios/renderers.
- `js/models/`: define las entidades `FamilyMember`, `Income`, `Expense` y `Budget`.
- `js/services/`: concentra la logica de almacenamiento, familia, finanzas, presupuestos y reportes.
- `js/ui/`: renderiza dashboard, formularios, tablas, tabs, alertas y graficos.
- `js/utils/`: contiene constantes, validadores, helpers y formateadores.
- `assets/`: contiene recursos estaticos del proyecto.

## Como ejecutar

### Opcion simple

Abrir `index.html` directamente en un navegador moderno.

### Opcion recomendada

Usar un servidor local estatico, por ejemplo la extension Live Server de Visual Studio Code.

Esto evita restricciones que algunos navegadores aplican al cargar modulos JavaScript desde archivos locales.

## Uso basico

1. Selecciona el mes que quieres revisar desde el selector superior.
2. Abre `Configurar Familia` y registra los integrantes del grupo familiar.
3. En la pestana `Ingresos`, agrega entradas como sueldo, honorarios, subsidios o extras.
4. En la pestana `Egresos`, registra gastos por categoria, subcategoria, integrante y metodo de pago.
5. En la pestana `Presupuesto`, define limites mensuales por categoria.
6. Revisa la pestana `Resumen` para consultar balance, porcentaje de ahorro, alertas, top de gastos y graficos.

## Persistencia y privacidad

La informacion se guarda en el navegador usando `localStorage` con las siguientes claves:

- `misFinanzas_members`
- `misFinanzas_incomes`
- `misFinanzas_expenses`
- `misFinanzas_budgets`

La app no envia datos a un servidor propio. Si se borra el almacenamiento del navegador, se usa otro navegador o se abre la app en otro dispositivo, los datos no estaran disponibles.

## Validaciones

Antes de guardar datos, la aplicacion valida:

- Textos obligatorios.
- Largo minimo y maximo de nombres, parentescos y descripciones.
- Fechas con formato ISO valido.
- Montos positivos para ingresos y egresos.
- Presupuestos mayores o iguales a cero.
- Valores permitidos en listas desplegables.
- Patrones peligrosos como HTML, atributos ejecutables o URLs `javascript:`.

Ademas, el renderizado de contenido ingresado por usuarios usa escape de HTML para reducir riesgos de inyeccion en la interfaz.

## Limitaciones actuales

- No tiene autenticacion de usuarios.
- No sincroniza informacion entre dispositivos.
- No tiene backend ni base de datos externa.
- No incluye exportacion o importacion de datos.
- No incluye pruebas automatizadas.
- Los movimientos recurrentes se registran como dato, pero no se generan automaticamente en meses futuros.

## Posibles mejoras

- Exportar e importar datos en CSV o JSON.
- Agregar respaldo manual de datos.
- Generar automaticamente ingresos y egresos recurrentes.
- Incorporar pruebas unitarias para servicios y validadores.
- Agregar modo de impresion o reporte mensual.
- Permitir multiples familias o perfiles.

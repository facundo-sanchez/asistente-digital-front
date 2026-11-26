# Spec funcional – Pagar una factura con la billetera

## Historia de usuario

**Yo como** usuario
**quiero** pagar una factura usando una billetera virtual que tenga configurada
**para** no tener que buscar el código de pago ni dónde se paga.

**Estado (26/11/2026):** hecho en `feature/pagar-billetera` (backend y front). Cambios al desarrollar: el link de pago va en el **servicio** (los proveedores del catálogo son de todos y no se editan), así que el botón dice "Pagar en {proveedor}" con el link del servicio; la billetera se guarda con `PUT /users/me/payment-wallet`; el front lee el servicio con `GET /services/{id}` en vez de sumar campos a la factura. El botón va solo en la factura, todavía no en Vencimientos.

## Alcance

- Elegir una billetera en el perfil.
- Cargar, opcionalmente, el link de pago de cada proveedor.
- Un botón **Pagar** en la factura que copia el código y abre el lugar donde se paga.

**Fuera de alcance:**
- Pagar desde la app.
- Enterarse solo de que la factura se pagó. Ni la billetera ni la empresa avisan, así que el pago se sigue registrando a mano.
- Abrir la billetera con el código ya cargado: ninguna billetera publica una forma de hacerlo.

## Reglas

| Id | Regla |
|---|---|
| RP-1 | Las billeteras disponibles son una lista fija que mantiene la app (nombre y link): Mercado Pago, MODO, Cuenta DNI. Sumar una billetera es un cambio de código, no de datos del usuario. |
| RP-2 | El usuario tiene como máximo una billetera elegida. Por defecto, ninguna. |
| RP-3 | El link de pago del proveedor es opcional. Si se carga, tiene que ser `https://`. |
| RP-4 | A dónde lleva el botón: al link del proveedor si existe; si no, a la billetera del usuario; si no hay ninguno de los dos, el botón no aparece. |
| RP-5 | El botón aparece solo si la factura tiene código de pago y todavía no está pagada. |
| RP-6 | Al tocarlo copia el código al portapapeles y abre el destino en una pestaña nueva. Si no se puede copiar, el destino se abre igual y la app avisa que hay que copiar el código a mano. |

## Flujos

### 1. Elegir la billetera (una vez)
1. Perfil → sección **Pagos** → selector "Billetera para pagar facturas", con "Ninguna" y la lista de RP-1.
2. Al guardar, la app muestra "Listo, vas a pagar con Mercado Pago".

### 2. Link de pago del proveedor (opcional)
1. Al crear o editar un proveedor, el campo **Link de pago** tiene la ayuda "La página donde pagás sus facturas".
2. Si el link no es `https://`, la app muestra el error "Ingresá un link que empiece con https://".

### 3. Pagar una factura
1. En el detalle de la factura, al lado de **Código de pago** (que sigue con su botón "Copiar"), aparece el botón:
   - **"Pagar en Camuzzi"**, si el proveedor tiene link;
   - **"Pagar con Mercado Pago"**, si no tiene y el usuario eligió billetera.
2. Al tocarlo:
   - copia el código;
   - abre el destino en una pestaña nueva;
   - muestra "Código copiado. Pegalo en Mercado Pago y, cuando pagues, registrá el pago acá."
3. El usuario paga fuera de la app, vuelve y toca **Registrar pago**, como hoy.

### 4. Sin billetera ni link
Debajo del código aparece "Elegí tu billetera en el perfil para pagar desde acá", con un link al perfil.

## Datos

- **Usuario:** `paymentWallet` (`MERCADO_PAGO`, `MODO`, `CUENTA_DNI` o vacío).
- **Proveedor:** `paymentUrl`, texto opcional de hasta 500 caracteres.
- **Lista de billeteras (front):** código, nombre y link, en `lib/wallets.ts`.

## API

| Método | Ruta | Cambio |
|---|---|---|
| GET/PUT | `/users/me` | Suma `paymentWallet`; si el valor no es una billetera válida, responde 400. |
| GET/POST/PUT | `/providers` | Suma `paymentUrl`; si no es `https://`, responde 400. |
| GET | `/invoices/{id}` | Suma `providerPaymentUrl` y `providerName`, para no hacer otra llamada. |

## Criterios de aceptación

1. Con Mercado Pago elegido y una factura de Camuzzi pendiente sin link: el botón dice "Pagar con Mercado Pago", copia el código y abre Mercado Pago.
2. Si se le carga el link a Camuzzi, la misma factura muestra "Pagar en Camuzzi" y abre esa página.
3. En una factura pagada o sin código de pago, el botón no aparece.
4. Sin billetera ni link aparece el aviso que lleva al perfil.
5. Un link de proveedor `http://` o `javascript:` se rechaza en el front y en el backend.
6. Un usuario no ve ni cambia la billetera de otro.

## Preguntas abiertas

- ¿Mostrar el botón también en **Vencimientos** (obligaciones con código de pago), además de en la factura?
- Los links de las billeteras hay que confirmarlos al desarrollar: pueden cambiar.

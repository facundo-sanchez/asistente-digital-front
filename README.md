This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Faltantes

Validacion de email al registrarse

Configuracion de usuario

Exportacion de Excel


## Mi Balance


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

docker build --build-arg API_BACKEND=http://192.168.1.6:8080/mi-balance/api/v1 --build-arg NEXT_PUBLIC_BASE_PATH=/mi-balance -t nextjs-app .\

docker run -d -p 3000:3000 --add-host=host.docker.internal:host-gateway --name nextjs-container nextjs-app
docker run -d --rm -p 8080:8080 --add-host=host.docker.internal:host-gateway quarkus/ecommerce-jvm
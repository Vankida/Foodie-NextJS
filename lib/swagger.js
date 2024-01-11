import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDoc = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next.js API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
  });

  return spec;
};

// import { withSwagger } from "next-swagger-doc";

// const swaggerHandler = withSwagger({
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "NextJS Swagger",
//       version: "0.1.0",
//     },
//   },
//   apiFolder: "app/api",
// });
// export default swaggerHandler();

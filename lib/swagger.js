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
          Bearer: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Please enter token",
          },
        },
      },
      security: [
        {
          Bearer: [], // This associates the Bearer token security scheme with all paths
        },
      ],
    },
  });

  return spec;
};

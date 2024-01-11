"use client";

// import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import SwaggerUI from "swagger-ui-react";

// const SwaggerUI = dynamic < {} > (import("swagger-ui-react"), { ssr: false });

function ReactSwagger({ spec }) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;

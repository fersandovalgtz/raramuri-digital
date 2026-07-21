import openApiSpec from "../../../public/downloads/openapi-lexico.json";

export async function GET() {
  return Response.json(openApiSpec, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

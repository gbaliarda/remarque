import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic<{
  spec: any;
//@ts-ignore
}>(import('swagger-ui-react'), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Remarque API',
        version: '1.0',
      },
      components: {
        securitySchemes: {
          basicAuth: {
            type: "http",
            scheme: "basic"
          }
        },
        schemas: {
          ObjectId: {
            type: "string"
          },
          User: {
            type: "object",
            properties: {
              _id: {
                $ref: "#/components/schemas/ObjectId"
              },
              email: {
                type: "string"
              },
              notes: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ObjectId"
                }
              }
            }
          },
          Note: {
            type: "object",
            properties: {
              _id: {
                $ref: "#/components/schemas/ObjectId"
              },
              owner: {
                type: "string"
              },
              title: {
                type: "string"
              },
              content: {
                type: "array",
                items: {
                  type: "string"
                } 
              },
              isPublic: {
                type: "boolean"
              },
              lastModified: {
                type: "string",
                format: "date"
              }
            }
          }
        }
      }
    }
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
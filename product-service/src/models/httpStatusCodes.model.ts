export enum HttpStatusCodes {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    FORBIDDEN = 403,
    UNAUTHORIZED = 401,
}

export const productBodyRequestSchema = {
    type: 'object',
    required: ['body'],
    properties: {
      body: {
        type: 'object',
        required: ['title', 'description', 'count', 'price'],
        properties: {
                  description: { type: 'string' },
                  price: { type: 'integer' },
                  title: { type: 'string' },
                  count: { type: 'integer' },
          // schema options https://ajv.js.org/json-schema.html#json-data-type
              },
      },
    }
  }
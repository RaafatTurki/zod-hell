import express, { NextFunction, Request, Response } from 'express'
import { ZodSchema, object, string } from 'zod'

const app = express()

const authSchemaObj = {
  cookies: {
    JWT: string()
  }
}

const schemaObj = {
  body: {
    email: string().email(),
  },
  query: {
    id: string().uuid(),
  },
}


function createExpressReqFromZodSchemaObj(zodSchemaObj): any {
  // TODO: implement me
}


class TestReq extends createExpressReqFromZodSchemaObj(schemaObj) {}
class TestAuthReq extends createExpressReqFromZodSchemaObj(authSchemaObj) {}

function validatorMiddleware(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const vdata = schema.parse(req)

    req.body = vdata.body
    req.query = vdata.query
    req.params = vdata.params
    req.cookies = vdata.cookies
    
    next()
  }
}

function authMiddleware(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    TestAuthReq.schema.parse(req)
    // imagine jwt validation logig that accesses req.cookies here
    next()
  }
}


app.post('/', validatorMiddleware(TestReq.schema), authMiddleware([ "SUPERADMIN" ]), (req: TestReq, res: Response) => { 
  // NOTE: req must have type safe body, query, params and cookies
})

app.listen(4000, () => { console.log(`listening on ${4000}`) })

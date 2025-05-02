import express from 'express';
const router = express.Router();
import * as protoLoader from '@grpc/proto-loader';
import * as grpc from '@grpc/grpc-js';
import { getDirname } from '@./utils';

const __dirname = getDirname(import.meta.url);
const PROTO_PATH = __dirname + 'packages/protos/auth.proto';

router.get('/hello', (req, res) => {
  res.send({ message: 'Hello API this is auth' });
});

export const authRouter = router;

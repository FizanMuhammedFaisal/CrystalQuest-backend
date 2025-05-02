import express from 'express';
const router = express.Router();

router.get('/hello', (req, res) => {
  res.send({ message: 'Hello API thisis dahsboard' });
});
export const dashboardRouter = router;

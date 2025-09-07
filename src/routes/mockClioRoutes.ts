import { Router, Request, Response } from 'express';
const router = Router();

router.post('/log', (req: Request, res: Response) => {
  console.log('Logged billable:', req.body);
  res.json({ success: true });
});

export default router;

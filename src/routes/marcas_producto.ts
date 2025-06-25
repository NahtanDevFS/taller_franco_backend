import { Router } from 'express';
import { supabase } from '../libs/supabaseClient';
const router = Router();

router.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('marca_producto').select('*')
  if (error) {
    // Send the response, then return to stop further execution.
    res.status(500).json({ error });
    return;
  }
  res.json(data);
});

export default router;
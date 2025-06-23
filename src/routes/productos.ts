import { Router } from 'express';
import { supabase } from '../libs/supabaseClient';
const router = Router();

router.get('/', async (req, res) => {
  const name = String(req.query.name || '');    // captura término o cadena vacía (el filtro se omite si la cadena está vacía)
  const category = String(req.query.category || '')
  const code = String(req.query.code || '')
  const { data, error } = await supabase.from('producto').select('*')
  if (error) {
    // Send the response, then return to stop further execution.
    res.status(500).json({ error });
    return;
  }
  res.json(data);
});

export default router;
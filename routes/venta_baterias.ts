import { Router } from 'express';
import { supabase } from '../libs/supabaseClient';
const router = Router();

router.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('venta_bateria').select('*')
  if (error) {
    // Send the response, then return to stop further execution.
    res.status(500).json({ error });
    return;
  }
  res.json(data);
});

// Obtener un producto por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('venta_bateria')
    .select('*')
    .eq('id_venta_bateria', id)
    .single(); // .single() devuelve un objeto en lugar de un array y da error si no se encuentra

  if (error) {
    console.error(`Error al obtener batería con id ${id}:`, error);
    // El código de error 'PGRST116' de Supabase/PostgREST significa que no se encontraron filas
    if (error.code === 'PGRST116') {
      res.status(404).json({ error: `Batería con id ${id} no encontrado.` });
      return;
    }
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  const {
    codigo_bateria,
    id_producto,
    fecha_venta,
    garantia,
    comprador,
  } = req.body;

  const { data, error } = await supabase
    .from('venta_bateria')
    .insert([{
      codigo_bateria,
      id_producto,
      fecha_venta,
      garantia,
      comprador,
    }])
    .select()
    .single(); // Para obtener el objeto recién creado

  if (error) {
    console.error('Error al crear la venta de batería:', error);
    // El código '23505' de PostgreSQL es por violación de unicidad (ej. codigo_bateria duplicado)
    if (error.code === '23505') {
        res.status(409).json({ error: 'El código de batería ya existe.' });
        return;
    }
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
});

// Actualizar una venta de batería por su ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('venta_bateria')
    .update(req.body)
    .eq('id_venta_bateria', id)
    .select()
    .single();

  if (error) {
    console.error(`Error al actualizar la venta de batería con id ${id}:`, error);
    if (error.code === 'PGRST116') {
      res.status(404).json({ error: `Venta de batería con id ${id} no encontrado.` });
      return;
    }
    res.status(500).json({ error: error.message });
    return 
  }

  res.json(data);
});

// Eliminar una venta de batería por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error, count } = await supabase.from('venta_bateria').delete({ count: 'exact' }).eq('id_venta_bateria', id);

  if (error) {
    console.error(`Error al eliminar venta de batería con id ${id}:`, error);
    res.status(500).json({ error: error.message });
    return;
  }

  if (count === 0) {
    res.status(404).json({ error: `Venta de batería con id ${id} no encontrado.` });
    return 
  }

  // 204 No Content es la respuesta estándar para una eliminación exitosa
  res.status(204).send();
});

export default router;
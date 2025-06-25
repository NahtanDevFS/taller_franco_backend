import { Router } from 'express';
import { supabase } from '../libs/supabaseClient';
const router = Router();

// Obtener todos los productos
router.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('producto').select('*')
  if (error) {
    // Send the response, then return to stop further execution.
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

// Obtener un producto por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('producto')
    .select('*')
    .eq('id_producto', id)
    .single(); // .single() devuelve un objeto en lugar de un array y da error si no se encuentra

  if (error) {
    console.error(`Error al obtener producto con id ${id}:`, error);
    // El código de error 'PGRST116' de Supabase/PostgREST significa que no se encontraron filas
    if (error.code === 'PGRST116') {
      res.status(404).json({ error: `Producto con id ${id} no encontrado.` });
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
    id_marca_producto,
    codigo_producto,
    nombre_producto,
    descripcion_producto,
    id_categoria_producto,
    stock_producto,
    stock_minimo_producto,
    precio_producto,
    foto1_producto,
    foto2_producto,
  } = req.body;

  const { data, error } = await supabase
    .from('producto')
    .insert([{
      id_marca_producto,
      codigo_producto,
      nombre_producto,
      descripcion_producto,
      id_categoria_producto,
      stock_producto,
      stock_minimo_producto,
      precio_producto,
      foto1_producto,
      foto2_producto,
    }])
    .select()
    .single(); // Para obtener el objeto recién creado

  if (error) {
    console.error('Error al crear el producto:', error);
    // El código '23505' de PostgreSQL es por violación de unicidad (ej. codigo_producto duplicado)
    if (error.code === '23505') {
        res.status(409).json({ error: 'El código de producto ya existe.' });
        return;
    }
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
});

// Actualizar un producto por su ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('producto')
    .update(req.body)
    .eq('id_producto', id)
    .select()
    .single();

  if (error) {
    console.error(`Error al actualizar producto con id ${id}:`, error);
    if (error.code === 'PGRST116') {
      res.status(404).json({ error: `Producto con id ${id} no encontrado.` });
      return;
    }
    res.status(500).json({ error: error.message });
    return 
  }

  res.json(data);
});

// Eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error, count } = await supabase.from('producto').delete({ count: 'exact' }).eq('id_producto', id);

  if (error) {
    console.error(`Error al eliminar producto con id ${id}:`, error);
    res.status(500).json({ error: error.message });
    return;
  }

  if (count === 0) {
    res.status(404).json({ error: `Producto con id ${id} no encontrado.` });
    return 
  }

  // 204 No Content es la respuesta estándar para una eliminación exitosa
  res.status(204).send();
});

export default router;
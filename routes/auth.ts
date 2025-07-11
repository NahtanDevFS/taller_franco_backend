import { Router, Request, Response } from 'express';
import { supabase } from '../libs/supabaseClient';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email y contraseña requeridos.' });
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        details: error?.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      }
    });

  } catch (e) {
    const err = e as Error;
    res.status(500).json({
      success: false,
      message: 'Error inesperado en el servidor.',
      details: err.message
    });
  }
});

export default router;
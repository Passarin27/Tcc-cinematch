const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* =========================
   AUTH MIDDLEWARE (JWT)
========================= */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

/* =========================
   REGISTER
========================= */
const register = async (req, res) => {
  let { nome, email, senha, preferences } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Dados obrigatórios' });
  }

  if (!Array.isArray(preferences)) {
    preferences = [];
  }

  try {
    email = email.toLowerCase().trim();
    const senhaHash = await bcrypt.hash(senha, 10);

    /* ===== CRIA USUÁRIO ===== */
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .insert([{
        nome,
        email,
        senha: senhaHash,
        preferences
      }])
      .select('id, nome, email, preferences')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    /* ===== CRIA LISTAS PADRÃO ===== */
    const listasPadrao = [
      { nome: 'Assistir depois', usuario_id: usuario.id },
      { nome: 'Já assistidos', usuario_id: usuario.id }
    ];

    const { error: erroListas } = await supabase
      .from('listas')
      .insert(listasPadrao);

    if (erroListas) {
      console.error('Erro ao criar listas padrão:', erroListas.message);
    }

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: usuario
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   LOGIN
========================= */
const login = async (req, res) => {
  let { email, senha } = req.body;

  try {
    email = email.toLowerCase().trim();

    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, email, senha')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   EXPORTS
========================= */
module.exports = {
  authMiddleware,
  register,
  login
};

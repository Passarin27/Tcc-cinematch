const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../controllers/auth.controller');

const MAPA_GENEROS_TMDB = require('../utils/generosTMDB');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('❌ TMDB_API_KEY não definida nas variáveis de ambiente');
}

/* =========================
   HOME / RECOMENDAÇÕES
========================= */
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: 'Configuração inválida do servidor' });
    }

    const userId = req.user.id;

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('preferences')
      .eq('id', userId)
      .single();

    if (error || !usuario || !Array.isArray(usuario.preferences) || !usuario.preferences.length) {
      return res.json([]);
    }

    const normalizarGenero = (g) =>
      g
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '_');

    const generosIds = usuario.preferences
      .map(g => MAPA_GENEROS_TMDB[normalizarGenero(g)])
      .filter(Boolean);

    console.log('Preferences:', usuario.preferences);
    console.log('IDs TMDB:', generosIds);

    if (!generosIds.length) {
      return res.json([]);
    }

    const generos = generosIds.join(',');
    const page = req.query.page || 1;

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=${generos}&page=${page}`;

    console.log('TMDB URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Erro TMDB:', response.status);
      return res.json([]);
    }

    const dados = await response.json();

    return res.json(dados.results || []);

  } catch (err) {
    console.error('❌ Erro recomendações:', err);
    return res.status(500).json({ error: 'Erro ao gerar recomendações' });
  }
});

module.exports = router;


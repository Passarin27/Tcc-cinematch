const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authMiddleware } = require('../controllers/auth.controller');

// criar lista
router.post('/', authMiddleware, async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: 'Nome da lista é obrigatório' });
  }

  const { data, error } = await supabase
    .from('listas')
    .insert([{
      nome,
      usuario_id: req.user.id
    }])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

// listar listas do usuário
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('listas')
    .select('*')
    .eq('usuario_id', req.user.id)
    .order('criado_em', { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// adicionar filme a uma lista
router.post('/:listaId/filmes', authMiddleware, async (req, res) => {
  const { listaId } = req.params;
  const { filme_id } = req.body;

  if (!filme_id) {
    return res.status(400).json({ error: 'filme_id é obrigatório' });
  }

  const { data, error } = await supabase
    .from('lista_filmes')
    .upsert(
      [{
        lista_id: listaId,
        filme_id
      }],
      { onConflict: 'lista_id,filme_id' }
    )
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

// listar filmes de uma lista (CORRIGIDO RLS)
router.get('/:listaId/filmes', authMiddleware, async (req, res) => {
  const { listaId } = req.params;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('lista_filmes')
    .select(`
      filmes_salvos (
        id,
        tmdb_id,
        titulo,
        poster
      ),
      listas!inner (
        usuario_id
      )
    `)
    .eq('lista_id', listaId)
    .eq('listas.usuario_id', userId);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const filmes = data.map(item => item.filmes_salvos);
  res.json(filmes);
});

// remover lista
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('listas')
    .delete()
    .eq('id', id)
    .eq('usuario_id', req.user.id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(204).send();
});

// remover filme de uma lista
router.delete('/:listaId/filmes/:filmeId', authMiddleware, async (req, res) => {
  const { listaId, filmeId } = req.params;

  const { error } = await supabase
    .from('lista_filmes')
    .delete()
    .eq('lista_id', listaId)
    .eq('filme_id', filmeId);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(204).send();
});

module.exports = router;

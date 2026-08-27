
// ============================================================
// LA GRANDE ROUTE — src/content/act2/items.js
// Deux objets de l'Acte II (effets déclaratifs).
// ============================================================
registerItem('hydromel_ostenval', {
  act: 'act2', img: 'v_mead', n: 'w.item.hydromel_ostenval.name', em: '🍺',
  cls: 'mercenaire', p: 60, tox: 10, d: 'w.item.hydromel_ostenval.desc',
  effect: { heal: 25, focus: 2, log: 'w.itemlog.hydromel_ostenval.drink' }
});
registerItem('charme_lichen', {
  act: 'act2', img: 'v_glyph', n: 'w.item.charme_lichen.name', em: '🧿',
  cls: 'tisseuse', p: 70, tox: 0, d: 'w.item.charme_lichen.desc',
  effect: { shield: 12, evade: 3, log: 'w.itemlog.charme_lichen.use' }
});

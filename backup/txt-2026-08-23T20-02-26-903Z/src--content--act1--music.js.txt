// Musiques de l'Acte I — le mood sert de fallback si le fichier manque.
GameData.music = GameData.music || {};
GameData.music.base = Object.assign({}, GameData.music.base, {
  map:    { file: 'assets/music/act1_map.mp3',    mood: 'map' },
  village:{ file: 'assets/music/act1_village.mp3',mood: 'village' },
  combat: { file: 'assets/music/act1_combat.mp3', mood: 'combat' },
  boss:   { file: 'assets/music/act1_boss.mp3',   mood: 'boss' }
});
// ============================================================
// LA GRANDE ROUTE — src/content/act2/bestiary.js
// Bestiaire Acte II : 3 chemins + 3 boss + soldates + trophées.
// path: 'montagne' | 'foret' | 'route'.
// Flags mécaniques : resist / summon / regen (câblés dans combat.js).
// ============================================================

registerCategory('insectoide', { act: 'act2', nameKey: 'w.cat.insectoide' });
registerCategory('vestige', { act: 'act2', nameKey: 'w.cat.vestige' });
registerCategory('vegetal', { act: 'act2', nameKey: 'w.cat.vegetal' });

// ---------------- ROUTE (peste) ----------------
registerMonster('matin_barbon', { act:'act2', path:'route', n:'w.foe.matin_barbon.name', em:'🐕', pv:[26,34], atq:[6,10], cat:'bete', faib:'embrasement', txt:'w.foe.matin_barbon.txt', ints:[
{ n:'w.foe.matin_barbon.i0n', em:'🦷', d:[6,9] },
{ n:'w.foe.matin_barbon.i1n', em:'🐾', d:[4,7], fx:'peur' },
{ n:'w.foe.matin_barbon.i2n', em:'💢', d:[8,12] } ]});
registerMonster('piqueur', { act:'act2', path:'route', n:'w.foe.piqueur.name', em:'🏹', pv:[30,38], atq:[7,11], cat:'humain', faib:'murmure', txt:'w.foe.piqueur.txt', ints:[
{ n:'w.foe.piqueur.i0n', em:'🎯', d:[7,10] },
{ n:'w.foe.piqueur.i1n', em:'🪤', d:[0,0], fx:'sonne' },
{ n:'w.foe.piqueur.i2n', em:'⚔️', d:[6,9] } ]});
registerMonster('corrompu', { act:'act2', path:'route', n:'w.foe.corrompu.name', em:'🧟', pv:[24,30], atq:[5,9], cat:'mort', faib:'sceau', txt:'w.foe.corrompu.txt', ints:[
{ n:'w.foe.corrompu.i0n', em:'🤮', d:[4,7], fx:'poison' },
{ n:'w.foe.corrompu.i1n', em:'🦷', d:[5,8] },
{ n:'w.foe.corrompu.i2n', em:'😱', d:[4,7], fx:'peur' } ]});
registerMonster('flagellant', { act:'act2', path:'route', n:'w.foe.flagellant.name', em:'🕯️', pv:[26,32], atq:[6,9], cat:'humain', faib:'sceau', txt:'w.foe.flagellant.txt', ints:[
{ n:'w.foe.flagellant.i0n', em:'🩸', d:[6,9] },
{ n:'w.foe.flagellant.i1n', em:'📿', d:[0,0], fx:'peur' },
{ n:'w.foe.flagellant.i2n', em:'🔥', d:[7,10] } ]});
registerMonster('pestifere_rampant', { act:'act2', path:'route', n:'w.foe.pestifere_rampant.name', em:'☠️', pv:[24,30], atq:[5,9], cat:'mort', faib:'sceau', txt:'w.foe.pestifere_rampant.txt', ints:[
{ n:'w.foe.pestifere_rampant.i0n', em:'🖐️', d:[4,7], fx:'poison' },
{ n:'w.foe.pestifere_rampant.i1n', em:'🤮', d:[5,8], fx:'poison' },
{ n:'w.foe.pestifere_rampant.i2n', em:'💀', d:[6,9] } ]});

// ---------------- MONTAGNE ----------------
registerMonster('graw_eboulis', { act:'act2', path:'montagne', n:'w.foe.graw_eboulis.name', em:'👹', pv:[36,44], atq:[9,13], cat:'ogroide', faib:'souffle', txt:'w.foe.graw_eboulis.txt', ints:[
{ n:'w.foe.graw_eboulis.i0n', em:'🪨', d:[9,12] },
{ n:'w.foe.graw_eboulis.i1n', em:'💢', d:[7,10], fx:'sonne' },
{ n:'w.foe.graw_eboulis.i2n', em:'🗻', d:[11,14] } ]});
registerMonster('revenant_apic', { act:'act2', path:'montagne', n:'w.foe.revenant_apic.name', em:'🧊', pv:[30,36], atq:[7,11], cat:'mort', faib:'embrasement', txt:'w.foe.revenant_apic.txt', ints:[
{ n:'w.foe.revenant_apic.i0n', em:'🧊', d:[7,10] },
{ n:'w.foe.revenant_apic.i1n', em:'🌫️', d:[0,0], fx:'brume' },
{ n:'w.foe.revenant_apic.i2n', em:'😱', d:[6,9], fx:'peur' } ]});
registerMonster('vautour_charnier', { act:'act2', path:'montagne', n:'w.foe.vautour_charnier.name', em:'🦅', pv:[24,30], atq:[6,9], cat:'bete', faib:'murmure', vole:true, txt:'w.foe.vautour_charnier.txt', ints:[
{ n:'w.foe.vautour_charnier.i0n', em:'🦅', d:[6,9] },
{ n:'w.foe.vautour_charnier.i1n', em:'😱', d:[0,0], fx:'peur' },
{ n:'w.foe.vautour_charnier.i2n', em:'🦴', d:[8,11] } ]});

// ---------------- FORÊT MAUDITE ----------------
registerMonster('scolopendre_geante', { act:'act2', path:'foret', n:'w.foe.scolopendre_geante.name', em:'🐛', pv:[28,34], atq:[6,10], cat:'insectoide', faib:'embrasement', txt:'w.foe.scolopendre_geante.txt', ints:[
{ n:'w.foe.scolopendre_geante.i0n', em:'🦷', d:[6,9] },
{ n:'w.foe.scolopendre_geante.i1n', em:'🤮', d:[5,8], fx:'poison' },
{ n:'w.foe.scolopendre_geante.i2n', em:'🌀', d:[7,10], fx:'peur' } ]});
registerMonster('sanglier_ecorce', { act:'act2', path:'foret', n:'w.foe.sanglier_ecorce.name', em:'🐗', pv:[32,40], atq:[8,12], cat:'bete', faib:'souffle', txt:'w.foe.sanglier_ecorce.txt', ints:[
{ n:'w.foe.sanglier_ecorce.i0n', em:'🐗', d:[8,11] },
{ n:'w.foe.sanglier_ecorce.i1n', em:'💢', d:[6,9] },
{ n:'w.foe.sanglier_ecorce.i2n', em:'🌪', d:[7,10], fx:'sonne' } ]});
registerMonster('vestige_ypsenie', { act:'act2', path:'foret', n:'w.foe.vestige_ypsenie.name', em:'🗿', pv:[34,40], atq:[7,11], cat:'vestige', faib:'murmure', txt:'w.foe.vestige_ypsenie.txt', ints:[
{ n:'w.foe.vestige_ypsenie.i0n', em:'⚡', d:[7,10] },
{ n:'w.foe.vestige_ypsenie.i1n', em:'🌫️', d:[0,0], fx:'brume' },
{ n:'w.foe.vestige_ypsenie.i2n', em:'🪨', d:[9,12] } ]});
registerMonster('ronce_etrangleuse', { act:'act2', path:'foret', n:'w.foe.ronce_etrangleuse.name', em:'🌿', pv:[26,32], atq:[6,9], cat:'vegetal', faib:'embrasement', txt:'w.foe.ronce_etrangleuse.txt', ints:[
{ n:'w.foe.ronce_etrangleuse.i0n', em:'🌿', d:[5,8], fx:'poison' },
{ n:'w.foe.ronce_etrangleuse.i1n', em:'🪢', d:[6,9] },
{ n:'w.foe.ronce_etrangleuse.i2n', em:'🩸', d:[7,10] } ]});
registerMonster('soldate_myrrubra', { act:'act2', path:'foret', n:'w.foe.soldate_myrrubra.name', em:'🐜', pv:[18,24], atq:[5,8], cat:'insectoide', faib:'embrasement', txt:'w.foe.soldate_myrrubra.txt', ints:[
{ n:'w.foe.soldate_myrrubra.i0n', em:'🦷', d:[5,8] },
{ n:'w.foe.soldate_myrrubra.i1n', em:'🤮', d:[4,6], fx:'poison' },
{ n:'w.foe.soldate_myrrubra.i2n', em:'🐜', d:[6,9] } ]});

// ---------------- BOSS : MONTAGNE (resist) ----------------
registerMonster('troll_de_pierre', { act:'act2', path:'montagne', n:'w.foe.troll_de_pierre.name', em:'🗿', pv:[150,150], atq:[11,16], cat:'ogroide', faib:'souffle', resist:3, txt:'w.foe.troll_de_pierre.txt', epic:true, trophy:'troll_coeur', special:{ fx:'swoop', n:'w.foe.troll_de_pierre.sp', em:'🌳' }, ints:[
{ n:'w.foe.troll_de_pierre.i0n', em:'🌳', d:[11,15], fx:'sonne' },
{ n:'w.foe.troll_de_pierre.i1n', em:'🪨', d:[9,13] },
{ n:'w.foe.troll_de_pierre.i2n', em:'💥', d:[12,16], fx:'sonne' } ]});

// ---------------- BOSS : FORÊT (summon) ----------------
registerMonster('reine_myrrubra', { act:'act2', path:'foret', n:'w.foe.reine_myrrubra.name', em:'🕷️', pv:[120,120], atq:[9,14], cat:'insectoide', faib:'embrasement', summon:'soldate_myrrubra', txt:'w.foe.reine_myrrubra.txt', epic:true, trophy:'myrrubra_soie', special:{ fx:'rally', n:'w.foe.reine_myrrubra.sp', em:'🕸️' }, ints:[
{ n:'w.foe.reine_myrrubra.i0n', em:'🦷', d:[9,13] },
{ n:'w.foe.reine_myrrubra.i1n', em:'🤮', d:[7,10], fx:'poison' },
{ n:'w.foe.reine_myrrubra.i2n', em:'🕸️', d:[0,0], fx:'sonne' } ]});

// ---------------- BOSS : ROUTE (regen) ----------------
registerMonster('corrupteur', { act:'act2', path:'route', n:'w.foe.corrupteur.name', em:'☠️', pv:[130,130], atq:[9,14], cat:'mort', faib:'sceau', regen:5, txt:'w.foe.corrupteur.txt', epic:true, trophy:'encensoir_corrupteur', special:{ fx:'devour', n:'w.foe.corrupteur.sp', em:'🥀' }, ints:[
{ n:'w.foe.corrupteur.i0n', em:'🖐️', d:[8,12], fx:'poison' },
{ n:'w.foe.corrupteur.i1n', em:'📿', d:[0,0], fx:'peur' },
{ n:'w.foe.corrupteur.i2n', em:'☠️', d:[10,14] } ]});

// ---------------- TROPHÉES ----------------
registerTrophy('troll_coeur', { act:'act2', n:'w.trophy.troll_coeur.name', desc:'w.trophy.troll_coeur.desc', voice:'w.trophy.troll_coeur.voice', img:'v_rune', bonus:{ armorStart:2 } });
registerTrophy('myrrubra_soie', { act:'act2', n:'w.trophy.myrrubra_soie.name', desc:'w.trophy.myrrubra_soie.desc', voice:'w.trophy.myrrubra_soie.voice', img:'v_rune', bonus:{ esqFlat:2 } });
registerTrophy('encensoir_corrupteur', { act:'act2', n:'w.trophy.encensoir_corrupteur.name', desc:'w.trophy.encensoir_corrupteur.desc', voice:'w.trophy.encensoir_corrupteur.voice', img:'v_rune', bonus:{ dmgCat:{ mort:1.15 } } });

// ---------------- AJOUT REWORK ----------------
registerMonster('vouivre_des_cimes', { act:'act2', path:'montagne', n:'w.foe.vouivre_des_cimes.name', em:'🐉', pv:[30,38], atq:[7,11], cat:'draconide', faib:'souffle', vole:true, txt:'w.foe.vouivre_des_cimes.txt', ints:[
{ n:'w.foe.vouivre_des_cimes.i0n', em:'🦅', d:[7,10] },
{ n:'w.foe.vouivre_des_cimes.i1n', em:'🔥', d:[6,9], fx:'burn' },
{ n:'w.foe.vouivre_des_cimes.i2n', em:'🌀', d:[8,12], fx:'sonne' } ]});
registerMonster('frelon_ambre', { act:'act2', path:'foret', n:'w.foe.frelon_ambre.name', em:'🐝', pv:[24,30], atq:[6,9], cat:'insectoide', faib:'embrasement', vole:true, txt:'w.foe.frelon_ambre.txt', ints:[
{ n:'w.foe.frelon_ambre.i0n', em:'🦷', d:[6,9] },
{ n:'w.foe.frelon_ambre.i1n', em:'🤮', d:[5,8], fx:'poison' },
{ n:'w.foe.frelon_ambre.i2n', em:'🦅', d:[7,10] } ]});
registerMonster('penitent_cendreux', { act:'act2', path:'route', n:'w.foe.penitent_cendreux.name', em:'🕯️', pv:[28,34], atq:[6,10], cat:'mort', faib:'sceau', txt:'w.foe.penitent_cendreux.txt', ints:[
{ n:'w.foe.penitent_cendreux.i0n', em:'🖐️', d:[6,9], fx:'poison' },
{ n:'w.foe.penitent_cendreux.i1n', em:'📿', d:[0,0], fx:'peur' },
{ n:'w.foe.penitent_cendreux.i2n', em:'☠️', d:[7,11] } ]});
registerMonster('bourreau_dostenval', { act:'act2', n:'w.foe.bourreau_dostenval.name', em:'🪓', pv:[80,90], atq:[10,14], cat:'humain', faib:null, epic:true, trophy:'bourreau_cagoule', special:{ fx:'rally', n:'w.foe.bourreau_dostenval.sp', em:'🪓' }, txt:'w.foe.bourreau_dostenval.txt', ints:[
{ n:'w.foe.bourreau_dostenval.i0n', em:'🪓', d:[10,14] },
{ n:'w.foe.bourreau_dostenval.i1n', em:'⛓️', d:[8,11], fx:'slow' },
{ n:'w.foe.bourreau_dostenval.i2n', em:'🩸', d:[12,16] } ]});
registerTrophy('bourreau_cagoule', { act:'act2', n:'w.trophy.bourreau_cagoule.name', desc:'w.trophy.bourreau_cagoule.desc', voice:'w.trophy.bourreau_cagoule.voice', img:'v_rune', bonus:{ esqFlat:1, dmgCat:{ humain:1.15 } } });

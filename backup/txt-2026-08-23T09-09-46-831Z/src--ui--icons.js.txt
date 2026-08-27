/* atlas gravé v4 + loup-sceau. Monochrome (currentColor). decorate() grave tout émoji répertorié. */
const ICONS={
  dot:'<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
  battle:'<path d="M6.5 18.5L17.5 5.5M17.5 18.5L6.5 5.5"/><path d="M6 16l2.4 1.6M18 16l-2.4 1.6" stroke-width="2.2"/><circle cx="6.5" cy="18.7" r="1.1" fill="currentColor" stroke="none"/><circle cx="17.5" cy="18.7" r="1.1" fill="currentColor" stroke="none"/><ellipse cx="12" cy="20.6" rx="6" ry="1.5" fill="currentColor" stroke="none" opacity=".85"/><circle cx="8.5" cy="21.5" r=".6" fill="currentColor" stroke="none"/><circle cx="15.5" cy="21.4" r=".5" fill="currentColor" stroke="none"/>',
  signpost:'<path d="M12 3v18" stroke-width="1.6"/><path d="M5 5h9l2.5 2L14 9H5z"/><path d="M19 12h-9l-2.5 2L10 16h9z"/><circle cx="12" cy="7" r=".8" fill="currentColor" stroke="none"/><circle cx="12" cy="14" r=".8" fill="currentColor" stroke="none"/><path d="M7 7h5M12 14h5" stroke-width="1" opacity=".5"/>',
  chest:'<path d="M4 10h16v8H4z"/><path d="M4 10a8 4 0 0 1 16 0"/><path d="M8 6.5v11.5M16 6.5v11.5" stroke-width="1.2"/><path d="M4 13h16" stroke-width="1.2"/><rect x="10.6" y="11.4" width="2.8" height="3" rx=".5" fill="currentColor" stroke="none"/><path d="M5 18v1.5M19 18v1.5" stroke-width="1.4"/>',
  house:'<path d="M5 11l5-4 5 4"/><path d="M6.5 10v7h7v-7"/><path d="M9.5 17v-3h2v3"/><rect x="7.4" y="11.5" width="1.4" height="1.4" fill="currentColor" stroke="none"/><path d="M12.5 5.5V3.5h1.6v2.4" stroke-width="1.2"/><path d="M13.3 3.2c.8-.6.4-1.4 1-2M13.3 2c.6-.5.3-1 .8-1.5" stroke-width="1.1" opacity=".7"/><path d="M2 18l1-2 1 2 1-2 1 2M3 17h3" stroke-width="1.1"/><path d="M16 9l2.5-2 2.5 2M17 8.5v4h4v-4" stroke-width="1.1" opacity=".75"/>',
  lair:'<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M5 20L5 13Q5 7 12 7Q19 7 19 13L19 20ZM9.5 11.8a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 1 0 0-2.6ZM14.5 11.8a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 1 0 0-2.6Z"/><path d="M3 20Q3 6 12 5Q21 6 21 20" stroke-width="1.8"/><path d="M3 20h18M8 6.5l.4 1.8M12 5.6v2M16 6.5l-.4 1.8" stroke-width="1.2"/>',
  roost:'<path d="M4 20v-8h3v8M17 20v-8h3v8"/><path d="M4 10.5h3M4.5 10.5v-1.2M6.5 10.5v-1.2M17 10.5h3M17.5 10.5v-1.2M19.5 10.5v-1.2" stroke-width="1.1"/><path d="M9 8l1.5 1.5L12 6l1.5 3.5L15 8l-1 3H10z"/><circle cx="12" cy="6" r=".7" fill="currentColor" stroke="none"/><path d="M8 14c2 1 6 1 8 0M8.5 15.5c2 .8 5 .8 7 0M9 17c1.5.6 4.5.6 6 0" stroke-width="1.1"/>',
  //wolf:'<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M12 4L15.2 2.2 15.7 5.5 17.5 6.7 19.7 8.5 17.7 9.7 20.3 11.5 17.9 12.7 19.5 14.7 16.5 16.7 12 21 7.5 16.7 4.5 14.7 6.1 12.7 3.7 11.5 6.3 9.7 4.3 8.5 6.5 6.7 8.3 5.5 8.8 2.2Z M14.7 3.3 15.1 5.1 13.7 4.9Z M9.3 3.3 8.9 5.1 10.3 4.9Z M13.3 7.7Q14.7 7 16.1 7.9 14.7 7.7 13.3 8.3Z M10.7 7.7Q9.3 7 7.9 7.9 9.3 7.7 10.7 8.3Z M13.5 9.5Q14.7 8.5 15.9 9.5 14.7 10.3 13.5 9.5Z M10.5 9.5Q9.3 8.5 8.1 9.5 9.3 10.3 10.5 9.5Z M10.7 13.7Q12 13.3 13.3 13.7 12.9 15 12 15.4 11.1 15 10.7 13.7Z M10.9 16.3Q12 17.1 13.1 16.3 12 16.7 10.9 16.3Z"/>',
  wolf:'<path d="M3.5 20v-8.5c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0V20"/><path d="M3.5 20c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0"/><path d="M12 11.5V20"/><path d="M6 14c1.5-.5 3-.5 4.5 0M6 16.5c1.5-.5 3-.5 4.5 0" stroke-width="1" opacity=".7"/><path d="M20.5 2.5c-5.2 1-8.8 3.9-10.6 8.4l-.5 1.8 1.9-.4c4.7-1.7 7.8-5.2 9.2-9.8z"/><path d="M9.4 12.7L7.8 15.8"/><circle cx="7.6" cy="16.2" r=".8" fill="currentColor" stroke="none"/><path d="M14.5 5.5l1.7 1.2M12.4 7.6l1.7 1.2" stroke-width="1" opacity=".7"/>',
  swords:'<path d="M5 5l7 7M19 5l-7 7"/><path d="M6 6l5 5M18 6l-5 5" stroke-width="1" opacity=".5"/><path d="M3.5 6.5l3-3M20.5 6.5l-3-3" stroke-width="2.4"/><circle cx="3.2" cy="3.2" r="1.2" fill="currentColor" stroke="none"/><circle cx="20.8" cy="3.2" r="1.2" fill="currentColor" stroke="none"/><path d="M11 11l-2 2 1.4 1.4 2-2M13 11l2 2-1.4 1.4-2-2"/>',
  crown:'<path d="M4 8l3 4 5-7 5 7 3-4-2 11H6L4 8z"/><path d="M6 19h12" stroke-width="1.3"/><circle cx="7" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="9" r="1.2" fill="currentColor" stroke="none"/><circle cx="17" cy="12" r="1" fill="currentColor" stroke="none"/>',
  heart:'<path d="M12 20.5S4 15.4 4 9.6A4 4 0 0 1 12 7a4 4 0 0 1 8 2.6c0 5.8-8 10.9-8 10.9z"/><path d="M8.5 8.2a2 2 0 0 0-1.6 2" stroke-width="1.4"/>',
  skull:'<path d="M12 3a7 7 0 0 0-4 12.7V19h8v-3.3A7 7 0 0 0 12 3z"/><path d="M9.5 19v2M12 19v2M14.5 19v2"/><circle cx="9.3" cy="11" r="1.5" fill="currentColor" stroke="none"/><circle cx="14.7" cy="11" r="1.5" fill="currentColor" stroke="none"/><path d="M12 13.5l-.8 1.6h1.6z" fill="currentColor" stroke="none"/><path d="M9 6.5a4 4 0 0 1 2-1" stroke-width="1.2"/>',
  coin:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6.4" stroke-width="1.2"/><path d="M12 8v8M10 10h2.6a1.4 1.4 0 0 1 0 2.8H10a1.4 1.4 0 0 0 0 2.8h2.6"/><path d="M7 7l1 1" stroke-width="1.2"/>',
  bag:'<path d="M7 8h10l-1 12H8L7 8z"/><path d="M9 8a3 3 0 0 1 6 0"/><path d="M9.5 12h5M9.3 15h5.4" stroke-width="1.2"/><circle cx="12" cy="9.5" r=".9" fill="currentColor" stroke="none"/>',
  claw:'<path d="M8 4c-1 4-1 8 1 12M12 3c0 5 0 9 0 13M16 4c1 4 1 8-1 12"/><path d="M7 16c2 3 8 3 10 0"/><path d="M8 4l-.6-1M12 3V1.6M16 4l.6-1" stroke-width="1.4"/>',
  fang:'<path d="M6 4h12"/><path d="M9 4c0 6-1 9-1 9M15 4c0 6 1 9 1 9M11 4l1 4 1-4"/><path d="M8 13l1 2 1-2M14 13l1 2 1-2" fill="currentColor" stroke="none"/>',
  drop:'<path d="M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z"/><path d="M9.5 13a2.5 2.5 0 0 0 1.5 2.4" stroke-width="1.3"/>',
  blood:'<path d="M12 4c2 3 4 5 4 8a4 4 0 0 1-8 0c0-3 2-5 4-8z"/><circle cx="6" cy="18" r="1.1" fill="currentColor" stroke="none"/><circle cx="18" cy="17" r="1.3" fill="currentColor" stroke="none"/><circle cx="17" cy="20" r=".8" fill="currentColor" stroke="none"/>',
  leap:'<path d="M6 17c0-6 4-10 11-10"/><path d="M14 4l3 3-3 3"/><circle cx="6" cy="17" r="1.4" fill="currentColor" stroke="none"/>',
  dagger:'<path d="M12 3v10"/><path d="M9 13h6"/><path d="M11 13l1 8 1-8"/><path d="M12 4.5v6" stroke-width="1.1"/><circle cx="12" cy="14.5" r="1.1" fill="currentColor" stroke="none"/>',
  moon:'<path d="M16 12a6 6 0 1 1-7-5.7A5 5 0 0 0 16 12z"/><circle cx="17.5" cy="6" r=".9" fill="currentColor" stroke="none"/><circle cx="19.5" cy="9" r=".6" fill="currentColor" stroke="none"/>',
  frost:'<path d="M12 3v18M4 7l16 10M20 7L4 17"/><path d="M12 6l-2 1.4M12 6l2 1.4M12 18l-2-1.4M12 18l2-1.4" stroke-width="1.2"/>',
  fear:'<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="15.5" r="1.9"/><path d="M7.5 7.5l2 1M16.5 7.5l-2 1" stroke-width="1.2"/><path d="M18 5c.8.4 1 1.2.6 2" stroke-width="1.1"/>',
  swirl:'<path d="M12 12a3 3 0 1 1-3-3 5 5 0 1 1 5 5 7 7 0 1 1-7-7"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  cry:'<path d="M4 10v4l4 1 8 4V5L8 9 4 10z"/><path d="M18 9a3 3 0 0 1 0 6"/><path d="M20.5 7.5a5 5 0 0 1 0 9" stroke-width="1.2"/>',
  wind:'<path d="M3 8h11a2.5 2.5 0 1 0-2.5-2.5M3 12h15a2.5 2.5 0 1 1-2.5 2.5M3 16h8"/><circle cx="3.4" cy="8" r=".7" fill="currentColor" stroke="none"/>',
  burst:'<path d="M12 3l2 5 5-2-3 4 5 2-5 1 1 5-4-3-4 3 1-5-5-1 5-2-3-4 5 2z"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  eye:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><path d="M13 11l.8-.8" stroke-width="1.1"/>',
  foot:'<path d="M9 4c-2 0-3 3-3 7s1 9 3 9 3-4 3-9-1-7-3-7z" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.1" fill="currentColor" stroke="none"/><circle cx="17" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="18" cy="12.5" r="1" fill="currentColor" stroke="none"/>',
  leaf:'<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19c4-4 7-7 9-9"/><path d="M11 11l3-1M9 13l3-1" stroke-width="1.1"/>',
  flame:'<path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 2 2 1 0-2-1-3 0-5z"/><path d="M12 13c1 0 1.6.8 1.6 1.8A1.6 1.6 0 0 1 12 16.4a1.6 1.6 0 0 1-1.6-1.6c0-.8.6-1.2 1-1.8.2.6.4.8.6 1z" stroke-width="1.2"/>',
  dizzy:'<path d="M9 10a2 2 0 1 1-2-2 1 1 0 0 1 1 1M17 10a2 2 0 1 1-2-2 1 1 0 0 1 1 1"/><path d="M9 16c1 1 2-1 3 0s2 1 3 0"/><path d="M5 5l1 1M19 5l-1 1" stroke-width="1.2"/>',
  trap:'<path d="M4 6h16M4 6l3 4 2-4 2 4 2-4 2 4 3-4M4 18h16M4 18l3-4 2 4 2-4 2 4 3-4"/><path d="M12 6v12" stroke-width="1.1"/>',
  shield:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"/><path d="M12 7v8M8.5 10.5h7" stroke-width="1.4"/><circle cx="12" cy="5.4" r=".9" fill="currentColor" stroke="none"/><circle cx="6.6" cy="7.4" r=".8" fill="currentColor" stroke="none"/><circle cx="17.4" cy="7.4" r=".8" fill="currentColor" stroke="none"/>',
  vial:'<path d="M9 3h6M10 3v6l-2 8a2 2 0 0 0 2 3h4a2 2 0 0 0 2-3l-2-8V3"/><path d="M8.5 14h7"/><circle cx="11" cy="17" r=".9" fill="currentColor" stroke="none"/><circle cx="13.5" cy="18.4" r=".6" fill="currentColor" stroke="none"/>',
  gem:'<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l-3 5 6 11 6-11-3-5"/><path d="M9 9l3 4 3-4" stroke-width="1.1"/><path d="M11 6l1 1.5" stroke-width="1.1"/>',
  mug:'<path d="M6 5h10v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V5z"/><path d="M16 8h2a2 2 0 0 1 0 4h-2"/><path d="M6 5c1-2 9-2 10 0"/><path d="M6 8.5h10" stroke-width="1.2"/><circle cx="9" cy="7" r=".7" fill="currentColor" stroke="none"/><circle cx="12" cy="6.6" r=".7" fill="currentColor" stroke="none"/>',
  cat:'<path d="M6 6l2 3M18 6l-2 3M7 9a5 5 0 0 0 10 0 5 5 0 0 0-10 0z"/><circle cx="10" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="11" r="1" fill="currentColor" stroke="none"/><path d="M12 13v1M4 12.5h2.5M17.5 12.5H20M4 14.5h2.5M17.5 14.5H20" stroke-width="1.1"/><path d="M11.4 13.4h1.2l-.6.7z" fill="currentColor" stroke="none"/>',
  mist:'<path d="M4 9c2-2 4-2 6 0s4 2 6 0M4 13c2-2 4-2 6 0s4 2 6 0M4 17c2-2 4-2 6 0s4 2 6 0"/><circle cx="3.4" cy="9" r=".6" fill="currentColor" stroke="none"/><circle cx="20.6" cy="13" r=".6" fill="currentColor" stroke="none"/>',
  axe:'<path d="M14 3c3 1 5 3 5 6-2 0-4-1-5-2l-8 11-2-2 8-11c-1-1-1-2 2-2z"/><path d="M15 4.5c1.5.8 2.4 2 2.6 3.4" stroke-width="1.1"/><path d="M6.5 14.5l1.5 1.5" stroke-width="1.2"/>',
  horn:'<path d="M5 12c4 0 8-2 12-5 1 3 1 7 0 10-4-3-8-5-12-5z"/><path d="M5 10v4"/><path d="M19 8.5c1 .8 1 2.2 0 3" stroke-width="1.2"/>',
  meteor:'<circle cx="15" cy="9" r="4"/><path d="M11 13L4 20M9 13l-3 3M13 11l-3 3"/><circle cx="14" cy="8" r=".9" fill="currentColor" stroke="none"/><circle cx="16.5" cy="10.5" r=".7" fill="currentColor" stroke="none"/><path d="M5 19l-1 1" stroke-width="1.2"/>',
  hourglass:'<path d="M7 3h10M7 21h10M7 3c0 4 5 5 5 9s-5 5-5 9M17 3c0 4-5 5-5 9s5 5 5 9"/><path d="M10 18h4l-2-3z" fill="currentColor" stroke="none"/><circle cx="12" cy="6.5" r=".7" fill="currentColor" stroke="none"/>',
  bed:'<path d="M3 12v6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3H9v5M3 14V9a2 2 0 0 1 2-2h4"/><path d="M11 11h6" stroke-width="1.2"/><path d="M19 6l1-1M20 8l1.4-.4" stroke-width="1.1"/>',
  pin2:'<path d="M12 3l4 4-2 2 1 4-3-1-3 1 1-4-2-2 4-4z"/><path d="M12 13v8"/><circle cx="12" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  boot:'<path d="M8 3v9l-2 2v3h11c1 0 2-1 2-2s-1-2-3-2l-4-1V3z"/><path d="M8 6h2M8 9h2" stroke-width="1.2"/><path d="M6 17h13" stroke-width="1.3"/>',
  oil:'<path d="M10 3h4v3l2 4v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8l2-4V3z"/><path d="M8 13h8"/><path d="M9.5 16c1 .8 4 .8 5 0" stroke-width="1.2"/><path d="M10 3h4" stroke-width="2.2"/>',
  mushroom:'<path d="M5 11a7 7 0 0 1 14 0z"/><path d="M9 11v6a3 3 0 0 0 6 0v-6"/><circle cx="9" cy="8" r=".9" fill="currentColor" stroke="none"/><circle cx="13" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="9.5" r=".7" fill="currentColor" stroke="none"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  sick:'<circle cx="12" cy="12" r="9"/><path d="M8 10l2 2M10 10l-2 2M14 10l2 2M16 10l-2 2" stroke-width="1.3"/><path d="M9 15c1 1 2-1 3 0s2 1 3 0"/>',
  warn:'<path d="M12 4l9 16H3z"/><path d="M12 10v4" stroke-width="2"/><circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none"/>',
  eagle:'<path d="M3 13c3 0 5-2 9-2s6 2 9 2M12 11V7M10 7h4"/><path d="M5 12c1-2 3-3 5-3M19 12c-1-2-3-3-5-3" stroke-width="1.1"/><path d="M11 7l1-1.5 1 1.5z" fill="currentColor" stroke="none"/>',
  chain:'<path d="M8 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM16 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path d="M10.5 11l3 2"/><circle cx="8" cy="11" r=".7" fill="currentColor" stroke="none"/><circle cx="16" cy="13" r=".7" fill="currentColor" stroke="none"/>',
  hole:'<path d="M12 8a6 3 0 1 0 0 8 6 3 0 0 0 0-8z"/><path d="M12 10a3 1.5 0 1 0 0 4 3 1.5 0 0 0 0-4z" fill="currentColor" stroke="none"/><path d="M5 9l-1-1M19 15l1 1" stroke-width="1.1"/>',
  cart:'<path d="M4 6h2l2 9h9l2-6H8"/><circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/><circle cx="9" cy="19" r=".6" fill="currentColor" stroke="none"/><circle cx="17" cy="19" r=".6" fill="currentColor" stroke="none"/>',
  bandage:'<path d="M7 9l8-3 3 8-8 3z"/><path d="M11 9h.01M13 11h.01M10 12h.01M12 14h.01" stroke-width="1.6"/><path d="M8.5 10.5l7 2.5" stroke-width="1.1"/>',
  knot:'<path d="M9 7c-3 2-3 8 0 10M15 7c3 2 3 8 0 10M9 12h6"/><path d="M9 7l-1.5-1.5M15 7l1.5-1.5M9 17l-1.5 1.5M15 17l1.5 1.5" stroke-width="1.2"/>',
  wave:'<path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><circle cx="6" cy="11" r=".7" fill="currentColor" stroke="none"/><circle cx="15" cy="11" r=".7" fill="currentColor" stroke="none"/>',
  helmet:'<path d="M5 13a7 7 0 0 1 14 0v2H5z"/><path d="M5 15h14M9 15v3M15 15v3M12 6v9"/><path d="M12 6c1-1.5 2-2 3-2.5" stroke-width="1.2"/>',
  tent:'<path d="M12 4L4 19h16L12 4z"/><path d="M12 4v15M9 19l3-5 3 5"/><path d="M12 4v-1.5M11 2.5h2" stroke-width="1.2"/>',
  wing:'<path d="M4 14c4-8 12-9 16-7-2 2-3 5-6 6-3 1-7 1-10 1z"/><path d="M8 12c2-2 5-3 8-3M9 14c1.5-1.5 3.5-2.5 6-2.5" stroke-width="1.1"/>',
  feather:'<path d="M19 5c-6 0-12 5-13 14 6 0 12-5 13-14z"/><path d="M6 18L14 10"/><path d="M11 9l2 .5M9 12l2 .5M7 15l2 .5" stroke-width="1.1"/>',
  spark:'<path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  glyph:'<circle cx="12" cy="12" r="9" stroke-width="1.3"/><path d="M12 6l2.5 4 4 .6-3 3 .8 4.4L12 16l-4.3 2 .8-4.4-3-3 4-.6z"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  stone:'<path d="M8 4l8 1 3 6-2 8-9 1-3-7z"/><path d="M11 9v6M11 9l3 3-3 1"/><path d="M6 7l1 1M16 16l1 1" stroke-width="1.1"/>',
  bow:'<path d="M7 3c-3 5-3 13 0 18M7 3v18M7 12h12M16 9l3 3-3 3"/><path d="M7 12l-1.5-1M7 12l-1.5 1" stroke-width="1.1"/>'
};
const EM2ICO={'⚔':'battle','❓':'signpost','💰':'chest','🏘':'house','🐾':'lair','👑':'roost','❤':'heart','☠':'skull','🪙':'coin','🎒':'bag','🐺':'wolf','🪝':'claw','🦷':'fang','💧':'drop','🩸':'blood','🦘':'leap','🗡':'dagger','🌙':'moon','❄':'frost','😱':'fear','🌀':'swirl','📢':'cry','🌪':'wind','💥':'burst','👁':'eye','🦶':'foot','🌿':'leaf','🔥':'flame','💫':'dizzy','🪤':'trap','🛡':'shield','⚗':'vial','💠':'gem','🍺':'mug','🍃':'leaf','🐈':'cat','🌫':'mist','🪓':'axe','📯':'horn','☄':'meteor','⌛':'hourglass','🛏':'bed','📌':'pin2','🥾':'boot','🧴':'oil','🍄':'mushroom','🎯':'target','🤢':'sick','⚠':'warn','🦅':'eagle','⛓':'chain','🕳':'hole','🛺':'cart','🩹':'bandage','🪢':'knot','🌊':'wave','🪖':'helmet','⛺':'tent','🪽':'wing','🪶':'feather','🧪':'vial','⚡':'spark','🔯':'glyph','🍯':'mug','🥃':'mug','🪨':'stone','🏹':'bow','💚':'heart'};
function ico(name,cls){const p=ICONS[name]||ICONS.dot;return '<svg class="ico'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';}
function decorate(s){if(s==null)return s;s=String(s).replace(/‌/g,'');for(const em in EM2ICO){if(s.indexOf(em)!==-1)s=s.split(em).join(ico(EM2ICO[em]));}return s;}
Object.assign(ICONS,{
trophy:'<path d="M7 4h10v3a5 5 0 0 1-10 0z"/><path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4"/><path d="M12 12v4M9 20h6M10 16h4v4"/>',
book:'<path d="M3.5 20v-8.5c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0V20"/><path d="M3.5 20c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0"/><path d="M12 11.5V20"/><path d="M6 14c1.5-.5 3-.5 4.5 0M6 16.5c1.5-.5 3-.5 4.5 0" stroke-width="1" opacity=".7"/><path d="M20.5 2.5c-5.2 1-8.8 3.9-10.6 8.4l-.5 1.8 1.9-.4c4.7-1.7 7.8-5.2 9.2-9.8z"/><path d="M9.4 12.7L7.8 15.8"/><circle cx="7.6" cy="16.2" r=".8" fill="currentColor" stroke="none"/><path d="M14.5 5.5l1.7 1.2M12.4 7.6l1.7 1.2" stroke-width="1" opacity=".7"/>',
music:'<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.4"/><circle cx="17" cy="16" r="2.4"/>',
mute:'<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.4"/><path d="M4 4l16 16"/>',
star:'<path d="M12 3l2.7 5.8 6.3.7-4.7 4.2 1.3 6.2-5.6-3.2-5.6 3.2 1.3-6.2L3 9.5l6.3-.7z"/>',
scroll:'<path d="M7 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7"/><path d="M7 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z"/><path d="M9 9h8M9 12h8M9 15h6"/>',
lock:'<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/><circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none"/>',
halo:'<circle cx="12" cy="14" r="6"/><path d="M7 5c3-2 7-2 10 0"/>'
});
Object.assign(EM2ICO,{'🏆':'trophy','📖':'book','🎵':'music','🔇':'mute','★':'star','⭐':'star','📜':'scroll','🔒':'lock','😇':'halo','🎒':'bag'});

if(!ICONS.star){Object.assign(ICONS,{
star:'<path d="M12 3l2.7 5.8 6.3.7-4.7 4.2 1.3 6.2-5.6-3.2-5.6 3.2 1.3-6.2L3 9.5l6.3-.7z"/>',
halo:'<circle cx="12" cy="14" r="6"/><path d="M7 5c3-2 7-2 10 0"/>',
trophy:'<path d="M7 4h10v3a5 5 0 0 1-10 0z"/><path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4"/><path d="M12 12v4M9 20h6M10 16h4v4"/>',
book:'<path d="M3.5 20v-8.5c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0V20"/><path d="M3.5 20c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0"/><path d="M12 11.5V20"/><path d="M6 14c1.5-.5 3-.5 4.5 0M6 16.5c1.5-.5 3-.5 4.5 0" stroke-width="1" opacity=".7"/><path d="M20.5 2.5c-5.2 1-8.8 3.9-10.6 8.4l-.5 1.8 1.9-.4c4.7-1.7 7.8-5.2 9.2-9.8z"/><path d="M9.4 12.7L7.8 15.8"/><circle cx="7.6" cy="16.2" r=".8" fill="currentColor" stroke="none"/><path d="M14.5 5.5l1.7 1.2M12.4 7.6l1.7 1.2" stroke-width="1" opacity=".7"/>',
music:'<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.4"/><circle cx="17" cy="16" r="2.4"/>',
mute:'<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.4"/><path d="M4 4l16 16"/>',
scroll:'<path d="M7 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7"/><path d="M7 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z"/><path d="M9 9h8M9 12h8M9 15h6"/>',
lock:'<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/><circle cx="12" cy="15" r="1.4" fill="currentColor" stroke="none"/>'
});}
if(!EM2ICO['🏆']){Object.assign(EM2ICO,{'🏆':'trophy','📖':'book','🎵':'music','🔇':'mute','★':'star','⭐':'star','📜':'scroll','🔒':'lock','😇':'halo'});}

if(!ICONS.tome){ICONS.tome='<path d="M3.5 20v-8.5c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0V20"/><path d="M3.5 20c2.8-1.4 5.7-1.4 8.5 0 2.8-1.4 5.7-1.4 8.5 0"/><path d="M12 11.5V20"/><path d="M6 14c1.5-.5 3-.5 4.5 0M6 16.5c1.5-.5 3-.5 4.5 0" stroke-width="1" opacity=".7"/><path d="M20.5 2.5c-5.2 1-8.8 3.9-10.6 8.4l-.5 1.8 1.9-.4c4.7-1.7 7.8-5.2 9.2-9.8z"/><path d="M9.4 12.7L7.8 15.8"/><circle cx="7.6" cy="16.2" r=".8" fill="currentColor" stroke="none"/><path d="M14.5 5.5l1.7 1.2M12.4 7.6l1.7 1.2" stroke-width="1" opacity=".7"/>';}

if(!ICONS.ghost){Object.assign(ICONS,{
ghost:'<path d="M12 4a6 6 0 0 1 6 6v9l-2-2-2 2-2-2-2 2-2-2-2 2v-9a6 6 0 0 1 6-6z"/><circle cx="10" cy="10" r=".9" fill="currentColor" stroke="none"/><circle cx="14" cy="10" r=".9" fill="currentColor" stroke="none"/>',
frog:'<path d="M7 9a2.5 2.5 0 1 1 3 2.4c-1.6.6-2.6 1.8-2.6 3.6h9.2c0-1.8-1-3-2.6-3.6A2.5 2.5 0 1 1 17 9"/><circle cx="9" cy="8" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="8" r=".8" fill="currentColor" stroke="none"/>',
croc:'<path d="M3 13l4-2 3 1 8-1 3 2-3 1-9 1-4-1z"/><path d="M6 12.4l1 .8M9 12.6l1 .8M12 12.6l1 .8"/><circle cx="6.5" cy="11.6" r=".7" fill="currentColor" stroke="none"/>',
spider:'<circle cx="12" cy="13" r="3"/><circle cx="12" cy="8.6" r="1.6"/><path d="M9.4 11L5 8M9 13H4.4M9.4 15L5 18M14.6 11L19 8M15 13h4.6M14.6 15L19 18"/>',
snake:'<path d="M5 17c0-3 3-3 6-3s6 0 6-3-3-3-6-3"/><circle cx="5.6" cy="17.4" r=".9" fill="currentColor" stroke="none"/><path d="M17 8l2-1"/>',
boar:'<path d="M4 14c1-4 5-6 9-6 4 0 7 2 7 5 0 2-2 4-5 4H7c-2 0-3-1-3-3z"/><path d="M4.5 13.5L3 12M8 17l-1 2M15 17l1 2"/><circle cx="16.5" cy="12" r=".8" fill="currentColor" stroke="none"/>',
bug:'<ellipse cx="12" cy="13" rx="3.4" ry="4.4"/><path d="M12 8.6V17M8.6 11L5 9M8.6 13H4.6M8.6 15L5 17M15.4 11L19 9M15.4 13h4M15.4 15L19 17M10.4 6.8L9 5M13.6 6.8L15 5"/>',
candle:'<path d="M10 11h4v9h-4z"/><path d="M12 8c1 1.2 1 2 0 3-1-1-1-1.8 0-3z"/><path d="M9 20h6"/>',
ice:'<path d="M12 3v18M5 6.5l14 11M19 6.5l-14 11M12 3l-2 2M12 3l2 2M12 21l-2-2M12 21l2-2"/>',
web:'<path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7"/><circle cx="12" cy="12" r="3.4"/><circle cx="12" cy="12" r="6.6"/>',
child:'<circle cx="12" cy="8" r="3"/><path d="M9 20c0-4 1-6 3-6s3 2 3 6"/>',
hand:'<path d="M8 12V6.5a1.2 1.2 0 0 1 2.4 0V11M10.4 11V5.5a1.2 1.2 0 0 1 2.4 0V11M12.8 11V6.5a1.2 1.2 0 0 1 2.4 0V12M15.2 12v-3a1.2 1.2 0 0 1 2.4 0v5c0 4-2.4 6-5.6 6S7 18 6.4 14.6L6 12a1.2 1.2 0 0 1 2-.6"/>',
egg:'<path d="M12 4c3.5 0 6 5 6 9a6 6 0 0 1-12 0c0-4 2.5-9 6-9z"/>',
bone:'<path d="M8.5 8.5l7 7"/><circle cx="7" cy="7" r="1.6"/><circle cx="9.5" cy="5.5" r="1.6"/><circle cx="17" cy="17" r="1.6"/><circle cx="14.5" cy="18.5" r="1.6"/>'
});}
Object.assign(EM2ICO,{
'⚔️':'battle','❓':'signpost','💰':'chest','🏘️':'house','🐾':'lair','👑':'crown','🐺':'wolf','🦇':'wing',
'🧟':'sick','🧟♀️':'sick','💀':'skull','☠️':'skull','☠':'skull','👻':'ghost','🐸':'frog','🐊':'croc',
'🕷️':'spider','🕷':'spider','🐍':'snake','🐗':'boar','🐕':'claw','🏹':'bow','🕯️':'candle','👹':'axe',
'🧊':'ice','🦅':'eagle','🐛':'bug','🐜':'bug','🗿':'stone','🌿':'leaf','🍄':'mushroom','🕸️':'web',
'🧎':'halo','🤝':'hand','🖐️':'hand','🖐':'hand','🗡️':'dagger','🗡':'dagger','🚧':'trap','📨':'scroll',
'🤢':'sick','🩸':'blood','🩹':'bandage','🪢':'knot','🌊':'wave','⛺':'tent','🥚':'egg','🪖':'helmet',
'🧒':'child','🦴':'bone','':'claw','':'claw','':'horn','🐲':'horn','🦂':'spider','🦟':'bug',
'🌬️':'wind','🔥':'flame','🌀':'swirl','⭕':'trap','🔗':'chain','⛓️':'chain','⛓':'chain','👁️':'eye',
'🛡️':'shield','🛡':'shield','❤️':'heart','❤':'heart','🪙':'coin','🍺':'mug','🛏️':'bed','🧴':'vial',
'⭐':'star','★':'star','🏆':'trophy','📖':'book','🎵':'music','🔇':'mute','😇':'halo','🙂':'star',
'😠':'warn','👹':'axe','🌑':'moon','🌙':'moon','⚡':'spark','💢':'burst','😱':'fear','💧':'drop',
'':'foot','':'lair','':'stone','️':'mist','':'swirl','':'ice','':'gem','️':'vial',
'🧪':'vial','💍':'gem','🗝️':'lock','🔒':'lock','':'axe','️':'axe','':'axe','':'wave','':'chain'
});

if(!ICONS.weave){ICONS.weave='<path d="M4 9c4 0 5 3 8 3s4-3 8-3M4 15c4 0 5-3 8-3s4 3 8 3"/><path d="M12 4v3M12 17v3"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><path d="M14.4 12c3.2.2 5.2 2.2 5.6 5" stroke-width="1.1" opacity=".7"/>';}
EM2ICO['💠']='weave';EM2ICO['🧵']='weave';EM2ICO['🪡']='weave';EM2ICO['🕸️']='web';

/* decor-guard */
(function(){for(var k in EM2ICO){if(!k||k.length<1||k.charCodeAt(0)===0xFE0F){delete EM2ICO[k];}}})();
function decorate(s){if(s==null)return s;s=String(s).replace(/‌/g,'');for(var em in EM2ICO){if(!em||em.length<1||em.charCodeAt(0)===0xFE0F)continue;if(s.indexOf(em)!==-1)s=s.split(em).join(ico(EM2ICO[em]));}return s;}

if(!window.CLASS_ICON){var CLASS_ICON={loup:'wolf',tisseuse:'weave',mercenaire:'axe',pisteuse:'bow'};}
Object.assign(EM2ICO,{'☆':'star','⚒':'axe','⚒️':'axe','⛏':'axe','⛏️':'axe','🪓':'axe','🔮':'gem','🧭':'signpost','🪶':'feather'});

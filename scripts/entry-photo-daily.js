/* ArchiSpotter — rotación diaria de 10 fotografías arquitectónicas reales.
   Cada fotografía conserva autor y página original de Unsplash.
   No se modifican splash, autenticación ni navegación.
   La foto antigua permanece como respaldo si la red falla. */
(function () {
  'use strict';
  var photos = [
  {
    "name": "Coliseo: arcos",
    "author": "Pablo Fernández",
    "source": "https://unsplash.com/photos/M32BbLBXGuc",
    "url": "https://images.unsplash.com/photo-1763374046991-632df3a66127?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Coliseo: piedra",
    "author": "Péter Sebestyén",
    "source": "https://unsplash.com/photos/3wTRNLPmLEU",
    "url": "https://images.unsplash.com/photo-1770403557576-2c2e48e455ae?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Sagrada Família: vitrales",
    "author": "Chubo Han",
    "source": "https://unsplash.com/photos/HEBOKOm1Zq4",
    "url": "https://images.unsplash.com/photo-1750389361796-ad90dd87fdc3?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Sagrada Família: columnas",
    "author": "GÜRKAN ŞEN",
    "source": "https://unsplash.com/photos/DiB9bc3I82M",
    "url": "https://images.unsplash.com/photo-1762882450674-e6acea1f1bb9?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Gran Mezquita de Abu Dabi",
    "author": "Djordje Stanivukovic",
    "source": "https://unsplash.com/photos/LiGnI_CfsZE",
    "url": "https://images.unsplash.com/photo-1769428197774-2dfdffe4a723?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Bujará: azulejos",
    "author": "Mehmet Can Özgümüş",
    "source": "https://unsplash.com/photos/OSmr_wfUwaU",
    "url": "https://images.unsplash.com/photo-1774810306743-58fa96a33e2a?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Estrasburgo: talla gótica",
    "author": "Marcel Strauß",
    "source": "https://unsplash.com/photos/V70r5cdiAZE",
    "url": "https://images.unsplash.com/photo-1776425726044-b12e827aa863?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Córdoba: arquerías",
    "author": "Marziye",
    "source": "https://unsplash.com/photos/R6bY6tdXK50",
    "url": "https://images.unsplash.com/photo-1773831308219-28ae5a6589a0?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Notre-Dame: bóvedas",
    "author": "Eric BARBEAU",
    "source": "https://unsplash.com/photos/vHopOnRv7l8",
    "url": "https://images.unsplash.com/photo-1742824747185-1546337ea8a3?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  },
  {
    "name": "Masjid Moth: arcos",
    "author": "Zoshua Colah",
    "source": "https://unsplash.com/photos/v1MrheiaTBw",
    "url": "https://images.unsplash.com/photo-1763641700813-ef9a12e813d3?auto=format&fit=crop&w=1400&q=78",
    "position": "center center"
  }
];
  var layer = document.getElementById('archi-entry-photo');
  if (!layer) return;
  var today = new Date();
  var day = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  var selected = photos[((day % photos.length) + photos.length) % photos.length];
  window.archiEntryPhotoToday = { name: selected.name, author: selected.author, source: selected.source };
  var preload = new Image();
  preload.onload = function () {
    layer.style.setProperty('background-image', 'url("' + selected.url + '")', 'important');
    layer.style.setProperty('background-position', selected.position, 'important');
    layer.dataset.archiPhoto = selected.name;
  };
  preload.onerror = function () {
    layer.dataset.archiPhoto = 'fallback';
  };
  preload.src = selected.url;
})();

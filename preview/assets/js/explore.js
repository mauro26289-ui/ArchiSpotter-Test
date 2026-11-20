/* Country and city exploration. Initialized once by the application controller. */
window.ArchiSpotterExplore = (function () {
  function init(currentLang, strings, openMonument) {
      var countryCitySamples = window.ArchiSpotterData.countryCitySamples;
      function renderCountryCities() {
        var selected = document.getElementById('country-detail').getAttribute('data-selected');
        var root = document.getElementById('country-cities');
        root.replaceChildren();
        if (!selected || !countryCitySamples[selected]) return;
        var idx = {es:0,en:1,it:2}[currentLang()] || 0;
        function picture(id, width, className) {
          var img = document.createElement('img');
          img.src = 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + width + '&q=80';
          img.alt = '';
          img.loading = 'lazy';
          img.decoding = 'async';
          if (className) img.className = className;
          return img;
        }
        countryCitySamples[selected].forEach(function(city) {
          var section = document.createElement('section'); section.className='city-section';
          var heading = document.createElement('div'); heading.className='city-heading';
          var open = document.createElement('button'); open.type='button'; open.className='city-open';
          var title = document.createElement('h3'); title.textContent=city[idx]; open.appendChild(title);
          var hint = document.createElement('span'); hint.textContent=strings[currentLang()].viewCity + ' ›'; open.appendChild(hint);
          open.addEventListener('click',function(){ openCity(city); });
          heading.appendChild(open); section.appendChild(heading);
          var row = document.createElement('div'); row.className='landmarks-row';
          city[4].forEach(function(place) {
            var card=document.createElement('article'); card.className='landmark-card';
            card.appendChild(picture(place[3],500,''));
            var name=document.createElement('h4'); name.textContent=place[idx]; card.appendChild(name);
            if(window.ArchiSpotterPhotos)window.ArchiSpotterPhotos.apply(card.querySelector('img'),place,500);
            row.appendChild(card);
          });
          section.appendChild(row); root.appendChild(section);
        });
      }
      function openCity(city) {
        var idx={es:0,en:1,it:2}[currentLang()]||0;
        var photo=document.getElementById('city-detail-photo');
        photo.src='https://images.unsplash.com/'+city[3]+'?auto=format&fit=crop&w=1100&q=80';
        document.getElementById('city-detail-name').textContent=city[idx];
        var gallery=document.getElementById('city-gallery'); gallery.replaceChildren();
        city[4].forEach(function(place) {
          var item=document.createElement('article');
          item.setAttribute('role','button'); item.tabIndex=0;
          item.style.cursor='pointer';
          item.addEventListener('click',function(){openMonument(place,city);});
          item.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openMonument(place,city);}});
          var img=document.createElement('img');
          img.src='https://images.unsplash.com/'+place[3]+'?auto=format&fit=crop&w=650&q=80';
          img.alt=''; img.loading='lazy'; img.decoding='async'; item.appendChild(img);
          var title=document.createElement('h3'); title.textContent=place[idx]; item.appendChild(title);
          var note=document.createElement('p'); note.textContent=strings[currentLang()].sampleImage; item.appendChild(note);
          if(window.ArchiSpotterPhotos)window.ArchiSpotterPhotos.apply(img,place,650);
          gallery.appendChild(item);
        });
        var food=window.ArchiSpotterCityFood&&window.ArchiSpotterCityFood[city[0]];
        var foodSection=document.getElementById('city-food'),foodList=document.getElementById('city-food-list');
        foodList.replaceChildren();foodSection.hidden=!food;
        if(food){
          document.getElementById('city-food-title').textContent=({es:'Sabores locales',en:'Local flavors',it:'Sapori locali'})[currentLang()];
          food.forEach(function(dish){var item=document.createElement('article');item.className='city-food-item';var name=document.createElement('h3');name.textContent=dish[0];var description=document.createElement('p');description.textContent=dish[({es:2,en:1,it:3}[currentLang()]||2)];item.appendChild(name);item.appendChild(description);foodList.appendChild(item);});
        }
        document.getElementById('country-detail').hidden=true;
        document.getElementById('city-detail').hidden=false;
        document.querySelector('.app-content').scrollTop=0;
      }
      document.getElementById('city-back').addEventListener('click',function(){
        document.getElementById('city-detail').hidden=true;
        document.getElementById('country-detail').hidden=false;
        document.querySelector('.app-content').scrollTop=0;
      });
      var countryNames = window.ArchiSpotterData.countryNames;
      function updateCountryNames() {
        var idx = {es:0,en:1,it:2}[currentLang()] || 0;
        document.querySelectorAll('[data-country-label]').forEach(function (el) {
          el.textContent = countryNames[el.getAttribute('data-country-label')][idx];
        });
        document.querySelectorAll('[data-country]').forEach(function (el) {
          el.setAttribute('aria-label', countryNames[el.getAttribute('data-country')][idx]);
        });
        var selected = document.getElementById('country-detail').getAttribute('data-selected');
        if (selected && countryNames[selected]) document.getElementById('country-detail-name').textContent = countryNames[selected][idx];
      }
      document.querySelectorAll('[data-country]').forEach(function (button) {
        button.addEventListener('click', function () {
          document.getElementById('country-detail').setAttribute('data-selected',button.getAttribute('data-country'));
          var coverPhoto = button.querySelector('img').src;
          if (button.getAttribute('data-country') === 'it') {
            coverPhoto = 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=1100&q=80';
          }
          document.getElementById('country-detail-photo').src = coverPhoto;
          document.getElementById('country-overview').hidden = true;
          document.getElementById('country-detail').hidden = false;
          updateCountryNames();
          renderCountryCities();
          document.querySelector('.app-content').scrollTop = 0;
        });
      });
      document.getElementById('country-back').addEventListener('click', function () {
        document.getElementById('country-detail').hidden = true;
        document.getElementById('country-overview').hidden = false;
        document.querySelector('.app-content').scrollTop = 0;
      });
    return { renderCountryCities:renderCountryCities, updateCountryNames:updateCountryNames, openCity:openCity };
  }
  return {init:init};
})();

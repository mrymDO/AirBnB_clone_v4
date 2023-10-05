$(document).ready(() => {
  checkStatus();
  getPlaces();
  handleSelectCheckbox();
});

function getPlaces() {
  const API_URL = 'http://127.0.0.1:5001/api/v1/places_search';
  const placesBox = $('section.places');
  $.ajax({
    url: API_URL,
    method: 'POST',
    data: '{}',
    headers: {
      'Content-Type': 'application/json'
    },
    dataType: 'json',
    success: (data) => {
      placesBox.text('');
      data.forEach(place => {
        placesBox.append(place_view(place));
      });
    }
  });

}

function checkStatus () {
  const apiStatusEl = $('div#api_status');
  const API_URL = 'http://127.0.0.1:5001/api/v1/status/';
  $.get(API_URL, (data, status) => {
    console.log(data);
    apiStatusEl.addClass('available');
  })
  .fail(() => {
    apiStatusEl.remove('available');
  })
}

function handleSelectCheckbox () {
  const selectedAmenites = {};
  const headingAmenities = $('.amenities > h4');
  let checkboxes = $('input[type="checkbox"]');

  checkboxes.on('change', function (e) {
    const { name, id } = $(this).data();
    const isChecked = this.checked;
    
    if (isChecked) {
      selectedAmenites[id] = name;
    } else if (!isChecked && selectedAmenites[id]) {
      delete selectedAmenites[id];
    }
    updateAmenityHeading(headingAmenities, selectedAmenites);
  });
}

function updateAmenityHeading (headingEl, dict) {
  const dictNames = Object.values(dict);
  
  if (dictNames.length == 0) {
    headingEl.html('&nbsp;');
    return;
  }
  
  headingEl.text(dictNames.join(', '));
}

function place_view(place) {
  return `
  <article>
	  <div class="title_box">
	    <h2>${ place.name }</h2>
	    <div class="price_by_night">$${ place.price_by_night }</div>
	  </div>
	  <div class="information">
	    <div class="max_guest">${ place.max_guest } Guest${ place.max_guest != 1 ? 's' : '' }</div>
            <div class="number_rooms">${ place.number_rooms } Bedroom${ place.number_rooms != 1 ? 's' : '' }</div>
            <div class="number_bathrooms">${ place.number_bathrooms } Bathroom${ place.number_bathrooms != 1 ? 's' : ''}</div>
	  </div>
	  <div class="user">
            <b>Owner:</b> ${ place.user.first_name } ${ place.user.last_name }
          </div>
          <div class="description">
	    ${place.description}
          </div>
	</article>
  `;
}
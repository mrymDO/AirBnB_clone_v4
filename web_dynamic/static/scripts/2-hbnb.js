
$(document).ready(() => {
  checkStatus();
  handleSelectCheckbox();
});

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

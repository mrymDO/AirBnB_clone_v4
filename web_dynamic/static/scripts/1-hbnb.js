
$(document).ready(() => {
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
});

function updateAmenityHeading (headingEl, dict) {
  const dictNames = Object.values(dict);
  
  if (dictNames.length == 0) {
    headingEl.html('&nbsp;');
    return;
  }
  
  headingEl.text(dictNames.join(', '));
}

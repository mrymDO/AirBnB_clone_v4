// Wait for the DOM to be fully loaded
$(document).ready(function () {
  // Dictionary to store Amenity IDs
  var amenityIds = {};

  // Dictionary to store State and City IDs
  var stateIds = {};
  var cityIds = {};

  // Function to update the API status
  function updateApiStatus() {
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  }

  // Function to load places from the API
  function loadPlaces() {
    $.post('http://0.0.0.0:5001/api/v1/places_search/', JSON.stringify({}), function (data) {
      // Clear the existing places
      $('.places').empty();

      // Loop through the places and create article tags
      data.forEach(function (place) {
        var placeArticle = $('<article>');
        var placeName = $('<h2>').text(place.name);
        var placePrice = $('<div>').text('Price by night: $' + place.price_by_night);
        var placeDescription = $('<div>').text(place.description);

        // Append elements to the article tag
        placeArticle.append(placeName, placePrice, placeDescription);

        // Append the article tag to the .places section
        $('.places').append(placeArticle);
      });
    });

    // Initial update of the API status
    updateApiStatus();

    // Listen for changes on each input checkbox tag
    $('input[type="checkbox"]').change(function (event) {
      // Get the ID and name from data attributes
      var checkbox = $(event.target);
      var dataId = checkbox.data('id');
      var dataName = checkbox.data('name');

      // Check if the checkbox is checked
      if (checkbox.prop('checked')) {
        // Determine if it's a State, City, or Amenity checkbox based on data attribute
        if (dataName.endsWith(':')) {
          // It's a State checkbox
          stateIds[dataId] = dataName;
        } else if (dataName.startsWith('Amenity:')) {
          // It's an Amenity checkbox
          amenityIds[dataId] = dataName;
        } else {
          // It's a City checkbox
          cityIds[dataId] = dataName;
        }
      } else {
        // Remove the ID from the corresponding dictionary if unchecked
        if (dataName.endsWith(':')) {
          delete stateIds[dataId];
        } else if (dataName.startsWith('Amenity:')) {
          delete amenityIds[dataId];
        } else {
          delete cityIds[dataId];
        }
      }

      // Update the h4 tag inside the div Locations with the list of States and Cities checked
      var locationsList = Object.values(stateIds).concat(Object.values(cityIds)).join(', ');
      $('.locations h4').text(locationsList);

      // Update the h4 tag inside the div Amenities with the list of Amenities checked
      var amenitiesList = Object.values(amenityIds).join(', ');
      $('.popover h4').text(amenitiesList);
    });

    // Listen for clicks on the filter button
    $('button').click(function () {
      // Send a POST request to places_search with the list of checked amenities, states, and cities
      $.post('http://0.0.0.0:5001/api/v1/places_search/', JSON.stringify({
        amenities: Object.keys(amenityIds),
        states: Object.keys(stateIds),
        cities: Object.keys(cityIds)
      }), function (data) {
        // Clear the existing places and load the filtered places
        $('.places').empty();
        data.forEach(function (place) {
          var placeArticle = $('<article>');
          var placeName = $('<h2>').text(place.name);
          var placePrice = $('<div>').text('Price by night: $' + place.price_by_night);
          var placeDescription = $('<div>').text(place.description);

          // Append elements to the article tag
          placeArticle.append(placeName, placePrice, placeDescription);

          // Append the article tag to the .places section
          $('.places').append(placeArticle);
        });
      });
    });
  });
});

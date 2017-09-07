// Setting 'display' to inline-block in the stylesheet causes elements to not
// actually be hidden, so we need to manage it along with toggling hidden
var setBreedVisibility = function(el, visible) {
  el.hidden = visible;
  el.style.display = visible ? "inline-block" : "none";
}

// Shows the list of breeds desired, based on the form input
var showFilteredBreeds = function(e) {
  // Prevent default form action
  e.preventDefault();

  // Get chosen hair type
  var hair_radio_buttons = document.querySelectorAll('input[name="hair_length"]');
  var selected_hair_type;
  for(button of hair_radio_buttons){
    if(button['checked']) {
      selected_hair_type = button['value']
    }
  }

  // Get list of selected traits
  var trait_checkboxes = document.querySelectorAll('input[name="traits"]');
  var selected_traits = [];
  for(box of trait_checkboxes) {
    if(box['checked']) {
      selected_traits.push(box.value);
    }
  }

  // Unhide the breeds that match the hair type, and
  // have at least one of the desired traits
  for(b of breeds) {
    var show_breed = false;
    // Check for hair type match
    if(b.getAttribute('hair').indexOf(selected_hair_type) != -1) {
      for(trait of selected_traits) {
        // Check for a matching trait
        if(b.getAttribute('traits').indexOf(trait) != -1) {
          show_breed = true;
          break;
        }
      }
    }

    // Explicitly hide breeds that shouldn't be shown, so
    // subsequent searches don't accumulate incorrect results
    setBreedVisibility(b, show_breed);
    // TODO add to localstorage
  }
}

var resetFilter = function(e) {
  // Prevent default form action
  e.preventDefault();

  for(b of breeds) {
    setBreedVisibility(b, false);
    // TODO clear local storage of filter
  }
}
// Get list of all available breeds
var breeds = document.getElementsByClassName('breed');

// Register filter event handler
document.getElementById('attributes_form').addEventListener("submit", showFilteredBreeds);

// Register reset search event handler
document.getElementById('reset_form').addEventListener("submit", resetFilter);

// TODO Need to check localStorage, and if a search is saved,
// we should display the search


// TODO remove
// for (b of breeds) {
//   if(true || b.hasAttribute('traits')
//   && b.getAttribute('traits').indexOf('large') != -1){
//     setBreedVisibility(b, true);
//   }
// }

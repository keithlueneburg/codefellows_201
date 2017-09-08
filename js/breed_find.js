/****************************
Functions
****************************/

// Setting 'display' to inline-block in the stylesheet causes elements to not
// actually be hidden, so we need to manage it along with toggling hidden
function setBreedVisibility(el, visible) {
    "use strict";
    el.hidden = visible;
    el.style.display = visible ? "inline-block" : "none";

    if (visible) {
        // Ensure the breed list border is visible if a breed is shown
        var border_el = document.getElementById("breed_list");
        if (border_el.style.display === "") {
            border_el.style.display = "inline-block";
        }
    }
}

// Wrapper for showFilteredBreeds, for use as an event handler
function searchHandler(e) {
    "use strict";
    // Prevent default form action
    e.preventDefault();
    showFilteredBreeds();
}

// Shows the list of breeds desired, based on the form input
function showFilteredBreeds() {
    "use strict";
    // Get chosen hair type
    var hair_radio_buttons = document.querySelectorAll("input[name='hair_length']");
    var selected_hair_type;

    for (var i = 0; i < hair_radio_buttons.length; i++) {
        if (hair_radio_buttons[i].checked) {
            selected_hair_type = hair_radio_buttons[i].value;
        }
    }
    // Save hair type to page storage
    sessionStorage.setItem("hair_type", selected_hair_type);

    // Get list of selected traits
    var trait_checkboxes = document.querySelectorAll("input[name='traits']");
    var selected_traits = [];
    var storageTraits = "";

    for (i = 0; i < trait_checkboxes.length; i++) {
        if (trait_checkboxes[i].checked) {
            selected_traits.push(trait_checkboxes[i].value);
            storageTraits += trait_checkboxes[i].value + " ";
        }
    }
    // Remove trailing space
    storageTraits.trim();
    sessionStorage.setItem("traits", storageTraits);

    // Unhide the breeds that match the hair type, and
    // have at least one of the desired traits
    var show_breed;
    for (i = 0; i < breeds.length; i++) {
        show_breed = false;
        // Check for hair type match
        if (breeds[i].getAttribute("hair").indexOf(selected_hair_type) !== -1) {
            for (var j = 0; j < selected_traits.length; j++) {
                // Check for a matching trait
                if (breeds[i].getAttribute("traits").indexOf(selected_traits[j]) !== -1) {
                    show_breed = true;
                    break;
                }
            }
        }

        // Explicitly hide breeds that shouldn't be shown, so
        // subsequent searches don't accumulate incorrect results
        setBreedVisibility(breeds[i], show_breed);
    }
}

// Reset the displayed search results, page storage and form
function resetFilter(e) {
    "use strict";
    // Prevent default form action
    e.preventDefault();

    // Ensure the breed list border is hidden
    var border_el = document.getElementById("breed_list");
    border_el.style.display = "";

    // Clear breed visibility
    for (var i = 0; i < breeds.length; i++) {
        setBreedVisibility(breeds[i], false);
    }

    // Clear saved search data
    clearPageStorage();

    // Reset form to empty
    clearSearchForm();
}

// Clears the page storage of search data
function clearPageStorage() {
    "use strict";
    sessionStorage.setItem("hair_type", "");
    sessionStorage.setItem("traits", "");
}

// Clears the search form
function clearSearchForm() {
    "use strict";
    setFormHairType("short");
    setFormTraits("");
}

// Checked whether there is an existing cached search
function searchSaved() {
    "use strict";
    return sessionStorage.getItem("hair_type") !== "" && sessionStorage.getItem("traits") !== "";
}

// Set the form's selected hair type
function setFormHairType(hair_type) {
    "use strict";
    var hair_radio_buttons = document.querySelectorAll("input[name='hair_length']");
    for (var i = 0; i < hair_radio_buttons.length; i++) {
        if (hair_type === hair_radio_buttons[i].value) {
            hair_radio_buttons[i].checked = true;
        }
    }
}

// Set the form's selected traits
function setFormTraits(traits) {
    "use strict";
    var trait_checkboxes = document.querySelectorAll("input[name='traits']");
    for (var i = 0; i < trait_checkboxes.length; i++) {
        if (traits.indexOf(trait_checkboxes[i].value) !== -1) {
            trait_checkboxes[i].checked = true;
        } else {
            trait_checkboxes[i].checked = false;
        }
    }
}

// Fill the form from data saved in page storage
function copyStorageToForm() {
    "use strict";
    // Set chosen hair type
    setFormHairType(sessionStorage.getItem("hair_type"));

    // Set selected traits
    setFormTraits(sessionStorage.getItem("traits"));
}

/****************************
Script - Page initialization
****************************/

// Get list of all available breeds
var breeds = document.getElementsByClassName("breed");

// Register filter event handler
document.getElementById("attributes_form").addEventListener("submit", searchHandler);

// Register reset search event handler
document.getElementById("reset_form").addEventListener("submit", resetFilter);

// Check localStorage, and if a previous search exists,
// the form should match
if (searchSaved()) {
    copyStorageToForm();
    showFilteredBreeds();
} else {
    // Clear local storage items if both are not populated
    clearPageStorage();
}

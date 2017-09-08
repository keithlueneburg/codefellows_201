/*jslint browser:true */

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
    var button;
    for (button of hair_radio_buttons) {
        if (button.checked) {
            selected_hair_type = button.value;
        }
    }
    // Save hair type to page storage
    sessionStorage.setItem("hair_type", selected_hair_type);

    // Get list of selected traits
    var trait_checkboxes = document.querySelectorAll("input[name='traits']");
    var selected_traits = [];
    var storageTraits = "";
    var box;
    for (box of trait_checkboxes) {
        if (box.checked) {
            selected_traits.push(box.value);
            storageTraits += box.value + " ";
        }
    }
    // Remove trailing space
    storageTraits.trim();
    sessionStorage.setItem("traits", storageTraits);

    // Unhide the breeds that match the hair type, and
    // have at least one of the desired traits
    var b;
    var show_breed;
    var trait;
    for (b of breeds) {
        show_breed = false;
        // Check for hair type match
        if (b.getAttribute("hair").indexOf(selected_hair_type) !== -1) {
            for (trait of selected_traits) {
                // Check for a matching trait
                if (b.getAttribute("traits").indexOf(trait) !== -1) {
                    show_breed = true;
                    break;
                }
            }
        }

        // Explicitly hide breeds that shouldn't be shown, so
        // subsequent searches don't accumulate incorrect results
        setBreedVisibility(b, show_breed);
    }
}

function resetFilter(e) {
    "use strict";
    // Prevent default form action
    e.preventDefault();

    // Ensure the breed list border is hidden
    var border_el = document.getElementById("breed_list");
    border_el.style.display = "";

    // Clear breed visibility
    var b;
    for (b of breeds) {
        setBreedVisibility(b, false);
    }

    // Clear saved search data
    clearPageStorage();

    // Reset form to empty
    clearSearchForm();
}

function clearPageStorage() {
    "use strict";
    sessionStorage.setItem("hair_type", "");
    sessionStorage.setItem("traits", "");
}

function clearSearchForm() {
    "use strict";
    setFormHairType("short");
    setFormTraits("");
}

function searchSaved() {
    "use strict";
    return sessionStorage.getItem("hair_type") !== "" && sessionStorage.getItem("traits") !== "";
}

function setFormHairType(hair_type) {
    "use strict";
    var hair_radio_buttons = document.querySelectorAll("input[name='hair_length']");
    var button;
    for (button of hair_radio_buttons) {
        if (hair_type === button.value) {
            button.checked = true;
        }
    }
}

function setFormTraits(traits) {
    "use strict";
    var trait_checkboxes = document.querySelectorAll("input[name='traits']");
    var box;
    for (box of trait_checkboxes) {
        if (traits.indexOf(box.value) !== -1) {
            box.checked = true;
        } else {
            box.checked = false;
        }
    }
}

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

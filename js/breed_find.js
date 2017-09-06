// Get list of all available breeds
var breeds = document.getElementsByClassName('breed');
for (b of breeds) {
  if(true || b.hasAttribute('traits')
  && b.getAttribute('traits').indexOf('large') != -1){
    b.hidden = false;
  }
}

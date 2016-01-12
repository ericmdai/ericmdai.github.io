document.querySelector('.wrap').addEventListener('mousemove', function(e){
  var x = (e.pageX * -1 / 2), y = (e.pageY * -1 / 2);
  this.style.backgroundPosition = x + 'px ' + y + 'px';
});
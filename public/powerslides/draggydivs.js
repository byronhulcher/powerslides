/* This code was lifted from https://glitch.com/edit/#!/draggydivs by Jenn Schiffer */
(function () {

  var draggydivs = document.getElementsByClassName('draggydiv');
  var minimizedList = document.getElementById('draggydivs-minimized');
  var buttonsDrag = [];
  var buttonsMinimize = [];
  var zIndex = 1000;
  var pos = { x: 0, y: 0 };
  var currentDraggy;

  // event callbacks
  var onDragClick = (e) => {
    pos = { x: e.pageX, y: e.pageY };
    currentDraggy = e.target.closest('.draggydiv');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);

    zIndex++;
    currentDraggy.style.zIndex = zIndex;
  };

  var onMinimizeClick = (e) => {
    currentDraggy = e.target.closest('.draggydiv');

    if ( !minimizedList ) {
      minimizedList = document.createElement('ul');
      minimizedList.className = 'draggydivs-minimized';
      document.body.appendChild(minimizedList);
    }

    var minimizedItem = document.createElement('li');

    minimizedItem.innerHTML = `<a class="draggydiv-title" href=#>${currentDraggy.getAttribute('title')}</a>`;
    minimizedList.appendChild(minimizedItem);

    minimizedItem.addEventListener('click', onMinimizedItemClick);

    currentDraggy.style.display = 'none';
  };

  var onMinimizedItemClick = (e) => {
    var thisMinimizedItem = e.target;
    var thisMinimizedItemTitle = thisMinimizedItem.innerHTML;

    var draggyToExpand = document.querySelectorAll(`[title="${thisMinimizedItemTitle}"]`);

    zIndex++;
    draggyToExpand[0].style.zIndex = zIndex;
    draggyToExpand[0].style.display = 'block';

    thisMinimizedItem.closest('li').remove();
  };

  var onMove = (e) => {
    var curr = { x: e.pageX, y: e.pageY };
    var dx = curr.x - pos.x;
    var dy = curr.y - pos.y;

    currentDraggy.style.left = parseInt(currentDraggy.style.left) + dx;
    currentDraggy.style.top = parseInt(currentDraggy.style.top) + dy;
    currentDraggy.style.right =  'unset';
    currentDraggy.style.bottom = 'unset';
    pos = curr;
  };

  var onMouseUp = (e) => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('touchend', onMouseUp);
  };

   // init draggydiv styling and button events
  for ( let i = 0; i < draggydivs.length; i++ ) {
    draggydivs[i].style.position = 'absolute';
    draggydivs[i].style.zIndex = zIndex;
    draggydivs[i].style.top =  parseInt(getComputedStyle(draggydivs[i]).top)  ? parseInt(getComputedStyle(draggydivs[i]).top) : 0;
    draggydivs[i].style.left =  parseInt(getComputedStyle(draggydivs[i]).left)  ? parseInt(getComputedStyle(draggydivs[i]).left) : 0;
    draggydivs[i].style.right =  'unset';
    draggydivs[i].style.bottom = 'unset';
    zIndex++;

    buttonsDrag = buttonsDrag.concat(Array.prototype.slice.call(draggydivs[i].getElementsByClassName('draggydivs-drag')));
    buttonsMinimize = buttonsMinimize.concat(Array.prototype.slice.call(draggydivs[i].getElementsByClassName('draggydivs-minimize')));

    for ( let j = 0; j < buttonsDrag.length; j++ ) {
      buttonsDrag[j].addEventListener('mousedown', onDragClick);
      buttonsDrag[j].addEventListener('touchstart', onDragClick);
    };

    for ( let k = 0; k < buttonsMinimize.length; k++ ) {
      buttonsMinimize[k].addEventListener('click', onMinimizeClick);
    };
  }

}());
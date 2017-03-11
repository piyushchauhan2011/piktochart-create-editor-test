function dragMoveListener(event) {
  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

// Start here

var allImages = document.getElementById('allImages');
var fileInput = document.getElementsByName('upload')[0];
var imageUpload = document.getElementById('submit');
var blockEl = document.getElementsByClassName('block')[0];
var addText = document.getElementById('addText');

addText.addEventListener('click', function (e) {
  var txt = prompt('Please enter text');
  if (txt !== null && txt !== '') {
    var txtEl = document.createElement('span');
    txtEl.style.display = 'inline-block';
    txtEl.style.paddingRight = '3em';
    txtEl.style.paddingTop = '0.25em';
    txtEl.innerText = txt;
    var idiv = interactableDiv(txtEl);
    blockEl.appendChild(idiv);
  }
});

imageUpload.addEventListener('click', function (e) {
  var formData = new FormData();
  var file = fileInput.files[0];
  if (file) {
    // Check the file type.
    if (file.type.match('image/*')) {
      // Add the file to the request.
      formData.append('upload', file, file.name);
    }
    unfetch('/uploads', {
      method: 'POST',
      body: formData
    }).then(function (r) {
      if (r.status === 200) {
        fileInput.value = '';
        refreshImages();
      }
    });
  } else {
    alert('Choose a file');
  }
});

function refreshImages() {
  unfetch('/images', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (r) {
    if (r.status === 404) {
      // Error
    } else {
      return r.json();
    }
  }).then(function (data) {
    renderImages(data);
  });
}

function renderImages(images) {
  allImages.innerHTML = '';
  images.forEach(function (image) {
    renderImage(image);
  });
}

function renderImage(image) {
  var li = document.createElement('li');
  var img = createImage(image);
  img.id = image;
  img.width = '50';
  img.height = '50';
  img.classList.add('img-rounded');

  img.addEventListener('click', function (e) {
    var img = createImage(e.target.src);
    var idiv = interactableDiv(img);
    blockEl.appendChild(idiv);
  });

  li.appendChild(img);
  allImages.appendChild(li);
}

function interactableDiv(el) {
  var closableDiv = createClosableDiv(el);
  closableDiv.style.position = 'absolute';

  // target elements with the "draggable" class
  interact(closableDiv)
    .draggable({
      // enable inertial throwing
      inertia: false,
      // keep the element within the area of it's parent
      restrict: {
        restriction: 'parent',
        endOnly: true,
        elementRect: {
          top: 0,
          left: 0,
          bottom: 1,
          right: 1
        }
      },
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {}
    });
  // blockImgEl.style.boxShadow = '0 0 5px #cacaca';
  // blockImgEl.style.padding = '1em';
  // blockImgEl.style.background = '#fafafa';

  // targ.style.left = coordX + e.clientX - offsetX + 'px';
  // targ.style.top = coordY + e.clientY - offsetY + 'px';

  return closableDiv;
}

function createClosableDiv(el) {
  var cspan = document.createElement('div');
  cspan.style.display = 'inline-block';

  var cbutton = document.createElement('a');
  cbutton.text = 'x';
  cbutton.style.position = 'absolute';
  cbutton.style.top = '0';
  cbutton.style.right = '0';
  cbutton.style.border = '1px solid rgb(250, 250, 250)';
  cbutton.style.textAlign = 'center';
  cbutton.style.padding = '0.25em 1em';
  cbutton.style.background = '#fafafa';
  cbutton.style.color = '#a94442';
  cbutton.style.cursor = 'pointer';
  cbutton.style.borderRadius = '50%';

  cbutton.addEventListener('click', function () {
    blockEl.removeChild(cspan);
  });

  cspan.appendChild(cbutton);
  cspan.appendChild(el);

  return cspan;
}

function createImage(image) {
  var img = document.createElement('img');
  img.src = image;
  return img;
}

refreshImages();
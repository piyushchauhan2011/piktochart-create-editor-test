// <li><img src="images/sample.jpeg" class="img-rounded" /></li>

var allImages = document.getElementById('allImages');
var fileInput = document.getElementsByName('upload')[0];
var imageUpload = document.getElementById('submit');
var blockEl = document.getElementsByClassName('block')[0];

function startDrag(e) {
  // determine event object
  if (!e) {
    var e = window.event;
  }
  if (e.preventDefault) e.preventDefault();

  // IE uses srcElement, others use target
  targ = e.target ? e.target : e.srcElement;

  if (targ.className != 'dragme') {
    return
  };
  // calculate event X, Y coordinates
  offsetX = e.clientX;
  offsetY = e.clientY;

  // assign default values for top and left properties
  if (!targ.style.left) {
    targ.style.left = '0px'
  };
  if (!targ.style.top) {
    targ.style.top = '0px'
  };

  // calculate integer values for top and left 
  // properties
  coordX = parseInt(targ.style.left);
  coordY = parseInt(targ.style.top);
  drag = true;

  // move div element
  document.onmousemove = dragDiv;
  return false;
}

function dragDiv(e) {
  if (!drag) {
    return
  };
  if (!e) {
    var e = window.event
  };
  // var targ=e.target?e.target:e.srcElement;
  // move div element
  targ.style.left = coordX + e.clientX - offsetX + 'px';
  targ.style.top = coordY + e.clientY - offsetY + 'px';
  return false;
}

function stopDrag() {
  drag = false;
}
window.onload = function () {
  document.onmousedown = startDrag;
  document.onmouseup = stopDrag;
}

imageUpload.addEventListener('click', function (e) {
  var formData = new FormData();
  var file = fileInput.files[0];
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
      refreshImages();
    }
  });
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
    var blockImgEl = createImage(e.target.src);
    blockImgEl.style.position = 'absolute';
    blockImgEl.className = 'dragme';

    blockEl.appendChild(blockImgEl);
  });

  li.appendChild(img);
  allImages.appendChild(li);
}

function createImage(image) {
  var img = document.createElement('img');
  img.src = image;
  return img;
}

refreshImages();
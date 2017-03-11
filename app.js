// <li><img src="images/sample.jpeg" class="img-rounded" /></li>

var allImages = document.getElementById('allImages');
var fileInput = document.getElementsByName('upload')[0];
var imageUpload = document.getElementById('submit');
var blockEl = document.getElementsByClassName('block')[0];

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
    // var blockImgEl = createImage(e.target.src);
    var blockImgEl = createClosableImgDiv(e.target.src);
    blockImgEl.style.position = 'relative';
    // blockImgEl.style.boxShadow = '0 0 5px #cacaca';
    // blockImgEl.style.padding = '1em';
    // blockImgEl.style.background = '#fafafa';

    // targ.style.left = coordX + e.clientX - offsetX + 'px';
    // targ.style.top = coordY + e.clientY - offsetY + 'px';

    blockEl.appendChild(blockImgEl);
  });

  li.appendChild(img);
  allImages.appendChild(li);
}

function createClosableImgDiv(image) {
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
  cbutton.style.background = '#767676';
  cbutton.style.color = '#fafafa';
  cbutton.style.cursor = 'pointer';

  cbutton.addEventListener('click', function() {
    blockEl.removeChild(cspan);
  });

  var img = createImage(image);

  cspan.appendChild(cbutton);
  cspan.appendChild(img);

  return cspan;
}

function createImage(image) {
  var img = document.createElement('img');
  img.src = image;
  return img;
}

refreshImages();
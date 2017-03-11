'use strict';

var utils = {
  createTxt: function(txt) {
    var txtEl = document.createElement('span');
    txtEl.style.display = 'inline-block';
    txtEl.style.paddingRight = '3em';
    txtEl.style.paddingTop = '0.25em';
    txtEl.innerText = txt;
    return txtEl;
  },

  createImg: function (src) {
    var img = document.createElement('img');
    img.src = src;
    return img;
  },

  callbackFn: function(state, value) {
    return function(type, x, y) {
      if (type === 'remove') {
        var index = state.canvas.elements.indexOf(value);
        state.canvas.elements.splice(index, 1);
        state.canvas.total -= 1;
      } else if (type === 'add') {
        state.canvas.total += 1;
        value.id = state.canvas.total;
        state.canvas.elements.push(value);
      } else if (type === 'update') {
        value.x = x;
        value.y = y;
      }
    }
  },

  createCloseBtn: function (txt) {
    var cbutton = document.createElement('a');
    cbutton.text = txt;
    cbutton.style.position = 'absolute';
    cbutton.style.top = '0px';
    cbutton.style.right = '0px';
    // cbutton.style.border = '1px solid rgb(250, 250, 250)';
    cbutton.style.textAlign = 'center';
    cbutton.style.padding = '0.25em 1em';
    cbutton.style.background = 'rgb(250, 250, 250)';
    cbutton.style.color = 'rgb(170, 170, 170)';
    cbutton.style.cursor = 'pointer';
    cbutton.style.borderRadius = '50%';
    cbutton.style.display = 'none';

    return cbutton;
  },

  createClosableDiv: function (el, cb) {
    var cspan = document.createElement('div');
    cspan.style.display = 'inline-block';

    var cbutton = utils.createCloseBtn('x');
    cbutton.addEventListener('mouseover', function (e) {
      cbutton.style.display = 'block';
      cbutton.style.color = '#a91772';
    });

    cbutton.addEventListener('mouseout', function (e) {
      cbutton.style.display = 'none';
      cbutton.style.color = '#aaa';
    });
    cbutton.addEventListener('click', function (e) {
      app.blockEl.removeChild(cspan);
      cb('remove');
    });

    el.addEventListener('mouseover', function (e) {
      cbutton.style.display = 'block';
    });
    el.addEventListener('mouseout', function (e) {
      cbutton.style.display = 'none';
    });

    cspan.appendChild(cbutton);
    cspan.appendChild(el);

    return cspan;
  },

  createInteractDiv: function (el, cb, x, y) {
    var closableDiv = utils.createClosableDiv(el, cb);
    closableDiv.style.position = 'absolute';

    if (x) { closableDiv.dataset.x = x; }
    if (y) { closableDiv.dataset.y = y; }

    if (x && y) {
      closableDiv.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    // utils.makeDraggable(closableDiv);

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
        onmove: utils.dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
          var dataset = event.target.dataset;
          cb('update', dataset.x, dataset.y);
        }
      });

    return closableDiv;
  },

  dragMoveListener: function (event) {
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
  },

  // makeDraggable: function(el) {
  // var drag = false;
  // var mouseup = Rx.Observable.fromEvent(closableDiv, 'mouseup');
  // var mouseout = Rx.Observable.fromEvent(closableDiv, 'mouseout');
  // var mousemove = Rx.Observable.fromEvent(closableDiv, 'mousemove');
  // var mousedown = Rx.Observable.fromEvent(closableDiv, 'mousedown');

  // mouseup.subscribe(function() { drag = false; });
  // mouseout.subscribe(function() { drag = false; });

  // var mousedrag = mousedown.flatMap(function(md) {
  //   drag = true;
  //   var startX = md.clientX + window.scrollX,
  //     startY = md.clientY + window.scrollY,
  //     startLeft = parseInt(closableDiv.style.left, 10) || 0,
  //     startTop = parseInt(closableDiv.style.top, 10) || 0;

  //   return mousemove.map(function(mm) {
  //     mm.preventDefault();

  //     return {
  //       left: startLeft + mm.clientX - startX,
  //       top: startTop + mm.clientY - startY
  //     };
  //   }).takeWhile(function() { return drag; });
  // });

  // var subscription = mousedrag.subscribe(function(pos) {
  //   closableDiv.style.top = pos.top + 'px';
  //   closableDiv.style.left = pos.left + 'px';
  // });
  // }
};

var app = {
  allImages: document.getElementById('allImages'),
  fileInput: document.getElementsByName('upload')[0],
  imgUpload: document.getElementById('submit'),
  blockEl: document.getElementsByClassName('block')[0],
  addText: document.getElementById('addText'),
  exportEl: document.getElementById('export'),

  state: {
    canvas: {
      total: 0,
      elements: []
    }
  },

  run: function () {
    app.exportEl.addEventListener('click', app.exportFn);
    app.addText.addEventListener('click', app.addTextFn);
    app.imgUpload.addEventListener('click', app.imgUploadFn);
    app.refreshImgs();

    // restore state
    unfetch('/state', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (r) {
      return r.json();
    }).then(function(data) {
      app.state = data;
      app.renderState(data.canvas);
    });
  },

  renderState: function(canvas) {
    canvas.elements.forEach(function(el) {
      var cb = utils.callbackFn(app.state, el);
      if (el.type === 'image') {
        // create image node
        var img = utils.createImg(el.value);
        var idiv = utils.createInteractDiv(img, cb, el.x, el.y);
        app.blockEl.appendChild(idiv);
      } else if (el.type === 'text') {
        // create text node
        var txt = utils.createTxt(el.value);
        var idiv = utils.createInteractDiv(txt, cb, el.x, el.y);
        app.blockEl.appendChild(idiv);
      }
    });
  },

  imgUploadFn: function (e) {
    var formData = new FormData();
    var file = app.fileInput.files[0];
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
          app.fileInput.value = '';
          app.refreshImgs();
        }
      });
    } else {
      alert('Choose a file');
    }
  },

  addTextFn: function (e) {
    var txt = prompt('Please enter text');
    if (txt !== null && txt !== '') {
      var elState = {
        id: "",
        type: "text",
        value: txt,
        x: "0",
        y: "0"
      };

      var cb = utils.callbackFn(app.state, elState);
      var txtEl = utils.createTxt(txt);
      var idiv = utils.createInteractDiv(txtEl, cb);
      app.blockEl.appendChild(idiv);
      cb('add');
    }
  },

  addImgToCanvas: function (e) {
    var elState = {
      type: "image",
      value: e.target.src,
      x: "0",
      y: "0"
    };

    var cb = utils.callbackFn(app.state, elState);
    var img = utils.createImg(e.target.src);
    var idiv = utils.createInteractDiv(img, cb);
    app.blockEl.appendChild(idiv);
    cb('add');
  },

  refreshImgs: function () {
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
      app.renderImgs(data);
    });
  },

  renderImgs: function (images) {
    allImages.innerHTML = '';
    images.forEach(function (image) {
      app.renderImg(image);
    });
  },

  renderImg: function (src) {
    var li = document.createElement('li');
    var img = utils.createImg(src);
    img.id = src;
    img.width = '50';
    img.height = '50';
    img.classList.add('img-rounded');

    img.addEventListener('click', app.addImgToCanvas);

    li.appendChild(img);
    allImages.appendChild(li);
  },

  exportFn: function (e) {
    unfetch('/state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(app.state)
    }).then(function(r) {
      if (r.status === 200) {
        return r.json();
      } else {
        return { error: "Error" };
      }
    }).then(function(data) {
      console.log(data);
      alert('Canvas saved successfully');
    });

    // html2canvas(blockEl, {
    //   onrendered: function(canvas) {
    //     document.body.appendChild(canvas);
    //   }
    // });

    // Add the export logic
    // Export the html in a state format ?
    // Reload the state and add event listeners
  }
};

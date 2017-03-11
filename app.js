'use strict';

// Utils Library
var utils = {
  /**
   * Create a text node with given txt
   * having some basic styles.
   * @param {String} txt - text value
   */
  createTxt: function(txt) {
    var txtEl = document.createElement('span');
    txtEl.style.display = 'inline-block';
    txtEl.style.paddingRight = '3em';
    txtEl.style.paddingTop = '0.25em';
    txtEl.innerText = txt;
    return txtEl;
  },

  /**
   * Create an image node with given src
   * @param {String} src - src value
   */
  createImg: function (src) {
    var img = document.createElement('img');
    img.src = src;
    return img;
  },

  /**
   * Callback function to create function
   * for handling the basic functions for state
   * like adding, updating and removing the element states
   * @param {Object} state - current app state
   * @param {Object} value - current element state
   */
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

  /**
   * Create a close button node with given txt
   * having some basic styles
   * @param {String} txt - text string
   */
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

  /**
   * Create a closable div node
   * that wraps the image or text element
   * and attaches a state callback function
   * to remove the element from DOM and state
   * @param {Element}  el - image or text node
   * @param {Function} cb - callback function
   */
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

  /**
   * Create a draggable div node with given
   * that wraps the image or text element.
   * It attaches a state callback function
   * that is passed to closable div and also
   * used to update the state whenever drag happens.
   * x and y are used if we restore the state.
   * @param {Element}  el - image or text node
   * @param {Function} cb - callback function
   * @param {String}   x  - x coordinate of div in canvas space
   * @param {String}   y  - y coordinate of div in canvas space
   */
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

  /**
   * This is used in createInteractDiv
   * for updating the node on every dragmove event
   * @param {Event} event - event
   */
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

  /**
   * Create a node draggable using RxJS
   * @param {Element} el - node
   */
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

// Main App
var app = {
  // Main element refrences
  allImages: document.getElementById('allImages'),
  fileInput: document.getElementsByName('upload')[0],
  imgUpload: document.getElementById('submit'),
  blockEl: document.getElementsByClassName('block')[0],
  addText: document.getElementById('addText'),
  exportEl: document.getElementById('export'),

  // App state
  state: {
    canvas: {
      total: 0,
      elements: []
    }
  },

  /**
   * Main entry point of app
   */
  run: function () {
    // Attach click listener for exporting
    app.exportEl.addEventListener('click', app.exportFn);
    // Attach click listener for adding text
    app.addText.addEventListener('click', app.addTextFn);
    // Attach click listener for image uploading
    app.imgUpload.addEventListener('click', app.imgUploadFn);

    // Load images from server and display i.e. refresh
    app.refreshImgs();

    // restore state by fetching it from server
    // unfetch is like github fetch with less bytes
    unfetch('/state', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (r) {
      return r.json();
    }).then(function(data) {
      app.state = data;
      // Render state with image and text nodes on canvas
      app.renderState(data.canvas);
    });
  },

  /**
   * Render initial state fetched from server
   * Loop through each canvas element and
   * render based on image or text
   * using utils create functions to
   * correctly add interaction and state callbacks
   * @param {Object} canvas - canvas state
   */
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

  /**
   * Upload image to server
   */
  imgUploadFn: function () {
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

  /**
   * Add a new text node to canvas
   */
  addTextFn: function () {
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

  /**
   * Add a new image node to canvas
   * grabs the src from event target
   * @param {Event} e - event target
   */
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

  /**
   * Load images from server and
   * render on sidebar using renderImgs
   */
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

  /**
   * Clear the sidebar images
   * and render new images by
   * calling renderImg for each one
   */
  renderImgs: function (images) {
    allImages.innerHTML = '';
    images.forEach(function (image) {
      app.renderImg(image);
    });
  },

  /**
   * Render a single image given src value
   * and attaches event listener to adding it to canvas
   * with some basic styles
   */
  renderImg: function (src) {
    var li = document.createElement('li');
    var img = utils.createImg(src);
    img.id = src;
    img.width = '50';
    img.height = '50';
    img.classList.add('img-rounded');

    // Click listener for adding the image to canvas
    img.addEventListener('click', app.addImgToCanvas);

    li.appendChild(img);
    allImages.appendChild(li);
  },

  /**
   * Exports the current state by posting
   * to /state which saves it in state.json file
   */
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

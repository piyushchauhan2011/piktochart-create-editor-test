(function(window, document) {
  'use strict';

  var utils = {
    createImg: function(src) {
      var img = document.createElement('img');
      img.src = src;
      return img;
    },

    createCloseBtn: function(txt) {
      var cbutton = document.createElement('a');
      cbutton.text = txt;
      cbutton.style.position = 'absolute';
      cbutton.style.top = '0';
      cbutton.style.right = '0';
      // cbutton.style.border = '1px solid rgb(250, 250, 250)';
      cbutton.style.textAlign = 'center';
      cbutton.style.padding = '0.25em 1em';
      cbutton.style.background = 'rgb(250,250,250)';
      cbutton.style.color = '#aaa';
      cbutton.style.cursor = 'pointer';
      cbutton.style.borderRadius = '50%';
      cbutton.style.display = 'none';

      return cbutton;
    },

    createClosableDiv: function(el) {
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

    createInteractDiv: function(el) {
      var closableDiv = utils.createClosableDiv(el);
      closableDiv.style.position = 'absolute';

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
          onend: function (event) {}
        });

      return closableDiv;
    },

    dragMoveListener: function(event) {
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

    run: function() {
      app.exportEl.addEventListener('click', app.exportFn);
      app.addText.addEventListener('click', app.addTextFn);
      app.imgUpload.addEventListener('click', app.imgUploadFn);
      app.refreshImgs();
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
        var txtEl = document.createElement('span');
        txtEl.style.display = 'inline-block';
        txtEl.style.paddingRight = '3em';
        txtEl.style.paddingTop = '0.25em';
        txtEl.innerText = txt;
        var idiv = utils.createInteractDiv(txtEl);
        app.blockEl.appendChild(idiv);
      }
    },

    refreshImgs: function() {
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

    renderImgs: function(images) {
      allImages.innerHTML = '';
      images.forEach(function (image) {
        app.renderImg(image);
      });
    },

    renderImg: function(src) {
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

    addImgToCanvas: function(e) {
      var img = utils.createImg(e.target.src);
      var idiv = utils.createInteractDiv(img);
      app.blockEl.appendChild(idiv);
    },

    exportFn: function(e) {
      // html2canvas(blockEl, {
      //   onrendered: function(canvas) {
      //     document.body.appendChild(canvas);
      //   }
      // });

      // Add the export logic
      // Export the html in a state format ?
      // Reload the state and add event listeners
      alert('not implemented');
    }
  };

  app.run();
})(window, document);

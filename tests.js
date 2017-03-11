QUnit.test("test create image", function (assert) {
  var src = 'http://localhost:8000/images/uploads-1462948459604.png';
  var img = utils.createImg(src);
  assert.equal(img.src, src, 'src value matches');
});

QUnit.test("test create close btn", function (assert) {
  var txt = 'x';
  var cbtn = utils.createCloseBtn(txt);
  assert.equal(cbtn.text, txt);
  assert.equal(cbtn.style.position, 'absolute');
  assert.equal(cbtn.style.top, '0px');
  assert.equal(cbtn.style.right, '0px');
  assert.equal(cbtn.style.textAlign, 'center');
  assert.equal(cbtn.style.padding, '0.25em 1em');
  assert.equal(cbtn.style.background, 'rgb(250, 250, 250)');
  assert.equal(cbtn.style.color, 'rgb(170, 170, 170)');
  assert.equal(cbtn.style.cursor, 'pointer');
  assert.equal(cbtn.style.borderRadius, '50%');
  assert.equal(cbtn.style.display, 'none');
});

QUnit.test("test state callback actions", function (assert) {
  var state = {
    canvas: {
      total: 0,
      elements: []
    }
  };

  var elState = {
    type: 'text',
    value: 'some',
    x: '23',
    y: '24'
  };

  var cb = utils.callbackFn(state, elState);
  cb('add');

  assert.equal(state.canvas.total, 1, 'state total is 1');
  var index = state.canvas.elements.indexOf(elState);
  assert.equal(index, 0, 'el state added to zero');
  var value = state.canvas.elements[index];
  assert.equal(value.type, 'text', 'el state type is text');
  assert.equal(value.value, 'some', 'el state value is some');
  assert.equal(value.x, '23', 'el state x is 23');
  assert.equal(value.y, '24', 'el state y is 24');

  cb('update', '99', '99');
  assert.equal(state.canvas.total, 1, 'state total is still 1');
  assert.equal(value.x, '99', 'el state x updated - 99');
  assert.equal(value.y, '99', 'el state y updated - 99');

  cb('remove');
  assert.equal(state.canvas.total, 0, 'state total is 0');
});

QUnit.test("test create image", function (assert) {
  var src = 'http://localhost:8000/images/uploads-1462948459604.png';
  var img = utils.createImg(src);
  assert.equal(img.src, src);
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
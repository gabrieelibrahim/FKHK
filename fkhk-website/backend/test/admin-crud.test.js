const assert = require('node:assert/strict');
const test = require('node:test');

const achievementController = require('../src/controllers/achievementController');

function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('achievement can be updated and deleted by its id', () => {
  const createRes = response();
  achievementController.createAchievement({ body: { name: 'Test Member', title: 'Initial', year: '2026' } }, createRes);
  assert.equal(createRes.statusCode, 201);

  const id = createRes.body.id;
  const updateRes = response();
  achievementController.updateAchievement({ params: { id: String(id) }, body: { name: 'Updated Member', title: 'Updated', year: '2027' } }, updateRes);
  assert.equal(updateRes.statusCode, 200);
  assert.equal(updateRes.body.title, 'Updated');

  const deleteRes = response();
  achievementController.deleteAchievement({ params: { id: String(id) } }, deleteRes);
  assert.equal(deleteRes.statusCode, 200);

  const missingRes = response();
  achievementController.updateAchievement({ params: { id: String(id) }, body: { title: 'Again' } }, missingRes);
  assert.equal(missingRes.statusCode, 404);
});

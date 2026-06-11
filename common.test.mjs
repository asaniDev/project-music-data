import assert from "node:assert";
import test from "node:test";
import { countUsers } from "./common.mjs";
import { getListeningAnswers } from "./analytics.mjs";

test("User count is correct", () => {
  assert.equal(countUsers(), 4);
});

test("calculates answers on demand for a user with listening history", () => {
  const answers = getListeningAnswers("1");

  assert.equal(answers.userID, "1");
  assert.ok(answers.listenCount > 0);
  assert.ok(answers.mostListenedSong.label.includes(" by "));
  assert.ok(answers.mostListenedArtist.value > 0);
  assert.ok(answers.longestStreak.value >= 1);
  assert.ok(answers.topGenres.length <= 3);
});

test("hides non-applicable answers for a user without listening history", () => {
  const answers = getListeningAnswers("4");

  assert.equal(answers.listenCount, 0);
  assert.equal(answers.mostListenedSong, undefined);
  assert.equal(answers.fridayNightSong, undefined);
  assert.equal(answers.longestStreak, null);
  assert.deepEqual(answers.songsEveryListeningDay, []);
  assert.deepEqual(answers.topGenres, []);
});

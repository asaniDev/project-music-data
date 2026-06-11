import { countUsers, listUserIDs } from "./common.mjs";

//window.onload = function () {
//  document.querySelector("#results").innerText =
//    `There are ${countUsers()} users`;
//};

const userSelect = document.querySelector("#user-select");
const results = document.querySelector("#results");

function formatSeconds(seconds) {
  const minutes = Math.round(seconds / 60);
  return `${minutes.toLocaleString()} minutes`;
}

function createAnswer(question, answer) {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const paragraph = document.createElement("p");

  heading.textContent = question;
  paragraph.textContent = answer;
  section.append(heading, paragraph);

  return section;
}

function renderList(question, values) {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const list = document.createElement("ol");

  heading.textContent = question;

  for (const value of values) {
    const item = document.createElement("li");
    item.textContent = value;
    list.append(item);
  }

  section.append(heading, list);
  return section;
}

function renderResults(userID) {
  const answers = getListeningAnswers(userID);
  const fragment = document.createDocumentFragment();

  results.replaceChildren();
  results.hidden = false;

  const intro = document.createElement("p");
  intro.className = "summary";
  intro.textContent = `Showing answers for user ${answers.userID}. ${answers.listenCount.toLocaleString()} listens were found.`;
  fragment.append(intro);

  if (answers.mostListenedSong) {
    fragment.append(
      createAnswer(
        "What was the user's most often listened to song according to the data?",
        `${answers.mostListenedSong.label} (${answers.mostListenedSong.value.toLocaleString()} listens)`,
      ),
    );
  }

  if (answers.mostListenedArtist) {
    fragment.append(
      createAnswer(
        "What was the user's most often listened to artist according to the data?",
        `${answers.mostListenedArtist.label} (${answers.mostListenedArtist.value.toLocaleString()} listens)`,
      ),
    );
  }

  if (answers.fridayNightSong) {
    fragment.append(
      createAnswer(
        "What was the user's most often listened to song on Friday nights?",
        `${answers.fridayNightSong.label} (${answers.fridayNightSong.value.toLocaleString()} listens)`,
      ),
    );
  }

  if (answers.mostListenedSongByTime) {
    fragment.append(
      createAnswer(
        "What was the user's most listened to song by listening time?",
        `${answers.mostListenedSongByTime.label} (${formatSeconds(answers.mostListenedSongByTime.value)})`,
      ),
    );
  }

  if (answers.mostListenedArtistByTime) {
    fragment.append(
      createAnswer(
        "What was the user's most listened to artist by listening time?",
        `${answers.mostListenedArtistByTime.label} (${formatSeconds(answers.mostListenedArtistByTime.value)})`,
      ),
    );
  }

  if (answers.fridayNightSongByTime) {
    fragment.append(
      createAnswer(
        "What was the user's most listened to Friday night song by listening time?",
        `${answers.fridayNightSongByTime.label} (${formatSeconds(answers.fridayNightSongByTime.value)})`,
      ),
    );
  }

  if (answers.longestStreak) {
    fragment.append(
      createAnswer(
        "What song did the user listen to the most times in a row?",
        `${answers.longestStreak.label} (${answers.longestStreak.value.toLocaleString()} times in a row)`,
      ),
    );
  }

  if (answers.songsEveryListeningDay.length > 0) {
    fragment.append(
      renderList(
        "Songs listened to on every day this user listened to music",
        answers.songsEveryListeningDay,
      ),
    );
  }

  if (answers.topGenres.length > 0) {
    fragment.append(
      renderList(
        "What were the user's top three genres by number of listens?",
        answers.topGenres.map(
          (genre) => `${genre.label} (${genre.value.toLocaleString()} listens)`,
        ),
      ),
    );
  }

  results.append(fragment);
}

function initialiseUsers() {
  for (const userID of listUserIDs()) {
    const option = document.createElement("option");
    option.value = userID;
    option.textContent = `User ${userID}`;
    userSelect.append(option);
  }
}

userSelect.addEventListener("change", (event) => {
  const userID = event.target.value;

  if (userID) {
    renderResults(userID);
  } else {
    results.hidden = true;
    results.replaceChildren();
  }
});

initialiseUsers();

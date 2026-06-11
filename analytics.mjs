import { getListenEvents, getSong } from "./data.mjs";

const FRIDAY = 5;
const SATURDAY = 6;
const FRIDAY_5PM = 17 * 60 * 60;
const SATURDAY_4AM = 4 * 60 * 60;

const byTitle = (a, b) => a.label.localeCompare(b.label);

function songLabel(song) {
  return `${song.title} by ${song.artist}`;
}

function getEvents(userID) {
  return [...(getListenEvents(userID) ?? [])].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );
}

function topBy(items, labelFor, valueFor) {
  const totals = new Map();

  for (const item of items) {
    const label = labelFor(item);
    totals.set(label, (totals.get(label) ?? 0) + valueFor(item));
  }

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || byTitle(a, b))[0];
}

function topManyBy(items, labelFor, valueFor, limit) {
  const totals = new Map();

  for (const item of items) {
    const label = labelFor(item);
    totals.set(label, (totals.get(label) ?? 0) + valueFor(item));
  }

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || byTitle(a, b))
    .slice(0, limit);
}

function isFridayNight(event) {
  const date = new Date(event.timestamp);
  const day = date.getDay();

  return (
    (day === FRIDAY && event.seconds_since_midnight >= FRIDAY_5PM) ||
    (day === SATURDAY && event.seconds_since_midnight < SATURDAY_4AM)
  );
}

function withSongs(events) {
  return events
    .map((event) => ({ event, song: getSong(event.song_id) }))
    .filter(({ song }) => song);
}

function longestSongStreak(items) {
  let best = null;
  let currentSongID = null;
  let currentCount = 0;

  for (const item of items) {
    if (item.event.song_id === currentSongID) {
      currentCount += 1;
    } else {
      currentSongID = item.event.song_id;
      currentCount = 1;
    }

    if (!best || currentCount > best.count) {
      best = { song: item.song, count: currentCount };
    }
  }

  return best ? { label: songLabel(best.song), value: best.count } : null;
}

function songsHeardEveryListeningDay(items) {
  const songsByDay = new Map();

  for (const item of items) {
    const day = item.event.timestamp.slice(0, 10);
    const songs = songsByDay.get(day) ?? new Set();
    songs.add(item.event.song_id);
    songsByDay.set(day, songs);
  }

  if (songsByDay.size === 0) {
    return [];
  }

  const [firstDaySongs, ...otherDaySongs] = [...songsByDay.values()];
  const commonSongIDs = [...firstDaySongs].filter((songID) =>
    otherDaySongs.every((songs) => songs.has(songID)),
  );

  return commonSongIDs
    .map(getSong)
    .filter(Boolean)
    .map(songLabel)
    .sort((a, b) => a.localeCompare(b));
}

export function getListeningAnswers(userID) {
  const items = withSongs(getEvents(userID));
  const fridayNightItems = items.filter(({ event }) => isFridayNight(event));

  return {
    userID,
    listenCount: items.length,
    mostListenedSong: topBy(
      items,
      ({ song }) => songLabel(song),
      () => 1,
    ),
    mostListenedArtist: topBy(
      items,
      ({ song }) => song.artist,
      () => 1,
    ),
    fridayNightSong: topBy(
      fridayNightItems,
      ({ song }) => songLabel(song),
      () => 1,
    ),
    mostListenedSongByTime: topBy(
      items,
      ({ song }) => songLabel(song),
      ({ song }) => song.duration_seconds,
    ),
    mostListenedArtistByTime: topBy(
      items,
      ({ song }) => song.artist,
      ({ song }) => song.duration_seconds,
    ),
    fridayNightSongByTime: topBy(
      fridayNightItems,
      ({ song }) => songLabel(song),
      ({ song }) => song.duration_seconds,
    ),
    longestStreak: longestSongStreak(items),
    songsEveryListeningDay: songsHeardEveryListeningDay(items),
    topGenres: topManyBy(
      items,
      ({ song }) => song.genre,
      () => 1,
      3,
    ),
  };
}

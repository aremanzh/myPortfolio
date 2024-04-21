import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getWorks(query) {
  await fakeNetwork(`getWorks:${query}`);
  let works = await localforage.getItem("works");
  if (!works) works = [];
  if (query) {
    works = matchSorter(works, query, { keys: ["title", "category"] });
  }
  return works.sort(sortBy("category", "createdAt"));
}

export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let work = { id, createdAt: Date.now() };
  let works = await getWorks();
  works.unshift(work);
  await set(works);
  return work;
}

export async function getContact(id) {
  await fakeNetwork(`work:${id}`);
  let works = await localforage.getItem("works");
  let work = works.find((work) => work.id === id);
  return work ?? null;
}

export async function updateContact(id, updates) {
  await fakeNetwork();
  let works = await localforage.getItem("works");
  let work = works.find((work) => work.id === id);
  if (!work) throw new Error("No work found for", id);
  Object.assign(work, updates);
  await set(works);
  return work;
}

export async function deleteContact(id) {
  let works = await localforage.getItem("works");
  let index = works.findIndex((work) => work.id === id);
  if (index > -1) {
    works.splice(index, 1);
    await set(works);
    return true;
  }
  return false;
}

function set(works) {
  return localforage.setItem("works", works);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}

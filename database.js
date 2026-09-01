const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("fs");
const { dirname } = require("path");
const { seedData } = require("../data/seed");

function createDatabase(filePath) {
  let state = structuredClone(seedData);
  let indexes = {};

  function load() {
    mkdirSync(dirname(filePath), { recursive: true });
    if (existsSync(filePath)) {
      state = JSON.parse(readFileSync(filePath, "utf8"));
    } else {
      persist();
    }
    rebuildIndexes();
  }

  function persist() {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(state, null, 2));
  }

  function list(collection) {
    return [...(state[collection] || [])];
  }

  function get(collection, id) {
    return indexes[collection]?.byId.get(id) || null;
  }

  function insert(collection, record) {
    state[collection] ||= [];
    state[collection].push(record);
    persist();
    rebuildIndexes();
    return record;
  }

  function update(collection, id, patch) {
    const records = state[collection] || [];
    const index = records.findIndex(record => record.id === id);
    if (index < 0) return null;
    records[index] = { ...records[index], ...patch, updatedAt: new Date().toISOString() };
    persist();
    rebuildIndexes();
    return records[index];
  }

  function transaction(work) {
    const before = structuredClone(state);
    try {
      const result = work({ list, get, insert, update });
      persist();
      rebuildIndexes();
      return result;
    } catch (error) {
      state = before;
      rebuildIndexes();
      throw error;
    }
  }

  function rebuildIndexes() {
    indexes = {};
    for (const [collection, records] of Object.entries(state)) {
      if (Array.isArray(records)) {
        indexes[collection] = { byId: new Map(records.map(record => [record.id, record])) };
      }
    }
  }

  return { load, persist, list, get, insert, update, transaction, rebuildIndexes };
}

module.exports = { createDatabase };

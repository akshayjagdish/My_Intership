function createCache({ ttlMs, maxEntries }) {
  const store = new Map();

  function get(key) {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  function set(key, value) {
    if (store.size >= maxEntries) {
      store.delete(store.keys().next().value);
    }
    store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  function invalidate(prefix = "") {
    for (const key of store.keys()) {
      if (!prefix || key.startsWith(prefix)) store.delete(key);
    }
  }

  return { get, set, invalidate, size: () => store.size };
}

module.exports = { createCache };

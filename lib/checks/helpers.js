function check(status, id, pillar, message, suggestion, extra = {}) {
  return { id, pillar, category: pillar, status, message, suggestion, ...extra };
}

module.exports = { check };

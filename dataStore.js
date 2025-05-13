const bwData = new Map();

function addBW(user, value) {
  if (!bwData.has(user)) {
    bwData.set(user, value);
    return true;
  }
  return false;
}

function getAllBW() {
  return Array.from(bwData.entries()).map(([user, value]) => ({ user, value }));
}

function resetAll() {
  bwData.clear();
}

module.exports = { addBW, getAllBW, resetAll };

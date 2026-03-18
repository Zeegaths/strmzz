const { IndexerState } = require("../../models");

class IndexerStateEntity {
  static async getCheckpoint(key = "lastBlock") {
    try {
      const state = await IndexerState.findOne({ where: { key } });
      return state ? Number(state.value) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async saveCheckpoint(blockNumber, key = "lastBlock") {
    try {
      const [state, created] = await IndexerState.findOrCreate({
        where: { key },
        defaults: { value: blockNumber },
      });
      if (!created) {
        await state.update({ value: blockNumber });
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = IndexerStateEntity;

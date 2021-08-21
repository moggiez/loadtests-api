"use strict";

const uuid = require("uuid");

class InternalHandler {
  constructor(table) {
    const expectedTableName = "loadtests";
    if (table && table.getConfig().tableName != expectedTableName) {
      throw new Error(
        `Constructor expects '${expectedTableName}' table passed. The passed table name does not match '${expectedTableName}'.`
      );
    }
    this.table = table;
  }

  handle = async (event) => {
    if (event.action === "getLoadtestsInPastHour") {
      const loadtestsInPastHour = await this.table.query({
        indexName: "CreatedAtHourIndex",
        hashKey: event.parameters.hourDateString,
      });
      const data =
        "Items" in loadtestsInPastHour
          ? loadtestsInPastHour.Items
          : [loadtestsInPastHour.Item];
      return data;
    } else if (event.action === "setLoadtestMetricsSaved") {
      return await this.table.update({
        hashKey: event.parameters.organisationId,
        sortKey: event.parameters.loadtestId,
        updatedFields: event.parameters.updatedFields,
      });
    } else {
      throw Error("Not supported action.");
    }
  };
}

exports.InternalHandler = InternalHandler;

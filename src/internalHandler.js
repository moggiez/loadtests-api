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
    const actionMethod = this[event.action];
    if (!actionMethod) {
      throw Error("Not supported action.");
    }
    const actionParameters = event.parameters;

    return actionMethod(actionParameters);
  };

  getLoadtestsInPastHour = async ({ hourDateString }) => {
    const loadtestsInPastHour = await this.table.query({
      indexName: "CreatedAtHourIndex",
      hashKey: hourDateString,
    });
    const data =
      "Items" in loadtestsInPastHour
        ? loadtestsInPastHour.Items
        : [loadtestsInPastHour.Item];
    return data;
  };

  setLoadtestMetricsSaved = async ({
    organisationId,
    loadtestId,
    updatedFields,
  }) => {
    return await this.table.update({
      hashKey: organisationId,
      sortKey: loadtestId,
      updatedFields: updatedFields,
    });
  };

  getLoadtest = async ({ organisationId, loadtestId }) => {
    const response = await this.table.get({
      hashKey: organisationId,
      sortKey: loadtestId,
    });
    if ("Item" in response) {
      return response.Item;
    } else {
      return null;
    }
  };

  updateLoadtest = async ({ organisationId, loadtestId, updatedFields }) => {
    return await this.table.update({
      hashKey: organisationId,
      sortKey: loadtestId,
      updatedFields: updatedFields,
    });
  };
}

exports.InternalHandler = InternalHandler;

"use strict";

const AWS = require("aws-sdk");
const db = require("@moggiez/moggies-db");

const helpers = require("@moggiez/moggies-lambda-helpers");
const auth = require("@moggiez/moggies-auth");
const { Handler } = require("./handler");
const { InternalHandler } = require("./internalHandler");

const tableConfig = {
  tableName: "loadtests",
  hashKey: "OrganisationId",
  sortKey: "LoadtestId",
  indexes: {
    PlaybookLoadtestIndex: {
      hashKey: "PlaybookId",
      sortKey: "LoadtestId",
    },
    UsersLoadtestsIndex: {
      hashKey: "UserId",
      sortKey: "LoadtestId",
    },
    CreatedAtHourIndex: {
      hashKey: "CreatedAtHour",
      sortKey: "MetricsSavedDate",
    },
  },
};

const DEBUG = false;

exports.handler = async function (event, context, callback) {
  const table = new db.Table({ config: tableConfig, AWS: AWS });

  if ("isInternal" in event && event.isInternal) {
    if (DEBUG) {
      return event;
    }

    const internalHandler = new InternalHandler(table);
    return await internalHandler.handle(event);
  }

  const response = helpers.getResponseFn(callback);

  if (DEBUG) {
    response(200, event);
  }

  const user = auth.getUserFromEvent(event);
  const request = helpers.getRequestFromEvent(event);
  request.user = user;

  const handler = new Handler(table);
  await handler.handle(request, response);
};

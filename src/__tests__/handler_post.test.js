const uuid = require("uuid");
const { Handler } = require("../handler");
const {
  mockTable,
  getPromiseWithReturnValue,
  getPromiseWithReject,
} = require("./helpers");

const { Table } = require("@moggiez/moggies-db");
jest.mock("@moggiez/moggies-db");

const response = jest.fn();

describe("Handler.post", () => {
  beforeEach(() => {
    Table.mockClear();
  });

  it("calls create on table", async () => {
    const table = mockTable();
    const orgId = uuid.v4();
    const expectedLoadtestId = uuid.v4();
    const payload = {};
    const expectedHour = new Date().toISOString().substring(0, 13);

    table.create.mockReturnValue(getPromiseWithReturnValue({}));

    const handler = new Handler(table);
    await handler.post(orgId, payload, response);

    expect(table.create).toHaveBeenCalledWith({
      hashKey: orgId,
      sortKey: expect.any(String),
      record: {
        CreatedAtHour: expectedHour,
        MetricsSavedDate: "null",
      },
    });
    expect(response).toHaveBeenCalledWith(200, {
      LoadtestId: expect.any(String),
    });
  });

  it("returns 500 when table throws an error", async () => {
    const table = mockTable();
    const orgId = uuid.v4();
    const payload = {};
    const expectedHour = new Date().toISOString().substring(0, 13);

    table.create.mockImplementation(() =>
      getPromiseWithReject("This is my error")
    );

    const handler = new Handler(table);
    await handler.post(orgId, payload, response);

    expect(table.create).toHaveBeenCalledWith({
      hashKey: orgId,
      sortKey: expect.any(String),
      record: {
        CreatedAtHour: expectedHour,
        MetricsSavedDate: "null",
      },
    });
    expect(response).toHaveBeenCalledWith(500, "This is my error");
  });
});

resource "aws_dynamodb_table" "loadtests" {
  name           = "loadtests"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "OrganisationId"
  range_key      = "LoadtestId"

  attribute {
    name = "OrganisationId"
    type = "S"
  }

  attribute {
    name = "LoadtestId"
    type = "S"
  }

  attribute {
    name = "PlaybookId"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "CreatedAtHour"
    type = "S"
  }

  attribute {
    name = "MetricsSavedDate"
    type = "S"
  }

  global_secondary_index {
    name            = "PlaybookLoadtestIndex"
    hash_key        = "PlaybookId"
    range_key       = "LoadtestId"
    write_capacity  = 5
    read_capacity   = 5
    projection_type = "KEYS_ONLY"
  }

  global_secondary_index {
    name            = "UsersLoadtestsIndex"
    hash_key        = "UserId"
    range_key       = "LoadtestId"
    write_capacity  = 5
    read_capacity   = 5
    projection_type = "KEYS_ONLY"
  }

  global_secondary_index {
    name            = "CreatedAtHourIndex"
    hash_key        = "CreatedAtHour"
    range_key       = "MetricsSavedDate"
    write_capacity  = 5
    read_capacity   = 5
    projection_type = "KEYS_ONLY"
  }
}
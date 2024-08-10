import { parsePostgreSQL } from "../src/index";
import { Database } from "@recall/types";

describe("parsePostgreSQL", () => {
  it("should parse a simple CREATE TABLE statement", () => {
    const input = `
      CREATE TABLE my_table (
        column1 INTEGER,
        column2 TEXT
      );
    `;
    const result: Database = parsePostgreSQL(input);
    console.log(JSON.stringify(result, null, 2));
    expect(result).toBeDefined();
    expect(result?.schemas[0]?.tables[0]?.name).toBe("my_table");
    expect(result?.schemas[0]?.tables[0]?.fields.length).toBe(2);
    expect(result?.schemas[0]?.tables[0]?.fields[0]?.name).toBe("column1");
    expect(result?.schemas[0]?.tables[0]?.fields[1]?.name).toBe("column2");
  });
});

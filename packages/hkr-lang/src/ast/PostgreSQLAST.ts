import { Database } from "@recall/types";
import PostgreSQLParserVisitor from "../generated/postgres/PostgreSQLParserVisitor";
import { RootContext } from "../generated/postgres/PostgreSQLParser";

export default class PostgresASTGen extends PostgreSQLParserVisitor<Database> {
  private database: Database = {
    schemas: [],
  };

  public getDatabase(): Database {
    return this.database;
  }

  visitRoot: (ctx: RootContext) => Database = (ctx) => {
    ctx.stmtblock().accept(this);
    return this.database;
  };
}

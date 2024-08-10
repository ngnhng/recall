import { Database } from "@recall/types";
import PostgreSQLParserVisitor from "../generated/postgres/PostgreSQLParserVisitor";
import {
  ColumnDefContext,
  CreatestmtContext,
  OpttableelementlistContext,
  Qualified_nameContext,
  RootContext,
  StmtblockContext,
  StmtContext,
  StmtmultiContext,
  TableelementContext,
  TableelementlistContext,
  TypenameContext,
} from "../generated/postgres/PostgreSQLParser";

export default class PostgresASTGen extends PostgreSQLParserVisitor<Database> {
  private currentSchema: string = "public";
  private currentTable: string = "";

  private database: Database = {
    schemas: [
      {
        name: "public",
        tables: [],
        relations: [],
      },
    ],
  };

  public getDatabase(): Database {
    return this.database;
  }

  private addSchema = (schemaName: string) => {
    if (
      !this.database.schemas.find((schema) => schema.name === schemaName) &&
      schemaName !== "public"
    ) {
      this.database.schemas.push({
        name: schemaName,
        tables: [],
        relations: [],
      });
    }
  };

  private addTable = (tableName: string, schemaName: string = "public") => {
    const schema = this.database.schemas.find(
      (schema) => schema.name === schemaName
    );
    if (schema) {
      if (!schema.tables.find((table) => table.name === tableName)) {
        schema.tables.push({
          name: tableName,
          fields: [],
          position: { x: 0, y: 0 },
        });
      }
    }
  };

  private addColumn = (
    tableName: string,
    columnName: string,
    columnType: string
  ) => {
    const table = this.database.schemas
      .find((schema) => schema.name === this.currentSchema)
      ?.tables.find((table) => table.name === tableName);
    if (table) {
      table.fields.push({
        name: columnName,
        type: columnType,
        unique: false,
        primary: false,
        notNull: false,
        autoIncrement: false,
      });
    }
  };

  visitRoot: (ctx: RootContext) => Database = (ctx) => {
    return ctx.stmtblock().accept(this);
  };

  visitStmtblock: (ctx: StmtblockContext) => Database = (ctx) => {
    return ctx.stmtmulti().accept(this);
  };

  visitStmtmulti: (ctx: StmtmultiContext) => Database = (ctx) => {
    const stmts = ctx.stmt_list();
    stmts.forEach((stmt) => stmt.accept(this));
    return this.database;
  };

  visitStmt: (ctx: StmtContext) => Database = (ctx) => {
    if (ctx.createstmt()) {
      return ctx.createstmt().accept(this);
    }

    return this.database;
  };

  visitCreatestmt: (ctx: CreatestmtContext) => Database = (ctx) => {
    // get the table name: qualified_name -> colid -> identifier -> Identifier
    ctx.qualified_name(0).accept(this);

    // get the table fields
    if (ctx.opttableelementlist()) {
      ctx.opttableelementlist().accept(this);
    }
    return this.database;
  };

  visitQualified_name: (ctx: Qualified_nameContext) => Database = (ctx) => {
    if (ctx.indirection()) {
      const schemaName = ctx.indirection().getText();
      // if new schema and not default public schema, add it to the database
      if (
        !this.database.schemas.find((schema) => schema.name === schemaName) &&
        schemaName !== "public"
      ) {
        this.database.schemas.push({
          name: schemaName,
          tables: [],
          relations: [],
        });
      }

      if (ctx.colid()) {
        const tableName = ctx.colid().getText();
        // if new table, add it to the current schema
        this.addTable(tableName, schemaName);
      }

      return this.database;
    }

    if (ctx.colid()) {
      const tableName = ctx.colid().getText();
      // if new table, add it to the current schema
      this.addTable(tableName);
      this.currentTable = tableName;
    }

    return this.database;
  };

  visitOpttableelementlist: (ctx: OpttableelementlistContext) => Database = (
    ctx
  ) => {
    ctx.tableelementlist().accept(this);
    return this.database;
  };

  visitTableelementlist: (ctx: TableelementlistContext) => Database = (ctx) => {
    ctx
      .tableelement_list()
      .forEach((tableElement) => tableElement.accept(this));

    return this.database;
  };

  visitTableelement: (ctx: TableelementContext) => Database = (ctx) => {
    if (ctx.columnDef()) {
      ctx.columnDef().accept(this);
    }
    if (ctx.tableconstraint()) {
      ctx.tableconstraint().accept(this);
    }

    return this.database;
  };

  visitColumnDef: (ctx: ColumnDefContext) => Database = (ctx) => {
    const colName = ctx.colid().getText();

    ctx.typename().accept(this);
    ctx.colquallist().accept(this);

    return this.database;
  };

  visitTypename: (ctx: TypenameContext) => Database = (ctx) => {
    const type = ctx.getText();
    this.addColumn(this.currentTable, "", type);
    return this.database;
  };
}

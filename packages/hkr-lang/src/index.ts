import antlr4 from "antlr4";
import { Database } from "@recall/types";
import PostgreSQLLexer from "./generated/postgres/PostgreSQLLexer";
import PostgreSQLParser from "./generated/postgres/PostgreSQLParser";
import PostgresASTGen from "./ast/PostgreSQLAST";

export function parsePostgreSQL(input: string): Database {
  const chars = new antlr4.CharStream(input);
  const lexer = new PostgreSQLLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new PostgreSQLParser(tokens);
  parser.buildParseTrees = true;
  const tree = parser.root();
  const visitor = new PostgresASTGen();
  return visitor.visitRoot(tree);
}

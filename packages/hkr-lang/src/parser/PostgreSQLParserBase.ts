import antlr4 from "antlr4";
import PostgreSQLParser, {
  Createfunc_opt_listContext,
  Createfunc_opt_itemContext,
  Nonreservedword_or_sconstContext,
  NonreservedwordContext,
  IdentifierContext,
  Func_asContext,
  SconstContext,
  AnysconstContext,
} from "../generated/postgres/PostgreSQLParser";
import PostgreSQLLexer from "../generated/postgres/PostgreSQLLexer";
import PostgreSQLParseError from "./PostgreSQLParseError";

export default class PostgreSQLParserBase extends antlr4.Parser {
  parseErrors: PostgreSQLParseError[] = [];

  ParseRoutineBody(ctx: Createfunc_opt_listContext) {
    let lang: string | undefined;

    for (const coi of ctx.createfunc_opt_item_list()) {
      const createFuncOptItemContext = coi as Createfunc_opt_itemContext;
      if (!createFuncOptItemContext || !createFuncOptItemContext.LANGUAGE()) {
        continue;
      }
      const nonReservedWordOrSConstContext =
        createFuncOptItemContext.nonreservedword_or_sconst() as Nonreservedword_or_sconstContext;
      if (!nonReservedWordOrSConstContext) {
        continue;
      }
      const nonReservedWordContext =
        nonReservedWordOrSConstContext.nonreservedword() as NonreservedwordContext;
      if (!nonReservedWordContext) {
        continue;
      }
      const identifier =
        nonReservedWordContext.identifier() as IdentifierContext;
      if (!identifier) {
        continue;
      }
      const node = identifier.Identifier();
      if (!node) {
        continue;
      }
      lang = node.getText();
      break;
    }

    if (!lang) {
      return;
    }

    let funcAs: Createfunc_opt_itemContext | undefined;

    for (const coi of ctx.createfunc_opt_item_list()) {
      const createFuncOptItemContext = coi as Createfunc_opt_itemContext;
      if (!createFuncOptItemContext || !createFuncOptItemContext.LANGUAGE()) {
        continue;
      }
      const as = createFuncOptItemContext.func_as();
      if (as) {
        funcAs = createFuncOptItemContext;
        break;
      }
    }

    if (!funcAs) {
      return;
    }

    const funcAsContext = funcAs.func_as() as Func_asContext;
    if (!funcAsContext) {
      return;
    }
    const sConstContext = funcAsContext.sconst(0) as SconstContext;
    if (!sConstContext) {
      return;
    }
    const text = GetRoutineBodyString(sConstContext);
    const line = sConstContext.start.line;
    const parser = getPostgreSQLParser(text);

    switch (lang) {
      case "plpgsql":
        funcAsContext.Definition = parser.plsqlroot();
        break;
      case "sql":
        funcAsContext.Definition = parser.root();
        break;
    }

    for (const err of parser.parseErrors) {
      this.parseErrors.push(
        new PostgreSQLParseError({
          Number: err.Number,
          Offset: err.Offset,
          Line: err.Line + line,
          Column: err.Column,
          Message: err.Message,
        })
      );
    }
  }
}

function getPostgreSQLParser(input: string) {
  const chars = new antlr4.CharStream(input);
  const lexer = new PostgreSQLLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  return new PostgreSQLParser(tokens);
}

function GetRoutineBodyString(ctx: SconstContext): string {
  if (ctx.anysconst() === null) {
    return "";
  }
  const anySConstContext = ctx.anysconst() as AnysconstContext;

  const stringConstant = anySConstContext.StringConstant();
  if (stringConstant !== null) {
    return unquote(TrimQuotes(stringConstant.getText()));
  }

  const unicodeEscapeStringConstant =
    anySConstContext.UnicodeEscapeStringConstant();
  if (unicodeEscapeStringConstant !== null) {
    return TrimQuotes(unicodeEscapeStringConstant.getText());
  }

  const escapeStringConstant = anySConstContext.EscapeStringConstant();
  if (escapeStringConstant !== null) {
    return TrimQuotes(escapeStringConstant.getText());
  }

  const result: string[] = [];
  for (const node of anySConstContext.DollarText_list()) {
    result.push(node.getText());
  }
  return result.join("");
}

function unquote(s: string): string {
  const result = [];
  const length = s.length;
  let index = 0;
  while (index < length) {
    const c = s[index];
    result.push(c);
    if (c === "'" && index < length - 1 && s[index + 1] === "'") {
      index++;
    }
    index++;
  }
  return result.join("");
}

function TrimQuotes(s: string): string {
  if (s === "") {
    return s;
  }
  return s.substring(1, s.length - 1);
}

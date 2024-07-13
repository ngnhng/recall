import antlr4 from "antlr4";
// Adapted from Go: https://github.com/antlr/grammars-v4/blob/master/sql/postgresql/Go/postgresql_lexer_base.go
export default class PostgreSQLLexerBase extends antlr4.Lexer {
  stack: string[] = [];

  constructor(input: antlr4.CharStream) {
    super(input);
  }

  pushTag(): void {
    this.stack.push(this.text);
  }

  isTag(): boolean {
    if (this.stack.length === 0) {
      return false;
    }
    return this.text === this.stack[this.stack.length - 1];
  }

  popTag(): void {
    this.stack.pop();
  }

  checkLA(c: number): boolean {
    return this._input.LA(1) !== c;
  }

  charIsLetter(): boolean {
    const c = this._input.LA(-1);
    return isNaN(c) ? false : /[a-zA-Z]/.test(String.fromCharCode(c));
  }

  HandleNumericFail(): void {
    const index = this._input.index - 2;
    this._input.seek(index);
    this._type = 658;
  }

  HandleLessLessGreaterGreater(): void {
    if (this.text === "<<") {
      this._type = 18;
    }
    if (this.text === ">>") {
      this._type = 19;
    }
  }

  UnterminatedBlockCommentDebugAssert(): void {
    // TypeScript version does not directly support Debug.Assert; use console.assert in development or throw an error as needed.
    // console.assert(this.baseLexer.inputStream.LA(1) === antlr.Token.EOF, "Expected end of file");
  }

  checkIfUtf32Letter(): boolean {
    const codePoint = (this._input.LA(-2) << 8) + this._input.LA(-1);
    let c: string[];
    if (codePoint < 0x10000) {
      c = [String.fromCharCode(codePoint)];
    } else {
      const adjustedCodePoint = codePoint - 0x10000;
      c = [
        String.fromCharCode(adjustedCodePoint / 0x400 + 0xd800),
        String.fromCharCode((adjustedCodePoint % 0x400) + 0xdc00),
      ];
    }
    return /[a-zA-Z]/.test(c[0] ?? "");
  }
}

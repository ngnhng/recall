import antlr4 from 'antlr4';
import { Lexer } from 'antlr4';
// Adapted from Go: https://github.com/antlr/grammars-v4/blob/master/sql/postgresql/Go/postgresql_lexer_base.go
export default class PostgreSQLLexerBase extends antlr4.Lexer {
  stack: string[] = [];

  pushTag(): void {
    this.stack.push(this.baseLexer.text);
  }

  isTag(): boolean {
    if (this.stack.length === 0) {
      return false;
    }
    return this.baseLexer.text === this.stack[this.stack.length - 1];
  }

  popTag(): void {
    this.stack.pop();
  }

  checkLA(c: number): boolean {
    return this.baseLexer.inputStream.LA(1) !== c;
  }

  charIsLetter(): boolean {
    const c = this.baseLexer.inputStream.LA(-1);
    return isNaN(c) ? false : /[a-zA-Z]/.test(String.fromCharCode(c));
  }

  handleNumericFail(): void {
    const index = this.baseLexer.inputStream.index - 2;
    this.baseLexer.inputStream.seek(index);
    this.baseLexer.type = 658;
  }

  handleLessLessGreaterGreater(): void {
    if (this.baseLexer.text === "<<") {
      this.baseLexer.type = 18;
    }
    if (this.baseLexer.text === ">>") {
      this.baseLexer.type = 19;
    }
  }

  unterminatedBlockCommentDebugAssert(): void {
    // TypeScript version does not directly support Debug.Assert; use console.assert in development or throw an error as needed.
    // console.assert(this.baseLexer.inputStream.LA(1) === antlr.Token.EOF, "Expected end of file");
  }

  checkIfUtf32Letter(): boolean {
    const codePoint =
      (this.baseLexer.inputStream.LA(-2) << 8) +
      this.baseLexer.inputStream.LA(-1);
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

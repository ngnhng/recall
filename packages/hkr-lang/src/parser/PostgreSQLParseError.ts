export default class PostgreSQLParseError {
  Number: number;
  Offset: number;
  Line: number;
  Column: number;
  Message: string;

  constructor({
    Number,
    Offset,
    Line,
    Column,
    Message,
  }: {
    Number: number;
    Offset: number;
    Line: number;
    Column: number;
    Message: string;
  }) {
    this.Number = Number;
    this.Offset = Offset;
    this.Line = Line;
    this.Column = Column;
    this.Message = Message;
  }
}

export type Database = {
  tables: Table[];
  relations: Relation[];
};

export type Table = {
  name: string;
  columns: Column[];
  position: Position;
};

export type Column = {
  name: string;
  type: string;
};

export type Position = {
  x: number;
  y: number;
};

export type Relation = {
  type: "one-to-one" | "one-to-many" | "many-to-many";
  from: string;
  to: string;
};

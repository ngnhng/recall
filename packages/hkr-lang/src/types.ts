type TableNames = HkrDatabase['schemas'][number]['tables'][number]['name'];

export type HkrDatabase = {
  schemas: Schema[];
};

export type Schema = {
  name: string;
  tables: Table[];
  relations: Relation[];
};

export type Table = {
  name: string;
  fields: Field[];
  indexes?: Index[];
  position: Position;
};

export type Index = {
  name: string;
  fields: string[];
  unique: boolean;
  primary: boolean;
  note?: string;
};

export type Field = {
  name: string;
  type: string;
  unique: boolean;
  primary: boolean;
  notNull: boolean;
  note?: string;
  default?: any;
  autoIncrement: boolean;
  foreignKeys?: ForeignKey[];
  indexed?: boolean;
};

export type ForeignKey = {
  referencedTable: string;
  referencedField: string;
  onUpdate: ForeignKeyAction;
  onDelete: ForeignKeyAction;
};

export type ForeignKeyAction =
  | "CASCADE"
  | "SET NULL"
  | "RESTRICT"
  | "NO ACTION";

export type Position = {
  x: number;
  y: number;
};

export type Relation = {
  type: Cardinality;
  from: RelationEnd;
  to: RelationEnd;
};

export type Cardinality = "one-to-one" | "one-to-many" | "many-to-many";

export type RelationEnd = {
  table: TableNames;
  field: string;
};

export interface CompareRowDef {
  key: string;
  label: string;
  hint?: string;
}

export interface CompareSectionDef {
  key: string;
  title: string;
  rows: CompareRowDef[];
}

export interface SpecValue {
  value: string;
  note?: string;
}

export interface CompareProfile {
  origin: string;
  /** Bench score shown on the card header. */
  bench?: number;
  highlights: string[];
  primary: string;
  secondary: string;
}

export interface ProductCompareData {
  profile: CompareProfile;
  specs: Record<string, SpecValue>;
}

export interface MatrixCell extends SpecValue {
  /** True when this value differs from at least one other column. */
  differs: boolean;
}

export interface MatrixRow {
  key: string;
  label: string;
  hint?: string;
  delta: boolean;
  cells: MatrixCell[];
}

export interface MatrixSection {
  key: string;
  title: string;
  deltas: number;
  rows: MatrixRow[];
}

export interface ComparePreset {
  key: string;
  label: string;
  title: string;
  body: string;
  ids: string[];
}

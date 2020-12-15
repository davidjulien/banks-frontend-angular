export enum FixDate {
  PREVIOUS2 = 'previous2',
    PREVIOUS = 'previous',
    PREVIOUS_IF_BEGIN = 'previous_if_begin',
    NONE = 'none',
    NEXT_IF_END = 'next_if_end',
    NEXT = 'next'
}

export class Mapping {
  constructor(
    public readonly pattern: string) {
  }
}

import { Mapping } from './mapping.model';

describe('Mapping', () => {
  it('should create an instance', () => {
    const pattern = 'PATTERN';
    const mapping = new Mapping(pattern);
    expect(mapping).toBeTruthy();
    expect(mapping.pattern).toBe(pattern);
  });
});

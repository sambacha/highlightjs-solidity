const hljs = require('highlight.js/lib/core');
const {
  isNegativeLookbehindAvailable,
  SOL_ASSEMBLY_KEYWORDS,
  baseAssembly,
  solAposStringMode,
  solQuoteStringMode,
  HEX_APOS_STRING_MODE,
  HEX_QUOTE_STRING_MODE,
  SOL_NUMBER
} = require('./common');


// Mock for hljs methods that we need
hljs.inherit = jest.fn(function(parent, obj) {
  return Object.assign({}, parent, obj);
});
describe('isNegativeLookbehindAvailable', () => {
  test('returns boolean indicating regex lookbehind support', () => {
    // This will return true in modern environments, false in older ones
    expect(typeof isNegativeLookbehindAvailable()).toBe('boolean');
  });
});

describe('SOL_NUMBER', () => {
  test('has correct className', () => {
    expect(SOL_NUMBER.className).toBe('number');
  });

  test('has a regex pattern for begin', () => {
    expect(SOL_NUMBER.begin).toBeTruthy();
    // Could be a RegExp object or a string depending on browser support
    expect(SOL_NUMBER.begin instanceof RegExp || typeof SOL_NUMBER.begin === 'string').toBeTruthy();
  });

  test('has correct relevance', () => {
    expect(SOL_NUMBER.relevance).toBe(0);
  });
});

describe('SOL_ASSEMBLY_KEYWORDS', () => {
  test('has correct pattern', () => {
    expect(SOL_ASSEMBLY_KEYWORDS.$pattern.toString()).toBe(/[A-Za-z_$][A-Za-z_$0-9.]*/.toString());
  });

  test('contains expected keywords', () => {
    expect(SOL_ASSEMBLY_KEYWORDS.keyword).toContain('assembly');
    expect(SOL_ASSEMBLY_KEYWORDS.keyword).toContain('function');
    expect(SOL_ASSEMBLY_KEYWORDS.keyword).toContain('if');
    expect(SOL_ASSEMBLY_KEYWORDS.keyword).toContain('return');
  });

  test('contains expected built-ins', () => {
    expect(SOL_ASSEMBLY_KEYWORDS.built_in).toContain('add');
    expect(SOL_ASSEMBLY_KEYWORDS.built_in).toContain('mload');
    expect(SOL_ASSEMBLY_KEYWORDS.built_in).toContain('keccak256');
  });

  test('contains expected literals', () => {
    expect(SOL_ASSEMBLY_KEYWORDS.literal).toBe('true false');
  });
});

describe('HEX_APOS_STRING_MODE', () => {
  test('has correct className', () => {
    expect(HEX_APOS_STRING_MODE.className).toBe('string');
  });

  test('matches valid hex strings with single quotes', () => {
    const regex = HEX_APOS_STRING_MODE.begin;
    expect("hex'1234'").toMatch(regex);
    expect("hex'12_34'").toMatch(regex);
    expect("hex''").toMatch(regex);
  });

  test('does not match invalid hex strings', () => {
    const regex = HEX_APOS_STRING_MODE.begin;
    expect("hex'123g'").not.toMatch(regex);
    expect("'1234'").not.toMatch(regex);
  });
});

describe('HEX_QUOTE_STRING_MODE', () => {
  test('has correct className', () => {
    expect(HEX_QUOTE_STRING_MODE.className).toBe('string');
  });

  test('matches valid hex strings with double quotes', () => {
    const regex = HEX_QUOTE_STRING_MODE.begin;
    expect('hex"1234"').toMatch(regex);
    expect('hex"12_34"').toMatch(regex);
    expect('hex""').toMatch(regex);
  });

  test('does not match invalid hex strings', () => {
    const regex = HEX_QUOTE_STRING_MODE.begin;
    expect('hex"123g"').not.toMatch(regex);
    expect('"1234"').not.toMatch(regex);
  });
});

describe('solAposStringMode', () => {
  test('returns an object with correct begin pattern', () => {
    const result = solAposStringMode(hljs);
    expect(result.begin.toString()).toBe(/(\bunicode)?'/.toString());
  });

  test('inherits from hljs.APOS_STRING_MODE', () => {
    solAposStringMode(hljs);
    expect(hljs.inherit).toHaveBeenCalledWith(
      hljs.APOS_STRING_MODE,
      expect.objectContaining({ begin: expect.any(RegExp) })
    );
  });
});

describe('solQuoteStringMode', () => {
  test('returns an object with correct begin pattern', () => {
    const result = solQuoteStringMode(hljs);
    expect(result.begin.toString()).toBe(/(\bunicode)?"/.toString());
  });

  test('inherits from hljs.QUOTE_STRING_MODE', () => {
    solQuoteStringMode(hljs);
    expect(hljs.inherit).toHaveBeenCalledWith(
      hljs.QUOTE_STRING_MODE,
      expect.objectContaining({ begin: expect.any(RegExp) })
    );
  });
});

describe('baseAssembly', () => {
  beforeEach(() => {
    // Mock the required hljs methods and properties
    hljs.C_LINE_COMMENT_MODE = { type: 'comment', line: true };
    hljs.C_BLOCK_COMMENT_MODE = { type: 'comment', block: true };
    hljs.TITLE_MODE = { className: 'title' };
  });

  test('returns an object with correct structure', () => {
    const result = baseAssembly(hljs);

    // Check basic structure
    expect(result).toHaveProperty('keywords');
    expect(result).toHaveProperty('contains');

    // Check keywords
    expect(result.keywords).toBe(SOL_ASSEMBLY_KEYWORDS);

    // Check contains array
    expect(Array.isArray(result.contains)).toBe(true);
    expect(result.contains.length).toBeGreaterThan(0);

    // Check for function definition
    const functionDef = result.contains.find(item => item.className === 'function');
    expect(functionDef).toBeDefined();
    expect(functionDef).toHaveProperty('beginKeywords', 'function');
  });

  test('includes string modes in contains', () => {
    const result = baseAssembly(hljs);

    // Check that string modes are included
    const containsClasses = result.contains.map(item => item.className).filter(Boolean);
    expect(containsClasses).toContain('string');
    expect(containsClasses).toContain('operator');
  });
});

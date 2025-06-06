/* eslint-disable no-new */
/*
Language: Solidity
Requires: solidity.js, yul.js
Author: SEE AUTHOR
Contributors: SEE CONTRIBUTORS
Description: A statically-typed curly-braces programming language designed for developing smart contracts that run on Ethereum.
Website: https://docs.soliditylang.org/en/latest/grammar.html
*/

/**
 * highlight.js Solidity syntax highlighting definition
 *
 * @see https://github.com/isagalaev/highlight.js
 *
 * @package: highlightjs-solidity
 * @author:  Sam Pospischil <sam@changegiving.com>
 * @since:   2016-07-01
 */

const isNegativeLookbehindAvailable = () => {
  try {
    // eslint-disable-next-line prefer-regex-literals
    new RegExp('(?<!.)');
    return true;
  } catch (_) {
    return false;
  }
};

// like a C number, except:
// 1. no octal literals (leading zeroes disallowed)
// 2. underscores (1 apiece) are allowed between consecutive digits
// (including hex digits)
// also, all instances of \b (word boundary) have been replaced with (?<!\$)\b
// NOTE: we use string rather than regexp in the case where negative lookbehind
// is allowed to avoid Firefox parse errors; sorry about the resulting double backslashes!
let SOL_NUMBER_RE = /-?(\b0[xX]([a-fA-F0-9]_?)*[a-fA-F0-9]|(\b[1-9](_?\d)*(\.((\d_?)*\d)?)?|\.\d(_?\d)*)([eE][-+]?\d(_?\d)*)?|\b0)(?!\w|\$)/;
if (isNegativeLookbehindAvailable()) {
  SOL_NUMBER_RE = SOL_NUMBER_RE.source.replace(/\\b/g, '(?<!\\$)\\b');
}

const SOL_NUMBER = {
  className: 'number',
  begin: SOL_NUMBER_RE,
  relevance: 0
};

const SOL_ASSEMBLY_KEYWORDS = {
  $pattern: /[A-Za-z_$][A-Za-z_$0-9.]*/,
  keyword: `assembly
    let function
    if switch case default for leave
    break continue
    u256
    jump jumpi
    stop return revert selfdestruct invalid`,
  built_in: `add sub mul div sdiv mod smod exp not lt gt slt sgt eq iszero
    and or xor byte shl shr sar
    addmod mulmod signextend keccak256
    pc pop
    dup1 dup2 dup3 dup4 dup5 dup6 dup7 dup8 dup9 dup10 dup11 dup12 dup13 dup14 dup15 dup16
    swap1 swap2 swap3 swap4 swap5 swap6 swap7 swap8 swap9 swap10 swap11 swap12 swap13 swap14 swap15 swap16
    mload mstore mstore8 sload sstore msize tload tstore mcopy
    gas address balance selfbalance caller callvalue
    calldataload calldatasize calldatacopy codesize codecopy extcodesize extcodecopy returndatasize returndatacopy extcodehash
    create create2 call callcode delegatecall staticcall
    log0 log1 log2 log3 log4
    chainid origin gasprice basefee blobbasefee blockhash blobhash coinbase timestamp number difficulty prevrandao gaslimit`,
  literal: 'true false'
};

const HEX_APOS_STRING_MODE = {
  className: 'string',
  begin: /\bhex'(([0-9a-fA-F]{2}_?)*[0-9a-fA-F]{2})?'/ // please also update HEX_QUOTE_STRING_MODE
};

const HEX_QUOTE_STRING_MODE = {
  className: 'string',
  begin: /\bhex"(([0-9a-fA-F]{2}_?)*[0-9a-fA-F]{2})?"/ // please also update HEX_APOS_STRING_MODE
};

// I've set these up exactly like hljs's builtin STRING_MODEs,
// except with the optional initial "unicode" text
const solAposStringMode = (hljs) => {
  return hljs.inherit(
    hljs.APOS_STRING_MODE, // please also update solQuoteStringMode
    { begin: /(\bunicode)?'/ }
  );
};

const solQuoteStringMode = (hljs) => {
  return hljs.inherit(
    hljs.QUOTE_STRING_MODE, // please also update solAposStringMode
    { begin: /(\bunicode)?"/ }
  );
};

const baseAssembly = (hljs) => {
  // this function defines a "basic" assembly environment;
  // we use it several times below with hljs.inherit to provide
  // elaborations upon this basic assembly environment
  const SOL_APOS_STRING_MODE = solAposStringMode(hljs);
  const SOL_QUOTE_STRING_MODE = solQuoteStringMode(hljs);

  const SOL_ASSEMBLY_TITLE_MODE =
        hljs.inherit(hljs.TITLE_MODE, {
          begin: /[A-Za-z$_][0-9A-Za-z$_]*/,
          keywords: SOL_ASSEMBLY_KEYWORDS
        });

  const SOL_ASSEMBLY_FUNC_PARAMS = {
    className: 'params',
    begin: /\(/,
    end: /\)/,
    excludeBegin: true,
    excludeEnd: true,
    keywords: SOL_ASSEMBLY_KEYWORDS,
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      SOL_APOS_STRING_MODE,
      SOL_QUOTE_STRING_MODE,
      SOL_NUMBER
    ]
  };

  // note: we always put operators below comments so
  // it won't interfere with comments
  const SOL_ASSEMBLY_OPERATORS = {
    className: 'operator',
    begin: /:=|->/
  };

  return {
    keywords: SOL_ASSEMBLY_KEYWORDS,
    contains: [
      SOL_APOS_STRING_MODE,
      SOL_QUOTE_STRING_MODE,
      HEX_APOS_STRING_MODE,
      HEX_QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      SOL_NUMBER,
      SOL_ASSEMBLY_OPERATORS,
      { // functions
        className: 'function',
        beginKeywords: 'function',
        end: '{',
        excludeEnd: true,
        contains: [
          SOL_ASSEMBLY_TITLE_MODE,
          SOL_ASSEMBLY_FUNC_PARAMS,
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          SOL_ASSEMBLY_OPERATORS
        ]
      }
    ]
  };
};

// Export all the components directly
export {
  SOL_ASSEMBLY_KEYWORDS,
  baseAssembly,
  solAposStringMode,
  solQuoteStringMode,
  HEX_APOS_STRING_MODE,
  HEX_QUOTE_STRING_MODE,
  SOL_NUMBER,
  isNegativeLookbehindAvailable
};

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

// Import the language definitions directly
const solidity = require("./languages/solidity.js");
const yul = require("./languages/yul.js");

// Export a function for highlight.js to register the languages
function hljsDefinesSolidity(hljs) {
  hljs.registerLanguage('solidity', solidity);
  hljs.registerLanguage('yul', yul);
}

// Export the language definitions directly
hljsDefinesSolidity.solidity = solidity;
hljsDefinesSolidity.yul = yul;

// Export the main function as default for highlight.js plugin system
module.exports = hljsDefinesSolidity;

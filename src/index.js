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
import solidity from "./languages/solidity.js";
import yul from "./languages/yul.js";

// Export a function for highlight.js to register the languages
const hljsDefineSolidity = (hljs) => {
  if (typeof hljs.registerLanguage === 'function') {
    hljs.registerLanguage('solidity', solidity);
    hljs.registerLanguage('yul', yul);
  } else {
    // For testing environments that don't have registerLanguage
    console.warn('hljs.registerLanguage is not available');
  }
};

// Export the language definitions directly
hljsDefineSolidity.solidity = solidity;
hljsDefineSolidity.yul = yul;

// Export the main function as default for highlight.js plugin system
export default hljsDefineSolidity;

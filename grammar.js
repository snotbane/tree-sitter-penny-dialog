/**
 * @file Injected sub-grammar for Penny strings
 * @author Sebastian Weaver <snotbane@pm.me>
 * @license Unlicense
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "penny_dialog",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});

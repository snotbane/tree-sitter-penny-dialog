#include "tree_sitter/parser.h"

enum TokenType {
  EXPRESS_CONTENT,
};

bool tree_sitter_penny_dialog_external_scanner_scan(void *payload,
                                                    TSLexer *lexer,
                                                    const bool *valid_symbols) {
  // Only produce this token when the parser expects it.
  if (!valid_symbols[EXPRESS_CONTENT]) {
    return false;
  }

  int bracket_depth = 1;
  bool escaped = false;

  lexer->result_symbol = EXPRESS_CONTENT;

  for (;;) {
    // PEEK at the next character – do NOT consume it yet.
    int32_t c = lexer->lookahead;

    // If reached end of file, go ahead and return true - express will be
    // unbound in ruleset.
    // If this is the outer closing bracket, stop right before it.
    if (c == 0 || c == ']' && bracket_depth == 1) {
      // Mark the end of the token at the current position (before ']').
      lexer->mark_end(lexer);
      return true;
    }

    // We are keeping this character inside the token, so consume it.
    lexer->advance(lexer, false);

    // Now process the consumed character.
    if (escaped) {
      escaped = false;
      continue;
    }

    if (c == '\\') {
      escaped = true;
      continue;
    }

    if (c == '[') {
      bracket_depth++;
    } else if (c == ']') {
      // This must be an inner ']' (since bracket_depth > 1 here).
      bracket_depth--;
    }
  }

  // return false;
}

// No persistent state needed for this scanner.
void *tree_sitter_penny_dialog_external_scanner_create(void) { return NULL; }

void tree_sitter_penny_dialog_external_scanner_destroy(void *p) {}

void tree_sitter_penny_dialog_external_scanner_reset(void *p) {}

unsigned tree_sitter_penny_dialog_external_scanner_serialize(void *p,
                                                             char *buffer) {
  return 0;
}

void tree_sitter_penny_dialog_external_scanner_deserialize(void *p,
                                                           const char *b,
                                                           unsigned n) {}

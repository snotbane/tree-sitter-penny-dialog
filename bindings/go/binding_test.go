package tree_sitter_penny_dialog_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_penny_dialog "github.com/snotbane/tree-sitter-penny-dialog.git/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_penny_dialog.Language())
	if language == nil {
		t.Errorf("Error loading Penny Dialog grammar")
	}
}

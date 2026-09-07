import XCTest
import SwiftTreeSitter
import TreeSitterPennyDialog

final class TreeSitterPennyDialogTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_penny_dialog())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Penny Dialog grammar")
    }
}

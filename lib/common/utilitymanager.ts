'use strict';
// uuid: 0b81be9e-516b-4ac3-966d-fbe8ffd7b629

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

declare var atom;

export namespace um {

  export enum TIXUtilityType {
    /// preforms inline transforms replacing pat with repl. doesn't calls ActionFunc
    utInTransform,
    /// passes intext and replaces the selection with the return text
    utTransform,
    /// calls line by line and replaces each line with the returning result
    utLineUtility,
    /// passes inlines and replaces the selection with return lines
    utLinesUtility,
    /// inserts text at the start of the selection or at cursor point if no text is selected
    utInsertAtStartUtility,
    /// inserts text at the end of the selection or at cursor point if no text is selected
    utInsertAtEndUtility,
  }

  export function utilityManager(def, f?, up?) {
    up = up || {};
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const selection = editor.getSelectedText();
      let outSelection;

      switch (def.utilType) {
        case TIXUtilityType.utInTransform:
          if (selection) {
            outSelection = selection.replace(def.pat, def.repl);
            if (selection !== outSelection) {
              editor.insertText(outSelection);
            }
          }
          break;

        case TIXUtilityType.utTransform:
          if (selection) {
            up.intext = selection;
            outSelection = f(up);
            if (selection !== outSelection) {
              editor.insertText(outSelection);
            }
          }
          break;

        case TIXUtilityType.utLinesUtility:
          if (selection) {
            up.inlines = selection.split('\n');
            outSelection = f(up).join('\n');
            if (selection !== outSelection) {
              editor.insertText(outSelection);
            }
          }
          break;

        case TIXUtilityType.utLineUtility:
          if (selection) {
            const lines = selection.split('\n');
            lines.forEach((line, index) => {
              up.intext = line;
              lines[index] = f(up);
            });
            outSelection = lines.join('\n');
            if (selection !== outSelection) {
              editor.insertText(outSelection);
            }
          }
          break;

        case TIXUtilityType.utInsertAtEndUtility:
          outSelection = f(selection);
          editor.insertText(selection + outSelection);
          break;
      }
    }
  }

  export let utilityManagerWithUserInputs;
}

declare var module;
module.exports = {
  um,
};

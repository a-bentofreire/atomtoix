'use babel';
// uuid: 49c3856f-d65d-47ac-b7db-7f7d6dc0a1af

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
//  This code is a port of [vsctoix](https://github.com/a-bentofreire/vsctoix) 1.1
//  However some parts still need work:
//  1. It only supports one selection.
//  2. It only transforms text inside the selection.
//  3. All the code is inside one file only due the fact when I tried to place it in multiple code files,
//  babel compiler always reported an error on the export key.
//  4. Add Mocha Tests and travis support.
// ------------------------------------------------------------------------

import AtomtoixView from './atomtoix-view';
import {
  CompositeDisposable
} from 'atom';

// ------------------------------------------------------------------------
//                               utilityManager
// ------------------------------------------------------------------------

// enum TIXUtilityType {
//   /// preforms inline transforms replacing pat with repl. doesn't calls ActionFunc
const utInTransform = 0;
//   /// passes intext and replaces the selection with the return text
const utTransform = 1;
//   /// calls line by line and replaces each line with the returning result
const utLineUtility = 2;
//   /// passes inlines and replaces the selection with return lines
const utLinesUtility = 3;
//   /// inserts text at the start of the selection or at cursor point if no text is selected
const utInsertAtStartUtility = 4;
//   /// inserts text at the end of the selection or at cursor point if no text is selected
const utInsertAtEndUtility = 5;
// };


function utilityManager(def, f, up) {
  up = up || {};
  let editor = atom.workspace.getActiveTextEditor();
  if (editor) {
    let selection = editor.getSelectedText();
    let outSelection;

    switch (def.utilType) {
      case utInTransform:
        if (selection) {
          outSelection = selection.replace(def.pat, def.repl);
          if (selection != outSelection) {
            editor.insertText(outSelection);
          }
        }
        break;

      case utTransform:
        if (selection) {
          up.intext = selection;
          outSelection = f(up);
          if (selection != outSelection) {
            editor.insertText(outSelection);
          }
        }
        break;

      case utLinesUtility:
        if (selection) {
          up.inlines = selection.split('\n');
          outSelection = f(up).join('\n');
          if (selection != outSelection) {
            editor.insertText(outSelection);
          }
        }
        break;

      case utLineUtility:
        if (selection) {
          let lines = selection.split('\n');
          lines.forEach((line, index) => {
            up.intext = line;
            lines[index] = f(up);
          });
          outSelection = lines.join('\n');
          if (selection != outSelection) {
            editor.insertText(outSelection);
          }
        }
        break;

      case utInsertAtEndUtility:
        outSelection = f(selection);
        editor.insertText(selection + outSelection);
        break;
    }
  }
}


let atomtoixView = null;

function receiveUserInputs(def) {
  utilityManager(def, def.f, def)
}

function utilityManagerWithUserInputs(def, inputs, f) {
  def.inputs = inputs;
  def.f = f;
  def.caller = receiveUserInputs;
  atomtoixView.populate(def);
  if (!atomtoixView.modalPanel.isVisible()) {
    atomtoixView.modalPanel.show();
  }
}

// ------------------------------------------------------------------------
//                               In Transform Utilities
//
// $cattitle: Transform Text Utilities
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
// $utility: capitalize
//
// $keywords: capitalize
// $eg: classNameFunc  ->  ClassNameFunc
// ------------------------------------------------------------------------

function capitalize() {
  utilityManager({
    utilType: utInTransform,
    pat: /\b(_*\w)/g,
    repl: (match, p1) => p1.toUpperCase()
  });
}

// ------------------------------------------------------------------------
// $utility: camelCase
//
// $keywords: camel, camelcase
// $eg: ClassNameFunc  ->  classNameFunc
// ------------------------------------------------------------------------

function camelCase() {
  utilityManager({
    utilType: utInTransform,
    pat: /\b(_*\w)/g,
    repl: (match, p1) => p1.toLowerCase()
  });
}

// ------------------------------------------------------------------------
// $utility: spaceByUpper
//
// $title: Add Space before Uppercase
// $keywords: space, assignment
// $eg: doActionBefore  ->  do Action Before
// $desc: Useful to transform functions names into documentation
// ------------------------------------------------------------------------

function spaceByUpper() {
  utilityManager({
    utilType: utInTransform,
    pat: /([A-Z])/g,
    repl: (match, p1) => ' ' + p1
  });
}

// ------------------------------------------------------------------------
// $utility: reverseAssignment
//
// $keywords: reverse, assignment
// $eg: x == y[x] + 5  ->  y[x] + 5 == x
// $desc: Reverses the terms of assignments or equal/different comparisons
// ------------------------------------------------------------------------

function reverseAssignment() {
  utilityManager({
    utilType: utInTransform,
    pat: /\b(.+)(\s+)([=<>]=*|[!:]=+)(\s+)([^;]+)/,
    repl: '$5$2$3$4$1'
  });
}

// ------------------------------------------------------------------------
// $utility: unixToWinSlash
//
// $keywords: slash, windows, unix
// $eg: chocolate/candy  ->  chocolate\candy
// $desc: Converts slashes to backslashes
// ------------------------------------------------------------------------

function unixToWinSlash() {
  utilityManager({
    utilType: utInTransform,
    pat: /\//g,
    repl: '\\'
  });
}

// ------------------------------------------------------------------------
// $utility: winToUnixSlash
//
// $keywords: slash, windows, unix
// $eg: chocolate\candy  ->  chocolate/candy
// $desc: Converts backslashes to slashes
// ------------------------------------------------------------------------

function winToUnixSlash() {
  utilityManager({
    utilType: utInTransform,
    pat: /\\/g,
    repl: '/'
  });
}

// ------------------------------------------------------------------------
// $utility: singleToDoubleSlash
//
// $keywords: slash, single slash, double slash
// $eg: find\nagain  ->  find\\\nagain
// ------------------------------------------------------------------------

function singleToDoubleSlash() {
  utilityManager({
    utilType: utInTransform,
    pat: /\\/g,
    repl: '\\\\'
  });
}

// ------------------------------------------------------------------------
// $utility: doubleToSingleSlash
//
// $keywords: slash, single slash, double slash
// $eg: find\\\nagain -> find\nagain
// ------------------------------------------------------------------------

function doubleToSingleSlash() {
  utilityManager({
    utilType: utInTransform,
    pat: /\\\\/g,
    repl: '\\'
  });
}

// ------------------------------------------------------------------------
// $utility: urlEncode
//
// $keywords: encode, urldecode
// $eg: https://github.com  ->  https%3A%2F%2Fgithub.com
// ------------------------------------------------------------------------

function urlEncode() {

  utilityManager({
    utilType: utTransform
  }, (up) => encodeURIComponent(up.intext));
}

// ------------------------------------------------------------------------
// $utility: urlDecode
//
// $keywords: decode, urldecode
// $eg: https%3A%2F%2Fgithub.com  ->  https://github.com
// ------------------------------------------------------------------------

function urlDecode() {

  utilityManager({
    utilType: utTransform
  }, (up) => decodeURIComponent(up.intext));
}

// ------------------------------------------------------------------------
// $utility: regnize
//
// $desc: Adds slash to regular expression metachars
// $keywords: regular expressions
// $eg: (\w+)[A-Z]a*b+text  ->  \(\\w\+\)\[A-Z\]a\*b\+text
// ------------------------------------------------------------------------

function regnize() {

  utilityManager({
    utilType: utTransform
  }, (up) => regnize_(up.intext, true));
}

// ------------------------------------------------------------------------
// $utility: headerToBookmark
//
// $desc: Converts markdown header text to Html Bookmark
// $keywords: markdown html bookmark
// $eg: Is this the header 你好?  ->  is-this-the-header-你好
// ------------------------------------------------------------------------

function headerToBookmark() {

  utilityManager({
      utilType: utTransform
    }, (up) => up.intext.trim().toLowerCase()
    .replace(/[^\w\- \u0080-\uFFFFF]+/ug, ' ')
    .replace(/\s+/g, '-').replace(/\-+$/, ''));
}

// ------------------------------------------------------------------------
// $utility: mixer
//
// $desc: Mixes the lines of different sections.
// $keywords: mix
// $eg: // section||abc||cde||// end-section|| // section||123||345 -> abc||123||cde||345
// ------------------------------------------------------------------------

function mixer() {

  utilityManagerWithUserInputs({
      utilType: utTransform
    },
    [{
        prompt: 'Start Section Line Pattern'
      },
      {
        prompt: 'End Section Line Pattern'
      },
      {
        prompt: 'Mixer'
      }
    ],

    (up) => {
      const startSection = up.userinputs[0];
      const endSection = up.userinputs[1];
      const mixer = up.userinputs[2];
      if (!startSection || !endSection || !mixer) {
        return up.intext;
      }

      const sections = [];
      const regStartSection = new RegExp(startSection);
      const regEndSection = new RegExp(endSection);
      let section;

      const lines = up.intext.split(/\n/);
      const outLines = [];
      let insertAtLine = undefined;

      lines.forEach((line, lineNr) => {
        if (!section) {
          // scans for the section start
          if (regStartSection.test(line)) {
            section = [];
            insertAtLine = insertAtLine || lineNr;
          } else {
            outLines.push(line);
          }

        } else {
          // scans for the section end
          if (regEndSection.test(line)) {
            sections.push(section);
            section = undefined;
          } else {
            section.push(line);
          }
        }
      });

      // needs at least 2 section to mix
      if (sections.length < 2) {
        return up.intext;
      }

      const insData = sections[0].map((_line, lineNr) => mixer
        .replace(/\$(\d+)/g, (_all, secNr) => sections[parseInt(secNr)][lineNr])
        .replace(/\\n/g, '\n')
      );

      outLines.splice(insertAtLine, 0, insData.join('\n'));
      return outLines.join('\n');
    });
}


// ------------------------------------------------------------------------
//                               Line Utilities
//
// $cattitle: Line Utilities
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
// $utility: removeDuplicatedLines
//
// $keywords: remove, duplicates
// $eg: first||second||second||->||first||second
// $desc: Removes consecutive duplicated lines
// ------------------------------------------------------------------------

function removeDuplicatedLines() {
  utilityManager({
    utilType: utLinesUtility
  }, (up) => {
    let arr = up.inlines;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i + 1] === arr[i]) {
        arr.splice(i + 1, 1);
      }
    }
    return arr;
  });
}

// ------------------------------------------------------------------------
// $utility: removeEmptyLines
//
// $keywords: remove, empty
// $eg: first||||second||->||first||second
// ------------------------------------------------------------------------

function removeEmptyLines() {
  utilityManager({
    utilType: utLinesUtility
  }, (up) => {
    let arr = up.inlines;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (!arr[i].trim()) {
        arr.splice(i, 1);
      }
    }
    return arr;
  });
}

// ------------------------------------------------------------------------
// $utility: joinLines
//
// $keywords: join, lines
// $eg: red||green||-> expr:(x\c{X0A}),||red(x0A),green(x0B)
// $desc: Joins lines adding the computed expression at the end of every line
// ------------------------------------------------------------------------

function joinLines() {
  utilityManagerWithUserInputs({
      utilType: utLinesUtility,
    },
    [{
      prompt: 'Expression'
    }],
    (up) => {
      let userInput = up.userinputs[0];

      // when the userInput doesn't have dynamic values
      // is much faster to bypass processing line by line
      if (hasDynamicValues(userInput)) {
        up.inlines.forEach((line, index) => {
          up.inlines[index] += processExpression(userInput, up.selNr + index, line);
        });
        userInput = '';
      } else {
        userInput = processExpression(userInput, up.selNr, up.intext);
      }

      let joinedLines = up.inlines.join(userInput);
      return [joinedLines];
    });
}

// ------------------------------------------------------------------------
// $utility: splitLines
//
// $keywords: split, lines
// $eg: red,green||-> expr: = \c{1}||red = 1||green = 2
// $desc: Split lines by an expression. Dynamic values aren't supported
// ------------------------------------------------------------------------

function splitLines() {
  utilityManagerWithUserInputs({
      utilType: utLinesUtility,
    },
    [{
      prompt: 'Expression'
    }],
    (up) => {
      let userInput = processExpression(up.userinputs[0], up.selNr, up.intext);
      let resLines = [];
      let index = 0;
      up.inlines.forEach((line) => {
        resLines = resLines.concat(line.split(userInput));
      });
      return resLines;
    });
}

// ------------------------------------------------------------------------
// $utility: sortNumericallyAscending
//
// $keywords: sort
// $eg: 10. red||2. green||->||2. green||10. red
// $desc: For each line uses the first number as sort key
// ------------------------------------------------------------------------

function sortNumericallyAscending() {
  utilityManager({
      utilType: utLinesUtility,
    },
    (up) => {
      let keylines = up.inlines.map((line => {
        let match = line.match(/(\d+)/);
        let key = match ? parseInt(match[0]) : 0;
        return [key, line];
      }));
      keylines.sort((a, b) => a[0] - b[0]);
      return keylines.map(keypair => keypair[1]);
    });
}

// ------------------------------------------------------------------------
// $utility: indentOneSpace
//
// $keywords: indent
// $eg: __NONE__
// $desc: Adds one space to the beginning of each line
// ------------------------------------------------------------------------

function indentOneSpace() {
  utilityManager({
      utilType: utLineUtility,
    },
    (up) => ' ' + up.intext);
}

// ------------------------------------------------------------------------
// $utility: outdentOneSpace
//
// $keywords: indent
// $eg: __NONE__
// $desc: Removes one space to the beginning of each line
// ------------------------------------------------------------------------

function outdentOneSpace() {
  utilityManager({
      utilType: utLineUtility,
    },
    (up) => up.intext !== '' && up.intext[0] === ' ' ?
    up.intext.substr(1) : up.intext);
}

// ------------------------------------------------------------------------
//                               Insert Utilities
//
// $cattitle: Insert Text Utilities
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
// $utility: insertISODate
//
// $title: Insert ISO Date
// $keywords: date
// $eg: 2018-02-08
// ------------------------------------------------------------------------

function insertISODate() {
  utilityManager({
    utilType: utInsertAtEndUtility
  }, (up) => ISODate());
}

// ------------------------------------------------------------------------
// $utility: insertISOTimeDate
//
// $title: Insert ISO TimeDate
// $keywords: date
// $eg: 2018-02-08 10:12:15
// ------------------------------------------------------------------------

function insertISOTimeDate() {
  utilityManager({
    utilType: utInsertAtEndUtility
  }, (up) => ISOTimeDate());
}

// ------------------------------------------------------------------------
// $utility: insertUUID
//
// $title: Insert UUID
// $keywords: uuid, guid
// $eg: 7fff60f8-91e8-40ba-9053-56b0f3a487f0
// ------------------------------------------------------------------------

function insertUUID() {
  utilityManager({
    utilType: utInsertAtEndUtility
  }, (up) => uuidv4());
}

// ------------------------------------------------------------------------
// $utility: insertTextAtEnd
//
// $keywords: insert, text
// $eg: red||green||-> expr: = \c{1}||red = 1||green = 2
// ------------------------------------------------------------------------

function insertTextAtEnd() {
  utilityManagerWithUserInputs({
      utilType: utInsertAtEndUtility
    },
    [{
      prompt: 'Expression'
    }],

    (up) => {
      let userInput = processExpression(up.userinputs[0], up.selNr, up.intext);
      return userInput;
    });
}

// ------------------------------------------------------------------------
// $utility: insertTextAtStart
//
// $keywords: insert, text
// $eg: red||green||->expr: const \e{upper} =||const RED = red||const GREEN = green
// ------------------------------------------------------------------------

function insertTextAtStart() {
  utilityManagerWithUserInputs({
      utilType: utInsertAtStartUtility
    },
    [{
      prompt: 'Expression'
    }],

    (up) => {
      let userInput = processExpression(up.userinputs[0], up.selNr, up.intext);
      return userInput;
    });
}


// ------------------------------------------------------------------------
//                               utilities
// ------------------------------------------------------------------------

// this function is credited to @broofa
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// this function is credited to @Flygenring
// https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
function getLocalISOTimeDate() {
  let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  return (new Date(Date.now() - tzoffset)).toISOString().substr(0, 19).replace('T', ' ');
}


function ISODate() {
  return getLocalISOTimeDate().substr(0, 10);
}

function ISOTimeDate() {
  return getLocalISOTimeDate();
}

function regnize_(text, isFind) {
  const
    REGNIZEFIND = /([\\.()\[\]*+\^$])/g,
    REGNIZEREPL = '\\$1';
  return text.replace(isFind ? REGNIZEFIND : /(\$\d)/g, REGNIZEREPL);
}

// ------------------------------------------------------------------------
//                               processMacro
// ------------------------------------------------------------------------

function processMacro(macro, inpText) {
  switch (macro) {
    case 'upper':
      return inpText.toUpperCase();
    case 'lower':
      return inpText.toLowerCase();
    case 'capitalize':
      return inpText[0].toUpperCase() + inpText.substr(1);
    case 'length':
      return inpText.length.toString();
    case 'regnize':
      return regnize_(inpText, true);
    case 'isodate':
      return ISODate();
    case 'isotimedate':
      return ISOTimeDate();
    case 'uuid':
      return uuidv4();
  }
  return inpText;
}

// ------------------------------------------------------------------------
//                               processExpression
// ------------------------------------------------------------------------
/**
 * Tests if the expression has macros that dynamic
 */
function hasDynamicValues(expression) {
  return /\\(c|e)/.test(expression);
}

/**
 * Replaces macros with its text
 * Each macro starts with a slash (\), and can have dynamic values
 */
// Special Characters: \t \n
// Macros:
//  \c | \c{start} - Replaces with value with a counter starting from 'start'
//                   e.g. \c   \c{5}   \c{x00ff} \c{X0A}
//  \e{function} - Replaces the selected text transformed by the function
//                   e.g. \e{upper}   \e{lower}

function processExpression(expression,
  selNr, selText) {

  return expression.replace(/\\(n|t|(?:c|e)(?:\{(\w+)\}){0,1})/g,
    (match, tag, valueParam) => {
      switch (tag.substr(0, 1)) {
        case 'n':
          return '\n';
        case 't':
          return '\t';
        case '\\':
          return '\\';
        case 'c':
          let value = selNr++;
          if (valueParam) {
            let firstChar = valueParam[0];

            // handles hex numbers
            if (firstChar === 'x' || firstChar === 'X') {
              value += parseInt(valueParam.substr(1), 16);
              let eres = Number(value).toString(16);
              // makes sure that the output has the same case as the input
              eres = firstChar === 'x' ? eres.toLowerCase() : eres.toUpperCase();
              // makes sure that the output has the same length or greater as the input
              let outLen = valueParam.length - 1;
              if (eres.length < outLen) eres = Array(outLen - eres.length + 1).join('0') + eres;
              return eres;

            } else {
              value += parseInt(valueParam);
            }
          }
          return Number(value).toString();

        case 'e':
          return processMacro(valueParam, selText);
      }
      return match;
    });
}

// ------------------------------------------------------------------------
//                               main class
// ------------------------------------------------------------------------

export default {

  subscriptions: null,

  activate(state) {
    atomtoixView = new AtomtoixView(state.atomtoixViewState);
    atomtoixView.modalPanel = atom.workspace.addModalPanel({
      item: atomtoixView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'IX:toggle': () => this.toggle(),
      'IX:capitalize': () => capitalize(),
      'IX:camelCase': () => camelCase(),
      'IX:spaceByUpper': () => spaceByUpper(),
      'IX:reverseAssignment': () => reverseAssignment(),
      'IX:unixToWinSlash': () => unixToWinSlash(),
      'IX:winToUnixSlash': () => winToUnixSlash(),
      'IX:singleToDoubleSlash': () => singleToDoubleSlash(),
      'IX:doubleToSingleSlash': () => doubleToSingleSlash(),
      'IX:urlEncode': () => urlEncode(),
      'IX:urlDecode': () => urlDecode(),
      'IX:regnize': () => regnize(),
      'IX:headerToBookmark': () => headerToBookmark(),
      'IX:mixer': () => mixer(),
      'IX:removeDuplicatedLines': () => removeDuplicatedLines(),
      'IX:removeEmptyLines': () => removeEmptyLines(),
      'IX:joinLines': () => joinLines(),
      'IX:splitLines': () => splitLines(),
      'IX:sortNumericallyAscending': () => sortNumericallyAscending(),
      'IX:indentOneSpace': () => indentOneSpace(),
      'IX:outdentOneSpace': () => outdentOneSpace(),
      'IX:insertISODate': () => insertISODate(),
      'IX:insertISOTimeDate': () => insertISOTimeDate(),
      'IX:insertUUID': () => insertUUID(),
      'IX:insertTextAtEnd': () => insertTextAtEnd(),
      'IX:insertTextAtStart': () => insertTextAtStart(),
    }));
  },

  deactivate() {
    atomtoixView.modalPanel.destroy();
    this.subscriptions.dispose();
    atomtoixView.destroy();
  },

  serialize() {
    return {
      atomtoixViewState: atomtoixView.serialize()
    };
  }
};

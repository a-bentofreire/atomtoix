# Atom Utility Belt

Strap on the belt and become a Ninja Developer with these 25 utilities.  

This version is a port of [vsctoix](https://github.com/a-bentofreire/vsctoix) 1.1.
except for the [selection Policies](#selection-policies), which in this version is more limited than vsctoix.  
This extension is also available for 
Brackets([bracketsix](https://github.com/a-bentofreire/bracketstoix)).  


## Utilities
| Utility  | Example |
| ------------- | ------------- |
__UTILITY_LIST_TABLE__

## Selection Policies

This version only supports one cursor, and operates only if the text is selected,  
except for `Insert Text Utilities`, which insert the text at the cursor position
if no text is selected.

## Expressions

Some of the utilities support expressions  
An expression is a text supporting the following metachars:  
- \n - newline
- \t - tab
- \c{start-value} - counter with optional start value  
    - \c  0,1,2,...  
    - \c{10} 10,11,12,...  
    - \c{x00a} x00a,x00b,x00c,...  
    - \c{XF} xF,x10,x11,...  

- \e{func} - transforms the selected text (line by line)  
    function list:  
    - upper - UpperCase  
    - lower - LowerCase  
    - length - Selected text length  
    - capitalize  
    - isodate  
    - isotimedate  
    - uuid  

## Contribute

Suggestions for more utilities and bug reports are welcome but don't forget the golden rule: Be Polite!  

## License

[MIT License+uuid License](https://github.com/a-bentofreire/uuid-licenses/blob/master/MIT-uuid-license.md)

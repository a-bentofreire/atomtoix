# Atom Utility Belt

Strap on the belt and become a Ninja Developer with these 25 utilities.  
  
This version is a port of [vsctoix](https://github.com/a-bentofreire/vsctoix) 1.1.
except for the [selection Policies](#selection-policies), which in this version is more limited than vsctoix.

## Utilities

* Transform Text Utilities
   * Capitalize ```e.g. classNameFunc  ->  ClassNameFunc```
   * Camel Case ```e.g. ClassNameFunc  ->  classNameFunc```
   * Add Space before Uppercase - **Useful to transform functions names into documentation**  
 ```e.g. doActionBefore  ->  do Action Before```
   * Reverse Assignment - **Reverses the terms of assignments or equal/different comparisons**  
 ```e.g. x == y[x] + 5  ->  y[x] + 5 == x```
   * Unix To Win Slash - **Converts slashes to backslashes**  
 ```e.g. chocolate/candy  ->  chocolate\candy```
   * Win To Unix Slash - **Converts backslashes to slashes**  
 ```e.g. chocolate\candy  ->  chocolate/candy```
   * Single To Double Slash ```e.g. find\nagain  ->  find\\\nagain```
   * Double To Single Slash ```e.g. find\\\nagain -> find\nagain```
   * Url Encode ```e.g. https://github.com  ->  https%3A%2F%2Fgithub.com```
   * Url Decode ```e.g. https%3A%2F%2Fgithub.com  ->  https://github.com```
   * Regnize - **Adds slash to regular expression metachars**  
 ```e.g. (\w+)[A-Z]a*b+text  ->  \(\\w\+\)\[A-Z\]a\*b\+text```
   * Header To Bookmark - **Converts markdown header text to Html Bookmark**  
 ```e.g. Is this the header 你好?  ->  is-this-the-header-你好```
   * Mixer - **Mixes the lines of different sections.**  
  
e.g.  
>// section  
>abc  
>cde  
>// end-section  
> // section  
>123  
>345 -> abc  
>123  
>cde  
>345  


* Line Utilities
   * Remove Duplicated Lines - **Removes consecutive duplicated lines**  
  
e.g.  
>first  
>second  
>second  
>->  
>first  
>second  

   * Remove Empty Lines  
e.g.  
>first  
>  
>second  
>->  
>first  
>second  

   * Join Lines - **Joins lines adding the computed expression at the end of every line**  
  
e.g.  
>red  
>green  
>-> expr:(x\c{X0A}),  
>red(x0A),green(x0B)  

   * Split Lines - **Split lines by an expression. Dynamic values aren't supported**  
  
e.g.  
>red,green  
>-> expr: = \c{1}  
>red = 1  
>green = 2  

   * Sort Numerically Ascending - **For each line uses the first number as sort key**  
  
e.g.  
>10. red  
>2. green  
>->  
>2. green  
>10. red  

   * Indent One Space - **Adds one space to the beginning of each line**  

   * Outdent One Space - **Removes one space to the beginning of each line**  


* Insert Text Utilities
   * Insert ISO Date ```e.g. 2018-02-08```
   * Insert ISO TimeDate ```e.g. 2018-02-08 10:12:15```
   * Insert UUID ```e.g. 7fff60f8-91e8-40ba-9053-56b0f3a487f0```
   * Insert Text At End  
e.g.  
>red  
>green  
>-> expr: = \c{1}  
>red = 1  
>green = 2  

   * Insert Text At Start  
e.g.  
>red  
>green  
>->expr: const \e{upper} =  
>const RED = red  
>const GREEN = green  



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
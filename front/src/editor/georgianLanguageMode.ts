// georgianLanguageMode.ts
import { defineMode } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './GeorgianLanguageStyle.css'
// georgianLanguageMode.ts

const indentLength: number = 2
defineMode('georgianLanguage', function() {
    // ... other parts of the mode definition ...

        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
    function tokenBase(stream: any, _state: any): string | null {
        // If the stream is at the start of a space, consume it and return null (no styling).
        if (stream.eatSpace()) return null;
        
        const ch = stream.next();

        if (ch === '{') {
            _state.indentation += indentLength; // Increase indentation
        } else if (ch === '}') {
            _state.indentation = Math.max(0, _state.indentation - indentLength); // Decrease indentation
        }
        // Handle comments: if we find a slash and then another slash, it's a comment.
        if (ch === '/' && stream.eat('/')) {
            // Consume the rest of the line - it's a comment.
            stream.skipToEnd();
            return 'comment'; // Apply the 'comment' style from the CSS.
        }

        // Handle string literals.
        if (ch === '"') {
            // Consume all characters until the next quote character.
            stream.eatWhile((nextChar: string) => nextChar !== '"');
            stream.next(); // Consume the closing quote.
            return 'string'; // Apply the 'string' style from the CSS.
        }
        

        if (ch === "'") {
            // Consume all characters until the next quote character.
            stream.eatWhile((nextChar: string) => nextChar !== "'");
            stream.next(); // Consume the closing quote.
            return 'string'; // Apply the 'string' style from the CSS.
        }

        if (stream.match(/^[0-9]+(\.[0-9]+)?/)) {
            return "number";  // "value" could also be used if you prefer
        }
        // Handle keywords.
        // Look for a sequence of characters that are not white-space, and check if it's a keyword.
        if (/[\w\u10A0-\u10FF]/.test(ch)) {
            stream.eatWhile(/[\w\u10A0-\u10FF]/
            ); // Continue to eat word characters.
            const word = stream.current(); // The current word we've collected.
            // Check if the word is one of our keywords.
            if (word == 'სიტყვა' || word == 'ბულეანი' || word == 'რიცხვი') {
                return 'variable'
            }
            
            if (word == 'ჭეშმარიტი' || word == 'მცდარი') {
                return 'booleanValues'
            }
            if (word == 'თუ' || word === 'სანამ') {
                return 'keyword';
            }
        }

        // If none of the above conditions are met, return null.
        // This text doesn't get any special styling.
        return null;
    }

    // This function updates the state's indentation based on the line's text.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
    // function updateIndentation(state: any, text: string) {
    //     const firstChar: string = text && text.charAt(0)
    //     console.log("IN INDENTS")
    //     // const level = state.indentation;
    //     // const match = firstChar.match(/([{}])/g); // Match all opening/closing braces
    //     if (firstChar == '{') {
    //         // Increase indentation for each opening brace
    //         state.indentation += indentLength;
    //         console.log("state.indentation in if" +  state.indentation)
    //
    //     } else if (firstChar === '}') {
    //         // Decrease indentation for each closing brace
    //         state.indentation = Math.max(0, state.indentation -= indentLength);
    //     }
    //     console.log("state.indentation " +  state.indentation)
    //     return state.indentation * indentLength;
    // }
    

    return {
        startState: function() {
            return {
                token: tokenBase,
                indentation: 0 // Start with no indentation
            };
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
        token: function(stream: any, state: any) {
            // ... tokenizing logic ...
            return state.token(stream, state);
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
        indent: function(state: any, textAfter: string) {
            const firstChar = textAfter.trim()[0]; // Get the first non-whitespace character of the next line
            if (firstChar === '{') {
                return state.indentation + indentLength; // Increase indent if '{' is found
            } else if (firstChar === '}') {
                return Math.max(0, state.indentation - indentLength); // Decrease indent if '}' is found, but not below zero
            }
            return state.indentation;
            // Use the helper function to determine indentation
            //
            // const indentation: number =  updateIndentation(state, textAfter) * 4; // Multiply by the size of the indentation (e.g., 4 spaces)
            // console.log("after func indentation " +  state.indentation)
            // return indentation
        },
        lineComment: '//'
    };
}
);

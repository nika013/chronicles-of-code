// georgianLanguageMode.ts
import { defineMode } from 'codemirror';
import 'codemirror/lib/codemirror.css';

// georgianLanguageMode.ts
defineMode('georgianLanguage', function() {
    // ... other parts of the mode definition ...

        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
        function tokenBase(stream: any, _state: any): string | null {
        // If the stream is at the start of a space, consume it and return null (no styling).
        if (stream.eatSpace()) return null;
        
        const ch = stream.next();
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

        // Handle keywords.
        // Look for a sequence of characters that are not white-space, and check if it's a keyword.
        if (/\w/.test(ch)) {
            stream.eatWhile(/\w/); // Continue to eat word characters.
            const word = stream.current(); // The current word we've collected.
            // Check if the word is one of our keywords.
            if (word === 'რიცხვი' || word === 'სანამ') {
                return 'keyword'; // Apply the 'keyword' style from the CSS.
            }
        }

        // If none of the above conditions are met, return null.
        // This text doesn't get any special styling.
        return null;
    }

    // This function updates the state's indentation based on the line's text.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
        function updateIndentation(state: any, text: string) {
        const level = state.indentation;
        const match = text.match(/(\{|\})/g); // Match all opening/closing braces
        if (match) {
            match.forEach((token) => {
                if (token === '{') {
                    // Increase indentation for each opening brace
                    state.indentation++;
                } else if (token === '}') {
                    // Decrease indentation for each closing brace
                    state.indentation = Math.max(0, state.indentation - 1);
                }
            });
        }
        return level;
    }

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
            // Use the helper function to determine indentation
            return updateIndentation(state, textAfter) * 4; // Multiply by the size of the indentation (e.g., 4 spaces)
        },
        lineComment: '//'
    };
}
);

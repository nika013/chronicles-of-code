import { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'; // Core CodeMirror CSS

import 'codemirror/theme/material.css'; // Theme CSS, you can choose another
import './georgianLanguageMode.ts'
import 'codemirror/theme/dracula.css';

function GeorgianCodeEditor() {
    const [code, setCode] = useState('// დაწერე კოდი აქ');

    return (
        <CodeMirror
            value={code}
            options={{
                mode: 'georgianLanguage', // Set the syntax mode
                theme: 'dracula', // Set the theme
                lineNumbers: true, // Enable line numbers
            }}
            onChange={(_, __, value) => {
                setCode(value);
            }}
        />
    );
}

export default GeorgianCodeEditor;

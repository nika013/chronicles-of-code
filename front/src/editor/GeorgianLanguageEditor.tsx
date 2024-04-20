import { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'; // Core CodeMirror CSS
import 'codemirror/theme/material.css'; // Theme CSS, you can choose another
// Import any syntax mode you need
// import 'codemirror/mode/xml/xml.js'; // For HTML
// import 'codemirror/mode/javascript/javascript.js'; // For JavaScript

function GeorgianCodeEditor() {
    const [code, setCode] = useState('// დაწერე კოდი აქ');

    return (
        <CodeMirror
            value={code}
            options={{
                mode: 'javascript', // Set the syntax mode
                theme: 'material', // Set the theme
                lineNumbers: true // Enable line numbers
            }}
            onChange={(_, __, value) => {
                setCode(value);
            }}

            // onChange={(editor, data, value) => {
            //     setCode(value);
            // }}
        />
    );
}

export default GeorgianCodeEditor;

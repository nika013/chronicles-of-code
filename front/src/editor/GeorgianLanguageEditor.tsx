import { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'; 
import './georgianLanguageMode.ts'
import 'codemirror/theme/twilight.css';

function GeorgianCodeEditor() {
    const [code, setCode] = useState('// დაწერე კოდი აქ');

    return (
        <CodeMirror
            value={code}
            options={{
                mode: 'georgianLanguage', 
                theme: 'twilight', 
                lineNumbers: true,
            }}
            onChange={(_, __, value) => {
                setCode(value);
            }}
        />
    );
}

export default GeorgianCodeEditor;

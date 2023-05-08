import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'

const CustomCKEditor = ({title}) => {
    return (
        <CKEditor
            editor={Editor}
            data={`<p>${title}</p>`}
            onReady={editor => {
                // You can store the "editor" and use when it is needed.
                
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                
            }}
            onBlur={(event, editor) => {
                
            }}
            onFocus={(event, editor) => {
                
            }}
        />
    )
}

export default CustomCKEditor
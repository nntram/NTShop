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
                console.log('Editor is ready to use!', editor);
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                console.log({ event, editor, data });
            }}
            onBlur={(event, editor) => {
                console.log('Blur.', editor);
            }}
            onFocus={(event, editor) => {
                console.log('Focus.', editor);
            }}
        />
    )
}

export default CustomCKEditor
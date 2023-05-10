import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'

const CustomCKEditor = ({title, value, setValue}) => {
    return (
        <CKEditor
            editor={Editor}
            data={title}
            onReady={editor => {
                setValue(title)
                console.log(title)
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                setValue(data)
            }}
            onBlur={(event, editor) => {
                
            }}
            onFocus={(event, editor) => {
                
            }}
        />
    )
}

export default CustomCKEditor
import React, { useState, useCallback, useMemo, useEffect, useImperativeHandle } from 'react'
import { Container } from 'reactstrap'
import { useDropzone } from "react-dropzone"

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

const UploadImage = ({myFiles, setMyFiles}) => {
    
    
    const onDrop = useCallback(acceptedFiles => {
        setMyFiles([
            ...myFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })),
            ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))
        ]);
    }, [myFiles])

    const { getRootProps, getInputProps, isFocused, isDragAccept,
        isDragReject } = useDropzone({
            onDrop,
            accept: {
                'image/*': ['.jpeg', '.png', '.jpg']
            },
        })

    const removeFile = file => () => {
        const newFiles = [...myFiles]
        newFiles.splice(newFiles.indexOf(file), 1)
        setMyFiles(newFiles)
    }

    const removeAll = () => {
        setMyFiles([])
    }

    const files = myFiles.map((file) => (
        <div key={file.name}>
            <li key={file.path}>
                {file.path} - {file.size} bytes{" "}
                <button className='btn btn-danger' onClick={removeFile(file)}><i className="ri-delete-bin-line"></i></button>
            </li>
            <div style={thumb}>
                <div style={thumbInner}>
                    <img
                        src={file.preview}
                        style={img}
                        // Revoke data uri after image is loaded
                        onLoad={() => { URL.revokeObjectURL(file.preview) }}
                    />
                </div>
            </div>
        </div>
    ))

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);


    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => myFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        <section className="container border my-3 p-3">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Kéo và thả, hoặc click vào để chọn file</p>
            </div>
            <aside style={thumbsContainer}>

                <ul>{files}</ul>
            </aside>
            {files.length > 0 && <button className='btn btn-danger' onClick={removeAll}>Xóa tất cả</button>}
        </section>
    )
}

export default UploadImage
import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container } from 'semantic-ui-react';

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
  
const activeStyle = {
borderColor: '#2196f3'
};

const acceptStyle = {
borderColor: '#00e676'
};

const rejectStyle = {
borderColor: '#ff1744'
};
  
interface Props {
    onChange: (f: File) => void
}
function StyledDropzone(props: Props) {
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({accept: 'image/*', multiple: false, maxSize: 500000}); //500 000 ==

    const style: any = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject
    ]);

    const files = acceptedFiles.map((file: any) => (
        <li key={file.path}>
        {file.path} - {file.size} bytes
        </li>
    ));

    if (acceptedFiles.length === 1) {
        props.onChange(acceptedFiles[0])
    }

    return (
        <Container>
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop your image here, or click to select a file</p>
            </div>
            <div>
                {files}
            </div>
        </Container>
    );
}

export default StyledDropzone;
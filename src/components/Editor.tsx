import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Editor = (props: { data: any, onChange: any }) => {
    const config = {
        toolbar: {
            items: ['bold', 'italic', '|', 'undo', 'redo', '|', 'numberedList', 'bulletedList']
        }
    }

    return (
        <CKEditor
            editor={ClassicEditor}
            config={config}
            data={props.data}
            onChange={(event: any, editor: any) => {
                const content = editor.getData();
                props.onChange(content);
            }}
        />
    );
};

export default Editor;
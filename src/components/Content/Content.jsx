import React, { useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaSave } from 'react-icons/fa';

const CRMTextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [savedContent, setSavedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Load saved content (example)
  const loadSavedContent = (html) => {
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setEditorState(EditorState.createWithContent(contentState));
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus('Saving...');

    // Convert content to HTML
    const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setSavedContent(contentHtml);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  return (
    <div className="container-fluid p-4">
      <div className="card border rounded-0">
        <div className="card-header bg-white border-0 d-flex justify-content-center align-items-center" style={{ height: '70px' }}>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between w-100">
            <h5 className="mb-2 mb-md-0 text-center">Text Editor</h5>
            <button
              className="btn btn-dark btn-sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <FaSave className="me-1" /> {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* React Draft WYSIWYG Editor */}
          <div className="border rounded mb-3" style={{ minHeight: '300px' }}>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'embedded', 'image', 'remove', 'history'],
                inline: {
                  options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
                },
                blockType: {
                  options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
                },
                list: { options: ['unordered', 'ordered'] },
                textAlign: { options: ['left', 'center', 'right', 'justify'] },
                link: { options: ['link', 'unlink'] },
                image: {
                  uploadEnabled: true,
                  uploadCallback: (file) => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = (e) => resolve({ data: { link: e.target.result } });
                      reader.readAsDataURL(file);
                    });
                  },
                  alt: { present: true, mandatory: false },
                },
              }}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class p-3"
              toolbarClassName="toolbar-class bg-light border-bottom"
            />
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className={`alert ${saveStatus.includes('success') ? 'alert-success' : 'alert-info'} py-2`}>
              {saveStatus}
            </div>
          )}

          {/* HTML Preview (optional) */}
          <div className="mt-4">
            <h6>HTML Preview:</h6>
            <div
              className="bg-light p-3 rounded"
              style={{ maxHeight: '200px', overflow: 'auto' }}
              dangerouslySetInnerHTML={{ __html: savedContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMTextEditor;
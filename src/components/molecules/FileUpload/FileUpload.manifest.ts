import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'file-upload',
  name: 'FileUpload',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A drag-and-drop file upload zone with a file list, per-file progress bars, error display, and size/type validation.',

  designIntent:
    'FileUpload separates concerns between the drop zone (entry point) and the file list (status display). ' +
    'The drop zone uses a dashed border and an upload arrow icon to communicate droppability without words. ' +
    'Progress is modelled as a field on UploadFile rather than as a callback so the parent controls upload logic — this component is purely presentational for the upload state. ' +
    'The progress bar turns success-green at 100% to give clear completion feedback. ' +
    'Errors are shown inline on each file row (not as a toast) so the user knows exactly which file failed and why. ' +
    'The hidden <input type="file"> is triggered programmatically on click/keyboard so the drop zone can have a fully custom appearance.',

  props: [
    {
      name: 'accept',
      type: 'string',
      required: false,
      description: 'Accepted MIME types or extensions passed to the file input, e.g. "image/*,.pdf".',
    },
    {
      name: 'multiple',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Allow selecting multiple files at once.',
    },
    {
      name: 'maxSize',
      type: 'number',
      required: false,
      description: 'Maximum file size in bytes. Files exceeding this trigger onError and are not added.',
    },
    {
      name: 'value',
      type: 'array',
      required: false,
      description: 'Controlled array of UploadFile objects. Each has id, file (File), optional progress (0–100), and optional error string.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called with the updated UploadFile array after files are added or removed.',
    },
    {
      name: 'onError',
      type: 'function',
      required: false,
      description: 'Called with an error message string when a file fails validation (e.g. exceeds maxSize).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disables the drop zone and all file interaction.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the outer wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Uncontrolled multi-file upload',
      code: `<FileUpload
  multiple
  accept="image/*,.pdf"
  maxSize={5 * 1024 * 1024}
  onError={(msg) => toast.error(msg)}
  onChange={(files) => console.log(files)}
/>`,
    },
    {
      title: 'Controlled with progress',
      code: `const [files, setFiles] = useState<UploadFile[]>([]);

const handleChange = async (updated: UploadFile[]) => {
  setFiles(updated);
  for (const f of updated.filter(f => f.progress === undefined)) {
    // simulate upload
    for (let p = 0; p <= 100; p += 10) {
      await delay(100);
      setFiles(prev => prev.map(x => x.id === f.id ? { ...x, progress: p } : x));
    }
  }
};

<FileUpload value={files} onChange={handleChange} multiple />`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Drop zone label, file name, file size, and error messages', required: true },
  ],

  accessibility: {
    role: 'button',
    ariaAttributes: ['aria-label', 'aria-disabled'],
    keyboardInteractions: ['Enter/Space to open file picker', 'Tab to focus drop zone'],
    notes: 'The drop zone has role="button" with tabIndex=0 and responds to Enter/Space. Remove buttons on file rows have aria-label including the filename.',
  },
};

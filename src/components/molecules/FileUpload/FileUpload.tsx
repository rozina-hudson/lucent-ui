import {
  useState, useRef, useCallback,
  type CSSProperties, type DragEvent, type ChangeEvent,
} from 'react';
import { Text } from '../../atoms/Text/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadFile {
  id: string;
  file: File;
  /** 0–100. Undefined = not yet started. */
  progress?: number;
  error?: string;
}

export interface FileUploadProps {
  /** Accepted MIME types or extensions, e.g. "image/*,.pdf" */
  accept?: string;
  multiple?: boolean;
  /** Max file size in bytes */
  maxSize?: number;
  /** Controlled file list */
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  style?: CSSProperties;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

// ─── File row ─────────────────────────────────────────────────────────────────

function FileRow({
  item,
  onRemove,
}: {
  item: UploadFile;
  onRemove: (id: string) => void;
}) {
  const [removeHovered, setRemoveHovered] = useState(false);
  const pct = item.progress;
  const hasError = !!item.error;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--lucent-space-3)',
      padding: 'var(--lucent-space-2) var(--lucent-space-3)',
      borderRadius: 'var(--lucent-radius-md)',
      border: `1px solid ${hasError ? 'var(--lucent-danger-default)' : 'var(--lucent-border-default)'}`,
      background: 'var(--lucent-surface-default)',
    }}>
      {/* File icon */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden style={{ flexShrink: 0, color: 'var(--lucent-text-secondary)' }}>
        <path d="M5 2h7l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.3" />
      </svg>

      <div style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" truncate>{item.file.name}</Text>
        {hasError ? (
          <Text size="xs" color="danger">{item.error}</Text>
        ) : (
          <Text size="xs" color="secondary">{formatBytes(item.file.size)}</Text>
        )}
        {/* Progress bar */}
        {pct !== undefined && !hasError && (
          <div style={{
            marginTop: 4,
            height: 3,
            borderRadius: 'var(--lucent-radius-full)',
            background: 'var(--lucent-bg-muted)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 'var(--lucent-radius-full)',
              background: pct === 100 ? 'var(--lucent-success-default)' : 'var(--lucent-accent-default)',
              transition: 'width 200ms var(--lucent-easing-default)',
            }} />
          </div>
        )}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        onMouseEnter={() => setRemoveHovered(true)}
        onMouseLeave={() => setRemoveHovered(false)}
        aria-label={`Remove ${item.file.name}`}
        style={{
          flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 24, height: 24,
          border: 'none',
          borderRadius: 'var(--lucent-radius-md)',
          background: removeHovered ? 'var(--lucent-bg-muted)' : 'transparent',
          color: 'var(--lucent-text-secondary)',
          cursor: 'pointer',
          transition: 'background var(--lucent-duration-fast)',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── FileUpload ───────────────────────────────────────────────────────────────

export function FileUpload({
  accept,
  multiple = false,
  maxSize,
  value: controlledValue,
  onChange,
  onError,
  disabled = false,
  style,
}: FileUploadProps) {
  const isControlled = controlledValue !== undefined;
  const [internalFiles, setInternalFiles] = useState<UploadFile[]>([]);
  const files = isControlled ? controlledValue! : internalFiles;

  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((raw: FileList | null) => {
    if (!raw || disabled) return;
    const incoming: UploadFile[] = [];
    for (const file of Array.from(raw)) {
      if (maxSize && file.size > maxSize) {
        onError?.(`"${file.name}" exceeds the ${formatBytes(maxSize)} limit.`);
        continue;
      }
      if (!multiple && files.length + incoming.length >= 1) break;
      incoming.push({ id: uid(), file });
    }
    if (incoming.length === 0) return;
    const next = multiple ? [...files, ...incoming] : incoming;
    if (!isControlled) setInternalFiles(next);
    onChange?.(next);
  }, [disabled, files, isControlled, maxSize, multiple, onChange, onError]);

  const removeFile = (id: string) => {
    const next = files.filter(f => f.id !== id);
    if (!isControlled) setInternalFiles(next);
    onChange?.(next);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-3)', ...style }}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload files"
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--lucent-space-2)',
          padding: 'var(--lucent-space-8) var(--lucent-space-6)',
          borderRadius: 'var(--lucent-radius-lg)',
          border: `2px dashed ${
            disabled
              ? 'var(--lucent-border-default)'
              : dragging
              ? 'var(--lucent-accent-default)'
              : focused
              ? 'var(--lucent-accent-default)'
              : 'var(--lucent-border-default)'
          }`,
          background: dragging
            ? 'var(--lucent-accent-subtle)'
            : 'var(--lucent-bg-subtle)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color var(--lucent-duration-fast), background var(--lucent-duration-fast)',
          outline: 'none',
        }}
      >
        {/* Upload icon */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden
          style={{ color: disabled ? 'var(--lucent-text-disabled)' : dragging ? 'var(--lucent-accent-default)' : 'var(--lucent-text-secondary)' }}>
          <path d="M16 20V10M16 10l-4 4M16 10l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 24h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        <div style={{ textAlign: 'center' }}>
          <Text color={disabled ? 'disabled' : 'primary'} weight="medium">
            {dragging ? 'Drop to upload' : 'Drop files here or click to browse'}
          </Text>
          {(accept || maxSize) && (
            <Text size="xs" color="secondary">
              {[
                accept && `Accepted: ${accept}`,
                maxSize && `Max size: ${formatBytes(maxSize)}`,
              ].filter(Boolean).join(' · ')}
            </Text>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          style={{ display: 'none' }}
          tabIndex={-1}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-2)' }}>
          {files.map(item => (
            <FileRow key={item.id} item={item} onRemove={removeFile} />
          ))}
        </div>
      )}
    </div>
  );
}

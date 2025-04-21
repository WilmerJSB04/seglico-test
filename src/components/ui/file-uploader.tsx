"use client";

import * as React from "react";
import { FileIcon, UploadIcon, X, File, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentAttachments } from "@/types/penalties";

interface FileUploaderProps {
  onFilesChange: (files: File[] | DocumentAttachments[]) => void;
  existingFiles?: DocumentAttachments[];
  accept?: string;
  multiple?: boolean;
}

export function FileUploader({
  onFilesChange,
  existingFiles = [],
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  multiple = true,
}: FileUploaderProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Convert file size to readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle file selection
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      onFilesChange(newFiles as File[]);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      onFilesChange([...files, ...newFiles]);
    }
  };

  // Handle file drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Remove a file
  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles as File[]);
  };

  // Remove an existing file
  const removeExistingFile = (id: number) => {
    const updatedExistingFiles = existingFiles.filter(file => file.id !== id);
    onFilesChange(updatedExistingFiles as DocumentAttachments[]);
  };

  return (
    <div className="w-full space-y-4">
      <div 
        className={`border-2 border-dashed rounded-md p-6 text-center ${
          dragActive ? "border-primary bg-muted/30" : "border-muted-foreground/30"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadIcon className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold">Haz click para subir</span> o arrastra y suelta
          </div>
          <div className="text-xs text-muted-foreground">
            Archivos soportados: PDF, DOC, DOCX, JPG, JPEG, PNG
          </div>
          <Button
            type="button" // Add type="button" to prevent form submission
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            className="mt-2"
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Seleccionar archivos
          </Button>
        </div>
      </div>

      {/* Display existing files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Archivos existentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <Button
                  type="button" // Add type="button" to prevent form submission
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExistingFile(file.id)}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display new files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Archivos a subir</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center space-x-2 truncate flex-grow">
                  <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({formatBytes(file.size)})
                  </span>
                </div>
                <Button
                  type="button" // Add type="button" to prevent form submission
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-7 w-7 p-0 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X, Download, Upload, File } from "lucide-react"

interface Attachment {
  id: number
  filename: string
  mimetype: string
  size: number
}

interface DocsModalProps {
  parentIdModel?: number
  attachmentsFromApi?: Attachment[]
  onClose: () => void
}

export const DocsModal = ({ 
  parentIdModel, 
  attachmentsFromApi, 
  onClose 
}: DocsModalProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploading, setUploading] = useState<boolean>(false)

  useEffect(() => {
    if (attachmentsFromApi) {
      setAttachments(attachmentsFromApi)
    }
  }, [attachmentsFromApi])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
    }
  }

  const uploadFiles = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })
      
      if (parentIdModel) {
        formData.append('parentId', parentIdModel.toString())
      }
      
      // API call - replace with your actual implementation
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const newAttachments = await response.json()
        setAttachments([...attachments, ...newAttachments])
        setFiles([])
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
    }
  }

  const downloadFile = async (attachment: Attachment) => {
    try {
      const response = await fetch(`/api/documents/${attachment.id}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = attachment.filename
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const deleteAttachment = async (attachmentId: number) => {
    try {
      const response = await fetch(`/api/documents/${attachmentId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setAttachments(attachments.filter(a => a.id !== attachmentId))
      }
    } catch (error) {
      console.error('Error deleting attachment:', error)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Documentación</DialogTitle>
        </DialogHeader>
        
        <div className="my-4">
          <div className="flex items-center gap-4 mb-4">
            <Input 
              type="file" 
              multiple 
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button 
              onClick={uploadFiles} 
              disabled={files.length === 0 || uploading}
              className="flex gap-2 items-center"
            >
              <Upload size={16} />
              {uploading ? 'Subiendo...' : 'Subir'}
            </Button>
          </div>
          
          {files.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Archivos seleccionados:</h3>
              <ul className="text-sm">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <File size={16} />
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attachments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No hay documentos adjuntos</TableCell>
                </TableRow>
              ) : (
                attachments.map((attachment) => (
                  <TableRow key={attachment.id}>
                    <TableCell>{attachment.filename}</TableCell>
                    <TableCell>{attachment.mimetype}</TableCell>
                    <TableCell>{(attachment.size / 1024).toFixed(2)} KB</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => downloadFile(attachment)}
                        >
                          <Download size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => deleteAttachment(attachment.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

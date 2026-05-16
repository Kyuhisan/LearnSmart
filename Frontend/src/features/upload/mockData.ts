export interface UploadedFile {
  id: string
  name: string
  size: string
  type: 'pdf' | 'video' | 'audio' | 'image' | 'doc'
  module: string
  uploadedAt: string
  status: 'processing' | 'ready' | 'error'
}

export const UPLOADED_FILES: UploadedFile[] = [
  { id: '1', name: 'Lecture 7 slides.pdf',        size: '12 MB',  type: 'pdf',   module: 'Machine Learning Fundamentals', uploadedAt: '2026-05-15', status: 'ready'      },
  { id: '2', name: 'Lab 3 — Gradient Descent.pdf', size: '4 MB',   type: 'pdf',   module: 'Machine Learning Fundamentals', uploadedAt: '2026-05-10', status: 'ready'      },
  { id: '3', name: 'Neural Net Intro.mp4',         size: '320 MB', type: 'video', module: 'Neural Networks Deep Dive',     uploadedAt: '2026-05-08', status: 'ready'      },
  { id: '4', name: 'Backpropagation Notes.pdf',    size: '2 MB',   type: 'pdf',   module: 'Neural Networks Deep Dive',     uploadedAt: '2026-05-01', status: 'ready'      },
  { id: '5', name: 'CV Lecture Draft.pdf',         size: '8 MB',   type: 'pdf',   module: 'Computer Vision Basics',        uploadedAt: '2026-05-16', status: 'processing' },
]

export const UPLOAD_MODULE_OPTIONS = [
  'Machine Learning Fundamentals',
  'Neural Networks Deep Dive',
  'Computer Vision Basics',
  'Statistics for Data Science',
  'Linear Algebra Refresher',
]

export const ACCEPTED_FILE_TYPES = ['.pdf', '.mp4', '.mp3', '.jpg', '.png', '.docx']

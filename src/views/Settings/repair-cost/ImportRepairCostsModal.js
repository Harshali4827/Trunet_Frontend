
import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CAlert,
  CSpinner,
  CProgress,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import axiosInstance from 'src/axiosInstance'

const ImportRepairCostsModal = ({ visible, onClose, onImportComplete }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importResults, setImportResults] = useState(null)
  const [previewData, setPreviewData] = useState([])
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError('')
    setImportResults(null)
    
    if (selectedFile) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv']
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file')
        setFile(null)
        return
      }
      previewCSV(selectedFile)
    }
  }

  const previewCSV = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        const preview = []
        
        for (let i = 1; i < Math.min(6, lines.length); i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
            const row = {}
            headers.forEach((header, index) => {
              row[header] = values[index] || ''
            })
            preview.push(row)
          }
        }
        
        setPreviewData(preview)
      } catch (err) {
        console.error('Error previewing CSV:', err)
        setPreviewData([])
      }
    }
    reader.readAsText(file)
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a CSV file to upload')
      return
    }

    setLoading(true)
    setError('')
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await axiosInstance.post('/repaired-cost/bulk-import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        }
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.data.success) {
        setImportResults(response.data)
        onImportComplete(response.data)
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setError(response.data.message || 'Import failed')
      }
    } catch (err) {
      console.error('Import error:', err)
      
      if (err.response?.data?.errors) {
        const errorList = err.response.data.errors
          .slice(0, 5)
          .map(err => `Row ${err.row}: ${err.errors.join(', ')}`)
          .join('\n')
        setError(`Import failed with errors:\n${errorList}`)
      } else if (err.response?.data?.productNotFound) {
        const notFoundList = err.response.data.productNotFound
          .slice(0, 5)
          .map(item => `Row ${item.row}: ${item.message}`)
          .join('\n')
        setError(`Products not found:\n${notFoundList}`)
      } else {
        setError(err.response?.data?.message || 'Failed to import data')
      }
    } finally {
      setLoading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await axiosInstance.get('/repaired-cost/template', {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'repair_costs_template.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading template:', error)
      setError('Failed to download template')
    }
  }

  const handleClose = () => {
    setFile(null)
    setError('')
    setImportResults(null)
    setPreviewData([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  return (
    <CModal visible={visible} onClose={handleClose} size="lg">
      <CModalHeader onClose={handleClose}>
        <CModalTitle>Import Repair Costs from CSV</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          {importResults ? (
            <CCard className="mb-3">
              <CCardHeader className="bg-success text-white">
                <strong>Import Completed Successfully!</strong>
              </CCardHeader>
              <CCardBody>
                <p>{importResults.message}</p>
                <CTable striped bordered hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Metric</CTableHeaderCell>
                      <CTableHeaderCell>Count</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>Total Processed</CTableDataCell>
                      <CTableDataCell>{importResults.summary.totalProcessed}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Successful</CTableDataCell>
                      <CTableDataCell className="text-success">
                        <strong>{importResults.summary.successful}</strong>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Failed</CTableDataCell>
                      <CTableDataCell className={importResults.summary.failed > 0 ? 'text-danger' : ''}>
                        {importResults.summary.failed}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Created</CTableDataCell>
                      <CTableDataCell>{importResults.summary.created}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Updated</CTableDataCell>
                      <CTableDataCell>{importResults.summary.updated}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell>Processing Time</CTableDataCell>
                      <CTableDataCell>{importResults.summary.processingTime}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                
                {importResults.errors && importResults.errors.length > 0 && (
                  <div className="mt-3">
                    <h6>Errors ({importResults.errors.length}):</h6>
                    <div className="border rounded p-2 bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {importResults.errors.slice(0, 10).map((err, index) => (
                        <div key={index} className="mb-1">
                          <small>Row {err.row}: {err.errors.join(', ')}</small>
                        </div>
                      ))}
                      {importResults.errors.length > 10 && (
                        <div className="text-muted">
                          <small>... and {importResults.errors.length - 10} more errors</small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CCardBody>
            </CCard>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label">Upload CSV File:</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="form-control"
                  disabled={loading}
                />
              </div>
              {uploadProgress > 0 && (
                <div className="mb-3">
                  <label className="form-label">Upload Progress:</label>
                  <CProgress value={uploadProgress} className="mb-1" />
                  <small>{uploadProgress}%</small>
                </div>
              )}
              {error && (
                <CAlert color="danger" className="mb-3">
                  {error.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </CAlert>
              )}

              <div className="mb-3">
                <CButton 
                  color="info" 
                  size="sm" 
                  onClick={handleDownloadTemplate}
                  disabled={loading}
                >
                  Download Template
                </CButton>
                <small className="text-muted ms-2">
                  Download a sample CSV file with the correct format
                </small>
              </div>
            </>
          )}
        </CForm>
      </CModalBody>
      <CModalFooter>
        {!importResults ? (
          <>
            <CButton 
              color="secondary" 
              onClick={handleClose} 
              disabled={loading}
            >
              Cancel
            </CButton>
            <CButton 
              className='reset-button'
              onClick={handleSubmit}
              // disabled={loading || !file}
            >
              {loading ? (
                <>
                  <CSpinner size="sm" /> Importing...
                </>
              ) : (
                'Import CSV'
              )}
            </CButton>
          </>
        ) : (
          <CButton color="primary" onClick={handleClose}>
            Close
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

ImportRepairCostsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImportComplete: PropTypes.func.isRequired,
}

export default ImportRepairCostsModal
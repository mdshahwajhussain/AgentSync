import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Layout from '../components/Layout';
import { Upload, FileText, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

interface Agent {
  _id: string;
  name: string;
  email: string;
}

interface Distribution {
  _id: string;
  fileName: string;
  date: string;
  totalItems: number;
  status: string;
}

const UploadList: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loadingDistributions, setLoadingDistributions] = useState(true);
  const [agentCount, setAgentCount] = useState(0);

  const fetchAgentCount = async () => {
    try {
      const response = await api.get('/agents/count');
      setAgentCount(response.data.count);
    } catch (error) {
      console.error('Failed to get agent count:', error);
    }
  };

  const fetchDistributions = async () => {
    try {
      setLoadingDistributions(true);
      const response = await api.get('/distributions');
      setDistributions(response.data);
    } catch (error) {
      console.error('Failed to fetch distributions:', error);
      toast.error('Failed to load distribution history');
    } finally {
      setLoadingDistributions(false);
    }
  };

  useEffect(() => {
    fetchAgentCount();
    fetchDistributions();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      // Check file type
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileType !== 'csv' && fileType !== 'xlsx' && fileType !== 'xls') {
        toast.error('Only CSV, XLSX, and XLS files are allowed');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    if (agentCount < 1) {
      toast.error('You need at least one agent to distribute list items');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/lists/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('File uploaded and distributed successfully');
      setFile(null);
      fetchDistributions();
    } catch (error: any) {
      console.error('Upload failed:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to upload and distribute file');
      }
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout title="Upload and Distribute Lists">
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upload New List</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload a CSV or Excel file to distribute items among your agents.
          </p>
        </div>
        
        <div className="px-6 py-5">
          {agentCount < 1 ? (
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You need to add at least one agent before you can upload and distribute lists.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
          <div 
            {...getRootProps()} 
            className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${
              isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            } border-dashed rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-50`}
          >
            <input {...getInputProps()} />
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <p className="pl-1">
                  {isDragActive
                    ? 'Drop the file here...'
                    : file 
                      ? file.name
                      : 'Drag and drop a file here, or click to select a file'}
                </p>
              </div>
              <p className="text-xs text-gray-500">CSV, XLSX, or XLS up to 5MB</p>
            </div>
          </div>
          
          {file && (
            <div className="mt-4 flex items-center justify-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="-ml-1 mr-2 h-4 w-4" />
                    Upload and Distribute
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Distribution History</h3>
        </div>
        
        {loadingDistributions ? (
          <div className="animate-pulse p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          </div>
        ) : distributions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Uploaded
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items Count
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {distributions.map((dist) => (
                  <tr key={dist._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{dist.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(dist.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dist.totalItems}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        dist.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {dist.status === 'completed' ? (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                            Processing
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm">No distributions yet. Upload your first list to get started!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UploadList;
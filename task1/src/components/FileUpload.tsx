import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { Upload } from 'lucide-react';

const FileUpload: React.FC<{ handleFileUpload: (file: File) => void }> = ({ handleFileUpload }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
      setErrorMessage(null);
    } else {
      setErrorMessage('Không thể upload file. Vui lòng chọn file hợp lệ.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    maxSize: 5*1024*1024, // 5 MB
  });

  return (
    <div className="p-4 rounded-lg">
      <div
        {...getRootProps({
          className: `border-2 border-dashed p-6 rounded-lg cursor-pointer transition-all ${
            isDragActive ? 'border-blue-500' : 'border-gray-300'
          }`,
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
            <div className="p-2 items-center">
                <p className="text-center text-blue-500">Kéo & thả tệp tại đây...</p>
            </div>
        ) : (
          <div className="text-center">
            <Upload className="m-auto w-[24px] h-[24px] text-gray-500"/>
            <p className="text-gray-500">Kéo & thả tệp tại đây</p>
            <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Chọn tệp tin
            </button>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 mt-2">
          * Chỉ chấp nhận file ở định dạng .xlsx, dung lượng file tối đa 5 MB
        </p>
      )}
    </div>
  );
};

export default FileUpload;

import { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './FileUpload';

const TransactionReport =  () => {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (uploadedFile: File) => {
    if (uploadedFile) {
      setFile(uploadedFile);
      console.log("uploadedFile.name: ", uploadedFile.name);
      setError(null); 
    }
  };

  // Xử lý tính toán tổng thành tiền
  const handleQuery = () => {
    setError(null);
    setTotalAmount(null);
    
    if (!file) {
      setError('Vui lòng upload tệp trước khi truy vấn!');
      return;
    }
    if (!startTime) {
      setError('Vui lòng nhập thời gian bắt đầu!');
      return;
    }
    if (!endTime) {
      setError('Vui lòng nhập thời gian kết thúc!');
      return;
    }
    if (startTime >= endTime) {
      setError('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
      return;
    }
    setIsLoading(true); 
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      
      const header: string[] = jsonData[7] as string[];  // Dữ liệu lấy từ dòng thứ 8 (bảng)
      console.log("header: ", header);
      const timeIndex = header.findIndex((h: string) => h === 'Giờ');
      const totalMoneyIndex = header.findIndex((h: string) => h === 'Thành tiền (VNĐ)');

      if (timeIndex === -1 || totalMoneyIndex === -1) {
        setError('Không tìm thấy cột "Giờ" hoặc "Thành tiền (VNĐ)" trong file.');
        setIsLoading(false);
        return;
      }
      const transactionRows = jsonData.slice(8); 

      //Tính tổng tiền theo khoảng thời gian
      let total = 0;
      transactionRows.filter((row: any) => {
        const time = row[timeIndex]; 
        const totalMoney = row[totalMoneyIndex]; 
        if (time >= startTime && time <= endTime) {
          total += totalMoney;
          return true; 
        }
        return false; 
      });
      
      setTotalAmount(total);
      setIsLoading(false); 
    };
    reader.readAsArrayBuffer(file);
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6 ">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8 min-w-[80%]">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Báo cáo giao dịch</h1>

        <div className="my-2 p-4 border border-gray-300 rounded-lg  ">
          <FileUpload handleFileUpload={handleFileUpload} />
          {file && (
            <div className="ml-4">
              <p className="text-gray-700 font-bold ">Tệp đã chọn: <span className="text-blue-500">{file.name}</span></p>
              
            </div>
          )}
          
        </div>

        <h1 className="text-2xl font-bold my-6 text-center text-blue-600">Truy vấn giao dịch</h1>
        <div className="text-center border border-gray-300 rounded-lg p-4">
          <div className="flex justify-between space-x-12 mx-4">
            {/* Thời gian bắt đầu */}
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">Thời gian bắt đầu: </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Thời gian kết thúc */}
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">Thời gian kết thúc: </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <button
          onClick={handleQuery}
          className={`bg-blue-500 text-white py-2 px-6 my-4 rounded-lg transition duration-300 hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Truy vấn'}
        </button>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {totalAmount !== null && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold text-blue-700">
              Tổng thành tiền: {totalAmount.toLocaleString()} VND
            </h2>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default TransactionReport;

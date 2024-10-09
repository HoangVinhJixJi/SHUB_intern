import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft } from 'lucide-react';

interface FormData {
  dateTime: string;
  quantity: number  | '';
  pump: string;
  revenue: number | '';
  price: number | '';
}

const TransactionForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const formik = useFormik<FormData>({
    initialValues: {
      dateTime: '',
      quantity: '',
      pump: '',
      revenue: '',
      price: '',
    },
    validationSchema: Yup.object({
      dateTime: Yup.string()
        .required('Vui lòng chọn thời gian.')
        .test('is-in-past', 'Thời gian phải nằm trong quá khứ.', (value) => {
          return value ? new Date(value) < new Date() : false;
        }),
      quantity: Yup.number()
        .typeError('Số lượng phải là một số.')
        .positive( 'Số lượng phải lớn hơn 0.')
        .required('Vui lòng nhập số lượng.'),
      pump: Yup.string().required('Vui lòng chọn trụ bơm.'),
      revenue: Yup.number()
        .typeError('Doanh thu phải là một số.')
        .positive( 'Doanh thu phải lớn hơn 0.')
        .required('Vui lòng nhập doanh thu.'),
      price: Yup.number()
        .typeError('Đơn giá phải là một số.')
        .positive('Đơn giá phải lớn hơn 0.')
        .required('Vui lòng nhập đơn giá.'),
    }),
    onSubmit: (values) => {
      console.log(values);
      setIsSubmitted(true); 
    },
  });

  const handleDropdownClick = () => {
    if (selectRef.current) {
      selectRef.current.focus();
      selectRef.current.click(); 
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={formik.handleSubmit} >
      <div className="shadow-lg mb-4">
        <div className="flex justify-between">
          <div className="font-bold py-2 p-4 flex items-center">
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span> Đóng</span>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 p-4 rounded-lg mr-4"
          >
            Cập nhật
          </button>
        </div>
        <h1 className="text-3xl font-bold pb-8 p-4">Nhập giao dịch</h1>
      </div>
      {/* Form input  */}
      <div className="form-input space-y-4">
        
        <div className="border border-gray-300 rounded-lg p-3 font-medium">
          <label className="block text-gray-500 text-xs">Thời gian</label>
          <input
            type="datetime-local"
            name="dateTime"
            className="w-full focus:outline-none"
            value={formik.values.dateTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.dateTime && formik.errors.dateTime ? (
            <p className="text-red-500 text-sm">{formik.errors.dateTime}</p>
          ) : null}
        </div>
        
        <div className="border border-gray-300 rounded-lg p-3 font-medium">
          <label className="block text-gray-500 text-xs">Số lượng</label>
          <input
            type="number"
            name="quantity"
            className="w-full focus:outline-none"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            step="0.01"
          />
          {formik.touched.quantity && formik.errors.quantity ? (
            <p className="text-red-500 text-sm">{formik.errors.quantity}</p>
          ) : null}
        </div>
        
        <div onClick={handleDropdownClick} className="border border-gray-300 rounded-lg p-3 font-medium">
          <label className="block text-gray-500 text-xs">Trụ</label>
          <select
            name="pump"
            className="w-full focus:outline-none"
            value={formik.values.pump}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            ref={selectRef}
          >
            <option hidden value=""></option>
            <option value="Trụ 1">Trụ bơm 01</option>
            <option value="Trụ 2">Trụ bơm 02</option>
            <option value="Trụ 3">Trụ bơm 03</option>
          </select>
          {formik.touched.pump && formik.errors.pump ? (
            <p className="text-red-500 text-sm">{formik.errors.pump}</p>
          ) : null}
        </div>
        
        <div className="border border-gray-300 rounded-lg p-3 font-medium">
          <label className="block text-gray-500 text-xs">Doanh thu</label>
          <input
            type="number"
            name="revenue"
            className="w-full focus:outline-none"
            value={formik.values.revenue}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            step="0.01"
          />
          {formik.touched.revenue && formik.errors.revenue ? (
            <p className="text-red-500 text-sm">{formik.errors.revenue}</p>
          ) : null}
        </div>
       
        <div className="border border-gray-300 rounded-lg p-3 font-medium">
          <label className="block text-gray-500 text-xs">Đơn giá</label>
          <input
            type="number"
            name="price"
            className="w-full focus:outline-none"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            step="0.01"
          />
          {formik.touched.price && formik.errors.price ? (
            <p className="text-red-500 text-sm">{formik.errors.price}</p>
          ) : null}
        </div>
        </div>
      </form>
      {/* Notification successful */}
      {isSubmitted && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg my-4">
          Form đã được nhập thành công!
        </div>
      )}
    </div>
  );
};

export default TransactionForm;

import Link from 'next/link';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

export default function PressCoverageNotFound() {
  return (
    <div className="container-custom py-16 text-center">
      <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Basın Haberi Bulunamadı</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Aradığınız basın haberi bulunamadı veya kaldırılmış olabilir.
      </p>
      <Link 
        href="/basinda-biz" 
        className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
      >
        <FaArrowLeft className="mr-2" />
        Tüm Basın Haberlerine Dön
      </Link>
    </div>
  );
} 
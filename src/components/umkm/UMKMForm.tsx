// src/components/umkm/UMKMForm.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Clock, 
  Image as ImageIcon,
  Plus,
  X,
  DollarSign
} from 'lucide-react';
import { UMKMFormData } from '@/types';
import { useUMKMFormSubmission } from '@/hooks/useUMKM';

interface UMKMFormProps {
  initialData?: Partial<UMKMFormData>;
  umkmId?: string;
  onSuccess?: () => void;
}

const categories = [
  'Makanan & Minuman',
  'Fashion & Pakaian', 
  'Kerajinan Tangan',
  'Pertanian',
  'Jasa',
  'Teknologi',
  'Kesehatan & Kecantikan',
  'Otomotif',
  'Perikanan',
  'Lainnya'
];

const daysOfWeek = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
];

export default function UMKMForm({ initialData, umkmId, onSuccess }: UMKMFormProps) {
  const router = useRouter();
  const { submitUMKM, isLoading, error } = useUMKMFormSubmission();

  const [formData, setFormData] = useState<UMKMFormData>({
    name: '',
    description: '',
    category: 'Makanan & Minuman',
    owner: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
    website: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
    },
    products: [],
    operatingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
    isActive: true,
    featured: false,
    ...initialData,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    unit: '',
    image: '',
    available: true
  });

  // Replace the handleInputChange function with this corrected version:

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;
  const checked = (e.target as HTMLInputElement).checked;

  let processedValue: any = value;
  
  if (type === 'checkbox') {
    processedValue = checked;
  } else if (type === 'number') {
    processedValue = value === '' ? undefined : Number(value);
  }

  // Handle nested objects
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    
    setFormData(prev => {
      // Ensure the parent property exists and is an object
      const parentValue = prev[parent as keyof UMKMFormData];
      
      if (typeof parentValue !== 'object' || parentValue === null) {
        console.error(`Cannot update nested property: ${parent} is not an object`);
        return prev;
      }
      
      return {
        ...prev,
        [parent]: {
          ...parentValue,
          [child]: processedValue
        }
      };
    });
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  }

  // Clear error
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const addProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      setFormData(prev => ({
        ...prev,
        products: [...(prev.products || []), { ...newProduct }]
      }));
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        unit: '',
        image: '',
        available: true
      });
    }
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products?.filter((_, i) => i !== index) || []
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Tidak dapat mengakses lokasi. Pastikan izin lokasi telah diberikan.');
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolokasi.');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama UMKM harus diisi';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi harus diisi';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'Nama pemilik harus diisi';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon harus diisi';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Alamat harus diisi';
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Validate website URL if provided
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website harus dimulai dengan http:// atau https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await submitUMKM(formData, files, umkmId);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/umkm');
        router.refresh();
      }
    } catch (err) {
      console.error('Error submitting UMKM:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Informasi Dasar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama UMKM *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nama usaha/toko"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pemilik *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.owner ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nama pemilik usaha"
              />
            </div>
            {errors.owner && (
              <p className="text-red-500 text-xs mt-1">{errors.owner}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Deskripsi usaha dan produk/jasa yang ditawarkan"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Kontak
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="email@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.website ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://www.website.com"
              />
            </div>
            {errors.website && (
              <p className="text-red-500 text-xs mt-1">{errors.website}</p>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">Media Sosial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                name="socialMedia.instagram"
                value={formData.socialMedia?.instagram || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="@username atau URL lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="text"
                name="socialMedia.facebook"
                value={formData.socialMedia?.facebook || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nama halaman atau URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TikTok
              </label>
              <input
                type="text"
                name="socialMedia.tiktok"
                value={formData.socialMedia?.tiktok || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube
              </label>
              <input
                type="text"
                name="socialMedia.youtube"
                value={formData.socialMedia?.youtube || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nama channel atau URL"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Lokasi
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.address ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Alamat lengkap usaha"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="-7.xxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="110.xxx"
              />
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Lokasi Saat Ini
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Koordinat opsional untuk memudahkan pencarian lokasi di peta
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Produk/Jasa
        </h2>

        {/* Product List */}
        {formData.products && formData.products.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-800 mb-3">Daftar Produk</h3>
            <div className="space-y-3">
              {formData.products.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-primary-600 font-bold">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(product.price)}
                          {product.unit && <span className="text-xs text-gray-500">/{product.unit}</span>}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Product */}
        <div className="border-t pt-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">Tambah Produk</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Nama produk"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga
              </label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Satuan
              </label>
              <input
                type="text"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="kg, pcs, porsi, dll"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={addProduct}
                disabled={!newProduct.name || newProduct.price <= 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Produk
            </label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Deskripsi singkat produk (opsional)"
            />
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Jam Operasional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {day.label}
              </label>
              <input
                type="text"
                name={`operatingHours.${day.key}`}
                value={formData.operatingHours?.[day.key as keyof typeof formData.operatingHours] || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="08:00-17:00 atau Tutup"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Format: HH:MM-HH:MM atau tulis "Tutup" jika libur
        </p>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Foto UMKM
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Foto
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maksimal 10 foto, format: JPG, PNG, WebP. Foto pertama akan menjadi foto utama.
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">File terpilih:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Array.from(files).map((file, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                  </div>
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      Utama
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pengaturan
        </h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              UMKM aktif (dapat dilihat publik)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Jadikan UMKM unggulan
            </label>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">
            {error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan UMKM'}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Menyimpan...' : umkmId ? 'Update UMKM' : 'Daftar UMKM'}
        </button>
      </div>
    </form>
  );
}
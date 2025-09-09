import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Clock, Tag, Image as ImageIcon } from 'lucide-react';
import { EventFormData, EventCategory } from '@/types';
import { useEventFormSubmission } from '@/hooks/useEventsMutation';

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  eventId?: string;
  onSuccess?: () => void;
}

const categories: { value: EventCategory; label: string }[] = [
  { value: 'RAPAT_DESA', label: 'Rapat Desa' },
  { value: 'KEGIATAN_BUDAYA', label: 'Kegiatan Budaya' },
  { value: 'POSYANDU', label: 'Posyandu' },
  { value: 'GOTONG_ROYONG', label: 'Gotong Royong' },
  { value: 'PELATIHAN', label: 'Pelatihan' },
  { value: 'SOSIALISASI', label: 'Sosialisasi' },
  { value: 'OLAHRAGA', label: 'Olahraga' },
  { value: 'KEAGAMAAN', label: 'Keagamaan' },
  { value: 'PENDIDIKAN', label: 'Pendidikan' },
  { value: 'KESEHATAN', label: 'Kesehatan' },
];

export default function EventForm({ initialData, eventId, onSuccess }: EventFormProps) {
  const router = useRouter();
  const { submitEvent, isLoading, error } = useEventFormSubmission();

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    content: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    address: '',
    category: 'KEGIATAN_BUDAYA',
    isPublic: true,
    isFeatured: false,
    maxParticipants: undefined,
    registrationRequired: false,
    registrationDeadline: '',
    contactPerson: '',
    contactPhone: '',
    tags: '',
    ...initialData,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;
  const checked = (e.target as HTMLInputElement).checked;

  // Handle different input types
  let processedValue: any = value;
  
  if (type === 'checkbox') {
    processedValue = checked;
  } else if (type === 'number') {
    // For number inputs, convert empty string to null, otherwise to number
    processedValue = value === '' ? null : Number(value);
  }

  setFormData(prev => ({
    ...prev,
    [name]: processedValue
  }));

  // Clear error when user starts typing
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Judul acara harus diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi acara harus diisi';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Tanggal mulai harus diisi';
    }

    if (formData.endDate && formData.startDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai';
      }
    }

    if (formData.registrationRequired && formData.registrationDeadline) {
      const deadline = new Date(formData.registrationDeadline);
      const start = new Date(formData.startDate);
      if (deadline >= start) {
        newErrors.registrationDeadline = 'Batas pendaftaran harus sebelum tanggal acara';
      }
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
      await submitEvent(formData, files, eventId);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(eventId ? `/admin/events` : `/admin/events`);
        router.refresh();
      }
    } catch (err) {
      console.error('Error submitting event:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Informasi Dasar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Acara *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Masukkan judul acara"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Singkat *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Deskripsi singkat tentang acara"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
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
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tag1, Tag2, Tag3"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pisahkan dengan koma (,)
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konten Detail
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Konten detail acara (opsional)"
          />
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Jadwal Acara
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.startDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Selesai
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.endDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jam Mulai
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jam Selesai
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Lokasi Acara
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Tempat
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Balai Desa, Lapangan, dll"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Detail
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Alamat lengkap"
            />
          </div>
        </div>
      </div>

      {/* Registration & Participants */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Pendaftaran & Peserta
        </h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="registrationRequired"
              checked={formData.registrationRequired}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Memerlukan pendaftaran
            </label>
          </div>

          {formData.registrationRequired && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batas Pendaftaran
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.registrationDeadline ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.registrationDeadline && (
                  <p className="text-red-500 text-xs mt-1">{errors.registrationDeadline}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maksimal Peserta
                </label>
                <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants === null ? '' : formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tidak terbatas (kosongkan)"
                />
                </div>
            </div>
          )}
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
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Nama penanggung jawab"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2" />
          Gambar Acara
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Gambar
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maksimal 5 gambar, format: JPG, PNG, WebP
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">File terpilih:</h4>
            <div className="space-y-1">
              {Array.from(files).map((file, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  <span>{file.name}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
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
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Tampilkan untuk publik
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Jadikan acara unggulan
            </label>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">
            {error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan acara'}
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
          {isLoading ? 'Menyimpan...' : eventId ? 'Update Acara' : 'Buat Acara'}
        </button>
      </div>
    </form>
  );
}
// components/ConfirmDialog.jsx
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm border border-gray-200 mx-auto">
      <h2 className="font-bold text-lg mb-2 text-gray-900">{title}</h2>
      <p className="mb-6 text-gray-600">{message}</p>
      <div className="flex justify-end gap-3">
        <button 
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium" 
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium" 
          onClick={onConfirm}
        >
          Yes, Cancel
        </button>
      </div>
    </div>
  );
}
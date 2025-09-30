// src/components/ConfirmDialog.jsx
function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
        <h2 className="text-lg font-bold mb-2">{title || "Are you sure?"}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
            onClick={onConfirm}
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

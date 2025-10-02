import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllReviews, deleteReview } from '../../services/adminServices/adminService';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(12);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getAllReviews(token);
      setReviews(response.reviews || []);
      toast.success('Reviews loaded successfully');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId, token);
      
      // Update local state
      setReviews(prev => prev.filter(review => review._id !== reviewId));
      
      toast.success('Review deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  const openDeleteModal = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const openDetailsModal = (review) => {
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  const closeModals = () => {
    setSelectedReview(null);
    setShowDeleteModal(false);
    setShowDetailsModal(false);
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const getStarRating = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingStats = () => {
    const stats = {
      total: reviews.length,
      five: reviews.filter(r => r.rating === 5).length,
      four: reviews.filter(r => r.rating === 4).length,
      three: reviews.filter(r => r.rating === 3).length,
      two: reviews.filter(r => r.rating === 2).length,
      one: reviews.filter(r => r.rating === 1).length,
      avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
    };
    return stats;
  };

  const stats = getRatingStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Review Management</h1>
        <p className="text-blue-100">Monitor and manage customer reviews</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs font-medium">Total Reviews</p>
              <p className="text-xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
              💬
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-xs font-medium">Avg Rating</p>
              <p className="text-xl font-bold text-blue-900">{stats.avgRating}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-sm">
              ⭐
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-xs font-medium">5 Stars</p>
              <p className="text-xl font-bold text-blue-900">{stats.five}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">
              ★
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs font-medium">4 Stars</p>
              <p className="text-xl font-bold text-blue-900">{stats.four}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
              ★
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-xs font-medium">3 Stars</p>
              <p className="text-xl font-bold text-blue-900">{stats.three}</p>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">
              ★
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-xs font-medium">1-2 Stars</p>
              <p className="text-xl font-bold text-blue-900">{stats.one + stats.two}</p>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm">
              ★
            </div>
          </div>
        </div>
      </div>

      {/* Simple Controls */}
      <div className="bg-white rounded-lg shadow-md border border-blue-100 p-6">
        <div className="flex items-center justify-between">
          <div className="text-blue-600 text-sm">
            Showing {indexOfFirstReview + 1} to {Math.min(indexOfLastReview, reviews.length)} of {reviews.length} reviews
          </div>
          <button
            onClick={fetchReviews}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
        {currentReviews.length === 0 ? (
          <div className="p-12 text-center text-blue-400">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No Reviews Found</h3>
            <p>No reviews available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {currentReviews.map((review) => (
              <div 
                key={review._id} 
                className="bg-blue-50 rounded-lg border border-blue-200 p-6 hover:shadow-lg transition-all duration-200"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        {review.user?.username || 'Anonymous User'}
                      </h3>
                      <div className="text-yellow-500 text-lg">
                        {getStarRating(review.rating || 0)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-blue-600">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>

                {/* Product Info */}
                {review.product && (
                  <div className="mb-3 p-3 bg-white rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-600 mb-1">Product:</div>
                    <div className="font-medium text-blue-900 text-sm">
                      {review.product.title || 'Unknown Product'}
                    </div>
                  </div>
                )}

                {/* Review Comment */}
                <div className="mb-4">
                  <div className="text-sm text-blue-600 mb-1">Review:</div>
                  <p className="text-blue-900 text-sm leading-relaxed">
                    {review.comment || 'No comment provided'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openDetailsModal(review)}
                    className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                  >
                    👁️ View Details
                  </button>
                  <button
                    onClick={() => openDeleteModal(review)}
                    disabled={deletingId === review._id}
                    className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === review._id ? '⏳' : '🗑️'} Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-blue-50 px-6 py-4 flex items-center justify-between border-t border-blue-200">
            <div className="text-sm text-blue-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNumber = Math.max(1, currentPage - 2) + index;
                if (pageNumber > totalPages) return null;
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-4 py-2 rounded ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" onClick={closeModals}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full z-10">
            <div className="bg-red-500 text-white p-6 rounded-t-xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                🗑️ Delete Review
              </h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{selectedReview.user?.username}</span>
                  <span className="text-yellow-500">{getStarRating(selectedReview.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm">{selectedReview.comment}</p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={closeModals}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReview(selectedReview._id)}
                  disabled={deletingId === selectedReview._id}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === selectedReview._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Details Modal */}
      {showDetailsModal && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" onClick={closeModals}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden z-10 flex flex-col">
            <div className="bg-blue-900 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Review Details</h2>
                <button
                  onClick={closeModals}
                  className="text-white hover:text-blue-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Reviewer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-blue-700">Username</label>
                      <p className="text-blue-900">{selectedReview.user?.username || 'Anonymous'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-blue-700">Email</label>
                      <p className="text-blue-900">{selectedReview.user?.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                {selectedReview.product && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-3">Product Information</h3>
                    <div>
                      <label className="text-sm font-semibold text-green-700">Product Name</label>
                      <p className="text-green-900">{selectedReview.product.title || 'Unknown Product'}</p>
                    </div>
                  </div>
                )}

                {/* Review Info */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-3">Review Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-yellow-700">Rating</label>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500 text-xl">{getStarRating(selectedReview.rating)}</span>
                        <span className="text-yellow-900 font-semibold">({selectedReview.rating}/5)</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-yellow-700">Comment</label>
                      <p className="text-yellow-900 leading-relaxed">{selectedReview.comment || 'No comment provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-yellow-700">Review Date</label>
                      <p className="text-yellow-900">
                        {selectedReview.createdAt ? new Date(selectedReview.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t flex gap-4 flex-shrink-0">
              <button
                onClick={() => {
                  closeModals();
                  openDeleteModal(selectedReview);
                }}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
              >
                🗑️ Delete Review
              </button>
              <button
                onClick={closeModals}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
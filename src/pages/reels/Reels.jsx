import React, { useState, useEffect } from 'react';
import { PlayCircle, Upload, Plus, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { db, storage } from '../../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const Reels = () => {
  const { user, sellerData } = useAuth();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    caption: '',
    tags: '',
    videoUrl: null,
    videoFile: null,
  });

  // Fetch reels
  useEffect(() => {
    const fetchReels = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'reels'),
          where('sellerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const reelsData = [];

        querySnapshot.forEach((doc) => {
          reelsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setReels(reelsData.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error('Error fetching reels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [user]);

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const storageRef = ref(
        storage,
        `reels/${user.uid}/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setFormData((prev) => ({
        ...prev,
        videoUrl: url,
        videoFile: file,
      }));
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.caption || !formData.videoUrl) {
      alert('Please fill in caption and upload a video');
      return;
    }

    try {
      setLoading(true);

      const reelData = {
        caption: formData.caption,
        tags: formData.tags ? formData.tags.split(',').map((tag) => tag.trim()) : [],
        videoUrl: formData.videoUrl,
        sellerId: user.uid,
        shopName: sellerData?.shopName || 'Unknown Shop',
        latitude: sellerData?.latitude || null,
        longitude: sellerData?.longitude || null,
        deliveryRadius: sellerData?.deliveryRadius || null,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'reels'), reelData);
      setReels((prev) => [{ id: docRef.id, ...reelData }, ...prev]);

      // Reset form
      setFormData({
        caption: '',
        tags: '',
        videoUrl: null,
        videoFile: null,
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving reel:', error);
      alert('Failed to upload reel');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reel?')) return;

    try {
      await deleteDoc(doc(db, 'reels', id));
      setReels((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting reel:', error);
      alert('Failed to delete reel');
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reels</h1>
          <p className="text-gray-600">Create engaging video content to boost sales</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Upload Reel
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Reel</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Caption */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Caption *
              </label>
              <textarea
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
                placeholder="Write an engaging caption for your reel..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., fashion, trending, summer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Video *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="hidden"
                  id="video-input"
                />
                <label htmlFor="video-input" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="text-gray-400" size={32} />
                  <span className="text-sm font-semibold text-gray-700">
                    {uploading ? 'Uploading...' : 'Click to upload video'}
                  </span>
                  <span className="text-xs text-gray-500">MP4, WebM, Ogg up to 500MB</span>
                </label>
              </div>

              {formData.videoUrl && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Video Preview
                  </p>
                  <video
                    src={formData.videoUrl}
                    controls
                    className="w-full max-h-64 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                Upload Reel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    caption: '',
                    tags: '',
                    videoUrl: null,
                    videoFile: null,
                  });
                }}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            Loading reels...
          </div>
        ) : reels.length === 0 ? (
          <div className="col-span-full p-8 text-center">
            <PlayCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-4">No reels yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Upload Your First Reel
            </button>
          </div>
        ) : (
          reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <video
                src={reel.videoUrl}
                className="w-full h-64 object-cover bg-gray-900"
                controls
              />
              <div className="p-4">
                <p className="text-gray-700 mb-3 line-clamp-2">{reel.caption}</p>
                <div className="flex gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                  <span>❤️ {reel.likes || 0} Likes</span>
                  <span>💬 {reel.comments || 0} Comments</span>
                  <span>📤 {reel.shares || 0} Shares</span>
                </div>
                <button
                  onClick={() => handleDelete(reel.id)}
                  className="w-full py-2 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

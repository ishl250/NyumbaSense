import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Brain, BarChart3, CheckCircle, XCircle, Database, TrendingUp, Download } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { datasetAPI } from '../../services/api';
import { PageLoader, Spinner } from '../../components/Loading';
import toast from 'react-hot-toast';

export default function TrainerDashboard() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const { data: datasetsData, isLoading: datasetsLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => datasetAPI.getDatasets(),
  });

  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['modelMetrics'],
    queryFn: () => datasetAPI.getMetrics(),
  });

  const { data: historyData } = useQuery({
    queryKey: ['trainingHistory'],
    queryFn: () => datasetAPI.getHistory(),
  });

  const trainMutation = useMutation({
    mutationFn: () => datasetAPI.train({}),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['modelMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['trainingHistory'] });
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast.success('Model trained successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Training failed'),
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      toast.error('Only CSV files are allowed');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await datasetAPI.upload(formData);
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast.success('Dataset uploaded and validated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const datasets = datasetsData?.data?.datasets || [];
  const metrics = metricsData?.data?.metrics;
  const trainingHistory = historyData?.data?.logs || [];

  if (datasetsLoading || metricsLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Trainer Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage datasets and train AI models</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 lg:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Upload className="w-5 h-5 text-primary-500" /> Upload Dataset</h3>
          <p className="text-sm text-gray-500 mb-4">Upload a CSV file with property data to train the AI model. Required columns: location, bedrooms, bathrooms, square_feet, district, property_type, market_price.</p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all cursor-pointer"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary-500" />
            </div>
            <p className="font-medium text-gray-900 mb-1">{uploading ? 'Uploading...' : 'Click to upload CSV'}</p>
            <p className="text-sm text-gray-500">or drag and drop your file here</p>
          </div>
        </div>

        <div className="card p-6 lg:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-primary-500" /> Train Model</h3>
          <p className="text-sm text-gray-500 mb-4">Train the AI model using the latest validated dataset. Training typically takes a few seconds.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Available Datasets</span>
              <span className="text-lg font-bold text-gray-900">{datasets.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Trained</span>
              <span className="text-sm font-medium text-gray-900">
                {metrics ? new Date(metrics.created_at).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
          <button
            onClick={() => trainMutation.mutate()}
            disabled={trainMutation.isPending || datasets.length === 0}
            className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {trainMutation.isPending ? <><Spinner size="sm" /> Training...</> : <><Brain className="w-5 h-5" /> Start Training</>}
          </button>
        </div>
      </div>

      {metrics && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card p-6 lg:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary-500" /> Model Performance Metrics</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                { label: 'R² Score', value: metrics.r2_score ? `${(metrics.r2_score * 100).toFixed(1)}%` : 'N/A', color: 'text-green-600 bg-green-50' },
                { label: 'RMSE', value: metrics.rmse ? `${(metrics.rmse / 1000000).toFixed(1)}M` : 'N/A', color: 'text-blue-600 bg-blue-50' },
                { label: 'MAE', value: metrics.mae ? `${(metrics.mae / 1000000).toFixed(1)}M` : 'N/A', color: 'text-primary-600 bg-primary-50' },
                { label: 'Accuracy', value: metrics.accuracy_score ? `${metrics.accuracy_score.toFixed(1)}%` : 'N/A', color: 'text-purple-600 bg-purple-50' },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
                  <p className="text-sm opacity-75 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-primary-500" /> Datasets</h3>
          {datasets.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No datasets uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {datasets.map((ds) => (
                <div key={ds.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{ds.original_filename}</p>
                    <p className="text-xs text-gray-500">{ds.row_count} rows | {ds.columns?.length || 0} columns</p>
                  </div>
                  <span className={`badge ${ds.status === 'trained' ? 'badge-green' : ds.status === 'validated' ? 'badge-blue' : ds.status === 'training' ? 'badge-yellow' : 'badge-gray'}`}>
                    {ds.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary-500" /> Training History</h3>
          {trainingHistory.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No training history yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {trainingHistory.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Training #{log.id}</p>
                    <p className="text-xs text-gray-500">{log.created_at ? new Date(log.created_at).toLocaleDateString() : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    {log.r2_score && <span className="text-sm font-semibold text-gray-900">{(log.r2_score * 100).toFixed(1)}%</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

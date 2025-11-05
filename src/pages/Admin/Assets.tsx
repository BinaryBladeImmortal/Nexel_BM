import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import GlitchText from '@/components/GlitchText';
import {
  Package,
  Search,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Star,
  Image as ImageIcon,
  Code,
  Music,
  FileText,
  Box,
  Tag,
  Upload,
  X,
  File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

export default function AdminAssets() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // File upload state
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Edit dialog file state
  const [editAssetFile, setEditAssetFile] = useState<File | null>(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);

  const [newAsset, setNewAsset] = useState({
    title: '',
    description: '',
    category: 'model',
    price: 0,
    isFeatured: false,
    isPremium: false,
    imageUrl: '',
  });
  const queryClient = useQueryClient();

  // Fetch all assets
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-assets'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${base}/assets`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch assets');
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error('Error fetching assets:', error);
        toast({
          title: "Error",
          description: "Failed to fetch assets. Please login first.",
          variant: "destructive",
        });
        return { assets: [] };
      }
    }
  });

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: string) => {
      const token = localStorage.getItem('token');
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${base}/assets/${assetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete asset');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-assets'] });
      toast({
        title: "Asset deleted",
        description: "The asset has been successfully removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete asset",
        variant: "destructive",
      });
    }
  });

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to access the assets.",
        action: (
          <Button 
            onClick={() => navigate('/auth')}
            variant="default"
          >
            Login
          </Button>
        )
      });
    }
  }, []);

  // Update asset mutation
  const updateAssetMutation = useMutation({
    mutationFn: async ({ asset, files }: { asset: any, files?: { assetFile?: File, thumbnailFile?: File } }) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Add form fields
      formData.append('name', asset.title);
      formData.append('description', asset.description);
      formData.append('category', asset.category);
      formData.append('price', asset.price.toString());
      formData.append('isFeatured', asset.isFeatured.toString());
      formData.append('isPremium', asset.isPremium.toString());
      formData.append('requiredSubscription', 'Starter'); // Default subscription level

      // Add files if they exist
      if (files?.assetFile) {
        formData.append('file', files.assetFile);
      }
      if (files?.thumbnailFile) {
        formData.append('thumbnail', files.thumbnailFile);
      }

      const res = await fetch(`http://localhost:5000/api/v1/assets/${asset.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update asset');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-assets'] });
      setIsEditDialogOpen(false);
      setEditAssetFile(null);
      setEditThumbnailFile(null);
      toast({
        title: "Asset updated",
        description: "The asset has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update asset",
        variant: "destructive",
      });
    }
  });

  // Add asset mutation
  const addAssetMutation = useMutation({
    mutationFn: async (assetData: any) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Add form fields
      formData.append('name', assetData.title);
      formData.append('description', assetData.description);
      formData.append('category', assetData.category);
      formData.append('price', assetData.price.toString());
      formData.append('isFeatured', assetData.isFeatured.toString());
      formData.append('isPremium', assetData.isPremium.toString());
      formData.append('requiredSubscription', 'Starter'); // Default subscription level

      // Add files if they exist
      if (assetFile) {
        formData.append('file', assetFile);
      }
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const res = await fetch('http://localhost:5000/api/v1/assets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser sets it automatically with boundary
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to add asset');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-assets'] });
      setIsAddDialogOpen(false);
      // Reset form
      setNewAsset({
        title: '',
        description: '',
        category: 'model',
        price: 0,
        isFeatured: false,
        isPremium: false,
        imageUrl: '',
      });
      setAssetFile(null);
      setThumbnailFile(null);
      toast({
        title: "Asset added",
        description: "The new asset has been successfully added",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add asset",
        variant: "destructive",
      });
    }
  });

  const handleDeleteAsset = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteAssetMutation.mutate(id);
    }
  };

  const handleEditAsset = (asset: any) => {
    setSelectedAsset(asset);
    setEditAssetFile(null);
    setEditThumbnailFile(null);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    updateAssetMutation.mutate({
      asset: selectedAsset,
      files: {
        assetFile: editAssetFile || undefined,
        thumbnailFile: editThumbnailFile || undefined
      }
    });
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that required fields are filled
    if (!newAsset.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!newAsset.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }

    if (!assetFile) {
      toast({
        title: "Validation Error",
        description: "Asset file is required",
        variant: "destructive",
      });
      return;
    }

    if (!thumbnailFile) {
      toast({
        title: "Validation Error",
        description: "Thumbnail image is required",
        variant: "destructive",
      });
      return;
    }

    addAssetMutation.mutate(newAsset);
  };

  const handleToggleFeatured = (asset: any) => {
    updateAssetMutation.mutate({
      ...asset,
      isFeatured: !asset.isFeatured
    });
  };

  const assets = data?.assets || [];
  const filteredAssets = assets.filter((asset: any) =>
    asset.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get asset icon based on category
  const getAssetIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'model':
        return <Box className="h-5 w-5" />;
      case 'texture':
        return <ImageIcon className="h-5 w-5" />;
      case 'script':
        return <Code className="h-5 w-5" />;
      case 'audio':
        return <Music className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // File validation helper functions
  const validateAssetFile = (file: File, category: string): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB for larger files like models
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return false;
    }

    const categoryLower = category.toLowerCase();
    const allowedTypes: { [key: string]: string[] } = {
      // 3D Models - including various formats and animation files
      model: ['.obj', '.fbx', '.glb', '.gltf', '.blend', '.max', '.ma', '.dae', '.abc'],
      // Textures - image formats for materials and surfaces
      texture: ['.png', '.jpg', '.jpeg', '.webp', '.tga', '.tiff', '.bmp', '.hdr', '.exr'],
      // Scripts - programming and scripting files
      script: ['.js', '.ts', '.py', '.lua', '.cs', '.cpp', '.hpp', '.h', '.java', '.rb'],
      // Audio - sound files and music
      audio: ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma'],
      // Video - video files and VFX
      video: ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv'],
      // VFX - visual effects and shaders
      vfx: ['.glsl', '.hlsl', '.cg', '.fx', '.vfx', '.particle'],
      // Animations - animation-specific files
      animation: ['.fbx', '.gltf', '.glb', '.bvh', '.anim', '.ani'],
      // Fonts - text fonts
      font: ['.ttf', '.otf', '.woff', '.woff2', '.eot'],
      // Other - allow all files for miscellaneous assets
      other: []
    };

    // Special handling for animation files which should be treated as models
    if (categoryLower === 'model' || categoryLower === 'animation') {
      const modelExtensions = [...allowedTypes.model, ...allowedTypes.animation];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!modelExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `Allowed file types for 3D Models/Animations: ${modelExtensions.join(', ')}`,
          variant: "destructive",
        });
        return false;
      }
    } else if (categoryLower !== 'other') {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const validExtensions = allowedTypes[categoryLower] || [];

      if (validExtensions.length > 0 && !validExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: `Allowed file types for ${category}: ${validExtensions.join(', ')}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const validateThumbnailFile = (file: File): boolean => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast({
        title: "Thumbnail too large",
        description: "Maximum thumbnail size is 2MB",
        variant: "destructive",
      });
      return false;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid thumbnail format",
        description: "Allowed formats: JPEG, PNG, WebP",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // File upload component
  const FileUploadComponent = ({
    file,
    setFile,
    label,
    accept,
    maxSize,
    onFileSelect
  }: {
    file: File | null;
    setFile: (file: File | null) => void;
    label: string;
    accept: string;
    maxSize: string;
    onFileSelect?: (file: File) => boolean;
  }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        const selectedFile = droppedFiles[0];
        if (onFileSelect ? onFileSelect(selectedFile) : true) {
          setFile(selectedFile);
        }
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile && (onFileSelect ? onFileSelect(selectedFile) : true)) {
        setFile(selectedFile);
      }
    };

    const removeFile = () => {
      setFile(null);
    };

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {file ? (
          <div className="relative border rounded-lg p-4 bg-primary/5">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {isUploading && (
              <div className="mt-3">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragging
                ? 'border-primary bg-primary/10'
                : 'border-primary/30 hover:border-primary hover:bg-primary/5'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`file-input-${label}`)?.click()}
          >
            <input
              id={`file-input-${label}`}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Drag and drop your {label.toLowerCase()} here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Max size: {maxSize}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-orbitron font-bold title-orbitron mb-2">
            <GlitchText text="Asset Management" />
          </h1>
          <p className="text-muted-foreground">Manage platform assets, uploads, and approvals</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-primary hover:bg-gradient-primary-hover text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Asset
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search assets by name, description or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={searchQuery === '' ? "default" : "outline"} 
            onClick={() => setSearchQuery('')}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={searchQuery === 'model' ? "default" : "outline"} 
            onClick={() => setSearchQuery('model')}
            size="sm"
          >
            3D Models
          </Button>
          <Button 
            variant={searchQuery === 'texture' ? "default" : "outline"} 
            onClick={() => setSearchQuery('texture')}
            size="sm"
          >
            Textures
          </Button>
          <Button 
            variant={searchQuery === 'script' ? "default" : "outline"} 
            onClick={() => setSearchQuery('script')}
            size="sm"
          >
            Scripts
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="gradient-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
          <p className="text-3xl font-bold text-primary">{assets.length}</p>
        </div>
        <div className="gradient-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Featured Assets</p>
          <p className="text-3xl font-bold text-primary">
            {assets.filter((a: any) => a.isFeatured).length}
          </p>
        </div>
        <div className="gradient-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Premium Assets</p>
          <p className="text-3xl font-bold text-primary">
            {assets.filter((a: any) => a.isPremium).length}
          </p>
        </div>
        <div className="gradient-border p-4">
          <p className="text-sm text-muted-foreground mb-1">Filtered Results</p>
          <p className="text-3xl font-bold text-primary">{filteredAssets.length}</p>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="gradient-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center p-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No assets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10 border-b border-primary/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Asset</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-primary">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {filteredAssets.map((asset: any) => (
                  <tr key={asset.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          {getAssetIcon(asset.category)}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {asset.title}
                            {asset.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {asset.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {asset.category || 'Other'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {asset.isPremium ? (
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                          Premium
                        </Badge>
                      ) : asset.price > 0 ? (
                        <span className="text-sm">₹{asset.price.toLocaleString('en-IN')}</span>
                      ) : (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                          Free
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={asset.isFeatured}
                          onCheckedChange={() => handleToggleFeatured(asset)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {asset.isFeatured ? 'Featured' : 'Standard'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditAsset(asset)}
                          className="text-primary hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAsset(asset.id, asset.title)}
                          disabled={deleteAssetMutation.isPending}
                          className="text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron">Edit Asset</DialogTitle>
            <DialogDescription>
              Update asset details and visibility
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <form onSubmit={handleUpdateAsset} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={selectedAsset.title || ''} 
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={selectedAsset.description || ''} 
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    className="w-full px-3 py-2 bg-background border border-input rounded-md"
                    value={selectedAsset.category || 'model'}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, category: e.target.value })}
                  >
                    <option value="model">3D Model</option>
                    <option value="animation">Animation</option>
                    <option value="texture">Texture</option>
                    <option value="script">Script</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                    <option value="vfx">Visual Effects</option>
                    <option value="font">Font</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={selectedAsset.price || 0}
                    onChange={(e) => setSelectedAsset({ ...selectedAsset, price: Number(e.target.value) })}
                    min={0}
                  />
                </div>
              </div>

              {/* File Upload Sections for Edit */}
              <div className="space-y-4">
                <FileUploadComponent
                  file={editAssetFile}
                  setFile={setEditAssetFile}
                  label="Asset File (Optional)"
                  accept="*/*"
                  maxSize="5MB"
                  onFileSelect={(file) => validateAssetFile(file, selectedAsset.category || 'model')}
                />

                <FileUploadComponent
                  file={editThumbnailFile}
                  setFile={setEditThumbnailFile}
                  label="Thumbnail Image (Optional)"
                  accept="image/*"
                  maxSize="2MB"
                  onFileSelect={validateThumbnailFile}
                />
              </div>
              <div className="flex items-center justify-between pt-4 space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={selectedAsset.isFeatured || false}
                    onCheckedChange={(checked) => setSelectedAsset({ ...selectedAsset, isFeatured: checked })}
                  />
                  <Label htmlFor="featured">Featured Asset</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="premium"
                    checked={selectedAsset.isPremium || false}
                    onCheckedChange={(checked) => setSelectedAsset({ ...selectedAsset, isPremium: checked })}
                  />
                  <Label htmlFor="premium">Premium (Paid Plans Only)</Label>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={updateAssetMutation.isPending}
                  className="bg-gradient-primary hover:bg-gradient-primary-hover text-white"
                >
                  {updateAssetMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Asset Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron">Add New Asset</DialogTitle>
            <DialogDescription>
              Create a new asset for the platform
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAsset} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={newAsset.title} 
                onChange={(e) => setNewAsset({ ...newAsset, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={newAsset.description} 
                onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  className="w-full px-3 py-2 bg-background border border-input rounded-md"
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                >
                  <option value="model">3D Model</option>
                  <option value="animation">Animation</option>
                  <option value="texture">Texture</option>
                  <option value="script">Script</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                  <option value="vfx">Visual Effects</option>
                  <option value="font">Font</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={newAsset.price}
                  onChange={(e) => setNewAsset({ ...newAsset, price: Number(e.target.value) })}
                  min={0}
                />
              </div>
            </div>

            {/* File Upload Sections */}
            <div className="space-y-4">
              <FileUploadComponent
                file={assetFile}
                setFile={setAssetFile}
                label="Asset File"
                accept="*/*"
                maxSize="5MB"
                onFileSelect={(file) => validateAssetFile(file, newAsset.category)}
              />

              <FileUploadComponent
                file={thumbnailFile}
                setFile={setThumbnailFile}
                label="Thumbnail Image"
                accept="image/*"
                maxSize="2MB"
                onFileSelect={validateThumbnailFile}
              />
            </div>
            <div className="flex items-center justify-between pt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="new-featured"
                  checked={newAsset.isFeatured}
                  onCheckedChange={(checked) => setNewAsset({ ...newAsset, isFeatured: checked })}
                />
                <Label htmlFor="new-featured">Featured Asset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="new-premium"
                  checked={newAsset.isPremium}
                  onCheckedChange={(checked) => setNewAsset({ ...newAsset, isPremium: checked })}
                />
                <Label htmlFor="new-premium">Premium (Paid Plans Only)</Label>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={addAssetMutation.isPending}
                className="bg-gradient-primary hover:bg-gradient-primary-hover text-white"
              >
                {addAssetMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Asset
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

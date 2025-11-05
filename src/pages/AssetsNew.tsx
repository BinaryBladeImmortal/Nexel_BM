import { useState, useCallback, useEffect } from "react";
import { Search, Star, Download, ShoppingCart, Filter, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { AssetDetailModal } from "@/components/AssetDetailModal";
import GlitchText from "@/components/GlitchText";
import { useInfiniteQuery } from "@tanstack/react-query";
import ApiService from "@/services/api";

interface Asset {
  id: number;
  title: string;
  price: number;
  downloads: number;
  rating: number;
  image: string;
  type: string;
  category: string;
  description: string;
  details: {
    fileSize: string;
    fileType: string;
    lastUpdated: string;
    version: string;
    requirements: string[];
    features: string[];
  };
}

interface AssetFilters {
  search: string;
  type: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

const ITEMS_PER_PAGE = 6;
const INITIAL_FILTERS: AssetFilters = {
  search: "",
  type: "All",
  category: "All",
  minPrice: 0,
  maxPrice: 100,
};

const Assets = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<AssetFilters>(INITIAL_FILTERS);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [likedAssets, setLikedAssets] = useState<number[]>([]);

  const assetTypes = ["All", "3D Models", "Sprites", "Audio", "Textures", "Animations"];
  const categories = [
    "All",
    "Characters",
    "Environments",
    "UI/UX",
    "VFX",
    "Sound",
    "Scripts"
  ];

  // React Query for infinite loading
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["assets", filters],
    async ({ pageParam = 1 }) => {
      const params = {
        page: pageParam.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.type !== "All" && { type: filters.type.replace(" Models", "").replace("s", "") }),
        ...(filters.category !== "All" && { category: filters.category }),
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
      };

      const response = await ApiService.getAssets(params);
      return response;
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.hasMore ? lastPage.nextPage : undefined;
      },
      keepPreviousData: true,
    }
  );

  // Get all assets from all pages
  const assets: Asset[] = data?.pages.flatMap((page) => page.assets) ?? [];

  // Update filters with debounce
  const debouncedUpdateFilters = useCallback((newFilters: Partial<AssetFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Handle liking assets
  const toggleLike = (assetId: number) => {
    setLikedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
    
    toast({
      title: likedAssets.includes(assetId) ? "Removed from wishlist" : "Added to wishlist",
      description: likedAssets.includes(assetId) 
        ? "The asset has been removed from your wishlist"
        : "The asset has been added to your wishlist",
    });
  };

  // Handle adding to cart
  const addToCart = (asset: Asset) => {
    toast({
      title: "Added to cart",
      description: `${asset.title} has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="pt-24 pb-16 cyber-grid">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold title-orbitron mb-6">
              <GlitchText text="Asset Marketplace" />
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Premium cyberpunk assets for your next project
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assets..."
                value={filters.search}
                onChange={(e) => debouncedUpdateFilters({ search: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-card border border-primary/30 rounded-xl text-lg focus:outline-none focus:border-primary focus:glow-primary transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Assets Section */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-[250px,1fr] gap-8">
            {/* Sidebar Filters */}
            <div className="space-y-8">
              {/* Type Filter */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-orbitron">Asset Type</h3>
                <div className="space-y-2">
                  {assetTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => debouncedUpdateFilters({ type })}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                        filters.type === type
                          ? "bg-gradient-primary text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-orbitron">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => debouncedUpdateFilters({ category })}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                        filters.category === category
                          ? "bg-gradient-primary text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-orbitron">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(values) => 
                      debouncedUpdateFilters({ 
                        minPrice: values[0], 
                        maxPrice: values[1] 
                      })
                    }
                    className="my-6"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${filters.minPrice}</span>
                    <span>${filters.maxPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assets Grid */}
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="text-center py-20">
                  <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-bold font-orbitron mb-2">Error loading assets</h3>
                  <p className="text-muted-foreground">Please try again later</p>
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center py-20">
                  <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-bold font-orbitron mb-2">No assets found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map((asset, index) => (
                      <div 
                        key={asset.id}
                        className="gradient-border hover:glow-primary hover-scale transition-all duration-300 animate-fade-in-up bg-card rounded-lg overflow-hidden h-full flex flex-col"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative group">
                          <img 
                            src={asset.image} 
                            alt={asset.title}
                            className="w-full h-48 object-cover cursor-pointer"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setIsDetailModalOpen(true);
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button 
                              variant="secondary" 
                              className="hover:glow-primary"
                              onClick={() => {
                                setSelectedAsset(asset);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                              likedAssets.includes(asset.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                            }`}
                            onClick={() => toggleLike(asset.id)}
                          >
                            <Heart className={`h-5 w-5 ${likedAssets.includes(asset.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-bold font-orbitron flex-1 pr-2">
                              {asset.title}
                            </h3>
                            <Badge variant="secondary" className="bg-primary/20 text-primary">
                              {asset.type}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
                            {asset.description}
                          </p>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-accent">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-medium">{asset.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Download className="h-4 w-4" />
                                  <span className="text-xs">{asset.downloads.toLocaleString()}</span>
                                </div>
                              </div>
                              
                              <div className="text-xl font-bold font-orbitron title-orbitron">
                                ${asset.price}
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full bg-gradient-primary hover:glow-primary"
                              onClick={() => addToCart(asset)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasNextPage && (
                    <div className="text-center mt-16">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white hover:glow-primary"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading more...
                          </>
                        ) : (
                          'Load More Assets'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Asset Detail Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default Assets;
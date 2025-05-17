// import React, { useState, useRef, useMemo, useEffect } from "react";
// import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

// interface CuisineType {
//   name: string;
//   icon: string;
// }

// interface Restaurant {
//   id: string;
//   name: string;
//   rating: number;
//   photo: string;
//   distance: string;
//   lat: number;
//   lng: number;
//   cuisine: CuisineType;
//   priceLevel: string;
//   reviews: string;
//   description: string;
// }

// interface FilterOption {
//   label: string;
//   value: string;
//   icon?: string;
// }

// interface FilterPanelProps {
//   filters: {
//     cuisine: FilterOption[];
//     rating: FilterOption[];
//     price: FilterOption[];
//     distance: FilterOption[];
//   };
//   selectedFilters: {
//     cuisine: string[];
//     rating: string[];
//     price: string[];
//     distance: string[];
//   };
//   onFilterChange: (category: string, value: string, isDefault: boolean) => void;
//   clearFilters: () => void;
// }

// interface RestaurantCardProps {
//   restaurant: Restaurant;
//   onSelect: (id: string) => void;
//   isSelected: boolean;
// }

// interface MapPinProps {
//   restaurant: Restaurant;
//   onSelect: (id: string) => void;
//   isSelected: boolean;
// }

// interface RestaurantDetailProps {
//   restaurant: Restaurant;
//   onClose: () => void;
//   onDirectionClick: (restaurant: Restaurant) => void;
// }

// interface RestaurantListProps {
//   restaurants: Restaurant[];
//   selectedRestaurantId: string | null;
//   onSelectRestaurant: (id: string) => void;
//   isLoading: boolean;
//   loadMore: () => void;
//   hasMore: boolean;
//   error: string | null;
// }

// interface MapViewProps {
//   restaurants: Restaurant[];
//   selectedRestaurantId: string | null;
//   onSelectRestaurant: (id: string) => void;
//   userLocation: { lat: number; lng: number } | null;
//   isLoading: boolean;
//   error: string | null;
// }

// interface RestaurantFinderProps {
//   userLocation: { lat: number; lng: number } | null;
// }

// interface LocationPermissionModalProps {
//   isOpen: boolean;
//   onAllow: () => void;
//   onDeny: () => void;
// }

// interface ToastProps {
//   message: string;
//   onClose: () => void;
// }

// type ViewType = "list" | "map";

// type SortingOptionType = "rating" | "distance" | "popularity";

// interface SortingOption {
//   label: string;
//   value: SortingOptionType;
// }

// interface CuisineChipProps {
//   cuisine: CuisineType;
//   selected: boolean;
//   onClick: (cuisine: CuisineType) => void;
// }

// interface Restaurant {
//   id: string;
//   name: string;
//   rating: number;
//   photo: string;
//   distance: string;
//   lat: number;
//   lng: number;
//   cuisine: CuisineType;
//   priceLevel: string;
//   reviews: string;
//   description: string;
// }

// interface FilterOption {
//   label: string;
//   value: string;
//   icon?: string;
// }

// interface ToastProps {
//   message: string;
//   onClose: () => void;
// }

// interface LocationPermissionModalProps {
//   isOpen: boolean;
//   onAllow: () => void;
//   onDeny: () => void;
// }

// interface RestaurantFinderProps {
//   userLocation: { lat: number; lng: number } | null;
// }

// type ViewType = "list" | "map";

// interface FilterPanelProps {
//   filters: {
//     cuisine: FilterOption[];
//     rating: FilterOption[];
//     price: FilterOption[];
//     distance: FilterOption[];
//   };
//   selectedFilters: {
//     cuisine: string[];
//     rating: string[];
//     price: string[];
//     distance: string[];
//   };
//   onFilterChange: (category: string, value: string, isDefault: boolean) => void;
//   clearFilters: () => void;
// }

// interface RestaurantCardProps {
//   restaurant: Restaurant;
//   onSelect: (id: string) => void;
//   isSelected: boolean;
// }

// interface MapPinProps {
//   restaurant: Restaurant;
//   onSelect: (id: string) => void;
//   isSelected: boolean;
// }

// interface RestaurantDetailProps {
//   restaurant: Restaurant;
//   onClose: () => void;
//   onDirectionClick: (restaurant: Restaurant) => void;
// }

// interface RestaurantListProps {
//   restaurants: Restaurant[];
//   selectedRestaurantId: string | null;
//   onSelectRestaurant: (id: string) => void;
//   isLoading: boolean;
//   loadMore: () => void;
//   hasMore: boolean;
//   error: string | null;
// }

// interface MapViewProps {
//   restaurants: Restaurant[];
//   selectedRestaurantId: string | null;
//   onSelectRestaurant: (id: string) => void;
//   userLocation: { lat: number; lng: number } | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
//   isOpen,
//   onAllow,
//   onDeny,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">
//           Location Permission
//         </h2>
//         <p className="text-gray-600 mb-6">
//           This app uses your location to show nearby restaurants. Please enable
//           location access to continue.
//         </p>
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onDeny}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//           >
//             Deny
//           </button>
//           <button
//             onClick={onAllow}
//             className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
//           >
//             Allow
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
//   return (
//     <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50 animate-slide-in">
//       <span>{message}</span>
//       <button onClick={onClose} className="ml-4 text-orange-500 font-bold">
//         ×
//       </button>
//     </div>
//   );
// };

// const cuisineTypes: CuisineType[] = [
//   { name: "Italian", icon: "?" },
//   { name: "Chinese", icon: "?" },
//   { name: "Indian", icon: "?" },
//   { name: "Japanese", icon: "?" },
//   { name: "Mexican", icon: "?" },
//   { name: "Thai", icon: "?" },
//   { name: "Greek", icon: "?" },
//   { name: "French", icon: "?" },
//   { name: "Spanish", icon: "?" },
//   { name: "Korean", icon: "?" },
//   { name: "Vietnamese", icon: "?" },
//   { name: "Middle Eastern", icon: "?" },
//   { name: "American", icon: "?" },
//   { name: "German", icon: "?" },
//   { name: "Italian", icon: "?" },
//   { name: "Chinese", icon: "?" },
//   { name: "Indian", icon: "?" },
//   { name: "Japanese", icon: "?" },
//   { name: "Mexican", icon: "?" },
//   { name: "Thai", icon: "?" },
//   { name: "Greek", icon: "?" },
//   { name: "French", icon: "?" },
//   { name: "Spanish", icon: "?" },
//   { name: "Korean", icon: "?" },
//   { name: "Vietnamese", icon: "?" },
//   { name: "Middle Eastern", icon: "?" },
//   { name: "American", icon: "?" },
//   { name: "German", icon: "?" },
// ];

// const filters = {
//   cuisine: [
//     { label: "All Cuisines", value: "all", icon: "?" },
//     ...cuisineTypes.map((c) => ({ label: c.name, value: c.name, icon: c.icon })),
//   ],
//   rating: [
//     { label: "All Ratings", value: "all" },
//     { label: "4+ Stars", value: "4" },
//     { label: "3+ Stars", value: "3" },
//   ],
//   price: [
//     { label: "All Prices", value: "all" },
//     { label: "Under $10", value: "1" },
//     { label: "$10-$20", value: "2" },
//     { label: "$20-$30", value: "3" },
//     { label: "Over $30", value: "4" },
//   ],
//   distance: [
//     { label: "All Distances", value: "all" },
//     { label: "Under 1km", value: "1" },
//     { label: "1-3km", value: "3" },
//     { label: "3-5km", value: "5" },
//     { label: "Over 5km", value: "10" },
//   ],
// };

// const sortingOptions: SortingOption[] = [
//   { label: "Rating", value: "rating" },
//   { label: "Distance", value: "distance" },
//   { label: "Popularity", value: "popularity" },
// ];

// const mockRestaurants: Restaurant[] = [
//   {
//     id: "1",
//     name: "Tasty Italian",
//     rating: 4.5,
//     photo:
//       "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&h=500&fit=crop",
//     distance: "0.5 km",
//     lat: 37.7749,
//     lng: -122.4194,
//     cuisine: { name: "Italian", icon: "?" },
//     priceLevel: "$$",
//     reviews: "256 reviews",
//     description:
//       "Authentic Italian cuisine with a cozy atmosphere. Try our homemade pasta dishes!",
//   },
//   {
//     id: "2",
//     name: "Spicy Chinese",
//     rating: 4.0,
//     photo:
//       "https://plus.unsplash.com/premium_photo-1701186643238-1d0218c6515d?w=500&h=500&fit=crop",
//     distance: "1.2 km",
//     lat: 37.7858,
//     lng: -122.4364,
//     cuisine: { name: "Chinese", icon: "?" },
//     priceLevel: "$",
//     reviews: "124 reviews",
//     description:
//       "Szechuan cuisine with a focus on spicy dishes. Try our signature Kung Pao chicken!",
//   },
//   {
//     id: "3",
//     name: "Indian Delights",
//     rating: 4.7,
//     photo:
//       "https://images.unsplash.com/photo-1498065021888-7a800b3fcca4?w=500&h=500&fit=crop",
//     distance: "2.5 km",
//     lat: 37.7663,
//     lng: -122.4028,
//     cuisine: { name: "Indian", icon: "?" },
//     priceLevel: "$$$",
//     reviews: "98 reviews",
//     description:
//       "Premium Indian dining experience with a wide variety of curries and tandoori dishes.",
//   },
//   {
//     id: "4",
//     name: "Sushi Haven",
//     rating: 4.9,
//     photo:
//       "https://images.unsplash.com/photo-1571876673347-2a92e2f7bf7f?w=500&h=500&fit=crop",
//     distance: "3.0 km",
//     lat: 37.7904,
//     lng: -122.4056,
//     cuisine: { name: "Japanese", icon: "?" },
//     priceLevel: "$$$$",
//     reviews: "56 reviews",
//     description:
//       "High-end sushi restaurant with fresh, sustainable ingredients. Omakase experience available.",
//   },
//   {
//     id: "5",
//     name: "Mexican Fiesta",
//     rating: 4.2,
//     photo:
//       "https://images.unsplash.com/photo-1515011032314-924e1e2e2b4e?w=500&h=500&fit=crop",
//     distance: "4.5 km",
//     lat: 37.7723,
//     lng: -122.4113,
//     cuisine: { name: "Mexican", icon: "?" },
//     priceLevel: "$$",
//     reviews: "189 reviews",
//     description:
//       "Authentic Mexican street food with a modern twist. Try our famous carne asada tacos!",
//   },
//   {
//     id: "6",
//     name: "Thai Basil",
//     rating: 4.6,
//     photo:
//       "https://images.unsplash.com/photo-1693875161668-5c4ae0f2bf20?w=500&h=500&fit=crop",
//     distance: "6.2 km",
//     lat: 37.7833,
//     lng: -122.4289,
//     cuisine: { name: "Thai", icon: "?" },
//     priceLevel: "$$",
//     reviews: "145 reviews",
//     description:
//       "Traditional Thai cuisine with a focus on fresh herbs and spices. Try our green curry!",
//   },
//   {
//     id: "7",
//     name: "Greek Taverna",
//     rating: 4.8,
//     photo:
//       "https://images.unsplash.com/photo-1709429790175-b02bb1b19207?w=500&h=500&fit=crop",
//     distance: "8.0 km",
//     lat: 37.7654,
//     lng: -122.4567,
//     cuisine: { name: "Greek", icon: "?" },
//     priceLevel: "$$$",
//     reviews: "112 reviews",
//     description:
//       "Authentic Greek cuisine with a cozy Mediterranean atmosphere. Try our moussaka!",
//   },
//   {
//     id: "8",
//     name: "French Bistro",
//     rating: 4.3,
//     photo:
//       "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop",
//     distance: "9.5 km",
//     lat: 37.7777,
//     lng: -122.4444,
//     cuisine: { name: "French", icon: "?" },
//     priceLevel: "$$$$",
//     reviews: "88 reviews",
//     description:
//       "Classic French cuisine with a charming Parisian atmosphere. Try our escargots!",
//   },
//   {
//     id: "9",
//     name: "Spanish Tapas",
//     rating: 4.1,
//     photo:
//       "https://plus.unsplash.com/premium_photo-1701186935350-389820a18261?w=500&h=500&fit=crop",
//     distance: "11.0 km",
//     lat: 37.7632,
//     lng: -122.4789,
//     cuisine: { name: "Spanish", icon: "?" },
//     priceLevel: "$$",
//     reviews: "234 reviews",
//     description:
//       "Authentic Spanish tapas with a wide variety of small plates. Try our paella!",
//   },
//   {
//     id: "10",
//     name: "Korean BBQ",
//     rating: 4.4,
//     photo:
//       "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?w=500&h=500&fit=crop",
//     distance: "12.5 km",
//     lat: 37.7911,
//     lng: -122.4123,
//     cuisine: { name: "Korean", icon: "?" },
//     priceLevel: "$$$",
//     reviews: "167 reviews",
//     description:
//       "Premium Korean BBQ experience with high-quality meats. Try our bulgogi!",
//   },
//   {
//     id: "11",
//     name: "Vietnamese Pho",
//     rating: 4.9,
//     photo:
//       "https://images.unsplash.com/photo-1727833160409-4e394e115ae0?w=500&h=500&fit=crop",
//     distance: "15.0 km",
//     lat: 37.7689,
//     lng: -122.4012,
//     cuisine: { name: "Vietnamese", icon: "?" },
//     priceLevel: "$",
//     reviews: "321 reviews",
//     description:
//       "Authentic Vietnamese street food with a focus on fresh ingredients. Try our pho!",
//   },
//   {
//     id: "12",
//     name: "Middle Eastern Grill",
//     rating: 4.7,
//     photo:
//       "https://plus.unsplash.com/premium_photo-1701186643130-de36c9a8f68e?w=500&h=500&fit=crop",
//     distance: "18.0 km",
//     lat: 37.7823,
//     lng: -122.4356,
//     cuisine: { name: "Middle Eastern", icon: "?" },
//     priceLevel: "$$",
//     reviews: "189 reviews",
//     description:
//       "Authentic Middle Eastern cuisine with a focus on grilled meats. Try our shawarma!",
//   },
//   {
//     id: "13",
//     name: "American Diner",
//     rating: 4.0,
//     photo:
//       "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop",
//     distance: "20.5 km",
//     lat: 37.7765,
//     lng: -122.4178,
//     cuisine: { name: "American", icon: "?" },
//     priceLevel: "$$",
//     reviews: "256 reviews",
//     description:
//       "Classic American comfort food with a retro diner atmosphere. Try our burgers!",
//   },
//   {
//     id: "14",
//     name: "German Beerhouse",
//     rating: 4.5,
//     photo:
//       "https://images.unsplash.com/photo-1551028719-001c5b24915a?w=500&h=500&fit=crop",
//     distance: "22.0 km",
//     lat: 37.7893,
//     lng: -122.4211,
//     cuisine: { name: "German", icon: "?" },
//     priceLevel: "$$$",
//     reviews: "134 reviews",
//     description:
//       "Authentic German cuisine with a focus on sausages and beer. Try our schnitzel!",
//   },
//   {
//     id: "15",
//     name: "Italian Fusion",
//     rating: 4.3,
//     photo:
//       "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&h=500&fit=crop",
//     distance: "25.5 km",
//     lat: 37.7659,
//     lng: -122.4562,
//     cuisine: { name: "Italian", icon: "🍝" },
//     priceLevel: "$$$",
//     reviews: "112 reviews",
//     description:
//       "Modern Italian cuisine with a fusion twist. Try our truffle risotto!",
//   },
//   {
//     id: "16",
//     name: "Chinese Dim Sum",
//     rating: 4.8,
//     photo:
//       "https://plus.unsplash.com/premium_photo-1669879825881-6d4e4bde67d5?w=500&h=500&fit=crop",
//     distance: "27.0 km",
//     lat: 37.7834,
//     lng: -122.4392,
//     cuisine: { name: "Chinese", icon: "🥡" },
//     priceLevel: "$$",
//     reviews: "189 reviews",
//     description:
//       "Authentic Cantonese dim sum with a modern twist. Try our har gow!",
//   },
//   {
//     id: "17",
//     name: "Indian Curry",
//     rating: 4.6,
//     photo:
//       "https://images.unsplash.com/photo-1607005362901-5e1b211b1b41?w=500&h=500&fit=crop",
//     distance: "30.5 km",
//     lat: 37.7773,
//     lng: -122.4173,
//     cuisine: { name: "Indian", icon: "🍛" },
//     priceLevel: "$$",
//     reviews: "156 reviews",
//     description:
//       "Traditional Indian curry house with a wide variety of dishes. Try our butter chicken!",
//   },
//   {
//     id: "18",
//     name: "Japanese Ramen",
//     rating: 4.9,
//     photo:
//       "https://plus.unsplash.com/premium_photo-1664478291780-0c67f5fb15e6?w=500&h=500&fit=crop",
//     distance: "33.0 km",
//     lat: 37.7654,
//     lng: -122.4789,
//     cuisine: { name: "Japanese", icon: "🍜" },
//     priceLevel: "$$",
//     reviews: "234 reviews",
//     description:
//       "Authentic Japanese ramen with rich tonkotsu broth. Try our signature bowl!",
//   },
//   {
//     id: "19",
//     name: "Mexican Grill",
//     rating: 4.4,
//     photo:
//       "https://images.unsplash.com/photo-1608198093007-ad4e00e484ed?w=500&h=500&fit=crop",
//     distance: "35.5 km",
//     lat: 37.7912,
//     lng: -122.4056,
//     cuisine: { name: "Mexican", icon: "?" },
//     priceLevel: "$$",
//     reviews: "198 reviews",
//     description:
//       "Authentic Mexican grill with a focus on grilled meats. Try our carne asada!",
//   },
//   {
//     id: "20",
//     name: "Thai Street Food",
//     rating: 4.7,
//     photo:
//       "https://plus.unsplash.com/premium_photo-1701186935370-bb755e730604?w=500&h=500&fit=crop",
//     distance: "38.0 km",
//     lat: 37.7835,
//     lng: -122.4578,
//     cuisine: { name: "Thai", icon: "?" },
//     priceLevel: "$",
//     reviews: "289 reviews",
//     description:
//       "Authentic Thai street food with a focus on fresh ingredients. Try our pad thai!",
//   },
// ];

export default function RestaurantFinder() {
    return(
    <></>
    );
}

// const RestaurantFinder: React.FC<RestaurantFinderProps> = ({ userLocation }) => {
//   const [view, setView] = useState<ViewType>("list");
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [cuisineFilter, setCuisineFilter] = useState<string[]>([]);
//   const [ratingFilter, setRatingFilter] = useState<string[]>([]);
//   const [priceFilter, setPriceFilter] = useState<string[]>([]);
//   const [distanceFilter, setDistanceFilter] = useState<string[]>([]);
//   const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
//     null
//   );
//   const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
//   const [sortingOption, setSortingOption] =
//     useState<SortingOptionType>("rating");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [page, setPage] = useState<number>(1);
//   const [error, setError] = useState<string | null>(null);
//   const [isPermissionModalOpen, setIsPermissionModalOpen] =
//     useState<boolean>(false);
//   const [toast, setToast] = useState<{ message: string; onClose: () => void }>(
//     null
//   );
//   const [selectedCuisines, setSelectedCuisines] = useState<CuisineType[]>([]);
//   const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
//     []
//   );
//   const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setIsFilterOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!userLocation) {
//       setIsPermissionModalOpen(true);
//       return;
//     }

//     fetchRestaurants();
//   }, [userLocation]);

//   useEffect(() => {
//     if (restaurants.length > 0) {
//       applyFiltersAndSorting();
//     }
//   }, [cuisineFilter, ratingFilter, priceFilter, distanceFilter, sortingOption]);

//   const fetchRestaurants = async () => {
//     if (isLoading || !hasMore) return;

//     setIsLoading(true);
//     setError(null);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       const startIndex = (page - 1) * 10;
//       const endIndex = startIndex + 10;

//       const newRestaurants = mockRestaurants
//         .sort((a, b) => b.rating - a.rating)
//         .slice(startIndex, endIndex);

//       setRestaurants((prev) => [...prev, ...newRestaurants]);

//       setHasMore(endIndex < mockRestaurants.length);
//       setPage((prev) => prev + 1);
//     } catch (err) {
//       setError("Failed to fetch restaurants. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const applyFiltersAndSorting = () => {
//     let filtered = [...restaurants];

//     if (cuisineFilter.length > 0 && !cuisineFilter.includes("all")) {
//       filtered = filtered.filter((r) => cuisineFilter.includes(r.cuisine.name));
//     }

//     if (ratingFilter.length > 0 && !ratingFilter.includes("all")) {
//       filtered = filtered.filter((r) => {
//         const ratingValue = parseFloat(ratingFilter[0]);
//         return r.rating >= ratingValue;
//       });
//     }

//     if (priceFilter.length > 0 && !priceFilter.includes("all")) {
//       filtered = filtered.filter((r) => {
//         const priceValue = parseInt(priceFilter[0]);
//         const priceMap = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
//         return priceMap[r.priceLevel] <= priceValue;
//       });
//     }

//     if (distanceFilter.length > 0 && !distanceFilter.includes("all")) {
//       filtered = filtered.filter((r) => {
//         const distValue = parseFloat(distanceFilter[0]);
//         const distMap = { "0.5": 1, "1.2": 2, "2.5": 3, "3.0": 4 };
//         return distMap[r.distance] <= distValue;
//       });
//     }

//     if (searchQuery.trim()) {
//       filtered = filtered.filter((r) =>
//         r.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     const sorted = [...filtered].sort((a, b) => {
//       if (sortingOption === "rating") {
//         return b.rating - a.rating;
//       } else if (sortingOption === "distance") {
//         const distA = parseFloat(a.distance.replace(" km", ""));
//         const distB = parseFloat(b.distance.replace(" km", ""));
//         return distA - distB;
//       } else {
//         return 0;
//       }
//     });

//     setFilteredRestaurants(sorted);
//     setIsFilterApplied(
//       cuisineFilter.length > 0 ||
//         ratingFilter.length > 0 ||
//         priceFilter.length > 0 ||
//         distanceFilter.length > 0 ||
//         searchQuery.trim() !== ""
//     );
//   };

//   const onFilterChange = (category: string, value: string, isDefault: boolean) => {
//     if (category === "cuisine") {
//       if (value === "all") {
//         setCuisineFilter([]);
//         setSelectedCuisines([]);
//       } else {
//         const newFilters = cuisineFilter.includes(value)
//           ? cuisineFilter.filter((f) => f !== value)
//           : [...cuisineFilter, value];

//         setCuisineFilter(newFilters);

//         if (isDefault) {
//           setSelectedCuisines([]);
//         } else {
//           const selected = cuisineTypes.filter((c) =>
//             newFilters.includes(c.name)
//           );
//           setSelectedCuisines(selected);
//         }
//       }
//     } else if (category === "rating") {
//       setRatingFilter(value === "all" ? [] : [value]);
//     } else if (category === "price") {
//       setPriceFilter(value === "all" ? [] : [value]);
//     } else if (category === "distance") {
//       setDistanceFilter(value === "all" ? [] : [value]);
//     }
//   };

//   const clearFilters = () => {
//     setCuisineFilter([]);
//     setRatingFilter([]);
//     setPriceFilter([]);
//     setDistanceFilter([]);
//     setSelectedCuisines([]);
//     setSearchQuery("");
//     setIsFilterApplied(false);
//   };

//   const handleViewChange = (newView: ViewType) => {
//     setView(newView);
//   };

//   const handleSelectRestaurant = (id: string) => {
//     setSelectedRestaurant(id);
//   };

//   const handleCloseDetail = () => {
//     setSelectedRestaurant(null);
//   };

//   const handleDirectionClick = (restaurant: Restaurant) => {
//     if (!userLocation) return;

//     const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${restaurant.lat},${restaurant.lng}&mode=driving`;
//     window.open(url, "_blank");
//   };

//   const handleLoadMore = () => {
//     fetchRestaurants();
//   };

//   const handleAllowLocation = () => {
//     setIsPermissionModalOpen(false);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const location = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//       },
//       (error) => {
//         setToast({
//           message: "Please enable location permissions and try again.",
//           onClose: () => setToast(null),
//         });
//       }
//     );
//   };

//   const handleDenyLocation = () => {
//     setIsPermissionModalOpen(false);

//     setToast({
//       message:
//         "Location permission denied. Some features may not be available.",
//       onClose: () => setToast(null),
//     });
//   };

//   const handleCuisineClick = (cuisine: CuisineType) => {
//     const isSelected = selectedCuisines.some((c) => c.name === cuisine.name);

//     if (isSelected) {
//       const newCuisines = selectedCuisines.filter((c) => c.name !== cuisine.name);
//       const newFilters = cuisineFilter.filter((f) => f !== cuisine.name);

//       setSelectedCuisines(newCuisines);
//       setCuisineFilter(newFilters);
//     } else {
//       const newCuisines = [...selectedCuisines, cuisine];
//       const newFilters = [...cuisineFilter, cuisine.name];

//       setSelectedCuisines(newCuisines);
//       setCuisineFilter(newFilters);
//     }
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <LocationPermissionModal
//         isOpen={isPermissionModalOpen}
//         onAllow={handleAllowLocation}
//         onDeny={handleDenyLocation}
//       />

//       {toast && <Toast message={toast.message} onClose={toast.onClose} />}

//       <header className="bg-white shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <div className="flex items-center space-x-1.5 mr-2">
//                 <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                 <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//               </div>
//               <h1 className="text-2xl font-extralight tracking-wider text-gray-800">
//                 Gourmet<span className="font-bold">Finder</span>
//               </h1>

//               <div className="hidden md:block h-6 w-px bg-gray-300 mx-4"></div>

//               <div className="hidden md:flex items-center space-x-2">
//                 <span className="text-sm text-gray-500">Powered by</span>
//                 <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-500">
//                   Google Maps API
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {userLocation && (
//                 <div className="hidden md:flex items-center space-x-1.5 text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span className="text-xs font-medium">
//                     Near you
//                   </span>
//                 </div>
//               )}

//               <div className="relative md:hidden">
//                 <button
//                   onClick={() => setIsSearchOpen(!isSearchOpen)}
//                   className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>

//                 {isSearchOpen && (
//                   <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
//                     <input
//                       type="search"
//                       placeholder="Search restaurants..."
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       value={searchQuery}
//                       onChange={handleSearch}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="hidden md:block">
//             <div className="max-w-3xl relative">
//               <input
//                 type="search"
//                 placeholder="Search restaurants..."
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-10"
//                 value={searchQuery}
//                 onChange={handleSearch}
//               />
//               <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="flex flex-1 bg-gray-50">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
//           <aside className="w-full md:w-64 flex flex-col gap-6 flex-shrink-0">
//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//               <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 mr-1.5 text-orange-500"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Location
//               </h2>
//               <p className="text-xs text-gray-500">
//                 {userLocation
//                   ? "Using your current location"
//                   : "Location not available"}
//               </p>
//             </div>

//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//               <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 mr-1.5 text-orange-500"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M7.21 14.77l.02.02a3.066 3.066 0 001.138 1.362l.02.02c.568.71.126 1.706-.317 2.385-.444.68-1.234 1.11-2.352 1.27-1.119.16-2.274-.02-3.362-.51a3.375 3.375 0 01-1.274-1.396 3.196 3.196 0 01-.514-1.62c.204-.313.612-.51.995-.69.545-.258 1.108-.364 1.685-.364.309 0 .618.082.918.246z" />
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Filters
//               </h2>

//               <div className="space-y-4">
//                 {Object.entries(filters).map(([category, options]) => (
//                   <div key={category} className="space-y-2">
//                     <label className="text-xs font-medium text-gray-700 capitalize">
//                       {category}
//                     </label>
//                     <div className="space-y-2">
//                       {options.map((filter) => (
//                         <div
//                           key={filter.value}
//                           className="flex items-center space-x-2"
//                         >
//                           <input
//                             type="checkbox"
//                             id={`${category}-${filter.value}`}
//                             checked={
//                               category === "cuisine"
//                                 ? cuisineFilter.includes(filter.value)
//                                 : category === "rating"
//                                 ? ratingFilter.includes(filter.value)
//                                 : category === "price"
//                                 ? priceFilter.includes(filter.value)
//                                 : distanceFilter.includes(filter.value)
//                             }
//                             onChange={(e) =>
//                               onFilterChange(
//                                 category,
//                                 filter.value,
//                                 e.target.checked
//                               )
//                             }
//                             className="rounded text-orange-500 focus:ring-orange-500 h-3 w-3"
//                           />
//                           <label
//                             htmlFor={`${category}-${filter.value}`}
//                             className="text-xs text-gray-600 flex items-center"
//                           >
//                             {filter.icon && (
//                               <span className="mr-1">{filter.icon}</span>
//                             )}
//                             {filter.label}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {(cuisineFilter.length > 0 ||
//                 ratingFilter.length > 0 ||
//                 priceFilter.length > 0 ||
//                 distanceFilter.length > 0) && (
//                 <button
//                   onClick={clearFilters}
//                   className="mt-4 text-xs text-orange-500 hover:text-orange-700 transition-colors"
//                 >
//                   Clear all filters
//                 </button>
//               )}
//             </div>
//           </aside>

//           <section className="flex-1">
//             {isFilterApplied && (
//               <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-700 rounded-r-lg shadow-sm">
//                 <p className="text-sm font-medium">
//                   {filteredRestaurants.length} results found for your filters
//                 </p>
//               </div>
//             )}

//             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => handleViewChange("list")}
//                     className={`p-2 rounded-lg ${
//                       view === "list"
//                         ? "bg-orange-500 text-white"
//                         : "text-gray-500 hover:bg-gray-100"
//                     }`}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M7 3a1 1 0 011v5H4a1 1 0 01-1-1V4a1 1 0 011-1h3zm3 3a3 3 0 100 6 3 3 0 000-6zm4 5H8a1 1 0 011-1h7a1 1 0 110 2h-7a1 1 0 01-1-1zM4 9h3a1 1 0 010 2H4a1 1 0 01-1-1V9a1 1 0 011-1zm10-1h3a1 1 0 110 2h-3a1 1 0 110-2zm-1 4a1 1 0 100 2h3a1 1 0 100-2h-3z" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={() => handleViewChange("map")}
//                     className={`p-2 rounded-lg ${
//                       view === "map"
//                         ? "bg-orange-500 text-white"
//                         : "text-gray-500 hover:bg-gray-100"
//                     }`}
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Sort by:
//                   </label>
//                   <select
//                     value={sortingOption}
//                     onChange={(e) =>
//                       setSortingOption(e.target.value as SortingOptionType)
//                     }
//                     className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
//                   >
//                     {sortingOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {view === "list" ? (
//               <RestaurantList
//                 restaurants={filteredRestaurants}
//                 selectedRestaurantId={selectedRestaurant}
//                 onSelectRestaurant={handleSelectRestaurant}
//                 isLoading={isLoading}
//                 loadMore={handleLoadMore}
//                 hasMore={hasMore}
//                 error={error}
//               />
//             ) : (
//               <MapView
//                 restaurants={filteredRestaurants}
//                 selectedRestaurantId={selectedRestaurant}
//                 onSelectRestaurant={handleSelectRestaurant}
//                 userLocation={userLocation}
//                 isLoading={isLoading}
//                 error={error}
//               />
//             )}
//           </section>
//         </div>
//       </main>

//       {selectedRestaurant && (
//         <RestaurantDetail
//           restaurant={
//             restaurants.find((r) => r.id === selectedRestaurant) ||
//             filteredRestaurants.find((r) => r.id === selectedRestaurant)
//           }
//           onClose={handleCloseDetail}
//           onDirectionClick={handleDirectionClick}
//         />
//       )}
//     </div>
//   );
// };

// const RestaurantList: React.FC<RestaurantListProps> = ({
//   restaurants,
//   selectedRestaurantId,
//   onSelectRestaurant,
//   isLoading,
//   loadMore,
//   hasMore,
//   error,
// }) => {
//   if (isLoading && restaurants.length === 0) {
//     return (
//       <div className="space-y-4">
//         {[1, 2, 3, 4].map((i) => (
//           <div
//             key={i}
//             className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse"
//           >
//             <div className="flex justify-between">
//               <div className="space-y-2">
//                 <div className="h-6 w-24 bg-gray-200 rounded"></div>
//                 <div className="h-4 w-32 bg-gray-200 rounded"></div>
//               </div>
//               <div className="h-6 w-12 bg-gray-200 rounded"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
//         <p className="text-sm font-medium">{error}</p>
//         <button
//           onClick={loadMore}
//           className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="grid gap-4">
//         {restaurants.map((restaurant) => (
//           <RestaurantCard
//             key={restaurant.id}
//             restaurant={restaurant}
//             onSelect={onSelectRestaurant}
//             isSelected={selectedRestaurantId === restaurant.id}
//           />
//         ))}
//       </div>

//       {hasMore && (
//         <div className="mt-6 text-center">
//           <button
//             onClick={loadMore}
//             disabled={isLoading}
//             className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
//           >
//             {isLoading ? "Loading..." : "Load More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const RestaurantCard: React.FC<RestaurantCardProps> = ({
//   restaurant,
//   onSelect,
//   isSelected,
// }) => {
//   return (
//     <div
//       onClick={() => onSelect(restaurant.id)}
//       className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all ${
//         isSelected
//           ? "ring-2 ring-orange-500 border-orange-500"
//           : "hover:border-orange-300"
//       }`}
//     >
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="relative w-full sm:w-36 h-24 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
//           <img
//             src={restaurant.photo || "/placeholder.svg"}
//             alt={restaurant.name}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-lg text-xs font-medium text-gray-800 flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-3.5 w-3.5 mr-1 text-orange-500"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//             </svg>
//             {restaurant.rating}
//           </div>
//         </div>

//         <div className="flex-1">
//           <div className="flex justify-between items-start">
//             <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
//             <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//               {restaurant.distance}
//             </span>
//           </div>

//           <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//             {restaurant.description}
//           </p>

//           <div className="mt-2 flex items-center space-x-2">
//             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
//               {restaurant.cuisine.name}
//             </span>
//             <span className="text-xs text-gray-500">{restaurant.priceLevel}</span>
//             <span className="text-xs text-gray-500">•</span>
//             <span className="text-xs text-gray-500">{restaurant.reviews}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MapView: React.FC<MapViewProps> = ({
//   restaurants,
//   selectedRestaurantId,
//   onSelectRestaurant,
//   userLocation,
//   isLoading,
//   error,
// }) => {
//   const mapContainerRef = useRef<HTMLDivElement>(null);
//   const [map, setMap] = useState<google.maps.Map | null>(null);
//   const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
//   const [infoWindow, setInfoWindow] =
//     useState<google.maps.InfoWindow | null>(null);
//   const [isMapReady, setIsMapReady] = useState<boolean>(false);

//   useEffect(() => {
//     if (map && userLocation && isMapReady) {
//       map.panTo(userLocation);
//     }
//   }, [userLocation, map, isMapReady]);

//   useEffect(() => {
//     if (!map || !isMapReady) return;

//     const newMarkers: google.maps.Marker[] = [];

//     restaurants.forEach((restaurant) => {
//       const marker = new google.maps.Marker({
//         position: { lat: restaurant.lat, lng: restaurant.lng },
//         map,
//         title: restaurant.name,
//         icon: {
//           url: `https://maps.google.com/mapfiles/ms/micons/${
//             selectedRestaurantId === restaurant.id ? "red" : "orange"
//           }-dot.png`,
//         },
//       });

//       marker.addListener("click", () => {
//         onSelectRestaurant(restaurant.id);
//       });

//       newMarkers.push(marker);
//     });

//     setMarkers(newMarkers);

//     return () => {
//       newMarkers.forEach((marker) => marker.setMap(null));
//     };
//   }, [restaurants, map, selectedRestaurantId, onSelectRestaurant, isMapReady]);

//   useEffect(() => {
//     if (!map || !infoWindow || !selectedRestaurantId || !isMapReady) return;

//     const selectedRestaurant = restaurants.find(
//       (r) => r.id === selectedRestaurantId
//     );

//     if (!selectedRestaurant) return;

//     const position = {
//       lat: selectedRestaurant.lat,
//       lng: selectedRestaurant.lng,
//     };

//     infoWindow.setContent(
//       `<div class="w-64 p-2">
//         <h3 class="font-bold text-gray-900">${selectedRestaurant.name}</h3>
//         <p class="text-xs text-gray-600 mt-1">${selectedRestaurant.description}</p>
//         <div class="mt-2 flex items-center">
//           <span class="text-xs font-medium text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">${selectedRestaurant.cuisine.name}</span>
//           <span class="ml-2 text-xs text-gray-500">${selectedRestaurant.distance}</span>
//         </div>
//       </div>`
//     );

//     infoWindow.setPosition(position);
//     infoWindow.open(map);

//     map.panTo(position);
//   }, [selectedRestaurantId, restaurants, map, infoWindow, isMapReady]);

//   return (
//     <div
//       ref={mapContainerRef}
//       className="w-full h-[600px] rounded-lg shadow-sm border border-gray-200"
//     />
//   );
// };

// const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
//   restaurant,
//   onClose,
//   onDirectionClick,
// }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md mx-auto rounded-t-lg md:rounded-lg shadow-xl">
//         <div className="relative">
//           <div className="h-48 w-full relative">
//             <img
//               src={restaurant.photo || "/placeholder.svg"}
//               alt={restaurant.name}
//               className="w-full h-full object-cover"
//             />

//             <button
//               onClick={onClose}
//               className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>

//           <div className="p-4">
//             <div className="flex justify-between items-start mb-3">
//               <h2 className="text-xl font-bold text-gray-900">
//                 {restaurant.name}
//               </h2>
//               <div className="flex items-center">
//                 <span className="text-sm font-medium text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
//                   {restaurant.cuisine.name}
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center space-x-2 mb-4">
//               <div className="flex items-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-orange-500 mr-1"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//                 <span className="text-sm font-medium">{restaurant.rating}</span>
//               </div>
//               <span className="text-sm text-gray-500">•</span>
//               <span className="text-sm text-gray-500">{restaurant.distance}</span>
//               <span className="text-sm text-gray-500">•</span>
//               <span className="text-sm text-gray-500">{restaurant.priceLevel}</span>
//             </div>

//             <p className="text-sm text-gray-600 mb-4">
//               {restaurant.description}
//             </p>

//             <div className="flex space-x-3">
//               <button
//                 onClick={() => onDirectionClick(restaurant)}
//                 className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 mr-2"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 Get Directions
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const { isLoaded, load } = useJsApiLoader({
//   id: "google-maps-script",
//   googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
// });

// const App: React.FC = () => {
//   const [userLocation, setUserLocation] =
//     useState<{ lat: number; lng: number } | null>(null);

//   useEffect(() => {
//     if (isLoaded) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error getting user location:", error);
//         }
//       );
//     }
//   }, [isLoaded]);

//   if (!isLoaded) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   return <RestaurantFinder userLocation={userLocation} />;
// };

// export default App;

// Zod Schema
export const Schema = {
    "commentary": "This is a modern restaurant finder app UI that displays a map-based discovery, list browsing, and detailed filtering options for cuisine, rating, and distance.",
    "template": "nextjs-developer",
    "title": "Restaurant Finder",
    "description": "A modern restaurant finder app UI showing map-based discovery, list browsing, and detailed filtering options for cuisine, rating, and distance.",
    "additional_dependencies": [
        "@react-google-maps/api"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install @react-google-maps/api",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}
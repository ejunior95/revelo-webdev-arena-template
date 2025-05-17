import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, ChevronLeft, Eye, Heart, Home, LoaderCircle, MapPin, Search, SlidersHorizontal, Star, UserRound, UtensilsCrossed } from "lucide-react";
import Head from "next/head";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardFooter } from "@/components/ui/card";
const Maps_API_KEY = "AIzaSyDa2jDnCojs2CBL5PhL1-zAhikNVMoq4tA";

declare const window: Window & {
  initMap?: () => void;
  google?: typeof google
};

type NavMenuItem = {
  title: string;
  icon: ReactNode
}

type Restaurant = {
  name: string;
  address: string;
  rating: number;
  image: string;
  category: string;
  averagePrice: number;
  position: { lat: number, lng: number };
}

type ApiResponse = {
  nav_menu_items: NavMenuItem[];
  restaurants: Restaurant[];
};

const mockData: ApiResponse = {
  "nav_menu_items": [
    {
      title: "Home",
      icon: <Home />
    },
    {
      title: "Restaurants",
      icon:  <UtensilsCrossed />
    },
    {
      title: "History",
      icon: <CalendarDays />
    },
    {
      title: "Profile",
      icon: <UserRound />
    },
  ],
  "restaurants": [
    {
      name: "Yardbird Table & Bar",
      address: "1600 Lenox Ave, Miami Beach, FL 33139",
      rating: 4.5,
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant2.jpg",
      category: "Japanese",
      averagePrice: 72,
      position: { lat: 25.7890725, lng: -80.1401045 }
    },
    {
      name: "Bodega Taqueira y Tequila",
      address: "1220 16th St, Miami Beach, FL 33139",
      rating: 4.8,
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant3.jpg",
      category: "Mexican",
      averagePrice: 88,
      position: { lat: 25.7886568, lng: -80.1416695 }
    },
    {
      name: "Joe's Stone Crab",
      address: "11 Washington Ave, Miami Beach, FL 33139",
      rating: 4.8,
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant1.jpg",
      category: "French",
      averagePrice: 100,
      position: { lat: 25.770452, lng: -80.135042 }
    },
    {
      name: "Broken Shaker at Freehand",
      address: "2727 Indian Creek Dr, Miami Beach, FL 33140",
      rating: 4.3,
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant4.jpeg",
      category: "Fast Food",
      averagePrice: 120,
      position: { lat: 25.8045614, lng: -80.1264185 }
    },
    {
      name: "MILA Restaurant",
      address: "1636 Meridian Ave Rooftop, Miami Beach, FL 33139",
      rating: 4.5,
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant5.png",
      category: "Fast Food",
      averagePrice: 200,
      position: { lat: 25.7900722, lng: -80.1367143 }
    },
  ]
};

function useFetchData() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data' + err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    trackClassName?: string;
    rangeClassName?: string;
    thumbClassName?: string;
  }
>(
  (
    { className, trackClassName, rangeClassName, thumbClassName, ...props },
    ref
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
          trackClassName
        )}
      >
        <SliderPrimitive.Range
          className={cn("absolute h-full bg-primary", rangeClassName)}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block h-6 w-6 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          thumbClassName
        )}
      />
      <SliderPrimitive.Thumb
        className={cn(
          "block h-6 w-6 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          thumbClassName
        )}
      />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export default function RestaurantFinder() {
  const { data, loading } = useFetchData();
  const [theme, setTheme] = useState("light");
  const [activeNavItem, setActiveNavItem] = useState<string>("Home")
  const [categorySearchFilter, setCategorySearchFilter] = useState<string[]>([""])
  const [distanceSearchFilter, setDistanceSearchFilter] = useState<number>(1)
  const [ratingsSearchFilter, setRatingsSearchFilter] = useState<number[]>([])
  const [pricesSearchFilter, setPricesSearchFilter] = useState<number[]>([0,250])
  const [searchData, setSearchData] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState<string>("");
  
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<google.maps.Map | null>(null);

  // Fetch Google Maps API
  useEffect(() => {
    setTheme("light")
    const initMap = () => {
      
      try {
        const position = { lat: 25.7871999, lng: -80.1405045 }
        if (mapRef.current && !mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: position,
            zoom: 16,
            disableDefaultUI: true,
            draggable: true,
            zoomControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            mapId: "RESTAURANT_FINDER_MAP_ID",
            
          });
          mapInstanceRef.current = map;

          new google.maps.marker.AdvancedMarkerElement({
            map,
            position: data?.restaurants[0].position,
            title: data?.restaurants[0].name || "Restaurant 01",
          });
          new google.maps.marker.AdvancedMarkerElement({
            map,
            position: data?.restaurants[1].position,
            title: data?.restaurants[1].name || "Restaurant 02",
          });
        }
      } catch (error) {
        console.log(`Error on maps: ${error}`)
      }
      
    };

    const loadGoogleMapsScript = () => {
      if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
        if (window.google && window.google.maps) {
          initMap();
        } else {
          const checkInterval = setInterval(() => {
            if (window.google && window.google.maps) {
              clearInterval(checkInterval);
              initMap();
            }
          }, 300);
        }
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps_API_KEY}&loading=async&libraries=marker`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    return () => {
      if ((window).initMap) {
        delete (window).initMap;
      }
    };
  }, [Maps_API_KEY]);

  
  const SearchComponent = () => {
    return (
      <div className="flex flex-col justify-center items-center w-[90%] py-1 mt-6 absolute top-0 z-20">
        {
          activeNavItem === "Restaurants" &&
          <div className="w-full flex justify-between items-center mb-2">
            <ChevronLeft onClick={() => setActiveNavItem("Home")} size={24} className={`p-2 border ${theme === "dark" ? 'border-gray-500  text-white' : 'border-gray-300  text-black'} rounded-full w-12 h-10`} />
            <p className={`${theme === "dark" ? 'text-white' : 'text-black'} w-full text-center font-semibold`}>List of restaurants</p>
            <Heart size={24} className={`p-2 border ${theme === "dark" ? 'border-gray-500  text-white' : 'border-gray-300  text-black'} rounded-full w-12 h-10`} />
          </div>
        }
        <div className="flex justify-between items-center w-full my-2 z-30">
          <div className={`w-[80%] ${theme === "dark" ? 'bg-black' : 'bg-white'} border py-3 rounded-2xl flex items-center justify-around`}>
            <Search className="text-[#F95624] w-6 h-6" />
            <input  
              className={`w-[80%] text-sm ${theme === "dark" ? 'text-white' : 'text-black'} bg-transparent outline-none border-none`} 
              type="text" 
              onChange={(e) => [handleSearch(e.target.value), setSearch(e.target.value)]}
              placeholder="Restaurant name or dish..." />
          </div>
          {SearchFilterDrawer()}
        </div>

      </div>
    )
  }

  const SearchFilterDrawer = () => {

    const handleDistanceChange = (operation: string) => {
      if(operation === 'minus' && distanceSearchFilter > 1) {
        setDistanceSearchFilter(distanceSearchFilter - 1)
      }
      if(operation === 'plus') {
        setDistanceSearchFilter(distanceSearchFilter + 1)
      }
    }

    const handleSelectRating = (value: number) => {
      if(ratingsSearchFilter.includes(value)) {
        setRatingsSearchFilter(ratingsSearchFilter.filter((r) => r !== value));
      } else {
        setRatingsSearchFilter([...ratingsSearchFilter, value])
      }
    }

    const handleSelectCategory = (value: string) => {
      if(categorySearchFilter.includes(value)) {
        setCategorySearchFilter(categorySearchFilter.filter((r) => r !== value));
      } else {
        setCategorySearchFilter([...categorySearchFilter, value])
      }
    }

    const handleResetFilters = () => {
      setCategorySearchFilter([])
      setDistanceSearchFilter(1)
      setRatingsSearchFilter([])
    }

    return(
      <>
        <Drawer>
          <DrawerTrigger>
            <button className={`bg-[#F95624] flex justify-center items-center p-3 rounded-2xl`}>
              <SlidersHorizontal />
            </button>
          </DrawerTrigger>
          <DrawerContent className={`${theme === "dark" ? 'bg-black text-white' : 'bg-white text-black'}  w-full flex flex-col justify-center font-['Lexend'] items-center`}>
            <DrawerHeader className="w-full">
              <DrawerTitle className="w-full flex justify-between items-center">
                <div className="w-9 h-2"></div>
                <p className="text-xl">Filter</p>
                <p onClick={handleResetFilters} className={`text-sm ${theme === "dark" ? 'text-gray-600' : 'text-gray-400'}`}>Reset</p>
              </DrawerTitle>
            </DrawerHeader>

            <div className="w-full flex flex-col justify-between items-center px-4"> 
              <p className="w-full font-medium mb-4">Categories</p>
              <div className="grid grid-cols-3 gap-x-2">
                <p onClick={() => handleSelectCategory('Fast Food')} className={`
                ${categorySearchFilter.includes('Fast Food') ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-4 text-center py-2 text-sm mb-2 border rounded-xl`
                }>Fast Food</p>
                <p onClick={() => handleSelectCategory('European')} className={`
                ${categorySearchFilter.includes('European') ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-4 text-center py-2 text-sm mb-2 border rounded-xl`
                }>European</p>
                <p onClick={() => handleSelectCategory('Italian')} className={`
                ${categorySearchFilter.includes('Italian') ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-4 text-center py-2 text-sm mb-2 border rounded-xl`
                } >Italian</p>
                <p onClick={() => handleSelectCategory('Mexican')} className={`
                ${categorySearchFilter.includes('Mexican') ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-4 text-center py-2 text-sm mb-2 border rounded-xl`
                }>Mexican</p>
                <p onClick={() => handleSelectCategory('Japanese')} className={`
                ${categorySearchFilter.includes('Japanese') ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-4 text-center py-2 text-sm mb-2 border rounded-xl`
                }>Japanese</p>
                <p onClick={() => handleSelectCategory('French')} className={`
                ${categorySearchFilter.includes('French') ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-4 text-center py-2 text-sm mb-2 border rounded-xl`
                }>French</p>
              </div>

              <Separator className="my-4 bg-gray-300" />

              <div className="w-full flex justify-between items-center">
                <p className="font-medium">Distance to me</p>
                <div className="flex justify-between items-center">
                  <p onClick={() => handleDistanceChange('minus')} className="text-center h-12 w-12 text-4xl border rounded-xl flex justify-center items-center">-</p>
                  <p className="text-center px-2 text-lg flex text-[#F95624]">{distanceSearchFilter} km</p>
                  <p onClick={() => handleDistanceChange('plus')} className="text-center h-12 w-12 text-3xl border rounded-xl flex justify-center items-center">+</p>
                </div>
              </div>

              <Separator className="my-4 bg-gray-300" />
              
              <div className="w-full flex flex-col justify-start items-start">
                <p className="font-medium mb-4">Rating</p>
                <div className="flex justify-between items-center w-full">
                  <div onClick={() => handleSelectRating(1)} 
                    className={`${ratingsSearchFilter.includes(1) ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-3 py-1 space-x-1 text-lg border rounded-xl flex justify-center items-center`}>
                    <p>1</p>
                    <Star size={15} className="text-amber-400" />
                  </div>
                  <div onClick={() => handleSelectRating(2)} 
                    className={`${ratingsSearchFilter.includes(2) ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-3 py-1 space-x-1 text-lg border rounded-xl  flex justify-center items-center`}>
                    <p>2</p>
                    <Star size={15} className="text-amber-400" />
                  </div>
                  <div onClick={() => handleSelectRating(3)}  
                    className={`${ratingsSearchFilter.includes(3) ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-3 py-1 space-x-1 text-lg border rounded-xl  flex justify-center items-center`}>
                    <p>3</p>
                    <Star size={15} className="text-amber-400" />
                  </div>
                  <div onClick={() => handleSelectRating(4)} 
                    className={`${ratingsSearchFilter.includes(4) ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-3 py-1 space-x-1 text-lg border rounded-xl  flex justify-center items-center`}>
                    <p>4</p>
                    <Star size={15} className="text-amber-400" />
                  </div>
                  <div onClick={() => handleSelectRating(5)} 
                    className={`${ratingsSearchFilter.includes(5) ? 'bg-[#F95624] text-white' : 'bg-transparent'} px-3 py-1 space-x-1 text-lg border rounded-xl  flex justify-center items-center`}>
                    <p>5</p>
                    <Star size={15} className="text-amber-400" />
                  </div>
                </div>
              </div>

              <Separator className="my-4 bg-gray-300" />

              <div className="w-full flex flex-col justify-start items-start mb-4">
                <div className="w-full flex justify-between items-center">
                  <p className="font-medium mb-4">Price</p>
                  <p className="font-medium mb-4 text-[#F95624]">{`$${pricesSearchFilter[0]} - $${pricesSearchFilter[1]}`}</p>
                </div>
                <div className="flex justify-between items-center w-full">

                <Slider
                  defaultValue={pricesSearchFilter}
                  minStepsBetweenThumbs={1}
                  max={250}
                  step={1}
                  onValueChange={(e) => setPricesSearchFilter(e)}
                  rangeClassName="bg-[#F95624]"
                  thumbClassName="bg-[#F95624]"
                  trackClassName="bg-gray-200"
                />
                  
                </div>
              </div>

            </div>

            <DrawerFooter className="w-full">
              <DrawerClose className="w-full">
                <Button onClick={() => handleSearch(search)} className="w-full rounded-xl h-[6dvh] bg-[#F95624] hover:bg-[#F95624] text-white">Show results</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  const ListRestaurantsTab = () => {
    return (
      <>
          <div className={`${theme === "dark" ? 'bg-black border' : 'bg-white shadow-[rgba(0,0,0,0.1)_0px_4px_5px_5px]'} transform w-full flex flex-col justify-center rounded-t-3xl font-['Lexend'] items-center absolute bottom-0 left-0 pb-[10dvh] z-40  transition duration-500 hover:translate-y-[100%]`}>
            <div className="w-full justify-center place-items-center py-2">
              <div className={`w-10 h-1 ${theme === "dark" ? 'bg-gray-500' : 'bg-gray-200'} rounded-xl`} />
            </div>
            <div className="w-full mt-2 mb-4">
              <p className={`${theme === "dark" ? 'text-white' : 'text-black'} w-full text-center font-semibold`}>List of restaurants</p>
            </div>

            {
              searchData?.slice(0,2)
              .map((restaurant: Restaurant) => (RestaurantCard(restaurant)))
            }

          </div>
      </>
    )
  }

  const RestaurantCard = (item: Restaurant) => {
    return (
      <div key={item.name} className={`rounded-xl w-[90dvw] flex items-center py-6 px-3 space-x-3 mb-6 ${theme === "dark" ? 'bg-black border' : 'bg-white shadow-[rgba(0,0,0,0.1)_0px_4px_5px_5px] text-black'}`}>
        <img
          src={item.image}
          alt={item.name}
          className="w-20 object-cover h-full rounded-md"
        />

        <div className="flex flex-col justify-start items-start space-y-1">
          <div className="flex items-center justify-between w-[60dvw]">
            <p className="font-medium w-[70%] text-sm truncate">{item.name}</p>
            <div className="flex space-x-1 justify-center items-center mr-3">
              <Star className="text-amber-500" size={15} />
              <p className={`font-extralight ${theme === "dark" ? 'text-gray-300' : 'text-gray-500'} text-xs`}>{item.rating}</p>
            </div>
          </div>

          <div className="flex justify-start items-center w-[65dvw]">
            <MapPin className="text-orange-600" />
            <p className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-400'}  w-[80%] truncate`}>{item.address}</p>
          </div>
        </div>

      </div>
    )
  }

  const HistoryCard = (item: Restaurant) => {
    return (
      <div key={item.name} className={`rounded-xl w-[90dvw] flex items-center py-6 px-3 space-x-3 mb-12 ${theme === "dark" ? 'bg-black border' : 'bg-white shadow-[rgba(0,0,0,0.1)_0px_4px_5px_5px] text-black relative'}`}>
        <img
          src={item.image}
          alt={item.name}
          className="w-20 object-cover h-full rounded-md"
        />

        <div className="flex flex-col justify-start items-start space-y-1">
          <div className="flex items-center justify-between w-[60dvw]">
            <p className="font-medium w-[70%] text-sm truncate">{item.name}</p>
            <div className="flex space-x-1 justify-center items-center mr-3">
              <Star className="text-amber-500" size={15} />
              <p className={`font-extralight ${theme === "dark" ? 'text-gray-300' : 'text-gray-500'} text-xs`}>{item.rating}</p>
            </div>
          </div>

          <div className="flex justify-start items-center w-[65dvw]">
            <MapPin className="text-orange-600" />
            <p className={`text-sm ${theme === "dark" ? 'text-gray-300' : 'text-gray-400'}  w-[80%] truncate`}>{item.address}</p>
          </div>
        </div>
        <p className={`text-xs p-2 bg-[#F95624] text-white absolute -top-8 left-0 rounded-t-xl`}>You visited this place on 10/22/24</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const handleSearch = (search: string) => {
    if (!search.trim()) {
        setSearchData([]);
        return;
    }

    try {
        const newRegex = new RegExp(search, 'i');
        const newSearch = data?.restaurants?.filter(restaurant => 
            newRegex.test(restaurant.name)
        ) ?? [];
        
        setSearchData(newSearch);
    } catch (e) {
        console.log(e)
        setSearchData([]);
    }
  }

  return (
    loading ? ( 
      <> 
        <div className={`w-full h-dvh flex-col place-content-center justify-items-center ${theme === "dark" ? 'bg-black' : 'bg-white'} text-black`}>
          <LoaderCircle className='w-20 h-20 animate-spin' />
          <p className='mt-2'>Loading...</p>
        </div> 
      </> 
    ) :
    <>
      <Head>
          <title>Restaurant Finder</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
      </Head>

      
        <div
          ref={mapRef}
          id="google-map-background"
          className={`absolute inset-0 w-full h-full ${activeNavItem === "Home" && `z-10`}`}
        />
      
      <div id="main" className={`
        w-full 
        ${theme === "dark" ? 'bg-black' : 'bg-white'}
        flex 
        flex-col 
        justify-between 
        items-center 
        min-h-dvh 
        font-['Lexend'] 
        relative
        overflow-hidden
        `}>

        { activeNavItem !== "History" && activeNavItem !== "Profile"  && SearchComponent() }

        {
          activeNavItem === "Restaurants" && searchData.length > 0 && (
              <ScrollArea className={`w-full h-[70dvh] py-4 mt-[20dvh]`}>
                <div className="w-full flex flex-col justify-center items-center">
                  {
                    searchData?.map((restaurant: Restaurant) => (RestaurantCard(restaurant)))
                  }
                </div>
              </ScrollArea>
            )
        }
        {
          activeNavItem === "Restaurants" && searchData.length === 0 && (
                 <div className="w-full h-dvh flex justify-center place-items-center text-center p-4">
                    <p className={`${theme === "dark" ? 'text-white' : 'text-black'}`}>No restaurants matching the current filters.</p>
                </div>
          )
        }

        {
          activeNavItem === "History" &&
            <div className="w-full h-dvh flex flex-col justify-start items-center">
              <div className="w-full flex justify-between items-center px-5 pt-7 mb-10">
                <ChevronLeft onClick={() => setActiveNavItem("Home")} size={24} className={`p-2 border ${theme === "dark" ? 'border-gray-500  text-white' : 'border-gray-300  text-black'} rounded-full w-12 h-10`} />
                <p className={`${theme === "dark" ? 'text-white' : 'text-black'} w-full text-center font-semibold`}>History</p>
                <div className={`p-2 w-12 h-10`} />
              </div>
              <ScrollArea className={`w-full h-[70dvh]`}>
                <div className="w-full flex flex-col pt-12 justify-center items-center">
                  {
                    data?.restaurants.map((restaurant: Restaurant) => (HistoryCard(restaurant)))
                  }
                </div>
              </ScrollArea>
            </div>
        }

        {
          activeNavItem === "Profile" &&
          <div className="w-full h-dvh flex flex-col justify-start items-center">
            <div className="w-full flex justify-between items-center px-5 pt-7 mb-10">
              <ChevronLeft onClick={() => setActiveNavItem("Home")} size={24} className={`p-2 border ${theme === "dark" ? 'border-gray-500  text-white' : 'border-gray-300  text-black'} rounded-full w-12 h-10`} />
              <p className={`${theme === "dark" ? 'text-white' : 'text-black'} w-full text-center font-semibold`}>Profile</p>
              <div className={`p-2 w-12 h-10`} />
            </div>
            
              <form onSubmit={handleSubmit} className={`w-full h-[70dvh] flex flex-col justify-between items-center ${theme === "dark" ? 'text-white' : 'text-black'}`}>
                      <div className="flex mb-5">
                        <Avatar className="h-20 w-20 mr-4 rounded-full">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="Username"
                            className="object-cover object-center"
                          />
                          <AvatarFallback className="text-3xl">??</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-4">
                          <Label
                            htmlFor="avatar"
                            className="
                              cursor-pointer 
                              inline-flex 
                              items-center 
                              justify-center 
                              p-3
                              bg-blue-600 
                              text-white 
                              font-semibold 
                              rounded-md
                              shadow-md 
                              hover:bg-blue-900 
                              transition duration-300"
                          >
                            Change your profile photo
                          </Label>
                          <input
                            id="avatar"
                            name="avatar"
                            type="file"
                            className="hidden"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 w-[90%]">
                        <Label className="my-3" htmlFor="name">Name</Label>
                        <Input
                          required
                          className={`border w-full`}
                          id="name"
                          type="text"
                        />
                      </div>
                      <div className="space-y-1 w-[90%]">
                        <Label className="my-3" htmlFor="email">Email</Label>
                        <Input
                          required
                          className={`border w-full`}
                          id="email"
                          type="email"
                        />
                      </div>
                      <div className="space-y-1 relative w-[90%]">
                        <Label className="my-3" htmlFor="current">Current Password</Label>
                        <Input
                          required
                          className={`border w-full`}
                          id="current"
                          type="password"
                        />
                        <Button
                          variant="link"
                          size="icon"
                          type="button"
                          className="cursor-pointer absolute bottom-0 right-0"
                        >
                          <Eye className={`h-[1.2rem] w-[1.2rem] ${theme === "dark" ? 'text-white' : 'text-black'}`} />
                        </Button>
                      </div>
                      <div className="space-y-1 relative w-[90%]">
                        <Label className="my-3" htmlFor="new">New Password</Label>
                        <Input
                          className={`border w-full`}
                          id="new"
                          type="password"
                        />
                        <Button
                          variant="link"
                          size="icon"
                          type="button"
                          className="cursor-pointer absolute bottom-0 right-0"
                        >
                          <Eye className={`h-[1.2rem] w-[1.2rem] ${theme === "dark" ? 'text-white' : 'text-black'}`} />
                        </Button>
                      </div>

                      <CardFooter className="px-0 mt-4 w-[90%]">
                        <Button
                          type="submit"
                          className="w-full p-5 cursor-pointer select-none bg-[#F95624] text-white"
                        >
                          Save
                        </Button>
                      </CardFooter>
                    </form>
            
          </div>
        }

        <nav className={`${theme === "dark" ? 'bg-black border' : 'bg-white shadow-[rgba(0,0,0,0.1)_0px_4px_5px_5px]'} rounded-xl z-50 flex justify-evenly items-center w-[90%] py-2 my-6 fixed bottom-0`}>
          { 
            data?.nav_menu_items.map((item) => (
              <div key={item.title} onClick={() => setActiveNavItem(item.title)} className={`flex flex-col justify-center items-center space-y-1 ${
                activeNavItem === item.title ? `text-[#F95624]` : 'text-gray-400'}`}>
                {item.icon}
                <p className="text-xs">{item.title}</p>
              </div> 
            ))
          }
        </nav>

        { activeNavItem === "Home" && searchData.length && ListRestaurantsTab() }

      </div>

    </>
  );
};
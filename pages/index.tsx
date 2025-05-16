import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Home, LoaderCircle, MapPin, Search, SlidersHorizontal, Star, UserRound, UtensilsCrossed } from "lucide-react";
import Head from "next/head";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type NavMenuItem = {
  title: string;
  icon: ReactNode
}

type Restaurant = {
  name: string;
  address: string;
  rating: string;
  image: string;
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
      name: "Osteria Francescana",
      address: "2727 Indian Creek Dr, Miami Beach, FL 50789",
      rating: "4,8",
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant1.jpg"
    },
    {
      name: "Yardbird Table & Bar",
      address: "1600 Lenox Ave, Miami Beach, FL 33139",
      rating: "4,5",
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant2.jpg"
    },
    {
      name: "Bodega Taqueira y Tequila",
      address: "1220 16th St, Miami Beach, FL 43177",
      rating: "4,8",
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant3.jpg"
    },
    {
      name: "Broken Shaker at Freehand",
      address: "2727 Indian Creek Dr, Miami Beach, FL 61955",
      rating: "4,3",
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant4.jpeg"
    },
    {
      name: "MILA Restaurant",
      address: "1636 Meridian Ave Rooftop, Miami Beach, FL 95136",
      rating: "4,5",
      image: "https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/img-restaurant5.png"
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
        await new Promise(resolve => setTimeout(resolve, 1000));
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
  const [activeNavItem, setActiveNavItem] = useState<string>("Home")
  const [valuesSliderFilterSearch, setValuesSliderFilterSearch] = useState<number[]>([70,125])

  
const SearchComponent = () => {
  return (
    <div className="flex justify-between items-center w-[90%] py-1 mt-6 absolute top-0">
      
      <div className="w-[80%] bg-white border py-3 rounded-2xl flex items-center justify-around">
        <Search className="text-[#F95624] w-6 h-6" />
        <input className="w-[80%] text-sm outline-none border-none" type="text" placeholder="Restaurant name or dish..." />
      </div>

      {SearchFilterDrawer()}

    </div>
  )
}

const SearchFilterDrawer = () => {
  return(
    <>
      <Drawer>
        <DrawerTrigger>
          <button className={`bg-[#F95624] flex justify-center items-center p-3 rounded-2xl`}>
            <SlidersHorizontal />
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-white text-black w-full flex flex-col justify-center font-['Lexend'] items-center">
          <DrawerHeader className="w-full">
            <DrawerTitle className="w-full flex justify-between items-center">
              <div className="w-9 h-2"></div>
              <p className="text-xl">Filter</p>
              <p className="text-sm text-gray-400">Reset</p>
            </DrawerTitle>
          </DrawerHeader>

          <div className="w-full flex flex-col justify-between items-center px-4"> 
            <p className="w-full font-medium mb-4">Categories</p>
            <div className="grid grid-cols-3 gap-x-2">
              <p className="px-4 text-center py-2 text-sm mb-2 border border-gray-300 rounded-xl">Fast Food</p>
              <p className="px-4 text-center py-2 text-sm mb-2 border border-gray-300 rounded-xl">European</p>
              <p className="px-4 text-center py-2 text-sm mb-2 border border-gray-300 rounded-xl bg-[#F95624] text-white">Italian</p>
              <p className="px-4 text-center py-2 text-sm mb-2 border border-gray-300 rounded-xl">Mexican</p>
              <p className="px-4 text-center py-2 text-sm mb-2 border border-gray-300 rounded-xl">Japanese</p>
              <p className="px-4 text-center py-2 text-sm mb-2 border border-gray-300 rounded-xl">French</p>
            </div>

            <Separator className="my-4 bg-gray-300" />

            <div className="w-full flex justify-between items-center">
              <p className="font-medium">Distance to me</p>
              <div className="flex justify-between items-center">
                <p className="text-center h-12 w-12 text-4xl border border-gray-300 rounded-xl flex justify-center items-center">-</p>
                <p className="text-center px-2 text-lg flex">2 km</p>
                <p className="text-center h-12 w-12 text-3xl border border-gray-300 rounded-xl  flex justify-center items-center">+</p>
              </div>
            </div>

            <Separator className="my-4 bg-gray-300" />
            
            <div className="w-full flex flex-col justify-start items-start">
              <p className="font-medium mb-4">Rating</p>
              <div className="flex justify-between items-center w-full">
                <div className="px-3 py-1 space-x-1 text-lg border border-gray-300 rounded-xl flex justify-center items-center">
                  <p>1</p>
                  <Star size={15} className="text-amber-400" />
                </div>
                <div className="px-3 py-1 space-x-1 text-lg border border-gray-300 rounded-xl  flex justify-center items-center">
                  <p>2</p>
                  <Star size={15} className="text-amber-400" />
                </div>
                <div className="px-3 py-1 space-x-1 text-lg border border-gray-300 rounded-xl  flex justify-center items-center">
                  <p>3</p>
                  <Star size={15} className="text-amber-400" />
                </div>
                <div className="px-3 py-1 space-x-1 text-lg border border-gray-300 rounded-xl  flex justify-center items-center">
                  <p>4</p>
                  <Star size={15} className="text-amber-400" />
                </div>
                <div className="px-3 py-1 space-x-1 text-lg border border-gray-300 rounded-xl  flex justify-center items-center">
                  <p>5</p>
                  <Star size={15} className="text-amber-400" />
                </div>
              </div>
            </div>

            <Separator className="my-4 bg-gray-300" />

            <div className="w-full flex flex-col justify-start items-start mb-4">
              <div className="w-full flex justify-between items-center">
                <p className="font-medium mb-4">Price</p>
                <p className="font-medium mb-4 text-[#F95624]">{`$${valuesSliderFilterSearch[0]} - $${valuesSliderFilterSearch[1]}`}</p>
              </div>
              <div className="flex justify-between items-center w-full">

              <Slider
                defaultValue={valuesSliderFilterSearch}
                minStepsBetweenThumbs={1}
                max={250}
                step={1}
                onValueChange={(e) => setValuesSliderFilterSearch(e)}
                rangeClassName="bg-[#F95624]"
                thumbClassName="bg-[#F95624]"
                trackClassName="bg-gray-200"
              />
                
              </div>
            </div>

          </div>

          <DrawerFooter className="w-full">
            <DrawerClose className="w-full">
              <Button className="w-full rounded-xl h-[6dvh] bg-[#F95624] hover:bg-[#F95624] text-white">Show results</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const ListRestaurantsDrawer = (item: NavMenuItem) => {
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          <div key={item.title} onClick={() => setActiveNavItem(item.title)} className={`flex flex-col justify-center items-center space-y-1 ${
                activeNavItem === item.title ? `text-[#F95624]` : 'text-gray-400'}`}>
                {item.icon}
                <p className="text-xs">{item.title}</p>
          </div>
        </DrawerTrigger>
        <DrawerContent className="bg-white w-full flex flex-col justify-center font-['Lexend']  items-center">
          <DrawerHeader className="w-full">
            <DrawerTitle className="text-black w-full text-center">List of restaurants</DrawerTitle>
          </DrawerHeader>

          {
            data?.restaurants.slice(0,2)
            .map((restaurant: Restaurant) => (RestaurantCard(restaurant)))
          }

          <DrawerFooter className="w-full">
            <DrawerClose className="w-full">
              <Button className="w-full bg-[#F95624] hover:bg-[#F95624] text-white">See more</Button>
              <Button className="w-full ">Back</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

const RestaurantCard = (item: Restaurant) => {
  return (
    <div key={item.name} className="rounded-xl text-black w-[90dvw] flex items-center py-6 px-3 space-x-3 mb-6 bg-white shadow-[rgba(0,0,0,0.1)_0px_4px_5px_5px]">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 object-cover h-full rounded-md"
      />

      <div className="flex flex-col justify-start items-start space-y-1">
        <div className="flex items-center justify-between w-[60dvw]">
          <p className="font-medium">{item.name}</p>
          <div className="flex space-x-1 justify-center items-center">
            <Star className="text-amber-500" size={20} />
            <p className="font-extralight text-gray-500">{item.rating}</p>
          </div>
        </div>

        <div className="flex justify-start items-center w-[65dvw]">
          <MapPin className="text-orange-600" />
          <p className="text-sm text-gray-400 w-[80%] truncate">{item.address}</p>
        </div>
      </div>

    </div>
  )
}

  return (
    loading ? ( 
      <> 
        <div className='w-full h-dvh flex-col place-content-center justify-items-center bg-white text-black'>
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

      <div id="main" className="
        w-full 
        bg-white 
        flex 
        flex-col 
        justify-center 
        items-center 
        min-h-dvh 
        bg-gradient-to-tr 
        font-['Lexend'] 
        relative">

        {SearchComponent()}

        <nav className="rounded-xl z-50 flex justify-evenly items-center w-[90%] py-2 mb-6 fixed bottom-0 bg-white shadow-[rgba(0,0,0,0.1)_0px_4px_5px_5px]">
          { 
            data?.nav_menu_items.map((item) => (
              item.title !== "Restaurants" ?
              <div key={item.title} onClick={() => setActiveNavItem(item.title)} className={`flex flex-col justify-center items-center space-y-1 ${
                activeNavItem === item.title ? `text-[#F95624]` : 'text-gray-400'}`}>
                {item.icon}
                <p className="text-xs">{item.title}</p>
              </div> :
              ListRestaurantsDrawer(item)
            ))
          }
        </nav>


      </div>

    </>
  );
};
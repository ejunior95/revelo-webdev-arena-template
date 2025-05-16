import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { CalendarDays, Filter, Home, LoaderCircle, MapPin, Search, SlidersHorizontal, Star, UserRound, UtensilsCrossed } from "lucide-react";
import Head from "next/head";
import { ReactNode, useEffect, useState } from "react";

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

export default function RestaurantFinder() {
  const { data, loading } = useFetchData();
  const [activeNavItem, setActiveNavItem] = useState<string>("Home")

  
const SearchComponent = () => {
  return (
    <div className="flex justify-between items-center w-[90%] py-1 mt-6 absolute top-0">
      
      <div className="w-[80%] bg-white border py-4 rounded-2xl flex items-center justify-around">
        <Search className="text-[#F95624] w-8 h-8" />
        <input className="w-[80%] text-sm outline-none border-none" type="text" placeholder="Restaurant name or dish..." />
      </div>

      <button className={`bg-[#F95624] flex justify-center items-center p-4 rounded-2xl`}>
        <SlidersHorizontal />
      </button>

    </div>
  )
}

const ListRestaurantsTab = (item: NavMenuItem) => {
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
        <div className="flex items-center justify-between w-[65dvw]">
          <p className="font-medium">{item.name}</p>
          <div className="flex space-x-1 mr-2">
            <Star className="text-amber-500" />
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

        <nav className="rounded-xl z-50 flex justify-evenly items-center w-[90%] py-2 mb-6 absolute bottom-0 bg-white shadow-[rgba(0,0,0,0.1)_0px_4px_5px_5px]">
          { 
            data?.nav_menu_items.map((item) => (
              item.title !== "Restaurants" ?
              <div key={item.title} onClick={() => setActiveNavItem(item.title)} className={`flex flex-col justify-center items-center space-y-1 ${
                activeNavItem === item.title ? `text-[#F95624]` : 'text-gray-400'}`}>
                {item.icon}
                <p className="text-xs">{item.title}</p>
              </div> :
              ListRestaurantsTab(item)
            ))
          }
        </nav>


      </div>

    </>
  );
};
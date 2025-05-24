// import Head from "next/head";
// import { ArrowLeftRight, BadgeDollarSign, Bell, ChartLine, ChevronDown, CircleHelp, Home, LoaderCircle, LogOut, Newspaper, Search, Settings, WalletMinimal } from "lucide-react";
// import { ReactNode, useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
// import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// interface IMenuItems {
//   title: string,
//   url: string,
//   icon: ReactNode,
// }

// const SIZE_MENU_ICONS = 20

// const MENU_ITEMS: IMenuItems[] = [
//   {
//     title: "Dash board",
//     url: "#",
//     icon: <Home size={SIZE_MENU_ICONS} />,
//   },
//   {
//     title: "Wallet",
//     url: "#",
//     icon: <WalletMinimal size={SIZE_MENU_ICONS} />,
//   },
//   {
//     title: "Statistic",
//     url: "#",
//     icon: <ChartLine size={SIZE_MENU_ICONS} />,
//   },
//   {
//     title: "Transactions",
//     url: "#",
//     icon: <BadgeDollarSign size={SIZE_MENU_ICONS} />,
//   },
//   {
//     title: "Exchange",
//     url: "#",
//     icon: <ArrowLeftRight size={SIZE_MENU_ICONS} />,
//   },
//   {
//     title: "News",
//     url: "#",
//     icon: <Newspaper size={SIZE_MENU_ICONS} />,
//   },
//   {
//     title: "Help",
//     url: "#",
//     icon: <CircleHelp size={SIZE_MENU_ICONS} />,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: <Settings size={SIZE_MENU_ICONS} />,
//   },
// ];

// type ChartData = {
//   name: string;
//   USD: number;
//   BTC: number;
//   net: number;
// };

// type MarketValue = {
//   coin: string;
//   rise: string;
//   percent: string;
//   velve1: string;
//   velve2: string;
//   last7Days: ReactNode;
//   color: string;
// };

// type FuturesData = {
//   price: string;
//   pros: string;
//   color: string;
//   size: string
// };

// type CashFlow = {
//   send: string;
//   received: string;
// };

// type Balance = {
//   total: string;
//   valueBTC: string;
// };

// type ApiResponse = {
//   chart: ChartData[];
//   market_values: MarketValue[];
//   futures: FuturesData[];
//   cash_flow: CashFlow;
//   balance: Balance;
// };

// const mockData: ApiResponse = {
//   "chart": [
//     { "name": "Jan", "USD": 120, "BTC": 180, "net": 60 },
//     { "name": "Feb", "USD": 150, "BTC": 120, "net": -30 },
//     { "name": "Mar", "USD": 90, "BTC": 150, "net": 60 },
//     { "name": "Apr", "USD": 180, "BTC": 90, "net": -90 },
//     { "name": "May", "USD": 120, "BTC": 210, "net": 90 },
//     { "name": "Jun", "USD": 240, "BTC": 180, "net": -60 },
//     { "name": "Jul", "USD": 110, "BTC": 140, "net": 30 },
//     { "name": "Aug", "USD": 200, "BTC": 160, "net": -40 },
//     { "name": "Sep", "USD": 130, "BTC": 200, "net": 70 },
//     { "name": "Oct", "USD": 170, "BTC": 130, "net": -40 },
//   ],
//   "market_values": [
//     { 
//       "coin": "BTC0456", 
//       "rise": "$35,567.00", 
//       "percent": "+8,4%", 
//       "velve1": "078,45647.23", 
//       "velve2": "$567,558.678", 
//       "last7Days": <svg width="100" height="40" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
//         <path d="M20 60 L20 30 Q20 10 40 10 L130 10" className="stroke-[#FB8905] fill-transparent" stroke-width="4" />
//       </svg>,
//       "color": "#FB8905" 
//     },
//     { 
//       "coin": "207537891", 
//       "rise": "02.14567", 
//       "percent": "4%" , 
//       "velve1": "$456,456.00", 
//       "velve2": "$754,345.00", 
//       "last7Days": <svg width="100" height="50" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
//         <path d="M10 30 Q30 10 80 30 T100 30" className="stroke-[#0C018A] fill-transparent" stroke-width="4" />
//       </svg>,
//       "color": "#0C018A"
//       },
//   ],
//   "futures": [
//     { "price": "34,970.98", "pros": "$770", "color": "#FB8905", "size": "110" },
//     { "price": "24,675.89", "pros": "$270", "color": "#FB8905", "size": "70" },
//     { "price": "34,675.54", "pros": "$130", "color": "#FB8905", "size": "60" },
//     { "price": "22,544.96", "pros": "$845", "color": "#0C018A", "size": "150" },
//     { "price": "41,257.88", "pros": "$116", "color": "#0C018A", "size": "50" },
//     { "price": "25,454.04", "pros": "$116", "color": "#0C018A", "size": "40" },
//   ],
//   "cash_flow": {
//     "send": "30,000.00",
//     "received": "30,000.00",
//   },
//   "balance": {
//     "total": "$600,000.00",
//     "valueBTC": "15.67386482973",
//   }
// };

// function useFetchData() {
//   const [data, setData] = useState<ApiResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         setData(mockData);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch data' + err);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { data, loading, error };
// }

// export default function CryptoDashboard() {
//   const { data, loading } = useFetchData();
//   const [modeActive, setModeActive] = useState<string>('buy');
//   const [activeNavItem, setActiveNavItem] = useState<string>('Dash board');

  
// const renderChart = () => {
//     if (!data) return null;

//     const positiveColor = '#10b981';
//     const negativeColor = '#ef4444';
//     const neutralColor = '';

//     const processedData = data.chart.map(item => {
//       const netColor = item.net > 0 ? positiveColor : item.net < 0 ? negativeColor : neutralColor;
//       return { ...item, netColor };
//     });

//     return (
//       <ResponsiveContainer width="100%" height={300}>
//         <ChartContainer
//           config={{
//             USD: {
//               label: 'USD',
//               color: '#0C018A',
//             },
//             BTC: {
//               label: 'BTC',
//               color: '#FB8905',
//             },
//             net: {
//               label: 'Net',
//             },
//           }}
//           className="h-full w-full"
//         >
//           <AreaChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
//             <defs>
//               <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor={positiveColor} stopOpacity={0.34} />
//                 <stop offset="95%" stopColor={positiveColor} stopOpacity={0.06} />
//               </linearGradient>
//               <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor={negativeColor} stopOpacity={0.34} />
//                 <stop offset="95%" stopColor={negativeColor} stopOpacity={0.06} />
//               </linearGradient>
//               <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor={neutralColor} stopOpacity={0.34} />
//                 <stop offset="95%" stopColor={neutralColor} stopOpacity={0.06} />
//               </linearGradient>
//             </defs>

//             <XAxis
//               dataKey="name"
//               axisLine={false}
//               tickLine={false}
//               tick={{ fontSize: 12 }}
//               dy={10}
//             />

//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               tick={{ fontSize: 12 }}
//               width={40}
//             />

//             <CartesianGrid
//               strokeDasharray="3 3"
//               vertical={false}
//               stroke="#374151"
//             />

//             <ChartTooltip
//               content={
//                 <ChartTooltipContent
//                   formatter={(value, name) => {
//                     if (name === 'net') {
//                       const color = positiveColor;
//                       return <span style={{ color }}>{`Net: ${value}`}</span>;
//                     }
//                     return <span>{`${name}: ${value}`}</span>;
//                   }}
//                 />
//               }
//             />

//             <Area
//               type="monotone"
//               dataKey="USD"
//               stroke="#0C018A"
//               strokeWidth={2}
//               activeDot={{ r: 6, strokeWidth: 0, fill: '#0C018A' }}
//               dot={{ r: 4, strokeWidth: 0, fill: '#0C018A' }}
//               name=" "
//             />

//             <Area
//               type="monotone"
//               dataKey="BTC"
//               stroke="#FB8905"
//               strokeWidth={2}
//               activeDot={{ r: 6, strokeWidth: 0, fill: '#FB8905' }}
//               dot={{ r: 4, strokeWidth: 0, fill: '#FB8905' }}
//               name=" "
//             />

//             <Line
//               type="monotone"
//               dataKey="net"
//               dot={false}
//               name=" "
//             />

//             <ChartLegend verticalAlign="top" content={<ChartLegendContent className="justify-start" />} />
//           </AreaChart>
//         </ChartContainer>
//       </ResponsiveContainer>
//     );
//   };

//   return (
//       loading ? ( 
//         <> 
//           <div className='w-full h-dvh flex-col place-content-center justify-items-center'>
//             <LoaderCircle className='w-20 h-20 animate-spin' />
//             <p className='mt-2'>Loading...</p>
//           </div> 
//         </> 
//       ) :
//       <>
//         <Head>
//           <title>CashflowCrypto Dashboard</title>
//           <link rel="preconnect" href="https://fonts.googleapis.com" />
//           <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//           <link
//             href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
//             rel="stylesheet"
//           />
//         </Head>
  
//         <div id="main" className="w-full flex min-h-dvh bg-gradient-to-tr font-['Inter'] from-[#0e0e14] to-[#21232d] text-white">
  

//           <div id="sidebar"
//             className="flex flex-col place-items-center py-4 relative w-20 lg:w-[200px] xl:w-[250px] 2xl:w-[300px] h-dvh xl:h-[100dvh]
//               border-gray-500 md:border-r-2 shrink-0
//             "
//           >
//             <div className="w-full flex items-center text-xl mb-6 lg:mb-2 justify-center">
//               <img
//                 src="https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/icon-dashboard.png"
//                 alt="Logo Dash"
//                 className="w-6 h-6 object-contain"
//               />
//               <h1 className="pl-2 hidden lg:inline text-[15px] ">CashflowCrypto</h1>
//             </div>
  
//             <p className="w-full p-6 text-gray-300 hidden text-xs lg:block">Menu</p>
  
//             <ul className="space-y-2 xl:space-y-0 pb-4 w-full border-gray-500 text-muted-foreground md:border-b-0 lg:border-b-2">
//               {MENU_ITEMS.slice(0, 6).map((item) =>
//                 <li
//                   key={item.title}
//                   onClick={() => setActiveNavItem(item.title)}
//                   className={`flex hover:bg-[#2e2e3e] ${activeNavItem === item.title ? 'border-r-4 border-white text-white w-full md:w-auto lg:w-[calc(100%+2px)]' : 'text-muted-foreground w-full'}`}
//                 >
//                   <a href={item.url} title={item.title} className="w-full flex items-center justify-center lg:justify-start py-2 md:px-3 lg:px-6">
//                     {item.icon}
//                     <span className="pl-3 md:pl-2 hidden lg:inline text-sm">{item.title}</span>
//                   </a>
//                 </li>
//               )}
//             </ul>
  
//             <p className="w-full p-6 text-gray-300 hidden text-xs lg:block">Settings</p>
  
//             <ul className="w-full text-muted-foreground">
//               {MENU_ITEMS.slice(6, 8).map((item) =>
//                 <li
//                   key={item.title}
//                   onClick={() => setActiveNavItem(item.title)}
//                   className={`flex hover:bg-[#2e2e3e] ${activeNavItem === item.title ? 'border-r-4 border-white text-white w-full md:w-auto lg:w-[calc(100%+2px)]' : 'text-muted-foreground w-full'}`}
//                 >
//                   <a href={item.url} title={item.title} className="w-full flex items-center justify-center lg:justify-start py-2 md:px-3 lg:px-6">
//                     {item.icon}
//                     <span className="pl-3 md:pl-2 hidden lg:inline text-sm">{item.title}</span>
//                   </a>
//                 </li>
//               )}
//             </ul>
  
//             <div className="w-full cursor-pointer py-2  hover:bg-[#2e2e3e] justify-center lg:justify-start flex items-center absolute bottom-4 left-0 text-red-500 hover:text-red-400 pl-6">
//               <LogOut size={SIZE_MENU_ICONS} />
//               <p className="pl-3 hidden lg:inline text-sm">Logout</p>
//             </div>
//           </div>
  
          
//           <div id="main-container" className="w-full flex-grow h-dvh overflow-y-auto"> 
  
//             <nav className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 md:px-8 py-3 space-y-3 sm:space-y-0 sticky top-0 bg-[#21232d]/40 backdrop-blur-md z-30 ">
//               <div>
//                 <p className="text-base sm:text-lg"><strong>Welcome back,</strong> Sharon!</p>
//                 <small className="text-[11px] sm:text-[12px] text-muted-foreground">Checkout latest updates.</small>
//               </div>
//               <div className="hidden lg:flex space-x-3 sm:space-x-4 items-center text-foreground">
//                 <Bell size={20} className="hover:text-white/80 cursor-pointer" />
//                 <Avatar className="w-8 h-8 cursor-pointer">
//                   <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
//                   <AvatarFallback>SC</AvatarFallback>
//                 </Avatar>
//                 <ChevronDown size={20} className="hover:text-white/80 cursor-pointer" />
//               </div>
//             </nav>
  
//             <div id="container" className="flex flex-col lg:flex-row w-full p-4 md:p-4 lg:p-6">
  
//               <div id="left-container" className="w-full lg:w-[60%] ">
                
//                 <div id="search-container" className="px-8 py-2 w-full h-auto text-sm md:text-base rounded-full bg-[#19181e] flex items-center shadow-md mb-6 md:mb-8">
//                   <Search className="text-muted-foreground mr-2 md:mr-3" size={18} />
//                   <input className="w-full pl-1 md:pl-2 text-sm md:text-base outline-none bg-transparent placeholder-gray-500" placeholder="Search news, cryptocurrency etc..." />
//                 </div>
  
                
//                 <div id="container-receive-send-balance" 
//                   className="w-full mb-6 md:mb-8 min-h-[180px] md:min-h-[200px] lg:h-[28dvh] p-3 md:p-4 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-4">
                  
//                   <div id="container-receive-send" className="w-full p-4 flex flex-col space-y-2 lg:space-y-0 lg:py-10 lg:flex-row items-center justify-evenly md:w-[48%] bg-gradient-to-r from-[#0D0D16] to-[#1F2029] shadow-2xl/30">
                    
//                     <div id="container-send" className="flex flex-col items-center justify-center space-y-2">
//                       <div className="flex items-center justify-center">
//                         <img
//                           src="https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/icon-money.png"
//                           alt="Logo Money"
//                           className="w-7 h-7 object-contain"
//                         />
//                         <p className="pl-2 text-xs">{data?.cash_flow.send}</p>
//                       </div>
//                         <p className="text-xs">Expenses</p>
//                         <button className="bg-[#FB8905] hover:bg-[#a6600f] transition-all duration-200 ease-in-out w-[90%] md:w-[6dvw] py-1 rounded-md text-sm cursor-pointer">SEND</button>
//                     </div>
                    
//                     <div id="container-receive" className="flex flex-col items-center justify-center space-y-2">
//                       <div className="flex items-center justify-center">
//                         <img
//                           src="https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/icon-money.png"
//                           alt="Logo Money"
//                           className="w-7 h-7 object-contain"
//                         />
//                         <p className="pl-2 text-xs">{data?.cash_flow.received}</p>
//                       </div>
//                         <p className="text-xs">Income</p>
//                         <button className="bg-[#0C018A] hover:bg-[#1c1567] transition-all duration-200 ease-in-out w-[90%] md:w-[6dvw] py-1 rounded-md text-sm cursor-pointer">RECEIVE</button>
//                     </div>
  
//                   </div>
  
//                   <div id="container-balance" className="w-full flex items-center justify-between md:w-[48%] bg-gradient-to-r from-[#0D0D16] to-[#1F2029] shadow-2xl/30 p-8 lg:space-y-0 lg:py-10 lg:px-4 ">
                    
//                     <div className="h-full flex flex-col justify-center space-y-1">
//                       <p className="2xl:text-2xl">Total Balance</p>
//                       <p className="text-xs text-gray-400">My balance</p>
//                       <p className="2xl:text-3xl text-lg font-bold">{data?.balance.total}</p>
//                     </div>
                    
//                     <div className="h-full flex flex-col justify-end pb-10">
//                       <p className="text-xs">BTC</p>
//                       <p className="text-xs">{data?.balance.valueBTC}</p>
//                     </div>
  
//                   </div>
  
//                 </div>

//                 <div id="container-chart" 
//                   className="w-full my-20 min-h-[180px] md:min-h-[200px] lg:h-[28dvh] p-3 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-4">
//                   <div className="w-full p-4 md:p-6 bg-gradient-to-br from-[#0D0D16] to-[#1F2029] shadow-2xl/30 relative">
//                     <div className="absolute top-2 right-10 flex space-x-8">
//                       <div>
//                         <p className="text-xs text-gray-500 text-right">Last price</p>
//                         <p className="text-sm"><strong>469,000.00</strong></p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500 text-right">24h refuse</p>
//                         <p className="text-sm"><strong>39,43 BTC</strong></p>
//                       </div>
//                     </div>
//                     {renderChart()}
//                   </div>
//                 </div>
  
//                 <div id="container-marketing-values" 
//                   className="w-full p-3 md:p-6 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0 md:space-x-4">
//                   <div className="w-full px-6 py-4 flex flex-col justify-start items-center bg-[#191A23] border shadow-2xl/30">
                    
//                     <div className="w-full flex justify-between items-center mb-6">
//                       <p className="text-2xl"><strong>Marketing Values</strong></p>
//                     </div>
  
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Coin</TableHead>
//                           <TableHead>Rise</TableHead>
//                           <TableHead>%</TableHead>
//                           <TableHead>24 velve</TableHead>
//                           <TableHead>24 velve</TableHead>
//                           <TableHead className="text-center">Last 7 Days</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                           {
//                             data?.market_values.map((mv) => (
//                               <TableRow key={mv.coin}>
//                                 <TableCell className="flex items-center h-full">
//                                   <p className={`py-1 px-2 bg-[${mv.color}] text-black rounded-sm mr-2`}><strong>D</strong></p>
//                                   {mv.coin}
//                                 </TableCell>
//                                 <TableCell>{mv.rise}</TableCell>
//                                 <TableCell className={`text-[${mv.color}]`}>{mv.percent}</TableCell>
//                                 <TableCell>{mv.velve1}</TableCell>
//                                 <TableCell>{mv.velve2}</TableCell>
//                                 <TableCell className="flex justify-center">{mv.last7Days}</TableCell>
//                               </TableRow>
//                             ))
//                           }
//                       </TableBody>
//                     </Table>
  
  
//                   </div>
//                 </div>
  
//               </div>
  
//               <div id="right-container" className="w-full lg:w-[40%] mt-6 lg:mt-0 flex flex-col justify-center place-content-between">
//                 <div className="px-4 flex-grow flex flex-col justify-start">
                  
//                   <div className="flex w-full justify-around items-center mb-6">
//                     <button onClick={() => setModeActive('buy')} className={`
//                       w-[48%] py-2 rounded-full text-xs sm:text-sm md:text-base transition-all duration-200 ease-in-out
//                       ${modeActive === 'buy' ? 'bg-[#0F0E13] text-white' : 'text-gray-300 hover:bg-gray-500/80 hover:text-white'}`}>
//                       Buy
//                     </button>
//                     <button onClick={() => setModeActive('sell')} className={`
//                       w-[48%] py-2 rounded-full text-xs sm:text-sm md:text-base transition-all duration-200 ease-in-out
//                       ${modeActive === 'sell' ? 'bg-[#0F0E13] text-white' : 'text-gray-300 hover:bg-gray-500/80 hover:text-white'}`}>
//                       Sell
//                     </button>
//                   </div>
  
                  
//                   <div id="container-detoc-price" className="bg-[#131215] flex flex-col items-center justify-center py-10 px-8 mb-20 text-center relative">
                  
//                     <div className="space-y-2 mb-8 w-full">
//                       <div className="border rounded-md px-8 py-2 w-full">
//                         <p className="text-sm text-gray-400 w-full text-left">Detoc Price</p>
//                         <div className="flex items-center justify-start">
//                           <div className="rounded-full w-[15px] h-[15px] bg-[#FB8905]" />
//                           <p className="pl-2 text-md"><strong>Bitcoin</strong> BTC</p>
//                         </div>
//                       </div>
                    
//                       <div className="border rounded-md px-8 py-2 w-full">
//                         <p className="text-sm text-gray-400 w-full text-left">Detoc Price</p>
//                         <div className="flex items-center justify-start">
//                           <div className="rounded-full w-[15px] h-[15px] bg-[#FB8905]" />
//                           <p className="pl-2 text-md"><strong>Bitcoin</strong> BTC</p>
//                         </div>
//                       </div>
                    
//                       <div className="border rounded-md px-8 py-2 w-full">
//                         <p className="text-sm text-gray-400 w-full text-left">Detoc Price</p>
//                         <div className="flex items-center justify-start">
//                           <div className="rounded-full w-[15px] h-[15px] bg-[#FB8905]" />
//                           <p className="pl-2 text-md"><strong>Bitcoin</strong> BTC</p>
//                         </div>
//                       </div>
//                     </div>
  
//                     <button className="bg-[#0C018A] hover:bg-[#1c1567] transition-all duration-200 ease-in-out w-full py-3 text-xl rounded-lg cursor-pointer">Buy BTC</button>
  
//                     <div className="bg-black border border-white py-1 px-3 rounded-full absolute -bottom-5 -left-5">
//                       <p className="text-xs">$10k</p>
//                     </div>
  
//                   </div>
  
//                   <div id="container-futures" className="bg-[#131215] flex flex-col items-center justify-center py-5 px-6 text-center">
                    
//                     <div className="w-full flex justify-between items-center mb-6">
//                       <p className="text-2xl"><strong>Futures</strong></p>
//                       <p className="text-3xl"><strong>:</strong></p>
//                     </div>
  
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead className="">Prices (USDT)</TableHead>
//                           <TableHead className="text-right">Pros (USDT)</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {
//                           data?.futures.map((future) => (
//                             <TableRow key={future.price} className="space-y-2">
//                               <TableCell className="text-left">{future.price}</TableCell>
//                               <TableCell className="text-right flex justify-end"><div className={`w-[100px] pr-2 bg-[${future.color}]`}>{future.pros}</div></TableCell>
//                             </TableRow>    
//                           ))
//                         }
                      
//                       </TableBody>
//                     </Table>
  
//                   </div>
  
//                 </div>
//               </div>
  
//             </div>
//           </div>
//         </div>
//       </>
//   );
// }
import type React from "react";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { Search, ArrowUpRight, ArrowDownRight, Send, Wallet, BarChart3, Activity, Settings, Newspaper, Briefcase, X, Menu, Bell, User2, Clock, ArrowLeftRight, ExternalLink, BookOpen, MessageCircle, FileText } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ChartData = {
  name: string;
  Sent: number;
  Received: number;
  net: number;
};

type MarketValue = {
  name: string;
  value: string;
  change: string;
};

type FuturesData = {
  contract: string;
  price: string;
  change: string;
};

type NewsArticle = {
  title: string;
  source: string;
  date: string;
};

type Transaction = {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
};

type Balance = {
  total: number;
  available: number;
  locked: number;
};

type ApiResponse = {
  chart: ChartData[];
  market_values: MarketValue[];
  futures: FuturesData[];
  news: NewsArticle[];
  transactions: Transaction[];
  balance: Balance;
};

const mockData: ApiResponse = {
  "chart": [
    { "name": "Jan 15", "Sent": 120, "Received": 180, "net": 60 },
    { "name": "Feb 10", "Sent": 150, "Received": 120, "net": -30 },
    { "name": "Mar 20", "Sent": 90, "Received": 150, "net": 60 },
    { "name": "Apr 5", "Sent": 180, "Received": 90, "net": -90 },
    { "name": "May 12", "Sent": 120, "Received": 210, "net": 90 },
    { "name": "Jun 25", "Sent": 240, "Received": 180, "net": -60 },
    { "name": "Jul 1", "Sent": 110, "Received": 140, "net": 30 },
    { "name": "Aug 18", "Sent": 200, "Received": 160, "net": -40 },
    { "name": "Sep 22", "Sent": 130, "Received": 200, "net": 70 },
    { "name": "Oct 10", "Sent": 170, "Received": 130, "net": -40 },
    { "name": "Nov 5", "Sent": 140, "Received": 190, "net": 50 },
    { "name": "Dec 15", "Sent": 210, "Received": 150, "net": -60 }
  ],
  "market_values": [
    { "name": "BTC/USD", "value": "63,842", "change": "+1.2%" },
    { "name": "ETH/USD", "value": "3,127", "change": "+0.7%" },
    { "name": "BTC Dominance", "value": "56.2%", "change": "-0.3%" }
  ],
  "futures": [
    { "contract": "BTCUSDT_240628", "price": "64,200", "change": "+1.5%" },
    { "contract": "BTCUSDT_240930", "price": "64,500", "change": "+1.8%" },
    { "contract": "ETHUSDT_240628", "price": "3,150", "change": "+1.2%" }
  ],
  "news": [
    { "title": "Bitcoin breaks $64,000 as ETF inflows surge", "source": "CoinDesk", "date": "2025-01-05" },
    { "title": "Ethereum developers push back Dencun upgrade to Q2", "source": "The Block", "date": "2025-01-04" },
    { "title": "Crypto market cap hits $2.5 trillion as Bitcoin nears ATH", "source": "CoinMarketCap", "date": "2025-01-03" }
  ],
  "transactions": [
    { "id": "0x1234", "type": "buy", "amount": 0.5, "price": 63800, "timestamp": 1735689600 },
    { "id": "0x5678", "type": "sell", "amount": 0.2, "price": 64200, "timestamp": 1735689700 },
    { "id": "0x9012", "type": "buy", "amount": 0.3, "price": 63900, "timestamp": 1735689800 },
    { "id": "0x3456", "type": "sell", "amount": 0.1, "price": 64300, "timestamp": 1735689900 },
    { "id": "0x7890", "type": "buy", "amount": 0.4, "price": 64000, "timestamp": 1735690000 }
  ],
  "balance": {
    "total": 1.5,
    "available": 1.2,
    "locked": 0.3
  }
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
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export default function CryptoDashboard() {
  const { data, loading, error } = useFetchData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [activeNavItem, setActiveNavItem] = useState<string>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  const navigationItems = [
    { name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
    { name: 'Statistics', icon: <Activity className="w-5 h-5" /> },
    { name: 'Transactions', icon: <Activity className="w-5 h-5" /> },
    { name: 'Exchange', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { name: 'News', icon: <Newspaper className="w-5 h-5" /> },
    { name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const buySellCards = [
    {
      type: 'buy',
      icon: <ArrowUpRight className="w-6 h-6" />,
      title: 'Buy Bitcoin',
      subtitle: 'Current price: $63,842',
      buttonText: 'Buy Now',
      buttonVariant: 'outline' as const,
      cardVariant: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20' as const
    },
    {
      type: 'sell',
      icon: <ArrowDownRight className="w-6 h-6" />,
      title: 'Sell Bitcoin',
      subtitle: 'Current price: $63,842',
      buttonText: 'Sell Now',
      buttonVariant: 'outline' as const,
      cardVariant: 'bg-gradient-to-br from-red-500/20 to-rose-500/20' as const
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (data && data.news) {
      const filtered = data.news.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchTerm, data]);

  const renderChart = () => {
    if (!data) return null;

    const positiveColor = '#10b981';
    const negativeColor = '#ef4444';
    const neutralColor = '#6b7280';

    const processedData = data.chart.map(item => {
      const netColor = item.net > 0 ? positiveColor : item.net < 0 ? negativeColor : neutralColor;
      return { ...item, netColor };
    });

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartContainer
          config={{
            Sent: {
              label: 'Sent',
              color: '#6b7280',
            },
            Received: {
              label: 'Received',
              color: '#3b82f6',
            },
            net: {
              label: 'Net',
              // @ts-ignore
              color: (datum) => datum.netColor,
            },
          }}
          className="h-full w-full"
        >
          <AreaChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={positiveColor} stopOpacity={0.34} />
                <stop offset="95%" stopColor={positiveColor} stopOpacity={0.06} />
              </linearGradient>
              <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={negativeColor} stopOpacity={0.34} />
                <stop offset="95%" stopColor={negativeColor} stopOpacity={0.06} />
              </linearGradient>
              <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={neutralColor} stopOpacity={0.34} />
                <stop offset="95%" stopColor={neutralColor} stopOpacity={0.06} />
              </linearGradient>
              <filter id="shadow" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.23" />
              </filter>
            </defs>

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              width={40}
            />

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#374151"
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => {
                    if (name === 'net') {
                      // @ts-ignore
                      const color = value > 0 ? positiveColor : value < 0 ? negativeColor : neutralColor;
                      // @ts-ignore
                      return <span style={{ color }}>{`Net: ${value > 0 ? '+' : ''}${value}`}</span>;
                    }
                    return <span>{`${name}: ${value}`}</span>;
                  }}
                />
              }
            />

            <Area
              type="monotone"
              dataKey="Sent"
              stroke="#6b7280"
              strokeWidth={2}
              fillOpacity={0.2}
              fill="#6b7280"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#6b7280' }}
              dot={{ r: 4, strokeWidth: 0, fill: '#6b7280' }}
              name=" "
            />

            <Area
              type="monotone"
              dataKey="Received"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={0.2}
              fill="#3b82f6"
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
              dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
              name=" "
            />

            <Area
              type="monotone"
              dataKey="net"
              strokeWidth={0}
              fillOpacity={1}
              // @ts-ignore
              fill={(datum: { net: number; }) => datum.net > 0 ? 'url(#colorPositive)' : datum.net < 0 ? 'url(#colorNegative)' : 'url(#colorNeutral)'}
              name=" "
            />

            <Line
              type="monotone"
              dataKey="net"
              // @ts-ignore              
              stroke={(datum: { netColor: any; }) => datum.netColor}
              strokeWidth={2}
              dot={false}
              name=" "
            />

            <ChartLegend verticalAlign="top" height={36} content={<ChartLegendContent className="justify-end" />} />
          </AreaChart>
        </ChartContainer>
      </ResponsiveContainer>
    );
  };

  const renderFuturesTable = () => {
    if (!data) return null;

    return (
      <div className="rounded-xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contract</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody>
            {data.futures.map((future, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-slate-800/30' : ''}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200">{future.contract}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{future.price}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                    ${future.change.startsWith('+') 
                      ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' 
                      : 'bg-red-900/50 text-red-300 border border-red-700/50'
                    }`}>
                    {future.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMarketValuesTable = () => {
    if (!data) return null;

    return (
      <div className="rounded-xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pair</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody>
            {data.market_values.map((market, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-slate-800/30' : ''}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200">{market.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{market.value}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                    ${market.change.startsWith('+') 
                      ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' 
                      : 'bg-red-900/50 text-red-300 border border-red-700/50'
                    }`}>
                    {market.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderNewsSection = () => {
    if (!data) return null;

    return (
      <div className="space-y-4">
        {filteredNews.map((article, index) => (
          <a 
            key={index}
            href="#"
            className="block p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
          >
            <h3 className="text-base font-medium text-slate-200 hover:text-white transition-colors">
              {article.title}
            </h3>
            <div className="mt-2 flex items-center text-xs text-slate-400">
              <span className="flex items-center">
                <Newspaper className="w-3 h-3 mr-1" />
                {article.source}
              </span>
              <span className="ml-3 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {article.date}
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const renderSendReceiveActions = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button className="inline-flex items-center justify-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm">
          <Send className="w-4 h-4 mr-2" />
          Send
        </button>
        <button className="inline-flex items-center justify-center px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          Receive
        </button>
      </div>
    );
  };

  const renderBalanceCards = () => {
    if (!data) return null;

    const btcPrice = 63842;
    const btcBalance = data.balance.total;
    const usdBalance = btcBalance * btcPrice;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Total Balance</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {btcBalance.toFixed(4)} BTC
                </p>
                <p className="text-lg text-slate-400 font-medium mt-1">
                  ≈ ${usdBalance.toFixed(2)} USD
                </p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <Wallet className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Available Balance</p>
                <p className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {data.balance.available.toFixed(4)} BTC
                </p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <Wallet className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Locked Balance</p>
                <p className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {data.balance.locked.toFixed(4)} BTC
                </p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <Wallet className="w-5 h-5 text-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTransactionChart = () => {
    if (!data) return null;

    const transactionData = data.transactions.map(tx => ({
      type: tx.type,
      amount: tx.amount,
      price: tx.price,
      timestamp: new Date(tx.timestamp * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }));

    const chartConfig = {
      buy: {
        label: 'Buy',
        color: '#10b981',
      },
      sell: {
        label: 'Sell',
        color: '#ef4444',
      },
    };

    return (
      <div className="rounded-xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 overflow-hidden p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-4">Recent Transactions</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={transactionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.06} />
                  </linearGradient>
                  <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.06} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="timestamp"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, _props) => {
                        if (name === 'amount') {
                          return <span>{`Amount: ${value} BTC`}</span>;
                        }
                        if (name === 'price') {
                          return <span>{`Price: $${value}`}</span>;
                        }
                        return <span>{name}: {value}</span>;
                      }}
                    />
                  }
                />

                <Bar
                  dataKey="amount"
                  // @ts-ignore
                  fill={(data: { type: string; }) => data.type === 'buy' ? 'url(#colorBuy)' : 'url(#colorSell)'}
                  radius={[4, 4, 0, 0]}
                  name=" "
                >
                  {transactionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.type === 'buy' ? '#10b981' : '#ef4444'}
                      opacity={0.85}
                      style={{
                        filter: entry.type === 'buy'
                          ? 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3))'
                          : 'drop-shadow(0 4px 6px rgba(239, 68, 68, 0.3))'
                      }}
                    />
                  ))}
                </Bar>

                <Bar
                  dataKey="price"
                  // @ts-ignore
                  fill={(data: { type: string; }) => data.type === 'buy' ? 'url(#colorBuy)' : 'url(#colorSell)'}
                  radius={[4, 4, 0, 0]}
                  name=" "
                >
                  {transactionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.type === 'buy' ? '#059669' : '#b91c1c'}
                      opacity={0.85}
                      style={{
                        filter: entry.type === 'buy'
                          ? 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3))'
                          : 'drop-shadow(0 4px 6px rgba(239, 68, 68, 0.3))'
                      }}
                    />
                  ))}
                </Bar>

                <ChartLegend verticalAlign="top" height={36} content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => {
    if (!data) return null;

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Portfolio Balance
              </CardTitle>
              <CardDescription className="text-slate-400">
                Current market value of your holdings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    {data.balance.total.toFixed(4)}
                  </span>
                  <span className="ml-2 text-slate-400 font-medium">BTC</span>
                </div>
                <div className="text-lg text-slate-400 font-medium">
                  ≈ ${(data.balance.total * 63842).toFixed(2)} USD
                </div>
              </div>
              <div className="mt-4 h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={{
                      Received: {
                        label: 'Received',
                        color: '#3b82f6',
                      },
                      Sent: {
                        label: 'Sent',
                        color: '#6b7280',
                      },
                    }}
                    className="h-full w-full"
                  >
                    <LineChart data={data.chart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.34} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.06} />
                        </linearGradient>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6b7280" stopOpacity={0.34} />
                          <stop offset="95%" stopColor="#6b7280" stopOpacity={0.06} />
                        </linearGradient>
                      </defs>

                      <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />

                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name, props) => {
                              if (name === 'net') {
                                // @ts-ignore
                                const color = value > 0 ? '#10b981' : value < 0 ? '#ef4444' : '#6b7280';
                                // @ts-ignore
                                return <span style={{ color }}>{`Net: ${value > 0 ? '+' : ''}${value}`}</span>;
                              }
                              return <span>{`${name}: ${value}`}</span>;
                            }}
                          />
                        }
                      />

                      <Line
                        type="monotone"
                        dataKey="Received"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        name=" "
                      />

                      <Line
                        type="monotone"
                        dataKey="Sent"
                        stroke="#6b7280"
                        strokeWidth={2}
                        dot={false}
                        name=" "
                      />

                      <ChartLegend verticalAlign="top" height={36} content={<ChartLegendContent />} />
                    </LineChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Latest transactions and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.transactions.slice(0, 3).map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          transaction.type === 'buy'
                            ? 'bg-emerald-900/50 text-emerald-400'
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {transaction.type === 'buy' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200 capitalize">
                            {transaction.type} Bitcoin
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(transaction.timestamp * 1000).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.type === 'buy' 
                            ? 'text-emerald-400' 
                            : 'text-red-400'
                        }`}>
                          {transaction.type === 'buy' ? '+' : '-'} {transaction.amount} BTC
                        </p>
                        <p className="text-xs text-slate-400">
                          @ ${transaction.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Market Performance
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Bitcoin price movement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer
                      config={{
                        price: {
                          label: 'Price',
                          color: '#3b82f6',
                        },
                      }}
                      className="h-full w-full"
                    >
                      <LineChart data={data.chart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.34} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.06} />
                          </linearGradient>
                        </defs>

                        <XAxis
                          dataKey="name"
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />

                        <YAxis
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={[60000, 70000]}
                        />

                        <Tooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value, name, props) => {
                                if (name === 'price') {
                                  return <span>{`$${value}`}</span>;
                                }
                                return <span>{name}: {value}</span>;
                              }}
                            />
                          }
                        />

                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fill="url(#colorPrice)"
                          dot={false}
                          name=" "
                        />

                        <ChartLegend verticalAlign="top" height={36} content={<ChartLegendContent />} />
                      </LineChart>
                    </ChartContainer>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  };

  const renderTransactionsTab = () => {
    if (!data) return null;

    return (
      <div className="rounded-xl bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Transaction History</h3>
          
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center mb-2 sm:mb-0">
              <span className="text-sm text-slate-400 mr-2">Filter:</span>
              <button 
                className={`px-3 py-1 rounded-md mr-2 transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                All
              </button>
              <button 
                className={`px-3 py-1 rounded-md mr-2 transition-colors ${
                  activeTab === 'transactions' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setActiveTab('transactions')}
              >
                Buys
              </button>
              <button 
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Sells
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search transactions..."
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="px-3 py-2 bg-slate-700 border border-slate-700 rounded-r-md text-slate-300 hover:bg-slate-600 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((transaction, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-slate-800/30' : ''}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-emerald-400">
                      {transaction.id.substring(0, 6)}...{transaction.id.substring(transaction.id.length - 4)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                      {new Date(transaction.timestamp * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                        ${transaction.type === 'buy' 
                          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' 
                          : 'bg-red-900/50 text-red-300 border border-red-700/50'
                        }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                      {transaction.amount} BTC
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                      ${transaction.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-200">
                      ${(transaction.amount * transaction.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-slate-400">
              Showing 1 to {data.transactions.length} of {data.transactions.length} entries
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-2 bg-emerald-600 text-white rounded-md transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="flex min-h-screen bg-slate-900">
        {/* Sidebar */}
        <div className={`hidden md:block w-64 bg-slate-900/80 backdrop-blur-lg border-r border-slate-700/50 py-6`}>
          <div className="flex flex-col h-full">
            <div className="px-6 mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Crypto Dashboard
              </h1>
            </div>
            
            <div className="px-4 mb-6">
              <div className="flex items-center px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mr-3">
                  <User2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">John Doe</p>
                  <p className="text-xs text-slate-400">john@example.com</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveNavItem(item.name)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeNavItem === item.name 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-center w-5 h-5 mr-3">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </nav>
            
            <div className="px-4 pt-6 border-t border-slate-700/50">
              <button className="w-full flex items-center px-4 py-3 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700/50 backdrop-blur-lg text-white hover:bg-slate-700/50 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Mobile */}
        {isSidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-slate-900/90 backdrop-blur-lg z-40 w-64 p-6">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Crypto Dashboard
                </h1>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center mr-3">
                    <User2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">John Doe</p>
                    <p className="text-xs text-slate-400">john@example.com</p>
                  </div>
                </div>
              </div>
              
              <nav className="flex-1 space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveNavItem(item.name);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeNavItem === item.name 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-5 h-5 mr-3">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>
              
              <div className="pt-6 border-t border-slate-700/50">
                <button className="w-full flex items-center px-4 py-3 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition-colors">
                  <Settings className="w-5 h-5 mr-3" />
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="relative w-full max-w-xl">
                  <input
                    type="text"
                    placeholder="Search news, articles..."
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2.5 text-slate-400 w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-300 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center text-sm text-slate-400">
              <span className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Dashboard
              </span>
              <span className="mx-2">/</span>
              <span>Overview</span>
            </div>

            {/* Stats Cards */}
            {renderBalanceCards()}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Chart Card */}
                <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Transaction Flow
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Sent and Received Transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderChart()}
                  </CardContent>
                </Card>

                {/* Market Values and Futures Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Market Values Card */}
                  <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Market Values
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Current market prices
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderMarketValuesTable()}
                    </CardContent>
                  </Card>

                  {/* Futures Card */}
                  <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Futures Contracts
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Perpetual and expiry contracts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderFuturesTable()}
                    </CardContent>
                  </Card>
                </div>

                {/* News Section */}
                <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Newspaper className="w-4 h-4 mr-2" />
                      Latest News
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Crypto market updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderNewsSection()}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Buy/Sell Cards */}
                {buySellCards.map((card, index) => (
                  <Card key={index} className={`${card.cardVariant} backdrop-blur-lg border-slate-700/50 overflow-hidden`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${card.type === 'buy' ? 'bg-emerald-500/20' : 'bg-red-500/20'} mr-3`}>
                            {card.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{card.title}</p>
                            <p className="text-xs text-slate-400">{card.subtitle}</p>
                          </div>
                        </div>
                      </div>
                      <button className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors font-medium text-sm
                        ${card.type === 'buy' 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}>
                        {card.buttonText}
                      </button>
                    </CardContent>
                  </Card>
                ))}

                {/* Additional Resources Section */}
                <Card className="bg-slate-800/50 backdrop-blur-lg border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Additional Resources
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Useful links and information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <a 
                        href="#" 
                        className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Documentation</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Support</span>
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Terms of Service</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Zod Schema
// export const Schema = {
//     "commentary": "I will create a dark‑mode crypto control panel that includes a top search bar for crypto news, a left sidebar for navigation, and various interactive elements such as a large candlestick chart, a compact “marketing values” table, a futures mini‑board, and Buy / Sell cards on the right.",
//     "template": "nextjs-developer",
//     "title": "Crypto Dashboard",
//     "description": "A dark‑mode crypto control panel with navigation, charts, and interactive elements.",
//     "additional_dependencies": [
//         "lucide-react",
//         "recharts"
//     ],
//     "has_additional_dependencies": true,
//     "install_dependencies_command": "npm install lucide-react recharts",
//     "port": 3000,
//     "file_path": "pages/index.tsx",
//     "code": "<see code above>"
// }
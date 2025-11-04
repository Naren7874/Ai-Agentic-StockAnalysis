// src/pages/Analysis.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Plot from "react-plotly.js";
import {
  RefreshCcw,
  DollarSign,
  Activity,
  BarChart2,
  Hash,
  Percent,
  BookOpen,
  FileText,
  BarChart,
} from "lucide-react";

// If you have a real AuthContext in your app, import it instead of using the inline mock below.
// Example: import { useAuth } from "@/context/AuthContext";
const AuthContext = createContext(null);
const useAuth = () => {
  // prefer a real context when present; fall back to a harmless mock for demo/testing
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return { user: { uid: "mock-user-123", email: "mock@example.com" } };
  }
  return ctx;
};

// Small styled card wrapper (keeps same visual intent)
const StyledCard = ({ title, children, icon: Icon, className = "" }) => (
  <div
    className={`bg-gray-800/70 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-lg shadow-xl transition-all duration-300 hover:border-gray-600 ${className}`}
  >
    {title && (
      <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
        {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
    )}
    <div className="h-full">{children}</div>
  </div>
);

// Defensive Chart wrapper using Plotly
const Chart = ({ title, data, type = "bar" }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <StyledCard title={title} icon={BarChart}>
        <p className="text-gray-500 italic flex items-center justify-center h-full">
          Chart data is unavailable or empty.
        </p>
      </StyledCard>
    );
  }

  // ensure x/y arrays exist for Plot
  const x = data.map((d) => d.x ?? null);
  const y = data.map((d) => (typeof d.y === "number" ? d.y : null));

  return (
    <StyledCard title={title} icon={BarChart}>
      <Plot
        data={[
          {
            x,
            y,
            type,
            marker: { color: "#6366f1" },
            hoverinfo: "x+y",
          },
        ]}
        layout={{
          title: "",
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "white" },
          xaxis: { gridcolor: "#4b5563" },
          yaxis: { gridcolor: "#4b5563", title: "Value (INR)" },
          height: 300,
          margin: { l: 70, r: 20, t: 20, b: 50 },
        }}
        style={{ width: "100%", height: "100%" }}
        config={{ displayModeBar: false, responsive: true }}
      />
    </StyledCard>
  );
};

const FinancialAnalysisContent = ({
  data,
  ticker,
  loading,
  normalizedIncomeStatement,
  normalizedBalanceSheet,
  normalizedCashFlow,
  revenueChartData,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCcw className="animate-spin w-8 h-8 mr-3 text-indigo-400" />
        <span className="text-xl text-gray-300">Loading Financial Data...</span>
      </div>
    );
  }

  if (!data || !data.ratios) {
    return (
      <StyledCard title="Error" icon={Activity}>
        <div className="text-center text-red-400">
          <p className="text-lg font-semibold">
            Financial data structure is invalid or empty.
          </p>
          <p>Unable to render analysis.</p>
        </div>
      </StyledCard>
    );
  }

  const formatValue = (key, value) => {
    if (value === null || typeof value === "undefined") return "N/A";
    if (typeof value !== "number") return String(value);
    // percent-like keys
    const keyLower = key.toLowerCase();
    if (
      keyLower.includes("growth") ||
      keyLower.includes("margin") ||
      keyLower.includes("ratio") ||
      keyLower.includes("roe") ||
      keyLower.includes("roa")
    ) {
      return `${(value * 100).toFixed(2)}%`;
    }
    if (Math.abs(value) > 10000000)
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (Math.abs(value) > 100000) return `₹${(value / 100000).toFixed(2)} L`;
    if (Math.abs(value) > 1000) return `₹${value.toFixed(2)}`;
    return `₹${value.toFixed(2)}`;
  };

  const renderDataTable = (title, dataArray, icon) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return (
        <StyledCard title={title} icon={icon}>
          <p className="text-gray-400">No {title} data available.</p>
        </StyledCard>
      );
    }
    if (typeof dataArray[0] !== "object" || dataArray[0] === null) {
      return (
        <StyledCard title={title} icon={icon}>
          <p className="text-gray-400">No structured {title} data available.</p>
        </StyledCard>
      );
    }

    const headers = Object.keys(dataArray[0]);

    return (
      <StyledCard title={title} icon={icon}>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900/50 sticky top-0">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider"
                  >
                    {header
                      .replace(/_/g, " ")
                      .replace(/([A-Z])/g, " $1")
                      .trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {dataArray.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-700/50 transition duration-150"
                >
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 font-mono"
                    >
                      {formatValue(header, row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StyledCard>
    );
  };

  const allRatios = {
    "Price To Earnings Ratio": data.ratios?.priceToEarningsRatio,
    "Price To Book Ratio": data.ratios?.priceToBookRatio,
    "Debt To Equity Ratio": data.ratios?.debtToEquityRatio,
    "Revenue Growth (YoY)": data.revenue_growth,
    "Net Income Growth (YoY)": data.net_income_growth,
    "EPS Growth (YoY)": data.eps_growth,
    "Operating Margin": data.operating_margin,
    "Return on Equity (ROE)": data.ratios?.returnOnEquity,
  };

  const otherFundamentals = {
    "Market Cap": data.other_fundamentals?.marketCap,
    "Current Price": data.other_fundamentals?.currentPrice,
    "52 Week High": data.other_fundamentals?.fiftyTwoWeekHigh,
    "52 Week Low": data.other_fundamentals?.fiftyTwoWeekLow,
    "Dividend Yield": data.other_fundamentals?.dividendYield,
  };

  const renderKeyValues = (dataObj) => (
    <dl className="space-y-2">
      {Object.entries(dataObj).map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between border-b border-gray-700/50 last:border-b-0 py-1.5"
        >
          <dt className="text-sm text-gray-300">{key}:</dt>
          <dd
            className={`text-sm font-mono ${
              typeof value === "number" && value < 0
                ? "text-red-400"
                : "text-green-300"
            }`}
          >
            {formatValue(key, value)}
          </dd>
        </div>
      ))}
    </dl>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-indigo-400 border-b border-gray-700 pb-4">
        Fundamental Overview: {ticker}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StyledCard title="Key Financial Ratios & Growth" icon={Percent}>
          {renderKeyValues(allRatios)}
        </StyledCard>

        <StyledCard title="Valuation & Market Data" icon={DollarSign}>
          {renderKeyValues(otherFundamentals)}
        </StyledCard>

        <StyledCard title="Balance Sheet Snapshot" icon={BookOpen}>
          {renderKeyValues({
            "Total Assets": data.balance_sheet_metrics?.totalAssets,
            "Total Debt": data.balance_sheet_metrics?.totalDebt,
            "Total Equity": data.balance_sheet_metrics?.totalEquity,
            "Cash & Equivalents":
              data.balance_sheet_metrics?.cashAndEquivalents,
          })}
        </StyledCard>
      </div>

      <StyledCard title="Annual Revenue Trend" icon={BarChart2}>
        <Chart title="" data={revenueChartData} type="bar" />
      </StyledCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderDataTable(
          "Income Statement (Annual)",
          normalizedIncomeStatement,
          FileText
        )}
        {renderDataTable(
          "Balance Sheet (Annual)",
          normalizedBalanceSheet,
          BookOpen
        )}
        <div className="lg:col-span-2">
          {renderDataTable(
            "Cash Flow Statement (Annual)",
            normalizedCashFlow,
            Hash
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Main Analysis Component ----------
const Analysis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const ticker = searchParams.get("ticker") || "TATAMOTORS.NS";
  const startDate = searchParams.get("start") || "2023-01-01";
  const endDate =
    searchParams.get("end") || new Date().toISOString().split("T")[0];

  const [analysisType, setAnalysisType] = useState("technical");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(true);

  const API_BASE = "/api/stocks";

  const fetchAnalysis = useCallback(
    async (type) => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const endpoint = type === "technical" ? "technical" : "financial";
        // build URL carefully so we don't accidentally create malformed URLs
        const urlBase = `${API_BASE}/${encodeURIComponent(
          ticker
        )}/${endpoint}/`;
        const query =
          type === "technical"
            ? `?start_date=${encodeURIComponent(
                startDate
              )}&end_date=${encodeURIComponent(endDate)}`
            : "";
        // small mocked delay for loader (optional)
        await new Promise((res) => setTimeout(res, 700));

        const response = await fetch(`${urlBase}${query}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${type} analysis data (Status: ${response.status})`
          );
        }
        const result = await response.json();
        if (result && result.error) {
          setError(result.error);
          return;
        }
        setData(result || {});
      } catch (err) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    },
    [ticker, startDate, endDate]
  );

  useEffect(() => {
    fetchAnalysis(analysisType);
  }, [analysisType, fetchAnalysis]);

  const toggleAnalysis = () =>
    setAnalysisType((prev) =>
      prev === "technical" ? "financial" : "technical"
    );

  // Plot helper builders (defensive - return empty arrays if missing)
  const buildCandlestick = (
    dates = [],
    open = [],
    high = [],
    low = [],
    close = [],
    xaxis = "x",
    yaxis = "y"
  ) => ({
    type: "candlestick",
    x: dates,
    open,
    high,
    low,
    close,
    name: "Candlestick",
    increasing: { line: { color: "#10b981" } },
    decreasing: { line: { color: "#ef4444" } },
    xaxis,
    yaxis,
  });
  const buildLine = (
    dates = [],
    y = [],
    name = "",
    color = "#fff",
    dash = "solid",
    width = 2,
    xaxis = "x",
    yaxis = "y"
  ) => ({
    type: "scatter",
    x: dates,
    y,
    mode: "lines",
    line: { color, dash, width },
    name,
    xaxis,
    yaxis,
  });
  const buildBar = (
    dates = [],
    y = [],
    name = "",
    color = "gray",
    opacity = 1,
    xaxis = "x",
    yaxis = "y"
  ) => ({
    type: "bar",
    x: dates,
    y,
    name,
    marker: { color, opacity },
    xaxis,
    yaxis,
  });
  const buildFeatureImportance = (features = {}) => {
    const entries = Object.entries(features || {});
    if (entries.length === 0) return { data: [], layout: {} };
    const sorted = entries
      .sort(([, a], [, b]) => b - a)
      .map(([name, imp]) => ({ name, imp }));
    const y = sorted.map((s) => s.name);
    const x = sorted.map((s) => s.imp);
    return {
      data: [
        {
          type: "bar",
          orientation: "h",
          x,
          y,
          text: x.map((v) => (typeof v === "number" ? v.toFixed(3) : v)),
          textposition: "outside",
          marker: { color: "#6366f1" },
        },
      ],
      layout: {
        title: "Model Feature Importance",
        xaxis: { title: "Importance Score" },
        yaxis: { title: "Features" },
        height: 400,
        template: "plotly_dark",
      },
    };
  };
  const buildConfusionMatrix = (
    matrix = [
      [0, 0],
      [0, 0],
    ]
  ) => ({
    data: [
      {
        type: "heatmap",
        z: matrix,
        x: ["Predicted 0", "Predicted 1"],
        y: ["Actual 0", "Actual 1"],
        colorscale: "Blues",
        text: matrix.map((row) => row.map((cell) => String(cell))),
        texttemplate: "%{text}",
        hoverongaps: false,
      },
    ],
    layout: {
      title: "Prediction Confusion Matrix",
      xaxis: { title: "Predicted Label" },
      yaxis: { title: "Actual Label" },
      height: 400,
      template: "plotly_dark",
    },
  });

  const renderFig1 = (priceData = {}) => {
    const dates = priceData.dates || [];
    const candlestick = buildCandlestick(
      dates,
      priceData.open || [],
      priceData.high || [],
      priceData.low || [],
      priceData.close || [],
      "x",
      "y"
    );
    const support = buildLine(
      dates,
      priceData.support || [],
      "Support Zone",
      "#10b981",
      "dash",
      2,
      "x",
      "y"
    );
    const resistance = buildLine(
      dates,
      priceData.resistance || [],
      "Resistance Zone",
      "#ef4444",
      "dash",
      2,
      "x",
      "y"
    );
    const volume = buildBar(
      dates,
      priceData.volume || [],
      "Volume",
      "#6b7280",
      1,
      "x2",
      "y2"
    );
    const layout = {
      title: `${ticker} Price Action: Support & Resistance Zones`,
      grid: { rows: 2, columns: 1, pattern: "independent" },
      xaxis: { title: "Date", domain: [0, 1] },
      yaxis: { title: "Price", domain: [0.3, 1] },
      xaxis2: { title: "Date", domain: [0, 1], anchor: "y2" },
      yaxis2: { title: "Volume", domain: [0, 0.25] },
      height: 600,
      showlegend: true,
      template: "plotly_dark",
      xaxis_rangeslider_visible: false,
    };
    return { data: [candlestick, support, resistance, volume], layout };
  };

  const renderFig2 = (priceData = {}, macdData = {}) => {
    const dates = priceData.dates || [];
    const candlestick = buildCandlestick(
      dates,
      priceData.open || [],
      priceData.high || [],
      priceData.low || [],
      priceData.close || [],
      "x",
      "y"
    );
    const ema14 = buildLine(
      dates,
      priceData.ema14 || [],
      "EMA 14-day",
      "#3b82f6"
    );
    const ema50 = buildLine(
      dates,
      priceData.ema50 || [],
      "EMA 50-day",
      "#f97316"
    );
    const bbUpper = buildLine(
      dates,
      priceData.bb_upper || [],
      "Bollinger Upper",
      "#a855f7"
    );
    const bbLower = buildLine(
      dates,
      priceData.bb_lower || [],
      "Bollinger Lower",
      "#a855f7"
    );
    const volume = buildBar(
      dates,
      priceData.volume || [],
      "Volume",
      "#6b7280",
      1,
      "x2",
      "y2"
    );
    const macdDates = macdData.dates || [];
    const macdLine = buildLine(
      macdDates,
      macdData.macd || [],
      "MACD",
      "#ef4444"
    );
    const signalLine = buildLine(
      macdDates,
      macdData.signal || [],
      "Signal",
      "#10b981"
    );
    const hist = buildBar(
      macdDates,
      macdData.histogram || [],
      "Histogram",
      "#6b7280",
      0.5,
      "x3",
      "y3"
    );
    const traces = [
      candlestick,
      ema14,
      ema50,
      bbUpper,
      bbLower,
      volume,
      macdLine,
      signalLine,
      hist,
    ];
    const layout = {
      title: `${ticker} Technical Overlay: EMAs, Bollinger Bands & MACD`,
      xaxis: { title: "Date", domain: [0, 1] },
      xaxis2: { matches: "x", showticklabels: false },
      xaxis3: { matches: "x", showticklabels: true },
      yaxis: { title: "Price (INR)", domain: [0.5, 1] },
      yaxis2: { title: "Volume", domain: [0.25, 0.45] },
      yaxis3: { title: "MACD", domain: [0, 0.2] },
      height: 800,
      showlegend: true,
      template: "plotly_dark",
      xaxis_rangeslider_visible: false,
    };
    return { data: traces, layout };
  };

  const renderRSI = (rsiData = { dates: [], values: [] }) => {
    const dates = rsiData.dates || [];
    const rsiTrace = buildLine(dates, rsiData.values || [], "RSI", "#a855f7");
    const layout = {
      title: `${ticker} Relative Strength Index (RSI)`,
      xaxis: { title: "Date" },
      yaxis: { title: "RSI Value", range: [0, 100] },
      height: 400,
      shapes: [],
      template: "plotly_dark",
    };
    // Add shapes only when dates exist
    if (dates.length > 0) {
      layout.shapes = [
        {
          type: "rect",
          x0: dates[0],
          x1: dates[dates.length - 1],
          y0: 70,
          y1: 100,
          fillcolor: "red",
          opacity: 0.1,
          line_width: 0,
        },
        {
          type: "rect",
          x0: dates[0],
          x1: dates[dates.length - 1],
          y0: 0,
          y1: 30,
          fillcolor: "green",
          opacity: 0.1,
          line_width: 0,
        },
        {
          type: "line",
          x0: dates[0],
          y0: 70,
          x1: dates[dates.length - 1],
          y1: 70,
          line: { color: "red", dash: "dash" },
        },
        {
          type: "line",
          x0: dates[0],
          y0: 30,
          x1: dates[dates.length - 1],
          y1: 30,
          line: { color: "green", dash: "dash" },
        },
      ];
    }
    return { data: [rsiTrace], layout };
  };

  const renderADX = (adxData = { dates: [], values: [] }) => {
    const dates = adxData.dates || [];
    const adxTrace = buildLine(dates, adxData.values || [], "ADX", "#3b82f6");
    const layout = {
      title: `${ticker} Average Directional Index (ADX)`,
      xaxis: { title: "Date" },
      yaxis: { title: "ADX Value" },
      height: 400,
      shapes: [],
      template: "plotly_dark",
    };
    if (dates.length > 0) {
      layout.shapes = [
        {
          type: "rect",
          x0: dates[0],
          x1: dates[dates.length - 1],
          y0: 25,
          y1: 100,
          fillcolor: "orange",
          opacity: 0.1,
          line_width: 0,
        },
        {
          type: "line",
          x0: dates[0],
          y0: 25,
          x1: dates[dates.length - 1],
          y1: 25,
          line: { color: "orange", dash: "dash" },
        },
      ];
    }
    return { data: [adxTrace], layout };
  };

  const renderGenericPlot = (
    plotObj = { data: [], layout: {} },
    height = 600,
    legend = []
  ) => (
    <StyledCard>
      <Plot
        data={Array.isArray(plotObj.data) ? plotObj.data : []}
        layout={{
          ...(plotObj.layout || {}),
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "white" },
        }}
        style={{ width: "100%", height }}
        config={{
          displayModeBar: true,
          modeBarColor: "#374151",
          responsive: true,
        }}
      />
      {Array.isArray(legend) && legend.length > 0 && (
        <div className="text-sm text-gray-300 mt-4 border-t border-gray-700 pt-4">
          <strong>Legend:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {legend.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </StyledCard>
  );

  const renderTechnicalAnalysis = () => {
    if (!data || !data.price_data) {
      return (
        <p className="text-center py-10 text-lg">
          No Technical Data available to display plots.
        </p>
      );
    }

    const fig1Plot = renderFig1(data.price_data);
    const fig2Plot = renderFig2(data.price_data, data.macd_data || {});
    const rsiPlot = renderRSI(data.rsi_data || { dates: [], values: [] });
    const adxPlot = renderADX(data.adx_data || { dates: [], values: [] });
    const impData = buildFeatureImportance(data.feature_importance || {});
    const cmData = buildConfusionMatrix(
      data.confusion_matrix || [
        [0, 0],
        [0, 0],
      ]
    );

    const fig1Legend = [
      "Green Dashed Line: Support Zone (20-day minimum price)",
      "Red Dashed Line: Resistance Zone (20-day maximum price)",
      "Gray Bars: Volume",
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gray-800/70 border border-gray-700/50 rounded-2xl backdrop-blur-lg shadow-xl">
          <div
            className="flex justify-between items-center p-5 cursor-pointer"
            onClick={() => setAccordionOpen(!accordionOpen)}
          >
            <h3 className="text-xl font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-400" />
              Investment Signal Interpretation (Technical)
            </h3>
            <span className="text-2xl">{accordionOpen ? "−" : "+"}</span>
          </div>

          {accordionOpen && (
            <div className="p-6 border-t border-gray-700 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-300">
                    RSI
                  </h3>
                  <p>
                    <strong>Value:</strong> {(data.rsi_value ?? 0).toFixed(2)}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {(data.rsi_value ?? 50) > 70
                      ? "Overbought (> 70). Caution advised."
                      : (data.rsi_value ?? 50) < 30
                      ? "Oversold (< 30). Potential entry."
                      : "Neutral."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-300">
                    EMAs & MACD
                  </h3>
                  <p className="text-sm">
                    <strong>EMA_14:</strong> ₹{(data.ema14 ?? 0).toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>EMA_50:</strong> ₹{(data.ema50 ?? 0).toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>MACD:</strong> {(data.macd ?? 0).toFixed(2)}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-300">
                    Support & Resistance
                  </h3>
                  <p className="text-sm">
                    <strong>Support:</strong> ₹
                    {(data.last_support ?? 0).toFixed(2)} (
                    {(data.diff_support ?? 0).toFixed(2)}% from close)
                  </p>
                  <p className="text-sm">
                    <strong>Resistance:</strong> ₹
                    {(data.last_resistance ?? 0).toFixed(2)} (
                    {(data.diff_resistance ?? 0).toFixed(2)}% from close)
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-300">
                    Bollinger Bands
                  </h3>
                  <p className="text-sm">
                    <strong>Upper:</strong> ₹{(data.bb_upper ?? 0).toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Lower:</strong> ₹{(data.bb_lower ?? 0).toFixed(2)}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-300">
                    ADX
                  </h3>
                  <p>
                    <strong>Value:</strong> {(data.adx_value ?? 0).toFixed(2)}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {(data.adx_value ?? 0) > 25
                      ? "Strong trend."
                      : "Weak/No trend (< 25)."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-indigo-300">
                    Model Performance
                  </h3>
                  <p>
                    <strong>Accuracy:</strong>{" "}
                    {(data.model_accuracy ?? 0).toFixed(1)}%
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Key Indicators:</strong>{" "}
                    {data.key_indicators ?? "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-xl font-semibold mb-2">Overall Summary</h3>
                <p className="text-gray-200">
                  {data.recommendation ?? "No recommendation available."}
                </p>
              </div>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white">
          Technical Visualizations
        </h2>
        {renderGenericPlot(fig1Plot, 600, fig1Legend)}
        {renderGenericPlot(fig2Plot, 800, [])}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderGenericPlot(rsiPlot, 400, [])}
          {renderGenericPlot(adxPlot, 400, [])}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StyledCard>
            <Plot
              data={impData.data || []}
              layout={{
                ...(impData.layout || {}),
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                font: { color: "white" },
              }}
              style={{ width: "100%", height: 400 }}
              config={{ displayModeBar: false, responsive: true }}
            />
            <div className="text-sm text-gray-300 mt-2">
              <ul className="list-disc list-inside">
                <li>
                  Bars: Importance scores for each feature in the Random Forest
                  model
                </li>
              </ul>
            </div>
          </StyledCard>

          <StyledCard>
            <Plot
              data={cmData.data || []}
              layout={{
                ...(cmData.layout || {}),
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
                font: { color: "white" },
              }}
              style={{ width: "100%", height: 400 }}
              config={{ displayModeBar: false, responsive: true }}
            />
            <div className="text-sm text-gray-300 mt-2">
              <ul className="list-disc list-inside">
                <li>Confusion matrix for model predictions</li>
              </ul>
            </div>
          </StyledCard>
        </div>
      </div>
    );
  };

  // Loading / Error screens
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center">
          <RefreshCcw className="animate-spin w-6 h-6 mr-3" />
          Analyzing {ticker} ({analysisType})...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <StyledCard
          title="Error Fetching Data"
          icon={Activity}
          className="w-full max-w-lg"
        >
          <div className="text-center text-red-400">
            <h2 className="text-lg font-semibold mb-4">
              Could not load {analysisType} analysis.
            </h2>
            <p className="text-red-300 mb-6 font-mono bg-gray-900 p-3 rounded-lg">
              {error}
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition"
            >
              Back to Home
            </button>
          </div>
        </StyledCard>
      </div>
    );
  }

  const buttonText =
    analysisType === "technical"
      ? "Switch to Financial Analysis"
      : "Switch to Technical Analysis";
  const buttonIcon = analysisType === "technical" ? DollarSign : Activity;

  const normalizeStatementData = (statementObject) => {
    if (
      !statementObject ||
      typeof statementObject !== "object" ||
      Object.keys(statementObject).length === 0
    ) {
      return { tableData: [], revenueChartData: [] };
    }
    const dates = Object.keys(statementObject).sort().reverse();
    const tableData = dates.map((date) => ({
      Period: date.split(" ")[0],
      ...(statementObject[date] || {}),
    }));
    const chronologicalDates = dates.slice().reverse();
    const revenueChartData = chronologicalDates.map((date) => ({
      x: date.split(" ")[0],
      y: (statementObject[date] && statementObject[date]["Total Revenue"]) ?? 0,
    }));
    return { tableData, revenueChartData };
  };

  const incomeData = normalizeStatementData(data?.income_statement ?? {});
  const balanceData = normalizeStatementData(data?.balance_sheet ?? {});
  const cashflowData = normalizeStatementData(data?.cash_flow ?? {});

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#4f46e5 0.5px, transparent 0.5px)",
          backgroundSize: "15px 15px",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-700 pb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {analysisType === "technical"
                ? "Technical Analysis"
                : "Financial Analysis"}
            </h1>
            <p className="text-2xl font-light text-indigo-400">{ticker}</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={toggleAnalysis}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-150 shadow-md"
            >
              {React.createElement(buttonIcon, { className: "w-5 h-5 mr-2" })}
              {buttonText}
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition duration-150"
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className={loading ? "opacity-50 pointer-events-none" : ""}>
          {analysisType === "technical" ? (
            renderTechnicalAnalysis()
          ) : (
            <FinancialAnalysisContent
              data={data}
              ticker={ticker}
              loading={loading}
              normalizedIncomeStatement={incomeData.tableData}
              normalizedBalanceSheet={balanceData.tableData}
              normalizedCashFlow={cashflowData.tableData}
              revenueChartData={incomeData.revenueChartData}
            />
          )}
        </div>
      </div>
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-16 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              AI Stock Intelligence Platform
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advanced artificial intelligence meets professional trading
              analytics
            </p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-lg mb-2">
              Built with cutting-edge React, Tailwind CSS, and AI Technologies
            </p>
            <p className="text-sm text-gray-500">
              ⚠ For educational and research purposes only. Not financial
              advice. Trading involves risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Analysis;

import { useEffect, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { IOrder } from "@/types/orderTypes";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Pagination from "@/components/Pagination";
import { PulseLoader } from "react-spinners";
import { errorToast } from "@/utils/customToast";
import { AdminStatsService } from "@/services/admin/AdminStatsService";

const AdminSalesReport = () => {
  const [loading, setLoading] = useState(false);
  const [displaySalesReportData, setDisplaySalesReportData] = useState<
    IOrder[]
  >([]);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [dateRange, setDateRange] = useState("full-report"); // Default to daily
  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [salesReportData, setSalesReportData] = useState<IOrder[]>([]);

  const handlePagination = (currentPageData: IOrder[]) => {
    setDisplaySalesReportData(currentPageData);
  };

  const getAllSalesReport = useCallback(async () => {
    setLoading(true);
    const res = await AdminStatsService.generateSalesReport({ dateRange });
    if (res.success) {
      setSalesReportData(res.data);
    }
    setLoading(false);
  }, [dateRange]);

  const downloadExcel = () => {
    const title = "Sales Report";
    const headers = [
      "Order ID",
      "Customer Name",
      "Order Amount",
      "Payment",
      "Coupons",
      "Order Date",
      "Status",
    ];

    // Prepare data similar to the PDF version
    const data = salesReportData!.map((order) => [
      order._id,
      order.user.username?.toUpperCase(),
      order.totalAmount.toFixed(0),
      order.paymentMethod.toUpperCase(),
      order.couponDiscount > 0 ? order.couponDiscount : "No Coupon",
      new Date(order.orderDate).toDateString(),
      order.status,
    ]);

    // Add headers as the first row in the data array
    const worksheetData = [headers, ...data];

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Define column widths
    worksheet["!cols"] = [
      { wch: 15 }, // Width for "Order ID" column
      { wch: 20 }, // Width for "Customer Name" column
      { wch: 15 }, // Width for "Order Amount" column
      { wch: 18 }, // Width for "Payment" column
      { wch: 15 }, // Width for "Coupons" column
      { wch: 20 }, // Width for "Order Date" column
      { wch: 15 }, // Width for "Status" column
    ];

    // Append worksheet to workbook with the title "Sales Report"
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    // Download the Excel file with a specified filename
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const title = "Sales Report";
    const headers = [
      [
        "Order ID",
        "Customer Name",
        "Order Amount",
        "Payment",
        "Coupons",
        "Order Date",
        "Status",
      ],
    ];

    const data = salesReportData!.map((order) => [
      order._id,
      order.user.username?.toUpperCase(),
      order.totalAmount.toFixed(0),
      order.paymentMethod.toUpperCase(),
      order.couponDiscount > 0 ? order.couponDiscount.toFixed(0) : "No Coupon",
      new Date(order.orderDate).toDateString(),
      order.status,
    ]);

    doc.text(title, 14, 20);

    // Add overall stats above the table
    doc.setFontSize(10);
    doc.text(`Overall Discount: ${totalDiscount.toFixed(2)}`, 14, 30);
    doc.text(`Overall Sales Count: ${salesCount}`, 14, 35);
    doc.text(`Overall Order Amount: ${totalOrderAmount.toFixed(0)}`, 14, 40);

    // Add the table below the stats
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 50, // Adjust starting Y to leave space for stats
      theme: "grid", // Basic grid style
      styles: {
        cellPadding: 3, // Padding for cells
        fontSize: 10,
        halign: "center", // Font size for table
      },
      headStyles: {
        fillColor: [100, 100, 255], // Light blue background for header
        textColor: [255, 255, 255], // White text for header
        fontSize: 12,
        halign: "center", // Center align header text
      },
    });

    // Save the PDF
    doc.save("sales_report.pdf");
  };

  const generateSalesReport = async () => {
    const currentDate = new Date();
    if (dateRange === "custom") {
      if (!customDates.startDate || !customDates.endDate) {
        errorToast("Date Fields are required");
        return;
      }
      if (
        new Date(customDates.startDate) > currentDate ||
        new Date(customDates.endDate) > currentDate
      ) {
        errorToast("Start date or end date cannot be in the future.");
        return;
      }
      if (new Date(customDates.startDate) > new Date(customDates.endDate)) {
        errorToast("End date should be greater than the start date");
        return;
      }
    }

    const payload = {
      dateRange,
      startDate: customDates.startDate,
      endDate: customDates.endDate,
    };

    setLoading(true);
    const res = await AdminStatsService.generateSalesReport(payload);
    if (res.success) {
      setSalesReportData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const totalOrderPrice =
      salesReportData &&
      salesReportData.reduce((acc, order) => {
        return acc + order.totalAmount;
      }, 0);

    if (totalOrderPrice) setTotalOrderAmount(totalOrderPrice);

    const totalCouponDiscount =
      salesReportData &&
      salesReportData.reduce((acc, order) => {
        return acc + order.couponDiscount;
      }, 0);

    if (totalCouponDiscount) setTotalDiscount(totalCouponDiscount);

    if (salesReportData) setSalesCount(salesReportData.length);
  }, [salesReportData]);

  useEffect(() => {
    getAllSalesReport();
  }, [getAllSalesReport]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-emerald-500/10 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-emerald-500" />
             <span className="text-emerald-500 tracking-[0.4em] uppercase text-[9px] font-bold">Financial Oversight</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tighter">Sales Intelligence</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
           <div className="flex items-center gap-3 pl-2">
             <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Frequency:</span>
             <select
               value={dateRange}
               onChange={(e) => setDateRange(e.target.value)}
               className="bg-[#0c1110] text-emerald-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-emerald-500/20 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
             >
               <option value="full-report">Full Spectrum</option>
               <option value="daily">Daily Arc</option>
               <option value="weekly">Weekly Cycle</option>
               <option value="monthly">Lunar Phase</option>
               <option value="yearly">Solar Year</option>
               <option value="custom">Manual Scope</option>
             </select>
           </div>
           
           {dateRange === "custom" && (
             <div className="flex items-center gap-2 px-2 border-l border-white/10">
               <input
                 type="date"
                 value={customDates.startDate}
                 onChange={(e) => setCustomDates(p => ({ ...p, startDate: e.target.value }))}
                 className="bg-transparent text-[10px] text-white font-mono uppercase focus:outline-none"
               />
               <span className="text-slate-600">/</span>
               <input
                 type="date"
                 value={customDates.endDate}
                 onChange={(e) => setCustomDates(p => ({ ...p, endDate: e.target.value }))}
                 className="bg-transparent text-[10px] text-white font-mono uppercase focus:outline-none"
               />
             </div>
           )}

           <button
             onClick={generateSalesReport}
             className="px-6 py-2 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-lg active:scale-95"
           >
             Execute
           </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group overflow-hidden bg-gradient-to-br from-[#0c1110] to-black border border-white/5 rounded-[32px] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/20">
           <div className="flex items-center justify-between mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                 <PulseLoader size={2} color="#10b981" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Unit Volume</span>
           </div>
           <p className="text-4xl font-mono font-bold text-white tracking-tighter">{salesCount}</p>
           <p className="text-[8px] uppercase tracking-widest text-emerald-500/60 font-bold mt-2">Total Executed Orders</p>
        </div>

        <div className="relative group overflow-hidden bg-gradient-to-br from-[#0c1110] to-black border border-white/5 rounded-[32px] p-8 shadow-2xl transition-all duration-500 hover:border-emerald-500/20">
           <div className="flex items-center justify-between mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                 <PulseLoader size={2} color="#3b82f6" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Gross Yield</span>
           </div>
           <p className="text-4xl font-mono font-bold text-white tracking-tighter">₹{totalOrderAmount.toLocaleString()}</p>
           <p className="text-[8px] uppercase tracking-widest text-blue-500/60 font-bold mt-2">Aggregate Value Post-Deduction</p>
        </div>

        <div className="relative group overflow-hidden bg-gradient-to-br from-[#0c1110] to-black border border-white/5 rounded-[32px] p-8 shadow-2xl transition-all duration-500 hover:border-orange-500/20">
           <div className="flex items-center justify-between mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                 <PulseLoader size={2} color="#f97316" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Incentive Loss</span>
           </div>
           <p className="text-4xl font-mono font-bold text-white tracking-tighter">₹{totalDiscount.toLocaleString()}</p>
           <p className="text-[8px] uppercase tracking-widest text-orange-500/60 font-bold mt-2">Total Promotional Variance</p>
        </div>
      </div>

      {/* Data Manifest */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                 <PulseLoader size={2} color="#10b981" />
              </div>
              <h2 className="text-xl font-serif text-white tracking-tight">Financial Registry</h2>
           </div>
           
           <div className="flex gap-3">
              <button 
                onClick={downloadPDF}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                PDF Export
              </button>
              <button 
                onClick={downloadExcel}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                Excel Export
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Signature</th>
                <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Operative</th>
                <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Yield</th>
                <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Protocol</th>
                <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Incentive</th>
                <th className="px-8 py-5 text-left text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">Timeline</th>
                <th className="px-8 py-5 text-right text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <PulseLoader color="#10b981" />
                    <p className="text-[9px] uppercase tracking-widest text-emerald-500/40 font-bold mt-4">Retrieving Data Stream...</p>
                  </td>
                </tr>
              ) : salesReportData?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center opacity-20">
                    <p className="text-[11px] uppercase tracking-[0.4em] font-bold">No variance detected in registry</p>
                  </td>
                </tr>
              ) : (
                (displaySalesReportData.length > 0 ? displaySalesReportData : salesReportData).map((order) => (
                  <tr key={order._id} className="group hover:bg-emerald-500/[0.02] transition-all duration-500">
                    <td className="px-8 py-6">
                       <p className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-tighter group-hover:text-emerald-500 transition-colors">#{order._id.slice(-8)}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-[12px] font-bold text-white uppercase tracking-widest">{order.user?.username}</p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-[14px] font-serif text-emerald-500 tracking-tighter">₹{order.totalAmount.toFixed(0)}</p>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-mono text-slate-500 uppercase">{order.paymentMethod}</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${order.couponDiscount > 0 ? 'text-emerald-500/60' : 'text-slate-700 font-normal italic'}`}>
                          {order.couponDiscount > 0 ? `-₹${order.couponDiscount.toFixed(0)}` : "None"}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-mono text-slate-500 uppercase">{new Date(order.orderDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
                          {order.status}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Pagination
          itemsPerPage={5}
          items={salesReportData!}
          onPageChange={handlePagination}
        />
      </div>
    </div>
  );
};

export default AdminSalesReport;

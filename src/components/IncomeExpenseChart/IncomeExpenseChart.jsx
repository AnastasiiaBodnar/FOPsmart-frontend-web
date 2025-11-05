import { useEffect, useRef } from "react";
import "./IncomeExpenseChart.css";

export default function IncomeExpenseLineChart({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = 280 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '280px';
    
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = 280;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 40, right: 40, bottom: 50, left: 70 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Aggregate by week if too many data points
    const chartData = data.length > 15 ? aggregateByWeek(data) : data;

    const maxIncome = Math.max(...chartData.map(d => d.income || 0));
    const maxExpense = Math.max(...chartData.map(d => d.expenses || 0));
    const maxValue = Math.max(maxIncome, maxExpense) * 1.1;

    if (maxValue === 0) {
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "16px Manrope";
      ctx.textAlign = "center";
      ctx.fillText("Немає даних для відображення", width / 2, height / 2);
      return;
    }

    // Background
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

    // Grid
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    const gridLines = 5;
    
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const value = maxValue - (maxValue / gridLines) * i;
      ctx.fillStyle = "#6B7280";
      ctx.font = "12px Manrope";
      ctx.textAlign = "right";
      ctx.fillText(formatCurrency(value), padding.left - 10, y + 4);
    }

    // Calculate points
    const points = chartData.map((item, index) => ({
      x: padding.left + (chartWidth / (chartData.length - 1)) * index,
      incomeY: padding.top + chartHeight - (item.income / maxValue) * chartHeight,
      expenseY: padding.top + chartHeight - (item.expenses / maxValue) * chartHeight,
      date: item.date
    }));

    // Draw area under income line
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartHeight);
    points.forEach(point => ctx.lineTo(point.x, point.incomeY));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();

    // Draw area under expense line
    ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartHeight);
    points.forEach(point => ctx.lineTo(point.x, point.expenseY));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();

    // Draw income line
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].incomeY);
    points.forEach(point => ctx.lineTo(point.x, point.incomeY));
    ctx.stroke();

    // Draw expense line
    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].expenseY);
    points.forEach(point => ctx.lineTo(point.x, point.expenseY));
    ctx.stroke();

    // Draw income dots
    points.forEach(point => {
      ctx.fillStyle = "#10B981";
      ctx.beginPath();
      ctx.arc(point.x, point.incomeY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw expense dots
    points.forEach(point => {
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.arc(point.x, point.expenseY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // X-axis labels
    const labelStep = Math.ceil(points.length / 10);
    ctx.fillStyle = "#6B7280";
    ctx.font = "11px Manrope";
    ctx.textAlign = "center";
    
    points.forEach((point, index) => {
      if (index % labelStep === 0 || index === points.length - 1) {
        const label = formatDate(point.date);
        ctx.fillText(label, point.x, height - padding.bottom + 20);
      }
    });

    // Legend
    const legendY = 15;
    const legendX = width - 180;
    
    ctx.fillStyle = "#10B981";
    ctx.fillRect(legendX, legendY, 20, 16);
    ctx.fillStyle = "#1F2937";
    ctx.font = "13px Manrope";
    ctx.textAlign = "left";
    ctx.fillText("Доходи", legendX + 28, legendY + 12);

    ctx.fillStyle = "#EF4444";
    ctx.fillRect(legendX + 90, legendY, 20, 16);
    ctx.fillText("Витрати", legendX + 118, legendY + 12);

  }, [data]);

  const aggregateByWeek = (data) => {
    const weeks = {};
    data.forEach(item => {
      const date = new Date(item.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { date: weekKey, income: 0, expenses: 0 };
      }
      
      weeks[weekKey].income += item.income || 0;
      weeks[weekKey].expenses += item.expenses || 0;
    });

    return Object.values(weeks).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return Math.round(value / 1000) + "K";
    return Math.round(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleDateString("uk-UA", { month: "short" })}`;
  };

  if (!data || data.length === 0) {
    return <div className="chart-empty">Немає даних для відображення графіку</div>;
  }

  return <canvas ref={canvasRef} className="income-expense-chart" />;
}
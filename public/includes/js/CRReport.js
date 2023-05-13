// Fetch data from backend
const data = [
    { month: "Dec", totalClients: 130, returningClients: 90 },
    { month: "Jan", totalClients: 110, returningClients: 50 },
    { month: "Feb", totalClients: 80, returningClients: 40 },
    { month: "Mar", totalClients: 100, returningClients: 60 },
    { month: "Apr", totalClients: 120, returningClients: 80 },
    { month: "May", totalClients: 90, returningClients: 50 }
  ];
  
  // Process data into chart format
  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: "Total Clients",
        data: data.map(d => d.totalClients),
        borderColor: "rgb(80, 47, 143)",
        fill: false,
        pointStyle: "rect",
        pointBackgroundColor: "rgb(80, 47, 143)"
      },
      {
        label: "Returning Clients",
        data: data.map(d => d.returningClients),
        borderColor: "rgb(255, 99, 132)",
        fill: false,
        pointStyle: "rect",
        pointBackgroundColor: "rgb(255, 99, 132)"
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    title: {
      display: true,
      text: "Client Retention Chart"
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Month"
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Number of Clients"
        },
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
        display: true,
        position: "bottom", // "top", "left", "right" are other options
        labels: {
          fontColor: "rgb(0, 0, 0)"
        }
      }
  };
  
  // Initialize chart
  const ctx = document.getElementById("chart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: chartData,
    options: chartOptions
  });

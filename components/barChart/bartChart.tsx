import React from "react"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
}

interface Props {
  reportData: any
  reportTitle: string
}

export function BarChart({ reportData, reportTitle }: Props) {
  options.plugins.title.text = reportTitle
  console.log(reportData)
  return <div>{reportData && <Bar options={options} data={reportData} />}</div>
}

import { z } from 'zod';
import { tool } from 'ai';

const generateChartParameters = z.object({
  chartType: z
    .enum(['bar', 'line', 'pie'])
    .describe('The type of chart to generate.'),
  data: z
    .array(
      z.object({
        label: z.string().describe('The label for a data point.'),
        value: z.number().describe('The value for a data point.'),
      }),
    )
    .describe('The data for the chart, as an array of objects.'),
  xAxis: z
    .string()
    .describe(
      "The key from the data objects to use for the X-axis. This must be 'label'.",
    ),
  yAxis: z
    .array(z.string())
    .describe(
      "The key(s) from the data objects to use for the Y-axis. This must be 'value'.",
    ),
  title: z.string().optional().describe('The title of the chart.'),
  description: z.string().optional().describe('A description of the chart.'),
});

export const generateChart = tool({
  description:
    'Generate a chart for data visualization using QuickChart. This returns a URL to a chart image and the chart data.',
  parameters: generateChartParameters,
  execute: async (args: z.infer<typeof generateChartParameters>) => {
    const { chartType, data, title, yAxis } = args;
    const chartConfig = {
      type: chartType,
      data: {
        labels: data.map(item => item.label),
        datasets: [
          {
            label: yAxis[0] || 'Value',
            data: data.map(item => item.value)
          }
        ]
      },
      options: {
        title: {
          display: !!title,
          text: title
        }
      }
    };

    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
    const url = `https://quickchart.io/chart?c=${encodedConfig}`;

    // This tool now returns a URL to the generated chart
    // and the original arguments for custom UI rendering.
    return { url, ...args };
  }
});

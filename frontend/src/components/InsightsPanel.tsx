interface InsightsPanelProps {
  insights: {
    trends?: string[]
    outliers?: string[]
    data_quality?: string[]
    recommendations?: string[]
  }
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const sections = [
    { title: 'Key Trends', data: insights.trends, color: 'blue' },
    { title: 'Outliers', data: insights.outliers, color: 'yellow' },
    { title: 'Data Quality', data: insights.data_quality, color: 'red' },
    { title: 'Recommendations', data: insights.recommendations, color: 'green' },
  ]

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      green: 'bg-green-50 border-green-200 text-green-800',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        section.data && section.data.length > 0 && (
          <div key={section.title} className={`border rounded-lg p-4 ${getColorClasses(section.color)}`}>
            <h3 className="font-semibold text-lg mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.data.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      ))}

      {!insights.trends?.length && !insights.outliers?.length && 
       !insights.data_quality?.length && !insights.recommendations?.length && (
        <div className="text-center text-gray-500 py-8">
          No insights generated yet
        </div>
      )}
    </div>
  )
}

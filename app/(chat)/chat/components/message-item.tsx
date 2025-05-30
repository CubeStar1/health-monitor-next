import ReactMarkdown from 'react-markdown'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Message } from '../types'

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  return (
    <div className="mb-4">
      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[100%] p-3 rounded-lg sm:max-w-[75%] md:max-w-[75%] lg:max-w-[50%] ${
          message.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
        }`}>
          {message.role === 'assistant' ? (
            <div className="overflow-hidden">
              <ReactMarkdown 
                className="prose prose-sm max-w-none break-words overflow-wrap-anywhere"
                components={{
                  p: ({node, ...props}) => <p className="mb-2" {...props} />,
                  pre: ({node, ...props}) => <pre className="overflow-x-auto" {...props} />,
                  code: ({node, ...props}) => <code className="text-xs" {...props} />
                }}
              >
                {message.content.split('[SQL_QUERY]')[0].trim()}
              </ReactMarkdown>
              {message.tabular_data && message.tabular_data.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2 w-full"
                    >
                      Show Results
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-auto p-4 gap-0">
                    <DialogHeader>
                      <DialogTitle>Query Results</DialogTitle>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(message.tabular_data[0]).map((key) => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {message.tabular_data.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {Object.values(row).map((value, cellIndex) => (
                              <TableCell key={cellIndex}>{value as string}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              )}
              {message.content.includes('[SQL_QUERY]') && (
                <div className="mt-2 p-2 bg-white rounded-md">
                  <strong>Executed Query:</strong>
                  <pre className="mt-1 p-2 bg-gray-200 rounded-md overflow-x-auto text-sm">
                    <code>{message.content.split('[SQL_QUERY]')[1].split('[/SQL_QUERY]')[0].trim()}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="break-words overflow-wrap-anywhere">{message.content}</div>
          )}
        </div>
      </div>
    </div>
  )
}
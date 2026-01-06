"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import err from "@/app/assets/lottiefiles/err.json";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, RefreshCw, AlertTriangle, Copy, Terminal, Monitor, Globe } from "lucide-react";

const ErrorPage = ({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset?: () => void 
}) => {
  const router = useRouter();
  const [diagnostics, setDiagnostics] = useState({
    timestamp: '',
    userAgent: '',
    url: '',
    viewport: '',
    online: true
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDiagnostics({
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      online: navigator.onLine
    });
  }, []);

  const getErrorType = (error: Error) => {
    if (error.message.includes('hydration')) return 'Hydration Mismatch';
    if (error.message.includes('network')) return 'Network Error';
    if (error.message.includes('timeout')) return 'Timeout Error';
    if (error.message.includes('auth')) return 'Authentication Error';
    return 'Application Error';
  };

  const copyDiagnostics = async () => {
    const diagnosticText = `
=== ERROR DIAGNOSTICS ===
Error Type: ${getErrorType(error)}
Message: ${error?.message || 'Unknown error'}
Digest: ${error?.digest || 'N/A'}
Timestamp: ${diagnostics.timestamp}
URL: ${diagnostics.url}
User Agent: ${diagnostics.userAgent}
Viewport: ${diagnostics.viewport}
Online: ${diagnostics.online}
    `.trim();

    try {
      await navigator.clipboard.writeText(diagnosticText);
      alert('Diagnostics copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen  from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900/20 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          {/* Lottie Animation */}
          <div className="max-w-md mx-auto mb-6">
            <Lottie 
              animationData={err} 
              loop={true}
              className="w-full h-40"
            />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {getErrorType(error)}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {error?.message || "We encountered an unexpected issue"}
          </p>
        </div>

        {/* Diagnostics Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Technical Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Error Type:</span>
                <span className="text-red-600 dark:text-red-400 font-medium ml-auto">
                  {getErrorType(error)}
                </span>
              </div>
              
              {error?.digest && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Error ID:</span>
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono ml-auto">
                    {error.digest}
                  </code>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Timestamp:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs ml-auto">
                  {new Date(diagnostics.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Online:</span>
                <span className={`font-medium ml-auto ${
                  diagnostics.online ? 'text-green-600' : 'text-red-600'
                }`}>
                  {diagnostics.online ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Viewport:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs ml-auto">
                  {diagnostics.viewport}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Browser:</span>
                <span className="text-gray-900 dark:text-white text-xs ml-auto truncate">
                  {diagnostics.userAgent.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error?.message && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                <code className="text-red-700 dark:text-red-300 text-sm break-all">
                  {error.message}
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset || (() => window.location.reload())}
            size="lg"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <Button
            onClick={() => router.push('/')}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>

          <Button
            onClick={copyDiagnostics}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Details
          </Button>
        </div>

        {/* Support Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this error persists, please contact support with the error details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
import React from 'react';
import { TextMetrics, ConstraintCheck, checkConstraints } from '../utils/localizationMetrics';

interface TextMetricsCardProps {
  text: string;
  label: string;
  metrics: TextMetrics;
  constraints?: { [key: string]: number };
  isSource?: boolean;
  className?: string;
}

export const TextMetricsCard: React.FC<TextMetricsCardProps> = ({
  text,
  label,
  metrics,
  constraints = {},
  isSource = false,
  className = ''
}) => {
  const constraintChecks = constraints ? checkConstraints(text, constraints) : [];

  const getExpansionColor = (rate: number) => {
    if (Math.abs(rate) < 10) return 'text-green-600';
    if (Math.abs(rate) < 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getExpansionIcon = (rate: number) => {
    if (rate > 10) return '📈'; // Expansion
    if (rate < -10) return '📉'; // Contraction
    return '📏'; // Neutral
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center">
          {isSource && <span className="text-blue-500 mr-2">🔤</span>}
          {metrics.isRTL && <span className="text-purple-500 mr-2" title="Right-to-Left script">↤</span>}
          {label}
        </h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {metrics.script}
        </span>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{metrics.characters}</div>
          <div className="text-xs text-gray-500">Characters</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{metrics.bytes}</div>
          <div className="text-xs text-gray-500">Bytes (UTF-8)</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{metrics.words}</div>
          <div className="text-xs text-gray-500">Words</div>
        </div>
      </div>

      {/* Expansion Rate (only for translations) */}
      {!isSource && metrics.expansionRate !== 0 && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Text Expansion</span>
            <span className={`text-sm font-semibold ${getExpansionColor(metrics.expansionRate)}`}>
              {getExpansionIcon(metrics.expansionRate)} {metrics.expansionRate > 0 ? '+' : ''}{metrics.expansionRate}%
            </span>
          </div>
        </div>
      )}

      {/* Constraint Checks */}
      {constraintChecks.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700 mb-2">Constraints</div>
          {constraintChecks.map((check, index) => (
            <div
              key={index}
              className={`flex items-center justify-between text-xs p-2 rounded ${
                check.severity === 'error'
                  ? 'bg-red-50 text-red-700'
                  : check.severity === 'warning'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              <span className="flex items-center">
                {check.severity === 'error' && '❌'}
                {check.severity === 'warning' && '⚠️'}
                {check.severity === 'info' && '✅'}
                <span className="ml-1">{check.type}</span>
              </span>
              <span className="font-mono">
                {check.current}/{check.limit}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Byte/Character Ratio Indicator */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Byte/Char Ratio</span>
          <span className="font-mono">
            {metrics.characters > 0 ? (metrics.bytes / metrics.characters).toFixed(1) : '0.0'}x
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {metrics.characters === 0 
            ? 'No text' 
            : metrics.bytes / metrics.characters > 2 
            ? 'Complex script (emoji/CJK)' 
            : metrics.bytes / metrics.characters > 1.5 
            ? 'Extended characters' 
            : 'Basic Latin script'}
        </div>
      </div>
    </div>
  );
};
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PredictionsPage() {
  const [destination, setDestination] = useState('orlando');
  const [dates, setDates] = useState('');
  
  const predictions = [
    { destination: 'Orlando', current: 289, predicted: 199, change: -31, when: '2 weeks', confidence: 94, recommendation: 'WAIT' },
    { destination: 'Las Vegas', current: 159, predicted: 129, change: -19, when: '10 days', confidence: 87, recommendation: 'WAIT' },
    { destination: 'Miami', current: 349, predicted: 399, change: 14, when: '1 week', confidence: 91, recommendation: 'BOOK NOW' },
    { destination: 'New York', current: 279, predicted: 249, change: -11, when: '3 weeks', confidence: 82, recommendation: 'WAIT' },
    { destination: 'Hawaii', current: 599, predicted: 449, change: -25, when: '1 month', confidence: 89, recommendation: 'WAIT' },
    { destination: 'Cancun', current: 199, predicted: 179, change: -10, when: '2 weeks', confidence: 85, recommendation: 'EITHER' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900">
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            CRAV<span className="text-yellow-400">Travel</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/deals" className="text-blue-200 hover:text-white">Deals</Link>
            <Link href="/alerts" className="text-blue-200 hover:text-white">Alerts</Link>
            <Link href="/predictions" className="text-yellow-400 font-medium">AI Predictions</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🤖 AI Price Predictions</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Our machine learning models analyze millions of data points to predict the best time to book.
          </p>
        </div>

        {/* Predictions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((pred, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{pred.destination}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  pred.recommendation === 'BOOK NOW' 
                    ? 'bg-green-500/20 text-green-400'
                    : pred.recommendation === 'WAIT'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {pred.recommendation}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-blue-200">Current Price</span>
                  <span className="text-white font-bold">${pred.current}/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Predicted Price</span>
                  <span className={`font-bold ${pred.change < 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${pred.predicted}/night
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Expected Change</span>
                  <span className={`font-bold ${pred.change < 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pred.change > 0 ? '+' : ''}{pred.change}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Best Time to Book</span>
                  <span className="text-yellow-400 font-bold">{pred.when}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-sm">AI Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${pred.confidence}%` }}
                      />
                    </div>
                    <span className="text-yellow-400 font-bold text-sm">{pred.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-16 bg-white/5 rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How Our AI Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-white mb-2">Data Collection</h3>
              <p className="text-blue-200 text-sm">We track prices from 100+ sources in real-time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="font-bold text-white mb-2">ML Analysis</h3>
              <p className="text-blue-200 text-sm">Neural networks analyze patterns and trends</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="font-bold text-white mb-2">Prediction</h3>
              <p className="text-blue-200 text-sm">Models predict future prices with 98% accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-white mb-2">You Save</h3>
              <p className="text-blue-200 text-sm">Book at the perfect time and save big</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

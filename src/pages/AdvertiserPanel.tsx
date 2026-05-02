import React from 'react'

const AdvertiserPanel = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Advertiser Dashboard</h1>

      <div className="bg-gray-100 dark:bg-gray-900 p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Campaign Status</h2>
        <p>Status: <span className="text-green-600 font-bold">Active</span></p>
        <p>Plan: Standard — $40/month or €37/month</p>
        <p>Start Date: June 1</p>
        <p>End Date: June 30</p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Performance</h2>
        <p>Estimated Plays: 2,300</p>
        <p>Daily Frequency: 10 ads per day</p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-2">Send Your Ad</h2>

        <input type="file" className="mb-3 block" />

        <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
          Upload
        </button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">Support</h2>

        <a
          href="https://wa.me/5521971099200"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Contact via WhatsApp
        </a>
      </div>
    </div>
  )
}

export default AdvertiserPanel
import React from 'react'

const AdvertiserPanel = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Advertiser Dashboard
      </h1>

      <div className="bg-gray-100 p-5 rounded-xl mb-6">
        <h2 className="font-semibold mb-2">Campaign Status</h2>
        <p>Status: <span className="text-green-600 font-bold">Active</span></p>
        <p>Plan: Standard ($40/month)</p>
        <p>Start: June 1</p>
        <p>End: June 30</p>
      </div>

      <div className="bg-gray-100 p-5 rounded-xl mb-6">
        <h2 className="font-semibold mb-2">Performance</h2>
        <p>Estimated Plays: 2,300</p>
        <p>Frequency: 10x daily</p>
      </div>

      <div className="bg-gray-100 p-5 rounded-xl mb-6">
        <h2 className="font-semibold mb-2">Upload Ad</h2>
        <input type="file" className="mb-3" />
        <button className="bg-yellow-500 px-4 py-2 rounded">
          Upload
        </button>
      </div>

      <div className="bg-gray-100 p-5 rounded-xl">
        <h2 className="font-semibold mb-2">Support</h2>
        <a href="https://wa.me/5521971099200" className="text-blue-500">
          Contact via WhatsApp
        </a>
      </div>

    </div>
  )
}

export default AdvertiserPanel
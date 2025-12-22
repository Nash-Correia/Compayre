'use client';

import React, { useState, useCallback } from 'react';
import Dropdown from '@/components/Dropdown';

interface DropdownOption {
  id: string | number;
  label: string;
}

const DropdownDemoPage = () => {
  // Example data - Objects
  const countryOptions: DropdownOption[] = [
    { id: 1, label: 'United States' },
    { id: 2, label: 'Canada' },
    { id: 3, label: 'United Kingdom' },
    { id: 4, label: 'Australia' },
    { id: 5, label: 'Germany' },
    { id: 6, label: 'France' },
    { id: 7, label: 'Japan' },
    { id: 8, label: 'Brazil' },
  ];

  const skillOptions: DropdownOption[] = [
    { id: 1, label: 'React' },
    { id: 2, label: 'Vue.js' },
    { id: 3, label: 'Angular' },
    { id: 4, label: 'TypeScript' },
    { id: 5, label: 'Python' },
    { id: 6, label: 'Node.js' },
    { id: 7, label: 'GraphQL' },
    { id: 8, label: 'PostgreSQL' },
  ];

  const tagOptions: DropdownOption[] = [
    { id: 1, label: 'Important' },
    { id: 2, label: 'Urgent' },
    { id: 3, label: 'Follow Up' },
    { id: 4, label: 'Archive' },
  ];

  // Example data - Simple strings
  const fruitStrings = ['Apple', 'Banana', 'Orange', 'Mango', 'Strawberry', 'Blueberry'];

  // Example data - Simple numbers
  const ageNumbers = [18, 25, 30, 35, 40, 45, 50, 55, 60];

  // State for object-based dropdowns
  const [singleCountry, setSingleCountry] = useState<string | number | null>(null);
  const [multiSkills, setMultiSkills] = useState<(string | number)[]>([]);
  const [multiTags, setMultiTags] = useState<(string | number)[]>([]);

  // State for string-based dropdowns
  const [selectedFruit, setSelectedFruit] = useState<string | number | null>(null);
  const [selectedFruits, setSelectedFruits] = useState<(string | number)[]>([]);

  // State for number-based dropdown
  const [selectedAge, setSelectedAge] = useState<string | number | null>(null);
  const [selectedAges, setSelectedAges] = useState<(string | number)[]>([]);

  // Memoized callbacks to prevent re-renders
  const handleCountryChange = useCallback((value: string | number | (string | number)[] | null) => {
    if (typeof value === 'string' || typeof value === 'number') {
      setSingleCountry(value);
    } else {
      setSingleCountry(null);
    }
  }, []);

  const handleSkillsChange = useCallback((value: string | number | (string | number)[] | null) => {
    if (Array.isArray(value)) {
      setMultiSkills(value);
    } else {
      setMultiSkills([]);
    }
  }, []);

  const handleFruitsChange = useCallback((value: string | number | (string | number)[] | null) => {
    if (Array.isArray(value)) {
      setSelectedFruits(value);
    } else {
      setSelectedFruits([]);
    }
  }, []);

  const handleAgeChange = useCallback((value: string | number | (string | number)[] | null) => {
    if (typeof value === 'string' || typeof value === 'number') {
      setSelectedAge(value);
    } else {
      setSelectedAge(null);
    }
  }, []);

  const handleFruitChange = useCallback((value: string | number | (string | number)[] | null) => {
    if (typeof value === 'string' || typeof value === 'number') {
      setSelectedFruit(value);
    } else {
      setSelectedFruit(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dropdown Component Demo</h1>
        <p className="text-gray-600 mb-12">
          Showcase of a versatile dropdown component with object/string/number support, single/multi-select, search, and callbacks
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Single Select with Objects */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Single Select (Objects)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Traditional dropdown with object-based options
            </p>

            <Dropdown
              options={countryOptions}
              placeholder="Select a country..."
              isMultiSelect={false}
              isSearchable={true}
              onSelectionChange={(value) => {
                if (typeof value === 'string' || typeof value === 'number') {
                  setSingleCountry(value);
                } else {
                  setSingleCountry(null);
                }
              }}
              showSelectAll={false}
              showReset={false}
            />

            {singleCountry !== null && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600">
                  Selected Value: <span className="font-monospace font-semibold text-blue-600">{singleCountry}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  (Type: {typeof singleCountry})
                </p>
              </div>
            )}
          </div>

          {/* Multi Select with Strings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Multi-Select (Strings)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Pass raw strings directly. Component handles conversion internally.
            </p>

            <Dropdown
              options={fruitStrings}
              placeholder="Select fruits..."
              isMultiSelect={true}
              isSearchable={true}
              onSelectionChange={(value) => {
                if (Array.isArray(value)) {
                  setSelectedFruits(value);
                } else {
                  setSelectedFruits([]);
                }
              }}
              showSelectAll={true}
              showReset={true}
            />

            {selectedFruits.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">
                  Selected Values ({selectedFruits.length}):
                </p>
                <div className="space-y-1">
                  {selectedFruits.map((fruit, idx) => (
                    <p key={idx} className="text-sm font-monospace text-green-700">
                      {idx + 1}. "{fruit}" (type: {typeof fruit})
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Single Select with Numbers */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Single Select (Numbers)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Pass raw numbers. Returns the number value, not a string.
            </p>

            <Dropdown
              options={ageNumbers}
              placeholder="Select an age..."
              isMultiSelect={false}
              isSearchable={true}
              onSelectionChange={(value) => {
                if (typeof value === 'string' || typeof value === 'number') {
                  setSelectedAge(value);
                } else {
                  setSelectedAge(null);
                }
              }}
              showSelectAll={false}
              showReset={true}
            />

            {selectedAge !== null && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">
                  Selected Value: <span className="font-monospace font-semibold text-purple-600">{selectedAge}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Type: <code className="bg-purple-100 px-1 rounded">{typeof selectedAge}</code>
                </p>
              </div>
            )}
          </div>

          {/* Multi Select with Objects */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Multi-Select (Objects)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Object-based options with full control and search.
            </p>

            <Dropdown
              options={skillOptions}
              placeholder="Select skills..."
              isMultiSelect={true}
              isSearchable={true}
              onSelectionChange={(value) => {
                if (Array.isArray(value)) {
                  setMultiSkills(value);
                } else {
                  setMultiSkills([]);
                }
              }}
              showSelectAll={true}
              showReset={true}
            />

            {multiSkills.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">
                  Selected Values ({multiSkills.length}):
                </p>
                <div className="space-y-1">
                  {multiSkills.map((skill, idx) => (
                    <p key={idx} className="text-sm text-blue-700">
                      {idx + 1}. {skill}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Single Select Strings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Single Select (Strings)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Simple string array with search and reset.
            </p>

            <Dropdown
              options={fruitStrings}
              placeholder="Pick a fruit..."
              isMultiSelect={false}
              isSearchable={true}
              onSelectionChange={(value) => {
                if (typeof value === 'string' || typeof value === 'number') {
                  setSelectedFruit(value);
                } else {
                  setSelectedFruit(null);
                }
              }}
              showSelectAll={false}
              showReset={true}
            />

            {selectedFruit !== null && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-gray-600">
                  Selected: <span className="font-monospace font-semibold text-amber-600">"{selectedFruit}"</span>
                </p>
              </div>
            )}
          </div>

          {/* Disabled Dropdown */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Disabled State</h2>
            <p className="text-sm text-gray-600 mb-4">
              Dropdown in disabled state. Cannot interact with it.
            </p>

            <Dropdown
              options={fruitStrings}
              placeholder="This is disabled..."
              isMultiSelect={false}
              isSearchable={true}
              disabled={true}
            />

            <p className="mt-4 text-sm text-gray-500 italic">
              Use the <code className="bg-gray-100 px-2 py-1 rounded">disabled</code> prop
            </p>
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Input</h3>
              <p className="text-sm text-gray-600">
                Pass objects, strings, or numbers. The component automatically converts them.
              </p>
              <code className="block bg-gray-100 px-2 py-1 rounded text-xs mt-2 text-gray-700">
                {`options={['Apple', 'Banana']}`}
              </code>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Smart Callbacks</h3>
              <p className="text-sm text-gray-600">
                Returns actual values (not objects). Works with any data type.
              </p>
              <code className="block bg-gray-100 px-2 py-1 rounded text-xs mt-2 text-gray-700">
                onSelectionChange={"(value) => ..."}
              </code>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Toggleable Features</h3>
              <p className="text-sm text-gray-600">
                Toggle single/multi, search, select all, and reset on/off as needed.
              </p>
              <code className="block bg-gray-100 px-2 py-1 rounded text-xs mt-2 text-gray-700">
                isMultiSelect={'{true}'}
              </code>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Example: API Integration</h4>
            <pre className="text-xs text-blue-800 overflow-x-auto bg-white p-3 rounded border border-blue-100">
              {`// Fetch countries from API
const [countries, setCountries] = useState<string[]>([]);

useEffect(() => {
  fetch('/api/countries')
    .then(res => res.json())
    .then(data => setCountries(data));
}, []);

// Use in dropdown - handles strings automatically!
<Dropdown
  options={countries}  // Just pass the array
  onSelectionChange={(selected) => {
    console.log('Selected:', selected);
    console.log('Type:', typeof selected);
  }}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownDemoPage;

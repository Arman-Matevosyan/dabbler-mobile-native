export const darkMapStyle = [
  // Base map background
  {
    elementType: 'geometry',
    stylers: [{color: '#2E3742'}], // Midnight
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{color: '#1A2632'}], // Deep blue-gray
  },

  // Labels styling
  {
    elementType: 'labels.text.fill',
    stylers: [{color: '#8C9BB0'}], // Grey Dark
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{color: '#2E3742'}], // Midnight
  },

  // Roads styling
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{color: '#38414E'}], // Dark slate
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212A37'}], // Darker gray
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{color: '#337BE2'}], // Respect Blue
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1A60C3'}], // Darker Respect Blue
  },

  // Parks styling
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#1D8F6D'}], // Freedom Green
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#93DBC5'}], // Light Freedom Green
  },

  // Water bodies styling
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#161E21'}], // Dark teal
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#3D3D3D'}], // Gray
  },

  // Points of Interest styling
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{color: '#2B2B2B'}], // Dark gray
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#8C9BB0'}], // Grey Dark
  },

  // Administrative areas styling
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{color: '#8C9BB0'}], // Grey Dark
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{color: '#FFFFFF'}], // White Pure
  },
];

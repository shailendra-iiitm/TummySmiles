/**
 * Calculate the distance between two points on Earth using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point  
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Find the nearest agents to a donation location
 * @param {Object} donationLocation - {lat, lng} of donation
 * @param {Array} agents - Array of agent objects with location property
 * @param {number} maxResults - Maximum number of agents to return (default: 5)
 * @returns {Array} Array of agents sorted by distance with distance property added
 */
function findNearestAgents(donationLocation, agents, maxResults = 5) {
  if (!donationLocation || !donationLocation.lat || !donationLocation.lng) {
    return [];
  }
  
  // Filter agents that have location data and calculate distances
  const agentsWithDistance = agents
    .filter(agent => agent.location && agent.location.lat && agent.location.lng)
    .map(agent => {
      const distance = calculateDistance(
        donationLocation.lat,
        donationLocation.lng,
        agent.location.lat,
        agent.location.lng
      );
      
      return {
        ...agent.toObject ? agent.toObject() : agent,
        distance: distance
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);
    
  return agentsWithDistance;
}

module.exports = {
  calculateDistance,
  findNearestAgents
};

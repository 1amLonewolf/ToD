// Apify Service - Handles communication with Apify API
class ApifyService {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseUrl = 'https://api.apify.com/v2';
  }
  
  // Fetch dataset items from a specific run
  async fetchDatasetItems(datasetId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/datasets/${datasetId}/items?token=${this.apiToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dataset: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dataset from Apify:', error);
      throw error;
    }
  }
  
  // Run an actor and get results
  async runActor(actorId, input = {}) {
    try {
      // Start the actor run
      const startResponse = await fetch(
        `${this.baseUrl}/acts/${actorId}/runs?token=${this.apiToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(input)
        }
      );
      
      if (!startResponse.ok) {
        throw new Error(`Failed to start actor: ${startResponse.status}`);
      }
      
      const runData = await startResponse.json();
      const runId = runData.data.id;
      
      // Wait for the run to complete
      let runStatus;
      do {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
        const statusResponse = await fetch(
          `${this.baseUrl}/acts/${actorId}/runs/${runId}?token=${this.apiToken}`
        );
        
        if (!statusResponse.ok) {
          throw new Error(`Failed to check run status: ${statusResponse.status}`);
        }
        
        const statusData = await statusResponse.json();
        runStatus = statusData.data.status;
      } while (runStatus !== 'SUCCEEDED' && runStatus !== 'FAILED');
      
      if (runStatus === 'FAILED') {
        throw new Error('Actor run failed');
      }
      
      // Get the dataset ID and fetch results
      const datasetId = runData.data.defaultDatasetId;
      return await this.fetchDatasetItems(datasetId);
    } catch (error) {
      console.error('Error running actor on Apify:', error);
      throw error;
    }
  }
  
  // Get last run dataset items
  async getLastRunDataset(actorId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/acts/${actorId}/runs/last/dataset/items?token=${this.apiToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch last run dataset: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching last run dataset from Apify:', error);
      throw error;
    }
  }
}

// Export the service
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApifyService;
} else {
  window.ApifyService = ApifyService;
}
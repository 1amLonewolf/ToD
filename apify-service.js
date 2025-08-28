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
      console.log(`Running actor ${actorId} with input:`, input);
      
      // Start the actor run
      const startResponse = await fetch(
        `${this.baseUrl}/acts/${actorId}/runs?token=${this.apiToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...input
          })
        }
      );
      
      if (!startResponse.ok) {
        const errorText = await startResponse.text();
        throw new Error(`Failed to start actor: ${startResponse.status} - ${errorText}`);
      }
      
      const runData = await startResponse.json();
      const runId = runData.data.id;
      
      // Wait for the run to complete (with timeout)
      let runStatus;
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds timeout
      
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
        
        attempts++;
        console.log(`Actor run status: ${runStatus} (attempt ${attempts}/${maxAttempts})`);
        
        if (attempts >= maxAttempts) {
          throw new Error('Actor run timed out');
        }
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
  
  // Fetch content based on level and type
  async fetchContentByLevel(actorId, level, type) {
    try {
      // Try to run the actor with specific parameters
      const input = {
        level: level,
        type: type
      };
      
      console.log(`Fetching ${type} content for level ${level}`);
      const result = await this.runActor(actorId, input);
      console.log(`Received result:`, result);
      
      // Process the result based on expected format
      if (result && Array.isArray(result)) {
        // If result is an array, extract text/question fields
        return result.map(item => 
          item.question || item.text || item.content || item.dare || JSON.stringify(item)
        ).filter(text => text && text.trim());
      } else if (result && result.items && Array.isArray(result.items)) {
        // If result has items array
        return result.items.map(item => 
          item.question || item.text || item.content || item.dare || JSON.stringify(item)
        ).filter(text => text && text.trim());
      } else {
        // Fallback to string representation
        console.warn('Unexpected result format:', result);
        return [JSON.stringify(result)];
      }
    } catch (error) {
      console.error(`Error fetching ${type} content for level ${level}:`, error);
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
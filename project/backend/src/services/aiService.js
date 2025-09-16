import axios from 'axios';
import logger from '../utils/logger.js';

class AIService {
  constructor() {
    this.apiUrl = process.env.AI_API_URL;
    this.apiKey = process.env.AI_API_KEY;
    
    // Department mapping
    this.departmentMapping = {
      'water_leakage': 'Department of Drinking Water and Sanitation',
      'garbage_dump': 'Department of Urban Development & Housing',
      'road_damage': 'Department of Road Construction',
      'streetlight': 'Department of Urban Development & Housing',
      'health_hazard': 'Department of Health, Medical Education & Family Welfare',
      'traffic_signal': 'Department of Transport',
      'other': 'General Administration Department'
    };

    this.priorityMapping = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1
    };
  }

  async classifyIssue(imageUrl, location, description) {
    try {
      const payload = {
        image_url: imageUrl,
        location: {
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString()
        },
        description: description,
        context: 'civic_issue_classification'
      };

      logger.info('Sending classification request to AI service', { payload });

      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });

      const classification = this.processAIResponse(response.data);
      logger.info('AI classification completed', { classification });

      return classification;
    } catch (error) {
      logger.error('AI classification failed', { error: error.message });
      
      // Fallback classification based on keywords in description
      return this.fallbackClassification(description);
    }
  }

  processAIResponse(aiResponse) {
    return {
      issue_type: aiResponse.issue_type || 'other',
      severity: aiResponse.severity || 'medium',
      recommended_department: aiResponse.recommended_department || 
        this.departmentMapping[aiResponse.issue_type] || 
        this.departmentMapping['other'],
      confidence: aiResponse.confidence || 0.5,
      ai_notes: aiResponse.notes || ''
    };
  }

  fallbackClassification(description) {
    const lowerDesc = description.toLowerCase();
    
    // Simple keyword-based classification
    if (lowerDesc.includes('water') || lowerDesc.includes('leak') || lowerDesc.includes('pipe')) {
      return {
        issue_type: 'water_leakage',
        severity: 'high',
        recommended_department: this.departmentMapping['water_leakage'],
        confidence: 0.7,
        ai_notes: 'Classified using fallback keyword matching'
      };
    }
    
    if (lowerDesc.includes('garbage') || lowerDesc.includes('trash') || lowerDesc.includes('waste')) {
      return {
        issue_type: 'garbage_dump',
        severity: 'medium',
        recommended_department: this.departmentMapping['garbage_dump'],
        confidence: 0.6,
        ai_notes: 'Classified using fallback keyword matching'
      };
    }
    
    if (lowerDesc.includes('road') || lowerDesc.includes('pothole') || lowerDesc.includes('street')) {
      return {
        issue_type: 'road_damage',
        severity: 'medium',
        recommended_department: this.departmentMapping['road_damage'],
        confidence: 0.6,
        ai_notes: 'Classified using fallback keyword matching'
      };
    }
    
    if (lowerDesc.includes('light') || lowerDesc.includes('lamp') || lowerDesc.includes('dark')) {
      return {
        issue_type: 'streetlight',
        severity: 'low',
        recommended_department: this.departmentMapping['streetlight'],
        confidence: 0.5,
        ai_notes: 'Classified using fallback keyword matching'
      };
    }

    // Default classification
    return {
      issue_type: 'other',
      severity: 'medium',
      recommended_department: this.departmentMapping['other'],
      confidence: 0.3,
      ai_notes: 'Default classification - manual review recommended'
    };
  }

  calculatePriority(severity, location, description) {
    let priority = this.priorityMapping[severity.toLowerCase()] || 2;
    
    // Boost priority for certain keywords
    const urgentKeywords = ['emergency', 'urgent', 'dangerous', 'accident', 'injury'];
    const lowerDesc = description.toLowerCase();
    
    if (urgentKeywords.some(keyword => lowerDesc.includes(keyword))) {
      priority = Math.min(priority + 1, 4);
    }
    
    // Convert back to string
    const priorityMap = { 1: 'low', 2: 'medium', 3: 'high', 4: 'critical' };
    return priorityMap[priority];
  }
}

export default new AIService();
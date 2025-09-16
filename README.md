# Nivaranai Backend System

A cloud-native complaint management backend for the Nivaranai mobile application, built with Flask and deployed on AWS.

## 🚀 Features

- **AI-Powered Classification**: Uses Perplexity AI to automatically classify complaints and suggest solutions
- **Department Routing**: Automatically routes complaints to appropriate departments via SQS queues
- **Scalable Architecture**: Built on AWS ECS with Application Load Balancer for high availability
- **Document Storage**: Uses AWS DocumentDB for reliable data persistence
- **Real-time Processing**: Department workers process complaints asynchronously

## 🏗️ Architecture

```
Mobile App → ALB → ECS (Flask API) → Perplexity AI
                          ↓
              DocumentDB ← SQS Queues → Department Workers
```

## 🛠️ Quick Start

### Prerequisites
- AWS Account with CLI configured
- Docker installed
- Python 3.9+
- Perplexity API key

### 1. Setup Environment
```bash
git clone <repository>
cd nivaranai-backend
cp .env.example .env
# Fill in your API keys and AWS configuration
```

### 2. Deploy to AWS
```bash
chmod +x deploy.sh
./deploy.sh
```

### 3. Test the API
```bash
python test_api.py http://YOUR_ALB_DNS_NAME
```

### 4. Run Department Workers
```bash
python department_worker.py water
python department_worker.py electricity
# ... for other departments
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/submit-complaint` | Submit new complaint |
| GET | `/complaint/{id}` | Get complaint status |
| GET | `/complaints/user/{id}` | Get user complaints |
| GET | `/departments/{dept}/queue-status` | Department queue status |

## 📝 API Usage

### Submit Complaint
```bash
POST /submit-complaint
{
  "complaint_text": "Water leak on Main Street",
  "image": "base64_encoded_image_data",
  "location": "Main Street, Downtown", 
  "user_id": "user123"
}
```

### Response
```json
{
  "complaint_id": "uuid-generated-id",
  "status": "submitted",
  "department": "water",
  "estimated_resolution_time": "2-3 business days",
  "urgency_level": "medium",
  "timestamp": "2025-09-17T10:30:00Z"
}
```

## 🏢 Departments

The system supports these departments:
- **Water** - Water supply, leaks, quality issues
- **Electricity** - Power outages, electrical hazards
- **Roads** - Potholes, traffic signals, maintenance
- **Waste Management** - Garbage collection, cleanliness
- **Street Lights** - Non-functioning lights, electrical issues
- **Public Transport** - Bus stops, route issues
- **General** - Other municipal issues

## 🔧 Configuration

### Environment Variables
```bash
# Perplexity API
PERPLEXITY_API_KEY=your_api_key

# AWS DocumentDB
DOCUMENTDB_HOST=your-cluster-endpoint
DOCUMENTDB_USERNAME=username
DOCUMENTDB_PASSWORD=password

# AWS Settings
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Department Queues (auto-populated by deploy script)
WATER_DEPT_QUEUE_URL=https://sqs.../water-queue
ELECTRICITY_DEPT_QUEUE_URL=https://sqs.../electricity-queue
# ... etc
```

## 🐳 Local Development

### Using Docker
```bash
docker-compose up
```

### Using Python
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## 📊 Monitoring

The system includes CloudWatch integration for:
- API response times and error rates
- DocumentDB performance metrics
- SQS queue depths and processing times
- ECS resource utilization

## 💰 Estimated Costs

Monthly AWS costs (US East):
- DocumentDB: $80-120
- ECS Fargate: $30-50  
- Application Load Balancer: $20-25
- SQS + other services: $5-10
- **Total: ~$135-205/month**

## 🔒 Security Features

- IAM roles with least privilege access
- VPC isolation for backend services
- Encrypted data storage and transmission
- API rate limiting and validation
- Secure secrets management

## 📈 Scaling

The system supports:
- **Horizontal scaling**: Auto-scaling ECS tasks based on load
- **Queue-based processing**: Asynchronous complaint processing
- **Multi-region deployment**: For disaster recovery
- **Caching**: Redis integration for improved performance

## 🧪 Testing

Run the test suite:
```bash
python test_api.py http://localhost:5000  # Local testing
python test_api.py http://your-alb-dns   # Production testing
```

## 📚 Documentation

- [Implementation Guide](IMPLEMENTATION_GUIDE.md) - Detailed setup instructions
- [API Documentation](docs/api.md) - Complete API reference
- [Architecture Guide](docs/architecture.md) - System design details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the [Implementation Guide](IMPLEMENTATION_GUIDE.md)
2. Review CloudWatch logs
3. Open an issue on GitHub
4. Contact the development team

---

Built with ❤️ for better municipal services

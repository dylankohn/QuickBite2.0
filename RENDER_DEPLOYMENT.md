# Render Deployment Guide for QuickBite Backend

This guide explains how to deploy the QuickBite backend to Render cloud service.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. An Ollama service or API endpoint accessible from the internet

## Deployment Options

### Option 1: Using render.yaml (Recommended)

1. **Connect Repository**: 
   - Go to your Render dashboard
   - Click "New +" and select "Blueprint"
   - Connect your repository containing this project.

2. **Configure Environment Variables**:
   The `render.yaml` file is already configured, but you'll need to update:
   - `OLLAMA_URL`: Replace with your hosted Ollama service URL
   - `MODEL_NAME`: Confirm the model you want to use

3. **Deploy**: 
   - Render will automatically detect the `render.yaml` file
   - Review the configuration and click "Apply"

### Option 2: Manual Web Service Creation

1. **Create Web Service**:
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure Service**:
   - **Name**: `quickbite-backend`
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

3. **Environment Variables**:
   Add the following environment variables in Render dashboard:
   ```
   NODE_ENV=production
   OLLAMA_URL=https://your-ollama-service-url.com
   MODEL_NAME=llama3.2:3b
   ```

4. **Advanced Settings**:
   - **Health Check Path**: `/api/health`
   - **Node Version**: 18 or higher

## Important Notes

### Ollama Service Setup

Since Render doesn't natively support Ollama, you have several options:

1. **External Ollama Service**: 
   - Use a service like Replicate, Hugging Face, or host Ollama on another cloud provider
   - Update `OLLAMA_URL` to point to your external service

2. **Alternative LLM APIs**:
   - Consider modifying the code to use OpenAI, Anthropic, or other API providers
   - This may require code changes in `server.js`

3. **Self-hosted Ollama**:
   - Host Ollama on a VPS or dedicated server
   - Ensure it's accessible via HTTPS with proper CORS configuration

### Environment Configuration

The application will use environment variables in this priority:
1. Render environment variables (production)
2. `.env` file (local development)
3. Default values in code

### Health Checks

The application includes a health check endpoint at `/api/health` that Render will use to monitor service health.

### Scaling and Performance

- **Free Tier**: Limited to 512MB RAM and sleeps after 15 minutes of inactivity
- **Paid Plans**: Better performance and no sleep mode
- Consider caching strategies for LLM responses if using paid API services

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Ensure `package.json` is in the `backend/` directory
   - Check Node.js version compatibility

2. **Health Check Failures**:
   - Verify the `/api/health` endpoint is accessible
   - Check server logs for startup errors

3. **Ollama Connection Issues**:
   - Verify `OLLAMA_URL` is correct and accessible
   - Check if the external Ollama service allows CORS requests
   - Ensure the model specified in `MODEL_NAME` is available

### Viewing Logs

- Go to your service in Render dashboard
- Click on "Logs" to view real-time application logs
- Use logs to debug deployment and runtime issues

## Cost Considerations

- **Free Tier**: $0/month, but with limitations
- **Starter Plan**: $7/month for better performance
- **External LLM APIs**: Additional costs based on usage

Consider implementing request caching and rate limiting to control costs when using external LLM services.

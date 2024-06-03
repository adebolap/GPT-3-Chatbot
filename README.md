## GPT-3 Chatbot

### Description
A conversational AI chatbot using OpenAI's GPT-3 model. This chatbot can answer questions, provide recommendations, and simulate conversations on various topics.

### Technologies
- Python
- OpenAI GPT-3
- Flask

### Setup and Run
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/GPT-3-Chatbot.git
   cd GPT-3-Chatbot

2. Create and activate a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt

4. Set Up OpenAI API key: Create a '.env' file and add your OpenAI API key:
   ```makefile
   OPENAI_API_KEY=your_openai_api_key

5. Run the chatbot
    ```bash
   python app.py

Usage
Access the chatbot through http://localhost:5000.
Type your queries and interact with the GPT-3 powered chatbot.

# How to duplicate (make sure muna na nasa tamang directory ka)

# 1. Create new environment (if you haven't already)
python -m venv venv

# 2. Activate virtual environment
# Using cmd
venv\Scripts\activate.bat

# Using PowerShell
.\venv\Scripts\Activate.ps1

# After activation, you'll see (venv) at the beginning of your command prompt, indicating that the virtual environment is active.

# 3. Then,  install the requirements:
pip install -r requirements.txt

# 4. Run flask
python app.py

# Note: If you get a PowerShell execution policy error when trying to activate the virtual environment, you may need to run PowerShell as administrator and execute:

Set-ExecutionPolicy RemoteSigned
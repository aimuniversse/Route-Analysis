import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/accounts"

def test_registration():
    url = f"{BASE_URL}/register/"
    data = {
        "username": "testuser",
        "name": "Test User",
        "travels_name": "Test Travels",
        "phone_number": "9876543210",
        "email": "test@example.com",
        "place": "Test City",
        "password": "password123",
        "confirm_password": "password123"
    }
    response = requests.post(url, json=data)
    print(f"Registration Status: {response.status_code}")
    print(f"Registration Response: {response.json()}")
    return response.json()

def test_login(identifier):
    url = f"{BASE_URL}/login/"
    data = {
        "identifier": identifier,
        "password": "password123"
    }
    response = requests.post(url, json=data)
    print(f"Login Status ({identifier}): {response.status_code}")
    print(f"Login Response: {response.json()}")
    return response.json()

def test_profile(access_token):
    url = f"{BASE_URL}/profile/"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    print(f"Profile Status: {response.status_code}")
    print(f"Profile Response: {response.json()}")

if __name__ == "__main__":
    try:
        # 1. Register
        reg_data = test_registration()
        
        # 2. Login via Email
        login_data_email = test_login("test@example.com")
        
        # 3. Login via Phone
        login_data_phone = test_login("9876543210")
        
        # 4. Access Profile
        if 'access' in login_data_email:
            test_profile(login_data_email['access'])
            
    except Exception as e:
        print(f"Error: {e}")

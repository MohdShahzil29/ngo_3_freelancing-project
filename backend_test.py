import requests
import sys
import json
from datetime import datetime

class NGOAPITester:
    def __init__(self, base_url="https://ngoboost.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        self.test_user_data = {
            "name": "Test User",
            "email": self.test_user_email,
            "phone": "9876543210",
            "password": "Test@123"
        }

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")

    def make_request(self, method, endpoint, data=None, auth_required=False):
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=10)
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")
            return None

    def test_root_endpoint(self):
        """Test root API endpoint"""
        response = self.make_request('GET', '')
        if response and response.status_code == 200:
            data = response.json()
            success = "Star Marketing NGO API" in data.get('message', '')
            self.log_test("Root Endpoint", success, f"Status: {response.status_code}")
            return success
        else:
            self.log_test("Root Endpoint", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        response = self.make_request('GET', 'stats')
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ['total_members', 'total_donations', 'total_amount', 'total_beneficiaries', 'total_campaigns']
            success = all(field in data for field in required_fields)
            self.log_test("Stats Endpoint", success, f"Fields: {list(data.keys())}")
            return success, data
        else:
            self.log_test("Stats Endpoint", False, f"Status: {response.status_code if response else 'No response'}")
            return False, {}

    def test_public_endpoints(self):
        """Test public endpoints that don't require auth"""
        endpoints = ['news', 'campaigns', 'events']
        results = {}
        
        for endpoint in endpoints:
            response = self.make_request('GET', endpoint)
            if response and response.status_code == 200:
                data = response.json()
                success = isinstance(data, list)
                self.log_test(f"Public {endpoint.title()} Endpoint", success, f"Count: {len(data)}")
                results[endpoint] = data
            else:
                self.log_test(f"Public {endpoint.title()} Endpoint", False, f"Status: {response.status_code if response else 'No response'}")
                results[endpoint] = []
        
        return results

    def test_user_registration(self):
        """Test user registration"""
        response = self.make_request('POST', 'auth/register', self.test_user_data)
        if response and response.status_code == 200:
            data = response.json()
            success = 'token' in data and 'user' in data
            if success:
                self.token = data['token']
            self.log_test("User Registration", success, f"User ID: {data.get('user', {}).get('id', 'N/A')}")
            return success
        else:
            self.log_test("User Registration", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": self.test_user_email,
            "password": "Test@123"
        }
        response = self.make_request('POST', 'auth/login', login_data)
        if response and response.status_code == 200:
            data = response.json()
            success = 'token' in data and 'user' in data
            if success:
                self.token = data['token']
            self.log_test("User Login", success, f"Role: {data.get('user', {}).get('role', 'N/A')}")
            return success
        else:
            self.log_test("User Login", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_auth_me(self):
        """Test get current user endpoint"""
        response = self.make_request('GET', 'auth/me', auth_required=True)
        if response and response.status_code == 200:
            data = response.json()
            success = 'email' in data and data['email'] == self.test_user_email
            self.log_test("Auth Me Endpoint", success, f"Email: {data.get('email', 'N/A')}")
            return success
        else:
            self.log_test("Auth Me Endpoint", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_contact_enquiry(self):
        """Test contact form submission"""
        enquiry_data = {
            "name": "Test Contact",
            "email": "contact@test.com",
            "phone": "9999999999",
            "message": "This is a test enquiry message"
        }
        response = self.make_request('POST', 'enquiries', enquiry_data)
        if response and response.status_code == 200:
            data = response.json()
            success = 'message' in data and 'successfully' in data['message'].lower()
            self.log_test("Contact Enquiry", success, f"Response: {data.get('message', 'N/A')}")
            return success
        else:
            self.log_test("Contact Enquiry", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_donation_order_creation(self):
        """Test donation order creation (will fail due to Razorpay config, but should return proper error)"""
        donation_data = {
            "donor_name": "Test Donor",
            "donor_email": "donor@test.com",
            "donor_phone": "9999999999",
            "amount": 1000,
            "purpose": "General Donation"
        }
        response = self.make_request('POST', 'donations/create-order', donation_data)
        
        # Expected to fail with 500 due to Razorpay not configured
        if response and response.status_code == 500:
            data = response.json()
            success = 'Payment gateway not configured' in data.get('detail', '')
            self.log_test("Donation Order Creation", success, "Expected failure - Razorpay not configured")
            return success
        else:
            self.log_test("Donation Order Creation", False, f"Unexpected status: {response.status_code if response else 'No response'}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting NGO API Testing...")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)

        # Test basic connectivity
        if not self.test_root_endpoint():
            print("❌ Root endpoint failed - stopping tests")
            return False

        # Test public endpoints
        print("\n📊 Testing Public Endpoints...")
        self.test_stats_endpoint()
        self.test_public_endpoints()
        self.test_contact_enquiry()

        # Test authentication flow
        print("\n🔐 Testing Authentication...")
        if self.test_user_registration():
            self.test_auth_me()
        
        # Test login separately (in case registration failed)
        self.test_user_login()
        if self.token:
            self.test_auth_me()

        # Test donation flow (expected to fail gracefully)
        print("\n💰 Testing Donation Flow...")
        self.test_donation_order_creation()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📈 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = NGOAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
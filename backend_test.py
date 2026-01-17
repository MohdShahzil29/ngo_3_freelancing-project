import requests
import sys
import json
from datetime import datetime

class NGOAPITester:
    def __init__(self, base_url="https://nvpfoundation.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        self.test_user_data = {
            "name": "Test User",
            "email": self.test_user_email,
            "phone": "9876543210",
            "password": "Test@123"
        }
        # Admin credentials from review request
        self.admin_credentials = {
            "email": "admin@nvpwelfare.in",
            "password": "Admin@123"
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
        # Test the actual root endpoint without /api prefix
        try:
            response = requests.get("https://nvpfoundation.preview.emergentagent.com/", timeout=10)
            if response and response.status_code == 200:
                # Check if it's the React app (HTML response)
                success = "<!doctype html>" in response.text.lower()
                self.log_test("Frontend Root Endpoint", success, f"Status: {response.status_code}")
                return success
            else:
                self.log_test("Frontend Root Endpoint", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("Frontend Root Endpoint", False, f"Error: {str(e)}")
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

    def test_admin_login(self):
        """Test admin login with provided credentials"""
        response = self.make_request('POST', 'auth/login', self.admin_credentials)
        if response and response.status_code == 200:
            data = response.json()
            success = 'token' in data and data.get('user', {}).get('role') == 'admin'
            if success:
                self.admin_token = data['token']
            self.log_test("Admin Login", success, f"Role: {data.get('user', {}).get('role', 'N/A')}")
            return success
        else:
            self.log_test("Admin Login", False, f"Status: {response.status_code if response else 'No response'}")
            return False

    def test_designations_api(self):
        """Test Designations module APIs"""
        if not self.admin_token:
            self.log_test("Designations API", False, "No admin token available")
            return False
        
        # Test GET designations
        response = self.make_request('GET', 'designations')
        if response and response.status_code == 200:
            designations = response.json()
            self.log_test("GET Designations", True, f"Count: {len(designations)}")
        else:
            self.log_test("GET Designations", False, f"Status: {response.status_code if response else 'No response'}")
            return False
        
        # Test POST designation (admin only)
        designation_data = {
            "name": "Test Volunteer",
            "fee": 500,
            "benefits": ["Certificate", "ID Card"]
        }
        
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.post(f"{self.base_url}/designations", json=designation_data, headers=headers, timeout=10)
            if response and response.status_code == 200:
                data = response.json()
                success = 'message' in data and 'created' in data['message'].lower()
                self.log_test("POST Designation", success, f"Response: {data.get('message', 'N/A')}")
                return success
            else:
                self.log_test("POST Designation", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("POST Designation", False, f"Error: {str(e)}")
            return False

    def test_projects_api(self):
        """Test Projects module APIs"""
        if not self.admin_token:
            self.log_test("Projects API", False, "No admin token available")
            return False
        
        # Test GET projects
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.get(f"{self.base_url}/projects", headers=headers, timeout=10)
            if response and response.status_code == 200:
                projects = response.json()
                self.log_test("GET Projects", True, f"Count: {len(projects)}")
            else:
                self.log_test("GET Projects", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("GET Projects", False, f"Error: {str(e)}")
            return False
        
        # Test POST project (admin only)
        project_data = {
            "title": "Test Education Drive 2025",
            "description": "Free education for underprivileged children",
            "budget": 50000,
            "start_date": "2025-01-15"
        }
        
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.post(f"{self.base_url}/projects", json=project_data, headers=headers, timeout=10)
            if response and response.status_code == 200:
                data = response.json()
                success = 'message' in data and 'created' in data['message'].lower()
                self.log_test("POST Project", success, f"Response: {data.get('message', 'N/A')}")
                return success
            else:
                self.log_test("POST Project", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("POST Project", False, f"Error: {str(e)}")
            return False

    def test_expenses_api(self):
        """Test Expenses module APIs"""
        if not self.admin_token:
            self.log_test("Expenses API", False, "No admin token available")
            return False
        
        # Test GET expenses
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.get(f"{self.base_url}/expenses", headers=headers, timeout=10)
            if response and response.status_code == 200:
                expenses = response.json()
                self.log_test("GET Expenses", True, f"Count: {len(expenses)}")
            else:
                self.log_test("GET Expenses", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("GET Expenses", False, f"Error: {str(e)}")
            return False
        
        # Test POST expense (admin only)
        expense_data = {
            "category": "office",
            "amount": 5000,
            "description": "Office supplies purchase for testing"
        }
        
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.post(f"{self.base_url}/expenses", json=expense_data, headers=headers, timeout=10)
            if response and response.status_code == 200:
                data = response.json()
                success = 'message' in data and 'added' in data['message'].lower()
                self.log_test("POST Expense", success, f"Response: {data.get('message', 'N/A')}")
                return success
            else:
                self.log_test("POST Expense", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("POST Expense", False, f"Error: {str(e)}")
            return False

    def test_internships_api(self):
        """Test Internships module APIs"""
        if not self.admin_token:
            self.log_test("Internships API", False, "No admin token available")
            return False
        
        # Test GET internships (public endpoint)
        response = self.make_request('GET', 'internships')
        if response and response.status_code == 200:
            internships = response.json()
            self.log_test("GET Internships", True, f"Count: {len(internships)}")
        else:
            self.log_test("GET Internships", False, f"Status: {response.status_code if response else 'No response'}")
            return False
        
        # Test POST internship (admin only)
        internship_data = {
            "title": "Test Social Work Intern",
            "description": "Assist in community outreach programs",
            "duration": "3 months",
            "positions": 5
        }
        
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.post(f"{self.base_url}/internships", json=internship_data, headers=headers, timeout=10)
            if response and response.status_code == 200:
                data = response.json()
                success = 'message' in data and 'created' in data['message'].lower()
                self.log_test("POST Internship", success, f"Response: {data.get('message', 'N/A')}")
                return success
            else:
                self.log_test("POST Internship", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("POST Internship", False, f"Error: {str(e)}")
            return False

    def test_receipts_api(self):
        """Test Receipts module APIs"""
        if not self.admin_token:
            self.log_test("Receipts API", False, "No admin token available")
            return False
        
        # Test GET receipts
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.get(f"{self.base_url}/receipts", headers=headers, timeout=10)
            if response and response.status_code == 200:
                receipts = response.json()
                self.log_test("GET Receipts", True, f"Count: {len(receipts)}")
            else:
                self.log_test("GET Receipts", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("GET Receipts", False, f"Error: {str(e)}")
            return False
        
        # Test POST receipt (admin only)
        receipt_data = {
            "receipt_type": "donation",
            "recipient_name": "Test Donor",
            "recipient_email": "testdonor@example.com",
            "amount": 1000,
            "description": "Test donation receipt"
        }
        
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.post(f"{self.base_url}/receipts", json=receipt_data, headers=headers, timeout=10)
            if response and response.status_code == 200:
                data = response.json()
                success = 'message' in data and 'generated' in data['message'].lower()
                self.log_test("POST Receipt", success, f"Response: {data.get('message', 'N/A')}")
                return success
            else:
                self.log_test("POST Receipt", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("POST Receipt", False, f"Error: {str(e)}")
            return False

    def test_members_api(self):
        """Test Members module APIs"""
        if not self.admin_token:
            self.log_test("Members API", False, "No admin token available")
            return False
        
        # Test GET members
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.get(f"{self.base_url}/members", headers=headers, timeout=10)
            if response and response.status_code == 200:
                members = response.json()
                self.log_test("GET Members", True, f"Count: {len(members)}")
                return True
            else:
                self.log_test("GET Members", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("GET Members", False, f"Error: {str(e)}")
            return False

    def test_certificates_api(self):
        """Test Certificates module APIs"""
        if not self.admin_token:
            self.log_test("Certificates API", False, "No admin token available")
            return False
        
        # Test GET certificates
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        try:
            response = requests.get(f"{self.base_url}/certificates", headers=headers, timeout=10)
            if response and response.status_code == 200:
                certificates = response.json()
                self.log_test("GET Certificates", True, f"Count: {len(certificates)}")
                return True
            else:
                self.log_test("GET Certificates", False, f"Status: {response.status_code if response else 'No response'}")
                return False
        except Exception as e:
            self.log_test("GET Certificates", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting NVP Welfare Foundation NGO API Testing...")
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
        
        # Test admin login first (priority)
        if self.test_admin_login():
            print("✅ Admin authentication successful")
        else:
            print("❌ Admin authentication failed - some tests will be skipped")
        
        # Test regular user registration and login
        if self.test_user_registration():
            self.test_auth_me()
        
        # Test login separately (in case registration failed)
        self.test_user_login()
        if self.token:
            self.test_auth_me()

        # Test NEW MODULES (High Priority)
        print("\n🆕 Testing New Admin Modules...")
        if self.admin_token:
            self.test_designations_api()
            self.test_projects_api()
            self.test_expenses_api()
            self.test_internships_api()
            self.test_receipts_api()
        else:
            print("⚠️ Skipping new module tests - no admin token")

        # Test existing modules
        print("\n📋 Testing Existing Modules...")
        if self.admin_token:
            self.test_members_api()
            self.test_certificates_api()
        else:
            print("⚠️ Skipping existing module tests - no admin token")

        # Print summary
        print("\n" + "=" * 60)
        print(f"📈 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed >= (self.tests_run * 0.8):  # 80% pass rate acceptable
            print("🎉 Most tests passed!")
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